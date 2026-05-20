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
import Link from "next/link";
import {Site} from "@/data/services/site/schema";
import {useDeleteUser} from "@/actions/get-user";
import {toast} from "@/components/ui/use-toast";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet";
import EditUserForm from "@/components/lib/forms/edits/edit-user-form";
import EditSiteForm from "@/components/lib/forms/edits/edit-site-form";




export const columns: ColumnDef<Site>[] = [
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
        accessorKey: "site_id",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="ID" />
        ),
        cell: ({ row }) => <div className="w-fit">{row.getValue("site_id")}</div>,
        enableSorting: true,
        enableHiding: true,
    },

    {
        accessorKey: "site_name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Site Name" className="hidden md:block"/>
        ),
        cell: ({ row }) => <div className="w-fit">{row.getValue("site_name")}</div>,
        enableSorting: true,
        enableHiding: true,
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        accessorKey: "region_name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Region" className="hidden md:block"/>
        ),
        cell: ({ row }) => <div className="w-fit">{row.getValue("region_name")}</div>,
        enableSorting: true,
        enableHiding: true,
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
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
        accessorKey: "site_latitude",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Latitude" />
        ),
        cell: ({ row }) => <div className="w-fit">{row.getValue("site_latitude")}</div>,
        enableSorting: true,
        enableHiding: true,
    },
    {
        accessorKey: "site_longtitude",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Longitude" />
        ),
        cell: ({ row }) => <div className="w-fit">{row.getValue("site_longtitude")}</div>,
        enableSorting: true,
        enableHiding: true,
    },

    {
        id: "action",
        cell: ({ row }) => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const { mutate: deleteItem } = useDeleteUser('/users',row.getValue("user_id"));

            // eslint-disable-next-line react-hooks/rules-of-hooks
            const [open, setOpen] = React.useState(false); // Controls dialog state

            const handleDelete = () => {
                deleteItem();

                toast({
                    title: "Site Deleted!",
                    description: "You have successfully deleted a site.",
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

                        <Sheet open={open} onOpenChange={setOpen}>
                            <SheetTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                    <PencilSimple weight="duotone" className="mr-2 h-4 w-4 text-muted-foreground/70" />
                                    Edit
                                </DropdownMenuItem>
                            </SheetTrigger>

                            <SheetContent>
                                <SheetHeader>
                                    <SheetTitle>Update Site</SheetTitle>
                                    <SheetDescription>
                                        Use the form below to update site details.
                                    </SheetDescription>
                                </SheetHeader>
                                <div className="mt-0">
                                    <ScrollArea className="h-screen w-full pr-3 flex flex-col space-y-4 justify-between">
                                        <EditSiteForm siteId={row.getValue("site_id")} onClose={() => setOpen(false)} />
                                    </ScrollArea>
                                </div>
                            </SheetContent>
                        </Sheet>

                        {/*<DropdownMenuSeparator />*/}

                        {/*<Dialog>*/}
                        {/*    <DialogTrigger asChild>*/}
                        {/*        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>*/}
                        {/*            <Trash weight="duotone" className="mr-2 h-4 w-4 text-[#F03D52]" />*/}
                        {/*            Delete*/}
                        {/*        </DropdownMenuItem>*/}
                        {/*    </DialogTrigger>*/}
                        {/*    <DialogContent>*/}
                        {/*        <DialogHeader className='space-y-4'>*/}
                        {/*            <DialogTitle className='text-2xl font-bold text-red-500 text-center'>Are you absolutely sure?</DialogTitle>*/}
                        {/*            <DialogDescription className='text-base text-center'>*/}
                        {/*                Are you sure you want to permanently delete this record? This action cannot be undone.*/}
                        {/*            </DialogDescription>*/}
                        {/*        </DialogHeader>*/}
                        {/*        <div className='flex justify-center space-x-2 items-center mt-4'>*/}
                        {/*            <DialogClose asChild>*/}
                        {/*                <Button variant='outline' type="reset">Cancel</Button>*/}
                        {/*            </DialogClose>*/}
                        {/*            <DialogClose asChild>*/}
                        {/*                <Button type="submit"  onClick={handleDelete}>*/}
                        {/*                    Delete*/}
                        {/*                </Button>*/}
                        {/*            </DialogClose>*/}
                        {/*        </div>*/}
                        {/*    </DialogContent>*/}

                        {/*</Dialog>*/}

                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
        enableSorting: false,
        enableHiding: false,
    },

]