"use client";

import React, {useState} from 'react';
import * as z from "zod";
import { userSchema } from "@/utils/projects/validations/forms";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";

// @ts-ignore
import { useCountries } from 'use-react-countries'
import {useRouter} from "next/navigation";
import useAuthStore from "@/hooks/use-user";
import useFetchData, {usePostData} from "@/actions/use-api";
import {toast} from "@/components/ui/use-toast";


import {ScrollArea} from "@/components/ui/scroll-area";
import {
    MultiSelector,
    MultiSelectorContent,
    MultiSelectorInput, MultiSelectorItem, MultiSelectorList,
    MultiSelectorTrigger
} from "@/components/ui/multi-select2";

interface AddUserFormProps extends React.HTMLAttributes<HTMLDivElement> {}

type FormData = z.infer<typeof userSchema>

function AddUserForm({ className, ...props }: AddUserFormProps) {

    const router =  useRouter();
    const [loading, setLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false);
    const company = useAuthStore((state) => state.user?.result.user_company_id);
    const company_id = company?.toString();

    const { countries } = useCountries();
    const [roles, setRoles] = useState<string[]>([]);


    // GET ROLES
    const { isLoading:roleLoading, error:roleError, data:role_data } = useFetchData('/others/roles');
    const all_roles = Array.isArray(role_data) ? role_data.reverse() : [];


    const options = all_roles.map((role) => ({
        label: role.role_name,
        value: role.role_id.toString(),
    }));

    const form = useForm<FormData>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            user_firstname: "",
            user_lastname: "",
            user_email_address: "",
            user_driver_license: "N/A",
            role_id: [],
            user_contact: "",
            user_country_code: "",
            user_company_id: `${company_id}`
        }
    });


    const mutation = usePostData('/users');

    async function onSubmit(data: FormData) {
        // Append the file if it exists
        try {
            setLoading(true);
            data.role_id = roles;  // Add the selected roles to the form data
            await mutation.mutateAsync(data);
            setIsSuccess(true);
            router.push('/users');
            form.reset();
            toast({
                title: "User added!",
                description: "You have successfully added a user.",
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
                                name="user_firstname"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>First Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter first name" {...field}
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
                                name="user_lastname"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Last Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter last name" {...field}
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
                                name="user_email_address"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Email Address</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter email" {...field}
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
                                            <Input placeholder="Enter country code" {...field} />
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
                                            <Input placeholder="Enter phone number" {...field}
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
                                name="role_id"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Role</FormLabel>
                                        <MultiSelector values={roles} onValuesChange={setRoles} loop={false}>
                                            <MultiSelectorTrigger>
                                                <MultiSelectorInput placeholder="Select Role" />
                                            </MultiSelectorTrigger>
                                            <MultiSelectorContent>
                                                <MultiSelectorList>
                                                    {all_roles.map((role) => (
                                                        <MultiSelectorItem key={role.role_id} value={role.role_id.toString()}>
                                                            {role.role_name}
                                                        </MultiSelectorItem>
                                                    ))}
                                                </MultiSelectorList>
                                            </MultiSelectorContent>
                                        </MultiSelector>

                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>

                    </div>
                    <Button type="submit" className="space-x-2">
                        <span> Add User </span>
                    </Button>
                </form>
            </Form>
        </div>
    );
}

export default AddUserForm;