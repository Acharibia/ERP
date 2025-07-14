import { PageHeader } from '@/components/ui/page-header';
import AppLayout from '@/layouts/app-layout';
import { CreateEmployeeProps } from '@/types';
import { Head } from '@inertiajs/react';
import EmployeeForm from './partials/employee-form';

const breadcrumbs = [
    { title: 'Dashboard', href: '/modules/hr/dashboard' },
    { title: 'Employees', href: '/modules/hr/employees' },
    { title: 'Edit', href: '/modules/hr/employees/edit' },
];

export default function EditPage(props: CreateEmployeeProps) {
    const employeeName = props.initialEmployeeData?.personal?.name || 'Employee';
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${employeeName}`} />
            <PageHeader
                title={`Edit ${employeeName}`}
                description="Update employee details including personal info, employment status, education, and more."
            />
            <EmployeeForm mode="edit" {...props} />
        </AppLayout>
    );
}
