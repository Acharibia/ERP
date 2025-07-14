'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BaseRowData, DataTableColumn } from '@/types/data-table';
import { Table as TanstackTable } from '@tanstack/react-table';
import * as lucideIcons from 'lucide-react';
import { EmptyState } from '../empty-state';
import { Checkbox } from '../ui/checkbox';
import { ActionsColumn } from './actions-column';
import { BadgeColumn } from './badge-column';
import { DataTableColumnHeader } from './data-table-column-header';
import { SelectColumn } from './select-column';
import { TableLoading } from './table-loading';

interface DesktopDataTableProps<T extends BaseRowData> {
    table: TanstackTable<T>;
    isLoading: boolean;
    onRowClick: (row: T) => void;
    onAction?: (action: string, row: T) => void;
    enableRowClick?: boolean;
}

export function DesktopDataTable<T extends BaseRowData>({ table, isLoading, onRowClick, onAction, enableRowClick = true }: DesktopDataTableProps<T>) {
    const rows = table.getRowModel().rows;

    return (
        <div className="w-full overflow-x-auto">
            <Table className="min-w-[1000px] table-auto">
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                const meta = header.column.columnDef.meta as DataTableColumn | undefined;
                                return (
                                    <TableHead key={header.id} colSpan={header.colSpan} className={meta?.type === 'actions' ? 'text-center' : ''}>
                                        {header.isPlaceholder ? null : header.column.id === 'select' ? (
                                            <Checkbox
                                                checked={table.getIsAllPageRowsSelected()}
                                                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                                                aria-label="Select all rows"
                                            />
                                        ) : (
                                            <DataTableColumnHeader table={table} column={header.column} title={meta?.title ?? header.column.id} />
                                        )}
                                    </TableHead>
                                );
                            })}
                        </TableRow>
                    ))}
                </TableHeader>

                <TableBody>
                    {isLoading ? (
                        <TableLoading columnCount={table.getAllColumns().length} />
                    ) : rows.length ? (
                        rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && 'selected'}
                                onClick={() => onRowClick(row.original)}
                                className={enableRowClick ? 'hover:bg-muted/50 cursor-pointer' : ''}
                            >
                                {row.getVisibleCells().map((cell) => {
                                    const meta = cell.column.columnDef.meta as DataTableColumn | undefined;
                                    const value = cell.getValue();

                                    switch (meta?.type) {
                                        case 'badge':
                                            return (
                                                <TableCell key={cell.id}>
                                                    <BadgeColumn value={String(value)} config={meta?.badgeConfig ?? {}} />
                                                </TableCell>
                                            );
                                        case 'actions':
                                            return (
                                                <TableCell key={cell.id} className="text-center">
                                                    <ActionsColumn
                                                        actions={Array.isArray(row.original.actions) ? row.original.actions : []}
                                                        rowData={row.original}
                                                        onAction={onAction ?? (() => {})}
                                                    />
                                                </TableCell>
                                            );
                                        case 'checkbox':
                                            return (
                                                <TableCell key={cell.id}>
                                                    <SelectColumn checked={row.getIsSelected()} onChange={() => row.toggleSelected()} />
                                                </TableCell>
                                            );
                                        default:
                                            return (
                                                <TableCell key={cell.id}>
                                                    {typeof value === 'object' || value === undefined || value === null || value === ''
                                                        ? '--'
                                                        : String(value)}
                                                </TableCell>
                                            );
                                    }
                                })}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={table.getAllColumns().length} className="p-0">
                                <EmptyState
                                    icon={lucideIcons.Search}
                                    iconSize="h-12 w-12"
                                    title="No results found"
                                    description="Try adjusting your search or filter criteria to find what you're looking for."
                                />
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
