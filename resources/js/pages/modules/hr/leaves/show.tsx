import { Alert, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { PageHeader } from '@/components/ui/page-header';
import { useDateFormatter } from '@/hooks/use-date-formatter';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, EmployeeBasic, LeaveRequest, LeaveTypeBasic } from '@/types';
import { Head, router } from '@inertiajs/react';
import { CalendarDays, Edit2 } from 'lucide-react';

export default function ShowLeaveRequest({ leave }: { leave: LeaveRequest; employee: EmployeeBasic; leaveType: LeaveTypeBasic }) {
    const { formatDate } = useDateFormatter();
    const totalDays = leave.total_days ?? 0;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/modules/hr/dashboard' },
        { title: 'Leaves', href: '/modules/hr/leaves' },
        { title: `${leave.leave_type.name}`, href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${leave.leave_type.name} Leave Request`} />

            <PageHeader
                title={`${leave.leave_type.name} Request`}
                description="Leave request details"
                action={
                    <Button size="sm" onClick={() => router.visit(route('modules.hr.leaves.edit', leave.id))}>
                        <Edit2 className="mr-1 h-4 w-4" />
                        Edit
                    </Button>
                }
            />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {/* Main Info Card */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Leave Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <Label>Employee</Label>
                                <div className="text-muted-foreground text-sm">{leave.employee?.name}</div>
                            </div>
                            <div>
                                <Label>Leave Type</Label>
                                <div className="text-muted-foreground text-sm">{leave.leave_type?.name}</div>
                            </div>
                            <div>
                                <Label>Start Date</Label>
                                <div className="text-muted-foreground text-sm">{formatDate(leave.start_date)}</div>
                            </div>
                            <div>
                                <Label>End Date</Label>
                                <div className="text-muted-foreground text-sm">{formatDate(leave.end_date)}</div>
                            </div>
                        </div>

                        <div>
                            <Label>Reason</Label>
                            <div className="text-muted-foreground text-sm whitespace-pre-line">{leave.reason || '—'}</div>
                        </div>
                    </CardContent>
                </Card>

                <div>
                    {totalDays > 0 && (
                        <Alert className="border-0" variant="default">
                            <CalendarDays />
                            <AlertTitle>
                                {totalDays} {totalDays === 1 ? 'day' : 'days'}
                            </AlertTitle>
                        </Alert>
                    )}

                    <Card>
                        <CardHeader>
                            <CardTitle>Priority</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm font-medium capitalize">{leave.priority}</div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
