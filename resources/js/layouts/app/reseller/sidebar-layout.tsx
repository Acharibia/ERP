import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { ResellerSidebar } from '@/components/reseller-sidebar';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

interface ResellerLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default function ResellerLayout({ children, breadcrumbs = [] }: ResellerLayoutProps) {
    return (
        <AppShell variant="sidebar">
            <ResellerSidebar />
            <AppContent variant="sidebar">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                <main className="flex-1 p-4 md:p-6">{children}</main>
            </AppContent>
        </AppShell>
    );
}
