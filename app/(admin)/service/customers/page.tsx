"use client";

import React, {useRef} from 'react';
import {DataTable} from "@/components/tables/services/clients/data-table";
import {columns} from "@/components/tables/services/clients/column";

import {Button, buttonVariants} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {Plus} from "@phosphor-icons/react";
import {TopNav} from "@/components/elements/top-nav";

import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger,} from "@/components/ui/sheet"
import AddClientForm from "@/components/lib/forms/add-client-form";
import {useQuery} from "@tanstack/react-query";
import useAuthStore from "@/hooks/use-user";
import useFetchData from "@/actions/use-api";
import Loading from "@/app/(admin)/(projects)/loading";

const topNavItems = [
    {
        title: "Table View",
        href: "/service/customers",
    },
    {
        title: "Card View",
        href: "/service/customers/card-view",
    },
]


function CustomersPage() {

    // Export to PDF
    const targetRef = useRef(null);
    const timestamp = new Date().toISOString().slice(0, 10);

    const { isLoading, error, data } = useFetchData('/customers');

    const customers = Array.isArray(data) ? data.reverse() : [];


    if (isLoading) return <div> <Loading/> </div>;


    return (
        <div>
            <div className='flex flex-col md:flex-row justify-between gap-6  mb-8'>
                <div>
                    <h2 className='font-heading text-2xl font-bold'> Customers </h2>
                    <p className='text-muted-foreground'> View and manage all your customers </p>
                </div>

                <div className='flex space-x-2 items-center'>
                    {/*<Button variant="outline" className='space-x-1'*/}
                    {/*        onClick={() => generatePDF(targetRef, {filename: `qudrive-requests-${timestamp}.pdf`})}>*/}
                    {/*    <Image src='/images/pdf.svg' alt='logo' height={18} width={18} style={{objectFit: "cover"}}/>*/}
                    {/*    <span>Save PDF</span>*/}
                    {/*</Button>*/}

                    {/*<CSVLink data={data} filename={`qudrive-requests-${timestamp}.csv`}>*/}
                    {/*    <Button variant="outline" className='space-x-1'>*/}
                    {/*        <Image src='/images/csv.svg' alt='logo' height={18} width={18}*/}
                    {/*               style={{objectFit: "cover"}}/>*/}
                    {/*        <span>Save CSV</span>*/}
                    {/*    </Button>*/}
                    {/*</CSVLink>*/}

                    <Sheet>
                        <SheetTrigger asChild>
                    <Button
                        className={cn(
                            buttonVariants({variant: "default"}),
                            "space-x-1"
                        )}
                    >
                        <Plus className='h-4 w-4'/>
                        <span> Add Client </span>
                    </Button>
                        </SheetTrigger>

                        <SheetContent>
                            <SheetHeader>
                                <SheetTitle>Add Client</SheetTitle>
                                <SheetDescription>
                                    Use the form below to add a new client to the system.
                                </SheetDescription>
                            </SheetHeader>
                            <div className="mt-6">
                                <AddClientForm/>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>

            </div>

            <div className="my-4">
                <TopNav items={topNavItems}/>
            </div>

            <div>
                <DataTable columns={columns} data={customers}/>
            </div>
        </div>
    );
}

export default CustomersPage;