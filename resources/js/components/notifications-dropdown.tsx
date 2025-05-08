import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Bell } from 'lucide-react';

// Define a type for notifications
type Notification = {
    id: number;
    type: string;
    message: string;
    timestamp: string;
    isRead: boolean;
};

export function NotificationsDropdown() {
    const notifications: Notification[] = [
        {
            id: 1,
            type: 'comment',
            message: 'John commented on your document',
            timestamp: '2m ago',
            isRead: false,
        },
        {
            id: 2,
            type: 'task',
            message: 'Your task "Update dashboard" was completed',
            timestamp: '1h ago',
            isRead: true,
        },
        {
            id: 3,
            type: 'system',
            message: 'Module "HR" has been updated to version 2.1',
            timestamp: '3h ago',
            isRead: true,
        },
    ];

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    const markAllAsRead = () => {
        console.log('Marking all notifications as read');
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <Badge variant="destructive" className="absolute -top-1.5 -right-2 px-1.5 py-0.5 text-xs">
                            {unreadCount}
                        </Badge>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72 sm:w-80">
                <div className="flex items-center justify-between p-2 font-medium">
                    <span>Notifications </span>
                    {unreadCount > 0 && (
                        <Button variant="ghost" size="sm" className="text-xs" onClick={markAllAsRead}>
                            Mark all as read
                        </Button>
                    )}
                </div>
                <DropdownMenuSeparator />
                <div className="max-h-80 overflow-y-auto">
                    {notifications.length > 0 ? (
                        notifications.map((notification) => (
                            <DropdownMenuItem
                                key={notification.id}
                                className={`hover:bg-muted border-t p-3 mb-1 ${!notification.isRead ? 'bg-primary/5' : ''}`}
                            >
                                <div className="w-full">
                                    <div className="flex justify-between">
                                        <span className="font-medium capitalize"> {notification.type} </span>
                                        <span className="text-muted-foreground text-xs">{notification.timestamp}</span>
                                    </div>
                                    <p className="text-muted-foreground text-sm">{notification.message}</p>
                                </div>
                            </DropdownMenuItem>
                        ))
                    ) : (
                        <DropdownMenuItem disabled className="text-center">
                            No notifications
                        </DropdownMenuItem>
                    )}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <Button variant="ghost" size="sm" className="w-full justify-center">
                        View all notifications
                    </Button>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
