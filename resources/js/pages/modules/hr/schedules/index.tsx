import { Head, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useRef } from 'react';

import { DataTable } from '@/components/shared/data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type ScheduleBasic } from '@/types';
import { DataTableRef, ModuleDataTableRoutes } from '@/types/data-table';
// import DeleteScheduleDialog, { DeleteScheduleDialogRef } from './partials/delete-dialog';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/modules/hr/dashboard' },
    { title: 'Schedules', href: '/modules/hr/schedules' },
];

export default function Index() {
    const tableRef = useRef<DataTableRef>(null);
    // const deleteDialogRef = useRef<DeleteScheduleDialogRef>(null);

    const handleRowAction = (action: string, row: ScheduleBasic) => {
        switch (action) {
            case 'view':
                router.visit(route('modules.hr.schedules.show', { id: row.id }));
                break;
            case 'edit':
                router.visit(route('modules.hr.schedules.edit', { id: row.id }));
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
            <Head title="Schedules" />
            <PageHeader
                title="Schedule Management"
                description="Assign and manage employee work schedules"
                action={
                    <Button onClick={() => router.visit(route('modules.hr.schedules.create'))} size="sm">
                        <Plus />
                        Add Schedule
                    </Button>
                }
            />
            <Card>
                <CardHeader>
                    <CardTitle>Schedules</CardTitle>
                    <CardDescription>View and manage all employee schedules</CardDescription>
                </CardHeader>
                <CardContent>
                    <DataTable
                        ref={tableRef}
                        dataTableClass="ScheduleDataTable"
                        routes={ModuleDataTableRoutes}
                        fileName="Schedules"
                        onRowAction={handleRowAction}
                        preserveStateKey="hr-schedules-table"
                    />
                </CardContent>
            </Card>

            {/* <DeleteScheduleDialog ref={deleteDialogRef} onDeleted={() => tableRef.current?.reload()} /> */}
        </AppLayout>
    );
}
