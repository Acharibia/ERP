import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { UserMenuContent } from '@/components/user-menu-content';
import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { ChevronsUpDown } from 'lucide-react';

export function AccessUserMenu() {
    const { auth } = usePage<SharedData>().props;
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex h-auto items-center space-x-2 px-3 py-2 text-left">
                    <UserInfo user={auth.user} />
                    <ChevronsUpDown className="ml-1 h-4 w-4 opacity-70" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 rounded-lg" align="end" side="bottom">
                <UserMenuContent user={auth.user} />
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
