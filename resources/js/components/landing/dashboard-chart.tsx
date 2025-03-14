'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis
} from 'recharts';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig
} from '@/components/ui/chart';

// Interface for our data types
interface RevenueItem {
    month: string;
    revenue: number;
    target: number;
}

interface SalesItem {
    name: string;
    sales: number;
}

interface ModuleItem {
    name: string;
    value: number;
}

const DashboardChart = () => {
    // State for chart data with initial values
    const [revenueData, setRevenueData] = useState<RevenueItem[]>([
        { month: 'Jan', revenue: 12400, target: 10000 },
        { month: 'Feb', revenue: 14800, target: 11000 },
        { month: 'Mar', revenue: 13900, target: 12000 },
        { month: 'Apr', revenue: 17600, target: 13000 },
        { month: 'May', revenue: 16400, target: 14000 },
        { month: 'Jun', revenue: 19200, target: 15000 },
    ]);

    const [salesData, setSalesData] = useState<SalesItem[]>([
        { name: 'Basic', sales: 340 },
        { name: 'Pro', sales: 520 },
        { name: 'Enterprise', sales: 280 },
    ]);

    const [moduleUsageData, setModuleUsageData] = useState<ModuleItem[]>([
        { name: 'HR', value: 35 },
        { name: 'Finance', value: 25 },
        { name: 'CRM', value: 20 },
        { name: 'Inventory', value: 15 },
    ]);

    // Chart configurations using the new ChartConfig type
    const revenueChartConfig: ChartConfig = {
      revenue: {
        label: "Revenue",
        theme: {
          light: "#2563eb", // Blue 600
          dark: "#3b82f6"  // Blue 500
        }
      },
      target: {
        label: "Target",
        theme: {
          light: "#f59e0b", // Amber 500
          dark: "#fbbf24"  // Amber 400
        }
      }
    };

    const salesChartConfig: ChartConfig = {
      Basic: {
        label: "Basic",
        theme: {
          light: "#2563eb", // Blue 600
          dark: "#3b82f6"  // Blue 500
        }
      },
      Pro: {
        label: "Pro",
        theme: {
          light: "#1d4ed8", // Blue 700
          dark: "#2563eb"  // Blue 600
        }
      },
      Enterprise: {
        label: "Enterprise",
        theme: {
          light: "#3b82f6", // Blue 500
          dark: "#60a5fa"  // Blue 400
        }
      }
    };

    const moduleChartConfig: ChartConfig = {
      HR: {
        label: "HR",
        theme: {
          light: "#2563eb", // Blue 600
          dark: "#3b82f6"  // Blue 500
        }
      },
      Finance: {
        label: "Finance",
        theme: {
          light: "#f59e0b", // Amber 500
          dark: "#fbbf24"  // Amber 400
        }
      },
      CRM: {
        label: "CRM",
        theme: {
          light: "#3b82f6", // Blue 500
          dark: "#60a5fa"  // Blue 400
        }
      },
      Inventory: {
        label: "Inventory",
        theme: {
          light: "#fbbf24", // Amber 400
          dark: "#f59e0b"  // Amber 500
        }
      }
    };

    // Track last update time
    const lastUpdateRef = useRef<number>(Date.now());

    // Update interval - much slower (7 seconds)
    useEffect(() => {
        const updateInterval = setInterval(() => {
            // Only update if more than 7 seconds have passed
            const now = Date.now();
            if (now - lastUpdateRef.current >= 1000) {
                lastUpdateRef.current = now;
                updateChartData();
            }
        }, 1000); // Check every second, but only update every 7 seconds

        return () => clearInterval(updateInterval);
    }, []);

    // Function to update chart data with much smaller fluctuations
    const updateChartData = () => {
        // Update revenue data with very slight fluctuations (max 1%)
        setRevenueData((prev) =>
            prev.map((item) => ({
                ...item,
                revenue: Math.max(item.revenue * (1 + (Math.random() * 0.01 - 0.005)), 0),
            })),
        );

        // Update sales data with minimal changes
        setSalesData((prev) =>
            prev.map((item) => ({
                ...item,
                sales: Math.max(item.sales * (1 + (Math.random() * 0.008 - 0.004)), 0),
            })),
        );

        // Update module usage data with small variations
        setModuleUsageData((prev) => {
            const withChanges = prev.map((item) => ({
                ...item,
                value: Math.max(item.value * (1 + (Math.random() * 0.01 - 0.005)), 1),
            }));

            // Normalize to ensure sum is 100
            const newSum = withChanges.reduce((sum, item) => sum + item.value, 0);
            return withChanges.map((item) => ({
                ...item,
                value: (item.value / newSum) * 100,
            }));
        });
    };

    return (
        <div className="bg-background flex h-full w-full flex-col overflow-hidden rounded-2xl shadow-lg">
            {/* Dashboard header */}
            <div className="bg-muted/50 flex items-center justify-between border-b px-4 py-1.5">
                <h3 className="text-xs font-semibold">Enterprise Analytics</h3>
                <div className="flex items-center space-x-2">
                    <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-500"></span>
                    </span>
                    <span className="text-muted-foreground text-xs">Live</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3">
                {/* Revenue Chart - Fixed height and proper container */}
                <div className="bg-card col-span-2 rounded-lg border p-2 overflow-hidden">
                    <div className="mb-1 flex items-center justify-between">
                        <h4 className="text-xs font-medium">Revenue Performance</h4>
                    </div>
                    <div className="w-full h-28"> {/* Fixed height with 100% width */}
                        <ChartContainer className="w-full h-full" config={revenueChartConfig}>
                            <AreaChart data={revenueData} margin={{ top: 5, right: 0, left: -10, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--color-revenue)" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="var(--color-revenue)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis
                                    dataKey="month"
                                    tick={{ fontSize: 9 }} // Smaller font
                                    axisLine={false}
                                    tickLine={false}
                                    dy={2} // Small adjustment to position
                                />
                                <YAxis
                                    tickFormatter={(value) => `$${value / 1000}k`}
                                    tick={{ fontSize: 9 }} // Smaller font
                                    axisLine={false}
                                    tickLine={false}
                                    width={35} // Control width to prevent overflow
                                />
                                <ChartTooltip
                                  content={<ChartTooltipContent indicator="line" />}
                                  cursor={false}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="target"
                                    stroke="var(--color-target)"
                                    strokeWidth={1.5}
                                    strokeDasharray="3 3"
                                    fill="none"
                                    dot={false}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="var(--color-revenue)"
                                    strokeWidth={2}
                                    fill="url(#revenueGradient)"
                                    activeDot={{ r: 3, stroke: "var(--color-revenue)", strokeWidth: 1 }}
                                />
                            </AreaChart>
                        </ChartContainer>
                    </div>
                </div>

                {/* Sales by Package - Fixed size and overflow control */}
                <div className="bg-card rounded-lg border p-2 overflow-hidden">
                    <h4 className="mb-1 text-xs font-medium">Sales by Package</h4>
                    <div className="w-full h-24"> {/* Fixed height */}
                        <ChartContainer className="w-full h-full" config={salesChartConfig}>
                            <BarChart data={salesData} layout="vertical" margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
                                <XAxis type="number" hide />
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    tick={{ fontSize: 9 }} // Smaller font
                                    axisLine={false}
                                    tickLine={false}
                                    width={55} // Control width
                                />
                                <ChartTooltip
                                  content={<ChartTooltipContent />}
                                />
                                <Bar dataKey="sales" radius={[0, 4, 4, 0]}>
                                    {salesData.map((entry) => (
                                        <Cell
                                            key={`cell-${entry.name}`}
                                            fill={`var(--color-${entry.name})`}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ChartContainer>
                    </div>
                </div>

                {/* Module Usage - Fixed size and overflow protection */}
                <div className="bg-card rounded-lg border p-2 overflow-hidden">
                    <h4 className="mb-1 text-xs font-medium">Module Usage</h4>
                    <div className="w-full h-24"> {/* Fixed height */}
                        <ChartContainer className="w-full h-full" config={moduleChartConfig}>
                            <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                                <Pie
                                    data={moduleUsageData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={22} // Slightly smaller
                                    outerRadius={35} // Slightly smaller
                                    paddingAngle={2}
                                    dataKey="value"
                                    nameKey="name"
                                >
                                    {moduleUsageData.map((entry) => (
                                        <Cell
                                            key={`cell-${entry.name}`}
                                            fill={`var(--color-${entry.name})`}
                                        />
                                    ))}
                                </Pie>
                                <ChartTooltip
                                  content={<ChartTooltipContent />}
                                />
                            </PieChart>
                        </ChartContainer>
                    </div>
                </div>
            </div>

            {/* Key metrics footer */}
            <div className="mt-auto grid grid-cols-3 divide-x border-t">
                <div className="flex flex-col items-center justify-center py-2">
                    <p className="text-muted-foreground text-xs">Revenue</p>
                    <p className="text-sm font-semibold">$24,502</p>
                </div>
                <div className="flex flex-col items-center justify-center py-2">
                    <p className="text-muted-foreground text-xs">Active Users</p>
                    <p className="text-sm font-semibold">1,203</p>
                </div>
                <div className="flex flex-col items-center justify-center py-2">
                    <p className="text-muted-foreground text-xs">New Clients</p>
                    <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">+12.5%</p>
                </div>
            </div>
        </div>
    );
};

export default DashboardChart;
