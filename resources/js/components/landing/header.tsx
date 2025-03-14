// resources/js/components/landing/header.jsx
import { Link } from '@inertiajs/react';
import { ChevronDown, Globe, Mail, Menu, Moon, Phone, Search, Sun, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import AppLogo from '../app-logo';

// Shadcn UI components
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Sheet, SheetClose, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
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

    // Main navigation items
    const navigation = [
        { name: 'Home', href: '/' },
        { name: 'About', href: '/about' },
        { name: 'Pricing', href: '/pricing' },
        { name: 'Contact', href: '/contact' },
    ];

    // Dropdown menu items for features
    const featureItems = [
        {
            title: 'HR Management',
            description: 'Complete employee management and payroll processing',
            href: '/features/hr-management',
            icon: (
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                </svg>
            ),
        },
        {
            title: 'Inventory Control',
            description: 'Track stock levels and automate purchase orders',
            href: '/features/inventory',
            icon: (
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                </svg>
            ),
        },
        {
            title: 'Accounting',
            description: 'Financial statements and tax reporting',
            href: '/features/accounting',
            icon: (
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
            ),
        },
        {
            title: 'CRM',
            description: 'Customer relationship management and sales tracking',
            href: '/features/crm',
            icon: (
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                    />
                </svg>
            ),
        },
    ];

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

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex">
                            <NavigationMenu>
                                <NavigationMenuList>
                                    <NavigationMenuItem>
                                        <Link href="/" prefetch>
                                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>Home</NavigationMenuLink>
                                        </Link>
                                    </NavigationMenuItem>

                                    <NavigationMenuItem>
                                        <Link href="/about" prefetch>
                                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>About</NavigationMenuLink>
                                        </Link>
                                    </NavigationMenuItem>

                                    <NavigationMenuItem>
                                        <NavigationMenuTrigger>Features</NavigationMenuTrigger>
                                        <NavigationMenuContent>
                                            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                                                {featureItems.map((item) => (
                                                    <li key={item.title} className="row-span-1">
                                                        <NavigationMenuLink asChild>
                                                            <Link
                                                                href={item.href}
                                                                className="hover:bg-muted block space-y-1 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none"
                                                            >
                                                                <div className="flex items-center">
                                                                    <span className="text-primary mr-2">{item.icon}</span>
                                                                    <span className="text-sm font-medium">{item.title}</span>
                                                                </div>
                                                                <p className="text-muted-foreground mt-1 line-clamp-2 text-sm leading-snug">
                                                                    {item.description}
                                                                </p>
                                                            </Link>
                                                        </NavigationMenuLink>
                                                    </li>
                                                ))}
                                                <li className="col-span-2">
                                                    <div className="mt-2 border-t pt-3">
                                                        <Link
                                                            href="/features"
                                                            className="text-primary hover:text-primary/90 flex items-center text-sm font-medium"
                                                        >
                                                            View all features
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="16"
                                                                height="16"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                className="ml-1.5"
                                                            >
                                                                <path d="M5 12h14" />
                                                                <path d="m12 5 7 7-7 7" />
                                                            </svg>
                                                        </Link>
                                                    </div>
                                                </li>
                                            </ul>
                                        </NavigationMenuContent>
                                    </NavigationMenuItem>

                                    <NavigationMenuItem>
                                        <Link href="/pricing" prefetch>
                                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>Pricing</NavigationMenuLink>
                                        </Link>
                                    </NavigationMenuItem>

                                    <NavigationMenuItem>
                                        <Link href="/contact" prefetch>
                                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>Contact</NavigationMenuLink>
                                        </Link>
                                    </NavigationMenuItem>
                                </NavigationMenuList>
                            </NavigationMenu>
                        </div>

                        {/* Auth Buttons and Search - Desktop */}
                        <div className="hidden md:flex md:items-center md:space-x-4">
                            {searchOpen ? (
                                <div className="relative flex items-center">
                                    <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                                    <Input type="search" placeholder="Search..." className="h-9 w-56 pl-9" autoFocus />
                                    <Button variant="ghost" size="icon" className="ml-1" onClick={() => setSearchOpen(false)}>
                                        <X className="h-4 w-4" />
                                        <span className="sr-only">Close search</span>
                                    </Button>
                                </div>
                            ) : (
                                <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)}>
                                    <Search className="h-4 w-4" />
                                    <span className="sr-only">Search</span>
                                </Button>
                            )}

                            <Link href="/login">
                                <Button variant="outline" size="sm">
                                    Log in
                                </Button>
                            </Link>
                            <Link href="/register">
                                <Button size="sm">Sign up</Button>
                            </Link>
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

                                    {/* Mobile menu search */}
                                    <div className="border-b p-4">
                                        <div className="relative">
                                            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                                            <Input type="search" placeholder="Search..." className="h-10 w-full pl-9" />
                                        </div>
                                    </div>

                                    {/* Mobile menu navigation */}
                                    <div className="flex-1 overflow-auto overscroll-contain">
                                        <nav className="py-2">
                                            {navigation.map((item) => (
                                                <Link
                                                    key={item.name}
                                                    href={item.href}
                                                    className="hover:bg-muted active:bg-muted/80 flex items-center px-4 py-3 text-base font-medium transition-colors"
                                                >
                                                    {item.name}
                                                </Link>
                                            ))}

                                            {/* Features dropdown using Collapsible */}
                                            <Collapsible className="w-full">
                                                <CollapsibleTrigger className="hover:bg-muted flex w-full items-center justify-between px-4 py-3 text-base font-medium transition-colors">
                                                    <span>Features</span>
                                                    <ChevronDown className="ui-open:rotate-180 h-4 w-4 transition-transform" />
                                                </CollapsibleTrigger>
                                                <CollapsibleContent className="animate-accordion-down">
                                                    <div className="border-primary/30 ml-4 space-y-0.5 border-l-2 py-1 pl-4">
                                                        {featureItems.map((item) => (
                                                            <Link
                                                                key={item.title}
                                                                href={item.href}
                                                                className="hover:bg-muted group my-0.5 flex items-center rounded-md px-2 py-2.5 text-sm transition-colors"
                                                            >
                                                                <span className="text-primary mr-2.5 flex-shrink-0 transition-transform group-hover:scale-110">
                                                                    {item.icon}
                                                                </span>
                                                                <div>
                                                                    <p className="font-medium">{item.title}</p>
                                                                    <p className="text-muted-foreground line-clamp-1 text-xs">{item.description}</p>
                                                                </div>
                                                            </Link>
                                                        ))}

                                                        <div className="bg-muted/50 my-2 rounded-md p-3">
                                                            <Link
                                                                href="/features"
                                                                className="text-primary hover:text-primary/90 flex items-center justify-between text-sm font-medium"
                                                            >
                                                                View all features
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width="16"
                                                                    height="16"
                                                                    viewBox="0 0 24 24"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    strokeWidth="2"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    className="lucide-arrow-right"
                                                                >
                                                                    <path d="M5 12h14" />
                                                                    <path d="m12 5 7 7-7 7" />
                                                                </svg>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </CollapsibleContent>
                                            </Collapsible>
                                        </nav>
                                    </div>

                                    {/* Quick access buttons */}
                                    <div className="border-b p-4">
                                        <div className="grid grid-cols-2 gap-3">
                                            <Link href="/login" className="w-full">
                                                <Button variant="outline" className="h-10 w-full shadow-sm">
                                                    Log in
                                                </Button>
                                            </Link>
                                            <Link href="/register" className="w-full">
                                                <Button className="h-10 w-full shadow-sm">Sign up</Button>
                                            </Link>
                                        </div>
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

            {/* Mobile Search - Slide down panel */}
            <div
                className={`bg-background fixed right-0 left-0 z-40 border-b shadow-md transition-all duration-300 md:hidden ${
                    mobileSearchVisible ? 'top-16 opacity-100' : 'pointer-events-none -top-20 opacity-0'
                }`}
            >
                <div className="container mx-auto p-4">
                    <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                            <Input
                                id="mobile-search-input"
                                type="search"
                                placeholder="Search anything..."
                                className="focus:border-primary h-11 pr-12 pl-9 focus:ring"
                            />
                            <kbd className="bg-muted text-muted-foreground pointer-events-none absolute top-1/2 right-3 hidden h-5 -translate-y-1/2 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none sm:inline-flex">
                                <span className="text-xs">ESC</span>
                            </kbd>
                        </div>
                        <Button
                            size="icon"
                            variant="outline"
                            onClick={toggleMobileSearch}
                            aria-label="Close search"
                            className="h-11 w-11 flex-shrink-0"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Quick search suggestions */}
                    <div className="pt-3 pb-1">
                        <p className="text-muted-foreground mb-2 text-xs font-medium">Popular searches:</p>
                        <div className="flex flex-wrap gap-2">
                            {['HR Module', 'Pricing', 'CRM Features', 'Demo', 'API', 'Inventory'].map((term) => (
                                <Button
                                    key={term}
                                    variant="secondary"
                                    size="sm"
                                    className="bg-secondary/50 hover:bg-secondary/80 h-7 rounded-full px-3 py-0 text-xs"
                                >
                                    {term}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Recent searches */}
                    <div className="border-border/40 mt-2 border-t pt-2">
                        <div className="mb-2 flex items-center justify-between">
                            <p className="text-muted-foreground text-xs font-medium">Recent searches:</p>
                            <Button variant="ghost" size="sm" className="hover:text-primary h-6 p-0 text-xs hover:bg-transparent">
                                Clear all
                            </Button>
                        </div>
                        <div className="space-y-1.5">
                            {['multi-tenant database', 'role permissions', 'api documentation'].map((term) => (
                                <div key={term} className="group flex items-center text-sm">
                                    <Button variant="ghost" size="sm" className="h-7 justify-start px-2 text-left">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="14"
                                            height="14"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="lucide-clock-3 text-muted-foreground mr-2"
                                        >
                                            <circle cx="12" cy="12" r="10" />
                                            <polyline points="12 6 12 12 16.5 12" />
                                        </svg>
                                        {term}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="ml-auto h-6 w-6 p-0 opacity-0 transition-opacity group-hover:opacity-100"
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
