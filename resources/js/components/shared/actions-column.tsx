'use client';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import * as lucideIcons from 'lucide-react';
import { LucideIconByName } from './lucide-icon-by-name';

type Action = {
    name: string;
    icon: string;
    label?: string;
};

type ActionsColumnProps<T> = {
    actions: Action[];
    rowData: T;
    onAction: (action: string, row: T) => void;
};

export function ActionsColumn<T>({ actions, rowData, onAction }: ActionsColumnProps<T>) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button size="icon" variant="secondary">
                    <LucideIconByName name="LayoutList" className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
                {actions.map((action) => (
                    <DropdownMenuItem
                        key={action.name}
                        onClick={(e) => {
                            e.stopPropagation();
                            onAction(action.name, rowData);
                        }}
                    >
                        <LucideIconByName name={action.icon as keyof typeof lucideIcons} className="mr-2 h-4 w-4" />
                        <span>{action.label ?? action.name}</span>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
