"use client";

import { Check } from "lucide-react";

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
      className={`focus-ring group relative flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3.5 text-left transition-all duration-150 ${
        selected
          ? "border-accent bg-accent/[0.06] shadow-card"
          : "border-line bg-canvas-raised hover:border-ink/20 hover:bg-canvas-sunken/40"
      } ${disabled ? "cursor-not-allowed opacity-40" : "cursor-pointer"}`}
    >
      <span className="flex flex-col">
        <span
          className={`text-[15px] leading-snug ${
            selected ? "font-medium text-ink" : "text-ink/85"
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
            : "border-line bg-transparent"
        }`}
      >
        {selected && <Check size={13} strokeWidth={3} />}
      </span>
    </button>
  );
}
