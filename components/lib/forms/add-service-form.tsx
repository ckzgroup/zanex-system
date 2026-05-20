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
import {serviceSchema} from "@/utils/services/validations/forms";
import {useRouter} from "next/navigation";
import useAuthStore from "@/hooks/use-user";
import {regionSchema} from "@/utils/projects/validations/forms";
import {usePostData} from "@/actions/use-api";
import {toast} from "@/components/ui/use-toast";

interface AddServiceFormProps extends React.HTMLAttributes<HTMLDivElement> {}

type FormData = z.infer<typeof serviceSchema>

function AddServiceForm({ className, ...props }: AddServiceFormProps) {

    const router =  useRouter();
    const [loading, setLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false);
    const company_id = useAuthStore((state) => state.user?.result.user_company_id);

    const form = useForm<FormData>({
        resolver: zodResolver(serviceSchema),
        defaultValues: {
            service_name: "",
            service_type_priority_id: "1",
            service_type_status: "Active",
            service_type_branch_id: `${company_id}`
        }
    });

    const mutation = usePostData('/services');

    async function onSubmit(data: FormData) {
        try {
            await mutation.mutateAsync(data);
            setLoading(false);
            setIsSuccess(true);
            router.push('/services');
            form.reset();
            toast({
                title: "Service added!",
                description: "You have successfully added a service.",
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
                                name="service_name"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Service Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter service name" {...field}
                                                   type="text"/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="grid">
                            <FormField
                                control={form.control}
                                name="service_type_priority_id"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Priority</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Priority"/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="1"> High </SelectItem>
                                                <SelectItem value="2"> Medium </SelectItem>
                                                <SelectItem value="3"> Low </SelectItem>
                                            </SelectContent>
                                        </Select>

                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>

                    </div>
                    <Button type="submit" className="space-x-2">
                        <span> Add Service </span>
                    </Button>
                </form>
            </Form>
        </div>
    );
}

export default AddServiceForm;