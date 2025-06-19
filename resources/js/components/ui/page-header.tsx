import React from 'react';

interface PageHeaderProps {
    title: string;
    description?: string;
    action?: React.ReactNode;
    children?: React.ReactNode;
}

export function PageHeader({ title, description, action, children }: PageHeaderProps) {
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex-1 min-w-0">
                <h1 className="text-lg font-bold sm:text-xl lg:text-2xl truncate">
                    {title}
                </h1>
                {description && (
                    <p className="mt-1 text-sm text-muted-foreground sm:text-base lg:text-sm">
                        {description}
                    </p>
                )}
            </div>
            {(action || children) && (
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2 sm:flex-shrink-0">
                    {action}
                    {children}
                </div>
            )}
        </div>
    );
}
