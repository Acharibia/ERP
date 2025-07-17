import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PageHeader } from '@/components/ui/page-header';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { Save, X } from 'lucide-react';
import { toast } from 'sonner';

export default function Create() {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/modules/hr/dashboard',
        },
        {
            title: 'Shifts',
            href: '/modules/hr/shifts',
        },
        {
            title: 'Create',
            href: '/modules/hr/shifts/create',
        },
    ];

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        start_time: '',
        end_time: '',
        max_employees: '',
        location: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('modules.hr.shifts.store'), {
            onSuccess: () => {
                toast.success('Shift created successfully!', {
                    description: 'The new shift has been added to the system.',
                    duration: 4000,
                });
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Shift" />
            <PageHeader
                title="Create Shift"
                description="Define a new work shift with start/end times and other details."
                action={
                    <div className="flex space-x-2">
                        <Button type="button" variant="outline" size="sm" onClick={() => router.visit(route('modules.hr.shifts.index'))}>
                            <X className="mr-2 h-4 w-4" />
                            Cancel
                        </Button>
                        <Button type="submit" size="sm" disabled={processing} onClick={handleSubmit}>
                            <Save className="mr-2 h-4 w-4" />
                            {processing ? 'Creating...' : 'Create Shift'}
                        </Button>
                    </div>
                }
            />

            <div className="space-y-4">
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle>Shift Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                            <div>
                                <Label htmlFor="name">
                                    Name <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="e.g., Morning Shift"
                                    className={errors.name ? 'border-red-500' : ''}
                                />
                                <InputError message={errors.name} />
                            </div>
                            <div>
                                <Label htmlFor="start_time">
                                    Start Time <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="start_time"
                                    type="time"
                                    value={data.start_time}
                                    onChange={(e) => setData('start_time', e.target.value)}
                                    className={errors.start_time ? 'border-red-500' : ''}
                                />
                                <InputError message={errors.start_time} />
                            </div>
                            <div>
                                <Label htmlFor="end_time">
                                    End Time <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="end_time"
                                    type="time"
                                    value={data.end_time}
                                    onChange={(e) => setData('end_time', e.target.value)}
                                    className={errors.end_time ? 'border-red-500' : ''}
                                />
                                <InputError message={errors.end_time} />
                            </div>
                            <div>
                                <Label htmlFor="max_employees">Max Employees</Label>
                                <Input
                                    id="max_employees"
                                    type="number"
                                    min="1"
                                    value={data.max_employees}
                                    onChange={(e) => setData('max_employees', e.target.value)}
                                    placeholder="e.g., 10"
                                    className={errors.max_employees ? 'border-red-500' : ''}
                                />
                                <InputError message={errors.max_employees} />
                            </div>
                            <div className="lg:col-span-2">
                                <Label htmlFor="location">Location</Label>
                                <Input
                                    id="location"
                                    value={data.location}
                                    onChange={(e) => setData('location', e.target.value)}
                                    placeholder="e.g., Factory Floor 1"
                                    className={errors.location ? 'border-red-500' : ''}
                                />
                                <InputError message={errors.location} />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
