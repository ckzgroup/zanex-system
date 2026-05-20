"use client";

import React, {useEffect, useState} from 'react';
import * as z from "zod";
import { userEditSchema } from "@/utils/projects/validations/forms";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
// @ts-ignore

import {useRouter} from "next/navigation";
import useAuthStore from "@/hooks/use-user";
import useFetchData, {usePatchData, usePostData} from "@/actions/use-api";
import {toast} from "@/components/ui/use-toast";


import {useSingleUser} from "@/actions/get-user";

type FormData = z.infer<typeof userEditSchema>

interface IProps {
    userId: any
}

function EditUserForm({ userId }: IProps) {

    const router =  useRouter();
    const [loading, setLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false);
    const company = useAuthStore((state) => state.user?.result.user_company_id);
    const company_id = company?.toString();

    // @ts-ignore
    const {isLoading: userLoading, error: userError, data: userData } = useSingleUser('/users/get', userId);
    const user = userData;
    // Check if projectData is defined and has elements
    // const user = userData && userData.length > 0 ? userData[0] : null;
    const {
        user_firstname,
        user_lastname,
        user_email_address,
        user_id,
        user_contact,
        user_country_code,
    } = user || {};


    const form = useForm<FormData>({
        resolver: zodResolver(userEditSchema),
        defaultValues: {
            first_name: user_firstname || "",
            last_name: user_lastname || "",
            user_email: user_email_address || "",
            user_contact: user_contact || "",
            user_country_code: user_country_code || "",
            user_id: user_id
        }
    });


    const mutation = usePatchData('/others/update_user');

    async function onSubmit(data: FormData) {
        // Append the file if it exists
        try {
            setLoading(true);
            await mutation.mutateAsync(data);
            setIsSuccess(true);
            router.push('/users');
            form.reset();
            toast({
                title: "User Updates!",
                description: "You have successfully updated user details.",
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
            {user_firstname && (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div
                            className="space-y-4">
                            <div className="grid">
                                <FormField
                                    control={form.control}
                                    name="first_name"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>First Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder={user_firstname}
                                                    defaultValue={user_firstname}
                                                    {...field}
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
                                    name="last_name"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Last Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder={user_lastname}
                                                       defaultValue={user_lastname}
                                                       {...field}
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
                                    name="user_email"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Email Address</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder={user_email_address}
                                                    {...field}
                                                    defaultValue={user_email_address}
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
                                    name="user_country_code"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Country Code</FormLabel>
                                            <FormControl>
                                                <Input defaultValue={user_country_code} placeholder={user_country_code} {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid">
                                <FormField
                                    control={form.control}
                                    name="user_contact"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Phone Number</FormLabel>
                                            <FormControl>
                                                <Input defaultValue={user_contact} placeholder={user_contact} {...field}
                                                       type="text"/>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>



                        </div>
                        <Button type="submit" className="space-x-2">
                            <span> Update User </span>
                        </Button>
                    </form>
                </Form>
            )}
        </div>
    );
}

export default EditUserForm;
