// @/types/program.ts
export interface Program {
    id: number;
    title: string;
    description: string | null;
    created_at: string;
    updated_at: string;
    image_url?: string | null;
    [key: string]: unknown;
}

export interface ProgramBasic {
    id: number;
    title: string;
    [key: string]: unknown;
}

export interface ProgramFormData {
    title: string;
    description: string;
    image?: File | null;
    [key: string]: string | number | File | Blob | boolean | null | undefined | string[] | number[];
}
