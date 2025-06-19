'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { LeaveRequest } from '@/types';
import { ArrowUpRight, Calendar, Clock, Shield, User } from 'lucide-react';

interface LeaveCardProps {
    leaveRequest: LeaveRequest;
    onView?: (id: number) => void;
    onApprove?: (id: number) => void;
    onReject?: (id: number) => void;
}

export function LeaveCard({ leaveRequest, onView }: LeaveCardProps) {
    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'approved':
                return {
                    color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
                };
            case 'pending':
                return {
                    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
                };
            case 'rejected':
                return {
                    color: 'bg-red-100 text-red-800 border-red-200',
                };
            case 'ongoing':
                return {
                    color: 'bg-blue-100 text-blue-800 border-blue-200',
                };
            default:
                return {
                    color: 'bg-slate-100 text-slate-800 border-slate-200',
                };
        }
    };

    const statusConfig = getStatusConfig(leaveRequest.status);

    const formatDateRange = () => {
        const start = new Date(leaveRequest.startDate).toLocaleDateString();
        const end = new Date(leaveRequest.endDate).toLocaleDateString();
        return `${start} - ${end}`;
    };

    return (
        <Card className="group relative cursor-pointer overflow-hidden transition-all duration-300" onClick={() => onView?.(leaveRequest.id)}>
            {/* Header with Employee Info */}
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={leaveRequest.employee.avatar} />
                            <AvatarFallback className="text-sm font-semibold">{leaveRequest.employee.initials}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                            <CardTitle className="text-base leading-tight font-bold transition-colors">{leaveRequest.employee.name}</CardTitle>
                            <p className="text-xs font-medium">{leaveRequest.employee.department}</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <Badge className={`${statusConfig.color} border px-2 py-0.5 text-xs font-medium`}>{leaveRequest.status}</Badge>
                        <ArrowUpRight className="h-4 w-4 opacity-0 transition-all duration-200 group-hover:opacity-100" />
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-3">
                {/* Leave Type and Duration */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Badge className={`${leaveRequest.leaveType.color} border px-2 py-1 text-xs font-medium`}>
                            {leaveRequest.leaveType.name}
                        </Badge>
                        {leaveRequest.leaveType.requiresApproval && (
                            <span className="inline-flex items-center" title="Requires approval">
                                <Shield className="h-3 w-3 text-amber-600" />
                            </span>
                        )}
                    </div>
                    <div className="text-right">
                        <div className="text-lg font-bold">{leaveRequest.days}</div>
                        <div className="text-xs">{leaveRequest.leaveType.maxDays ? `of ${leaveRequest.leaveType.maxDays} days` : 'days'}</div>
                    </div>
                </div>

                {/* Date Range */}
                <div className="space-y-2">
                    <div className="flex items-start gap-2 rounded-lg border p-2">
                        <Calendar className="h-4 w-4" />
                        <div className="flex-1">
                            <div className="text-xs font-medium">Date Range</div>
                            <div className="text-sm font-semibold">{formatDateRange()}</div>
                        </div>
                    </div>
                </div>

                {/* Reason */}
                <div className="space-y-1">
                    <div className="text-xs font-medium">Reason</div>
                    <p className="truncate text-sm">{leaveRequest.reason}</p>
                </div>

                {/* Applied Date and Approver */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>Applied {new Date(leaveRequest.appliedDate).toLocaleDateString()}</span>
                    </div>
                    {leaveRequest.approver && (
                        <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span>{leaveRequest.approver.name}</span>
                        </div>
                    )}
                </div>
            </CardContent>

            {/* Priority indicator at bottom */}
            <CardFooter className="pt-2">
                <div className="flex w-full items-center justify-between border-t pt-3">
                    <div className="text-xs font-medium">Priority</div>
                    <div
                        className={`text-xs font-bold capitalize ${
                            leaveRequest.priority === 'urgent'
                                ? 'text-red-600'
                                : leaveRequest.priority === 'high'
                                  ? 'text-orange-600'
                                  : 'text-emerald-600'
                        }`}
                    >
                        {leaveRequest.priority}
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
}
