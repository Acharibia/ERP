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
import { BreadcrumbItem, DepartmentBasic, EmploymentTypeOption, Position, PositionFormData, PositionLevelOption } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { Lightbulb, Save, X } from 'lucide-react';
import { toast } from 'sonner';

interface EditProps {
    departments: DepartmentBasic[];
    employmentTypes: EmploymentTypeOption[];
    positionLevels: PositionLevelOption[];
    position: Position;
}

export default function Edit({ departments, employmentTypes, positionLevels, position }: EditProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/modules/hr/dashboard',
        },
        {
            title: 'Positions',
            href: '/modules/hr/positions',
        },
        {
            title: 'Edit',
            href: `/modules/hr/positions/${position.id}/edit`,
        },
    ];

    const { data, setData, patch, processing, errors, isDirty } = useForm({
        title: position.title ?? '',
        code: position.code ?? '',
        description: position.description ?? '',
        requirements: position.requirements ?? '',
        responsibilities: position.responsibilities ?? '',
        department_id: position.department_id ?? '',
        employment_type: position.employment_type ?? 'full-time',
        position_level: position.position_level ?? '',
        min_salary: position.min_salary ?? '',
        max_salary: position.max_salary ?? '',
        status: position.status ?? 'active',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route('modules.hr.positions.update', position.id), {
            onSuccess: () => {
                toast.success('Position updated successfully!', {
                    description: 'The position details have been updated.',
                    duration: 4000,
                });
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${position.title}`} />
            <PageHeader
                title={`Edit ${position.title}`}
                description="Define a new job position with requirements and compensation details"
                action={
                    <div className="flex space-x-2">
                        <Button type="button" variant="outline" size="sm" onClick={() => router.visit(route('modules.hr.positions.index'))}>
                            <X className="mr-2 h-4 w-4" />
                            Cancel
                        </Button>
                        <Button type="submit" size="sm" disabled={processing || !isDirty} onClick={handleSubmit}>
                            <Save className="mr-2 h-4 w-4" />
                            {processing ? 'Updating...' : 'Update Position'}
                        </Button>
                    </div>
                }
            />

            <div className="space-y-4">
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle>Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <div className="lg:col-span-2">
                                <Label htmlFor="title">
                                    Title <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="e.g., Senior Software Engineer"
                                    className={errors.title ? 'border-red-500' : ''}
                                />
                                <InputError message={errors.title} />
                            </div>

                            <div>
                                <Label htmlFor="code">
                                    Code <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="code"
                                    value={data.code}
                                    onChange={(e) => setData('code', e.target.value)}
                                    placeholder="SWE-SR-001"
                                    className={errors.code ? 'border-red-500' : ''}
                                />
                                <InputError message={errors.code} />
                            </div>

                            <div className="flex items-start">
                                <div className="w-full">
                                    <Label>Status</Label>
                                    <div className="mt-2 flex items-center space-x-2">
                                        <Switch
                                            id="status"
                                            checked={data.status === 'active'}
                                            onCheckedChange={(checked) => setData('status', checked ? 'active' : 'inactive')}
                                        />
                                        <Label htmlFor="status" className="text-sm">
                                            {data.status === 'active' ? 'Active' : 'Inactive'}
                                        </Label>
                                    </div>
                                    <InputError message={errors.status} />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Three Column Layout for Details */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Employment Details */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">Employment Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="employment_type">
                                    Type <span className="text-red-500">*</span>
                                </Label>
                                <Combobox
                                    options={employmentTypes}
                                    value={data.employment_type}
                                    onChange={(value) => setData('employment_type', value as PositionFormData['employment_type'])}
                                    optionValue="id"
                                    optionLabel="name"
                                    placeholder="Select type"
                                    searchPlaceholder="Search..."
                                    emptyMessage="No types found."
                                    className={errors.employment_type ? 'border-red-500' : ''}
                                />
                                <InputError message={errors.employment_type} />
                            </div>

                            <div>
                                <Label htmlFor="position_level">Level</Label>
                                <Combobox
                                    options={positionLevels}
                                    value={data.position_level}
                                    onChange={(value) => setData('position_level', value as string)}
                                    optionValue="id"
                                    optionLabel="name"
                                    placeholder="Select level"
                                    searchPlaceholder="Search..."
                                    emptyMessage="No levels found."
                                    className={errors.position_level ? 'border-red-500' : ''}
                                />
                                <InputError message={errors.position_level} />
                            </div>

                            <div>
                                <Label>Department</Label>
                                <Combobox
                                    options={departments}
                                    value={data.department_id}
                                    onChange={(value) => setData('department_id', value as string)}
                                    optionValue="id"
                                    optionLabel="name"
                                    placeholder="Select department"
                                    searchPlaceholder="Search..."
                                    emptyMessage="No departments found."
                                    className={errors.department_id ? 'border-red-500' : ''}
                                />
                                <InputError message={errors.department_id} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Compensation */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">Compensation Range</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="min_salary">Minimum Salary</Label>
                                <div className="relative">
                                    <span className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500">$</span>
                                    <Input
                                        id="min_salary"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.min_salary}
                                        onChange={(e) => setData('min_salary', e.target.value)}
                                        placeholder="50,000"
                                        className={`pl-8 ${errors.min_salary ? 'border-red-500' : ''}`}
                                    />
                                </div>
                                <InputError message={errors.min_salary} />
                            </div>

                            <div>
                                <Label htmlFor="max_salary">Maximum Salary</Label>
                                <div className="relative">
                                    <span className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500">$</span>
                                    <Input
                                        id="max_salary"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.max_salary}
                                        onChange={(e) => setData('max_salary', e.target.value)}
                                        placeholder="80,000"
                                        className={`pl-8 ${errors.max_salary ? 'border-red-500' : ''}`}
                                    />
                                </div>
                                <InputError message={errors.max_salary} />
                            </div>

                            <div className="rounded-lg border border-emerald-200 p-3">
                                <p className="flex items-start gap-1 text-xs font-medium">
                                    <Lightbulb className="mt-0.5 h-3 w-3 flex-shrink-0" /> Leave blank if salary is negotiable or not disclosed
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Overview */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">Quick Overview</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div>
                                <Label htmlFor="description">Brief Description</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="One-line summary of this role..."
                                    rows={10}
                                    className={errors.description ? 'border-red-500' : ''}
                                />
                                <InputError message={errors.description} />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Detailed Information - Full Width */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle>Detailed Job Information</CardTitle>
                        <p className="text-muted-foreground mt-1 text-sm">Define the specific requirements and responsibilities for this position</p>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="requirements" className="text-base font-medium">
                                    Requirements & Qualifications
                                </Label>
                                <p className="text-muted-foreground mb-2 text-sm">Skills, education, experience, and certifications needed</p>
                                <Textarea
                                    id="requirements"
                                    value={data.requirements}
                                    onChange={(e) => setData('requirements', e.target.value)}
                                    placeholder="• Bachelor's degree in Computer Science
• 3+ years of software development experience
• Proficiency in JavaScript, React, Node.js
• Experience with cloud platforms (AWS, Azure)
• Strong problem-solving skills"
                                    rows={8}
                                    className={errors.requirements ? 'border-red-500' : ''}
                                />
                                <InputError message={errors.requirements} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="responsibilities" className="text-base font-medium">
                                    Key Responsibilities
                                </Label>
                                <p className="text-muted-foreground mb-2 text-sm">Primary duties and what this role will be accountable for</p>
                                <Textarea
                                    id="responsibilities"
                                    value={data.responsibilities}
                                    onChange={(e) => setData('responsibilities', e.target.value)}
                                    placeholder="• Design and develop scalable web applications
• Collaborate with cross-functional teams
• Write clean, maintainable code
• Participate in code reviews and architecture decisions
• Mentor junior developers"
                                    rows={8}
                                    className={errors.responsibilities ? 'border-red-500' : ''}
                                />
                                <InputError message={errors.responsibilities} />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                {isDirty && (
                    <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20">
                        <CardContent className="pt-4">
                            <div className="flex items-center space-x-3">
                                <div className="h-2 w-2 flex-shrink-0 animate-pulse rounded-full bg-blue-600"></div>
                                <p className="text-sm text-blue-700 dark:text-blue-300">
                                    You have unsaved changes. Don&apos;t forget to save your work.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
