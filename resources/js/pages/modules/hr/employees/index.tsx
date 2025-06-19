import { EmployeeStatCard } from '@/components/hr/employee-stat-card';
import { DataTable } from '@/components/shared/data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { useIsMobile } from '@/hooks/use-mobile';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Calendar, Plus, UserCheck, UserPlus, Users } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/modules/hr/dashboard',
    },
    {
        title: 'Employees',
        href: '/modules/hr/employees',
    },
];

export default function Index() {
    const isMobile = useIsMobile();

    const handleStatClick = (type: string) => {
        console.log(`Navigate to ${type} view`);
    };

    const handleAddEmployee = () => {
        console.log('Add new employee');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Employees" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl">
                {/* Page Header */}
                <PageHeader
                    title="Employee Management"
                    description="Manage your workforce, track employee data, and monitor organizational structure"
                >
                    <div className={`flex items-center ${isMobile ? 'w-full flex-col gap-2' : 'gap-2'}`}>
                        <Button size={isMobile ? 'default' : 'sm'} onClick={handleAddEmployee} className={isMobile ? 'w-full' : ''}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Employee
                        </Button>
                    </div>
                </PageHeader>

                {/* Employee Statistics */}
                <div className={`grid gap-4 ${isMobile ? 'grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-4'}`}>
                    <EmployeeStatCard
                        title="Total Employees"
                        value="248"
                        icon={Users}
                        description={isMobile ? 'all departments' : 'across all departments'}
                        genderBreakdown={{ male: 142, female: 106 }}
                        onClick={() => handleStatClick('total')}
                    />
                    <EmployeeStatCard
                        title="Active"
                        value="235"
                        icon={UserCheck}
                        trend="positive"
                        trendValue={isMobile ? '+5 week' : '+5 this week'}
                        genderBreakdown={{ male: 135, female: 100 }}
                        onClick={() => handleStatClick('active')}
                    />
                    <EmployeeStatCard
                        title="On Leave"
                        value="8"
                        icon={Calendar}
                        description={isMobile ? '3 returning' : 'returning next week: 3'}
                        genderBreakdown={{ male: 3, female: 5 }}
                        onClick={() => handleStatClick('leave')}
                    />
                    <EmployeeStatCard
                        title={isMobile ? 'New Hires' : 'New This Month'}
                        value="12"
                        icon={UserPlus}
                        trend="positive"
                        trendValue={isMobile ? '+45%' : '+45% vs last month'}
                        genderBreakdown={{ male: 7, female: 5 }}
                        onClick={() => handleStatClick('new_hires')}
                    />
                </div>

                {/* Employee Data Table */}
                <Card>
                    <CardHeader className={`${isMobile ? 'p-4' : 'flex flex-row items-center justify-between'}`}>
                        <div>
                            <CardTitle className={isMobile ? 'text-base' : 'text-sm font-medium'}>All Employees</CardTitle>
                            <CardDescription className={isMobile ? 'text-xs' : ''}>
                                {isMobile ? 'View and manage employee records' : 'View and manage all employee records and organizational structure'}
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className={isMobile ? 'p-4 pt-0' : ''}>
                        <DataTable dataTableClass="UserDataTable" enableRowClick />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
