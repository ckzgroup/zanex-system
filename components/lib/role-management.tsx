"use client";

import React, {useState} from 'react';
import {useDeleteUser, useDeleteUserRole, useSingleUser, useSingleUserRole} from "@/actions/get-user";
import {Badge} from "@/components/ui/badge";
import Loading from "@/app/(admin)/(projects)/loading";
import useFetchData, {usePostData} from "@/actions/use-api";
import {useRouter} from "next/navigation";
import * as z from "zod";
import { useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "@/components/ui/use-toast";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Trash} from "@phosphor-icons/react";

const roleSchema = z.object({
    user_id: z.any(),
    role_id: z.any()
})

type FormData = z.infer<typeof roleSchema>

interface IProps {
    userId: any
}

function RoleManagement({ userId }: IProps){
    const router =  useRouter();
    const [loading, setLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false);

    const {isLoading, error: userError, data: existingData } = useSingleUserRole('/others/getUserRoles', userId);


    // GET ROLES
    const { isLoading:roleLoading, error:roleError, data:role_data } = useFetchData('/others/roles');
    const all_roles = Array.isArray(role_data) ? role_data.reverse() : [];

    // GET USERs
    const { isLoading:usersLoad, error, data:usersData } = useFetchData('/users');
    const users = Array.isArray(usersData) ? usersData.reverse() : [];

    // Search Users
    const [searchUser, setSearchUser] = useState("");
    const filteredUsers= users.filter((manager) =>
        manager.user_firstname.toLowerCase().includes(searchUser.toLowerCase())
    );


    const form = useForm<FormData>({
        resolver: zodResolver(roleSchema),
        defaultValues: {
            user_id: userId,
            role_id: ""
        }
    });

    const mutation = usePostData('/others/createUserRole');

    async function onSubmit(data: FormData) {
        // Append the file if it exists
        try {
            setLoading(true);
            await mutation.mutateAsync(data);
            setIsSuccess(true);
            router.push('/users');
            form.reset();
            toast({
                title: "User Role added!",
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


    // DELETE ROLE
    const { mutate: deleteMutation } = useDeleteUserRole('/others/disableUserRole');

    async function handleDeleteRole(user_role_id: number) {
        const confirmDelete = window.confirm("Are you sure you want to delete this role?");
        if (!confirmDelete) return;

        try {
            setLoading(true);

            deleteMutation(user_role_id, {
                onSuccess: () => {
                    toast({
                        title: "Role Deleted!",
                        description: "The role has been successfully removed from the user.",
                        variant: "default"
                    });
                    router.refresh(); // Refresh data
                },
                onError: () => {
                    toast({
                        title: "Error",
                        description: "Failed to delete role. Please try again.",
                        variant: "destructive"
                    });
                },
                onSettled: () => {
                    setLoading(false);
                }
            });

        } catch (error) {
            toast({
                title: "Error",
                description: "An unexpected error occurred.",
                variant: "destructive"
            });
            setLoading(false);
        }
    }

    if (isLoading) return <div> <Loading/> </div>

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4  ">
            <div className="border border-accent p-4 space-y-4">
                <h5 className="font-bold font-mono">Existing Roles</h5>
                <div className="flex space-x-4">
                    {existingData.map((role: any) => (
                        <Badge className="" key={role.id}>
                            {role.role_name}
                        </Badge>
                    ))}
                </div>
            </div>

            <div className="border border-accent p-4 space-y-4">
                <h5 className="font-bold font-mono"> Add Role </h5>
                <div
                    className="space-y-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="grid">
                                    <FormField
                                        control={form.control}
                                        name="role_id"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel> Role </FormLabel>
                                                <Select value={String(field.value)} onValueChange={field.onChange}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select Role" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {all_roles.map((role: any) => (
                                                            <SelectItem key={role.role_id} value={String(role.role_id)}>
                                                                {role.role_name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </FormItem>
                                        )}
                                    />

                                </div>
                            </div>
                            <Button type="submit" className="space-x-2">
                                <span> Submit Role </span>
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>


            <div className="border border-accent p-4 space-y-4">
                <h5 className="font-bold font-mono text-destructive"> Delete Roles </h5>
                <div className="flex flex-col flex-wrap gap-2">
                    {existingData.map((role: any) => (
                        <div key={role.id} className="flex items-center justify-between gap-2 border border-gray-300 px-3 py-2 rounded">
                            <Badge className="bg-accent-foreground dark:bg-accent hover:bg-accent-foreground dark:hover:bg-accent">{role.role_name}</Badge>
                            <div className="hover:cursor-pointer"
                                onClick={() => handleDeleteRole(role.user_role_id)}
                            >
                                <Trash weight="duotone" className="mr-2 h-5 w-5 text-[#F03D52]" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>


        </div>
    );
}

export default RoleManagement;