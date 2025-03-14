'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { TrendingUp } from 'lucide-react';

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts';

const RecentSalesChart = () => {
    // Define improved colors directly within the component
    const colors = {
        sales: {
            fill: '#1d4ed8', // Matching the blue from OverviewChart for consistency
        },
    };

    // Chart data showing daily sales for the last 7 days
    const chartData = [
        { day: 'Mon', sales: 1200 },
        { day: 'Tue', sales: 900 },
        { day: 'Wed', sales: 1500 },
        { day: 'Thu', sales: 1800 },
        { day: 'Fri', sales: 2100 },
        { day: 'Sat', sales: 1700 },
        { day: 'Sun', sales: 1300 },
    ];

    // Chart configuration for styling and labels
    const chartConfig = {
        sales: {
            label: 'Daily Sales',
            color: 'blue',
        },
    };

    // Calculate the percentage change from previous day to current day
    const calculateTrend = () => {
        const lastDayIndex = chartData.length - 1;
        const previousDayIndex = lastDayIndex - 1;

        if (lastDayIndex >= 1) {
            const currentSales = chartData[lastDayIndex].sales;
            const previousSales = chartData[previousDayIndex].sales;
            const percentChange = ((currentSales - previousSales) / previousSales) * 100;

            return {
                value: Math.abs(percentChange).toFixed(1),
                isUp: percentChange > 0,
            };
        }

        return { value: '0.0', isUp: true };
    };

    const trend = calculateTrend();

    return (
        <Card className="col-span-6">
            <CardHeader>
                <CardTitle>Sales Overview</CardTitle>
                <CardDescription>Daily sales performance</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <ResponsiveContainer width="100%" height={100}>
                        <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid vertical={false} />
                            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} tickMargin={8} />
                            <YAxis
                                hide={false}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `$${value}`}
                                tickMargin={8}
                                style={{ fontSize: '12px' }}
                            />
                            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                            <Bar dataKey="sales" fill={colors.sales.fill} radius={[4, 4, 0, 0]} barSize={30} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
            <CardFooter>
                <div className="flex w-full items-start gap-2 text-sm">
                    <div className="grid gap-2">
                        <div className="flex items-center gap-2 leading-none font-medium">
                            {trend.isUp ? 'Trending up' : 'Trending down'} by {trend.value}% compared to yesterday
                            <TrendingUp className={`h-4 w-4 ${trend.isUp ? 'text-green-600' : 'rotate-180 transform text-red-600'}`} />
                        </div>
                        <div className="text-muted-foreground flex items-center gap-2 leading-none">Last 7 days</div>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
};

export default RecentSalesChart;
