'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { Building, Loader2, Percent, Settings } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs = [
    {
        title: 'Dashboard',
        href: route('admin.dashboard'),
    },
    {
        title: 'Resellers',
        href: '/admin/resellers',
    },
    {
        title: 'Create',
        href: '/admin/resellers/create',
    },
];

export default function ResellerCreate() {
    const [submitting, setSubmitting] = useState(false);

    const { data, setData, post, errors } = useForm({
        company_name: '',
        contact_name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        postal_code: '',
        country: '',
        status: 'active',
        verification_status: 'pending',
        commission_rate: '0.00',
        admin_email: '',
        admin_name: '',
        admin_password: '',
        admin_password_confirmation: '',
    });

    const handleSubmit = (e: { preventDefault: () => void }) => {
        e.preventDefault();
        setSubmitting(true);

        post(route('admin.resellers.store'), {
            onSuccess: () => {
                toast('Reseller has been created successfully.');
            },
            onError: () => {
                toast('There was a problem creating the reseller.');
                setSubmitting(false);
            },
            onFinish: () => setSubmitting(false),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Reseller" />

            <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight">Create new reseller</h1>
                <p className="text-muted-foreground">Add a new reseller to the platform</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Company Information */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center space-x-2">
                                <Building className="text-muted-foreground h-5 w-5" />
                                <CardTitle>Company Information</CardTitle>
                            </div>
                            <CardDescription>Basic details about the reseller company</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="company_name">
                                    Company Name <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="company_name"
                                    value={data.company_name}
                                    onChange={(e) => setData('company_name', e.target.value)}
                                    className={errors.company_name ? 'border-red-500' : ''}
                                    placeholder="Enter company name"
                                />
                                {errors.company_name && <p className="text-xs text-red-500">{errors.company_name}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="contact_name">
                                    Contact Name <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="contact_name"
                                    value={data.contact_name}
                                    onChange={(e) => setData('contact_name', e.target.value)}
                                    className={errors.contact_name ? 'border-red-500' : ''}
                                    placeholder="Enter contact person's name"
                                />
                                {errors.contact_name && <p className="text-xs text-red-500">{errors.contact_name}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">
                                    Email <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className={errors.email ? 'border-red-500' : ''}
                                    placeholder="example@company.com"
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
                        </CardContent>
                    </Card>

                    {/* Address Information */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center space-x-2">
                                <Building className="text-muted-foreground h-5 w-5" />
                                <CardTitle>Address Information</CardTitle>
                            </div>
                            <CardDescription>Physical location of the reseller</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="address">Street Address</Label>
                                <Textarea
                                    id="address"
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    className={errors.address ? 'border-red-500' : ''}
                                    placeholder="Enter street address"
                                    rows={1}
                                />
                                {errors.address && <p className="text-xs text-red-500">{errors.address}</p>}
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
                                        placeholder="Enter state"
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
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Status and Commission */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center space-x-2">
                                <Percent className="text-muted-foreground h-5 w-5" />
                                <CardTitle>Status & Commission</CardTitle>
                            </div>
                            <CardDescription>Configure reseller operational settings</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-1">
                                <div className="space-y-2">
                                    <Label htmlFor="status">Account Status</Label>
                                    <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                                        <SelectTrigger className={errors.status ? 'border-red-500' : ''}>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="suspended">Suspended</SelectItem>
                                            <SelectItem value="archived">Archived</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.status && <p className="text-xs text-red-500">{errors.status}</p>}
                                    <p className="text-muted-foreground text-xs">Current operational status of the reseller</p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="verification_status">Verification Status</Label>
                                    <Select value={data.verification_status} onValueChange={(value) => setData('verification_status', value)}>
                                        <SelectTrigger className={errors.verification_status ? 'border-red-500' : ''}>
                                            <SelectValue placeholder="Select verification status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="verified">Verified</SelectItem>
                                            <SelectItem value="rejected">Rejected</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.verification_status && <p className="text-xs text-red-500">{errors.verification_status}</p>}
                                    <p className="text-muted-foreground text-xs">Verification level of the reseller's account</p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="commission_rate">Commission Rate (%)</Label>
                                    <Input
                                        id="commission_rate"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        max="100"
                                        value={data.commission_rate}
                                        onChange={(e) => setData('commission_rate', e.target.value)}
                                        className={errors.commission_rate ? 'border-red-500' : ''}
                                    />
                                    {errors.commission_rate && <p className="text-xs text-red-500">{errors.commission_rate}</p>}
                                    <p className="text-muted-foreground text-xs">Default commission percentage for this reseller</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Admin Account */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center space-x-2">
                                <Settings className="text-muted-foreground h-5 w-5" />
                                <CardTitle>Admin Account</CardTitle>
                            </div>
                            <CardDescription>Create the initial admin user for this reseller</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-1">
                                <div className="space-y-2">
                                    <Label htmlFor="admin_name">
                                        Admin Name <span className="text-red-500">*</span>
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
                                        Admin Email <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="admin_email"
                                        type="email"
                                        value={data.admin_email}
                                        onChange={(e) => setData('admin_email', e.target.value)}
                                        className={errors.admin_email ? 'border-red-500' : ''}
                                        placeholder="admin@company.com"
                                    />
                                    {errors.admin_email && <p className="text-xs text-red-500">{errors.admin_email}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="admin_password">
                                        Admin Password <span className="text-red-500">*</span>
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
                                    {errors.admin_password_confirmation && (
                                        <p className="text-xs text-red-500">{errors.admin_password_confirmation}</p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="flex justify-end space-x-4">
                    <Button type="button" variant="outline" onClick={() => window.history.back()}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={submitting}>
                        {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Create Reseller
                    </Button>
                </div>
            </form>
        </AppLayout>
    );
}
