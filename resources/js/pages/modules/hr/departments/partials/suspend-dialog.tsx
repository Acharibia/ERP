import ConfirmActionDialog, { ConfirmActionDialogRef } from '@/components/confirm-action-dialog';
import type { DepartmentBasic } from '@/types';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { toast } from 'sonner';

export type SuspendDepartmentDialogRef = {
    show: (department: DepartmentBasic) => void;
    showMany: (departments: DepartmentBasic[]) => void;
};

type Props = {
    onSuspended?: () => void;
};

const SuspendDepartmentDialog = forwardRef<SuspendDepartmentDialogRef, Props>(({ onSuspended }, ref) => {
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
    const url = isBulk ? route('modules.hr.departments.bulk-suspend') : route('modules.hr.departments.suspend', { id: departments[0].id });

    return (
        <ConfirmActionDialog
            ref={dialogRef}
            title={isBulk ? 'Suspend selected departments?' : 'Suspend this department?'}
            description={
                isBulk
                    ? `Are you sure you want to suspend ${departments.length} departments?`
                    : `Are you sure you want to suspend "${departments[0]?.name}"?`
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
            confirmText="Yes, suspend"
            cancelText="Cancel"
            destructive={false}
            onSuccess={() => {
                setDepartments([]);
                onSuspended?.();
                setTimeout(() => toast.success(isBulk ? 'Departments suspended successfully' : 'Department suspended successfully'), 50);
            }}
            onOpenChange={(open) => {
                if (!open) setDepartments([]);
            }}
        />
    );
});

export default SuspendDepartmentDialog;
