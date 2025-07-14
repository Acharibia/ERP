import { Head, useForm } from '@inertiajs/react';
import {
    Briefcase,
    Calendar,
    CheckCheck,
    CheckCircle2,
    Circle,
    ClipboardCheck,
    Dot,
    LoaderCircle,
    MapPin,
    Package,
    TicketCheck,
    UserCircle,
} from 'lucide-react';
import { FormEventHandler, useState } from 'react';

import InputError from '@/components/input-error';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PasswordInput } from '@/components/ui/password-input';
import { Stepper, StepperDescription, StepperItem, StepperSeparator, StepperTitle, StepperTrigger } from '@/components/ui/stepper';

import { Checkbox } from '@/components/ui/checkbox';
import { Combobox } from '@/components/ui/combobox';
import { PhoneInput } from '@/components/ui/phone-input';
import AuthLayout from '@/layouts/auth-layout';
import { BusinessRegisterForm, FormStep, RegisterBusinessProps } from '@/types/business-register';
import { PageProps } from '@/types';

// Define the steps
const steps: FormStep[] = [
    {
        step: 1,
        title: 'Business',
        description: 'Basic company information',
        icon: Briefcase,
    },
    {
        step: 2,
        title: 'Address',
        description: 'Location details',
        icon: MapPin,
    },
    {
        step: 3,
        title: 'Account',
        description: 'Administrator setup',
        icon: UserCircle,
    },
    {
        step: 4,
        title: 'Package',
        description: 'Subscription plan',
        icon: Package,
    },
    {
        step: 5,
        title: 'Review',
        description: 'Confirm details',
        icon: ClipboardCheck,
    },
];

