'use client';

import { Card, CardContent } from '@/components/ui/card';

export const description = 'Employee statistical card component with gender breakdown';

interface GenderBreakdown {
    male: number;
    female: number;
}

interface EmployeeStatCardProps {
    title: string;
    value: string | number;
    icon: React.ComponentType<{ className?: string }>;
    description?: string;
    trend?: 'positive' | 'negative' | 'neutral';
    trendValue?: string;
    genderBreakdown?: GenderBreakdown;
    onClick?: () => void;
    className?: string;
}

export function EmployeeStatCard({
    title,
    value,
    icon: Icon,
    description,
    trend,
    trendValue,
    genderBreakdown,
    onClick,
    className = '',
}: EmployeeStatCardProps) {
    const getTrendColor = () => {
        switch (trend) {
            case 'positive':
                return 'text-green-600';
            case 'negative':
                return 'text-red-600';
            case 'neutral':
                return 'text-gray-600';
            default:
                return 'text-muted-foreground';
        }
    };

    const getTrendIcon = () => {
        switch (trend) {
            case 'positive':
                return '↗';
            case 'negative':
                return '↘';
            case 'neutral':
                return '→';
            default:
                return '';
        }
    };

    const getGenderPercentage = (gender: 'male' | 'female') => {
        if (!genderBreakdown) return 0;
        const total = genderBreakdown.male + genderBreakdown.female;
        if (total === 0) return 0;
        return Math.round((genderBreakdown[gender] / total) * 100);
    };

    return (
        <Card className={`transition-shadow hover:shadow-md ${onClick ? 'hover:bg-accent/50 cursor-pointer' : ''} ${className}`} onClick={onClick}>
            <CardContent>
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <p className="text-muted-foreground text-sm font-medium">{title}</p>
                        <p className="text-2xl font-bold">{value}</p>
                        {(description || trendValue) && (
                            <div className="flex items-center gap-1">
                                {trendValue && (
                                    <span className={`text-xs font-medium ${getTrendColor()}`}>
                                        {getTrendIcon()} {trendValue}
                                    </span>
                                )}
                                {description && <p className="text-muted-foreground text-xs">{description}</p>}
                            </div>
                        )}
                    </div>
                    <div className="border rounded-lg p-3">
                        <Icon className="text-primary h-6 w-6" />
                    </div>
                </div>

                {/* Gender Breakdown */}
                {genderBreakdown && (
                    <div className="space-y-2">
                        <div className="text-muted-foreground flex items-center justify-between text-xs">
                            <span>Gender Distribution</span>
                            <span>{genderBreakdown.male + genderBreakdown.female} total</span>
                        </div>

                        <div className="flex gap-2">
                            <div className="flex items-center gap-1">
                                <div className="h-2 w-2 rounded-full bg-gray-600"></div>
                                <span className="text-muted-foreground text-xs">Male: {genderBreakdown.male}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="h-2 w-2 rounded-full bg-pink-300"></div>
                                <span className="text-muted-foreground text-xs">Female: {genderBreakdown.female}</span>
                            </div>
                        </div>

                        {/* Visual Gender Bar */}
                        <div className="flex h-1.5 overflow-hidden rounded-full bg-gray-200">
                            <div className="bg-gray-600" style={{ width: `${getGenderPercentage('male')}%` }}></div>
                            <div className="bg-pink-300" style={{ width: `${getGenderPercentage('female')}%` }}></div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
