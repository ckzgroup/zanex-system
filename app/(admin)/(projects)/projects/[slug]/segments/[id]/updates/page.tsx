"use client";

import React from 'react';
import SegmentUpdateCard from "@/components/pages/projects/projects/segments/segment-update-card";
import SegmentLayout from "@/components/pages/projects/projects/segments/segment-layout";
import {usePathname} from "next/navigation";
import {useSingleSegment} from "@/actions/get-project-segment";
import Loading from "@/app/(admin)/(projects)/loading";

function SegmentUpdatesPage() {

    const pathname = usePathname()
    const project_id = parseInt(pathname.replace('/projects/',''));
    const segment_id = parseInt(pathname.replace(`/projects/${project_id}/segments/`,''));

    const { isLoading, error, data } = useSingleSegment('/segment_dashboard/segmentUpdate', segment_id)

    const updates = Array.isArray(data) ? data.reverse() : [];


    const IMAGE = process.env.NEXT_PUBLIC_IMAGES + '/projectImages/';


    console.log("Updates", updates)

    if (isLoading) return <div> <Loading/> </div>;

    return (
        <SegmentLayout>
        <div className="space-y-6">
            <div className="flex items-center space-x-4">
                <div className="h-8 w-1 bg-primary rounded-full"/>
                <h4 className="text-primary text-lg font-bold tracking-wider"> Segment Updates </h4>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6'>
                {updates.length > 0 ? (
                    updates.map((item, index) => (
                        <div key={index}>
                            <SegmentUpdateCard
                                title={item.service_name}
                                date={item.date_created}
                                name={item.service_name}
                                location={item.coordinates}
                                comment={item.comment}
                                service_quantity={item.service_quantity}
                                supervisor={item.technician_name}
                                photo_url={item.image}
                            />
                        </div>
                    ))
                ) : (
                    <div>No updates available</div> // This is the empty state message
                )}

            </div>
        </div>
        </SegmentLayout>
    );
}

export default SegmentUpdatesPage;