'use client';

import { columns } from '@/components/shared/columns';
import { DataTable } from '@/components/shared/data-table';
import { buttonVariants } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';

import { Head, Link } from '@inertiajs/react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import resellersData from '@/data/tasks.json';
import { Plus } from 'lucide-react';

const breadcrumbs = [
    {
        title: 'Dashboard',
        href: route('admin.dashboard'),
    },
    {
        title: 'Reseller',
        href: '/admin/resellers',
    },
];

export default function Reseller() {
    const tasks = resellersData;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Resellers" />
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-sm font-medium">Resellers</CardTitle>
                            <CardDescription>Manage platform resellers who sell solution to businesses</CardDescription>
                        </div>
                        <Link href={route('admin.resellers.create')} className={buttonVariants({ variant: 'default' })}>
                            <Plus /> Add Reseller
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <DataTable data={tasks} columns={columns} />
                    </CardContent>
                </Card>

        </AppLayout>
    );
}
