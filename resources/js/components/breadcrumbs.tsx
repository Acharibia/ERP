// @/components/ui/breadcrumbs.tsx
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { useIsMobile } from '@/hooks/use-mobile';
import { type BreadcrumbItem as BreadcrumbItemType, type PageProps } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { MoreHorizontal } from 'lucide-react';
import { Fragment, useMemo } from 'react';

// Configuration objects for cleaner mapping
const ACCESS_CONFIG = {
    admin: { title: 'Admin', href: '/admin/dashboard' },
    reseller: { title: 'Reseller', href: '/reseller/dashboard' },
    business: { title: 'Business', href: '/business/dashboard' },
} as const;

const MODULE_CONFIG = {
    hr: { title: 'HR', href: '/modules/hr/dashboard' },
    crm: { title: 'CRM', href: '/modules/crm/dashboard' },
    inventory: { title: 'Inventory', href: '/modules/inventory/dashboard' },
    accounting: { title: 'Accounting', href: '/modules/accounting/dashboard' },
    finance: { title: 'Finance', href: '/modules/finance/dashboard' },
} as const;

export function Breadcrumbs({ breadcrumbs }: { breadcrumbs: BreadcrumbItemType[] }) {
    const { activeAccessType, activeModuleCode } = usePage<PageProps>().props;
    const isMobile = useIsMobile();

    const contextBreadcrumbs = useMemo(() => {
        const context: BreadcrumbItemType[] = [];

        // Add base access type breadcrumb
        if (activeAccessType && activeAccessType in ACCESS_CONFIG) {
            context.push(ACCESS_CONFIG[activeAccessType as keyof typeof ACCESS_CONFIG]);
        }

        // Add module breadcrumbs for module access
        if (activeAccessType === 'module') {
            context.push({ title: 'Modules', href: '/select-access' });

            if (activeModuleCode && activeModuleCode in MODULE_CONFIG) {
                context.push(MODULE_CONFIG[activeModuleCode as keyof typeof MODULE_CONFIG]);
            }
        }

        return context;
    }, [activeAccessType, activeModuleCode]);

    const fullBreadcrumbs = useMemo(() => {
        return [...contextBreadcrumbs, ...breadcrumbs];
    }, [contextBreadcrumbs, breadcrumbs]);

    const displayBreadcrumbs = useMemo(() => {
        if (!isMobile || fullBreadcrumbs.length <= 3) {
            return fullBreadcrumbs;
        }

        // On mobile, show first + ... + last 2 items
        const first = fullBreadcrumbs[0];
        const lastTwo = fullBreadcrumbs.slice(-2);

        return [first, { title: '...', href: '#', isEllipsis: true }, ...lastTwo];
    }, [fullBreadcrumbs, isMobile]);

    const truncateTitle = (title: string, maxLength: number = 20) => {
        if (!isMobile || title.length <= maxLength) return title;
        return title.substring(0, maxLength) + '...';
    };

    if (fullBreadcrumbs.length === 0) return null;

    return (
        <div className={`${isMobile ? 'overflow-x-auto' : ''}`}>
            <Breadcrumb>
                <BreadcrumbList className={`${isMobile ? 'min-w-max flex-nowrap' : ''}`}>
                    {displayBreadcrumbs.map((item, index) => {
                        const isLast = index === displayBreadcrumbs.length - 1;
                        const isEllipsis = 'isEllipsis' in item && item.isEllipsis;

                        return (
                            <Fragment key={`${item.href}-${index}`}>
                                <BreadcrumbItem className={`${isMobile ? 'flex-shrink-0' : ''}`}>
                                    {isEllipsis ? (
                                        <span className="flex items-center px-1">
                                            <MoreHorizontal className="text-muted-foreground h-4 w-4" />
                                        </span>
                                    ) : isLast ? (
                                        <BreadcrumbPage className={`${isMobile ? 'text-xs' : 'text-sm'}`}>
                                            <span className={`${isMobile ? 'block max-w-[120px] truncate' : ''}`}>{truncateTitle(item.title)}</span>
                                        </BreadcrumbPage>
                                    ) : (
                                        <BreadcrumbLink asChild>
                                            <Link
                                                href={item.href}
                                                className={`${isMobile ? 'text-xs' : 'text-sm'} hover:text-foreground transition-colors`}
                                            >
                                                <span className={`${isMobile ? 'block max-w-[100px] truncate' : ''}`}>
                                                    {truncateTitle(item.title)}
                                                </span>
                                            </Link>
                                        </BreadcrumbLink>
                                    )}
                                </BreadcrumbItem>
                                {!isLast && <BreadcrumbSeparator className={`${isMobile ? 'flex-shrink-0' : ''}`} />}
                            </Fragment>
                        );
                    })}
                </BreadcrumbList>
            </Breadcrumb>
        </div>
    );
}
