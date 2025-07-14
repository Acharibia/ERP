import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Stepper, StepperDescription, StepperItem, StepperSeparator, StepperTitle, StepperTrigger } from '@/components/ui/stepper';
import type { CreateEmployeeProps, EmployeeEmploymentInfoForm, EmployeeFormData, EmployeePersonalInfoForm } from '@/types/employee';
import { Briefcase, CheckCheck, ClipboardCheck, GraduationCap, PhoneCall, UserCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { EducationStep } from './education-info';
import { EmergencyContactStep } from './emergency-contact-info';
import { EmploymentInfoStep } from './employment-info';
import { PersonalInfoStep } from './personal-info';
import { PreviewStep } from './preview-info';
import { WorkExperienceStep } from './work-experience-info';

const steps = [
    { step: 1, title: 'Personal', description: 'Bio and contacts', icon: UserCircle },
    { step: 2, title: 'Employment', description: 'Role and status', icon: Briefcase },
    { step: 3, title: 'Education', description: 'Academic history', icon: GraduationCap },
    { step: 4, title: 'Experience', description: 'Work background', icon: ClipboardCheck },
    { step: 5, title: 'Emergency', description: 'Contacts', icon: PhoneCall },
    { step: 6, title: 'Preview', description: 'Review & confirm', icon: CheckCheck },
];

type Props = {
    mode: 'create' | 'edit';
} & CreateEmployeeProps;

export default function EmployeeForm({
    mode,
    departments,
    positions,
    employees,
    countries,
    states,
    genders,
    maritalStatuses,
    employmentStatuses,
    employmentTypes,
    degreeTypes,
    initialEmployeeData,
}: Props) {
    const [stepIndex, setStepIndex] = useState(1);

    const [employeeData, setEmployeeData] = useState<EmployeeFormData>(
        initialEmployeeData ?? {
            personal: {
                employee_id: '',
                name: '',
                birth_date: '',
                gender_id: '',
                marital_status: '',
                nationality: '',
                national_id: '',
                personal_email: '',
                work_email: '',
                personal_phone: '',
                work_phone: '',
                address: '',
                city: '',
                state_id: '',
                country_id: '',
                postal_code: '',
                bio: '',
            },
            employment: {
                department_id: '',
                position_id: '',
                manager_id: '',
                hire_date: '',
                work_location: '',
                employment_status: '',
                employment_type: '',
                probation_start_date: '',
                probation_end_date: '',
                contract_start_date: '',
                contract_end_date: '',
            },
            education: [],
            work_experience: [],
            emergency_contacts: [],
        },
    );

    const handleBack = () => setStepIndex((prev) => Math.max(1, prev - 1));
    const handleNext = () => setStepIndex((prev) => Math.min(steps.length, prev + 1));

    const renderStep = () => {
        switch (stepIndex) {
            case 1:
                return (
                    <PersonalInfoStep
                        data={employeeData.personal}
                        setData={(newData) =>
                            setEmployeeData((prev) => ({
                                ...prev,
                                personal: {
                                    ...(prev.personal as EmployeePersonalInfoForm),
                                    ...newData,
                                },
                            }))
                        }
                        onNext={handleNext}
                        onBack={handleBack}
                        countries={countries}
                        states={states}
                        genders={genders}
                        maritalStatuses={maritalStatuses}
                    />
                );
            case 2:
                return (
                    <EmploymentInfoStep
                        data={employeeData.employment}
                        setData={(newData) =>
                            setEmployeeData((prev) => ({
                                ...prev,
                                employment: {
                                    ...(prev.employment as EmployeeEmploymentInfoForm),
                                    ...newData,
                                },
                            }))
                        }
                        onNext={handleNext}
                        onBack={handleBack}
                        departments={departments}
                        positions={positions}
                        employees={employees}
                        employmentStatuses={employmentStatuses}
                        employmentTypes={employmentTypes}
                    />
                );
            case 3:
                return (
                    <EducationStep
                        onNext={handleNext}
                        onBack={handleBack}
                        countries={countries}
                        degreeTypes={degreeTypes}
                        data={employeeData.education}
                        setData={(newData) => setEmployeeData((prev) => ({ ...prev, education: newData }))}
                    />
                );
            case 4:
                return (
                    <WorkExperienceStep
                        onNext={handleNext}
                        onBack={handleBack}
                        data={employeeData.work_experience}
                        setData={(newData) => setEmployeeData((prev) => ({ ...prev, work_experience: newData }))}
                    />
                );
            case 5:
                return (
                    <EmergencyContactStep
                        onNext={handleNext}
                        onBack={handleBack}
                        countries={countries}
                        states={states}
                        data={employeeData.emergency_contacts}
                        setData={(newData) => setEmployeeData((prev) => ({ ...prev, emergency_contacts: newData }))}
                    />
                );
            case 6:
                return (
                    <PreviewStep
                        onBack={handleBack}
                        onSubmitSuccess={() => {
                            toast.success(mode === 'edit' ? 'Employee updated successfully!' : 'Employee created successfully!');
                        }}
                        personal={employeeData.personal}
                        employment={employeeData.employment}
                        education={employeeData.education}
                        workExperience={employeeData.work_experience}
                        emergencyContacts={employeeData.emergency_contacts}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <>
            <Stepper value={stepIndex} onStepChange={setStepIndex}>
                <div className="grid w-full grid-cols-6">
                    {steps.map((step) => (
                        <StepperItem key={step.step} step={step.step} className="relative" icon={step.icon}>
                            {step.step !== steps.length && <StepperSeparator />}
                            <div className="flex flex-col items-center">
                                <StepperTrigger asChild>
                                    <Button
                                        variant={step.step === stepIndex || step.step < stepIndex ? 'default' : 'outline'}
                                        size="icon"
                                        className="z-10 rounded-full"
                                        disabled={step.step > stepIndex}
                                    >
                                        {step.step < stepIndex ? <CheckCheck className="h-5 w-5" /> : <step.icon className="h-5 w-5" />}
                                    </Button>
                                </StepperTrigger>
                                <div className="text-center">
                                    <StepperTitle>{step.title}</StepperTitle>
                                    <StepperDescription>{step.description}</StepperDescription>
                                </div>
                            </div>
                        </StepperItem>
                    ))}
                </div>
            </Stepper>

            <Card className="border-0 py-0">{renderStep()}</Card>
        </>
    );
}
