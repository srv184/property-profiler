import type {
  AgeRange,
  Budget,
  BuyerStatus,
  Dealbreaker,
  DealbreakerSeverity,
  Intent,
  PaymentMethod,
  Purpose,
  PurchaseTimeline,
  Q4Value,
  Usage,
} from "./form";

// ---------------------------------------------------------------------------
// EXPLICIT INPUTS — preserved verbatim from the user's answers.
// ---------------------------------------------------------------------------

export interface ExplicitInputs {
  intent: Intent;
  buyer_status: BuyerStatus;
  locations: string[];
  open_to_suggestions: boolean;
  property_or_land_type: Q4Value | null;
  budget: Budget;
  priorities: string[];
  priority_other_text: string | null;
  dealbreakers: { type: Dealbreaker; severity: DealbreakerSeverity }[];
  age_range: AgeRange;
  purpose: Purpose;
  purpose_other_text: string | null;
  usage: Usage | null;
  timeline: PurchaseTimeline;
  payment_method: PaymentMethod | null;
}

// ---------------------------------------------------------------------------
// DERIVED PREFERENCES — normalized 0.0–1.0 signals.
// ---------------------------------------------------------------------------

export interface DerivedPreferences {
  nature: number;
  privacy: number;
  urban_access: number;
  investment: number;
  luxury: number;
  maintenance_sensitivity: number;
  community: number;
  flexibility: number;
  quiet_environment: number;
  scenic_environment: number;
  modern_architecture: number;
  rustic_architecture: number;
  social_environment: number;
  private_environment: number;
}

// ---------------------------------------------------------------------------
// VISUAL PREFERENCES — deterministic scores from the visual test.
// ---------------------------------------------------------------------------

export interface VisualPreferences {
  mountain: number;
  modern: number;
  forest: number;
  urban: number;
  private_retreat: number;
  social_resort: number;
  rustic: number;
  minimal: number;
  completed_pairs: number;
  total_pairs: number;
}

// ---------------------------------------------------------------------------
// PROPERTY PREFERENCES — weighted by explicit + inferred signals.
// ---------------------------------------------------------------------------

export type PropertyPreferenceWeights = Record<string, number>;

// ---------------------------------------------------------------------------
// CONSTRAINTS
// ---------------------------------------------------------------------------

export interface Constraints {
  hard_constraints: Dealbreaker[];
  soft_constraints: Dealbreaker[];
}

// ---------------------------------------------------------------------------
// PURCHASE PROFILE
// ---------------------------------------------------------------------------

export interface PurchaseProfile {
  purchase_intent: Intent;
  decision_stage:
    | "ready_to_act"
    | "actively_deciding"
    | "researching"
    | "early_exploration";
  purchase_timeline: PurchaseTimeline;
  purpose: Purpose;
  usage: Usage | "not_applicable";
  investment_orientation: "none" | "partial" | "primary";
  budget_certainty: "unknown" | "approximate" | "defined";
  budget_flexibility: "strict" | "somewhat_flexible" | "very_flexible" | "unknown";
  location_flexibility: "low" | "moderate" | "high";
  financing_profile: "cash" | "home_loan" | "undecided";
}

// ---------------------------------------------------------------------------
// RECOMMENDATION WEIGHTS — normalized 0.0–1.0 importance for a future engine.
// ---------------------------------------------------------------------------

export interface RecommendationWeights {
  budget: number;
  location: number;
  nature: number;
  privacy: number;
  accessibility: number;
  investment: number;
  luxury: number;
  maintenance: number;
  community: number;
}

// ---------------------------------------------------------------------------
// BUYER DNA — the eight headline 0–100 scores.
// ---------------------------------------------------------------------------

export interface BuyerDNA {
  nature: number;
  privacy: number;
  accessibility: number;
  investment: number;
  luxury: number;
  maintenance: number;
  community: number;
  flexibility: number;
}

// ---------------------------------------------------------------------------
// SUMMARY — human-readable, generated text.
// ---------------------------------------------------------------------------

export interface Summary {
  lifestyle: string;
  property_preference: string;
  top_priorities: string[];
  avoid_hard: string[];
  avoid_soft: string[];
  buying_profile: string;
}

// ---------------------------------------------------------------------------
// CONFIDENCE
// ---------------------------------------------------------------------------

export interface Confidence {
  score: number; // 0.0 - 1.0
  label: "low" | "moderate" | "high" | "very_high";
  reasons: string[];
}

// ---------------------------------------------------------------------------
// THE CANONICAL BUYER PROFILE — single source of truth.
// ---------------------------------------------------------------------------

export interface BuyerProfile {
  explicit_inputs: ExplicitInputs;
  derived_preferences: DerivedPreferences;
  visual_preferences: VisualPreferences;
  property_preferences: PropertyPreferenceWeights;
  constraints: Constraints;
  purchase_profile: PurchaseProfile;
  recommendation_weights: RecommendationWeights;
  buyer_dna: BuyerDNA;
  summary: Summary;
  confidence: Confidence;
}
