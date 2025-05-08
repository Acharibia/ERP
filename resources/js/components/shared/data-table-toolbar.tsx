'use client';

import { Table } from '@tanstack/react-table';
import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTableFacetedFilter } from './data-table-faceted-filter';
import { DataTableViewOptions } from './data-table-view-options';
import { DataTableExport } from './data-table-export';

interface DataTableToolbarProps<TData> {
    table: Table<TData>;
    filterOptions?: Record<string, unknown>;
    dataTableClass: string; // Add dataTableClass prop
}

export function DataTableToolbar<TData>({
    table,
    filterOptions = {},
    dataTableClass
}: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0;

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
                <Input
                    placeholder="Search..."
                    value={table.getState().globalFilter ?? ''}
                    onChange={(event) => table.setGlobalFilter(event.target.value)}
                    className="h-8 w-[150px] lg:w-[250px]"
                />

                {/* Dynamic filters based on filterOptions */}
                {Object.entries(filterOptions).map(([columnId, options]) => {
                    const column = table.getColumn(columnId);
                    if (!column) return null;

                    return (
                        <DataTableFacetedFilter key={columnId} column={column} title={(column.columnDef.header as string) || ''} options={options} />
                    );
                })}

                {isFiltered && (
                    <Button variant="ghost" onClick={() => table.resetColumnFilters()} className="h-8 px-2 lg:px-3">
                        Reset
                        <X className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>
            <div className="flex items-center space-x-2">
                {/* Add the Export component */}
                <DataTableExport table={table} dataTableClass={dataTableClass} />
                <DataTableViewOptions table={table} />
            </div>
        </div>
    );
}
