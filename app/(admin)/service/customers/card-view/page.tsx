"use client";

import React from 'react';
import {CSVLink} from "react-csv";
import {Button, buttonVariants} from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import {cn} from "@/lib/utils";
import {Plus} from "@phosphor-icons/react";
import {TopNav} from "@/components/elements/top-nav";
import CustomerCard from "@/components/pages/services/customers/customer-card";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet";
import AddClientForm from "@/components/lib/forms/add-client-form";
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

function CustomerCardPage() {

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
                <TopNav items={topNavItems} />
            </div>

            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6'>
                {customers.map((item:any, index: number) => (
                    <div key={index} >
                        <CustomerCard
                            image=""
                            name={item.customer_name}
                            email={item.customer_email}
                            phone={item.customer_contact}
                            image_name={Array.from(item.customer_name)[0] as string}
                            link={`/service/customers/${item.customer_id}`}
                        />
                    </div>
                ))}

            </div>
        </div>
    );
}

export default CustomerCardPage;