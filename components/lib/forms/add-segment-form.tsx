"use client"

import * as React from "react"
import {usePathname, useRouter, useSearchParams} from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import {useFieldArray, useForm} from "react-hook-form"
import * as z from "zod"

import {Button, buttonVariants} from "@/components/ui/button";
import {toast} from "@/components/ui/use-toast";
import {Input} from "@/components/ui/input";
import {Icons} from "@/components/ui/icons";
import {projectSchema, segmentSchema} from "@/utils/projects/validations/forms";
import {Textarea} from "@/components/ui/textarea";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {CalendarIcon} from "lucide-react";
import {Calendar} from "@/components/ui/calendar";
import { addDays, format } from "date-fns"
import {cn} from "@/lib/utils";
import useAuthStore from "@/hooks/use-user";
import {useState} from "react";
import useFetchData,{usePostData} from "@/actions/use-api";

interface SegmentFormProps extends React.HTMLAttributes<HTMLDivElement> {}

type FormData = z.infer<typeof segmentSchema>

export function AddSegmentForm({ className, ...props }: SegmentFormProps) {

    const router =  useRouter();
    const [loading, setLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false);
    const company_id = useAuthStore((state) => state.user?.result.user_company_id);
    const user= useAuthStore((state) => state.user?.result?.user_id);
    const user_id = user?.toString();

    // GET PROJECT ID
    const pathname = usePathname()
    const project_id = parseInt(pathname.replace('/projects/',''));

    // GET CLIENTS
    const { isLoading:clientLoading, error:clientError, data:client_data } = useFetchData('/customers');
    const clients = Array.isArray(client_data) ? client_data.reverse() : [];

    // GET REGIONS
    const { isLoading:regionLoading, error:regionError, data:region_data } = useFetchData('/radar/region');
    const regions = Array.isArray(region_data) ? region_data.reverse() : [];

    // GET PROJECT MANAGER
    const { isLoading:managerLoading, error:managerError, data:manager_data } = useFetchData('/users');
    const managers = Array.isArray(manager_data) ? manager_data.reverse() : [];

    // Generate Segment Code
    function generateSegmentCode() {
        return "SEG" + Math.floor(100000 + Math.random() * 900000).toString();
    }

    const segmentCode = generateSegmentCode();

    const form = useForm<FormData>({
        resolver: zodResolver(segmentSchema),
        defaultValues: {
            segment_name: "",
            segment_code: segmentCode,
            project_id: project_id,
            start_point: "",
            end_point: "",
            est_distance: 0,
            site: 0,
            overlap: 0,
            user_id: user_id,
            comment: "",
            sub_contractor: "",
            segment_status: "Active",
            start_date: new Date() ,
            end_date: new Date(),
            // material_name: "",
            // material_quantity: "",
        },
    });

    const { control} = useForm();

    const {
        fields: fileFields,
        append: fileAppend,
        remove: fileRemove,
    } = useFieldArray({ control, name: "file" });

    const mutation = usePostData('/project_segment');

    async function onSubmit(data: FormData) {

        try {
            setLoading(true);

            await mutation.mutateAsync(data);
            setIsSuccess(true);
            router.back();
            toast({
                title: "Segment added!",
                description: "You have successfully added a project segment.",
                variant: "default"
            });
            // Optionally refetch data after mutation
        } catch (error) {
            setLoading(false);
            setIsSuccess(false);
            toast({
                title: "Error",
                description: "An unexpected error occurred. Please try again later.",
                variant: "destructive"
            });
            // Handle mutation error
        }  finally {
            setLoading(false);
        }
    }


    return (
        <div className={cn("grid gap-6", className)} {...props}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className='pb-12'>
                        <div className='mb-5 space-y-2'>
                            <h1 className='text-lg font-bold font-heading text-primary'> Segment Details </h1>
                            <p className='text-muted-foreground'> Fill the project segment information </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="grid gap-1">
                                <FormField
                                    control={form.control}
                                    name="segment_name"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel> Segment Name </FormLabel>
                                            <FormControl>
                                                <Input disabled={loading} placeholder="Enter Segment Name" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid gap-1">
                                <FormField
                                    control={form.control}
                                    name="segment_code"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel> Segment Code <span className="text-xs italic text-muted-foreground">(Auto Generated)</span> </FormLabel>
                                            <FormControl>
                                                <Input disabled placeholder={segmentCode} {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid gap-1">
                                <FormField
                                    control={form.control}
                                    name="start_point"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel> Start Point Coordinate </FormLabel>
                                            <FormControl>
                                                <Input disabled={loading} placeholder="Enter Coordinate" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid gap-1">
                                <FormField
                                    control={form.control}
                                    name="end_point"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel> End Point Coordinate </FormLabel>
                                            <FormControl>
                                                <Input disabled={loading} placeholder="Enter Coordinate" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>


                            <div className="grid gap-1">
                                <FormField
                                    control={form.control}
                                    name="est_distance"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel> Est Distance (M) </FormLabel>
                                            <FormControl>
                                                <Input type="number" disabled={loading}
                                                       placeholder="Enter Distance in Metres" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid gap-1">
                                <FormField
                                    control={form.control}
                                    name="site"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel> Number of Sites </FormLabel>
                                            <FormControl>
                                                <Input type="number" disabled={loading}
                                                       placeholder="Enter No. of sites" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid gap-1">
                                <FormField
                                    control={form.control}
                                    name="overlap"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel> Overlap (M) </FormLabel>
                                            <FormControl>
                                                <Input type="number" disabled={loading}
                                                       placeholder="Enter Overlap in Metres" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>


                            <div className="grid gap-1">
                                <FormField
                                    control={form.control}
                                    name="sub_contractor"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel> Subcontractor </FormLabel>
                                            <FormControl>
                                                <Input  disabled={loading}
                                                       placeholder="Enter Subcontractor Name" {...field} />
                                            </FormControl>
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
                                                    <FormControl>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-full pl-3 text-left font-normal",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value ? (
                                                                format(field.value, "PPP")
                                                            ) : (
                                                                <span>Pick a date</span>
                                                            )}
                                                            <CalendarIcon
                                                                className="ml-auto h-4 w-4 opacity-50"/>
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single" //@ts-ignore
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        initialFocus
                                                    />
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
                                                    <FormControl>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-full pl-3 text-left font-normal",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value ? (
                                                                format(field.value, "PPP")
                                                            ) : (
                                                                <span>Pick a date</span>
                                                            )}
                                                            <CalendarIcon
                                                                className="ml-auto h-4 w-4 opacity-50"/>
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single" //@ts-ignore
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>


                        </div>
                    </div>


                    <div className='pb-12'>
                        <div className="grid gap-1">
                            <FormField
                                control={form.control}
                                name="comment"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel> Segment Comment </FormLabel>
                                        <FormControl>
                                            <Textarea disabled={loading} rows={5} placeholder="Write Segment Comment" {...field} ></Textarea>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>

                    </div>

                        <Button type="submit" disabled={loading} size="lg">
                            {loading && (
                                <Icons.spinner className="mr-2 h-4 w-4 animate-spin"/>
                            )}
                            <span> Add Segment </span>
                        </Button>
                </form>
            </Form>
        </div>
    )
}
