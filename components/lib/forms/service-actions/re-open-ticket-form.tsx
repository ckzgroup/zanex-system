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
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Label} from "@/components/ui/label";
import {Switch} from "@/components/ui/switch";
import {usePathname, useRouter} from "next/navigation";
import useFetchData, {usePatchData, usePostData} from "@/actions/use-api";
import {toast} from "@/components/ui/use-toast";
import {useSingleJobCard} from "@/actions/get-jobcard";
import {useSingleTicket} from "@/actions/get-ticket";
import useAuthStore from "@/hooks/use-user";
import {MultiSelect} from "@/components/ui/multi-select";


const reOpenSchema = z.object({
    agent_id: z.array(z.string()).nonempty('At least one agent assignment is required'),
    re_open_reason: z.string().nonempty(),
    reopenTime: z.any(),
    ticket_id: z.coerce.number(),
    userId: z.string()

})

type FormData = z.infer<typeof reOpenSchema>

interface IProps {
    ticketId: any
}
function ReOpenTicketForm({ ticketId }: IProps) {

    const router =  useRouter();
    const [loading, setLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false);

    // GET USERS
    const { isLoading:usersLoading, error:usersError, data:users_data } = useFetchData('/users');
    const users = Array.isArray(users_data) ? users_data.reverse() : [];

    // GET USER ID
    const user = useAuthStore((state) => state.user?.result.user_id);
    const user_id = user?.toString();

    // Check if the data is available and is an array
    const dynamicOptions = Array.isArray(users_data) ? users_data.map(user => ({
        value: user ? user.user_id.toString() : '', // or any unique identifier from the supervisor data
        label: user.user_firstname + " " + user.user_lastname // or the name or any other label you want to display
    })) : [];
// Combine static and dynamic options
    const assigned_users = [...dynamicOptions];


    const form = useForm<FormData>({
        resolver: zodResolver(reOpenSchema),
        defaultValues: {
            agent_id: [],
            reopenTime: new Date(),
            userId: user_id,
            re_open_reason: "",
            ticket_id: ticketId,
        }
    });

    const mutation = usePostData('/maintenance/reOpenTicket');

    async function onSubmit(data: FormData) {
        try {
            await mutation.mutateAsync(data);
            setLoading(false);
            setIsSuccess(true);
            router.push('/service/cases');
            form.reset();
            toast({
                title: "Ticket Re-Opened!",
                description: "You have successfully re-open a ticket.",
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

                        <div className="grid gap-1">
                            <div>
                                <FormField
                                    control={form.control} // @ts-ignore
                                    name={`agent_id`}
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel> Assign To </FormLabel>
                                            <MultiSelect
                                                options={dynamicOptions}
                                                onValueChange={field.onChange}// @ts-ignore
                                                defaultValue={field.value}
                                                placeholder="Select Technician"
                                                variant="inverted"
                                                animation={2}
                                                maxCount={3}
                                            />
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="grid gap-1">
                            <FormField
                                control={form.control}
                                name="re_open_reason"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel> Re-Open Reason </FormLabel>
                                        <FormControl>
                                            <Textarea disabled={loading} rows={5}
                                                      placeholder="Write reason " {...field} ></Textarea>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>

                    </div>
                    <Button type="submit" className="space-x-2">
                        <span> Submit </span>
                    </Button>
                </form>
            </Form>
        </div>
    );
}

export default ReOpenTicketForm;