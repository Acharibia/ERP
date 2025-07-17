import { Head, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useRef } from 'react';

import { DataTable } from '@/components/shared/data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type ShiftPreferenceBasic } from '@/types';
import { DataTableRef, ModuleDataTableRoutes } from '@/types/data-table';
// import DeleteShiftPreferenceDialog, { DeleteShiftPreferenceDialogRef } from './partials/delete-dialog';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/modules/hr/dashboard' },
    { title: 'Shift Preferences', href: '/modules/hr/shift-preferences' },
];

export default function Index() {
    const tableRef = useRef<DataTableRef>(null);
    // const deleteDialogRef = useRef<DeleteShiftPreferenceDialogRef>(null);

    const handleRowAction = (action: string, row: ShiftPreferenceBasic) => {
        switch (action) {
            case 'view':
                router.visit(route('modules.hr.shift-preferences.show', { id: row.id }));
                break;
            case 'edit':
                router.visit(route('modules.hr.shift-preferences.edit', { id: row.id }));
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
            <Head title="Shift Preferences" />
            <PageHeader
                title="Shift Preferences"
                description="Manage employee shift availability and preferences"
                action={
                    <Button onClick={() => router.visit(route('modules.hr.shift-preferences.create'))} size="sm">
                        <Plus />
                        Add Shift Preference
                    </Button>
                }
            />
            <Card>
                <CardHeader>
                    <CardTitle>Shift Preferences</CardTitle>
                    <CardDescription>View and manage all employee shift preferences</CardDescription>
                </CardHeader>
                <CardContent>
                    <DataTable
                        ref={tableRef}
                        dataTableClass="ShiftPreferenceDataTable"
                        routes={ModuleDataTableRoutes}
                        fileName="Shift Preferences"
                        onRowAction={handleRowAction}
                        preserveStateKey="hr-shift-preferences-table"
                    />
                </CardContent>
            </Card>

            {/* <DeleteShiftPreferenceDialog ref={deleteDialogRef} onDeleted={() => tableRef.current?.reload()} /> */}
        </AppLayout>
    );
}
