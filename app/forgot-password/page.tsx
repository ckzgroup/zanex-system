"use client";

import Image from "next/image"
import axios from "axios";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {Badge} from "@/components/ui/badge";
import {Card} from "@/components/ui/card";
import React, {useState} from "react";


import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {usePostData} from "@/actions/use-api";
import {toast} from "@/components/ui/use-toast";
import {useRouter} from "next/navigation";
import {regionSchema} from "@/utils/projects/validations/forms";


const formSchema = z.object({
    user_email_address: z.string().email()
})

type FormData = z.infer<typeof formSchema>

export default function ForgotPassword() {
    const router =  useRouter();
    const [loading, setLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false);

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            user_email_address: "",
        },
    })


    async function onSubmit(data: FormData) {
        try {
            await axios.post('https://k-task.ckzgroup.com/api/users/reset', data);

            setLoading(false);
            setIsSuccess(true);
            router.push('/login');
            form.reset();
            toast({
                title: "Check your email!",
                description: "You have successfully reset your password! Kindly check your email address.",
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
        <div className="w-full lg:grid lg:grid-cols-2 min-h-screen">
            <div className="flex items-center justify-center py-12">
                <div className="mx-auto grid w-[350px] gap-6">

                    <div className="flex items-center space-x-4">
                       <div>
                           <Image src='/images/projects/logo.svg' alt='logo' height={80} width={80}/>
                       </div>

                        <div className="flex items-center space-x-4 pb-2">
                            <h1 className="text-3xl md:text-3xl font-bold">Zanex</h1>
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <h1 className="text-3xl font-semibold">Reset Password</h1>
                        <p className="text-balance text-muted-foreground">
                            Enter your email below to reset your password.
                        </p>
                    </div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="user_email_address"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel> Email Address </FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter email" {...field} />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit">Submit</Button>
                        </form>
                    </Form>

                    {/*<div className="mt-4 text-center text-sm">*/}
                    {/*    Don&apos;t have an account?{" "}*/}
                    {/*    <Link href="#" className="underline">*/}
                    {/*        Sign up*/}
                    {/*    </Link>*/}
                    {/*</div>*/}

                </div>
            </div>
          <div className="hidden lg:block bg-center bg-no-repeat h-full
                bg-[url('https://images.unsplash.com/photo-1658959305360-b942374cb042?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')]">
            <div className="flex items-center justify-center h-full w-full text-white">
              <div className="flex flex-col items-center space-y-6">
                <Image
                  src="/images/projects/white-logo.svg"
                  alt="logo"
                  height={120}
                  width={120}
                />

                <div className="flex items-center space-x-4 pb-8">
                  <h1 className="text-4xl md:text-5xl font-bold">Zanex</h1>
                </div>

                <Card className="p-6 text-white w-[60%] mx-auto border-white/40 bg-white/10 backdrop-blur-md">
                  <p className="text-lg text-center font-medium">
                    Enhance productivity and streamline your workflow with Zanex:
                    the All-In-One platform for seamless Project and Service
                    Management, delivering effortless precision and simplicity.
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </div>
    )
}
