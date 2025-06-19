'use client';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { type PageProps } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Building2, ChevronsUpDown, Plus } from 'lucide-react';

export function BusinessSwitcher() {
    const { activeBusiness, userBusinesses = [] } = usePage<PageProps>().props;

    if (!activeBusiness) {
        return null;
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="sm" className="flex h-auto items-center space-x-2 px-3 py-2 text-left">
                    <div className="flex items-center gap-2">
                        <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                            <Building2 className="size-4" />
                        </div>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-medium">{activeBusiness.name}</span>
                            <span className="text-muted-foreground truncate text-xs">Active Business</span>
                        </div>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuLabel className="text-muted-foreground text-xs">Your Businesses</DropdownMenuLabel>
                {userBusinesses.length > 0 ? (
                    userBusinesses.map((business, index) => (
                        <DropdownMenuItem key={business.id} className="gap-2 p-2">
                            <div className="flex size-6 items-center justify-center rounded-md border">
                                <Building2 className="size-3.5 shrink-0" />
                            </div>
                            <Link href={`/business/switch/${business.id}`} className="flex-1">
                                {business.name}
                                {activeBusiness?.id === business.id}
                            </Link>
                            <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                        </DropdownMenuItem>
                    ))
                ) : (
                    <DropdownMenuItem disabled>No businesses available</DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2 p-2">
                    <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                        <Plus className="size-4" />
                    </div>
                    <div className="text-muted-foreground font-medium">Add business</div>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
