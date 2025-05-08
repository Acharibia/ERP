'use client';

import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import * as lucideIcons from 'lucide-react';

import { useDataTable } from '@/hooks/use-data-table';
import { BaseRowData } from '@/types/data-table';
import { Badge } from '../ui/badge';
import { Checkbox } from '../ui/checkbox';
import { DataTableColumnHeader } from './data-table-column-header';
import { DataTablePagination } from './data-table-pagination';
import { DataTableToolbar } from './data-table-toolbar';

// Fixed type for icon lookup
type LucideIcon = keyof typeof lucideIcons;

interface DataTableProps<T extends BaseRowData> {
    dataTableClass: string;
    initialVisibility?: VisibilityState;
    onRowAction?: (action: string, row: T) => void;
    enableRowClick?: boolean;
}

export function DataTable<T extends BaseRowData>({ dataTableClass, initialVisibility = {}, onRowAction, enableRowClick = true }: DataTableProps<T>) {
    // Use the data table hook
    const { data, columns, isLoading, error, fetchData, filterOptions } = useDataTable<T>({
        dataTableClass,
    });

    // Other table state
    const [rowSelection, setRowSelection] = React.useState({});
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = React.useState<SortingState>([]);

    // Initialize column visibility based on server columns
    // This will re-initialize whenever columns change (after data fetch)
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});

    // Update visibility when columns change from server
    React.useEffect(() => {
        if (columns && columns.length > 0) {
            const visibilityState: VisibilityState = {};
            columns.forEach((col) => {
                visibilityState[col.data] = col.visible !== false;
            });
            setColumnVisibility(visibilityState);
        }
    }, [columns]);

    // Handle row actions
    const handleAction = React.useCallback(
        (actionName: string, rowData: T) => {
            if (onRowAction) {
                onRowAction(actionName, rowData);
            } else {
                console.log(`Action '${actionName}' on row`, rowData);
            }
        },
        [onRowAction],
    );

    // Handle row click for view action
    const handleRowClick = React.useCallback(
        (rowData: T) => {
            if (enableRowClick && onRowAction) {
                onRowAction('view', rowData);
            }
        },
        [enableRowClick, onRowAction],
    );

    // Convert server columns to Tanstack columns
    const tableColumns = React.useMemo<ColumnDef<T, unknown>[]>(
        () =>
            columns.map((col) => {
                // Special handling for select column
                if (col.data === 'select') {
                    return {
                        id: 'select',
                        header: ({ table }) => (
                            <Checkbox
                                checked={table.getIsAllPageRowsSelected()}
                                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                                aria-label="Select all"
                            />
                        ),
                        cell: ({ row }) => (
                            <Checkbox
                                checked={row.getIsSelected()}
                                onCheckedChange={(value) => {
                                    row.toggleSelected(!!value);
                                    // Stop propagation to prevent row click when checkbox is clicked
                                    event?.stopPropagation();
                                }}
                                aria-label="Select row"
                                onClick={(e) => e.stopPropagation()}
                            />
                        ),
                        enableSorting: false,
                        enableHiding: false,
                    };
                }

                // Handle action column
                if (col.type === 'actions') {
                    return {
                        id: col.data,
                        header: col.title,
                        cell: ({ row }) => {
                            // Get actions from the column configuration
                            const availableActions: { name: string; icon?: string }[] =
                                Array.isArray(col.actions) && col.actions.every((action) => typeof action === 'object' && 'name' in action)
                                    ? (col.actions as { name: string; icon?: string }[])
                                    : [];

                            return (
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="" asChild>
                                        <Button
                                            variant="ghost"
                                            className="h-8 w-8 p-0"
                                            onClick={(e) => e.stopPropagation()} // Prevent row click
                                        >
                                            <lucideIcons.MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                                        {availableActions.map((action: { name: string; icon?: string }) => {
                                            // Type-safe icon resolution
                                            const IconComponent =
                                                action.icon && lucideIcons[action.icon as LucideIcon]
                                                    ? lucideIcons[action.icon as LucideIcon]
                                                    : lucideIcons.MoreHorizontal;

                                            return (
                                                <DropdownMenuItem
                                                    key={action.name}
                                                    onSelect={() => handleAction(action.name, row.original)}
                                                    className={action.name === 'delete' ? 'text-destructive' : ''}
                                                >
                                                    {React.createElement(IconComponent, { className: 'mr-2 h-4 w-4' })}
                                                    {action.name.charAt(0).toUpperCase() + action.name.slice(1)}
                                                </DropdownMenuItem>
                                            );
                                        })}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            );
                        },
                        enableSorting: false,
                        enableHiding: false,
                    };
                }

                // For badge column
                if (col.type === 'badge') {
                    return {
                        id: col.data,
                        accessorKey: col.data,
                        header: col.title,
                        cell: ({ row }) => {
                            const value = row.getValue(col.data) as string;

                            // Support both old and new format
                            const badgeConfig = col.badgeConfig || {};

                            // Default configuration
                            let variant = 'default';
                            let icon = null;

                            // Check if we have a config for this value
                            if (badgeConfig[value]) {
                                if (typeof badgeConfig[value] === 'string') {
                                    // Old format: simple color string
                                    variant = badgeConfig[value] as string;
                                } else {
                                    // New format: { color, icon }
                                    variant = badgeConfig[value].color || 'default';
                                    icon = badgeConfig[value].icon || null;
                                }
                            } else if (badgeConfig.default) {
                                // Use default if specific value not found
                                if (typeof badgeConfig.default === 'string') {
                                    variant = badgeConfig.default as string;
                                } else {
                                    variant = badgeConfig.default.color || 'default';
                                    icon = badgeConfig.default.icon || null;
                                }
                            }

                            // Use the imported lucideIcons
                            const IconComponent = icon ? lucideIcons[icon as keyof typeof lucideIcons] : null;

                            return (
                                <Badge variant={variant as 'default' | 'secondary' | 'destructive' | 'outline'}>
                                    {IconComponent && <IconComponent className="mr-1 h-3 w-3" />}
                                    {value as React.ReactNode}
                                </Badge>
                            );
                        },
                        enableSorting: col.orderable !== false,
                        enableHiding: true,
                    };
                }

                // Default column handling
                return {
                    id: col.data,
                    accessorKey: col.data,
                    header: ({ column }) => <DataTableColumnHeader column={column} title={col.title} onSortChange={() => fetchData()} />,
                    meta: { title: col.title },
                    cell: ({ row }) => {
                        const value = row.getValue(col.data);
                        return <div className={col.className || ''}>{value as React.ReactNode}</div>;
                    },
                    enableSorting: col.orderable !== false,
                    enableHiding: true,
                };
            }),
        [columns, handleAction, fetchData],
    );

    // Create table instance
    const table = useReactTable({
        data,
        columns: tableColumns,
        state: {
            sorting,
            columnVisibility, // Use our state that's initialized from server config
            rowSelection,
            columnFilters,
        },
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onSortingChange: (newSorting) => {
            setSorting(newSorting);
            // Trigger fetch after sort change if needed
            fetchData();
        },
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
    });

    // Loading state component
    if (isLoading) {
        return <div className="p-4 text-center">Loading...</div>;
    }

    // Error state component
    if (error) {
        return <div className="p-4 text-center text-red-500">Error: {error.message}</div>;
    }

    return (
        <div className="space-y-4">
            <DataTableToolbar table={table} filterOptions={filterOptions} dataTableClass={dataTableClass} />
            <div className="rounded-md border">
                <Table className="table-auto">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} colSpan={header.colSpan}>
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && 'selected'}
                                    onClick={() => handleRowClick(row.original)}
                                    className={enableRowClick ? 'hover:bg-muted/50 cursor-pointer' : ''}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={tableColumns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <DataTablePagination table={table} />
        </div>
    );
}
