"use client";

import React, {useRef} from 'react';
import Image from "next/image";
import Link from "next/link";
import {DataTable} from "@/components/tables/projects/services/data-table";
import {DataTable as BudgetTable} from "@/components/tables/projects/budget-services/data-table";
import {columns} from "@/components/tables/projects/services/column";
import {columns as budgetColumn } from "@/components/tables/projects/budget-services/column";
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
import useFetchData from "@/actions/use-api";
import Loading from "@/app/(admin)/(projects)/loading";
import AddProjectServiceForm from "@/components/lib/forms/projects/add-project-service-form";
import AddBudgetServiceForm from "@/components/lib/forms/projects/add-budget-service-form";


function ServicesPage() {

    // Export to PDF
    const targetRef = useRef(null);
    const timestamp = new Date().toISOString().slice(0, 10);

    const { isLoading, error, data } = useFetchData('/project_service/getProjectServices');
    const { isLoading: bLoading, error: bError, data:bData } = useFetchData('/budget/getBudgetItem');

    const services = Array.isArray(data) ? data.reverse() : [];
    const budgetservices = Array.isArray(bData) ? bData.reverse() : [];

    if (isLoading) return <div> <Loading/> </div>;

    return (
        <div className="space-y-12">
           <div>
               <div className='flex flex-col md:flex-row justify-between gap-6  mb-8'>
                   <div>
                       <h2 className='font-heading text-2xl font-bold'> Project Key Performance Indicators (KPI) </h2>
                       <p className='text-muted-foreground'> View and manage all your project KPIs </p>
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
                                   <span> Add KPI </span>
                               </Button>
                           </SheetTrigger>

                           <SheetContent>
                               <SheetHeader>
                                   <SheetTitle>Add KPI</SheetTitle>
                                   <SheetDescription>
                                       Use the form below to add a new KPI to the system.
                                   </SheetDescription>
                               </SheetHeader>
                               <div className="mt-6">
                                   <AddProjectServiceForm/>
                               </div>
                           </SheetContent>
                       </Sheet>
                   </div>

               </div>
               <div>
                   <DataTable columns={columns} data={services}/>
               </div>
           </div>

            <div>
                <div className='flex flex-col md:flex-row justify-between gap-6  mb-8'>
                    <div>
                        <h2 className='font-heading text-2xl font-bold'> Budget Items </h2>
                        <p className='text-muted-foreground'> View and manage all your budget items </p>
                    </div>

                    <div className='flex space-x-2 items-center'>

                        <Sheet>
                            <SheetTrigger asChild>
                                <Button
                                    className={cn(
                                        buttonVariants({variant: "default"}),
                                        "space-x-1 bg-accent-foreground"
                                    )}
                                >
                                    <Plus className='h-4 w-4'/>
                                    <span> Add Budget Item </span>
                                </Button>
                            </SheetTrigger>

                            <SheetContent>
                                <SheetHeader>
                                    <SheetTitle>Add Budget Item</SheetTitle>
                                    <SheetDescription>
                                        Use the form below to add a new budget item to the system.
                                    </SheetDescription>
                                </SheetHeader>
                                <div className="mt-6">
                                    <AddBudgetServiceForm/>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                </div>
                <div>
                    <BudgetTable columns={budgetColumn} data={budgetservices}/>
                </div>
            </div>
        </div>
    );
}

export default ServicesPage;