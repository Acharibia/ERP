import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
    // Visual
    image?: string;
    imageAlt?: string;
    imageSize?: string; // Tailwind classes like "h-32 w-32" or "h-40 w-40"
    icon?: LucideIcon;
    iconSize?: string; // Tailwind classes like "h-16 w-16" or "h-12 w-12"

    // Content
    title: string;
    description: string;

    // Actions
    primaryAction?: {
        label: string;
        onClick: () => void;
    };
    secondaryAction?: {
        label: string;
        onClick: () => void;
    };

    // Styling
    className?: string;
}

export function EmptyState({
    image,
    imageAlt = 'Empty state',
    imageSize = 'h-32 w-32',
    icon,
    iconSize = 'h-16 w-16',
    title,
    description,
    primaryAction,
    secondaryAction,
    className,
}: EmptyStateProps) {
    const IconComponent = icon;

    return (
        <Card className={cn('flex flex-col items-center justify-center text-center', className)}>
            <CardHeader className="flex flex-col items-center justify-center gap-2 p-6">
                {/* Visual - Image or Icon */}
                {image ? (
                    <img src={image} alt={imageAlt} className={cn('object-contain', imageSize)} />
                ) : IconComponent ? (
                    <IconComponent className={cn('text-muted-foreground', iconSize)} />
                ) : null}
                <CardTitle className="mt-2 text-lg font-semibold">{title}</CardTitle>
                <CardDescription className="text-muted-foreground text-sm">{description}</CardDescription>
            </CardHeader>
            {(primaryAction || secondaryAction) && (
                <CardFooter className="flex gap-3 pb-6">
                    {primaryAction && <Button onClick={primaryAction.onClick}>{primaryAction.label}</Button>}
                    {secondaryAction && (
                        <Button variant="outline" onClick={secondaryAction.onClick}>
                            {secondaryAction.label}
                        </Button>
                    )}
                </CardFooter>
            )}
        </Card>
    );
}
