"use client";

import React, {useCallback, useRef, useState} from 'react';

import MapComponent from "@/app/(admin)/service/cases/[slug]/map/map-component";
import BackButton from "@/components/lib/back-button";

function MapPage() {

    return (
        <div className="w-full relative">
            <BackButton/>
            <div className="flex flex-col space-y-6 mb-8 pt-12">
                <div>
                    <h2 className="font-heading text-2xl font-bold">Map</h2>
                    <p className="text-muted-foreground"> View your ticket updates locations </p>
                </div>

                <div>
                    <MapComponent/>
                </div>
            </div>
        </div>
    );
}


export default MapPage;

