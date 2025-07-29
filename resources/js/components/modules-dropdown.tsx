import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Module, PageProps } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { Package } from 'lucide-react';

export function ModulesDropdown() {
    const { activeBusiness, availableModules = [] } = usePage<PageProps>().props;
    const navigateToModule = (moduleCode: string) => {
        router.visit(`/modules/${moduleCode}/dashboard`);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Package />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-72">
                <DropdownMenuLabel>{activeBusiness ? `Modules for ${activeBusiness.name}` : 'Select a Business to View Modules'}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {activeBusiness && availableModules.length > 0 ? (
                    availableModules.map((module: Module) => (
                        <DropdownMenuItem
                            key={module.id}
                            onSelect={() => navigateToModule(module.code)}
                            className="flex items-center justify-between"
                        >
                            <div className="flex items-center">
                                <div className="mr-2 flex w-6 justify-center">
                                    {/* You could add module-specific icons here */}
                                    <Package className="h-4 w-4" />
                                </div>
                                <div>
                                    <div className="font-medium">{module.name}</div>
                                    <div className="text-muted-foreground text-xs">{module.description || 'No description'}</div>
                                </div>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                                {module.version || 'Latest'}
                            </Badge>
                        </DropdownMenuItem>
                    ))
                ) : (
                    <DropdownMenuItem disabled>
                        {activeBusiness ? 'No modules available for this business' : 'Please select a business first'}
                    </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <Button variant="ghost" className="w-full">
                        Manage Modules
                    </Button>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
