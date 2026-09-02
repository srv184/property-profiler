"use client";

import { useState } from "react";
import { ArrowLeft, RotateCcw } from "lucide-react";
import type { BuyerProfile } from "@/types/buyerProfile";
import { BuyerRadar } from "./BuyerRadar";
import { PreferenceScores } from "./PreferenceScores";
import { ProfileSummary } from "./ProfileSummary";
import { JsonViewer } from "./JsonViewer";

interface Props {
  profile: BuyerProfile;
  onBack: () => void;
  onStartOver: () => void;
}

type Tab = "dna" | "json";

const CONFIDENCE_LABELS: Record<string, string> = {
  low: "Low confidence",
  moderate: "Moderate confidence",
  high: "High confidence",
  very_high: "Very high confidence",
};

export function ResultsScreen({ profile, onBack, onStartOver }: Props) {
  const [tab, setTab] = useState<Tab>("dna");

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-8 sm:py-12">
      <div className="mb-10 animate-fadeUp text-center">
        <button type="button" onClick={onBack} className="focus-ring mb-6 inline-flex items-center gap-1.5 rounded-xl border border-line bg-canvas-raised px-4 py-2.5 text-sm font-semibold text-ink-faint shadow-sm transition-colors hover:border-accent/40 hover:bg-orange-50/40 hover:text-ink"><ArrowLeft size={15} /> Back</button>
        <span className="mb-3 inline-block rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-accent-deep">
          Complete
        </span>
        <h1 className="mb-2 font-serif text-[32px] leading-tight text-ink sm:text-[38px]">
          Your Buyer DNA
        </h1>
        <p className="mx-auto max-w-md text-[15px] text-ink-faint">
          Derived from your answers — a structured picture of what you&apos;re
          really looking for.
        </p>
      </div>

      <div className="mx-auto mb-8 flex w-full max-w-md items-center justify-center gap-1 rounded-xl border border-line bg-canvas-raised p-1.5 shadow-sm">
        {(
          [
            { id: "dna", label: "Buyer DNA" },
            { id: "json", label: "Structured JSON" },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`focus-ring rounded-full px-5 py-2 text-sm font-medium transition-colors ${
              tab === t.id
                ? "bg-accent text-white shadow-sm"
                : "text-ink-faint hover:bg-orange-50/60 hover:text-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "dna" && (
        <div className="animate-fadeIn space-y-10">
          <div className="rounded-xl border border-line bg-canvas-raised p-4 shadow-sm sm:p-7">
            <BuyerRadar dna={profile.buyer_dna} />
          </div>

          <PreferenceScores dna={profile.buyer_dna} />

          <div className="rounded-xl border border-line bg-canvas-raised px-5 shadow-sm sm:px-7">
            <ProfileSummary profile={profile} />
          </div>

          <div className="flex flex-col gap-2 rounded-xl border border-accent/20 bg-orange-50/40 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm text-ink-faint">
              Recommendation confidence
            </span>
            <span className="flex items-center gap-2">
              <span className="text-sm font-medium text-ink">
                {CONFIDENCE_LABELS[profile.confidence.label]}
              </span>
              <span className="font-serif text-lg font-semibold text-accent-deep tabular-nums">
                {Math.round(profile.confidence.score * 100)}%
              </span>
            </span>
          </div>
        </div>
      )}

      {tab === "json" && (
        <div className="animate-fadeIn">
          <JsonViewer profile={profile} />
        </div>
      )}

      <div className="mt-10 flex justify-center">
        <button
          type="button"
          onClick={onStartOver}
          className="focus-ring flex items-center gap-1.5 rounded-xl border border-line bg-canvas-raised px-4 py-2.5 text-sm font-semibold text-ink-faint shadow-sm transition-colors hover:border-accent/40 hover:bg-orange-50/40 hover:text-ink"
        >
          <RotateCcw size={14} /> Start over
        </button>
      </div>
    </div>
  );
}
