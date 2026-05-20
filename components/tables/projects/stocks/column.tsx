"use client"

import * as React from "react"
import {ColumnDef} from "@tanstack/react-table"
import {DataTableColumnHeader} from "@/components/tables/projects/data-table-column-header";

export const columns: ColumnDef<any>[] = [
    {
        accessorKey: "name",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Name"/>
        ),
        cell: ({row}) => <div className="w-fit">{row.getValue("name")}</div>,
        enableSorting: true,
        enableHiding: false,
    },
    {
        accessorKey: "item_name",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Item Name"/>
        ),
        cell: ({row}) => <div className="w-fit">{row.getValue("item_name")}</div>,
        enableSorting: true,
        enableHiding: true,
    },
    {
        accessorKey: "item_group",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Item Group"/>
        ),
        cell: ({row}) => <div className="w-fit">{row.getValue("item_group")}</div>,
        enableSorting: true,
        enableHiding: true,
    },
    {
        accessorKey: "owner",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Owner"/>
        ),
        cell: ({row}) => <div className="w-fit">{row.getValue("owner")}</div>,
        enableSorting: true,
        enableHiding: true,
    },
    {
        accessorKey: "creation",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Created"/>
        ),
       cell: ({ row }) => {
    const date = row.getValue("creation");
    
    // Type-cast 'date' explicitly to a string so the Date constructor accepts it
    const formattedDate = date 
        ? new Date(date as string).toLocaleDateString() 
        : 'N/A';
        
    return <div className="w-fit">{formattedDate}</div>;
},
        enableSorting: true,
        enableHiding: true,
    },
    {
        accessorKey: "modified",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Modified"/>
        ),
        cell: ({ row }) => {
    const date = row.getValue("modified");
    const formattedDate = date 
        ? new Date(date as string).toLocaleDateString() 
        : 'N/A';
        
    return <div className="w-fit">{formattedDate}</div>;
},
        enableSorting: true,
        enableHiding: true,
    },
    {
        accessorKey: "modified_by",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Modified By"/>
        ),
        cell: ({row}) => <div className="w-fit">{row.getValue("modified_by")}</div>,
        enableSorting: true,
        enableHiding: true,
    },
]