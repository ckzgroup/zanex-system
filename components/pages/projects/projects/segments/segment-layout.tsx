"use client";

import React from 'react';
import {Badge} from "@/components/ui/badge";
import {Flag, PencilSimple, SealCheck, UserCheck} from "@phosphor-icons/react";
import {Button} from "@/components/ui/button";
import {TopNav} from "@/components/elements/top-nav";
import Link from "next/link";
import {usePathname, useRouter} from "next/navigation";
import {useSingleProject} from "@/actions/get-project";
import {useSingleSegment} from "@/actions/get-project-segment";
import {formatDate} from "@/utils/format-date";
import Loading from "@/app/(admin)/(projects)/loading";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet";
import {DropdownMenuItem} from "@/components/ui/dropdown-menu";
import {ScrollArea} from "@/components/ui/scroll-area";
import EditUserForm from "@/components/lib/forms/edits/edit-user-form";
import EditProjectSegmentForm from "@/components/lib/forms/edits/edit-project-segment-form";

interface Props {
    children: React.ReactNode;
}


function SegmentLayout({ children }: Props) {

    const pathname = usePathname()
    const project_id = parseInt(pathname.replace('/projects/',''));
    const segment_id = parseInt(pathname.replace(`/projects/${project_id}/segments/`,''));

    const topNavItems = [
        {
            title: "Overview",
            href: `/projects/${project_id}/segments/${segment_id}`,
        },
        {
            title: "Budget",
            href: `/projects/${project_id}/segments/${segment_id}/budget`,
        },
        {
            title: "Updates",
            href: `/projects/${project_id}/segments/${segment_id}/updates`,
        },
        {
            title: "Change Request",
            href: `/projects/${project_id}/segments/${segment_id}/change-request`,
        },
        {
            title: "Incident Reports",
            href: `/projects/${project_id}/segments/${segment_id}/reports`,
        },
        {
            title: "Documents",
            href: `/projects/${project_id}/segments/${segment_id}/documents`,
        },
        {
            title: "Map",
            href: `/projects/${project_id}/segments/${segment_id}/maps`,
        },
        {
            title: "Reports",
            href: `/projects/${project_id}/segments/${segment_id}/segment-reports`,
        },
        {
            title: "Closure",
            href: `/projects/${project_id}/segments/${segment_id}/closure`,
        },
    ]

    const { isLoading, error, data } = useSingleSegment('/project_segment/getSegment', segment_id)
    const router = useRouter();

    const segment = Array.isArray(data) ? data.reverse() : [];

    const {
        segment_name,
        project_name,
        segment_create_date,
        segment_code,
        start_point,
        end_point,
        est_distance,
        segment_status,
        start_date,
        end_date
    } = segment[0] || {};

    const startDate = start_date ? formatDate(start_date) : "Date missing";
    const endDate = end_date ? formatDate(end_date) : "Date missing";

    const handleNavigation = () => {
        router.push(`/projects/${project_id}/segments/${segment_id}/assign`);
    };

    if (!segment) return <Loading/>;

    return (
        <div>
            <div className="flex md:items-center justify-between flex-col md:flex-row space-y-4">
                <div className="flex items-center  space-x-6">
                    <h1 className="text-3xl font-bold"> {segment_name} </h1>
                    <Badge
                        className="font-semibold text-center w-fit tracking-wider bg-primary/20 text-primary py-1.5 px-2 text-sm hover:text-white">
                        {project_name}
                    </Badge>

                    <Badge
                        className="font-semibold tracking-wider bg-orange-500/20 text-orange-400 dark:text-orange-300 py-1.5 px-2 text-sm hover:bg-orange-400 hover:text-white">
                        Segment
                    </Badge>
                </div>

                <div className="flex items-center space-x-6">
                    <div className="space-y-1">
                        <h4 className="text-muted-foreground text-xs">CREATED AT</h4>
                        <p className="text-sm font-semibold">{segment_create_date}</p>
                    </div>

                    <div className="space-y-1">
                        <h4 className="text-muted-foreground text-xs">SEGMENT CODE</h4>
                        <p className="text-sm font-semibold">#{segment_code}</p>
                    </div>

                </div>

            </div>

            <div className="my-10 flex justify-between flex-col md:flex-row space-y-4">
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-x-6">
                        <h4 className="text-base ">Priority:</h4>
                        <Badge className="space-x-2 border border-primary/30 w-fit">
                            <Flag weight="duotone" size={20}/>
                            <span className="tracking-wider">High</span>
                        </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-x-6 text-base">
                        <h4 className="">Start Point:</h4>
                        <p className="font-semibold">{start_point}</p>
                    </div>


                    <div className="grid grid-cols-2 gap-x-6 text-base">
                        <h4 className="">End Point:</h4>
                        <p className="font-semibold">{end_point}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-x-6 text-base">
                        <h4 className="">Est Distance:</h4>
                        <p className="font-semibold">{est_distance} Metres</p>
                    </div>

                    <div className="grid grid-cols-2 gap-x-6 text-base">
                        <h4 className="">Status:</h4>
                        <Badge className="bg-teal-500 hover:bg-teal-500 w-fit space-x-2 px-3">
                            <SealCheck weight="duotone" size={18}/>
                            <span>{segment_status}</span>
                        </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-x-6 text-base">
                        <h4 className="">Start Date:</h4>
                        <p className="font-semibold"> {startDate} </p>
                    </div>

                    <div className="grid grid-cols-2 gap-x-6 text-base">
                        <h4 className="">End Date:</h4>
                        <p className="font-semibold"> {end_date} </p>
                    </div>
                </div>

                  <div className="space-y-4 flex flex-col">
                    <Button onClick={handleNavigation}>
                      <UserCheck weight="duotone" className="mr-2 h-4 w-4 " />

                      Assign Supervisor
                    </Button>

                    <Sheet>
                      <SheetTrigger asChild>
                        <Button
                          variant="secondary"
                        >
                          <PencilSimple weight="duotone" className="mr-2 h-4 w-4 " />
                          Edit Segment
                        </Button>

                      </SheetTrigger>
                      <SheetContent>
                        <SheetHeader>
                          <SheetTitle>Edit Segment </SheetTitle>
                          <SheetDescription>
                            Use the form below to update segment details.
                          </SheetDescription>
                        </SheetHeader>
                        <div className="mt-0">
                          <ScrollArea className="h-screen w-full pr-3 flex flex-col space-y-4 justify-between">
                           <EditProjectSegmentForm segment_id={segment_id} />
                          </ScrollArea>
                        </div>
                      </SheetContent>
                    </Sheet>

                  </div>
            </div>

            <div className="my-4">
                <TopNav items={topNavItems}/>
            </div>

            <div className="my-8">
                {children}
            </div>
        </div>
    );
}

export default SegmentLayout;
