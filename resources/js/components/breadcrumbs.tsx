// @/components/ui/breadcrumbs.tsx
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { type BreadcrumbItem as BreadcrumbItemType, type PageProps } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Fragment } from 'react';

export function Breadcrumbs({ breadcrumbs }: { breadcrumbs: BreadcrumbItemType[] }) {
    const { activeAccessType, activeModuleCode } = usePage<PageProps>().props;

    // Create context-aware breadcrumbs
    const contextBreadcrumbs: BreadcrumbItemType[] = [];

    // Add base breadcrumb based on access type
    if (activeAccessType === 'admin') {
        contextBreadcrumbs.push({ title: 'Admin', href: '/admin/dashboard' });
    } else if (activeAccessType === 'reseller') {
        contextBreadcrumbs.push({ title: 'Reseller', href: '/reseller/dashboard' });
    } else if (activeAccessType === 'module' && activeModuleCode) {
        contextBreadcrumbs.push({ title: 'Business', href: '/business/dashboard' });

        // Add module-specific breadcrumb if applicable
        switch (activeModuleCode) {
            case 'hr':
                contextBreadcrumbs.push({ title: 'HR', href: '/modules/hr/dashboard' });
                break;
            case 'crm':
                contextBreadcrumbs.push({ title: 'CRM', href: '/modules/crm/dashboard' });
                break;
            case 'inventory':
                contextBreadcrumbs.push({ title: 'Inventory', href: '/modules/inventory/dashboard' });
                break;
            default:
                break;
        }
    } else {
        contextBreadcrumbs.push({ title: 'Business', href: '/business/dashboard' });
    }

    // Combine context breadcrumbs with page-specific breadcrumbs
    const fullBreadcrumbs = [...contextBreadcrumbs, ...breadcrumbs];

    return (
        <>
            {fullBreadcrumbs.length > 0 && (
                <div className="px-6 md:px-8">
                    <Breadcrumb>
                        <BreadcrumbList>
                            {fullBreadcrumbs.map((item, index) => {
                                const isLast = index === fullBreadcrumbs.length - 1;
                                return (
                                    <Fragment key={index}>
                                        <BreadcrumbItem>
                                            {isLast ? (
                                                <BreadcrumbPage>{item.title}</BreadcrumbPage>
                                            ) : (
                                                <BreadcrumbLink asChild>
                                                    <Link href={item.href}>{item.title}</Link>
                                                </BreadcrumbLink>
                                            )}
                                        </BreadcrumbItem>
                                        {!isLast && <BreadcrumbSeparator />}
                                    </Fragment>
                                );
                            })}
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            )}
        </>
    );
}
