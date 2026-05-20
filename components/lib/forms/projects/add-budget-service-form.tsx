"use client";

import React, {useState} from 'react';
import * as z from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {CloudCheck, PencilSimpleLine, Trash} from "@phosphor-icons/react";
import {Textarea} from "@/components/ui/textarea";
import {useRouter} from "next/navigation";
import useAuthStore from "@/hooks/use-user";
import {regionSchema} from "@/utils/projects/validations/forms";
import {usePostData} from "@/actions/use-api";
import {toast} from "@/components/ui/use-toast";


const budgetServiceSchema = z.object({
    budget_item_name: z.string().nonempty(),
    company_id: z.string(),
    budget_item_user_id:z.string(),
    budget_item_date: z.any(),
})

type FormData = z.infer<typeof budgetServiceSchema>

function AddBudgetServiceForm() {

    const router =  useRouter();
    const [loading, setLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false);

    const company = useAuthStore((state) => state.user?.result.user_company_id);
    const user = useAuthStore((state) => state.user?.result.user_id);

    // @ts-ignore
    const company_id = company.toString(); // @ts-ignore
    const user_id = user.toString();

    const form = useForm<FormData>({
        resolver: zodResolver(budgetServiceSchema),
        defaultValues: {
            budget_item_name: "",
            budget_item_date: new Date(),
            budget_item_user_id: user_id,
            company_id: `${company_id}`
        }
    });

    const mutation = usePostData('/budget/createBudget');

    async function onSubmit(data: FormData) {
        try {
            await mutation.mutateAsync(data);
            setLoading(false);
            setIsSuccess(true);
            router.push('/services');
            form.reset();
            toast({
                title: "Budget Service added!",
                description: "You have successfully added a budget service.",
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
        <div>
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
                                            <Input placeholder="Enter budget item name" {...field}
                                                   type="text"/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>

                    </div>
                    <Button type="submit" className="space-x-2">
                        <span> Add Budget Service </span>
                    </Button>
                </form>
            </Form>
        </div>
    );
}

export default AddBudgetServiceForm;