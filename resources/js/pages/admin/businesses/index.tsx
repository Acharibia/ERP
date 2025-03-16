'use client';

import { columns } from '@/components/shared/columns';
import { DataTable } from '@/components/shared/data-table';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import resellersData from '@/data/tasks.json';

const breadcrumbs = [
    {
        title: 'Dashboard',
        href: route('admin.dashboard'),
    },
    {
        title: 'Businesses',
        href: '/admin/businesses',
    },
];

export default function Reseller() {
    const tasks = resellersData;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Businesses" />
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm font-medium">Businesses</CardTitle>
                </CardHeader>
                <CardContent>
                    <DataTable data={tasks} columns={columns} />
                </CardContent>
            </Card>
        </AppLayout>
    );
}
