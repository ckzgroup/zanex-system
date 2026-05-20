"use client"

import * as React from "react";

import {Briefcase, DotsThreeOutline, Eye, PencilSimple, Prohibit, Trash} from "@phosphor-icons/react"
import {ColumnDef} from "@tanstack/react-table"
import { statuses } from "@/data/projects/users/data";

import {Badge} from "@/components/ui/badge"
import {Checkbox} from "@/components/ui/checkbox"
import {DataTableColumnHeader} from "@/components/tables/projects/data-table-column-header";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
    Dialog, DialogClose,
    DialogContent, DialogDescription, DialogHeader, DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";


import {User} from "@/data/projects/users/schema";
import {useDeleteProject} from "@/actions/get-project";
import {toast} from "@/components/ui/use-toast";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet";
import {ScrollArea} from "@/components/ui/scroll-area";
import EditClientForm from "@/components/lib/forms/edits/edit-client-form";
import {Button} from "@/components/ui/button";
import EditUserForm from "@/components/lib/forms/edits/edit-user-form";
import {useDeleteUser} from "@/actions/get-user";
import RoleManagement from "@/components/lib/role-management";
import useAuthStore from "@/hooks/use-user";

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
    accessorKey: "project_name",
    header: ({column}) => (
      <DataTableColumnHeader column={column} title="Project"/>
    ),
    cell:
      ({row}) => <div className="w-fit">{row.getValue("project_name")}</div>,
    enableSorting:
      true,
    enableHiding:
      false,
  },
  {
    accessorKey: "segment_name",
    header: ({column}) => (
      <DataTableColumnHeader column={column} title="Segment"/>
    ),
    cell:
      ({row}) => <div className="w-fit">{row.getValue("segment_name")}</div>,
    enableSorting:
      true,
    enableHiding:
      false,
  },

    {
        accessorKey: "Casual_name",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title=" Name"/>
        ),
        cell:
            ({row}) => <div className="w-fit">{row.getValue("Casual_name")}</div>,
        enableSorting:
            true,
        enableHiding:
            false,
    },
  {
    accessorKey: "Casual_time_in",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Time In" className="hidden md:block"/>
    ),
    cell: ({ row }) => <div className="w-fit">{row.getValue("Casual_time_in")}</div>,
    enableSorting: true,
    enableHiding: true,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "Casual_time_out",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Time Out" className="hidden md:block"/>
    ),
    cell: ({ row }) => <div className="w-fit">{row.getValue("Casual_time_out")}</div>,
    enableSorting: true,
    enableHiding: true,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
    {
        accessorKey: "Country_code",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Country Code" className="hidden md:block"/>
        ),
        cell: ({ row }) => <div className="w-fit">{row.getValue("Country_code")}</div>,
        enableSorting: true,
        enableHiding: true,
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        accessorKey: "Casual_phone_no",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Phone Number" />
        ),
        cell: ({ row }) => <div className="w-fit">{row.getValue("Casual_phone_no")}</div>,
        enableSorting: true,
        enableHiding: true,
    },
    //
    // {
    //     accessorKey: "image_dp",
    //     header: ({ column }) => (
    //         <DataTableColumnHeader column={column} title="Image" />
    //     ),
    //     cell: ({ row }) => <div className="w-fit relative">
    //       <img src={row.getValue("image_dp")} alt="avatar" className="object-cover w-10 h-10 rounded-full"/>
    //
    //     </div>,
    //     enableSorting: true,
    //     enableHiding: true,
    // },




]
