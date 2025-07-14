'use client';

import { Card, CardContent } from '@/components/ui/card';
import { BaseRowData, DataTableColumn } from '@/types/data-table';
import { Row } from '@tanstack/react-table';
import * as lucideIcons from 'lucide-react';
import { EmptyState } from '../empty-state';
import { ActionsColumn } from './actions-column';
import { BadgeColumn } from './badge-column';
import { SelectColumn } from './select-column';

interface MobileDataTableProps<T extends BaseRowData> {
    rows: Row<T>[];
    onRowClick?: (row: T) => void;
    onAction?: (action: string, row: T) => void;
}

export function MobileDataTable<T extends BaseRowData>({ rows, onRowClick, onAction }: MobileDataTableProps<T>) {
    if (!rows.length) {
        return (
            <EmptyState
                icon={lucideIcons.Search}
                iconSize="h-12 w-12"
                title="No results found"
                description="Try adjusting your search or filter criteria to find what you're looking for."
            />
        );
    }

    return (
        <div className="space-y-4 sm:hidden">
            {rows.map((row) => {
                const visibleCells = row.getVisibleCells();
                const actionCell = visibleCells.find((cell) => (cell.column.columnDef.meta as DataTableColumn)?.type === 'actions');
                const checkboxCell = visibleCells.find((cell) => (cell.column.columnDef.meta as DataTableColumn)?.type === 'checkbox');
                const contentCells = visibleCells.filter((cell) => {
                    const type = (cell.column.columnDef.meta as DataTableColumn | undefined)?.type;
                    return type !== 'actions' && type !== 'checkbox';
                });

                return (
                    <Card
                        key={row.id}
                        data-state={row.getIsSelected() && 'selected'}
                        onClick={() => onRowClick?.(row.original)}
                        className={`hover:bg-muted/50 cursor-pointer border shadow-sm transition ${row.getIsSelected() ? 'bg-muted/50' : ''}`}
                    >
                        <CardContent>
                            {(checkboxCell || actionCell) && (
                                <div className="flex items-center justify-between">
                                    {checkboxCell && <SelectColumn checked={row.getIsSelected()} onChange={() => row.toggleSelected()} />}
                                    {actionCell && (
                                        <ActionsColumn
                                            actions={Array.isArray(row.original.actions) ? row.original.actions : []}
                                            rowData={row.original}
                                            onAction={onAction ?? (() => {})}
                                        />
                                    )}
                                </div>
                            )}

                            <div className="space-y-2">
                                {contentCells.map((cell) => {
                                    const meta = cell.column.columnDef.meta as DataTableColumn | undefined;
                                    const value = cell.getValue();

                                    let content;
                                    switch (meta?.type) {
                                        case 'badge':
                                            content = <BadgeColumn value={String(value)} config={meta.badgeConfig ?? {}} />;
                                            break;
                                        default:
                                            content =
                                                typeof value === 'object' || value === undefined || value === null || value === ''
                                                    ? '--'
                                                    : String(value);
                                    }

                                    return (
                                        <div key={cell.id} className="flex justify-between gap-4 text-sm">
                                            <span className="text-muted-foreground font-medium">{meta?.title ?? cell.column.id}</span>
                                            <span className="text-right break-words">{content}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
