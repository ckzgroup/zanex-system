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
import {buttonVariants} from "@/components/ui/button";
import {Plus} from "lucide-react";
import CustomerLayout from "@/components/pages/services/customers/customer-layout";
import {DataTable} from "@/components/tables/services/escalations/data-table";
import {columns} from "@/components/tables/services/escalations/column";

const data = [
    {
        "customer": "",
        "service": "",
        "sla_time": "",
        "contact": "",
        "escalation_time": "",
        "message": ""
    },
]

function EscalationsPage() {
    return (
        <CustomerLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="h-8 w-1 bg-primary rounded-full"/>
                        <h4 className="text-primary text-lg font-bold tracking-wide"> Escalations </h4>
                    </div>

                    {/*<Link*/}
                    {/*    href="/vehicles/new-vehicle"*/}
                    {/*    className={cn(*/}
                    {/*        buttonVariants({variant: "default"}),*/}
                    {/*        "space-x-1"*/}
                    {/*    )}*/}
                    {/*>*/}
                    {/*    <Plus className='h-4 w-4'/>*/}
                    {/*    <span> Add Escalation </span>*/}
                    {/*</Link>*/}
                </div>

                <div>
                    <DataTable columns={columns} data={data}/>
                </div>
            </div>
        </CustomerLayout>

    );
}

export default EscalationsPage;