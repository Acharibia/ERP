// @/types/attendance.ts

import type { EmployeeBasic } from './employee';
import type { ShiftBasic } from './shift';

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'half-day';
export type AttendanceSource = 'manual' | 'biometric' | 'mobile' | 'web';

export interface Attendance {
    id: number;
    employee_id: number;
    shift_id: number | null;
    attendance_date: string;
    clock_in: string | null;
    clock_out: string | null;
    total_hours: number | null;
    overtime_hours: number | null;
    status: AttendanceStatus | null;
    notes: string | null;
    source: AttendanceSource;
    created_at: string;
    updated_at: string;
    employee?: EmployeeBasic;
    shift?: ShiftBasic;
    [key: string]: unknown;
}

export interface AttendanceBasic {
    id: number;
    employee_id: number;
    shift_id: number | null;
    attendance_date: string;
    status: AttendanceStatus | null;
    employee?: EmployeeBasic;
    shift?: ShiftBasic;
    [key: string]: unknown;
}

export interface AttendanceFormData {
    employee_id: string;
    shift_id: string;
    attendance_date: string;
    clock_in: string;
    clock_out: string;
    total_hours: string;
    overtime_hours: string;
    status: AttendanceStatus | '';
    notes: string;
    source: AttendanceSource | '';
    [key: string]: string | number | File | Blob | boolean | null | undefined | string[] | number[];
}
