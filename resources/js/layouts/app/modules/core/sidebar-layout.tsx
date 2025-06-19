//@/layouts/app/modules/core/sidebar-layout.tsx
import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { CoreModuleSidebar } from '@/components/core-sidebar';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

interface CoreModuleLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default function CoreModuleLayout({ children, breadcrumbs = [] }: CoreModuleLayoutProps) {
    return (
        <AppShell variant="sidebar">
            <CoreModuleSidebar />
            <AppContent variant="sidebar">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                <main className="flex-1 p-4 md:p-6">{children}</main>
            </AppContent>
        </AppShell>
    );
}
