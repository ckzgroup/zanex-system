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
import useFetchData from "@/actions/use-api";



function SitesPage() {

    const { isLoading, error, data } = useFetchData('/radar/site');

    const sites = Array.isArray(data) ? data.reverse() : [];

    if (isLoading) return <div> <Loading/> </div>;

    return (
            <div className="space-y-6">
                <div>
                    <h2 className='font-heading text-2xl font-bold'> Sites </h2>
                    <p className='text-muted-foreground'> View and manage all your sites </p>
                </div>

                <div>
                    <DataTable columns={columns} data={sites}/>
                </div>
            </div>

    );
}

export default SitesPage;