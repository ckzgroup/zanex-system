"use client";

import React from 'react';
import {TrendUp} from "@phosphor-icons/react";
import BudgetLineGraph from "@/components/pages/projects/projects/budget-line-graph";

function BudgetCards() {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            <div
                className="border border-gray-200 dark:border-gray-800 rounded-2xl py-8 px-5">
                <div className="space-y-1">
                    <div className="flex items-center justify-between">
                        <h4 className="font-medium text-muted-foreground">Balance</h4>

                        <div className="flex items-center space-x-2">
                            <TrendUp weight="bold" size={16} className="text-green-500"/>
                            <p className=""><span className="text-green-500">+12%</span></p>
                        </div>
                    </div>

                    <h1 className="text-xl font-bold">Ksh 2,450,569</h1>

                    <div className="pt-2">
                        <BudgetLineGraph/>
                    </div>

                </div>

            </div>

            <div
                className="border border-gray-200 dark:border-gray-800 rounded-2xl py-8 px-5">
                <div className="space-y-1">
                    <div className="flex items-center justify-between">
                        <h4 className="font-medium text-muted-foreground">Income</h4>

                        <div className="flex items-center space-x-2">
                            <TrendUp weight="bold" size={16} className="text-green-500"/>
                            <p className=""><span className="text-green-500">+12%</span></p>
                        </div>
                    </div>

                    <h1 className="text-xl font-bold">Ksh 840,569</h1>

                    <div className="pt-2">
                        <BudgetLineGraph/>
                    </div>

                </div>

            </div>

            <div
                className="border border-gray-200 dark:border-gray-800 rounded-2xl py-8 px-5">
                <div className="space-y-1">
                    <div className="flex items-center justify-between">
                        <h4 className="font-medium text-muted-foreground"> Expense </h4>

                        <div className="flex items-center space-x-2">
                            <TrendUp weight="bold" size={16} className="text-green-500"/>
                            <p className=""><span className="text-green-500"> +12% </span></p>
                        </div>
                    </div>

                    <h1 className="text-xl font-bold"> Ksh 340,465 </h1>

                    <div className="pt-2">
                        <BudgetLineGraph/>
                    </div>

                </div>

            </div>

            <div
                className="border border-gray-200 dark:border-gray-800 rounded-2xl py-8 px-5">
                <div className="space-y-1">
                    <div className="flex items-center justify-between">
                        <h4 className="font-medium text-muted-foreground"> Savings </h4>

                        <div className="flex items-center space-x-2">
                            <TrendUp weight="bold" size={16} className="text-green-500"/>
                            <p className=""><span className="text-green-500">+5%</span></p>
                        </div>
                    </div>

                    <h1 className="text-xl font-bold">Ksh 235,500</h1>

                    <div className="pt-2">
                        <BudgetLineGraph/>
                    </div>

                </div>

            </div>
        </div>
    );
}

export default BudgetCards;