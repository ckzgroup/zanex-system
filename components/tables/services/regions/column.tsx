"use client"

import * as React from "react";

import {DotsThreeOutline, Eye, PencilSimple, Trash} from "@phosphor-icons/react"
import {ColumnDef} from "@tanstack/react-table"

import {Badge} from "@/components/ui/badge"
import {Checkbox} from "@/components/ui/checkbox"
import {Button} from "@/components/ui/button";

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
import {Service} from "@/data/services/services/schema";
import {DataTableColumnHeader} from "@/components/tables/services/data-table-column-header";
import {statuses} from "@/data/services/regions/data";


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
                className="translate-y-[2px] hidden md:block"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },

    {
        accessorKey: "name",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Name"/>
        ),
        cell:
            ({row}) => <div className="w-fit">{row.getValue("name")}</div>,
        enableSorting:
            true,
        enableHiding:
            false,
    },
    {
        accessorKey: "description",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Description" className="hidden md:block"/>
        ),
        cell: ({ row }) => <div className="w-fit">{row.getValue("description")}</div>,
        enableSorting: true,
        enableHiding: true,
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },

    {
        accessorKey: "status",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => {
            const status = statuses.find(
                (status) => status.value === row.getValue("status")
            )

            if (!status) {
                return (
                    <div className="flex items-center">
                        <Badge variant='outline' className={` bg-[#8F9CA9] text-white font-semibold`}>
                            <span>pending</span>
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
        cell: ({row}) => (

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <DotsThreeOutline
                        weight="fill"
                        aria-label="Select row"
                        className="hover:cursor-pointer translate-y-[2px] text-muted-foreground"
                    />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <Eye weight="duotone" className="mr-2 h-4 w-4 text-[#420BCB]"/>
                        View
                    </DropdownMenuItem>

                    <DropdownMenuSeparator/>

                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <PencilSimple weight="duotone" className="mr-2 h-4 w-4 text-muted-foreground/70" />
                        Edit
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <Trash weight="duotone" className="mr-2 h-4 w-4 text-[#F03D52]" />
                        Delete
                    </DropdownMenuItem>

                </DropdownMenuContent>
            </DropdownMenu>
        ),
        enableSorting: false,
        enableHiding: false,
    },

]