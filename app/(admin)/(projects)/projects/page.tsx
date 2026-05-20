"use client";

import React, {useRef} from 'react';
import Image from "next/image";
import Link from "next/link";
import {DataTable} from "@/components/tables/projects/projects/data-table";
import {columns} from "@/components/tables/projects/projects/column";
import {CSVLink} from "react-csv";

import {Button, buttonVariants} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {Plus} from "@phosphor-icons/react";
import {TopNav} from "@/components/elements/top-nav";
import useAuthStore from "@/hooks/use-user";
import useFetchData from "@/actions/use-api";
import Loading from "@/app/(admin)/(projects)/loading";


function ProjectsPage() {

    // Export to PDF
    const targetRef = useRef(null);
    const timestamp = new Date().toISOString().slice(0, 10);

    const { isLoading, error, data } = useFetchData('/project');
    // @ts-ignore
    const token = useAuthStore((state) => state.user.token);

    console.log(token)

    const projects = Array.isArray(data) ? data.reverse() : [];

    if (isLoading) return <div> <Loading/> </div>;

    return (
        <div>
            <div className='flex flex-col md:flex-row justify-between gap-6  mb-8'>
                <div>
                    <h2 className='font-heading text-2xl font-bold'> Projects </h2>
                    <p className='text-muted-foreground'> View and manage your team projects </p>
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
                        href="/projects/new-project"
                        className={cn(
                            buttonVariants({variant: "default"}),
                            "space-x-1"
                        )}
                    >
                        <Plus className='h-4 w-4'/>
                        <span> Add Project </span>
                    </Link>
                </div>
            </div>

            <div>
                <DataTable columns={columns} data={projects}/>
            </div>
        </div>
    );
}

export default ProjectsPage;