import { DataTable } from '@/components/shared/data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import AppLayout from '@/layouts/app-layout';
import { LeaveBasic, LeaveType, type BreadcrumbItem } from '@/types';
import { DataTableRef, ModuleDataTableRoutes } from '@/types/data-table';
import { Head, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useRef } from 'react';
import ApproveLeaveDialog, { ApproveLeaveDialogRef } from './partials/approve-dialog';
import CancelLeaveDialog, { CancelLeaveDialogRef } from './partials/cancel-dialog';
import DeleteLeaveDialog, { DeleteLeaveDialogRef } from './partials/delete-dialog';
import LeaveTypes from './partials/leave-types';
import RejectLeaveDialog, { RejectLeaveDialogRef } from './partials/reject-dialog';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/modules/hr/dashboard' },
    { title: 'Leaves', href: '/modules/hr/leaves' },
];

export default function Index({ leaveTypes = [] }: { leaveTypes?: LeaveType[] }) {
    const tableRef = useRef<DataTableRef>(null);

    const deleteDialogRef = useRef<DeleteLeaveDialogRef>(null);
    const approveDialogRef = useRef<ApproveLeaveDialogRef>(null);
    const rejectDialogRef = useRef<RejectLeaveDialogRef>(null);
    const cancelDialogRef = useRef<CancelLeaveDialogRef>(null);

    const handleRowAction = (action: string, row: LeaveBasic) => {
        switch (action) {
            case 'view':
                router.visit(route('modules.hr.leaves.show', { id: row.id }));
                break;
            case 'edit':
                router.visit(route('modules.hr.leaves.edit', { id: row.id }));
                break;
            case 'delete':
                deleteDialogRef.current?.show(row);
                break;
            case 'approve':
                approveDialogRef.current?.show(row);
                break;
            case 'reject':
                rejectDialogRef.current?.show(row);
                break;
            case 'cancel':
                cancelDialogRef.current?.show(row);
                break;
            default:
                console.log(`Unhandled action: ${action}`, row);
        }
    };

    const handleBulkAction = (action: string, rows: LeaveBasic[]) => {
        switch (action) {
            case 'approve':
                approveDialogRef.current?.showMany(rows);
                break;
            case 'reject':
                rejectDialogRef.current?.showMany(rows);
                break;
            case 'cancel':
                cancelDialogRef.current?.showMany(rows);
                break;
            case 'delete':
                deleteDialogRef.current?.showMany(rows);
                break;
            default:
                console.log(`Unknown bulk action: ${action}`, rows);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Leave" />
            <PageHeader
                title="Leave Management"
                description="Manage and oversee all leave requests across the organization"
                action={
                    <div className="flex space-x-2">
                        <Button onClick={() => router.visit(route('modules.hr.leaves.create'))} size="sm">
                            <Plus className="mr-2 h-4 w-4" />
                            Request Leave
                        </Button>
                        <LeaveTypes leaveTypes={leaveTypes} />
                    </div>
                }
            />

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-sm font-medium">Leave Requests</CardTitle>
                        <CardDescription>View and manage all leave requests by employees</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <DataTable
                        ref={tableRef}
                        dataTableClass="LeaveRequestDataTable"
                        routes={ModuleDataTableRoutes}
                        fileName="Leaves"
                        onRowAction={handleRowAction}
                        onBulkAction={handleBulkAction}
                        preserveStateKey="hr-leaves-table"
                    />
                </CardContent>
            </Card>

            <DeleteLeaveDialog ref={deleteDialogRef} onDeleted={() => tableRef.current?.reload()} />
            <ApproveLeaveDialog ref={approveDialogRef} onApproved={() => tableRef.current?.reload()} />
            <RejectLeaveDialog ref={rejectDialogRef} onRejected={() => tableRef.current?.reload()} />
            <CancelLeaveDialog ref={cancelDialogRef} onCancelled={() => tableRef.current?.reload()} />
        </AppLayout>
    );
}
