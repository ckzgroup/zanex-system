"use client";

import React, {useRef} from 'react';
import useFetchData from "@/actions/use-api";
import Loading from "@/app/(admin)/(projects)/loading";
import {DataTable} from "@/components/tables/projects/rate-cards/data-table";
import {columns} from "@/components/tables/projects/rate-cards/column";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet";
import {Button, buttonVariants} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {Plus} from "@phosphor-icons/react";
import {ScrollArea} from "@/components/ui/scroll-area";
import AddUserForm from "@/components/lib/forms/add-user-form";
import AddRateCardForm from "@/components/lib/forms/projects/add-rate-card-form";

function RateCardPage() {

  // Export to PDF
  const targetRef = useRef(null);
  const timestamp = new Date().toISOString().slice(0, 10);

  const {isLoading, error, data} = useFetchData('/wage_bill/getWageBill');

  const rates = Array.isArray(data) ? data.reverse() : [];


  if (isLoading) return <div><Loading/></div>;

  return (
    <div>
      <div className='flex flex-col md:flex-row justify-between gap-6  mb-8'>
        <div>
          <h2 className='font-heading text-2xl font-bold'> Rate Card </h2>
          <p className='text-muted-foreground'> View and manage all your rate card </p>
        </div>

        <div className='flex space-x-2 items-center'>

          <Sheet>
            <SheetTrigger asChild>
              <Button
                className={cn(
                  buttonVariants({variant: "default"}),
                  "space-x-1"
                )}
              >
                <Plus className='h-4 w-4'/>
                <span> Create Rate Card </span>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <ScrollArea className="h-full w-[320px] p-2">

                <SheetHeader>
                  <SheetTitle>Add Rate Card</SheetTitle>
                  <SheetDescription>
                    Use the form below to add a new rate card to the wage bill.
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6">
                  <AddRateCardForm />
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div>
        <DataTable columns={columns} data={rates}/>
      </div>
    </div>
  );

}
export default RateCardPage;
