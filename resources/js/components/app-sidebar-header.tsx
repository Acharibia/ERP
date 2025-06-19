import { Breadcrumbs } from '@/components/breadcrumbs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { type BreadcrumbItem, type PageProps } from '@/types';
import { usePage } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { ModulesDropdown } from './modules-dropdown';
import { NavUser } from './nav-user';
import { NotificationsDropdown } from './notifications-dropdown';
import { OrdersDropdown } from './orders-dropdown';

export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItem[] }) {
    const { activeBusiness } = usePage<PageProps>().props;
    const isMobile = useIsMobile();

    return (
        <div className="bg-background/80 sticky top-0 z-50 rounded-xl backdrop-blur-sm">
            <header className="border-sidebar-border/50 flex h-14 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
                <div className={`flex w-full items-center justify-between ${isMobile ? 'px-3' : 'px-6'}`}>
                    <div className={`flex items-center ${isMobile ? 'gap-1' : 'gap-2'}`}>
                        <SidebarTrigger className="-ml-1" />
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
                        <div className={`flex-shrink-0 ${isMobile ? 'max-w-[120px]' : 'max-w-[200px]'}`}>
                            <NavUser />
                        </div>
                    </div>
                </div>
            </header>
            {/* Breadcrumbs below header */}
            <div className={`border-sidebar-border/50 flex overflow-x-auto py-1 backdrop-blur-sm ${isMobile ? 'px-3' : 'px-6'}`}>
                <div className="min-w-0 flex-1">
                    <Breadcrumbs breadcrumbs={breadcrumbs} />
                </div>
            </div>
        </div>
    );
}
