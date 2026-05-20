"use client";

import React from 'react';
// @ts-ignore
import GaugeChart from 'react-gauge-chart'

import ProjectStatusGraph from "@/components/pages/projects/projects/project-status-graph";
import ProjectsGraph from "@/components/pages/projects/dashboard/projects-graph";
import {Card} from "@/components/ui/card";
import {ArrowUp, CheckCircle} from "@phosphor-icons/react";
import BudgetGraph from "@/components/pages/projects/reports/budget-graph";
import ProjectBudgetChart from "@/components/pages/projects/projects/project-budget-chart";
import TasksChart from "@/components/pages/projects/projects/tasks-chart";
import {Progress} from "@/components/ui/progress";
import ProjectLayout from "@/components/pages/projects/projects/project-layout";
import useFetchData from "@/actions/use-api";
import {useSingleProject} from "@/actions/get-project";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import ProjectProgress from "@/components/pages/projects/projects/project-progress";
import ProjectWorkload from "@/components/pages/projects/projects/project-workload";
import {formatMoney} from "@/utils/format";

interface ProjectProps{
        project_id: string;
}

function ProjectOverviewPage() {

    const pathname = usePathname()
    const project_id = parseInt(pathname.replace('/projects/',''));

    const { isLoading, error, data } = useSingleProject('/budget/getProjectExpenditure', project_id)

    const project = Array.isArray(data) ? data.reverse() : [];

    const {
        sum_estimated_cost,
        sum_total_amount_spent
    } = project[0] || {}

    const percentage =
        sum_estimated_cost > 0
            ? ((sum_total_amount_spent / sum_estimated_cost) * 100).toFixed(2)
            : "0.00";

    return (
        <ProjectLayout>
            <div className="space-y-6">
            <div className="flex items-center space-x-4">
                <div className="h-8 w-1 bg-primary rounded-full"/>
                <h4 className="text-primary text-lg font-bold tracking-wide">Project Overview</h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <div className="col-span-1 ">
                        <ProjectStatusGraph/>
                </div>

                <div className="relative">
                    {/*<div className="absolute z-20 top-0 left-0 mx-auto w-full h-full rounded-xl border border-border bg-white/60 backdrop-blur-sm">*/}
                    {/*    <div className="w-full mx-auto pt-32 text-center">*/}
                    {/*        <h2 className="font-semibold text-lg font-mono ">Budget Overview</h2>*/}
                    {/*        <p className="font-medium">Coming Soon</p>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                    <Card
                        className="col-span-1 py-6 space-y-2 relative bg-[url('/images/bg-card-2.svg')] bg-no-repeat bg-top">
                        <h3 className="text-base font-bold pl-6"> Budget Overview </h3>
                        <div className="px-4 relative pt-4">
                            <GaugeChart id="gauge-chart2"
                                        nrOfLevels={20}
                                        percent={percentage}
                            />
                            <div className="space-y-1 z-50 w-full px-6 pt-4">
                                <div className='grid grid-cols-2 gap-8'>
                                    <div className="space-y-1 text-center">
                                        <h4 className="text-base font-bold">
                                            {formatMoney(sum_estimated_cost || 0.00)}
                                        </h4>
                                        <p className="text-xs text-muted-foreground tracking-wide">Total Budget</p>
                                    </div>

                                    <div className="space-y-1 text-center">
                                        <h4 className="text-base font-bold">
                                            {formatMoney(sum_total_amount_spent || 0.00)}
                                        </h4>
                                        <p className="text-xs text-muted-foreground tracking-wide">Budget Spent</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
                <div
                    className="col-span-1">
                    <TasksChart/>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
                <div className="col-span-1">
                    <ProjectProgress/>
                </div>

                <div className="col-span-1">
                    <ProjectWorkload/>
                </div>
            </div>
        </div>
        </ProjectLayout>
    );
}

export default ProjectOverviewPage;