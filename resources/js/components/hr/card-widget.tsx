import { Card, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, Tooltip } from 'recharts';

export interface CardWidgetProps {
    /**
     * The title/label for the widget
     */
    title: string;

    /**
     * The main value to display (can be string or number)
     */
    value: string | number;

    /**
     * Optional description or trend text below the value
     */
    description?: string;

    /**
     * Lucide icon component
     */
    icon?: LucideIcon;

    /**
     * Optional trend indicator (positive, negative, neutral)
     */
    trend?: 'positive' | 'negative' | 'neutral';

    /**
     * Loading state
     */
    loading?: boolean;

    /**
     * Additional CSS classes for the card
     */
    className?: string;

    /**
     * Additional CSS classes for the value
     */
    valueClassName?: string;

    /**
     * Optional click handler
     */
    onClick?: () => void;

    /**
     * Optional href for making the card a link
     */
    href?: string;

    /**
     * Optional prefix for the value (like $ for currency)
     */
    valuePrefix?: string;

    /**
     * Optional suffix for the value (like % for percentage)
     */
    valueSuffix?: string;

    /**
     * Optional sparkline data for trend visualization
     */
    sparklineData?: number[];

    /**
     * Sparkline color (defaults to trend color)
     */
    sparklineColor?: string;

    /**
     * Show sparkline instead of icon
     */
    showSparkline?: boolean;

    /**
     * Accessible label for screen readers
     */
    ariaLabel?: string;
}

export function CardWidget({
    title,
    value,
    description,
    icon: Icon,
    trend,
    loading = false,
    className,
    valueClassName,
    onClick,
    href,
    valuePrefix = '',
    valueSuffix = '',
    sparklineData,
    sparklineColor,
    showSparkline = false,
    ariaLabel,
}: CardWidgetProps) {
    const isMobile = useIsMobile();
    const getTrendColor = () => {
        switch (trend) {
            case 'positive':
                return 'text-green-600 dark:text-green-400';
            case 'negative':
                return 'text-red-600 dark:text-red-400';
            case 'neutral':
            default:
                return 'text-muted-foreground';
        }
    };

    const getSparklineColor = () => {
        switch (trend) {
            case 'positive':
                return sparklineColor || '#16a34a'; // green-600
            case 'negative':
                return sparklineColor || '#dc2626'; // red-600
            case 'neutral':
            default:
                return sparklineColor || '#6b7280'; // gray-500
        }
    };

    const formatValue = (val: string | number) => {
        if (typeof val === 'number') {
            return val.toLocaleString();
        }
        return val;
    };

    // Transform sparkline data for recharts
    const chartData =
        sparklineData?.map((value, index) => ({
            index,
            value,
        })) || [];

    const renderTopElement = () => {
        if (showSparkline && sparklineData && sparklineData.length > 0) {
            return (
                <div className={`${isMobile ? 'h-10 w-10' : 'h-12 w-12'}`} role="img" aria-label={`Trend chart for ${title}`}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} maxBarSize={isMobile ? 3 : 4} barGap={1}>
                            <Bar dataKey="value" fill={getSparklineColor()} radius={[2, 2, 0, 0]} strokeWidth={0} />
                            <Tooltip
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        return (
                                            <div className="bg-popover border-border rounded-md border px-2 py-1 shadow-md">
                                                <p className="text-popover-foreground text-xs font-medium">{payload[0].value?.toLocaleString()}</p>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                                cursor={false}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            );
        }

        if (Icon) {
            return (
                <div className={`bg-muted/50 rounded-lg transition-colors ${isMobile ? 'p-2' : 'p-2.5'}`}>
                    <Icon className="text-muted-foreground h-5 w-5" aria-hidden="true" />
                </div>
            );
        }

        return null;
    };

    const LoadingSkeleton = () => (
        <div className="flex flex-col items-center space-y-2" role="status" aria-label="Loading">
            <Skeleton className={`rounded-lg ${isMobile ? 'h-[32px] w-[32px]' : 'h-[40px] w-[40px]'}`} />
            <Skeleton className="h-[32px] w-[80px] rounded" />
            <Skeleton className="h-[16px] w-[64px] rounded" />
            {description && <Skeleton className="h-[16px] w-[96px] rounded" />}
        </div>
    );

    const cardContent = (
        <div className={`flex h-full flex-col items-center justify-center space-y-2 text-center ${isMobile ? 'min-h-[100px]' : 'min-h-[120px]'}`}>
            {loading ? (
                <LoadingSkeleton />
            ) : (
                <>
                    {renderTopElement()}

                    <div className={cn('text-2xl leading-none font-bold', valueClassName)}>
                        {valuePrefix}
                        {formatValue(value)}
                        {valueSuffix}
                    </div>

                    <CardTitle className="text-muted-foreground text-xs font-medium tracking-wide uppercase">{title}</CardTitle>

                    {description && <p className={cn('text-xs leading-none', getTrendColor())}>{description}</p>}
                </>
            )}
        </div>
    );

    const cardProps = {
        className: cn(
            'group h-full transition-all duration-200 hover:shadow-lg',
            onClick && 'cursor-pointer',
            href && 'cursor-pointer',
            'focus-within:ring-ring focus-within:ring-2 focus-within:ring-offset-2',
            className,
        ),
        role: onClick || href ? 'button' : undefined,
        tabIndex: onClick || href ? 0 : undefined,
        'aria-label': ariaLabel || `${title}: ${formatValue(value)}${valueSuffix}`,
    };

    if (href) {
        return (
            <Link href={href} className="block h-full focus:outline-none">
                <Card {...cardProps} className={cn(cardProps.className, isMobile ? 'p-3' : 'p-4')}>
                    {cardContent}
                </Card>
            </Link>
        );
    }

    return (
        <Card
            {...cardProps}
            onClick={onClick}
            onKeyDown={(e) => {
                if (onClick && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    onClick();
                }
            }}
            className={cn(cardProps.className, isMobile ? 'p-3' : 'p-4')}
        >
            {cardContent}
        </Card>
    );
}
