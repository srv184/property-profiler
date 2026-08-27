import type { BuyerAnswers } from "@/types/form";
import type {
  DerivedPreferences,
  PropertyPreferenceWeights,
} from "@/types/buyerProfile";
import { clamp01, round2 } from "./utils";

/** Which candidate types apply for a given intent, and the secondary
 *  derived-preference contributions that push each type's weight up or
 *  down beyond the explicit selection itself. */
interface TypeConfig {
  value: string;
  contributions: Partial<Record<keyof DerivedPreferences, number>>;
}

const BUY_PROPERTY_TYPES: TypeConfig[] = [
  { value: "villa", contributions: { nature: 0.15, privacy: 0.1 } },
  {
    value: "apartment",
    contributions: {
      urban_access: 0.2,
      maintenance_sensitivity: 0.1,
      nature: -0.05,
    },
  },
  {
    value: "managed_farmland",
    contributions: {
      nature: 0.2,
      investment: 0.1,
      maintenance_sensitivity: 0.1,
    },
  },
  { value: "resort", contributions: { luxury: 0.2, community: 0.1 } },
];

const BUILD_TYPES: TypeConfig[] = [
  { value: "villa", contributions: { nature: 0.15, privacy: 0.1 } },
  { value: "farmhouse", contributions: { nature: 0.15, privacy: 0.1 } },
  { value: "retreat", contributions: { privacy: 0.2, nature: 0.1 } },
  { value: "resort", contributions: { luxury: 0.2, community: 0.1 } },
];

const LAND_TYPES: TypeConfig[] = [
  { value: "residential_plot", contributions: { urban_access: 0.15 } },
  {
    value: "agricultural_land",
    contributions: { nature: 0.2, investment: 0.1 },
  },
  { value: "farm_land", contributions: { nature: 0.2, investment: 0.1 } },
  {
    value: "vacation_home_land",
    contributions: { nature: 0.15, privacy: 0.1 },
  },
  { value: "investment_land", contributions: { investment: 0.25 } },
];

const EXPLORING_TYPES: TypeConfig[] = [
  { value: "villa", contributions: { nature: 0.15, privacy: 0.1 } },
  {
    value: "apartment",
    contributions: { urban_access: 0.2, maintenance_sensitivity: 0.1 },
  },
  { value: "land", contributions: { investment: 0.1, nature: 0.1 } },
  {
    value: "managed_farmland",
    contributions: { nature: 0.2, investment: 0.1 },
  },
  { value: "resort", contributions: { luxury: 0.2, community: 0.1 } },
];

const configFor = (answers: BuyerAnswers): TypeConfig[] => {
  switch (answers.intent) {
    case "buy_property":
      return BUY_PROPERTY_TYPES;
    case "build_property":
      return BUILD_TYPES;
    case "buy_land":
      return LAND_TYPES;
    case "exploring":
    default:
      return EXPLORING_TYPES;
  }
};

/** "all"/"not_decided" style values that mean no single type was chosen. */
const OPEN_VALUES = new Set(["all", "not_decided"]);

export const calculatePropertyPreferences = (
  answers: BuyerAnswers,
  preferences: DerivedPreferences
): PropertyPreferenceWeights => {
  const types = configFor(answers);
  const explicitValue = answers.q4_value;
  const isOpenSelection = explicitValue ? OPEN_VALUES.has(explicitValue) : true;

  const weights: PropertyPreferenceWeights = {};

  for (const type of types) {
    const isExplicitMatch = !isOpenSelection && explicitValue === type.value;
    const base = isExplicitMatch ? 0.72 : isOpenSelection ? 0.42 : 0.14;

    let secondary = 0;
    for (const [key, contribution] of Object.entries(type.contributions)) {
      const signal = preferences[key as keyof DerivedPreferences];
      secondary += (contribution ?? 0) * signal;
    }

    weights[type.value] = round2(clamp01(base + secondary));
  }

  return weights;
};
