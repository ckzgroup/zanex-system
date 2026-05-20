"use client";

import React from 'react';
import ProjectLayout from "@/components/pages/projects/projects/project-layout";
import BudgetCards from "@/components/pages/projects/projects/budget-cards";
import {Card} from "@/components/ui/card";
import {CheckCircle, Plus} from "@phosphor-icons/react";
import BudgetGraph from "@/components/pages/projects/reports/budget-graph";
import RevenueChart from "@/components/pages/projects/reports/revenue-chart";
import BudgetTable from "@/components/pages/projects/projects/budget-table";
import Link from "next/link";
import {cn} from "@/lib/utils";
import {buttonVariants} from "@/components/ui/button";

function ProjectBudgetPage() {
    return (
        <ProjectLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="h-8 w-1 bg-primary rounded-full"/>
                        <h4 className="text-primary text-lg font-bold tracking-wide"> Project Budget </h4>
                    </div>

                    <Link
                        href="/projects/1/budget/add-budget"
                        className={cn(
                            buttonVariants({variant: "default"}),
                            "space-x-1"
                        )}
                    >
                        <Plus className='h-4 w-4'/>
                        <span> Add Budget </span>
                    </Link>
                </div>
                <BudgetCards/>

                {/* BUDGET */}
                <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-6">
                    <div className="col-span-3 py-4 space-y-4 ">
                        <Card
                            className="col-span-1 py-6 space-y-2 relative bg-[url('/images/bg-card-2.svg')] bg-no-repeat bg-top">
                            <h3 className="text-base font-bold pl-6"> Budget Overview </h3>
                            <div className="px-6 relative">
                                <div className="absolute top-4 left-6 space-y-1">
                                    <h1 className="text-3xl font-bold">$37.5K</h1>
                                    <h4 className="text-muted-foreground font-medium">Total Spent</h4>

                                    <div className="flex items-center space-x-2 text-green-500 pt-4">
                                        <CheckCircle weight="fill" size={20}/>
                                        <p className="">On Track</p>
                                    </div>
                                </div>
                                <BudgetGraph/>
                            </div>
                        </Card>
                    </div>

                    <div className="col-span-2 py-4 space-y-4">
                        <Card className="col-span-1 py-6 space-y-2 relative">
                            <h3 className="text-base font-bold pl-6"> Revenue </h3>
                            <div className="px-6 pt-3">
                                <RevenueChart/>
                            </div>
                        </Card>
                    </div>
                </div>

                <div>
                    <BudgetTable/>
                </div>
            </div>
        </ProjectLayout>
    );
}

export default ProjectBudgetPage;