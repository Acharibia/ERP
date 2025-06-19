// @/types/position.ts
import { type StaticHeader } from '@/types/data-table';

export type PositionStatus = 'active' | 'inactive';
export type EmploymentType = 'full-time' | 'part-time' | 'contract' | 'intern';
export type PositionLevel = 'entry' | 'mid' | 'senior' | 'manager' | 'executive';

export interface Position {
    id: number;
    title: string;
    code: string;
    description: string | null;
    requirements: string | null;
    responsibilities: string | null;
    department_id: number | null;
    employment_type: EmploymentType;
    position_level: PositionLevel | null;
    min_salary: number | null;
    max_salary: number | null;
    status: PositionStatus;
    created_at: string;
    updated_at: string;
    employee_count?: number;
    salary_range?: string;
    department?: {
        id: number;
        name: string;
    } | null;
    employees?: Array<{
        id: number;
        name: string;
        email: string;
    }>;
    [key: string]: unknown;
}

export interface PositionBasic {
    id: number;
    title: string;
    code: string;
    status: PositionStatus;
    department_id?: number | null;
    [key: string]: unknown;
}

export interface PositionFormData {
    title: string;
    code: string;
    description: string;
    requirements: string;
    responsibilities: string;
    department_id: string;
    employment_type: EmploymentType;
    position_level: string;
    min_salary: string;
    max_salary: string;
    status: PositionStatus;
    [key: string]: string | number | File | Blob | boolean | null | undefined | string[] | number[];

}

export interface EmploymentTypeOption {
    id: string;
    name: string;
    value: string;
    [key: string]: unknown;
}

export interface PositionLevelOption {
    id: string;
    name: string;
    value: string;
    [key: string]: unknown;
}

export interface PositionWithDepartment extends PositionBasic {
    department?: {
        id: number;
        name: string;
    } | null;
    employee_count?: number;
    salary_range?: string;
}

// Static headers for Position DataTable
export const PositionStaticHeaders: StaticHeader[] = [
    {
        key: 'select',
        title: '',
        sortable: false,
        visible: true,
        type: 'checkbox',
    },
    {
        key: 'id',
        title: 'ID',
        sortable: true,
        className: 'font-medium',
        visible: false,
        type: 'text',
    },
    {
        key: 'title',
        title: 'Title',
        sortable: true,
        className: 'font-medium',
        type: 'text',
    },
    {
        key: 'department.name',
        title: 'Department',
        sortable: false,
        className: 'text-muted-foreground',
        type: 'text',
    },
    {
        key: 'employment_type',
        title: 'Type',
        sortable: true,
        className: 'capitalize',
        type: 'text',
    },
    {
        key: 'position_level',
        title: 'Level',
        sortable: true,
        className: 'capitalize',
        type: 'text',
    },

    {
        key: 'status',
        title: 'Status',
        sortable: true,
        type: 'badge',
    },
    {
        key: 'created_at',
        title: 'Created',
        sortable: true,
        type: 'date',
        className: 'text-sm text-muted-foreground',
    },
    {
        key: 'actions',
        title: 'Actions',
        sortable: false,
        type: 'actions',
    },
];
