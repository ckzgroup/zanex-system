"use client";

import React from 'react';
import SegmentReportCard from "@/components/pages/projects/projects/segments/segment-report-card";
import SegmentLayout from "@/components/pages/projects/projects/segments/segment-layout";
import {usePathname} from "next/navigation";
import {useSingleSegment} from "@/actions/get-project-segment";

function IncidentReportPage() {

    const pathname = usePathname()
    const project_id = parseInt(pathname.replace('/projects/',''));
    const segment_id = parseInt(pathname.replace(`/projects/${project_id}/segments/`,''));

    const { isLoading, error, data } = useSingleSegment('/segment_dashboard/incidentReport', segment_id)

    const reports = Array.isArray(data) ? data.reverse() : [];

    return (
        <SegmentLayout>
        <div className="space-y-6">
            <div className="flex items-center space-x-4">
                <div className="h-8 w-1 bg-primary rounded-full"/>
                <h4 className="text-primary text-lg font-bold tracking-wider"> Incident Reports </h4>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6'>
                {reports.length > 0 ? (
                    reports.map((item, index) => (
                    <div key={index}>
                        <SegmentReportCard
                            date={item.incidence_date}
                            title="Report"
                            message={item.incidence_message}
                            location={item.incidence_location}
                            supervisor={item.supervisor_name}
                            photo_url={item.incidence_image}
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

export default IncidentReportPage;