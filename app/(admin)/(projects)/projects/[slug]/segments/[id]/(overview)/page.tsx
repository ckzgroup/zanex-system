"use client";

import React from 'react';
// @ts-ignore
import GaugeChart from 'react-gauge-chart'

import {Card} from "@/components/ui/card";
import {ArrowUp, Briefcase, CheckCircle, Dot, Recycle} from "@phosphor-icons/react";

import SegmentActivityCard from "@/components/pages/projects/projects/segment-activity-card";
import MaterialUsageGraph from "@/components/pages/projects/projects/segments/material-usage-graph";
import SegmentServiceChart from "@/components/pages/projects/projects/segments/segment-service-chart";
import SegmentServiceCompletionGraph from "@/components/pages/projects/projects/segments/segment-service-completion-graph";
import SegmentMaterialChangeRequestChart
    from "@/components/pages/projects/projects/segments/segment-material-change-request-chart";
import SegmentLayout from "@/components/pages/projects/projects/segments/segment-layout";
import {useSingleProject} from "@/actions/get-project";
import {usePathname} from "next/navigation";
import {useSingleSegment} from "@/actions/get-project-segment";

function SegmentOverviewPage() {

    const pathname = usePathname()
    const project_id = parseInt(pathname.replace('/projects/',''));
    const segment_id = parseInt(pathname.replace(`/projects/${project_id}/segments/`,''));

    const { isLoading:countsLoading, error:countsError, data:countsData } = useSingleSegment('/segment_dashboard/newChangeRequest', segment_id)

    const segmentCounts = Array.isArray(countsData) ? countsData.reverse() : [];

    const {
        total_used_materials,
        total_materials,
        total_used_services,
        total_services,
        total_service_changes,
        total_material_changes,
        percentage_progress
    } = segmentCounts[0] || {};

    return (
        <SegmentLayout>
        <div className="space-y-6">
            <div className="flex items-center space-x-4">
                <div className="h-8 w-1 bg-primary rounded-full"/>
                <h4 className="text-primary text-lg font-bold tracking-wider">Segment Overview</h4>
            </div>

            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6'>
                <SegmentActivityCard
                    icon={Briefcase}
                    title="Materials"
                    total={`${total_used_materials} / ${total_materials + total_material_changes}`}
                    description="Used Items"
                    iconColor="#36414C"
                    bgColor="#EBECED"
                />

                <SegmentActivityCard
                    icon={Briefcase}
                    title="Services"
                    total={`${total_used_services} / ${total_services + total_service_changes}`}
                    description="Executed"
                    iconColor="#DD8E4E"
                    bgColor="#FCF4ED"
                />

                <SegmentActivityCard
                    icon={Briefcase}
                    title="Segment Progress"
                    total={`${percentage_progress} %`}
                    description="Percentage"
                    iconColor="#32AA52"
                    bgColor="#EBF7EE"
                />

                <SegmentActivityCard
                    icon={Recycle}
                    title="Change Requests"
                    total={`${total_service_changes + total_material_changes}`}
                    description="New requests available"
                    iconColor="#F10E39"
                    bgColor="#FEE7EB"
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
                <Card
                    className="col-span-3 py-6 space-y-2 relative bg-[url('/images/bg-card-2.svg')] bg-no-repeat bg-top">
                    <h3 className="text-base font-bold pl-6 pb-4"> Material Usage </h3>
                    <MaterialUsageGraph/>

                </Card>

                <Card
                    className="col-span-2 py-6 space-y-2 relative bg-[url('/images/bg-card-2.svg')] bg-no-repeat bg-top">
                    <h3 className="text-base font-bold pl-6 pb-4"> Service Change Request </h3>
                    <SegmentServiceChart/>
                </Card>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
                <Card
                    className="col-span-3 py-6 space-y-2 relative bg-[url('/images/bg-card-2.svg')] bg-no-repeat bg-top">
                    <h3 className="text-base font-bold pl-6 pb-4"> Service Completion </h3>
                    <div className="pb-4">
                        <SegmentServiceCompletionGraph/>
                    </div>
                </Card>

                <Card
                    className="col-span-2 py-6 space-y-2 relative bg-[url('/images/bg-card-2.svg')] bg-no-repeat bg-top">
                    <h3 className="text-base font-bold pl-6 pb-4"> Material Change Request </h3>

                    <SegmentMaterialChangeRequestChart/>
                </Card>
            </div>
        </div>
        </SegmentLayout>
    );
}

export default SegmentOverviewPage;