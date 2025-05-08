import { Country, Gender, Industry, Package, State, Title } from '@/types';
import { LucideIcon } from 'lucide-react';


/**
 * Form data for business registration
 */
export type BusinessRegisterForm = {
    name: string; // Business name
    registration_number: string; // Business registration number
    email: string; // Business email
    phone: string; // Business phone
    website: string; // Business website
    address_line_1: string; // Address line 1
    address_line_2: string; // Address line 2
    city: string; // City
    state_id: string; // State/Province
    postal_code: string; // Postal/ZIP code
    country_id: string; // Country
    industry_id: string; // Industry selection
    contact_name: string; // Primary contact name
    contact_email: string; // Primary contact email
    password: string; // Account password
    password_confirmation: string; // Password confirmation
    package_id: string; // Selected package/plan
    billing_cycle: string; // monthly or annual
    start_trial: boolean; // Whether to start with a free trial
    step: number;
    general?: string;
};

/**
 * Step definition for multi-step form
 */
export type FormStep = {
    step: number;
    title: string;
    description: string;
    icon?: LucideIcon;

};

/**
 * Props for the RegisterBusiness component
 */
export interface RegisterBusinessProps {
    packages: {
        data: Package[];
    };
    countries: Country[];
    states: State[];
    titles: Title[];
    genders: Gender[];
    industries: Industry[];
}
