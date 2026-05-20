"use client";

import React from 'react';
import {TopNav} from "@/components/elements/top-nav";
import DistributionMap from "@/app/(admin)/service/maps/distribution/DistributionMap";
import DistributionMapFilter from "@/app/(admin)/service/maps/distribution/DistributionMapFilter";

const topNavItems = [
    {
        title: "Heatmap",
        href: "/service/maps",
    },
    {
        title: "Cases Distribution Map",
        href: "/service/maps/distribution",
    },
  {
    title: "Fault Distribution Map",
    href: "/service/maps/fault",
  },
]
function HeatmapPage() {

    return (
        <div className="w-full">
            <div className="flex flex-col space-y-4 mb-8">
                <h2 className="font-heading text-2xl font-bold"> Maps </h2>
                <div className="my-4">
                    <TopNav items={topNavItems}/>
                </div>

                <div>
                    <h2 className="font-heading text-xl font-bold"> Case Distribution Map </h2>
                    <p className="text-muted-foreground">
                        View the ticket distribution in every region.
                    </p>
                </div>

                <div className="relative flex space-x-2 items-center">
                    {/*<DistributionMap/>*/}
                  <DistributionMapFilter/>
                </div>

            </div>
        </div>
    )
}

export default HeatmapPage;
