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
import { BreadcrumbItem, Department, DepartmentBasic, DepartmentFormData, EmployeeOption } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { AlertTriangle, Save, X } from 'lucide-react';

interface EditProps {
    department: Department;
    departments: DepartmentBasic[];
    employees: EmployeeOption[];
}

export default function Edit({ department, departments, employees }: EditProps) {
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
            title: department.name,
            href: `/modules/hr/departments/${department.id}`,
        },
        {
            title: 'Edit',
            href: `/modules/hr/departments/${department.id}/edit`,
        },
    ];

    const { data, setData, patch, processing, errors, isDirty } = useForm<DepartmentFormData>({
        name: department.name || '',
        code: department.code || '',
        email: department.email || '',
        description: department.description || '',
        parent_id: department.parent_id?.toString() || '',
        manager_id: department.manager_id?.toString() || '',
        budget: department.budget?.toString() || '',
        cost_center: department.cost_center || '',
        location: department.location || '',
        status: department.status || 'active',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route('modules.hr.departments.update', department.id));
    };

    const availableParents = departments.filter((dept) => dept.id !== department.id);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${department.name}`} />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl">
                <PageHeader
                    title={`Edit ${department.name}`}
                    description="Update department information and organizational structure"
                    action={
                        <div className="flex space-x-2">
                            <Button type="button" variant="outline" size="sm" onClick={() => router.visit(route('modules.hr.departments.index'))}>
                                <X className="mr-1 h-4 w-4" />
                                Cancel
                            </Button>
                            <Button type="submit" size="sm" disabled={processing || !isDirty} onClick={handleSubmit}>
                                <Save className="mr-1 h-4 w-4" />
                                {processing ? 'Updating...' : 'Update Department'}
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
                                        options={availableParents}
                                        value={data.parent_id}
                                        onChange={(value) => setData('parent_id', value as string)}
                                        optionValue="id"
                                        optionLabel="name"
                                        placeholder="Select parent department"
                                        searchPlaceholder="Search departments..."
                                        emptyMessage="No departments found."
                                        className={errors.parent_id ? 'border-red-500' : ''}
                                    />
                                    <InputError message={errors.parent_id} />
                                    {department.parent && (
                                        <div className="text-muted-foreground text-sm">
                                            Currently under: <span className="font-medium">{department.parent.name}</span>
                                        </div>
                                    )}
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
                                    {department.manager && (
                                        <div className="text-muted-foreground text-sm">
                                            Current manager: <span className="font-medium">{department.manager.name}</span>
                                        </div>
                                    )}
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

                    {/* Operations & Budget Card */}
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

                    {/* Warning Card for Structural Changes */}
                    {(data.parent_id !== (department.parent_id?.toString() || '') ||
                        data.manager_id !== (department.manager_id?.toString() || '')) && (
                        <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20">
                            <CardContent className="pt-4">
                                <div className="flex items-start space-x-3">
                                    <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600 dark:text-amber-400" />
                                    <div>
                                        <h3 className="text-sm font-medium text-amber-800 dark:text-amber-200">
                                            Organizational Structure Changes Detected
                                        </h3>
                                        <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">
                                            You are making changes to the department's reporting structure. This may affect:
                                        </p>
                                        <ul className="mt-1 ml-4 list-disc text-sm text-amber-700 dark:text-amber-300">
                                            <li>Employee access permissions and reporting relationships</li>
                                            <li>Budget allocation and cost center assignments</li>
                                            <li>Workflow approvals and delegation chains</li>
                                        </ul>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Unsaved Changes Warning */}
                    {isDirty && (
                        <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20">
                            <CardContent className="pt-4">
                                <div className="flex items-center space-x-3">
                                    <div className="h-2 w-2 flex-shrink-0 animate-pulse rounded-full bg-blue-600"></div>
                                    <p className="text-sm text-blue-700 dark:text-blue-300">
                                        You have unsaved changes. Don't forget to save your work.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
