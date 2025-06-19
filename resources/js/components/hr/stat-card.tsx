'use client';

import { Card } from '@/components/ui/card';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ComponentType<{ className?: string }>;
    description?: string;
    trend?: 'positive' | 'negative' | 'neutral';
    trendValue?: string;
    onClick?: () => void;
}

export function StatCard({ title, value, icon: Icon, description, trend, trendValue, onClick }: StatCardProps) {
    const getTrendColor = () => {
        switch (trend) {
            case 'positive':
                return 'text-emerald-600';
            case 'negative':
                return 'text-red-600';
            case 'neutral':
                return 'text-slate-600';
            default:
                return '';
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

    return (
        <Card className={`relative border p-4 transition-all duration-200 ${onClick ? 'cursor-pointer' : ''}`} onClick={onClick}>
            {/* Icon positioned at top right */}
            <div className="absolute top-3 right-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border">
                    <Icon className="h-4 w-4" />
                </div>
            </div>

            {/* Content area with right margin to avoid icon overlap */}
            <div className="pr-10">
                <p className="mb-1 text-xs font-medium">{title}</p>
                <p className="mb-2 text-lg font-bold">{value}</p>

                {(description || trendValue) && (
                    <div className="space-y-0.5">
                        {trendValue && (
                            <p className={`text-xs font-medium ${getTrendColor()}`}>
                                {getTrendIcon()} {trendValue}
                            </p>
                        )}
                        {description && <p className="text-xs">{description}</p>}
                    </div>
                )}
            </div>
        </Card>
    );
}
