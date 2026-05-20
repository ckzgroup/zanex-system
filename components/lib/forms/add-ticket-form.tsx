"use client"

import * as React from "react"
import {useRouter, useSearchParams} from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import {useFieldArray, useForm} from "react-hook-form"
import * as z from "zod"

import {Button, buttonVariants} from "@/components/ui/button";
import {toast} from "@/components/ui/use-toast";
import {Input} from "@/components/ui/input";
import {Icons} from "@/components/ui/icons";
import {Textarea} from "@/components/ui/textarea";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {CalendarIcon} from "lucide-react";
import {Calendar} from "@/components/ui/calendar";
import { addDays, format } from "date-fns"
import {cn} from "@/lib/utils";
import useAuthStore from "@/hooks/use-user";
import {useState} from "react";
import useFetchData, { usePostData } from "@/actions/use-api";
import {TimePickerDemo} from "@/components/ui/time-picker-demo";
import {ticketSchema} from "@/utils/services/validations/forms";
import {MultiSelect} from "@/components/ui/multi-select";
import {useSingleCustomer} from "@/actions/get-customer";
import Loading from "@/app/(admin)/(projects)/loading";

interface TicketFormProps extends React.HTMLAttributes<HTMLDivElement> {}

type FormData = z.infer<typeof ticketSchema>

