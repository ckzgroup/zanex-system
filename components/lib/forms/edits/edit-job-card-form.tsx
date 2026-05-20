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
import {editJobCardSchema, jobCardSchema} from "@/data/services/job-card/schema";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Label} from "@/components/ui/label";
import {Switch} from "@/components/ui/switch";
import {useRouter} from "next/navigation";
import useFetchData, {usePatchData, usePostData} from "@/actions/use-api";
import {toast} from "@/components/ui/use-toast";
import {useSingleJobCard} from "@/actions/get-jobcard";


type FormData = z.infer<typeof editJobCardSchema>

interface IProps {
    jobCardId: any
}
function EditJobCardForm({ jobCardId }: IProps) {

    const router =  useRouter();
    const [loading, setLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false);

    // GET SERVICES
    const { isLoading:serviceLoading, error:serviceError, data:service_data } = useFetchData('/services');
    const services_data = Array.isArray(service_data) ? service_data.reverse() : [];


    // @ts-ignore
    const {isLoading: cardLoading, error: cardError, data: cardData } = useSingleJobCard('/services/serviceCategory/single', jobCardId);

    // Check if projectData is defined and has elements
    const jobCard = cardData && cardData.length > 0 ? cardData[0] : null;
    const {
        service_category_id,
        service_category_type_id,
        service_category_name,
        service_category_status,
        data_type_entry,
        photo_required,
        service_type_id,
        service_name,
        service_type_priority_id,
        service_type_branch_id,
        service_type_status
    } = jobCard || {};



    const form = useForm<FormData>({
        resolver: zodResolver(editJobCardSchema),
        defaultValues: {
            service_category_type_id: service_type_id || "",
            service_category_name: service_category_name || "",
            service_category_id: service_category_id,
            data_type_entry: true,
            photo_required: true

        }
    });

    const mutation = usePatchData('services/serviceCategory');

    async function onSubmit(data: FormData) {
        try {
            await mutation.mutateAsync(data);
            setLoading(false);
            setIsSuccess(true);
            router.push('/service/job-card');
            form.reset();
            toast({
                title: "Job Card Updated!",
                description: "You have successfully updated a job card.",
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
                        className="space-y-6">
                        <div className="grid">
                            <FormField
                                control={form.control}
                                name="service_category_name"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Job Card Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder={service_category_name} {...field}
                                                   type="text" defaultValue={service_category_name}/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="grid">
                            <FormField
                                control={form.control}
                                name="service_category_type_id"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Service</FormLabel>
                                        <Select onValueChange={field.onChange}>
                                            <FormControl>
                                                <SelectTrigger >
                                                    <SelectValue placeholder={service_name} defaultValue={service_name}/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent >
                                                {services_data.map((service) => (
                                                    <SelectItem
                                                        key={service.service_type_id}
                                                        value={`${service.service_type_id}`}
                                                        defaultValue={`${service_type_id}`}
                                                    >
                                                        {service.service_name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>

                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid">
                            <FormField
                                control={form.control}
                                name="data_type_entry"
                                render={({ field }) => (
                                    <FormItem className="space-y-3">
                                        <FormLabel>Data Entry Type</FormLabel>
                                        <FormControl>
                                            <RadioGroup
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                className="flex space-x-1"
                                            >
                                                <FormItem className="flex items-center space-x-3 space-y-0">
                                                    <FormControl>
                                                        <RadioGroupItem value="Text Data" />
                                                    </FormControl>
                                                    <FormLabel className="font-normal">
                                                        Text Data
                                                    </FormLabel>
                                                </FormItem>
                                                <FormItem className="flex items-center space-x-3 space-y-0">
                                                    <FormControl>
                                                        <RadioGroupItem value="Numeric Data" />
                                                    </FormControl>
                                                    <FormLabel className="font-normal">
                                                        Numeric Data
                                                    </FormLabel>
                                                </FormItem>
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid pt-2">
                            <FormField
                                control={form.control}
                                name="photo_required"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Photo Required</FormLabel>
                                        <FormControl>
                                            <div className="flex items-center space-x-2">
                                                <Switch id="airplane-mode" defaultChecked={true}/>
                                                <Label htmlFor="airplane-mode" className="text-xs">Default! Photo Required</Label>
                                            </div>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>

                    </div>
                    <Button type="submit" className="space-x-2">
                        <span> Add Job Card </span>
                    </Button>
                </form>
            </Form>
        </div>
    );
}

export default EditJobCardForm;