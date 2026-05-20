"use client";

import React from 'react';
import {TopNav} from "@/components/elements/top-nav";
import DistributionMap from "@/app/(admin)/service/maps/distribution/DistributionMap";
import FaultsMap from "@/app/(admin)/service/maps/fault/FaultsMap";

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
function FaultmapPage() {

    return (
        <div className="w-full">
            <div className="flex flex-col space-y-4 mb-8">
                <h2 className="font-heading text-2xl font-bold"> Maps </h2>
                <div className="my-4">
                    <TopNav items={topNavItems}/>
                </div>

                <div>
                    <h2 className="font-heading text-xl font-bold"> Fault Distribution Map </h2>
                    <p className="text-muted-foreground">
                        View the fault distribution in every region.
                    </p>
                </div>

                <div className="relative flex space-x-2 items-center">
                    <FaultsMap/>
                </div>

            </div>
        </div>
    )
}

export default FaultmapPage;
