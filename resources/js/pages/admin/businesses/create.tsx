'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { Building, Loader2, Package, Settings } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs = [
    {
        title: 'Dashboard',
        href: route('admin.dashboard'),
    },
    {
        title: 'Businesses',
        href: '/admin/businesses',
    },
    {
        title: 'Create',
        href: '/admin/businesses/create',
    },
];

export default function BusinessCreate() {
    const [submitting, setSubmitting] = useState(false);
    const [resellers, setResellers] = useState([]);
    const [packages, setPackages] = useState([]);
    const [modules, setModules] = useState([]);
    const [selectedModules, setSelectedModules] = useState([]);

    const { data, setData, post, errors } = useForm({
        name: '',
        registration_number: '',
        email: '',
        phone: '',
        website: '',
        address_line_1: '',
        address_line_2: '',
        city: '',
        state: '',
        postal_code: '',
        country: '',
        industry_id: '',
        reseller_id: '',
        subscription_status: 'active',
        environment: 'production',
        schema_version: '1.0',
        package_id: '',
        trial_ends_at: '',
        is_auto_renew: true,
        user_limit: '',
        admin_email: '',
        admin_name: '',
        admin_password: '',
        admin_password_confirmation: '',
        notes: '',
    });

    // Fetch resellers, packages and modules on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Example logic - in a real app this would be API calls
                // to fetch actual data from your backend
                setResellers([
                    { id: 1, name: 'ABC Consulting' },
                    { id: 2, name: 'XYZ Solutions' },
                    { id: 3, name: 'Tech Partners Inc.' },
                ]);

                setPackages([
                    { id: 1, name: 'Basic', description: 'Essential features' },
                    { id: 2, name: 'Professional', description: 'Advanced features' },
                    { id: 3, name: 'Enterprise', description: 'Complete feature set' },
                ]);

                setModules([
                    { id: 1, code: 'hr', name: 'HR Management' },
                    { id: 2, code: 'crm', name: 'CRM' },
                    { id: 3, code: 'inventory', name: 'Inventory Management' },
                    { id: 4, code: 'accounting', name: 'Accounting' },
                ]);
            } catch (error) {
                console.error('Error fetching data:', error);
                toast('Failed to load required data');
            }
        };

        fetchData();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);

        // Add selected modules to the form data
        const formData = {
            ...data,
            modules: selectedModules,
        };

        post(route('admin.businesses.store'), formData, {
            onSuccess: () => {
                toast('Business has been created successfully.');
            },
            onError: () => {
                toast('There was a problem creating the business.');
                setSubmitting(false);
            },
            onFinish: () => setSubmitting(false),
        });
    };

    const toggleModule = (moduleId) => {
        setSelectedModules((prevModules) =>
            prevModules.includes(moduleId) ? prevModules.filter((id) => id !== moduleId) : [...prevModules, moduleId],
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Business" />

            <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight">Create new business</h1>
                <p className="text-muted-foreground">Add a new client business to the platform</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Business Information */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center space-x-2">
                                <Building className="text-muted-foreground h-5 w-5" />
                                <CardTitle>Business Information</CardTitle>
                            </div>
                            <CardDescription>Basic details about the business client</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">
                                    Business Name <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className={errors.name ? 'border-red-500' : ''}
                                    placeholder="Enter business name"
                                />
                                {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="registration_number">Registration Number</Label>
                                <Input
                                    id="registration_number"
                                    value={data.registration_number}
                                    onChange={(e) => setData('registration_number', e.target.value)}
                                    className={errors.registration_number ? 'border-red-500' : ''}
                                    placeholder="Business registration number"
                                />
                                {errors.registration_number && <p className="text-xs text-red-500">{errors.registration_number}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className={errors.email ? 'border-red-500' : ''}
                                        placeholder="company@example.com"
                                    />
                                    {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input
                                        id="phone"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        className={errors.phone ? 'border-red-500' : ''}
                                        placeholder="+1 (555) 123-4567"
                                    />
                                    {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="website">Website</Label>
                                <Input
                                    id="website"
                                    value={data.website}
                                    onChange={(e) => setData('website', e.target.value)}
                                    className={errors.website ? 'border-red-500' : ''}
                                    placeholder="https://www.example.com"
                                />
                                {errors.website && <p className="text-xs text-red-500">{errors.website}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="industry_id">Industry</Label>
                                <Select value={data.industry_id} onValueChange={(value) => setData('industry_id', value)}>
                                    <SelectTrigger className={errors.industry_id ? 'border-red-500' : ''}>
                                        <SelectValue placeholder="Select industry" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">Technology</SelectItem>
                                        <SelectItem value="2">Healthcare</SelectItem>
                                        <SelectItem value="3">Retail</SelectItem>
                                        <SelectItem value="4">Manufacturing</SelectItem>
                                        <SelectItem value="5">Education</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.industry_id && <p className="text-xs text-red-500">{errors.industry_id}</p>}
                            </div>

                            <Separator />

                            <div className="space-y-2">
                                <Label htmlFor="address_line_1">Address Line 1</Label>
                                <Input
                                    id="address_line_1"
                                    value={data.address_line_1}
                                    onChange={(e) => setData('address_line_1', e.target.value)}
                                    className={errors.address_line_1 ? 'border-red-500' : ''}
                                    placeholder="Street address, P.O. box, company name"
                                />
                                {errors.address_line_1 && <p className="text-xs text-red-500">{errors.address_line_1}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address_line_2">Address Line 2</Label>
                                <Input
                                    id="address_line_2"
                                    value={data.address_line_2}
                                    onChange={(e) => setData('address_line_2', e.target.value)}
                                    className={errors.address_line_2 ? 'border-red-500' : ''}
                                    placeholder="Apartment, suite, unit, building, floor, etc."
                                />
                                {errors.address_line_2 && <p className="text-xs text-red-500">{errors.address_line_2}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="city">City</Label>
                                    <Input
                                        id="city"
                                        value={data.city}
                                        onChange={(e) => setData('city', e.target.value)}
                                        className={errors.city ? 'border-red-500' : ''}
                                        placeholder="Enter city"
                                    />
                                    {errors.city && <p className="text-xs text-red-500">{errors.city}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="state">State/Province</Label>
                                    <Input
                                        id="state"
                                        value={data.state}
                                        onChange={(e) => setData('state', e.target.value)}
                                        className={errors.state ? 'border-red-500' : ''}
                                        placeholder="Enter state or province"
                                    />
                                    {errors.state && <p className="text-xs text-red-500">{errors.state}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="postal_code">Postal Code</Label>
                                    <Input
                                        id="postal_code"
                                        value={data.postal_code}
                                        onChange={(e) => setData('postal_code', e.target.value)}
                                        className={errors.postal_code ? 'border-red-500' : ''}
                                        placeholder="Enter postal code"
                                    />
                                    {errors.postal_code && <p className="text-xs text-red-500">{errors.postal_code}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="country">Country</Label>
                                    <Input
                                        id="country"
                                        value={data.country}
                                        onChange={(e) => setData('country', e.target.value)}
                                        className={errors.country ? 'border-red-500' : ''}
                                        placeholder="Enter country"
                                    />
                                    {errors.country && <p className="text-xs text-red-500">{errors.country}</p>}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Subscription Details */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center space-x-2">
                                <Package className="text-muted-foreground h-5 w-5" />
                                <CardTitle>Subscription</CardTitle>
                            </div>
                            <CardDescription>Configure the business subscription</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="reseller_id">
                                    Assigned Reseller <span className="text-red-500">*</span>
                                </Label>
                                <Select value={data.reseller_id} onValueChange={(value) => setData('reseller_id', value)}>
                                    <SelectTrigger className={errors.reseller_id ? 'border-red-500' : ''}>
                                        <SelectValue placeholder="Select a reseller" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {resellers.map((reseller) => (
                                            <SelectItem key={reseller.id} value={reseller.id.toString()}>
                                                {reseller.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.reseller_id && <p className="text-xs text-red-500">{errors.reseller_id}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="package_id">
                                    Subscription Package <span className="text-red-500">*</span>
                                </Label>
                                <Select value={data.package_id} onValueChange={(value) => setData('package_id', value)}>
                                    <SelectTrigger className={errors.package_id ? 'border-red-500' : ''}>
                                        <SelectValue placeholder="Select a package" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {packages.map((pkg) => (
                                            <SelectItem key={pkg.id} value={pkg.id.toString()}>
                                                {pkg.name} - {pkg.description}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.package_id && <p className="text-xs text-red-500">{errors.package_id}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="subscription_status">Subscription Status</Label>
                                <Select value={data.subscription_status} onValueChange={(value) => setData('subscription_status', value)}>
                                    <SelectTrigger className={errors.subscription_status ? 'border-red-500' : ''}>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="trial">Trial</SelectItem>
                                        <SelectItem value="suspended">Suspended</SelectItem>
                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.subscription_status && <p className="text-xs text-red-500">{errors.subscription_status}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="environment">Environment</Label>
                                <Select value={data.environment} onValueChange={(value) => setData('environment', value)}>
                                    <SelectTrigger className={errors.environment ? 'border-red-500' : ''}>
                                        <SelectValue placeholder="Select environment" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="production">Production</SelectItem>
                                        <SelectItem value="staging">Staging</SelectItem>
                                        <SelectItem value="development">Development</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.environment && <p className="text-xs text-red-500">{errors.environment}</p>}
                            </div>

                            {data.subscription_status === 'trial' && (
                                <div className="space-y-2">
                                    <Label htmlFor="trial_ends_at">Trial End Date</Label>
                                    <Input
                                        id="trial_ends_at"
                                        type="date"
                                        value={data.trial_ends_at}
                                        onChange={(e) => setData('trial_ends_at', e.target.value)}
                                        className={errors.trial_ends_at ? 'border-red-500' : ''}
                                    />
                                    {errors.trial_ends_at && <p className="text-xs text-red-500">{errors.trial_ends_at}</p>}
                                </div>
                            )}

                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="is_auto_renew"
                                    checked={data.is_auto_renew}
                                    onCheckedChange={(checked) => setData('is_auto_renew', checked)}
                                />
                                <Label htmlFor="is_auto_renew">Auto-renew subscription</Label>
                                {errors.is_auto_renew && <p className="text-xs text-red-500">{errors.is_auto_renew}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="user_limit">User Limit</Label>
                                <Input
                                    id="user_limit"
                                    type="number"
                                    min="1"
                                    value={data.user_limit}
                                    onChange={(e) => setData('user_limit', e.target.value)}
                                    className={errors.user_limit ? 'border-red-500' : ''}
                                    placeholder="Enter user limit"
                                />
                                {errors.user_limit && <p className="text-xs text-red-500">{errors.user_limit}</p>}
                                <p className="text-muted-foreground text-xs">Leave empty for package default</p>
                            </div>

                            <Separator />

                            <div>
                                <Label className="mb-2 block">Selected Modules</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    {modules.map((module) => (
                                        <div key={module.id} className="flex items-center space-x-2 rounded border p-2">
                                            <Switch
                                                id={`module-${module.id}`}
                                                checked={selectedModules.includes(module.id)}
                                                onCheckedChange={() => toggleModule(module.id)}
                                            />
                                            <Label htmlFor={`module-${module.id}`} className="flex-1 cursor-pointer">
                                                {module.name}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                                {errors.modules && <p className="mt-1 text-xs text-red-500">{errors.modules}</p>}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Admin Account */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center space-x-2">
                            <Settings className="text-muted-foreground h-5 w-5" />
                            <CardTitle>Administrator</CardTitle>
                        </div>
                        <CardDescription>Create the initial admin user for this business</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div className="space-y-2">
                                <Label htmlFor="admin_name">
                                    Name <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="admin_name"
                                    value={data.admin_name}
                                    onChange={(e) => setData('admin_name', e.target.value)}
                                    className={errors.admin_name ? 'border-red-500' : ''}
                                    placeholder="Enter admin name"
                                />
                                {errors.admin_name && <p className="text-xs text-red-500">{errors.admin_name}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="admin_email">
                                    Email <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="admin_email"
                                    type="email"
                                    value={data.admin_email}
                                    onChange={(e) => setData('admin_email', e.target.value)}
                                    className={errors.admin_email ? 'border-red-500' : ''}
                                    placeholder="admin@business.com"
                                />
                                {errors.admin_email && <p className="text-xs text-red-500">{errors.admin_email}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="admin_password">
                                    Password <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="admin_password"
                                    type="password"
                                    value={data.admin_password}
                                    onChange={(e) => setData('admin_password', e.target.value)}
                                    className={errors.admin_password ? 'border-red-500' : ''}
                                    placeholder="Enter secure password"
                                />
                                {errors.admin_password && <p className="text-xs text-red-500">{errors.admin_password}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="admin_password_confirmation">
                                    Confirm Password <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="admin_password_confirmation"
                                    type="password"
                                    value={data.admin_password_confirmation}
                                    onChange={(e) => setData('admin_password_confirmation', e.target.value)}
                                    className={errors.admin_password_confirmation ? 'border-red-500' : ''}
                                    placeholder="Confirm password"
                                />
                                {errors.admin_password_confirmation && <p className="text-xs text-red-500">{errors.admin_password_confirmation}</p>}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end space-x-4">
                    <Button type="button" variant="outline" onClick={() => window.history.back()}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={submitting}>
                        {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Create Business
                    </Button>
                </div>
            </form>
        </AppLayout>
    );
}
