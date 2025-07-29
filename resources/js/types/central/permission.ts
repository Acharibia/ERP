// @/types/central/permission.ts

export interface Permission {
    id: number;
    name: string;
    guard_name: string;
    created_at?: string;
    updated_at?: string;
    [key: string]: unknown;
}

export interface PermissionBasic {
    id: number;
    name: string;
    guard_name: string;
    [key: string]: unknown;
}
