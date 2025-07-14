import ConfirmActionDialog, { ConfirmActionDialogRef } from '@/components/confirm-action-dialog';
import type { PositionBasic } from '@/types';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { toast } from 'sonner';

export type DeletePositionDialogRef = {
    show: (position: PositionBasic) => void;
    showMany: (positions: PositionBasic[]) => void;
};

type Props = {
    onDeleted?: () => void;
};

const DeletePositionDialog = forwardRef<DeletePositionDialogRef, Props>(({ onDeleted }, ref) => {
    const dialogRef = useRef<ConfirmActionDialogRef>(null);
    const [positions, setPositions] = useState<PositionBasic[]>([]);

    useImperativeHandle(ref, () => ({
        show(dept) {
            setPositions([dept]);
            requestAnimationFrame(() => dialogRef.current?.openDialog());
        },
        showMany(depts) {
            setPositions(depts);
            requestAnimationFrame(() => dialogRef.current?.openDialog());
        },
    }));

    if (positions.length === 0) return null;

    const isBulk = positions.length > 1;
    const url = isBulk ? route('modules.hr.positions.bulk-destroy') : route('modules.hr.positions.destroy', { id: positions[0].id });

    return (
        <ConfirmActionDialog
            ref={dialogRef}
            title={isBulk ? 'Delete selected positions?' : 'Delete this position?'}
            description={
                isBulk
                    ? `Are you sure you want to permanently delete ${positions.length} positions?`
                    : `Are you sure you want to permanently delete "${positions[0]?.title}"?`
            }
            url={url}
            method="delete"
            fields={[
                ...(isBulk ? [{ name: 'ids', type: 'hidden' as const, value: positions.map((d) => d.id) }] : []),
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
                setPositions([]);
                onDeleted?.();
                setTimeout(() => toast.success(isBulk ? 'Departments deleted successfully' : 'Department deleted successfully'), 50);
            }}
            onOpenChange={(open) => {
                if (!open) setPositions([]);
            }}
        />
    );
});

export default DeletePositionDialog;
