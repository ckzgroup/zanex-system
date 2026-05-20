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
import {usePostData} from "@/actions/use-api";
import {toast} from "@/components/ui/use-toast";
import useAuthStore from "@/hooks/use-user";
import {useRouter} from "next/navigation";
import {SheetClose} from "@/components/ui/sheet";

interface AddServiceFormProps extends React.HTMLAttributes<HTMLDivElement> {}

const closureItemSchema = z.object({
    parameter_name: z.string().nonempty(),
    company_id: z.string(),
    parameter_category: z.string(),
    parameter_created_by: z.string(),
})

type FormData = z.infer<typeof closureItemSchema>

function AddClosureItemForm({ className, ...props }: AddServiceFormProps) {

    const router =  useRouter();
    const [loading, setLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false);

    // @ts-ignore
    const company = useAuthStore((state) => state.user?.result.user_company_id);
    // @ts-ignore
    const user = useAuthStore((state) => state.user?.result.user_id);

    // @ts-ignore
    const company_id = company.toString(); // @ts-ignore
    const user_id = user.toString();

    const form = useForm<FormData>({
        resolver: zodResolver(closureItemSchema),
        defaultValues: {
            parameter_name: "",
            parameter_category: "",
            company_id: company_id,
            parameter_created_by: `${user_id}`
        }
    });

    const mutation = usePostData('/segment_closure/createClosureParameter');

    async function onSubmit(data: FormData) {
        try {
            await mutation.mutateAsync(data);
            setLoading(false);
            setIsSuccess(true);
            router.push('/regions');
            form.reset();
            toast({
                title: "Closure Item added!",
                description: "You have successfully added a closure item.",
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
                                name="parameter_name"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input disabled={loading} placeholder="Enter item name" {...field}
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
                                name="parameter_category"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel> Category </FormLabel>
                                        <Select onValueChange={field.onChange}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Choose Category"/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                    <SelectItem value="Acceptance"> Acceptance </SelectItem>
                                                    <SelectItem value="Handover"> Handover </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    {isSuccess ? (
                        <SheetClose asChild>
                            <Button type="button" className="space-x-2">
                                <span> Item Added! </span>
                            </Button>
                        </SheetClose>
                    ) : (
                        <Button type="submit" className="space-x-2" disabled={loading}>
                            <span> Add Item </span>
                        </Button>
                    )}

                </form>
            </Form>
        </div>
    );
}

export default AddClosureItemForm;