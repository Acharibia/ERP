// @/types/course.ts

import { ProgramBasic } from './program';

export type CourseDeliveryType = 'video' | 'document' | 'live';

export interface CourseMaterial {
    id: number;
    course_id: number;
    title: string;
    url: string | null;
    created_at: string;
    updated_at: string;
    file_url?: string | null;
    [key: string]: unknown;
}

export interface Course {
    id: number;
    program_id: number | null;
    title: string;
    description: string | null;
    created_at: string;
    updated_at: string;
    image_url?: string | null;
    program?: ProgramBasic | null;
    materials?: CourseMaterial[];
    [key: string]: unknown;
}

export interface CourseBasic {
    id: number;
    title: string;
    [key: string]: unknown;
}

export interface CourseFormData {
    program_id: string | number | null;
    title: string;
    description: string;
    image?: File | null;
    [key: string]: string | number | File | Blob | boolean | null | undefined | string[] | number[];
}

export interface CourseMaterialFormData {
    title: string;
    url?: string;
    file?: File | null;
    [key: string]: string | number | File | Blob | boolean | null | undefined | string[] | number[];
}
