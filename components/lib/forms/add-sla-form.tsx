import React, {useState} from 'react';
import * as z from 'zod';
import { slaSchema } from '@/utils/services/validations/forms';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { PencilSimpleLine, Plus, Trash } from '@phosphor-icons/react';
import {usePathname, useRouter} from "next/navigation";
import useFetchData, {usePostData} from "@/actions/use-api";
import useAuthStore from "@/hooks/use-user";
import {toast} from "@/components/ui/use-toast";

interface AddClientFormProps extends React.HTMLAttributes<HTMLDivElement> {}

type FormData = z.infer<typeof slaSchema>;

function AddSLAForm({ className, ...props }: AddClientFormProps) {

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

    const form = useForm<FormData>({
        resolver: zodResolver(slaSchema),
        defaultValues: {
            sla_time_hrs: '',
            sla_time_min: '',
            sla_customer_id: customer_id,
            sla_description: '',
            sla_name: '',
            sla_branch_id: company_id,
            service_type_id: '',
            module: [{
                escalation_hrs: '',
                escalation_min: '',
                escalation_contact_person: '',
                escalation_create_by: user_id,
                escalation_branch_id: company_id,
                escalation_message: ''
            }],
        },
    });

    const { control } = form;

    const {
        fields: escalationFields,
        append: escalationAppend,
        remove: escalationRemove,
    } = useFieldArray({ control, name: 'module' });


    const mutation = usePostData('/ticketing');

    async function onSubmit(data: FormData) {

        try {
            setLoading(true);

            await mutation.mutateAsync(data);
            setIsSuccess(true);
            router.refresh();
            toast({
                title: "SLA added!",
                description: "You have successfully added a Case SLA.",
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
                                            <Input placeholder="Enter SLA name" {...field} type="text" />
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
                                                <Input placeholder="0" {...field} type="text" />
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
                                                <Input placeholder="0" {...field} type="text" />
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
                                            <Textarea placeholder="Write description" {...field} rows={3} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <hr />
                        <div className="space-y-4">
                            <h4 className="pb-4 text-base font-semibold">Escalation Matrix</h4>
                            {escalationFields.map((field, index) => (
                                <div key={field.id} className="border border-dashed border-primary/30 rounded-lg p-6 shadow-inner shadow-primary/10 space-y-6">
                                    <div className="grid">
                                        <FormField
                                            control={form.control}
                                            name={`module.${index}.escalation_contact_person`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Contact Person</FormLabel>
                                                    <FormControl>
                                                        <Select onValueChange={field.onChange}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Choose Project Manager"/>
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {users.map((user) => (
                                                                    <SelectItem key={user.user_id}
                                                                                value={`${user.user_id}`}> {user.user_firstname} {user.user_lastname} </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="grid">
                                            <FormField
                                                control={form.control}
                                                name={`module.${index}.escalation_hrs`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Escalation Time (Hours)</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="0" {...field} type="text" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="grid">
                                            <FormField
                                                control={form.control}
                                                name={`module.${index}.escalation_min`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Escalation Time (Minutes)</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="0" {...field} type="text" />
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
                                            name={`module.${index}.escalation_message`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Message</FormLabel>
                                                    <FormControl>
                                                        <Textarea placeholder="Enter message" {...field} rows={3} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <Button variant="outline" className="space-x-2 text-blue-500 border-blue-500">
                                            <PencilSimpleLine weight="duotone" size={20} />
                                        </Button>
                                        <Button variant="outline" onClick={() => escalationRemove(index)} className="space-x-2 text-destructive border-destructive">
                                            <Trash weight="duotone" size={20} />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            <Button type="button" variant="outline" size="sm" className="space-x-1 text-primary border-primary"
                                    onClick={() => escalationAppend(
                                        { escalation_hrs: '',
                                            escalation_min: '',
                                            escalation_contact_person: '',
                                            // @ts-ignore
                                            escalation_create_by: user_id, // @ts-ignore
                                            escalation_branch_id: company_id,
                                            escalation_message: '' })}>
                                <Plus className="h-3 w-3" /> <span>Add SLA</span>
                            </Button>
                        </div>
                    </div>
                    <Button type="submit" size="sm" className="w-full">Add SLA</Button>
                </form>
            </Form>
        </div>
    );
}

export default AddSLAForm;
