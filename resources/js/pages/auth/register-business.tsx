import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AuthLayout from '@/layouts/auth-layout';

type BusinessRegisterForm = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    business_name: string;
    industry: string;
};

export default function RegisterBusiness() {
    const industries = [
        { id: 'retail', name: 'Retail' },
        { id: 'manufacturing', name: 'Manufacturing' },
        { id: 'healthcare', name: 'Healthcare' },
        { id: 'technology', name: 'Technology' },
        { id: 'finance', name: 'Finance' },
        { id: 'education', name: 'Education' },
        { id: 'hospitality', name: 'Hospitality' },
        { id: 'construction', name: 'Construction' },
        { id: 'logistics', name: 'Logistics' },
        { id: 'other', name: 'Other' },
    ];

    const { data, setData, post, processing, errors, reset } = useForm<Required<BusinessRegisterForm>>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        business_name: '',
        industry: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register.business.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout title="Create a Business Account" description="Register as a business to access ERP modules for your operations">
            <Head title="Register as Business" />
            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="business_name">Business Name</Label>
                        <Input
                            id="business_name"
                            type="text"
                            required
                            autoFocus
                            tabIndex={1}
                            value={data.business_name}
                            onChange={(e) => setData('business_name', e.target.value)}
                            disabled={processing}
                            placeholder="Your business name"
                        />
                        <InputError message={errors.business_name} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="industry">Industry</Label>
                        <Select value={data.industry} onValueChange={(value) => setData('industry', value)} disabled={processing}>
                            <SelectTrigger id="industry" tabIndex={2}>
                                <SelectValue placeholder="Select an industry" />
                            </SelectTrigger>
                            <SelectContent>
                                {industries.map((industry) => (
                                    <SelectItem key={industry.id} value={industry.id}>
                                        {industry.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.industry} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="name">Admin Name</Label>
                        <Input
                            id="name"
                            type="text"
                            required
                            tabIndex={3}
                            autoComplete="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            disabled={processing}
                            placeholder="Your full name"
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            tabIndex={4}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            disabled={processing}
                            placeholder="email@example.com"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={5}
                            autoComplete="new-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            disabled={processing}
                            placeholder="Create a secure password"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation">Confirm Password</Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            required
                            tabIndex={6}
                            autoComplete="new-password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            disabled={processing}
                            placeholder="Confirm your password"
                        />
                        <InputError message={errors.password_confirmation} />
                    </div>

                    {errors.general && <div className="mt-1 text-sm text-red-500">{errors.general}</div>}

                    <Button type="submit" className="mt-2 w-full" tabIndex={7} disabled={processing}>
                        {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                        Create Business Account
                    </Button>
                </div>

                <div className="text-muted-foreground text-center text-sm">
                    Already have an account?{' '}
                    <TextLink href={route('login')} tabIndex={8}>
                        Log in
                    </TextLink>
                </div>

                <div className="text-muted-foreground text-center text-sm">
                    Not a business?{' '}
                    <TextLink href={route('register')} tabIndex={9}>
                        Choose a different account type
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
