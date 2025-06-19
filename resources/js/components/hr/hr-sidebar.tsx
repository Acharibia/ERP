import { BusinessSwitcher } from '@/components/business-switcher';
import { NavMain } from '@/components/hr/nav-main';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from '@/components/ui/sidebar';
import { Link } from '@inertiajs/react';
import {
    BarChart3,
    BookOpen,
    Building2,
    Clock,
    DollarSign,
    FileText,
    HelpCircle,
    LayoutDashboard,
    Medal,
    Settings,
    TrendingUp,
    Users,
} from 'lucide-react';

// HR navigation data
const hrData = {
    navMain: [
        {
            title: 'Dashboard',
            url: '/modules/hr/dashboard',
            icon: LayoutDashboard,
            isActive: true,
        },
        {
            title: 'Analytics',
            url: '/modules/hr/analytics',
            icon: BarChart3,
        },
        {
            title: 'Reports',
            url: '/modules/hr/reports',
            icon: FileText,
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
            title: 'Performance',
            url: '#',
            icon: TrendingUp,
            items: [
                {
                    title: 'Performance Reviews',
                    url: '/modules/hr/performance/reviews',
                },
                {
                    title: 'Goal Management',
                    url: '/modules/hr/performance/goals',
                },
                {
                    title: 'Performance Analytics',
                    url: '/modules/hr/performance/analytics',
                },
            ],
        },
        {
            title: 'Training',
            url: '#',
            icon: BookOpen,
            items: [
                {
                    title: 'Training Programs',
                    url: '/modules/hr/training/programs',
                },
                {
                    title: 'Certifications',
                    url: '/modules/hr/training/certifications',
                },
                {
                    title: 'Learning Paths',
                    url: '/modules/hr/training/learning-paths',
                },
                {
                    title: 'Training Records',
                    url: '/modules/hr/training/records',
                },
            ],
        },
        {
            title: 'Time & Attendance',
            url: '#',
            icon: Clock,
            items: [
                {
                    title: 'Attendance',
                    url: '/modules/hr/attendance',
                },
                {
                    title: 'Leaves',
                    url: '/modules/hr/leaves',
                },
            ],
        },
        {
            title: 'Payroll',
            url: '#',
            icon: DollarSign,
            items: [
                {
                    title: 'Payroll Management',
                    url: '/modules/hr/payroll',
                },
            ],
        },
        {
            title: 'Settings',
            url: '#',
            icon: Settings,
            items: [
                {
                    title: 'HR Settings',
                    url: '/modules/hr/settings',
                },
            ],
        },
    ],
};

export function HRModuleSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <BusinessSwitcher />
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={hrData.navMain} groupLabel="HR Management" />
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Link href="/business/support" prefetch>
                                <HelpCircle />
                                <span>Support</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    );
}

export default HRModuleSidebar;
