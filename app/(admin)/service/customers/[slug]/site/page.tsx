"use client";

import React from 'react';

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import Image from "next/image";
import {TopNav} from "@/components/elements/top-nav";
import {cn} from "@/lib/utils";
import Link from "next/link";
import {Button, buttonVariants} from "@/components/ui/button";
import {Plus} from "lucide-react";
import CustomerLayout from "@/components/pages/services/customers/customer-layout";
import {DataTable} from "@/components/tables/services/site/data-table";
import {columns} from "@/components/tables/services/site/column";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet";
import AddServiceForm from "@/components/lib/forms/add-service-form";
import AddSiteForm from "@/components/lib/forms/add-site-form";
import {usePathname} from "next/navigation";
import {useSingleCustomer} from "@/actions/get-customer";
import Loading from "@/app/(admin)/(projects)/loading";

function SitePage() {

    const pathname = usePathname()
    const customer_id = parseInt(pathname.replace('/service/customers/',''));

    const { isLoading, error, data } = useSingleCustomer('/radar/site/customer', customer_id);

    const sites = Array.isArray(data) ? data.reverse() : [];

    if (isLoading) return <div> <Loading/> </div>;

    return (
        <CustomerLayout>
            <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="h-8 w-1 bg-primary rounded-full"/>
                            <h4 className="text-primary text-lg font-bold tracking-wide"> Sites </h4>
                        </div>

                        <Sheet>
                            <SheetTrigger asChild>
                                <Button
                                    className={cn(
                                        buttonVariants({variant: "default"}),
                                        "space-x-1"
                                    )}
                                >
                                    <Plus className='h-4 w-4'/>
                                    <span> Add Site </span>
                                </Button>
                            </SheetTrigger>

                            <SheetContent>
                                <SheetHeader>
                                    <SheetTitle>Add Site</SheetTitle>
                                    <SheetDescription>
                                        Use the form below to add a new site to the system.
                                    </SheetDescription>
                                </SheetHeader>
                                <div className="mt-6">
                                    <AddSiteForm />
                                </div>
                            </SheetContent>
                        </Sheet>

                    </div>

                <div>
                    <DataTable columns={columns} data={sites}/>
                </div>
            </div>
        </CustomerLayout>

    );
}

export default SitePage;