'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart3, TrendingUp } from 'lucide-react';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';

// Define module keys as a type to ensure type safety
type ModuleKey = 'HR' | 'Inventory' | 'Accounting' | 'CRM' | 'ProjectMgmt' | 'DocMgmt';

const ModuleUsageTrendChart = ({ className }: { className?: string }) => {
    // Sample data - would be replaced with real API data
    const chartData = [
        { month: 'January', HR: 56, Inventory: 42, Accounting: 68, CRM: 51, ProjectMgmt: 32, DocMgmt: 28 },
        { month: 'February', HR: 58, Inventory: 45, Accounting: 70, CRM: 52, ProjectMgmt: 34, DocMgmt: 30 },
        { month: 'March', HR: 62, Inventory: 48, Accounting: 73, CRM: 56, ProjectMgmt: 38, DocMgmt: 33 },
        { month: 'April', HR: 67, Inventory: 52, Accounting: 76, CRM: 59, ProjectMgmt: 42, DocMgmt: 36 },
        { month: 'May', HR: 71, Inventory: 57, Accounting: 79, CRM: 63, ProjectMgmt: 46, DocMgmt: 39 },
        { month: 'June', HR: 74, Inventory: 60, Accounting: 82, CRM: 66, ProjectMgmt: 49, DocMgmt: 41 },
        { month: 'July', HR: 78, Inventory: 63, Accounting: 85, CRM: 70, ProjectMgmt: 52, DocMgmt: 44 },
        { month: 'August', HR: 81, Inventory: 67, Accounting: 87, CRM: 73, ProjectMgmt: 55, DocMgmt: 47 },
        { month: 'September', HR: 84, Inventory: 70, Accounting: 89, CRM: 76, ProjectMgmt: 58, DocMgmt: 50 },
        { month: 'October', HR: 87, Inventory: 72, Accounting: 91, CRM: 78, ProjectMgmt: 62, DocMgmt: 53 },
        { month: 'November', HR: 89, Inventory: 75, Accounting: 92, CRM: 81, ProjectMgmt: 65, DocMgmt: 56 },
        { month: 'December', HR: 92, Inventory: 78, Accounting: 94, CRM: 83, ProjectMgmt: 68, DocMgmt: 59 },
    ];

    // Define colors for each module line
    const moduleColors: Record<ModuleKey, string> = {
        HR: '#8884d8', // Purple
        Inventory: '#82ca9d', // Green
        Accounting: '#ffc658', // Yellow
        CRM: '#ff8042', // Orange
        ProjectMgmt: '#0088fe', // Blue
        DocMgmt: '#00C49F', // Teal
    };

    // Module display names for legend
    const moduleNames: Record<ModuleKey, string> = {
        HR: 'HR Management',
        Inventory: 'Inventory',
        Accounting: 'Accounting',
        CRM: 'CRM',
        ProjectMgmt: 'Project Management',
        DocMgmt: 'Document Management',
    };

    // Create an array of module keys to map over
    const moduleKeys = Object.keys(moduleColors) as ModuleKey[];

    // Chart configuration with colors
    const chartConfig = {
        HR: {
            label: 'HR Management',
            color: moduleColors.HR,
        },
        Inventory: {
            label: 'Inventory',
            color: moduleColors.Inventory,
        },
        Accounting: {
            label: 'Accounting',
            color: moduleColors.Accounting,
        },
        CRM: {
            label: 'CRM',
            color: moduleColors.CRM,
        },
        ProjectMgmt: {
            label: 'Project Management',
            color: moduleColors.ProjectMgmt,
        },
        DocMgmt: {
            label: 'Document Management',
            color: moduleColors.DocMgmt,
        },
    } satisfies ChartConfig;

    // Calculate average growth across all modules
    const calculateAverageGrowth = () => {
        const firstMonth = chartData[0];
        const lastMonth = chartData[chartData.length - 1];

        let totalGrowth = 0;
        let moduleCount = 0;

        moduleKeys.forEach((module) => {
            const startValue = firstMonth[module];
            const endValue = lastMonth[module];
            const growth = ((endValue - startValue) / startValue) * 100;
            totalGrowth += growth;
            moduleCount++;
        });

        return (totalGrowth / moduleCount).toFixed(1);
    };

    // Get highest and lowest growing modules
    const getGrowthStats = () => {
        const firstMonth = chartData[0];
        const lastMonth = chartData[chartData.length - 1];

        const growthRates = moduleKeys.map((module) => {
            const startValue = firstMonth[module];
            const endValue = lastMonth[module];
            const growth = ((endValue - startValue) / startValue) * 100;
            return { module, growth };
        });

        const sortedGrowth = [...growthRates].sort((a, b) => b.growth - a.growth);

        return {
            highestGrowth: {
                module: sortedGrowth[0].module,
                value: sortedGrowth[0].growth.toFixed(1),
            },
            lowestGrowth: {
                module: sortedGrowth[sortedGrowth.length - 1].module,
                value: sortedGrowth[sortedGrowth.length - 1].growth.toFixed(1),
            },
        };
    };

    const averageGrowth = calculateAverageGrowth();
    const growthStats = getGrowthStats();

    return (
        <Card className={`col-span-7 ${className}`}>
            <CardHeader>
                <CardTitle>Module Usage Trends</CardTitle>
                <CardDescription>Percentage of businesses using each module over time</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <LineChart data={chartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="month" tickLine={false} axisLine={false} tickFormatter={(value) => value.slice(0, 3)} />
                        <YAxis domain={[0, 100]} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        {moduleKeys.map((module) => (
                            <Line
                                key={module}
                                type="monotone"
                                dataKey={module}
                                name={moduleNames[module]}
                                stroke={moduleColors[module]}
                                activeDot={{ r: 8 }}
                                dot={false}
                                strokeWidth={2}
                            />
                        ))}
                    </LineChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex items-center gap-2 leading-none font-medium">
                    Average module adoption growth of {averageGrowth}% this year
                    <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
                <div className="text-muted-foreground flex items-center gap-2 leading-none">
                    <BarChart3 className="h-4 w-4" />
                    Highest growth: {moduleNames[growthStats.highestGrowth.module]} ({growthStats.highestGrowth.value}%)
                </div>
            </CardFooter>
        </Card>
    );
};

export default ModuleUsageTrendChart;
