"use client"

import * as React from "react";

import {DotsThreeOutline, Eye, PencilSimple, Trash} from "@phosphor-icons/react"
import {ColumnDef} from "@tanstack/react-table"
import { statuses } from "@/data/services/users/data";

import {Badge} from "@/components/ui/badge"
import {Checkbox} from "@/components/ui/checkbox"
import {DataTableColumnHeader} from "@/components/tables/services/data-table-column-header";

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
    DialogTrigger
} from "@/components/ui/dialog";


import {User} from "@/data/services/users/schema";

export const columns: ColumnDef<User>[] = [
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
        accessorKey: "full_name",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Full Name"/>
        ),
        cell:
            ({row}) => <div className="w-fit">{row.getValue("full_name")}</div>,
        enableSorting:
            true,
        enableHiding:
            false,
    },
    {
        accessorKey: "branch",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Branch" className="hidden md:block"/>
        ),
        cell: ({ row }) => <div className="w-fit">{row.getValue("branch")}</div>,
        enableSorting: true,
        enableHiding: true,
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        accessorKey: "email",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Email Address" />
        ),
        cell: ({ row }) => <div className="w-fit">{row.getValue("email")}</div>,
        enableSorting: true,
        enableHiding: true,
    },

    {
        accessorKey: "contact",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Contact" />
        ),
        cell: ({ row }) => <div className="w-fit">{row.getValue("contact")}</div>,
        enableSorting: true,
        enableHiding: true,
    },


    {
        accessorKey: "role",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Role" />
        ),
        cell: ({ row }) => {
            const status = statuses.find(
                (status) => status.value === row.getValue("role")
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
                     ${status.label === 'Noc' ? 'bg-[#DD8E4E]/20 text-[#DD8E4E]' : ''}
                     ${status.label === 'Admin' ? 'bg-[#6B37DF]/20 text-[#6B37DF]' : ''}
                     ${status.label === 'Technician' ? 'bg-gray-500/20 text-gray-500' : ''}
                     ${status.label === 'Management' ? 'bg-teal-500/20 text-teal-500' : ''}
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