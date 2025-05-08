"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface ComboboxProps<T extends Record<string, U>, U = unknown> {
  options: T[];
  value: T[keyof T];
  onChange: (value: T[keyof T] | "") => void;
  optionValue?: keyof T;
  optionLabel?: keyof T;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  className?: string;
}

export function Combobox<T extends Record<string, unknown>>({
  options = [],
  value,
  onChange,
  optionValue = "value" as keyof T,
  optionLabel = "label" as keyof T,
  placeholder = "Select an option...",
  searchPlaceholder = "Search...",
  emptyMessage = "No option found.",
  disabled = false,
  className
}: ComboboxProps<T>) {
  const [open, setOpen] = React.useState(false)

  // Find the selected option
  const selectedOption = React.useMemo(() =>
    options?.find(option => String(option[optionValue]) === String(value)),
    [options, value, optionValue]
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
          disabled={disabled}
        >
          {selectedOption ? String(selectedOption[optionLabel]) : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder={searchPlaceholder} className="h-9" />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {options?.map((option, index) => (
                <CommandItem
                  key={index}
                  value={String(option[optionValue])}
                  onSelect={(currentValue) => {
                    onChange(currentValue === String(value) ? "" : (currentValue as T[keyof T]))
                    setOpen(false)
                  }}
                >
                  {String(option[optionLabel])}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      String(value) === String(option[optionValue]) ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
