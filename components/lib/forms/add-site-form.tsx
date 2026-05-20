"use client";

import React, {useState} from 'react';
import * as z from "zod";
import { siteSchema } from "@/utils/services/validations/forms";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {CloudCheck, PencilSimpleLine, Trash} from "@phosphor-icons/react";
import {Textarea} from "@/components/ui/textarea";
import useAuthStore from "@/hooks/use-user";
import {usePathname, useRouter} from "next/navigation";
import useFetchData, {usePostData} from "@/actions/use-api";
import {toast} from "@/components/ui/use-toast";

interface AddSiteFormProps extends React.HTMLAttributes<HTMLDivElement> {}

type FormData = z.infer<typeof siteSchema>

function AddSiteForm({ className, ...props }: AddSiteFormProps) {

    const router =  useRouter();
    const [loading, setLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false);

    // GET COMPANY ID
    const company = useAuthStore((state) => state.user?.result.user_company_id);
    const company_id = company?.toString();

    // GET CUSTOMER ID
    const pathname = usePathname()
    const customer_id = parseInt(pathname.replace('/service/customers/',''));

    // GET USER ID
    const user = useAuthStore((state) => state.user?.result.user_id);
    const user_id = user?.toString();

    // GET REGIONS
    const { isLoading:regionLoading, error:regionError, data:region_data } = useFetchData('/radar/region');
    const regions = Array.isArray(region_data) ? region_data.reverse() : [];

    const form = useForm<FormData>({
        resolver: zodResolver(siteSchema),
        defaultValues: {
            site_name: "",
            site_company_id: company_id,
            site_latitude: "",
            site_longtitude: "",
            site_description: "",
            site_customer_id: customer_id,
            site_region_id: '',
            site_created_by: user_id,
        }
    });

    const mutation = usePostData('/radar/site');

    async function onSubmit(data: FormData) {

        try {
            setLoading(true);

            await mutation.mutateAsync(data);
            setIsSuccess(true);
            router.refresh();
            toast({
                title: "Site added!",
                description: "You have successfully added a site.",
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
                                name="site_name"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Site Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter site name" {...field}
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
                                name="site_region_id"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Region</FormLabel>
                                        <Select onValueChange={field.onChange}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Choose Region"/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {regions.map((region) => (
                                                    <SelectItem key={region.region_id}
                                                                value={`${region.region_id}`}> {region.region_name} </SelectItem>
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
                                name="site_longtitude"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Longitude Co-ordinates</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter longitude Co-ordinates" {...field}
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
                                name="site_latitude"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Latitude Co-ordinates</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter latitude Co-ordinates" {...field}
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
                                name="site_description"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Site description</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Write site description" {...field} rows={3}
                                            ></Textarea>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>

                    </div>
                    <Button type="submit" className="space-x-2">
                        <span> Add Site </span>
                    </Button>
                </form>
            </Form>
        </div>
    );
}

export default AddSiteForm;