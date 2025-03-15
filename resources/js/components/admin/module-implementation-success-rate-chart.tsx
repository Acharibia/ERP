'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { CheckCircle, Clock } from 'lucide-react';
import { Area, Bar, ComposedChart, CartesianGrid, Legend, Line, XAxis, YAxis } from 'recharts';

const ModuleImplementationSuccessChart = ({ className }: { className?: string }) => {
    // Sample data for module implementation metrics
    const chartData = [
        { 
            name: 'HR Management', 
            successRate: 92, 
            avgImplementationDays: 14, 
            supportTickets: 24,
            color: '#8884d8' // Purple
        },
        { 
            name: 'Inventory', 
            successRate: 88, 
            avgImplementationDays: 16, 
            supportTickets: 32,
            color: '#82ca9d' // Green
        },
        { 
            name: 'Accounting', 
            successRate: 95, 
            avgImplementationDays: 12, 
            supportTickets: 18,
            color: '#ffc658' // Yellow
        },
        { 
            name: 'CRM', 
            successRate: 87, 
            avgImplementationDays: 15, 
            supportTickets: 27,
            color: '#ff8042' // Orange
        },
        { 
            name: 'Project Mgmt', 
            successRate: 83, 
            avgImplementationDays: 18, 
            supportTickets: 36,
            color: '#0088fe' // Blue
        },
        { 
            name: 'Document Mgmt', 
            successRate: 86, 
            avgImplementationDays: 10, 
            supportTickets: 21,
            color: '#00C49F' // Teal
        },
    ].sort((a, b) => b.successRate - a.successRate);

    // Define chart configuration
    const chartConfig = {
        successRate: {
            label: 'Success Rate (%)',
            color: '#8884d8', // Purple
        },
        avgImplementationDays: {
            label: 'Avg. Implementation Days',
            color: '#82ca9d', // Green
        },
        supportTickets: {
            label: 'Support Tickets',
            color: '#ff8042', // Orange
        }
    } satisfies ChartConfig;

    // Calculate average success rate
    const avgSuccessRate = (
        chartData.reduce((sum, item) => sum + item.successRate, 0) / chartData.length
    ).toFixed(1);

    // Find easiest and most challenging modules to implement
    const easiestModule = [...chartData].sort((a, b) => a.avgImplementationDays - b.avgImplementationDays)[0];
    const mostChallengingModule = [...chartData].sort((a, b) => b.supportTickets - a.supportTickets)[0];

    return (
        <Card className={`col-span-12 lg:col-span-6 ${className}`}>
            <CardHeader>
                <CardTitle>Module Implementation Success</CardTitle>
                <CardDescription>Implementation metrics across different modules</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <ComposedChart
                        data={chartData}
                        margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 10,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis 
                            dataKey="name" 
                            tickLine={false} 
                            axisLine={false}
                        />
                        <YAxis 
                            yAxisId="left"
                            orientation="left"
                            tickLine={false}
                            axisLine={false}
                            domain={[0, 100]}
                            tickFormatter={(value) => `${value}%`}
                        />
                        <YAxis 
                            yAxisId="right"
                            orientation="right"
                            tickLine={false}
                            axisLine={false}
                            domain={[0, 'auto']}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar 
                            yAxisId="right"
                            dataKey="supportTickets" 
                            fill="#ff8042" 
                            radius={[4, 4, 0, 0]}
                            barSize={20}
                        />
                        <Line 
                            yAxisId="right"
                            type="monotone" 
                            dataKey="avgImplementationDays" 
                            stroke="#82ca9d"
                            strokeWidth={2}
                            dot={{ stroke: '#82ca9d', strokeWidth: 2, r: 4 }}
                        />
                        <Area
                            yAxisId="left"
                            type="monotone"
                            dataKey="successRate"
                            stroke="#8884d8"
                            fill="#8884d8"
                            fillOpacity={0.2}
                        />
                        <Legend />
                    </ComposedChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex items-center gap-2 leading-none font-medium">
                    <CheckCircle className="h-4 w-4 text-purple-600" />
                    Average success rate: {avgSuccessRate}% across all modules
                </div>
                <div className="text-muted-foreground flex items-center gap-2 leading-none">
                    <Clock className="h-4 w-4" />
                    Fastest implementation: {easiestModule.name} ({easiestModule.avgImplementationDays} days)
                </div>
                <div className="text-muted-foreground leading-none mt-1">
                    Most support tickets: {mostChallengingModule.name} ({mostChallengingModule.supportTickets} tickets)
                </div>
            </CardFooter>
        </Card>
    );
};

export default ModuleImplementationSuccessChart;