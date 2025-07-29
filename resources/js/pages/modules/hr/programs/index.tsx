import { DataTable } from '@/components/shared/data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import AppLayout from '@/layouts/app-layout';
import { DataTableRef, ModuleDataTableRoutes } from '@/types/data-table';
import { Head, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useRef } from 'react';

const breadcrumbs = [
    { title: 'Dashboard', href: '/modules/hr/dashboard' },
    { title: 'Training Programs', href: '/modules/hr/programs' },
];

type ProgramRow = {
    id: number;
    title: string;
    description?: string;
    created_at?: string;
};

export default function ProgramsIndex() {
    const tableRef = useRef<DataTableRef>(null);

    const handleRowAction = (action: string, row: ProgramRow) => {
        switch (action) {
            case 'view':
                router.visit(`/modules/hr/programs/${row.id}`);
                break;
            case 'edit':
                router.visit(`/modules/hr/programs/${row.id}/edit`);
                break;
            case 'delete':
                // You may want to show a confirmation dialog here
                router.delete(route('programs.destroy', { program: row.id }), {
                    onSuccess: () => tableRef.current?.reload(),
                });
                break;
            default:
                console.log(`Unhandled action: ${action}`, row);
        }
    };

    const handleBulkAction = (action: string) => {
        if (action === 'delete') {
            tableRef.current?.reload();
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Training Programs" />
            <PageHeader
                title="Training Programs"
                description="Manage and oversee all training programs for your organization."
                action={
                    <Button onClick={() => router.visit('/modules/hr/programs/create')} size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        New Program
                    </Button>
                }
            />
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-sm font-medium">Programs</CardTitle>
                        <CardDescription>View and manage all training programs</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <DataTable
                        ref={tableRef}
                        dataTableClass="ProgramDataTable"
                        routes={ModuleDataTableRoutes}
                        fileName="Programs"
                        onRowAction={handleRowAction}
                        onBulkAction={handleBulkAction}
                        preserveStateKey="hr-programs-table"
                    />
                </CardContent>
            </Card>
        </AppLayout>
    );
}
