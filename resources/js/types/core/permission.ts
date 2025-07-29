// @/types/permission.ts

export interface Permission {
    id: number;
    name: string;
    module: string;
    description?: string | null;
    guard_name: string;
    created_at?: string;
    updated_at?: string;
    [key: string]: unknown;
}

export interface PermissionBasic {
    id: number;
    name: string;
    description?: string | null;
    guard_name: string;
    [key: string]: unknown;
}
