import InputError from '@/components/input-error';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Combobox } from '@/components/ui/combobox';
import { DatePicker } from '@/components/ui/date-picker';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import { NumberInput } from '@/components/ui/number-input';
import { PageHeader } from '@/components/ui/page-header';
import { Switch } from '@/components/ui/switch';
import AppLayout from '@/layouts/app-layout';
import {
    BreadcrumbItem,
    DepartmentBasic,
    EmployeeBasic,
    PositionBasic,
    ShiftBasic,
    ShiftRotationFormData,
    ShiftRotationFrequency,
    ShiftRotationPriority,
} from '@/types';
import { RoleBasic } from '@/types/core/role';
import { Head, router, useForm } from '@inertiajs/react';
import { Save, X } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

interface CreateProps {
    employees: EmployeeBasic[];
    departments: DepartmentBasic[];
    positions: PositionBasic[];
    roles: RoleBasic[];
    shifts: ShiftBasic[];
    priorities: { id: string; name: string; value: string }[];
    frequencies: { id: string; name: string; value: string }[];
}

export default function Create({ employees, departments, positions, roles, shifts, priorities, frequencies }: CreateProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/modules/hr/dashboard' },
        { title: 'Shift Rotations', href: '/modules/hr/shift-rotations' },
        { title: 'Create', href: '/modules/hr/shift-rotations/create' },
    ];

    const [selectedIds, setSelectedIds] = React.useState({
        employees: [] as number[],
        departments: [] as number[],
        positions: [] as number[],
        roles: [] as number[],
    });

    // Helper to convert number[] to string[] for MultiSelect
    const toStringArray = (arr: number[]) => arr.map(String);
    const toNumberArray = (arr: string[]) => arr.map(Number);

    const { data, setData, post, processing, errors } = useForm<ShiftRotationFormData>({
        start_date: '',
        end_date: '',
        frequency: 'daily' as ShiftRotationFrequency,
        interval: 1,
        shift_id: '',
        employee_ids: [],
        department_ids: [],
        position_ids: [],
        role_ids: [],
        is_recurring: true,
        priority: 'medium' as ShiftRotationPriority,
    });

    const filteredEmployees = React.useMemo(() => {
        let filtered = employees;
        if (selectedIds.departments.length > 0) {
            filtered = filtered.filter((e) => selectedIds.departments.includes(Number(e.department_id)));
        }
        if (selectedIds.positions.length > 0) {
            filtered = filtered.filter((e) => selectedIds.positions.includes(Number(e.position_id)));
        }
        // Optional: add filtering by roles here if needed
        return filtered;
    }, [employees, selectedIds.departments, selectedIds.positions]);

    // Determine if rules or employees are selected
    const rulesSelected = selectedIds.departments.length > 0 || selectedIds.positions.length > 0 || selectedIds.roles.length > 0;
    const employeesSelected = selectedIds.employees.length > 0;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setData('employee_ids', selectedIds.employees);
        setData('department_ids', selectedIds.departments);
        setData('position_ids', selectedIds.positions);
        setData('role_ids', selectedIds.roles);
        post(route('modules.hr.shift-rotations.store'), {
            onSuccess: () => {
                toast.success('Shift rotation created successfully!', {
                    description: 'The new shift rotation has been added to the system.',
                    duration: 4000,
                });
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Shift Rotation" />
            <PageHeader
                title="Create Shift Rotation"
                description="Assign a shift rotation pattern to employees, departments, positions, or roles."
                action={
                    <div className="flex space-x-2">
                        <Button type="button" variant="outline" size="sm" onClick={() => router.visit(route('modules.hr.shift-rotations.index'))}>
                            <X className="mr-2 h-4 w-4" />
                            Cancel
                        </Button>
                        <Button type="submit" size="sm" disabled={processing} onClick={handleSubmit}>
                            <Save className="mr-2 h-4 w-4" />
                            {processing ? 'Creating...' : 'Create Rotation'}
                        </Button>
                    </div>
                }
            />
            <Alert className="border-0 px-0">
                <AlertTitle>How Shift Rotation Assignment Works</AlertTitle>
                <AlertDescription>
                    <ul className="list-disc space-y-1 pl-4 text-sm">
                        <li>
                            <strong>Per-Employee Assignment:</strong> Select one or more employees to assign a rotation directly to them. Each
                            selected employee will get their own rotation entry.
                        </li>
                        <li>
                            <strong>Rule-Based Assignment:</strong> Select departments, positions, or roles to assign a rotation to all employees
                            matching those criteria. New employees matching the rule will automatically be covered.
                        </li>
                        <li>
                            <strong>Mutual Exclusivity:</strong> You can assign a rotation to either specific employees <em>or</em> by rule
                            (department/position/role), but not both at the same time. Selecting one disables the other.
                        </li>
                        <li>
                            <strong>How It Works:</strong> When generating schedules, the system first checks for a per-employee rotation. If none
                            exists, it applies the most specific matching rule.
                        </li>
                        <li>
                            <strong>Best Practice:</strong> Use per-employee assignment for exceptions or overrides. Use rules for broad, dynamic
                            coverage.
                        </li>
                    </ul>
                </AlertDescription>
            </Alert>
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle>Shift Rotation Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="departments">Departments</Label>
                            <MultiSelect
                                options={departments.map((d) => ({ label: d.name, value: String(d.id) }))}
                                defaultValue={toStringArray(selectedIds.departments)}
                                disabled={employeesSelected}
                                onValueChange={(value) => {
                                    const ids = toNumberArray(value);
                                    setSelectedIds((prev) => ({ ...prev, departments: ids, employees: ids.length > 0 ? [] : prev.employees }));
                                    setData('department_ids', ids);
                                    if (ids.length > 0) {
                                        setData('employee_ids', []);
                                    }
                                }}
                                placeholder="Select departments"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="positions">Positions</Label>
                            <MultiSelect
                                options={positions.map((p) => ({ label: p.title, value: String(p.id) }))}
                                defaultValue={toStringArray(selectedIds.positions)}
                                disabled={employeesSelected}
                                onValueChange={(value) => {
                                    const ids = toNumberArray(value);
                                    setSelectedIds((prev) => ({ ...prev, positions: ids, employees: ids.length > 0 ? [] : prev.employees }));
                                    setData('position_ids', ids);
                                    if (ids.length > 0) {
                                        setData('employee_ids', []);
                                    }
                                }}
                                placeholder="Select positions"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="roles">Roles</Label>
                            <MultiSelect
                                options={roles.map((r) => ({ label: r.name, value: String(r.id) }))}
                                defaultValue={toStringArray(selectedIds.roles)}
                                disabled={employeesSelected}
                                onValueChange={(value) => {
                                    const ids = toNumberArray(value);
                                    setSelectedIds((prev) => ({ ...prev, roles: ids, employees: ids.length > 0 ? [] : prev.employees }));
                                    setData('role_ids', ids);
                                    if (ids.length > 0) {
                                        setData('employee_ids', []);
                                    }
                                }}
                                placeholder="Select roles"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="employees">Employees</Label>
                            <MultiSelect
                                options={filteredEmployees.map((e) => ({ label: e.name, value: String(e.id) }))}
                                defaultValue={toStringArray(selectedIds.employees)}
                                disabled={rulesSelected}
                                onValueChange={(value) => {
                                    const ids = toNumberArray(value);
                                    setSelectedIds((prev) => ({
                                        ...prev,
                                        employees: ids,
                                        departments: ids.length > 0 ? [] : prev.departments,
                                        positions: ids.length > 0 ? [] : prev.positions,
                                        roles: ids.length > 0 ? [] : prev.roles,
                                    }));
                                    setData('employee_ids', ids);
                                    if (ids.length > 0) {
                                        setData('department_ids', []);
                                        setData('position_ids', []);
                                        setData('role_ids', []);
                                    }
                                }}
                                placeholder="Select employees"
                            />
                        </div>

                        <div>
                            <Label htmlFor="start_date">
                                Start Date <span className="text-red-500">*</span>
                            </Label>
                            <DatePicker
                                id="start_date"
                                value={data.start_date}
                                onChange={(value) => setData('start_date', value)}
                                className={errors.start_date ? 'border-red-500' : ''}
                            />
                            <InputError message={errors.start_date} />
                        </div>
                        <div>
                            <Label htmlFor="end_date">End Date</Label>
                            <DatePicker
                                id="end_date"
                                value={data.end_date}
                                onChange={(value) => setData('end_date', value)}
                                className={errors.end_date ? 'border-red-500' : ''}
                            />
                            <InputError message={errors.end_date} />
                        </div>
                        <div className="mt-6 flex items-center gap-2">
                            <Switch id="is_recurring" checked={data.is_recurring} onCheckedChange={(checked) => setData('is_recurring', checked)} />
                            <Label htmlFor="is_recurring" className="mb-0 select-none">
                                Recurring
                            </Label>
                        </div>

                        <div>
                            <Label htmlFor="frequency">Frequency</Label>
                            <Combobox
                                options={frequencies.map((opt) => ({ label: opt.name, value: opt.value }))}
                                placeholder="Select frequency"
                                value={data.frequency}
                                onChange={(value) => setData('frequency', value as ShiftRotationFrequency)}
                                optionValue="value"
                                optionLabel="label"
                                searchPlaceholder="Search..."
                                emptyMessage="No frequency found."
                                className={errors.frequency ? '!border-red-500' : ''}
                            />
                            <InputError message={errors.frequency} />
                        </div>

                        <div>
                            <Label htmlFor="shift_id">Shift</Label>
                            <Combobox
                                options={shifts}
                                placeholder="Select shift"
                                value={data.shift_id}
                                onChange={(value) => setData('shift_id', value as string)}
                                optionValue="value"
                                optionLabel="label"
                                searchPlaceholder="Search..."
                                emptyMessage="No shift found."
                                className={errors.shift_id ? '!border-red-500' : ''}
                            />
                            <InputError message={errors.shift_id} />
                        </div>

                        <div>
                            <Label htmlFor="interval">Interval</Label>
                            <NumberInput
                                id="interval"
                                min={1}
                                value={data.interval}
                                onChange={(value) => setData('interval', Number(value))}
                                placeholder="e.g., 1"
                                className={errors.interval ? 'border-red-500' : ''}
                            />
                            <InputError message={errors.interval} />
                        </div>

                        <div>
                            <Label htmlFor="priority">Priority</Label>
                            <Combobox
                                options={priorities.map((opt) => ({ label: opt.name, value: opt.value }))}
                                placeholder="Select priority"
                                value={data.priority ?? ''}
                                onChange={(value) => setData('priority', value as ShiftRotationPriority)}
                                optionValue="value"
                                optionLabel="label"
                                className={errors.priority ? '!border-red-500' : ''}
                            />
                            <InputError message={errors.priority} />
                        </div>
                    </form>
                </CardContent>
            </Card>
        </AppLayout>
    );
}
