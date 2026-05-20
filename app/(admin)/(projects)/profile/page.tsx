"use client";

import React, {useEffect, useState} from 'react';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList, BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import {Button} from "@/components/ui/button";
import {PencilSimple, Link as LinkIcon } from "@phosphor-icons/react";
import Image from "next/image";
import {Badge} from "@/components/ui/badge";
import {useSingleProject} from "@/actions/get-project";
import Loading from "@/app/(admin)/(projects)/loading";
import useAuthStore from "@/hooks/use-user";
import {useProfile} from "@/actions/get-profile";
import {useStock} from "@/actions/get-stock";
import {cn} from "@/lib/utils";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {DataTable} from "@/components/tables/projects/stocks/data-table";
import {columns} from "@/components/tables/projects/stocks/column";

function ProfilePage() {

    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, []);

    const user_id= useAuthStore((state) => state.user?.result?.user_id);

    // @ts-ignore
    const { isLoading, error, data } = useProfile('/project_user_profile', user_id)

    // @ts-ignore
    const { data: stockData, isLoading: stockLoading } = useStock('/users/stocks', user_id)

  console.log("Stock", stockData)

    const user = Array.isArray(data) ? data.reverse() : [];
    const stocks = Array.isArray(stockData) ? stockData : [];

    const authStore = useAuthStore();
    const user_details = authStore.user;

    const {
        user_name,
        user_email_address,
        company_name,
        roles,
        project_count,
        service_count,
        customer_count,
        closed_segment_count
    } = user[0] || {};

    // Get Avatar Initials
    const getInitials = (name:string | undefined) => {
        // Split the name into words
        const words = name?.split(' ');

        // Get the first letter of each word
        const initials = words?.map(word => word[0]);

        // Join the initials into a string
        return initials?.join('');
    };

    const userInitials = getInitials(user_name);


    if (!user) return <Loading/>;

    return (
        <div>
            <div className="flex items-center justify-between">
                <Breadcrumb className="bg-primary/15 w-fit px-4 py-2 rounded-lg ">
                    <BreadcrumbList className="text-primary font-semibold">
                        <BreadcrumbItem>
                            <BreadcrumbPage className="text-primary font-semibold"> Profile </BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <Button variant="outline" className="space-x-2">
                    <PencilSimple weight="duotone" size={18} />
                    <span>Edit Profile</span>
                </Button>
            </div>

            <div className="flex items-center justify-between mt-12">
                <div className="flex space-x-12">
                    <div className='relative '>
                        <Avatar className={cn("h-48 w-48")} role={"menuitem"}>
                            <AvatarImage
                                alt='avatar'
                                src="/images/avatar.png"
                                className='object-cover rounded-lg'
                            />
                            <AvatarFallback className='rounded-lg text-4xl'>{isClient ? userInitials : ''}</AvatarFallback>
                        </Avatar>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <h3 className="text-2xl font-bold">{user_name}</h3>
                            <p className="text-primary text-base font-semibold">{roles}</p>
                        </div>
                        <div className="space-y-4">
                            {/*<h3 className="text-base text-muted-foreground"> A108 Adam Street, Kenya </h3>*/}
                            <Badge className="text-orange-500 text-base bg-orange-500/20 hover:bg-orange-500/20">
                                {company_name}
                            </Badge>
                        </div>
                    </div>
                </div>

                {/*<div className="flex items-center space-x-2 pr-[20%]">*/}
                {/*    <LinkIcon weight="duotone" size={18} />*/}
                {/*    <p className="text-base font-semibold">www.quavatel.com</p>*/}
                {/*</div>*/}

            </div>

            <hr className="my-14"/>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <h3 className="text-muted-foreground font-bold text-base"> STATISTICS </h3>

                    <div
                        className="bg-primary shadow-inner shadow-white text-white rounded-lg grid grid-cols-2 w-[80%]">
                        <div className="p-8 flex items-center justify-center border border-white">
                            <div className="text-center space-y-2 ">
                                <h2 className="text-2xl font-bold">{project_count}</h2>
                                <p className="opacity-80 tracking-wider">PROJECTS</p>
                            </div>
                        </div>
                        <div className="p-8 flex items-center justify-center border border-white">
                            <div className="text-center space-y-2 ">
                                <h2 className="text-2xl font-bold">{closed_segment_count}</h2>
                                <p className="opacity-80 tracking-wider">TASKS DONE</p>
                            </div>
                        </div>

                        <div className="p-8 flex items-center justify-center border border-white/20">
                            <div className="text-center space-y-2 ">
                                <h2 className="text-2xl font-bold">{customer_count}</h2>
                                <p className="opacity-80 tracking-wider">CUSTOMERS</p>
                            </div>
                        </div>

                        <div className="p-8 flex items-center justify-center border border-white">
                            <div className="text-center space-y-2 ">
                                <h2 className="text-2xl font-bold">{service_count}</h2>
                                <p className="opacity-80 tracking-wider">SERVICES</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-muted-foreground font-bold text-base">CONTACT DETAILS</h3>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <h4 className="text-lg font-semibold text-primary">{user_email_address}</h4>
                            <p className="text-muted-foreground">EMAIL ADDRESS</p>
                        </div>
                        <div>
                            {/*<h4 className="text-lg font-semibold">+254 712 345 678</h4>*/}
                            {/*<p className="text-muted-foreground">PHONE NUMBER</p>*/}
                        </div>
                    </div>
                </div>

            </div>

            <hr className="my-14"/>

            <div className="space-y-4">
                <h3 className="text-muted-foreground font-bold text-base">STOCK LIST</h3>
                {stockLoading ? (
                    <p className="text-muted-foreground">Loading stocks...</p>
                ) : stocks.length > 0 ? (
                    <DataTable columns={columns} data={stocks} />
                ) : (
                    <p className="text-muted-foreground">No stocks found</p>
                )}
            </div>
        </div>
    );
}

export default ProfilePage;
