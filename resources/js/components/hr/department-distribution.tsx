'use client';

import { TrendingUp } from 'lucide-react';
import { Cell, Pie, PieChart } from 'recharts';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

export const description = 'A donut chart showing department distribution';

const chartData = [
    { department: 'Engineering', employees: 112, percentage: 45, fill: 'var(--color-engineering)' },
    { department: 'Sales', employees: 62, percentage: 25, fill: 'var(--color-sales)' },
    { department: 'Marketing', employees: 37, percentage: 15, fill: 'var(--color-marketing)' },
    { department: 'Operations', employees: 25, percentage: 10, fill: 'var(--color-operations)' },
    { department: 'HR', employees: 12, percentage: 5, fill: 'var(--color-hr)' },
];

const chartConfig = {
    employees: {
        label: 'Employees',
    },
    engineering: {
        label: 'Engineering',
        color: 'hsl(221, 83%, 53%)',
    },
    sales: {
        label: 'Sales',
        color: 'hsl(142, 76%, 36%)',
    },
    marketing: {
        label: 'Marketing',
        color: 'hsl(346, 87%, 43%)',
    },
    operations: {
        label: 'Operations',
        color: 'hsl(262, 83%, 58%)',
    },
    hr: {
        label: 'HR',
        color: 'hsl(32, 95%, 44%)',
    },
} satisfies ChartConfig;

export function DepartmentDistribution() {
    const totalEmployees = chartData.reduce((acc, curr) => acc + curr.employees, 0);

    return (
        <Card className="flex h-full flex-col">
            <CardHeader className="flex-shrink-0">
                <CardTitle>Department Distribution</CardTitle>
                <CardDescription>Workforce breakdown</CardDescription>
            </CardHeader>
            <CardContent className="flex min-h-0 flex-1 items-center justify-center">
                <ChartContainer config={chartConfig} className="h-[230px] w-full">
                    <PieChart>
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                        <Pie data={chartData} dataKey="employees" nameKey="department" innerRadius={60} outerRadius={100} paddingAngle={2}>
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-shrink-0">
                <div className="flex w-full items-start gap-2 text-sm">
                    <div className="grid gap-2">
                        <div className="flex items-center gap-2 leading-none font-medium">
                            Total workforce: {totalEmployees} employees <TrendingUp className="h-4 w-4" />
                        </div>
                        <div className="text-muted-foreground flex items-center gap-2 leading-none">Engineering is the largest department</div>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
}
