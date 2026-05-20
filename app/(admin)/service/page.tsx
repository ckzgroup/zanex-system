"use client";

import {Button} from "@/components/ui/button";
import Link from "next/link";
import {
    Briefcase, CheckCircle,
    HourglassHigh,
    Plus,
    Radioactive,
    SpinnerBall,
    SquaresFour,
    Sticker,
    UserFocus,
    Users
} from "@phosphor-icons/react";
import DashboardCard from "@/components/pages/services/dashboard/dashboard-card";
import ActivityCard from "@/components/pages/services/dashboard/activity-card";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Card} from "@/components/ui/card";
import MttrAnalysis from "@/components/pages/services/dashboard/mttr-analysis";
import SlaBreachDashTable from "@/components/pages/services/dashboard/sla-breach-dash-table";
import TrafficChart from "@/components/pages/services/dashboard/traffic-chart";
import useFetchData from "@/actions/use-api";
import useAuthStore from "@/hooks/use-user";
import Loading from "@/app/(admin)/(projects)/loading";
import React, {useEffect, useState} from "react";
import BreachedAnalysis from "@/components/pages/services/dashboard/breached-analysis";

export default function Dashboard() {

    // MAITENANCE COUNTS
    const { isLoading, error, data:maintenanceData } = useFetchData('/maintenance/count');
    const maintenance = Array.isArray(maintenanceData) ? maintenanceData.reverse() : [];

    const {
        active_Case,
        monitoring_Case,
        new_Case,
        onHold_Case,
        closed_Case
    } = maintenance[0] || {};

    const [isClient, setIsClient] = useState(false)
    const { user, isAuthenticated, logout } = useAuthStore();


    useEffect(() => {
        setIsClient(true)
    }, []);

    // RECENT UPDATES
    const { isLoading:updateLoading, error:updateError, data:updateData } = useFetchData('/maintenance/getRecentUpdate');
    const updates = Array.isArray(updateData) ? updateData.reverse() : [];

    const today = new Date();
    const options = {
        weekday: 'long',
        year: 'numeric',
        day: 'numeric',
        month: 'short',
    };
    // @ts-ignore
    const formattedDate = today.toLocaleDateString('en-US', options);

    if (isLoading) return <div> <Loading/> </div>;

    return (
        <main>
            <div className='space-y-6'>
                {/* HEADER */}
                <div className='flex items-center justify-between'>
                    <div className="space-y-1">
                        <h1 className='text-2xl font-bold'>Hello, {isClient ? user?.result.user_firstname : ''}</h1>
                        <p className='text-muted-foreground font-medium'> Today is {formattedDate}</p>
                    </div>
                    <Link href="/service/cases/new-case">
                        <Button className='space-x-2'>
                            <Plus size={16} weight="bold"/>
                            <span> Create New Case </span>
                        </Button>
                    </Link>
                </div>

                {/*  CARDS  */}
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6'>
                    <DashboardCard
                        icon={Sticker}
                        title="New Cases"
                        total={new_Case}
                        iconColor="#6B37DF"
                        bgColor="#F0EBFC"
                        link="/service/cases/new"
                    />

                    <DashboardCard
                        icon={Radioactive}
                        title="Active Cases"
                        total={active_Case}
                        iconColor="#DD8E4E"
                        bgColor="#FCF4ED"
                        link="/service/cases/in-progress"
                    />

                    <DashboardCard
                        icon={SpinnerBall}
                        title="Under Monitoring"
                        total={monitoring_Case}
                        iconColor="#1C9282"
                        bgColor="#E8F3F3"
                        link="/service/cases/monitoring"
                    />

                    <DashboardCard
                        icon={HourglassHigh}
                        title="On-Hold Cases"
                        total={onHold_Case}
                        iconColor="#F03D52"
                        bgColor="#FEECEE"
                        link="/service/cases/onhold"
                    />

                    <DashboardCard
                        icon={CheckCircle}
                        title="Closed Cases"
                        total={closed_Case}
                        iconColor="#3CAEF0"
                        bgColor="#EEF8FF"
                        link="/service/cases/closed"
                    />
                </div>

                {/*  UPDATE  */}
                <div className='grid grid-cols-1 gap-6'>
                    <Card className="py-6 space-y-6">
                        <h3 className="text-base font-bold pl-6"> MTTR Analysis (Minutes)</h3>

                        <MttrAnalysis/>
                    </Card>
                </div>


                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">

                    <div className="py-4 space-y-4">
                        <Card className="col-span-1 py-6 space-y-2 relative">
                            <h3 className="text-base font-bold pl-6"> Ticket Traffic </h3>
                            <hr className="w-full"/>
                            <div className="px-6 pt-3">
                                <TrafficChart/>
                            </div>
                        </Card>
                    </div>

                    <Card className="py-6 space-y-2 relative">
                        <h3 className="text-base font-bold pl-6"> Recent Activity </h3>
                        <div className="px-2">
                            <ScrollArea className="h-[300px] w-full">
                                <div className="space-y-2">
                                    {updates.map((update, index) => (
                                        <div key={index}>
                                            <ActivityCard
                                                timeline={update.ticket_update_time}
                                                title={update.service_category_name}
                                                description={`Activity Location: ${update.activity_location}`}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        </div>
                    </Card>

                </div>

                <div className="grid grid-cols-1 gap-6">
                    <div className="py-4 space-y-4">
                        <Card className="col-span-1 py-6 space-y-2 relative">
                            <h3 className="text-base font-bold pl-6"> SLA Breach </h3>
                            <hr className="w-full"/>
                            <div className="px-6">
                                <BreachedAnalysis/>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </main>
    );
}
