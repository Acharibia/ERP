'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart3, TrendingUp } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Cell, LabelList, XAxis, YAxis } from 'recharts';

const IndustryDistributionChart = ({ className }: { className?: string }) => {
    // Sample data for industry distribution with colors
    const chartData = [
        { name: 'Technology', value: 287, color: '#10b981' },     // Blue
        { name: 'Retail', value: 216, color: '#10b981' },         // Green
        { name: 'Healthcare', value: 198, color: '#10b981' },     // Red
        { name: 'Finance', value: 167, color: '#10b981' },        // Amber
        { name: 'Manufacturing', value: 145, color: '#10b981' },  // Purple
        { name: 'Education', value: 112, color: '#10b981' },      // Pink
        { name: 'Hospitality', value: 89, color: '#10b981' },     // Teal
        { name: 'Others', value: 24, color: '#10b981' },          // Gray
    ];

    // Define chart configuration with theme colors
    const chartConfig = {
        technology: {
            label: 'Technology',
            color: '#f59e0b',
        },
        retail: {
            label: 'Retail',
            color: '#f59e0b',
        },
        healthcare: {
            label: 'Healthcare',
            color: '#f59e0b',
        },
        finance: {
            label: 'Finance',
            color: '#f59e0b',
        },
        manufacturing: {
            label: 'Manufacturing',
            color: '#f59e0b',
        },
        education: {
            label: 'Education',
            color: '#f59e0b',
        },
        hospitality: {
            label: 'Hospitality',
            color: '#f59e0b',
        },
        others: {
            label: 'Others',
            color: '#f59e0b',
        },
        label: {
            color: '#ffffff',
        },
    } satisfies ChartConfig;

    // Calculate total businesses
    const totalBusinesses = chartData.reduce((sum, item) => sum + item.value, 0);

    // Calculate year-over-year growth
    const growthTrend = {
        value: 17.5,
        isUp: true,
    };

    return (
        <Card className={`col-span-12 lg:col-span-6 ${className}`}>
            <CardHeader>
                <CardTitle>Industry Distribution</CardTitle>
                <CardDescription>Client businesses by industry type</CardDescription>
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
                    {growthTrend.isUp ? 'Year-over-year growth' : 'Year-over-year decline'} of {growthTrend.value}%
                    <TrendingUp className={`h-4 w-4 ${growthTrend.isUp ? 'text-green-600' : 'rotate-180 transform text-red-600'}`} />
                </div>
                <div className="text-muted-foreground flex items-center gap-2 leading-none">
                    <BarChart3 className="h-4 w-4" />
                    Total businesses: {totalBusinesses} across all industries
                </div>

            </CardFooter>
        </Card>
    );
};

export default IndustryDistributionChart;
