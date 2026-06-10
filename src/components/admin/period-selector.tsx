"use client";

import { cn } from "@/lib/utils";
import type { RevenuePeriod } from "@/types/admin";

const OPTIONS: { value: RevenuePeriod; label: string }[] = [
  { value: "7d", label: "7 วัน" },
  { value: "30d", label: "30 วัน" },
  { value: "90d", label: "90 วัน" },
];

interface PeriodSelectorProps {
  value: RevenuePeriod;
  onChange: (period: RevenuePeriod) => void;
  disabled?: boolean;
}

export function PeriodSelector({ value, onChange, disabled }: PeriodSelectorProps) {
  return (
    <div
      role="tablist"
      aria-label="เลือกช่วงเวลา"
      className="inline-flex items-center gap-1 rounded-3xl bg-muted p-1"
    >
      {OPTIONS.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={active}
            disabled={disabled}
            onClick={() => onChange(option.value)}
            className={cn(
              "rounded-3xl px-3 py-1 text-sm font-medium transition-colors disabled:opacity-50",
              active
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
