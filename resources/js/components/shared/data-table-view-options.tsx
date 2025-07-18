'use client';

import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { Table } from '@tanstack/react-table';
import { Eye } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';

interface DataTableViewOptionsProps<TData> {
    table: Table<TData>;
}

export function DataTableViewOptions<TData>({ table }: DataTableViewOptionsProps<TData>) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="ml-auto flex h-8 items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span className="hidden sm:inline">View</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[150px]">
                <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {table
                    .getAllColumns()
                    .filter((column) => typeof column.accessorFn !== 'undefined' && column.getCanHide())
                    .map((column) => {
                        return (
                            <DropdownMenuCheckboxItem
                                key={column.id}
                                className="capitalize"
                                checked={column.getIsVisible()}
                                onCheckedChange={(value) => column.toggleVisibility(!!value)}
                            >
                                {(column.columnDef.meta as { title?: string })?.title || column.id}
                            </DropdownMenuCheckboxItem>
                        );
                    })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
