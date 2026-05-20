"use client"

import React from "react";

import {DotsThreeOutline, Eye, PencilSimple, Trash} from "@phosphor-icons/react"
import { Case } from "@/data/services/cases/schema";
import {ColumnDef} from "@tanstack/react-table"
import { statuses, ticket_statuses } from "@/data/services/cases/data";

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
import {useRouter} from "next/navigation";
import {useDeleteCustomer} from "@/actions/get-customer";
import {toast} from "@/components/ui/use-toast";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet";
import EditClientForm from "@/components/lib/forms/edits/edit-client-form";
import ReAssignTicketForm from "@/components/lib/forms/service-actions/re-assign-ticket";
import HoldTicketForm from "@/components/lib/forms/service-actions/hold-ticket-form";
import {AddTicketForm} from "@/components/lib/forms/add-ticket-form";
import ReOpenTicketForm from "@/components/lib/forms/service-actions/re-open-ticket-form";
import CloseTicketForm from "@/components/lib/forms/service-actions/close-ticket-form";
import {formatDateTime} from "@/utils/format-date";
import useAuthStore from "@/hooks/use-user";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {usePostData} from "@/actions/use-api";
import {useMutation} from "@tanstack/react-query";
import {APIProvider, Map} from "@vis.gl/react-google-maps";
import NocCommentForm from "@/components/lib/forms/service-actions/noc-comment-form";
import {EditTicketForm} from "@/components/lib/forms/edits/edit-ticket-form";
import {useState} from "react";
import {useDeleteUser} from "@/actions/get-user";
import {useDeleteTicket} from "@/actions/get-ticket";


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
        router.push(`/service/cases/${row.getValue("ticket_id")}`);
    };

    return (
        <div className="w-fit hover:text-primary hover:font-semibold cursor-pointer" onClick={handleNavigation}>
            {value}
        </div>
    );
};


