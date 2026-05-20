"use client"

import { Table } from "@tanstack/react-table"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { DataTableFacetedFilter } from "../data-table-faceted-filter"
import {DataTableViewOptions} from "@/components/tables/services/data-table-view-options";

import { statuses } from "@/data/services/escalations/data";
import {useEffect, useState} from "react";
import useFetchData from "@/actions/use-api";

interface DataTableToolbarProps<TData> {
    table: Table<TData>
}

export function DataTableToolbar<TData>({
                                            table,
                                        }: DataTableToolbarProps<TData>) {

    // GET CUSTOMER LIST
    const { isLoading:customerLoading, error:customerError, data:customerData } = useFetchData('/customers');
    const customers = Array.isArray(customerData) ? customerData.reverse() : [];

    // Assuming you have a list of customers with usernames stored in an array called 'customer'
    const customerOptions = customers.map(item => ({
        value: item.customer_name,
        label: item.customer_name,
    }));


    // GET SERVICE LIST
    const { isLoading:serviceLoading, error:serviceError, data:serviceData } = useFetchData('/services');
    const services = Array.isArray(serviceData) ? serviceData.reverse() : [];

    // Assuming you have a list of services with usernames stored in an array called 'services'
    const serviceOptions = services.map(item => ({
        value: item.service_name,
        label: item.service_name,
    }));

    const [selectedCustomer, setSelectedCustomer] = useState<string | undefined>();
    const [selectedService, setSelectedService] = useState<string | undefined>();
    const [selectedSite, setSelectedSite] = useState<string | undefined>();

    const isFiltered =
        table.getPreFilteredRowModel().rows.length >
        table.getFilteredRowModel().rows.length

    // Function to filter data based on selected customer
    const filterDataByCustomer = () => {
        if (selectedCustomer) {
            const customerColumn = table.getColumn("user_name");

            if (customerColumn) {
                customerColumn.setFilterValue(selectedCustomer);
            } else {
                console.error("Column 'customer' not found in table configuration");
            }
        }
    };

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

    // Function to filter data based on selected service
    const filterDataBySite = () => {
        if (selectedSite) {
            const siteColumn = table.getColumn("site_name");

            if (siteColumn) {
                siteColumn.setFilterValue(selectedSite);
            } else {
                console.error("Column 'service' not found in table configuration");
            }
        }
    };

    // useEffect hook for filtering by customer
    useEffect(() => {
        filterDataByCustomer();
        filterDataByService();
        filterDataBySite()
    }, [selectedCustomer, selectedService, selectedSite]);

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
                <h4 className="font-semibold">Filter by: </h4>
                {table.getColumn("customer_name") && (
                    <DataTableFacetedFilter
                        column={table.getColumn("customer_name")}
                        title="Customer"
                        options={customerOptions}
                    />
                )}

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
                        <X className="ml-2 h-4 w-4"/>
                    </Button>
                )}
            </div>
            <DataTableViewOptions table={table} />
        </div>
    )
}