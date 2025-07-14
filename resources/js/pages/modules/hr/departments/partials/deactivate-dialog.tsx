import ConfirmActionDialog, { ConfirmActionDialogRef } from '@/components/confirm-action-dialog';
import type { DepartmentBasic } from '@/types';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { toast } from 'sonner';

export type DeactivateDepartmentDialogRef = {
    show: (department: DepartmentBasic) => void;
    showMany: (departments: DepartmentBasic[]) => void;
};

type Props = {
    onDeactivated?: () => void;
};

const DeactivateDepartmentDialog = forwardRef<DeactivateDepartmentDialogRef, Props>(({ onDeactivated }, ref) => {
    const dialogRef = useRef<ConfirmActionDialogRef>(null);
    const [departments, setDepartments] = useState<DepartmentBasic[]>([]);

    useImperativeHandle(ref, () => ({
        show(dept) {
            setDepartments([dept]);
            requestAnimationFrame(() => dialogRef.current?.openDialog());
        },
        showMany(depts) {
            setDepartments(depts);
            requestAnimationFrame(() => dialogRef.current?.openDialog());
        },
    }));

    if (departments.length === 0) return null;

    const isBulk = departments.length > 1;
    const url = isBulk ? route('modules.hr.departments.bulk-deactivate') : route('modules.hr.departments.deactivate', { id: departments[0].id });

    return (
        <ConfirmActionDialog
            ref={dialogRef}
            title={isBulk ? 'Deactivate selected departments?' : 'Deactivate this department?'}
            description={
                isBulk
                    ? `Are you sure you want to deactivate ${departments.length} departments?`
                    : `Are you sure you want to deactivate "${departments[0]?.name}"?`
            }
            url={url}
            method="patch"
            fields={[
                ...(isBulk ? [{ name: 'ids', type: 'hidden' as const, value: departments.map((d) => d.id) }] : []),
                {
                    name: 'password',
                    type: 'input',
                    label: 'Password',
                    placeholder: 'Enter your password to confirm',
                    autoComplete: 'current-password',
                },
            ]}
            confirmText="Yes, deactivate"
            cancelText="Cancel"
            destructive
            onSuccess={() => {
                setDepartments([]);
                onDeactivated?.();
                setTimeout(() => toast.success(isBulk ? 'Departments deactivated successfully' : 'Department deactivated successfully'), 50);
            }}
            onOpenChange={(open) => {
                if (!open) setDepartments([]);
            }}
        />
    );
});

export default DeactivateDepartmentDialog;
