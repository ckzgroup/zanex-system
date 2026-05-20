"use client";

import React, {useState} from 'react';
import * as z from "zod";
import {clientSchema, regionSchema, serviceSchema} from "@/utils/projects/validations/forms";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {CloudCheck, PencilSimpleLine, Trash} from "@phosphor-icons/react";
import {Textarea} from "@/components/ui/textarea";
import {usePostData} from "@/actions/use-api";
import {toast} from "@/components/ui/use-toast";
import useAuthStore from "@/hooks/use-user";
import {useRouter} from "next/navigation";
import {SheetClose} from "@/components/ui/sheet";

interface AddServiceFormProps extends React.HTMLAttributes<HTMLDivElement> {}

type FormData = z.infer<typeof regionSchema>

function AddRegionForm({ className, ...props }: AddServiceFormProps) {

    const router =  useRouter();
    const [loading, setLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false);
    const company_id = useAuthStore((state) => state.user?.result.user_company_id);

    const form = useForm<FormData>({
        resolver: zodResolver(regionSchema),
        defaultValues: {
            region_name: "",
            region_description: "",
            region_company_id: `${company_id}`
        }
    });

    const mutation = usePostData('/radar/region');

    async function onSubmit(data: FormData) {
        try {
            await mutation.mutateAsync(data);
            setLoading(false);
            setIsSuccess(true);
            router.push('/regions');
            form.reset();
            toast({
                title: "Region added!",
                description: "You have successfully added a region.",
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
                                name="region_name"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Region Name</FormLabel>
                                        <FormControl>
                                            <Input disabled={loading} placeholder="Enter region name" {...field}
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
                                name="region_description"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea disabled={loading} placeholder="Description" {...field} rows={5}
                                                      ></Textarea>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    {isSuccess ? (
                        <SheetClose asChild>
                            <Button type="button" className="space-x-2">
                                <span> Region Added! </span>
                            </Button>
                        </SheetClose>
                    ) : (
                        <Button type="submit" className="space-x-2" disabled={loading}>
                            <span> Add Region </span>
                        </Button>
                    )}

                </form>
            </Form>
        </div>
    );
}

export default AddRegionForm;