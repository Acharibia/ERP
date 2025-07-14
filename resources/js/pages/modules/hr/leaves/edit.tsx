import InputError from '@/components/input-error';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Combobox } from '@/components/ui/combobox';
import { DatePicker } from '@/components/ui/date-picker';
import { Label } from '@/components/ui/label';
import { PageHeader } from '@/components/ui/page-header';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { useDateFormatter } from '@/hooks/use-date-formatter';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, EmployeeBasic, LeaveRequest, LeaveRequestForm, LeaveTypeBasic } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { CalendarDays, Save, X } from 'lucide-react';
import React from 'react';

export default function EditLeaveRequest({
    leave,
    employees,
    leaveTypes,
}: {
    leave: LeaveRequest;
    employees: EmployeeBasic[];
    leaveTypes: LeaveTypeBasic[];
}) {
    const { data, setData, patch, processing, errors } = useForm<LeaveRequestForm>({
        employee_id: leave.employee_id,
        leave_type_id: leave.leave_type_id,
        start_date: leave.start_date,
        end_date: leave.end_date,
        reason: leave.reason || '',
        priority: leave.priority || 'normal',
        total_days: leave.total_days || null,
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/modules/hr/dashboard' },
        { title: 'Leaves', href: '/modules/hr/leaves' },
        { title: `Edit ${leave.leave_type.name}`, href: '#' },
    ];

    const { parseDate } = useDateFormatter();

    React.useEffect(() => {
        const start = parseDate(data.start_date);
        const end = parseDate(data.end_date);
        let newTotalDays: number | null = null;
        if (start && end) {
            const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
            newTotalDays = diff >= 0 ? diff + 1 : null;
        }
        if (data.total_days !== newTotalDays) {
            setData('total_days', newTotalDays);
        }
    }, [data.start_date, data.end_date, parseDate, data.total_days, setData]);

    const totalDays = data.total_days;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route('modules.hr.leaves.update', leave.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${leave.leave_type.name} Leave Request`} />
            <PageHeader
                title={`Edit ${leave.leave_type.name} Request`}
                description="Update an existing leave request"
                action={
                    <div className="flex space-x-2">
                        <Button type="button" variant="outline" size="sm" onClick={() => router.visit(route('modules.hr.leaves.index'))}>
                            <X className="mr-1 h-4 w-4" />
                            Cancel
                        </Button>
                        <Button type="submit" size="sm" onClick={handleSubmit} disabled={processing}>
                            <Save className="mr-1 h-4 w-4" />
                            {processing ? 'Updating...' : 'Update Request'}
                        </Button>
                    </div>
                }
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Leave Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div>
                            <Label>Employee</Label>
                            <Combobox
                                options={employees}
                                value={data.employee_id}
                                onChange={(value) => setData('employee_id', value as number)}
                                optionValue="id"
                                optionLabel="name"
                                placeholder="Select employee"
                                searchPlaceholder="Search employees..."
                                className={errors.employee_id ? '!border-red-500' : ''}
                            />
                            <InputError message={errors.employee_id} />
                        </div>

                        <div>
                            <Label>Leave Type</Label>
                            <Combobox
                                options={leaveTypes}
                                value={data.leave_type_id}
                                onChange={(value) => setData('leave_type_id', value as number)}
                                optionValue="id"
                                optionLabel="name"
                                placeholder="Select leave type"
                                searchPlaceholder="Search leave types..."
                                className={errors.leave_type_id ? '!border-red-500' : ''}
                            />
                            <InputError message={errors.leave_type_id} />
                        </div>

                        <div className={`grid items-end gap-4 ${totalDays !== null ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}>
                            <div>
                                <Label>Start Date</Label>
                                <DatePicker
                                    className={errors.start_date ? 'border-red-500' : ''}
                                    value={data.start_date}
                                    onChange={(value) => setData('start_date', value)}
                                    placeholder="Start date"
                                />
                                <InputError message={errors.start_date} />
                            </div>

                            <div>
                                <Label>End Date</Label>
                                <DatePicker
                                    className={errors.end_date ? 'border-red-500' : ''}
                                    value={data.end_date}
                                    onChange={(value) => setData('end_date', value)}
                                    placeholder="End date"
                                />
                                <InputError message={errors.end_date} />
                            </div>

                            {totalDays !== null && (
                                <Alert className="border-0" variant="destructive">
                                    <CalendarDays />
                                    <AlertTitle>
                                        <span>{totalDays}</span> {totalDays === 1 ? 'day' : 'days'}
                                    </AlertTitle>
                                </Alert>
                            )}
                        </div>

                        <div>
                            <Label>Reason</Label>
                            <Textarea
                                value={data.reason}
                                onChange={(e) => setData('reason', e.target.value)}
                                placeholder="Brief explanation for leave"
                                rows={3}
                                className={errors.reason ? 'border-red-500' : ''}
                            />
                            <InputError message={errors.reason} />
                        </div>
                    </CardContent>
                </Card>

                <Card className={errors.priority ? 'border-red-500' : ''}>
                    <CardHeader>
                        <CardTitle>Priority</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <RadioGroup value={data.priority} onValueChange={(value) => setData('priority', value)}>
                            {['low', 'normal', 'high', 'urgent'].map((priority) => {
                                const colorClass = {
                                    low: 'text-green-600',
                                    normal: 'text-gray-700',
                                    high: 'text-orange-500',
                                    urgent: 'text-red-600',
                                }[priority];

                                return (
                                    <div key={priority} className="flex items-center space-x-2">
                                        <RadioGroupItem value={priority} id={`priority-${priority}`} />
                                        <label htmlFor={`priority-${priority}`} className={`cursor-pointer text-sm capitalize ${colorClass}`}>
                                            {priority}
                                        </label>
                                    </div>
                                );
                            })}
                        </RadioGroup>
                        <InputError message={errors.priority} />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
