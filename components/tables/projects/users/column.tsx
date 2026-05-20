"use client"

import * as React from "react";

import {Briefcase, DotsThreeOutline, Eye, PencilSimple, Trash} from "@phosphor-icons/react"
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
        accessorKey: "user_id",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="ID"/>
        ),
        cell:
            ({row}) => <div className="w-fit">{row.getValue("user_id")}</div>,
        enableSorting:
            true,
        enableHiding:
            false,
    },

    {
        accessorKey: "user_firstname",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="First Name"/>
        ),
        cell:
            ({row}) => <div className="w-fit">{row.getValue("user_firstname")}</div>,
        enableSorting:
            true,
        enableHiding:
            false,
    },
    {
        accessorKey: "user_lastname",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Last Name" className="hidden md:block"/>
        ),
        cell: ({ row }) => <div className="w-fit">{row.getValue("user_lastname")}</div>,
        enableSorting: true,
        enableHiding: true,
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        accessorKey: "user_email_address",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Email Address" />
        ),
        cell: ({ row }) => <div className="w-fit">{row.getValue("user_email_address")}</div>,
        enableSorting: true,
        enableHiding: true,
    },

    {
        accessorKey: "user_contact",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Contact" />
        ),
        cell: ({ row }) => <div className="w-fit">{row.getValue("user_contact")}</div>,
        enableSorting: true,
        enableHiding: true,
    },


    {
        accessorKey: "roles",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Role" />
        ),
        cell: ({ row }) => {
            const status = statuses.find(
                (status) => status.value === row.getValue("roles")
            )

            const roles = row.getValue("roles"); // @ts-ignore
            roles.map((role) => {
            if (!role) {
                return (
                    <div key={role.role_id} className="flex items-center">
                        <Badge variant="outline" className={`bg-gray-600 border-none text-white`}>
                            <span>No Role</span>
                        </Badge>
                    </div>
                )
            }});
            return (
                <div className="flex items-center space-x-2">
                    {/* @ts-ignore */}
                    {roles.map((role) => (
                        <div key={role.role_id}>
                            <Badge variant="outline" className={`border-none text-white bg-primary
                     ${role.role_name === 'Supervisor' ? 'bg-[#DD8E4E]/20 text-[#DD8E4E]' : ''}
                     ${role.role_name === 'Admin' ? 'bg-[#6B37DF]/20 text-[#6B37DF]' : ''}
                     ${role.role_name === 'Project Manager' ? 'bg-[#108046]/20 text-[#108046]' : ''}
                     `}>
                                <span>{role.role_name}</span>
                            </Badge>
                        </div>
                        )
                    )}

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
            const { mutate: deleteItem } = useDeleteUser('/users',row.getValue("user_id"));

            const handleDelete = () => {
                deleteItem();

                toast({
                    title: "User Deleted!",
                    description: "You have successfully deleted a user.",
                    variant: "default"
                });
            };

            // Get User
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const { user: userData } = useAuthStore();
            const users = userData?.result || {};  // @ts-ignore
            const { roles } = users || {};


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
                                        <EditUserForm userId={row.getValue("user_id")} />
                                    </ScrollArea>
                                </div>
                            </SheetContent>
                        </Sheet>


                        <DropdownMenuSeparator />

                        {roles.map((role: any) => (
                            <div key={role.role_id}>
                                {role.role_name === "Admin" ? (
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                            <Briefcase weight="duotone" className="mr-2 h-4 w-4 text-fuchsia-500" />
                                            Role
                                        </DropdownMenuItem>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-5xl">
                                        <DialogTitle> Role Management </DialogTitle>
                                        <div>
                                            <RoleManagement userId={row.getValue("user_id")} />
                                        </div>
                                    </DialogContent>
                                </Dialog>
                                ) : (
                                    <></>
                                )}
                            </div>
                        ))}

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
