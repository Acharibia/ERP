import { Button } from '@/components/ui/button';
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
        <div className={cn('flex flex-col items-center justify-center p-8 text-center', className)}>
            {/* Visual - Image or Icon */}
            <div className="mb-1">
                {image ? (
                    <img src={image} alt={imageAlt} className={cn('object-contain', imageSize)} />
                ) : IconComponent ? (
                    <IconComponent className={cn('text-muted-foreground', iconSize)} />
                ) : null}
            </div>

            {/* Content */}
            <div className="mb-6 max-w-md">
                <h3 className="mb-2 text-lg font-semibold">{title}</h3>
                <p className="text-muted-foreground text-sm">{description}</p>
            </div>

            {/* Actions */}
            {(primaryAction || secondaryAction) && (
                <div className="flex gap-3">
                    {primaryAction && <Button onClick={primaryAction.onClick}>{primaryAction.label}</Button>}
                    {secondaryAction && (
                        <Button variant="outline" onClick={secondaryAction.onClick}>
                            {secondaryAction.label}
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}
