import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Combobox } from '@/components/ui/combobox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PageHeader } from '@/components/ui/page-header';
import { Switch } from '@/components/ui/switch';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, EmployeeBasic, ShiftBasic } from '@/types';
import { daysOfWeek } from '@/types/shift-preference';

import { Head, router, useForm } from '@inertiajs/react';
import { Save, X } from 'lucide-react';
import { toast } from 'sonner';

interface CreateProps {
    employees: EmployeeBasic[];
    shifts: ShiftBasic[];
}
export default function Create({ employees, shifts }: CreateProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/modules/hr/dashboard' },
        { title: 'Shift Preferences', href: '/modules/hr/shift-preferences' },
        { title: 'Create', href: '/modules/hr/shift-preferences/create' },
    ];

    const { data, setData, post, processing, errors } = useForm({
        employee_id: '',
        shift_id: '',
        is_available: true,
        preference_level: '',
        is_mandatory: false,
        day_of_week: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('modules.hr.shift-preferences.store'), {
            onSuccess: () => {
                toast.success('Shift preference created successfully!', {
                    description: 'The new shift preference has been added to the system.',
                    duration: 4000,
                });
            },
        });
    };

    const handleChange = (field: keyof typeof data) => (value: boolean) => {
        setData(field, value);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Shift Preference" />
            <PageHeader
                title="Create Shift Preference"
                description="Set an employee's shift preference."
                action={
                    <div className="flex space-x-2">
                        <Button type="button" variant="outline" size="sm" onClick={() => router.visit(route('modules.hr.shift-preferences.index'))}>
                            <X className="mr-2 h-4 w-4" />
                            Cancel
                        </Button>
                        <Button type="submit" size="sm" disabled={processing} onClick={handleSubmit}>
                            <Save className="mr-2 h-4 w-4" />
                            {processing ? 'Creating...' : 'Create Preference'}
                        </Button>
                    </div>
                }
            />

            <div className="space-y-4">
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle>Shift Preference Information</CardTitle>
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
                                <Label htmlFor="shift_id">
                                    Shift <span className="text-red-500">*</span>
                                </Label>
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
                            <div className="flex items-center space-x-2">
                                <Label htmlFor="is_available">Available</Label>
                                <Switch id="is_available" checked={!!data.is_available} onCheckedChange={handleChange('is_available')} />
                                <InputError message={errors.is_available} />
                            </div>
                            <div>
                                <Label htmlFor="preference_level">Preference Level</Label>
                                <Input
                                    id="preference_level"
                                    type="number"
                                    min="1"
                                    max="5"
                                    value={data.preference_level}
                                    onChange={(e) => setData('preference_level', e.target.value)}
                                    placeholder="1 (highest) - 5 (lowest)"
                                    className={errors.preference_level ? 'border-red-500' : ''}
                                />
                                <InputError message={errors.preference_level} />
                            </div>
                            <div className="flex items-center space-x-2">
                                <Label htmlFor="is_mandatory">Mandatory</Label>
                                <Switch id="is_mandatory" checked={!!data.is_mandatory} onCheckedChange={handleChange('is_mandatory')} />
                                <InputError message={errors.is_mandatory} />
                            </div>
                            <div>
                                <Label htmlFor="day_of_week">Day of Week</Label>
                                <Combobox
                                    options={daysOfWeek.map((day) => ({ value: day, label: day || 'Any' }))}
                                    value={data.day_of_week}
                                    onChange={(value) => setData('day_of_week', value as string)}
                                    optionValue="value"
                                    optionLabel="label"
                                    placeholder="Select day"
                                    searchPlaceholder="Search days..."
                                    emptyMessage="No days found."
                                    className={errors.day_of_week ? '!border-red-500' : ''}
                                />
                                <InputError message={errors.day_of_week} />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
