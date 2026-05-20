"use client";

import React, {useRef} from 'react';
import useFetchData from "@/actions/use-api";
import Loading from "@/app/(admin)/(projects)/loading";
import {DataTable} from "@/components/tables/projects/wages/data-table";
import {columns} from "@/components/tables/projects/wages/column";


function WagesPage() {

  // Export to PDF
  const targetRef = useRef(null);
  const timestamp = new Date().toISOString().slice(0, 10);

  const {isLoading, error, data} = useFetchData('/wage_bill/getCasuals');

  const casuals = Array.isArray(data) ? data.reverse() : [];

  if (isLoading) return <div><Loading/></div>;

  return (
    <div>
      
      <div className='flex flex-col md:flex-row justify-between gap-6  mb-8'>
        <div>
          <h2 className='font-heading text-2xl font-bold'> Casuals </h2>
          <p className='text-muted-foreground'> View and manage all your casuals </p>
        </div>

      </div>

      <div>
        <DataTable columns={columns} data={casuals}/>
      </div>
    </div>
  );

}
export default WagesPage;
