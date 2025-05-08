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
    RowSelection
} from '@/types/data-table'

interface UseDataTableProps<T extends BaseRowData> {
    dataTableClass: string
    initialState?: Partial<DataTableState>
    preserveStateKey?: string
    onDataLoaded?: (data: DataTableResponse<T>) => void
    onError?: (error: unknown) => void
}

export function useDataTable<T extends BaseRowData>({
    dataTableClass,
    initialState = {},
    preserveStateKey,
    onDataLoaded,
    onError
}: UseDataTableProps<T>) {
    // Generate a unique preservation key if not provided
    const stateKey = preserveStateKey || `datatable-${dataTableClass.toLowerCase()}`

    // Default initial state
    const defaultState = useMemo(() => ({
        pagination: { pageIndex: 0, pageSize: 10 },
        sorting: [],
        columnFilters: {},
        columnVisibility: {},
        rowSelection: {},
        globalFilter: ''
    }), [])

    // State management
    const [data, setData] = useState<T[]>([])
    const [columns, setColumns] = useState<DataTableColumn[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [totalRows, setTotalRows] = useState(0)
    const [filterOptions, setFilterOptions] = useState({})
    const [error, setError] = useState<Error | null>(null)
    const [lastFetchId, setLastFetchId] = useState<number>(0)

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
    const tableColumns = useMemo<ColumnDef<T>[]>(() => {
        return columns.map(column => ({
            id: column.data,
            accessorKey: column.data,
            header: column.title,
            enableSorting: column.orderable ?? true,
            enableHiding: true,
            meta: column
        }))
    }, [columns])

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
        if (!dataTableClass) return

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
                'search.value': currentGlobalFilter,
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

            const response = await axios.post(
                route('datatable.process', { dataTable: dataTableClass }),
                params
            )

            // Only process the response if it matches the latest request or forceFetch is true
            if (fetchId >= lastFetchId || forceFetch) {
                const datatableResponse = response.data as DataTableResponse<T>

                // Set the table data with the new data from the response
                setData(datatableResponse.data)
                setColumns(datatableResponse.columns)
                setTotalRows(datatableResponse.recordsFiltered) // This should now be the count AFTER filtering
                setFilterOptions(datatableResponse.filterOptions)

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
    }, [
        dataTableClass,
        stateKey,
        columns,
        lastFetchId,
        onDataLoaded,
        onError,
        tableState
    ])

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
            // Update state first to ensure correct pagination
            setTableState(prev => {
                // Compute the new pagination state
                const newPagination = typeof updater === 'function'
                    ? updater(prev.pagination)
                    : updater

                const newState = {
                    ...prev,
                    pagination: newPagination
                }

                // Persist to storage
                sessionStorage.setItem(stateKey, JSON.stringify(newState))

                // Trigger fetch immediately after state update
                setTimeout(() => fetchData(true), 0)

                return newState
            })
        },

        onSortingChange: (updater) => {
            updateState('sorting', updater as unknown as SortingState[])

            // Reset to first page when sorting changes
            updateState('pagination', {
                ...tableState.pagination,
                pageIndex: 0
            })

            setTimeout(() => fetchData(true), 0)
        },

        onColumnFiltersChange: (updater) => {
            const filters = {} as ColumnFilters
                ; (updater as ColumnFiltersState).forEach(filter => {
                    filters[filter.id] = filter.value as string | number | string[] | number[] | null
                })

            updateState('columnFilters', filters)

            // Reset to first page when filters change
            updateState('pagination', {
                ...tableState.pagination,
                pageIndex: 0
            })

            setTimeout(() => fetchData(true), 0)
        },

        onColumnVisibilityChange: (updater) => {
            updateState('columnVisibility', updater as unknown as VisibilityState)
        },

        onRowSelectionChange: (updater) => {
            updateState('rowSelection', updater as unknown as RowSelection)
        },

        onGlobalFilterChange: (updater) => {
            updateState('globalFilter', updater as unknown as string)

            // Reset to first page when global filter changes
            updateState('pagination', {
                ...tableState.pagination,
                pageIndex: 0
            })

            setTimeout(() => fetchData(true), 0)
        },
    })

    // Initial fetch on mount
    useEffect(() => {
        fetchData(true)
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
        error,
        fetchData,
        resetTable,
        tableState,
        setTableState,
        changePage
    }
}
