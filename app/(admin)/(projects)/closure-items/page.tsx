"use client";

import React, {useEffect, useRef, useState} from 'react';


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

import useFetchData from "@/actions/use-api";
import Loading from "@/app/(admin)/(projects)/loading";
import AddClosureItemForm from "@/components/lib/forms/projects/add-closure-item-form";
import {DataTable} from "@/components/tables/projects/closure-items/data-table";
import {columns} from "@/components/tables/projects/closure-items/column";


function ClosurePage() {

    // Get Closure Items
    const { isLoading, error, data } = useFetchData('/segment_closure/getClosureParameters');
    const closure_items = Array.isArray(data) ? data.reverse() : [];


    if (isLoading) return <div> <Loading/> </div>;

    return (
        <div>
            <div className='flex flex-col md:flex-row justify-between gap-6  mb-8'>
                <div>
                    <h2 className='font-heading text-2xl font-bold'> Closure Items </h2>
                    <p className='text-muted-foreground'> View and manage all your closure items in the system </p>
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
                                <span> Add Closure Item </span>
                            </Button>
                        </SheetTrigger>

                        <SheetContent>
                            <SheetHeader>
                                <SheetTitle> Closure Item  </SheetTitle>
                                <SheetDescription>
                                    Use the form below to add a new closure item to the system.
                                </SheetDescription>
                            </SheetHeader>
                            <div className="mt-6">
                                <AddClosureItemForm />
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>

            </div>


            <div>
                <DataTable columns={columns} data={closure_items}/>
            </div>
        </div>
    );
}

export default ClosurePage;