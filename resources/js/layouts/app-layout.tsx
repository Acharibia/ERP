// @/layouts/app-layout.tsx
import { useAppLayout } from '@/components/app-layout-provider';
import { Toaster } from '@/components/ui/sonner';
import { type BreadcrumbItem, type PageProps } from '@/types';
import { usePage } from '@inertiajs/react';
import { type ReactNode } from 'react';

// Import all layout templates
import AdminSidebarLayout from '@/layouts/app/admin/sidebar-layout';
import ModuleCoreSidebarLayout from '@/layouts/app/modules/core/sidebar-layout';
import ModuleCRMSidebarLayout from '@/layouts/app/modules/crm/sidebar-layout';
import HRHeaderLayout from '@/layouts/app/modules/hr/header-layout';
import ModuleHRSidebarLayout from '@/layouts/app/modules/hr/sidebar-layout';
import ModuleInventorySidebarLayout from '@/layouts/app/modules/inventory/sidebar-layout';
import ResellerSidebarLayout from '@/layouts/app/reseller/sidebar-layout';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default function AppLayout({ children, breadcrumbs, ...props }: AppLayoutProps) {
    const { layout } = useAppLayout();
    const { activeAccessType, activeModuleCode } = usePage<PageProps>().props;

    // Determine which layout to render based on active access type and layout type
    const getLayoutComponent = () => {
        if (layout === 'header') {
            // Module-specific header layouts
            if (activeAccessType === 'module' && activeModuleCode) {
                switch (activeModuleCode) {
                    case 'hr':
                        return HRHeaderLayout;
                    // Add more cases for other modules if needed
                    default:
                        return 'hr';
                }
            }
        }

        // Sidebar layouts (existing logic)
        if (activeAccessType === 'admin') {
            return AdminSidebarLayout;
        }
        if (activeAccessType === 'reseller') {
            return ResellerSidebarLayout;
        }
        if (activeAccessType === 'module' && activeModuleCode) {
            switch (activeModuleCode) {
                case 'core':
                    return ModuleCoreSidebarLayout;
                case 'hr':
                    return ModuleHRSidebarLayout;
                case 'crm':
                    return ModuleCRMSidebarLayout;
                case 'inventory':
                    return ModuleInventorySidebarLayout;
                default:
                    return ModuleCoreSidebarLayout;
            }
        }
        // Default to BusinessSidebarLayout
        return ModuleCoreSidebarLayout;
    };

    const LayoutComponent = getLayoutComponent();

    return (
        <LayoutComponent breadcrumbs={breadcrumbs} {...props}>
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl">{children}</div>
            <Toaster richColors position="bottom-right" closeButton />
        </LayoutComponent>
    );
}
