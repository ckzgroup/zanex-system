"use client";

import React from 'react';
import {AddTicketForm} from "@/components/lib/forms/add-ticket-form";

function NewCasePage() {
    return (
        <div>
            <div className="mb-8">
                <h2 className='font-heading text-2xl font-bold'> Create Case </h2>
                <p className='text-muted-foreground'> Use the form below to add new case to the system. </p>
            </div>

            <div>
                <AddTicketForm/>
            </div>
        </div>
    );
}

export default NewCasePage;