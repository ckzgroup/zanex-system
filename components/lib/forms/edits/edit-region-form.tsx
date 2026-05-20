"use client";

import React, {useState} from 'react';
import * as z from "zod";
import {clientSchema, editRegionSchema, regionSchema, serviceSchema} from "@/utils/projects/validations/forms";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {CloudCheck, PencilSimpleLine, Trash} from "@phosphor-icons/react";
import {Textarea} from "@/components/ui/textarea";
import {usePatchData, usePostData} from "@/actions/use-api";
import {toast} from "@/components/ui/use-toast";
import useAuthStore from "@/hooks/use-user";
import {useRouter} from "next/navigation";
import {SheetClose} from "@/components/ui/sheet";
import {useSingleService} from "@/actions/get-service";
import {useSingleRegion} from "@/actions/get-region";

type FormData = z.infer<typeof editRegionSchema>

interface IProps {
    regionId: any
}

function EditRegionForm({ regionId }: IProps) {

    const router =  useRouter();
    const [loading, setLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false);
    const company_id = useAuthStore((state) => state.user?.result.user_company_id);

    // @ts-ignore
    const {isLoading: regionLoading, error: regionError, data: regionData } = useSingleRegion('/radar/region/region', regionId);
    // const region = regionData;
    // Check if projectData is defined and has elements
    const region = regionData && regionData.length > 0 ? regionData[0] : null;
    const {
        region_id,
        region_name,
        region_description,
    } = region || {};



    const form = useForm<FormData>({
        resolver: zodResolver(editRegionSchema),
        defaultValues: {
            region_name: region_name || "",
            region_description: region_description || "",
            region_id: region_id,
        }
    });
    const mutation = usePatchData('/radar/region');

    async function onSubmit(data: FormData) {
        try {
            await mutation.mutateAsync(data);
            setLoading(false);
            setIsSuccess(true);
            router.push('/regions');
            form.reset();
            toast({
                title: "Region Updated!",
                description: "You have successfully updated region details.",
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
                                            <Input disabled={loading} defaultValue={region_name} placeholder={region_name} {...field}
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
                                            <Textarea disabled={loading} defaultValue={region_description} placeholder={region_description} {...field} rows={5}
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
                                <span> Region Updated! </span>
                            </Button>
                        </SheetClose>
                    ) : (
                        <Button type="submit" className="space-x-2" disabled={loading}>
                            <span> Update Region </span>
                        </Button>
                    )}

                </form>
            </Form>
        </div>
    );
}

export default EditRegionForm;