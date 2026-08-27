import { z } from "zod";
import type { BuyerAnswers } from "@/types/form";

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

const nonEmpty = (msg: string) => z.string().min(1, msg);

// ---------------------------------------------------------------------------
// Screen 1
// ---------------------------------------------------------------------------

export const validateScreen1 = (answers: BuyerAnswers): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!answers.intent) errors.intent = "Please choose what you're looking to do.";
  if (!answers.buyer_status) errors.buyer_status = "Please select your buyer status.";

  if (!answers.open_to_suggestions && answers.locations.length === 0) {
    errors.locations =
      "Add at least one location, or select \"I'm open to suggestions\".";
  }

  if (!answers.q4_value) {
    errors.q4_value = "Please make a selection.";
  }

  const { budget } = answers;
  if (!budget.not_sure) {
    if (budget.min_inr == null || budget.min_inr <= 0) {
      errors.budget_min = "Enter a valid minimum budget.";
    }
    if (budget.max_inr == null || budget.max_inr <= 0) {
      errors.budget_max = "Enter a valid maximum budget.";
    }
    if (
      budget.min_inr != null &&
      budget.max_inr != null &&
      budget.min_inr > budget.max_inr
    ) {
      errors.budget_range = "Minimum budget cannot exceed maximum budget.";
    }
  }

  if (!budget.flexibility) {
    errors.budget_flexibility = "Please select how flexible your budget is.";
  }

  return { valid: Object.keys(errors).length === 0, errors };
};

// ---------------------------------------------------------------------------
// Screen 2
// ---------------------------------------------------------------------------

export const validateScreen2 = (answers: BuyerAnswers): ValidationResult => {
  const errors: Record<string, string> = {};

  if (answers.priorities.length === 0) {
    errors.priorities = "Choose at least one priority.";
  } else if (answers.priorities.length > 3) {
    errors.priorities = "Choose at most three priorities.";
  }

  if (
    answers.priorities.includes("other") &&
    answers.priority_other_text.trim().length === 0
  ) {
    errors.priority_other_text = "Tell us what else matters to you.";
  }

  const activeDealbreakers = answers.dealbreakers.filter(
    (d) => d.type !== "none"
  );
  if (activeDealbreakers.length > 3) {
    errors.dealbreakers = "Choose at most three things to avoid.";
  }

  return { valid: Object.keys(errors).length === 0, errors };
};

// ---------------------------------------------------------------------------
// Screen 3
// ---------------------------------------------------------------------------

export const validateScreen3 = (answers: BuyerAnswers): ValidationResult => {
  const errors: Record<string, string> = {};
  const { visual } = answers;

  if (!visual.pair1 || !visual.pair2 || !visual.pair3 || !visual.pair4) {
    errors.visual = "Please respond to all four pairs.";
  }

  return { valid: Object.keys(errors).length === 0, errors };
};

// ---------------------------------------------------------------------------
// Screen 4
// ---------------------------------------------------------------------------

export const validateScreen4 = (answers: BuyerAnswers): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!answers.age_range) errors.age_range = "Please select your age range.";
  if (!answers.purpose) errors.purpose = "Please select who this is for.";

  if (
    answers.purpose === "other" &&
    answers.purpose_other_text.trim().length === 0
  ) {
    errors.purpose_other_text = "Please tell us more.";
  }

  if (answers.purpose && answers.purpose !== "investment_only" && !answers.usage) {
    errors.usage = "Please tell us how you'll use it.";
  }

  if (!answers.timeline) errors.timeline = "Please select a timeline.";

  return { valid: Object.keys(errors).length === 0, errors };
};

export const validateScreen = (
  screen: number,
  answers: BuyerAnswers
): ValidationResult => {
  switch (screen) {
    case 1:
      return validateScreen1(answers);
    case 2:
      return validateScreen2(answers);
    case 3:
      return validateScreen3(answers);
    case 4:
      return validateScreen4(answers);
    default:
      return { valid: true, errors: {} };
  }
};

// ---------------------------------------------------------------------------
// Zod schema for the fully-completed answer set (used as a final safety net
// immediately before derivation on screen 5).
// ---------------------------------------------------------------------------

export const budgetSchema = z
  .object({
    min_inr: z.number().nullable(),
    max_inr: z.number().nullable(),
    not_sure: z.boolean(),
    flexibility: z
      .enum(["strict", "somewhat_flexible", "very_flexible"])
      .nullable(),
  })
  .refine(
    (b) => b.not_sure || (b.min_inr != null && b.max_inr != null),
    { message: "Budget is required unless marked as not sure yet." }
  )
  .refine((b) => b.min_inr == null || b.max_inr == null || b.min_inr <= b.max_inr, {
    message: "Minimum budget cannot exceed maximum budget.",
  });

export const completeAnswersSchema = z.object({
  intent: z.enum(["buy_property", "build_property", "buy_land", "exploring"]),
  buyer_status: z.enum([
    "resident_indian",
    "nri",
    "oci",
    "foreign_national",
  ]),
  locations: z.array(nonEmpty("Location cannot be empty")),
  open_to_suggestions: z.boolean(),
  q4_value: z.string().min(1),
  budget: budgetSchema,
  priorities: z.array(z.string()).min(1).max(3),
  priority_other_text: z.string(),
  dealbreakers: z
    .array(
      z.object({
        type: z.string(),
        severity: z.enum(["soft", "hard"]),
      })
    )
    .max(4),
  visual: z.object({
    pair1: z.enum(["A", "B", "both", "neither"]),
    pair2: z.enum(["A", "B", "both", "neither"]),
    pair3: z.enum(["A", "B", "both", "neither"]),
    pair4: z.enum(["A", "B", "both", "neither"]),
  }),
  age_range: z.enum(["18_30", "30_40", "40_50", "50_60", "60_plus"]),
  purpose: z.enum([
    "just_me",
    "me_partner",
    "family_children",
    "parents_extended_family",
    "investment_only",
    "other",
  ]),
  purpose_other_text: z.string(),
  usage: z
    .enum(["mostly_myself", "mostly_investment", "both", "not_sure"])
    .nullable(),
  timeline: z.enum([
    "now",
    "within_3_months",
    "3_6_months",
    "6_12_months",
    "just_exploring",
  ]),
  payment_method: z.enum(["cash", "home_loan", "not_decided"]).nullable(),
});
