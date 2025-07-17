import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Combobox } from '@/components/ui/combobox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PageHeader } from '@/components/ui/page-header';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, EmployeeBasic, ShiftBasic } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { Save, X } from 'lucide-react';
import { toast } from 'sonner';
import { DatePicker } from '@/components/ui/date-picker';

interface CreateProps {
    employees: EmployeeBasic[];
    shifts: ShiftBasic[];
}

const scheduleTypes = [
    { value: 'standard', label: 'Standard' },
    { value: 'shift', label: 'Shift' },
    { value: 'flexible', label: 'Flexible' },
    { value: 'off', label: 'Off' },
];

export default function Create({ employees, shifts }: CreateProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/modules/hr/dashboard' },
        { title: 'Schedules', href: '/modules/hr/schedules' },
        { title: 'Create', href: '/modules/hr/schedules/create' },
    ];

    const { data, setData, post, processing, errors } = useForm({
        employee_id: '',
        date: '',
        shift_id: '',
        start_time: '',
        end_time: '',
        schedule_type: 'standard',
        is_remote: false,
        location: '',
        notes: '',
        expected_hours: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('modules.hr.schedules.store'), {
            onSuccess: () => {
                toast.success('Schedule created successfully!', {
                    description: 'The new schedule has been added to the system.',
                    duration: 4000,
                });
            },
        });
    };
    const handleChange =
        <K extends keyof typeof data>(field: K) =>
        (value: (typeof data)[K]) => {
            setData(field, value);
        };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Schedule" />
            <PageHeader
                title="Create Schedule"
                description="Assign a new work schedule to an employee."
                action={
                    <div className="flex space-x-2">
                        <Button type="button" variant="outline" size="sm" onClick={() => router.visit(route('modules.hr.schedules.index'))}>
                            <X className="mr-2 h-4 w-4" />
                            Cancel
                        </Button>
                        <Button type="submit" size="sm" disabled={processing} onClick={handleSubmit}>
                            <Save className="mr-2 h-4 w-4" />
                            {processing ? 'Creating...' : 'Create Schedule'}
                        </Button>
                    </div>
                }
            />

            <div className="space-y-4">
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle>Schedule Information</CardTitle>
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
                                <Label htmlFor="date">
                                    Date <span className="text-red-500">*</span>
                                </Label>
                                <DatePicker
                                    id="date"
                                    value={data.date}
                                    onChange={(value) => setData('date', value)}
                                    className={errors.date ? 'border-red-500' : ''}
                                />
                                <InputError message={errors.date} />
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
                                <Label htmlFor="start_time" className="px-1">
                                    Start Time
                                </Label>
                                <Input
                                    type="time"
                                    id="start_time"
                                    step="1"
                                    value={data.start_time}
                                    onChange={(e) => setData('start_time', e.target.value)}
                                    className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                                />
                                <InputError message={errors.start_time} />
                            </div>
                            <div>
                                <Label htmlFor="end_time" className="px-1">
                                    End Time
                                </Label>
                                <Input
                                    type="time"
                                    id="end_time"
                                    step="1"
                                    value={data.end_time}
                                    onChange={(e) => setData('end_time', e.target.value)}
                                    className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                                />
                                <InputError message={errors.end_time} />
                            </div>
                            <div>
                                <Label htmlFor="schedule_type">Schedule Type</Label>
                                <Combobox
                                    options={scheduleTypes}
                                    value={data.schedule_type}
                                    onChange={handleChange('schedule_type')}
                                    optionValue="value"
                                    optionLabel="label"
                                    placeholder="Select schedule type"
                                    searchPlaceholder="Search types..."
                                    emptyMessage="No types found."
                                    className={errors.schedule_type ? '!border-red-500' : ''}
                                />
                                <InputError message={errors.schedule_type} />
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch id="is_remote" checked={!!data.is_remote} onCheckedChange={handleChange('is_remote')} />
                                <Label htmlFor="is_remote">Remote</Label>
                                <InputError message={errors.is_remote} />
                            </div>
                            <div>
                                <Label htmlFor="location">Location</Label>
                                <Input
                                    id="location"
                                    value={data.location}
                                    onChange={(e) => setData('location', e.target.value)}
                                    placeholder="e.g., Office 1"
                                    className={errors.location ? 'border-red-500' : ''}
                                />
                                <InputError message={errors.location} />
                            </div>
                            <div>
                                <Label htmlFor="expected_hours">Expected Hours</Label>
                                <Input
                                    id="expected_hours"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={data.expected_hours}
                                    onChange={(e) => setData('expected_hours', e.target.value)}
                                    placeholder="e.g., 8.00"
                                    className={errors.expected_hours ? 'border-red-500' : ''}
                                />
                                <InputError message={errors.expected_hours} />
                            </div>
                            <div className="lg:col-span-3">
                                <Label htmlFor="notes">Notes</Label>
                                <Textarea
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
