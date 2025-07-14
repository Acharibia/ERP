import ConfirmActionDialog, { ConfirmActionDialogRef } from '@/components/confirm-action-dialog';
import type { EmployeeBasic } from '@/types';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { toast } from 'sonner';

export type DeleteEmployeeDialogRef = {
    show: (employee: EmployeeBasic) => void;
    showMany: (employees: EmployeeBasic[]) => void;
};

type Props = {
    onDeleted?: () => void;
};

const DeleteEmployeeDialog = forwardRef<DeleteEmployeeDialogRef, Props>(({ onDeleted }, ref) => {
    const dialogRef = useRef<ConfirmActionDialogRef>(null);
    const [employees, setEmployees] = useState<EmployeeBasic[]>([]);

    useImperativeHandle(ref, () => ({
        show(emp) {
            setEmployees([emp]);
            requestAnimationFrame(() => dialogRef.current?.openDialog());
        },
        showMany(emps) {
            setEmployees(emps);
            requestAnimationFrame(() => dialogRef.current?.openDialog());
        },
    }));

    if (employees.length === 0) return null;

    const isBulk = employees.length > 1;
    const url = isBulk ? route('modules.hr.employees.bulk-destroy') : route('modules.hr.employees.destroy', { id: employees[0].id });

    return (
        <ConfirmActionDialog
            ref={dialogRef}
            title={isBulk ? 'Delete selected employees?' : 'Delete this employee?'}
            description={
                isBulk
                    ? `Are you sure you want to permanently delete ${employees.length} employees?`
                    : `Are you sure you want to permanently delete "${employees[0]?.personalInfo?.name || 'this employee'}"?`
            }
            url={url}
            method="delete"
            fields={[
                ...(isBulk ? [{ name: 'ids', type: 'hidden' as const, value: employees.map((e) => e.id) }] : []),
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
                setEmployees([]);
                onDeleted?.();
                setTimeout(() => toast.success(isBulk ? 'Employees deleted successfully' : 'Employee deleted successfully'), 50);
            }}
            onOpenChange={(open) => {
                if (!open) setEmployees([]);
            }}
        />
    );
});

export default DeleteEmployeeDialog;
