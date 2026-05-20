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
import EditRateCardForm from "@/components/lib/forms/edits/edit-rate-card-form";
import {useDeleteRate} from "@/actions/get-rate-card";

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
        accessorKey: "rate_card_id",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="ID"/>
        ),
        cell:
            ({row}) => <div className="w-fit">{row.getValue("rate_card_id")}</div>,
        enableSorting:
            true,
        enableHiding:
            false,
    },

    {
        accessorKey: "service_name",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Service"/>
        ),
        cell:
            ({row}) => <div className="w-fit">{row.getValue("service_name")}</div>,
        enableSorting:
            true,
        enableHiding:
            false,
    },
    {
        accessorKey: "service_sub_category_name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Category" className="hidden md:block"/>
        ),
        cell: ({ row }) => <div className="w-fit">{row.getValue("service_sub_category_name")}</div>,
        enableSorting: true,
        enableHiding: true,
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        accessorKey: "rate_amount",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Rate Amount" />
        ),
        cell: ({ row }) => <div className="w-fit">Ksh {row.getValue("rate_amount")}</div>,
        enableSorting: true,
        enableHiding: true,
    },

  {
    accessorKey: "rate_card_status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => <div className="w-fit">{row.getValue("rate_card_status")}</div>,
    enableSorting: true,
    enableHiding: true,
  },


    {
        id: "action",
        cell: ({ row }) => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const { mutate: deleteItem } = useDeleteRate('/wage_bill/deleteWageBill',row.getValue("rate_card_id"));

            const handleDelete = () => {
                deleteItem();

                toast({
                    title: "Rate Card Deleted!",
                    description: "You have successfully deleted a rate card.",
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
                                    <SheetTitle>Update User</SheetTitle>
                                    <SheetDescription>
                                        Use the form below to update user information.
                                    </SheetDescription>
                                </SheetHeader>
                                <div className="mt-0">
                                    <ScrollArea className="h-screen w-full pr-3 flex flex-col space-y-4 justify-between">
                                      <EditRateCardForm rate_card_id={row.getValue("rate_card_id")} />
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
