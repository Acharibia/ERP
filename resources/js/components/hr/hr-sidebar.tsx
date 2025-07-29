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
import { BarChart3, BookOpen, Building2, Clock, FileText, HelpCircle, LayoutDashboard, Medal, Settings, TrendingUp, Users } from 'lucide-react';

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
            title: 'Leaves',
            url: '/modules/hr/leaves',
            icon: Medal,
        },
        {
            title: 'Training',
            url: '#',
            icon: BookOpen,
            items: [
                {
                    title: 'Programs',
                    url: '/modules/hr/programs',
                },
                {
                    title: 'Courses',
                    url: '/modules/hr/courses',
                },
                {
                    title: 'Trainers',
                    url: '/modules/hr/training/trainers',
                },
                {
                    title: 'Sessions',
                    url: '/modules/hr/training/sessions',
                },
                {
                    title: 'Assignments',
                    url: '/modules/hr/training/assignments',
                },
                {
                    title: 'Feedback',
                    url: '/modules/hr/training/feedback',
                },
                {
                    title: 'Learning Paths',
                    url: '/modules/hr/training/learning-paths',
                },
                {
                    title: 'Certifications',
                    url: '/modules/hr/training/certifications',
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
                    title: 'Shifts',
                    url: '/modules/hr/shifts',
                },
                {
                    title: 'Shift Rotations',
                    url: '/modules/hr/shift-rotations',
                },
                {
                    title: 'Schedules',
                    url: '/modules/hr/schedules',
                },
                {
                    title: 'Shift Preferences',
                    url: '/modules/hr/shift-preferences',
                },
            ],
        },
        {
            title: 'Access Control',
            url: '#',
            icon: Settings,
            items: [
                {
                    title: 'Roles & Permissions',
                    url: '/modules/hr/role-access',
                },
                {
                    title: 'Access Management',
                    url: '/modules/hr/user-access',
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
