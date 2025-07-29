import EducationInfoCard from '@/components/hr/education-info-card';
import EmergencyContactInfoCard from '@/components/hr/emergency-contact-info-card';
import EmploymentInfoCard from '@/components/hr/employment-info-card';
import PersonalInfoCard from '@/components/hr/personal-info-card';
import WorkExperienceInfoCard from '@/components/hr/work-experience-info-card';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/page-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, ShowEmployeeProps } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Pencil } from 'lucide-react';
import AccessControlInfo from './partials/access-control-info';

export default function ShowEmployee({ initialEmployeeData }: ShowEmployeeProps) {
    const { personal, employment, education, work_experience, emergency_contacts, user } = initialEmployeeData;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/modules/hr/dashboard' },
        { title: 'Employees', href: '/modules/hr/employees' },
        { title: personal?.name, href: `/modules/hr/employees/show/${personal?.employee_id}` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Show ${personal?.name ?? 'Employee'}`} />

            <PageHeader
                title={personal?.name ?? 'Employee Details'}
                description="Detailed overview of this employee’s personal, employment, education and emergency information."
                action={
                    <Button size="sm" onClick={() => router.visit(route('modules.hr.employees.edit', { id: personal?.employee_id }))}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                    </Button>
                }
            />

            <Tabs defaultValue="personal">
                <TabsList className="flex w-full flex-wrap gap-2 overflow-x-scroll">
                    <TabsTrigger value="personal">Personal Info</TabsTrigger>
                    <TabsTrigger value="employment">Employment Info</TabsTrigger>
                    <TabsTrigger value="education">Education</TabsTrigger>
                    <TabsTrigger value="experience">Work Experience</TabsTrigger>
                    <TabsTrigger value="emergency">Emergency Contacts</TabsTrigger>
                    <TabsTrigger value="access">Access Control</TabsTrigger>
                </TabsList>

                <TabsContent value="personal">{personal && <PersonalInfoCard personal={personal} />}</TabsContent>
                {employment && (
                    <TabsContent value="employment">
                        <EmploymentInfoCard employment={employment} />
                    </TabsContent>
                )}
                {education && (
                    <TabsContent value="education">
                        <EducationInfoCard education={education} />
                    </TabsContent>
                )}

                {work_experience && (
                    <TabsContent value="experience">
                        <WorkExperienceInfoCard work_experience={work_experience} />
                    </TabsContent>
                )}

                {emergency_contacts && (
                    <TabsContent value="emergency">
                        <EmergencyContactInfoCard emergency_contacts={emergency_contacts} />
                    </TabsContent>
                )}

                <TabsContent value="access">
                    {user && <AccessControlInfo
                        roles={Array.isArray(user?.roles) ? user.roles : []}
                        permissions={Array.isArray(user?.permissions) ? user.permissions : []}
                        personal={personal}
                    />}
                </TabsContent>
            </Tabs>
        </AppLayout>
    );
}
