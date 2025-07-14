import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import type { LeaveType } from '@/types';
import { forwardRef, useImperativeHandle, useState } from 'react';

export type ViewLeaveTypeDialogRef = {
    show: (leaveType: LeaveType) => void;
};

const ViewLeaveTypeDialog = forwardRef<ViewLeaveTypeDialogRef>((_, ref) => {
    const [open, setOpen] = useState(false);
    const [type, setType] = useState<LeaveType | null>(null);

    useImperativeHandle(ref, () => ({
        show: (leaveType: LeaveType) => {
            setType(leaveType);
            setOpen(true);
        },
    }));

    if (!type) return null;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{type.name}</DialogTitle>
                    <DialogDescription>Details of the leave type.</DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-2">
                    <div>
                        <Label className="text-muted-foreground text-sm">Code</Label>
                        <p className="font-medium">{type.code}</p>
                    </div>

                    <div>
                        <Label className="text-muted-foreground text-sm">Default Days</Label>
                        <p className="font-medium">{type.default_days}</p>
                    </div>

                    {type.description && (
                        <div>
                            <Label className="text-muted-foreground text-sm">Description</Label>
                            <p className="text-sm">{type.description}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-3 pt-2">
                        <div className="flex items-center justify-between">
                            <Label className="text-sm">Requires Approval</Label>
                            <Switch checked={type.requires_approval} disabled />
                        </div>

                        <div className="flex items-center justify-between">
                            <Label className="text-sm">Is Paid</Label>
                            <Switch checked={type.is_paid} disabled />
                        </div>

                        <div className="flex items-center justify-between">
                            <Label className="text-sm">Can Carry Forward</Label>
                            <Switch checked={type.can_carry_forward} disabled />
                        </div>

                        {type.can_carry_forward && (
                            <>
                                <div className="flex items-center justify-between">
                                    <Label className="text-sm">Max Carry Forward Days</Label>
                                    <span className="text-sm font-medium">{type.max_carry_forward_days ?? '-'}</span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <Label className="text-sm">Carry Forward Expiry (Months)</Label>
                                    <span className="text-sm font-medium">{type.carry_forward_expiry_months ?? '-'}</span>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
});

export default ViewLeaveTypeDialog;
