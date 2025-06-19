import { LeaveCard } from '@/components/hr/leave-card';
import { LeaveTypesSheet } from '@/components/hr/leave-types-sheet';
import { StatCard } from '@/components/hr/stat-card';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/page-header';
import AppLayout from '@/layouts/app-layout';
import { LeaveType, type BreadcrumbItem, type LeaveRequest } from '@/types';
import { Head } from '@inertiajs/react';
import { Calendar, CheckCircle, Clock, Plus, Settings, UserX } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/modules/hr/dashboard',
    },
    {
        title: 'Leaves',
        href: '/modules/hr/leaves',
    },
];

const leaveTypes: LeaveType[] = [
    {
        id: 1,
        name: 'Annual Leave',
        code: 'annual',
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        maxDays: 25,
        requiresApproval: true,
        carryOver: true,
        isActive: true,
    },
    {
        id: 2,
        name: 'Sick Leave',
        code: 'sick',
        color: 'bg-red-100 text-red-800 border-red-200',
        maxDays: 10,
        requiresApproval: false,
        carryOver: false,
        isActive: true,
    },
    {
        id: 3,
        name: 'Personal Day',
        code: 'personal',
        color: 'bg-purple-100 text-purple-800 border-purple-200',
        maxDays: 5,
        requiresApproval: true,
        carryOver: false,
        isActive: true,
    },
    {
        id: 4,
        name: 'Maternity Leave',
        code: 'maternity',
        color: 'bg-pink-100 text-pink-800 border-pink-200',
        maxDays: 120,
        requiresApproval: true,
        carryOver: false,
        isActive: true,
    },
    {
        id: 5,
        name: 'Study Leave',
        code: 'study',
        color: 'bg-indigo-100 text-indigo-800 border-indigo-200',
        maxDays: 15,
        requiresApproval: true,
        carryOver: true,
        isActive: true,
    },
];

const leaveRequests: LeaveRequest[] = [
    {
        id: 1,
        employee: { name: 'Sarah Chen', initials: 'SC', avatar: '/avatars/sarah.jpg', department: 'Engineering' },
        leaveType: leaveTypes[0],
        status: 'approved',
        startDate: '2024-02-15',
        endDate: '2024-02-19',
        days: 5,
        reason: 'Family vacation to Europe',
        appliedDate: '2024-01-20',
        approver: { name: 'Mike Johnson', initials: 'MJ' },
        priority: 'normal',
    },
    {
        id: 2,
        employee: { name: 'Mike Johnson', initials: 'MJ', avatar: '/avatars/mike.jpg', department: 'Sales' },
        leaveType: leaveTypes[1],
        status: 'ongoing',
        startDate: '2024-02-10',
        endDate: '2024-02-12',
        days: 3,
        reason: 'Medical appointment and recovery',
        appliedDate: '2024-02-09',
        approver: { name: 'Emma Davis', initials: 'ED' },
        priority: 'urgent',
    },
];

export default function Index() {
    const [isLeaveTypesOpen, setIsLeaveTypesOpen] = useState(false);

    const handleViewLeave = (id: number) => {
        console.log(`View leave request ${id}`);
    };

    const handleApproveLeave = (id: number) => {
        console.log(`Approve leave request ${id}`);
    };

    const handleRejectLeave = (id: number) => {
        console.log(`Reject leave request ${id}`);
    };

    const handleAddLeave = () => {
        console.log('Add new leave request');
    };

    const handleStatClick = (type: string) => {
        console.log(`Navigate to ${type} view`);
    };

    // Calculate statistics from leave requests data
    const totalRequests = leaveRequests.length;
    const pendingRequests = leaveRequests.filter((l) => l.status === 'pending').length;
    const approvedRequests = leaveRequests.filter((l) => l.status === 'approved').length;
    const ongoingLeaves = leaveRequests.filter((l) => l.status === 'ongoing').length;
    const urgentRequests = leaveRequests.filter((l) => l.priority === 'urgent' && l.status === 'pending').length;

    const totalDaysRequested = leaveRequests.reduce((sum, leave) => sum + leave.days, 0);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Leave Management" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl">
                {/* Header */}
                <PageHeader title="Leave Management" description="Manage employee leave requests and track time off">
                    <Button onClick={handleAddLeave}>
                        <Plus className="mr-2 h-4 w-4" />
                        New Leave Request
                    </Button>
                    <Button variant="outline" onClick={() => setIsLeaveTypesOpen(true)}>
                        <Settings className="mr-2 h-4 w-4" />
                        Manage Leave Types
                    </Button>
                </PageHeader>

                {/* Leave Statistics */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                    <StatCard
                        title="Total Requests"
                        value={totalRequests}
                        icon={Calendar}
                        description="this month"
                        onClick={() => handleStatClick('total')}
                    />
                    <StatCard
                        title="Pending"
                        value={pendingRequests}
                        icon={Clock}
                        trend={urgentRequests > 0 ? 'negative' : 'neutral'}
                        trendValue={urgentRequests > 0 ? `${urgentRequests} urgent` : 'all normal'}
                        onClick={() => handleStatClick('pending')}
                    />
                    <StatCard
                        title="Approved"
                        value={approvedRequests}
                        icon={CheckCircle}
                        trend="positive"
                        trendValue="processing time 2.3"
                        onClick={() => handleStatClick('approved')}
                    />
                    <StatCard
                        title="On Leave Today"
                        value={ongoingLeaves}
                        icon={UserX}
                        description="employees currently off"
                        onClick={() => handleStatClick('ongoing')}
                    />
                    <StatCard
                        title="Days Requested"
                        value={totalDaysRequested}
                        icon={Calendar}
                        trend="neutral"
                        trendValue="avg 18 days"
                        onClick={() => handleStatClick('days')}
                    />
                </div>

                {/* Leave Request Cards */}
                <div>
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                        {leaveRequests.map((leaveRequest) => (
                            <LeaveCard
                                key={leaveRequest.id}
                                leaveRequest={leaveRequest}
                                onView={handleViewLeave}
                                onApprove={handleApproveLeave}
                                onReject={handleRejectLeave}
                            />
                        ))}
                    </div>
                </div>

                {/* Leave Types Sheet */}
                <LeaveTypesSheet isOpen={isLeaveTypesOpen} onClose={() => setIsLeaveTypesOpen(false)} leaveTypes={leaveTypes} />
            </div>
        </AppLayout>
    );
}
