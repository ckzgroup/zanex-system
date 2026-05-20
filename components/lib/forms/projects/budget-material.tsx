"use client";

import React, {useEffect, useState} from 'react';
import * as z from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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

interface BudgetMaterialProps extends React.HTMLAttributes<HTMLDivElement> {}

const budgetMaterialSchema = z.array(z.object({
    segment_id: z.number(),
    budget_item_id: z.any(),
    budget_item_type: z.string(),
    budget_item_count: z.coerce.number().optional(),
    budget_item_amount: z.coerce.number().optional(),
    budget_item_date: z.any(),
    budget_item_user_id: z.string()
}));


type FormData = {
    materials: z.infer<typeof budgetMaterialSchema>;
};

const BudgetMaterial: React.FC<BudgetMaterialProps> = ({ className, ...props }) => {
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


    const { isLoading: itemsLoading, error:itemsError, data:itemsData } = useSingleSegment('/budget/getSegmentBudgets', segment_id);
    const bMaterials = Array.isArray(itemsData) ? itemsData.reverse() : [];

    const materialsItems = bMaterials?.filter((item: any) => item.budget_item_type === "Material") || [];

    const { isLoading:mLoading, error:mError, data:Materials } = useSingleSegment('/project_segment_bom', segment_id)
    const materials = Array.isArray(Materials) ? Materials.reverse() : [];


    const form = useForm<FormData>({
        resolver: zodResolver(z.object({ materials: budgetMaterialSchema })),
        defaultValues: {
            materials: [
                {
                    segment_id: segment_id,
                    budget_item_id: "",
                    budget_item_type: "Material",
                    budget_item_count: 0,
                    budget_item_amount: 0,
                    budget_item_user_id: user_id,
                    budget_item_date: new Date(),
                }
            ]
        }
    });

    const { control, handleSubmit } = form;
    const { fields, append, remove } = useFieldArray({ control, name: "materials" });

    const mutation = usePostData('/budget/createSegmentBudget');

    async function onSubmit(data: FormData) {
        try {
            setLoading(true);
            await mutation.mutateAsync(data.materials);
            setIsSuccess(true);
            router.refresh();
            form.reset();
            toast({
                title: "Material Budget added!",
                description: "You have successfully added material budget.",
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

    const [selectedItemCode, setSelectedItemCode] = useState<string>();


    const { isLoading:sLoading, error:sEError, data } = useNormalFetchData(`project_bom/getMaterialByItemCode?itemCode=${selectedItemCode}&baseUrl=${company_warehouse_url}&token=${company_warehouse_token}`);

    const fetchMaterialPrice = async (itemCode: string) => {
        try {
            if (!data || !Array.isArray(data) || data.length === 0) {
                console.warn("No valid material data found.");
                return 0;
            }

            const material = data[0]; // Extract first item
            console.log("Material Data", material?.item_name)

            return material?.standard_rate || 0; // Return standard_rate or 0 if missing
        } catch (error) {
            console.error("Error fetching material price:", error);
            return 0;
        }
    };
    // Update price when API data is available
    useEffect(() => {
        if (data && selectedItemCode) {
            const price = data?.standard_rate;

            // Find the index of the selected item and update the price
            const itemIndex = form.getValues("materials").findIndex(
                (item) => item.budget_item_id === selectedItemCode
            );

            if (itemIndex !== -1) {
                form.setValue(`materials.${itemIndex}.budget_item_amount`, price);
            }
        }
    }, [data, selectedItemCode]);

    const handleMaterialSelect = async (index: number, selectedBomMaterialId: string) => {
        // Find the material by matching the bom_material_id.
        const selectedMaterial = materials.find(
            (m: any) => String(m.bom_material_id) === selectedBomMaterialId
        );

        if (!selectedMaterial) {
            console.error("Selected material not found");
            return;
        }

        // Save bom_material_id to the form
        form.setValue(`materials.${index}.budget_item_id`, selectedBomMaterialId);

        // Use the corresponding material_id for fetching the price.
        const materialIdForPrice = String(selectedMaterial.material_id);
        setSelectedItemCode(materialIdForPrice);

        // Fetch price using the material_id
        const price = await fetchMaterialPrice(materialIdForPrice);
        form.setValue(`materials.${index}.budget_item_amount`, price);
    };


    if (!materialsItems) return <Loading/>;


    return (
        <div className={className} {...props}>

            <div className="space-y-4 mb-6">
                <h3 className="text-lg font-semibold text-primary">Budgeted Materials</h3>
                {materialsItems ? (
                    <div className="list-disc list-inside">
                        {materialsItems.map((material: any, index: number) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-6 items-end space-y-3">
                                <div className="grid space-y-2">
                                    <h4 className="font-semibold"> Material Name </h4>
                                    <Card className="py-2 px-4 w-fit rounded-md shadow-none">
                                        <span>{material.item_name}</span>
                                    </Card>
                                </div>

                                <div className="grid space-y-2">
                                    <h4 className="font-semibold"> Quantity </h4>
                                    <Card className="py-2 px-4 w-[60%] rounded-md shadow-none">
                                        <span>{material.item_count}</span>
                                    </Card>
                                </div>

                                <div className="grid space-y-2">
                                    <h4 className="font-semibold"> Amount (@) </h4>
                                    <Card className="py-2 px-4 w-[60%] rounded-md shadow-none">
                                        <span>{material.budget_item_amount}</span>
                                    </Card>
                                </div>

                                <div className="grid space-y-2">
                                    <h4 className="font-semibold"> Total Amount </h4>
                                    <Card className="py-2 px-4 w-[60%] rounded-md shadow-none">
                                        <span>{material.item_count * material.budget_item_amount }</span>
                                    </Card>
                                </div>

                                <div className="grid space-y-2">
                                    <h4 className="font-semibold"> Status </h4>
                                    <Card className="py-2 px-4 w-fit rounded-md shadow-none">
                                        <span>{material.budget_item_status}</span>
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
                                    name={`materials.${index}.budget_item_id`}
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel> Material </FormLabel>
                                            <Select
                                                value={field.value}
                                                onValueChange={(value) => handleMaterialSelect(index, value)}
                                                defaultValue=""
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select material" />
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



                            <div className="grid space-y-2">
                                <h4 className="font-semibold">Item Price </h4>
                                <Card className="py-2 px-4 w-[60%] rounded-md shadow-none">
                                    <span>{form.watch(`materials.${index}.budget_item_amount`)}</span>
                                </Card>

                            </div>

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
                            budget_item_id: "",
                            budget_item_type: "Material",
                            budget_item_count: 0,
                            budget_item_amount: 0, // @ts-ignore
                            budget_item_user_id: user_id,
                            budget_item_date: new Date(),
                        })}
                    >
                        <Plus size={16}/>
                        <span> Add Material Budget </span>
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

export default BudgetMaterial;
