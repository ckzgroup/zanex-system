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
import ClientProjectCard from "@/components/pages/projects/customers/client-project-card";
import {usePathname, useRouter} from "next/navigation";
import {useSingleProject} from "@/actions/get-project";
import {useSingleCustomer} from "@/actions/get-customer";
import Loading from "@/app/(admin)/(projects)/loading";
import {formatDate} from "@/utils/format-date";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import Link from "next/link";


// @ts-ignore
const ProjectColumn = ({ children }: React.ReactNode) => {
    const pathname = usePathname()

    const project_id = parseInt(pathname.replace('/projects/',''));

    const router = useRouter();

    const handleNavigation = () => {
        router.push(`/projects/${project_id}`);
    };

    return (
        <div className="cursor-pointer" onClick={handleNavigation}>
            {children}
        </div>
    );
};


function SingleClientPage() {

    const pathname = usePathname()
    const customer_id = parseInt(pathname.replace('/customers/',''));

    const { isLoading, error, data } = useSingleCustomer('/customer_project_view/info', customer_id)
    const customer = Array.isArray(data) ? data.reverse() : [];

    const { isLoading:projectLoading, error:projectError, data:projectData } = useSingleCustomer('/customer_project_view/projects', customer_id)
    const projects = Array.isArray(projectData) ? projectData.reverse() : [];

    const {
        customer_name,
        customer_email,
        customer_contact,
        customer_profile,
        customer_date_created,
        customer_date_updated,
        project_count,
    } = customer[0] || {};

    if (!customer) return <Loading/>;


    return (
        <div>
            <Breadcrumb className="bg-primary/15 w-fit px-4 py-2 rounded-lg ">
                <BreadcrumbList className="text-primary font-semibold">
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/components" className="text-primary">Clients</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage className="text-primary font-semibold">{customer_name}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-12">
                <div className="flex space-x-12 ">
                    <Avatar className='relative h-36 w-36 rounded-full'>
                        <AvatarImage src={customer_profile} alt="logo" />
                        {/* @ts-ignore */}
                        <AvatarFallback className="text-6xl font-bold text-primary bg-primary/10">
                            {customer_name ? customer_name.substring(0, 1) : ""}
                        </AvatarFallback>
                    </Avatar>
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold">{customer_name}</h2>

                            <div className="space-y-2">
                                <div className="flex items-center space-x-6 text-base">
                                    <h4 className="">Email:</h4>
                                    <p className="font-semibold">{customer_email}</p>
                                </div>

                                <div className="flex items-center space-x-6 text-base ">
                                    <h4 className="">Phone:</h4>
                                    <p className="font-semibold whitespace-nowrap">{customer_contact}</p>
                                </div>

                                <div className="flex items-center space-x-6 text-base">
                                    <h4 className="">Projects:</h4>
                                    <p className="font-semibold">{project_count}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                <div className=" pt-12">
                    <div className="space-y-2">
                        <div className="flex items-center space-x-6 text-base">
                            <h4 className="">Created:</h4>
                            <p className="font-semibold whitespace-nowrap">{formatDate(customer_date_created)}</p>
                        </div>

                    </div>
                    </div>
            </div>

            <div className="space-y-6">
                <div className="flex items-center space-x-4">
                    <div className="h-8 w-1 bg-primary rounded-full"/>
                    <h4 className="text-primary text-lg font-bold tracking-wide">All Projects </h4>
                </div>
            </div>

            <div>
                <div>
                    {projects.length > 0 ? (
                        <div  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 my-12">
                            {projects.map((project: any, index: number) => (
                                <div key={index}>
                                    <ClientProjectCard
                                        name={project.project_name}
                                        tasks={`${project.open_task} open tasks, ${project.completed_task} tasks completed`}
                                        description={project.project_description}
                                        deadline={formatDate(project.project_end_date)}
                                        leader={project.project_manager}
                                        value={project.percentage_progress}
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-base text-muted-foreground p-5">
                            No Projects Available
                        </div>
                    )}
                </div>


            </div>

        </div>
    );
}

export default SingleClientPage;