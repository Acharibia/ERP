import { Head, useForm } from '@inertiajs/react';
import { CheckCheck, Circle, Dot, LoaderCircle } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PasswordInput } from '@/components/ui/password-input';
import { Stepper, StepperDescription, StepperItem, StepperSeparator, StepperTitle, StepperTrigger } from '@/components/ui/stepper';
import { Textarea } from '@/components/ui/textarea';

import { Combobox } from '@/components/ui/combobox';
import { PhoneInput } from '@/components/ui/phone-input';
import AuthLayout from '@/layouts/auth-layout';

// Form type definition
type ResellerRegisterForm = {
    // Company Information
    company_name: string;
    company_email: string;
    company_phone: string;

    // Address
    address: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;

    // Admin Information
    contact_name: string;
    contact_email: string;
    contact_phone: string;

    // Security
    password: string;
    password_confirmation: string;
};

// Define the steps
const steps = [
    {
        step: 1,
        title: 'Company',
        description: 'Reseller company information',
    },
    {
        step: 2,
        title: 'Address',
        description: 'Location Information',
    },
    {
        step: 3,
        title: 'Admin',
        description: 'Administrator & security',
    },
];

const countries = [
    { value: 'US', label: 'United States' },
    { value: 'CA', label: 'Canada' },
    { value: 'UK', label: 'United Kingdom' },
    { value: 'AU', label: 'Australia' },
    { value: 'DE', label: 'Germany' },
    { value: 'FR', label: 'France' },
    { value: 'JP', label: 'Japan' },
    { value: 'IN', label: 'India' },
    { value: 'BR', label: 'Brazil' },
    { value: 'SG', label: 'Singapore' },
];

