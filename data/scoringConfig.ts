// ---------------------------------------------------------------------------
// SCORING_CONFIG
//
// Every non-obvious weight used by the derivation engine lives here so the
// scoring logic itself stays readable and the constants stay auditable.
// All contribution weights for a given 0.0–1.0 score are designed to sum to
// (approximately) 1.0 across their contributing signals, then are clamped.
// ---------------------------------------------------------------------------

export const VISUAL_SCORING = {
  // Score contribution when a side is chosen outright.
  chosen: 1.0,
  // Score contribution to BOTH sides when "Both" is chosen (moderate signal).
  both: 0.55,
  // Score contribution when "Neither" is chosen — stays neutral, never negative.
  neither: 0.0,
  // Baseline score for a pair that was never answered (skipped/incomplete).
  unanswered: 0.0,
};

export const DNA_WEIGHTS = {
  nature: {
    priority_nature: 0.32,
    priority_peace_and_quiet: 0.18,
    visual_forest: 0.2,
    visual_mountain: 0.15,
    visual_rustic: 0.15,
  },
  privacy: {
    priority_privacy: 0.32,
    priority_peace_and_quiet: 0.16,
    visual_private_retreat: 0.24,
    avoid_noise: 0.14,
    avoid_heavy_traffic: 0.14,
  },
  accessibility: {
    priority_city_access: 0.5,
    avoid_far_from_city: 0.3,
    avoid_heavy_traffic_penalty: 0.2, // heavy traffic pulls accessibility DOWN
  },
  investment: {
    priority_rental_income: 0.3,
    priority_resale_appreciation: 0.3,
    purpose_investment_only: 0.25,
    usage_mostly_investment: 0.25,
    usage_both: 0.12,
  },
  luxury: {
    priority_luxury: 0.4,
    visual_social_resort: 0.22,
    visual_modern: 0.18,
    property_type_resort: 0.2,
  },
  maintenance: {
    priority_low_maintenance: 0.55,
    avoid_high_maintenance: 0.45,
  },
  community: {
    priority_community: 0.45,
    visual_social_resort: 0.3,
    purpose_family_children: 0.1,
    purpose_parents_extended_family: 0.1,
  },
  flexibility: {
    open_to_suggestions: 0.28,
    show_me_everything: 0.2,
    budget_not_sure: 0.12,
    budget_very_flexible: 0.15,
    budget_somewhat_flexible: 0.08,
    few_hard_constraints: 0.12,
    single_location_penalty: 0.05, // fewer locations = slightly less flexible
  },
};

export const CONFIDENCE_WEIGHTS = {
  specific_location: 0.15,
  known_budget: 0.15,
  property_type_specific: 0.12,
  priorities_set: 0.14,
  dealbreakers_set: 0.1,
  visual_test_completed: 0.14,
  clear_usage: 0.1,
  clear_timeline: 0.1,
  penalty_exploring_intent: 0.08,
  penalty_open_to_suggestions_only: 0.05,
};

export const SCORE_LABEL_THRESHOLDS: { max: number; label: string }[] = [
  { max: 0.3, label: "low" },
  { max: 0.6, label: "moderate" },
  { max: 0.8, label: "high" },
  { max: 1.01, label: "very high" },
];

export const CONFIDENCE_LABEL_THRESHOLDS: {
  max: number;
  label: "low" | "moderate" | "high" | "very_high";
}[] = [
  { max: 0.35, label: "low" },
  { max: 0.6, label: "moderate" },
  { max: 0.82, label: "high" },
  { max: 1.01, label: "very_high" },
];
