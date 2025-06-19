import { Skeleton } from '@/components/ui/skeleton';
import { TableCell, TableRow } from '@/components/ui/table';

interface TableLoadingProps {
    columnCount: number;
    rowCount?: number;
    type?: 'skeleton' | 'spinner';
    message?: string;
}

export function TableLoading({ columnCount, rowCount = 5, type = 'skeleton', message = 'Loading...' }: TableLoadingProps) {
    if (type === 'spinner') {
        return (
            <TableRow>
                <TableCell colSpan={columnCount} className="h-24 text-center">
                    <div className="flex items-center justify-center space-x-2">
                        <div className="border-primary h-4 w-4 animate-spin rounded-full border-b-2"></div>
                        <span className="text-muted-foreground">{message}</span>
                    </div>
                </TableCell>
            </TableRow>
        );
    }

    // Skeleton type (default)
    return (
        <>
            {Array.from({ length: rowCount }).map((_, rowIndex) => (
                <TableRow key={`skeleton-${rowIndex}`} className="hover:bg-transparent">
                    {Array.from({ length: columnCount }).map((_, cellIndex) => {
                        // Dynamic width based on column position
                        let width = '100%';
                        if (cellIndex === 0) {
                            width = Math.random() > 0.5 ? '80%' : '60%'; // First column (names, IDs)
                        } else if (cellIndex === columnCount - 1) {
                            width = '40px'; // Last column (usually actions)
                        } else {
                            width = Math.random() > 0.5 ? '70%' : '90%'; // Middle columns
                        }

                        return (
                            <TableCell key={`skeleton-cell-${cellIndex}`} className="py-4">
                                <Skeleton className="h-4" style={{ width }} />
                            </TableCell>
                        );
                    })}
                </TableRow>
            ))}
        </>
    );
}
