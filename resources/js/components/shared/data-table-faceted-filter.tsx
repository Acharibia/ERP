import { Column } from '@tanstack/react-table';
import * as LucideIcons from 'lucide-react';
import { Check, Filter } from 'lucide-react';
import * as React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

type LucideIcon = React.ComponentType<{ className?: string; size?: number | string }>;

interface FilterOption {
    label: string;
    value: string;
    icon?: string;
}

interface DataTableFacetedFilterProps<TData, TValue> {
    column?: Column<TData, TValue>;
    title?: string;
    options: FilterOption[] | unknown;
    onRefresh?: () => Promise<void>;
}

// Helper type for option processing
interface RawOption {
    label?: string;
    value?: string | number;
    icon?: string;
}

// Fixed icon component lookup - icons are objects, not functions!
const getIconComponent = (iconName?: string): LucideIcon | null => {
    if (!iconName || typeof iconName !== 'string') {
        return null;
    }

    // Access the icon from LucideIcons using bracket notation
    const IconComponent = (LucideIcons as Record<string, unknown>)[iconName];

    // Check if it exists (it can be an object or function for React components)
    if (IconComponent && (typeof IconComponent === 'function' || typeof IconComponent === 'object')) {
        // Test if it's a valid React component by checking if it has typical React component properties
        if (
            (IconComponent as Record<string, unknown>).$$typeof ||
            (IconComponent as Record<string, unknown>).render ||
            typeof IconComponent === 'function'
        ) {
            return IconComponent as LucideIcon;
        }
    }

    return null;
};

export function DataTableFacetedFilter<TData, TValue>({ column, title = 'Filter', options }: DataTableFacetedFilterProps<TData, TValue>) {
    // All hooks must be called before any early returns
    const facets = column?.getFacetedUniqueValues();

    // Local state to track selected values for immediate UI feedback
    const [localSelectedValues, setLocalSelectedValues] = React.useState<Set<string>>(new Set());

    // Get current filter value from column
    const columnFilterValue = column?.getFilterValue();

    // Sync local state with column filter value
    React.useEffect(() => {
        const filterValue = Array.isArray(columnFilterValue) ? (columnFilterValue as string[]) : [];
        setLocalSelectedValues(new Set(filterValue));
    }, [columnFilterValue]);

    const processedOptions = React.useMemo((): FilterOption[] => {
        if (!options) return [];

        // Handle array of options
        if (Array.isArray(options)) {
            return options.map((option: RawOption | string | number) => {
                // Handle different option formats
                if (typeof option === 'object' && option !== null) {
                    return {
                        label: option.label || String(option.value || ''),
                        value: String(option.value || ''),
                        icon: option.icon || undefined,
                    };
                } else {
                    // Handle primitive values
                    return {
                        label: String(option),
                        value: String(option),
                        icon: undefined,
                    };
                }
            });
        }

        // Handle object or other types - convert to empty array
        return [];
    }, [options]);

    const handleFilterChange = React.useCallback(
        (value: string) => {
            if (!column) return;

            const newSelectedValues = new Set(localSelectedValues);

            if (newSelectedValues.has(value)) {
                newSelectedValues.delete(value);
            } else {
                newSelectedValues.add(value);
            }

            // Update local state immediately for UI feedback
            setLocalSelectedValues(newSelectedValues);

            const filterValues = Array.from(newSelectedValues);

            // Set column filter value
            column.setFilterValue(filterValues.length > 0 ? filterValues : undefined);
        },
        [column, localSelectedValues],
    );

    const handleClearFilters = React.useCallback(() => {
        if (!column) return;

        setLocalSelectedValues(new Set());
        column.setFilterValue(undefined);
    }, [column]);

    // Early returns after all hooks are called
    if (!column) {
        return null;
    }

    // Don't render if no options available
    if (processedOptions.length === 0) {
        return null;
    }

    const selectedCount = localSelectedValues.size;
    const hasSelections = selectedCount > 0;

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 justify-start border-dashed">
                    <Filter className="mr-2 h-4 w-4" />
                    {title}
                    {hasSelections && (
                        <>
                            <Separator orientation="vertical" className="mx-2 h-4" />
                            <Badge variant="secondary" className="rounded-sm px-1 font-normal lg:hidden">
                                {selectedCount}
                            </Badge>
                            <div className="hidden space-x-1 lg:flex">
                                {selectedCount > 2 ? (
                                    <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                                        {selectedCount} selected
                                    </Badge>
                                ) : (
                                    processedOptions
                                        .filter((option) => localSelectedValues.has(option.value))
                                        .map((option) => (
                                            <Badge variant="secondary" key={option.value} className="rounded-sm px-1 font-normal">
                                                {option.label}
                                            </Badge>
                                        ))
                                )}
                            </div>
                        </>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0" align="start">
                <Command>
                    <CommandInput placeholder={`Filter ${title.toLowerCase()}...`} />
                    <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup>
                            {processedOptions.map((option) => {
                                const isSelected = localSelectedValues.has(option.value);
                                const IconComponent = getIconComponent(option.icon);
                                const facetCount = facets?.get(option.value);

                                return (
                                    <CommandItem key={option.value} onSelect={() => handleFilterChange(option.value)} className="cursor-pointer">
                                        <div
                                            className={cn(
                                                'border-primary mr-2 flex h-4 w-4 items-center justify-center rounded-sm border',
                                                isSelected ? 'bg-primary text-primary-foreground' : 'opacity-50 [&_svg]:invisible',
                                            )}
                                        >
                                            <Check className="h-3 w-3" />
                                        </div>
                                        {IconComponent && <IconComponent className="text-muted-foreground mr-2 h-4 w-4" />}
                                        <span className="flex-1">{option.label}</span>
                                        {facetCount && facetCount > 0 && (
                                            <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">{facetCount}</span>
                                        )}
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>

                        {hasSelections && (
                            <>
                                <CommandSeparator />
                                <CommandGroup>
                                    <CommandItem onSelect={handleClearFilters} className="cursor-pointer justify-center text-center">
                                        <LucideIcons.Trash2 className="h-3 w-3" /> Clear filters
                                    </CommandItem>
                                </CommandGroup>
                            </>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
