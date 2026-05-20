"use client";

import React from 'react';
import BudgetCards from "@/components/pages/projects/projects/segments/budget-cards";
import {Card} from "@/components/ui/card";
import {CheckCircle, Plus} from "@phosphor-icons/react";
import BudgetTable from "@/components/pages/projects/projects/budget-table";
import Link from "next/link";
import {cn} from "@/lib/utils";
import {buttonVariants} from "@/components/ui/button";
import SegmentLayout from "@/components/pages/projects/projects/segments/segment-layout";
import {usePathname} from "next/navigation";
import MaterialBudgetGraph from "@/components/pages/projects/projects/segments/material-budget-graph";
import ServiceBudgetGraph from "@/components/pages/projects/projects/segments/service-budget-graph";
import {useSingleSegment} from "@/actions/get-project-segment";

function ProjectBudgetPage() {

    const pathname = usePathname()
    const project_id = parseInt(pathname.replace('/projects/',''));
    const segment_id = parseInt(pathname.replace(`/projects/${project_id}/segments/`,''));

    const { isLoading, error, data } = useSingleSegment("/budget/getSegmentExpenditure", segment_id);

    const budget = Array.isArray(data) ? data.reverse() : [];


    return (
        <SegmentLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="h-8 w-1 bg-primary rounded-full"/>
                        <h4 className="text-primary text-lg font-bold tracking-wide"> Segment Budget </h4>
                    </div>

                    <Link
                        href={`/projects/${project_id}/segments/${segment_id}/budget/add-budget`}
                        className={cn(
                            buttonVariants({variant: "default"}),
                            "space-x-1"
                        )}
                    >
                        <Plus className='h-4 w-4'/>
                        <span> Set Budget </span>
                    </Link>
                </div>

                {budget.length > 0 ? (
                    <div>
                        <BudgetCards/>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="py-4 space-y-4 ">
                            <Card
                                className="col-span-1 py-6 space-y-6 relative bg-[url('/images/bg-card-2.svg')] bg-no-repeat bg-top">
                                <h3 className="text-base font-bold pl-6"> Material Overview </h3>
                                <div className="px-6 relative">
                                    {/*<div className="absolute top-4 left-6 space-y-1">*/}
                                    {/*    <h1 className="text-3xl font-bold">$37.5K</h1>*/}
                                    {/*    <h4 className="text-muted-foreground font-medium">Total Spent</h4>*/}

                                    {/*    <div className="flex items-center space-x-2 text-green-500 pt-4">*/}
                                    {/*        <CheckCircle weight="fill" size={20}/>*/}
                                    {/*        <p className="">On Track</p>*/}
                                    {/*    </div>*/}
                                    {/*</div>*/}
                                    <MaterialBudgetGraph segment_id={segment_id}/>
                                </div>
                            </Card>
                        </div>

                        <div className="py-4 space-y-4 ">
                            <Card
                                className="col-span-1 py-6 relative bg-[url('/images/bg-card-2.svg')] bg-no-repeat bg-top space-y-6">
                                <h3 className="text-base font-bold pl-6"> Services Overview </h3>
                                <div className="px-6 relative ">
                                    {/*<div className="absolute top-4 left-6 space-y-1">*/}
                                    {/*    <h1 className="text-3xl font-bold">$37.5K</h1>*/}
                                    {/*    <h4 className="text-muted-foreground font-medium">Total Spent</h4>*/}

                                    {/*    <div className="flex items-center space-x-2 text-green-500 pt-4">*/}
                                    {/*        <CheckCircle weight="fill" size={20}/>*/}
                                    {/*        <p className="">On Track</p>*/}
                                    {/*    </div>*/}
                                    {/*</div>*/}
                                    <ServiceBudgetGraph segment_id={segment_id}/>
                                </div>
                            </Card>
                        </div>

                        {/*<div className="py-4 space-y-4">*/}
                        {/*    <Card className="col-span-1 py-6 space-y-2 relative">*/}
                        {/*        <h3 className="text-base font-bold pl-6"> Revenue </h3>*/}
                        {/*        <div className="px-6 pt-3">*/}
                        {/*            <RevenueChart/>*/}
                        {/*        </div>*/}
                        {/*    </Card>*/}
                        {/*</div>*/}
                    </div>
                    </div>
                ) : (
                    <div>
                        <h2>No Budget Data Available</h2>
                    </div>
                )}

                <div>
                    <BudgetTable/>
                </div>

            </div>
        </SegmentLayout>
    );
}

export default ProjectBudgetPage;