"use client"

import { Table } from "@tanstack/react-table"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {DataTableViewOptions} from "@/components/tables/projects/data-table-view-options";
import {DataTableFacetedFilter} from "@/components/tables/projects/data-table-faceted-filter";

interface DataTableToolbarProps<TData> {
    table: Table<TData>
}

export function DataTableToolbar<TData>({
                                            table,
                                        }: DataTableToolbarProps<TData>) {
    const isFiltered =
        table.getPreFilteredRowModel().rows.length >
        table.getFilteredRowModel().rows.length

    // Extract unique item names for filter
    const itemNames = Array.from(
        new Set(table.getPreFilteredRowModel().rows.map(row => row.getValue("item_name")))
    ).filter(Boolean).sort().map(name => ({ label: name as string, value: name as string }))

    // Extract unique item groups for filter
    const itemGroups = Array.from(
        new Set(table.getPreFilteredRowModel().rows.map(row => row.getValue("item_group")))
    ).filter(Boolean).sort().map(group => ({ label: group as string, value: group as string }))

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
                <Input
                    placeholder="Filter stocks..."
                    value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("name")?.setFilterValue(event.target.value)
                    }
                    className="h-8 w-[150px] lg:w-[250px]"
                />
                {table.getColumn("item_name") && (
                    <DataTableFacetedFilter
                        column={table.getColumn("item_name")}
                        title="Item Name"
                        options={itemNames}
                    />
                )}
                {table.getColumn("item_group") && (
                    <DataTableFacetedFilter
                        column={table.getColumn("item_group")}
                        title="Item Group"
                        options={itemGroups}
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
