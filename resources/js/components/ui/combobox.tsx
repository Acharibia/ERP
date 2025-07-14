"use client";
import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ComboboxProps<
  T extends Record<string, unknown>,
  K extends keyof T = keyof T
> {
  options: T[];
  value: T[K] | ""; // ✅ allows empty
  onChange: (value: T[K] | "") => void;
  optionValue?: K;
  optionLabel?: K;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  className?: string;
}

export function Combobox<
  T extends Record<string, unknown>,
  K extends keyof T = keyof T
>({
  options = [],
  value,
  onChange,
  optionValue = "value" as K,
  optionLabel = "label" as K,
  placeholder = "Select an option...",
  searchPlaceholder = "Search...",
  emptyMessage = "No option found.",
  disabled = false,
  className,
}: ComboboxProps<T, K>) {
  const [open, setOpen] = React.useState(false);

  const selectedOption = React.useMemo(
    () =>
      options.find(
        (option) => String(option[optionValue]) === String(value)
      ),
    [options, value, optionValue]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between border", className)}
          disabled={disabled}
        >
          {selectedOption ? String(selectedOption[optionLabel]) : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command>
          <CommandInput placeholder={searchPlaceholder} className="h-9" />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {options.map((option, index) => {
                const optionValueStr = String(option[optionValue]);
                const optionLabelStr = String(option[optionLabel]);

                return (
                  <CommandItem
                    key={index}
                    value={optionLabelStr}
                    onSelect={() => {
                      const newValue =
                        optionValueStr === String(value)
                          ? ""
                          : option[optionValue];
                      onChange(newValue as T[K] | "");
                      setOpen(false);
                    }}
                  >
                    {optionLabelStr}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        String(value) === optionValueStr
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
