import { EmptyState } from '@/components/empty-state';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { ArrowRightIcon, Calendar, CheckCircle, Clock, DollarSign, FileText, Timer, User, Users } from 'lucide-react';

interface ApprovalItem {
    id: string;
    type: 'leave' | 'overtime' | 'expense' | 'profile' | 'training' | 'document';
    title: string;
    employee: string;
    department: string;
    submittedAt: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    amount?: string;
    days?: number;
    employeeAvatar?: string;
}

interface HRApprovalsCardProps {
    onViewAll?: () => void;
    onApprove?: (id: string) => void;
    onReview?: (id: string) => void;
    isLoading?: boolean;
}

export function ApprovalsCard({ onViewAll, onApprove, onReview, isLoading = false }: HRApprovalsCardProps) {
    const pendingApprovals: ApprovalItem[] = [
        {
            id: '1',
            type: 'leave',
            title: 'Annual Leave Request',
            employee: 'Sarah Johnson',
            department: 'Marketing',
            submittedAt: '2 hours ago',
            priority: 'medium',
            days: 5,
        },
        {
            id: '2',
            type: 'overtime',
            title: 'Overtime Request',
            employee: 'Mike Chen',
            department: 'Engineering',
            submittedAt: '4 hours ago',
            priority: 'high',
        },
        {
            id: '3',
            type: 'expense',
            title: 'Travel Expense',
            employee: 'Emily Davis',
            department: 'Sales',
            submittedAt: '1 day ago',
            priority: 'medium',
            amount: '$1,245.50',
        },
        {
            id: '4',
            type: 'training',
            title: 'Training Request',
            employee: 'Alex Rodriguez',
            department: 'HR',
            submittedAt: '2 days ago',
            priority: 'low',
        },
        {
            id: '5',
            type: 'profile',
            title: 'Profile Update',
            employee: 'Lisa Wang',
            department: 'Finance',
            submittedAt: '3 days ago',
            priority: 'urgent',
        },
    ];

    const getTypeConfig = (type: ApprovalItem['type']) => {
        const configs = {
            leave: {
                icon: Calendar,
                label: 'Leave',
                color: 'bg-blue-50 text-blue-700 border-blue-200',
            },
            overtime: {
                icon: Clock,
                label: 'Overtime',
                color: 'bg-orange-50 text-orange-700 border-orange-200',
            },
            expense: {
                icon: DollarSign,
                label: 'Expense',
                color: 'bg-green-50 text-green-700 border-green-200',
            },
            training: {
                icon: Users,
                label: 'Training',
                color: 'bg-purple-50 text-purple-700 border-purple-200',
            },
            profile: {
                icon: User,
                label: 'Profile',
                color: 'bg-gray-50 text-gray-700 border-gray-200',
            },
            document: {
                icon: FileText,
                label: 'Document',
                color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
            },
        };
        return configs[type];
    };

    const getPriorityText = (priority: ApprovalItem['priority']) => {
        return priority.charAt(0).toUpperCase() + priority.slice(1);
    };

    const getPriorityColor = (priority: ApprovalItem['priority']) => {
        switch (priority) {
            case 'urgent':
                return 'text-red-600';
            case 'high':
                return 'text-orange-600';
            case 'medium':
                return 'text-yellow-600';
            case 'low':
                return 'text-gray-500';
            default:
                return 'text-gray-500';
        }
    };

    const getEmployeeInitials = (name: string) => {
        return name
            .split(' ')
            .map((part) => part[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const getApprovalCounts = () => {
        const total = pendingApprovals.length;
        const urgent = pendingApprovals.filter((item) => item.priority === 'urgent' || item.priority === 'high').length;
        return { total, urgent };
    };

    const { total, urgent } = getApprovalCounts();

    if (isLoading) {
        return (
            <Card className="h-full">
                <CardHeader className="pb-3">
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-48" />
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-center space-x-3">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-3 w-1/2" />
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="h-full">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <CardTitle>Pending Approvals</CardTitle>
                    </div>
                    <CardDescription>
                        {total} items awaiting your review
                        {urgent > 0 && <span className="ml-1 text-red-600">• {urgent} urgent</span>}
                    </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                        {total}
                    </Badge>
                    <Timer className="text-muted-foreground h-4 w-4" />
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="space-y-3">
                    {pendingApprovals.map((approval, index) => {
                        const typeConfig = getTypeConfig(approval.type);
                        const IconComponent = typeConfig.icon;

                        return (
                            <div key={approval.id}>
                                <div className="flex items-start justify-between space-x-2">
                                    <div className="flex min-w-0 flex-1 items-start space-x-3">
                                        <Avatar className="h-12 w-12 rounded-lg">
                                            <AvatarFallback className="rounded-lg bg-gradient-to-br from-green-500 to-purple-600 text-sm font-medium text-white">
                                                {getEmployeeInitials(approval.employee)}
                                            </AvatarFallback>
                                        </Avatar>

                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2">
                                                <p className="truncate text-sm font-medium">{approval.title}</p>
                                                <Badge className={cn('text-xs', typeConfig.color)}>
                                                    <IconComponent className="mr-1 h-3 w-3" />
                                                    {typeConfig.label}
                                                </Badge>
                                            </div>
                                            <div className="text-muted-foreground flex items-center gap-1 text-xs">
                                                <span>{approval.employee}</span>
                                                <span>•</span>
                                                <span>{approval.department}</span>
                                                <span>•</span>
                                                <span>{approval.submittedAt}</span>
                                                <span>•</span>
                                                <span className={cn('font-medium', getPriorityColor(approval.priority))}>
                                                    {getPriorityText(approval.priority)} priority
                                                </span>
                                            </div>
                                            {(approval.amount || approval.days) && (
                                                <div className="text-muted-foreground mt-1 text-xs">
                                                    {approval.amount && `Amount: ${approval.amount}`}
                                                    {approval.days && `Duration: ${approval.days} days`}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-shrink-0 items-center gap-1">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="cursor-pointer text-xs"
                                            onClick={() => onReview?.(approval.id)}
                                        >
                                            Review
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="cursor-pointer text-xs text-green-600 hover:text-green-700"
                                            onClick={() => onApprove?.(approval.id)}
                                        >
                                            <CheckCircle className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </div>
                                {index < pendingApprovals.length - 1 && <Separator className="mt-3" />}
                            </div>
                        );
                    })}
                </div>

                {total > 0 && (
                    <>
                        <Separator />
                        <div className="text-center">
                            <Button variant="outline" size="sm" onClick={onViewAll} className="w-full cursor-pointer text-xs">
                                View all approvals <ArrowRightIcon />
                            </Button>
                        </div>
                    </>
                )}

                {total === 0 && (
                    <EmptyState icon={CheckCircle} iconSize="h-8 w-8" title="All caught up!" description="No pending approvals at the moment" />
                )}
            </CardContent>
        </Card>
    );
}
