'use client';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { BaseRowData, BulkAction } from '@/types/data-table';
import { MoreHorizontal } from 'lucide-react';
import { LucideIconByName } from './lucide-icon-by-name';

interface DataTableBulkActionsProps {
    actions: BulkAction[];
    selectedRows: BaseRowData[];
    onBulkAction: (action: string, rows: BaseRowData[]) => void;
}

export function DataTableBulkActions({ actions, selectedRows, onBulkAction }: DataTableBulkActionsProps) {
    if (selectedRows.length === 0 || actions.length === 0) return null;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                    Bulk Actions
                    <MoreHorizontal className="ml-2 h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-44">
                {actions.map((action) => {
                    return (
                        <DropdownMenuItem
                            key={action.value}
                            onClick={() => onBulkAction(action.value, selectedRows)}
                            className="flex items-center gap-2"
                        >
                            <LucideIconByName name={typeof action.icon === 'string' ? action.icon : 'MoreHorizontal'} className="h-4 w-4" />
                            {action.label}
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
