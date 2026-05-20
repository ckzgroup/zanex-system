"use client";

import React, {useState} from 'react';
import { zodResolver } from "@hookform/resolvers/zod"
import {useFieldArray, useForm} from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

import {Badge} from "@/components/ui/badge";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {CloudCheck, PencilSimpleLine, Plus, Trash, X} from "@phosphor-icons/react";
import {usePathname, useRouter} from "next/navigation";
import useAuthStore from "@/hooks/use-user";
import useFetchData, {usePostData} from "@/actions/use-api";
import {toast} from "@/components/ui/use-toast";
import {useSingleSegment} from "@/actions/get-project-segment";

const materialKpiSchema = z.array(z.object({
    segment_id: z.number(),
    material_id: z.string().nonempty(),
    user_id: z.string(),
    material_status: z.string(),
}));

const serviceKpiSchema = z.array(z.object({
    segment_id: z.number(),
    service_id: z.string().nonempty(),
    user_id: z.string(),
    service_status: z.string(),
}));

type FormData = {
    materials: z.infer<typeof materialKpiSchema>;
    services: z.infer<typeof serviceKpiSchema>;
};

function AssignKpiForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const user = useAuthStore((state) => state.user?.result.user_id);
    const user_id = user?.toString();

    const pathname = usePathname();
    const project_id = parseInt(pathname.replace('/projects/', ''));
    const segment_id = parseInt(pathname.replace(`/projects/${project_id}/segments/`, ''));



    const material_form = useForm<FormData>({
        resolver: zodResolver(z.object({ materials: materialKpiSchema })),
        defaultValues: {
            materials: [
                {
                    segment_id: segment_id,
                    material_id: "",
                    user_id: user_id,
                    material_status: "Active",
                }
            ]
        }
    });

    const service_form = useForm<FormData>({
        resolver: zodResolver(z.object({ services: serviceKpiSchema })),
        defaultValues: {
            services: [
                {
                    segment_id: segment_id,
                    service_id: "",
                    user_id: user_id,
                    service_status: "Active",
                }
            ]
        }
    });

    const { control, handleSubmit } = material_form;
    const { control:serviceControl } = service_form;

    const { fields: materialFields,
        append: materialAppend,
        remove: materialRemove,} = useFieldArray({ control, name: "materials" });

    const {
        fields: serviceFields,
        append: serviceAppend,
        remove: serviceRemove,
    } = useFieldArray({ control: serviceControl, name: "services" });

    // Post Material API
    const mutationMaterial = usePostData('/project_bom_kpi');

    // Post Service API
    const mutationService = usePostData('/project_service_kpi');

    // GET SERVICES
    const { isLoading:serviceLoading, error:serviceError, data:service_data } = useFetchData('/project_service/getProjectServices');
    const services_data = Array.isArray(service_data) ? service_data.reverse() : [];

    async function onSubmitMaterial(data: FormData) {
        try {
            setLoading(true);
            await mutationMaterial.mutateAsync(data.materials);
            setIsSuccess(true);
            router.refresh();
            material_form.reset();
            toast({
                title: "Material KPIs added!",
                description: "You have successfully added a Material KPIs.",
                variant: "default"
            });
        } catch (error) {
            setIsSuccess(false);
            console.error('Mutation failed:', error);
            toast({
                title: "Error",
                description: "An unexpected error occurred. Please try again later.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    }

    async function onSubmitService(data: FormData) {
        try {
            setLoading(true);
            await mutationService.mutateAsync(data.services);
            setIsSuccess(true);
            router.refresh();
            service_form.reset();
            toast({
                title: "Service KPIs added!",
                description: "You have successfully added a Service KPIs.",
                variant: "default"
            });
        } catch (error) {
            setIsSuccess(false);
            toast({
                title: "Error",
                description: "An unexpected error occurred. Please try again later.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    }

    const { isLoading, error, data:Materials } = useSingleSegment('/project_segment_bom', segment_id)
    const materials = Array.isArray(Materials) ? Materials.reverse() : [];

    const { isLoading: materialLoading, error:materialError, data:submittedMaterials } = useSingleSegment('/project_bom_kpi', segment_id)
    const { isLoading: servicesLoading, error:servicesError, data:submittedServices } = useSingleSegment('/project_service_kpi', segment_id)

    const materialKpis = Array.isArray(submittedMaterials) ? submittedMaterials.reverse() : [];

    const { isLoading:sLoading, error:sError, data:services } = useSingleSegment('/project_segment_service', segment_id)

    const kpiServices = Array.isArray(services) ? services.reverse() : [];

    console.log(submittedMaterials)

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div
                    className="border border-dashed border-primary/30 rounded-lg p-6 shadow-inner shadow-primary/10 space-y-6">
                    <Badge className="text-primary bg-primary/15 text-base py-2 px-4 hover:bg-primary/15">
                        Material KPIs
                    </Badge>
                    {submittedMaterials ? (
                        <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                            {submittedMaterials.map((material: any, index: number) => (
                                <div key={index} className="py-3 px-4 border border-muted-foreground/30 rounded-lg">
                                    <p className="font-semibold"> {material.itemCode} </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No Material KPIs submitted yet.</p>
                    )}
                </div>

                <div
                    className="border border-dashed border-primary/30 rounded-lg p-6 shadow-inner shadow-primary/10 space-y-6">
                    <Badge className="text-orange-500 bg-orange-500/15 text-base py-2 px-4 hover:bg-orange-500/15">
                        Service KPIs
                    </Badge>

                    {submittedServices ? (
                        <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                            {submittedServices.map((service: any, index: number) => (
                                <div key={index} className="py-3 px-4 border border-muted-foreground/30 rounded-lg">
                                    <p className="font-semibold"> {service.service_name} </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No Service KPIs submitted yet.</p>
                    )}
                </div>

                <div className="space-y-4">
                    <Form {...material_form}>
                        <form onSubmit={material_form.handleSubmit(onSubmitMaterial)} className="space-y-8">
                            <div
                                className="border border-dashed border-primary/30 rounded-lg p-6 shadow-inner shadow-primary/10 space-y-6">

                                {materialFields.map((field, index) => (
                                    <div className="grid grid-cols-7 gap-6 w-full" key={index}>
                                        <div className="col-span-5">
                                            <FormField
                                                control={material_form.control}
                                                name={`materials.${index}.material_id`}
                                                render={({field}) => (
                                                    <FormItem>
                                                        <FormLabel> Material </FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue="" >
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select material"/>
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {materials.map((item: any, index: number) => (
                                                                    <SelectItem value={String(item.bom_material_id)} key={index}>
                                                                        {String(item.material_id)}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage/>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="flex items-center space-x-4 pt-6">
                                            <Button variant="outline" onClick={() => materialRemove(index)}
                                                    className="space-x-2 text-destructive border-destructive">
                                                <Trash weight="duotone" size={20}/>
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="space-x-1 text-primary border-primary bg-primary/10 w-fit"
                                    onClick={() => materialAppend({
                                        segment_id: segment_id,
                                        material_id: "", //@ts-ignore
                                        user_id: user_id,
                                        material_status: "Active",
                                    })}
                                >
                                    <Plus size={16}/>
                                    <span> Add Material KPI </span>
                                </Button>
                            </div>

                            <div className="flex items-center space-x-4 justify-start pt-2">
                                <Button type="reset"
                                        className="bg-destructive/15 hover:bg-destructive/20 border border-destructive text-destructive space-x-2">
                                    <X size={20}/>
                                    <span> Cancel </span>
                                </Button>
                                <Button type="submit" className="space-x-2">
                                    <CloudCheck size={20}/>
                                    <span> Save </span>
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>


                <div className="space-y-4">
                    <Form {...service_form}>
                        <form onSubmit={service_form.handleSubmit(onSubmitService)} className="space-y-8">
                            <div
                                className="border border-dashed border-primary/30 rounded-lg p-6 shadow-inner shadow-primary/10 space-y-6">

                                {serviceFields.map((field, index) => (
                                    <div key={index} className="grid grid-cols-7 gap-6 w-full">
                                        <div className="col-span-5">
                                            <FormField
                                                control={service_form.control}
                                                name={`services.${index}.service_id`}
                                                render={({field}) => (
                                                    <FormItem>
                                                        <FormLabel> Service </FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue="">
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select service"/>
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {kpiServices.map((service: any, index: number) => (
                                                                    <SelectItem
                                                                        key={index}
                                                                        value={`${service.implementation_service_id}`}
                                                                    >
                                                                        {service.service_name}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage/>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="flex items-center space-x-4 pt-6">

                                            <Button variant="outline" onClick={() => serviceRemove(index)}
                                                    className="space-x-2 text-destructive border-destructive">
                                                <Trash weight="duotone" size={20}/>
                                            </Button>
                                        </div>
                                    </div>
                                ))}

                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="space-x-1 text-primary border-primary bg-primary/10 w-fit"
                                    onClick={() => serviceAppend({
                                        segment_id: segment_id,
                                        service_id: "", //@ts-ignore
                                        user_id: user_id,
                                        service_status: "Active",
                                    })}
                                >
                                    <Plus size={16}/>
                                    <span> Add Service KPI </span>
                                </Button>
                            </div>

                            <div className="flex items-center space-x-4 justify-start pt-2">
                                <Button type="reset"
                                        className="bg-destructive/15 hover:bg-destructive/20 border border-destructive text-destructive space-x-2">
                                    <X size={20}/>
                                    <span> Cancel </span>
                                </Button>
                                <Button type="submit" className="space-x-2">
                                    <CloudCheck size={20}/>
                                    <span> Save </span>
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
}

export default AssignKpiForm;