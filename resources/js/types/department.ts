// @/types/department.d.ts
import { Employee, EmployeeBasic } from './employee';
import { type StaticHeader } from '@/types/data-table';

export type DepartmentPerformance = 'excellent' | 'good' | 'average' | 'needs_attention';
export type DepartmentStatus = 'active' | 'inactive';


export interface Department {
    id: number;
    name: string;
    email: string | null;
    code: string | null;
    description: string | null;
    parent_id: number | null;
    manager_id: number | null;
    budget: number | null;
    cost_center: string | null;
    location: string | null;
    status: DepartmentStatus;
    created_at: string;
    updated_at: string;
    employee_count?: number;
    gender_breakdown?: {
        male: number;
        female: number;
    };
    open_positions?: number;
    budget_utilized?: number;
    performance?: DepartmentPerformance;
    manager?: EmployeeBasic | null;
    employees?: Employee[];
    parent?: Department | null;
    children?: Department[];
    [key: string]: unknown;
}

export interface DepartmentBasic {
    id: number;
    name: string;
    code: string | null;
    status: DepartmentStatus;
    [key: string]: unknown;
}

export interface DepartmentFormData {
    name: string;
    email: string;
    code: string;
    description: string;
    parent_id: string;
    manager_id: string;
    budget: string;
    cost_center: string;
    location: string;
    status: DepartmentStatus;
    [key: string]: string | number | File | Blob | boolean | null | undefined | string[] | number[];
}

export interface DepartmentWithManager extends DepartmentBasic {
    manager?: {
        id: number;
        name: string;
    } | null;
    employee_count?: number;
    location?: string;
}

// Static headers for Department DataTable
export const DepartmentStaticHeaders: StaticHeader[] = [
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
        visible: false, // Hidden by default as per DataTable
        type: 'text',
    },
    {
        key: 'name',
        title: 'Name',
        sortable: true,
        className: 'font-medium',
        type: 'text',
    },
    {
        key: 'description',
        title: 'Description',
        sortable: true,
        className: 'text-muted-foreground',
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
        title: 'Date Created',
        sortable: true,
        type: 'date',
        className: 'text-sm text-muted-foreground',
    },
    {
        key: 'actions',
        title: 'Actions',
        sortable: false,
        type: 'actions',
        className: 'w-[70px]',
    },
];
