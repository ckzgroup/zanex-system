"use client";

import React from 'react';
import SegmentLayout from "@/components/pages/projects/projects/segments/segment-layout";
import { usePathname } from "next/navigation";
import { useSingleSegment } from "@/actions/get-project-segment";
import SegmentMapComponent from "@/app/(admin)/(projects)/projects/[slug]/segments/[id]/maps/SegmentMapComponent";

function ProjectMapPage() {
  const pathname = usePathname();

  // Split the pathname safely to extract dynamic route parameters by position
  // E.g., "/projects/[project_id]/segments/[segment_id]/maps"
  const pathSegments = pathname.split('/');
  const projectsIndex = pathSegments.indexOf('projects');
  const segmentsIndex = pathSegments.indexOf('segments');

  const project_id = projectsIndex !== -1 ? parseInt(pathSegments[projectsIndex + 1]) : 0;
  const segment_id = segmentsIndex !== -1 ? parseInt(pathSegments[segmentsIndex + 1]) : 0;

  const { isLoading, error, data } = useSingleSegment("/budget/getSegmentExpenditure", segment_id);
  const budget = Array.isArray(data) ? data.reverse() : [];

  return (
    <SegmentLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-8 w-1 bg-primary rounded-full"/>
            <h4 className="text-primary text-lg font-bold tracking-wide">Segment Map</h4>
          </div>
        </div>

        {/* Map Display Container */}
        <div className="relative w-full flex items-center justify-start">
          <SegmentMapComponent />
        </div>
      </div>
    </SegmentLayout>
  );
}

export default ProjectMapPage;
