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
    [key: string]: unknown;
}
