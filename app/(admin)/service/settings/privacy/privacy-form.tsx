"use client"

import * as z from "zod";
import axios from "axios";
import {useRouter} from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {toast} from "@/components/ui/use-toast";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import useAuthStore from "@/hooks/use-user";
import * as React from "react";
import { passwordSchema } from "@/utils/projects/validations/forms";
import {Icons} from "@/components/ui/icons";
import {Eye, EyeSlash} from "@phosphor-icons/react";

type FormData = z.infer<typeof passwordSchema>

export function PrivacyForm() {
    const router = useRouter();
    const [showPassword, setShowPassword] = React.useState<boolean>(false); // State for password visibility

    // @ts-ignore
    const  { user }= useAuthStore();
    const email = user?.result?.user_email_address;

    const form = useForm<FormData>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            new_user_password: "",
            old_user_password: "",
            user_email_address: email,
            // confirm_new_password: "",
        }
    });

    const [isLoading, setIsLoading] = React.useState<boolean>(false)


    async function onSubmit(data: FormData, event: any) {

        try {
            setIsLoading(true);
            const https = require('http');
            const httpsAgent = new https.Agent({
                rejectUnauthorized: false,
            });


            const response = await axios.post(`https://qtask-v3-service.qtask.net:5559/api/users/resetPassword`, data, {
                headers: {
                    "Content-Type": "application/json",
                },
                method: 'POST',
                insecureHTTPParser: true,
                httpsAgent: httpsAgent
            });
            // const password = response.data["message"];
            if (response.status === 200) {

                router.refresh();
                toast({
                    title: "Password updated!",
                    description: "You have successfully updated your company password.",
                });

            } else {
                // Handle other HTTP status codes
                setIsLoading(false);
                toast({
                    title: "Wrong Current Password",
                    description: "Kindly check your current password and try again.",
                    variant: "destructive"
                });
            }
        } catch (error) {
            console.log(error);
            toast({
                title: "Wrong Current Password",
                description: "Kindly check your current password and try again.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }

    }

    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                    <div className="grid gap-1">
                        <FormField
                            control={form.control}
                            name="old_user_password"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel className='font-semibold'>Current Password</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                type={showPassword ? "text" : "password"} // Toggle input type
                                                placeholder="Enter current password" {...field} />
                                            <button
                                                type="button"
                                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                                                onClick={() => setShowPassword(!showPassword)} // Toggle state
                                            >
                                                {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                                            </button>
                                        </div>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid gap-1">
                        <FormField
                            control={form.control}
                            name="new_user_password"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel className='font-semibold'>New Password</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                type={showPassword ? "text" : "password"} // Toggle input type
                                                placeholder="Enter new password"  {...field} />
                                            <button
                                                type="button"
                                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                                                onClick={() => setShowPassword(!showPassword)} // Toggle state
                                            >
                                                {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                                            </button>
                                        </div>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid gap-1">
                        <FormField
                            control={form.control}
                            name="confirm_new_password"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel className='font-semibold'>Confirm New Password</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input type={showPassword ? "text" : "password"} // Toggle input type
                                                   placeholder="Enter new password again" {...field} />
                                            <button
                                                type="button"
                                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                                                onClick={() => setShowPassword(!showPassword)} // Toggle state
                                            >
                                                {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                                            </button>
                                        </div>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>

                    <hr/>

                    <div className='pt-12 space-x-4 flex justify-end'>
                        <Button type="reset" size='lg' variant='outline'>
                            Cancel
                        </Button>

                        <Button type="submit" size='lg' disabled={isLoading}>
                            {isLoading && (
                                <Icons.spinner className="mr-2 h-4 w-4 animate-spin"/>
                            )}
                            Save changes
                        </Button>
                    </div>
                </form>
            </Form>


        </div>
    )
}
