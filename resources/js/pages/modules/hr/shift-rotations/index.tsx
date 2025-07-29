import { Head, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useRef } from 'react';

import { DataTable } from '@/components/shared/data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import AppLayout from '@/layouts/app-layout';
import { ShiftRotation, type BreadcrumbItem } from '@/types';
import { DataTableRef, ModuleDataTableRoutes } from '@/types/data-table';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/modules/hr/dashboard' },
    { title: 'Shift Rotations', href: '/modules/hr/shift-rotations' },
];

export default function Index() {
    const tableRef = useRef<DataTableRef>(null);

    const handleRowAction = (action: string, row: ShiftRotation) => {
        switch (action) {
            case 'view':
                router.visit(route('modules.hr.shift-rotations.show', { id: row.id }));
                break;
            case 'edit':
                router.visit(route('modules.hr.shift-rotations.edit', { id: row.id }));
                break;
            case 'delete':
                // Implement delete dialog if needed
                break;
            default:
                console.warn(`Unhandled action: ${action}`, row);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Shift Rotations" />
            <PageHeader
                title="Shift Rotations"
                description="Manage employee shift rotation patterns and assignments"
                action={
                    <Button onClick={() => router.visit(route('modules.hr.shift-rotations.create'))} size="sm">
                        <Plus />
                        Add Shift Rotation
                    </Button>
                }
            />
            <Card>
                <CardHeader>
                    <CardTitle>Shift Rotations</CardTitle>
                    <CardDescription>View and manage all shift rotation patterns</CardDescription>
                </CardHeader>
                <CardContent>
                    <DataTable
                        ref={tableRef}
                        dataTableClass="ShiftRotationDataTable"
                        routes={ModuleDataTableRoutes}
                        fileName="Shift Rotations"
                        onRowAction={handleRowAction}
                        preserveStateKey="hr-shift-rotations-table"
                    />
                </CardContent>
            </Card>
        </AppLayout>
    );
}
