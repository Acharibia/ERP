'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { Position } from '@/types';
import { ArrowUpRight, Calendar, Clock, DollarSign, MapPin, Users } from 'lucide-react';

interface PositionCardProps {
    position: Position;
    onView?: (id: number) => void;
    onEdit?: (id: number) => void;
    onManage?: (id: number) => void;
}

export function PositionCard({ position, onView }: PositionCardProps) {
    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'open':
                return {
                    color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
                };
            case 'filled':
                return {
                    color: 'bg-blue-100 text-blue-800 border-blue-200',
                };
            case 'draft':
                return {
                    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
                };
            case 'closed':
                return {
                    color: 'bg-red-100 text-red-800 border-red-200',
                };
            default:
                return {
                    color: 'bg-slate-100 text-slate-800 border-slate-200',
                };
        }
    };

    const getPriorityConfig = (priority: string) => {
        switch (priority) {
            case 'high':
                return 'text-red-800 border-red-200';
            case 'medium':
                return 'text-yellow-800 border-yellow-200';
            case 'low':
                return 'text-emerald-800 border-emerald-200';
            default:
                return 'text-slate-800 border-slate-200';
        }
    };

    const statusConfig = getStatusConfig(position.status);
    const priorityConfig = getPriorityConfig(position.priority);

    const daysUntilClosing = Math.ceil((new Date(position.closingDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

    return (
        <Card className="group relative cursor-pointer overflow-hidden transition-all duration-300" onClick={() => onView?.(position.id)}>
            {/* Header */}
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                        <div className="mb-2 flex items-center gap-2">
                            <CardTitle className="text-lg leading-tight font-bold transition-colors">{position.title}</CardTitle>
                            <ArrowUpRight className="h-4 w-4 opacity-0 transition-all duration-200 group-hover:opacity-100" />
                        </div>
                        <p className="mb-2 text-sm font-medium">{position.department}</p>
                        <div className="flex gap-2">
                            <Badge className={`${statusConfig.color} border px-2 py-0.5 text-xs font-medium`}>{position.status}</Badge>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="mb-1 text-xs font-medium">Priority</div>
                        <div className={`${priorityConfig} text-lg font-bold capitalize`}>{position.priority}</div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Job Description */}
                <div className="space-y-2">
                    <p className="truncate text-sm leading-relaxed">{position.description}</p>
                    <div className="flex items-center gap-2 text-xs">
                        <span className="rounded-md border px-2 py-1 font-medium capitalize">{position.experience}</span>
                        <span>•</span>
                        <span className="rounded-md border px-2 py-1 font-medium capitalize">{position.type}</span>
                    </div>
                </div>

                {/* Key metrics in a row */}
                <div className="grid grid-cols-3 gap-2 text-center">
                    {/* Applicants */}
                    <div className="flex flex-col items-center gap-1 rounded-md border p-2">
                        <Users className="h-4 w-4" />
                        <div className="text-lg font-bold">{position.applicants}</div>
                        <div className="text-xs">applicants</div>
                    </div>

                    {/* Days left */}
                    <div className="flex flex-col items-center gap-1 rounded-md border p-2">
                        <Clock className="h-4 w-4" />
                        <div className="text-lg font-bold">{daysUntilClosing}</div>
                        <div className="text-xs">days left</div>
                    </div>

                    {/* Salary indicator */}
                    <div className="flex flex-col items-center gap-1 rounded-md border p-2">
                        <DollarSign className="h-4 w-4" />
                        <div className="text-center text-xs leading-tight font-bold">{position.salaryRange.split(' - ')[0]}</div>
                        <div className="text-xs">starting</div>
                    </div>
                </div>

                {/* Timeline */}
                <div className="flex items-center justify-between rounded-md border p-2 text-xs">
                    <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>Posted {new Date(position.postedDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span>Closes {new Date(position.closingDate).toLocaleDateString()}</span>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="pt-2">
                {/* Location */}
                <div className="flex w-full items-center gap-2 border-t pt-3">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm font-medium">{position.location}</span>
                    <div className="ml-auto text-xs font-medium">{position.salaryRange}</div>
                </div>
            </CardFooter>
        </Card>
    );
}
