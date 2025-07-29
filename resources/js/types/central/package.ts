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
