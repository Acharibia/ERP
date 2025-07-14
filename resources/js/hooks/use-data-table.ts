import { useState, useEffect, useMemo, useCallback } from 'react'
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    ColumnDef,
    ColumnFiltersState,
} from '@tanstack/react-table'
import axios from 'axios';

import {
    BaseRowData,
    DataTableResponse,
    DataTableRequest,
    DataTableState,
    DataTableColumn,
    ColumnFilters,
    SortingState,
    VisibilityState,
    RowSelection,
    BulkAction,
    DataTableRoutes
} from '@/types/data-table'

export type TableColumnDef<T> = ColumnDef<T, unknown> & {
    meta: DataTableColumn;
};


interface UseDataTableProps<T extends BaseRowData> {
    dataTableClass: string
    routes: DataTableRoutes
    initialState?: Partial<DataTableState>
    preserveStateKey?: string
    onDataLoaded?: (data: DataTableResponse<T>) => void
    onError?: (error: unknown) => void
    fileName?: string;
}

export function useDataTable<T extends BaseRowData>({
    dataTableClass,
    routes,
    initialState = {},
    preserveStateKey,
    onDataLoaded,
    onError,
    fileName
}: UseDataTableProps<T>) {
    // Generate a unique preservation key if not provided
    const stateKey = preserveStateKey || `datatable-${dataTableClass.toLowerCase()}`

    const defaultState = useMemo(() => {
        return {
            pagination: { pageIndex: 0, pageSize: 10 },
            sorting: [],
            columnFilters: {},
            columnVisibility: {},
            rowSelection: {},
            globalFilter: ''
        };
    }, []);

    // State management
    const [data, setData] = useState<T[]>([])
    const [columns, setColumns] = useState<DataTableColumn[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [totalRows, setTotalRows] = useState(0)
    const [filterOptions, setFilterOptions] = useState({})
    const [error, setError] = useState<Error | null>(null)
    const [lastFetchId, setLastFetchId] = useState<number>(0)
    const [bulkActions, setBulkActions] = useState<BulkAction[]>([]);


    // Merge initial state with defaults and preserved state
    const [tableState, setTableState] = useState<DataTableState>(() => {
        // Check for preserved state in sessionStorage
        const preservedState = sessionStorage.getItem(stateKey)
        const initialPreservedState = preservedState
            ? JSON.parse(preservedState)
            : { ...defaultState, ...initialState }

        return initialPreservedState
    })

    // Convert DataTable columns to Tanstack columns
    const tableColumns = useMemo<ColumnDef<T, unknown>[]>(() => {
        return columns.map(column => ({
            id: column.data,
            accessorKey: column.data,
            enableSorting: column.orderable !== false,
            enableHiding: true,
            meta: column as DataTableColumn
        }));
    }, [columns]);


    // State update helpers with preservation
    const updateState = useCallback(<K extends keyof DataTableState>(
        key: K,
        value: DataTableState[K] | ((prevValue: DataTableState[K]) => DataTableState[K])
    ) => {
        setTableState(prev => {
            const newValue = typeof value === 'function'
                ? (value as (prevValue: DataTableState[K]) => DataTableState[K])(prev[key])
                : value

            const newState = {
                ...prev,
                [key]: newValue
            }

            // Preserve state in sessionStorage
            sessionStorage.setItem(stateKey, JSON.stringify(newState))

            return newState
        })
    }, [stateKey])

    // Fetch data from server using Axios
    const fetchData = useCallback(async (forceFetch = false) => {
        if (!dataTableClass || !routes.process) return

        setIsLoading(true)
        setError(null)

        // Generate a unique fetch ID to prevent race conditions
        const fetchId = Date.now()
        setLastFetchId(fetchId)

        try {
            // Get current pagination state directly from the updated state object
            // This ensures we always use the latest values
            const currentState = JSON.parse(sessionStorage.getItem(stateKey) || JSON.stringify(tableState))
            const currentPageIndex = currentState.pagination?.pageIndex ?? 0
            const currentPageSize = currentState.pagination?.pageSize ?? 10
            const currentGlobalFilter = currentState.globalFilter || ''
            const currentColumnFilters = currentState.columnFilters || {}
            const currentSorting = currentState.sorting || []

            // Prepare request parameters with all current filters
            const params: DataTableRequest = {
                draw: fetchId,
                start: currentPageIndex * currentPageSize,
                length: currentPageSize,
                search: { value: currentGlobalFilter },
                filters: Object.entries(currentColumnFilters)
                    .reduce<Record<string, string | string[]>>((acc, [key, value]) => {
                        if (value !== null && value !== undefined && value !== '') {
                            acc[key] = Array.isArray(value)
                                ? value.filter(v => v !== null && v !== undefined && v !== '').map(String)
                                : String(value)
                        }
                        return acc
                    }, {}),
                sort: currentSorting,
                columns: columns.map(col => ({
                    data: col.data,
                    name: col.name,
                    searchable: col.searchable ?? true,
                    orderable: col.orderable ?? true
                }))
            }

            // Use the provided route for processing
            const response = await axios.post(
                route(routes.process, { dataTable: dataTableClass }),
                params
            )

            // Only process the response if it matches the latest request or forceFetch is true
            if (fetchId >= lastFetchId || forceFetch) {
                const datatableResponse = response.data as DataTableResponse<T>

                // Set the table data with the new data from the response
                setData(datatableResponse.data)
                setColumns(datatableResponse.columns)
                setColumns(datatableResponse.columns)

                const visibility: Record<string, boolean> = {};
                datatableResponse.columns.forEach((column) => {
                    visibility[column.data] = column.visible !== false;
                });
                updateState('columnVisibility', visibility);

                setTotalRows(datatableResponse.recordsFiltered) // This should now be the count AFTER filtering
                setFilterOptions(datatableResponse.filterOptions)
                setBulkActions(datatableResponse.bulkActions || []);

                if (onDataLoaded) {
                    onDataLoaded(datatableResponse)
                }
            }
        } catch (err) {
            console.error('Error fetching data:', err)
            const errorMessage = err instanceof Error
                ? err
                : new Error('An error occurred while fetching data')

            setError(errorMessage)

            if (onError) {
                onError(err)
            }
        } finally {
            setIsLoading(false)
        }
    }, [dataTableClass, routes.process, stateKey, tableState, columns, lastFetchId, updateState, onDataLoaded, onError])

    // Fetch filter options (if route is provided)
    const fetchFilterOptions = useCallback(async () => {
        if (!routes.filterOptions || !dataTableClass) return

        try {
            const response = await axios.get(
                route(routes.filterOptions, { dataTable: dataTableClass })
            )
            setFilterOptions(response.data)
        } catch (err) {
            console.error('Error fetching filter options:', err)
        }
    }, [routes.filterOptions, dataTableClass])

    // Export data (if route is provided)
    const exportData = useCallback(async (format: string = 'csv') => {
        if (!routes.export) {
            console.warn('Export route not provided');
            return;
        }

        try {
            const currentState = JSON.parse(sessionStorage.getItem(stateKey) || JSON.stringify(tableState));

            const params = {
                class: dataTableClass,
                format,
                fileName, // your custom filename (from props)
                filters: currentState.columnFilters || {},
                globalFilter: currentState.globalFilter || '',
                sort: currentState.sorting || [],
            };

            const response = await axios.get(route(routes.export), {
                params,
                responseType: 'blob',
            });

            // ✅ Use the filename from props directly, with fallback
            const fallbackName = `${dataTableClass}-export.${format}`;
            const filenameBase = fileName || fallbackName.replace(/\.\w+$/, '');
            const filename = `${filenameBase}-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')}.${format}`;

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Error exporting data:', err);
            if (onError) {
                onError(err);
            }
        }
    }, [routes.export, dataTableClass, stateKey, tableState, onError, fileName]);


    // Create Tanstack table instance
    const table = useReactTable({
        data,
        columns: tableColumns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),

        // Manual server-side operations
        manualPagination: true,
        manualSorting: true,
        manualFiltering: true,

        pageCount: Math.max(1, Math.ceil(totalRows / tableState.pagination.pageSize)),

        // State management
        state: {
            pagination: tableState.pagination,
            sorting: tableState.sorting,
            columnFilters: Object.entries(tableState.columnFilters)
                .map(([id, value]) => ({ id, value })) as ColumnFiltersState,
            columnVisibility: tableState.columnVisibility,
            rowSelection: tableState.rowSelection,
            globalFilter: tableState.globalFilter,
        },

        // State update handlers
        onPaginationChange: (updater) => {
            setTableState(prev => {
                const newPagination = typeof updater === 'function'
                    ? updater(prev.pagination)
                    : updater
                const newState = {
                    ...prev,
                    pagination: newPagination
                }
                sessionStorage.setItem(stateKey, JSON.stringify(newState))
                return newState
            })
        },

        onSortingChange: (updater) => {
            updateState('sorting', updater as unknown as SortingState[])
            updateState('pagination', {
                ...tableState.pagination,
                pageIndex: 0
            })
        },

        onColumnFiltersChange: (updater) => {
            let filtersArray: ColumnFiltersState = [];

            if (typeof updater === 'function') {
                // updater is a function, call it with current filters
                filtersArray = updater(
                    Object.entries(tableState.columnFilters).map(([id, value]) => ({ id, value }))
                );
            } else if (Array.isArray(updater)) {
                // updater is already an array
                filtersArray = updater;
            } else if (typeof updater === 'object' && updater !== null) {
                // updater is an object (new TanStack Table behavior)
                filtersArray = Object.entries(updater).map(([id, value]) => ({ id, value }));
            }

            const filters = {} as ColumnFilters;
            filtersArray.forEach(filter => {
                filters[filter.id] = filter.value as string | number | string[] | number[] | null;
            });

            updateState('columnFilters', filters);
            updateState('pagination', {
                ...tableState.pagination,
                pageIndex: 0
            });
        },
        onColumnVisibilityChange: (updater) => {
            updateState('columnVisibility', updater as unknown as VisibilityState)
        },

        onRowSelectionChange: (updater) => {
            updateState('rowSelection', updater as unknown as RowSelection)
        },

        onGlobalFilterChange: (updater) => {
            updateState('globalFilter', updater as unknown as string)
            updateState('pagination', {
                ...tableState.pagination,
                pageIndex: 0
            })
        },
    })

    // Fetch data when pagination, sorting, filters, or global filter changes
    useEffect(() => {
        fetchData(true)
    }, [tableState.pagination, tableState.sorting, tableState.columnFilters, tableState.globalFilter])

    // Initial fetch on mount
    useEffect(() => {
        fetchData(true)
        // Also fetch filter options if route is available
        if (routes.filterOptions) {
            fetchFilterOptions()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Reset table to initial state
    const resetTable = useCallback(() => {
        const resetState = { ...defaultState }
        sessionStorage.removeItem(stateKey)
        setTableState(resetState)

        // Reset all table state
        table.resetColumnFilters()
        table.resetSorting()
        table.resetRowSelection()
        table.setPageIndex(0)
        table.resetGlobalFilter()

        // Fetch fresh data
        setTimeout(() => fetchData(true), 0)
    }, [table, stateKey, defaultState, fetchData])

    // Manually change page and fetch data
    const changePage = useCallback((newPage: number) => {
        updateState('pagination', {
            ...tableState.pagination,
            pageIndex: newPage
        })
        setTimeout(() => fetchData(true), 0)
    }, [tableState.pagination, updateState, fetchData])

    return {
        table,
        data,
        columns,
        isLoading,
        totalRows,
        filterOptions,
        bulkActions,
        error,
        fetchData,
        fetchFilterOptions,
        exportData,
        resetTable,
        tableState,
        setTableState,
        changePage,
        routes
    }
}
