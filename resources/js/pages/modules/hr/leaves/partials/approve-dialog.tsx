import ConfirmActionDialog, { ConfirmActionDialogRef } from '@/components/confirm-action-dialog';
import type { LeaveBasic } from '@/types';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { toast } from 'sonner';

export type ApproveLeaveDialogRef = {
    show: (leave: LeaveBasic) => void;
    showMany: (leaves: LeaveBasic[]) => void;
};

type Props = {
    onApproved?: () => void;
};

const ApproveLeaveDialog = forwardRef<ApproveLeaveDialogRef, Props>(({ onApproved }, ref) => {
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
    const url = isBulk ? route('modules.hr.leaves.bulk-approve') : route('modules.hr.leaves.approve', { id: leaves[0].id });

    return (
        <ConfirmActionDialog
            ref={dialogRef}
            title={isBulk ? 'Approve selected leave requests?' : 'Approve this leave request?'}
            description={
                isBulk
                    ? `Are you sure you want to approve ${leaves.length} leave requests?`
                    : `Are you sure you want to approve the leave request by "${leaves[0]?.employee_name}"?`
            }
            url={url}
            method="patch"
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
            confirmText="Yes, approve"
            cancelText="Cancel"
            destructive={false}
            onSuccess={() => {
                setLeaves([]);
                onApproved?.();
                setTimeout(() => toast.success(isBulk ? 'Leaves approved successfully' : 'Leave approved successfully'), 50);
            }}
            onError={(errors) => {
                console.error('Approval failed:', errors);
            }}
            onOpenChange={(open) => {
                if (!open) setLeaves([]);
            }}
        />
    );
});

export default ApproveLeaveDialog;
