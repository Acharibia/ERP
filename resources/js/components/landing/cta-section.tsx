// resources/js/components/landing/cta-section.tsx
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';

export const CTASection = () => {
    return (
        <div className="bg-primary">
            <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20 lg:px-8">
                <div className="lg:flex lg:items-center lg:justify-between">
                    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                        Ready to streamline your business?
                        <span className="text-primary-foreground mt-2 block text-lg font-normal">
                            Start your 14-day free trial today. No credit card required.
                        </span>
                    </h2>
                    <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
                        <div className="inline-flex rounded-md shadow">
                            <Link href="/register">
                                <Button size="lg" className="text-primary bg-white hover:bg-gray-100">
                                    Get started
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                        <div className="ml-3 inline-flex rounded-md shadow">
                            <Link href="/demo">
                                <Button size="lg" variant="outline" className="hover:bg-primary-foreground/10 border-white text-white">
                                    Schedule a demo
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
