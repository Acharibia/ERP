// @/types/schedule.ts

import type { EmployeeBasic } from './employee';
import type { ShiftBasic } from './shift';

export type ScheduleType = 'standard' | 'shift' | 'flexible' | 'off';

export interface Schedule {
    id: number;
    employee_id: number;
    date: string; // e.g., '2024-07-01'
    shift_id: number | null;
    start_time: string | null;
    end_time: string | null;
    schedule_type: ScheduleType;
    is_remote: boolean;
    location: string | null;
    notes: string | null;
    expected_hours: number | null;
    created_at: string;
    updated_at: string;
    employee?: EmployeeBasic;
    shift?: ShiftBasic;
    [key: string]: unknown;
}

export interface ScheduleBasic {
    id: number;
    employee_id: number;
    date: string;
    shift_id: number | null;
    schedule_type: ScheduleType;
    employee?: EmployeeBasic;
    shift?: ShiftBasic;
    [key: string]: unknown;
}

export interface ScheduleFormData {
    employee_id: string;
    date: string;
    shift_id: string;
    start_time: string;
    end_time: string;
    schedule_type: ScheduleType;
    is_remote: boolean;
    location: string;
    notes: string;
    expected_hours: string;
    [key: string]: string | number | File | Blob | boolean | null | undefined | string[] | number[];
}
