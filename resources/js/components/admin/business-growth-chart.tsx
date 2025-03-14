'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { TrendingUp } from 'lucide-react';

import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis } from 'recharts';

interface BusinessGrowthChartProps {
    className?: string;
}

const BusinessGrowthChart = ({ className }: BusinessGrowthChartProps) => {
    // Define colors for growth metrics
    const colors = {
        newBusinesses: {
            fill: '#4f46e5', // Indigo color for new businesses
        },
        churnedBusinesses: {
            fill: '#ef4444', // Red color for churned businesses
        },
    };

    // Sample data representing monthly business growth
    const chartData = [
        { month: 'January', newBusinesses: 24, churnedBusinesses: 5 },
        { month: 'February', newBusinesses: 28, churnedBusinesses: 7 },
        { month: 'March', newBusinesses: 32, churnedBusinesses: 6 },
        { month: 'April', newBusinesses: 38, churnedBusinesses: 8 },
        { month: 'May', newBusinesses: 42, churnedBusinesses: 9 },
        { month: 'June', newBusinesses: 46, churnedBusinesses: 8 },
        { month: 'July', newBusinesses: 48, churnedBusinesses: 10 },
        { month: 'August', newBusinesses: 52, churnedBusinesses: 11 },
        { month: 'September', newBusinesses: 58, churnedBusinesses: 9 },
        { month: 'October', newBusinesses: 62, churnedBusinesses: 12 },
        { month: 'November', newBusinesses: 68, churnedBusinesses: 11 },
        { month: 'December', newBusinesses: 72, churnedBusinesses: 13 },
    ];

    // Chart configuration for styling and labels
    const chartConfig = {
        newBusinesses: {
            label: 'New Businesses',
            color: 'indigo',
        },
        churnedBusinesses: {
            label: 'Churned Businesses',
            color: 'red',
        },
    };

    // Calculate the net growth trend
    const calculateGrowthTrend = () => {
        const lastMonthIndex = chartData.length - 1;
        const previousMonthIndex = lastMonthIndex - 1;

        if (lastMonthIndex >= 1) {
            const currentNetGrowth = chartData[lastMonthIndex].newBusinesses - chartData[lastMonthIndex].churnedBusinesses;
            const previousNetGrowth = chartData[previousMonthIndex].newBusinesses - chartData[previousMonthIndex].churnedBusinesses;
            const growthChange = currentNetGrowth - previousNetGrowth;

            return {
                value: Math.abs(growthChange),
                isUp: growthChange > 0,
            };
        }

        return { value: 0, isUp: true };
    };

    // Calculate total annual metrics
    const calculateAnnualMetrics = () => {
        const totalNew = chartData.reduce((sum, item) => sum + item.newBusinesses, 0);
        const totalChurned = chartData.reduce((sum, item) => sum + item.churnedBusinesses, 0);
        const netGrowth = totalNew - totalChurned;

        return {
            totalNew,
            totalChurned,
            netGrowth,
            growthRate: ((netGrowth / totalNew) * 100).toFixed(1),
        };
    };

    const trend = calculateGrowthTrend();
    const annualMetrics = calculateAnnualMetrics();

    return (
        <Card className={`col-span-12 lg:col-span-6 ${className}`}>
            <CardHeader>
                <CardTitle>Business Growth Trends</CardTitle>
                <CardDescription>New business acquisition vs churn over the past 12 months</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart data={chartData}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value.slice(0, 3)} />
                        <YAxis tickLine={false} axisLine={false} tickMargin={8} style={{ fontSize: '12px' }} />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                        <Legend />
                        <Bar dataKey="newBusinesses" name="New Businesses" fill={colors.newBusinesses.fill} radius={[4, 4, 0, 0]} />
                        <Bar dataKey="churnedBusinesses" name="Churned Businesses" fill={colors.churnedBusinesses.fill} radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter>
                <div className="flex w-full items-start gap-2 text-sm">
                    <div className="grid gap-2">
                        <div className="flex items-center gap-2 leading-none font-medium">
                            Net growth {trend.isUp ? 'increasing' : 'decreasing'} by {trend.value} businesses
                            <TrendingUp className={`h-4 w-4 ${trend.isUp ? 'text-green-600' : 'rotate-180 transform text-red-600'}`} />
                        </div>
                        <div className="text-muted-foreground flex items-center gap-4 leading-none">
                            <span>
                                Total New: <span className="font-medium text-indigo-600">{annualMetrics.totalNew}</span>
                            </span>
                            <span>
                                Churned: <span className="font-medium text-red-600">{annualMetrics.totalChurned}</span>
                            </span>
                            <span>
                                Net Growth: <span className="font-medium text-green-600">{annualMetrics.netGrowth}</span> ({annualMetrics.growthRate}
                                %)
                            </span>
                        </div>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
};

export default BusinessGrowthChart;
