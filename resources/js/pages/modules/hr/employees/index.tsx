import { Head, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useRef } from 'react';

import { DataTable } from '@/components/shared/data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type EmployeeBasic } from '@/types';
import { DataTableRef, ModuleDataTableRoutes } from '@/types/data-table';

import DeleteEmployeeDialog, { DeleteEmployeeDialogRef } from './partials/delete-dialog';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/modules/hr/dashboard' },
    { title: 'Employees', href: '/modules/hr/employees' },
];

export default function Index() {
    const tableRef = useRef<DataTableRef>(null);

    const deleteDialogRef = useRef<DeleteEmployeeDialogRef>(null);

    const handleRowAction = (action: string, row: EmployeeBasic) => {
        switch (action) {
            case 'view':
                router.visit(route('modules.hr.employees.show', { id: row.id }));
                break;
            case 'edit':
                router.visit(route('modules.hr.employees.edit', { id: row.id }));
                break;
            case 'access':
                router.visit(route('modules.hr.employees.access', { id: row.id }));
                break;
            case 'delete':
                deleteDialogRef.current?.show(row);
                break;
            default:
                console.warn(`Unhandled action: ${action}`, row);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Employees" />
            <PageHeader
                title="Employee Management"
                description="Manage your workforce, track employee data, and monitor organizational structure"
                action={
                    <Button onClick={() => router.visit(route('modules.hr.employees.create'))} size="sm">
                        <Plus />
                        Add Employee
                    </Button>
                }
            />
            <Card>
                <CardHeader>
                    <CardTitle>Employees</CardTitle>
                    <CardDescription>View and manage all employee records and organizational structure</CardDescription>
                </CardHeader>
                <CardContent>
                    <DataTable
                        ref={tableRef}
                        dataTableClass="EmployeeDataTable"
                        routes={ModuleDataTableRoutes}
                        fileName="Employees"
                        onRowAction={handleRowAction}
                        preserveStateKey="hr-employees-table"
                    />
                </CardContent>
            </Card>

            <DeleteEmployeeDialog ref={deleteDialogRef} onDeleted={() => tableRef.current?.reload()} />
        </AppLayout>
    );
}
