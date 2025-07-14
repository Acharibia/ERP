import ConfirmActionDialog, { ConfirmActionDialogRef } from '@/components/confirm-action-dialog';
import type { PositionBasic } from '@/types';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { toast } from 'sonner';

export type ActivatePositionDialogRef = {
    show: (position: PositionBasic) => void;
    showMany: (positions: PositionBasic[]) => void;
};

type Props = {
    onActivated?: () => void;
};

const ActivatePositionDialog = forwardRef<ActivatePositionDialogRef, Props>(({ onActivated }, ref) => {
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
    const url = isBulk ? route('modules.hr.positions.bulk-activate') : route('modules.hr.positions.activate', { id: positions[0].id });

    return (
        <ConfirmActionDialog
            ref={dialogRef}
            title={isBulk ? 'Activate selected positions?' : 'Activate this position?'}
            description={
                isBulk
                    ? `Are you sure you want to activate ${positions.length} positions?`
                    : `Are you sure you want to activate "${positions[0]?.title}"?`
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
            confirmText="Yes, activate"
            cancelText="Cancel"
            destructive={false}
            onSuccess={() => {
                setPositions([]);
                onActivated?.();
                setTimeout(() => toast.success(isBulk ? 'Departments activated successfully' : 'Department activated successfully'), 50);
            }}
            onError={(errors) => {
                console.error('Activation failed:', errors);
            }}
            onOpenChange={(open) => {
                if (!open) setPositions([]);
            }}
        />
    );
});

export default ActivatePositionDialog;
