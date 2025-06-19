// resources/js/components/landing/header.jsx
import { Menu, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetClose, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { AccessUserMenu } from '../access-user-menu';
import { BusinessSwitcher } from './business-switcher';

export const Header = () => {
    return (
        <header className="border-border/40 bg-background/80 sticky top-0 z-50 w-full border-b backdrop-blur-sm transition-all duration-200">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center">
                        <BusinessSwitcher />
                    </div>

                    <div className="hidden md:flex md:items-center md:space-x-4">
                        <AccessUserMenu />
                    </div>

                    <div className="flex items-center md:hidden">
                        <Button variant="ghost" size="icon" className="relative mr-2" aria-label="Search">
                            <Search className="h-5 w-5" />
                            <span className="sr-only">Search</span>
                        </Button>

                        <Sheet>
                            <SheetTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    aria-label="Open menu"
                                    className="transition-transform focus-visible:ring-2 active:scale-95"
                                >
                                    <Menu className="h-5 w-5" />
                                    <span className="sr-only">Menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="flex w-[85vw] max-w-md flex-col p-0 sm:max-w-sm">
                                <div className="flex items-center justify-between border-b p-4">
                                    <BusinessSwitcher />
                                    <SheetClose className="hover:bg-muted rounded-full p-2 transition-colors">
                                        <span className="sr-only">Close menu</span>
                                    </SheetClose>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </header>
    );
};
