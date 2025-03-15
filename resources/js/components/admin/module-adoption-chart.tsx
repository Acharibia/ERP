"use client";

import { BarChart3, TrendingUp } from "lucide-react";
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface ModuleAdoptionChartProps {
  className?: string;
}

const ModuleAdoptionChart = ({ className }: ModuleAdoptionChartProps) => {
  // Sample data for module adoption
  const data = [
    { module: 'HR Management', adoption: 87, fullMark: 100 },
    { module: 'Inventory', adoption: 72, fullMark: 100 },
    { module: 'Accounting', adoption: 91, fullMark: 100 },
    { module: 'CRM', adoption: 78, fullMark: 100 },
    { module: 'Project Management', adoption: 65, fullMark: 100 },
    { module: 'Document Management', adoption: 59, fullMark: 100 },
  ];

  // Chart configuration for styling and labels
  const chartConfig = {
    adoption: {
      label: "Module Adoption",
      color: "#8884d8",
    },
  } satisfies ChartConfig;

  // Calculate average adoption rate
  const averageAdoption = Math.round(
    data.reduce((sum, item) => sum + item.adoption, 0) / data.length
  );

  // Growth trend data
  const growthTrend = {
    value: 12.3,
    isUp: true,
  };

  return (
    <Card className={`col-span-12 lg:col-span-6 ${className}`}>
      <CardHeader>
        <CardTitle>Module Adoption</CardTitle>
        <CardDescription>Percentage of businesses using each module</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
            <RadarChart
              outerRadius="80%"
              data={data}
              margin={{ top: 5, right: 30, left: 30, bottom: 5 }}
            >
              <PolarGrid strokeDasharray="3 3" />
              <PolarAngleAxis
                dataKey="module"
                tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 100]}
                tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                tickFormatter={(value) => `${value}%`}
              />
              <Radar
                name="Adoption"
                dataKey="adoption"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.6}
              />
              <ChartTooltip
                content={<ChartTooltipContent />}
                formatter={(value) => `${value}%`}
              />
            </RadarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Adoption rate {growthTrend.isUp ? 'up' : 'down'} by {growthTrend.value}% this quarter
          <TrendingUp className={`h-4 w-4 ${growthTrend.isUp ? "text-green-600" : "rotate-180 transform text-red-600"}`} />
        </div>
        <div className="leading-none text-muted-foreground flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          Average adoption rate: {averageAdoption}% across all modules
        </div>
      </CardFooter>
    </Card>
  );
};

export default ModuleAdoptionChart;
