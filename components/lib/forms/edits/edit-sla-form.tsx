import React, {useState} from 'react';
import * as z from 'zod';
import {editSlaSchema} from '@/utils/services/validations/forms';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { PencilSimpleLine, Plus, Trash } from '@phosphor-icons/react';
import {usePathname, useRouter} from "next/navigation";
import useFetchData, {usePatchData, usePostData} from "@/actions/use-api";
import useAuthStore from "@/hooks/use-user";
import {toast} from "@/components/ui/use-toast";
import {useSingleCustomer} from "@/actions/get-customer";
import {useSingleSla} from "@/actions/get-sla";

interface AddClientFormProps extends React.HTMLAttributes<HTMLDivElement> {}

type FormData = z.infer<typeof editSlaSchema>;

interface IProps {
    slaId: any
}

function EditSLAForm({ slaId }: IProps) {

    const router =  useRouter();
    const [loading, setLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false);

    // GET COMPANY ID
    const company = useAuthStore((state) => state.user?.result.user_company_id);
    const company_id = company?.toString();

    // GET CUSTOMER ID
    const pathname = usePathname()
    const customer_id = parseInt(pathname.replace('/service/customers/',''));

    // GET SERVICES
    const { isLoading:serviceLoading, error:serviceError, data:service_data } = useFetchData('/services');
    const services_data = Array.isArray(service_data) ? service_data.reverse() : [];

    // GET USERS
    const { isLoading:usersLoading, error:usersError, data:users_data } = useFetchData('/users');
    const users = Array.isArray(users_data) ? users_data.reverse() : [];

    // GET USER ID
    const user = useAuthStore((state) => state.user?.result?.user_id);
    const user_id = user?.toString();

    // @ts-ignore
    const {isLoading: slaLoading, error: slaError, data: slaData } = useSingleSla('/ticketing/getSingleSla', slaId);

    // Check if projectData is defined and has elements
    const sla = slaData && slaData.length > 0 ? slaData[0] : null;
    const {
        sla_time_hrs,
        sla_time_min,
        sla_customer_id,
        sla_description,
        sla_name,
        service_type_id,
        sla_id
    } = sla || {};


    const form = useForm<FormData>({
        resolver: zodResolver(editSlaSchema),
        defaultValues: {
            sla_time_hrs: sla_time_hrs || '',
            sla_time_min: sla_time_min || '',
            sla_description: sla_description || '',
            sla_name: sla_name || '',
            service_type_id: service_type_id || '',
            sla_id: slaId,
            sla_customer_id: customer_id,
        },
    });

    const { control } = form;

    const mutation = usePatchData('/ticketing');

    async function onSubmit(data: FormData) {

        try {
            setLoading(true);

            await mutation.mutateAsync(data);
            setIsSuccess(true);
            router.refresh();
            toast({
                title: "SLA Updated!",
                description: "You have successfully updated a Case SLA.",
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
                    <div className="space-y-4">
                        <div className="grid">
                            <FormField
                                control={form.control}
                                name="sla_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>SLA Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder={sla_name} defaultValue={sla_name} {...field} type="text" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="grid">
                            <FormField
                                control={form.control}
                                name="service_type_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Service Type</FormLabel>
                                        <Select onValueChange={field.onChange} >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select service" defaultValue={service_type_id} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {services_data.map((service) => (
                                                    <SelectItem key={service.service_type_id}
                                                                value={`${service.service_type_id}`}> {service.service_name} </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="grid">
                                <FormField
                                    control={form.control}
                                    name="sla_time_hrs"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>SLA Time (Hours)</FormLabel>
                                            <FormControl>
                                                <Input placeholder={sla_time_hrs} defaultValue={sla_time_hrs} {...field} type="text" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="grid">
                                <FormField
                                    control={form.control}
                                    name="sla_time_min"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>SLA Time (Minutes)</FormLabel>
                                            <FormControl>
                                                <Input placeholder={sla_time_min} defaultValue={sla_time_min} {...field} type="text" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <div className="grid">
                            <FormField
                                control={form.control}
                                name="sla_description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>SLA Description</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder={sla_description} defaultValue={sla_description} {...field} rows={3} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                    <Button type="submit" size="sm" className="w-full"> Update Changes </Button>
                </form>
            </Form>
        </div>
    );
}

export default EditSLAForm;
