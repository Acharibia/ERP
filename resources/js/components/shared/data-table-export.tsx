'use client';

import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { Table } from '@tanstack/react-table';
import { Download, FileSpreadsheet, FileText, Loader2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

interface DataTableExportProps<TData> {
    table: Table<TData>;
    dataTableClass: string;
    onExport?: (format: string) => Promise<void>;
    fileName?: string; // Optional file name for the export
}

export function DataTableExport<TData>({ table, dataTableClass, onExport, fileName }: DataTableExportProps<TData>) {
    const [isExporting, setIsExporting] = useState<string | null>(null);

    const handleExport = async (format: 'csv' | 'excel' | 'pdf') => {
        try {
            setIsExporting(format);

            // If onExport prop is provided, use the new route-based system
            if (onExport) {
                await onExport(format);
                toast.success(`Your data has been exported as ${format.toUpperCase()}`);
                return;
            }

            // Fallback to original behavior for backward compatibility
            // Get the current table state
            const { columnFilters, globalFilter, sorting } = table.getState();

            // Map format to the correct file extension
            const extensionMap = {
                csv: 'csv',
                excel: 'xlsx',
                pdf: 'pdf',
            };

            const fileExtension = extensionMap[format];

            // Prepare the export parameters
            const params = new URLSearchParams({
                format,
                class: dataTableClass,
                fileName: fileName ?? dataTableClass,
                globalFilter: globalFilter || '',
                filters: JSON.stringify(Object.fromEntries(columnFilters.map((filter) => [filter.id, filter.value]))),
                sort: JSON.stringify(sorting),
                columns: JSON.stringify(
                    table
                        .getAllColumns()
                        .filter((column) => column.getIsVisible())
                        .map((column) => column.id),
                ),
            });

            const exportUrl = `/datatable/export?${params.toString()}`;

            // Use fetch to download the file
            const response = await fetch(exportUrl, {
                method: 'GET',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });

            if (!response.ok) {
                throw new Error(`Export failed: ${response.status} ${response.statusText}`);
            }

            // Create a blob from the response and download it
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;

            // Use the correct file extension
            link.setAttribute('download', `export-${format}-${Date.now()}.${fileExtension}`);

            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();

            // Clean up
            window.URL.revokeObjectURL(url);
            document.body.removeChild(link);

            // Use toast with proper string formatting, not object
            toast.success(`Your data has been exported as ${format.toUpperCase()}`);
        } catch (error) {
            console.error('Export error:', error);
            // Use toast.error for error messages
            toast.error('There was an error exporting your data.');
        } finally {
            setIsExporting(null);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="ml-auto h-8">
                    <Download />
                    <span className="sr-only sm:not-sr-only">Export</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[150px]">
                <DropdownMenuLabel>Export as</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleExport('csv')} disabled={!!isExporting} className="cursor-pointer">
                    {isExporting === 'csv' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
                    CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('excel')} disabled={!!isExporting} className="cursor-pointer">
                    {isExporting === 'excel' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileSpreadsheet className="mr-2 h-4 w-4" />}
                    Excel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('pdf')} disabled={!!isExporting} className="cursor-pointer">
                    {isExporting === 'pdf' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
                    PDF
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
