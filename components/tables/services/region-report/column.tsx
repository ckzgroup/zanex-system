"use client"

import * as React from "react";

import {DotsThreeOutline, Eye, PencilSimple, Trash} from "@phosphor-icons/react"
import {ColumnDef} from "@tanstack/react-table"
import {Checkbox} from "@/components/ui/checkbox"
import {DataTableColumnHeader} from "@/components/tables/services/data-table-column-header";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

import { regionsReportSchema } from "@/data/services/region-report/schema";


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



export const columns: ColumnDef<regionsReportSchema>[] = [
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
        accessorKey: "service_name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Service" />
        ),
        cell: ({ row }) => <div className="w-fit">{row.getValue("service_name")}</div>,
        enableSorting: true,
        enableHiding: true,
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },

    {
        accessorKey: "breached_tickets",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Breached" />
        ),
        cell: ({ row }) => <div className="w-fit">{row.getValue("breached_tickets")}</div>,
        enableSorting: true,
        enableHiding: true,
    },

    {
        accessorKey: "complied_sla",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Complied SLA" />
        ),
        cell: ({ row }) => {
            const totalTickets : number= row.getValue("total_tickets");
            const breachedTickets: number = row.getValue("breached_tickets");
            // @ts-ignore
            const compliedSla = totalTickets - breachedTickets;
            return <div className="w-fit">{compliedSla}</div>;
        },
        enableSorting: true,
        enableHiding: true,
    },

    {
        accessorKey: "total_tickets",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Total" />
        ),
        cell: ({ row }) => <div className="w-fit">{row.getValue("total_tickets")}</div>,
        enableSorting: true,
        enableHiding: true,
    },
    {
        accessorKey: "adherence",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Adherence (%)" />
        ),
        cell: ({ row }) => {
            const totalTickets: number = row.getValue("total_tickets");
            const breachedTickets: number = row.getValue("breached_tickets");
            const compliedSla = totalTickets - breachedTickets;
            const adherence = totalTickets > 0 ? (compliedSla / totalTickets) * 100 : 0;
            return <div className="w-fit">{adherence.toFixed(2)}%</div>;
        },
        enableSorting: true,
        enableHiding: true,
    },

    {
        accessorKey: "mttr",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="MTTR" />
        ),
        cell: ({ row }) => {
            const mttrMinutes: number = row.getValue("mttr");
            const hours = Math.floor(mttrMinutes / 60);
            const minutes = mttrMinutes % 60;
            return (
                <div className="w-fit">
                    {hours}h {minutes}m
                </div>
            );
        },
        enableSorting: true,
        enableHiding: true,
    }
]