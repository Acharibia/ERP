import ConfirmActionDialog, { ConfirmActionDialogRef } from '@/components/confirm-action-dialog';
import type { RoleBasic } from '@/types/core/role';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { toast } from 'sonner';

export type DeleteRoleDialogRef = {
    show: (role: RoleBasic) => void;
    showMany: (roles: RoleBasic[]) => void;
};

type Props = {
    onDeleted?: () => void;
};

const DeleteRoleDialog = forwardRef<DeleteRoleDialogRef, Props>(({ onDeleted }, ref) => {
    const dialogRef = useRef<ConfirmActionDialogRef>(null);
    const [roles, setRoles] = useState<RoleBasic[]>([]);

    useImperativeHandle(ref, () => ({
        show(role) {
            setRoles([role]);
            requestAnimationFrame(() => dialogRef.current?.openDialog());
        },
        showMany(roles) {
            setRoles(roles);
            requestAnimationFrame(() => dialogRef.current?.openDialog());
        },
    }));

    if (roles.length === 0) return null;

    const isBulk = roles.length > 1;
    const url = isBulk
        ? route('modules.hr.role-access.bulk-destroy')
        : route('modules.hr.role-access.destroy', { id: roles[0].id });

    return (
        <ConfirmActionDialog
            ref={dialogRef}
            title={isBulk ? 'Delete selected roles?' : 'Delete this role?'}
            description={
                isBulk
                    ? `Are you sure you want to permanently delete ${roles.length} roles?`
                    : `Are you sure you want to permanently delete "${roles[0]?.name}"?`
            }
            url={url}
            method="delete"
            fields={[
                ...(isBulk ? [{ name: 'ids', type: 'hidden' as const, value: roles.map((d) => d.id) }] : []),
                {
                    name: 'password',
                    type: 'input',
                    placeholder: 'Enter your password to confirm',
                    label: 'Password',
                    autoComplete: 'current-password',
                },
            ]}
            confirmText="Yes, delete"
            cancelText="Cancel"
            destructive
            onSuccess={() => {
                setRoles([]);
                onDeleted?.();
                setTimeout(() => toast.success(isBulk ? 'Roles deleted successfully' : 'Role deleted successfully'), 50);
            }}
            onOpenChange={(open) => {
                if (!open) setRoles([]);
            }}
        />
    );
});

export default DeleteRoleDialog;
