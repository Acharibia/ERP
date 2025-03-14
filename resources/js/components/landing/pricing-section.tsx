// resources/js/components/landing/pricing-section.jsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Link } from '@inertiajs/react';
import { CheckCircle, HelpCircle } from 'lucide-react';
import { useState } from 'react';

export const PricingSection = () => {
    const [billingCycle, setBillingCycle] = useState('monthly');

    const plans = [
        {
            name: 'Starter',
            description: 'Perfect for small businesses and startups.',
            monthlyPrice: 49,
            yearlyPrice: 470,
            features: ['Up to 5 users', 'Core HR module', 'Basic CRM', '5GB storage', 'Email support', 'Basic reporting'],
            highlight: false,
            cta: 'Get Started',
        },
        {
            name: 'Professional',
            description: 'Ideal for growing businesses with more needs.',
            monthlyPrice: 99,
            yearlyPrice: 950,
            features: [
                'Up to 20 users',
                'HR + Accounting modules',
                'Advanced CRM',
                '20GB storage',
                'Priority email support',
                'Advanced reporting',
                'API access',
            ],
            highlight: true,
            cta: 'Start Free Trial',
        },
        {
            name: 'Enterprise',
            description: 'For established businesses with complex requirements.',
            monthlyPrice: 199,
            yearlyPrice: 1900,
            features: [
                'Unlimited users',
                'All modules included',
                'Enterprise CRM',
                '100GB storage',
                '24/7 phone support',
                'Custom reporting',
                'Advanced API access',
                'Dedicated account manager',
            ],
            highlight: false,
            cta: 'Contact Sales',
        },
    ];

    return (
        <section className="relative overflow-hidden bg-gradient-to-b from-white to-slate-50 py-24 sm:py-32 dark:from-slate-900 dark:to-slate-950">
            {/* Background decorative elements */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <div className="bg-primary/5 absolute top-1/3 -right-20 h-96 w-96 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-blue-500/5 blur-3xl"></div>
            </div>

            <div className="relative z-10 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto text-center">
                    <div className="bg-primary/10 text-primary inline-flex items-center rounded-full px-3 py-1 text-sm font-medium">
                        <span className="bg-primary mr-1.5 flex h-2 w-2 rounded-full"></span>
                        Pricing
                    </div>

                    <h2 className="mt-6 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
                        Plans for businesses of all sizes
                    </h2>

                    <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
                        Choose the perfect plan for your needs. All plans include a 14-day free trial with no credit card required.
                    </p>

                    {/* Billing Toggle */}
                    <div className="mt-10 inline-flex items-center rounded-full border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900">
                        <ToggleGroup
                            type="single"
                            value={billingCycle}
                            onValueChange={(value) => {
                                if (value) setBillingCycle(value);
                            }}
                            className="flex"
                        >
                            <ToggleGroupItem value="monthly" className="rounded-full px-6 py-2 text-sm">
                                Monthly
                            </ToggleGroupItem>
                            <ToggleGroupItem value="yearly" className="rounded-full px-6 py-2 text-sm">
                                Yearly <span className="text-primary dark:text-primary ml-1 text-xs font-medium">(Save 20%)</span>
                            </ToggleGroupItem>
                        </ToggleGroup>
                    </div>
                </div>

                <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-8 sm:mt-20 lg:max-w-none lg:grid-cols-3">
                    {plans.map((plan) => (
                        <Card
                            key={plan.name}
                            className={`flex flex-col transition-all duration-200 hover:shadow-md ${
                                plan.highlight
                                    ? 'border-primary dark:border-primary/70 dark:shadow-primary/5 relative shadow-lg'
                                    : 'border-slate-200 dark:border-slate-800'
                            }`}
                        >
                            {plan.highlight && (
                                <div className="bg-primary absolute -top-4 right-0 left-0 mx-auto w-36 rounded-full px-3 py-1 text-center text-xs font-medium text-white">
                                    Most Popular
                                </div>
                            )}
                            <CardHeader className="pt-6 pb-8">
                                <CardTitle className="text-xl">{plan.name}</CardTitle>
                                <CardDescription className="mt-1.5 text-slate-500 dark:text-slate-400">{plan.description}</CardDescription>
                                <div className="mt-5">
                                    <div className="flex items-baseline">
                                        <span className="text-3xl font-bold text-slate-900 dark:text-white">$</span>
                                        <span className="text-4xl font-bold text-slate-900 dark:text-white">
                                            {billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                                        </span>
                                        <span className="ml-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                                            /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                                        </span>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-grow pb-8">
                                <ul className="space-y-3">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex items-start">
                                            <CheckCircle className="text-primary mt-0.5 mr-2.5 h-4 w-4 flex-shrink-0" />
                                            <span className="text-sm text-slate-700 dark:text-slate-300">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardFooter className="border-t border-slate-100 px-6 py-6 dark:border-slate-800">
                                <Link href={plan.name === 'Enterprise' ? '/contact' : '/register'} className="w-full">
                                    <Button className="w-full" variant={plan.highlight ? 'default' : 'outline'} size="lg">
                                        {plan.cta}
                                    </Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                <div className="mt-20 rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Need a custom solution?</h3>
                            <p className="mt-2 text-slate-600 dark:text-slate-300">
                                Contact our sales team for a custom plan tailored to your specific business requirements.
                            </p>
                        </div>
                        <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
                            <Link href="/contact">
                                <Button size="lg" variant="secondary">
                                    Schedule a demo
                                </Button>
                            </Link>
                            <Link href="/contact">
                                <Button size="lg" variant="outline">
                                    Contact sales
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="mx-auto mt-16 max-w-3xl">
                    <h3 className="mb-6 text-center text-lg font-semibold text-slate-900 dark:text-white">Frequently Asked Questions</h3>

                    <div className="space-y-4">
                        <div className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                            <h4 className="flex items-center text-base font-medium text-slate-900 dark:text-white">
                                <HelpCircle className="text-primary mr-2 h-4 w-4" />
                                Can I change plans later?
                            </h4>
                            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                                Yes, you can upgrade, downgrade, or cancel your plan at any time. Changes take effect at the start of your next
                                billing cycle.
                            </p>
                        </div>

                        <div className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                            <h4 className="flex items-center text-base font-medium text-slate-900 dark:text-white">
                                <HelpCircle className="text-primary mr-2 h-4 w-4" />
                                What payment methods do you accept?
                            </h4>
                            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                                We accept all major credit cards, including Visa, Mastercard, and American Express. For Enterprise plans, we also
                                offer invoice-based payment.
                            </p>
                        </div>

                        <div className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                            <h4 className="flex items-center text-base font-medium text-slate-900 dark:text-white">
                                <HelpCircle className="text-primary mr-2 h-4 w-4" />
                                Do you offer discounts for nonprofits?
                            </h4>
                            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                                Yes, we offer special pricing for nonprofits, educational institutions, and startups. Contact our sales team for more
                                information.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
