"use client";

import React, { useState } from 'react';
import * as z from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { segmentMaterialSchema } from "@/utils/projects/validations/forms";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useAuthStore from "@/hooks/use-user";
import { Plus, Trash, CloudCheck, X } from "@phosphor-icons/react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import useFetchData, {useNormalFetchData, usePostData} from "@/actions/use-api";
import { Card } from "@/components/ui/card";
import {useSingleSegment} from "@/actions/get-project-segment";
import Loading from "@/app/(admin)/(projects)/loading";

interface AssignMaterialFormProps extends React.HTMLAttributes<HTMLDivElement> {}

type FormData = {
    materials: z.infer<typeof segmentMaterialSchema>;
};

const AssignMaterialForm: React.FC<AssignMaterialFormProps> = ({ className, ...props }) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const user = useAuthStore((state) => state.user?.result.user_id);
    const user_id = user?.toString();

    const pathname = usePathname();
    const project_id = parseInt(pathname.replace('/projects/', ''));
    const segment_id = parseInt(pathname.replace(`/projects/${project_id}/segments/`, ''));


    const { user: userData, isAuthenticated, logout } = useAuthStore();

    const warehouse = userData?.result

    const {  // @ts-ignore
        company_warehouse_url,  // @ts-ignore
        company_warehouse_token
    } = warehouse || {};


    const { isLoading, error, data:submittedMaterials } = useSingleSegment('/project_segment_bom', segment_id)

    const { isLoading: mLoading, error: mError, data } = useNormalFetchData(`project_bom/getAllMaterials?baseUrl=${company_warehouse_url}&token=${company_warehouse_token}
`);

    const materials = Array.isArray(data) ? data.reverse() : [];

    const segment = Array.isArray(submittedMaterials) ? submittedMaterials.reverse() : [];

  const [searchTerm, setSearchTerm] = useState("");

  const filteredMaterials = materials.filter((m) =>
    m.item_name.toLowerCase().includes(searchTerm.toLowerCase())
  );


    const handleMaterialSelect = (index: number, materialId: string) => {
        const selectedMaterial = materials.find((m: any) => m.item_code === materialId);
        if (!selectedMaterial) {
            console.error(`Material with ID ${materialId} not found.`);
            form.setValue(`materials.${index}.unit_cost`, 0);
            return;
        }
        const costRate = selectedMaterial.rate;
        form.setValue(`materials.${index}.unit_cost`, costRate);
    };

    const form = useForm<FormData>({
        resolver: zodResolver(z.object({ materials: segmentMaterialSchema })),
        defaultValues: {
            materials: [
                {
                    segment_id: segment_id,
                    material_id: "",
                    unit_cost: 0,
                    material_quantity: 1,
                    user_id: user_id,
                    material_status: "Active"
                }
            ]
        }
    });


    const { control, handleSubmit } = form;
    const { fields, append, remove } = useFieldArray({ control, name: "materials" });

    const mutation = usePostData('/project_segment_bom');

    async function onSubmit(data: FormData) {
        try {
            setLoading(true);
            await mutation.mutateAsync(data.materials);
            setIsSuccess(true);
            router.refresh();
            form.reset();
            toast({
                title: "Materials added!",
                description: "You have successfully added a material.",
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


    if (!segment) return <Loading/>;

    return (
        <div className={className} {...props}>

            <div className="space-y-4 mb-6">
                <h3 className="text-lg font-semibold text-primary">Submitted Materials</h3>
                {submittedMaterials ? (
                    <div className="list-disc list-inside">
                        {submittedMaterials.map((material: any, index: number) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-6 items-end space-y-3">
                                <div className="grid space-y-2">
                                    <h4 className="font-semibold"> Material </h4>
                                    <Card className="py-2 px-4 w-[60%] rounded-md shadow-none">
                                        <span>{material.material_id}</span>
                                    </Card>
                                </div>

                                <div className="grid space-y-2">
                                    <h4 className="font-semibold"> Quantity </h4>
                                    <Card className="py-2 px-4 w-[60%] rounded-md shadow-none">
                                        <span>{material.material_quantity}</span>
                                    </Card>
                                </div>

                                <div className="grid space-y-2">
                                    <h4 className="font-semibold">Change Request Value</h4>
                                    <Card className="py-2 px-4 w-[60%] rounded-md shadow-none">
                                        <span>0</span>
                                    </Card>
                                </div>


                            </div>

                        ))}
                    </div>
                ) : (
                    <p>No materials submitted yet.</p>
                )}
            </div>
            <hr/>
            <Form {...form}>
                <h3 className="text-lg font-semibold my-4 text-primary">Add Materials</h3>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {fields.map((field, index) => (
                        <div key={field.id} className="grid grid-cols-1 md:grid-cols-5 gap-6 items-end">
                            <div className="grid gap-1">
                                <FormField
                                    control={form.control}
                                    name={`materials.${index}.material_id`}
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel> Material </FormLabel>
                                            <Select
                                                onValueChange={(value) => {
                                                    field.onChange(value);
                                                    handleMaterialSelect(index, value);
                                                }}
                                                defaultValue=""
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select material" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                  {/* Search Input */}
                                                  <div className="p-2">
                                                    <Input
                                                      placeholder="Search Material"
                                                      value={searchTerm}
                                                      onChange={(e) => setSearchTerm(e.target.value)}
                                                      onFocus={(e) => e.target.select()} // Safely handle focus
                                                    />
                                                  </div>
                                                    {filteredMaterials.map((item: any) => (
                                                        <SelectItem
                                                          value={item.item_code}
                                                          key={item.item_code}
                                                        >
                                                            {item.item_name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={control}
                                name={`materials.${index}.material_quantity`}
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Quantity</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="Quantity" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <div className="grid space-y-2">
                                <h4 className="font-semibold">Change Request Value</h4>
                                <Card className="py-2 px-4 w-[60%] rounded-md shadow-none">
                                    <span>0</span>
                                </Card>
                            </div>

                            {/*<div className="grid space-y-2">*/}
                            {/*    <h4 className="font-semibold">Cost Rate</h4>*/}
                            {/*    <Card className="py-2 px-4 w-[60%] rounded-md shadow-none">*/}
                            {/*        <span>{form.watch(`materials.${index}.unit_cost`) || materials.find(m => m.item_code === form.watch(`materials.${index}.material_id`))?.standard_rate || 0}</span>*/}
                            {/*    </Card>*/}
                            {/*</div>*/}

                            <Button type="button" variant="outline" onClick={() => remove(index)}
                                    className="mt-6 text-destructive border-destructive">
                                <Trash size={20}/>
                            </Button>
                        </div>
                    ))}

                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="space-x-1 text-primary border-primary bg-primary/10 w-fit"
                        onClick={() => append({
                            segment_id: segment_id,
                            material_id: "",
                            unit_cost: 0,
                            material_quantity: 1, //@ts-ignore
                            user_id: user_id,
                            material_status: "Active"
                        })}
                    >
                        <Plus size={16}/>
                        <span> Add Material </span>
                    </Button>

                    <div className="flex justify-end space-x-4">
                        <Button type="reset" className="bg-destructive hover:bg-destructive/90">
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
    );
};

export default AssignMaterialForm;
