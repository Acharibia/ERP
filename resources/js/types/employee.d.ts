// @/types/employee.d.ts

import { Department, Position, User } from './index';

// Employee employment status enum
export type EmploymentStatus = 'active' | 'inactive' | 'on_leave' | 'terminated' | 'probation';

// Employee employment type enum
export type EmploymentType = 'full_time' | 'part_time' | 'contract' | 'temporary' | 'intern';

// Employee gender enum
export type Gender = 'male' | 'female' | 'other' | 'prefer_not_to_say';

// Marital status enum
export type MaritalStatus = 'single' | 'married' | 'divorced' | 'widowed' | 'separated' | 'other';

// Full Employee interface based on the Laravel model
export interface Employee {
    // Primary key
    id: number;

    // User & Employee Identification
    user_id: number;
    employee_id: string;
    name: string;

    // Contact Information
    work_email: string;
    personal_email: string;
    work_phone: string | null;
    personal_phone: string | null;

    // Personal Information
    birth_date: string | null; // ISO date string
    gender: Gender | null;
    marital_status: MaritalStatus | null;
    nationality: string | null;

    // Address Information
    address: string | null;
    city: string | null;
    state_id: string | null;
    postal_code: string | null;
    country_id: string | null;

    // Employment Dates
    hire_date: string; // ISO date string
    termination_date: string | null; // ISO date string
    termination_reason: string | null;

    // Organizational Structure
    department_id: number | null;
    position_id: number | null;
    manager_id: number | null;

    // Employment Details
    employment_status: EmploymentStatus;
    employment_type: EmploymentType;
    work_location: string | null;

    // Additional Information
    bio: string | null;

    // System Fields
    is_active: boolean;

    // Laravel timestamps
    created_at: string;
    updated_at: string;
    deleted_at: string | null; // Soft deletes

    // Relationships (loaded when eager loaded)
    department?: Department | null;
    manager?: Employee | null;
    direct_reports?: Employee[]; // If hasMany relationship loaded
    user?: User | null; // If user relationship loaded
    position?: Position | null; // If position relationship loaded

    // Computed attributes (if implemented)
    full_name?: string;
    years_of_service?: number;
    age?: number | null;
    primary_email?: string;
    primary_phone?: string;
    display_name?: string;
    employment_status_badge?: {
        label: string;
        color: string;
    };
    employment_type_badge?: {
        label: string;
        color: string;
    };
}

// Simplified Employee interface for dropdowns and basic listings
export interface EmployeeBasic {
    id: number;
    name: string;
    employee_id: string;
    work_email: string;
    department_id: number | null;
    employment_status: EmploymentStatus;
    employment_type: EmploymentType;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

// Employee interface for form creation/editing
export interface EmployeeFormData {
    user_id?: number;
    employee_id: string;
    name: string;
    work_email: string;
    personal_email: string;
    work_phone?: string;
    personal_phone?: string;
    birth_date?: string;
    gender?: Gender;
    marital_status?: MaritalStatus;
    nationality?: string;
    address?: string;
    city?: string;
    state_id?: string;
    postal_code?: string;
    country_id?: string;
    hire_date: string;
    termination_date?: string;
    termination_reason?: string;
    department_id?: number;
    position_id?: number;
    manager_id?: number;
    employment_status: EmploymentStatus;
    employment_type: EmploymentType;
    work_location?: string;
    bio?: string;
    is_active: boolean;
}

// Employee for dropdown selections (minimal data)
export interface EmployeeOption {
    id: number;
    name: string;
    employee_id: string;
    department_id: number | null;

    [key: string]: unknown;
}

// Employee with department info for listings
export interface EmployeeWithDepartment extends EmployeeBasic {
    department?: {
        id: number;
        name: string;
        code: string;
    } | null;
}

