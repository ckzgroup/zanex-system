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
import {usePatchData, usePostData} from "@/actions/use-api";
import {toast} from "@/components/ui/use-toast";
import useAuthStore from "@/hooks/use-user";
import {useRouter} from "next/navigation";
import {SheetClose} from "@/components/ui/sheet";
import {useSingleRegion} from "@/actions/get-region";
import {useSingleClosureItem} from "@/actions/get-closure-item";

interface AddServiceFormProps extends React.HTMLAttributes<HTMLDivElement> {}

const closureItemSchema = z.object({
    parameter_name: z.string().nonempty(),
    parameter_category: z.string(),
    project_closure_parameter_id: z.coerce.number(),
})

interface IProps {
    closeItemId: any
}

type FormData = z.infer<typeof closureItemSchema>

function EditClosureItemForm({ closeItemId }: IProps) {

    const router =  useRouter();
    const [loading, setLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false);

    // @ts-ignore
    const company = useAuthStore((state) => state.user?.result.user_company_id);
    // @ts-ignore
    const user = useAuthStore((state) => state.user?.result.user_id);

    // @ts-ignore
    const company_id_i = company.toString(); // @ts-ignore
    const user_id = user.toString();


    // @ts-ignore
    const {isLoading: closureLoading, error: closureError, data: closureData } = useSingleClosureItem('/segment_closure/getClosureParameterById', closeItemId);
    // const region = regionData;
    // Check if projectData is defined and has elements
    const closureItem = closureData && closureData.length > 0 ? closureData[0] : null;

    const {
        parameter_category,
        parameter_created_by,
        parameter_name,
        parameter_status,
        project_closure_parameter_id
    } = closureItem || {};


    const form = useForm<FormData>({
        resolver: zodResolver(closureItemSchema),
        defaultValues: {
            project_closure_parameter_id: project_closure_parameter_id,
            parameter_name: parameter_name || "",
            parameter_category: parameter_category || "",
        }
    });


    const mutation = usePatchData('/segment_closure/updateClosureParameter');

    async function onSubmit(data: FormData) {
        try {
            await mutation.mutateAsync(data);
            setLoading(false);
            setIsSuccess(true);
            router.push('/closure-items');
            form.reset();
            toast({
                title: "Closure Item Updated!",
                description: "You have successfully updated closure item details.",
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
                                            <Input disabled={loading} placeholder={parameter_name} {...field}
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
                                        <Select onValueChange={field.onChange} defaultValue={parameter_category}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Choose Category" defaultValue={parameter_category}/>
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
                                <span> Item Updated! </span>
                            </Button>
                        </SheetClose>
                    ) : (
                        <Button type="submit" className="space-x-2" disabled={loading}>
                            <span> Updated Item </span>
                        </Button>
                    )}

                </form>
            </Form>
        </div>
    );
}

export default EditClosureItemForm;