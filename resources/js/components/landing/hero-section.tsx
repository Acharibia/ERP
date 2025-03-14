// resources/js/components/landing/hero-section.jsx
import DashboardChart from '@/components/landing/dashboard-chart';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Link } from '@inertiajs/react';
import { Check, ChevronsRight, Play } from 'lucide-react';
import { useEffect, useState } from 'react';
import { VideoPlayer } from '../video-player';
import { TrustedCompaniesSection } from './trusted-companies-section';

export const HeroSection = () => {
    const [isMobile, setIsMobile] = useState(false);

    // Check for mobile viewport
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        // Initial check
        checkMobile();

        // Add resize listener
        window.addEventListener('resize', checkMobile);

        // Cleanup
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Feature bullets
    const keyFeatures = [
        'Multi-tenant architecture with complete data isolation',
        'Modular design with flexible subscription options',
        'Comprehensive reseller management tools',
    ];

    return (
        <section className="from-muted/50 to-background relative overflow-hidden bg-gradient-to-b pt-6 pb-16 md:pt-8 md:pb-20 lg:pb-28 xl:pb-32">
            {/* Background decorative elements - Optimized for mobile */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <div className="bg-primary/5 absolute -top-20 -right-20 h-64 w-64 rounded-full blur-3xl md:h-96 md:w-96"></div>
                <div className="absolute top-1/2 left-1/4 h-40 w-40 rounded-full bg-blue-500/5 blur-3xl md:h-64 md:w-64"></div>
                <div className="absolute right-1/3 bottom-0 h-40 w-40 rounded-full bg-emerald-500/5 blur-3xl md:h-64 md:w-64"></div>
            </div>

            <div className="relative z-10 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="items-center lg:grid lg:grid-cols-12 lg:gap-8">
                    <div className="lg:col-span-6 xl:col-span-5">
                        <div className="text-center sm:text-center lg:text-left">
                            {/* Badge */}
                            <Badge
                                variant="outline"
                                className="mb-4 inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium md:mb-6 md:text-sm"
                            >
                                <span className="bg-primary h-1.5 w-1.5 rounded-full md:h-2 md:w-2"></span>
                                <span className="truncate">New Module: Advanced Analytics</span>
                            </Badge>

                            {/* Headline - Responsive text sizing */}
                            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl">
                                <span className="inline sm:block">Enterprise Resource</span>{' '}
                                <span className="from-primary inline-block bg-gradient-to-r to-blue-600 bg-clip-text text-transparent sm:mt-1 sm:block">
                                    Planning Solution
                                </span>
                            </h1>

                            {/* Description - Adjusted for mobile */}
                            <p className="text-muted-foreground mx-auto mt-3 text-base sm:mt-5 sm:max-w-xl md:mt-4 md:text-lg lg:mx-0">
                                A comprehensive ERP platform that enables resellers to manage multiple client businesses with secure data isolation,
                                flexible modules, and an exceptional user experience.
                            </p>

                            {/* Feature bullets - Improved mobile display */}
                            <ul className="text-muted-foreground mx-auto mt-4 max-w-md space-y-2 text-xs md:mt-6 md:max-w-xl md:text-sm lg:mx-0">
                                {keyFeatures.map((feature, index) => (
                                    <li key={index} className="flex items-start md:items-center">
                                        <Check className="text-primary mt-0.5 mr-2 h-4 w-4 flex-shrink-0 md:mt-0" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* CTA Buttons - Mobile optimized layout */}
                            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center md:mt-8 lg:justify-start">
                                <Link href="/register" className="block sm:inline-block">
                                    <Button size={isMobile ? 'default' : 'lg'} className="group relative w-full overflow-hidden px-6 sm:w-auto">
                                        <span className="relative z-10 flex items-center justify-center">
                                            Get started
                                            <ChevronsRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                        </span>
                                    </Button>
                                </Link>

                                <Link href="/demo">
                                    <Button variant="outline" size={isMobile ? 'default' : 'lg'} className="w-full sm:w-auto">
                                        Request a demo
                                    </Button>
                                </Link>

                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="ghost" size={isMobile ? 'default' : 'lg'} className="space-x-2">
                                            <div className="bg-primary flex h-5 w-5 items-center justify-center rounded-full text-white md:h-6 md:w-6">
                                                <Play className="ml-0.5 h-2.5 w-2.5 md:h-3 md:w-3 dark:text-black" />
                                            </div>
                                            <span>Watch video</span>
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="mx-2 overflow-hidden p-0 sm:max-w-2xl md:mx-auto">
                                        <VideoPlayer src="/assets/videos/billie.mp4"  autoPlay={true} controls={true} playbackRates={[0.5, 1, 1.5, 2]} />
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                    </div>

                    {/* Hero image - Mobile responsive version */}
                    <div className="mt-10 md:mt-12 lg:col-span-6 lg:mt-0 xl:col-span-7">
                        <div className="relative mx-auto max-w-sm px-4 sm:max-w-md sm:px-0 md:max-w-lg lg:max-w-none">
                            <div className="relative z-20">
                                {/* Main image with shadow and border - Optimized for mobile */}
                                <div className="relative overflow-hidden rounded-xl border shadow-xl md:rounded-2xl md:shadow-2xl">
                                    <DashboardChart />
                                </div>

                                {/* Dashboard stats card overlay - Responsive positioning */}
                                <Card className="absolute top-4 right-0 z-30 w-48 translate-x-4 transform shadow-lg sm:w-56 sm:translate-x-1/6 md:top-6 md:w-60 md:translate-x-1/4">
                                    <CardContent className="p-3 md:p-4">
                                        <h4 className="text-xs font-medium md:text-sm">Monthly Performance</h4>
                                        <div className="mt-2 space-y-1.5 md:space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-muted-foreground text-[10px] md:text-xs">Revenue</span>
                                                <span className="text-[10px] font-medium md:text-xs">$24,502</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-muted-foreground text-[10px] md:text-xs">New Clients</span>
                                                <span className="text-[10px] font-medium text-emerald-600 md:text-xs">+12.5%</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-muted-foreground text-[10px] md:text-xs">Active Users</span>
                                                <span className="text-[10px] font-medium md:text-xs">1,203</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* User activity card overlay - Mobile responsive positioning */}
                                <Card className="absolute -bottom-2 left-0 z-30 -translate-x-4 transform shadow-lg sm:-translate-x-1/6 md:-bottom-4 md:-translate-x-1/4">
                                    <CardContent className="p-2 md:p-3">
                                        <div className="flex items-center space-x-2">
                                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 md:h-8 md:w-8">
                                                <span className="text-[10px] font-medium text-blue-600 md:text-xs">JD</span>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-medium md:text-xs">John completed onboarding</p>
                                                <p className="text-muted-foreground text-[8px] md:text-xs">Just now</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Background gradient element - Mobile adjusted */}
                            <div className="from-primary/30 absolute top-0 right-0 -z-10 h-full w-full scale-105 -rotate-3 transform rounded-xl bg-gradient-to-br to-blue-500/30 md:rounded-2xl"></div>

                            {/* Floating elements - Scaled for mobile */}
                            <div className="absolute -top-4 left-8 z-10 h-8 w-8 -rotate-6 rounded-lg border border-yellow-400/30 bg-yellow-400/20 backdrop-blur-sm md:-top-6 md:left-10 md:h-12 md:w-12"></div>
                            <div className="absolute right-10 -bottom-4 z-10 h-10 w-10 rounded-full border border-emerald-400/30 bg-emerald-400/20 backdrop-blur-sm md:right-12 md:-bottom-6 md:h-16 md:w-16"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile-optimized spacing for Trusted by section */}
            <div className="mt-12 md:mt-16">
                <TrustedCompaniesSection />
            </div>
        </section>
    );
};
