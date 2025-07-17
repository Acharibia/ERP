import ConfirmActionDialog, { ConfirmActionDialogRef } from '@/components/confirm-action-dialog';
import type { LeaveBasic } from '@/types';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { toast } from 'sonner';

export type RejectLeaveDialogRef = {
    show: (leave: LeaveBasic) => void;
    showMany: (leaves: LeaveBasic[]) => void;
};

type Props = {
    onRejected?: () => void;
};

const RejectLeaveDialog = forwardRef<RejectLeaveDialogRef, Props>(({ onRejected }, ref) => {
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
    const url = isBulk ? route('modules.hr.leaves.bulk-reject') : route('modules.hr.leaves.reject', { id: leaves[0].id });

    return (
        <ConfirmActionDialog
            ref={dialogRef}
            title={isBulk ? 'Reject selected leave requests?' : 'Reject this leave request?'}
            description={
                isBulk
                    ? `Are you sure you want to reject ${leaves.length} leave requests?`
                    : `Are you sure you want to reject the leave request by "${leaves[0]?.employee_name}"?`
            }
            url={url}
            method="patch"
            fields={[
                ...(isBulk ? [{ name: 'ids', type: 'hidden' as const, value: leaves.map((l) => l.id) }] : []),
                {
                    name: 'password',
                    type: 'password',
                    label: 'Password',
                    placeholder: 'Enter your password to confirm',
                    autoComplete: 'current-password',
                },
                {
                    name: 'comment',
                    type: 'textarea',
                    label: 'Reason for Rejection (optional)',
                    placeholder: 'Provide a reason for rejecting the leave request...',
                },
            ]}
            confirmText="Yes, reject"
            cancelText="Cancel"
            destructive
            onSuccess={() => {
                setLeaves([]);
                onRejected?.();
                setTimeout(() => toast.success(isBulk ? 'Leaves rejected successfully' : 'Leave rejected successfully'), 50);
            }}
            onError={(errors) => {
                console.error('Rejection failed:', errors);
            }}
            onOpenChange={(open) => {
                if (!open) setLeaves([]);
            }}
        />
    );
});

export default RejectLeaveDialog;
