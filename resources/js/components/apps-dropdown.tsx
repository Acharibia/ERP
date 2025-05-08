import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { type PageProps } from '@/types';
import { usePage } from '@inertiajs/react';
import { Building2, LayoutGrid, ShieldCheck, Users } from 'lucide-react';

export function AppsDropdown() {
    const { auth, activeBusiness, userBusinesses = [] } = usePage<PageProps>().props;
    const user = auth.user;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <LayoutGrid className="h-5 w-5" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64">
                <DropdownMenuLabel>Portals</DropdownMenuLabel>
                <DropdownMenuSeparator />

                {user.user_type === 'system_admin' && (
                    <DropdownMenuItem>
                        <ShieldCheck className="mr-2 h-4 w-4" />
                        <a href="/admin/dashboard">Admin Portal</a>
                    </DropdownMenuItem>
                )}

                {user.user_type === 'reseller' && (
                    <DropdownMenuItem>
                        <Users className="mr-2 h-4 w-4" />
                        <a href="/reseller/dashboard">Reseller Portal</a>
                    </DropdownMenuItem>
                )}

                <DropdownMenuLabel className="mt-2">Your Businesses</DropdownMenuLabel>
                <DropdownMenuSeparator />

                {userBusinesses.length > 0 ? (
                    userBusinesses.map((business) => (
                        <DropdownMenuItem key={business.id}>
                            <Building2 className="mr-2 h-4 w-4" />
                            <a href={`/business/switch/${business.id}`}>
                                {business.name}
                                {activeBusiness?.id === business.id && ' (Active)'}
                            </a>
                        </DropdownMenuItem>
                    ))
                ) : (
                    <DropdownMenuItem disabled>No businesses available</DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
