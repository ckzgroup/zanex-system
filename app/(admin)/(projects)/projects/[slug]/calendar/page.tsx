"use client";

import React from 'react';
import Link from "next/link";
import {Plus} from "@phosphor-icons/react";

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'

import {cn} from "@/lib/utils";
import {buttonVariants} from "@/components/ui/button";
import ProjectLayout from "@/components/pages/projects/projects/project-layout";
import {usePathname} from "next/navigation";
import {useSingleProject} from "@/actions/get-project";

function ProjectCalendarPage() {

    const pathname = usePathname()
    const project_id = parseInt(pathname.replace('/projects/',''));

    const { isLoading, error, data } = useSingleProject('/project/getProject', project_id)

    // Assuming data is an array, get the latest project data (adjust if needed)
    const project = Array.isArray(data) ? data.reverse() : [];

    const {
        project_name,
        project_start_date,
        project_end_date
    } = project[0] || {};

    const events = [
        { title: project_name, start:project_start_date, end: project_end_date },
    ]
    function renderEventContent() {
        return (
            <>
                <b>{project_name}</b>
                <i>{}</i>
            </>
        )
    }

    return (
        <ProjectLayout>
        <div className="space-y-6">
            <div className="">
                <FullCalendar
                    plugins={[ dayGridPlugin ]}
                    initialView="dayGridMonth"
                    weekends={false}
                    events={events}
                    eventContent={renderEventContent}
                />
            </div>
        </div>
        </ProjectLayout>
    );
}

export default ProjectCalendarPage;