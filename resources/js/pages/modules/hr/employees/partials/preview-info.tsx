import EducationInfoCard from '@/components/hr/education-info-card';
import EmergencyContactInfoCard from '@/components/hr/emergency-contact-info-card';
import EmploymentInfoCard from '@/components/hr/employment-info-card';
import PersonalInfoCard from '@/components/hr/personal-info-card';
import WorkExperienceInfoCard from '@/components/hr/work-experience-info-card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type {
    EmployeeEducationForm,
    EmployeeEducationInfo,
    EmployeeEmergencyContactForm,
    EmployeeEmergencyContactInfo,
    EmployeeEmploymentInfo,
    EmployeeEmploymentInfoForm,
    EmployeePersonalInfo,
    EmployeePersonalInfoForm,
    EmployeeWorkExperienceForm,
    EmployeeWorkExperienceInfo,
} from '@/types/hr/employee';
import { router } from '@inertiajs/react';

interface Props {
    onBack: () => void;
    onSubmitSuccess?: () => void;
    personal: EmployeePersonalInfoForm | EmployeePersonalInfo;
    employment: EmployeeEmploymentInfoForm | EmployeeEmploymentInfo;
    education: (EmployeeEducationForm | EmployeeEducationInfo)[];
    workExperience: (EmployeeWorkExperienceForm | EmployeeWorkExperienceInfo)[];
    emergencyContacts: (EmployeeEmergencyContactForm | EmployeeEmergencyContactInfo)[];
}

export function PreviewStep({ onBack, onSubmitSuccess, personal, employment, education, workExperience, emergencyContacts }: Props) {
    const handleSubmit = () => {
        router.post(
            route('modules.hr.employees.store.preview-info'),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    if (onSubmitSuccess) onSubmitSuccess();
                },
            },
        );
    };

    return (
        <div className="space-y-6">
            <h4 className="font-semibold uppercase">Preview Information</h4>

            <Tabs defaultValue="personal" className="w-full space-y-4">
                <TabsList className="flex w-full flex-wrap gap-2">
                    <TabsTrigger value="personal">Personal Info</TabsTrigger>
                    <TabsTrigger value="employment">Employment Info</TabsTrigger>
                    <TabsTrigger value="education">Education</TabsTrigger>
                    <TabsTrigger value="experience">Work Experience</TabsTrigger>
                    <TabsTrigger value="emergency">Emergency Contacts</TabsTrigger>
                </TabsList>

                <TabsContent value="personal">
                    <PersonalInfoCard personal={personal as EmployeePersonalInfo} />
                </TabsContent>

                <TabsContent value="employment">
                    <EmploymentInfoCard employment={employment as EmployeeEmploymentInfo} />
                </TabsContent>

                <TabsContent value="education">
                    <EducationInfoCard education={education as EmployeeEducationInfo[]} />
                </TabsContent>

                <TabsContent value="experience">
                    <WorkExperienceInfoCard work_experience={workExperience as EmployeeWorkExperienceInfo[]} />
                </TabsContent>

                <TabsContent value="emergency">
                    <EmergencyContactInfoCard emergency_contacts={emergencyContacts as EmployeeEmergencyContactInfo[]} />
                </TabsContent>
            </Tabs>

            <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={onBack}>
                    Back
                </Button>
                <Button onClick={handleSubmit}>Finish</Button>
            </div>
        </div>
    );
}
