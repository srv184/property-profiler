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

export const AXIS_BASELINE = {
  accessibility: 0.5,
  investment: 0.18,
  maintenance: 0.5,
  community: 0.5,
};

export const DNA_WEIGHTS = {
  nature: {
    priority_nature: 0.55,
    priority_peace_and_quiet: 0.20,
    visual_forest: 0.15,
    visual_mountain: 0.10,
    visual_rustic: 0.10,
  },
  privacy: {
    priority_privacy: 0.55,
    priority_peace_and_quiet: 0.15,
    visual_private_retreat: 0.20,
    avoid_noise_soft: 0.05,
    avoid_noise_hard: 0.10,
    avoid_heavy_traffic_soft: 0.05,
    avoid_heavy_traffic_hard: 0.10,
  },
  accessibility: {
    priority_city_access: 0.35,
    avoid_far_from_city_soft: 0.15,
    avoid_far_from_city_hard: 0.25,
    avoid_heavy_traffic_soft_penalty: 0.08,
    avoid_heavy_traffic_hard_penalty: 0.15,
  },
  investment: {
    priority_rental_income: 0.3,
    priority_resale_appreciation: 0.3,
    purpose_investment_only: 0.35,
    usage_mostly_investment: 0.30,
    usage_both: 0.15,
  },
  luxury: {
    priority_luxury: 0.55,
    visual_social_resort: 0.15,
    visual_modern: 0.15,
    property_type_resort: 0.15,
  },
  maintenance: {
    priority_low_maintenance: 0.35,
    avoid_high_maintenance_soft: 0.20,
    avoid_high_maintenance_hard: 0.35,
  },
  community: {
    priority_community: 0.35,
    visual_social_resort: 0.20,
    purpose_family_children: 0.06,
    purpose_parents_extended_family: 0.06,
  },
  flexibility: {
    open_to_suggestions: 0.30,
    show_me_everything: 0.2,
    budget_not_sure: 0.12,
    budget_very_flexible: 0.18,
    budget_somewhat_flexible: 0.09,
    multiple_locations: 0.10,
    zero_hard_constraints: 0.10,
    one_hard_constraint: 0.05,
    two_plus_hard_constraints_penalty: 0.10,
  },
};

export const CONFIDENCE_WEIGHTS = {
  specific_location: 0.13,
  known_budget: 0.13,
  property_type_specific: 0.11,
  priorities_set: 0.12,
  dealbreakers_set: 0.08,
  visual_test_completed: 0.12,
  clear_usage: 0.09,
  clear_timeline: 0.09,
  financing_known: 0.05,
  penalty_exploring_intent: 0.08,
  penalty_open_to_suggestions_only: 0.05,
  penalty_per_ambiguous_axis: 0.03,
};

export const PRIORITY_AXIS_MAP: Record<string, string[]> = {
  nature: ["nature"], privacy: ["privacy"], peace_and_quiet: ["nature", "privacy"],
  city_access: ["accessibility"], rental_income: ["investment"], resale_appreciation: ["investment"],
  low_maintenance: ["maintenance"], luxury: ["luxury"], community: ["community"], safety: [], other: [],
};

export const DEALBREAKER_AXIS_MAP: Record<string, string[]> = {
  heavy_traffic: ["accessibility", "privacy"], far_from_city: ["accessibility"],
  high_maintenance: ["maintenance"], noise: ["privacy"], construction_nearby: ["privacy"], flood_prone: [],
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
