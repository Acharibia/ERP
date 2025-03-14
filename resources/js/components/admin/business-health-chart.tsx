'use client';

import { TrendingUp } from 'lucide-react';
import * as React from 'react';
import { Cell, Label, Pie, PieChart } from 'recharts';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

const BusinessHealthChart = () => {
    // Business status distribution with theme-compatible colors
    const statusData = React.useMemo(() => [
        { name: 'Active', value: 72, color: 'hsl(142, 71%, 45%)' }, // Green
        { name: 'Trial', value: 18, color: 'hsl(217, 91%, 60%)' }, // Blue
        { name: 'Suspended', value: 6, color: 'hsl(25, 95%, 53%)' }, // Orange
        { name: 'Expired', value: 4, color: 'hsl(0, 84%, 60%)' }, // Red
    ], []);

    // Chart config for status pie chart
    const statusChartConfig = {
        status: {
            label: 'Business Status',
            color: 'hsl(var(--muted-foreground))',
        },
        active: {
            label: 'Active',
            color: 'hsl(142, 71%, 45%)',
        },
        trial: {
            label: 'Trial',
            color: 'hsl(217, 91%, 60%)',
        },
        suspended: {
            label: 'Suspended',
            color: 'hsl(25, 95%, 53%)',
        },
        expired: {
            label: 'Expired',
            color: 'hsl(0, 84%, 60%)',
        },
    };

    // Calculate total businesses for center label
    const totalBusinesses = React.useMemo(() => {
        return statusData.reduce((acc, curr) => acc + curr.value, 0);
    }, [statusData]);

    // Calculate active businesses trend compared to previous period
    const activeTrend = {
        value: '8.3',
        isUp: true,
        period: 'compared to last quarter',
    };

    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle>Business Health</CardTitle>
                <CardDescription>Current status and distribution of business accounts</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer config={statusChartConfig} className="mx-auto aspect-square max-h-[250px]">
                    <PieChart>
                        <Pie data={statusData} cx="50%" cy="50%" labelLine={false} outerRadius={80} innerRadius={50} dataKey="value" nameKey="name">
                            {statusData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                                        return (
                                            <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                                                <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
                                                    {totalBusinesses}
                                                </tspan>
                                                <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground text-sm">
                                                    Businesses
                                                </tspan>
                                            </text>
                                        );
                                    }
                                }}
                            />
                           <ChartLegend content={<ChartLegendContent />} />
                        </Pie>
                        <ChartTooltip
                            formatter={(value: number, name: string) => [`(${Math.round((value / totalBusinesses) * 100)}%)`, `${name} Status`]}
                            content={<ChartTooltipContent />}
                        />
                    </PieChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex items-center gap-2 leading-none font-medium">
                    <span>
                        Active businesses {activeTrend.isUp ? 'up' : 'down'} by {activeTrend.value}%
                    </span>
                    <TrendingUp className={`h-4 w-4 ${activeTrend.isUp ? 'text-green-500' : 'rotate-180 transform text-red-500'}`} />
                </div>
                <div className="text-muted-foreground leading-none">{activeTrend.period}</div>
            </CardFooter>
        </Card>
    );
};

export default BusinessHealthChart;
