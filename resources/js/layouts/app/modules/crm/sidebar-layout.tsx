import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { CRMModuleSidebar } from '@/components/crm-sidebar';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

interface CRMModuleLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default function CRMModuleLayout({ children, breadcrumbs = [] }: CRMModuleLayoutProps) {
    return (
        <AppShell variant="sidebar">
            <CRMModuleSidebar />
            <AppContent variant="sidebar">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                <main className="flex-1 p-4 md:p-6">{children}</main>
            </AppContent>
        </AppShell>
    );
}
