import { EmptyState } from '@/components/empty-state';
import CourseCard from '@/components/hr/CourseCard';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/page-header';
import AppLayout from '@/layouts/app-layout';
import { Course } from '@/types/hr/course';
import { Head, router } from '@inertiajs/react';
import { GraduationCap, Plus } from 'lucide-react';
import React from 'react';

const breadcrumbs = [
    { title: 'Dashboard', href: '/modules/hr/dashboard' },
    { title: 'Courses', href: '/modules/hr/courses' },
];

type Props = {
    courses: Course[];
};

const CoursesIndex: React.FC<Props> = ({ courses }) => {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Courses" />
            <PageHeader
                title="Courses"
                description="Browse and manage all training courses."
                action={
                    <Button onClick={() => router.visit(route('modules.hr.courses.create'))} size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        New Course
                    </Button>
                }
            />
            <div className="grid grid-cols-1 gap-6 py-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {courses.length === 0 && (
                    <div className="col-span-full">
                        <EmptyState
                            icon={GraduationCap}
                            title="No Courses"
                            description="There are no courses yet. Get started by creating a new course."
                            primaryAction={{
                                label: 'New Course',
                                onClick: () => router.visit('/modules/hr/courses/create'),
                            }}
                        />
                    </div>
                )}
                {courses.map((course) => (
                    <CourseCard
                        key={course.id}
                        id={course.id}
                        title={course.title}
                        description={course.description || ''}
                        imageUrl={course.image_url || undefined}
                        href={`/modules/hr/courses/${course.id}`}
                        programTitle={course.program?.title}
                        durationMinutes={course.duration_minutes}
                    />
                ))}
            </div>
        </AppLayout>
    );
};

export default CoursesIndex;
