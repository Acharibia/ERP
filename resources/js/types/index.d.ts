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
    flash?: {
        success?: boolean;
        error?: string;
        message?: string;
        validation?: unknown;
      };
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
    activeBusiness?: Business | null;
    availableModules?: Module[];
    userBusinesses?: Business[];

}

/**
 * Package/subscription plan definition
 */
export type Package = {
    id: string;
    name: string;
    description: string;
    base_price: number;
    user_limit: number | null;
    storage_limit: number | null;
    modules: Array<{
        id: number;
        name: string;
        code: string;
        description: string;
    }>;
};

/**
 * Country data definition
 */
export type Country = {
    id: string;
    name: string;
    code: string;
    phone_code: string;
    is_active: boolean;
};

/**
 * State/province data definition
 */
export type State = {
    id: string;
    country_id: string;
    name: string;
    is_active: boolean;
};

/**
 * Title/prefix data definition (Mr., Mrs., Dr., etc.)
 */
export type Title = {
    id: string;
    name: string;
    abbreviation: string;
    is_active: boolean;
};

/**
 * Gender data definition
 */
export type Gender = {
    id: string;
    name: string;
    code: string;
    is_active: boolean;
};

/**
 * Industry data definition
 */
export type Industry = {
    id: string;
    name: string;
    code: string;
    description: string;
    parent_id: string | null;
    is_active: boolean;
};
