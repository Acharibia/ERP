import { EmptyState } from '@/components/empty-state';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PhoneInput } from '@/components/ui/phone-input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { EmployeeWorkExperienceForm, EmployeeWorkExperienceInfo } from '@/types/hr/employee';
import { router } from '@inertiajs/react';
import { Briefcase, ChevronsLeft, ChevronsRight, PlusCircle, Trash2 } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

interface Props {
    onNext: () => void;
    onBack: () => void;
    data: (EmployeeWorkExperienceForm | EmployeeWorkExperienceInfo)[];
    setData: (data: EmployeeWorkExperienceForm[]) => void;
}

export function WorkExperienceStep({ onNext, onBack, data, setData }: Props) {
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);

    const handleChange = <K extends keyof EmployeeWorkExperienceForm>(index: number, field: K, value: EmployeeWorkExperienceForm[K]) => {
        const updated = [...data] as EmployeeWorkExperienceForm[];
        updated[index] = { ...updated[index], [field]: value };
        setData(updated);
    };

    const addExperience = () => {
        setData([
            ...data,
            {
                company_name: '',
                job_title: '',
                start_date: '',
                end_date: '',
                is_current: false,
                responsibilities: '',
                achievements: '',
                company_location: '',
                reference_name: '',
                reference_contact: '',
            },
        ] as EmployeeWorkExperienceForm[]);
    };

    const removeExperience = (index: number) => {
        const updated = [...data];
        updated.splice(index, 1);
        setData(updated as EmployeeWorkExperienceForm[]);
    };

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        setProcessing(true);

        router.post(
            route('modules.hr.employees.store.work-experience-info'),
            { work_experience: data as EmployeeWorkExperienceForm[] },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setProcessing(false);
                    onNext();
                },
                onError: (errs) => {
                    setProcessing(false);
                    setErrors(errs);
                },
            },
        );
    };

    const errorMap = errors;

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center justify-between">
                <h4 className="font-semibold uppercase">Work Experience</h4>
                <Button type="button" variant="outline" size="sm" onClick={addExperience}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Experience
                </Button>
            </div>

            {data.length === 0 && (
                <EmptyState
                    icon={Briefcase}
                    iconSize="h-12 w-12"
                    title="No Work Experience"
                    description="You haven’t added any work experience records yet. Start with your most recent job."
                    primaryAction={{
                        label: 'Add Experience',
                        onClick: addExperience,
                    }}
                />
            )}

            {data.map((work, index) => (
                <div key={index} className="relative space-y-4 rounded-lg border p-4">
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 text-red-500"
                        onClick={() => removeExperience(index)}
                    >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove</span>
                    </Button>

                    <div className="grid gap-4 md:grid-cols-3">
                        <div>
                            <Label htmlFor={`company_name-${index}`}>Company Name</Label>
                            <Input
                                id={`company_name-${index}`}
                                value={work.company_name}
                                onChange={(e) => handleChange(index, 'company_name', e.target.value)}
                                placeholder="e.g. Google Inc."
                            />
                            <InputError message={errorMap[`work_experience.${index}.company_name`]} />
                        </div>

                        <div>
                            <Label htmlFor={`job_title-${index}`}>Job Title</Label>
                            <Input
                                id={`job_title-${index}`}
                                value={work.job_title}
                                onChange={(e) => handleChange(index, 'job_title', e.target.value)}
                                placeholder="e.g. Software Engineer"
                            />
                            <InputError message={errorMap[`work_experience.${index}.job_title`]} />
                        </div>
                        <div>
                            <Label htmlFor={`company_location-${index}`}>Company Location</Label>
                            <Input
                                id={`company_location-${index}`}
                                value={work.company_location}
                                onChange={(e) => handleChange(index, 'company_location', e.target.value)}
                                placeholder="e.g. Accra, Ghana"
                            />
                            <InputError message={errorMap[`work_experience.${index}.company_location`]} />
                        </div>
                    </div>

                    <div className="grid items-center gap-4 md:grid-cols-3">
                        <div>
                            <Label htmlFor={`start_date-${index}`}>Start Date</Label>
                            <DatePicker
                                id={`start_date-${index}`}
                                value={work.start_date ?? ''}
                                onChange={(val) => handleChange(index, 'start_date', val)}
                            />
                            <InputError message={errorMap[`work_experience.${index}.start_date`]} />
                        </div>

                        {!work.is_current && (
                            <div>
                                <Label htmlFor={`end_date-${index}`}>End Date</Label>
                                <DatePicker
                                    id={`end_date-${index}`}
                                    value={work.end_date ?? ''}
                                    onChange={(val) => handleChange(index, 'end_date', val)}
                                />
                                <InputError message={errorMap[`work_experience.${index}.end_date`]} />
                            </div>
                        )}

                        <div className="flex items-center space-x-2 pt-6">
                            <Switch
                                id={`is_current-${index}`}
                                checked={work.is_current}
                                onCheckedChange={(val) => handleChange(index, 'is_current', val)}
                            />
                            <Label htmlFor={`is_current-${index}`}>Currently Working Here</Label>
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <Label htmlFor={`responsibilities-${index}`}>Responsibilities</Label>
                            <Textarea
                                id={`responsibilities-${index}`}
                                value={work.responsibilities}
                                onChange={(e) => handleChange(index, 'responsibilities', e.target.value)}
                                placeholder="e.g. Built web apps"
                            />
                            <InputError message={errorMap[`work_experience.${index}.responsibilities`]} />
                        </div>
                        <div>
                            <Label htmlFor={`achievements-${index}`}>Achievements</Label>
                            <Textarea
                                id={`achievements-${index}`}
                                value={work.achievements}
                                onChange={(e) => handleChange(index, 'achievements', e.target.value)}
                                placeholder="e.g. Employee of the Month"
                            />
                            <InputError message={errorMap[`work_experience.${index}.achievements`]} />
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <Label htmlFor={`reference_name-${index}`}>Reference Name</Label>
                            <Input
                                id={`reference_name-${index}`}
                                value={work.reference_name}
                                onChange={(e) => handleChange(index, 'reference_name', e.target.value)}
                                placeholder="e.g. John Doe"
                            />
                            <InputError message={errorMap[`work_experience.${index}.reference_name`]} />
                        </div>
                        <div>
                            <Label htmlFor={`reference_contact-${index}`}>Reference Contact</Label>
                            <PhoneInput
                                international
                                defaultCountry="GH"
                                id={`reference_contact-${index}`}
                                value={work.reference_contact}
                                onChange={(val) => handleChange(index, 'reference_contact', val)}
                                placeholder="e.g. +233 20 000 0000"
                            />
                            <InputError message={errorMap[`work_experience.${index}.reference_contact`]} />
                        </div>
                    </div>
                </div>
            ))}

            <div className="flex justify-between pt-4">
                <Button type="button" onClick={onBack} variant="outline">
                    <ChevronsLeft className="mr-2 h-4 w-4" />
                    Back
                </Button>
                <Button type="submit" disabled={processing}>
                    Save & Continue
                    <ChevronsRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </form>
    );
}
