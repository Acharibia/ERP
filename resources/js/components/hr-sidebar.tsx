import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BarChart3, Building2, Calendar, Clock, DollarSign, HelpCircle, LayoutDashboard, Settings, Users } from 'lucide-react';
import AppLogo from './app-logo';

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
        title: 'Leave Management',
        url: '/modules/hr/leave',
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

const footerNavItems: NavItem[] = [
    {
        title: 'Help Center',
        url: '/business/help',
        icon: HelpCircle,
    },
];

export function HRModuleSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/modules/hr/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} groupLabel="HR Management" />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
            </SidebarFooter>
        </Sidebar>
    );
}

export default HRModuleSidebar;
