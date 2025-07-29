import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Combobox } from '@/components/ui/combobox';
import FileUploader from '@/components/ui/file-uploader';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PageHeader } from '@/components/ui/page-header';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { CourseFormData } from '@/types/hr/course';
import { ProgramBasic } from '@/types/hr/program';
import { Head, router, useForm } from '@inertiajs/react';
import { Save, X } from 'lucide-react';
import { useState } from 'react';
import CourseMaterials, { Material } from './partials/course-materials';

const breadcrumbs = [
    { title: 'Dashboard', href: '/modules/hr/dashboard' },
    { title: 'Courses', href: '/modules/hr/courses' },
    { title: 'Create', href: '/modules/hr/courses/create' },
];

type Props = {
    programs: ProgramBasic[];
};

export default function CreateCourse({ programs }: Props) {
    const { data, setData, processing, errors } = useForm<CourseFormData>({
        program_id: '',
        title: '',
        description: '',
        image: null,
    });

    const [materials, setMaterials] = useState<Material[]>([{ title: '', url: '', file: null }]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined && value !== null) formData.append(key, value as unknown as string);
        });
        materials.forEach((mat, idx) => {
            formData.append(`materials[${idx}][title]`, mat.title);
            formData.append(`materials[${idx}][url]`, mat.url);
            if (mat.file) formData.append(`materials[${idx}][file]`, mat.file);
        });
        router.post('/modules/hr/courses', formData);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Course" />
            <PageHeader
                title="Create Course"
                description="Add a new training course."
                action={
                    <div className="flex space-x-2">
                        <Button type="button" variant="outline" size="sm" onClick={() => router.visit('/modules/hr/courses')}>
                            <X /> Cancel
                        </Button>
                        <Button type="submit" size="sm" disabled={processing} form="course-create-form">
                            <Save /> {processing ? 'Saving...' : 'Create Course'}
                        </Button>
                    </div>
                }
            />
            <form id="course-create-form" onSubmit={handleSubmit} encType="multipart/form-data">
                <Card>
                    <CardHeader>
                        <CardTitle>Course Info</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-[170px_1fr]">
                            <div className="w-full max-w-xs">
                                <Label>Thumbnail</Label>
                                <FileUploader
                                    value={undefined}
                                    onChange={(file) => setData('image', file)}
                                    accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] }}
                                    maxFiles={1}
                                />
                                <InputError message={errors.image} />
                            </div>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <Label htmlFor="title">
                                        Title <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="title"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        autoFocus
                                        placeholder="Course title"
                                        disabled={processing}
                                        className={errors.title ? 'border-red-500' : ''}
                                    />
                                    <InputError message={errors.title} />
                                </div>
                                <div>
                                    <Label htmlFor="program_id">Program</Label>
                                    <Combobox
                                        options={programs}
                                        value={data.program_id || ''}
                                        onChange={(val) => setData('program_id', val)}
                                        optionValue="id"
                                        optionLabel="title"
                                        placeholder="Select program"
                                        searchPlaceholder="Search programs..."
                                        emptyMessage="No programs found."
                                        disabled={processing}
                                        className={errors.program_id ? 'border-red-500' : ''}
                                    />
                                    <InputError message={errors.program_id} />
                                </div>
                                <div className="md:col-span-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Course description"
                                        disabled={processing}
                                        className={errors.description ? 'border-red-500' : ''}
                                    />
                                    <InputError message={errors.description} />
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-3">
                            <CourseMaterials materials={materials} onChange={setMaterials} disabled={processing} />
                        </div>
                    </CardContent>
                </Card>
            </form>
        </AppLayout>
    );
}
