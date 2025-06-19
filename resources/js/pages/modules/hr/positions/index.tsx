import { DataTable } from '@/components/shared/data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { useIsMobile } from '@/hooks/use-mobile';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { PositionStaticHeaders } from '@/types/position';
import { Head, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/modules/hr/dashboard',
    },
    {
        title: 'Positions',
        href: '/modules/hr/positions',
    },
];

export default function Index() {
    const isMobile = useIsMobile();

    const dataTableRoutes = {
        process: 'modules.hr.datatable.process',
        filterOptions: 'modules.hr.datatable.filter-options',
        export: 'modules.hr.datatable.export',
    };

    type PositionRow = { id: number | string };

    const handleRowAction = (action: string, row: unknown) => {
        const position = row as PositionRow;
        switch (action) {
            case 'view':
                router.visit(route('modules.hr.positions.show', { id: position.id }));
                break;
            case 'edit':
                router.visit(route('modules.hr.positions.edit', { id: position.id }));
                break;
            case 'delete':
                if (confirm('Are you sure you want to delete this position?')) {
                    router.delete(route('modules.hr.positions.destroy', { id: position.id }));
                }
                break;
            default:
                console.log(`Unhandled action: ${action}`, row);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Positions" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl">
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
                    <CardHeader className={`${isMobile ? 'p-4' : 'flex flex-row items-center justify-between'}`}>
                        <div>
                            <CardTitle className={isMobile ? 'text-base' : 'text-sm font-medium'}>Positions</CardTitle>
                            <CardDescription className={isMobile ? 'text-xs' : ''}>
                                {isMobile
                                    ? 'View and manage position records'
                                    : 'View and manage all job positions with salary ranges and requirements'}
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className={isMobile ? 'p-4 pt-0' : ''}>
                        <DataTable
                            dataTableClass="PositionDataTable"
                            routes={dataTableRoutes}
                            enableRowClick
                            onRowAction={handleRowAction}
                            preserveStateKey="hr-positions-table"
                            staticHeaders={PositionStaticHeaders}
                        />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
