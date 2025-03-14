// resources/js/Pages/About.jsx
import { CTASection } from '@/components/landing/cta-section';
import { Card, CardContent } from '@/components/ui/card';
import LandingLayout from '@/layouts/landing-layout';
import { Head } from '@inertiajs/react';
import { Award, Briefcase, Clock, Users } from 'lucide-react';

const breadcrumbs = [
    {
        title: 'Home',
        href: '/',
    },
    {
        title: 'About',
        href: '/about',
    },
];

export default function About() {
    const stats = [
        { name: 'Businesses Served', value: '2,500+', icon: <Briefcase className="h-5 w-5" /> },
        { name: 'Years in Business', value: '12+', icon: <Clock className="h-5 w-5" /> },
        { name: 'Team Members', value: '100+', icon: <Users className="h-5 w-5" /> },
        { name: 'Industry Awards', value: '25+', icon: <Award className="h-5 w-5" /> },
    ];

    const team = [
        {
            name: 'Michael Thompson',
            role: 'CEO & Founder',
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
            bio: 'Michael founded the company with a vision to create business software thats both powerful and easy to use. He has 20+ years of experience in enterprise software.',
        },
        {
            name: 'Jennifer Wu',
            role: 'CTO',
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
            bio: 'Jennifer leads our engineering team, focusing on building scalable, secure, and innovative technology. She previously worked at leading tech companies in Silicon Valley.',
        },
        {
            name: 'Robert Johnson',
            role: 'Head of Product',
            image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
            bio: 'Robert ensures our product meets the needs of businesses of all sizes. His user-centered approach has been key to our platforms intuitive design.',
        },
        {
            name: 'Sophia Rodriguez',
            role: 'Customer Success Director',
            image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
            bio: 'Sophia leads our customer success team, ensuring clients get maximum value from our platform. Her team has achieved a 95% client satisfaction rate.',
        },
    ];

    return (
        <LandingLayout breadcrumbs={breadcrumbs}>
            <Head title="About Us | ERP System" />
            <div className="flex flex-col">
                {/* Hero */}
                <div className="relative bg-gray-50 py-16 sm:py-24 lg:py-32">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl text-center">
                            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">About Us</h1>
                            <p className="mt-6 text-lg leading-8 text-gray-600">
                                We're on a mission to make enterprise resource planning accessible, efficient, and scalable for businesses of all
                                sizes.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Our Story */}
                <div className="bg-white py-16 sm:py-24">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
                            <div>
                                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Our Story</h2>
                                <p className="mt-6 text-lg text-gray-600">
                                    Founded in 2010, our company began with a simple idea: enterprise software should be powerful yet easy to use. We
                                    saw businesses struggling with complex, fragmented systems that required extensive training and maintenance.
                                </p>
                                <p className="mt-4 text-lg text-gray-600">
                                    We set out to build a unified platform that would scale with businesses as they grow, while keeping the user
                                    experience intuitive and accessible. Our modular approach allows businesses to start with what they need and
                                    expand over time.
                                </p>
                                <p className="mt-4 text-lg text-gray-600">
                                    Today, our ERP platform serves thousands of businesses worldwide, from startups to large enterprises, helping them
                                    streamline operations, make better decisions, and drive growth.
                                </p>
                            </div>
                            <div className="relative">
                                <img
                                    className="rounded-lg shadow-lg"
                                    src="https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&h=900&q=80"
                                    alt="Our team at work"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="bg-primary">
                    <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
                        <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
                            {stats.map((stat) => (
                                <div key={stat.name} className="text-center">
                                    <div className="mt-2 flex items-center justify-center">
                                        <span className="rounded-full bg-white/20 p-3 text-white">{stat.icon}</span>
                                    </div>
                                    <p className="mt-4 text-3xl font-bold tracking-tight text-white">{stat.value}</p>
                                    <p className="text-base leading-7 text-white">{stat.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Values */}
                <div className="bg-white py-16 sm:py-24">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl lg:text-center">
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Our Values</h2>
                            <p className="mt-6 text-lg leading-8 text-gray-600">
                                These core principles guide everything we do, from product development to customer support.
                            </p>
                        </div>
                        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
                            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
                                {[
                                    {
                                        name: 'Customer Success',
                                        description:
                                            'We succeed when our customers succeed. Every decision we make is focused on delivering value to the businesses we serve.',
                                    },
                                    {
                                        name: 'Innovation',
                                        description:
                                            'We continually push the boundaries of whats possible in business software, embracing new technologies to solve complex problems.',
                                    },
                                    {
                                        name: 'Simplicity',
                                        description:
                                            'We believe powerful software doesnt have to be complicated. We strive for elegant solutions that are easy to use.',
                                    },
                                    {
                                        name: 'Security & Trust',
                                        description:
                                            'We treat our customers data with the utmost care, implementing rigorous security measures and transparent practices.',
                                    },
                                ].map((value) => (
                                    <div key={value.name} className="relative pl-16">
                                        <dt className="text-base leading-7 font-semibold text-gray-900">
                                            <div className="bg-primary absolute top-0 left-0 flex h-10 w-10 items-center justify-center rounded-lg">
                                                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            {value.name}
                                        </dt>
                                        <dd className="mt-2 text-base leading-7 text-gray-600">{value.description}</dd>
                                    </div>
                                ))}
                            </dl>
                        </div>
                    </div>
                </div>

                {/* Team */}
                <div className="bg-gray-50 py-16 sm:py-24">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl lg:text-center">
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Our Leadership Team</h2>
                            <p className="mt-6 text-lg leading-8 text-gray-600">
                                Meet the people driving our vision forward and ensuring we deliver exceptional value to our customers.
                            </p>
                        </div>
                        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-4">
                            {team.map((person) => (
                                <Card key={person.name} className="border-0 shadow-md">
                                    <CardContent className="flex flex-col items-center p-6 text-center">
                                        <img className="h-32 w-32 rounded-full" src={person.image} alt={person.name} />
                                        <h3 className="mt-6 text-lg leading-8 font-semibold text-gray-900">{person.name}</h3>
                                        <p className="text-primary text-base leading-7">{person.role}</p>
                                        <p className="mt-4 text-sm leading-6 text-gray-600">{person.bio}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>

                <CTASection />
            </div>
        </LandingLayout>
    );
}
