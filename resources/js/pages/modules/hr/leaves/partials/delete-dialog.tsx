import ConfirmActionDialog, { ConfirmActionDialogRef } from '@/components/confirm-action-dialog';
import type { LeaveBasic } from '@/types';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { toast } from 'sonner';

export type DeleteLeaveDialogRef = {
    show: (leave: LeaveBasic) => void;
    showMany: (leaves: LeaveBasic[]) => void;
};

type Props = {
    onDeleted?: () => void;
};

const DeleteLeaveDialog = forwardRef<DeleteLeaveDialogRef, Props>(({ onDeleted }, ref) => {
    const dialogRef = useRef<ConfirmActionDialogRef>(null);
    const [leaves, setLeaves] = useState<LeaveBasic[]>([]);

    useImperativeHandle(ref, () => ({
        show(leave) {
            setLeaves([leave]);
            requestAnimationFrame(() => dialogRef.current?.openDialog());
        },
        showMany(leaveList) {
            setLeaves(leaveList);
            requestAnimationFrame(() => dialogRef.current?.openDialog());
        },
    }));

    if (leaves.length === 0) return null;

    const isBulk = leaves.length > 1;
    const url = isBulk ? route('modules.hr.leaves.bulk-delete') : route('modules.hr.leaves.destroy', { id: leaves[0].id });

    return (
        <ConfirmActionDialog
            ref={dialogRef}
            title={isBulk ? 'Delete selected leave requests?' : 'Delete this leave request?'}
            description={
                isBulk
                    ? `Are you sure you want to permanently delete ${leaves.length} leave requests? This action cannot be undone.`
                    : `Are you sure you want to permanently delete the leave request by "${leaves[0]?.employee_name}"? This action cannot be undone.`
            }
            url={url}
            method="delete"
            fields={[
                ...(isBulk ? [{ name: 'ids', type: 'hidden' as const, value: leaves.map((l) => l.id) }] : []),
                {
                    name: 'password',
                    type: 'input',
                    label: 'Password',
                    placeholder: 'Enter your password to confirm',
                    autoComplete: 'current-password',
                },
            ]}
            confirmText="Yes, delete"
            cancelText="Cancel"
            destructive
            onSuccess={() => {
                setLeaves([]);
                onDeleted?.();
                setTimeout(() => toast.success(isBulk ? 'Leaves deleted successfully' : 'Leave deleted successfully'), 50);
            }}
            onError={(errors) => {
                console.error('Deletion failed:', errors);
            }}
            onOpenChange={(open) => {
                if (!open) setLeaves([]);
            }}
        />
    );
});

export default DeleteLeaveDialog;
