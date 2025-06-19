import { DataTable } from '@/components/shared/data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { useIsMobile } from '@/hooks/use-mobile';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { DepartmentStaticHeaders } from '@/types/department';
import { Head, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/modules/hr/dashboard',
    },
    {
        title: 'Departments',
        href: '/modules/hr/departments',
    },
];

export default function Index() {
    const isMobile = useIsMobile();

    const dataTableRoutes = {
        process: 'modules.hr.datatable.process',
        filterOptions: 'modules.hr.datatable.filter-options',
        export: 'modules.hr.datatable.export',
    };

    type DepartmentRow = { id: number | string };

    const handleRowAction = (action: string, row: unknown) => {
        const department = row as DepartmentRow;
        switch (action) {
            case 'view':
                router.visit(route('modules.hr.departments.show', { id: department.id }));
                break;
            case 'edit':
                router.visit(route('modules.hr.departments.edit', { id: department.id }));
                break;
            case 'delete':
                if (confirm('Are you sure you want to delete this department?')) {
                    router.delete(route('modules.hr.departments.destroy', { id: department.id }));
                }
                break;
            default:
                console.log(`Unhandled action: ${action}`, row);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Departments" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl">
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
                    <CardHeader className={`${isMobile ? 'p-4' : 'flex flex-row items-center justify-between'}`}>
                        <div>
                            <CardTitle className={isMobile ? 'text-base' : 'text-sm font-medium'}>Departments</CardTitle>
                            <CardDescription className={isMobile ? 'text-xs' : ''}>
                                {isMobile
                                    ? 'View and manage department records'
                                    : 'View and manage all departments records and organizational structure'}
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className={isMobile ? 'p-4 pt-0' : ''}>
                        <DataTable
                            dataTableClass="DepartmentDataTable"
                            routes={dataTableRoutes}
                            enableRowClick
                            onRowAction={handleRowAction}
                            preserveStateKey="hr-departments-table"
                            staticHeaders={DepartmentStaticHeaders}
                        />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
