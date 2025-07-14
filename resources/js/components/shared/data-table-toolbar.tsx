'use client';

import { Table } from '@tanstack/react-table';
import { SlidersHorizontal, X } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { BaseRowData, BulkAction } from '@/types/data-table';
import { DataTableBulkActions } from './data-table-bulkactions';
import { DataTableExport } from './data-table-export';
import { DataTableFacetedFilter } from './data-table-faceted-filter';
import { DataTableViewOptions } from './data-table-view-options';

interface DataTableToolbarProps<TData> {
    table: Table<TData>;
    filterOptions?: Record<string, unknown>;
    dataTableClass: string;
    onExport?: (format: string) => Promise<void>;
    onRefreshFilters?: () => Promise<void>;
    fileName?: string;
    bulkActions?: BulkAction[];
    selectedRows?: BaseRowData[];
    onBulkAction?: (action: string, rows: BaseRowData[]) => void;
}

export function DataTableToolbar<TData>({
    table,
    filterOptions = {},
    dataTableClass,
    onExport,
    onRefreshFilters,
    fileName,
    bulkActions,
    selectedRows,
    onBulkAction,
}: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0;

    const processedFilterOptions = React.useMemo(() => {
        if (filterOptions.filterOptions && typeof filterOptions.filterOptions === 'object') {
            return filterOptions.filterOptions as Record<string, unknown>;
        }
        return filterOptions;
    }, [filterOptions]);

    return (
        <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
                <Input
                    placeholder="Search..."
                    value={table.getState().globalFilter ?? ''}
                    onChange={(event) => table.setGlobalFilter(event.target.value)}
                    className="h-8 w-[150px] lg:w-[250px]"
                />

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8 gap-1">
                            <SlidersHorizontal className="h-4 w-4" />
                            <span className="sr-only sm:not-sr-only">Filters</span>
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent>
                        <div className="flex flex-col space-y-3 p-4">
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

                                return (
                                    <DataTableFacetedFilter
                                        key={columnId}
                                        column={column}
                                        title={title}
                                        options={options}
                                        onRefresh={onRefreshFilters}
                                    />
                                );
                            })}

                            {isFiltered && (
                                <Button variant="ghost" onClick={() => table.resetColumnFilters()} className="h-8 w-full justify-start px-2 text-sm">
                                    Reset filters
                                    <X className="ml-2 h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="flex items-center gap-2">
                {bulkActions && selectedRows && selectedRows.length > 0 && onBulkAction && (
                    <DataTableBulkActions actions={bulkActions} selectedRows={selectedRows} onBulkAction={onBulkAction} />
                )}

                <DataTableExport fileName={fileName} table={table} dataTableClass={dataTableClass} onExport={onExport} />
                <DataTableViewOptions table={table} />
            </div>
        </div>
    );
}
