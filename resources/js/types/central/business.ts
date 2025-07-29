export interface Business {
    id: number;
    tenant_id: string;
    name: string;
    reseller_id: number;
    subscription_status: 'active' | 'trial' | 'suspended' | 'cancelled';
    environment?: 'production' | 'staging' | 'development';
    created_at?: string;
    updated_at?: string;
    [key: string]: unknown;
}
