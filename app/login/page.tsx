"use client";

import "@/app/main.css";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userAuthSchema } from "@/utils/projects/validations/auth";
import useAuthStore from "@/hooks/use-user";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Icons } from "@/components/ui/icons";
import { SignIn, Eye, EyeSlash } from "@phosphor-icons/react";
import Loading from "@/app/(admin)/(projects)/loading";

type FormData = z.infer<typeof userAuthSchema>;

export default function Login() {
  const form = useForm<FormData>({
    resolver: zodResolver(userAuthSchema),
    defaultValues: {
      user_email_address: "",
      user_password: "",
    },
  });

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [showPassword, setShowPassword] = React.useState<boolean>(false); // State for password visibility

  const authStore = useAuthStore();
  const router = useRouter();

  async function onSubmit(data: FormData) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    try {
      const https = require("http");
      const httpsAgent = new https.Agent({
        rejectUnauthorized: false,
      });
      const response = await axios.post(`${apiUrl}/users/login`, data, {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        insecureHTTPParser: true,
        httpsAgent: httpsAgent,
      });
      if (response.status === 200) {
        const user = response.data; // Assuming the API returns user information on success
        authStore.login(user); // Store user in the Zustand store
        router.push("/");
        console.log(user);
      } else {
        // Handle other HTTP status codes
        toast({
          title: "Error",
          description: "Please check your credentials and try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full lg:grid lg:grid-cols-2 min-h-screen">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="flex items-center space-x-4">
            <div>
              <Image
                src="/images/projects/logo.svg"
                alt="logo"
                height={80}
                width={80}
              />
            </div>

            <div className="flex items-center space-x-4 pb-2">
              <h1 className="text-3xl md:text-3xl font-bold">Zanex</h1>
            </div>
          </div>

          <div className="grid gap-2">
            <h1 className="text-3xl font-semibold">Welcome Back</h1>
            <p className="text-balance text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="user_email_address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Email address"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="user_password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"} // Toggle input type
                            placeholder="Enter password"
                            disabled={isLoading}
                            {...field}
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                            onClick={() => setShowPassword(!showPassword)} // Toggle state
                          >
                            {showPassword ? (
                              <EyeSlash size={20} />
                            ) : (
                              <Eye size={20} />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="my-4 flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="remember" />
                    <label
                      htmlFor="remember"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Remember Me
                    </label>
                  </div>

                  <div>
                    <Link
                      href="/forgot-password"
                      className="text-primary underline font-medium">
                      Forgot Password
                    </Link>
                  </div>
                </div>
                <Button
                  type="submit"
                  className="space-x-2 mt-4"
                  disabled={isLoading}>
                  {isLoading && (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  <span>Log in</span>
                  <SignIn size={20} weight="duotone" />
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase"></div>
                </div>
              </div>
            </form>
          </Form>
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
  );
}
