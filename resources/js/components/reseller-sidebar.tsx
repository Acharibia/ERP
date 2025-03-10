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
import { BarChart3, Building2, CreditCard, FileText, LayoutDashboard, Settings, ShoppingCart, Users } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        url: '/reseller/dashboard',
        icon: LayoutDashboard,
    },
    {
        title: 'Clients',
        url: '/reseller/clients',
        icon: Building2,
    },
    {
        title: 'Subscriptions',
        url: '/reseller/subscriptions',
        icon: ShoppingCart,
    },
    {
        title: 'Invoices',
        url: '/reseller/invoices',
        icon: FileText,
    },
    {
        title: 'Commissions',
        url: '/reseller/commissions',
        icon: CreditCard,
    },
    {
        title: 'Analytics',
        url: '/reseller/analytics',
        icon: BarChart3,
    },
];

const settingsNavItems: NavItem[] = [
    {
        title: 'Company Profile',
        url: '/reseller/settings/profile',
        icon: Building2,
    },
    {
        title: 'Team Members',
        url: '/reseller/settings/team',
        icon: Users,
    },
    {
        title: 'White Labeling',
        url: '/reseller/settings/branding',
        icon: Settings,
    },
];

export function ResellerSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/reseller/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} groupLabel="Reseller" />

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
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

export default ResellerSidebar;
