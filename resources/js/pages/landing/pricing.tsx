// resources/js/Pages/Pricing.tsx
import { CTASection } from '@/components/landing/cta-section';
import LandingLayout from '@/layouts/landing-layout';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowRightIcon, CheckCircle2Icon, CheckIcon, HelpCircleIcon, StarIcon, XIcon } from 'lucide-react';
import { useState } from 'react';

interface PricingFeature {
    name: string;
    description?: string;
    starter: boolean | string;
    professional: boolean | string;
    enterprise: boolean | string;
    isPopular?: boolean;
}

interface PlanModule {
    name: string;
    starter: boolean;
    professional: boolean;
    enterprise: boolean;
    isNew?: boolean;
}

interface PricingPlan {
    name: string;
    description: string;
    monthlyPrice: number;
    yearlyPrice: number;
    features: string[];
    highlight: boolean;
    cta: string;
    ctaLink: string;
    savings?: number;
    badge?: string;
}

interface FAQ {
    question: string;
    answer: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Home',
        href: '/',
    },
    {
        title: 'Pricing',
        href: '/pricing',
    },
];

export default function Pricing() {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

    const plans: PricingPlan[] = [
        {
            name: 'Starter',
            description: 'Perfect for small businesses and startups.',
            monthlyPrice: 49,
            yearlyPrice: 470,
            features: ['Up to 5 users', 'Core HR module', 'Basic CRM', '5GB storage', 'Email support', 'Basic reporting'],
            highlight: false,
            cta: 'Get Started',
            ctaLink: '/register',
            savings: 118,
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
            ctaLink: '/register?plan=professional',
            savings: 238,
            badge: 'Most Popular',
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
            ctaLink: '/contact?inquiry=enterprise',
            savings: 488,
            badge: 'Best Value',
        },
    ];

    const pricingFeatures: PricingFeature[] = [
        {
            name: 'Users',
            description: 'Number of user accounts included in the plan',
            starter: '5',
            professional: '20',
            enterprise: 'Unlimited',
        },
        {
            name: 'Storage',
            description: 'Total file storage available for your business data',
            starter: '5GB',
            professional: '20GB',
            enterprise: '100GB',
        },
        {
            name: 'API Access',
            description: 'Ability to connect with other applications through our API',
            starter: false,
            professional: true,
            enterprise: true,
            isPopular: true,
        },
        {
            name: 'Data Export',
            description: 'Export your business data in various formats',
            starter: 'CSV only',
            professional: 'CSV, Excel',
            enterprise: 'All formats',
        },
        {
            name: 'Support',
            description: 'Level of technical support provided',
            starter: 'Email only',
            professional: 'Priority email',
            enterprise: '24/7 phone & email',
            isPopular: true,
        },
        {
            name: 'Customization',
            description: 'Ability to customize the platform to your needs',
            starter: 'Limited',
            professional: 'Standard',
            enterprise: 'Advanced',
        },
        {
            name: 'White Labeling',
            description: 'Ability to brand the platform with your own logo and colors',
            starter: false,
            professional: 'Basic',
            enterprise: 'Complete',
            isPopular: true,
        },
        {
            name: 'Custom Domain',
            description: 'Use your own domain name for the platform',
            starter: false,
            professional: true,
            enterprise: true,
        },
        {
            name: 'Account Manager',
            description: 'Dedicated support person for your account',
            starter: false,
            professional: false,
            enterprise: true,
            isPopular: true,
        },
    ];

    const modules: PlanModule[] = [
        { name: 'HR Management', starter: true, professional: true, enterprise: true },
        { name: 'Basic CRM', starter: true, professional: true, enterprise: true },
        { name: 'Advanced CRM', starter: false, professional: true, enterprise: true },
        { name: 'Accounting', starter: false, professional: true, enterprise: true },
        { name: 'Inventory Management', starter: false, professional: false, enterprise: true },
        { name: 'Project Management', starter: false, professional: false, enterprise: true },
        { name: 'Document Management', starter: false, professional: true, enterprise: true },
        { name: 'Business Intelligence', starter: false, professional: false, enterprise: true, isNew: true },
    ];

    const pricingFaqs: FAQ[] = [
        {
            question: 'How does the 14-day free trial work?',
            answer: 'You can sign up for any plan and use all features with no restrictions for 14 days. No credit card is required to start, and you can cancel at any time during the trial period with no charge.',
        },
        {
            question: 'Can I change plans later?',
            answer: 'Yes, you can upgrade or downgrade your plan at any time. When upgrading, the new features will be available immediately. When downgrading, the changes will take effect on your next billing cycle.',
        },
        {
            question: 'Are there any long-term contracts?',
            answer: 'No, all our plans are subscription-based with no long-term commitment required. You can pay monthly or annually, with annual payments receiving a 20% discount.',
        },
        {
            question: 'What payment methods do you accept?',
            answer: 'We accept all major credit cards (Visa, Mastercard, American Express) as well as PayPal. For Enterprise customers, we can also arrange other payment methods like wire transfers or invoicing.',
        },
        {
            question: 'Can I add more users to my plan?',
            answer: 'Yes, you can add additional users to any plan for an extra fee. The per-user cost depends on your plan level, with discounts for larger teams.',
        },
        {
            question: 'Is there a discount for non-profit organizations?',
            answer: 'Yes, we offer special pricing for non-profit organizations. Please contact our sales team with your non-profit credentials to learn more.',
        },
    ];

    const renderValue = (value: boolean | string, isPopular?: boolean) => {
        if (typeof value === 'boolean') {
            return value ? (
                <CheckIcon className={`h-5 w-5 ${isPopular ? 'text-green-600' : 'text-green-500'} mx-auto`} />
            ) : (
                <XIcon className="mx-auto h-5 w-5 text-gray-300" />
            );
        }
        return <span className={`text-sm ${isPopular ? 'font-medium' : ''}`}>{value}</span>;
    };

    return (
        <LandingLayout breadcrumbs={breadcrumbs}>
            <Head title="Pricing | ERP System" />
            <div className="flex flex-col">
                {/* Hero */}
                <div className="bg-gradient-to-b from-white to-gray-50 py-20 sm:py-28">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl text-center">
                            <div className="bg-primary/10 mb-6 inline-flex items-center rounded-full px-3 py-1">
                                <span className="text-primary text-sm font-medium">Simple & Transparent Pricing</span>
                            </div>
                            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Pick the perfect plan for your business</h1>
                            <p className="mt-6 text-lg leading-8 text-gray-600">
                                Start with a 14-day free trial. No credit card required. Cancel anytime.
                            </p>
                            <div className="mt-10 flex items-center justify-center gap-4">
                                <Button size="lg" asChild>
                                    <Link href="#pricing-plans">
                                        View Plans
                                        <ArrowRightIcon className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                                <Button variant="outline" size="lg" asChild>
                                    <Link href="/contact">Contact Sales</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pricing Tabs */}
                <div id="pricing-plans" className="relative scroll-mt-16 bg-gray-50 py-24 sm:py-32">
                    <div className="absolute inset-0 h-full w-full bg-gradient-to-b from-gray-50 to-white opacity-50"></div>
                    <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto mb-16 max-w-2xl text-center">
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Choose your plan</h2>
                            <p className="mt-4 text-lg text-gray-600">Select the plan that best fits your business needs and scale as you grow.</p>
                        </div>

                        <Tabs defaultValue="plans" className="w-full">
                            <TabsList className="mx-auto mb-12 grid w-full max-w-md grid-cols-2">
                                <TabsTrigger value="plans">Plans Overview</TabsTrigger>
                                <TabsTrigger value="comparison">Feature Comparison</TabsTrigger>
                            </TabsList>

                            <TabsContent value="plans">
                                {/* Billing Cycle Toggle */}
                                <div className="mb-12 flex flex-col items-center justify-center">
                                    <div className="inline-flex items-center rounded-lg border bg-white p-1 shadow-sm">
                                        <button
                                            onClick={() => setBillingCycle('monthly')}
                                            className={`rounded-md px-6 py-2 text-sm font-medium transition-all ${
                                                billingCycle === 'monthly' ? 'bg-primary text-white shadow-sm' : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                        >
                                            Monthly
                                        </button>
                                        <button
                                            onClick={() => setBillingCycle('yearly')}
                                            className={`rounded-md px-6 py-2 text-sm font-medium transition-all ${
                                                billingCycle === 'yearly' ? 'bg-primary text-white shadow-sm' : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                        >
                                            Yearly
                                        </button>
                                    </div>
                                    {billingCycle === 'yearly' && (
                                        <p className="text-primary mt-3 flex items-center text-sm font-medium">
                                            <CheckCircle2Icon className="mr-1 h-4 w-4" />
                                            Save up to 20% with annual billing
                                        </p>
                                    )}
                                </div>

                                {/* Pricing Cards */}
                                <div className="mx-auto grid max-w-lg gap-8 lg:max-w-none lg:grid-cols-3">
                                    {plans.map((plan) => (
                                        <Card
                                            key={plan.name}
                                            className={`overflow-hidden ${
                                                plan.highlight
                                                    ? 'border-primary shadow-primary/10 relative z-10 scale-[1.02] shadow-lg'
                                                    : 'border-border'
                                            }`}
                                        >
                                            {plan.badge && (
                                                <div
                                                    className={`absolute top-0 right-0 ${plan.highlight ? 'bg-primary' : 'bg-gray-800'} rounded-bl-lg px-3 py-1 text-xs font-medium text-white uppercase`}
                                                >
                                                    {plan.badge}
                                                </div>
                                            )}
                                            <CardHeader className={`pt-6 pb-8 ${plan.highlight ? 'bg-primary/5' : ''}`}>
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                                                        <CardDescription className="mt-1">{plan.description}</CardDescription>
                                                    </div>
                                                </div>
                                                <div className="mt-6">
                                                    <div className="flex items-baseline">
                                                        <span className="text-4xl font-bold tracking-tight text-gray-900">
                                                            ${billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                                                        </span>
                                                        <span className="ml-1 text-sm font-medium text-gray-500">
                                                            /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                                                        </span>
                                                    </div>
                                                    {billingCycle === 'yearly' && (
                                                        <div className="mt-1 flex items-center">
                                                            <Badge variant="outline" className="border-green-200 bg-green-50 text-green-600">
                                                                Save ${plan.savings}
                                                            </Badge>
                                                        </div>
                                                    )}
                                                </div>
                                            </CardHeader>
                                            <CardContent className="flex-grow pt-6">
                                                <ul className="space-y-4">
                                                    {plan.features.map((feature) => (
                                                        <li key={feature} className="flex items-start">
                                                            <CheckCircle2Icon className="text-primary mt-0.5 mr-3 h-5 w-5 flex-shrink-0" />
                                                            <span className="text-sm text-gray-700">{feature}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </CardContent>
                                            <CardFooter className="flex flex-col pt-6">
                                                <Link href={plan.ctaLink} className="w-full">
                                                    <Button className="w-full" variant={plan.highlight ? 'default' : 'outline'} size="lg">
                                                        {plan.cta}
                                                    </Button>
                                                </Link>
                                                <p className="mt-4 text-center text-xs text-gray-500">Includes 14-day free trial</p>
                                            </CardFooter>
                                        </Card>
                                    ))}
                                </div>
                            </TabsContent>

                            <TabsContent value="comparison">
                                {/* Billing toggle for comparison table */}
                                <div className="mb-8 flex justify-center">
                                    <div className="inline-flex items-center rounded-lg border bg-white p-1 shadow-sm">
                                        <button
                                            onClick={() => setBillingCycle('monthly')}
                                            className={`rounded-md px-4 py-2 text-sm font-medium transition-all ${
                                                billingCycle === 'monthly' ? 'bg-primary text-white shadow-sm' : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                        >
                                            Monthly
                                        </button>
                                        <button
                                            onClick={() => setBillingCycle('yearly')}
                                            className={`rounded-md px-4 py-2 text-sm font-medium transition-all ${
                                                billingCycle === 'yearly' ? 'bg-primary text-white shadow-sm' : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                        >
                                            Yearly
                                        </button>
                                    </div>
                                </div>

                                <div className="overflow-hidden rounded-xl bg-white shadow">
                                    <Table>
                                        <TableCaption>All plans include a 14-day free trial with no credit card required.</TableCaption>
                                        <TableHeader>
                                            <TableRow className="bg-gray-50">
                                                <TableHead className="w-1/3 pl-6">Feature</TableHead>
                                                <TableHead className="text-center">
                                                    Starter
                                                    <div className="mt-1 text-sm font-normal text-gray-500">
                                                        ${billingCycle === 'monthly' ? plans[0].monthlyPrice : plans[0].yearlyPrice}/
                                                        {billingCycle === 'monthly' ? 'mo' : 'yr'}
                                                    </div>
                                                </TableHead>
                                                <TableHead className="bg-primary/5 border-primary/10 border-x text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        Professional
                                                        <Badge variant="secondary" className="bg-primary text-white">
                                                            Popular
                                                        </Badge>
                                                    </div>
                                                    <div className="mt-1 text-sm font-normal text-gray-500">
                                                        ${billingCycle === 'monthly' ? plans[1].monthlyPrice : plans[1].yearlyPrice}/
                                                        {billingCycle === 'monthly' ? 'mo' : 'yr'}
                                                    </div>
                                                </TableHead>
                                                <TableHead className="text-center">
                                                    Enterprise
                                                    <div className="mt-1 text-sm font-normal text-gray-500">
                                                        ${billingCycle === 'monthly' ? plans[2].monthlyPrice : plans[2].yearlyPrice}/
                                                        {billingCycle === 'monthly' ? 'mo' : 'yr'}
                                                    </div>
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {/* General Features */}
                                            <TableRow className="bg-gray-100">
                                                <TableCell colSpan={4} className="pl-6 font-medium">
                                                    General Features
                                                </TableCell>
                                            </TableRow>
                                            {pricingFeatures.map((feature, index) => (
                                                <TableRow key={index} className={feature.isPopular ? 'bg-gray-50' : undefined}>
                                                    <TableCell className="pl-6">
                                                        <TooltipProvider>
                                                            <Tooltip>
                                                                <TooltipTrigger className="flex items-center text-left">
                                                                    <span className={feature.isPopular ? 'font-medium' : ''}>{feature.name}</span>
                                                                    {feature.isPopular && (
                                                                        <StarIcon className="ml-1.5 h-3 w-3 fill-amber-500 text-amber-500" />
                                                                    )}
                                                                    {feature.description && <HelpCircleIcon className="ml-1 h-4 w-4 text-gray-400" />}
                                                                </TooltipTrigger>
                                                                {feature.description && (
                                                                    <TooltipContent side="right">
                                                                        <p className="w-60">{feature.description}</p>
                                                                    </TooltipContent>
                                                                )}
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    </TableCell>
                                                    <TableCell className="text-center">{renderValue(feature.starter, feature.isPopular)}</TableCell>
                                                    <TableCell className="bg-primary/5 border-primary/10 border-x text-center">
                                                        {renderValue(feature.professional, feature.isPopular)}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        {renderValue(feature.enterprise, feature.isPopular)}
                                                    </TableCell>
                                                </TableRow>
                                            ))}

                                            {/* Modules */}
                                            <TableRow className="bg-gray-100">
                                                <TableCell colSpan={4} className="pl-6 font-medium">
                                                    Available Modules
                                                </TableCell>
                                            </TableRow>
                                            {modules.map((module, index) => (
                                                <TableRow key={index}>
                                                    <TableCell className="pl-6">
                                                        <div className="flex items-center">
                                                            {module.name}
                                                            {module.isNew && (
                                                                <Badge className="ml-2 bg-blue-500 text-white" variant="secondary">
                                                                    New
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-center">{renderValue(module.starter)}</TableCell>
                                                    <TableCell className="bg-primary/5 border-primary/10 border-x text-center">
                                                        {renderValue(module.professional)}
                                                    </TableCell>
                                                    <TableCell className="text-center">{renderValue(module.enterprise)}</TableCell>
                                                </TableRow>
                                            ))}

                                            {/* CTA Row */}
                                            <TableRow>
                                                <TableCell className="pl-6"></TableCell>
                                                <TableCell className="py-4 text-center">
                                                    <Button asChild variant="outline" size="sm">
                                                        <Link href={plans[0].ctaLink}>{plans[0].cta}</Link>
                                                    </Button>
                                                </TableCell>
                                                <TableCell className="bg-primary/5 border-primary/10 border-x py-4 text-center">
                                                    <Button asChild size="sm">
                                                        <Link href={plans[1].ctaLink}>{plans[1].cta}</Link>
                                                    </Button>
                                                </TableCell>
                                                <TableCell className="py-4 text-center">
                                                    <Button asChild variant="outline" size="sm">
                                                        <Link href={plans[2].ctaLink}>{plans[2].cta}</Link>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </div>
                            </TabsContent>
                        </Tabs>

                        <div className="mt-16 text-center">
                            <p className="text-gray-600">
                                Need a custom solution?{' '}
                                <Link href="/contact" className="text-primary font-medium">
                                    Contact our sales team
                                </Link>{' '}
                                for a personalized quote.
                            </p>
                        </div>
                    </div>
                </div>

                {/* FAQs */}
                <div className="bg-white py-24 sm:py-32">
                    <div className="mx-auto max-w-4xl px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl text-center">
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Frequently asked questions</h2>
                            <p className="mt-6 text-lg leading-8 text-gray-600">Find answers to common questions about our pricing and plans.</p>
                        </div>
                        <div className="mt-16">
                            <Accordion type="single" collapsible className="w-full">
                                {pricingFaqs.map((faq, index) => (
                                    <AccordionItem key={index} value={`item-${index}`}>
                                        <AccordionTrigger className="text-left text-lg font-medium">{faq.question}</AccordionTrigger>
                                        <AccordionContent className="text-gray-600">{faq.answer}</AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>
                        <div className="mt-16 flex justify-center">
                            <div className="bg-primary/5 ring-primary/10 relative rounded-2xl p-8 ring-1">
                                <div className="flex items-center gap-4">
                                    <div className="bg-primary/10 rounded-full p-2">
                                        <HelpCircleIcon className="text-primary h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900">Still have questions?</h3>
                                        <p className="mt-1 text-sm text-gray-600">
                                            Can't find the answer you're looking for? Please chat with our friendly team.
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-6 flex justify-end">
                                    <Button asChild>
                                        <Link href="/contact">Contact Support</Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Customer Logos */}
                <div className="bg-gray-50 py-16 sm:py-24">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl text-center">
                            <h2 className="text-lg leading-8 font-semibold text-gray-900">Trusted by businesses worldwide</h2>
                            <p className="mt-2 text-gray-600">Join thousands of companies using our ERP platform</p>
                        </div>
                        <div className="mx-auto mt-10 grid max-w-lg grid-cols-4 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-5">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="flex justify-center">
                                    <div className="h-8 w-32 rounded bg-gray-200"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <CTASection />
            </div>
        </LandingLayout>
    );
}
