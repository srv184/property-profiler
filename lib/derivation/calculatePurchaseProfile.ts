import type { BuyerAnswers } from "@/types/form";
import type { PurchaseProfile } from "@/types/buyerProfile";

const decisionStage = (
  answers: BuyerAnswers
): PurchaseProfile["decision_stage"] => {
  if (answers.intent === "exploring" || answers.timeline === "just_exploring") {
    return "early_exploration";
  }
  if (answers.timeline === "now" || answers.timeline === "within_3_months") {
    return "ready_to_act";
  }
  if (answers.timeline === "3_6_months") {
    return "actively_deciding";
  }
  return "researching";
};

const investmentOrientation = (
  answers: BuyerAnswers
): PurchaseProfile["investment_orientation"] => {
  if (answers.purpose === "investment_only") return "primary";
  if (answers.usage === "mostly_investment") return "primary";
  if (answers.usage === "both") return "partial";
  if (answers.priorities.includes("rental_income") ||
      answers.priorities.includes("resale_appreciation")) {
    return "partial";
  }
  return "none";
};

const budgetCertainty = (
  answers: BuyerAnswers
): PurchaseProfile["budget_certainty"] => {
  if (answers.budget.not_sure) return "unknown";
  if (answers.budget.min_inr != null && answers.budget.max_inr != null) {
    return "defined";
  }
  return "approximate";
};

const locationFlexibility = (
  answers: BuyerAnswers
): PurchaseProfile["location_flexibility"] => {
  if (answers.open_to_suggestions && answers.locations.length === 0) {
    return "high";
  }
  if (answers.open_to_suggestions || answers.locations.length >= 3) {
    return "moderate";
  }
  return "low";
};

const financingProfile = (
  answers: BuyerAnswers
): PurchaseProfile["financing_profile"] => {
  if (answers.payment_method === "cash") return "cash";
  if (answers.payment_method === "home_loan") return "home_loan";
  return "undecided";
};

export const calculatePurchaseProfile = (
  answers: BuyerAnswers
): PurchaseProfile => {
  // Q10 (usage) is only meaningful when purpose is not investment_only.
  const usage: PurchaseProfile["usage"] =
    answers.purpose === "investment_only"
      ? "not_applicable"
      : (answers.usage ?? "not_applicable");

  return {
    purchase_intent: answers.intent as NonNullable<BuyerAnswers["intent"]>,
    decision_stage: decisionStage(answers),
    purchase_timeline: answers.timeline as NonNullable<
      BuyerAnswers["timeline"]
    >,
    purpose: answers.purpose as NonNullable<BuyerAnswers["purpose"]>,
    usage,
    investment_orientation: investmentOrientation(answers),
    budget_certainty: budgetCertainty(answers),
    budget_flexibility: answers.budget.flexibility ?? "unknown",
    location_flexibility: locationFlexibility(answers),
    financing_profile: financingProfile(answers),
  };
};
