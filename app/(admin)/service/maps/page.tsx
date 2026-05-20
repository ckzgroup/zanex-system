"use client";

import React from 'react';
import HeatmapComponent from "@/app/(admin)/service/maps/HeatmapComponent";
import {TopNav} from "@/components/elements/top-nav";

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
                    <h2 className="font-heading text-xl font-bold">Heatmap</h2>
                    <p className="text-muted-foreground">
                        View the heatmap of the ticket distribution.
                    </p>
                </div>

                <div className="relative flex space-x-2 items-center">
                    <HeatmapComponent/>
                </div>

            </div>
        </div>
    )
}

export default HeatmapPage;
