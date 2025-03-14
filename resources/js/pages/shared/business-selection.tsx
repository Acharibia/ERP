import { router } from '@inertiajs/react';
import { Briefcase } from 'lucide-react';
import { useState } from 'react';

import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import AccessLayout from '@/layouts/access-layout';
import { cn } from '@/lib/utils';

interface BusinessSelectionProps {
    businesses: Array<{
        id: number;
        name: string;
        description?: string;
        industry?: string;
    }>;
}

export default function BusinessSelection({ businesses }: BusinessSelectionProps) {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);

    // Function to handle card selection
    const handleSelectBusiness = (businessId: string) => {
        setSelectedId(businessId);
        setProcessing(true);

        // Use Inertia router directly with properly typed data
        router.post(
            route('business.select'),
            { business_id: businessId },
            {
                onError: (errors) => {
                    setError(errors.business_id);
                    setProcessing(false);
                },
                onFinish: () => {
                    setProcessing(false);
                },
            },
        );
    };

    // Generate a simple color based on business name for visual variety
    const getBusinessColor = (name: string) => {
        const colors = [
            'bg-blue-50 text-blue-700',
            'bg-green-50 text-green-700',
            'bg-purple-50 text-purple-700',
            'bg-amber-50 text-amber-700',
            'bg-rose-50 text-rose-700',
            'bg-cyan-50 text-cyan-700',
        ];
        const index = name.charCodeAt(0) % colors.length;
        return colors[index];
    };

    // Get initials from business name
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((word) => word[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    return (
        <AccessLayout title="Select a Business" description="Choose a business to access">
            <div className="w-full max-w-4xl">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {businesses.map((business) => {
                        const isSelected = selectedId === String(business.id);
                        const colorClass = getBusinessColor(business.name);

                        return (
                            <Card
                                key={business.id}
                                className={cn(
                                    'h-full cursor-pointer transition-all duration-150',
                                    isSelected ? 'border-primary shadow-md' : 'hover:border-primary/50 hover:shadow-sm',
                                    processing && 'pointer-events-none opacity-70',
                                )}
                                onClick={() => handleSelectBusiness(String(business.id))}
                            >
                                <CardContent className="flex h-full flex-col items-center p-4 text-center">
                                    <div className={cn('mb-3 flex h-14 w-14 items-center justify-center rounded-full', colorClass)}>
                                        {getInitials(business.name)}
                                    </div>
                                    <div className="w-full">
                                        <h3 className="truncate font-medium">{business.name}</h3>
                                        {business.industry && (
                                            <Badge variant="outline" className="mt-2 font-normal">
                                                <Briefcase className="mr-1 h-3 w-3" />
                                                {business.industry}
                                            </Badge>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {error && <InputError message={error} className="mt-4 text-center" />}
            </div>
        </AccessLayout>
    );
}
