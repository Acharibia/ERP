import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BarChart3, Building, FileText, Grid3X3, LayoutDashboard, MessagesSquare, Settings, Star, TrendingUp, Users } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        url: '/modules/crm/dashboard',
        icon: LayoutDashboard,
    },
    {
        title: 'Customers',
        url: '/modules/crm/customers',
        icon: Building,
    },
    {
        title: 'Leads',
        url: '/modules/crm/leads',
        icon: TrendingUp,
    },
    {
        title: 'Opportunities',
        url: '/modules/crm/opportunities',
        icon: Star,
    },
    {
        title: 'Contacts',
        url: '/modules/crm/contacts',
        icon: Users,
    },
    {
        title: 'Communications',
        url: '/modules/crm/communications',
        icon: MessagesSquare,
    },
    {
        title: 'Quotes & Proposals',
        url: '/modules/crm/quotes',
        icon: FileText,
    },
    {
        title: 'Reports',
        url: '/modules/crm/reports',
        icon: BarChart3,
    },
    {
        title: 'Settings',
        url: '/modules/crm/settings',
        icon: Settings,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Switch Module',
        url: '/access/selection',
        icon: Grid3X3,
    },
];

export function CRMModuleSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/modules/crm/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} groupLabel="CRM" />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

export default CRMModuleSidebar;
