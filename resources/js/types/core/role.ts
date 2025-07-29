// @/types/role.ts

import type { Permission } from './permission';

export interface Role {
    id: number;
    name: string;
    guard_name: string;
    module: string;
    description?: string | null;
    created_at?: string;
    updated_at?: string;
    permissions?: Permission[];
    [key: string]: unknown;
}

export interface RoleBasic {
    id: number;
    name: string;
    description?: string | null;
    guard_name: string;
    [key: string]: unknown;
}
