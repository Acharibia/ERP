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
import { Head, router, useForm } from '@inertiajs/react';
import { Save, X } from 'lucide-react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/modules/hr/dashboard' },
    { title: 'Role Access', href: '/modules/hr/role-access' },
    { title: 'Create', href: '/modules/hr/role-access/create' },
];

export default function CreateRole({ permissions = [] }: { permissions?: Permission[] }) {
    const { data, setData, post, processing, errors } = useForm<{
        name: string;
        description: string;
        permissions: number[];
    }>({
        name: '',
        description: '',
        permissions: [],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('modules.hr.role-access.store'), {
            onSuccess: () => {
                toast.success('Role created successfully!', {
                    description: 'The new role has been added to the system.',
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

    // Helper to check if a permission is selected
    const isSelected = (id: number) => data.permissions.includes(id);
    // Helper to toggle a permission
    const togglePermission = (id: number) => {
        setData('permissions', isSelected(id) ? data.permissions.filter((pid) => pid !== id) : [...data.permissions, id]);
    };

    // Helper to check if all permissions are selected
    const allPermissionIds = permissions.map((p) => p.id);
    const isAllSelected = allPermissionIds.length > 0 && allPermissionIds.every((id) => data.permissions.includes(id));
    const toggleAllPermissions = () => {
        setData('permissions', isAllSelected ? [] : allPermissionIds);
    };

    // Helper to check if all permissions in a feature are selected
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
            <Head title="Create Role" />

            <PageHeader
                title="Create Role"
                description="Define a new HR role."
                action={
                    <div className="flex space-x-2">
                        <Button type="button" variant="outline" size="sm" onClick={() => router.visit(route('modules.hr.role-access.index'))}>
                            <X />
                            Cancel
                        </Button>
                        <Button type="submit" size="sm" disabled={processing} onClick={handleSubmit}>
                            <Save />
                            {processing ? 'Creating...' : 'Create Role'}
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
                                    placeholder="e.g., HR_MANAGER"
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
                                    placeholder="e.g., This is a manager role"
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
