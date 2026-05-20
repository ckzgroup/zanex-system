"use client";

import React from 'react';
import {Badge} from "@/components/ui/badge";
import {Flag, SealCheck} from "@phosphor-icons/react";
import {usePathname} from "next/navigation";
import {useSingleSegment} from "@/actions/get-project-segment";
import {formatDate} from "@/utils/format-date";
import Loading from "@/app/(admin)/(projects)/loading";


interface Props {
    children: React.ReactNode;
}


function SegmentAssignLayout({ children }: Props) {

    const pathname = usePathname()
    const project_id = parseInt(pathname.replace('/projects/',''));
    const segment_id = parseInt(pathname.replace(`/projects/${project_id}/segments/`,''));

    const { isLoading, error, data } = useSingleSegment('/project_segment/getSegment', segment_id)

    const segment = Array.isArray(data) ? data.reverse() : [];

    if (!segment) return <Loading/>;


    return (
        <> { segment.map((item: any, index: number) => (
        <div key={index}>
            <div className="flex md:items-center justify-between flex-col md:flex-row space-y-4">
                <div className="flex items-center  space-x-6">
                    <h1 className="text-3xl font-bold"> {item.segment_name} </h1>
                    <Badge
                        className="font-semibold tracking-wider bg-primary/20 text-primary py-1.5 px-2 text-sm hover:text-white">
                        {item.project_name}
                    </Badge>

                    <Badge
                        className="font-semibold tracking-wider bg-orange-500/20 text-orange-400 dark:text-orange-300 py-1.5 px-2 text-sm hover:bg-orange-400 hover:text-white">
                        Segment
                    </Badge>
                </div>

                <div className="flex items-center space-x-6">
                    <div className="space-y-1">
                        <h4 className="text-muted-foreground text-xs">CREATED</h4>
                        <p className="text-sm font-semibold">
                            {formatDate(item.segment_create_date)}
                        </p>
                    </div>

                    <div className="space-y-1">
                        <h4 className="text-muted-foreground text-xs">SEGMENT CODE</h4>
                        <p className="text-sm font-semibold">#{item.segment_code}</p>
                    </div>
                </div>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2">
                <div className="mt-12 space-y-4">
                    <h4 className="text-lg font-bold tracking-wide">Details</h4>
                    <div className="flex justify-between flex-col md:flex-row space-y-4">

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-x-6">
                                <h4 className="text-base ">Priority:</h4>
                                <Badge className="space-x-2 border border-primary/30">
                                    <Flag weight="duotone" size={20}/>
                                    <span className="tracking-wider">High</span>
                                </Badge>
                            </div>

                            <div className="grid grid-cols-2 gap-x-6 text-base">
                                <h4 className="">Start Point:</h4>
                                <p className="font-semibold">{item.start_point}</p>
                            </div>


                            <div className="grid grid-cols-2 gap-x-6 text-base">
                                <h4 className="">End Point:</h4>
                                <p className="font-semibold">{item.end_point}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-x-6 text-base">
                                <h4 className="">Est Distance:</h4>
                                <p className="font-semibold">{item.est_distance} Metres</p>
                            </div>

                            <div className="grid grid-cols-2 gap-x-6 text-base">
                                <h4 className="">Status:</h4>
                                <Badge className="bg-teal-500 hover:bg-teal-500 w-fit space-x-2 px-3">
                                    <SealCheck weight="duotone" size={18}/>
                                    <span>{item.segment_status}</span>
                                </Badge>
                            </div>

                            <div className="grid grid-cols-2 gap-x-6 text-base">
                                <h4 className="">Start Date:</h4>
                                <p className="font-semibold"> {formatDate(item.start_date)} </p>
                            </div>

                            <div className="grid grid-cols-2 gap-x-6 text-base">
                                <h4 className="">End Date:</h4>
                                <p className="font-semibold"> {formatDate(item.end_date)} </p>
                            </div>
                        </div>

                    </div>
                </div>

                <div className="mt-12 space-y-4">
                    <h4 className="text-lg font-bold tracking-wide">Mandatory Documents</h4>
                    <div className="my-10 flex justify-between flex-col md:flex-row space-y-4">
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-x-6 text-base">
                            <h4 className="">P.O File :</h4>
                                {item.project_po_file && item.project_po_file.length > 0 ? (
                                    <p className="font-semibold">{item.project_po_file}</p>
                                ) : (
                                    <p className="font-semibold text-destructive"> File not found </p>
                                )}
                        </div>


                        <div className="grid grid-cols-2 gap-x-6 text-base">
                            <h4 className="">Ehs File :</h4>
                            {item.project_ehs_file && item.project_ehs_file.length > 0 ? (
                                <p className="font-semibold">{item.project_ehs_file}</p>
                            ) : (
                                <p className="font-semibold text-destructive"> File not found </p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-x-6 text-base">
                            <h4 className="">Permit File :</h4>
                            {item.project_permit && item.project_permit.length > 0 ? (
                                <p className="font-semibold">{item.project_permit}</p>
                            ) : (
                                <p className="font-semibold text-destructive"> File not found </p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-x-6 text-base">
                            <h4 className="">Design File :</h4>
                            {item.project_design && item.project_design.length > 0 ? (
                                <p className="font-semibold">{item.project_design}</p>
                            ) : (
                                <p className="font-semibold text-destructive"> File not found </p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-x-6 text-base">
                            <h4 className="">Workers Cert :</h4>
                            {item.project_certificate_of_workers && item.project_certificate_of_workers.length > 0 ? (
                                <p className="font-semibold">{item.project_certificate_of_workers}</p>
                            ) : (
                                <p className="font-semibold text-destructive"> File not found </p>
                            )}
                        </div>
                    </div>

                </div>
                </div>

                <div className="mt-12 space-y-4">
                    <h4 className="text-lg font-bold tracking-wide">Other Documents</h4>
                    <div className="my-10 flex justify-between flex-col md:flex-row space-y-4">
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-x-6 text-sm">
                            <p className="font-semibold text-destructive">No other document files Uploaded!</p>
                        </div>
                    </div>
                </div>
                </div>

            </div>


            <div className="my-8">
                {children}
            </div>
        </div>
        ))
        }</>
    );
}

export default SegmentAssignLayout;
