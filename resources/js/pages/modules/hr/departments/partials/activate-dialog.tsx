import ConfirmActionDialog, { ConfirmActionDialogRef } from '@/components/confirm-action-dialog';
import type { DepartmentBasic } from '@/types';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { toast } from 'sonner';

export type ActivateDepartmentDialogRef = {
    show: (department: DepartmentBasic) => void;
    showMany: (departments: DepartmentBasic[]) => void;
};

type Props = {
    onActivated?: () => void;
};

const ActivateDepartmentDialog = forwardRef<ActivateDepartmentDialogRef, Props>(({ onActivated }, ref) => {
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
    const url = isBulk ? route('modules.hr.departments.bulk-activate') : route('modules.hr.departments.activate', { id: departments[0].id });

    return (
        <ConfirmActionDialog
            ref={dialogRef}
            title={isBulk ? 'Activate selected departments?' : 'Activate this department?'}
            description={
                isBulk
                    ? `Are you sure you want to activate ${departments.length} departments?`
                    : `Are you sure you want to activate "${departments[0]?.name}"?`
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
            confirmText="Yes, activate"
            cancelText="Cancel"
            destructive={false}
            onSuccess={() => {
                setDepartments([]);
                onActivated?.();
                setTimeout(() => toast.success(isBulk ? 'Departments activated successfully' : 'Department activated successfully'), 50);
            }}
            onError={(errors) => {
                console.error('Activation failed:', errors);
            }}
            onOpenChange={(open) => {
                if (!open) setDepartments([]);
            }}
        />
    );
});

export default ActivateDepartmentDialog;
