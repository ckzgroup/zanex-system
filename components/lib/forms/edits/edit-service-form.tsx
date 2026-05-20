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
import { editServiceSchema } from "@/utils/services/validations/forms";
import {useRouter} from "next/navigation";
import useAuthStore from "@/hooks/use-user";
import {regionSchema} from "@/utils/projects/validations/forms";
import {usePatchData, usePostData} from "@/actions/use-api";
import {toast} from "@/components/ui/use-toast";
import {useSingleService} from "@/actions/get-service";

type FormData = z.infer<typeof editServiceSchema>

interface IProps {
    serviceId: any
}
function EditServiceForm({ serviceId }: IProps) {

    const router =  useRouter();
    const [loading, setLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false);
    const company_id = useAuthStore((state) => state.user?.result.user_company_id);

    // @ts-ignore
    const {isLoading: serviceLoading, error: serviceError, data: serviceData } = useSingleService('/services/service', serviceId);
    // const service = serviceData;
    // Check if projectData is defined and has elements
    const service = serviceData && serviceData.length > 0 ? serviceData[0] : null;
    const {
        service_name,
        service_type_priority_id,
        service_type_id
    } = service || {};

    const form = useForm<FormData>({
        resolver: zodResolver(editServiceSchema),
        defaultValues: {
            service_name: service_name || "",
            service_type_priority_id: String(service_type_priority_id) || "1",
            service_type_id: String(service_type_id),
        }
    });


    console.log(form.formState.errors)

    const mutation = usePatchData('/services');

    async function onSubmit(data: FormData) {
        try {
            await mutation.mutateAsync(data);
            setLoading(false);
            setIsSuccess(true);
            router.push('/services');
            form.reset();
            toast({
                title: "Service Updated!",
                description: "You have successfully updated service.",
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
                                            <Input
                                                defaultValue={service_name}
                                                placeholder={service_name}
                                                {...field}
                                                type="text"
                                            />
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
                                        <Select onValueChange={field.onChange} defaultValue={field.value} >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Priority" defaultValue={String(service_type_priority_id)} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent >
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
                        <span> Update Service </span>
                    </Button>
                </form>
            </Form>
        </div>
    );
}

export default EditServiceForm;