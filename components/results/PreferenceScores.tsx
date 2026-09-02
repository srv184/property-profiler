import type { BuyerDNA } from "@/types/buyerProfile";

interface Props {
  dna: BuyerDNA;
}

const AXES: { key: keyof BuyerDNA; label: string; hint: string }[] = [
  { key: "nature", label: "Nature", hint: "Greenery & scenery" },
  { key: "privacy", label: "Privacy", hint: "Seclusion & quiet" },
  { key: "accessibility", label: "Accessibility", hint: "City connectivity" },
  { key: "investment", label: "Investment", hint: "Rental & resale focus" },
  { key: "luxury", label: "Luxury", hint: "Premium amenities" },
  { key: "maintenance", label: "Maintenance", hint: "Low-effort living" },
  { key: "community", label: "Community", hint: "Shared, social spaces" },
  { key: "flexibility", label: "Flexibility", hint: "Openness to options" },
];

export function PreferenceScores({ dna }: Props) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {AXES.map(({ key, label, hint }) => (
        <div
          key={key}
          className="rounded-xl border border-line bg-canvas-raised px-4 py-4 shadow-sm"
        >
          <div className="mb-2 flex items-baseline justify-between">
            <span className="text-[13px] font-medium text-ink">{label}</span>
            <span className="font-serif text-xl font-semibold text-accent-deep tabular-nums">
              {dna[key]}
            </span>
          </div>
          <div className="mb-1.5 h-1.5 overflow-hidden rounded-full bg-line-soft">
            <div
              className="h-full rounded-full bg-accent transition-all duration-700 ease-out"
              style={{ width: `${dna[key]}%` }}
            />
          </div>
          <span className="text-[11px] text-ink-faint">{hint}</span>
        </div>
      ))}
    </div>
  );
}
