import { Head, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useRef } from 'react';

import { DataTable } from '@/components/shared/data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import AppLayout from '@/layouts/app-layout';
import { AttendanceBasic, type BreadcrumbItem } from '@/types';
import { DataTableRef, ModuleDataTableRoutes } from '@/types/data-table';
// import DeleteAttendanceDialog, { DeleteAttendanceDialogRef } from './partials/delete-dialog';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/modules/hr/dashboard' },
    { title: 'Attendance', href: '/modules/hr/attendance' },
];

export default function Index() {
    const tableRef = useRef<DataTableRef>(null);
    // const deleteDialogRef = useRef<DeleteAttendanceDialogRef>(null);

    const handleRowAction = (action: string, row: AttendanceBasic) => {
        switch (action) {
            case 'view':
                router.visit(route('modules.hr.attendance.show', { id: row.id }));
                break;
            case 'edit':
                router.visit(route('modules.hr.attendance.edit', { id: row.id }));
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
            <Head title="Attendance" />
            <PageHeader
                title="Attendance"
                description="Track and manage employee attendance records"
                action={
                    <Button onClick={() => router.visit(route('modules.hr.attendance.create'))} size="sm">
                        <Plus />
                        Add Attendance
                    </Button>
                }
            />
            <Card>
                <CardHeader>
                    <CardTitle>Attendance</CardTitle>
                    <CardDescription>View and manage all attendance records</CardDescription>
                </CardHeader>
                <CardContent>
                    <DataTable
                        ref={tableRef}
                        dataTableClass="AttendanceDataTable"
                        routes={ModuleDataTableRoutes}
                        fileName="Attendance"
                        onRowAction={handleRowAction}
                        preserveStateKey="hr-attendance-table"
                    />
                </CardContent>
            </Card>

            {/* <DeleteAttendanceDialog ref={deleteDialogRef} onDeleted={() => tableRef.current?.reload()} /> */}
        </AppLayout>
    );
}
