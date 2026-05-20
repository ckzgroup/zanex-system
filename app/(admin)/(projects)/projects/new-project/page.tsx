"use client";

import React from 'react';

import AddProjectForm from "@/components/lib/forms/add-project-form";

function NewProjectPage() {
    return (
        <div>
            <div className="mb-8">
                <h2 className='font-heading text-2xl font-bold'> Add Project </h2>
                <p className='text-muted-foreground'> Use the form below to add new project to the system. </p>
            </div>

            <AddProjectForm/>
        </div>
    );
}

export default NewProjectPage;