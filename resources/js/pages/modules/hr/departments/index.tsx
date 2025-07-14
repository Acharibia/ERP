import { DataTable } from '@/components/shared/data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import AppLayout from '@/layouts/app-layout';
import { DepartmentBasic, type BreadcrumbItem } from '@/types';
import { DataTableRef, ModuleDataTableRoutes } from '@/types/data-table';
import { Head, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useRef } from 'react';
import ActivateDepartmentDialog, { ActivateDepartmentDialogRef } from './partials/activate-dialog';
import DeactivateDepartmentDialog, { DeactivateDepartmentDialogRef } from './partials/deactivate-dialog';
import DeleteDepartmentDialog, { DeleteDepartmentDialogRef } from './partials/delete-dialog';
import SuspendDepartmentDialog, { SuspendDepartmentDialogRef } from './partials/suspend-dialog';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/modules/hr/dashboard' },
    { title: 'Departments', href: '/modules/hr/departments' },
];

export default function Index() {
    const tableRef = useRef<DataTableRef>(null);

    const deleteDialogRef = useRef<DeleteDepartmentDialogRef>(null);
    const suspendDialogRef = useRef<SuspendDepartmentDialogRef>(null);
    const activateDialogRef = useRef<ActivateDepartmentDialogRef>(null);
    const deactivateDialogRef = useRef<DeactivateDepartmentDialogRef>(null);
    const handleRowAction = (action: string, row: DepartmentBasic) => {
        switch (action) {
            case 'view':
                router.visit(route('modules.hr.departments.show', { id: row.id }));
                break;
            case 'edit':
                router.visit(route('modules.hr.departments.edit', { id: row.id }));
                break;
            case 'delete':
                deleteDialogRef.current?.show(row);
                break;
            case 'suspend':
                suspendDialogRef.current?.show(row);
                break;
            case 'activate':
                activateDialogRef.current?.show(row);
                break;
            case 'deactivate':
                deactivateDialogRef.current?.show(row);
                break;
            default:
                console.log(`Unhandled action: ${action}`, row);
        }
    };

    const handleBulkAction = (action: string, rows: DepartmentBasic[]) => {
        switch (action) {
            case 'activate':
                activateDialogRef.current?.showMany(rows);
                break;
            case 'deactivate':
                deactivateDialogRef.current?.showMany(rows);
                break;
            case 'suspend':
                suspendDialogRef.current?.showMany(rows);
                break;
            case 'delete':
                deleteDialogRef.current?.showMany(rows);
                break;
            default:
                console.log(`Unknown bulk action: ${action}`, rows);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Departments" />
            <PageHeader
                title="Department Management"
                description="Manage and oversee all departments across the organization"
                action={
                    <Button onClick={() => router.visit(route('modules.hr.departments.create'))} size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Department
                    </Button>
                }
            />

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-sm font-medium">Departments</CardTitle>
                        <CardDescription>View and manage all departments records and organizational structure</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <DataTable
                        ref={tableRef}
                        dataTableClass="DepartmentDataTable"
                        routes={ModuleDataTableRoutes}
                        fileName="Departments"
                        onRowAction={handleRowAction}
                        onBulkAction={handleBulkAction}
                        preserveStateKey="hr-departments-table"
                    />
                </CardContent>
            </Card>
            <DeleteDepartmentDialog ref={deleteDialogRef} onDeleted={() => tableRef.current?.reload()} />
            <SuspendDepartmentDialog ref={suspendDialogRef} onSuspended={() => tableRef.current?.reload()} />
            <ActivateDepartmentDialog ref={activateDialogRef} onActivated={() => tableRef.current?.reload()} />
            <DeactivateDepartmentDialog ref={deactivateDialogRef} onDeactivated={() => tableRef.current?.reload()} />
        </AppLayout>
    );
}
