import ConfirmActionDialog, { ConfirmActionDialogRef } from '@/components/confirm-action-dialog';
import type { DepartmentBasic } from '@/types';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { toast } from 'sonner';

export type DeleteDepartmentDialogRef = {
    show: (department: DepartmentBasic) => void;
    showMany: (departments: DepartmentBasic[]) => void;
};

type Props = {
    onDeleted?: () => void;
};

const DeleteDepartmentDialog = forwardRef<DeleteDepartmentDialogRef, Props>(({ onDeleted }, ref) => {
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
    const url = isBulk ? route('modules.hr.departments.bulk-destroy') : route('modules.hr.departments.destroy', { id: departments[0].id });

    return (
        <ConfirmActionDialog
            ref={dialogRef}
            title={isBulk ? 'Delete selected departments?' : 'Delete this department?'}
            description={
                isBulk
                    ? `Are you sure you want to permanently delete ${departments.length} departments?`
                    : `Are you sure you want to permanently delete "${departments[0]?.name}"?`
            }
            url={url}
            method="delete"
            fields={[
                ...(isBulk ? [{ name: 'ids', type: 'hidden' as const, value: departments.map((d) => d.id) }] : []),
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
                setDepartments([]);
                onDeleted?.();
                setTimeout(() => toast.success(isBulk ? 'Departments deleted successfully' : 'Department deleted successfully'), 50);
            }}
            onOpenChange={(open) => {
                if (!open) setDepartments([]);
            }}
        />
    );
});

export default DeleteDepartmentDialog;
