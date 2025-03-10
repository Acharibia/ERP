import { Breadcrumbs } from '@/components/breadcrumbs';
import { Icon } from '@/components/icon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { UserMenuContent } from '@/components/user-menu-content';
import { useInitials } from '@/hooks/use-initials';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem, type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Bell, BookOpen, Folder, Grid, LayoutGrid, Menu, Search } from 'lucide-react';
import AppLogo from './app-logo';
import AppLogoIcon from './app-logo-icon';
import { AppSettings } from './app-settings';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        url: '/dashboard',
        icon: LayoutGrid,
    },
];

const rightNavItems: NavItem[] = [
    {
        title: 'Repository',
        url: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        url: 'https://laravel.com/docs/starter-kits',
        icon: BookOpen,
    },
];

const activeItemStyles = 'text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100';

interface AppHeaderProps {
    breadcrumbs?: BreadcrumbItem[];
}

export function AppHeader({ breadcrumbs = [] }: AppHeaderProps) {
    const page = usePage<SharedData>();
    const { auth } = page.props;
    const getInitials = useInitials();

    return (
        <header className="flex w-full flex-col">
            {/* Top Header - Logo, Search, User Controls */}
            <div className="border-sidebar-border/80 border-b">
                <div className="mx-auto flex h-16 items-center justify-between px-4 md:px-6 lg:px-8">
                    {/* Left Section - Logo, Mobile Menu, and Apps Menu */}
                    <div className="flex items-center space-x-2">
                        {/* Mobile Menu */}
                        <div className="lg:hidden">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon" className="mr-2 h-[34px] w-[34px]">
                                        <Menu className="h-5 w-5" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="bg-sidebar flex h-full w-64 flex-col items-stretch justify-between">
                                    <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                                    <SheetHeader className="flex justify-start text-left">
                                        <AppLogoIcon className="h-6 w-6 fill-current text-black dark:text-white" />
                                    </SheetHeader>
                                    <div className="flex h-full flex-1 flex-col space-y-4 p-4">
                                        <div className="flex h-full flex-col justify-between text-sm">
                                            <div className="flex flex-col space-y-4">
                                                {mainNavItems.map((item) => (
                                                    <Link key={item.title} href={item.url} className="flex items-center space-x-2 font-medium">
                                                        {item.icon && <Icon iconNode={item.icon} className="h-5 w-5" />}
                                                        <span>{item.title}</span>
                                                    </Link>
                                                ))}
                                            </div>

                                            <div className="flex flex-col space-y-4">
                                                {rightNavItems.map((item) => (
                                                    <a
                                                        key={item.title}
                                                        href={item.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center space-x-2 font-medium"
                                                    >
                                                        {item.icon && <Icon iconNode={item.icon} className="h-5 w-5" />}
                                                        <span>{item.title}</span>
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>

                        {/* Logo */}
                        <Link href="/dashboard" prefetch className="flex items-center space-x-2">
                            <AppLogo />
                        </Link>

                        {/* Apps Navigation Menu */}
                        <NavigationMenu className="ml-2">
                            <NavigationMenuList>
                                <NavigationMenuItem>
                                    <NavigationMenuTrigger className="h-9 px-3">
                                        <Grid className="mr-2 h-4 w-4" />
                                        Apps
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                                            <li className="row-span-3">
                                                <NavigationMenuLink asChild>
                                                    <a
                                                        className="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-gradient-to-b p-6 no-underline outline-none select-none focus:shadow-md"
                                                        href="/"
                                                    >
                                                        <div className="mt-4 mb-2 text-lg font-medium">Dashboard</div>
                                                        <p className="text-muted-foreground text-sm leading-tight">
                                                            Overview of all your activities and metrics
                                                        </p>
                                                    </a>
                                                </NavigationMenuLink>
                                            </li>
                                            <li>
                                                <NavigationMenuLink asChild>
                                                    <a
                                                        className="hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block space-y-1 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none"
                                                        href="/analytics"
                                                    >
                                                        <div className="text-sm leading-none font-medium">Analytics</div>
                                                        <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
                                                            Detailed insights and statistics
                                                        </p>
                                                    </a>
                                                </NavigationMenuLink>
                                            </li>
                                            <li>
                                                <NavigationMenuLink asChild>
                                                    <a
                                                        className="hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block space-y-1 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none"
                                                        href="/projects"
                                                    >
                                                        <div className="text-sm leading-none font-medium">Projects</div>
                                                        <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
                                                            Manage and track your ongoing projects
                                                        </p>
                                                    </a>
                                                </NavigationMenuLink>
                                            </li>
                                            <li>
                                                <NavigationMenuLink asChild>
                                                    <a
                                                        className="hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block space-y-1 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none"
                                                        href="/calendar"
                                                    >
                                                        <div className="text-sm leading-none font-medium">Calendar</div>
                                                        <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
                                                            Schedule and manage your events
                                                        </p>
                                                    </a>
                                                </NavigationMenuLink>
                                            </li>
                                        </ul>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>

                    {/* Right Section - Search, Notifications, Settings, User */}
                    <div className="flex items-center gap-2">
                        {/* Search */}
                        <div className="relative hidden min-w-[150px] flex-1 sm:block lg:w-64">
                            <Input type="text" placeholder="Search..." className="w-full pl-8 text-sm" />
                            <Search className="text-muted-foreground absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2" />
                        </div>

                        {/* Mobile Search */}
                        <Button variant="ghost" size="icon" className="sm:hidden">
                            <Search className="h-5 w-5" />
                        </Button>

                        {/* Notification Bell */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Bell className="h-5 w-5" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-72 sm:w-80">
                                <div className="flex items-center justify-between p-2 font-medium">
                                    <span>Notifications</span>
                                    <Button variant="ghost" size="sm" className="text-xs">
                                        Mark all as read
                                    </Button>
                                </div>
                                <div className="max-h-80 overflow-y-auto">
                                    <div className="hover:bg-muted border-t p-3">
                                        <div className="flex justify-between">
                                            <span className="font-medium">New comment</span>
                                            <span className="text-muted-foreground text-xs">2m ago</span>
                                        </div>
                                        <p className="text-muted-foreground text-sm">John commented on your document</p>
                                    </div>
                                    <div className="hover:bg-muted border-t p-3">
                                        <div className="flex justify-between">
                                            <span className="font-medium">Task completed</span>
                                            <span className="text-muted-foreground text-xs">1h ago</span>
                                        </div>
                                        <p className="text-muted-foreground text-sm">Your task "Update dashboard" was completed</p>
                                    </div>
                                </div>
                                <div className="border-t p-2">
                                    <Button variant="ghost" size="sm" className="w-full justify-center">
                                        View all notifications
                                    </Button>
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Settings Component */}
                        <AppSettings />

                        {/* User Profile Dropdown */}
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
                <div className="mx-auto flex h-12 items-center px-4 md:px-6 lg:px-8">
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
            <div className="border-sidebar-border/70 bg-muted/10 border-b">
                <div className="mx-auto flex h-10 w-full items-center px-4 md:px-6 lg:px-8">
                    <Breadcrumbs breadcrumbs={breadcrumbs} />
                </div>
            </div>
        </header>
    );
}
