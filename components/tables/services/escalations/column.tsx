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
import {Escalation} from "@/data/services/escalations/schema";


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



export const columns: ColumnDef<Escalation>[] = [
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
        accessorKey: "customer",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Customer" className="hidden md:block"/>
        ),
        cell: ({ row }) => <div className="w-fit">{row.getValue("customer")}</div>,
        enableSorting: true,
        enableHiding: true,
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        accessorKey: "service",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Service Type" />
        ),
        cell: ({ row }) => <div className="w-fit">{row.getValue("service")}</div>,
        enableSorting: true,
        enableHiding: true,
    },

    {
        accessorKey: "sla_time",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="SLA Time" />
        ),
        cell: ({ row }) => <div className="w-fit">{row.getValue("sla_time")}</div>,
        enableSorting: true,
        enableHiding: true,
    },

    {
        accessorKey: "contact",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Escalation Contact" />
        ),
        cell: ({ row }) => <div className="w-fit">{row.getValue("contact")}</div>,
        enableSorting: true,
        enableHiding: true,
    },

    {
        accessorKey: "escalation_time",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Escalation Time" />
        ),
        cell: ({ row }) => <div className="w-fit">{row.getValue("escalation_time")}</div>,
        enableSorting: true,
        enableHiding: true,
    },
    {
        accessorKey: "message",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Message" />
        ),
        cell: ({ row }) => <div className="w-fit">{row.getValue("message")}</div>,
        enableSorting: true,
        enableHiding: true,
    },


]