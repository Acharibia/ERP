// components/shared/data-table/data-table-error.tsx

import { Button } from '@/components/ui/button';
import * as lucideIcons from 'lucide-react';

type Props = {
    message: string;
    onRetry: () => void;
};

export function DataTableError({ message, onRetry }: Props) {
    return (
        <div className="space-y-4">
            <div className="p-8 text-center">
                <div className="text-red-500">
                    <lucideIcons.AlertCircle className="mx-auto mb-2 h-8 w-8" />
                    <p className="font-medium">Error loading table</p>
                    <p className="text-muted-foreground mt-1 text-sm">{message}</p>
                    <Button variant="outline" size="sm" onClick={onRetry} className="mt-4">
                        <lucideIcons.RefreshCw className="mr-2 h-4 w-4" />
                        Retry
                    </Button>
                </div>
            </div>
        </div>
    );
}
