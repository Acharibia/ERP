// @/types/shift-preference.ts

import type { EmployeeBasic } from './employee';
import type { ShiftBasic } from './shift';

export type DayOfWeek = '' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export const daysOfWeek: DayOfWeek[] = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export interface ShiftPreference {
    id: number;
    employee_id: number;
    shift_id: number;
    is_available: boolean;
    preference_level: number | null;
    is_mandatory: boolean;
    day_of_week: DayOfWeek;
    created_at: string;
    updated_at: string;
    employee?: EmployeeBasic;
    shift?: ShiftBasic;
    [key: string]: unknown;
}

export interface ShiftPreferenceBasic {
    id: number;
    employee_id: number;
    shift_id: number;
    is_available: boolean;
    preference_level: number | null;
    is_mandatory: boolean;
    day_of_week: DayOfWeek;
    employee?: EmployeeBasic;
    shift?: ShiftBasic;
    [key: string]: unknown;
}

export interface ShiftPreferenceFormData {
    employee_id: string;
    shift_id: string;
    is_available: boolean;
    preference_level: string;
    is_mandatory: boolean;
    day_of_week: DayOfWeek;
    [key: string]: string | number | File | Blob | boolean | null | undefined | string[] | number[];
}
