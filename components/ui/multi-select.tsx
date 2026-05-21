"use client";

import * as React from "react";
import { ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

export interface MultiSelectOption {
  value: string;
  label: string;
  meta?: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  value: string[];
  onValueChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function MultiSelect({
  options,
  value,
  onValueChange,
  placeholder = "Select...",
  className,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (val: string) => {
    onValueChange(
      value.includes(val) ? value.filter((v) => v !== val) : [...value, val]
    );
  };

  const displayLabel =
    value.length === 0
      ? placeholder
      : value.length === 1
      ? options.find((o) => o.value === value[0])?.label ?? placeholder
      : `${value.length} selected`;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "border-input flex h-9 w-full items-center justify-between rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none",
            value.length === 0 && "text-muted-foreground",
            className
          )}
        >
          <span className="truncate">{displayLabel}</span>
          <ChevronDown className="size-4 shrink-0 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
        sideOffset={4}
      >
        {/* Search */}
        <div className="flex items-center gap-2 border-b px-3 py-2">
          <Search className="size-4 shrink-0 text-muted-foreground" />
          <input
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Options */}
        <div className="max-h-60 overflow-y-auto py-1">
          {filtered.map((option) => (
            <div
              key={option.value}
              className="flex cursor-pointer items-center gap-3 px-3 py-2.5 hover:bg-accent"
              onClick={() => toggle(option.value)}
            >
              <Checkbox
                checked={value.includes(option.value)}
                onCheckedChange={() => toggle(option.value)}
                onClick={(e) => e.stopPropagation()}
                className="pointer-events-none"
              />
              <span className="text-sm font-medium">{option.label}</span>
              {option.meta && (
                <span className="text-sm text-muted-foreground">{option.meta}</span>
              )}
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="px-3 py-4 text-center text-sm text-muted-foreground">
              No results found.
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t px-3 py-2">
          <Button
            variant="outline"
            size="sm"
            disabled={value.length === 0}
            onClick={() => onValueChange([])}
          >
            Reset
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onValueChange(options.map((o) => o.value))}
          >
            Select all
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
