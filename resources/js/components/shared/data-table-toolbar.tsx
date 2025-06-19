'use client';

import { Table } from '@tanstack/react-table';
import { X } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTableExport } from './data-table-export';
import { DataTableFacetedFilter } from './data-table-faceted-filter';
import { DataTableViewOptions } from './data-table-view-options';

interface DataTableToolbarProps<TData> {
    table: Table<TData>;
    filterOptions?: Record<string, unknown>;
    dataTableClass: string;
    onExport?: (format: string) => Promise<void>;
    onRefreshFilters?: () => Promise<void>;
}

export function DataTableToolbar<TData>({ table, filterOptions = {}, dataTableClass, onExport, onRefreshFilters }: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0;

    const processedFilterOptions = React.useMemo(() => {
        if (filterOptions.filterOptions && typeof filterOptions.filterOptions === 'object') {
            return filterOptions.filterOptions as Record<string, unknown>;
        }
        return filterOptions;
    }, [filterOptions]);

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
                <Input
                    placeholder="Search..."
                    value={table.getState().globalFilter ?? ''}
                    onChange={(event) => table.setGlobalFilter(event.target.value)}
                    className="h-8 w-[150px] lg:w-[250px]"
                />

                {Object.entries(processedFilterOptions).map(([columnId, options]) => {
                    const column = table.getColumn(columnId);

                    if (!column) {
                        console.warn(
                            `Column '${columnId}' not found in table. Available columns:`,
                            table.getAllColumns().map((c) => c.id),
                        );
                        return null;
                    }

                    const title =
                        (column.columnDef.meta && 'title' in column.columnDef.meta
                            ? (column.columnDef.meta as { title?: string }).title
                            : undefined) || columnId;

                    return <DataTableFacetedFilter key={columnId} column={column} title={title} options={options} onRefresh={onRefreshFilters} />;
                })}

                {isFiltered && (
                    <Button variant="ghost" onClick={() => table.resetColumnFilters()} className="h-8 px-2 lg:px-3">
                        Reset
                        <X className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>
            <div className="flex items-center space-x-2">
                <DataTableExport table={table} dataTableClass={dataTableClass} onExport={onExport} />
                <DataTableViewOptions table={table} />
            </div>
        </div>
    );
}
