import { EmptyState } from '@/components/empty-state';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { AlertTriangle, ArrowRight, Cake, Calendar, Clock, FileText, GraduationCap, Star, Trophy } from 'lucide-react';

interface EventItem {
    id: string;
    type: 'birthday' | 'anniversary' | 'training' | 'review' | 'document' | 'compliance' | 'holiday' | 'contract';
    title: string;
    employee?: string;
    department?: string;
    date: string;
    daysUntil: number;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    description?: string;
    actualDate?: string; // For showing actual date in the avatar
    dayOfWeek?: string; // For showing day abbreviation like "Tue", "Wed"
}

interface UpcomingEventsCardProps {
    onViewCalendar?: () => void;
    onViewEvent?: (id: string) => void;
    onMarkComplete?: (id: string) => void;
    isLoading?: boolean;
}

export function UpcomingEventsCard({ onViewCalendar, onViewEvent, isLoading = false }: UpcomingEventsCardProps) {
    const upcomingEvents: EventItem[] = [
        {
            id: '1',
            type: 'birthday',
            title: 'Birthday',
            employee: 'Sarah Johnson',
            department: 'Marketing',
            date: 'Tomorrow',
            daysUntil: 1,
            priority: 'low',
            actualDate: '15',
            dayOfWeek: 'Thu',
        },
        {
            id: '2',
            type: 'review',
            title: 'Performance Review Due',
            employee: 'Mike Chen',
            department: 'Engineering',
            date: 'In 3 days',
            daysUntil: 3,
            priority: 'high',
            description: 'Q4 Performance Review',
            actualDate: '18',
            dayOfWeek: 'Sat',
        },
        {
            id: '3',
            type: 'training',
            title: 'Safety Training Deadline',
            date: 'In 5 days',
            daysUntil: 5,
            priority: 'urgent',
            description: '12 employees pending completion',
            actualDate: '20',
            dayOfWeek: 'Mon',
        },
        {
            id: '4',
            type: 'anniversary',
            title: '5 Year Anniversary',
            employee: 'Emily Davis',
            department: 'Sales',
            date: 'In 1 week',
            daysUntil: 7,
            priority: 'medium',
            actualDate: '22',
            dayOfWeek: 'Wed',
        },
        {
            id: '6',
            type: 'compliance',
            title: 'Monthly Report Due',
            date: 'In 3 weeks',
            daysUntil: 21,
            priority: 'medium',
            description: 'HR Compliance Report',
            actualDate: '05',
            dayOfWeek: 'Wed',
        },
    ];

    const getTypeConfig = (type: EventItem['type']) => {
        const configs = {
            birthday: {
                icon: Cake,
                label: 'Birthday',
                color: 'bg-pink-50 text-pink-700 border-pink-200',
                avatarColor: 'bg-pink-100 border-pink-200',
                iconColor: 'text-pink-600',
            },
            anniversary: {
                icon: Trophy,
                label: 'Anniversary',
                color: 'bg-amber-50 text-amber-700 border-amber-200',
                avatarColor: 'bg-amber-100 border-amber-200',
                iconColor: 'text-amber-600',
            },
            training: {
                icon: GraduationCap,
                label: 'Training',
                color: 'bg-blue-50 text-blue-700 border-blue-200',
                avatarColor: 'bg-blue-100 border-blue-200',
                iconColor: 'text-blue-600',
            },
            review: {
                icon: Star,
                label: 'Review',
                color: 'bg-purple-50 text-purple-700 border-purple-200',
                avatarColor: 'bg-purple-100 border-purple-200',
                iconColor: 'text-purple-600',
            },
            document: {
                icon: FileText,
                label: 'Document',
                color: 'bg-orange-50 text-orange-700 border-orange-200',
                avatarColor: 'bg-orange-100 border-orange-200',
                iconColor: 'text-orange-600',
            },
            compliance: {
                icon: AlertTriangle,
                label: 'Compliance',
                color: 'bg-red-50 text-red-700 border-red-200',
                avatarColor: 'bg-red-100 border-red-200',
                iconColor: 'text-red-600',
            },
            holiday: {
                icon: Calendar,
                label: 'Holiday',
                color: 'bg-green-50 text-green-700 border-green-200',
                avatarColor: 'bg-green-100 border-green-200',
                iconColor: 'text-green-600',
            },
            contract: {
                icon: FileText,
                label: 'Contract',
                color: 'bg-gray-50 text-gray-700 border-gray-200',
                avatarColor: 'bg-gray-100 border-gray-200',
                iconColor: 'text-gray-600',
            },
        };
        return configs[type];
    };

    const getPriorityText = (priority: EventItem['priority']) => {
        return priority.charAt(0).toUpperCase() + priority.slice(1);
    };

    const getPriorityColor = (priority: EventItem['priority']) => {
        switch (priority) {
            case 'urgent':
                return 'text-red-600';
            case 'high':
                return 'text-orange-600';
            case 'medium':
                return 'text-yellow-600';
            case 'low':
                return 'text-gray-500';
            default:
                return 'text-gray-500';
        }
    };

    const getEventCounts = () => {
        const total = upcomingEvents.length;
        const urgent = upcomingEvents.filter((item) => item.priority === 'urgent' || item.priority === 'high' || item.daysUntil <= 3).length;
        return { total, urgent };
    };

    const { total, urgent } = getEventCounts();

    // Sort events by days until (closest first)
    const sortedEvents = [...upcomingEvents].sort((a, b) => a.daysUntil - b.daysUntil);

    if (isLoading) {
        return (
            <Card className="h-full">
                <CardHeader className="pb-3">
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-48" />
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-center space-x-3">
                            <Skeleton className="h-12 w-12 rounded-lg" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-3 w-1/2" />
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="h-full">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="space-y-1">
                    <CardTitle>Upcoming Events</CardTitle>
                    <CardDescription>
                        {total} upcoming events and deadlines
                        {urgent > 0 && <span className="ml-1 text-red-600">• {urgent} need attention</span>}
                    </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                        {total}
                    </Badge>
                    <Calendar className="text-muted-foreground h-4 w-4" />
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="space-y-3">
                    {sortedEvents.map((event, index) => {
                        const typeConfig = getTypeConfig(event.type);
                        const IconComponent = typeConfig.icon;

                        return (
                            <div key={event.id}>
                                <div className="flex items-start justify-between space-x-2">
                                    <div className="flex min-w-0 flex-1 items-start space-x-3">
                                        {/* Date Avatar with Icon */}
                                        <div className="relative">
                                            <Avatar className={cn('h-12 w-12 rounded-lg', typeConfig.avatarColor)}>
                                                <AvatarFallback
                                                    className={cn('flex flex-col items-center justify-center rounded-lg', typeConfig.avatarColor)}
                                                >
                                                    <span className="text-xs leading-none font-medium text-black">{event.dayOfWeek || 'Day'}</span>
                                                    <span className="text-sm leading-none font-bold text-black">
                                                        {event.actualDate || event.daysUntil}
                                                    </span>
                                                </AvatarFallback>
                                            </Avatar>
                                            {/* Type icon positioned at top-right of avatar */}
                                            <div
                                                className={cn(
                                                    'absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white',
                                                    typeConfig.avatarColor,
                                                )}
                                            >
                                                <IconComponent className={cn('h-3 w-3', typeConfig.iconColor)} />
                                            </div>
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2">
                                                <p className="truncate text-sm font-medium">{event.title}</p>
                                                <Badge className={cn('text-xs', typeConfig.color)}>{typeConfig.label}</Badge>
                                            </div>
                                            <div className="text-muted-foreground flex items-center gap-1 text-xs">
                                                {event.employee && (
                                                    <>
                                                        <span>{event.employee}</span>
                                                        <span>•</span>
                                                    </>
                                                )}
                                                {event.department && (
                                                    <>
                                                        <span>{event.department}</span>
                                                        <span>•</span>
                                                    </>
                                                )}
                                                <span className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {event.date}
                                                </span>
                                                <span>•</span>
                                                <span className={cn('font-medium', getPriorityColor(event.priority))}>
                                                    {getPriorityText(event.priority)} priority
                                                </span>
                                            </div>
                                            {event.description && <div className="text-muted-foreground mt-1 text-xs">{event.description}</div>}
                                        </div>
                                    </div>
                                    <div className="flex flex-shrink-0 items-center gap-1">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="cursor-pointer text-xs"
                                            onClick={() => onViewEvent?.(event.id)}
                                        >
                                            View
                                        </Button>
                                    </div>
                                </div>
                                {index < sortedEvents.length - 1 && <Separator className="mt-3" />}
                            </div>
                        );
                    })}
                </div>

                {total > 0 && (
                    <>
                        <Separator />
                        <div className="text-center">
                            <Button variant="outline" size="sm" onClick={onViewCalendar} className="w-full text-xs">
                                View full calendar <ArrowRight />
                            </Button>
                        </div>
                    </>
                )}

                {total === 0 && (
                    <EmptyState
                        icon={Calendar}
                        iconSize="h-8 w-8"
                        title="No upcoming events"
                        description="Your calendar is clear for now"
                        primaryAction={{
                            label: 'View Calendar',
                            onClick: () => onViewCalendar?.(),
                        }}
                    />
                )}
            </CardContent>
        </Card>
    );
}
