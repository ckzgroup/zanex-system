"use client"

import { Table } from "@tanstack/react-table"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { DataTableFacetedFilter } from "../data-table-faceted-filter"
import {DataTableViewOptions} from "@/components/tables/services/data-table-view-options";

import { statuses } from "@/data/services/job-card/data";
import useFetchData from "@/actions/use-api";
import {useEffect, useState} from "react";

interface DataTableToolbarProps<TData> {
    table: Table<TData>
}

export function DataTableToolbar<TData>({
                                            table,
                                        }: DataTableToolbarProps<TData>) {

    const [selectedService, setSelectedService] = useState<string | undefined>();

    // GET SERVICE LIST
    const { isLoading:serviceLoading, error:serviceError, data:serviceData } = useFetchData('/services');
    const services = Array.isArray(serviceData) ? serviceData.reverse() : [];

    // Assuming you have a list of services with usernames stored in an array called 'services'
    const serviceOptions = services.map(item => ({
        value: item.service_name,
        label: item.service_name,
    }));

    const isFiltered =
        table.getPreFilteredRowModel().rows.length >
        table.getFilteredRowModel().rows.length

    // Function to filter data based on selected service
    const filterDataByService = () => {
        if (selectedService) {
            const serviceColumn = table.getColumn("service_name");

            if (serviceColumn) {
                serviceColumn.setFilterValue(selectedService);
            } else {
                console.error("Column 'service' not found in table configuration");
            }
        }
    };

    // useEffect hook for filtering by customer
    useEffect(() => {
        filterDataByService();
    }, [ selectedService ]);

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
                <Input
                    placeholder="Filter job card..."
                    value={(table.getColumn("service_category_name")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("service_category_name")?.setFilterValue(event.target.value)
                    }
                    className="h-8 w-[150px] lg:w-[250px]"
                />

                {table.getColumn("service_name") && (
                    <DataTableFacetedFilter
                        column={table.getColumn("service_name")}
                        title="Service"
                        options={serviceOptions}
                    />
                )}

                {isFiltered && (
                    <Button
                        variant="ghost"
                        onClick={() => table.resetColumnFilters()}
                        className="h-8 px-2 lg:px-3"
                    >
                        Reset
                        <X className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>
            <DataTableViewOptions table={table} />
        </div>
    )
}