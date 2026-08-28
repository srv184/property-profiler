"use client";
interface Props { min: number; max: number; step: number; valueMin: number; valueMax: number; disabled?: boolean; onChange: (min: number, max: number) => void; }
export function BudgetRangeSlider({ min, max, step, valueMin, valueMax, disabled, onChange }: Props) {
  const lower = Math.min(Math.max(valueMin, min), valueMax - step); const upper = Math.max(Math.min(valueMax, max), valueMin + step);
  const left = ((lower - min) / (max - min)) * 100; const right = ((upper - min) / (max - min)) * 100;
  return <div className={`relative mb-5 h-8 ${disabled ? "pointer-events-none opacity-40" : ""}`}>
    <div className="absolute left-0 right-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-line-soft"><div className="absolute inset-y-0 rounded-full bg-accent" style={{ left: `${left}%`, right: `${100 - right}%` }} /></div>
    <input aria-label="Minimum budget" type="range" min={min} max={upper - step} step={step} value={lower} disabled={disabled} onChange={(event) => onChange(Number(event.target.value), upper)} className="budget-range absolute inset-0 z-20 h-8 w-full appearance-none bg-transparent" />
    <input aria-label="Maximum budget" type="range" min={lower + step} max={max} step={step} value={upper} disabled={disabled} onChange={(event) => onChange(lower, Number(event.target.value))} className="budget-range absolute inset-0 z-10 h-8 w-full appearance-none bg-transparent" />
  </div>;
}
