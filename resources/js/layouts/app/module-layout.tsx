import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { ModuleSidebar } from '@/components/module-sidebar';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

interface ModuleLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    moduleCode?: string;
}

export default function ModuleLayout({ children, breadcrumbs = [], moduleCode }: ModuleLayoutProps) {
    return (
        <AppShell variant="sidebar">
            <ModuleSidebar moduleCode={moduleCode} />
            <AppContent variant="sidebar">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                <main className="flex-1 p-4 md:p-6">{children}</main>
            </AppContent>
        </AppShell>
    );
}
