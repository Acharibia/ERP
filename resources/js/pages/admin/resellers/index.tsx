'use client';

import { DataTable } from '@/components/shared/data-table';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs = [
    {
        title: 'Dashboard',
        href: route('admin.dashboard'),
    },
    {
        title: 'Reseller',
        href: '/admin/resellers',
    },
];

export default function Reseller() {
    const [selectedUser, setSelectedUser] = useState<{ id: number; name: string } | null>(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showSuspendDialog, setShowSuspendDialog] = useState(false);

    // Handle row actions
    const handleRowAction = (action: string, row: { id: number; name: string }) => {
        switch (action) {
            case 'view':
                router.visit(route('admin.users.show', row.id));
                break;

            case 'edit':
                router.visit(route('admin.users.edit', row.id));
                break;

            case 'delete':
                setSelectedUser(row);
                setShowDeleteDialog(true);
                break;

            case 'suspend':
                setSelectedUser(row);
                setShowSuspendDialog(true);
                break;

            default:
                console.log(`Action ${action} not implemented for`, row);
        }
    };

    // Handle delete confirmation
    const handleDelete = () => {
        if (!selectedUser) return;

        router.delete(route('admin.users.destroy', selectedUser.id), {
            onSuccess: () => {
                toast({
                    title: 'User deleted',
                    description: `${selectedUser.name} has been deleted successfully.`,
                });
                setShowDeleteDialog(false);
                setSelectedUser(null);
            },
        });
    };

    // Handle suspend confirmation
    const handleSuspend = () => {
        if (!selectedUser) return;

        router.post(
            route('admin.users.suspend', selectedUser.id),
            {},
            {
                onSuccess: () => {
                    toast({
                        title: 'User suspended',
                        description: `${selectedUser.name} has been suspended.`,
                    });
                    setShowSuspendDialog(false);
                    setSelectedUser(null);
                },
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Resellers" />
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-sm font-medium">Resellers</CardTitle>
                        <CardDescription>Manage platform resellers who sell solution to businesses</CardDescription>
                    </div>
                    <Link href={route('admin.resellers.create')} className={buttonVariants({ variant: 'default' })}>
                        <Plus className="mr-2 h-4 w-4" /> Add Reseller
                    </Link>
                </CardHeader>
                <CardContent>
                    <DataTable dataTableClass="UserDataTable" enableRowClick onRowAction={handleRowAction} />
                </CardContent>
            </Card>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete {selectedUser?.name}. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Suspend Confirmation Dialog */}
            <AlertDialog open={showSuspendDialog} onOpenChange={setShowSuspendDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Suspend User</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to suspend {selectedUser?.name}? They will not be able to access the system until unsuspended.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleSuspend} className="bg-warning text-warning-foreground">
                            Suspend
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
