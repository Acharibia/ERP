import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

import { useForm } from '@inertiajs/react';
import { forwardRef, useImperativeHandle, useState } from 'react';

import type { LeaveType, LeaveTypeForm } from '@/types';

export type EditLeaveTypeDialogRef = {
    show: (leaveType: LeaveType) => void;
};

const EditLeaveTypeDialog = forwardRef<EditLeaveTypeDialogRef>((_, ref) => {
    const [open, setOpen] = useState(false);
    const [currentId, setCurrentId] = useState<number | null>(null);

    const { data, setData, put, processing, reset, errors } = useForm<LeaveTypeForm>({
        name: '',
        code: '',
        description: '',
        default_days: '',
        requires_approval: true,
        is_paid: true,
        can_carry_forward: false,
        max_carry_forward_days: '',
        carry_forward_expiry_months: '',
    });

    useImperativeHandle(ref, () => ({
        show: (type: LeaveType) => {
            setCurrentId(type.id);
            setData({
                name: type.name ?? '',
                code: type.code ?? '',
                description: type.description ?? '',
                default_days: type.default_days?.toString() ?? '',
                requires_approval: type.requires_approval,
                is_paid: type.is_paid,
                can_carry_forward: type.can_carry_forward,
                max_carry_forward_days: type.max_carry_forward_days?.toString() ?? '',
                carry_forward_expiry_months: type.carry_forward_expiry_months?.toString() ?? '',
            });
            setOpen(true);
        },
    }));

    const handleChange = (field: keyof LeaveTypeForm) => (value: boolean) => {
        setData(field, value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (currentId === null) return;

        put(route('modules.hr.leave-types.update', { id: currentId }), {
            onSuccess: () => {
                setOpen(false);
                reset();
                setCurrentId(null);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Edit Leave Type</DialogTitle>
                        <DialogDescription>Update leave type configuration.</DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                            <InputError message={errors.name} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="code">Code</Label>
                                <Input id="code" value={data.code} onChange={(e) => setData('code', e.target.value)} />
                                <InputError message={errors.code} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="default_days">Default Days</Label>
                                <Input
                                    id="default_days"
                                    type="number"
                                    step="0.5"
                                    value={data.default_days}
                                    onChange={(e) => setData('default_days', e.target.value)}
                                />
                                <InputError message={errors.default_days} />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Input id="description" value={data.description} onChange={(e) => setData('description', e.target.value)} />
                            <InputError message={errors.description} />
                        </div>

                        <div className="grid gap-4">
                            <div className="flex items-center justify-between">
                                <Label className="text-sm">Requires Approval</Label>
                                <Switch checked={data.requires_approval} onCheckedChange={handleChange('requires_approval')} />
                            </div>

                            <div className="flex items-center justify-between">
                                <Label className="text-sm">Is Paid</Label>
                                <Switch checked={data.is_paid} onCheckedChange={handleChange('is_paid')} />
                            </div>

                            <div className="flex items-center justify-between">
                                <Label className="text-sm">Can Carry Forward</Label>
                                <Switch checked={data.can_carry_forward} onCheckedChange={handleChange('can_carry_forward')} />
                            </div>
                        </div>

                        {data.can_carry_forward && (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="max_carry_forward_days">Max Carry Forward Days</Label>
                                    <Input
                                        id="max_carry_forward_days"
                                        type="number"
                                        step="0.5"
                                        value={data.max_carry_forward_days}
                                        onChange={(e) => setData('max_carry_forward_days', e.target.value)}
                                    />
                                    <InputError message={errors.max_carry_forward_days} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="carry_forward_expiry_months">Expiry (Months)</Label>
                                    <Input
                                        id="carry_forward_expiry_months"
                                        type="number"
                                        value={data.carry_forward_expiry_months}
                                        onChange={(e) => setData('carry_forward_expiry_months', e.target.value)}
                                    />
                                    <InputError message={errors.carry_forward_expiry_months} />
                                </div>
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={processing}>
                            Update
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
});

export default EditLeaveTypeDialog;
