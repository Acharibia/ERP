import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { InventoryModuleSidebar } from '@/components/inventory-sidebar';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

interface InventoryModuleLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default function InventoryModuleLayout({ children, breadcrumbs = [] }: InventoryModuleLayoutProps) {
    return (
        <AppShell variant="sidebar">
            <InventoryModuleSidebar />
            <AppContent variant="sidebar">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                <main className="flex-1 p-4 md:p-6">{children}</main>
            </AppContent>
        </AppShell>
    );
}
