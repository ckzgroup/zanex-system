"use client";

import React from 'react';
import BudgetCards from "@/components/pages/projects/projects/segments/budget-cards";
import {Card} from "@/components/ui/card";
import {CheckCircle, Plus} from "@phosphor-icons/react";
import RevenueChart from "@/components/pages/projects/reports/revenue-chart";
import BudgetTable from "@/components/pages/projects/projects/budget-table";
import Link from "next/link";
import {cn} from "@/lib/utils";
import {buttonVariants} from "@/components/ui/button";
import SegmentLayout from "@/components/pages/projects/projects/segments/segment-layout";
import {usePathname} from "next/navigation";
import MaterialBudgetGraph from "@/components/pages/projects/projects/segments/material-budget-graph";
import ServiceBudgetGraph from "@/components/pages/projects/projects/segments/service-budget-graph";
import {useSingleSegment} from "@/actions/get-project-segment";
import HeatmapComponent from "@/app/(admin)/service/maps/HeatmapComponent";
import SegmentMapComponent from "@/app/(admin)/(projects)/projects/[slug]/segments/[id]/maps/SegmentMapComponent";

function ProjectMapPage() {

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
                        <h4 className="text-primary text-lg font-bold tracking-wide"> Segment Map </h4>
                    </div>

                </div>

                <div className="relative flex space-x-2 items-center">
                    <SegmentMapComponent/>
                </div>

            </div>
        </SegmentLayout>
    );
}

export default ProjectMapPage;