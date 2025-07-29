import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import { PageHeader } from '@/components/ui/page-header';
import { Switch } from '@/components/ui/switch';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, PermissionBasic, RoleBasic, UserBasic } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { Plus, Save, Users } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/modules/hr/dashboard' },
    { title: 'Access Management', href: '/modules/hr/user-access' },
];

interface Props {
    users: UserBasic[];
    roles: RoleBasic[];
    permissions: PermissionBasic[];
    departments: Array<{ id: number; name: string }>;
    positions: Array<{ id: number; title: string }>;
}

export default function Index({ users, roles, permissions, departments, positions }: Props) {
    const [selectedItems, setSelectedItems] = useState<number[]>([]);

    const { data, setData, post, processing } = useForm({
        selected_items: selectedItems,
        roles: [] as number[],
        permissions: [] as number[],
    });

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

    // Helper functions for permissions
    const isPermissionSelected = (id: number) => data.permissions.includes(id);
    const togglePermission = (id: number) => {
        setData('permissions', isPermissionSelected(id) ? data.permissions.filter((pid) => pid !== id) : [...data.permissions, id]);
    };

    const allPermissionIds = permissions.map((p) => p.id);
    const isAllPermissionsSelected = allPermissionIds.length > 0 && allPermissionIds.every((id) => data.permissions.includes(id));
    const toggleAllPermissions = () => {
        setData('permissions', isAllPermissionsSelected ? [] : allPermissionIds);
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedItems.length === 0) {
            alert('Please select at least one item to assign roles/permissions to.');
            return;
        }
        if (data.roles.length === 0 && data.permissions.length === 0) {
            alert('Please select at least one role or permission to assign.');
            return;
        }
        post(route('modules.hr.user-access.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Access Management" />
            <PageHeader
                title="Access Management"
                description="Assign roles and permissions to departments, positions, or individual users."
                action={
                    <Button onClick={handleSubmit} disabled={processing || selectedItems.length === 0} size="sm">
                        <Save className="mr-2 h-4 w-4" />
                        {processing ? 'Saving...' : 'Save Changes'}
                    </Button>
                }
            />

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Users Selection */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle>Users</CardTitle>
                            <CardDescription className="truncate text-xs">Select users to assign roles and permissions to</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <MultiSelect
                                options={users.map((user) => ({
                                    label: user.name,
                                    value: user.id.toString(),
                                }))}
                                onValueChange={(values) => {
                                    const numericValues = values.map((v) => parseInt(v));
                                    setSelectedItems(numericValues);
                                    setData('selected_items', numericValues);
                                }}
                                defaultValue={selectedItems.map((id) => id.toString())}
                                placeholder="Select users..."
                            />
                            {users.length === 0 && (
                                <div className="py-8 text-center">
                                    <Users className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                                    <p className="text-muted-foreground">No users found</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Departments Selection */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Departments</CardTitle>
                            <CardDescription className="truncate text-xs">
                                Select departments to assign roles and permissions to all users in those departments
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <MultiSelect
                                options={departments.map((dept) => ({
                                    label: dept.name,
                                    value: dept.id.toString(),
                                }))}
                                onValueChange={(values) => {
                                    const numericValues = values.map((v) => parseInt(v));
                                    setSelectedItems(numericValues);
                                    setData('selected_items', numericValues);
                                }}
                                defaultValue={selectedItems.map((id) => id.toString())}
                                placeholder="Select departments..."
                            />
                            {departments.length === 0 && (
                                <div className="py-8 text-center">
                                    <Users className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                                    <p className="text-muted-foreground">No departments found</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Positions Selection */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Positions</CardTitle>
                            <CardDescription className="truncate text-xs">
                                Select positions to assign roles and permissions to all users in those positions
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <MultiSelect
                                options={positions.map((pos) => ({
                                    label: pos.title,
                                    value: pos.id.toString(),
                                }))}
                                onValueChange={(values) => {
                                    const numericValues = values.map((v) => parseInt(v));
                                    setSelectedItems(numericValues);
                                    setData('selected_items', numericValues);
                                }}
                                defaultValue={selectedItems.map((id) => id.toString())}
                                placeholder="Select positions..."
                            />
                            {positions.length === 0 && (
                                <div className="py-8 text-center">
                                    <Users className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                                    <p className="text-muted-foreground">No positions found</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Roles Assignment */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Assign Roles</CardTitle>
                            <CardDescription>Select roles to assign to the selected targets</CardDescription>
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
                            <Plus className="mr-2 h-4 w-4" />
                            Create Role
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {roles.map((role) => {
                                const isSelected = data.roles.includes(role.id);
                                return (
                                    <Card
                                        key={role.id}
                                        onClick={() => {
                                            const newRoles = isSelected ? data.roles.filter((id) => id !== role.id) : [...data.roles, role.id];
                                            setData('roles', newRoles);
                                        }}
                                        className={`cursor-pointer gap-2 px-0 py-3 transition-colors ${
                                            isSelected ? 'border-primary bg-primary/5 hover:bg-primary/10' : 'hover:bg-muted/50'
                                        }`}
                                    >
                                        <CardHeader className="flex flex-row items-center justify-between">
                                            <CardTitle className="text-sm">{role.name}</CardTitle>
                                            <Checkbox
                                                checked={isSelected}
                                                onCheckedChange={(checked) => {
                                                    const newRoles = checked ? [...data.roles, role.id] : data.roles.filter((id) => id !== role.id);
                                                    setData('roles', newRoles);
                                                }}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-muted-foreground truncate text-xs">{role.description}</p>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                        {roles.length === 0 && (
                            <div className="w-full py-8 text-center">
                                <p className="text-muted-foreground">No HR roles available</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Permissions Assignment */}
                <Card>
                    <CardHeader>
                        <CardTitle>Assign Permissions</CardTitle>
                        <CardDescription>Assign permissions directly (in addition to role permissions)</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4 flex items-center justify-between">
                            <Label htmlFor="permissions">Permissions</Label>
                            <div className="flex items-center">
                                <Switch checked={isAllPermissionsSelected} onCheckedChange={toggleAllPermissions} id="perm-all" />
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
                                                        checked={isPermissionSelected(perm.id)}
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
                    </CardContent>
                </Card>
            </form>
        </AppLayout>
    );
}