export function AddTicketForm({ className, ...props }: TicketFormProps) {

    const router =  useRouter();
    const [loading, setLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false);
    const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

    // GET CLIENTS
    const { isLoading:clientLoading, error:clientError, data:client_data } = useFetchData('/customers');
    const clients = Array.isArray(client_data) ? client_data.reverse() : [];

    // Fetch SITES based on the selected customer
    const { isLoading: sitesLoading, error: sitesError, data: sitesData } = useSingleCustomer('/radar/site/customer', parseInt(selectedCustomerId || "0"));
    const sites = Array.isArray(sitesData) ? sitesData.reverse() : [];

    // Fetch SLAs based on the selected customer
    const { isLoading, error, data } = useSingleCustomer('/ticketing', parseInt(selectedCustomerId || "0"));
    const slas = Array.isArray(data) ? data.reverse() : [];

    // GET SERVICES
    const { isLoading:serviceLoading, error:serviceError, data:service_data } = useFetchData('/services');
    const services = Array.isArray(service_data) ? service_data.reverse() : [];

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


    // GENERATE CASE NO
    function generateTicketCaseNo() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    const form = useForm<FormData>({
        resolver: zodResolver(ticketSchema),
        defaultValues: {
            ticket_description: '',
            ticket_no: '',
            ticket_actual_time: new Date(),
            ticket_customer_id: "",
            ticket_sla_id: "",
            ticket_subject: '',
            ticket_site_id: "",
            ticket_created_by: user_id,
            ticket_case_no: generateTicketCaseNo(),
            ticket_service_type_id: "",
            ticketAssign: [],
        }
    });

    const mutation = usePostData('/ticketing/createTicket');

    async function onSubmit(data: FormData) {

        try {
            setLoading(true);

            await mutation.mutateAsync(data);
            setIsSuccess(true);
            router.back();
            toast({
                title: "Ticket added!",
                description: "You have successfully added a case ticket.",
                variant: "default"
            });
            // Optionally refetch data after mutation
        } catch (error) {
            setLoading(false);
            setIsSuccess(false);
            toast({
                title: "Ticket Already Exists",
                description: "The Ticket No already exists in the system",
                variant: "destructive"
            });
            // Handle mutation error
        }  finally {
            setLoading(false);
        }
    }

    if (isLoading) return <div> <Loading/> </div>

    return (
        <>
            <div className={cn("grid gap-6", className)} {...props}>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className='pb-12'>
                            <div className='mb-5 space-y-2'>
                                <h1 className='text-lg font-bold font-heading text-primary'> Ticket Details </h1>
                                <p className='text-muted-foreground'> Fill the project ticket information </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="grid gap-1">
                                    <FormField
                                        control={form.control}
                                        name="ticket_no"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel> Ticket No: </FormLabel>
                                                <FormControl>
                                                    <Input disabled={loading} placeholder="TIK 001" {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid gap-1">
                                    <FormField
                                        control={form.control}
                                        name="ticket_subject"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel> Ticket Subject </FormLabel>
                                                <FormControl>
                                                    <Input disabled={loading} placeholder="Enter Subject" {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                </div>


                                <div className="grid gap-1">
                                    <FormField
                                        control={form.control}
                                        name="ticket_customer_id"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel> Customer </FormLabel>
                                                <Select
                                                    onValueChange={(value) => {
                                                        field.onChange(value);
                                                        setSelectedCustomerId(value); // Update selected customer ID
                                                    }}

                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Choose Customer"/>
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {clients.map((client) => (
                                                            <SelectItem key={client.customer_id}
                                                                        value={`${client.customer_id}`}> {client.customer_name} </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                </div>


                                <div className="grid gap-1">
                                    <FormField
                                        control={form.control}
                                        name="ticket_site_id"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel> Site </FormLabel>
                                                <Select onValueChange={field.onChange}>
                                                    <FormControl>
                                                        {sites.length > 0 ? (
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Choose Site"/>
                                                            </SelectTrigger>
                                                        ) : (
                                                            <SelectTrigger>
                                                                <SelectValue
                                                                    placeholder="Add Site for the selected customer"/>
                                                            </SelectTrigger>
                                                        )}
                                                    </FormControl>
                                                    <SelectContent>
                                                        {sites.map((site) => (
                                                            <SelectItem key={site.site_id} value={`${site.site_id}`}>
                                                                {site.site_name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid gap-1">
                                    <FormField
                                        control={form.control}
                                        name="ticket_service_type_id"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel> Service Type </FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue="">
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select service"/>
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {services.map((service) => (
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


                                <div className="grid gap-1">
                                    <FormField
                                        control={form.control}
                                        name="ticket_sla_id"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel> SLA Time </FormLabel>
                                                <Select onValueChange={field.onChange}>
                                                    <FormControl>
                                                        {slas.length > 0 ? (
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select SLA Time"/>
                                                            </SelectTrigger>
                                                        ) : (
                                                            <SelectTrigger>
                                                                <SelectValue
                                                                    placeholder="Add SLA for the selected customer"/>
                                                            </SelectTrigger>
                                                        )}
                                                    </FormControl>
                                                    <SelectContent>
                                                        {slas.map((sla) => (
                                                            <SelectItem key={sla.sla_id} value={`${sla.sla_id}`}>
                                                                {sla.sla_name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid gap-1">
                                        <div>
                                            <FormField
                                                control={form.control} // @ts-ignore
                                                name={`ticketAssign`}
                                                render={({field}) => (
                                                    <FormItem>
                                                        <FormLabel> Assign To </FormLabel>
                                                        <MultiSelect
                                                            options={dynamicOptions}
                                                            onValueChange={field.onChange}// @ts-ignore
                                                            defaultValue={field.value}
                                                            placeholder="Select options"
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
                                        name="ticket_actual_time"
                                        render={({field}) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel className="text-left">DateTime</FormLabel>
                                                <Popover>
                                                    <FormControl>
                                                        <PopoverTrigger asChild>
                                                            <Button
                                                                variant="outline"
                                                                className={cn(
                                                                    "w-[280px] justify-start text-left font-normal",
                                                                    !field.value && "text-muted-foreground"
                                                                )}
                                                            >
                                                                <CalendarIcon className="mr-2 h-4 w-4"/>
                                                                {field.value ? (
                                                                    format(field.value, "PPP HH:mm:ss")
                                                                ) : (
                                                                    <span>Pick a date</span>
                                                                )}
                                                            </Button>
                                                        </PopoverTrigger>
                                                    </FormControl>
                                                    <PopoverContent className="w-auto p-0">
                                                        <Calendar
                                                            mode="single"
                                                            selected={field.value}
                                                            onSelect={field.onChange}
                                                            initialFocus
                                                        />
                                                        <div className="p-3 border-t border-border">
                                                            <TimePickerDemo
                                                                setDate={field.onChange}
                                                                date={field.value}
                                                            />
                                                        </div>
                                                    </PopoverContent>
                                                </Popover>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                            </div>
                        </div>


                        <div className='pb-12'>
                            <div className="grid gap-1">
                                <FormField
                                    control={form.control}
                                    name="ticket_description"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel> Ticket Instructions </FormLabel>
                                            <FormControl>
                                                <Textarea disabled={loading} rows={5}
                                                          placeholder="Write Instruction" {...field} ></Textarea>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>

                        </div>

                        <Button type="submit" disabled={loading} size="lg">
                            {loading && (
                                <Icons.spinner className="mr-2 h-4 w-4 animate-spin"/>
                            )}
                            <span> Add Case </span>
                        </Button>
                    </form>
                </Form>
            </div>
        </>
    )
}
