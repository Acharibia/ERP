// @/types/employee.ts

import { Department, Position, User, Country, State, Gender, MaritalStatus, EmploymentStatus, EmploymentType, DegreeType } from './index';

//
// 🎯 Primary Models
//

export interface Employee {
    id: number;
    user_id: number;
    employee_number: string;

    created_at: string;
    updated_at: string;
    deleted_at: string | null;

    // Relations
    user?: User | null;
    personal_info?: EmployeePersonalInfo | null;
    employment_info?: EmployeeEmploymentInfo | null;
    education?: EmployeeEducationInfo[];
    work_experience?: EmployeeWorkExperienceInfo[];
    emergency_contacts?: EmployeeEmergencyContactInfo[];
}

//
// 🧍 Personal Info
//

export interface EmployeePersonalInfo {
    id: number;
    employee_id: number;
    profile_picture: string;
    name: string;
    birth_date?: string;
    gender_id?: string;
    marital_status?: string;
    nationality?: string;
    national_id?: string;
    work_email?: string;
    personal_email: string;
    personal_phone?: string;
    work_phone?: string;
    address?: string;
    city?: string;
    state_id?: string;
    country_id?: string;
    postal_code?: string;

    state?: State | null;
    gender?: Gender | null;
    country?: Country | null;
    bio?: string;

    created_at: string;
    updated_at: string;
}

export interface EmployeePersonalInfoForm {
    [key: string]: string | undefined | File;
    employee_id?: string;
    name: string;
    birth_date?: string;
    gender_id?: string;
    marital_status?: string;
    nationality?: string;
    national_id?: string;
    personal_email: string;
    work_email?: string;
    personal_phone?: string;
    work_phone?: string;
    address?: string;
    city?: string;
    state_id?: string;
    country_id?: string;
    postal_code?: string;
    bio?: string;
    profile_picture?: File;
}




//
// 🧑‍💼 Employment Info
//

export interface EmployeeEmploymentInfo {
    id: number;
    employee_id: string;

    department_id?: string;
    position_id?: string;
    manager_id?: string;

    hire_date: string;
    termination_date?: string;
    termination_reason?: string;

    employment_status: string;
    employment_type: string;

    probation_start_date?: string;
    probation_end_date?: string;

    contract_start_date?: string;
    contract_end_date?: string;

    work_email: string;
    work_phone?: string;
    work_location?: string;
    bio?: string;

    department?: Department | null;
    position?: Position | null;
    manager?: EmployeeBasic | null;

    created_at: string;
    updated_at: string;
}

export interface EmployeeEmploymentInfoForm {
    [key: string]: string | undefined;
    department_id?: string;
    position_id?: string;
    manager_id?: string;

    hire_date: string;
    termination_date?: string;
    termination_reason?: string;
    work_location?: string;

    employment_status: string;
    employment_type: string;

    probation_start_date?: string;
    probation_end_date?: string;

    contract_start_date?: string;
    contract_end_date?: string;
}



//
// 🎓 Education
//

export interface EmployeeEducationInfo {
    id: number;
    employee_id: number;
    institution: string;
    country_id?: string;
    degree_type: string;
    field_of_study: string;
    start_date: string;
    end_date?: string;
    graduation_date?: string;
    is_completed: boolean;
    is_current: boolean;
    created_at: string;
    updated_at: string;
    country?: Country | null;
}

export interface EmployeeEducationForm {
    [key: string]: string | boolean | undefined;
    institution: string;
    country_id: string;
    degree_type: string;
    field_of_study: string;
    start_date: string;
    end_date: string;
    graduation_date: string;
    is_completed: boolean;
    is_current: boolean;
}


//
// 💼 Work Experience
//

export interface EmployeeWorkExperienceInfo {
    id: number;
    employee_id: number;

    company_name: string;
    job_title: string;

    start_date: string;
    end_date?: string;
    is_current: boolean;

    responsibilities?: string;
    achievements?: string;
    company_location?: string;

    reference_name?: string;
    reference_contact?: string;

    created_at: string;
    updated_at: string;
}

export interface EmployeeWorkExperienceForm {
    [key: string]: string | boolean | undefined;
    company_name: string;
    job_title: string;
    start_date: string;
    end_date: string;
    is_current: boolean;
    responsibilities: string;
    achievements: string;
    company_location: string;
    reference_name: string;
    reference_contact: string;
}

//
// 🚨 Emergency Contact
//

export interface EmployeeEmergencyContactInfo {
    id: number;
    employee_id: number;

    name: string;
    relationship: string;
    primary_phone: string;
    secondary_phone?: string;
    email?: string;

    address?: string;
    city?: string;
    state?: State;
    state_id?: string;
    postal_code?: string;
    country_id?: string;

    is_primary: boolean;
    notes?: string;

    country?: Country | null;

    created_at: string;
    updated_at: string;
}

export interface EmployeeEmergencyContactForm {
    [key: string]: string | boolean | undefined;
    name: string;
    relationship: string;
    primary_phone: string;
    secondary_phone: string;
    email: string;
    address: string;
    city: string;
    state_id: string;
    postal_code: string;
    country_id: string;
    is_primary: boolean;
    notes: string;
}


//
// 👤 Simplified View Types
//

export interface EmployeeBasic {
    id: number;
    name: string;
    employee_number: string;
    personalInfo?: {
        name?: string;
    };
    [key: string]: unknown;
}

export interface FormSectionProps<T> {
    data: T;
    setData: (field: keyof T, value: T[keyof T]) => void;
    errors: Partial<Record<keyof T, string>>;
}

export interface CreateEmployeeProps {
    departments: Department[];
    positions: Position[];
    employees: EmployeeBasic[];
    countries: Country[];
    states: State[];
    genders: Gender[];
    maritalStatuses: MaritalStatus[];
    employmentStatuses: EmploymentStatus[];
    employmentTypes: EmploymentType[];
    degreeTypes: DegreeType[];
    initialEmployeeData?: EmployeeFormData | null;
}


export interface EmployeeFormData {
    personal: EmployeePersonalInfoForm | EmployeePersonalInfo;
    employment: EmployeeEmploymentInfoForm | EmployeeEmploymentInfo;
    education: (EmployeeEducationForm | EmployeeEducationInfo)[];
    work_experience: (EmployeeWorkExperienceForm | EmployeeWorkExperienceInfo)[];
    emergency_contacts: (EmployeeEmergencyContactForm | EmployeeEmergencyContactInfo)[];
}


export interface ShowEmployeeProps {
    initialEmployeeData: {
        personal: EmployeePersonalInfo;
        employment: EmployeeEmploymentInfo;
        education: EmployeeEducationInfo[];
        work_experience: EmployeeWorkExperienceInfo[];
        emergency_contacts: EmployeeEmergencyContactInfo[];
    };
}

