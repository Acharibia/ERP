import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Combobox } from '@/components/ui/combobox';
import { DatePicker } from '@/components/ui/date-picker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PageHeader } from '@/components/ui/page-header';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, EmployeeBasic, ShiftBasic } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { Save, X } from 'lucide-react';
import { toast } from 'sonner';

interface CreateProps {
    employees: EmployeeBasic[];
    shifts: ShiftBasic[];
}

const statusOptions = [
    { value: 'present', label: 'Present' },
    { value: 'absent', label: 'Absent' },
    { value: 'late', label: 'Late' },
    { value: 'half-day', label: 'Half Day' },
];

const sourceOptions = [
    { value: 'manual', label: 'Manual' },
    { value: 'biometric', label: 'Biometric' },
    { value: 'mobile', label: 'Mobile' },
    { value: 'web', label: 'Web' },
];

export default function Create({ employees, shifts }: CreateProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/modules/hr/dashboard' },
        { title: 'Attendance', href: '/modules/hr/attendance' },
        { title: 'Create', href: '/modules/hr/attendance/create' },
    ];

    const { data, setData, post, processing, errors } = useForm({
        employee_id: '',
        shift_id: '',
        attendance_date: '',
        clock_in: '',
        clock_out: '',
        total_hours: '',
        overtime_hours: '',
        status: '',
        notes: '',
        source: 'manual',
    });

    const handleChange =
        <K extends keyof typeof data>(field: K) =>
        (value: (typeof data)[K]) => {
            setData(field, value);
        };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('modules.hr.attendance.store'), {
            onSuccess: () => {
                toast.success('Attendance record created successfully!', {
                    description: 'The new attendance record has been added to the system.',
                    duration: 4000,
                });
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Attendance" />
            <PageHeader
                title="Create Attendance"
                description="Record a new attendance entry for an employee."
                action={
                    <div className="flex space-x-2">
                        <Button type="button" variant="outline" size="sm" onClick={() => router.visit(route('modules.hr.attendance.index'))}>
                            <X className="mr-2 h-4 w-4" />
                            Cancel
                        </Button>
                        <Button type="submit" size="sm" disabled={processing} onClick={handleSubmit}>
                            <Save className="mr-2 h-4 w-4" />
                            {processing ? 'Creating...' : 'Create Attendance'}
                        </Button>
                    </div>
                }
            />

            <div className="space-y-4">
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle>Attendance Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                            <div>
                                <Label htmlFor="employee_id">
                                    Employee <span className="text-red-500">*</span>
                                </Label>
                                <Combobox
                                    options={employees}
                                    value={data.employee_id}
                                    onChange={(value) => setData('employee_id', value as string)}
                                    optionValue="id"
                                    optionLabel="name"
                                    placeholder="Select employee"
                                    searchPlaceholder="Search employees..."
                                    emptyMessage="No employees found."
                                    className={errors.employee_id ? '!border-red-500' : ''}
                                />
                                <InputError message={errors.employee_id} />
                            </div>
                            <div>
                                <Label htmlFor="shift_id">Shift</Label>
                                <Combobox
                                    options={shifts}
                                    value={data.shift_id}
                                    onChange={(value) => setData('shift_id', value as string)}
                                    optionValue="id"
                                    optionLabel="name"
                                    placeholder="Select shift"
                                    searchPlaceholder="Search shifts..."
                                    emptyMessage="No shifts found."
                                    className={errors.shift_id ? '!border-red-500' : ''}
                                />
                                <InputError message={errors.shift_id} />
                            </div>
                            <div>
                                <Label htmlFor="attendance_date">
                                    Date <span className="text-red-500">*</span>
                                </Label>
                                <DatePicker
                                    id="attendance_date"
                                    value={data.attendance_date}
                                    onChange={handleChange('attendance_date')}
                                    className={errors.attendance_date ? 'border-red-500' : ''}
                                />
                                <InputError message={errors.attendance_date} />
                            </div>
                            <div>
                                <Label htmlFor="clock_in" className="px-1">
                                    Clock In
                                </Label>
                                <Input
                                    type="time"
                                    id="clock_in"
                                    step="1"
                                    value={data.clock_in}
                                    onChange={(e) => setData('clock_in', e.target.value)}
                                    className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                                />
                                <InputError message={errors.clock_in} />
                            </div>
                            <div>
                                <Label htmlFor="clock_out" className="px-1">
                                    Clock Out
                                </Label>
                                <Input
                                    type="time"
                                    id="clock_out"
                                    step="1"
                                    value={data.clock_out}
                                    onChange={(e) => setData('clock_out', e.target.value)}
                                    className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                                />
                                <InputError message={errors.clock_out} />
                            </div>
                            <div>
                                <Label htmlFor="total_hours">Total Hours</Label>
                                <Input
                                    id="total_hours"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={data.total_hours}
                                    onChange={(e) => setData('total_hours', e.target.value)}
                                    placeholder="e.g., 8.00"
                                    className={errors.total_hours ? 'border-red-500' : ''}
                                />
                                <InputError message={errors.total_hours} />
                            </div>
                            <div>
                                <Label htmlFor="overtime_hours">Overtime Hours</Label>
                                <Input
                                    id="overtime_hours"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={data.overtime_hours}
                                    onChange={(e) => setData('overtime_hours', e.target.value)}
                                    placeholder="e.g., 2.00"
                                    className={errors.overtime_hours ? 'border-red-500' : ''}
                                />
                                <InputError message={errors.overtime_hours} />
                            </div>
                            <div>
                                <Label htmlFor="status">Status</Label>
                                <Combobox
                                    options={statusOptions}
                                    value={data.status}
                                    onChange={handleChange('status')}
                                    optionValue="value"
                                    optionLabel="label"
                                    placeholder="Select status"
                                    searchPlaceholder="Search status..."
                                    emptyMessage="No status found."
                                    className={errors.status ? 'border-red-500' : ''}
                                />
                                <InputError message={errors.status} />
                            </div>
                            <div>
                                <Label htmlFor="source">Source</Label>
                                <Combobox
                                    options={sourceOptions}
                                    value={data.source}
                                    onChange={handleChange('source')}
                                    optionValue="value"
                                    optionLabel="label"
                                    placeholder="Select source"
                                    searchPlaceholder="Search sources..."
                                    emptyMessage="No sources found."
                                    className={errors.source ? 'border-red-500' : ''}
                                />
                                <InputError message={errors.source} />
                            </div>
                            <div className="lg:col-span-3">
                                <Label htmlFor="notes">Notes</Label>
                                <Input
                                    id="notes"
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    placeholder="Optional notes"
                                    className={errors.notes ? 'border-red-500' : ''}
                                />
                                <InputError message={errors.notes} />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
