import { Breadcrumbs } from '@/components/breadcrumbs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { type BreadcrumbItem, type PageProps } from '@/types';
import { usePage } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { AppsDropdown } from './apps-dropdown';
import { ModulesDropdown } from './modules-dropdown';
import { NavUser } from './nav-user';
import { NotificationsDropdown } from './notifications-dropdown';
import { OrdersDropdown } from './orders-dropdown';

export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItem[] }) {
    const { activeBusiness } = usePage<PageProps>().props;

    return (
        <div className="bg-background/80 sticky top-0 z-50 rounded-xl backdrop-blur-sm">
            <header className="border-sidebar-border/50 flex h-14 shrink-0 items-center gap-2 border-b px-4 transition-[width,height] ease-linear">
                <div className="flex w-full items-center justify-between px-6">
                    <div className="flex items-center gap-2">
                        <SidebarTrigger className="-ml-1" />
                        <AppsDropdown />
                        {activeBusiness && <ModulesDropdown />}
                    </div>

                    <div className="flex items-center gap-1 sm:gap-2">
                    

                        {/* Search Bar (on the right) */}
                        <div className="relative hidden min-w-[150px] flex-1 sm:block lg:w-64">
                            <Input type="text" placeholder="Search..." className="w-full pl-8 text-sm" />
                            <Search className="text-muted-foreground absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2" />
                        </div>

                        {/* Small screen search button */}
                        <Button variant="ghost" size="icon" className="sm:hidden">
                            <Search className="h-5 w-5" />
                        </Button>

                        {/* Shopping Cart Dropdown */}
                        <OrdersDropdown />

                        {/* Notifications Dropdown */}
                        <NotificationsDropdown />

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
