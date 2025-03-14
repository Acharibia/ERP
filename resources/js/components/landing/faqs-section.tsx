// resources/js/components/landing/faqs-section.tsx
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Link } from '@inertiajs/react';

export const FAQSection = () => {
    const faqs = [
        {
            question: 'What is a multi-tenant ERP system?',
            answer: 'A multi-tenant ERP system allows multiple businesses (tenants) to use the same application while keeping their data completely separate and secure. Our platform enables resellers to manage multiple client businesses through a single interface while ensuring complete data isolation.',
        },
        {
            question: 'How secure is the platform?',
            answer: 'Security is our top priority. We implement separate database instances for each client, robust access controls, comprehensive audit logging, data encryption at rest and in transit, and regular security assessments. Our platform is designed to meet the highest security standards.',
        },
        {
            question: 'Can I customize the system for my business needs?',
            answer: 'Absolutely! Our modular architecture allows you to select only the components your business needs. Additionally, you can customize workflows, fields, reports, and dashboards to match your specific business processes.',
        },
        {
            question: 'How does the pricing work?',
            answer: 'We offer subscription-based pricing with different plans based on the modules you need and the number of users. You can start with a basic package and add more modules as your business grows. Contact us for custom enterprise pricing.',
        },
        {
            question: 'Is there a free trial available?',
            answer: 'Yes, we offer a 14-day free trial that gives you access to all features. No credit card is required to start your trial.',
        },
        {
            question: 'What kind of support do you provide?',
            answer: 'We offer different levels of support based on your subscription plan, ranging from email support to 24/7 phone support with a dedicated account manager for enterprise customers. All customers have access to our comprehensive knowledge base and documentation.',
        },
    ];

    return (
        <div className="bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-primary text-lg leading-8 font-semibold">FAQ</h2>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Frequently asked questions</p>
                    <p className="mt-6 text-lg leading-8 text-gray-600">Find answers to common questions about our ERP platform.</p>
                </div>
                <div className="mx-auto mt-16 max-w-2xl">
                    <Accordion type="single" collapsible className="w-full">
                        {faqs.map((faq, index) => (
                            <AccordionItem key={index} value={`item-${index}`}>
                                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                                <AccordionContent className="text-gray-600">{faq.answer}</AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
                <div className="mt-16 text-center">
                    <p className="text-gray-600">
                        Have more questions? Check our{' '}
                        <Link href="/faq" className="text-primary font-medium">
                            complete FAQ
                        </Link>{' '}
                        or{' '}
                        <Link href="/contact" className="text-primary font-medium">
                            contact our support team
                        </Link>
                        .
                    </p>
                </div>
            </div>
        </div>
    );
};
