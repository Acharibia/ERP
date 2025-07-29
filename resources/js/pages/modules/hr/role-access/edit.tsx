import InputError from '@/components/input-error';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PageHeader } from '@/components/ui/page-header';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { Permission } from '@/types/core/permission';
import type { Role } from '@/types/core/role';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { Save, X } from 'lucide-react';
import { toast } from 'sonner';

export default function EditRole() {
    const { props } = usePage<{ role: Role; permissions: Permission[] }>();
    const { role, permissions = [] } = props;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/modules/hr/dashboard' },
        { title: 'Role Access', href: '/modules/hr/role-access' },
        { title: 'Edit', href: `/modules/hr/role-access/${role.id}/edit` },
    ];

    const { data, setData, patch, processing, errors, isDirty } = useForm<{
        name: string;
        description: string;
        permissions: number[];
    }>({
        name: role.name || '',
        description: role.description || '',
        permissions: (role.permissions || []).map((p) => p.id),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route('modules.hr.role-access.update', role.id), {
            onSuccess: () => {
                toast.success('Role updated successfully!', {
                    description: 'The role details have been updated.',
                    duration: 4000,
                });
            },
        });
    };

    const groupedPermissions = permissions.reduce<Record<string, Permission[]>>((acc, perm) => {
        const match = perm.name.match(/^hr\.(?:[a-z_]+)_([a-z_]+)/);
        let feature = '';
        if (match) {
            feature = match[1].replace(/_/g, ' ');
        } else {
            const parts = perm.name.split(/\.|_/);
            feature = parts[parts.length - 1];
        }
        feature = feature.charAt(0).toUpperCase() + feature.slice(1);
        if (!acc[feature]) acc[feature] = [];
        acc[feature].push(perm);
        return acc;
    }, {});

    const isSelected = (id: number) => data.permissions.includes(id);
    const togglePermission = (id: number) => {
        setData('permissions', isSelected(id) ? data.permissions.filter((pid) => pid !== id) : [...data.permissions, id]);
    };

    const allPermissionIds = permissions.map((p) => p.id);
    const isAllSelected = allPermissionIds.length > 0 && allPermissionIds.every((id) => data.permissions.includes(id));
    const toggleAllPermissions = () => {
        setData('permissions', isAllSelected ? [] : allPermissionIds);
    };

    const isFeatureAllSelected = (feature: string) => groupedPermissions[feature].every((perm) => data.permissions.includes(perm.id));
    const toggleFeaturePermissions = (feature: string) => {
        const featureIds = groupedPermissions[feature].map((perm) => perm.id);
        const allSelected = featureIds.every((id) => data.permissions.includes(id));
        setData(
            'permissions',
            allSelected ? data.permissions.filter((id) => !featureIds.includes(id)) : Array.from(new Set([...data.permissions, ...featureIds])),
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${role.name}`} />
            <PageHeader
                title={`Edit ${role.name}`}
                description="Update the HR role details."
                action={
                    <div className="flex space-x-2">
                        <Button type="button" variant="outline" size="sm" onClick={() => router.visit(route('modules.hr.role-access.index'))}>
                            <X />
                            Cancel
                        </Button>
                        <Button type="submit" size="sm" disabled={processing || !isDirty} onClick={handleSubmit}>
                            <Save />
                            {processing ? 'Updating...' : 'Update Role'}
                        </Button>
                    </div>
                }
            />
            <Alert className="border-0 px-0">
                <AlertTitle>How Permissions Work</AlertTitle>
                <AlertDescription>
                    <ul className="list-disc space-y-1 pl-4">
                        <li>
                            You can assign permissions individually, by feature (using the switch in each card), or all at once (using the global
                            switch).
                        </li>
                        <li>Assign permissions carefully to ensure users have the correct access for their responsibilities.</li>
                        <li className="text-muted-foreground text-xs">
                            <b>Note:</b> Role names are stored with a technical prefix (<code>HR_</code>) and uppercase, but are always displayed in a
                            friendly format.
                        </li>
                    </ul>
                </AlertDescription>
            </Alert>
            <Card>
                <CardHeader>
                    <CardTitle>Role Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="mt-2 grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                                <Label htmlFor="name">
                                    Name <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="e.g., HR Manager"
                                    className={errors.name ? 'border-red-500' : ''}
                                    required
                                />
                                <InputError message={errors.name} />
                            </div>
                            <div>
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="e.g., This role is for ..."
                                    className={errors.description ? 'border-red-500' : ''}
                                    required
                                />
                                <InputError message={errors.description} />
                            </div>
                        </div>
                        <div>
                            <div className="mb-4 flex items-center justify-between">
                                <Label htmlFor="permissions">Permissions</Label>
                                <div className="flex items-center">
                                    <Switch checked={isAllSelected} onCheckedChange={toggleAllPermissions} id="perm-all" />
                                    <span className="ml-2 font-medium">Select All Permissions</span>
                                </div>
                            </div>
                            <div className="mt-2 grid grid-cols-1 gap-6 md:grid-cols-3">
                                {Object.entries(groupedPermissions).map(([feature, perms]) => (
                                    <Card key={feature}>
                                        <CardHeader className="flex flex-row items-center justify-between">
                                            <CardTitle>{feature}</CardTitle>
                                            <div className="flex items-center">
                                                <Switch
                                                    checked={isFeatureAllSelected(feature)}
                                                    onCheckedChange={() => toggleFeaturePermissions(feature)}
                                                    id={`feature-all-${feature}`}
                                                />
                                                <span className="ml-2 text-xs">Select All</span>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-2">
                                                {perms.map((perm) => (
                                                    <div key={perm.id} className="flex items-center justify-between py-1">
                                                        <span className="text-sm">{perm.name.replace(/^hr\./, '').replace(/_/g, ' ')}</span>
                                                        <Switch
                                                            checked={isSelected(perm.id)}
                                                            onCheckedChange={() => togglePermission(perm.id)}
                                                            id={`perm-${perm.id}`}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                            <InputError message={errors.permissions} />
                        </div>
                    </form>
                </CardContent>
            </Card>
        </AppLayout>
    );
}
