interface ProgressIndicatorProps {
  current: number;
  total: number;
  label: string;
}

export function ProgressIndicator({
  current,
  total,
  label,
}: ProgressIndicatorProps) {
  return (
    <div className="mb-9 rounded-xl border border-line bg-canvas-raised p-4 shadow-sm">
      <div className="mb-3 flex items-baseline justify-between">
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-faint">
          {label}
        </span>
        <span className="text-xs font-medium tabular-nums text-ink-faint">
          {current} of {total}
        </span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={1}
        aria-valuemax={total}
        className="flex gap-1.5"
      >
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 overflow-hidden rounded-full bg-line-soft`}
          >
            <div
              className={`h-full rounded-full bg-accent shadow-[0_0_8px_rgba(252,128,25,0.35)] transition-all duration-500 ease-out`}
              style={{ width: i < current ? "100%" : "0%" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
