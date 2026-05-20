"use client";

import React, {useRef} from 'react';
import Image from "next/image";
import Link from "next/link";
import {DataTable} from "@/components/tables/services/cases/data-table";
import {columns} from "@/components/tables/services/cases/column";
import {CSVLink} from "react-csv";

import {Button, buttonVariants} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {Plus} from "@phosphor-icons/react";
import {TopNav} from "@/components/elements/top-nav";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import useFetchData from "@/actions/use-api";
import Loading from "@/app/(admin)/(projects)/loading";
import {useTickets} from "@/actions/get-ticket";


const topNavItems = [
    {
        title: "All Cases",
        href: "/service/cases",
    },
    {
        title: "New Cases",
        href: "/service/cases/new",
    },
    {
        title: "Under Monitoring",
        href: "/service/cases/monitoring",
    },
    {
        title: "On-Hold Cases",
        href: "/service/cases/onhold",
    },
    {
        title: "In Progress",
        href: "/service/cases/in-progress",
    },
    {
        title: "Closed Cases",
        href: "/service/cases/closed",
    },
]



function CasesPage() {

    // Export to PDF
    const targetRef = useRef(null);
    const timestamp = new Date().toISOString().slice(0, 10);

    const { isLoading, error, data } = useTickets('/maintenance/getTicketListByStatus', 'in-progress');

    const cases = Array.isArray(data) ? data : [];


    if (isLoading) return <div> <Loading/> </div>;

    return (
        <div className="w-full">
            <div className='flex flex-col md:flex-row justify-between space-y-6 mb-8'>
                <div>
                    <h2 className='font-heading text-2xl font-bold'> Cases </h2>
                    <p className='text-muted-foreground'> View and manage your team cases </p>
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

                    <Link
                        href="/service/cases/new-case"
                        className={cn(
                            buttonVariants({variant: "default"}),
                            "space-x-1"
                        )}
                    >
                        <Plus className='h-4 w-4'/>
                        <span> Add Case </span>
                    </Link>
                </div>

            </div>

            <div className="my-4">
                <TopNav items={topNavItems}/>
            </div>

            <ScrollArea className="w-full relative rounded-md">
                <DataTable columns={columns} data={cases}/>
                <ScrollBar orientation="vertical" />
            </ScrollArea>

        </div>
    );
}

export default CasesPage;