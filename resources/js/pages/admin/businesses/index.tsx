'use client';

import { columns } from '@/components/shared/columns';
import { DataTable } from '@/components/shared/data-table';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import resellersData from '@/data/tasks.json';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';

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

export default function Businesses() {
    const tasks = resellersData;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Businesses" />
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-sm font-medium">Businesses</CardTitle>
                        <CardDescription>Manage client businesses across your ERP platform</CardDescription>
                    </div>
                    <Link href={route('admin.businesses.create')} className={buttonVariants({ variant: 'default' })}>
                        <Plus className="mr-2 h-4 w-4" /> Add Business
                    </Link>
                </CardHeader>
                <CardContent>
                    <DataTable data={tasks} columns={columns} />
                </CardContent>
            </Card>
        </AppLayout>
    );
}
