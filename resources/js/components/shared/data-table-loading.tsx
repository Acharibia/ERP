// components/shared/data-table/data-table-loading.tsx

import { Skeleton } from '@/components/ui/skeleton';

export function DataTableInitialLoading() {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex flex-1 items-center space-x-2">
                    <Skeleton className="h-8 w-[250px]" />
                    <Skeleton className="h-8 w-20" />
                </div>
                <div className="flex items-center space-x-2">
                    <Skeleton className="h-8 w-28" />
                    <Skeleton className="h-8 w-16" />
                </div>
            </div>
            <div className="p-8 text-center">
                <div className="flex items-center justify-center space-x-2">
                    <div className="border-primary h-10 w-10 animate-spin rounded-full border-b-2" />
                </div>
            </div>
        </div>
    );
}
