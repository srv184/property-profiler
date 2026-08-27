import type { BuyerAnswers } from "@/types/form";
import type { Confidence, VisualPreferences } from "@/types/buyerProfile";
import { CONFIDENCE_LABEL_THRESHOLDS, CONFIDENCE_WEIGHTS } from "@/data/scoringConfig";
import { clamp01, round2 } from "./utils";

/**
 * Measures how COMPLETE and SPECIFIC the collected preference information
 * is — not any kind of psychological certainty about the buyer.
 */
export const calculateConfidence = (
  answers: BuyerAnswers,
  visual: VisualPreferences
): Confidence => {
  const w = CONFIDENCE_WEIGHTS;
  let score = 0;
  const reasons: string[] = [];

  const hasSpecificLocation =
    answers.locations.length > 0 && !answers.open_to_suggestions;
  if (hasSpecificLocation) {
    score += w.specific_location;
    reasons.push("A specific location or set of locations was provided.");
  } else {
    reasons.push("Location is open-ended, which lowers specificity.");
  }

  const hasKnownBudget =
    !answers.budget.not_sure &&
    answers.budget.min_inr != null &&
    answers.budget.max_inr != null;
  if (hasKnownBudget) {
    score += w.known_budget;
    reasons.push("A defined budget range was provided.");
  } else {
    reasons.push("Budget is not yet defined.");
  }

  const isSpecificType =
    !!answers.q4_value &&
    answers.q4_value !== "all" &&
    answers.q4_value !== "not_decided";
  if (isSpecificType) {
    score += w.property_type_specific;
    reasons.push("A specific property or land type was selected.");
  } else {
    reasons.push("Property or land type preference is broad.");
  }

  if (answers.priorities.length > 0) {
    score += w.priorities_set * Math.min(1, answers.priorities.length / 3);
    reasons.push("Top priorities were identified.");
  }

  const activeDealbreakers = answers.dealbreakers.filter(
    (d) => d.type !== "none"
  );
  if (activeDealbreakers.length > 0) {
    score += w.dealbreakers_set;
    reasons.push("Dealbreakers were identified.");
  }

  if (visual.completed_pairs === visual.total_pairs) {
    score += w.visual_test_completed;
    reasons.push("The visual preference test was fully completed.");
  } else if (visual.completed_pairs > 0) {
    score +=
      w.visual_test_completed * (visual.completed_pairs / visual.total_pairs);
    reasons.push("The visual preference test was partially completed.");
  }

  const clearUsage =
    answers.purpose === "investment_only" ||
    (answers.usage != null && answers.usage !== "not_sure");
  if (clearUsage) {
    score += w.clear_usage;
    reasons.push("Intended usage is clear.");
  }

  if (answers.timeline && answers.timeline !== "just_exploring") {
    score += w.clear_timeline;
    reasons.push("A purchase timeline was provided.");
  }

  if (answers.intent === "exploring") {
    score -= w.penalty_exploring_intent;
    reasons.push("Overall intent is still exploratory.");
  }

  if (answers.open_to_suggestions && answers.locations.length === 0) {
    score -= w.penalty_open_to_suggestions_only;
  }

  const finalScore = round2(clamp01(score));
  const match = CONFIDENCE_LABEL_THRESHOLDS.find((t) => finalScore <= t.max);

  return {
    score: finalScore,
    label: match ? match.label : "very_high",
    reasons,
  };
};
