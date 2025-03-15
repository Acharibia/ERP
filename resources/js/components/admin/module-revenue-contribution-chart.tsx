'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart3, DollarSign } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Cell, LabelList, XAxis, YAxis } from 'recharts';

const ModuleRevenueContributionChart = ({ className }: { className?: string }) => {
    // Sample data for module revenue with colors
    const chartData = [
        { name: 'Accounting', value: 245117, percentage: 29.0, color: '#ffc658' },
        { name: 'HR Management', value: 214750, percentage: 25.4, color: '#8884d8' },
        { name: 'Inventory', value: 173272, percentage: 20.5, color: '#82ca9d' },
        { name: 'CRM', value: 135237, percentage: 16.0, color: '#ff8042' },
        { name: 'Project Mgmt', value: 42261, percentage: 5.0, color: '#0088fe' },
        { name: 'Document Mgmt', value: 34595, percentage: 4.1, color: '#00C49F' },
    ].sort((a, b) => b.value - a.value);

    // Define chart configuration with theme colors
    const chartConfig = {
        revenue: {
            label: 'Revenue',
            color: 'hsl(var(--chart-1))',
        },
        label: {
            color: '#ffffff',
        },
    } satisfies ChartConfig;

    // Calculate total revenue
    const totalRevenue = chartData.reduce((sum, entry) => sum + entry.value, 0);
    
    // Format currency
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            notation: 'compact',
            maximumFractionDigits: 1
        }).format(value);
    };

    // Get top contributor and smallest contributor
    const topContributor = chartData[0];

    return (
        <Card className={`col-span-12 lg:col-span-6 ${className}`}>
            <CardHeader>
                <CardTitle>Module Revenue Contribution</CardTitle>
                <CardDescription>Revenue breakdown by module subscription</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart
                        accessibilityLayer
                        data={chartData}
                        layout="vertical"
                        margin={{
                            right: 24,
                        }}
                    >
                        <CartesianGrid horizontal={false} />
                        <YAxis 
                            dataKey="name" 
                            type="category" 
                            tickLine={false} 
                            axisLine={false} 
                            hide
                        />
                        <XAxis 
                            dataKey="value" 
                            type="number" 
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => formatCurrency(value)}
                            hide
                        />
                        <ChartTooltip 
                            cursor={false} 
                            content={<ChartTooltipContent />}
                            formatter={(value) => formatCurrency(Number(value))}
                        />
                        <Bar dataKey="value" layout="vertical" radius={4}>
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                            <LabelList 
                                dataKey="name" 
                                position="insideLeft" 
                                offset={8} 
                                className="fill-white" 
                                fontSize={12} 
                            />
                            <LabelList 
                                dataKey="value" 
                                position="right" 
                                offset={8} 
                                className="fill-foreground" 
                                fontSize={12}
                                formatter={formatCurrency} 
                            />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex items-center gap-2 leading-none font-medium">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    Total revenue: {formatCurrency(totalRevenue)}
                </div>
                <div className="text-muted-foreground flex items-center gap-2 leading-none">
                    <BarChart3 className="h-4 w-4" />
                    Top contributor: {topContributor.name} ({topContributor.percentage}%)
                </div>
                <div className="grid grid-cols-3 gap-x-4 gap-y-1 mt-2 w-full text-xs text-muted-foreground">
                    {chartData.map((item, index) => (
                        <div key={index} className="flex items-center gap-1">
                            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                            <span>{item.name}: {item.percentage}%</span>
                        </div>
                    ))}
                </div>
            </CardFooter>
        </Card>
    );
};

export default ModuleRevenueContributionChart;