"use client";

import React, {useEffect, useState} from 'react';
import * as z from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";
import {useRouter} from "next/navigation";
import { usePatchData } from "@/actions/use-api";
import {toast} from "@/components/ui/use-toast";
import {useSingleProjectService, useSingleService} from "@/actions/get-service";
import Loading from "@/app/(admin)/(projects)/loading";


const projectServiceSchema = z.object({
    service_name: z.string(),
    service_description: z.string(),
    project_service_id: z.coerce.number()
})

type FormData = z.infer<typeof projectServiceSchema>

interface IProps {
    serviceId: any,
    onClose: any

}

function AddProjectServiceForm({ serviceId, onClose }: IProps) {

    const router =  useRouter();
    const [loading, setLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false);

    // @ts-ignore
    const {isLoading: serviceLoading, error: serviceError, data: serviceData } = useSingleProjectService('/project_service/getProjectService', serviceId);
    // const service = serviceData;
    // Check if projectData is defined and has elements
    const service = serviceData && serviceData.length > 0 ? serviceData[0] : null;
    const {
        project_service_id,
        service_name,
        service_description,
    } = service || {};

    const form = useForm<FormData>({
        resolver: zodResolver(projectServiceSchema),
        defaultValues: {
            project_service_id: project_service_id,
            service_name: service_name || '',
            service_description: service_description || '',
        }
    });

    useEffect(() => {
        if (service) {
            form.reset({
                service_name: service.service_name || '',
                project_service_id: service.project_service_id,
                service_description: service.service_description || '',
            });
        }
    }, [service, form]);


    const mutation = usePatchData('/project_service/updateProjectService');

    async function onSubmit(data: FormData) {
        setLoading(true);
        try {
            await mutation.mutateAsync(data);
            setIsSuccess(true);
            router.refresh();
            onClose(); // ✅ Close the dialog after success
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

    if (loading) return <div> <Loading/> </div>

    return (
        <div>
            {service && (
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
                                            <FormLabel> Service Name </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder={service_name}
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
                                    name="service_description"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel> Description </FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder={service_description}
                                                    {...field}
                                                    rows={5}
                                                >
                                                </Textarea>
                                            </FormControl>
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
            )}
        </div>
    );
}

export default AddProjectServiceForm;