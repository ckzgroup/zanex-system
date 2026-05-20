"use client";

import React, { useState } from 'react';
import ProjectLayout from "@/components/pages/projects/projects/project-layout";

interface BudgetCategory {
    item: string;
    uom: string;
    totalBudget: number;
    quantity: number;
    price: number;
    spentSoFar: number;
}


const AddBudget: React.FC = () => {
    const [categories, setCategories] = useState<BudgetCategory[]>([
        { item: 'Casual Wage Bill ( casuals)', uom: 'm', quantity: 0, price: 0 ,totalBudget: 0, spentSoFar: 0 },
        { item: 'Pole hole digging', uom: 'pcs', quantity: 0, price: 0 ,totalBudget: 0, spentSoFar: 0 },
        { item: 'Pole planting', uom: 'pcs', quantity: 0, price: 0 ,totalBudget: 0, spentSoFar: 0 },
        { item: 'Day works casuals ', uom: 'days', quantity: 0, price: 0 ,totalBudget: 0, spentSoFar: 0 },
        { item: 'Trenching', uom: 'pple', quantity: 0, price: 0 ,totalBudget: 0, spentSoFar: 0 },
        { item: 'MH installation', uom: 'pcs', quantity: 0, price: 0 ,totalBudget: 0, spentSoFar: 0 },
        { item: 'Bridge Attachment', uom: 'm', quantity: 0, price: 0 ,totalBudget: 0, spentSoFar: 0 },
        { item: 'ISP Works', uom: 'site', quantity: 0, price: 0 ,totalBudget: 0, spentSoFar: 0 },
        { item: 'OPGW Installation', uom: 'm', quantity: 0, price: 0 ,totalBudget: 0, spentSoFar: 0 },
    ]);

    const handleInputChange = (index: number, field: keyof BudgetCategory, value: string | number) => {
        const newCategories = [...categories];
        // @ts-ignore
        newCategories[index][field] = typeof value === 'string' ? parseFloat(value) : value;
        setCategories(newCategories);
    };


    const calculateTotals = () => {
        const totalBudget = categories.reduce((sum, category) => sum + category.totalBudget, 0);
        const totalSpent = categories.reduce((sum, category) => sum + category.spentSoFar, 0);
        const totalRemaining = totalBudget - totalSpent;
        return { totalBudget, totalSpent, totalRemaining };
    };

    const { totalBudget, totalSpent, totalRemaining } = calculateTotals();

    return (
        <ProjectLayout>
            <div className="space-y-2">
                <h1 className="text-xl font-bold mb-5 text-primary">New Budget </h1>
                <div className="mx-auto mt-8">
                    <h1 className="text-lg font-semibold mb-4"> Wages </h1>
                    <table className="min-w-full border border-gray-200 dark:border-gray-800">
                        <thead>
                        <tr className="bg-muted">
                            <th className="py-2 px-4 border-b">Item</th>
                            <th className="py-2 px-4 border-b">UOM</th>
                            <th className="py-2 px-4 border-b">Quantity</th>
                            <th className="py-2 px-4 border-b">Price</th>
                            <th className="py-2 px-4 border-b">Budgeted</th>
                            <th className="py-2 px-4 border-b">Actual</th>
                            <th className="py-2 px-4 border-b">Remaining</th>
                        </tr>
                        </thead>
                        <tbody>
                        {categories.map((category, index) => (
                            <tr key={index}>
                                <td className="py-2 px-4 border-b">
                                    {category.item}
                                </td>
                                <td className="py-2 px-4 border-b">
                                    <input
                                        type="text"
                                        className="w-full border border-gray-200 dark:border-gray-800 rounded p-1 bg-transparent"
                                        value={category.uom}
                                        onChange={(e) => handleInputChange(index, 'uom', e.target.value)}
                                    />
                                </td>
                                <td className="py-2 px-4 border-b">
                                    <input
                                        type="number"
                                        className="w-full border border-gray-200 dark:border-gray-800 rounded p-1 bg-transparent"
                                        value={category.quantity}
                                        onChange={(e) => handleInputChange(index, 'quantity', e.target.value)}
                                    />
                                </td>
                                <td className="py-2 px-4 border-b">
                                    <input
                                        type="number"
                                        className="w-full border border-gray-200 dark:border-gray-800 rounded p-1 bg-transparent"
                                        value={category.price}
                                        onChange={(e) => handleInputChange(index, 'price', e.target.value)}
                                    />
                                </td>
                                <td className="py-2 px-4 border-b">
                                    <input
                                        type="number"
                                        className="w-full border border-gray-200 dark:border-gray-800 rounded p-1 bg-transparent"
                                        value={category.totalBudget}
                                        onChange={(e) => handleInputChange(index, 'totalBudget', e.target.value)}
                                    />
                                </td>
                                <td className="py-2 px-4 border-b">
                                    <input
                                        type="number"
                                        className="w-full border border-gray-200 dark:border-gray-800 rounded p-1 bg-transparent"
                                        value={category.spentSoFar}
                                        onChange={(e) => handleInputChange(index, 'spentSoFar', e.target.value)}
                                    />
                                </td>
                                <td className="py-2 px-4 border-b">
                                    {category.totalBudget - category.spentSoFar}
                                </td>
                            </tr>
                        ))}
                        <tr className="bg-orange-500 text-white">
                            <td className="py-2 px-4 border-t font-bold">Total Wages</td>
                            <td className="py-2 px-4 border-t font-bold"></td>
                            <td className="py-2 px-4 border-t font-bold"></td>
                            <td className="py-2 px-4 border-t font-bold"></td>
                            <td className="py-2 px-4 border-t font-bold">{totalBudget}</td>
                            <td className="py-2 px-4 border-t font-bold">{totalSpent}</td>
                            <td className="py-2 px-4 border-t font-bold">{totalRemaining}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </ProjectLayout>
    );
};

export default AddBudget;
