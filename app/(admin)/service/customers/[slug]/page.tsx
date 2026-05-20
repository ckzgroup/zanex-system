"use client";

import React from 'react';

import {cn} from "@/lib/utils";
import Link from "next/link";
import {Button, buttonVariants} from "@/components/ui/button";
import {Plus} from "lucide-react";
import CustomerLayout from "@/components/pages/services/customers/customer-layout";
import {DataTable} from "@/components/tables/services/sla/data-table";
import {columns} from "@/components/tables/services/sla/column";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet";
import AddClientForm from "@/components/lib/forms/add-client-form";
import AddSLAForm from "@/components/lib/forms/add-sla-form";
import {ScrollArea} from "@/components/ui/scroll-area";
import {usePathname} from "next/navigation";
import useAuthStore from "@/hooks/use-user";
import useFetchData from "@/actions/use-api";
import Loading from "@/app/(admin)/(projects)/loading";
import {useSingleCustomer} from "@/actions/get-customer";


function SLAPage() {

    const pathname = usePathname()
    const customer_id = parseInt(pathname.replace('/service/customers/',''));

    const { isLoading, error, data } = useSingleCustomer('/ticketing', customer_id);

    const slas = Array.isArray(data) ? data.reverse() : [];

    if (isLoading) return <div> <Loading/> </div>;

    return (
        <CustomerLayout>
            <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="h-8 w-1 bg-primary rounded-full"/>
                            <h4 className="text-primary text-lg font-bold tracking-wide"> Case SLA </h4>
                        </div>

                        <Sheet>
                            <SheetTrigger asChild >
                                <Button
                                    className={cn(
                                        buttonVariants({variant: "default"}),
                                        "space-x-1"
                                    )}
                                >
                                    <Plus className='h-4 w-4'/>
                                    <span> Add Case SLA </span>
                                </Button>
                            </SheetTrigger>

                            <SheetContent className="w-[400px] sm:w-[540px] lg:w-[800px]">
                                <ScrollArea className="h-full w-fit pr-2">
                                <SheetHeader>
                                    <SheetTitle>Add Case SLA</SheetTitle>
                                    <SheetDescription>
                                        Use the form below to add a new Case SLA to the system.
                                    </SheetDescription>
                                </SheetHeader>
                                <div className="mt-6">
                                    <AddSLAForm/>
                                </div>
                                </ScrollArea>
                            </SheetContent>
                        </Sheet>
                    </div>

                <div>
                    <DataTable columns={columns} data={slas}/>
                </div>
            </div>
        </CustomerLayout>

    );
}

export default SLAPage;