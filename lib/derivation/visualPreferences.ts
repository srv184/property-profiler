import type { VisualAnswers, VisualChoice } from "@/types/form";
import type { VisualPreferences } from "@/types/buyerProfile";
import { VISUAL_SCORING } from "@/data/scoringConfig";
import { round2 } from "./utils";

/**
 * Converts a single A/B/Both/Neither choice into the pair of scores it
 * contributes to signal A and signal B. "Neither" is explicitly neutral —
 * it must never be read as dislike of either side.
 */
const scoreChoice = (
  choice: VisualChoice | null
): { a: number; b: number } => {
  switch (choice) {
    case "A":
      return { a: VISUAL_SCORING.chosen, b: 0 };
    case "B":
      return { a: 0, b: VISUAL_SCORING.chosen };
    case "both":
      return { a: VISUAL_SCORING.both, b: VISUAL_SCORING.both };
    case "neither":
      return { a: VISUAL_SCORING.neither, b: VISUAL_SCORING.neither };
    default:
      return { a: VISUAL_SCORING.unanswered, b: VISUAL_SCORING.unanswered };
  }
};

export const calculateVisualPreferences = (
  visual: VisualAnswers
): VisualPreferences => {
  const pair1 = scoreChoice(visual.pair1); // A mountain / B modern
  const pair2 = scoreChoice(visual.pair2); // A forest / B urban
  const pair3 = scoreChoice(visual.pair3); // A private_retreat / B social_resort
  const pair4 = scoreChoice(visual.pair4); // A rustic / B minimal

  const completed_pairs = [
    visual.pair1,
    visual.pair2,
    visual.pair3,
    visual.pair4,
  ].filter((v) => v !== null).length;

  return {
    mountain: round2(pair1.a),
    modern: round2(pair1.b),
    forest: round2(pair2.a),
    urban: round2(pair2.b),
    private_retreat: round2(pair3.a),
    social_resort: round2(pair3.b),
    rustic: round2(pair4.a),
    minimal: round2(pair4.b),
    completed_pairs,
    total_pairs: 4,
  };
};
