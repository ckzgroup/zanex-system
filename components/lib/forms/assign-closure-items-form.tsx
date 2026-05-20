"use client";

import React, { useState } from 'react';
import * as z from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {segmentClosureSchema} from "@/utils/projects/validations/forms";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useAuthStore from "@/hooks/use-user";
import { Plus, Trash, CloudCheck, X } from "@phosphor-icons/react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import useFetchData, {useNormalFetchData, usePostData} from "@/actions/use-api";
import { Card } from "@/components/ui/card";
import {useSingleSegment} from "@/actions/get-project-segment";
import Loading from "@/app/(admin)/(projects)/loading";
import {formatDate} from "@/utils/format-date";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {cn} from "@/lib/utils";
import {CalendarIcon} from "lucide-react";
import {format} from "date-fns";
import {Calendar} from "@/components/ui/calendar";
import {Badge} from "@/components/ui/badge";

interface AssignClosureFormProps extends React.HTMLAttributes<HTMLDivElement> {}

type FormData = {
    closures: z.infer<typeof segmentClosureSchema>;
};

const AssignClosureItemsForm: React.FC<AssignClosureFormProps> = ({ className, ...props }) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const user = useAuthStore((state) => state.user?.result.user_id);
    const user_id = user?.toString();

    const pathname = usePathname();
    const project_id = parseInt(pathname.replace('/projects/', ''));
    const segment__id = parseInt(pathname.replace(`/projects/${project_id}/segments/`, ''));

    // Get Closure Items
    const { isLoading:cLoading, error:cError, data:cData } = useFetchData('/segment_closure/getClosureParameters');
    const closure_items = Array.isArray(cData) ? cData.reverse() : [];


    const form = useForm<FormData>({
        resolver: zodResolver(z.object({ closures: segmentClosureSchema })),
        defaultValues: {
            closures: [
                {
                    project_closure_parameter_id: "",
                    segment_id: segment__id,
                    user_id: user_id,
                    create_date: new Date(),
                }
            ]
        }
    });

    const { control, handleSubmit } = form;
    const { fields, append, remove } = useFieldArray({ control, name: "closures" });

    const mutation = usePostData('/segment_closure/createSegmentClosureCheck');

    async function onSubmit(data: FormData) {
        try {
            setLoading(true);
            await mutation.mutateAsync(data.closures);
            setIsSuccess(true);
            router.refresh();
            form.reset();
            toast({
                title: "Segment Closure Item added!",
                description: "You have successfully added a segment closure item.",
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

    const { isLoading, error, data:submittedServices } = useSingleSegment('/segment_closure/getAllSegmentClosureChecks', segment__id)

    const segment = Array.isArray(submittedServices) ? submittedServices.reverse() : [];


    if (!segment) return <Loading/>;

    // @ts-ignore
    return (
        <div className={className} {...props}>

            <div className="space-y-4 mb-6">
                <h3 className="text-lg font-semibold text-primary">Submitted Closure Items</h3>
                {submittedServices ? (
                    <div className="list-disc list-inside">
                        {submittedServices.map((service: any, index: number) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-6 items-end space-y-3">
                                <div className="grid space-y-2">
                                    <h4 className="font-semibold"> Name </h4>
                                    <Card className="py-2 px-4 w-fit rounded-md shadow-none">
                                        <span>{service.parameter_name}</span>
                                    </Card>
                                </div>


                                <div className="grid space-y-2">
                                    <h4 className="font-semibold"> Date </h4>
                                    <Card className="py-2 px-4 w-[60%] rounded-md shadow-none">
                                        <span>{formatDate(service.closure_check_date)}</span>
                                    </Card>
                                </div>

                                <div className="grid space-y-2">
                                    <h4 className="font-semibold"> Status </h4>
                                    <Badge className="py-2 px-4 w-fit rounded-md shadow-none">
                                        <span>{service.closure_check_status}</span>
                                    </Badge>
                                </div>




                            </div>

                        ))}
                    </div>
                ) : (
                    <p>No services submitted yet.</p>
                )}
            </div>
            <hr/>
            <Form {...form}>
                <h3 className="text-lg font-semibold my-4 text-primary">Add Closure Item </h3>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {fields.map((field, index) => (
                        <div key={field.id} className="grid grid-cols-1 md:grid-cols-6 gap-6 items-end">
                            <div className="grid gap-1">
                                <FormField
                                    control={form.control}
                                    name={`closures.${index}.project_closure_parameter_id`}
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel> Closure Items </FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue="">
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Item"/>
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {closure_items.map((close) => (
                                                        <SelectItem key={close.project_closure_parameter_id}
                                                                    value={`${close.project_closure_parameter_id}`}> {close.parameter_name} </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>



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
                            project_closure_parameter_id: "",
                            segment_id: segment__id, //@ts-ignore
                            user_id: user_id,
                            create_date: new Date(),
                        })}
                    >
                        <Plus size={16}/>
                        <span> Add Item  </span>
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

export default AssignClosureItemsForm;
