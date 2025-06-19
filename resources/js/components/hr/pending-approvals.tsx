'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Clock, XCircle } from 'lucide-react';

export const description = 'Pending approvals for leave requests and expense reports';

// Sample data
const pendingApprovals = [
    {
        id: 1,
        type: 'leave',
        employee: { name: 'Sarah Johnson', avatar: '/avatars/sarah.jpg', initials: 'SJ' },
        description: 'Annual Leave Request',
        period: 'Dec 23 - Jan 2, 2024',
        days: 7,
        urgency: 'high',
        submittedAt: '2 hours ago',
    },
    {
        id: 2,
        type: 'expense',
        employee: { name: 'Mike Chen', avatar: '/avatars/mike.jpg', initials: 'MC' },
        description: 'Travel Expenses',
        amount: '$1,247.50',
        urgency: 'medium',
        submittedAt: '1 day ago',
    },
    {
        id: 3,
        type: 'leave',
        employee: { name: 'Emma Davis', avatar: '/avatars/emma.jpg', initials: 'ED' },
        description: 'Sick Leave',
        period: 'Today',
        days: 1,
        urgency: 'high',
        submittedAt: '30 minutes ago',
    },
    {
        id: 4,
        type: 'expense',
        employee: { name: 'James Wilson', avatar: '/avatars/james.jpg', initials: 'JW' },
        description: 'Office Supplies',
        amount: '$89.99',
        urgency: 'low',
        submittedAt: '3 days ago',
    },
    {
        id: 5,
        type: 'leave',
        employee: { name: 'Lisa Rodriguez', avatar: '/avatars/lisa.jpg', initials: 'LR' },
        description: 'Medical Leave',
        period: 'Jan 8 - Jan 12, 2024',
        days: 5,
        urgency: 'medium',
        submittedAt: '4 hours ago',
    },
];

function getUrgencyColor(urgency: string) {
    switch (urgency) {
        case 'high':
            return 'destructive';
        case 'medium':
            return 'default';
        case 'low':
            return 'secondary';
        default:
            return 'default';
    }
}

export function PendingApprovals() {
    const handleApproval = (id: number, action: 'approve' | 'reject') => {
        console.log(`${action} approval for item ${id}`);
        // Implement approval logic here
    };

    const handleViewAll = () => {
        console.log('Navigate to all pending approvals');
        // Implement navigation logic here
    };

    return (
        <Card className="flex h-full flex-col">
            <CardHeader className="flex-shrink-0">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-orange-600" />
                            Pending Approvals
                        </CardTitle>
                        <CardDescription>Leave requests and expense reports awaiting approval</CardDescription>
                    </div>
                    <Badge variant="destructive">{pendingApprovals.length}</Badge>
                </div>
            </CardHeader>
            <CardContent className="min-h-0 flex-1 overflow-y-auto">
                <div className="space-y-3">
                    {pendingApprovals.slice(0, 4).map((item) => (
                        <div key={item.id} className="bg-card hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 transition-colors">
                            <Avatar className="h-9 w-9">
                                <AvatarImage src={item.employee.avatar} />
                                <AvatarFallback className="text-xs">{item.employee.initials}</AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1">
                                <div className="mb-1 flex items-center justify-between">
                                    <p className="truncate text-sm font-medium">{item.employee.name}</p>
                                    <Badge variant={getUrgencyColor(item.urgency)} className="text-xs">
                                        {item.urgency}
                                    </Badge>
                                </div>
                                <p className="text-muted-foreground text-xs font-medium">{item.description}</p>
                                <p className="text-muted-foreground text-xs">
                                    {item.type === 'leave' ? `${item.period} (${item.days} days)` : item.amount}
                                </p>
                                <p className="text-muted-foreground text-xs">{item.submittedAt}</p>
                            </div>
                            <div className="flex gap-1">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 px-2 text-xs hover:border-green-300 hover:bg-green-50 hover:text-green-700"
                                    onClick={() => handleApproval(item.id, 'approve')}
                                >
                                    <CheckCircle className="h-3 w-3" />
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 px-2 text-xs hover:border-red-300 hover:bg-red-50 hover:text-red-700"
                                    onClick={() => handleApproval(item.id, 'reject')}
                                >
                                    <XCircle className="h-3 w-3" />
                                </Button>
                            </div>
                        </div>
                    ))}

                    {pendingApprovals.length > 4 && (
                        <Button variant="ghost" size="sm" className="mt-3 w-full text-xs" onClick={handleViewAll}>
                            View all {pendingApprovals.length} pending approvals
                        </Button>
                    )}

                    {pendingApprovals.length === 0 && (
                        <div className="text-muted-foreground py-8 text-center">
                            <CheckCircle className="mx-auto mb-2 h-12 w-12 opacity-50" />
                            <p className="text-sm">No pending approvals</p>
                            <p className="text-xs">All caught up! 🎉</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
