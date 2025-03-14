'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { TrendingUp } from 'lucide-react';

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

const OverviewChart = () => {
    // Define enhanced colors directly within the component
    // Using a more sophisticated color palette with better contrast
    const colors = {
        revenue: {
            stroke: '#1d4ed8', // Deeper blue for revenue (most important metric)
            fill: '#1d4ed8',
        },
        subscriptions: {
            stroke: '#059669', // Rich green for subscriptions (mid-importance)
            fill: '#059669',
        },
        activeUsers: {
            stroke: '#7c3aed', // Vibrant purple for active users (supporting metric)
            fill: '#7c3aed',
        },
    };

    // Sample data representing monthly revenue, subscriptions, and active users
    const chartData = [
        { month: 'January', revenue: 14000, subscriptions: 1200, activeUsers: 1900 },
        { month: 'February', revenue: 18000, subscriptions: 1500, activeUsers: 2100 },
        { month: 'March', revenue: 16000, subscriptions: 1700, activeUsers: 2400 },
        { month: 'April', revenue: 21000, subscriptions: 1850, activeUsers: 2700 },
        { month: 'May', revenue: 26000, subscriptions: 2100, activeUsers: 2900 },
        { month: 'June', revenue: 29000, subscriptions: 2300, activeUsers: 3100 },
        { month: 'July', revenue: 32000, subscriptions: 2350, activeUsers: 3300 },
    ];

    // Chart configuration for styling and labels with more descriptive labels
    const chartConfig = {
        revenue: {
            label: 'Total Revenue',
            color: 'blue',
        },
        subscriptions: {
            label: 'Active Subscriptions',
            color: 'green',
        },
        activeUsers: {
            label: 'Monthly Active Users',
            color: 'purple',
        },
    };

    // Calculate the percentage change from previous month to current month
    const calculateTrend = () => {
        const lastMonthIndex = chartData.length - 1;
        const previousMonthIndex = lastMonthIndex - 1;

        if (lastMonthIndex >= 1) {
            const currentRevenue = chartData[lastMonthIndex].revenue;
            const previousRevenue = chartData[previousMonthIndex].revenue;
            const percentChange = ((currentRevenue - previousRevenue) / previousRevenue) * 100;

            return {
                value: percentChange.toFixed(1),
                isUp: percentChange > 0,
            };
        }

        return { value: '0.0', isUp: true };
    };

    const trend = calculateTrend();

    return (
        <Card className="col-span-6">
            <CardHeader>
                <CardTitle>Key Metrics Overview</CardTitle>
                <CardDescription>Monthly performance trends</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <AreaChart data={chartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value.slice(0, 3)} />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `$${value / 1000}k`}
                            tickMargin={8}
                            style={{ fontSize: '12px' }}
                        />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                        <Area
                            type="monotone"
                            dataKey="activeUsers"
                            stackId="1"
                            fill={colors.activeUsers.fill}
                            fillOpacity={0.3}
                            stroke={colors.activeUsers.stroke}
                            strokeWidth={2}
                        />
                        <Area
                            type="monotone"
                            dataKey="subscriptions"
                            stackId="1"
                            fill={colors.subscriptions.fill}
                            fillOpacity={0.3}
                            stroke={colors.subscriptions.stroke}
                            strokeWidth={2}
                        />
                        <Area
                            type="monotone"
                            dataKey="revenue"
                            stackId="1"
                            fill={colors.revenue.fill}
                            fillOpacity={0.3}
                            stroke={colors.revenue.stroke}
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
                        <div className="text-muted-foreground flex items-center gap-2 leading-none">January - July 2024</div>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
};

export default OverviewChart;
