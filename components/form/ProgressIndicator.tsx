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
    <div className="mb-8">
      <div className="mb-2.5 flex items-baseline justify-between">
        <span className="text-xs font-medium uppercase tracking-[0.14em] text-ink-faint">
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
            className={`h-[3px] flex-1 overflow-hidden rounded-full bg-line-soft`}
          >
            <div
              className={`h-full rounded-full bg-accent transition-all duration-500 ease-out`}
              style={{ width: i < current ? "100%" : "0%" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
