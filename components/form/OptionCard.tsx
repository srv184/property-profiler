"use client";

import { Check, Plus } from "lucide-react";

interface OptionCardProps {
  label: string;
  description?: string;
  selected: boolean;
  onSelect: () => void;
  multi?: boolean;
  disabled?: boolean;
}

export function OptionCard({
  label,
  description,
  selected,
  onSelect,
  multi = false,
  disabled = false,
}: OptionCardProps) {
  return (
    <button
      type="button"
      role={multi ? "checkbox" : "radio"}
      aria-checked={selected}
      disabled={disabled}
      onClick={onSelect}
      className={`focus-ring group relative flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3.5 text-left shadow-sm transition-all duration-200 ${
        selected
          ? "border-2 border-accent bg-orange-50/50 px-[15px] py-[13px] shadow-card"
          : "border-line bg-canvas-raised hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-card"
      } ${disabled ? "cursor-not-allowed opacity-40" : "cursor-pointer"}`}
    >
      <span className="flex flex-col">
        <span
          className={`text-[15px] leading-snug ${
            selected ? "font-semibold text-ink" : "font-medium text-ink"
          }`}
        >
          {label}
        </span>
        {description && (
          <span className="mt-0.5 text-[13px] text-ink-faint">
            {description}
          </span>
        )}
      </span>
      <span
        className={`flex h-5 w-5 flex-shrink-0 items-center justify-center border transition-all ${
          multi ? "rounded-[5px]" : "rounded-full"
        } ${
          selected
            ? "border-accent bg-accent text-white"
            : "border-line bg-canvas-sunken text-ink-faint group-hover:border-accent/50 group-hover:text-accent"
        }`}
      >
        {selected ? <Check size={13} strokeWidth={3} /> : <Plus size={13} strokeWidth={2.5} />}
      </span>
    </button>
  );
}
