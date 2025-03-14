import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BarChart3, Building, Clipboard, FileText, Grid3X3, LayoutDashboard, PackageCheck, Scan, Settings, TruckIcon, Warehouse } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        url: '/modules/inventory/dashboard',
        icon: LayoutDashboard,
    },
    {
        title: 'Products',
        url: '/modules/inventory/products',
        icon: PackageCheck,
    },
    {
        title: 'Stock',
        url: '/modules/inventory/stock',
        icon: Warehouse,
    },
    {
        title: 'Purchase Orders',
        url: '/modules/inventory/purchase-orders',
        icon: FileText,
    },
    {
        title: 'Vendors',
        url: '/modules/inventory/vendors',
        icon: Building,
    },
    {
        title: 'Stock Movements',
        url: '/modules/inventory/movements',
        icon: TruckIcon,
    },
    {
        title: 'Barcode Management',
        url: '/modules/inventory/barcodes',
        icon: Scan,
    },
    {
        title: 'Inventory Count',
        url: '/modules/inventory/count',
        icon: Clipboard,
    },
    {
        title: 'Reports',
        url: '/modules/inventory/reports',
        icon: BarChart3,
    },
    {
        title: 'Settings',
        url: '/modules/inventory/settings',
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

export function InventoryModuleSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/modules/inventory/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} groupLabel="Inventory Management" />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

export default InventoryModuleSidebar;
