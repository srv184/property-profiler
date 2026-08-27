import type { BuyerAnswers } from "@/types/form";
import type { BuyerProfile, ExplicitInputs } from "@/types/buyerProfile";

import { calculateVisualPreferences } from "./visualPreferences";
import { calculatePreferenceScores } from "./calculatePreferenceScores";
import { calculatePropertyPreferences } from "./calculatePropertyPreferences";
import { calculateConstraints } from "./calculateConstraints";
import { calculatePurchaseProfile } from "./calculatePurchaseProfile";
import { calculateRecommendationWeights } from "./calculateRecommendationWeights";
import { calculateDnaScores } from "./calculateDnaScores";
import { calculateConfidence } from "./calculateConfidence";
import { generateSummaries } from "./generateSummaries";

/**
 * The heart of the application.
 *
 * RawAnswers -> deriveBuyerProfile() -> CanonicalBuyerProfile
 *                                          |-> BuyerDNAView
 *                                          |-> JsonView
 *
 * Deterministic: identical answers always produce an identical profile.
 * No randomness, no network calls, no LLM.
 *
 * This function assumes `answers` represents a COMPLETE, validated set of
 * responses (i.e. the user has reached screen 5). Required fields are
 * asserted non-null after validation has already guaranteed their presence.
 */
export const deriveBuyerProfile = (answers: BuyerAnswers): BuyerProfile => {
  // 1-2. Normalize & score the visual preference test.
  const visual_preferences = calculateVisualPreferences(answers.visual);

  // 3. Core normalized preference scores (0.0 - 1.0).
  const derived_preferences = calculatePreferenceScores(
    answers,
    visual_preferences
  );

  // 4. Property / land / build type weights.
  const property_preferences = calculatePropertyPreferences(
    answers,
    derived_preferences
  );

  // 10-11. Hard / soft constraints.
  const constraints = calculateConstraints(answers);

  // 6-9. Purchase intent, usage, investment orientation, budget/location flex.
  const purchase_profile = calculatePurchaseProfile(answers);

  // 12. Recommendation weights for a future matching engine.
  const recommendation_weights = calculateRecommendationWeights(
    answers,
    derived_preferences
  );

  // 13. Buyer DNA — generated from derived_preferences, nothing else.
  const buyer_dna = calculateDnaScores(derived_preferences);

  // 14. Recommendation confidence.
  const confidence = calculateConfidence(answers, visual_preferences);

  // 15. Human readable summaries.
  const summary = generateSummaries(
    answers,
    derived_preferences,
    property_preferences,
    constraints,
    purchase_profile
  );

  // Explicit inputs — preserved verbatim, never overwritten by inference.
  const explicit_inputs: ExplicitInputs = {
    intent: answers.intent as NonNullable<BuyerAnswers["intent"]>,
    buyer_status: answers.buyer_status as NonNullable<
      BuyerAnswers["buyer_status"]
    >,
    locations: answers.locations,
    open_to_suggestions: answers.open_to_suggestions,
    property_or_land_type: answers.q4_value,
    budget: answers.budget,
    priorities: answers.priorities,
    priority_other_text: answers.priority_other_text.trim() || null,
    dealbreakers: answers.dealbreakers
      .filter((d) => d.type !== "none")
      .map((d) => ({ type: d.type, severity: d.severity })),
    age_range: answers.age_range as NonNullable<BuyerAnswers["age_range"]>,
    purpose: answers.purpose as NonNullable<BuyerAnswers["purpose"]>,
    purpose_other_text: answers.purpose_other_text.trim() || null,
    usage: answers.purpose === "investment_only" ? null : answers.usage,
    timeline: answers.timeline as NonNullable<BuyerAnswers["timeline"]>,
    payment_method: answers.payment_method,
  };

  return {
    explicit_inputs,
    derived_preferences,
    visual_preferences,
    property_preferences,
    constraints,
    purchase_profile,
    recommendation_weights,
    buyer_dna,
    summary,
    confidence,
  };
};
