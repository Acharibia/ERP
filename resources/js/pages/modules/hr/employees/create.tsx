import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { PageHeader } from '@/components/ui/page-header';
import AppLayout from '@/layouts/app-layout';
import { CreateEmployeeProps } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import EmployeeForm from './partials/employee-form';

const breadcrumbs = [
    { title: 'Dashboard', href: '/modules/hr/dashboard' },
    { title: 'Employees', href: '/modules/hr/employees' },
    { title: 'Create', href: '/modules/hr/employees/create' },
];

export default function CreatePage({ initialEmployeeData, ...props }: CreateEmployeeProps) {
    const [showDraftDialog, setShowDraftDialog] = useState(!!initialEmployeeData);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Employee" />
            <PageHeader
                title="Create Employee"
                description="Fill out the form below to add a new employee, including their personal, employment, education, and emergency contact details."
            />
            <EmployeeForm mode="create" initialEmployeeData={initialEmployeeData} {...props} />

            <AlertDialog open={showDraftDialog} onOpenChange={setShowDraftDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Unfinished Form Found</AlertDialogTitle>
                        <AlertDialogDescription>
                            You have an unfinished employee form. Would you like to continue or start fresh?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setShowDraftDialog(false)}>Continue</AlertDialogCancel>
                        <AlertDialogAction onClick={() => router.visit(route('modules.hr.employees.discard-draft'))}>Start New</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
