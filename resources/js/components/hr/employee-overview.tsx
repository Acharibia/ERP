'use client';

import { TrendingUp } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

export const description = 'An area chart showing employee growth trends';

const chartData = [
    { month: 'January', newHires: 8, departures: 3, totalEmployees: 205, netGrowth: 5 },
    { month: 'February', newHires: 12, departures: 4, totalEmployees: 213, netGrowth: 8 },
    { month: 'March', newHires: 15, departures: 6, totalEmployees: 222, netGrowth: 9 },
    { month: 'April', newHires: 10, departures: 5, totalEmployees: 227, netGrowth: 5 },
    { month: 'May', newHires: 9, departures: 4, totalEmployees: 232, netGrowth: 5 },
    { month: 'June', newHires: 14, departures: 7, totalEmployees: 239, netGrowth: 7 },
    { month: 'July', newHires: 6, departures: 3, totalEmployees: 242, netGrowth: 3 },
    { month: 'August', newHires: 11, departures: 5, totalEmployees: 248, netGrowth: 6 },
    { month: 'September', newHires: 8, departures: 4, totalEmployees: 252, netGrowth: 4 },
    { month: 'October', newHires: 13, departures: 6, totalEmployees: 259, netGrowth: 7 },
    { month: 'November', newHires: 7, departures: 3, totalEmployees: 263, netGrowth: 4 },
    { month: 'December', newHires: 9, departures: 5, totalEmployees: 267, netGrowth: 4 },
];

const chartConfig = {
    newHires: {
        label: 'New Hires',
        color: 'var(--chart-1)',
    },
    departures: {
        label: 'Departures',
        color: 'var(--chart-2)',
    },
    netGrowth: {
        label: 'Net Growth',
        color: 'var(--chart-3)',
    },
    totalEmployees: {
        label: 'Total Employees',
        color: 'var(--chart-4)',
    },
} satisfies ChartConfig;

export function EmployeeOverview() {
    return (
        <Card className="flex h-full flex-col">
            <CardHeader className="flex-shrink-0">
                <CardTitle>Employee Overview</CardTitle>
                <CardDescription>Workforce trends and growth patterns over the last 12 months</CardDescription>
            </CardHeader>
            <CardContent className="min-h-0 flex-1 p-6">
                <ChartContainer config={chartConfig} className="h-full w-full">
                    <AreaChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            left: 8,
                            right: 8,
                            top: 8,
                            bottom: 8,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value.slice(0, 3)} />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                        <Area
                            dataKey="newHires"
                            type="natural"
                            fill="var(--color-newHires)"
                            fillOpacity={0.4}
                            stroke="var(--color-newHires)"
                            stackId="a"
                        />
                        <Area
                            dataKey="departures"
                            type="natural"
                            fill="var(--color-departures)"
                            fillOpacity={0.4}
                            stroke="var(--color-departures)"
                            stackId="a"
                        />
                        <Area
                            dataKey="netGrowth"
                            type="natural"
                            fill="var(--color-netGrowth)"
                            fillOpacity={0.3}
                            stroke="var(--color-netGrowth)"
                            stackId="b"
                        />
                        <Area
                            dataKey="totalEmployees"
                            type="natural"
                            fill="var(--color-totalEmployees)"
                            fillOpacity={0.2}
                            stroke="var(--color-totalEmployees)"
                            stackId="c"
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-shrink-0">
                <div className="flex w-full items-start gap-2 text-sm">
                    <div className="grid gap-2">
                        <div className="flex items-center gap-2 leading-none font-medium">
                            Trending up by 30% this year <TrendingUp className="h-4 w-4" />
                        </div>
                        <div className="text-muted-foreground flex items-center gap-2 leading-none">January - December 2024</div>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
}
