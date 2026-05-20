"use client";

import React from 'react';
import {TrendUp} from "@phosphor-icons/react";
import BudgetLineGraph from "@/components/pages/projects/projects/budget-line-graph";
import {usePathname} from "next/navigation";
import {useSingleSegment} from "@/actions/get-project-segment";
import {formatMoney} from "@/utils/format";

function BudgetCards() {

    const pathname = usePathname()
    const project_id = parseInt(pathname.replace('/projects/',''));
    const segment_id = parseInt(pathname.replace(`/projects/${project_id}/segments/`,''));

    const { isLoading, error, data } = useSingleSegment('/budget/getSegmentExpenditure', segment_id);

    const totalBudget = data?.reduce((sum: any, item: any) => sum + item.estimated_cost, 0) || 0;
    const totalSpent = data?.reduce((sum: any, item: any) => sum + item.total_amount_spent, 0) || 0;
    const totalBalance = totalBudget - totalSpent;

    console.log("Data", data)

    return (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div
                className="border border-gray-200 dark:border-gray-800 rounded-2xl py-8 px-5">
                <div className="space-y-1">
                    <div className="flex items-center justify-between">
                        <h4 className="font-medium text-muted-foreground"> Total Budget </h4>

                        <div className="flex items-center space-x-2">
                            <TrendUp weight="bold" size={16} className="text-green-500"/>
                            <p className=""><span className="text-green-500"></span></p>
                        </div>
                    </div>

                    <h1 className="text-xl font-bold">{formatMoney(totalBudget)}</h1>

                    <div className="pt-2">
                        <BudgetLineGraph/>
                    </div>

                </div>

            </div>

            <div
                className="border border-gray-200 dark:border-gray-800 rounded-2xl py-8 px-5">
                <div className="space-y-1">
                    <div className="flex items-center justify-between">
                        <h4 className="font-medium text-muted-foreground">Total Spent</h4>

                        <div className="flex items-center space-x-2">
                            <TrendUp weight="bold" size={16} className="text-green-500"/>
                            <p className=""><span className="text-green-500"></span></p>
                        </div>
                    </div>

                    <h1 className="text-xl font-bold">{formatMoney(totalSpent)}</h1>

                    <div className="pt-2">
                        <BudgetLineGraph/>
                    </div>

                </div>

            </div>

            <div
                className="border border-gray-200 dark:border-gray-800 rounded-2xl py-8 px-5">
                <div className="space-y-1">
                    <div className="flex items-center justify-between">
                        <h4 className="font-medium text-muted-foreground"> Total Balance </h4>

                        <div className="flex items-center space-x-2">
                            <TrendUp weight="bold" size={16} className="text-green-500"/>
                            <p className=""><span className="text-green-500">  </span></p>
                        </div>
                    </div>

                    <h1 className="text-xl font-bold"> {formatMoney(totalBalance)} </h1>

                    <div className="pt-2">
                        <BudgetLineGraph/>
                    </div>

                </div>

            </div>

            {/*<div*/}
            {/*    className="border border-gray-200 dark:border-gray-800 rounded-2xl py-8 px-5">*/}
            {/*    <div className="space-y-1">*/}
            {/*        <div className="flex items-center justify-between">*/}
            {/*            <h4 className="font-medium text-muted-foreground"> Savings </h4>*/}

            {/*            <div className="flex items-center space-x-2">*/}
            {/*                <TrendUp weight="bold" size={16} className="text-green-500"/>*/}
            {/*                <p className=""><span className="text-green-500">+5%</span></p>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*        <h1 className="text-xl font-bold">Ksh 235,500</h1>*/}

            {/*        <div className="pt-2">*/}
            {/*            <BudgetLineGraph/>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}


        </div>
    );
}

export default BudgetCards;