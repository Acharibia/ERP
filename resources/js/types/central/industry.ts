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
