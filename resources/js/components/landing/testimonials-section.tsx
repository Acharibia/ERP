// resources/js/components/landing/testimonials-section.tsx
import { Building2, Quote, Star } from 'lucide-react';

export const TestimonialsSection = () => {
    const testimonials = [
        {
            content:
                'This ERP system transformed how we manage our client relationships. The multi-tenant architecture gives us confidence in data security while the modular approach lets us customize solutions for each client.',
            author: 'Sarah Johnson',
            role: 'CEO, TechSolutions Inc.',
            rating: 5,
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
            company: 'TechSolutions Inc.',
            industry: 'IT Services',
        },
        {
            content:
                "The platform's flexibility is impressive. We started with basic modules and added more as we grew. The seamless integration between components saves us countless hours every month.",
            author: 'David Chen',
            role: 'Operations Director, Global Enterprises',
            rating: 5,
            image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
            company: 'Global Enterprises',
            industry: 'Manufacturing',
        },
        {
            content:
                'As a reseller, this platform has been a game-changer. The white-labeling options and commission tracking make it easy to grow our business while providing exceptional value to clients.',
            author: 'Maria Garcia',
            role: 'Founder, BusinessTech Solutions',
            rating: 5,
            image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
            company: 'BusinessTech Solutions',
            industry: 'Consulting',
        },
    ];

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`} />
        ));
    };

    return (
        <section className="relative overflow-hidden bg-white py-24 sm:py-32 dark:bg-slate-900">
            {/* Background decorative elements */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <div className="bg-primary/5 absolute bottom-0 -left-40 h-96 w-96 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 right-1/4 h-64 w-64 rounded-full bg-blue-500/5 blur-3xl"></div>
            </div>

            <div className="relative z-10 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto text-center">
                    <div className="bg-primary/10 text-primary inline-flex items-center rounded-full px-3 py-1 text-sm font-medium">
                        <span className="bg-primary mr-1.5 flex h-2 w-2 rounded-full"></span>
                        Success Stories
                    </div>

                    <h2 className="mt-6 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
                        Trusted by businesses worldwide
                    </h2>

                    <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
                        Hear what our customers have to say about their experience with our ERP platform and how it has transformed their operations.
                    </p>
                </div>

                <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className="relative flex flex-col rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                        >
                            <div className="bg-primary/10 text-primary absolute -top-3 -right-3 rounded-full p-3">
                                <Quote className="h-5 w-5" />
                            </div>

                            <div className="mb-4 flex">{renderStars(testimonial.rating)}</div>

                            <p className="flex-grow text-slate-700 dark:text-slate-300">"{testimonial.content}"</p>

                            <div className="mt-8 border-t border-slate-100 pt-6 dark:border-slate-800">
                                <div className="flex items-center">
                                    <img
                                        src={testimonial.image}
                                        alt={testimonial.author}
                                        className="h-12 w-12 rounded-full border-2 border-white object-cover shadow-sm dark:border-slate-800"
                                    />
                                    <div className="ml-4">
                                        <h3 className="font-semibold text-slate-900 dark:text-white">{testimonial.author}</h3>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">{testimonial.role}</p>
                                    </div>
                                </div>

                                <div className="mt-4 flex items-center text-sm text-slate-500 dark:text-slate-400">
                                    <Building2 className="mr-1 h-4 w-4" />
                                    <span>{testimonial.company}</span>
                                    <span className="mx-2">•</span>
                                    <span>{testimonial.industry}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>


            </div>
        </section>
    );
};
