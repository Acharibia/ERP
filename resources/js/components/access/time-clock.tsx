'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { router } from '@inertiajs/react';
import { format } from 'date-fns';
import { Calendar, Clock, Play, Square, Timer } from 'lucide-react';
import { useEffect, useState } from 'react';

interface TimeEntry {
    id: number;
    clock_in: string;
    clock_out?: string;
    total_hours?: number;
    date: string;
}

interface TimeClockWidgetProps {
    currentTimeEntry?: TimeEntry;
    todayHours?: number;
    weekHours?: number;
    isProcessing?: boolean;
}

export function TimeClockWidget({ currentTimeEntry, todayHours = 0, weekHours = 0, isProcessing = false }: TimeClockWidgetProps) {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [elapsedTime, setElapsedTime] = useState('00:00:00');
    const [isLoading, setIsLoading] = useState(false);

    // Update current time every second
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Calculate elapsed time if clocked in
    useEffect(() => {
        if (!currentTimeEntry?.clock_in || currentTimeEntry?.clock_out) {
            setElapsedTime('00:00:00');
            return;
        }

        const timer = setInterval(() => {
            const clockInTime = new Date(currentTimeEntry.clock_in);
            const now = new Date();
            const diff = now.getTime() - clockInTime.getTime();

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setElapsedTime(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        }, 1000);

        return () => clearInterval(timer);
    }, [currentTimeEntry]);

    const handleClockIn = () => {
        setIsLoading(true);
        router.post(
            '/time-clock/clock-in',
            {},
            {
                onFinish: () => setIsLoading(false),
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handleClockOut = () => {
        setIsLoading(true);
        router.post(
            '/time-clock/clock-out',
            {},
            {
                onFinish: () => setIsLoading(false),
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const isClockedIn = currentTimeEntry && !currentTimeEntry.clock_out;
    const displayTime = format(currentTime, 'h:mm:ss a');
    const displayDate = format(currentTime, 'MMM dd, yyyy');

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex h-auto items-center gap-2 p-2">
                    <div className="flex items-center gap-2">
                        <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
                            <Clock className="h-4 w-4" />
                        </div>
                        <div className="text-left">
                            <div className="text-sm font-medium">{displayTime}</div>
                            <div className="flex items-center gap-1">
                                <Badge variant={isClockedIn ? 'default' : 'secondary'} className="px-1.5 py-0.5 text-xs">
                                    {isClockedIn ? 'Clocked In' : 'Clocked Out'}
                                </Badge>
                                {isClockedIn && <span className="text-muted-foreground text-xs">{elapsedTime}</span>}
                            </div>
                        </div>
                    </div>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" align="end">
                <DropdownMenuLabel className="flex items-center gap-2">
                    <Timer className="h-4 w-4" />
                    Time Clock
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <div className="space-y-2 p-2">
                    <div className="text-center">
                        <div className="font-mono text-lg font-semibold">{displayTime}</div>
                        <div className="text-muted-foreground text-sm">{displayDate}</div>
                    </div>

                    {isClockedIn && (
                        <div className="rounded-md bg-green-50 p-2 text-center dark:bg-green-900/20">
                            <div className="text-sm text-green-700 dark:text-green-400">Elapsed Time</div>
                            <div className="font-mono text-lg font-semibold text-green-800 dark:text-green-300">{elapsedTime}</div>
                            {currentTimeEntry && (
                                <div className="text-xs text-green-600 dark:text-green-400">
                                    Since {format(new Date(currentTimeEntry.clock_in), 'h:mm a')}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <DropdownMenuSeparator />

                <div className="p-2">
                    {isClockedIn ? (
                        <Button onClick={handleClockOut} disabled={isLoading || isProcessing} className="w-full" variant="destructive">
                            <Square className="mr-2 h-4 w-4" />
                            Clock Out
                        </Button>
                    ) : (
                        <Button onClick={handleClockIn} disabled={isLoading || isProcessing} className="w-full">
                            <Play className="mr-2 h-4 w-4" />
                            Clock In
                        </Button>
                    )}
                </div>

                <DropdownMenuSeparator />

                <div className="space-y-1 p-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Today:</span>
                        <span className="font-medium">{todayHours.toFixed(1)}h</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">This Week:</span>
                        <span className="font-medium">{weekHours.toFixed(1)}h</span>
                    </div>
                </div>

                <DropdownMenuSeparator />

                <DropdownMenuItem className="w-full">
                    <Calendar className="mr-2 h-4 w-4" />
                    View Timesheet
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
