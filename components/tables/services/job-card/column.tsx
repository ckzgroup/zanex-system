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
import {JobCard} from "@/data/services/job-card/schema";
import {useDeleteCustomer} from "@/actions/get-customer";
import {toast} from "@/components/ui/use-toast";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet";
import EditJobCardForm from "@/components/lib/forms/edits/edit-job-card-form";
import {useDeleteJobCard} from "@/actions/get-jobcard";


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



export const columns: ColumnDef<JobCard>[] = [
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
        accessorKey: "service_category_id",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="ID"/>
        ),
        cell:
            ({row}) => <div className="w-fit">{row.getValue("service_category_id")}</div>,
        enableSorting:
            true,
        enableHiding:
            false,
    },

    {
        accessorKey: "service_category_name",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Name"/>
        ),
        cell:
            ({row}) => <div className="w-fit">{row.getValue("service_category_name")}</div>,
        enableSorting:
            true,
        enableHiding:
            false,
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        accessorKey: "service_name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Service" className="hidden md:block"/>
        ),
        cell: ({ row }) => <div className="w-fit">{row.getValue("service_name")}</div>,
        enableSorting: true,
        enableHiding: true,
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },

    {
        accessorKey: "data_type_entry",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Data Type" className="hidden md:block"/>
        ),
        cell: ({ row }) => <div className="w-fit">{row.getValue("data_type_entry")}</div>,
        enableSorting: true,
        enableHiding: true,
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },

    {
        accessorKey: "photo_required",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Take Photo" />
        ),
        cell: ({ row }) => {
            const status = statuses.find(
                (status) => status.value === row.getValue("photo_required")
            )

            if (!status) {
                return (
                    <div className="flex items-center">
                        <Badge variant='outline' className={`bg-primary text-white font-semibold`}>
                            <span>Required</span>
                        </Badge>
                    </div>
                )
            }
            return (
                <div className="flex items-center">
                    <Badge variant="outline" className={`border-none text-white 
                     ${status.label === 'Required' ? 'bg-primary' : ''}
                     ${status.label === 'Optional' ? 'bg-gray-600' : ''}
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
        accessorKey: "service_category_status",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => {
            const status = statuses.find(
                (status) => status.value === row.getValue("service_category_status")
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
            const { mutate: deleteItem } = useDeleteJobCard('/services/serviceCategory',row.getValue("customer_id"));

            const handleDelete = () => {
                deleteItem();

                toast({
                    title: "Job Card Deleted!",
                    description: "You have successfully deleted a job card.",
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
                                    <SheetTitle>Update Job Card</SheetTitle>
                                    <SheetDescription>
                                        Use the form below to update job card details.
                                    </SheetDescription>
                                </SheetHeader>
                                <div className="mt-2">
                                    <ScrollArea className="h-screen w-full pr-3 py-4 flex flex-col space-y-6 justify-between">
                                        <EditJobCardForm jobCardId={row.getValue("service_category_id")} />
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