"use client";

import { Button } from "@/components/ui/button";

export type SourceFilterValue = "all" | "quickbooks" | "xero";

export interface SourceFilterCounts {
  all: number;
  quickbooks: number;
  xero: number;
}

interface SourceFilterProps {
  value: SourceFilterValue;
  onChange: (value: SourceFilterValue) => void;
  counts: SourceFilterCounts;
}

const options: { value: SourceFilterValue; label: string }[] = [
  { value: "all", label: "All" },
  { value: "quickbooks", label: "QuickBooks" },
  { value: "xero", label: "Xero" },
];

export function SourceFilter({ value, onChange, counts }: SourceFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <Button
          key={option.value}
          variant={value === option.value ? "default" : "outline"}
          size="sm"
          onClick={() => onChange(option.value)}
        >
          {option.label} ({counts[option.value]})
        </Button>
      ))}
    </div>
  );
}
