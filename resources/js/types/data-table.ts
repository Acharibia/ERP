import { LucideIcon } from "lucide-react";

/**
 * DataTable column definition
 */
export interface DataTableColumn {
    data: string;
    name: string;
    title: string;
    visible: boolean;
    searchable: boolean;
    orderable: boolean;
    type: 'text' | 'badge' | 'date' | 'actions' | 'checkbox' | string;
    className?: string;
    colorMap?: Record<string, string>;
    dateFormat?: string;
    relationship?: string;
    relationField?: string;
    actions?: string[] | Record<string, unknown>[];
    badgeConfig?: Record<string, BadgeConfig>;
}

/**
 * Badge item for rendering badges in the table
 */
export interface Badge {
    label: string;
    value: string;
    color: string;
}

/**
 * Action item for rendering action buttons/links
 */
export interface Action {
    label: string;
    url: string;
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    confirm?: string;
    icon?: string;
}

/**
 * Filter option for dropdowns
 */
export interface FilterOption {
    label: string;
    value: string | number;
    icon?: string;
}

/**
 * Filter options grouped by column
 */
export type FilterOptions = Record<string, FilterOption[]>;

/**
 * Applied filters
 */
export type ColumnFilters = Record<string, string | string[] | number | number[] | null>;

/**
 * Sorting configuration
 */
export interface SortingState {
    id: string;
    desc: boolean;
}

/**
 * Pagination state
 */
export interface PaginationState {
    pageIndex: number;
    pageSize: number;
}

/**
 * Visibility state for columns
 */
export type VisibilityState = Record<string, boolean>;

/**
 * Column selection state
 */
export type RowSelection = Record<string, boolean>;

/**
 * Base row data interface
 * This is a minimal interface for row data, extend this for specific tables
 */
export interface BaseRowData {
    id: string | number;
    [key: string]: unknown;
}

/**
 * DataTable server response
 */
export interface DataTableResponse<T extends BaseRowData = BaseRowData> {
    draw: number;
    recordsTotal: number;
    recordsFiltered: number;
    data: T[];
    columns: DataTableColumn[];
    tableName: string;
    visibleColumns: string[];
    pagination: {
        page: number;
        pageSize: number;
        pageCount: number;
        total: number;
    };
    filterOptions: FilterOptions;
    bulkActions?: BulkAction[];
}

/**
 * DataTable request parameters
 */
export interface DataTableRequest {
    draw: number;
    start: number;
    length: number;
    search?: { value: string | null };
    filters?: ColumnFilters;
    sort?: SortingState[];
    columns?: {
        data: string;
        name: string;
        searchable: boolean;
        orderable: boolean;
    }[];
}

/**
 * DataTable state that can be preserved
 */
export interface DataTableState {
    pagination: PaginationState;
    sorting: SortingState[];
    columnFilters: ColumnFilters;
    columnVisibility: VisibilityState;
    rowSelection: RowSelection;
    globalFilter: string;
}



export const ModuleDataTableRoutes = {
    process: 'modules.hr.datatable.process',
    filterOptions: 'modules.hr.datatable.filter-options',
    export: 'modules.hr.datatable.export',
};


export interface DataTableRoutes {
    process: string;
    filterOptions?: string;
    export?: string;
}

export interface DataTableProps<T extends BaseRowData> {
    dataTableClass: string;
    routes: DataTableRoutes;
    onRowAction?: (action: string, row: T) => void;
    onBulkAction?: (action: string, rows: T[]) => void;
    enableRowClick?: boolean;
    preserveStateKey?: string;
    fileName?: string;
}

export type DataTableRef = {
    reload: () => void;
};


export type BulkAction = {
    label: string;
    value: string;
    icon?: LucideIcon;
    variant?: 'default' | 'destructive' | 'secondary' | 'outline';
};

export type BadgeConfig = {
    color: string;
    icon?: string;
};

export type BadgeColumnProps = {
    value: string;
    config: Record<string, BadgeConfig>;
};
