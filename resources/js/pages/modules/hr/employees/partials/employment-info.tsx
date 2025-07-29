import { router } from '@inertiajs/react';
import { ChevronsLeft, ChevronsRight } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import { DatePicker } from '@/components/ui/date-picker';
import { Label } from '@/components/ui/label';
import { Department, EmploymentStatus, EmploymentType, Position } from '@/types';
import { EmployeeBasic, EmployeeEmploymentInfo, EmployeeEmploymentInfoForm } from '@/types/hr/employee';

interface Props {
    onNext: () => void;
    onBack: () => void;
    departments: Department[];
    positions: Position[];
    employees: EmployeeBasic[];
    employmentStatuses: EmploymentStatus[];
    employmentTypes: EmploymentType[];
    data: EmployeeEmploymentInfoForm | EmployeeEmploymentInfo;
    setData: (data: Partial<EmployeeEmploymentInfoForm>) => void;
}

export function EmploymentInfoStep({ onNext, onBack, departments, positions, employees, employmentStatuses, employmentTypes, data, setData }: Props) {
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Partial<Record<keyof EmployeeEmploymentInfoForm, string>>>({});

    const handleChange = <K extends keyof EmployeeEmploymentInfoForm>(field: K, value: EmployeeEmploymentInfoForm[K]) => {
        setData({ [field]: value });

        if (errors[field]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        setProcessing(true);

        router.post(route('modules.hr.employees.store.employment-info'), data as EmployeeEmploymentInfoForm, {
            preserveScroll: true,
            onSuccess: () => {
                setProcessing(false);
                onNext();
            },
            onError: (errs) => {
                setProcessing(false);
                setErrors(errs as typeof errors);
            },
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h4 className="font-medium uppercase">Employee Employment Information</h4>

            <div className="grid gap-4 md:grid-cols-3">
                <div>
                    <Label htmlFor="department_id">Department</Label>
                    <Combobox
                        value={data?.department_id ?? ''}
                        onChange={(val) => handleChange('department_id', String(val ?? ''))}
                        options={departments.map((d) => ({ label: d.name, value: String(d.id) }))}
                        placeholder="Select department"
                    />
                    <InputError message={errors.department_id} />
                </div>

                <div>
                    <Label htmlFor="position_id">Position</Label>
                    <Combobox
                        value={data?.position_id ?? ''}
                        onChange={(val) => handleChange('position_id', String(val ?? ''))}
                        options={positions.map((p) => ({ label: p.title, value: String(p.id) }))}
                        placeholder="Select position"
                    />
                    <InputError message={errors.position_id} />
                </div>

                <div>
                    <Label htmlFor="manager_id">Reporting Manager</Label>
                    <Combobox
                        value={data?.manager_id ?? ''}
                        onChange={(val) => handleChange('manager_id', String(val ?? ''))}
                        options={employees.map((m) => ({ label: m.name, value: String(m.id) }))}
                        placeholder="Select manager"
                    />
                    <InputError message={errors.manager_id} />
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <div>
                    <Label htmlFor="employment_type">Employment Type</Label>
                    <Combobox
                        value={data?.employment_type ?? ''}
                        onChange={(val) => handleChange('employment_type', val ?? '')}
                        options={employmentTypes.map((type) => ({
                            label: type.name,
                            value: type.value,
                        }))}
                        placeholder="Select type"
                    />
                    <InputError message={errors.employment_type} />
                </div>

                <div>
                    <Label htmlFor="employment_status">Employment Status</Label>
                    <Combobox
                        value={data?.employment_status ?? ''}
                        onChange={(val) => handleChange('employment_status', val ?? '')}
                        options={employmentStatuses.map((status) => ({
                            label: status.name,
                            value: status.value,
                        }))}
                        placeholder="Select status"
                    />
                    <InputError message={errors.employment_status} />
                </div>

                <div>
                    <Label htmlFor="hire_date">Hire Date</Label>
                    <DatePicker
                        id="hire_date"
                        value={data?.hire_date ?? ''}
                        onChange={(val) => handleChange('hire_date', val)}
                        placeholder="Select hire date"
                    />
                    <InputError message={errors.hire_date} />
                </div>
            </div>

            {(data?.employment_type === 'contract' || data?.employment_status === 'probation') && (
                <div className="grid gap-4 md:grid-cols-3">
                    {data?.employment_type === 'contract' && (
                        <>
                            <div>
                                <Label htmlFor="contract_start_date">Contract Start Date</Label>
                                <DatePicker
                                    id="contract_start_date"
                                    value={data?.contract_start_date ?? ''}
                                    onChange={(val) => handleChange('contract_start_date', val)}
                                    placeholder="Select start date"
                                />
                                <InputError message={errors.contract_start_date} />
                            </div>

                            <div>
                                <Label htmlFor="contract_end_date">Contract End Date</Label>
                                <DatePicker
                                    id="contract_end_date"
                                    value={data?.contract_end_date ?? ''}
                                    onChange={(val) => handleChange('contract_end_date', val)}
                                    placeholder="Select end date"
                                />
                                <InputError message={errors.contract_end_date} />
                            </div>
                        </>
                    )}

                    {data?.employment_status === 'probation' && (
                        <>
                            <div>
                                <Label htmlFor="probation_start_date">Probation Start Date</Label>
                                <DatePicker
                                    id="probation_start_date"
                                    value={data?.probation_start_date ?? ''}
                                    onChange={(val) => handleChange('probation_start_date', val)}
                                    placeholder="Select start date"
                                />
                                <InputError message={errors.probation_start_date} />
                            </div>

                            <div>
                                <Label htmlFor="probation_end_date">Probation End Date</Label>
                                <DatePicker
                                    id="probation_end_date"
                                    value={data?.probation_end_date ?? ''}
                                    onChange={(val) => handleChange('probation_end_date', val)}
                                    placeholder="Select end date"
                                />
                                <InputError message={errors.probation_end_date} />
                            </div>
                        </>
                    )}
                </div>
            )}

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
