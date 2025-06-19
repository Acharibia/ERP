'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { Department } from '@/types';
import { ArrowUpRight, DollarSign, MapPin, Users } from 'lucide-react';

interface DepartmentCardProps {
    department: Department;
    onView?: (id: number) => void;
    onEdit?: (id: number) => void;
    onManage?: (id: number) => void;
}

export function DepartmentCard({ department, onView }: DepartmentCardProps) {
    const getStatusConfig = (performance?: string) => {
        switch (performance) {
            case 'excellent':
                return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case 'good':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'average':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'needs_attention':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-slate-100 text-slate-800 border-slate-200';
        }
    };

    const getBudgetStatus = (utilized?: number) => {
        if (!utilized) return { color: 'text-slate-600', bg: 'bg-slate-500' };

        if (utilized >= 90) return { color: 'text-orange-600', bg: 'bg-orange-500' };
        if (utilized >= 75) return { color: 'text-yellow-600', bg: 'bg-yellow-500' };
        return { color: 'text-emerald-600', bg: 'bg-emerald-500' };
    };

    const formatBudget = (budget?: number | null) => {
        if (!budget) return 'N/A';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            notation: 'compact',
            maximumFractionDigits: 1,
        }).format(budget);
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((word) => word.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const statusConfig = getStatusConfig(department.performance);
    const budgetStatus = getBudgetStatus(department.budget_utilized);
    const employeeCount = department.employee_count || 0;
    const openPositions = department.open_positions || 0;
    const budgetUtilized = department.budget_utilized || 0;

    return (
        <Card
            className="group relative cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-md"
            onClick={() => onView?.(department.id)}
        >
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="mb-2 flex items-center gap-3">
                            <CardTitle className="text-lg font-bold transition-colors">{department.name}</CardTitle>
                            <ArrowUpRight className="h-4 w-4 opacity-0 transition-all duration-200 group-hover:opacity-100" />
                        </div>
                        {department.performance && (
                            <Badge className={`${statusConfig} border px-2.5 py-1 text-xs font-medium`}>
                                {department.performance.replace('_', ' ')}
                            </Badge>
                        )}
                    </div>
                    {openPositions > 0 && (
                        <div className="text-right">
                            <div className="text-muted-foreground mb-1 text-xs font-medium">Vacancies</div>
                            <div className="text-lg font-bold">{openPositions}</div>
                        </div>
                    )}
                </div>
            </CardHeader>

            <CardContent>
                {/* Manager */}
                {department.manager && (
                    <div className="mb-4 flex items-center gap-3 rounded-lg border p-3">
                        <Avatar className="h-10 w-10">
                            <AvatarFallback className="text-sm font-semibold">{getInitials(department.manager.name)}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                            <p className="truncate font-semibold">{department.manager.name}</p>
                            <p className="text-muted-foreground text-xs font-medium">Department Head</p>
                        </div>
                    </div>
                )}

                <div className="space-y-2">
                    {/* Team Size */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg border">
                                <Users className="h-4 w-4" />
                            </div>
                            <div>
                                <div className="text-muted-foreground text-xs font-medium">Team Size</div>
                                <div className="text-sm font-bold">{employeeCount}</div>
                            </div>
                        </div>
                        {department.gender_breakdown && (
                            <div className="text-right">
                                <div className="text-muted-foreground mb-1 flex gap-1 text-xs font-medium">
                                    <span>{department.gender_breakdown.male}M</span>
                                    <span>•</span>
                                    <span>{department.gender_breakdown.female}F</span>
                                </div>
                                <div className="flex h-1.5 gap-1">
                                    <div
                                        className="rounded-full bg-blue-400"
                                        style={{
                                            width: `${Math.max((department.gender_breakdown.male / employeeCount) * 40, 2)}px`,
                                        }}
                                    />
                                    <div
                                        className="rounded-full bg-pink-400"
                                        style={{
                                            width: `${Math.max((department.gender_breakdown.female / employeeCount) * 40, 2)}px`,
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Budget */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg border">
                                <DollarSign className="h-4 w-4" />
                            </div>
                            <div>
                                <div className="text-muted-foreground text-xs font-medium">Budget</div>
                                <div className="text-sm font-bold">{formatBudget(department.budget)}</div>
                            </div>
                        </div>
                        {department.budget_utilized && (
                            <div className="text-right">
                                <div className={`text-sm font-bold ${budgetStatus.color} mb-1`}>{budgetUtilized}%</div>
                                <div className="bg-muted h-2 w-16 overflow-hidden rounded-full">
                                    <div
                                        className={`h-full ${budgetStatus.bg} transition-all duration-500 ease-out`}
                                        style={{ width: `${Math.min(budgetUtilized, 100)}%` }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>

            {department.location && (
                <CardFooter>
                    <div className="flex w-full items-center gap-2 border-t pt-4">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg border">
                            <MapPin className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                            <div className="text-muted-foreground text-xs font-medium">Location</div>
                            <div className="text-sm font-bold">{department.location}</div>
                        </div>
                    </div>
                </CardFooter>
            )}
        </Card>
    );
}
