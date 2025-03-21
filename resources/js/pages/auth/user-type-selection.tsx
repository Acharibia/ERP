import { Head, router } from '@inertiajs/react';
import { Briefcase, Building2, Users } from 'lucide-react';
import { useState } from 'react';

import TextLink from '@/components/text-link';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import AuthLayout from '@/layouts/auth-layout';

export default function UserTypeSelection() {
    const [selectedType, setSelectedType] = useState<string | null>(null);

    const userTypes = [
        {
            id: 'reseller',
            name: 'Reseller',
            description: 'Register as a reseller to onboard and manage multiple client businesses',
            icon: <Building2 className="h-10 w-10" />,
            route: route('register.reseller'),
        },
        {
            id: 'business',
            name: 'Business',
            description: 'Register as a business to access ERP modules for your operations',
            icon: <Briefcase className="h-10 w-10" />,
            route: route('register.business'),
        },
        {
            id: 'investor',
            name: 'Investor',
            description: 'Register as an investor to connect with businesses and manage investments',
            icon: <Users className="h-10 w-10" />,
            route: route('register.investor'),
        },
    ];

    const handleCardClick = (typeId: string) => {
        setSelectedType(typeId);
        const selectedUserType = userTypes.find((type) => type.id === typeId);
        if (selectedUserType) {
            // Use Inertia's router.visit instead of window.location
            router.visit(selectedUserType.route);
        }
    };

    return (
        <AuthLayout title="Choose Account Type" description="Select the type of account you wish to create">
            <Head title="Select Account Type" />

            <div className="flex max-w-[50rem] flex-col gap-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {userTypes.map((type) => (
                        <Card
                            key={type.id}
                            className={`h-full w-full cursor-pointer border-2 transition-all ${
                                selectedType === type.id ? 'border-primary' : 'border-border hover:border-muted-foreground/50'
                            }`}
                            onClick={() => handleCardClick(type.id)}
                        >
                            <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
                                <div
                                    className={`rounded-full p-4 ${
                                        selectedType === type.id ? 'text-primary bg-primary/10' : 'text-muted-foreground bg-muted'
                                    }`}
                                >
                                    {type.icon}
                                </div>
                                <div>
                                    <CardTitle className="text-lg">{type.name}</CardTitle>
                                    <CardDescription className="mt-2 text-sm">{type.description}</CardDescription>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="text-muted-foreground text-center text-sm">
                    Already have an account? <TextLink href={route('login')}>Log in</TextLink>
                </div>
            </div>
        </AuthLayout>
    );
}
