import { DataTable } from '@/components/shared/data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import AppLayout from '@/layouts/app-layout';
import { PositionBasic, type BreadcrumbItem } from '@/types';
import { DataTableRef, ModuleDataTableRoutes } from '@/types/data-table';
import { Head, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useRef } from 'react';

import ActivatePositionDialog, { ActivatePositionDialogRef } from './partials/activate-dialog';
import DeactivatePositionDialog, { DeactivatePositionDialogRef } from './partials/deactivate-dialog';
import DeletePositionDialog, { DeletePositionDialogRef } from './partials/delete-dialog';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/modules/hr/dashboard' },
    { title: 'Positions', href: '/modules/hr/positions' },
];

export default function Index() {
    const tableRef = useRef<DataTableRef>(null);

    const deleteDialogRef = useRef<DeletePositionDialogRef>(null);
    const activateDialogRef = useRef<ActivatePositionDialogRef>(null);
    const deactivateDialogRef = useRef<DeactivatePositionDialogRef>(null);

    const handleRowAction = (action: string, row: PositionBasic) => {
        switch (action) {
            case 'view':
                router.visit(route('modules.hr.positions.show', { id: row.id }));
                break;
            case 'edit':
                router.visit(route('modules.hr.positions.edit', { id: row.id }));
                break;
            case 'delete':
                deleteDialogRef.current?.show(row);
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

    const handleBulkAction = (action: string, rows: PositionBasic[]) => {
        switch (action) {
            case 'activate':
                activateDialogRef.current?.showMany(rows);
                break;
            case 'deactivate':
                deactivateDialogRef.current?.showMany(rows);
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
            <Head title="Positions" />
            <PageHeader
                title="Position Management"
                description="Manage and oversee all job positions across the organization"
                action={
                    <Button onClick={() => router.visit(route('modules.hr.positions.create'))} size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Position
                    </Button>
                }
            />

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-sm font-medium">Positions</CardTitle>
                        <CardDescription>View and manage all job positions with salary ranges and requirements</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <DataTable
                        ref={tableRef}
                        dataTableClass="PositionDataTable"
                        routes={ModuleDataTableRoutes}
                        fileName="Positions"
                        onRowAction={handleRowAction}
                        onBulkAction={handleBulkAction}
                        preserveStateKey="hr-positions-table"
                    />
                </CardContent>
            </Card>

            <DeletePositionDialog ref={deleteDialogRef} onDeleted={() => tableRef.current?.reload()} />
            <ActivatePositionDialog ref={activateDialogRef} onActivated={() => tableRef.current?.reload()} />
            <DeactivatePositionDialog ref={deactivateDialogRef} onDeactivated={() => tableRef.current?.reload()} />
        </AppLayout>
    );
}
