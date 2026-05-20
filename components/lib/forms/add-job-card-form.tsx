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
import {jobCardSchema} from "@/data/services/job-card/schema";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Label} from "@/components/ui/label";
import {Switch} from "@/components/ui/switch";
import {useRouter} from "next/navigation";
import useFetchData, { usePostData} from "@/actions/use-api";
import {toast} from "@/components/ui/use-toast";

interface AddJobCardFormProps extends React.HTMLAttributes<HTMLDivElement> {}

type FormData = z.infer<typeof jobCardSchema>

function AddJobCardForm({ className, ...props }: AddJobCardFormProps) {

    const router =  useRouter();
    const [loading, setLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false);

    // GET SERVICES
    const { isLoading:serviceLoading, error:serviceError, data:service_data } = useFetchData('/services');
    const services_data = Array.isArray(service_data) ? service_data.reverse() : [];


    const form = useForm<FormData>({
        resolver: zodResolver(jobCardSchema),
        defaultValues: {
            service_category_type_id: "",
            service_category_name: "",
            service_category_status: "Active",
            data_type_entry: "",
            photo_required: true,

        }
    });

    const mutation = usePostData('services/serviceCategory');

    async function onSubmit(data: FormData) {
        try {
            await mutation.mutateAsync(data);
            setLoading(false);
            setIsSuccess(true);
            router.push('/service/job-card');
            form.reset();
            toast({
                title: "Job Card added!",
                description: "You have successfully added a job card.",
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
                                            <Input placeholder="Enter job card name name" {...field}
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
                                name="service_category_type_id"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Service</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue="">
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select service"/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {services_data.map((service) => (
                                                    <SelectItem key={service.service_type_id}
                                                                value={`${service.service_type_id}`}> {service.service_name} </SelectItem>
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

export default AddJobCardForm;