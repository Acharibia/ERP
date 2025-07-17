import ConfirmActionDialog, { ConfirmActionDialogRef } from '@/components/confirm-action-dialog';
import type { LeaveType } from '@/types';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { toast } from 'sonner';

export type DeleteLeaveTypeDialogRef = {
    show: (leaveType: LeaveType) => void;
    showMany: (leaveTypes: LeaveType[]) => void;
};

type Props = {
    onDeleted?: () => void;
};

const DeleteLeaveTypeDialog = forwardRef<DeleteLeaveTypeDialogRef, Props>(({ onDeleted }, ref) => {
    const dialogRef = useRef<ConfirmActionDialogRef>(null);
    const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);

    useImperativeHandle(ref, () => ({
        show(leaveType) {
            setLeaveTypes([leaveType]);
            requestAnimationFrame(() => dialogRef.current?.openDialog());
        },
        showMany(leaveTypeList) {
            setLeaveTypes(leaveTypeList);
            requestAnimationFrame(() => dialogRef.current?.openDialog());
        },
    }));

    if (leaveTypes.length === 0) return null;

    const isBulk = leaveTypes.length > 1;
    const url = isBulk
        ? route('modules.hr.leave-types.bulk-delete') // You must create this route
        : route('modules.hr.leave-types.destroy', { id: leaveTypes[0].id });

    return (
        <ConfirmActionDialog
            ref={dialogRef}
            title={isBulk ? 'Delete selected leave types?' : 'Delete this leave type?'}
            description={
                isBulk
                    ? `Are you sure you want to permanently delete ${leaveTypes.length} leave types? This action cannot be undone.`
                    : `Are you sure you want to permanently delete the leave type "${leaveTypes[0]?.name}"? This action cannot be undone.`
            }
            url={url}
            method="delete"
            fields={[
                ...(isBulk ? [{ name: 'ids', type: 'hidden' as const, value: leaveTypes.map((lt) => lt.id) }] : []),
                {
                    name: 'password',
                    type: 'password',
                    label: 'Password',
                    placeholder: 'Enter your password to confirm',
                    autoComplete: 'current-password',
                },
            ]}
            confirmText="Yes, delete"
            cancelText="Cancel"
            destructive
            onSuccess={() => {
                setLeaveTypes([]);
                onDeleted?.();
                setTimeout(() => {
                    toast.success(isBulk ? 'Leave types deleted successfully' : 'Leave type deleted successfully');
                }, 50);
            }}
            onError={(errors) => {
                console.error('Leave type deletion failed:', errors);
            }}
            onOpenChange={(open) => {
                if (!open) setLeaveTypes([]);
            }}
        />
    );
});

export default DeleteLeaveTypeDialog;
