'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart3, TrendingUp } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Cell, LabelList, XAxis, YAxis } from 'recharts';

interface SubscriptionDistributionChartProps {
    className?: string;
}

const SubscriptionDistributionChart = ({ className }: SubscriptionDistributionChartProps) => {
    // Define data for subscription distribution with colors
    const chartData = [
        { name: 'Standard', value: 498, color: '#10b981' }, // Green
        { name: 'Basic', value: 325, color: '#3b82f6' },    // Blue
        { name: 'Premium', value: 273, color: '#8b5cf6' },  // Purple
        { name: 'Enterprise', value: 142, color: '#f59e0b' }, // Amber
    ];

    // Define chart configuration with theme colors
    const chartConfig = {
        standard: {
            label: 'Standard',
            color: '#10b981',
        },
        basic: {
            label: 'Basic',
            color: '#3b82f6',
        },
        premium: {
            label: 'Premium',
            color: '#8b5cf6',
        },
        enterprise: {
            label: 'Enterprise',
            color: '#f59e0b',
        },
        label: {
            color: '#ffffff',
        },
    } satisfies ChartConfig;

    // Calculate total subscriptions
    const totalSubscriptions = chartData.reduce((sum, item) => sum + item.value, 0);

    // Calculate growth trend
    const growthTrend = {
        value: 12.8,
        isUp: true,
    };

    return (
        <Card className={`col-span-12 lg:col-span-4 ${className}`}>
            <CardHeader>
                <CardTitle>Subscription Distribution</CardTitle>
                <CardDescription>Business distribution by package type</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart
                        accessibilityLayer
                        data={chartData}
                        layout="vertical"
                        margin={{
                            right: 16,
                        }}
                    >
                        <CartesianGrid horizontal={false} />
                        <YAxis dataKey="name" type="category" tickLine={false} tickMargin={10} axisLine={false} hide />
                        <XAxis dataKey="value" type="number" hide />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                        <Bar dataKey="value" layout="vertical" radius={4}>
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                            <LabelList dataKey="name" position="insideLeft" offset={8} className="fill-white" fontSize={12} />
                            <LabelList dataKey="value" position="right" offset={8} className="fill-foreground" fontSize={12} />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex items-center gap-2 leading-none font-medium">
                    {growthTrend.isUp ? 'Trending up' : 'Trending down'} by {growthTrend.value}% this quarter
                    <TrendingUp className={`h-4 w-4 ${growthTrend.isUp ? 'text-green-600' : 'rotate-180 transform text-red-600'}`} />
                </div>
                <div className="text-muted-foreground flex items-center gap-2 leading-none">
                    <BarChart3 className="h-4 w-4" />
                    Total subscriptions: {totalSubscriptions} businesses
                </div>
            </CardFooter>
        </Card>
    );
};

export default SubscriptionDistributionChart;
