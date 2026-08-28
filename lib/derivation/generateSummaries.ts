import type { BuyerAnswers } from "@/types/form";
import type {
  Constraints,
  DerivedPreferences,
  PropertyPreferenceWeights,
  PurchaseProfile,
  Summary,
} from "@/types/buyerProfile";
import {
  DEALBREAKER_OPTIONS,
  PAYMENT_METHOD_OPTIONS,
  PRIORITY_OPTIONS,
  PURPOSE_OPTIONS,
  TIMELINE_OPTIONS,
  USAGE_OPTIONS,
} from "@/data/options";
import { scoreLabel } from "./utils";
import { formatInr } from "@/utils/formatCurrency";

const labelFor = <T extends string>(
  options: { value: T; label: string }[],
  value: T | null | undefined
): string | null => options.find((o) => o.value === value)?.label ?? null;

// ---------------------------------------------------------------------------
// Lifestyle summary — combines the strongest atmosphere/lifestyle signals.
// ---------------------------------------------------------------------------

const generateLifestyleSummary = (p: DerivedPreferences): string => {
  const clauses: string[] = [];

  const natureHigh = p.nature >= 0.61;
  const privacyHigh = p.privacy >= 0.61;
  const urbanHigh = p.urban_access >= 0.61;
  const luxuryHigh = p.luxury >= 0.61;
  const communityHigh = p.social_environment >= 0.61;
  const modernHigh = p.modern_architecture >= 0.61;
  const rusticHigh = p.rustic_architecture >= 0.61;
  const maintenanceHigh = p.maintenance_sensitivity >= 0.61;

  if (natureHigh && privacyHigh) {
    clauses.push(
      "a strong pull toward natural surroundings and private, quieter environments"
    );
  } else if (natureHigh) {
    clauses.push("a clear preference for green, natural surroundings");
  } else if (privacyHigh) {
    clauses.push("a clear preference for privacy and seclusion");
  }

  if (urbanHigh) {
    clauses.push("a desire to stay well connected to the city");
  } else if (urbanHigh) {
    clauses.push("an appreciation for good connectivity, without wanting to give up quiet space");
  }

  if (luxuryHigh) {
    clauses.push("an inclination toward premium, amenity-rich living");
  }

  if (communityHigh) {
    clauses.push("an interest in social, community-oriented settings");
  }

  if (modernHigh && rusticHigh) {
    clauses.push(
      "a visual taste that spans both clean modern lines and rustic, natural textures"
    );
  } else if (modernHigh) {
    clauses.push("a visual taste for modern, minimal architecture");
  } else if (rusticHigh) {
    clauses.push("a visual taste for rustic, natural architecture");
  }

  if (maintenanceHigh) {
    clauses.push("a preference for a low-effort, easy-to-maintain property");
  }

  if (clauses.length === 0) {
    return "The answers so far show a fairly open, undefined lifestyle preference — later steps and property matches will help sharpen this picture.";
  }

  const joined =
    clauses.length === 1
      ? clauses[0]
      : clauses.slice(0, -1).join(", ") +
        (clauses.length > 2 ? ", and " : " and ") +
        clauses[clauses.length - 1];

  return `The profile shows ${joined}.`;
};

// ---------------------------------------------------------------------------
// Property preference summary
// ---------------------------------------------------------------------------

const generatePropertyPreferenceSummary = (
  weights: PropertyPreferenceWeights,
  answers: BuyerAnswers
): string => {
  const entries = Object.entries(weights).sort((a, b) => b[1] - a[1]);
  if (entries.length === 0) {
    return "No property type signal has been captured yet.";
  }

  const readable = (key: string) =>
    key
      .split("_")
      .map((w) => w[0].toUpperCase() + w.slice(1))
      .join(" ")
      .replace("Land", "land");

  const [topKey, topValue] = entries[0];
  const isOpen =
    answers.q4_value === "all" || answers.q4_value === "not_decided" || !answers.q4_value;

  if (isOpen) {
    const strong = entries.filter(([, v]) => v >= 0.55).map(([k]) => readable(k));
    if (strong.length === 0) {
      return "The buyer is open across property types, without a strong lean toward any single one yet.";
    }
    return `While open to several options, the profile leans most toward ${strong
      .slice(0, 3)
      .join(", ")}.`;
  }

  const label = scoreLabel(topValue);
  return `${readable(topKey)} is the clearest fit, reinforced at a ${label} level by the buyer's other stated preferences.`;
};

// ---------------------------------------------------------------------------
// Buying profile summary
// ---------------------------------------------------------------------------

const generateBuyingProfileSummary = (
  answers: BuyerAnswers,
  purchaseProfile: PurchaseProfile
): string => {
  const intentText: Record<string, string> = {
    buy_property: "buy a property",
    build_property: "build a property",
    buy_land: "buy land",
    exploring: "explore their options",
  };

  const timelineLabel = labelFor(TIMELINE_OPTIONS, answers.timeline) ?? "an unspecified timeline";
  const purposeLabel = labelFor(PURPOSE_OPTIONS, answers.purpose) ?? "an unspecified purpose";
  const paymentLabel = labelFor(PAYMENT_METHOD_OPTIONS, answers.payment_method);

  const locationText = answers.open_to_suggestions
    ? answers.locations.length > 0
      ? `${answers.locations.join(", ")}, while remaining open to suggestions`
      : "wherever fits best, with no fixed location preference"
    : answers.locations.length > 0
      ? answers.locations.join(", ")
      : "a location that has not yet been specified";

  const budgetText = answers.budget.not_sure
    ? "a budget that is still being worked out"
    : answers.budget.min_inr != null && answers.budget.max_inr != null
      ? `a budget of ${formatInr(answers.budget.min_inr)} – ${formatInr(answers.budget.max_inr)}`
      : "a budget that has not yet been fully defined";

  const usageText =
    purchaseProfile.usage === "not_applicable"
      ? null
      : labelFor(USAGE_OPTIONS, purchaseProfile.usage);

  const financingText = paymentLabel
    ? ` Financing is planned via ${paymentLabel.toLowerCase()}.`
    : "";

  return `Looking to ${intentText[answers.intent ?? "exploring"]} in ${locationText}, with ${budgetText} and a timeline of ${timelineLabel.toLowerCase()}. This is primarily for ${purposeLabel.toLowerCase()}${
    usageText ? `, with usage best described as "${usageText.toLowerCase()}"` : ""
  }.${financingText}`;
};

// ---------------------------------------------------------------------------
// Orchestrator
// ---------------------------------------------------------------------------

export const generateSummaries = (
  answers: BuyerAnswers,
  preferences: DerivedPreferences,
  propertyPreferences: PropertyPreferenceWeights,
  constraints: Constraints,
  purchaseProfile: PurchaseProfile
): Summary => {
  const top_priorities = answers.priorities.map((p) => {
    if (p === "other" && answers.priority_other_text.trim()) {
      return answers.priority_other_text.trim();
    }
    return labelFor(PRIORITY_OPTIONS, p) ?? p;
  });

  const avoid_hard = constraints.hard_constraints.map(
    (d) => labelFor(DEALBREAKER_OPTIONS, d) ?? d
  );
  const avoid_soft = constraints.soft_constraints.map(
    (d) => labelFor(DEALBREAKER_OPTIONS, d) ?? d
  );

  return {
    lifestyle: generateLifestyleSummary(preferences),
    property_preference: generatePropertyPreferenceSummary(
      propertyPreferences,
      answers
    ),
    top_priorities,
    avoid_hard,
    avoid_soft,
    buying_profile: generateBuyingProfileSummary(answers, purchaseProfile),
  };
};
