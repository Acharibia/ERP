import { EmptyState } from '@/components/empty-state';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import { DatePicker } from '@/components/ui/date-picker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import type { Country, DegreeType, EmployeeEducationInfo } from '@/types';
import { EmployeeEducationForm } from '@/types/employee';
import { router } from '@inertiajs/react';
import { ChevronsLeft, ChevronsRight, GraduationCap, PlusCircle, Trash2 } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

interface Props {
    onNext: () => void;
    onBack: () => void;
    countries: Country[];
    degreeTypes: DegreeType[];
    data: (EmployeeEducationForm | EmployeeEducationInfo)[];
    setData: (newData: EmployeeEducationForm[]) => void;
}

export function EducationStep({ onNext, onBack, countries, degreeTypes, data, setData }: Props) {
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);

    const handleChange = <K extends keyof EmployeeEducationForm>(index: number, field: K, value: EmployeeEducationForm[K]) => {
        const updated = [...data] as EmployeeEducationForm[];
        updated[index] = { ...updated[index], [field]: value };
        setData(updated);
    };

    const addEducation = () => {
        const updated = [...data] as EmployeeEducationForm[];

        updated.push({
            institution: '',
            country_id: '',
            degree_type: '',
            field_of_study: '',
            start_date: '',
            end_date: '',
            graduation_date: '',
            is_completed: false,
            is_current: false,
        });

        setData(updated);
    };

    const removeEducation = (index: number) => {
        const updated = [...data];
        updated.splice(index, 1);
        setData(updated as EmployeeEducationForm[]);
    };

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        setProcessing(true);

        router.post(
            route('modules.hr.employees.store.education-info'),
            { education: data as EmployeeEducationForm[] },
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
                <h4 className="font-semibold uppercase">Education History</h4>
                <Button type="button" variant="outline" size="sm" onClick={addEducation}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Education
                </Button>
            </div>

            {data.length === 0 && (
                <EmptyState
                    icon={GraduationCap}
                    iconSize="h-12 w-12"
                    title="No Education History"
                    description="You haven’t added any education records yet. Start by adding your most recent school."
                    primaryAction={{
                        label: 'Add Education',
                        onClick: addEducation,
                    }}
                />
            )}

            {data.map((edu, index) => (
                <div key={index} className="relative space-y-4 rounded-lg border p-4">
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 text-red-500"
                        onClick={() => removeEducation(index)}
                    >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove</span>
                    </Button>

                    <div className="grid gap-4 md:grid-cols-3">
                        <div>
                            <Label htmlFor={`institution-${index}`}>Institution</Label>
                            <Input
                                id={`institution-${index}`}
                                value={edu.institution}
                                onChange={(e) => handleChange(index, 'institution', e.target.value)}
                                placeholder="e.g. University of Ghana"
                            />
                            <InputError message={errorMap[`education.${index}.institution`]} />
                        </div>

                        <div>
                            <Label htmlFor={`degree_type-${index}`}>Degree Type</Label>
                            <Combobox
                                value={edu.degree_type ?? ''}
                                onChange={(val) => handleChange(index, 'degree_type', String(val ?? ''))}
                                options={degreeTypes.map((d) => ({ label: d.name, value: d.id }))}
                                placeholder="Select degree type"
                            />
                            <InputError message={errorMap[`education.${index}.degree_type`]} />
                        </div>
                        <div>
                            <Label htmlFor={`field_of_study-${index}`}>Field of Study</Label>
                            <Input
                                id={`field_of_study-${index}`}
                                value={edu.field_of_study}
                                onChange={(e) => handleChange(index, 'field_of_study', e.target.value)}
                                placeholder="e.g. Software Engineering"
                            />
                            <InputError message={errorMap[`education.${index}.field_of_study`]} />
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                        <div>
                            <Label htmlFor={`country_id-${index}`}>Country</Label>
                            <Combobox
                                value={edu.country_id ?? ''}
                                onChange={(val) => handleChange(index, 'country_id', String(val ?? ''))}
                                options={countries.map((c) => ({ label: c.name, value: c.id }))}
                                placeholder="Select country"
                            />
                            <InputError message={errorMap[`education.${index}.country_id`]} />
                        </div>
                        <div>
                            <Label htmlFor={`start_date-${index}`}>Start Date</Label>
                            <DatePicker
                                id={`start_date-${index}`}
                                value={edu.start_date ?? ''}
                                onChange={(val) => handleChange(index, 'start_date', val)}
                            />
                            <InputError message={errorMap[`education.${index}.start_date`]} />
                        </div>

                        <div>
                            <Label htmlFor={`end_date-${index}`}>End Date</Label>
                            <DatePicker
                                id={`end_date-${index}`}
                                value={edu.end_date ?? ''}
                                onChange={(val) => handleChange(index, 'end_date', val)}
                            />
                            <InputError message={errorMap[`education.${index}.end_date`]} />
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                        <div>
                            <Label htmlFor={`graduation_date-${index}`}>Graduation Date</Label>
                            <DatePicker
                                id={`graduation_date-${index}`}
                                value={edu.graduation_date ?? ''}
                                onChange={(val) => handleChange(index, 'graduation_date', val)}
                            />
                            <InputError message={errorMap[`education.${index}.graduation_date`]} />
                        </div>
                        <div className="mt-5 flex items-center space-x-2">
                            <Switch
                                id={`is_completed-${index}`}
                                checked={edu.is_completed}
                                onCheckedChange={(val) => handleChange(index, 'is_completed', val)}
                            />
                            <Label htmlFor={`is_completed-${index}`}>Completed</Label>
                        </div>
                        <div className="mt-5 flex items-center space-x-2">
                            <Switch
                                id={`is_current-${index}`}
                                checked={edu.is_current}
                                onCheckedChange={(val) => {
                                    handleChange(index, 'is_current', val);
                                    if (val) {
                                        handleChange(index, 'is_completed', false);
                                        handleChange(index, 'end_date', '');
                                        handleChange(index, 'graduation_date', '');
                                    }
                                }}
                            />
                            <Label htmlFor={`is_current-${index}`}>Currently Enrolled</Label>
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
