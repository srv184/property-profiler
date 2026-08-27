import type { BuyerAnswers } from "@/types/form";
import type {
  DerivedPreferences,
  RecommendationWeights,
} from "@/types/buyerProfile";
import { clamp01, round2 } from "./utils";

/**
 * Tells a future recommendation engine what matters most for THIS buyer.
 * Derived entirely from the same canonical preferences used elsewhere —
 * never calculated independently.
 */
export const calculateRecommendationWeights = (
  answers: BuyerAnswers,
  preferences: DerivedPreferences
): RecommendationWeights => {
  const budget = answers.budget.not_sure ? 0.5 : 1.0;

  const location = answers.open_to_suggestions
    ? answers.locations.length > 0
      ? 0.65
      : 0.4
    : answers.locations.length > 0
      ? 0.95
      : 0.6;

  return {
    budget: round2(clamp01(budget)),
    location: round2(clamp01(location)),
    nature: round2(clamp01(preferences.nature)),
    privacy: round2(clamp01(preferences.privacy)),
    accessibility: round2(clamp01(preferences.urban_access)),
    investment: round2(clamp01(preferences.investment)),
    luxury: round2(clamp01(preferences.luxury)),
    maintenance: round2(clamp01(preferences.maintenance_sensitivity)),
    community: round2(clamp01(preferences.community)),
  };
};
