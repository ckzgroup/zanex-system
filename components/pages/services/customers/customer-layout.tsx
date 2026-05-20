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
import {usePathname} from "next/navigation";
import {useSingleCustomer} from "@/actions/get-customer";
import {formatDate} from "@/utils/format-date";
import {Badge} from "@/components/ui/badge";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import Loading from "@/app/(admin)/service/loading";




interface Props {
    children: React.ReactNode;
}

export default function CustomerLayout({ children }: Props) {

    const pathname = usePathname()
    const customer_id = parseInt(pathname.replace('/service/customers/',''));

    const topNavItems = [
        {
            title: "SLA",
            href: `/service/customers/${customer_id}`,
        },
        {
            title: "Escalations",
            href: `/service/customers/${customer_id}/escalations`,
        },
        {
            title: "Site",
            href: `/service/customers/${customer_id}/site`,
        },
    ]

    const { isLoading, error, data } = useSingleCustomer('/customers/customer', customer_id)
    const customer = Array.isArray(data) ? data.reverse() : [];

    if (isLoading) return <Loading/>;

    return (
        <> { customer.map((item: any, index: number) => (
        <div key={index}>
            <Breadcrumb className="bg-primary/15 w-fit px-4 py-2 rounded-lg ">
                <BreadcrumbList className="text-primary font-semibold">
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/components" className="text-primary">Customers</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage className="text-primary font-semibold">{item.customer_name}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-12">
                <div className="flex space-x-12 ">
                    <Avatar className='relative h-36 w-36 rounded-full'>
                        <AvatarImage src={item.customer_profile} alt="logo" />
                        {/* @ts-ignore */}
                        <AvatarFallback className="text-6xl font-bold text-primary bg-primary/10">{Array.from(item.customer_name)[0]}</AvatarFallback>
                    </Avatar>

                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold">{item.customer_name}</h2>

                        <div className="space-y-2">
                            <div className="flex items-center space-x-6 text-base">
                                <h4 className="">Email:</h4>
                                <p className="font-semibold">{item.customer_email}</p>
                            </div>

                            <div className="flex items-center space-x-6 text-base ">
                                <h4 className="">Phone:</h4>
                                <p className="font-semibold whitespace-nowrap">{item.customer_contact}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className=" pt-12">
                    <div className="space-y-2">
                        <div className="flex items-center space-x-6 text-base">
                            <h4 className="">Status:</h4>
                            <Badge className="font-semibold">{item.customer_status}</Badge>
                        </div>

                        <div className="flex items-center space-x-6 text-base">
                            <h4 className="">Created:</h4>
                            <p className="font-semibold whitespace-nowrap">{formatDate(item.customer_date_created)}</p>
                        </div>

                    </div>
                </div>
            </div>

            <div className="my-6">
                <TopNav items={topNavItems} />
            </div>

            <div className="my-8">
                {children}
            </div>

        </div>
        ))
        }</>
    );
}

