"use client";

import React, {useEffect, useState} from 'react';
import * as z from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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

interface BudgetLabourProps extends React.HTMLAttributes<HTMLDivElement> {}

const budgetLabourSchema = z.array(z.object({
    segment_id: z.number(),
    budget_item_id: z.any(),
    budget_item_type: z.string(),
    budget_item_count: z.coerce.number(),
    budget_item_amount: z.coerce.number(),
    budget_item_date: z.any(),
    budget_item_user_id: z.string()
}));


type FormData = {
    labours: z.infer<typeof budgetLabourSchema>
};

const BudgetLabour: React.FC<BudgetLabourProps> = ({ className, ...props }) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const user = useAuthStore((state) => state.user?.result.user_id);
    const user_id = user?.toString();

    const pathname = usePathname();
    const project_id = parseInt(pathname.replace('/projects/', ''));
    const segment_id = parseInt(pathname.replace(`/projects/${project_id}/segments/`, ''));


    const { isLoading: itemsLoading, error:itemsError, data:itemsData } = useSingleSegment('/budget/getSegmentBudgets', segment_id);
    const labours = Array.isArray(itemsData) ? itemsData.reverse() : [];


    const labourItems = labours?.filter((item: any) => item.budget_item_type === "Labour") || [];



    const { isLoading:sLoading, error:sError, data:services } = useSingleSegment('/project_segment_service', segment_id)

    const { isLoading: bLoading, error: bError, data:bData } = useFetchData('/budget/getBudgetItem');

    const budgetServices = Array.isArray(bData) ? bData.reverse() : [];



    const form = useForm<FormData>({
        resolver: zodResolver(z.object({ labours: budgetLabourSchema})),
        defaultValues: {
            labours: [
                {
                    segment_id: segment_id,
                    budget_item_id: "",
                    budget_item_type: "Labour",
                    budget_item_count: 0,
                    budget_item_amount: 0,
                    budget_item_user_id: user_id,
                    budget_item_date: new Date(),
                }
            ]
        }
    });


    const { control, handleSubmit } = form;
    const { fields, append, remove } = useFieldArray({ control, name: "labours" });

    const mutation = usePostData('/budget/createSegmentBudget');

    async function onSubmit(data: FormData) {
        try {
            setLoading(true);
            await mutation.mutateAsync(data.labours);
            setIsSuccess(true);
            router.refresh();
            form.reset();
            toast({
                title: "Service Item Budget added!",
                description: "You have successfully added service budget.",
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



    if (!budgetServices) return <Loading/>;

    return (
        <div className={className} {...props}>

            <div className="space-y-4 mb-6">
                <h3 className="text-lg font-semibold text-primary">Budgeted Service Items </h3>
                {labourItems ? (
                    <div className="list-disc list-inside">
                        {labourItems.map((i: any, index: number) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-6 items-end space-y-3">
                                <div className="grid space-y-2">
                                    <h4 className="font-semibold"> Name </h4>
                                    <Card className="py-2 px-4 w-fit rounded-md shadow-none">
                                        <span>{i.item_name}</span>
                                    </Card>
                                </div>

                                <div className="grid space-y-2">
                                    <h4 className="font-semibold"> Quantity </h4>
                                    <Card className="py-2 px-4 w-[60%] rounded-md shadow-none">
                                        <span>{i.item_count}</span>
                                    </Card>
                                </div>

                                <div className="grid space-y-2">
                                    <h4 className="font-semibold"> Amount (@)</h4>
                                    <Card className="py-2 px-4 w-[60%] rounded-md shadow-none">
                                        <span>{i.budget_item_amount}</span>
                                    </Card>
                                </div>

                                <div className="grid space-y-2">
                                    <h4 className="font-semibold"> Total Amount </h4>
                                    <Card className="py-2 px-4 w-[60%] rounded-md shadow-none">
                                        <span>{i.budget_item_count * i.budget_item_amount }</span>
                                    </Card>
                                </div>

                                <div className="grid space-y-2">
                                    <h4 className="font-semibold"> Status </h4>
                                    <Card className="py-2 px-4 w-fit rounded-md shadow-none">
                                        <span>{i.budget_item_status}</span>
                                    </Card>
                                </div>

                            </div>

                        ))}
                    </div>
                ) : (
                    <p>No labour submitted yet.</p>
                )}
            </div>
            <hr/>
            <Form {...form}>
                <h3 className="text-lg font-semibold my-4 text-primary">Add Service Item</h3>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {fields.map((field, index) => (
                        <div key={field.id} className="grid grid-cols-1 md:grid-cols-5 gap-6 items-end">
                            <div className="grid gap-1">
                                <FormField
                                    control={form.control}
                                    name={`labours.${index}.budget_item_id`}
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel> Name </FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue="">
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Item"/>
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {budgetServices.map((service: any) => (
                                                        <SelectItem
                                                            key={service.budget_item_id}
                                                            value={`${service.budget_item_id}`}
                                                        >
                                                            {service.budget_item_name}
                                                        </SelectItem>
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
                                    name={`labours.${index}.budget_item_count`}
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel> Quantity </FormLabel>
                                            <Input type="number" placeholder="Enter Quantity" {...field}/>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid gap-1">
                                <FormField
                                    control={form.control}
                                    name={`labours.${index}.budget_item_amount`}
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel> Rate </FormLabel>
                                            <Input type="number" placeholder="Enter Rate" {...field}/>
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
                            segment_id: segment_id,
                            budget_item_id: "",
                            budget_item_type: "Labour",
                            budget_item_count: 0,
                            budget_item_amount: 0, // @ts-ignore
                            budget_item_user_id: user_id,
                            budget_item_date: new Date(),
                        })}
                    >
                        <Plus size={16}/>
                        <span> Add Service Budget </span>
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

export default BudgetLabour;
