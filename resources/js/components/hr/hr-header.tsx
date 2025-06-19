import { Breadcrumbs } from '@/components/breadcrumbs';
import { Icon } from '@/components/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useInitials } from '@/hooks/use-initials';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { PageProps, type BreadcrumbItem, type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { BarChart3, Building2, Calendar, Clock, DollarSign, LayoutDashboard, Medal, Search, Settings, Users } from 'lucide-react';
import AppLogo from '../app-logo';
import { AppsDropdown } from '../apps-dropdown';
import { ModulesDropdown } from '../modules-dropdown';
import { NotificationsDropdown } from '../notifications-dropdown';
import { OrdersDropdown } from '../orders-dropdown';
import { UserMenuContent } from '../user-menu-content';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        url: '/modules/hr/dashboard',
        icon: LayoutDashboard,
    },
    {
        title: 'Employees',
        url: '/modules/hr/employees',
        icon: Users,
    },
    {
        title: 'Departments',
        url: '/modules/hr/departments',
        icon: Building2,
    },
    {
        title: 'Positions',
        url: '/modules/hr/positions',
        icon: Medal,
    },
    {
        title: 'Leaves',
        url: '/modules/hr/leaves',
        icon: Calendar,
    },
    {
        title: 'Attendance',
        url: '/modules/hr/attendance',
        icon: Clock,
    },
    {
        title: 'Payroll',
        url: '/modules/hr/payroll',
        icon: DollarSign,
    },
    {
        title: 'Analytics',
        url: '/modules/hr/analytics',
        icon: BarChart3,
    },
    {
        title: 'Settings',
        url: '/modules/hr/settings',
        icon: Settings,
    },
];

const activeItemStyles = 'text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100';

interface AppHeaderProps {
    breadcrumbs?: BreadcrumbItem[];
}

export function HrHeader({ breadcrumbs = [] }: AppHeaderProps) {
    const page = usePage<SharedData>();
    const { auth } = usePage<SharedData>().props;
    const { activeBusiness } = usePage<PageProps>().props;
    const isMobile = useIsMobile();
    const getInitials = useInitials();

    return (
        <header className="sticky mb-5 flex w-full flex-col">
            <div className="border-sidebar-border/50 flex h-14 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
                <div className="mx-auto flex h-10 w-full max-w-7xl items-center justify-between">
                    <div className={`flex items-center ${isMobile ? 'gap-1' : 'gap-2'}`}>
                        <Link href="/modules/hr/dashboard" prefetch>
                            <AppLogo />
                        </Link>
                        {!isMobile && <AppsDropdown />}
                        {activeBusiness && !isMobile && <ModulesDropdown />}
                    </div>

                    <div className={`flex items-center ${isMobile ? 'gap-1' : 'gap-2'}`}>
                        {/* Search Bar (on the right) */}
                        {!isMobile && (
                            <div className="relative min-w-[150px] flex-1 lg:w-64">
                                <Input type="text" placeholder="Search..." className="h-9 w-full pl-8 text-sm" />
                                <Search className="text-muted-foreground absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2" />
                            </div>
                        )}

                        {/* Small screen search button */}
                        {isMobile && (
                            <Button variant="ghost" size="icon" className="h-9 w-9">
                                <Search className="h-4 w-4" />
                            </Button>
                        )}

                        {/* Shopping Cart Dropdown */}
                        {!isMobile && <OrdersDropdown />}

                        {/* Notifications Dropdown */}
                        <NotificationsDropdown />

                        {/* Profile Dropdown - using NavUser component with max width */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="size-10 rounded-full p-1">
                                    <Avatar className="size-8 overflow-hidden rounded-full">
                                        <AvatarImage src={auth.user.avatar} alt={auth.user.name} />
                                        <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                            {getInitials(auth.user.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end">
                                <UserMenuContent user={auth.user} />
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>

            {/* Middle Section - Main Navigation */}
            <nav className="border-sidebar-border/80 bg-muted/5 border-b">
                <div className="mx-auto flex h-10 max-w-7xl items-center">
                    <div className="flex items-center space-x-1">
                        {/* Main Nav Items */}
                        {mainNavItems.map((item, index) => (
                            <Link
                                key={index}
                                href={item.url}
                                className={cn(
                                    'hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground inline-flex h-9 items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50',
                                    page.url === item.url && activeItemStyles,
                                )}
                            >
                                {item.icon && <Icon iconNode={item.icon} className="mr-2 h-4 w-4" />}
                                {item.title}
                            </Link>
                        ))}
                    </div>
                </div>
            </nav>

            {/* Bottom Section - Breadcrumbs */}
            <div className="border-sidebar-border/70 bg-muted/10">
                <div className="mx-auto flex h-10 w-full max-w-7xl items-center">
                    <Breadcrumbs breadcrumbs={breadcrumbs} />
                </div>
            </div>
        </header>
    );
}
