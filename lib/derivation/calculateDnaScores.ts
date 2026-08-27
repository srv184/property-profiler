import type { BuyerDNA, DerivedPreferences } from "@/types/buyerProfile";
import { toDnaScore } from "./utils";

/**
 * Buyer DNA is a pure 0-100 presentation of the canonical derived
 * preferences. It must never be computed independently from the JSON —
 * this function is the ONLY place that produces it, and both the radar
 * chart and the structured JSON read from its output.
 */
export const calculateDnaScores = (
  preferences: DerivedPreferences
): BuyerDNA => ({
  nature: toDnaScore(preferences.nature),
  privacy: toDnaScore(preferences.privacy),
  accessibility: toDnaScore(preferences.urban_access),
  investment: toDnaScore(preferences.investment),
  luxury: toDnaScore(preferences.luxury),
  maintenance: toDnaScore(preferences.maintenance_sensitivity),
  community: toDnaScore(preferences.community),
  flexibility: toDnaScore(preferences.flexibility),
});
