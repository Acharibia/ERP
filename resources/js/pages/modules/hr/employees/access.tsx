import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { PageHeader } from '@/components/ui/page-header';
import { Switch } from '@/components/ui/switch';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Employee, PermissionBasic, RoleBasic } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { Plus, Save, X } from 'lucide-react';
import { useCallback } from 'react';
import { toast } from 'sonner';

interface Props {
    employee: Employee;
    roles: RoleBasic[];
    permissions: PermissionBasic[];
}

export default function ManageAccess({ employee, roles, permissions }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/modules/hr/dashboard' },
        { title: 'Employees', href: '/modules/hr/employees' },
        { title: `${employee?.user?.name} Access Control`, href: '#' },
    ];

    const { data, setData, patch, processing, errors } = useForm({
        roles: Array.isArray(employee?.user?.roles) ? employee.user.roles.map((role: RoleBasic) => role.id) : [],
        permissions: Array.isArray(employee?.user?.permissions) ? employee.user.permissions.map((permission: PermissionBasic) => permission.id) : [],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route('modules.hr.employees.update-access', { id: employee?.id }), {
            onSuccess: () => {
                toast.success('Access updated successfully');
            },
            onError: () => {
                toast.error('Failed to update access');
            },
        });
    };

    const handleRoleChange = useCallback(
        (roleId: number, checked: boolean) => {
            const currentRoles = [...data.roles];
            if (checked) {
                if (!currentRoles.includes(roleId)) {
                    currentRoles.push(roleId);
                }
            } else {
                const index = currentRoles.indexOf(roleId);
                if (index > -1) {
                    currentRoles.splice(index, 1);
                }
            }
            setData('roles', currentRoles);
        },
        [data.roles, setData],
    );

    // Group permissions by feature
    const groupedPermissions = permissions.reduce<Record<string, PermissionBasic[]>>((acc, perm) => {
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
            <Head title={`${employee?.user?.name} Access Control`} />
            <PageHeader
                title={`${employee?.user?.name} Access Control`}
                description="Manage user roles and permissions"
                action={
                    <>
                        <Button type="button" variant="outline" onClick={() => router.visit(route('modules.hr.employees.index'))}>
                            <X />
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} disabled={processing} size="sm">
                            <Save />
                            {processing ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </>
                }
            />

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Assign Roles</CardTitle>
                            <CardDescription>Select roles to assign to this user</CardDescription>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                router.visit(route('modules.hr.role-access.create'), {
                                    preserveScroll: true,
                                    preserveState: true,
                                });
                            }}
                        >
                            <Plus />
                            Create Role
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-4">
                            {roles.map((role) => {
                                const isSelected = data.roles.includes(role.id);
                                return (
                                    <Card
                                        onClick={() => {
                                            handleRoleChange(role.id, !isSelected);
                                        }}
                                        key={role.id}
                                        className={`w-64 cursor-pointer gap-2 px-0 py-3 transition-colors ${
                                            isSelected ? 'border-primary bg-primary/5 hover:bg-primary/10' : 'hover:bg-muted/50'
                                        }`}
                                    >
                                        <CardHeader className="flex flex-row items-center justify-between">
                                            <CardTitle className="text-sm">{role.name}</CardTitle>
                                            <label htmlFor={`role-${role.id}`} onClick={(e) => e.stopPropagation()}>
                                                <Checkbox
                                                    id={`role-${role.id}`}
                                                    checked={data.roles.includes(role.id)}
                                                    onCheckedChange={(checked) => handleRoleChange(role.id, checked as boolean)}
                                                />
                                            </label>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-muted-foreground truncate text-xs">{role.description}</p>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                            {roles.length === 0 && (
                                <div className="w-full py-8 text-center">
                                    <p className="text-muted-foreground">No HR roles available</p>
                                </div>
                            )}
                        </div>
                        {errors.roles && <p className="text-destructive mt-2 text-sm">{errors.roles}</p>}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Direct Permissions</CardTitle>
                        <CardDescription>Assign permissions directly to this user (in addition to role permissions)</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4 flex items-center justify-between">
                            <Label htmlFor="permissions">Permissions</Label>
                            <div className="flex items-center">
                                <Switch checked={isAllSelected} onCheckedChange={toggleAllPermissions} id="perm-all" />
                                <span className="ml-2 font-medium">All Permissions</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
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
                        {errors.permissions && <p className="text-destructive mt-2 text-sm">{errors.permissions}</p>}
                    </CardContent>
                </Card>
            </form>
        </AppLayout>
    );
}