export default function RegisterBusiness({ packages, countries, states, industries }: RegisterBusinessProps) {
    // Step management
    const [stepIndex, setStepIndex] = useState(1);
    const [stepValidating, setStepValidating] = useState(false);

    // Initialize form with Inertia
    const { data, setData, post, processing, errors, clearErrors } = useForm<BusinessRegisterForm>({
        name: '',
        registration_number: '',
        email: '',
        phone: '',
        website: '',
        address_line_1: '',
        address_line_2: '',
        city: '',
        state_id: '',
        postal_code: '',
        country_id: '',
        industry_id: '',
        contact_name: '',
        contact_email: '',
        password: '',
        password_confirmation: '',
        package_id: '',
        billing_cycle: 'monthly',
        start_trial: true, // Default to starting with a trial
        step: 1, // Add current step to form data for backend validation
    });

    // Form submission
    const onSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        // Update step in form data
        setData('step', stepIndex);

        // Final submit on the last step
        if (stepIndex === steps.length) {
            post(route('register.business.store'));
        } else {
            // Otherwise, validate and go to next step if valid
            validateStep();
        }
    };

    // Field change handler
    const handleChange = (field: keyof BusinessRegisterForm, value: string | boolean) => {
        setData(field, value);

        // Clear error for this field when user makes changes
        if (errors[field]) {
            clearErrors(field);
        }
    };

    // Get selected package details
    const getSelectedPackage = () => {
        if (!data.package_id) return null;
        return packages.data.find((pkg) => pkg.id.toString() === data.package_id);
    };

    // Calculate price based on billing cycle
    const calculatePrice = (basePrice: number, billingCycle: string): string => {
        if (billingCycle === 'annual') {
            return (basePrice * 12 * 0.8).toFixed(2); // 20% discount for annual
        }
        return basePrice.toFixed(2);
    };

    // Validate current step with backend before proceeding
    const validateStep = () => {
        setStepValidating(true);

        setData('step', stepIndex);

        post(route('register.business.store', { validate_only: true }), {
            preserveScroll: true,
            onSuccess: (page) => {
                const props = page.props as unknown as PageProps;

                if (props.flash?.success) {
                    setStepIndex((prev) => Math.min(steps.length, prev + 1));
                    clearErrors();
                }
            },
            onError: (errors) => {
                console.error('Validation errors:', errors);
            },
            onFinish: () => {
                setStepValidating(false);
            },
        });
    };

    // Navigation functions
    const handleNextStep = () => {
        validateStep();
    };

    const handlePrevStep = () => {
        clearErrors();
        setStepIndex((prev) => Math.max(1, prev - 1));
    };

    // Computed values
    const isLastStep = stepIndex === steps.length;
    const selectedPackage = getSelectedPackage();

    // Trial info
    const trialDays = 30; // Number of days in trial period

    // Filter states by selected country
    const filteredStates = data.country_id ? states.filter((state) => state.country_id === data.country_id) : states;

    return (
        <AuthLayout title="Create a Business Account" description="Register your business to access our ERP platform">
            <Head title="Register Business" />

            <div className="mx-auto max-w-4xl">
                <form onSubmit={onSubmit} className="space-y-6">
                    {/* Free Trial Banner */}
                    <div className="from-primary/20 to-primary/5 border-primary/20 mb-6 rounded-lg border bg-gradient-to-r p-4">
                        <div className="flex items-start gap-3">
                            <Calendar className="text-primary h-6 w-6" />
                            <div>
                                <h3 className="text-primary font-bold">30-Day Free Trial Included</h3>
                                <p className="text-sm text-gray-700">
                                    Try all modules and features with no commitment. No credit card required to start.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* General validation error message */}
                    {errors.general && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertDescription>{errors.general}</AlertDescription>
                        </Alert>
                    )}

                    <Stepper value={stepIndex} onStepChange={setStepIndex} className="w-full">
                        <div className="grid w-full grid-cols-5">
                            {steps.map((step) => (
                                <StepperItem key={step.step} step={step.step} className="relative" icon={step.icon}>
                                    {step.step !== steps.length && <StepperSeparator />}

                                    <div className="flex flex-col items-center">
                                        <StepperTrigger asChild>
                                            <Button
                                                variant={step.step === stepIndex || step.step < stepIndex ? 'default' : 'outline'}
                                                size="icon"
                                                className="z-10 rounded-full"
                                                disabled={step.step > stepIndex} // Disable future steps until validated
                                            >
                                                {step.step < stepIndex ? (
                                                    <CheckCheck className="h-5 w-5" />
                                                ) : step.step === stepIndex ? (
                                                    step.icon ? (
                                                        <step.icon className="h-5 w-5" />
                                                    ) : (
                                                        <Circle className="h-5 w-5" />
                                                    )
                                                ) : (
                                                    <Dot className="h-5 w-5" />
                                                )}
                                            </Button>
                                        </StepperTrigger>

                                        <div className="flex flex-col items-center text-center">
                                            <StepperTitle>{step.title}</StepperTitle>
                                            <StepperDescription>{step.description}</StepperDescription>
                                        </div>
                                    </div>
                                </StepperItem>
                            ))}
                        </div>

                        <div className="mt-4 flex flex-col gap-4 rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
                            {/* Step 1: Business Information */}
                            {stepIndex === 1 && (
                                <>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="name">
                                            Business Name <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            autoFocus
                                            value={data.name}
                                            onChange={(e) => handleChange('name', e.target.value)}
                                            disabled={processing || stepValidating}
                                            placeholder="Your business name"
                                            className={errors.name ? 'border-red-500' : ''}
                                        />
                                        <InputError message={errors.name} />
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label htmlFor="registration_number">Registration Number</Label>
                                        <Input
                                            id="registration_number"
                                            type="text"
                                            value={data.registration_number}
                                            onChange={(e) => handleChange('registration_number', e.target.value)}
                                            disabled={processing || stepValidating}
                                            placeholder="Business registration/ID number"
                                            className={errors.registration_number ? 'border-red-500' : ''}
                                        />
                                        <InputError message={errors.registration_number} />
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label htmlFor="email">
                                            Business Email <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => handleChange('email', e.target.value)}
                                            disabled={processing || stepValidating}
                                            placeholder="business@example.com"
                                            className={errors.email ? 'border-red-500' : ''}
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
                                                disabled={processing || stepValidating}
                                                placeholder="+1 (555) 123-4567"
                                            />
                                            <InputError message={errors.phone} />
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label htmlFor="website">Website</Label>
                                            <Input
                                                id="website"
                                                type="url"
                                                value={data.website}
                                                onChange={(e) => handleChange('website', e.target.value)}
                                                disabled={processing || stepValidating}
                                                placeholder="https://example.com"
                                                className={errors.website ? 'border-red-500' : ''}
                                            />
                                            <InputError message={errors.website} />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label htmlFor="industry_id">
                                            Industry <span className="text-red-500">*</span>
                                        </Label>
                                        <Combobox
                                            options={industries}
                                            value={data.industry_id}
                                            onChange={(value) => handleChange('industry_id', value ?? '')}
                                            optionValue="id"
                                            optionLabel="name"
                                            disabled={processing || stepValidating}
                                            placeholder="Select your industry"
                                            searchPlaceholder="Search industries..."
                                            emptyMessage="No industry found."
                                        />
                                        <InputError message={errors.industry_id} />
                                    </div>
                                </>
                            )}

                            {/* Step 2: Address Details */}
                            {stepIndex === 2 && (
                                <>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="address_line_1">Address Line 1</Label>
                                        <Input
                                            id="address_line_1"
                                            type="text"
                                            value={data.address_line_1}
                                            onChange={(e) => handleChange('address_line_1', e.target.value)}
                                            disabled={processing || stepValidating}
                                            placeholder="Street address, P.O. box, company name"
                                            className={errors.address_line_1 ? 'border-red-500' : ''}
                                        />
                                        <InputError message={errors.address_line_1} />
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label htmlFor="address_line_2">Address Line 2</Label>
                                        <Input
                                            id="address_line_2"
                                            type="text"
                                            value={data.address_line_2}
                                            onChange={(e) => handleChange('address_line_2', e.target.value)}
                                            disabled={processing || stepValidating}
                                            placeholder="Apartment, suite, unit, building, floor, etc."
                                            className={errors.address_line_2 ? 'border-red-500' : ''}
                                        />
                                        <InputError message={errors.address_line_2} />
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="city">City</Label>
                                            <Input
                                                id="city"
                                                type="text"
                                                value={data.city}
                                                onChange={(e) => handleChange('city', e.target.value)}
                                                disabled={processing || stepValidating}
                                                placeholder="City"
                                                className={errors.city ? 'border-red-500' : ''}
                                            />
                                            <InputError message={errors.city} />
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label htmlFor="country">
                                                Country <span className="text-red-500">*</span>
                                            </Label>
                                            <Combobox
                                                options={countries}
                                                value={data.country_id}
                                                optionValue="id"
                                                optionLabel="name"
                                                onChange={(value) => handleChange('country_id', value)}
                                                disabled={processing || stepValidating}
                                                placeholder="Select a country"
                                                searchPlaceholder="Search country..."
                                                emptyMessage="No country found."
                                            />
                                            <InputError message={errors.country_id} />
                                        </div>
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="state">State/Province</Label>
                                            <Combobox
                                                options={filteredStates}
                                                value={data.state_id}
                                                optionValue="id"
                                                optionLabel="name"
                                                onChange={(value) => handleChange('state_id', value)}
                                                disabled={processing || stepValidating || !data.country_id}
                                                placeholder={data.country_id ? 'Select a state' : 'Select a country first'}
                                                searchPlaceholder="Search state..."
                                                emptyMessage="No state found."
                                            />
                                            <InputError message={errors.country_id} />
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label htmlFor="postal_code">Postal/ZIP Code</Label>
                                            <Input
                                                id="postal_code"
                                                type="text"
                                                value={data.postal_code}
                                                onChange={(e) => handleChange('postal_code', e.target.value)}
                                                disabled={processing || stepValidating}
                                                placeholder="Postal or ZIP code"
                                                className={errors.postal_code ? 'border-red-500' : ''}
                                            />
                                            <InputError message={errors.postal_code} />
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Step 3: Account Setup */}
                            {stepIndex === 3 && (
                                <>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="contact_name">
                                            Admin Name <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="contact_name"
                                            type="text"
                                            value={data.contact_name}
                                            onChange={(e) => handleChange('contact_name', e.target.value)}
                                            disabled={processing || stepValidating}
                                            placeholder="Full name of administrator"
                                            className={errors.contact_name ? 'border-red-500' : ''}
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
                                            value={data.contact_email}
                                            onChange={(e) => handleChange('contact_email', e.target.value)}
                                            disabled={processing || stepValidating}
                                            placeholder="admin@example.com"
                                            className={errors.contact_email ? 'border-red-500' : ''}
                                        />
                                        <InputError message={errors.contact_email} />
                                        <p className="mt-1 text-xs text-gray-500">
                                            This email will be used for administrator login and system notifications
                                        </p>
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label htmlFor="password">
                                            Password <span className="text-red-500">*</span>
                                        </Label>
                                        <PasswordInput
                                            id="password"
                                            autoComplete="new-password"
                                            value={data.password}
                                            onChange={(e) => handleChange('password', e.target.value)}
                                            disabled={processing || stepValidating}
                                            placeholder="Create a secure password"
                                            className={errors.password ? 'border-red-500' : ''}
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
                                            value={data.password_confirmation}
                                            onChange={(e) => handleChange('password_confirmation', e.target.value)}
                                            autoComplete="new-password"
                                            disabled={processing || stepValidating}
                                            placeholder="Confirm your password"
                                            className={errors.password_confirmation ? 'border-red-500' : ''}
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

                            {/* Step 4: Package Selection */}
                            {stepIndex === 4 && (
                                <>
                                    <div className="mb-4">
                                        <h3 className="text-lg font-medium text-gray-900">Choose a Subscription Package</h3>
                                        <p className="text-sm text-gray-500">Select the package that best fits your business needs.</p>
                                    </div>

                                    <Alert className="mb-4 flex border-green-200 bg-green-50">
                                        <div className="flex items-start gap-2">
                                            <TicketCheck className="h-5 w-5 text-green-600" />
                                            <AlertDescription className="text-green-700">
                                                <strong>Free {trialDays}-Day Trial:</strong> You'll get access to all modules and features during your
                                                trial period, regardless of package selection.
                                            </AlertDescription>
                                        </div>
                                    </Alert>

                                    <div className="space-y-4">
                                        <div className="mb-2 flex justify-end">
                                            <div className="inline-flex items-center rounded-full bg-gray-100 p-1">
                                                <Button
                                                    variant={data.billing_cycle === 'monthly' ? 'default' : 'ghost'}
                                                    size="sm"
                                                    onClick={() => handleChange('billing_cycle', 'monthly')}
                                                    className="rounded-full text-xs font-medium"
                                                    disabled={processing || stepValidating}
                                                >
                                                    Monthly
                                                </Button>
                                                <Button
                                                    variant={data.billing_cycle === 'annual' ? 'default' : 'ghost'}
                                                    size="sm"
                                                    onClick={() => handleChange('billing_cycle', 'annual')}
                                                    className="rounded-full text-xs font-medium"
                                                    disabled={processing || stepValidating}
                                                >
                                                    Annual (Save 20%)
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="grid gap-4 md:grid-cols-3">
                                            {packages.data.map((pkg) => {
                                                const price = calculatePrice(pkg.base_price, data.billing_cycle);

                                                return (
                                                    <div
                                                        key={pkg.id}
                                                        className={`relative flex cursor-pointer flex-col rounded-lg border p-4 transition-all ${
                                                            data.package_id === pkg.id.toString()
                                                                ? 'border-primary bg-primary/5 shadow-sm'
                                                                : 'border-gray-200 bg-white hover:border-gray-300'
                                                        } ${errors.package_id ? 'border-red-500' : ''}`}
                                                        onClick={() => handleChange('package_id', pkg.id.toString())}
                                                    >
                                                        <div className="mb-4 flex items-center justify-between">
                                                            <div>
                                                                <h3 className="text-lg font-medium text-gray-900">{pkg.name}</h3>
                                                                <p className="text-sm text-gray-500">{pkg.description}</p>
                                                            </div>
                                                        </div>

                                                        <div className="mb-4">
                                                            <div className="flex items-baseline">
                                                                <span className="text-2xl font-bold">${price}</span>
                                                                <span className="ml-1 text-gray-500">
                                                                    /{data.billing_cycle === 'annual' ? 'year' : 'month'}
                                                                </span>
                                                            </div>
                                                            <div className="text-xs text-gray-500">
                                                                {pkg.user_limit ? `${pkg.user_limit} users` : 'Unlimited users'},
                                                                {pkg.storage_limit ? ` ${pkg.storage_limit}GB storage` : ' Unlimited storage'}
                                                            </div>
                                                            <div className="text-primary mt-2 text-xs font-medium">
                                                                Free for {trialDays} days with trial
                                                            </div>
                                                        </div>

                                                        <div className="mb-4 flex-grow">
                                                            <h4 className="mb-2 text-sm font-medium">Included Modules:</h4>
                                                            <ul className="space-y-2">
                                                                {pkg.modules.map((module) => (
                                                                    <li key={module.id} className="flex items-center text-sm">
                                                                        <CheckCheck className="mr-2 h-4 w-4 text-green-500" />
                                                                        {module.name}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>

                                                        {/* Visual indicator of selection instead of a button */}
                                                        <div
                                                            className={`mt-4 flex items-center justify-center gap-2 rounded-md py-2 text-center ${
                                                                data.package_id === pkg.id.toString()
                                                                    ? 'bg-primary font-medium text-white'
                                                                    : 'bg-gray-100 text-gray-700'
                                                            }`}
                                                        >
                                                            {data.package_id === pkg.id.toString() ? (
                                                                <>
                                                                    <CheckCheck className="h-4 w-4" />
                                                                    <span>Selected</span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Circle className="h-4 w-4" />
                                                                    <span>Select Package</span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="start_trial"
                                                checked={data.start_trial}
                                                onCheckedChange={(checked) => handleChange('start_trial', checked as boolean)}
                                                disabled={processing || stepValidating}
                                            />
                                            <label
                                                htmlFor="start_trial"
                                                className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                                Start with a {trialDays}-day free trial
                                            </label>
                                        </div>
                                        <p className="ml-6 text-sm text-gray-600">
                                            You'll get full access to all modules and features during your trial. No credit card required to start.
                                        </p>
                                    </div>

                                    {errors.package_id && <InputError message={errors.package_id} />}
                                </>
                            )}

                            {/* Step 5: Review & Complete */}
                            {stepIndex === 5 && (
                                <>
                                    <div className="mb-6">
                                        <h3 className="text-lg font-medium text-gray-900">Review Your Information</h3>
                                        <p className="text-sm text-gray-500">Please review your account details before completing registration.</p>
                                    </div>

                                    <div className="grid gap-6 md:grid-cols-2">
                                        {/* Business Information */}
                                        <div className="rounded-lg border border-gray-200 p-4">
                                            <h4 className="mb-3 flex items-center gap-2 font-medium text-gray-900">
                                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                Business Information
                                            </h4>
                                            <dl className="space-y-2 text-sm">
                                                <div className="grid grid-cols-2">
                                                    <dt className="text-gray-500">Business Name:</dt>
                                                    <dd className="font-medium">{data.name || '—'}</dd>
                                                </div>
                                                <div className="grid grid-cols-2">
                                                    <dt className="text-gray-500">Registration Number:</dt>
                                                    <dd className="font-medium">{data.registration_number || '—'}</dd>
                                                </div>
                                                <div className="grid grid-cols-2">
                                                    <dt className="text-gray-500">Email:</dt>
                                                    <dd className="font-medium">{data.email || '—'}</dd>
                                                </div>
                                                <div className="grid grid-cols-2">
                                                    <dt className="text-gray-500">Phone:</dt>
                                                    <dd className="font-medium">{data.phone || '—'}</dd>
                                                </div>
                                                <div className="grid grid-cols-2">
                                                    <dt className="text-gray-500">Industry:</dt>
                                                    <dd className="font-medium">
                                                        {data.industry_id
                                                            ? industries.find((i) => i.id.toString() === data.industry_id.toString())?.name
                                                            : '—'}
                                                    </dd>
                                                </div>
                                            </dl>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                className="mt-3"
                                                onClick={() => setStepIndex(1)}
                                                disabled={processing || stepValidating}
                                            >
                                                Edit
                                            </Button>
                                        </div>

                                        {/* Address Information */}
                                        <div className="rounded-lg border border-gray-200 p-4">
                                            <h4 className="mb-3 flex items-center gap-2 font-medium text-gray-900">
                                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                Address Information
                                            </h4>
                                            <dl className="space-y-2 text-sm">
                                                <div className="grid grid-cols-2">
                                                    <dt className="text-gray-500">Address:</dt>
                                                    <dd className="font-medium">
                                                        {data.address_line_1 ? (
                                                            <>
                                                                {data.address_line_1}
                                                                {data.address_line_2 && <>, {data.address_line_2}</>}
                                                            </>
                                                        ) : (
                                                            '—'
                                                        )}
                                                    </dd>
                                                </div>
                                                <div className="grid grid-cols-2">
                                                    <dt className="text-gray-500">City:</dt>
                                                    <dd className="font-medium">{data.city || '—'}</dd>
                                                </div>
                                                <div className="grid grid-cols-2">
                                                    <dt className="text-gray-500">State/Province:</dt>
                                                    <dd className="font-medium">
                                                        {data.state_id ? states.find((s) => s.id.toString() === data.state_id.toString())?.name : '—'}
                                                    </dd>
                                                </div>
                                                <div className="grid grid-cols-2">
                                                    <dt className="text-gray-500">Postal Code:</dt>
                                                    <dd className="font-medium">{data.postal_code || '—'}</dd>
                                                </div>
                                                <div className="grid grid-cols-2">
                                                    <dt className="text-gray-500">Country:</dt>
                                                    <dd className="font-medium">
                                                        {data.country_id
                                                            ? countries.find((c) => c.id.toString() === data.country_id.toString())?.name
                                                            : '—'}
                                                    </dd>
                                                </div>
                                            </dl>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                className="mt-3"
                                                onClick={() => setStepIndex(2)}
                                                disabled={processing || stepValidating}
                                            >
                                                Edit
                                            </Button>
                                        </div>

                                        {/* Administrator Information */}
                                        <div className="rounded-lg border border-gray-200 p-4">
                                            <h4 className="mb-3 flex items-center gap-2 font-medium text-gray-900">
                                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                Administrator Information
                                            </h4>
                                            <dl className="space-y-2 text-sm">
                                                <div className="grid grid-cols-2">
                                                    <dt className="text-gray-500">Name:</dt>
                                                    <dd className="font-medium">{data.contact_name || '—'}</dd>
                                                </div>
                                                <div className="grid grid-cols-2">
                                                    <dt className="text-gray-500">Email:</dt>
                                                    <dd className="font-medium">{data.contact_email || '—'}</dd>
                                                </div>
                                                <div className="grid grid-cols-2">
                                                    <dt className="text-gray-500">Password:</dt>
                                                    <dd className="font-medium">••••••••</dd>
                                                </div>
                                            </dl>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                className="mt-3"
                                                onClick={() => setStepIndex(3)}
                                                disabled={processing || stepValidating}
                                            >
                                                Edit
                                            </Button>
                                        </div>

                                        {/* Subscription Package */}
                                        <div className="rounded-lg border border-gray-200 p-4">
                                            <h4 className="mb-3 flex items-center gap-2 font-medium text-gray-900">
                                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                Subscription Package
                                            </h4>
                                            {selectedPackage ? (
                                                <dl className="space-y-2 text-sm">
                                                    <div className="grid grid-cols-2">
                                                        <dt className="text-gray-500">Package:</dt>
                                                        <dd className="font-medium">{selectedPackage.name}</dd>
                                                    </div>
                                                    <div className="grid grid-cols-2">
                                                        <dt className="text-gray-500">Billing Cycle:</dt>
                                                        <dd className="font-medium capitalize">{data.billing_cycle}</dd>
                                                    </div>
                                                    <div className="grid grid-cols-2">
                                                        <dt className="text-gray-500">Price:</dt>
                                                        <dd className="font-medium">
                                                            ${calculatePrice(selectedPackage.base_price, data.billing_cycle)}
                                                            <span className="text-sm text-gray-500">
                                                                /{data.billing_cycle === 'annual' ? 'year' : 'month'}
                                                            </span>
                                                        </dd>
                                                    </div>
                                                    <div className="grid grid-cols-2">
                                                        <dt className="text-gray-500">Free Trial:</dt>
                                                        <dd className="text-primary font-medium">
                                                            {data.start_trial ? `${trialDays} days` : 'No trial'}
                                                        </dd>
                                                    </div>
                                                </dl>
                                            ) : (
                                                <p className="text-yellow-600">No package selected</p>
                                            )}
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                className="mt-3"
                                                onClick={() => setStepIndex(4)}
                                                disabled={processing || stepValidating}
                                            >
                                                Edit
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Trial Benefits Banner */}
                                    {data.start_trial && (
                                        <div className="border-primary/20 bg-primary/5 mt-6 rounded-lg border p-4">
                                            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                                                <div>
                                                    <h4 className="text-primary font-medium">Your {trialDays}-Day Free Trial Benefits:</h4>
                                                    <ul className="mt-2 space-y-1 text-sm">
                                                        <li className="flex items-center gap-2">
                                                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                            <span>
                                                                Access to <strong>all modules and features</strong>, regardless of selected package
                                                            </span>
                                                        </li>
                                                        <li className="flex items-center gap-2">
                                                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                            <span>No payment required until your trial ends</span>
                                                        </li>
                                                        <li className="flex items-center gap-2">
                                                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                            <span>Easily upgrade, downgrade, or cancel before trial ends</span>
                                                        </li>
                                                        <li className="flex items-center gap-2">
                                                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                            <span>Full support during your trial period</span>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="mt-6 border-t border-gray-200 pt-6">
                                        <p className="text-sm text-gray-500">
                                            By clicking "Create Business Account", you agree to our Terms of Service and Privacy Policy.
                                            {data.start_trial
                                                ? ' Your free trial will begin immediately upon account creation.'
                                                : ' Your subscription will begin immediately upon account creation.'}
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Navigation buttons */}
                        <div className="mt-3 flex items-center justify-between">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handlePrevStep}
                                disabled={stepIndex === 1 || processing || stepValidating}
                            >
                                Back
                            </Button>

                            <div className="flex items-center gap-3">
                                {!isLastStep ? (
                                    <Button type="button" size="sm" onClick={handleNextStep} disabled={processing || stepValidating}>
                                        {stepValidating && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                        Next
                                    </Button>
                                ) : (
                                    <Button type="submit" size="sm" disabled={processing || stepValidating}>
                                        {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                        Create Business Account
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
                            Need a different account type?{' '}
                            <a href={route('register')} className="text-primary font-medium hover:underline">
                                Choose a different registration option
                            </a>
                        </div>
                    </div>
                </form>
            </div>
        </AuthLayout>
    );
}
