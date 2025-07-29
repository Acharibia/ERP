import { Badge } from '@/components/ui/badge';
import { PermissionBasic } from '@/types';

interface PermissionsPartialProps {
    permissions?: PermissionBasic[];
}

export default function PermissionsPartial({ permissions }: PermissionsPartialProps) {
    if (!permissions || permissions.length === 0) {
        return (
            <div className="space-y-1">
                <p className="text-muted-foreground text-sm">No direct permissions assigned</p>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {permissions.map((permission) => (
                <div key={permission.id} className="flex items-center justify-between rounded-md border p-2">
                    <div className="flex flex-col">
                        <span className="text-sm font-medium">
                            {permission.name.replace(/^hr\./, '').replace(/_/g, ' ')}
                        </span>
                        <span className="text-muted-foreground text-xs">{permission.name}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                        Permission
                    </Badge>
                </div>
            ))}
        </div>
    );
}
