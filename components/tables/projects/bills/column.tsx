"use client"

import * as React from "react";

import {Briefcase, CheckCircle, DotsThreeOutline, Eye, PencilSimple, Prohibit, Trash} from "@phosphor-icons/react"
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
import EditCasualForm from "@/components/lib/forms/edits/edit-casual-form";
import {useDeleteCasual} from "@/actions/get-casuals";
import {usePatchData} from "@/actions/use-api";
import { useRouter } from "next/navigation";
import {XCircle} from "lucide-react";

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
        accessorKey: "Casual_task_id",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="ID"/>
        ),
        cell:
            ({row}) => <div className="w-fit">{row.getValue("Casual_task_id")}</div>,
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
        accessorKey: "project_name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Project" className="hidden md:block"/>
        ),
        cell: ({ row }) => <div className="w-fit">{row.getValue("project_name")}</div>,
        enableSorting: true,
        enableHiding: true,
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
  {
    accessorKey: "segment_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Segment" className="hidden md:block"/>
    ),
    cell: ({ row }) => <div className="w-fit">{row.getValue("segment_name")}</div>,
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
        accessorKey: "service_sub_category_name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Service Category" className="hidden md:block"/>
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
            <DataTableColumnHeader column={column} title="Rate Amount" className="hidden md:block"/>
        ),
        cell: ({ row }) => <div className="w-fit">Ksh {row.getValue("rate_amount")}</div>,
        enableSorting: true,
        enableHiding: true,
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
  {
        accessorKey: "Casual_payment_status",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Payment Status" className="hidden md:block"/>
        ),
        cell: ({ row }) => <div className="w-fit"> {row.getValue("Casual_payment_status")}</div>,
        enableSorting: true,
        enableHiding: true,
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
  {
        accessorKey: "Casual_payment_date",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Payment Date" className="hidden md:block"/>
        ),
        cell: ({ row }) => <div className="w-fit"> {row.getValue("Casual_payment_date")}</div>,
        enableSorting: true,
        enableHiding: true,
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },

  {
    id: "action",
    cell: ({ row }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks

      // eslint-disable-next-line react-hooks/rules-of-hooks
      const { mutateAsync: updatePayStatus } = usePatchData("/wage_bill/approveWageBill");
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const user_id = useAuthStore((state) => state.user?.result.user_id);
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const router = useRouter();

      const handleUpdateStatus = async (status: "Approved" | "Declined") => {
        try {
          const payload = {
            pay_status: status,
            pay_date: new Date().toISOString().slice(0, 19).replace("T", " "),
            user_id: user_id,
            Casual_task_id: row.getValue("Casual_task_id"), // Ensure this exists
          };

          await updatePayStatus(payload);

          toast({
            title: `Status ${status}`,
            description: `The pay status has been updated to "${status}".`,
            variant: "default",
          });

          router.refresh();
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to update pay status. Try again later.",
            variant: "destructive",
          });
        }
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
            {/* Approve Modal */}
            <Dialog>
              <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <CheckCircle
                    weight="duotone"
                    className="mr-2 h-4 w-4 text-green-600"
                  />
                  Approve
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader className="space-y-4">
                  <DialogTitle className="text-xl font-semibold text-green-600 text-center">
                    Approve Wage Bill
                  </DialogTitle>
                  <DialogDescription className="text-base text-center">
                    Are you sure you want to mark this wage bill as{" "}
                    <span className="font-bold">Approved</span>?
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-center space-x-2 items-center mt-4">
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button
                      className="bg-green-600 text-white hover:bg-green-700"
                      onClick={() => handleUpdateStatus("Approved")}
                    >
                      Approve
                    </Button>
                  </DialogClose>
                </div>
              </DialogContent>
            </Dialog>

            <DropdownMenuSeparator />

            {/* Decline Modal */}
            <Dialog>
              <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <XCircle
                    className="mr-2 h-4 w-4 text-red-500"
                  />
                  Decline
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader className="space-y-4">
                  <DialogTitle className="text-xl font-semibold text-red-500 text-center">
                    Decline Wage Bill
                  </DialogTitle>
                  <DialogDescription className="text-base text-center">
                    Are you sure you want to{" "}
                    <span className="font-bold">Decline</span> this wage bill?
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-center space-x-2 items-center mt-4">
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button
                      variant="destructive"
                      onClick={() => handleUpdateStatus("Declined")}
                    >
                      Decline
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
  }



]
