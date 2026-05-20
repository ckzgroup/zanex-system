"use client"

import { Table } from "@tanstack/react-table"
import { X } from "lucide-react"
import Image from "next/image";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { DataTableFacetedFilter } from "../data-table-faceted-filter"
import {DataTableViewOptions} from "@/components/tables/services/data-table-view-options";
import { DateRange } from "react-day-picker"
import {addDays, format, parse, startOfDay} from "date-fns"

import {statuses, ticket_statuses} from "@/data/services/cases/data";
import useFetchData from "@/actions/use-api";
import React, {useEffect, useState} from "react";
import { CalendarIcon } from "@radix-ui/react-icons"
import {CSVLink} from "react-csv";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {cn} from "@/lib/utils";

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


    // GET SITE LIST
    const { isLoading:siteLoading, error:siteError, data:siteData } = useFetchData('/radar/site');
    const sites = Array.isArray(siteData) ? siteData.reverse() : [];

    // Assuming you have a list of site with usernames stored in an array called 'site'
    const siteOptions = sites.map(item => ({
        value: item.site_name,
        label: item.site_name,
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

    const [dateRange, setDateRange] = React.useState<DateRange | number | undefined>({
        from: new Date(),
        to: addDays(new Date(), 0),
    });

    const [selectedMonth, setSelectedMonth] = useState<number | undefined>();
    const [selectedYear, setSelectedYear] = useState<number | undefined>();



    // Function to filter data based on selected date range
    const filterDataByDateRange = (range: DateRange | undefined ) => {
        if (!range) return;

        // Check if it's a single date
        if (range instanceof Date) {
            const formattedDate = format(range, "yyyy-MM-dd");
            const requestDateColumn = table.getColumn("ticket_actual_time");

            if (requestDateColumn) {
                requestDateColumn.setFilterValue(formattedDate);
            } else {
                console.error("Column 'ticket_create_time' not found in table configuration");
            }
            // ... (rest of your logic for filtering by single date)
        } else {
            // Existing logic for handling DateRange
            const formattedFrom = range?.from ? format(range?.from,  'yyyy-MM-dd') : '';
            const formattedTo = range?.to ? format(range.to, 'yyyy-MM-dd') : '';

            const requestDateColumn = table.getColumn("ticket_actual_time");

            if (requestDateColumn) {

                const filterValue = `${formattedFrom}`;
                requestDateColumn.setFilterValue(filterValue);

                // requestDateColumn.setFilterValue(formattedTo);
                // requestDateColumn.setFilterValue([formattedFrom, formattedTo]);

                // requestDateColumn.setFilterValue((row) => {
                //         return row >= formattedFrom && row <= formattedTo;
                //      });

            } else {
                console.error("Column 'ticket_create_time' not found in table configuration");
            }
        }


    };


    // FILTER BY MONTH & YEAR
    const filterDataByMonthAndYear = () => {
        if (selectedMonth !== undefined && selectedYear !== undefined) {
            const formattedDate = `${selectedYear}-${selectedMonth.toString().padStart(2, "0")}`;
            const requestDateColumn = table.getColumn("ticket_actual_time");

            if (requestDateColumn) {
                requestDateColumn.setFilterValue(formattedDate);
            } else {
                console.error("Column 'ticket_create_time' not found in table configuration");
            }
        }
    };

    React.useEffect(() => {
        // @ts-ignore
        filterDataByDateRange(dateRange);
    }, [dateRange]);

    React.useEffect(() => {
        filterDataByMonthAndYear();
    }, [selectedMonth, selectedYear]);

    // useEffect hook for filtering by customer
    useEffect(() => {
        filterDataByCustomer();
        filterDataByService();
        filterDataBySite()
    }, [selectedCustomer, selectedService, selectedSite]);


    // Function to export filtered data to CSV
    const handleExportToCSV = () => {
        const filteredRows = table.getFilteredRowModel().rows;
        const csvData = filteredRows.map(row => row.original); // Access original data
        return csvData;
    };


    return (
        <div className="space-y-4">
            <div className="flex flex-1 items-center space-x-2">
                {/* ... existing toolbar elements like input filters */}

                {/* Add CSV Export Button */}
                <CSVLink //@ts-ignore
                    data={handleExportToCSV()}
                    filename={`Cases_Report${new Date().toISOString()}.csv`}
                    className="btn btn-outline"
                    headers={[
                        { label: "Ticket no", key: "ticket_no" },
                        { label: "Ticket Subject", key: "ticket_subject" },
                        { label: "Customer", key: "customer_name" },
                        { label: "Service", key: "service_name" },
                        { label: "Site", key: "site_name" },
                        { label: "SLA", key: "sla_hrs" },
                        { label: "SLA Status", key: "ticket_state" },
                        { label: "Actual Time", key: "ticket_actual_time" },
                        { label: "Ticket Status", key: "ticket_status" },
                    ]} // Custom headers
                >
                    <Button variant="default" className='space-x-1 bg-foreground text-background'>
                        <Image src='/images/services/csv.svg' alt='logo' height={18} width={18}
                               style={{objectFit: "cover"}}/>
                        <span>Export CSV</span>
                    </Button>
                </CSVLink>
            </div>
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">

                <Input
                    placeholder="Search ticket no..."
                    value={(table.getColumn("ticket_no")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("ticket_no")?.setFilterValue(event.target.value)
                    }
                    className="h-8 w-[150px] lg:w-[180px]"
                />

                {/*<h4 className="font-semibold">Filter by: </h4>*/}

                {table.getColumn("ticket_state") && (
                    <DataTableFacetedFilter
                        column={table.getColumn("ticket_state")}
                        title="SLA Status"
                        options={statuses}
                    />
                )}

                {table.getColumn("ticket_status") && (
                    <DataTableFacetedFilter
                        column={table.getColumn("ticket_status")}
                        title="Ticket Status"
                        options={ticket_statuses}
                    />
                )}

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

                {table.getColumn("site_name") && (
                    <DataTableFacetedFilter
                        column={table.getColumn("site_name")}
                        title="Site"
                        options={siteOptions}
                    />
                )}

                <div>
                    <Popover>
                        <PopoverTrigger>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-[180px] justify-start text-left font-normal",
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                <span> Date, Month & Year</span>
                            </Button>
                        </PopoverTrigger>

                        <PopoverContent className="flex flex-col items-start space-y-4 p-4">
                            {/* Month and Year Select */}
                            <h4 className="font-semibold">Monthly</h4>

                            <div className="flex items-center space-x-2">

                                <select
                                    value={selectedMonth ?? ""}
                                    onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                                    className="py-1 px-2"
                                >
                                    <option value="">Select Month</option>
                                    {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                                        <option key={month} value={month}>
                                            {format(new Date(2000, month - 1), "MMMM")}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    value={selectedYear ?? ""}
                                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                                    className="py-1 px-2"
                                >
                                    <option value="">Select Year</option>
                                    {Array.from({ length: 2 }, (_, i) => new Date().getFullYear() - i).map(
                                        (year) => (
                                            <option key={year} value={year}>
                                                {year}
                                            </option>
                                        )
                                    )}
                                </select>

                                {/*<Button*/}
                                {/*    variant={"default"}*/}
                                {/*    onClick={filterDataByMonthAndYear}*/}
                                {/*    className="py-1 px-2"*/}
                                {/*>*/}
                                {/*    Apply*/}
                                {/*</Button>*/}

                            </div>

                            {/* Single Date Selection */}
                            <div>
                                <h4 className="font-semibold">Select a Date</h4>
                                <div>
                                    <Input
                                        type="date"
                                        value={
                                            dateRange instanceof Date
                                                ? format(dateRange, "yyyy-MM-dd")
                                                : ""
                                        }
                                        onChange={(e) => {
                                            const selectedDate = parse(
                                                e.target.value,
                                                "yyyy-MM-dd",
                                                new Date()
                                            ); // @ts-ignore
                                            setDateRange(selectedDate); // @ts-ignore
                                            filterDataByDateRange(selectedDate);
                                        }}
                                        className="py-1 px-2"
                                    />
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>


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
        </div>
    )
}