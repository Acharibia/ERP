'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Target } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

export const description = 'Horizontal progress bars showing performance ratings distribution';

const chartData = [
    { rating: 'Exceeds Expectations', shortRating: 'Exceeds', employees: 62, percentage: 25, color: 'hsl(142, 76%, 36%)' },
    { rating: 'Meets Expectations', shortRating: 'Meets', employees: 149, percentage: 60, color: 'hsl(221, 83%, 53%)' },
    { rating: 'Below Expectations', shortRating: 'Below', employees: 37, percentage: 15, color: 'hsl(346, 87%, 43%)' },
];

export function PerformanceRatings() {
    const isMobile = useIsMobile();
    const totalEmployees = chartData.reduce((acc, curr) => acc + curr.employees, 0);
    const averageScore = ((chartData[0].employees * 5 + chartData[1].employees * 3 + chartData[2].employees * 2) / totalEmployees).toFixed(1);

    return (
        <Card className="flex h-full flex-col">
            <CardHeader className={`flex-shrink-0 ${isMobile ? 'p-4 pb-2' : ''}`}>
                <CardTitle className={isMobile ? 'text-base' : ''}>
                    Performance Ratings
                </CardTitle>
                <CardDescription className={isMobile ? 'text-xs' : ''}>
                    {isMobile
                        ? 'Employee performance distribution'
                        : 'Distribution of employee performance ratings'
                    }
                </CardDescription>
            </CardHeader>
            <CardContent className={`flex min-h-0 flex-1 flex-col justify-center ${isMobile ? 'p-4 py-2' : ''}`}>
                <div className={`space-y-${isMobile ? '4' : '6'} py-${isMobile ? '2' : '4'}`}>
                    {chartData.map((item, index) => (
                        <div key={index} className="space-y-2">
                            <div className={`flex items-center justify-between ${isMobile ? 'text-xs' : 'text-sm'}`}>
                                <span className="font-medium">
                                    {isMobile ? item.shortRating : item.rating}
                                </span>
                                <span className="text-muted-foreground">
                                    {isMobile
                                        ? `${item.employees} (${item.percentage}%)`
                                        : `${item.employees} employees (${item.percentage}%)`
                                    }
                                </span>
                            </div>
                            <div className={`bg-muted w-full overflow-hidden rounded-full ${isMobile ? 'h-2' : 'h-3'}`}>
                                <div
                                    className="h-full rounded-full transition-all duration-700 ease-out"
                                    style={{
                                        width: `${item.percentage}%`,
                                        backgroundColor: item.color,
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
            <CardFooter className={`flex-shrink-0 ${isMobile ? 'p-4 pt-2' : ''}`}>
                <div className={`flex w-full items-start gap-2 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                    <div className="grid gap-2">
                        <div className="flex items-center gap-2 leading-none font-medium">
                            <span>
                                {isMobile ? `Avg: ${averageScore}/5` : `Average score: ${averageScore}/5.0`}
                            </span>
                            <Target className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
                        </div>
                        <div className={`text-muted-foreground flex items-center gap-2 leading-none ${isMobile ? 'text-xs' : ''}`}>
                            {isMobile
                                ? '85% meet/exceed expectations'
                                : '85% of employees meet or exceed expectations'
                            }
                        </div>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
}
