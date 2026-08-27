import type {
  AgeRange,
  BudgetFlexibility,
  BuildType,
  BuyerStatus,
  Dealbreaker,
  ExploringType,
  Intent,
  LandType,
  PaymentMethod,
  Priority,
  PropertyType,
  Purpose,
  PurchaseTimeline,
  Usage,
} from "@/types/form";

export interface OptionDef<T extends string> {
  value: T;
  label: string;
  description?: string;
}

export const INTENT_OPTIONS: OptionDef<Intent>[] = [
  { value: "buy_property", label: "Buy a property" },
  { value: "build_property", label: "Build a property" },
  { value: "buy_land", label: "Buy land" },
  { value: "exploring", label: "I'm exploring" },
];

export const BUYER_STATUS_OPTIONS: OptionDef<BuyerStatus>[] = [
  { value: "resident_indian", label: "Resident Indian" },
  { value: "nri", label: "NRI" },
  { value: "oci", label: "OCI" },
  { value: "foreign_national", label: "Foreign national" },
];

export const PROPERTY_TYPE_OPTIONS: OptionDef<PropertyType>[] = [
  { value: "villa", label: "Villa" },
  { value: "apartment", label: "Apartment" },
  { value: "managed_farmland", label: "Managed farmland" },
  { value: "resort", label: "Resort" },
  { value: "all", label: "Show me everything" },
];

export const BUILD_TYPE_OPTIONS: OptionDef<BuildType>[] = [
  { value: "villa", label: "Villa" },
  { value: "farmhouse", label: "Farmhouse" },
  { value: "retreat", label: "Retreat / vacation home" },
  { value: "resort", label: "Resort" },
  { value: "not_decided", label: "Not decided yet" },
];

export const LAND_TYPE_OPTIONS: OptionDef<LandType>[] = [
  { value: "residential_plot", label: "Residential plot" },
  { value: "agricultural_land", label: "Agricultural land" },
  { value: "farm_land", label: "Farm land" },
  { value: "vacation_home_land", label: "Land for a vacation home" },
  { value: "investment_land", label: "Investment land" },
  { value: "not_decided", label: "Not decided yet" },
];

export const EXPLORING_TYPE_OPTIONS: OptionDef<ExploringType>[] = [
  { value: "villa", label: "Villas" },
  { value: "apartment", label: "Apartments" },
  { value: "land", label: "Land" },
  { value: "managed_farmland", label: "Managed farmland" },
  { value: "resort", label: "Resorts" },
  { value: "all", label: "Everything" },
];

export const BUDGET_FLEXIBILITY_OPTIONS: OptionDef<BudgetFlexibility>[] = [
  { value: "strict", label: "Strict" },
  { value: "somewhat_flexible", label: "Somewhat flexible" },
  { value: "very_flexible", label: "Very flexible" },
];

export const PRIORITY_OPTIONS: OptionDef<Priority>[] = [
  { value: "nature", label: "Nature & greenery" },
  { value: "privacy", label: "Privacy" },
  { value: "city_access", label: "Access to city" },
  { value: "rental_income", label: "Rental income" },
  { value: "low_maintenance", label: "Low maintenance" },
  { value: "luxury", label: "Luxury & amenities" },
  { value: "safety", label: "Safety" },
  { value: "resale_appreciation", label: "Resale/appreciation" },
  { value: "peace_and_quiet", label: "Peace & quiet" },
  { value: "community", label: "Community" },
  { value: "other", label: "Something else" },
];

export const DEALBREAKER_OPTIONS: OptionDef<Dealbreaker>[] = [
  { value: "heavy_traffic", label: "Heavy traffic" },
  { value: "flood_prone", label: "Flood prone" },
  { value: "construction_nearby", label: "Construction nearby" },
  { value: "far_from_city", label: "Far from city" },
  { value: "high_maintenance", label: "High maintenance" },
  { value: "noise", label: "Noise" },
  { value: "none", label: "None of these" },
];

export const AGE_RANGE_OPTIONS: OptionDef<AgeRange>[] = [
  { value: "18_30", label: "18–30" },
  { value: "30_40", label: "30–40" },
  { value: "40_50", label: "40–50" },
  { value: "50_60", label: "50–60" },
  { value: "60_plus", label: "60+" },
];

export const PURPOSE_OPTIONS: OptionDef<Purpose>[] = [
  { value: "just_me", label: "Just me" },
  { value: "me_partner", label: "Me + partner" },
  { value: "family_children", label: "Family with children" },
  { value: "parents_extended_family", label: "Parents/extended family" },
  { value: "investment_only", label: "Investment only" },
  { value: "other", label: "Other" },
];

export const USAGE_OPTIONS: OptionDef<Usage>[] = [
  { value: "mostly_myself", label: "Mostly myself" },
  { value: "mostly_investment", label: "Mostly investment" },
  { value: "both", label: "Both" },
  { value: "not_sure", label: "Not sure" },
];

export const TIMELINE_OPTIONS: OptionDef<PurchaseTimeline>[] = [
  { value: "now", label: "Now" },
  { value: "within_3_months", label: "Within 3 months" },
  { value: "3_6_months", label: "3–6 months" },
  { value: "6_12_months", label: "6–12 months" },
  { value: "just_exploring", label: "Just exploring" },
];

export const PAYMENT_METHOD_OPTIONS: OptionDef<PaymentMethod>[] = [
  { value: "cash", label: "Cash" },
  { value: "home_loan", label: "Home loan" },
  { value: "not_decided", label: "Not decided" },
];

export interface VisualPairDef {
  id: "pair1" | "pair2" | "pair3" | "pair4";
  question: string;
  optionA: { label: string; signal: string; gradient: string };
  optionB: { label: string; signal: string; gradient: string };
}

export const VISUAL_PAIRS: VisualPairDef[] = [
  {
    id: "pair1",
    question: "Which speaks to you?",
    optionA: {
      label: "Mountain villa",
      signal: "mountain",
      gradient: "from-[#4b5d52] via-[#7a8f6f] to-[#c9c1a1]",
    },
    optionB: {
      label: "Modern villa",
      signal: "modern_architecture",
      gradient: "from-[#2b2b2f] via-[#565660] to-[#c7c7cc]",
    },
  },
  {
    id: "pair2",
    question: "Which speaks to you?",
    optionA: {
      label: "Forest home",
      signal: "forest",
      gradient: "from-[#22331f] via-[#3f5c33] to-[#9caf7a]",
    },
    optionB: {
      label: "City property",
      signal: "urban",
      gradient: "from-[#1c1f2b] via-[#3a4360] to-[#8f9bc2]",
    },
  },
  {
    id: "pair3",
    question: "Which speaks to you?",
    optionA: {
      label: "Private retreat",
      signal: "privacy",
      gradient: "from-[#2e2620] via-[#5c4a37] to-[#b79c76]",
    },
    optionB: {
      label: "Social resort",
      signal: "social_environment",
      gradient: "from-[#3a1f2b] via-[#7a3f56] to-[#d99cae]",
    },
  },
  {
    id: "pair4",
    question: "Which speaks to you?",
    optionA: {
      label: "Rustic cabin",
      signal: "rustic",
      gradient: "from-[#3d2b1f] via-[#6b4a30] to-[#c69a6d]",
    },
    optionB: {
      label: "Minimal architecture",
      signal: "minimal_architecture",
      gradient: "from-[#e8e6df] via-[#c7c3b8] to-[#8f8a7c]",
    },
  },
];
