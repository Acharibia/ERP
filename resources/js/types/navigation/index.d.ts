export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

interface NavItem {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    style?: 'collapsible' | 'dropdown';
    items?: {
        title: string;
        url: string;
    }[];
}