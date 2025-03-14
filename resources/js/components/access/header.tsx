// resources/js/components/landing/header.jsx
import { Link } from '@inertiajs/react';
import { ChevronDown, Globe, Mail, Menu, Moon, Phone, Search, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import AppLogo from '../app-logo';

// Shadcn UI components
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetClose, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AccessUserMenu } from '../access-user-menu';

export const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [mobileSearchVisible, setMobileSearchVisible] = useState(false);

    // Add scroll event listener
    useEffect(() => {
        const handleScroll = () => {
            const offset = window.scrollY;
            setIsScrolled(offset > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Toggle dark mode
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    // Handle Escape key press to close mobile search
    useEffect(() => {
        const handleEscKey = (e: { key: string }) => {
            if (e.key === 'Escape' && mobileSearchVisible) {
                setMobileSearchVisible(false);
            }
        };

        document.addEventListener('keydown', handleEscKey);
        return () => document.removeEventListener('keydown', handleEscKey);
    }, [mobileSearchVisible]);

    // Language options
    const languages = [
        { name: 'English', code: 'en' },
        { name: 'Spanish', code: 'es' },
        { name: 'French', code: 'fr' },
        { name: 'German', code: 'de' },
    ];

    // Function to toggle and handle mobile search
    const toggleMobileSearch = () => {
        setMobileSearchVisible(!mobileSearchVisible);
        if (!mobileSearchVisible) {
            setTimeout(() => {
                document.getElementById('mobile-search-input')?.focus();
            }, 100);
        }
    };

    return (
        <>
            {/* Top bar with contact info */}
            <div className={`w-full border-b transition-all duration-200 ${isScrolled ? 'hidden' : 'bg-muted/50 dark:border-border'}`}>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between py-2 text-sm">
                        <div className="flex items-center space-x-4">
                            <div className="text-muted-foreground flex items-center">
                                <Phone className="mr-1 h-3.5 w-3.5" />
                                <span>+1 (555) 123-4567</span>
                            </div>
                            <div className="text-muted-foreground hidden items-center sm:flex">
                                <Mail className="mr-1 h-3.5 w-3.5" />
                                <span>contact@erpsolution.com</span>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsDarkMode(!isDarkMode)}>
                                            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                                            <span className="sr-only">Toggle theme</span>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{isDarkMode ? 'Light mode' : 'Dark mode'}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8">
                                        <Globe className="mr-1 h-3.5 w-3.5" />
                                        <span className="text-xs">EN</span>
                                        <ChevronDown className="ml-1 h-3.5 w-3.5" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    {languages.map((lang) => (
                                        <DropdownMenuItem key={lang.code} className="flex cursor-pointer items-center">
                                            <span className="mr-2 text-xs font-bold uppercase opacity-60">{lang.code}</span>
                                            {lang.name}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main header */}
            <header
                className={`sticky top-0 z-50 w-full transition-all duration-200 ${
                    isScrolled ? 'bg-background/90 shadow-sm backdrop-blur-md' : 'bg-background'
                }`}
            >
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        {/* Logo */}
                        <div className="flex items-center">
                            <Link href="/" prefetch>
                                <AppLogo />
                            </Link>
                        </div>

                        {/* Auth Buttons and Search - Desktop */}
                        <div className="hidden md:flex md:items-center md:space-x-4">
                            <AccessUserMenu />
                        </div>

                        {/* Mobile Navigation */}
                        <div className="flex items-center md:hidden">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={toggleMobileSearch}
                                className="relative mr-2"
                                aria-label="Search"
                                aria-expanded={mobileSearchVisible}
                            >
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
                                        <Link href="/" prefetch>
                                            <AppLogo />
                                        </Link>
                                        <SheetClose className="hover:bg-muted rounded-full p-2 transition-colors">
                                            <span className="sr-only">Close menu</span>
                                        </SheetClose>
                                    </div>

                                    {/* Additional actions */}
                                    <div className="space-y-4 border-t p-4">
                                        <div className="flex items-center justify-between">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex h-9 w-[48%] items-center text-sm"
                                                onClick={() => setIsDarkMode(!isDarkMode)}
                                            >
                                                {isDarkMode ? (
                                                    <>
                                                        <Sun className="mr-2 h-4 w-4" /> Light mode
                                                    </>
                                                ) : (
                                                    <>
                                                        <Moon className="mr-2 h-4 w-4" /> Dark mode
                                                    </>
                                                )}
                                            </Button>

                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="outline" size="sm" className="flex h-9 w-[48%] items-center text-sm">
                                                        <Globe className="mr-2 h-4 w-4" />
                                                        Language
                                                        <ChevronDown className="ml-auto h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-[180px]">
                                                    {languages.map((lang) => (
                                                        <DropdownMenuItem key={lang.code} className="flex cursor-pointer items-center">
                                                            <span className="mr-2 text-xs font-bold uppercase opacity-60">{lang.code}</span>
                                                            {lang.name}
                                                        </DropdownMenuItem>
                                                    ))}
                                                    <DropdownMenuItem className="text-muted-foreground flex cursor-pointer justify-center text-xs">
                                                        More languages coming soon
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>

                                        <div className="text-muted-foreground flex items-center justify-between py-2 text-xs">
                                            <Link href="/terms" className="hover:text-primary transition-colors">
                                                Terms
                                            </Link>
                                            <Link href="/privacy" className="hover:text-primary transition-colors">
                                                Privacy
                                            </Link>
                                            <Link href="/help" className="hover:text-primary transition-colors">
                                                Help
                                            </Link>
                                            <div className="flex items-center">
                                                <span className="mr-1">© 2025</span>
                                            </div>
                                        </div>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
};
