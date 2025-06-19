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
import { BaseRowData, StaticHeader } from '@/types/data-table';
import { EmptyState } from '../empty-state';
import { Badge } from '../ui/badge';
import { Checkbox } from '../ui/checkbox';
import { DataTableColumnHeader } from './data-table-column-header';
import { DataTablePagination } from './data-table-pagination';
import { DataTableToolbar } from './data-table-toolbar';
import { TableLoading } from './table-loading';

// Fixed type for icon lookup
type LucideIcon = keyof typeof lucideIcons;

interface DataTableRoutes {
    process: string; // Route name for processing data
    filterOptions?: string; // Route name for getting filter options
    export?: string; // Route name for exporting data
}

interface DataTableProps<T extends BaseRowData> {
    dataTableClass: string;
    routes: DataTableRoutes;
    initialVisibility?: VisibilityState;
    onRowAction?: (action: string, row: T) => void;
    enableRowClick?: boolean;
    preserveStateKey?: string;
    staticHeaders?: StaticHeader[];
}

export function DataTable<T extends BaseRowData>({
    dataTableClass,
    routes,
    initialVisibility = {},
    onRowAction,
    enableRowClick = true,
    preserveStateKey,
    staticHeaders,
}: DataTableProps<T>) {
    // Use the data table hook with routes
    const { data, columns, isLoading, error, fetchData, filterOptions, exportData, fetchFilterOptions } = useDataTable<T>({
        dataTableClass,
        routes,
        preserveStateKey,
    });

    // Other table state
    const [rowSelection, setRowSelection] = React.useState({});
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = React.useState<SortingState>([]);

    // Create initial columns from staticHeaders if provided
    const getInitialColumns = React.useCallback(() => {
        if (!staticHeaders) return [];

        return staticHeaders.map((header) => ({
            data: header.key,
            name: header.key,
            title: header.title,
            visible: header.visible !== false,
            searchable: true,
            orderable: header.sortable !== false,
            type: header.type || 'text',
            className: header.className || null,
        }));
    }, [staticHeaders]);

    // Use either server columns or static headers as fallback
    const effectiveColumns = React.useMemo(() => {
        // If we have server columns, use those
        if (columns && columns.length > 0) {
            return columns;
        }

        // Otherwise, use static headers if available
        if (staticHeaders && staticHeaders.length > 0) {
            return getInitialColumns();
        }

        // No columns available
        return [];
    }, [columns, staticHeaders, getInitialColumns]);

    // Initialize column visibility based on effective columns
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});

    // Update visibility when effective columns change
    React.useEffect(() => {
        if (effectiveColumns && effectiveColumns.length > 0) {
            const visibilityState: VisibilityState = {};
            effectiveColumns.forEach((col) => {
                visibilityState[col.data] = col.visible !== false;
            });
            setColumnVisibility(visibilityState);
        }
    }, [effectiveColumns]);

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

    // Helper function to get value from row data
    const getRowValue = React.useCallback((row: any, columnKey: string) => {
        // For dot notation keys, access as flat key
        if (columnKey.includes('.')) {
            return row.original[columnKey];
        }
        // For regular keys, use TanStack's getValue
        return row.getValue(columnKey);
    }, []);

    // Convert server columns to Tanstack columns
    const tableColumns = React.useMemo<ColumnDef<T, unknown>[]>(
        () =>
            effectiveColumns.map((col) => {
                const hasDotNotation = col.data.includes('.');

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
                        // Use accessorFn for dot notation, accessorKey for regular columns
                        ...(hasDotNotation ? { accessorFn: (row: any) => row[col.data] } : { accessorKey: col.data }),
                        header: col.title,
                        cell: ({ row }) => {
                            const value = getRowValue(row, col.data) as string;

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
                    ...(hasDotNotation ? { accessorFn: (row: any) => row[col.data] } : { accessorKey: col.data }),
                    header: ({ column }) => <DataTableColumnHeader column={column} title={col.title} onSortChange={() => fetchData()} />,
                    meta: { title: col.title },
                    cell: ({ row }) => {
                        const value = getRowValue(row, col.data);
                        return <div className={col.className || ''}>{value as React.ReactNode}</div>;
                    },
                    enableSorting: col.orderable !== false,
                    enableHiding: true,
                };
            }),
        [effectiveColumns, handleAction, fetchData, getRowValue],
    );

    // Create table instance
    const table = useReactTable({
        data,
        columns: tableColumns,
        state: {
            sorting,
            columnVisibility,
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

    // Only show full loading if we don't have any columns at all (no static headers either)
    const shouldShowFullLoading = isLoading && effectiveColumns.length === 0;

    // Loading state component - only show full loading if we don't have any columns at all
    if (shouldShowFullLoading) {
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex flex-1 items-center space-x-2">
                        <div className="bg-muted h-8 w-[250px] animate-pulse rounded"></div>
                        <div className="bg-muted h-8 w-20 animate-pulse rounded"></div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="bg-muted h-8 w-16 animate-pulse rounded"></div>
                        <div className="bg-muted h-8 w-16 animate-pulse rounded"></div>
                    </div>
                </div>
                <div className="rounded-md border">
                    <div className="p-8 text-center">
                        <div className="flex items-center justify-center space-x-2">
                            <div className="border-primary h-6 w-6 animate-spin rounded-full border-b-2"></div>
                            <span className="text-muted-foreground">Loading table...</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Error state component
    if (error) {
        return (
            <div className="space-y-4">
                <div className="rounded-md border">
                    <div className="p-8 text-center">
                        <div className="text-red-500">
                            <lucideIcons.AlertCircle className="mx-auto mb-2 h-8 w-8" />
                            <p className="font-medium">Error loading table</p>
                            <p className="text-muted-foreground mt-1 text-sm">{error.message}</p>
                            <Button variant="outline" size="sm" onClick={() => fetchData(true)} className="mt-4">
                                <lucideIcons.RefreshCw className="mr-2 h-4 w-4" />
                                Retry
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <DataTableToolbar
                table={table}
                filterOptions={filterOptions}
                dataTableClass={dataTableClass}
                onExport={exportData}
                onRefreshFilters={fetchFilterOptions}
            />
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
                        {isLoading ? (
                            // Show skeleton loading in table body while keeping headers
                            <TableLoading columnCount={tableColumns.length} />
                        ) : table.getRowModel().rows?.length ? (
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
                                <TableCell colSpan={tableColumns.length} className="p-0">
                                    <EmptyState
                                        icon={lucideIcons.Search}
                                        iconSize="h-12 w-12"
                                        title="No results found"
                                        description="Try adjusting your search or filter criteria to find what you're looking for."
                                        className="py-8"
                                    />
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
