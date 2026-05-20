"use client";

import React, {useState} from 'react';
import * as z from "zod";
import {clientSchema, regionSchema} from "@/utils/projects/validations/forms";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import { useDropzone } from 'react-dropzone';

import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import axios from "axios";
import {toast} from "@/components/ui/use-toast";
import useAuthStore from "@/hooks/use-user";
import {useRouter} from "next/navigation";
import {usePostData} from "@/actions/use-api";

interface AddClientFormProps extends React.HTMLAttributes<HTMLDivElement> {}

type FormData = z.infer<typeof clientSchema> & {
    customer_profile: File | null;
};

function AddClientForm({ className, ...props }: AddClientFormProps) {

    const router =  useRouter();
    const [loading, setLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false);
    const company_id = useAuthStore((state) => state.user?.result.user_company_id);
    const user_id = useAuthStore((state) => state.user?.result.user_id);

    const form = useForm<FormData>({
        resolver: zodResolver(clientSchema),
        defaultValues: {
            customer_name: "",
            customer_email: "",
            customer_contact: "",
            customer_profile: null,
            customer_created_by: `${user_id}`,
            customer_company_id: `${company_id}`
        }
    });

    const mutation = usePostData('/customers');

    async function onSubmit(data: FormData) {
        // Append the file if it exists
        try {
            await mutation.mutateAsync(data);
            setLoading(false);
            setIsSuccess(true);
            router.push('/customers');
            form.reset();
            toast({
                title: "Customer added!",
                description: "You have successfully added a customer.",
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
                    <div className="space-y-4">
                        <div className="grid">
                            <FormField
                                control={form.control}
                                name="customer_name"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Client Name</FormLabel>
                                        <FormControl>
                                            <Input disabled={loading} placeholder="Enter client name" {...field}
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
                                name="customer_email"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Email Address</FormLabel>
                                        <FormControl>
                                            <Input disabled={loading} placeholder="Enter email" {...field}
                                                   type="email"/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid">
                            <FormField
                                control={form.control}
                                name="customer_contact"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Phone Number</FormLabel>
                                        <FormControl>
                                            <Input disabled={loading} placeholder="Enter phone number" {...field}
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
                                name="customer_profile"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Profile Photo</FormLabel>
                                        <FormControl>
                                            <Input disabled={loading} placeholder="Choose photo" {...field}
                                                   type="file"/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <Button type="submit" className="space-x-2">
                        <span> Add Client </span>
                    </Button>
                </form>
            </Form>
        </div>
    );
}

export default AddClientForm;