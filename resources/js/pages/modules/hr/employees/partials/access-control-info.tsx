import { EmptyState } from '@/components/empty-state';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmployeePersonalInfo, PermissionBasic, RoleBasic } from '@/types';
import { router } from '@inertiajs/react';
import { Lock, LockIcon } from 'lucide-react';

interface AccessControlInfoProps {
    personal: EmployeePersonalInfo;
    roles: RoleBasic[];
    permissions: PermissionBasic[];
}

export default function AccessControlInfo({ roles, permissions, personal }: AccessControlInfoProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold">{personal?.name} Access Control</h3>
                    <p className="text-muted-foreground text-sm">Manage roles and permissions for {personal?.name}</p>
                </div>
                <Button size="sm" variant="outline" onClick={() => router.visit(route('modules.hr.employees.access', { id: personal?.employee_id }))}>
                    <Lock />
                    Manage Access
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Roles</CardTitle>
                        <CardDescription>User roles and their descriptions</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {roles.length > 0 ? (
                                roles.map((role) => (
                                    <div key={role.id} className="flex items-center justify-between rounded-md border p-3">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium">{role.name.replace(/_/g, ' ')}</span>
                                            {role.description && <span className="text-muted-foreground text-xs">{role.description}</span>}
                                        </div>
                                        <Badge variant="outline" className="text-xs">
                                            <LockIcon /> Role
                                        </Badge>
                                    </div>
                                ))
                            ) : (
                                <EmptyState title="test" description="test" />
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Direct Permissions</CardTitle>
                        <CardDescription>User permissions assigned directly</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {permissions.length > 0 ? (
                                permissions.map((permission) => (
                                    <div key={permission.id} className="flex items-center justify-between rounded-md border p-3">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium">{permission.name.replace(/_/g, ' ')}</span>
                                            <span className="text-muted-foreground text-xs">{permission.description}</span>
                                        </div>
                                        <Badge variant="outline" className="text-xs">
                                            Permission
                                        </Badge>
                                    </div>
                                ))
                            ) : (
                                <EmptyState title="test" description="test" />
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
