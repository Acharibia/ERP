'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart3, Clock } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, ReferenceLine, XAxis, YAxis } from 'recharts';

const ModuleUserEngagementChart = ({ className }: { className?: string }) => {
    // Sample data with colors
    const chartData = [
        {
            name: 'Accounting',
            avgTimeSpent: 65,
            systemAverage: 34,
            color: '#ffc658', // Yellow
        },
        {
            name: 'Inventory',
            avgTimeSpent: 51,
            systemAverage: 34,
            color: '#82ca9d', // Green
        },
        {
            name: 'HR',
            avgTimeSpent: 42,
            systemAverage: 34,
            color: '#8884d8', // Purple
        },
        {
            name: 'CRM',
            avgTimeSpent: 38,
            systemAverage: 34,
            color: '#ff8042', // Orange
        },
        {
            name: 'Project',
            avgTimeSpent: 28,
            systemAverage: 34,
            color: '#0088fe', // Blue
        },
        {
            name: 'Documents',
            avgTimeSpent: 22,
            systemAverage: 34,
            color: '#00C49F', // Teal
        },
    ].sort((a, b) => b.avgTimeSpent - a.avgTimeSpent);

    // Chart configuration
    const chartConfig = {
        avgTimeSpent: {
            label: 'Average Time Spent',
            color: '#8884d8',
        },
        systemAverage: {
            label: 'System Average',
            color: '#ff7300',
        },
    } satisfies ChartConfig;

    // Calculate stats for the footer
    const maxEngagement = chartData[0];
    const systemAvg = 34; // System average in minutes

    return (
        <Card className={`col-span-12 lg:col-span-6 ${className}`}>
            <CardHeader>
                <CardTitle>Module User Engagement</CardTitle>
                <CardDescription>Average time spent daily per module (minutes)</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                            dataKey="name"
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${value}m`}
                        />
                        <ChartTooltip
                            content={<ChartTooltipContent />}
                            formatter={(value) => `${value} minutes`}
                        />
                        <ReferenceLine
                            y={systemAvg}
                            stroke="#ff7300"
                            strokeDasharray="3 3"
                            label={{
                                value: 'System Avg',
                                position: 'right',
                                fill: '#ff7300',
                                fontSize: 12
                            }}
                        />
                        <Bar
                            dataKey="avgTimeSpent"
                            radius={[4, 4, 0, 0]}
                            fill="#8884d8"
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex items-center gap-2 leading-none font-medium">
                    <Clock className="h-4 w-4 text-blue-600" />
                    Most used module: {maxEngagement.name} ({maxEngagement.avgTimeSpent} minutes/day)
                </div>
                <div className="text-muted-foreground flex items-center gap-2 leading-none">
                    <BarChart3 className="h-4 w-4" />
                    System average: {systemAvg} minutes per module per day
                </div>
                <div className="text-muted-foreground leading-none mt-1">
                    {chartData.filter(d => d.avgTimeSpent > systemAvg).length} modules above system average engagement
                </div>
            </CardFooter>
        </Card>
    );
};

export default ModuleUserEngagementChart;
