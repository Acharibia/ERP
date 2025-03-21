import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AuthLayout from '@/layouts/auth-layout';

type InvestorRegisterForm = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    investor_type: string;
    agree_terms: boolean;
};

export default function RegisterInvestor() {
    const investorTypes = [
        { code: 'individual', name: 'Individual Investor' },
        { code: 'angel', name: 'Angel Investor' },
        { code: 'vc', name: 'Venture Capital' },
        { code: 'pe', name: 'Private Equity' },
        { code: 'corporate', name: 'Corporate Investor' },
        { code: 'family_office', name: 'Family Office' },
    ];

    const { data, setData, post, processing, errors, reset } = useForm<Required<InvestorRegisterForm>>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        investor_type: '',
        agree_terms: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register.investor.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout title="Create an Investor Account" description="Register as an investor to connect with businesses and manage investments">
            <Head title="Register as Investor" />
            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            type="text"
                            required
                            autoFocus
                            tabIndex={1}
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
                            tabIndex={2}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            disabled={processing}
                            placeholder="email@example.com"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="investor_type">Investor Type</Label>
                        <Select value={data.investor_type} onValueChange={(value) => setData('investor_type', value)} disabled={processing}>
                            <SelectTrigger id="investor_type" tabIndex={3}>
                                <SelectValue placeholder="Select investor type" />
                            </SelectTrigger>
                            <SelectContent>
                                {investorTypes.map((type) => (
                                    <SelectItem key={type.code} value={type.code}>
                                        {type.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.investor_type} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={4}
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
                            tabIndex={5}
                            autoComplete="new-password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            disabled={processing}
                            placeholder="Confirm your password"
                        />
                        <InputError message={errors.password_confirmation} />
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="agree_terms"
                            checked={data.agree_terms}
                            onCheckedChange={(checked) => setData('agree_terms', checked as boolean)}
                            tabIndex={6}
                        />
                        <Label
                            htmlFor="agree_terms"
                            className="text-sm leading-none font-normal peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            I agree to the terms of service and privacy policy
                        </Label>
                    </div>

                    <InputError message={errors.agree_terms} />

                    {errors.general && <div className="mt-1 text-sm text-red-500">{errors.general}</div>}

                    <Button type="submit" className="mt-2 w-full" tabIndex={7} disabled={processing || !data.agree_terms}>
                        {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                        Create Investor Account
                    </Button>
                </div>

                <div className="text-muted-foreground text-center text-sm">
                    Already have an account?{' '}
                    <TextLink href={route('login')} tabIndex={8}>
                        Log in
                    </TextLink>
                </div>

                <div className="text-muted-foreground text-center text-sm">
                    Not an investor?{' '}
                    <TextLink href={route('register')} tabIndex={9}>
                        Choose a different account type
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
