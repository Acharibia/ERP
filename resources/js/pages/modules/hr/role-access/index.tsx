import { DataTable } from '@/components/shared/data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { DataTableRef, ModuleDataTableRoutes } from '@/types/data-table';
import { RoleBasic } from '@/types/core/role';
import { Head, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useRef } from 'react';
import DeleteRoleDialog, { DeleteRoleDialogRef } from './partials/delete-dialog';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/modules/hr/dashboard' },
    { title: 'Role Access', href: '/modules/hr/role-access' },
];

export default function Index() {
    const tableRef = useRef<DataTableRef>(null); // Replace any with DataTableRef if available
    const deleteDialogRef = useRef<DeleteRoleDialogRef>(null);

    const handleRowAction = (action: string, row: RoleBasic) => {
        switch (action) {
            case 'view':
                router.visit(route('modules.hr.role-access.show', { id: row.id }));
                break;
            case 'edit':
                router.visit(route('modules.hr.role-access.edit', { id: row.id }));
                break;
            case 'delete':
                deleteDialogRef.current?.show(row);
                break;
            default:
                console.log(`Unhandled action: ${action}`, row);
        }
    };

    const handleBulkAction = (action: string, rows: RoleBasic[]) => {
        if (action === 'delete') {
            deleteDialogRef.current?.showMany(rows);
        } else {
            console.log(`Unknown bulk action: ${action}`, rows);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Access Control" />
            <PageHeader
                title="Access Control (Roles)"
                description="Manage and oversee all HR roles and permissions."
                action={
                    <Button onClick={() => router.visit(route('modules.hr.role-access.create'))} size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Role
                    </Button>
                }
            />
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-sm font-medium">Roles</CardTitle>
                        <CardDescription>View and manage all HR roles</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <DataTable
                        ref={tableRef}
                        dataTableClass="RoleAccessDataTable"
                        routes={ModuleDataTableRoutes}
                        fileName="Roles"
                        onRowAction={handleRowAction}
                        onBulkAction={handleBulkAction}
                        preserveStateKey="hr-roles-table"
                    />
                </CardContent>
            </Card>
            <DeleteRoleDialog ref={deleteDialogRef} onDeleted={() => tableRef.current?.reload()} />
        </AppLayout>
    );
}
