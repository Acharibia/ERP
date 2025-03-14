// resources/js/components/landing/features-section.tsx
import { Link } from '@inertiajs/react';
import { ArrowRight, BarChart, CheckCircle, Globe, Layers, ShieldCheck, Users, Zap } from 'lucide-react';
import React from 'react';

interface Feature {
    name: string;
    description: string;
    icon: React.ReactNode;
    highlights: string[];
}

export const FeaturesSection: React.FC = () => {
    const features: Feature[] = [
        {
            name: 'Multi-Tenant Architecture',
            description: 'Secure data isolation between clients with our robust multi-tenant system.',
            icon: <Users className="h-6 w-6" />,
            highlights: ['Complete data isolation between businesses', 'Automated tenant provisioning', 'Separate database per client'],
        },
        {
            name: 'Enterprise-Grade Security',
            description: 'Advanced security features with role-based access control and comprehensive audit logging.',
            icon: <ShieldCheck className="h-6 w-6" />,
            highlights: ['Role-based access control', 'Detailed audit logging', 'Data encryption at rest and in transit'],
        },
        {
            name: 'Modular System',
            description: 'Pay only for what you need with our flexible modular approach to ERP functionality.',
            icon: <Layers className="h-6 w-6" />,
            highlights: ['Flexible subscription packages', 'Seamless module activation', 'Regular updates with new features'],
        },
        {
            name: 'High Performance',
            description: 'Lightning-fast response times and optimized workflows to boost productivity.',
            icon: <Zap className="h-6 w-6" />,
            highlights: ['Sub-second API response times', 'Optimized database queries', 'Efficient caching strategies'],
        },
        {
            name: 'Global Reach',
            description: 'Multi-language and localization support for businesses operating worldwide.',
            icon: <Globe className="h-6 w-6" />,
            highlights: ['Multiple language support', 'Region-specific compliance features', 'Multi-currency capabilities'],
        },
        {
            name: 'Advanced Analytics',
            description: 'Gain insights with customizable dashboards and comprehensive reporting tools.',
            icon: <BarChart className="h-6 w-6" />,
            highlights: ['Customizable dashboards', 'Comprehensive reporting', 'Real-time KPI monitoring'],
        },
    ];

    return (
        <section
            id="features"
            className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white py-24 sm:py-32 dark:from-slate-950 dark:to-slate-900"
        >
            {/* Background decorative elements */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <div className="bg-primary/5 absolute top-1/4 -right-40 h-96 w-96 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-blue-500/5 blur-3xl"></div>
            </div>

            <div className="relative z-10 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto text-center">
                    <div className="bg-primary/10 text-primary inline-flex items-center rounded-full px-3 py-1 text-sm font-medium">
                        <span className="bg-primary mr-1.5 flex h-2 w-2 rounded-full"></span>
                        Features
                    </div>

                    <h2 className="mt-6 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl md:text-5xl dark:text-white">
                        A better way to manage your business
                    </h2>

                    <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
                        Our ERP platform is designed to provide all the tools you need to streamline operations, increase efficiency, and drive
                        growth.
                    </p>
                </div>

                <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature) => (
                        <div
                            key={feature.name}
                            className="group relative rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                        >
                            <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-xl">{feature.icon}</div>

                            <h3 className="mt-6 text-xl font-semibold text-slate-900 dark:text-white">{feature.name}</h3>

                            <p className="mt-2 text-slate-600 dark:text-slate-300">{feature.description}</p>

                            <ul className="mt-6 space-y-3">
                                {feature.highlights.map((highlight, index) => (
                                    <li key={index} className="flex items-start">
                                        <CheckCircle className="text-primary mr-2 h-5 w-5 flex-shrink-0" />
                                        <span className="text-sm text-slate-600 dark:text-slate-400">{highlight}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-6 border-t border-slate-100 pt-4 dark:border-slate-800">
                                <Link
                                    href={`/features/${feature.name.toLowerCase().replace(/\s+/g, '-')}`}
                                    className="text-primary inline-flex items-center text-sm font-medium"
                                >
                                    Learn more
                                    <ArrowRight className="ml-1 h-4 w-4" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-20 grid gap-12 md:grid-cols-3">
                    <div className="text-center">
                        <div className="bg-primary/10 mx-auto flex h-16 w-16 items-center justify-center rounded-full">
                            <ShieldCheck className="text-primary h-8 w-8" />
                        </div>
                        <h3 className="mt-6 text-lg font-semibold text-slate-900 dark:text-white">99.9% Uptime</h3>
                        <p className="mt-2 text-slate-600 dark:text-slate-300">
                            Our platform is designed for reliability with redundant systems and continuous monitoring.
                        </p>
                    </div>

                    <div className="text-center">
                        <div className="bg-primary/10 mx-auto flex h-16 w-16 items-center justify-center rounded-full">
                            <Users className="text-primary h-8 w-8" />
                        </div>
                        <h3 className="mt-6 text-lg font-semibold text-slate-900 dark:text-white">500+ Businesses</h3>
                        <p className="mt-2 text-slate-600 dark:text-slate-300">
                            Join a growing community of businesses transforming their operations with our platform.
                        </p>
                    </div>

                    <div className="text-center">
                        <div className="bg-primary/10 mx-auto flex h-16 w-16 items-center justify-center rounded-full">
                            <Globe className="text-primary h-8 w-8" />
                        </div>
                        <h3 className="mt-6 text-lg font-semibold text-slate-900 dark:text-white">30+ Countries</h3>
                        <p className="mt-2 text-slate-600 dark:text-slate-300">
                            Our global reach ensures businesses worldwide can benefit from our ERP solution.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};
