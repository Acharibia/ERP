'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { TrendingUp } from 'lucide-react';

import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

const RecentSubscriptionChart = () => {
    // Define colors directly within the component
    const colors = {
        newSubscriptions: {
            stroke: '#059669', // Green (matching subscriptions from OverviewChart)
            fill: '#059669',
        },
        canceledSubscriptions: {
            stroke: '#dc2626', // Red
            fill: '#dc2626',
        },
    };

    // Chart data showing subscription activity for recent weeks
    const chartData = [
        { week: 'Week 1', newSubscriptions: 28, canceledSubscriptions: 5 },
        { week: 'Week 2', newSubscriptions: 32, canceledSubscriptions: 6 },
        { week: 'Week 3', newSubscriptions: 35, canceledSubscriptions: 4 },
        { week: 'Week 4', newSubscriptions: 30, canceledSubscriptions: 7 },
        { week: 'Week 5', newSubscriptions: 38, canceledSubscriptions: 5 },
        { week: 'Week 6', newSubscriptions: 42, canceledSubscriptions: 6 },
        { week: 'Week 7', newSubscriptions: 45, canceledSubscriptions: 8 },
        { week: 'Week 8', newSubscriptions: 50, canceledSubscriptions: 7 },
    ];

    // Chart configuration for styling and labels
    const chartConfig = {
        newSubscriptions: {
            label: 'New Subscriptions',
            color: 'green',
        },
        canceledSubscriptions: {
            label: 'Canceled Subscriptions',
            color: 'red',
        },
    };

    // Calculate net new subscriptions and trend
    const calculateNetSubscriptions = () => {
        const lastWeekIndex = chartData.length - 1;
        const previousWeekIndex = lastWeekIndex - 1;

        if (lastWeekIndex >= 1) {
            const currentNet = chartData[lastWeekIndex].newSubscriptions - chartData[lastWeekIndex].canceledSubscriptions;
            const previousNet = chartData[previousWeekIndex].newSubscriptions - chartData[previousWeekIndex].canceledSubscriptions;
            const percentChange = ((currentNet - previousNet) / previousNet) * 100;

            return {
                value: percentChange.toFixed(1),
                isUp: percentChange > 0,
                currentNet: currentNet,
            };
        }

        return { value: '0.0', isUp: true, currentNet: 0 };
    };

    const trend = calculateNetSubscriptions();

    return (
        <Card className="col-span-7">
            <CardHeader>
                <CardTitle>Subscription Activity</CardTitle>
                <CardDescription>Weekly subscription changes</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <ResponsiveContainer width="100%" height={178}>
                        <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid vertical={false} />
                            <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} tickMargin={8} />
                            <YAxis tickLine={false} axisLine={false} tickMargin={8} style={{ fontSize: '12px' }} />
                            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                            <Line
                                type="monotone"
                                dataKey="newSubscriptions"
                                stroke={colors.newSubscriptions.stroke}
                                strokeWidth={2}
                                dot={{ r: 4, strokeWidth: 2 }}
                                activeDot={{ r: 6 }}
                            />
                            <Line
                                type="monotone"
                                dataKey="canceledSubscriptions"
                                stroke={colors.canceledSubscriptions.stroke}
                                strokeWidth={2}
                                dot={{ r: 4, strokeWidth: 2 }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
            <CardFooter>
                <div className="flex w-full items-start gap-2 text-sm">
                    <div className="grid gap-2">
                        <div className="flex items-center gap-2 leading-none font-medium">
                            Net new subscriptions: <span className="font-bold">{trend.currentNet}</span> ({trend.isUp ? 'up' : 'down'} {trend.value}%
                            from last week)
                            <TrendingUp className={`h-4 w-4 ${trend.isUp ? 'text-green-600' : 'rotate-180 transform text-red-600'}`} />
                        </div>
                        <div className="text-muted-foreground flex items-center gap-2 leading-none">Last 8 weeks</div>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
};

export default RecentSubscriptionChart;
