"use client";

import React from 'react';
import { format } from 'date-fns'
import {cn} from "@/lib/utils";
import {buttonVariants} from "@/components/ui/button";
import {Plus} from "@phosphor-icons/react";
import Link from "next/link";
import ProjectSegmentCard from "@/components/pages/projects/projects/project-segment-card";
import ProjectLayout from "@/components/pages/projects/projects/project-layout";
import useFetchData from "@/actions/use-api";
import useAuthStore from "@/hooks/use-user";
import {usePathname, useRouter} from "next/navigation";
import {useSingleProject} from "@/actions/get-project";
import {formatDate} from "@/utils/format-date";
import Loading from "@/app/(admin)/(projects)/loading";

function ProjectSegmentsPage() {
    const router = useRouter();
    const pathname = usePathname()
    const project_id = parseInt(pathname.replace('/projects/',''));

    const { isLoading, error, data } = useSingleProject('/project_segment', project_id)

    const segments = Array.isArray(data) ? data.reverse() : [];

    const handleNavigation = () => {
        router.push(`/projects/${project_id}/segments/new-segment`);
    };


    if (isLoading) return <div> <Loading/> </div>;

    return (
        <ProjectLayout>
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="h-8 w-1 bg-primary rounded-full"/>
                    <h4 className="text-primary text-lg font-bold tracking-wide"> Manage Project Segments </h4>
                </div>

                <div
                    onClick={handleNavigation}
                    className={cn(
                        buttonVariants({variant: "default"}),
                        "space-x-1 cursor-pointer"
                    )}
                >
                    <Plus className='h-4 w-4'/>
                    <span> Add Segment </span>
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {segments.map((segment, index) => (
                    <Link key={index} href={`/projects/${project_id}/segments/${segment.segment_id}`} passHref>
                        <ProjectSegmentCard
                            title={segment.segment_name}
                            code={`#${segment.segment_code}`}
                            start_point={segment.start_point}
                            end_point={segment.end_point}
                            due_date={
                                segment.end_date
                                // format(segment.end_date, 'dd.mm.yyyy')
                            }
                            distance={segment.est_distance}
                            status={segment.assignment_status}
                            progress={segment.percentage_progress}
                            supervisor={segment.assigned_users}
                        />
                    </Link>
                ))}

            </div>

        </div>
        </ProjectLayout>
    );
}

export default ProjectSegmentsPage;