"use client";

import React, {useRef} from 'react';
import Image from "next/image";
import Link from "next/link";
import {DataTable} from "../../../../components/tables/projects/users/data-table";
import {columns} from "../../../../components/tables/projects/users/column";
import {CSVLink} from "react-csv";

import {Button, buttonVariants} from "../../../../components/ui/button";
import {cn} from "@/lib/utils";
import {Plus} from "@phosphor-icons/react";

import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet";
import AddUserForm from "@/components/lib/forms/add-user-form";
import useFetchData from "@/actions/use-api";
import {ScrollArea} from "@/components/ui/scroll-area";
import Loading from "@/app/(admin)/(projects)/loading";


function UsersPage() {

    // Export to PDF
    const targetRef = useRef(null);
    const timestamp = new Date().toISOString().slice(0, 10);

    const { isLoading, error, data } = useFetchData('/users');

    const users = Array.isArray(data) ? data.reverse() : [];

    if (isLoading) return <div> <Loading/> </div>;

    return (
        <div>
            <div className='flex flex-col md:flex-row justify-between gap-6  mb-8'>
                <div>
                    <h2 className='font-heading text-2xl font-bold'> Users </h2>
                    <p className='text-muted-foreground'> View and manage all your users </p>
                </div>

                <div className='flex space-x-2 items-center'>

                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                className={cn(
                                    buttonVariants({variant: "default"}),
                                    "space-x-1"
                                )}
                            >
                                <Plus className='h-4 w-4'/>
                                <span> Add User </span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent>
                            <ScrollArea className="h-full w-[320px] p-2">

                            <SheetHeader>
                                <SheetTitle>Add User</SheetTitle>
                                <SheetDescription>
                                    Use the form below to add a new user to the system.
                                </SheetDescription>
                            </SheetHeader>
                            <div className="mt-6">
                                <AddUserForm />
                            </div>
                            </ScrollArea>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>

            <div>
                <DataTable columns={columns} data={users}/>
            </div>
        </div>
    );
}

export default UsersPage;
