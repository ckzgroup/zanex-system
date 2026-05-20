"use client";

import React, {useRef} from 'react';
import Image from "next/image";
import Link from "next/link";
import {DataTable} from "@/components/tables/services/job-card/data-table";
import {columns} from "@/components/tables/services/job-card/column";
import {CSVLink} from "react-csv";

import {Button, buttonVariants} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {Plus} from "@phosphor-icons/react";
import {TopNav} from "@/components/elements/top-nav";

import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import AddClientForm from "@/components/lib/forms/add-client-form";
import AddServiceForm from "@/components/lib/forms/add-service-form";
import AddJobCardForm from "@/components/lib/forms/add-job-card-form";
import useFetchData from "@/actions/use-api";
import Loading from "@/app/(admin)/(projects)/loading";


function JobCardPage() {

    // Export to PDF
    const targetRef = useRef(null);
    const timestamp = new Date().toISOString().slice(0, 10);

    const { isLoading, error, data } = useFetchData('/services/serviceCategory');

    const job_cards = Array.isArray(data) ? data.reverse() : [];

    if (isLoading) return <div> <Loading/> </div>;

    return (
        <div>
            <div className='flex flex-col md:flex-row justify-between gap-6  mb-8'>
                <div>
                    <h2 className='font-heading text-2xl font-bold'> Job Cards </h2>
                    <p className='text-muted-foreground'> View and manage all your job cards </p>
                </div>

                <div className='flex space-x-2 items-center'>

                    <Sheet>
                        <SheetTrigger asChild>
                    <Button
                        className={cn(
                            buttonVariants({variant: "default"}),
                            "space-x-1"
                        )}
                    >
                        <Plus className='h-4 w-4'/>
                        <span> Add Job Card </span>
                    </Button>
                        </SheetTrigger>

                        <SheetContent>
                            <SheetHeader>
                                <SheetTitle>Add Job Card</SheetTitle>
                                <SheetDescription>
                                    Use the form below to add a new job card to the system.
                                </SheetDescription>
                            </SheetHeader>
                            <div className="mt-6">
                                <AddJobCardForm />
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>

            </div>


            <div>
                <DataTable columns={columns} data={job_cards}/>
            </div>
        </div>
    );
}

export default JobCardPage;