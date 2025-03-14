import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { HRModuleSidebar } from '@/components/hr-sidebar';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

interface HRModuleLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default function HRModuleLayout({ children, breadcrumbs = [] }: HRModuleLayoutProps) {
    return (
        <AppShell variant="sidebar">
            <HRModuleSidebar />
            <AppContent variant="sidebar">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                <main className="flex-1 p-4 md:p-6">{children}</main>
            </AppContent>
        </AppShell>
    );
}
