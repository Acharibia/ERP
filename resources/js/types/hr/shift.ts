// @/types/shift.ts

export interface Shift {
    id: number;
    name: string;
    start_time: string; // e.g., '08:00'
    end_time: string;   // e.g., '17:00'
    max_employees: number | null;
    location: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
}

export interface ShiftBasic {
    id: number;
    name: string;
    start_time: string;
    end_time: string;
    [key: string]: unknown;
}

export interface ShiftFormData {
    name: string;
    start_time: string;
    end_time: string;
    max_employees: string;
    location: string;
    [key: string]: string | number | File | Blob | boolean | null | undefined | string[] | number[];
}
