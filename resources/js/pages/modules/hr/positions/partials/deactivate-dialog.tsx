import ConfirmActionDialog, { ConfirmActionDialogRef } from '@/components/confirm-action-dialog';
import type { PositionBasic } from '@/types';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { toast } from 'sonner';

export type DeactivatePositionDialogRef = {
    show: (position: PositionBasic) => void;
    showMany: (positions: PositionBasic[]) => void;
};

type Props = {
    onDeactivated?: () => void;
};

const DeactivatePositionDialog = forwardRef<DeactivatePositionDialogRef, Props>(({ onDeactivated }, ref) => {
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
    const url = isBulk ? route('modules.hr.positions.bulk-deactivate') : route('modules.hr.positions.deactivate', { id: positions[0].id });

    return (
        <ConfirmActionDialog
            ref={dialogRef}
            title={isBulk ? 'Deactivate selected positions?' : 'Deactivate this position?'}
            description={
                isBulk
                    ? `Are you sure you want to deactivate ${positions.length} positions?`
                    : `Are you sure you want to deactivate "${positions[0]?.title}"?`
            }
            url={url}
            method="patch"
            fields={[
                ...(isBulk ? [{ name: 'ids', type: 'hidden' as const, value: positions.map((d) => d.id) }] : []),
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
                setPositions([]);
                onDeactivated?.();
                setTimeout(() => toast.success(isBulk ? 'Departments deactivated successfully' : 'Department deactivated successfully'), 50);
            }}
            onOpenChange={(open) => {
                if (!open) setPositions([]);
            }}
        />
    );
});

export default DeactivatePositionDialog;
