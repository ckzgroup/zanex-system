"use client";

import * as React from "react";

import {DotsThreeOutline, Eye, PencilSimple, Trash} from "@phosphor-icons/react"
import {ColumnDef} from "@tanstack/react-table"
import { statuses } from "@/data/projects/clients/data";

import {Badge} from "@/components/ui/badge"
import {Checkbox} from "@/components/ui/checkbox"
import {Button} from "@/components/ui/button";
import {DataTableColumnHeader} from "@/components/tables/projects/data-table-column-header";

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
import {Client} from "@/data/projects/clients/schema";
import {Service} from "@/data/projects/services/schema";
import {useDeleteService} from "@/actions/get-service";
import {toast} from "@/components/ui/use-toast";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet";
import EditServiceForm from "@/components/lib/forms/edits/edit-service-form";
import EditRegionForm from "@/components/lib/forms/edits/edit-region-form";
import {useDeleteRegion} from "@/actions/get-region";
import EditClosureItemForm from "@/components/lib/forms/edits/edit-closure-item-form";
import {useDeleteClosureItem} from "@/actions/get-closure-item";



export const columns: ColumnDef<Service>[] = [
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
                className="translate-y-[project_closure_parameter_id2px] hidden md:block"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },

    {
        accessorKey: "project_closure_parameter_id",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="ID"/>
        ),
        cell:
            ({row}) => <div className="w-fit">{row.getValue("")}</div>,
        enableSorting:
            true,
        enableHiding:
            false,
    },

    {
        accessorKey: "parameter_name",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Name"/>
        ),
        cell:
            ({row}) => <div className="w-fit">{row.getValue("parameter_name")}</div>,
        enableSorting:
            true,
        enableHiding:
            false,
    },
    {
        accessorKey: "parameter_category",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Category" className="hidden md:block"/>
        ),
        cell: ({ row }) => <div className="w-fit">{row.getValue("parameter_category")}</div>,
        enableSorting: true,
        enableHiding: true,
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },

    {
        accessorKey: "parameter_status",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => {
            const status = statuses.find(
                (status) => status.value === row.getValue("parameter_status")
            )

            if (!status) {
                return (
                    <div className="flex items-center">
                        <Badge variant='outline' className={` bg-primary text-white font-semibold`}>
                            <span>Active</span>
                        </Badge>
                    </div>
                )
            }

            return (
                <div className="flex items-center">
                    <Badge variant="outline" className={`border-none text-white 
                     ${status.label === 'In Active' ? 'bg-[#8F9CA9]' : ''}
                     ${status.label === 'Active' ? 'bg-primary' : ''}
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
            const { mutate: deleteItem } = useDeleteClosureItem('/segment_closure/deleteClosureParameter',row.getValue("project_closure_parameter_id"));

            const handleDelete = () => {
                deleteItem();

                toast({
                    title: "Closure Item Deleted!",
                    description: "You have successfully deleted a closure item.",
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
                                    <SheetTitle>Update Closure Item</SheetTitle>
                                    <SheetDescription>
                                        Use the form below to update closure item information.
                                    </SheetDescription>
                                </SheetHeader>
                                <div className="mt-2">
                                    <ScrollArea className="h-screen w-full pr-3 py-4 flex flex-col space-y-6 justify-between">
                                        <EditClosureItemForm closeItemId={row.getValue("project_closure_parameter_id")} />
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
                                        <Button type="submit"  onClick={handleDelete}>
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