"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSingleSegment } from "@/actions/get-project-segment";
import { toast } from "@/components/ui/use-toast";
import {usePatchData, useNormalFetchData, normalFetchData} from "@/actions/use-api";
import { formatMoney } from "@/utils/format";
import useAuthStore from "@/hooks/use-user";
import { useQueries } from "@tanstack/react-query"; // Import React Query

interface BudgetCategory {
    segment_budget_id: number;
    name: string;
    category: string;
    totalBudget: number;
    spentSoFar: number;
}

const BudgetTable: React.FC = () => {
    const pathname = usePathname();
    const project_id = parseInt(pathname.replace("/projects/", ""));
    const segment_id = parseInt(pathname.replace(`/projects/${project_id}/segments/`, ""));

    // Get User
    const { user: userData } = useAuthStore();
    const users = userData?.result || {};

    const warehouse = userData?.result

    const {  // @ts-ignore
        company_warehouse_url,  // @ts-ignore
        company_warehouse_token
    } = warehouse || {};

    // @ts-ignore
    const { roles } = users || {};

    // Fetch Budget Data
    const { isLoading: itemsLoading, error: itemsError, data: itemsData } = useSingleSegment('/budget/getSegmentBudgets', segment_id);
    const budget = Array.isArray(itemsData) ? itemsData.reverse() : [];


    const { isLoading, error, data:bData } = useSingleSegment("/budget/getSegmentExpenditure", segment_id);

    const budgets = Array.isArray(bData) ? bData.reverse() : [];

    const {
        sum_budget_actual_amount,
        sum_estimated_cost
    } = budgets[0] || {}

    const sum_budget_balance = sum_estimated_cost - sum_budget_actual_amount;


    const mutation = usePatchData('/budget/updateSegmentActualBudget');

    const [categories, setCategories] = useState<BudgetCategory[]>([]);

    useEffect(() => {
        if (budget.length > 0) {

            const formattedData = budget.map(item => ({
                segment_budget_id: item.segment_budget_id,
                name: item.item_name,
                category: item.budget_item_type === "Labour" ? "Service Item" : item.budget_item_type,
                totalBudget: item.budget_item_amount * (parseInt(item.item_count, 10) || 1),
                spentSoFar: item.budget_actual_amount || 0, // Might be the issue
            }));


            setCategories(formattedData);
        }
    }, [budget]);


    // @ts-ignore
    const mtoken = useAuthStore((state) => state?.user?.token);


    const fetchMaterialData = async (itemCode: string, baseUrl: string, token: string, mainToken: any) => {
        return normalFetchData(
            `project_bom/getMaterialByItemCode?itemCode=${itemCode}&baseUrl=${baseUrl}&token=${token}`,
            mainToken
        );
    };

    const { isLoading:sLoading, error:sEError, data } = useNormalFetchData(`project_bom/getMaterialByItemCode?itemCode=CC&baseUrl=${company_warehouse_url}&token=${company_warehouse_token}`);

    // Fetch Material Names Dynamically Using useQueries
    const materialQueries = useQueries({
        queries: categories
            .filter((category) => category.category === "Material") // Fetch only for Material items
            .map((category) => ({
                queryKey: ["material", category.name],
                queryFn: () => fetchMaterialData(category.name, company_warehouse_url, company_warehouse_token, mtoken),
                staleTime: 1000 * 60 * 5, // Cache for 5 minutes
            })),
    });



    // Create a mapping of material names for quick access
    const materialNamesMap = materialQueries.reduce((acc, query, i) => {
        if (query.data && Array.isArray(query.data) && query.data.length > 0) {
            // Find the category this query belongs to
            const matchedCategory = categories.find(cat => cat.name === query.data[0].item_code);

            if (matchedCategory) {
                acc[matchedCategory.name] = query.data[0].item_name;
            }
        }
        return acc;
    }, {} as { [key: string]: string });



    const handleActualChange = async (index: number, value: string | number) => {
        const updatedValue = typeof value === "string" ? parseFloat(value) : value;

        if (isNaN(updatedValue)) return; // Prevent invalid input

        const newCategories = [...categories];
        newCategories[index].spentSoFar = updatedValue;

        setCategories(newCategories);

        try {
            await mutation.mutateAsync({
                budget_actual_amount: updatedValue,
                segment_budget_id: newCategories[index].segment_budget_id,
            });

            toast({
                title: "Updated!",
                description: "The actual budget has been updated successfully.",
                variant: "default",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update actual budget. Please try again.",
                variant: "destructive",
            });
        }
    };


    const calculateTotals = () => {

        const totalBudget = categories.reduce((sum, category) => sum + category.totalBudget, 0);
        const totalSpent = categories.reduce((sum, category) => sum + category.spentSoFar, 0);
        const totalRemaining = totalBudget - totalSpent;

        return { totalBudget, totalSpent, totalRemaining };
    };


    const { totalBudget, totalSpent, totalRemaining } = calculateTotals();

    if (itemsLoading) return <div>Loading...</div>;
    if (itemsError) return <div>Error loading budget data</div>;

    return (
        <div className="mx-auto mt-8">
            <h1 className="text-xl font-bold mb-5">Budget Breakdown</h1>
            <table className="min-w-full border border-gray-200 dark:border-gray-800">
                <thead>
                <tr className="text-left bg-accent">
                    <th className="py-2 px-4 border-b border-r">Item Name</th>
                    <th className="py-2 px-4 border-b border-r">Category</th>
                    <th className="py-2 px-4 border-b border-r">Total Budget</th>
                    <th className="py-2 px-4 border-b border-r">Actual</th>
                    <th className="py-2 px-4 border-b border-r">Balance</th>
                </tr>
                </thead>
                <tbody>

                {categories.map((category, index) => (
                    <tr key={category.segment_budget_id}>
                        <td className="py-2 px-4 border-b border-r">
                            {category.category === "Material"
                                ? materialNamesMap[category.name] || "Loading..."
                                : category.name}
                        </td>

                        <td className="py-2 px-4 border-b border-r">{category.category}</td>
                        <td className="py-2 px-4 border-b border-r">{formatMoney(category.totalBudget)}</td>
                        {roles.map((role: any) => (
                            <td className="py-2 px-4 border-b border-r" key={role.role_id}>
                                {role.role_name === "Finance" ? (
                                    <span>
                                        <input
                                            type="number"
                                            className="w-full border border-gray-200 dark:border-gray-800 rounded p-1 bg-transparent"
                                            value={category.spentSoFar}
                                            onChange={(e) => handleActualChange(index, e.target.value)}
                                        />
                                    </span>
                                ) : (
                                    <span className=" ">
                                        {formatMoney(category.spentSoFar)}
                                    </span>
                                )}
                            </td>
                        ))}
                        <td className="py-2 px-4 border-b border-r">
                            {formatMoney(category.totalBudget - category.spentSoFar)}
                        </td>
                    </tr>
                ))}

                <tr className="bg-accent">
                    <td className="py-2 px-4 border-t font-bold">Total</td>
                    <td className="py-2 px-4 border-t font-bold"></td>
                    <td className="py-2 px-4 border-t font-bold">{formatMoney(sum_estimated_cost || 0.00)}</td>
                    <td className="py-2 px-4 border-t font-bold">{formatMoney(sum_budget_actual_amount || 0.00)}</td>
                    <td className="py-2 px-4 border-t font-bold">{formatMoney(sum_budget_balance || 0.00)}</td>
                </tr>
                </tbody>
            </table>
        </div>
    );
};

export default BudgetTable;
