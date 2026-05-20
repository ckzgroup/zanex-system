"use client";

import React from 'react';
import {Badge} from "@/components/ui/badge";
import {Flag, MapPin, Plus} from "@phosphor-icons/react";
import {TopNav} from "@/components/elements/top-nav";
import {usePathname} from "next/navigation";
import {useSingleProject} from "@/actions/get-project";
import {formatDate} from "@/utils/format-date";
import Loading from "@/app/(admin)/(projects)/loading";

interface Props {
    children: React.ReactNode;
}

function ProjectLayout({ children }: Props) {

    const pathname = usePathname()
    const project_id = parseInt(pathname.replace('/projects/',''));

    const topNavItems = [
        {
            title: "Overview",
            href: `/projects/${project_id}`,
        },
        {
            title: "Segments",
            href: `/projects/${project_id}/segments`,
        },
        {
            title: "Calendar",
            href: `/projects/${project_id}/calendar`,
        },
        {
            title: "Files",
            href: `/projects/${project_id}/files`,
        },
    ]

    const { isLoading, error, data } = useSingleProject('/project/getProject', project_id)

    const project = Array.isArray(data) ? data.reverse() : [];

    const {
        project_name,
        customer_name,
        project_create_date,
        project_start_date,
        project_end_date,
        region_name,
        project_manager,
    } = project[0] || {};

    if (!project) return <Loading/>;

    return (
            <div>
                <div className="flex md:items-center justify-between flex-col md:flex-row space-y-4">
                    <div className="flex items-center  space-x-6">
                        <div
                            className="p-1 h-14 w-14 rounded-md bg-primary shadow-inner shadow-white flex items-center justify-center">
                            <h1 className="text-2xl font-bold text-white">
                                {project_name?.charAt(0).toUpperCase()}
                            </h1>
                        </div>

                        <h1 className="text-3xl font-bold">{project_name}</h1>
                        <Badge
                            className="font-semibold tracking-wider bg-primary/20 text-primary py-1.5 px-3 text-sm hover:text-white">
                            {customer_name}
                        </Badge>
                    </div>

                    <div className="flex items-center space-x-6">
                        <div className="space-y-1">
                            <h4 className="text-muted-foreground text-xs">CREATED DATE</h4>
                            <p className="font-semibold">{project_create_date}</p>
                        </div>
                    </div>

                </div>

                <div className="my-10 flex justify-between flex-col md:flex-row space-y-4">
                    <div className="space-y-4">
                        <div className="flex items-center space-x-12">
                            <h4 className="text-base ">Priority:</h4>
                            <Badge className="space-x-2 border border-primary/30">
                                <Flag weight="duotone" size={20}/>
                                <span className="tracking-wider">High</span>
                            </Badge>
                        </div>

                        <div className="flex items-center space-x-8">
                            <h4 className="text-base ">Project Manager:</h4>
                            <p className="font-semibold">{project_manager}</p>
                        </div>

                        <div className="flex items-center space-x-12 text-base">
                            <h4 className="">Start Date:</h4>
                            <p className="font-semibold">{formatDate(project_start_date)}</p>
                        </div>

                        <div className="flex items-center space-x-12 text-base">
                            <h4 className="">End Date:</h4>
                            <p className="font-semibold">{formatDate(project_end_date)}</p>
                        </div>

                        {/*<div className="flex items-center space-x-12">*/}
                        {/*    <h4 className="text-base ">Tags:</h4>*/}
                        {/*    <div className="flex items-center space-x-4">*/}
                        {/*        <Badge*/}
                        {/*            className="space-x-2 bg-[#FFDACC] border border-[#FF4500] hover:bg-muted py-1 px-4">*/}
                        {/*            <span className="tracking-wider text-[#FF4500]"> Installation </span>*/}
                        {/*        </Badge>*/}
                        {/*        <Badge*/}
                        {/*            className="space-x-2 bg-[#DCE4CD] border border-[#507705] hover:bg-muted py-1 px-4">*/}
                        {/*            <span className="tracking-wider text-[#507705]"> Labelling </span>*/}
                        {/*        </Badge>*/}
                        {/*        <Badge*/}
                        {/*            className="space-x-2 bg-[#D9CEF5] border border-[#420BCB] hover:bg-muted py-1 px-4">*/}
                        {/*            <span className="tracking-wider text-[#420BCB]"> Configuration </span>*/}
                        {/*        </Badge>*/}
                        {/*        <Badge*/}
                        {/*            className="space-x-2 bg-muted border text-muted-foreground border-text-muted-foreground hover:bg-muted py-1 px-4">*/}
                        {/*            <Plus weight="bold" size={16}/>*/}
                        {/*            <span className="tracking-wider font-light">Add Tag</span>*/}
                        {/*        </Badge>*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                    </div>

                    <div>
                        <div className="flex items-center space-x-4">
                            <MapPin weight="duotone" size={24}/>
                            <h4 className="text-lg font-bold tracking-wide">
                                {region_name}
                            </h4>
                        </div>
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

export default ProjectLayout;