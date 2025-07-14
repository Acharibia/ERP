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
import { BreadcrumbItem, DepartmentBasic, DepartmentFormData, EmployeeBasic } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { Save, X } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/modules/hr/dashboard',
    },
    {
        title: 'Departments',
        href: '/modules/hr/departments',
    },
    {
        title: 'Create',
        href: '/modules/hr/departments/create',
    },
];

export default function Create({ departments, employees }: { departments: DepartmentBasic[]; employees: EmployeeBasic[] }) {
    const { data, setData, post, processing, errors } = useForm<DepartmentFormData>({
        name: '',
        code: '',
        email: '',
        description: '',
        parent_id: '',
        manager_id: '',
        budget: '',
        cost_center: '',
        location: '',
        status: 'active',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('modules.hr.departments.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Department" />
            <PageHeader
                title="Create Department"
                description="Add a new department to your organization"
                action={
                    <div className="flex space-x-2">
                        <Button type="button" variant="outline" size="sm" onClick={() => router.visit(route('modules.hr.departments.index'))}>
                            <X /> Cancel
                        </Button>
                        <Button type="submit" size="sm" disabled={processing} onClick={handleSubmit}>
                            <Save /> {processing ? 'Creating...' : 'Create Department'}
                        </Button>
                    </div>
                }
            />

            <div className="space-y-2">
                {/* First Row - Basic Information and Organizational Structure */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    {/* Basic Information Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div>
                                <Label htmlFor="name">
                                    Name <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Department name"
                                    className={errors.name ? 'border-red-500' : ''}
                                />
                                <InputError message={errors.name} />
                            </div>
                            <div>
                                <Label htmlFor="email">
                                    Email <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="Department email"
                                    className={errors.email ? 'border-red-500' : ''}
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div>
                                <Label htmlFor="code">
                                    Code <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="code"
                                    value={data.code}
                                    maxLength={4}
                                    onChange={(e) => setData('code', e.target.value)}
                                    placeholder="e.g., HR, IT, FIN"
                                    className={errors.code ? 'border-red-500' : ''}
                                />
                                <InputError message={errors.code} />
                            </div>

                            <div>
                                <Label>Status</Label>
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="status"
                                        checked={data.status === 'active'}
                                        onCheckedChange={(checked) => setData('status', checked ? 'active' : 'inactive')}
                                    />
                                    <Label htmlFor="status">{data.status === 'active' ? 'Active' : 'Inactive'}</Label>
                                </div>
                                <InputError message={errors.status} />
                            </div>

                            <div>
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Department description"
                                    rows={3}
                                    className={errors.description ? 'border-red-500' : ''}
                                />
                                <InputError message={errors.description} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Organizational Structure Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Organizational Structure</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div>
                                <Label>Parent Department</Label>
                                <Combobox
                                    options={departments}
                                    value={data.parent_id}
                                    onChange={(value) => setData('parent_id', value as string)}
                                    optionValue="id"
                                    optionLabel="name"
                                    placeholder="Select parent"
                                    searchPlaceholder="Search departments..."
                                    emptyMessage="No departments found."
                                    className={errors.parent_id ? 'border-red-500' : ''}
                                />
                                <InputError message={errors.parent_id} />
                            </div>

                            <div>
                                <Label>Department Manager/Head</Label>
                                <Combobox
                                    options={employees}
                                    value={data.manager_id}
                                    onChange={(value) => setData('manager_id', value as string)}
                                    optionValue="id"
                                    optionLabel="name"
                                    placeholder="Select manager"
                                    searchPlaceholder="Search employees..."
                                    emptyMessage="No employees found."
                                    className={errors.manager_id ? 'border-red-500' : ''}
                                />
                                <InputError message={errors.manager_id} />
                            </div>

                            <div className="bg-muted/50 rounded-lg p-3">
                                <p className="text-muted-foreground text-sm">
                                    The parent department defines the hierarchical structure, while the manager is responsible for day-to-day
                                    operations.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Operations & Budget</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div>
                                <Label htmlFor="location">Location</Label>
                                <Input
                                    id="location"
                                    value={data.location}
                                    onChange={(e) => setData('location', e.target.value)}
                                    placeholder="Department location"
                                    className={errors.location ? 'border-red-500' : ''}
                                />
                                <InputError message={errors.location} />
                            </div>

                            <div>
                                <Label htmlFor="budget">Annual Budget</Label>
                                <Input
                                    id="budget"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={data.budget}
                                    onChange={(e) => setData('budget', e.target.value)}
                                    placeholder="0.00"
                                    className={errors.budget ? 'border-red-500' : ''}
                                />
                                <InputError message={errors.budget} />
                            </div>

                            <div>
                                <Label htmlFor="cost_center">Cost Center</Label>
                                <Input
                                    id="cost_center"
                                    value={data.cost_center}
                                    onChange={(e) => setData('cost_center', e.target.value)}
                                    placeholder="Cost center code"
                                    className={errors.cost_center ? 'border-red-500' : ''}
                                />
                                <InputError message={errors.cost_center} />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
