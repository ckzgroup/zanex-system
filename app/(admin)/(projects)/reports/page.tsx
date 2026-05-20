"use client";

import React from 'react';
import {Button} from "@/components/ui/button";
import {Briefcase, CheckCircle, DownloadSimple, Eye, HourglassHigh, Plus, Sparkle} from "@phosphor-icons/react";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import DashboardCard from "@/components/pages/projects/dashboard/dashboard-card";
import ReportCard from "@/components/pages/projects/reports/report-card";
import BudgetGraph from "@/components/pages/projects/reports/budget-graph";
import RecentProjects from "@/components/pages/projects/dashboard/recent-projects";
import {Card} from "@/components/ui/card";
import TaskStatistics from "@/components/pages/projects/dashboard/task-statistics";
import RevenueChart from "@/components/pages/projects/reports/revenue-chart";
import TopProjects from "@/components/pages/projects/reports/top-projects";
import TopClients from "@/components/pages/projects/reports/top-clients";
import BudgetOverviewGraph from "@/components/pages/projects/reports/budget-overview-graph";
import useFetchData from "@/actions/use-api";

function ReportsPage() {

    const { isLoading:cardsLoading, error:cardsError, data:cardsData } = useFetchData('/project_report/count');
    const project_counts = Array.isArray(cardsData) ? cardsData.reverse() : [];

    const {
        new_project_count,
        active_project_count,
        review_project_count,
        completed_project_count
    } = project_counts[0] || {};

    return (
        <div className='space-y-6'>
            {/* HEADER */}
            <div className='flex items-center justify-between'>
                <div className="space-y-1">
                    <h1 className='text-2xl font-bold'> Project Reports </h1>
                    <p className='text-muted-foreground'> An overview of all the project status and progress </p>
                </div>

                <div className="flex items-center space-x-2">
                    <Select defaultValue="Weekly">
                        <SelectTrigger className="w-[130px]">
                            <SelectValue placeholder="Select a fruit"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="Weekly">Weekly</SelectItem>
                                <SelectItem value="Monthly">Monthly</SelectItem>
                                <SelectItem value="Annually">Annually</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    <Button className='space-x-2'>
                        <DownloadSimple size={16} weight="bold"/>
                        <span> Export </span>
                    </Button>
                </div>
            </div>

            {/*  PROJECT REPORT CARDS  */}
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6'>
                <ReportCard
                    icon={Sparkle}
                    title="New Projects"
                    total={new_project_count}
                    iconColor="#DD8E4E"
                />

                <ReportCard
                    icon={HourglassHigh}
                    title="Ongoing Projects"
                    total={active_project_count}
                    iconColor="#6B37DF"
                />

                <ReportCard
                    icon={Eye}
                    title="On Review"
                    total={review_project_count}
                    iconColor="#3876DA"
                />

                <ReportCard
                    icon={Eye}
                    title="Completed"
                    total={completed_project_count}
                    iconColor="#3BAA52"
                />
            </div>


            {/* BUDGET */}
            {/*<div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-6">*/}
            {/*    <div className="col-span-3 py-4 space-y-4 ">*/}
            {/*        <Card*/}
            {/*            className="col-span-1 py-6 space-y-2 relative bg-[url('/images/bg-card-2.svg')] bg-no-repeat bg-top">*/}
            {/*            <h3 className="text-base font-bold pl-6"> Budget Overview </h3>*/}
            {/*            <div className="px-6 relative pt-4">*/}
            {/*                <BudgetOverviewGraph />*/}
            {/*            </div>*/}
            {/*        </Card>*/}
            {/*    </div>*/}

            {/*    <div className="col-span-2 py-4 space-y-4">*/}
            {/*        <Card className="col-span-1 py-6 space-y-2 relative">*/}
            {/*            <h3 className="text-base font-bold pl-6"> Revenue </h3>*/}
            {/*            <div className="px-6 pt-3">*/}
            {/*                <RevenueChart/>*/}
            {/*            </div>*/}
            {/*        </Card>*/}
            {/*    </div>*/}
            {/*</div>*/}

            {/*  TOP PROJECTS  */}
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-6">
                <div className="col-span-3 py-4 space-y-4">
                    <Card className="col-span-1 py-6 space-y-2 relative">
                        <h3 className="text-base font-bold pl-6"> New Projects </h3>
                        <hr className="w-full"/>
                        <div className="px-6">
                            <RecentProjects/>
                        </div>
                    </Card>
                </div>

                <div className="col-span-2 py-4 space-y-4">
                    <Card className="col-span-1 py-6 space-y-2 relative">
                        <h3 className="text-base font-bold pl-6"> Top Clients </h3>
                        <hr className="w-full"/>
                        <div className="px-6 pt-3">
                            <TopClients/>
                        </div>
                    </Card>
                </div>
            </div>

        </div>
    );
}

export default ReportsPage;