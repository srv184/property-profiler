// ---------------------------------------------------------------------------
// RAW INPUT TYPES — everything the user explicitly selects on screens 1-4.
// ---------------------------------------------------------------------------

export type Intent =
  | "buy_property"
  | "build_property"
  | "buy_land"
  | "exploring";

export type BuyerStatus =
  | "resident_indian"
  | "nri"
  | "oci"
  | "foreign_national";

export type PropertyType =
  | "villa"
  | "apartment"
  | "managed_farmland"
  | "resort"
  | "all";

export type BuildType =
  | "villa"
  | "farmhouse"
  | "retreat"
  | "resort"
  | "not_decided";

export type LandType =
  | "residential_plot"
  | "agricultural_land"
  | "farm_land"
  | "vacation_home_land"
  | "investment_land"
  | "not_decided";

export type ExploringType =
  | "villa"
  | "apartment"
  | "land"
  | "managed_farmland"
  | "resort"
  | "all";

/** The Q4 value, whichever shape it takes depending on Q1. */
export type Q4Value = PropertyType | BuildType | LandType | ExploringType;

export type BudgetFlexibility = "strict" | "somewhat_flexible" | "very_flexible";

export interface Budget {
  min_inr: number | null;
  max_inr: number | null;
  not_sure: boolean;
  flexibility: BudgetFlexibility | null;
}

export type Priority =
  | "nature"
  | "privacy"
  | "city_access"
  | "rental_income"
  | "low_maintenance"
  | "luxury"
  | "safety"
  | "resale_appreciation"
  | "peace_and_quiet"
  | "community"
  | "other";

export type Dealbreaker =
  | "heavy_traffic"
  | "flood_prone"
  | "construction_nearby"
  | "far_from_city"
  | "high_maintenance"
  | "noise"
  | "none";

export type DealbreakerSeverity = "soft" | "hard";

export interface DealbreakerEntry {
  type: Dealbreaker;
  severity: DealbreakerSeverity;
}

export type VisualChoice = "A" | "B" | "both" | "neither";

export type VisualPairId = "pair1" | "pair2" | "pair3" | "pair4";

export interface VisualAnswers {
  pair1: VisualChoice | null; // mountain vs modern_architecture
  pair2: VisualChoice | null; // forest vs urban
  pair3: VisualChoice | null; // privacy (private retreat) vs social_environment
  pair4: VisualChoice | null; // rustic vs minimal_architecture
}

export type AgeRange = "18_30" | "30_40" | "40_50" | "50_60" | "60_plus";

export type Purpose =
  | "just_me"
  | "me_partner"
  | "family_children"
  | "parents_extended_family"
  | "investment_only"
  | "other";

export type Usage = "mostly_myself" | "mostly_investment" | "both" | "not_sure";

export type PurchaseTimeline =
  | "now"
  | "within_3_months"
  | "3_6_months"
  | "6_12_months"
  | "just_exploring";

export type PaymentMethod = "cash" | "home_loan" | "not_decided";

// ---------------------------------------------------------------------------
// FULL RAW ANSWER STATE — single source of truth for the form.
// ---------------------------------------------------------------------------

export interface BuyerAnswers {
  // Screen 1
  intent: Intent | null;
  buyer_status: BuyerStatus | null;
  locations: string[];
  open_to_suggestions: boolean;
  q4_value: Q4Value | null;
  budget: Budget;

  // Screen 2
  priorities: Priority[];
  priority_other_text: string;
  dealbreakers: DealbreakerEntry[];

  // Screen 3
  visual: VisualAnswers;

  // Screen 4
  age_range: AgeRange | null;
  purpose: Purpose | null;
  purpose_other_text: string;
  usage: Usage | null;
  timeline: PurchaseTimeline | null;
  payment_method: PaymentMethod | null;
}

export const createEmptyAnswers = (): BuyerAnswers => ({
  intent: null,
  buyer_status: null,
  locations: [],
  open_to_suggestions: false,
  q4_value: null,
  budget: {
    min_inr: null,
    max_inr: null,
    not_sure: false,
    flexibility: null,
  },
  priorities: [],
  priority_other_text: "",
  dealbreakers: [],
  visual: {
    pair1: null,
    pair2: null,
    pair3: null,
    pair4: null,
  },
  age_range: null,
  purpose: null,
  purpose_other_text: "",
  usage: null,
  timeline: null,
  payment_method: null,
});

export const TOTAL_SCREENS = 5;
