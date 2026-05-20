"use client";

import React, {useEffect, useState} from 'react';
import * as z from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";
import {usePatchData, usePostData} from "@/actions/use-api";
import {toast} from "@/components/ui/use-toast";
import Loading from "@/app/(admin)/(projects)/loading";
import {useSingleBudgetService} from "@/actions/get-service";


const budgetServiceSchema = z.object({
    budget_item_name: z.string().nonempty(),
    budget_item_id: z.any(),
})

type FormData = z.infer<typeof budgetServiceSchema>

interface IProps {
     budgetServiceId: any,
    onClose: any

}

function EditBudgetServiceForm({ budgetServiceId, onClose }: IProps) {

    const router =  useRouter();
    const [loading, setLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false);

    // @ts-ignore
    const {isLoading: serviceLoading, error: serviceError, data: serviceData } = useSingleBudgetService('/budget/getBudgetItemById', budgetServiceId);
    // const service = serviceData;
    // Check if projectData is defined and has elements
    const service = serviceData && serviceData.length > 0 ? serviceData[0] : null;
    const {
        budget_item_id,
        budget_item_name,
    } = service || {};

    const form = useForm<FormData>({
        resolver: zodResolver(budgetServiceSchema),
        defaultValues: {
            budget_item_id: budget_item_id,
            budget_item_name: budget_item_name || "",
        }
    });

    useEffect(() => {
        if (service) {
            form.reset({
                budget_item_id: budget_item_id,
                budget_item_name: budget_item_name || '',
            });
        }
    }, [service, form]);

    const mutation = usePatchData('/budget/updateBudget');

    async function onSubmit(data: FormData) {
        setLoading(true);
        try {
            await mutation.mutateAsync(data);
            setIsSuccess(true);
            router.refresh();
            onClose(); // ✅ Close the dialog after success
            form.reset();
            toast({
                title: "Budget Service Updated!",
                description: "You have successfully updated budget service",
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

    if (loading) return <div> <Loading/> </div>

    return (
        <div>
            {service && (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div
                            className="space-y-4">
                            <div className="grid">
                                <FormField
                                    control={form.control}
                                    name="budget_item_name"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Budget Item Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder={budget_item_name} {...field}
                                                       type="text"/>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>

                        </div>
                        <Button type="submit" className="space-x-2">
                            <span> Update Budget Service </span>
                        </Button>
                    </form>
                </Form>
            )}
        </div>
    );
}

export default EditBudgetServiceForm;