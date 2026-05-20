"use client";

import React, { useState } from 'react';
import * as z from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {segmentMaterialSchema, segmentServiceSchema} from "@/utils/projects/validations/forms";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useAuthStore from "@/hooks/use-user";
import { Plus, Trash, CloudCheck, X } from "@phosphor-icons/react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import useFetchData, {usePostData} from "@/actions/use-api";
import { Card } from "@/components/ui/card";
import {useSingleSegment} from "@/actions/get-project-segment";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Calendar} from "@/components/ui/calendar";
import {format} from "date-fns";
import {CalendarIcon} from "lucide-react";
import {cn} from "@/lib/utils";
import {formatDate} from "@/utils/format-date";
import Loading from "@/app/(admin)/(projects)/loading";

interface AssignMaterialFormProps extends React.HTMLAttributes<HTMLDivElement> {}

type FormData = {
    services: z.infer<typeof segmentServiceSchema>;
};

const AssignServiceForm: React.FC<AssignMaterialFormProps> = ({ className, ...props }) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const user = useAuthStore((state) => state.user?.result.user_id);
    const user_id = user?.toString();

    const pathname = usePathname();
    const project_id = parseInt(pathname.replace('/projects/', ''));
    const segment_id = parseInt(pathname.replace(`/projects/${project_id}/segments/`, ''));

    // GET SERVICES
    const { isLoading:serviceLoading, error:serviceError, data:service_data } = useFetchData('/project_service/getProjectServices');
    const services_data = Array.isArray(service_data) ? service_data.reverse() : [];

  const [searchTerm, setSearchTerm] = useState("");

  const filteredServices = services_data.filter((s: any) =>
    s.service_name.toLowerCase().includes(searchTerm.toLowerCase())
  );


    const form = useForm<FormData>({
        resolver: zodResolver(z.object({ services: segmentServiceSchema })),
        defaultValues: {
            services: [
                {
                    service_segment_id: segment_id,
                    service_user_id: user_id,
                    service_id: "",
                    service_quantity: 0,
                    service_rate: 1,
                    service_start_date: new Date(),
                    service_end_date: new Date(),
                    service_status: "Active"
                }
            ]
        }
    });

    const { control, handleSubmit } = form;
    const { fields, append, remove } = useFieldArray({ control, name: "services" });

    const mutation = usePostData('/project_segment_service');

    async function onSubmit(data: FormData) {
        try {
            setLoading(true);
            await mutation.mutateAsync(data.services);
            setIsSuccess(true);
            router.refresh();
            form.reset();
            toast({
                title: "Segment services added!",
                description: "You have successfully added a service.",
                variant: "default"
            });
        } catch (error) {
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

    const { isLoading, error, data:submittedServices } = useSingleSegment('/project_segment_service', segment_id)

    const segment = Array.isArray(submittedServices) ? submittedServices.reverse() : [];

    if (!segment) return <Loading/>;

    return (
        <div className={className} {...props}>

            <div className="space-y-4 mb-6">
                <h3 className="text-lg font-semibold text-primary">Submitted Services</h3>
                {submittedServices ? (
                    <div className="list-disc list-inside">
                        {submittedServices.map((service: any, index: number) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-6 items-end space-y-3">
                                <div className="grid space-y-2">
                                    <h4 className="font-semibold"> Service </h4>
                                    <Card className="py-2 px-4 w-[60%] rounded-md shadow-none">
                                        <span>{service.service_name}</span>
                                    </Card>
                                </div>

                                <div className="grid space-y-2">
                                    <h4 className="font-semibold"> Quantity </h4>
                                    <Card className="py-2 px-4 w-[60%] rounded-md shadow-none">
                                        <span>{service.quantity}</span>
                                    </Card>
                                </div>

                                <div className="grid space-y-2">
                                    <h4 className="font-semibold"> Start Date </h4>
                                    <Card className="py-2 px-4 w-[60%] rounded-md shadow-none">
                                        <span>{formatDate(service.start_date)}</span>
                                    </Card>
                                </div>

                                <div className="grid space-y-2">
                                    <h4 className="font-semibold"> End Date </h4>
                                    <Card className="py-2 px-4 w-[60%] rounded-md shadow-none">
                                        <span>{formatDate(service.end_date)}</span>
                                    </Card>
                                </div>

                                {/*<div className="grid space-y-2">*/}
                                {/*    <h4 className="font-semibold">Service Rate</h4>*/}
                                {/*    <Card className="py-2 px-4 w-[60%] rounded-md shadow-none">*/}
                                {/*        <span>{service.service_rate}</span>*/}
                                {/*    </Card>*/}
                                {/*</div>*/}


                            </div>

                        ))}
                    </div>
                ) : (
                    <p>No services submitted yet.</p>
                )}
            </div>
            <hr/>
            <Form {...form}>
                <h3 className="text-lg font-semibold my-4 text-primary">Add Services</h3>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {fields.map((field, index) => (
                        <div key={field.id} className="grid grid-cols-1 md:grid-cols-6 gap-6 items-end">
                            <div className="grid gap-1">
                                <FormField
                                    control={form.control}
                                    name={`services.${index}.service_id`}
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel> Service </FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue="">
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select service"/>
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                  {/* Search Input */}
                                                  <div className="p-2">
                                                    <Input
                                                      placeholder="Search Service"
                                                      value={searchTerm}
                                                      onChange={(e) => setSearchTerm(e.target.value)}
                                                      onFocus={(e) => e.target.select()} // Safely handle focus
                                                    />
                                                  </div>
                                                    {filteredServices.map((service: any) => (
                                                        <SelectItem key={service.project_service_id}
                                                                    value={`${service.project_service_id}`}> {service.service_name} </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={control}
                                name={`services.${index}.service_quantity`}
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Length / Quantity</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="Service Length / Quantity" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <div className="grid gap-1">
                                <FormField
                                    control={form.control}
                                    name={`services.${index}.service_start_date`}
                                    render={({field}) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Start Date</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-[160px] justify-start text-left font-normal",
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
                                                <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
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
                                    name={`services.${index}.service_end_date`}
                                    render={({field}) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>End Date</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-[160px] justify-start text-left font-normal",
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
                                                <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
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

                            <FormField
                                control={control}
                                name={`services.${index}.service_rate`}
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel> Charges Rate </FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="Service Rate" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <Button type="button" variant="outline" onClick={() => remove(index)}
                                    className="mt-6 text-destructive border-destructive">
                                <Trash size={20}/>
                            </Button>
                        </div>
                    ))}

                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="space-x-1 text-primary border-primary bg-primary/10 w-fit"
                        onClick={() => append({
                            service_segment_id: segment_id, //@ts-ignore
                            service_user_id: user_id,
                            service_id: "",
                            service_quantity: 0,
                            service_rate: 1,
                            service_start_date: new Date(),
                            service_end_date: new Date(),
                            service_status: "Active"
                        })}
                    >
                        <Plus size={16}/>
                        <span> Add Service </span>
                    </Button>

                    <div className="flex justify-end space-x-4">
                        <Button type="reset" className="bg-destructive hover:bg-destructive/90">
                            <X size={20}/>
                            <span> Cancel </span>
                        </Button>
                        <Button type="submit" className="space-x-2">
                            <CloudCheck size={20}/>
                            <span> Save </span>
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default AssignServiceForm;
