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
import useAuthStore from "@/hooks/use-user";
import {usePathname, useRouter} from "next/navigation";
import useFetchData, {usePatchData, usePostData} from "@/actions/use-api";
import {toast} from "@/components/ui/use-toast";
import {useSingleUser} from "@/actions/get-user";
import {useSingleSite} from "@/actions/get-site";
import Loading from "@/app/(admin)/(projects)/loading";

interface AddSiteFormProps extends React.HTMLAttributes<HTMLDivElement> {}

const siteEditSchema = z.object({
    site_id: z.coerce.number(),
    site_name: z.string().optional(),
    site_latitude: z.string().optional(),
    site_longtitude: z.string().optional(),
    site_description: z.string().optional(),
    site_region_id: z.string().optional()
})


type FormData = z.infer<typeof siteEditSchema>

interface IProps {
    siteId: any,
    onClose: any

}

function EditSiteForm({ siteId, onClose }: IProps) {

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


    // @ts-ignore
    const {isLoading: siteLoading, error: siteError, data: siteData } = useSingleSite('/maintenance/getSiteById', siteId);

    const site = Array.isArray(siteData) && siteData.length > 0 ? siteData[0] : {};

    const {
        site_description,
        site_id,
        site_latitude,
        site_longtitude,
        site_name,
        site_region_id,
        } = site ;



    const form = useForm<FormData>({
        resolver: zodResolver(siteEditSchema),
        defaultValues: {
            site_id: site_id,
            site_name: site_name || "",
            site_latitude: site_latitude || "",
            site_longtitude: site_longtitude || "",
            site_description: site_description || "",
            site_region_id: site_region_id || '',
        }
    });


    const mutation = usePatchData('/maintenance/updateSite');

    async function onSubmit(data: FormData) {

        try {
            setLoading(true);

            await mutation.mutateAsync(data);
            setIsSuccess(true);
            router.refresh();
            onClose(); // ✅ Close the dialog after success
            toast({
                title: "Site Updated!",
                description: "You have successfully updated a site.",
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

    console.log(form.formState.errors)

    if (siteLoading) return <div> <Loading/> </div>;

    return (
        <div>
            { siteData && (
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
                                                <Input
                                                    placeholder={site_name}
                                                    defaultValue={site_name}
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
                                    name="site_region_id"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Region</FormLabel>
                                            <Select onValueChange={field.onChange}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Choose Region" defaultValue={site_region_id}/>
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
                                                <Input
                                                    placeholder={site_longtitude}
                                                    defaultValue={site_longtitude} {...field}
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
                                                <Input
                                                    placeholder={site_latitude}
                                                    defaultValue={site_latitude} {...field}
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
                                                <Textarea
                                                    placeholder={site_description}
                                                    defaultValue={site_description} {...field} rows={3}
                                                ></Textarea>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>

                        </div>
                        <Button type="submit" className="space-x-2">
                            <span> Update Site </span>
                        </Button>
                    </form>
                </Form>
            ) }
        </div>
    );
}

export default EditSiteForm;