import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BarChart3, CreditCard, FileText, HelpCircle, LayoutDashboard, Settings, ShoppingCart, Users } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        url: '/business/dashboard',
        icon: LayoutDashboard,
    },
    {
        title: 'Users',
        url: '/business/users',
        icon: Users,
    },
    {
        title: 'Subscription',
        url: '/business/subscription',
        icon: ShoppingCart,
    },
    {
        title: 'Invoices',
        url: '/business/invoices',
        icon: FileText,
    },
    {
        title: 'Analytics',
        url: '/business/analytics',
        icon: BarChart3,
    },
];

const settingsNavItems: NavItem[] = [
    {
        title: 'Company Profile',
        url: '/business/settings/profile',
        icon: Settings,
    },
    {
        title: 'Billing',
        url: '/business/settings/billing',
        icon: CreditCard,
    },
];

const supportNavItems: NavItem[] = [
    {
        title: 'Help Center',
        url: '/business/help',
        icon: HelpCircle,
    },
];

export function BusinessSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/business/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} groupLabel="Business Management" />

                <SidebarGroup className="mt-4 px-2 py-0">
                    <SidebarGroupLabel>Settings</SidebarGroupLabel>
                    <SidebarMenu>
                        {settingsNavItems.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton asChild>
                                    <Link href={item.url} prefetch>
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={supportNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

export default BusinessSidebar;
