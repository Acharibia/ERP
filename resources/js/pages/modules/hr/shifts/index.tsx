import { Head, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useRef } from 'react';

import { DataTable } from '@/components/shared/data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type ShiftBasic } from '@/types';
import { DataTableRef, ModuleDataTableRoutes } from '@/types/data-table';
// import DeleteShiftDialog, { DeleteShiftDialogRef } from './partials/delete-dialog';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/modules/hr/dashboard' },
    { title: 'Shifts', href: '/modules/hr/shifts' },
];

export default function Index() {
    const tableRef = useRef<DataTableRef>(null);
    // const deleteDialogRef = useRef<DeleteShiftDialogRef>(null);

    const handleRowAction = (action: string, row: ShiftBasic) => {
        switch (action) {
            case 'view':
                router.visit(route('modules.hr.shifts.show', { id: row.id }));
                break;
            case 'edit':
                router.visit(route('modules.hr.shifts.edit', { id: row.id }));
                break;
            case 'delete':
                // deleteDialogRef.current?.show(row);
                break;
            default:
                console.warn(`Unhandled action: ${action}`, row);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Shifts" />
            <PageHeader
                title="Shift Management"
                description="Manage work shifts, timings, and locations"
                action={
                    <Button onClick={() => router.visit(route('modules.hr.shifts.create'))} size="sm">
                        <Plus />
                        Add Shift
                    </Button>
                }
            />
            <Card>
                <CardHeader>
                    <CardTitle>Shifts</CardTitle>
                    <CardDescription>View and manage all work shifts</CardDescription>
                </CardHeader>
                <CardContent>
                    <DataTable
                        ref={tableRef}
                        dataTableClass="ShiftDataTable"
                        routes={ModuleDataTableRoutes}
                        fileName="Shifts"
                        onRowAction={handleRowAction}
                        preserveStateKey="hr-shifts-table"
                    />
                </CardContent>
            </Card>

            {/* <DeleteShiftDialog ref={deleteDialogRef} onDeleted={() => tableRef.current?.reload()} /> */}
        </AppLayout>
    );
}
