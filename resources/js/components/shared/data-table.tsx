'use client';

import { useDataTable } from '@/hooks/use-data-table';
import { useIsMobile } from '@/hooks/use-mobile';
import type { BaseRowData, DataTableProps, DataTableRef } from '@/types/data-table';
import * as React from 'react';
import { DataTableError } from './data-table-error';
import { DataTableInitialLoading } from './data-table-loading';
import { DataTablePagination } from './data-table-pagination';
import { DataTableToolbar } from './data-table-toolbar';
import { DesktopDataTable } from './desktop-data-table';
import { MobileDataTable } from './mobile-data-table';
import { TableLoading } from './table-loading';

function DataTableInner<T extends BaseRowData>(
    { dataTableClass, routes, onRowAction, onBulkAction, enableRowClick = true, preserveStateKey, fileName }: DataTableProps<T>,
    ref: React.Ref<DataTableRef>,
) {
    const isMobile = useIsMobile();

    const { columns, isLoading, error, fetchData, filterOptions, bulkActions, exportData, fetchFilterOptions, table } = useDataTable<T>({
        dataTableClass,
        routes,
        preserveStateKey,
        fileName,
    });

    React.useImperativeHandle(ref, () => ({
        reload: () => fetchData(true),
    }));

    const handleRowClick = React.useCallback(
        (rowData: T) => {
            if (enableRowClick && onRowAction) {
                onRowAction('view', rowData);
            }
        },
        [enableRowClick, onRowAction],
    );

    const selectedRows = table.getSelectedRowModel().rows.map((r) => r.original);

    const handleBulkAction = React.useCallback(
        (action: string, rows: BaseRowData[]) => {
            if (onBulkAction) {
                onBulkAction(action, rows as T[]);
            } else {
                console.log('Bulk action:', action, 'on rows:', rows);
            }
        },
        [onBulkAction],
    );

    if (isLoading && columns.length === 0) {
        return <DataTableInitialLoading />;
    }

    if (error) {
        return <DataTableError message={error.message} onRetry={() => fetchData(true)} />;
    }

    return (
        <div className="space-y-4">
            <DataTableToolbar
                table={table}
                filterOptions={filterOptions}
                bulkActions={bulkActions}
                selectedRows={selectedRows}
                onBulkAction={handleBulkAction}
                dataTableClass={dataTableClass}
                onExport={exportData}
                onRefreshFilters={fetchFilterOptions}
                fileName={fileName}
            />

            {isMobile ? (
                isLoading ? (
                    <TableLoading columnCount={table.getAllColumns().length} />
                ) : (
                    <MobileDataTable rows={table.getRowModel().rows} onRowClick={handleRowClick} onAction={onRowAction} />
                )
            ) : (
                <DesktopDataTable
                    table={table}
                    isLoading={isLoading}
                    onRowClick={handleRowClick}
                    onAction={onRowAction}
                    enableRowClick={enableRowClick}
                />
            )}

            <DataTablePagination table={table} />
        </div>
    );
}

export const DataTable = React.forwardRef(DataTableInner) as <T extends BaseRowData>(
    props: DataTableProps<T> & { ref?: React.Ref<DataTableRef> },
) => ReturnType<typeof DataTableInner>;
