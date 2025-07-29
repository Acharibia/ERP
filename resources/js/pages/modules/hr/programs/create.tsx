import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PageHeader } from '@/components/ui/page-header';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { ProgramFormData } from '@/types/hr/program';
import { Head, router, useForm } from '@inertiajs/react';
import { Save, X } from 'lucide-react';

const breadcrumbs = [
    { title: 'Dashboard', href: '/modules/hr/dashboard' },
    { title: 'Training Programs', href: '/modules/hr/programs' },
    { title: 'Create', href: '/modules/hr/programs/create' },
];

export default function CreateProgram() {
    const { data, setData, post, processing, errors } = useForm<ProgramFormData>({
        title: '',
        description: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/modules/hr/programs');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Program" />
            <PageHeader
                title="Create Program"
                description="Add a new training program."
                action={
                    <div className="flex space-x-2">
                        <Button type="button" variant="outline" size="sm" onClick={() => router.visit('/modules/hr/programs')}>
                            <X /> Cancel
                        </Button>
                        <Button type="submit" size="sm" disabled={processing} form="program-create-form">
                            <Save /> {processing ? 'Saving...' : 'Create Program'}
                        </Button>
                    </div>
                }
            />
            <form id="program-create-form" onSubmit={handleSubmit} encType="multipart/form-data">
                <Card>
                    <CardHeader>
                        <CardTitle>Program Info</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="title">
                                Title <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="title"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                autoFocus
                                placeholder="Program title"
                                disabled={processing}
                                className={errors.title ? 'border-red-500' : ''}
                            />
                            <InputError message={errors.title} />
                        </div>
                        <div>
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Program description"
                                disabled={processing}
                                className={errors.description ? 'border-red-500' : ''}
                            />
                            <InputError message={errors.description} />
                        </div>
                    </CardContent>
                </Card>
            </form>
        </AppLayout>
    );
}
