export const clamp01 = (n: number): number => Math.max(0, Math.min(1, n));

export const round2 = (n: number): number => Math.round(n * 100) / 100;

export const toDnaScore = (n: number): number => Math.round(clamp01(n) * 100);

export const bool = (v: boolean): 0 | 1 => (v ? 1 : 0);

import { SCORE_LABEL_THRESHOLDS } from "@/data/scoringConfig";

export const scoreLabel = (n: number): string => {
  const clamped = clamp01(n);
  const match = SCORE_LABEL_THRESHOLDS.find((t) => clamped <= t.max);
  return match ? match.label : "very high";
};