export default function RegisterReseller() {
    // Step management
    const [stepIndex, setStepIndex] = useState(1);

    // Initialize form with Inertia
    const { data, setData, post, processing, errors, reset } = useForm<ResellerRegisterForm>({
        // Company Information
        company_name: '',
        company_email: '',
        company_phone: '',

        // Address
        address: '',
        city: '',
        state: '',
        postal_code: '',
        country: '',

        // Admin Information
        contact_name: '',
        contact_email: '',
        contact_phone: '',

        // Security
        password: '',
        password_confirmation: '',
    });

    // Form submission
    const onSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register.reseller.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    // Field change handler
    const handleChange = (field: keyof ResellerRegisterForm, value: string) => {
        setData(field, value);
    };

    // Custom validation for current step
    const validateCurrentStep = (): boolean => {
        if (stepIndex === 1) {
            // Validate company information
            return Boolean(data.company_name && data.company_email);
        } else if (stepIndex === 2) {
            // Validate address (just country is required)
            return Boolean(data.country);
        } else if (stepIndex === 3) {
            // Validate admin information and password fields
            return Boolean(
                data.contact_name &&
                    data.contact_email &&
                    data.password &&
                    data.password_confirmation &&
                    data.password.length >= 8 &&
                    data.password === data.password_confirmation,
            );
        }
        return false;
    };

    // Navigation functions
    const handleNextStep = () => {
        if (validateCurrentStep()) {
            setStepIndex((prev) => Math.min(steps.length, prev + 1));
        }
    };

    const handlePrevStep = () => {
        setStepIndex((prev) => Math.max(1, prev - 1));
    };

    // Computed values
    const isLastStep = stepIndex === steps.length;
    const isFormValid = validateCurrentStep();

    return (
        <AuthLayout title="Create a Reseller Account" description="Register as a reseller to onboard and manage multiple client businesses">
            <Head title="Register as Reseller" />

            <div className="mx-auto max-w-3xl">
                <form onSubmit={onSubmit} className="space-y-6">
                    <Stepper value={stepIndex} onStepChange={setStepIndex} className="w-full">
                        <div className="grid w-full grid-cols-3">
                            {steps.map((step) => (
                                <StepperItem key={step.step} step={step.step} className="relative">
                                    {step.step !== steps.length && <StepperSeparator />}

                                    <div className="flex flex-col items-center">
                                        <StepperTrigger asChild>
                                            <Button
                                                variant={step.step === stepIndex || step.step < stepIndex ? 'default' : 'outline'}
                                                size="icon"
                                                className="z-10 rounded-full"
                                                disabled={step.step > stepIndex && !validateCurrentStep()}
                                            >
                                                {step.step < stepIndex ? (
                                                    <CheckCheck className="h-5 w-5" />
                                                ) : step.step === stepIndex ? (
                                                    <Circle className="h-5 w-5" />
                                                ) : (
                                                    <Dot className="h-5 w-5" />
                                                )}
                                            </Button>
                                        </StepperTrigger>

                                        <div className="mt-2 flex flex-col items-center text-center">
                                            <StepperTitle>{step.title}</StepperTitle>
                                            <StepperDescription>{step.description}</StepperDescription>
                                        </div>
                                    </div>
                                </StepperItem>
                            ))}
                        </div>

                        <div className="mt-4 flex flex-col gap-4 rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
                            {/* Step 1: Company Information */}
                            {stepIndex === 1 && (
                                <>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="company_name">
                                            Company Name <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="company_name"
                                            type="text"
                                            required
                                            autoFocus
                                            value={data.company_name}
                                            onChange={(e) => handleChange('company_name', e.target.value)}
                                            disabled={processing}
                                            placeholder="Your company name"
                                        />
                                        <InputError message={errors.company_name} />
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label htmlFor="company_email">
                                            Company Email <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="company_email"
                                            type="email"
                                            required
                                            value={data.company_email}
                                            onChange={(e) => handleChange('company_email', e.target.value)}
                                            disabled={processing}
                                            placeholder="company@example.com"
                                        />
                                        <InputError message={errors.company_email} />
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label htmlFor="company_phone">Company Phone</Label>
                                        <PhoneInput
                                            international
                                            defaultCountry="US"
                                            id="company_phone"
                                            type="tel"
                                            value={data.company_phone}
                                            onChange={(value) => handleChange('company_phone', value)}
                                            disabled={processing}
                                            placeholder="+1 (555) 123-4567"
                                        />
                                        <InputError message={errors.company_phone} />
                                    </div>
                                </>
                            )}

                            {/* Step 2: Address Details */}
                            {stepIndex === 2 && (
                                <>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="address">Street Address</Label>
                                        <Textarea
                                            id="address"
                                            value={data.address}
                                            onChange={(e) => handleChange('address', e.target.value)}
                                            disabled={processing}
                                            placeholder="Enter your street address"
                                            className="resize-none"
                                            rows={2}
                                        />
                                        <InputError message={errors.address} />
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="city">City</Label>
                                            <Input
                                                id="city"
                                                type="text"
                                                value={data.city}
                                                onChange={(e) => handleChange('city', e.target.value)}
                                                disabled={processing}
                                                placeholder="City"
                                            />
                                            <InputError message={errors.city} />
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label htmlFor="state">State/Province</Label>
                                            <Input
                                                id="state"
                                                type="text"
                                                value={data.state}
                                                onChange={(e) => handleChange('state', e.target.value)}
                                                disabled={processing}
                                                placeholder="State or Province"
                                            />
                                            <InputError message={errors.state} />
                                        </div>
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="postal_code">Postal/ZIP Code</Label>
                                            <Input
                                                id="postal_code"
                                                type="text"
                                                value={data.postal_code}
                                                onChange={(e) => handleChange('postal_code', e.target.value)}
                                                disabled={processing}
                                                placeholder="Postal or ZIP code"
                                            />
                                            <InputError message={errors.postal_code} />
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label htmlFor="country">
                                                Country <span className="text-red-500">*</span>
                                            </Label>
                                            <Combobox
                                                options={countries}
                                                value={data.country}
                                                onChange={(value) => handleChange('country', value)}
                                                disabled={processing}
                                                placeholder="Select a country"
                                                searchPlaceholder="Search country..."
                                                emptyMessage="No country found."
                                            />
                                            <InputError message={errors.country} />
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Step 3: Administrator Information & Security */}
                            {stepIndex === 3 && (
                                <>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="contact_name">
                                            Admin Name <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="contact_name"
                                            type="text"
                                            required
                                            value={data.contact_name}
                                            onChange={(e) => handleChange('contact_name', e.target.value)}
                                            disabled={processing}
                                            placeholder="Full name of administrator"
                                        />
                                        <InputError message={errors.contact_name} />
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label htmlFor="contact_email">
                                            Admin Email <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="contact_email"
                                            type="email"
                                            required
                                            value={data.contact_email}
                                            onChange={(e) => handleChange('contact_email', e.target.value)}
                                            disabled={processing}
                                            placeholder="admin@example.com"
                                        />
                                        <InputError message={errors.contact_email} />
                                        <p className="mt-1 text-xs text-gray-500">
                                            This email will be used for administrator login and system notifications
                                        </p>
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label htmlFor="contact_phone">Admin Phone</Label>
                                        <PhoneInput
                                            international
                                            defaultCountry="GH"
                                            id="contact_phone"
                                            type="tel"
                                            value={data.contact_phone}
                                            onChange={(value) => handleChange('contact_phone', value)}
                                            disabled={processing}
                                            placeholder="+1 (555) 123-4567"
                                        />
                                        <InputError message={errors.contact_phone} />
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label htmlFor="password">
                                            Password <span className="text-red-500">*</span>
                                        </Label>
                                        <PasswordInput
                                            id="password"
                                            required
                                            autoComplete="new-password"
                                            value={data.password}
                                            onChange={(e) => handleChange('password', e.target.value)}
                                            disabled={processing}
                                            placeholder="Create a secure password"
                                        />
                                        <InputError message={errors.password} />
                                        <p className="mt-1 text-xs text-gray-500">
                                            Must contain at least 8 characters with uppercase, lowercase, numbers, and symbols
                                        </p>
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label htmlFor="password_confirmation">
                                            Confirm Password <span className="text-red-500">*</span>
                                        </Label>
                                        <PasswordInput
                                            id="password_confirmation"
                                            required
                                            value={data.password_confirmation}
                                            onChange={(e) => handleChange('password_confirmation', e.target.value)}
                                            autoComplete="new-password"
                                            disabled={processing}
                                            placeholder="Confirm your password"
                                        />
                                        <InputError message={errors.password_confirmation} />
                                    </div>

                                    <div className="mt-4 text-sm text-gray-500">
                                        By creating an account, you agree to our{' '}
                                        <a href="#" className="text-primary font-medium hover:underline">
                                            Terms of Service
                                        </a>{' '}
                                        and{' '}
                                        <a href="#" className="text-primary font-medium hover:underline">
                                            Privacy Policy
                                        </a>
                                        .
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Navigation buttons */}
                        <div className="mt-3 flex items-center justify-between">
                            <Button type="button" variant="outline" size="sm" onClick={handlePrevStep} disabled={stepIndex === 1 || processing}>
                                Back
                            </Button>

                            <div className="flex items-center gap-3">
                                {!isLastStep ? (
                                    <Button type="button" size="sm" onClick={handleNextStep} disabled={!isFormValid || processing}>
                                        Next
                                    </Button>
                                ) : (
                                    <Button type="submit" size="sm" disabled={!isFormValid || processing}>
                                        {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                        Create Account
                                    </Button>
                                )}
                            </div>
                        </div>
                    </Stepper>

                    <div className="mt-3 text-center text-sm text-gray-500">
                        <div>
                            Already have an account?{' '}
                            <a href={route('login')} className="text-primary font-medium hover:underline">
                                Log in
                            </a>
                        </div>
                        <div className="mt-1">
                            Not a reseller?{' '}
                            <a href={route('register')} className="text-primary font-medium hover:underline">
                                Choose a different account type
                            </a>
                        </div>
                    </div>
                </form>
            </div>
        </AuthLayout>
    );
}
