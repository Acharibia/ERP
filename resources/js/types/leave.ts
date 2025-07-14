export type LeaveStatus = 'pending' | 'approved' | 'rejected' | 'cancelled' | 'ongoing' | 'completed';
export type LeaveTypeStatus = 'active' | 'inactive';
export type LeavePriority = 'low' | 'normal' | 'high' | 'urgent';

import type { EmployeeBasic } from './employee';

export interface LeaveType {
    id: number;
    name: string;
    code: string;
    description?: string;
    default_days: number;
    requires_approval: boolean;
    is_paid: boolean;
    can_carry_forward: boolean;
    max_carry_forward_days?: number;
    carry_forward_expiry_months?: number;
    status: LeaveTypeStatus;
    createdBy?: number;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string | null;
}

export interface LeaveTypeForm {
    [key: string]: string | boolean | number | undefined | null;
    name: string;
    code: string;
    description: string;
    default_days: string;
    requires_approval: boolean;
    is_paid: boolean;
    can_carry_forward: boolean;
    max_carry_forward_days: string;
    carry_forward_expiry_months: string;
}

export interface LeaveRequest {
    id: number;
    employee_id: number;
    employee: EmployeeBasic;
    leave_type_id: number;
    leave_type: LeaveType;
    start_date: string;
    end_date: string;
    total_days: number;
    reason?: string;
    status: LeaveStatus;
    reviewed_by?: number | null;
    reviewer?: EmployeeBasic | null;
    reviewed_at?: string | null;
    comment?: string | null;
    priority: LeavePriority;
    createdAt: string;
    updatedAt: string;
}
export interface LeaveRequestForm {
    [key: string]: string | number | null | boolean | undefined;
    employee_id: number;
    leave_type_id: number;
    start_date: string;
    end_date: string;
    reason?: string;
    priority: string;
    total_days: number | null;
}



export interface LeaveBalance {
    id: number;
    employeeId: number;
    leaveTypeId: number;
    year: number;
    entitledDays: number;
    usedDays: number;
    pendingDays: number;
    carriedOverDays: number;
    carriedDaysExpiry?: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface LeaveBasic {
    id: number;
    name: string;
    status: 'active' | 'inactive';
    [key: string]: unknown;
}

export interface LeaveTypeBasic {
    id: number;
    name: string;
    code: string;
    status: 'active' | 'inactive';
    [key: string]: unknown;
}

