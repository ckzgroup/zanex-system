"use client";

import React, {useRef} from 'react';
import useFetchData from "@/actions/use-api";
import Loading from "@/app/(admin)/(projects)/loading";
import {DataTable} from "@/components/tables/projects/bills/data-table";
import {columns} from "@/components/tables/projects/bills/column";

function BillPage() {

  // Export to PDF
  const targetRef = useRef(null);
  const timestamp = new Date().toISOString().slice(0, 10);

  const {isLoading, error, data} = useFetchData('/wage_bill/getCasualBills');

  const bills = Array.isArray(data) ? data.reverse() : [];

  console.log(bills)

  if (isLoading) return <div><Loading/></div>;

  return (
    <div>
      <div className='flex flex-col md:flex-row justify-between gap-6  mb-8'>
        <div>
          <h2 className='font-heading text-2xl font-bold'> Bills </h2>
          <p className='text-muted-foreground'> View and manage all your bills </p>
        </div>

      </div>

      <div>
        <DataTable columns={columns} data={bills}/>
      </div>
    </div>
  );

}
export default BillPage;
