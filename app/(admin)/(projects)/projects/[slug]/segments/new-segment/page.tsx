"use client";

import React from 'react';

import {AddSegmentForm} from "@/components/lib/forms/add-segment-form";

function NewSegmentPage() {
    return (
        <div>
            <div className="mb-8">
                <h2 className='font-heading text-2xl font-bold'> Add Segment </h2>
                <p className='text-muted-foreground'> Use the form below to add new project segment to the system. </p>
            </div>

            <AddSegmentForm/>
        </div>
    );
}

export default NewSegmentPage;