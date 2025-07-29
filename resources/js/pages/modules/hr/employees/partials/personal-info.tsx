import FileUploader from '@/components/ui/file-uploader';
import { router } from '@inertiajs/react';
import { ChevronsLeft, ChevronsRight } from 'lucide-react';
import { FormEventHandler, useMemo, useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import { DatePicker } from '@/components/ui/date-picker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PhoneInput } from '@/components/ui/phone-input';
import { Textarea } from '@/components/ui/textarea';

import { Country, Gender, MaritalStatus, State } from '@/types';
import { EmployeePersonalInfo, EmployeePersonalInfoForm } from '@/types/hr/employee';

interface Props {
    countries: Country[];
    states: State[];
    genders: Gender[];
    maritalStatuses: MaritalStatus[];
    onNext: () => void;
    onBack: () => void;
    data: EmployeePersonalInfoForm | EmployeePersonalInfo;
    setData: (data: Partial<EmployeePersonalInfoForm>) => void;
}

export function PersonalInfoStep({ countries, states, genders, maritalStatuses, onNext, onBack, data, setData }: Props) {
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Partial<Record<keyof EmployeePersonalInfoForm, string>>>({});

    const handleChange = <K extends keyof EmployeePersonalInfoForm>(field: K, value: EmployeePersonalInfoForm[K]) => {
        setData({ [field]: value });

        if (errors[field]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const profilePicture = useMemo(() => {
        if (typeof data.profile_picture === 'string') return data.profile_picture;
        if (data.profile_picture instanceof File) return URL.createObjectURL(data.profile_picture);
        return null;
    }, [data.profile_picture]);

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        setProcessing(true);

        router.post(route('modules.hr.employees.store.personal-info'), data as EmployeePersonalInfoForm, {
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
            <h4 className="font-medium uppercase">Employee Personal Information</h4>
            <div className="flex flex-col items-center justify-center">
                <Label className="mb-3" htmlFor="profile_picture">
                    Profile Picture
                </Label>
                <FileUploader
                    className="rounded-full"
                    dropzoneClassName="rounded-full"
                    previewClassName="rounded-full ring-2 ring-muted shadow-lg"
                    value={profilePicture}
                    onChange={(file) => handleChange('profile_picture', file ?? undefined)}
                    accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] }}
                    maxFiles={1}
                />
                <InputError message={errors.profile_picture} />
            </div>
            <div className="grid gap-4 md:grid-cols-3">
                <div className="md:col-span-2">
                    <Label htmlFor="name">
                        Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="name"
                        value={data.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        placeholder="John Doe"
                        className={errors.name ? 'border-red-500' : ''}
                    />
                    <InputError message={errors.name} />
                </div>

                <div>
                    <Label htmlFor="birth_date">
                        Date of Birth <span className="text-red-500">*</span>
                    </Label>
                    <DatePicker
                        id="birth_date"
                        value={data.birth_date ?? ''}
                        onChange={(val) => handleChange('birth_date', val)}
                        placeholder="Birth date"
                        className={errors.birth_date ? 'border-red-500' : ''}
                    />
                    <InputError message={errors.birth_date} />
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <div>
                    <Label htmlFor="gender_id">
                        Gender <span className="text-red-500">*</span>
                    </Label>
                    <Combobox
                        value={data.gender_id ?? ''}
                        onChange={(val) => handleChange('gender_id', val ?? '')}
                        options={genders.map((g) => ({ label: g.name, value: g.id }))}
                        placeholder="Select gender"
                        className={errors.gender_id ? 'border-red-500' : ''}
                    />
                    <InputError message={errors.gender_id} />
                </div>

                <div>
                    <Label htmlFor="marital_status">
                        Marital Status <span className="text-red-500">*</span>
                    </Label>
                    <Combobox
                        value={data.marital_status ?? ''}
                        onChange={(val) => handleChange('marital_status', val ?? '')}
                        options={maritalStatuses.map((status) => ({
                            label: status.name,
                            value: status.id,
                        }))}
                        placeholder="Select status"
                        className={errors.marital_status ? 'border-red-500' : ''}
                    />
                    <InputError message={errors.marital_status} />
                </div>

                <div>
                    <Label htmlFor="nationality">
                        Nationality <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="nationality"
                        value={data.nationality ?? ''}
                        onChange={(e) => handleChange('nationality', e.target.value)}
                        placeholder="e.g. Ghanaian"
                        className={errors.nationality ? 'border-red-500' : ''}
                    />
                    <InputError message={errors.nationality} />
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <div>
                    <Label htmlFor="national_id">
                        National ID Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="national_id"
                        value={data.national_id ?? ''}
                        onChange={(e) => handleChange('national_id', e.target.value)}
                        placeholder="e.g. GHA-XXXXXXXXXXX"
                        className={errors.national_id ? 'border-red-500' : ''}
                    />
                    <InputError message={errors.national_id} />
                </div>
                <div>
                    <Label htmlFor="personal_email">
                        Personal Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="personal_email"
                        value={data.personal_email}
                        onChange={(e) => handleChange('personal_email', e.target.value)}
                        placeholder="you@example.com"
                        className={errors.personal_email ? 'border-red-500' : ''}
                    />
                    <InputError message={errors.personal_email} />
                </div>

                <div>
                    <Label htmlFor="work_email">
                        Work Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="work_email"
                        value={data.work_email ?? ''}
                        onChange={(e) => handleChange('work_email', e.target.value)}
                        placeholder="john@company.com"
                        className={errors.work_email ? 'border-red-500' : ''}
                    />
                    <InputError message={errors.work_email} />
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <div>
                    <Label htmlFor="personal_phone">
                        Personal Phone <span className="text-red-500">*</span>
                    </Label>
                    <PhoneInput
                        international
                        defaultCountry="GH"
                        id="personal_phone"
                        value={data.personal_phone ?? ''}
                        onChange={(val) => handleChange('personal_phone', val)}
                        placeholder="+233..."
                        className={errors.personal_phone ? 'border-red-500 ring-red-500 focus:ring-red-500' : ''}
                    />
                    <InputError message={errors.personal_phone} />
                </div>
                <div>
                    <Label htmlFor="work_phone">
                        Work Phone <span className="text-red-500">*</span>
                    </Label>
                    <PhoneInput
                        international
                        defaultCountry="GH"
                        id="work_phone"
                        value={data.work_phone ?? ''}
                        onChange={(val) => handleChange('work_phone', val)}
                        placeholder="+233..."
                        className={errors.work_phone ? 'border-red-500' : ''}
                    />
                    <InputError message={errors.work_phone} />
                </div>

                <div>
                    <Label htmlFor="country_id">
                        Country <span className="text-red-500">*</span>
                    </Label>
                    <Combobox
                        value={data.country_id ?? ''}
                        onChange={(val) => handleChange('country_id', val ?? '')}
                        options={countries.map((c) => ({ label: c.name, value: c.id }))}
                        placeholder="Select country"
                        searchPlaceholder="Search countries"
                        className={errors.country_id ? 'border-red-500' : ''}
                    />
                    <InputError message={errors.country_id} />
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <div>
                    <Label htmlFor="state_id">
                        State / Region <span className="text-red-500">*</span>
                    </Label>
                    <Combobox
                        value={data.state_id ?? ''}
                        onChange={(val) => handleChange('state_id', val ?? '')}
                        options={states.map((s) => ({ label: s.name, value: s.id }))}
                        placeholder="Select state"
                        className={errors.state_id ? 'border-red-500' : ''}
                    />
                    <InputError message={errors.state_id} />
                </div>
                <div>
                    <Label htmlFor="city">
                        City <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="city"
                        value={data.city ?? ''}
                        onChange={(e) => handleChange('city', e.target.value)}
                        placeholder="City"
                        className={errors.city ? 'border-red-500' : ''}
                    />
                    <InputError message={errors.city} />
                </div>

                <div>
                    <Label htmlFor="postal_code">
                        Postal Code <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="postal_code"
                        value={data.postal_code ?? ''}
                        onChange={(e) => handleChange('postal_code', e.target.value)}
                        placeholder="ZIP/Postal Code"
                        className={errors.postal_code ? 'border-red-500' : ''}
                    />
                    <InputError message={errors.postal_code} />
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <Label htmlFor="address">
                        Address <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                        id="address"
                        value={data.address ?? ''}
                        onChange={(e) => handleChange('address', e.target.value)}
                        placeholder="Street name or P.O. Box"
                        className={errors.address ? 'border-red-500' : ''}
                    />
                    <InputError message={errors.address} />
                </div>

                <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                        id="bio"
                        value={data.bio ?? ''}
                        onChange={(e) => handleChange('bio', e.target.value)}
                        placeholder="Short personal bio"
                        className={errors.bio ? 'border-red-500' : ''}
                    />
                    <InputError message={errors.bio} />
                </div>
            </div>

            <div className="flex justify-between pt-4">
                <Button type="button" onClick={onBack} variant="outline">
                    <ChevronsLeft />
                    Back
                </Button>
                <Button type="submit" disabled={processing}>
                    Save & Continue
                    <ChevronsRight />
                </Button>
            </div>
        </form>
    );
}
