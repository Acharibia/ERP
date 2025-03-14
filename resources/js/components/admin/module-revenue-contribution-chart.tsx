import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

interface ModuleRevenueContributionChartProps {
    className?: string;
}

const ModuleRevenueContributionChart: React.FC<ModuleRevenueContributionChartProps> = ({ className }) => {
    // Sample data - would be replaced with real API data
    const data = [
        { name: 'HR Management', value: 214750, percentage: 25.4 },
        { name: 'Inventory', value: 173272, percentage: 20.5 },
        { name: 'Accounting', value: 245117, percentage: 29.0 },
        { name: 'CRM', value: 135237, percentage: 16.0 },
        { name: 'Project Management', value: 42261, percentage: 5.0 },
        { name: 'Document Management', value: 34595, percentage: 4.1 },
    ];

    // Define custom colors
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

    // Calculate total revenue
    const totalRevenue = data.reduce((sum, entry) => sum + entry.value, 0);
    const formattedTotal = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
    }).format(totalRevenue);

    // Custom tooltip formatter
    const customTooltip = ({
        active,
        payload,
    }: {
        active?: boolean;
        payload?: { payload: { name: string; value: number; percentage: number } }[];
    }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="rounded-md border bg-white p-3 shadow-md">
                    <p className="font-semibold">{data.name}</p>
                    <p className="text-gray-700">
                        {new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD',
                            maximumFractionDigits: 0,
                        }).format(data.value)}
                    </p>
                    <p className="text-gray-600">{`${data.percentage}% of total`}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <Card className={`col-span-12 lg:col-span-6 ${className}`}>
            <CardHeader>
                <CardTitle>Module Revenue Contribution</CardTitle>
                <CardDescription>Revenue breakdown by module subscription</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={data} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={2} dataKey="value">
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip content={customTooltip} />
                            <Legend layout="vertical" align="right" verticalAlign="middle" />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="mt-4 text-center">
                    <div className="text-2xl font-bold">{formattedTotal}</div>
                    <p className="text-muted-foreground text-sm">Total Module Revenue</p>
                </div>
            </CardContent>
        </Card>
    );
};

export default ModuleRevenueContributionChart;
