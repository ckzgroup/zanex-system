"use client";

import React from "react";
import useFetchData from "@/actions/use-api";
import DashboardCard from "@/components/pages/services/dashboard/dashboard-card";
import { AddressBook, GpsFix, Users, Briefcase } from "@phosphor-icons/react";
import {Card} from "@/components/ui/card";
import {DataTable} from "@/components/tables/services/region-report/data-table";
import { columns } from "@/components/tables/services/region-report/column";
import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area";
import {useTickets} from "@/actions/get-ticket";
import TechnicianTable from "@/components/pages/services/TechnicianTable";
import TechnicianReport from "@/components/pages/services/technician-report";
import SlaReport from "@/components/pages/services/sla-report";
import MonthlySlaReport from "@/components/pages/services/monthly-sla-report";
import FaultsReport from "@/components/pages/services/faults-report";
import FaultsCausesReport from "@/components/pages/services/faults-causes-report";
import RegionalCausesReport from "@/components/pages/services/regional-causes-report";
import RegionalLinkReport from "@/components/pages/services/regional-link-report";

export default function ReportsPage({
                                 searchParams,
                             }: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {

    // MAINTENANCE COUNTS
    const { isLoading:countLoading, error:countError, data:countData } = useFetchData('/maintenance/getReportCount');
    const counts = Array.isArray(countData) ? countData.reverse() : [];

    const {
        site_count,
        customer_count,
        service_count,
        users_count,
    } = counts[0] || {};

    // REGION REPORTS
    const { isLoading:regionLoading, error:regionError, data:regionData } = useFetchData('/maintenance/getRegionalReport');
    const regions = Array.isArray(regionData) ? regionData.reverse() : [];


    // Technician Report
    const { isLoading:technicianLoading, error:technicianError, data:technicianData } = useFetchData('/maintenance/activeTechnician');
    const technicians = Array.isArray(technicianData) ? technicianData.reverse() : [];

    const {
        active_user_count,
    } = technicians[0] || {}




    return (
        <div className="relative space-y-6">
            <div className='flex flex-col md:flex-row justify-between space-y-6 mb-8'>
                <div>
                    <h2 className='font-heading text-2xl font-bold'> Reports </h2>
                    <p className='text-muted-foreground'> View, manage and export all your reports. </p>
                </div>

                <div></div>

            </div>

            <div className="relative">
                {/*  CARDS  */}
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
                    <DashboardCard
                        icon={Users}
                        title="Active Technicians"
                        total={active_user_count}
                        iconColor="#1C9282"
                        bgColor="#E8F3F3"
                        link="#"
                    />

                </div>
            </div>

            <div className="gap-6 space-y-8">
                <div className="relative space-y-4">
                    <div>
                        <h2 className="text-lg font-bold">SLA Performance Report</h2>
                    </div>
                    <ScrollArea className="w-full relative rounded-md">
                        <DataTable columns={columns} data={regions}/>
                        <ScrollBar orientation="vertical"/>
                    </ScrollArea>
                </div>

                <div>
                    <div>
                        <h2 className="text-lg font-bold">Technician</h2>
                    </div>
                    <TechnicianTable/>
                </div>

                <div className="space-y-4">
                    <div >
                        <h2 className="text-lg font-bold">Generate Technician Report</h2>
                    </div>
                    <TechnicianReport/>
                </div>

                <hr/>

                <div className="space-y-4">
                    <div >
                        <h2 className="text-lg font-bold"> Annual SLA Report </h2>
                    </div>
                    <SlaReport/>
                </div>
                <hr/>

                <div className="space-y-4">
                    <div >
                        <h2 className="text-lg font-bold">Monthly SLA Report </h2>
                    </div>
                    <MonthlySlaReport/>
                </div>

                <hr/>

                <div className="space-y-4">
                    <div >
                        <h2 className="text-lg font-bold"> Faults Report </h2>
                    </div>
                    <FaultsReport/>
                </div>

                <hr/>

                <div className="space-y-4">
                    <div >
                        <h2 className="text-lg font-bold"> Fault Causes Analysis Report </h2>
                    </div>
                    <FaultsCausesReport/>
                </div>

                <hr/>

                <div className="space-y-4">
                    <div >
                        <h2 className="text-lg font-bold"> Regional Fault Causes Analysis Report </h2>
                    </div>
                    <RegionalCausesReport/>
                </div>

                <hr/>

                <div className="space-y-4">
                    <div >
                        <h2 className="text-lg font-bold"> Regional Link Report </h2>
                    </div>
                    <RegionalLinkReport/>
                </div>
            </div>
        </div>
    );
}
