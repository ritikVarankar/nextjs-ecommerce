'use client'
import * as React from "react";
import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { CheckIcon, ChevronDown, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  options: SelectOption[];
  selected: string[] | string | null;
  setSelected: (value: string[] | string | null) => void;
  placeholder?: string;
  isMulti?: boolean;
}

function Select({
  options,
  selected,
  setSelected,
  placeholder = "Select options",
  isMulti = false,
}: SelectProps) {
  const [open, setOpen] = useState(false);

  const handleSelect = (option: SelectOption) => {
    if (isMulti) {
      if (Array.isArray(selected) && selected.includes(option.value)) {
        setSelected(selected.filter((s) => s !== option.value));
      } else {
        setSelected([...(Array.isArray(selected) ? selected : []), option.value]);
      }
    } else {
      setSelected(option.value);
      setOpen(false);
    }
  };

  const handleRemove = (value: string) => {
    if (Array.isArray(selected)) {
      setSelected(selected.filter((s) => s !== value));
    }
  };

  const handleClearAll = () => {
    setSelected(isMulti ? [] : null);
  };

  const isSelected =
    isMulti && Array.isArray(selected)
      ? selected.length > 0
      : typeof selected === "string" && selected !== null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="w-full" asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between dark:bg-card"
        >
          <div>
            {isMulti && Array.isArray(selected) && selected.length > 0 ? (
              selected.map((value) => {
                const option = options.find((o) => o.value === value);
                return (
                  <Badge key={value} className="me-2">
                    {option?.label}
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(value);
                      }}
                    >
                      <XIcon className="ml-2 h-4 w-4 cursor-pointer" />
                    </span>
                  </Badge>
                );
              })
            ) : selected ? (
              options.find((o) => o.value === selected)?.label
            ) : (
              placeholder
            )}
          </div>

          <div className="flex items-center gap-2">
            {isSelected && (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  handleClearAll();
                }}
              >
                <XIcon className="h-4 w-4 shrink-0 opacity-50" />
              </span>
            )}
            <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>

      <PopoverContent align="start" className="p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search options..." />
            <CommandEmpty>No options found.</CommandEmpty>

            <CommandGroup>
              {options.map((option) => {
                const active = isMulti
                  ? Array.isArray(selected) &&
                    selected.includes(option.value)
                  : selected === option.value;

                return (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    onSelect={() => handleSelect(option)}
                  >
                    {option.label}

                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        active ? "opacity-100" : "opacity-0"
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

export default Select;
