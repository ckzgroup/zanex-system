"use client"

import * as React from "react";

import {DotsThreeOutline, Eye, PencilSimple, Trash} from "@phosphor-icons/react"
import {ColumnDef} from "@tanstack/react-table"
import { statuses } from "@/data/services/clients/data";

import {Badge} from "@/components/ui/badge"
import {Checkbox} from "@/components/ui/checkbox"
import {Button} from "@/components/ui/button";
import {DataTableColumnHeader} from "@/components/tables/services/data-table-column-header";

import {ScrollArea} from "@/components/ui/scroll-area";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
    Dialog, DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { SLA } from "@/data/services/sla/schema";
import Link from "next/link";
import {useDeleteCustomer} from "@/actions/get-customer";
import {toast} from "@/components/ui/use-toast";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet";
import EditClientForm from "@/components/lib/forms/edits/edit-client-form";
import EditSLAForm from "@/components/lib/forms/edits/edit-sla-form";
import {useDeleteSla} from "@/actions/get-sla";


interface User {
    id: string;
    company_id: string;
    email: string;
    name: string;
    contact: string;
    profile: string;
    url: string;
    slogan: string;
    description: string;
    // Add other user details as needed
}



export const columns: ColumnDef<SLA>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected()}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
                className="translate-y-[2px] hidden md:block"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
                className="translate-y-[2px] hidden md:block"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },

    {
        accessorKey: "sla_id",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="ID" />
        ),
        cell: ({ row }) => <div className="w-fit">{row.getValue("sla_id")}</div>,
        enableSorting: true,
        enableHiding: true,
    },

    {
        accessorKey: "sla_name",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="SLA Name"/>
        ),
        cell:
            ({row}) => <div className="w-fit hover:text-primary hover:font-semibold">
                {row.getValue("sla_name")}
            </div>,
        enableSorting:
            true,
        enableHiding:
            false,
    },
    {
        accessorKey: "customer_name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Customer" className="hidden md:block"/>
        ),
        cell: ({ row }) => <div className="w-fit">{row.getValue("customer_name")}</div>,
        enableSorting: true,
        enableHiding: true,
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        accessorKey: "service_name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Service Type" />
        ),
        cell: ({ row }) => <div className="w-fit">{row.getValue("service_name")}</div>,
        enableSorting: true,
        enableHiding: true,
    },

    {
        accessorKey: "sla_time_hrs",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="SLA Time" />
        ),
        cell: ({ row }) => <div className="w-fit">{row.getValue("sla_time_hrs")} : {row.getValue("sla_time_min")}</div>,
        enableSorting: true,
        enableHiding: true,
    },

    {
        accessorKey: "sla_description",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="SLA Description" />
        ),
        cell: ({ row }) => <div className="w-fit">{row.getValue("sla_description")}</div>,
        enableSorting: true,
        enableHiding: true,
    },

    {
        accessorKey: "sla_status",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="SLA Status" />
        ),
        cell: ({ row }) => {
            const status = statuses.find(
                (status) => status.value === row.getValue("sla_status")
            )

            if (!status) {
                return (
                    <div className="flex items-center">
                        <Badge variant='outline' className={` bg-primary text-white font-semibold`}>
                            <span> Active </span>
                        </Badge>
                    </div>
                )
            }

            return (
                <div className="flex items-center">
                    <Badge variant="outline" className={`border-none text-white 
                     ${status.label === 'In Active' ? 'bg-[#8F9CA9]' : ''}
                     ${status.label === 'Active' ? 'bg-[#55BA6A]' : ''}
                     `}>
                        <span>{status.label}</span>
                    </Badge>
                </div>
            )
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },

    {
        id: "action",
        cell: ({ row }) => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const { mutate: deleteItem } = useDeleteSla('/ticketing',row.getValue("sla_id"));

            const handleDelete = () => {
                deleteItem();

                toast({
                    title: "SLA Deleted!",
                    description: "You have successfully deleted the case sla.",
                    variant: "default"
                });
            };

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <DotsThreeOutline
                            weight="fill"
                            aria-label="Select row"
                            className="hover:cursor-pointer translate-y-[2px] text-muted-foreground"
                        />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">

                        <Sheet>
                            <SheetTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                    <PencilSimple weight="duotone" className="mr-2 h-4 w-4 text-muted-foreground/70" />
                                    Edit
                                </DropdownMenuItem>
                            </SheetTrigger>

                            <SheetContent>
                                <SheetHeader>
                                    <SheetTitle>Edit SLA</SheetTitle>
                                    <SheetDescription>
                                        Use the form below to update client information.
                                    </SheetDescription>
                                </SheetHeader>
                                <div className="">
                                    <ScrollArea className="h-screen w-full pr-3 py-4 flex flex-col space-y-6 justify-between">
                                        <EditSLAForm slaId={row.getValue("sla_id")} />
                                    </ScrollArea>
                                </div>
                            </SheetContent>
                        </Sheet>

                        <DropdownMenuSeparator />

                        <Dialog>
                            <DialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                    <Trash weight="duotone" className="mr-2 h-4 w-4 text-[#F03D52]" />
                                    Delete
                                </DropdownMenuItem>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader className='space-y-4'>
                                    <DialogTitle className='text-2xl font-bold text-red-500 text-center'>Are you absolutely sure?</DialogTitle>
                                    <DialogDescription className='text-base text-center'>
                                        Are you sure you want to permanently delete this record? This action cannot be undone.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className='flex justify-center space-x-2 items-center mt-4'>
                                    <DialogClose asChild>
                                        <Button variant='outline' type="reset">Cancel</Button>
                                    </DialogClose>
                                    <DialogClose asChild>
                                        <Button type="submit" onClick={handleDelete} >
                                            Delete
                                        </Button>
                                    </DialogClose>
                                </div>
                            </DialogContent>

                        </Dialog>

                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
        enableSorting: false,
        enableHiding: false,
    },

]