import type { Config } from 'ziggy-js';
import { User, Business, Module } from '@/types';

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: User;
    ziggy: Config & { location: string };
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


export interface PageProps extends SharedData {
    activeBusiness?: Business | null;
    availableModules?: Module[];
    userBusinesses?: Business[];
}