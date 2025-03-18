// @/layouts/app-layout.tsx
import { Toaster } from '@/components/ui/sonner';
import { type BreadcrumbItem, type PageProps } from '@/types';
import { usePage } from '@inertiajs/react';
import { type ReactNode } from 'react';

// Import all layout templates
import AdminSidebarLayout from '@/layouts/app/admin/sidebar-layout';
import BusinessSidebarLayout from '@/layouts/app/business/sidebar-layout';
import ModuleCRMSidebarLayout from '@/layouts/app/modules/crm/sidebar-layout';
import ModuleHRSidebarLayout from '@/layouts/app/modules/hr/sidebar-layout';
import ModuleInventorySidebarLayout from '@/layouts/app/modules/inventory/sidebar-layout';
import ResellerSidebarLayout from '@/layouts/app/reseller/sidebar-layout';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default function AppLayout({ children, breadcrumbs, ...props }: AppLayoutProps) {
    const { activeAccessType, activeModuleCode } = usePage<PageProps>().props;

    // Determine which layout to render based on active access type
    const getLayoutComponent = () => {
        // Admin access
        if (activeAccessType === 'admin') {
            return AdminSidebarLayout;
        }

        // Reseller access
        if (activeAccessType === 'reseller') {
            return ResellerSidebarLayout;
        }

        // Module access
        if (activeAccessType === 'module' && activeModuleCode) {
            switch (activeModuleCode) {
                case 'hr':
                    return ModuleHRSidebarLayout;
                case 'crm':
                    return ModuleCRMSidebarLayout;
                case 'inventory':
                    return ModuleInventorySidebarLayout;
                default:
                    return BusinessSidebarLayout;
            }
        }
        // Default to BusinessSidebarLayout
        return BusinessSidebarLayout;
    };

    const LayoutComponent = getLayoutComponent();

    return (
        <LayoutComponent breadcrumbs={breadcrumbs} {...props}>
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4"> {children}</div>

            <Toaster />
        </LayoutComponent>
    );
}
