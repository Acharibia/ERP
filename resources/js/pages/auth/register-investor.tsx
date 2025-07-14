import { Head, useForm } from '@inertiajs/react';
import { CheckCheck, Circle, Dot, LoaderCircle } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PasswordInput } from '@/components/ui/password-input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Stepper, StepperDescription, StepperItem, StepperSeparator, StepperTitle, StepperTrigger } from '@/components/ui/stepper';
import { Textarea } from '@/components/ui/textarea';

import { Combobox } from '@/components/ui/combobox';
import { PhoneInput } from '@/components/ui/phone-input';
import AuthLayout from '@/layouts/auth-layout';

// Form type definition
type InvestorRegisterForm = {
    // Investor information
    type: string;
    name: string;
    company_name: string;
    email: string;
    phone: string;
    tax_id: string;

    // Address
    address: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;

    // Admin credentials
    password: string;
    password_confirmation: string;

    // Additional info
    accreditation_status: string;
    notes: string;
};

// Define the steps
const steps = [
    {
        step: 1,
        title: 'Details',
        description: 'Investor information',
    },
    {
        step: 2,
        title: 'Address',
        description: 'Location information',
    },
    {
        step: 3,
        title: 'Account',
        description: 'Credentials & preferences',
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

const investorTypes = [
    { id: 'individual', label: 'Individual Investor' },
    { id: 'angel', label: 'Angel Investor' },
    { id: 'vc', label: 'Venture Capital' },
    { id: 'pe', label: 'Private Equity' },
    { id: 'corporate', label: 'Corporate Investor' },
    { id: 'institutional', label: 'Institutional Investor' },
];

export default function RegisterInvestor() {
    // Step management
    const [stepIndex, setStepIndex] = useState(1);

    // Initialize form with Inertia
    const { data, setData, post, processing, errors, reset } = useForm<InvestorRegisterForm>({
        // Investor information
        type: '',
        name: '',
        company_name: '',
        email: '',
        phone: '',
        tax_id: '',

        // Address
        address: '',
        city: '',
        state: '',
        postal_code: '',
        country: '',

        // Admin credentials
        password: '',
        password_confirmation: '',

        // Additional info
        accreditation_status: 'pending',
        notes: '',
    });

    // Form submission
    const onSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register.investor.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    // Field change handler
    const handleChange = (field: keyof InvestorRegisterForm, value: string) => {
        setData(field, value);
    };

    // Show company name field only for certain investor types
    const showCompanyField = ['corporate', 'vc', 'pe', 'institutional'].includes(data.type);

    // Custom validation for current step
    const validateCurrentStep = (): boolean => {
        if (stepIndex === 1) {
            // Validate investor information
            if (!data.type || !data.name || !data.email) {
                return false;
            }

            // Validate company name if the investor type requires it
            if (showCompanyField && !data.company_name) {
                return false;
            }

            return true;
        } else if (stepIndex === 2) {
            // Validate address (just country is required)
            return Boolean(data.country);
        } else if (stepIndex === 3) {
            // Validate password fields
            return Boolean(data.password && data.password_confirmation && data.password.length >= 8 && data.password === data.password_confirmation);
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
        <AuthLayout title="Create an Investor Account" description="Register as an investor to discover and invest in businesses">
            <Head title="Register as Investor" />

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
                            {/* Step 1: Investor Information */}
                            {stepIndex === 1 && (
                                <>
                                    <div className="space-y-1.5">
                                        <Label>
                                            Investor Type <span className="text-red-500">*</span>
                                        </Label>
                                        <RadioGroup
                                            value={data.type}
                                            onValueChange={(value) => handleChange('type', value)}
                                            className="grid grid-cols-1 gap-2 md:grid-cols-2"
                                        >
                                            {investorTypes.map((type) => (
                                                <div key={type.id} className="flex items-center space-x-2">
                                                    <RadioGroupItem value={type.id} id={`type-${type.id}`} disabled={processing} />
                                                    <Label htmlFor={`type-${type.id}`} className="cursor-pointer">
                                                        {type.label}
                                                    </Label>
                                                </div>
                                            ))}
                                        </RadioGroup>
                                        <InputError message={errors.type} />
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label htmlFor="name">
                                            {showCompanyField ? 'Contact Name' : 'Full Name'} <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            required
                                            autoFocus
                                            value={data.name}
                                            onChange={(e) => handleChange('name', e.target.value)}
                                            disabled={processing}
                                            placeholder={showCompanyField ? 'Contact person name' : 'Your full name'}
                                        />
                                        <InputError message={errors.name} />
                                    </div>

                                    {showCompanyField && (
                                        <div className="space-y-1.5">
                                            <Label htmlFor="company_name">
                                                Company/Fund Name <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="company_name"
                                                type="text"
                                                required={showCompanyField}
                                                value={data.company_name}
                                                onChange={(e) => handleChange('company_name', e.target.value)}
                                                disabled={processing}
                                                placeholder="Your company or fund name"
                                            />
                                            <InputError message={errors.company_name} />
                                        </div>
                                    )}

                                    <div className="space-y-1.5">
                                        <Label htmlFor="email">
                                            Email Address <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            required
                                            autoComplete="email"
                                            value={data.email}
                                            onChange={(e) => handleChange('email', e.target.value)}
                                            disabled={processing}
                                            placeholder="email@example.com"
                                        />
                                        <InputError message={errors.email} />
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="phone">Phone Number</Label>
                                            <PhoneInput
                                                international
                                                defaultCountry="US"
                                                id="phone"
                                                type="tel"
                                                autoComplete="tel"
                                                value={data.phone}
                                                onChange={(value) => handleChange('phone', value)}
                                                disabled={processing}
                                                placeholder="+1 (555) 123-4567"
                                            />
                                            <InputError message={errors.phone} />
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label htmlFor="tax_id">Tax ID/SSN/EIN</Label>
                                            <Input
                                                id="tax_id"
                                                type="text"
                                                value={data.tax_id}
                                                onChange={(e) => handleChange('tax_id', e.target.value)}
                                                disabled={processing}
                                                placeholder="For tax purposes"
                                            />
                                            <InputError message={errors.tax_id} />
                                        </div>
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

                            {/* Step 3: Account & Preferences */}
                            {stepIndex === 3 && (
                                <>
                                    <div className="space-y-3">
                                        <h3 className="text-base font-medium">Account Security</h3>

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
                                    </div>

                                    <div className="mt-4 space-y-3 border-t border-gray-100 pt-4">
                                        <h3 className="text-base font-medium">Investor Profile</h3>

                                        <div className="space-y-1.5">
                                            <Label htmlFor="notes">Investment Preferences (Optional)</Label>
                                            <Textarea
                                                id="notes"
                                                value={data.notes}
                                                onChange={(e) => handleChange('notes', e.target.value)}
                                                disabled={processing}
                                                placeholder="Share your investment interests, preferred industries, investment size range, etc."
                                                className="resize-none"
                                                rows={3}
                                            />
                                            <InputError message={errors.notes} />
                                        </div>
                                    </div>

                                    <div className="mt-4 rounded-md bg-blue-50 p-3 text-sm text-blue-800">
                                        <p className="text-balance break-words whitespace-normal">
                                            <strong>Accreditation Notice:</strong>
                                            <br />
                                            Your investor accreditation status will be initially set to "pending".
                                            <br />
                                            You'll be able to verify your accreditation status after registration.
                                        </p>
                                    </div>

                                    <div className="mt-4 text-sm text-gray-500">
                                        By creating an account, you agree to our
                                        <a href="#" className="text-primary font-medium hover:underline">
                                            Terms of Service
                                        </a>
                                        and
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
                                        Create Investor Account
                                    </Button>
                                )}
                            </div>
                        </div>
                    </Stepper>

                    <div className="mt-3 text-center text-sm text-gray-500">
                        <div>
                            Already have an account?
                            <a href={route('login')} className="text-primary font-medium hover:underline">
                                Log in
                            </a>
                        </div>
                        <div className="mt-1">
                            Not an investor?
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
