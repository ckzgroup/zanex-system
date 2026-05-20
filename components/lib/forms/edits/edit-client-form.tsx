"use client";

import React, {useState} from 'react';
import * as z from "zod";
import {clientEditSchema} from "@/utils/projects/validations/forms";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useDropzone} from 'react-dropzone';

import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import axios from "axios";
import {toast} from "@/components/ui/use-toast";
import useAuthStore from "@/hooks/use-user";
import {usePathname, useRouter} from "next/navigation";
import {usePatchData, usePostData} from "@/actions/use-api";
import {useSingleProject} from "@/actions/get-project";
import {useSingleCustomer} from "@/actions/get-customer";

interface AddClientFormProps extends React.HTMLAttributes<HTMLDivElement> {
}

type FormData = z.infer<typeof clientEditSchema> & {
    customer_profile: File | null;
};

interface IProps {
    customerId: any
}

function EditClientForm({customerId}: IProps) {

    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);


    // @ts-ignore
    const company = useAuthStore((state) => state.user?.result.user_company_id);
    // @ts-ignore
    const user = useAuthStore((state) => state.user?.result.user_id);

    const company_id = company?.toString(); // @ts-ignore
    const user_id = user?.toString();

    // @ts-ignore
    const {isLoading: customerLoading, error: customerError, data: customerData } = useSingleCustomer('/customers/customer', customerId);

    // Check if projectData is defined and has elements
    const customer = customerData && customerData.length > 0 ? customerData[0] : null;
    const {
        customer_contact,
        customer_email,
        customer_id,
        customer_name,
    } = customer || {};


    const form = useForm<FormData>({
        resolver: zodResolver(clientEditSchema),
        defaultValues: {
            customer_name: customer_name || "",
            customer_email: customer_email || "",
            customer_contact: customer_contact || "",
            customer_id: customer_id,
        }
    });

    const mutation = usePatchData('/customers');


    async function onSubmit(data: FormData) {
        try {
            await mutation.mutateAsync(data);
            setLoading(true);
            setIsSuccess(true);
            router.refresh();

            toast({
                title: "Customer updated!",
                description: "You have successfully updated the customer details.",
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
                                            <Input disabled={loading} defaultValue={customer_name}
                                                   placeholder={customer_name} {...field}
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
                                            <Input disabled={loading} defaultValue={customer_email}
                                                   placeholder={customer_email} {...field}
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
                                            <Input disabled={loading} defaultValue={customer_contact}
                                                   placeholder={customer_contact} {...field}
                                                   type="text"/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>

                    </div>

                    <Button type="submit" className="space-x-2">
                        <span> Update Client </span>
                    </Button>
                </form>
            </Form>
        </div>
    );
}

export default EditClientForm;