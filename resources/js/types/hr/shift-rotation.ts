// @/types/shift-rotation.ts

import type { ShiftBasic } from './shift';

export type ShiftRotationFrequency = 'daily' | 'weekly' | 'bi-weekly' | 'monthly' | 'quarterly' | 'yearly' | 'custom';
export type ShiftRotationStatus = 'active' | 'inactive';
export type ShiftRotationPriority = 'high' | 'medium' | 'low';

export interface ShiftRotation {
    id: number;
    employee_id?: number | null;
    department_ids?: number[];
    position_ids?: number[];
    role_ids?: number[];
    shift_id?: number | null;
    start_date: string;
    end_date?: string | null;
    frequency: ShiftRotationFrequency;
    interval: number;
    status: ShiftRotationStatus;
    duration_days?: number | null;
    is_recurring: boolean;
    priority?: ShiftRotationPriority | null;
    created_at?: string;
    updated_at?: string;
    shift?: ShiftBasic;
    [key: string]: unknown;
}

export interface ShiftRotationFormData {
    start_date: string;
    end_date?: string;
    frequency: ShiftRotationFrequency;
    interval: number;
    duration_days?: number;
    shift_id: string;
    employee_ids: number[];
    department_ids: number[];
    position_ids: number[];
    role_ids: number[];
    priority?: ShiftRotationPriority;
    is_recurring: boolean;
    [key: string]: string | number | File | Blob | boolean | null | undefined | string[] | number[];
}
