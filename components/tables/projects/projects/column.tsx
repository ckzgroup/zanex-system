"use client"

import * as React from "react";

import {DotsThreeOutline, Eye, PencilSimple, Trash} from "@phosphor-icons/react"
import { Project } from "@/data/projects/projects/schema";
import {ColumnDef} from "@tanstack/react-table"
import { statuses } from "@/data/projects/projects/data";

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
import Link from "next/link";
import {formatDate} from "@/utils/format-date";
import {useRouter} from "next/navigation";
import EditProjectForm from "@/components/lib/forms/edits/edit-project-form";
import {useDeleteProject} from "@/actions/get-project";
import {toast} from "@/components/ui/use-toast";


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

// @ts-ignore
const ProjectColumn = ({ row, value }) => {
    const router = useRouter();

    const handleNavigation = () => {
        router.push(`/projects/${row.getValue("project_id")}`);
    };

    return (
        <div className="w-fit hover:text-primary hover:font-semibold cursor-pointer" onClick={handleNavigation}>
            {value}
        </div>
    );
};

export const columns: ColumnDef<Project>[] = [
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
        accessorKey: "project_id",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="ID"/>
        ),
        cell:
            ({row}) => <ProjectColumn row={row} value={row.getValue("project_id")} />,
        enableSorting:
            true,
        enableHiding:
            false,
    },
    {
        accessorKey: "project_name",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Name"/>
        ),
        cell:
            ({row}) => <ProjectColumn row={row} value={row.getValue("project_name")} />,
        enableSorting:
            true,
        enableHiding:
            false,
    },
    {
        accessorKey: "customer_name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Client" className="hidden md:block"/>
        ),
        cell: ({ row }) => <div className="w-fit">{row.getValue("customer_name")}</div>,
        enableSorting: true,
        enableHiding: true,
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        accessorKey: "region_name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Region" />
        ),
        cell: ({ row }) => <div className="w-fit">{row.getValue("region_name")}</div>,
        enableSorting: true,
        enableHiding: true,
    },

    {
        accessorKey: "project_start_date",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Start Date" />
        ),
        cell: ({ row }) => <div className="w-fit">
            {formatDate(row.getValue("project_start_date"))}
        </div>,
        enableSorting: true,
        enableHiding: true,
    },


    {
        accessorKey: "project_end_date",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="End Date" />
        ),
        cell: ({ row }) => <div className="w-fit hidden md:block">
            {formatDate(row.getValue("project_end_date"))}
        </div>,
        enableSorting: true,
        enableHiding: false,
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
                     ${status.label === 'Pending' ? 'bg-[#8F9CA9]' : ''}
                     ${status.label === 'in-progress review' ? 'bg-[#FFDE00]' : ''}
                     ${status.label === 'In Progress' ? 'bg-[#FDAF20]' : ''}
                     ${status.label === 'Completed' ? 'bg-[#55BA6A]' : ''}
                     ${status.label === 'Cancelled' ? 'bg-[#EE3A4E]' : ''}
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
            const { mutate: deleteItem } = useDeleteProject('/project',row.getValue("project_id"));

            const handleDelete = () => {
                deleteItem();

                toast({
                    title: "Project Deleted!",
                    description: "You have successfully deleted the project.",
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

                        <Dialog>
                            <DialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                    <PencilSimple weight="duotone" className="mr-2 h-4 w-4 text-muted-foreground/70" />
                                    Edit
                                </DropdownMenuItem>
                            </DialogTrigger>
                            <DialogContent className='max-w-4xl py-4'>
                                <ScrollArea className="h-screen w-full pr-3 py-4 flex flex-col space-y-6 justify-between">
                                    <EditProjectForm projectId={row.getValue("project_id")} />
                                </ScrollArea>
                            </DialogContent>
                        </Dialog>

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