import type { BuyerAnswers } from "@/types/form";
import type {
  DerivedPreferences,
  RecommendationWeights,
} from "@/types/buyerProfile";
import { AXIS_BASELINE, DEALBREAKER_AXIS_MAP, PRIORITY_AXIS_MAP } from "@/data/scoringConfig";
import { clamp01, round2 } from "./utils";

type AxisKey = "nature" | "privacy" | "accessibility" | "investment" | "luxury" | "maintenance" | "community";
const evidenceStrength = (axis: AxisKey, answers: BuyerAnswers, preferences: DerivedPreferences): number => {
  if (answers.priorities.some((p) => PRIORITY_AXIS_MAP[p]?.includes(axis)) || answers.dealbreakers.some((d) => d.severity === "hard" && DEALBREAKER_AXIS_MAP[d.type]?.includes(axis))) return 1;
  if (answers.dealbreakers.some((d) => d.severity === "soft" && DEALBREAKER_AXIS_MAP[d.type]?.includes(axis))) return 0.7;
  const atBaseline = (axis === "accessibility" && preferences.urban_access === AXIS_BASELINE.accessibility) || (axis === "investment" && preferences.investment === AXIS_BASELINE.investment) || (axis === "maintenance" && preferences.maintenance_sensitivity === AXIS_BASELINE.maintenance) || (axis === "community" && preferences.community === AXIS_BASELINE.community);
  return atBaseline ? 0.2 : 0.4;
};
const weightFor = (axis: AxisKey, answers: BuyerAnswers, preferences: DerivedPreferences) => round2(clamp01(0.3 + 0.7 * evidenceStrength(axis, answers, preferences)));

/**
 * Tells a future recommendation engine what matters most for THIS buyer.
 * Derived entirely from the same canonical preferences used elsewhere —
 * never calculated independently.
 */
export const calculateRecommendationWeights = (
  answers: BuyerAnswers,
  preferences: DerivedPreferences
): RecommendationWeights => {
  const budget = answers.budget.not_sure ? 0.35 : answers.budget.flexibility === "strict" ? 1 : answers.budget.flexibility === "somewhat_flexible" ? 0.85 : 0.65;

  const location = answers.open_to_suggestions
    ? answers.locations.length > 0
      ? 0.55
      : 0.3
    : answers.locations.length > 0
      ? 0.95
      : 0.5;

  return {
    budget: round2(clamp01(budget)),
    location: round2(clamp01(location)),
    nature: weightFor("nature", answers, preferences), privacy: weightFor("privacy", answers, preferences),
    accessibility: weightFor("accessibility", answers, preferences), investment: weightFor("investment", answers, preferences),
    luxury: weightFor("luxury", answers, preferences), maintenance: weightFor("maintenance", answers, preferences),
    community: weightFor("community", answers, preferences),
  };
};
