import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { BusinessSidebar } from '@/components/business-sidebar';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

interface BusinessLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default function BusinessLayout({ children, breadcrumbs = [] }: BusinessLayoutProps) {
    return (
        <AppShell variant="sidebar">
            <BusinessSidebar />
            <AppContent variant="sidebar">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                <main className="flex-1 p-4 md:p-6">{children}</main>
            </AppContent>
        </AppShell>
    );
}
