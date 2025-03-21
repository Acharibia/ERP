import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import {
    BarChart3,
    Blocks,
    Briefcase,
    Cog,
    Combine,
    Database,
    Handshake,
    LayoutDashboard,
    Package,
    UserRoundCog,
    UserRoundSearch,
    Users,
} from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        url: '/admin/dashboard',
        icon: LayoutDashboard,
    },

    {
        title: 'Admins',
        url: '/admin/resellers',
        icon: UserRoundCog,
    },
    {
        title: 'Resellers',
        url: '/admin/resellers',
        icon: UserRoundSearch,
    },
    {
        title: 'Businesses',
        url: '/admin/businesses',
        icon: Briefcase,
    },
    {
        title: 'Partnerships',
        url: '/admin/partnerships',
        icon: Handshake,
    },
    {
        title: 'Investors',
        url: '/admin/investors',
        icon: Users,
    },
    {
        title: 'Business Mergers',
        url: '/admin/mergers',
        icon: Combine,
    },
    {
        title: 'Modules',
        url: '/admin/modules',
        icon: Blocks,
    },
    {
        title: 'Packages',
        url: '/admin/packages',
        icon: Package,
    },
    {
        title: 'System Settings',
        url: '/admin/settings',
        icon: Cog,
    },
    {
        title: 'Analytics',
        url: '/admin/analytics',
        icon: BarChart3,
    },
    {
        title: 'Database',
        url: '/admin/database',
        icon: Database,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'System Logs',
        url: '/admin/logs',
        icon: Database,
    },
];

export function AdminSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/admin/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} groupLabel="Administration" />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

export default AdminSidebar;
