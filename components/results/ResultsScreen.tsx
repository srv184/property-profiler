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
    <div className="mx-auto w-full max-w-3xl px-5 py-12 sm:px-8 sm:py-16">
      <div className="mb-10 animate-fadeUp text-center">
        <button type="button" onClick={onBack} className="focus-ring mb-6 inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm font-medium text-ink-faint hover:bg-canvas-sunken hover:text-ink"><ArrowLeft size={15} /> Back</button>
        <span className="mb-3 inline-block text-xs font-medium uppercase tracking-[0.14em] text-ink-faint">
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

      <div className="mb-8 flex items-center justify-center gap-1 rounded-full border border-line bg-canvas-raised p-1">
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
                ? "bg-ink text-canvas"
                : "text-ink-faint hover:text-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "dna" && (
        <div className="animate-fadeIn space-y-10">
          <div className="rounded-xl2 border border-line bg-canvas-raised p-5 shadow-card sm:p-8">
            <BuyerRadar dna={profile.buyer_dna} />
          </div>

          <PreferenceScores dna={profile.buyer_dna} />

          <div className="rounded-xl2 border border-line bg-canvas-raised px-6 shadow-card sm:px-8">
            <ProfileSummary profile={profile} />
          </div>

          <div className="flex items-center justify-between rounded-xl border border-line-soft bg-canvas-sunken/50 px-5 py-3.5">
            <span className="text-sm text-ink-faint">
              Recommendation confidence
            </span>
            <span className="flex items-center gap-2">
              <span className="text-sm font-medium text-ink">
                {CONFIDENCE_LABELS[profile.confidence.label]}
              </span>
              <span className="font-serif text-sm text-accent-deep tabular-nums">
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
          className="focus-ring flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-medium text-ink-faint transition-colors hover:bg-canvas-sunken hover:text-ink"
        >
          <RotateCcw size={14} /> Start over
        </button>
      </div>
    </div>
  );
}
