"use client";

import React from "react";
import SegmentUpdateCard from "@/components/pages/projects/projects/segments/segment-update-card";
import SegmentLayout from "@/components/pages/projects/projects/segments/segment-layout";
import { usePathname } from "next/navigation";
import { useSingleSegment } from "@/actions/get-project-segment";
import Loading from "@/app/(admin)/(projects)/loading";
import MonthlySlaReport from "@/components/pages/services/monthly-sla-report";
import SegmentReport from "@/components/pages/projects/reports/segment-report";
import FilteredSegmentReport from "@/components/pages/projects/reports/filtered-segment-report";
import SegmentBudgetReport from "@/components/pages/projects/reports/segment-budget-report";
import FilteredSegmentBudgetReport from "@/components/pages/projects/reports/filtered-segment-budget-report";

function SegmentUpdatesPage() {
  const pathname = usePathname();
  const project_id = parseInt(pathname.replace("/projects/", ""));
  const segment_id = parseInt(
    pathname.replace(`/projects/${project_id}/segments/`, ""),
  );

  const { isLoading, error, data } = useSingleSegment(
    "/segment_dashboard/segmentUpdate",
    segment_id,
  );

  const updates = Array.isArray(data) ? data.reverse() : [];

  if (isLoading)
    return (
      <div>
        {" "}
        <Loading />{" "}
      </div>
    );

  return (
    <SegmentLayout>
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="h-8 w-1 bg-primary rounded-full" />
          <h4 className="text-primary text-lg font-bold tracking-wider">
            {" "}
            Segment Reports{" "}
          </h4>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold"> Segment Report </h2>
            </div>
            <SegmentReport />
          </div>
          <hr />

          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold"> Filtered Segment Report </h2>
            </div>
            <FilteredSegmentReport />
          </div>
          <hr />

          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold"> Segment Budget Report </h2>
            </div>
            <SegmentBudgetReport />
          </div>
          <hr />

          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold">
                {" "}
                Filtered Segment Budget Report{" "}
              </h2>
            </div>
            <FilteredSegmentBudgetReport />
          </div>

          <hr />
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold"> Generate KML & KMZ Report </h2>
            </div>
            <div className="flex space-x-6 items-center">
              <a
                href={`https://k-task.ckzgroup.com/upload/fpdf/generate/kmz-kml/project-kmz.php?segment_id=${segment_id}`}
                download
                target="_blank"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Download KMZ Report
              </a>

              <a
                href={`https://k-task.ckzgroup.com/upload/fpdf/generate/kmz-kml/project-kml.php?segment_id=${segment_id}`}
                download
                target="_blank"
                className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700">
                Download KML Report
              </a>
            </div>
          </div>
        </div>
      </div>
    </SegmentLayout>
  );
}

export default SegmentUpdatesPage;
