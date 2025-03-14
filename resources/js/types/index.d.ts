// @/types/index.ts
import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    url: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    // Add the session variables we need for layout switching
    activeAccessType?: 'admin' | 'reseller' | 'module' | null;
    activeModuleCode?: string | null;
    activeBusinessId?: number | null;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    user_type?: 'system_admin' | 'reseller' | 'business_user';
    [key: string]: unknown; // This allows for additional properties
}

// Business entity type
export interface Business {
    id: number;
    tenant_id: string;
    name: string;
    reseller_id: number;
    subscription_status: 'active' | 'trial' | 'suspended' | 'cancelled';
    environment?: 'production' | 'staging' | 'development';
    created_at?: string;
    updated_at?: string;
    [key: string]: unknown; // Allow for additional properties
}

// Module entity type
export interface Module {
    id: number;
    name: string;
    code: string;
    description?: string;
    version?: string;
    is_core?: boolean;
    status?: 'active' | 'inactive' | 'deprecated';
    icon_url?: string;
    created_at?: string;
    updated_at?: string;
    [key: string]: unknown; // Allow for additional properties
}

export interface PageProps extends SharedData {
    currentBusiness?: Business | null;
    userBusinesses?: Business[];
    availableModules?: Module[];
}
