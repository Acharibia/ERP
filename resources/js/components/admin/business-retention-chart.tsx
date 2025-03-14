'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { TrendingUp } from 'lucide-react';

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

interface BusinessRetentionChartProps {
    className?: string;
}

const BusinessRetentionChart = ({ className }: BusinessRetentionChartProps) => {
    // Define color for retention
    const colors = {
        retention: {
            stroke: '#10b981', // Green color for retention
            fill: '#10b981',
        },
    };

    // Sample data representing monthly retention rates
    const chartData = [
        { month: 'January', retention: 95.3 },
        { month: 'February', retention: 94.8 },
        { month: 'March', retention: 96.2 },
        { month: 'April', retention: 95.7 },
        { month: 'May', retention: 95.1 },
        { month: 'June', retention: 94.9 },
        { month: 'July', retention: 96.5 },
        { month: 'August', retention: 97.2 },
        { month: 'September', retention: 97.0 },
        { month: 'October', retention: 96.7 },
        { month: 'November', retention: 97.5 },
        { month: 'December', retention: 97.8 },
    ];

    // Chart configuration for styling and labels
    const chartConfig = {
        retention: {
            label: 'Retention Rate',
            color: 'green',
        },
    };

    // Calculate the percentage change from previous month to current month
    const calculateTrend = () => {
        const lastMonthIndex = chartData.length - 1;
        const previousMonthIndex = lastMonthIndex - 1;

        if (lastMonthIndex >= 1) {
            const currentRetention = chartData[lastMonthIndex].retention;
            const previousRetention = chartData[previousMonthIndex].retention;
            const percentChange = (currentRetention - previousRetention).toFixed(1);

            return {
                value: Math.abs(parseFloat(percentChange)),
                isUp: parseFloat(percentChange) > 0,
            };
        }

        return { value: '0.0', isUp: true };
    };

    // Calculate average retention rate
    const calculateAverage = () => {
        const sum = chartData.reduce((total, item) => total + item.retention, 0);
        return (sum / chartData.length).toFixed(1);
    };

    const trend = calculateTrend();
    const averageRetention = calculateAverage();

    return (
        <Card className={`col-span-12 lg:col-span-6 ${className}`}>
            <CardHeader>
                <CardTitle>Business Retention Rate</CardTitle>
                <CardDescription>Monthly client retention percentage over the past year</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <AreaChart data={chartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value.slice(0, 3)} />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            domain={[90, 100]}
                            tickFormatter={(value) => `${value}%`}
                            tickMargin={8}
                            style={{ fontSize: '12px' }}
                        />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                        <Area
                            type="monotone"
                            dataKey="retention"
                            fill={colors.retention.fill}
                            fillOpacity={0.3}
                            stroke={colors.retention.stroke}
                            strokeWidth={2}
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
            <CardFooter>
                <div className="flex w-full items-start gap-2 text-sm">
                    <div className="grid gap-2">
                        <div className="flex items-center gap-2 leading-none font-medium">
                            {trend.isUp ? 'Trending up' : 'Trending down'} by {trend.value}% this month
                            <TrendingUp className={`h-4 w-4 ${trend.isUp ? 'text-green-600' : 'rotate-180 transform text-red-600'}`} />
                        </div>
                        <div className="text-muted-foreground flex items-center gap-2 leading-none">
                            <span className="font-semibold">{averageRetention}%</span> Average Retention Rate
                        </div>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
};

export default BusinessRetentionChart;
