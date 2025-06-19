import { Head } from '@inertiajs/react';

import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';

import { LayoutSelector } from '@/components/layout-selector';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Layout settings',
        href: '/settings/layout',
    },
];

export default function Layout() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Layout settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Layout settings" description="Update your account's layout settings" />
                    <LayoutSelector />
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
