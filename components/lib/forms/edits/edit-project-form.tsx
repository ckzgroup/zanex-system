"use client";

import * as React from "react";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";

import { Button, buttonVariants } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/ui/icons";
import {projectEditSchema, projectSchema, segmentSchema} from "@/utils/projects/validations/forms";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { addDays, format } from "date-fns";
import { cn } from "@/lib/utils";
import useAuthStore from "@/hooks/use-user";
import { useState, useEffect } from "react";
import useFetchData, {usePatchData, usePatchProjectData} from "@/actions/use-api";
import {useSingleProject} from "@/actions/get-project";
import Loading from "@/app/(admin)/(projects)/loading";

type FormData = z.infer<typeof projectEditSchema>;

interface IProps {
    projectId: string;
}

function EditProjectForm({projectId}: IProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // @ts-ignore
    const company = useAuthStore((state) => state.user?.result.user_company_id);
    // @ts-ignore
    const user = useAuthStore((state) => state.user?.result.user_id);

    const company_id = company?.toString(); // @ts-ignore
    const user_id = user?.toString();

    // Fetch existing project data
    const { isLoading: projectLoading, error: projectError, data: projectData } =  useSingleProject('/project/getProject', projectId);

    // Check if projectData is defined and has elements
    const project = projectData && projectData.length > 0 ? projectData[0] : null;

    // Generate Project Code
    function generateProjectCode() {
        return "PRO" + Math.floor(100000 + Math.random() * 900000).toString();
    }

    const projectCode = generateProjectCode();

    // Destructure only if project exists
    const {
        customer_name,
        project_certificate_of_workers,
        project_code,
        project_create_date,
        project_created_by,
        project_customer_id,
        project_description,
        project_design,
        project_ehs_file,
        project_end_date,
        project_id,
        project_manager,
        project_manager_id,
        project_name,
        project_permit,
        project_po_file,
        project_region_id,
        project_segment_number,
        project_start_date,
        project_status,
        region_name
    } = project || {};


    // Fetch clients, regions, and managers
    const { data: client_data } = useFetchData('/customers');
    const clients = Array.isArray(client_data) ? client_data.reverse() : [];

    const { data: region_data } = useFetchData('/radar/region');
    const regions = Array.isArray(region_data) ? region_data.reverse() : [];

    const { data: manager_data } = useFetchData('/users');
    const managers = Array.isArray(manager_data) ? manager_data.reverse() : [];

    // Search Clients
    const [searchClient, setSearchClient] = useState("");
    const filteredClients = clients.filter((client) =>
        client.customer_name.toLowerCase().includes(searchClient.toLowerCase())
    );

    // Search Users
    const [searchUser, setSearchUser] = useState("");
    const filteredManagers = managers.filter((manager) =>
        manager.user_firstname.toLowerCase().includes(searchUser.toLowerCase())
    );

    // Initialize form with existing project data
    const form = useForm<FormData>({
        resolver: zodResolver(projectEditSchema),
        defaultValues: {
            project_name: project_name || "",
            project_code: project_code || projectCode,
            project_id: project_id,
            company_id: company_id || "",
            customer_id: project_customer_id || "",
            manager_id: project_manager_id || "",
            start_date: project_start_date ? new Date(project_start_date) : new Date(),
            end_date: project_end_date ? new Date(project_end_date) : new Date(),
            segment_number: project_segment_number || "",
            region_id: project_region_id || "",
            user_id: user_id || "",
            project_status: project_status || "Active",
            project_po_file: project_po_file || "",
            project_ehs_file: project_ehs_file || "",
            project_permit: project_permit || "",
            project_design: project_design || "",
            project_certificate_of_workers: project_certificate_of_workers || "",
            project_description: project_description || "",
        }
    });

    const { control } = useForm();

    const {
        fields: fileFields,
        append: fileAppend,
        remove: fileRemove,
    } = useFieldArray({ control, name: "file" });

    const mutation = usePatchProjectData('/project');


    async function onSubmit(data: FormData) {

        const formData = new FormData();

        for (const key in data) {
            // @ts-ignore
            if (data[key] instanceof File) {
                // @ts-ignore
                formData.append(key, data[key]);
            } else {
                // @ts-ignore
                formData.append(key, data[key]);
            }
        }


        try {
            await mutation.mutateAsync(data);
            setLoading(true);
            setIsSuccess(true);
            router.refresh();

            toast({
                title: "Project updated!",
                description: "You have successfully updated the project.",
                variant: "default"
            });
        } catch (error) {
            setLoading(false);
            setIsSuccess(false);
            toast({
                title: "Error",
                description: "An unexpected error occurred. Please try again later.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    }

    if (projectLoading) return <div> <Loading/> </div>;

    return (
        <>
            {projectData && ( // @ts-ignore
               projectData.map((project, index) => (
                   <div key={index}>
                       <Form {...form} >
                           <form onSubmit={form.handleSubmit(onSubmit)}>
                               <div className='pb-12'>
                                   <div className='mb-5 space-y-2'>
                                       <h1 className='text-lg font-bold font-heading text-primary'>
                                           Update Project Details
                                       </h1>
                                       <p className='text-muted-foreground'> Fill the form below to update project’s information </p>
                                   </div>

                                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                       <div className="grid gap-1">
                                           <FormField
                                               control={form.control}
                                               name="project_name"
                                               render={({field}) => (
                                                   <FormItem>
                                                       <FormLabel> Project Name </FormLabel>
                                                       <FormControl>
                                                           <Input disabled={loading} value={project.project_name} placeholder={project.project_name} />
                                                       </FormControl>
                                                       <FormMessage/>
                                                   </FormItem>
                                               )}
                                           />
                                       </div>

                                       <div className="grid gap-1">
                                           <FormField
                                               control={form.control}
                                               name="project_code"
                                               render={({field}) => (
                                                   <FormItem>
                                                       <FormLabel> Project Code <span className="text-xs italic text-muted-foreground">(Auto Generated)</span> </FormLabel>
                                                       <FormControl>
                                                           <Input disabled
                                                                  placeholder={project.project_code} {...field} />
                                                       </FormControl>
                                                       <FormMessage/>
                                                   </FormItem>
                                               )}
                                           />
                                       </div>

                                       <div className="grid gap-1">
                                           <FormField
                                               control={form.control}
                                               name="customer_id"
                                               render={({field}) => (
                                                   <FormItem>
                                                       <FormLabel> Project Client </FormLabel>
                                                       <Select onValueChange={field.onChange}>
                                                           <FormControl>
                                                               <SelectTrigger>
                                                                   <SelectValue defaultValue={project_customer_id}/>
                                                               </SelectTrigger>
                                                           </FormControl>
                                                           <SelectContent>
                                                               {/* Search Input */}
                                                               <div className="p-2">
                                                                   <Input
                                                                       placeholder="Search Customer"
                                                                       value={searchClient}
                                                                       onChange={(e) => setSearchClient(e.target.value)}
                                                                       onFocus={(e) => e.target.select()} // Safely handle focus
                                                                   />
                                                               </div>
                                                               {filteredClients.map((client) => (
                                                                   <SelectItem key={client.customer_id}
                                                                               value={`${client.customer_id}`}> {client.customer_name} </SelectItem>
                                                               ))}
                                                           </SelectContent>
                                                       </Select>
                                                       <FormMessage/>
                                                   </FormItem>
                                               )}
                                           />
                                       </div>

                                       <div className="grid gap-1">
                                           <FormField
                                               control={form.control}
                                               name="manager_id"
                                               render={({field}) => (
                                                   <FormItem>
                                                       <FormLabel> Project Manager </FormLabel>
                                                       <Select onValueChange={field.onChange}>
                                                           <FormControl>
                                                               <SelectTrigger>
                                                                   <SelectValue defaultValue={project.project_manager}/>
                                                               </SelectTrigger>
                                                           </FormControl>
                                                           <SelectContent>
                                                               {/* Search Input */}
                                                               <div className="p-2">
                                                                   <Input
                                                                       placeholder="Search Manager"
                                                                       value={searchUser}
                                                                       onChange={(e) => setSearchUser(e.target.value)}
                                                                       onFocus={(e) => e.target.select()} // Safely handle focus
                                                                   />
                                                               </div>
                                                               {filteredManagers.map((manager) => (
                                                                   <SelectItem key={manager.user_id}
                                                                               value={`${manager.user_id}`}> {manager.user_firstname} {manager.user_lastname} </SelectItem>
                                                               ))}
                                                           </SelectContent>
                                                       </Select>
                                                       <FormMessage/>
                                                   </FormItem>
                                               )}
                                           />
                                       </div>

                                       <div className="grid gap-1">
                                           <FormField
                                               control={form.control}
                                               name="start_date"
                                               render={({field}) => (
                                                   <FormItem className="flex flex-col">
                                                       <FormLabel>Start Date</FormLabel>
                                                       <Popover>
                                                           <PopoverTrigger asChild>
                                                               <Button
                                                                   variant={"outline"}
                                                                   className={cn(
                                                                       "w-[280px] justify-start text-left font-normal",
                                                                       !field.value && "text-muted-foreground"
                                                                   )}
                                                               >
                                                                   <CalendarIcon className="mr-2 h-4 w-4"/>
                                                                   {field.value ? (
                                                                       format(field.value, "PPP")
                                                                   ) : (
                                                                       <span>DD/MM/YYYY</span>
                                                                   )}
                                                               </Button>
                                                           </PopoverTrigger>
                                                           <PopoverContent
                                                               className="flex w-auto flex-col space-y-2 p-2">
                                                               <div className="rounded-md border">
                                                                   <Calendar
                                                                       mode="single"
                                                                       selected={field.value}
                                                                       onDayClick={field.onChange}
                                                                       initialFocus
                                                                   />
                                                               </div>
                                                           </PopoverContent>
                                                       </Popover>
                                                       <FormMessage/>
                                                   </FormItem>
                                               )}
                                           />
                                       </div>

                                       <div className="grid gap-1">
                                           <FormField
                                               control={form.control}
                                               name="end_date"
                                               render={({field}) => (
                                                   <FormItem className="flex flex-col">
                                                       <FormLabel>End Date</FormLabel>
                                                       <Popover>
                                                           <PopoverTrigger asChild>
                                                               <Button
                                                                   variant={"outline"}
                                                                   className={cn(
                                                                       "w-[280px] justify-start text-left font-normal",
                                                                       !field.value && "text-muted-foreground"
                                                                   )}
                                                               >
                                                                   <CalendarIcon className="mr-2 h-4 w-4"/>
                                                                   {field.value ? (
                                                                       format(field.value, "PPP")
                                                                   ) : (
                                                                       <span>DD/MM/YYYY</span>
                                                                   )}
                                                               </Button>
                                                           </PopoverTrigger>
                                                           <PopoverContent
                                                               className="flex w-auto flex-col space-y-2 p-2">
                                                               <div className="rounded-md border">
                                                                   <Calendar
                                                                       mode="single"
                                                                       selected={field.value}
                                                                       onDayClick={field.onChange}
                                                                       initialFocus
                                                                   />
                                                               </div>
                                                           </PopoverContent>
                                                       </Popover>
                                                       <FormMessage/>
                                                   </FormItem>
                                               )}
                                           />
                                       </div>

                                       <div className="grid gap-1">
                                           <FormField
                                               control={form.control}
                                               name="segment_number"
                                               render={({field}) => (
                                                   <FormItem>
                                                       <FormLabel> Segment Number </FormLabel>
                                                       <FormControl>
                                                           <Input disabled={loading}
                                                                  type="number"
                                                                  placeholder={project.project_segment_number} {...field} />
                                                       </FormControl>
                                                       <FormMessage/>
                                                   </FormItem>
                                               )}
                                           />
                                       </div>

                                       <div className="grid gap-1">
                                           <FormField
                                               control={form.control}
                                               name="region_id"
                                               render={({field}) => (
                                                   <FormItem>
                                                       <FormLabel> Region </FormLabel>
                                                       <Select onValueChange={field.onChange}>
                                                           <FormControl>
                                                               <SelectTrigger>
                                                                   <SelectValue defaultValue={project.region_name}/>
                                                               </SelectTrigger>
                                                           </FormControl>
                                                           <SelectContent>
                                                               {regions.map((region) => (
                                                                   <SelectItem key={region.region_id}
                                                                               value={`${region.region_id}`}> {region.region_name} </SelectItem>
                                                               ))}
                                                           </SelectContent>
                                                       </Select>
                                                       <FormMessage/>
                                                   </FormItem>
                                               )}
                                           />
                                       </div>

                                       <div className="grid gap-1">
                                           <FormField
                                               control={form.control}
                                               name="project_status"
                                               render={({field}) => (
                                                   <FormItem>
                                                       <FormLabel> Project Status </FormLabel>
                                                       <Select onValueChange={field.onChange}>
                                                           <FormControl>
                                                               <SelectTrigger>
                                                                   <SelectValue placeholder="Select Status"/>
                                                               </SelectTrigger>
                                                           </FormControl>
                                                           <SelectContent>
                                                               <SelectItem value="Active">Active</SelectItem>
                                                               <SelectItem value="Completed">Completed</SelectItem>
                                                               <SelectItem value="On Hold">On Hold</SelectItem>
                                                           </SelectContent>
                                                       </Select>
                                                       <FormMessage/>
                                                   </FormItem>
                                               )}
                                           />
                                       </div>

                                   </div>

                                   <div className='py-12'>
                                       <div className='mb-5 space-y-2'>
                                           <h1 className='text-lg font-bold font-heading text-primary'> Project
                                               Files </h1>
                                           <p className='text-muted-foreground'> Upload the required project files
                                               below </p>
                                       </div>
                                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                           <div className="grid">
                                               <FormField
                                                   control={form.control}
                                                   name="project_po_file"
                                                   render={({field}) => (
                                                       <FormItem>
                                                           <FormLabel>Project PO File</FormLabel>
                                                           <FormControl>
                                                               <Input
                                                                   type="file"
                                                                   accept="*"
                                                                   onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : null)}
                                                               />
                                                           </FormControl>
                                                           <FormMessage/>
                                                       </FormItem>
                                                   )}
                                               />
                                           </div>
                                           <div className="grid">
                                               <FormField
                                                   control={form.control}
                                                   name="project_ehs_file"
                                                   render={({field}) => (
                                                       <FormItem>
                                                           <FormLabel> Project EHS File </FormLabel>
                                                           <FormControl>
                                                               <Input
                                                                   type="file"
                                                                   accept="*"
                                                                   onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : null)}
                                                               />
                                                           </FormControl>
                                                           <FormMessage/>
                                                       </FormItem>
                                                   )}
                                               />
                                           </div>
                                           <div className="grid">
                                               <FormField
                                                   control={form.control}
                                                   name="project_permit"
                                                   render={({field}) => (
                                                       <FormItem>
                                                           <FormLabel> Project Permit File </FormLabel>
                                                           <FormControl>
                                                               <Input
                                                                   type="file"
                                                                   accept="*"
                                                                   onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : null)}
                                                               />
                                                           </FormControl>
                                                           <FormMessage/>
                                                       </FormItem>
                                                   )}
                                               />
                                           </div>
                                           <div className="grid">
                                               <FormField
                                                   control={form.control}
                                                   name="project_design"
                                                   render={({field}) => (
                                                       <FormItem>
                                                           <FormLabel> Project Design File </FormLabel>
                                                           <FormControl>
                                                               <Input
                                                                   type="file"
                                                                   accept="*"
                                                                   onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : null)}
                                                               />
                                                           </FormControl>
                                                           <FormMessage/>
                                                       </FormItem>
                                                   )}
                                               />
                                           </div>
                                           <div className="grid">
                                               <FormField
                                                   control={form.control}
                                                   name="project_certificate_of_workers"
                                                   render={({field}) => (
                                                       <FormItem>
                                                           <FormLabel> Project Workers Certificates </FormLabel>
                                                           <FormControl>
                                                               <Input
                                                                   type="file"
                                                                   accept="*"
                                                                   onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : null)}
                                                               />
                                                           </FormControl>
                                                           <FormMessage/>
                                                       </FormItem>
                                                   )}
                                               />
                                           </div>
                                       </div>

                                   </div>

                                   <div className="pb-12">
                                       <div className="grid gap-1">
                                           <FormField
                                               control={form.control}
                                               name="project_description"
                                               render={({field}) => (
                                                   <FormItem>
                                                       <FormLabel> Description </FormLabel>
                                                       <FormControl>
                                                           <Textarea disabled={loading}
                                                                     placeholder={project.project_description} {...field} />
                                                       </FormControl>
                                                       <FormMessage/>
                                                   </FormItem>
                                               )}
                                           />
                                       </div>
                                   </div>
                               </div>

                               <div className="flex justify-end gap-2">
                                   <Button type="submit" disabled={loading}>Save Changes</Button>
                                   <Button type="button" variant="outline"
                                           onClick={() => router.push('/projects')}>Cancel</Button>
                               </div>
                           </form>
                       </Form>

                   </div>
               ))
            )}
        </>
    );
}

export default EditProjectForm;
