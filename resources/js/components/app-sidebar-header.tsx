import { Breadcrumbs } from '@/components/breadcrumbs';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { type BreadcrumbItem, type Business, type Module, type PageProps } from '@/types';
import { usePage } from '@inertiajs/react';
import { BarChart2, Bell, Building2, Grid, Package, Search, ShieldCheck, Users } from 'lucide-react';
import { NavUser } from './nav-user';

export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItem[] }) {
    // Use the PageProps type for usePage
    const { auth, currentBusiness, userBusinesses = [], availableModules = [] } = usePage<PageProps>().props;
    const user = auth.user;

    return (
        <div>
            {/* Main Header */}
            <header className="border-sidebar-border/50 sticky flex h-14 shrink-0 items-center gap-2 border-b px-4 transition-[width,height] ease-linear">
                <div className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-2">
                        <SidebarTrigger className="-ml-1" />

                        {/* Portal Navigation Menu */}
                        <NavigationMenu className="hidden sm:flex">
                            <NavigationMenuList>
                                <NavigationMenuItem>
                                    <NavigationMenuTrigger>
                                        <Grid className="mr-2 h-4 w-4" />
                                        Portals
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px]">
                                            {/* Admin Portal - Show only if user is an admin */}
                                            {user.user_type === 'system_admin' && (
                                                <li>
                                                    <NavigationMenuLink asChild>
                                                        <a
                                                            className="hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block space-y-1 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none"
                                                            href="/admin/dashboard"
                                                        >
                                                            <div className="flex items-center text-sm leading-none font-medium">
                                                                <ShieldCheck className="mr-2 h-4 w-4" />
                                                                Admin Portal
                                                            </div>
                                                            <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
                                                                System administration and management
                                                            </p>
                                                        </a>
                                                    </NavigationMenuLink>
                                                </li>
                                            )}

                                            {/* Reseller Portal - Show only if user is a reseller */}
                                            {user.user_type === 'reseller' && (
                                                <li>
                                                    <NavigationMenuLink asChild>
                                                        <a
                                                            className="hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block space-y-1 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none"
                                                            href="/reseller/dashboard"
                                                        >
                                                            <div className="flex items-center text-sm leading-none font-medium">
                                                                <Users className="mr-2 h-4 w-4" />
                                                                Reseller Portal
                                                            </div>
                                                            <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
                                                                Manage clients, subscriptions and invoices
                                                            </p>
                                                        </a>
                                                    </NavigationMenuLink>
                                                </li>
                                            )}

                                            {/* Business Portal Heading */}
                                            <li className="col-span-full mt-2">
                                                <div className="text-muted-foreground px-3 text-sm font-semibold">Your Businesses</div>
                                            </li>

                                            {/* List of user's businesses */}
                                            {userBusinesses && userBusinesses.length > 0 ? (
                                                userBusinesses.map((business: Business) => (
                                                    <li key={business.id}>
                                                        <NavigationMenuLink asChild>
                                                            <a
                                                                className={`hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block space-y-1 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none ${currentBusiness?.id === business.id ? 'bg-accent/50' : ''}`}
                                                                href={`/business/switch/${business.id}`}
                                                            >
                                                                <div className="flex items-center text-sm leading-none font-medium">
                                                                    <Building2 className="mr-2 h-4 w-4" />
                                                                    {business.name}
                                                                    {currentBusiness?.id === business.id && (
                                                                        <span className="bg-primary/10 text-primary ml-2 rounded px-1.5 py-0.5 text-xs">
                                                                            Active
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
                                                                    {business.subscription_status === 'active'
                                                                        ? 'Active subscription'
                                                                        : business.subscription_status}
                                                                </p>
                                                            </a>
                                                        </NavigationMenuLink>
                                                    </li>
                                                ))
                                            ) : (
                                                <li>
                                                    <div className="text-muted-foreground px-3 py-2 text-sm">No businesses available</div>
                                                </li>
                                            )}
                                        </ul>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>

                                {/* Modules Navigation - Only show if there's a current business */}
                                {currentBusiness && (
                                    <NavigationMenuItem>
                                        <NavigationMenuTrigger>
                                            <Package className="mr-2 h-4 w-4" />
                                            Modules
                                        </NavigationMenuTrigger>
                                        <NavigationMenuContent>
                                            <ul className="grid w-[400px] grid-cols-2 gap-3 p-4">
                                                {availableModules && availableModules.length > 0 ? (
                                                    availableModules.map((module: Module) => (
                                                        <li key={module.id}>
                                                            <NavigationMenuLink asChild>
                                                                <a
                                                                    className="hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block space-y-1 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none"
                                                                    href={`/modules/${module.code}/dashboard`}
                                                                >
                                                                    <div className="text-sm leading-none font-medium">{module.name}</div>
                                                                    <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
                                                                        {module.description || `Access ${module.name} features`}
                                                                    </p>
                                                                </a>
                                                            </NavigationMenuLink>
                                                        </li>
                                                    ))
                                                ) : (
                                                    <li className="text-muted-foreground col-span-2 p-3 text-sm">
                                                        No modules available for this business. Contact your administrator to add modules to your
                                                        subscription.
                                                    </li>
                                                )}
                                            </ul>
                                        </NavigationMenuContent>
                                    </NavigationMenuItem>
                                )}

                                {/* Common Features */}
                                <NavigationMenuItem>
                                    <NavigationMenuTrigger>
                                        <BarChart2 className="mr-2 h-4 w-4" />
                                        Analytics
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <ul className="grid w-[300px] gap-3 p-4">
                                            {currentBusiness ? (
                                                <>
                                                    <li>
                                                        <NavigationMenuLink asChild>
                                                            <a
                                                                className="hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block space-y-1 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none"
                                                                href={`/business/analytics/dashboard`}
                                                            >
                                                                <div className="text-sm leading-none font-medium">Business Dashboard</div>
                                                                <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
                                                                    Key metrics for {currentBusiness.name}
                                                                </p>
                                                            </a>
                                                        </NavigationMenuLink>
                                                    </li>
                                                    <li>
                                                        <NavigationMenuLink asChild>
                                                            <a
                                                                className="hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block space-y-1 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none"
                                                                href={`/business/analytics/reports`}
                                                            >
                                                                <div className="text-sm leading-none font-medium">Custom Reports</div>
                                                                <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
                                                                    Generate and view reports
                                                                </p>
                                                            </a>
                                                        </NavigationMenuLink>
                                                    </li>
                                                </>
                                            ) : (
                                                <li className="text-muted-foreground p-3 text-sm">Select a business to view analytics</li>
                                            )}
                                        </ul>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>
                            </NavigationMenuList>
                        </NavigationMenu>

                        {/* Portal & Module Dropdown for mobile */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="sm:hidden">
                                    <Grid className="h-5 w-5" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-60">
                                {/* Only show Admin option if user is admin */}
                                {user.user_type === 'system_admin' && (
                                    <>
                                        <DropdownMenuItem className="font-medium">Portals</DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <ShieldCheck className="mr-2 h-4 w-4" />
                                            <a href="/admin/dashboard">Admin Portal</a>
                                        </DropdownMenuItem>
                                    </>
                                )}

                                {/* Only show Reseller option if user is reseller */}
                                {user.user_type === 'reseller' && (
                                    <>
                                        <DropdownMenuItem className="font-medium">Portals</DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <Users className="mr-2 h-4 w-4" />
                                            <a href="/reseller/dashboard">Reseller Portal</a>
                                        </DropdownMenuItem>
                                    </>
                                )}

                                {/* Businesses section */}
                                <DropdownMenuItem className="mt-2 font-medium">Your Businesses</DropdownMenuItem>
                                {userBusinesses && userBusinesses.length > 0 ? (
                                    userBusinesses.map((business: Business) => (
                                        <DropdownMenuItem key={business.id}>
                                            <Building2 className="mr-2 h-4 w-4" />
                                            <a href={`/business/switch/${business.id}`}>
                                                {business.name}
                                                {currentBusiness?.id === business.id && ' (Active)'}
                                            </a>
                                        </DropdownMenuItem>
                                    ))
                                ) : (
                                    <DropdownMenuItem disabled>No businesses available</DropdownMenuItem>
                                )}

                                {/* Only show modules if a business is selected */}
                                {currentBusiness && availableModules && availableModules.length > 0 && (
                                    <>
                                        <DropdownMenuItem className="mt-2 font-medium">Modules</DropdownMenuItem>
                                        {availableModules.map((module: Module) => (
                                            <DropdownMenuItem key={module.id}>
                                                <a href={`/modules/${module.code}/dashboard`}>{module.name}</a>
                                            </DropdownMenuItem>
                                        ))}
                                    </>
                                )}

                                {/* Analytics section */}
                                {currentBusiness && (
                                    <>
                                        <DropdownMenuItem className="mt-2 font-medium">Analytics</DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <BarChart2 className="mr-2 h-4 w-4" />
                                            <a href={`/business/analytics/dashboard`}>Business Dashboard</a>
                                        </DropdownMenuItem>
                                    </>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <div className="flex items-center gap-1 sm:gap-2">
                        {/* Current Business Indicator */}
                        {currentBusiness && (
                            <div className="mr-2 hidden items-center text-sm md:flex">
                                <Building2 className="text-muted-foreground mr-1 h-4 w-4" />
                                <span className="max-w-[150px] truncate font-medium">{currentBusiness.name}</span>
                            </div>
                        )}

                        {/* Search Bar (on the right) */}
                        <div className="relative hidden min-w-[150px] flex-1 sm:block lg:w-64">
                            <Input type="text" placeholder="Search..." className="w-full pl-8 text-sm" />
                            <Search className="text-muted-foreground absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2" />
                        </div>

                        {/* Small screen search button */}
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

                        {/* Profile Dropdown - using NavUser component with max width */}
                        <div className="max-w-[200px] flex-shrink-0">
                            <NavUser />
                        </div>
                    </div>
                </div>
            </header>

            {/* Breadcrumbs below header */}
            <div className="border-sidebar-border/50 bg-muted/20 flex border-b px-4 py-2">
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
        </div>
    );
}