export const columns: ColumnDef<Case>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected()}
                onCheckedChange={(value: any) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
                className="translate-y-[2px] hidden md:block"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value: any) => row.toggleSelected(!!value)}
                aria-label="Select row"
                className="translate-y-[2px] hidden md:block"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },

    {
        accessorKey: "ticket_id",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="ID"/>
        ),
        cell:
            ({row}) => <ProjectColumn row={row} value={row.getValue("ticket_id")} />,

        enableSorting:
            true,
        enableHiding:
            false,
    },
    {
        accessorKey: "ticket_no",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Ticket No"/>
        ),
        cell:
            ({row}) => <ProjectColumn row={row} value={row.getValue("ticket_no")} />,

        enableSorting:
            true,
        enableHiding:
            false,
    },
    {
        accessorKey: "ticket_subject",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Subject" className="hidden md:block"/>
        ),
        cell: ({ row }) => <div className="w-fit">{row.getValue("ticket_subject")}</div>,
        enableSorting: true,
        enableHiding: true,
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
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
        accessorKey: "service_name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Service" className="hidden md:block"/>
        ),
        cell: ({ row }) => <div className="w-fit">{row.getValue("service_name")}</div>,
        enableSorting: true,
        enableHiding: true,
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },

    {
        accessorKey: "site_name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Site" className="hidden md:block"/>
        ),
        cell: ({ row }) => <div className="w-fit">{row.getValue("site_name")}</div>,
        enableSorting: true,
        enableHiding: true,
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    // {
    //     accessorKey: "technician",
    //     header: ({ column }) => (
    //         <DataTableColumnHeader column={column} title="Technician" className="hidden md:block"/>
    //     ),
    //     cell: ({ row }) => <div className="w-fit">{row.getValue("technician")}</div>,
    //     enableSorting: true,
    //     enableHiding: true,
    //     filterFn: (row, id, value) => {
    //         return value.includes(row.getValue(id))
    //     },
    // },
    {
        accessorKey: "sla_hrs",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="SLA Time" />
        ),
        cell: ({ row }) => {
            const slaHours = row.getValue("sla_hrs");
            const slaMinutes = row.getValue("sla_min") ? row.getValue("sla_min") : '00';
            return (
                <div className="w-fit">
                    <p>
                        {`${slaHours}h ${slaMinutes}m`}
                    </p>
                </div>
            );
        },
        enableSorting: true,
        enableHiding: true,
    },
    {
        accessorKey: "ticket_state",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="SLA Status" />
        ),
        cell: ({row}) => {
            const status = statuses.find(
                (status) => status.value === row.getValue("ticket_state")
            )

            if (!status) {
                return (
                    <div className="flex items-center">
                        <Badge variant='outline' className={` bg-[#8F9CA9] text-white font-semibold`}>
                            <span>Active</span>
                        </Badge>
                    </div>
                )
            }

            return (
                <div className="flex items-center">
                    <Badge variant="outline" className={`border-none text-white 
                     ${status.label === 'within' ? 'bg-[#55BA6A]' : ''}
                     ${status.label === 'scheduled' ? 'bg-[#FDAF20]' : ''}
                     ${status.label === 'breached' ? 'bg-[#EE3A4E]' : ''}
                     `}>
                        <span>{status.label}</span>
                    </Badge>
                </div>
            )
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
        enableSorting: true,
        enableHiding: true,
    },

    // {
    //     accessorKey: "ticket_create_time",
    //     header: ({ column }) => (
    //         <DataTableColumnHeader column={column} title="Create Time" />
    //     ),
    //     cell: ({ row }) => <div className="w-fit">{row.getValue("ticket_create_time")}</div>,
    //     enableSorting: true,
    //     enableHiding: true,
    // },

    {
        accessorKey: "ticket_actual_time",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Actual Time" />
        ),
        cell: ({ row }) => <div className="w-fit">{formatDateTime(row.getValue("ticket_actual_time"))}</div>,
        enableSorting: true,
        enableHiding: true,
    },


    {
        accessorKey: "ticket_status",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Status"/>
        ),
        cell: ({row}) => {
            const status = ticket_statuses.find(
                (status) => status.value === row.getValue("ticket_status")
            )

            if (!status) {
                return (
                    <div className="flex items-center">
                        <Badge variant='outline' className={` bg-[#8F9CA9] text-white font-semibold`}>
                            <span>new</span>
                        </Badge>
                    </div>
                )
            }

            return (
                <div className="flex items-center">
                    <Badge variant="outline" className={`border-none text-white 
                     ${status.label === 'new' ? 'bg-[#8F9CA9]' : ''}
                     ${status.label === 'on_hold' ? 'bg-[#FFDE00]' : ''}
                     ${status.label === 'in-progress' ? 'bg-[#FDAF20]' : ''}
                     ${status.label === 'closed' ? 'bg-[#55BA6A]' : ''}
                     ${status.label === 'monitoring' ? 'bg-[#EE3A4E]' : ''}
                     `}>
                        <span>{status.label}</span>
                    </Badge>
                </div>
            )
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
        enableSorting:
            true,
        enableHiding:
            false,
    },


    {
        id: "action",
        cell: ({ row }) => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const user = useAuthStore((state) => state.user?.result.user_id);
            const user_id = user?.toString();

            // eslint-disable-next-line react-hooks/rules-of-hooks
            const mutation = usePostData('/maintenance/closeTicket');

            // eslint-disable-next-line react-hooks/rules-of-hooks
            const activateMutation = usePostData('/maintenance/activateTicket');


            // eslint-disable-next-line react-hooks/rules-of-hooks
            const [open, setOpen] = React.useState(false); // Controls dialog state


            // DELETE FUNCTION
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const { mutate: deleteItem } = useDeleteTicket('/maintenance/deleteTicket',row.getValue("ticket_id"));

            const handleDelete = () => {
                deleteItem();

                toast({
                    title: "Ticket Deleted!",
                    description: "You have successfully deleted a ticket.",
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

                        {["new", "in-progress"].includes(row.getValue("ticket_status")) && (
                           <>
                               <Sheet>
                                   <SheetTrigger asChild>
                                       <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                           Re-Assign Ticket
                                       </DropdownMenuItem>
                                   </SheetTrigger>

                                   <SheetContent>
                                       <SheetHeader>
                                           <SheetTitle> Re-Assign Ticket </SheetTitle>
                                           <SheetDescription>
                                               Use the form below to re-assign ticket.
                                           </SheetDescription>
                                       </SheetHeader>
                                       <div className="">
                                           <ScrollArea className="h-screen w-full pr-3 py-4 flex flex-col space-y-6 justify-between">
                                               <ReAssignTicketForm ticketId={row.getValue("ticket_id")} />
                                           </ScrollArea>
                                       </div>
                                   </SheetContent>
                               </Sheet>
                               <DropdownMenuSeparator />
                           </>
                        )}

                        {["closed", "monitoring"].includes(row.getValue("ticket_status")) && (
                            <>
                                <Sheet>
                                    <SheetTrigger asChild>
                                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                            Re-Open Ticket
                                        </DropdownMenuItem>
                                    </SheetTrigger>

                                    <SheetContent>
                                        <SheetHeader>
                                            <SheetTitle> Re-Open Ticket </SheetTitle>
                                            <SheetDescription>
                                                Use the form below to re-open ticket.
                                            </SheetDescription>
                                        </SheetHeader>
                                        <div className="">
                                            <ScrollArea className="h-screen w-full pr-3 py-4 flex flex-col space-y-6 justify-between">
                                                <ReOpenTicketForm ticketId={row.getValue("ticket_id")} />
                                            </ScrollArea>
                                        </div>
                                    </SheetContent>
                                </Sheet>
                                <DropdownMenuSeparator />
                            </>
                            )}


                        {["new", "in-progress"].includes(row.getValue("ticket_status")) && (
                            <>
                                <Sheet>
                                    <SheetTrigger asChild>
                                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                            Hold Ticket
                                        </DropdownMenuItem>
                                    </SheetTrigger>

                                    <SheetContent>
                                        <SheetHeader>
                                            <SheetTitle> Hold Ticket </SheetTitle>
                                            <SheetDescription>
                                                Use the form below to hold ticket.
                                            </SheetDescription>
                                        </SheetHeader>
                                        <div className="mt-2">
                                            <ScrollArea className="h-screen w-full pr-3 py-4 flex flex-col space-y-6 justify-between">
                                                <HoldTicketForm ticketId={row.getValue("ticket_id")} />
                                            </ScrollArea>
                                        </div>
                                    </SheetContent>
                                </Sheet>
                                <DropdownMenuSeparator />
                            </>
                            )}

                        {["monitoring"].includes(row.getValue("ticket_status")) && (
                            <>
                                <Sheet>
                                    <SheetTrigger asChild>
                                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                            Close Ticket
                                        </DropdownMenuItem>
                                    </SheetTrigger>

                                    <SheetContent>
                                        <SheetHeader>
                                            <SheetTitle> Close Ticket </SheetTitle>
                                            <SheetDescription>
                                                Use the form below to close ticket.
                                            </SheetDescription>
                                        </SheetHeader>
                                        <div className="mt-2">
                                            <ScrollArea className="h-screen w-full pr-3 py-4 flex flex-col space-y-6 justify-between">
                                                <CloseTicketForm ticketId={row.getValue("ticket_id")} />
                                            </ScrollArea>
                                        </div>
                                    </SheetContent>
                                </Sheet>
                                <DropdownMenuSeparator />
                            </>
                            )}

                        {["in-progress"].includes(row.getValue("ticket_status")) && (
                            <>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                            Complete Ticket
                                        </DropdownMenuItem>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader className='space-y-4'>
                                            <DialogTitle className='text-2xl font-bold text-center'>Complete Ticket</DialogTitle>
                                            <DialogDescription className='text-base text-center'>
                                                Proceed with this action if you want to complete this ticket.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className='flex justify-center space-x-2 items-center mt-4'>
                                            <DialogClose asChild>
                                                <Button variant='outline' type="reset">Cancel</Button>
                                            </DialogClose>
                                            <DialogClose asChild>
                                                <Button
                                                    type="submit"
                                                    onClick={() => {
                                                        mutation.mutate({
                                                            closeTime: new Date(),
                                                            userId: user_id,
                                                            ticket_id: row.getValue("ticket_id")
                                                        })
                                                    }}
                                                >
                                                    Confirm
                                                </Button>
                                            </DialogClose>
                                        </div>
                                    </DialogContent>

                                </Dialog>
                                <DropdownMenuSeparator />
                            </>
                            )}

                        {["on_hold"].includes(row.getValue("ticket_status")) && (
                            <>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                            Activate Ticket
                                        </DropdownMenuItem>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader className='space-y-4'>
                                            <DialogTitle className='text-2xl font-bold text-center'> Activate Ticket </DialogTitle>
                                            <DialogDescription className='text-base text-center'>
                                                Proceed with this action if you want to activate this ticket.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className='flex justify-center space-x-2 items-center mt-4'>
                                            <DialogClose asChild>
                                                <Button variant='outline' type="reset">Cancel</Button>
                                            </DialogClose>
                                            <DialogClose asChild>
                                                <Button
                                                    type="submit"
                                                    onClick={() => {
                                                        activateMutation.mutate({
                                                            releaseTime: new Date(),
                                                            userId: user_id,
                                                            ticket_id: row.getValue("ticket_id")
                                                        })
                                                    }}
                                                >
                                                    Confirm
                                                </Button>
                                            </DialogClose>
                                        </div>
                                    </DialogContent>

                                </Dialog>
                            </>
                            )}

                        {["monitoring", "in-progress", "closed", "on-hold"].includes(row.getValue("ticket_status")) && (
                            <>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                   <Link href={`/service/cases/${row.getValue("ticket_id")}/map`}>
                                   {/*<Link href={`/service/cases/map`}>*/}
                                       View Map
                                   </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                            </>
                            )}

                        {["new", "in-progress"].includes(row.getValue("ticket_status")) && (
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                    Edit Ticket
                                </DropdownMenuItem>
                            </DialogTrigger>
                            <DialogContent className="max-w-fit">
                                <DialogHeader className='space-y-4'>
                                    <DialogTitle className='text-2xl font-bold text-center'> Update Ticket </DialogTitle>

                                </DialogHeader>
                                <div className='flex justify-center space-x-2 items-center mt-0'>
                                    <EditTicketForm ticketId={row.getValue("ticket_id")} onClose={() => setOpen(false)} />
                                </div>
                            </DialogContent>

                        </Dialog>
                            )}


                        {["monitoring", "in-progress", "on_hold", "new"].includes(row.getValue("ticket_status")) && (
                            <>
                        <Sheet>
                            <SheetTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                    NOC Comment
                                </DropdownMenuItem>
                            </SheetTrigger>

                            <SheetContent>
                                <SheetHeader>
                                    <SheetTitle> New NOC Comment </SheetTitle>
                                    <SheetDescription>
                                        Use the form below to add NOC comment.
                                    </SheetDescription>
                                </SheetHeader>
                                <div className="">
                                    <ScrollArea className="h-screen w-full pr-3 py-4 flex flex-col space-y-6 justify-between">
                                        <NocCommentForm ticketId={row.getValue("ticket_id")} />
                                    </ScrollArea>
                                </div>
                            </SheetContent>
                        </Sheet>
                        <DropdownMenuSeparator />
                            </>
                        )}

                        {["new"].includes(row.getValue("ticket_status")) && (
                            <Dialog>
                                <DialogTrigger asChild>
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                                        Delete Ticket
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
                        )}

                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
        enableSorting: false,
        enableHiding: false,
    },

]