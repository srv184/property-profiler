import type { BuyerAnswers } from "@/types/form";
import type {
  DerivedPreferences,
  VisualPreferences,
} from "@/types/buyerProfile";
import { AXIS_BASELINE, DNA_WEIGHTS } from "@/data/scoringConfig";
import { bool, clamp01, round2 } from "./utils";

const hasPriority = (answers: BuyerAnswers, p: string) =>
  answers.priorities.includes(p as never);

const dealbreaker = (answers: BuyerAnswers, type: string) =>
  answers.dealbreakers.find((d) => d.type === type) ?? null;

export const calculatePreferenceScores = (
  answers: BuyerAnswers,
  visual: VisualPreferences
): DerivedPreferences => {
  const w = DNA_WEIGHTS;

  // --- Nature -------------------------------------------------------------
  const nature = clamp01(
    w.nature.priority_nature * bool(hasPriority(answers, "nature")) +
      w.nature.priority_peace_and_quiet *
        bool(hasPriority(answers, "peace_and_quiet")) +
      w.nature.visual_forest * visual.forest +
      w.nature.visual_mountain * visual.mountain +
      w.nature.visual_rustic * visual.rustic
  );

  // --- Privacy --------------------------------------------------------------
  const noise = dealbreaker(answers, "noise");
  const heavyTraffic = dealbreaker(answers, "heavy_traffic");
  const severityWeight = (entry: ReturnType<typeof dealbreaker>, soft: number, hard: number) =>
    entry ? (entry.severity === "hard" ? hard : soft) : 0;
  const privacy = clamp01(
    w.privacy.priority_privacy * bool(hasPriority(answers, "privacy")) +
      w.privacy.priority_peace_and_quiet *
        bool(hasPriority(answers, "peace_and_quiet")) +
      w.privacy.visual_private_retreat * visual.private_retreat +
      severityWeight(noise, w.privacy.avoid_noise_soft, w.privacy.avoid_noise_hard) +
      severityWeight(heavyTraffic, w.privacy.avoid_heavy_traffic_soft, w.privacy.avoid_heavy_traffic_hard)
  );

  // --- Accessibility (urban access) ---------------------------------------
  const farFromCity = dealbreaker(answers, "far_from_city");
  const trafficPenaltyWeight = severityWeight(heavyTraffic, w.accessibility.avoid_heavy_traffic_soft_penalty, w.accessibility.avoid_heavy_traffic_hard_penalty);
  const urban_access = clamp01(
    AXIS_BASELINE.accessibility + w.accessibility.priority_city_access *
      bool(hasPriority(answers, "city_access")) +
      severityWeight(farFromCity, w.accessibility.avoid_far_from_city_soft, w.accessibility.avoid_far_from_city_hard) -
      trafficPenaltyWeight
  );

  // --- Investment -----------------------------------------------------------
  const investment = clamp01(
    AXIS_BASELINE.investment + w.investment.priority_rental_income *
      bool(hasPriority(answers, "rental_income")) +
      w.investment.priority_resale_appreciation *
        bool(hasPriority(answers, "resale_appreciation")) +
      w.investment.purpose_investment_only *
        bool(answers.purpose === "investment_only") +
      w.investment.usage_mostly_investment *
        bool(answers.usage === "mostly_investment") +
      w.investment.usage_both * bool(answers.usage === "both")
  );

  // --- Luxury -----------------------------------------------------------
  const luxury = clamp01(
    w.luxury.priority_luxury * bool(hasPriority(answers, "luxury")) +
      w.luxury.visual_social_resort * visual.social_resort +
      w.luxury.visual_modern * visual.modern +
      w.luxury.property_type_resort * bool(answers.q4_value === "resort")
  );

  // --- Maintenance sensitivity -------------------------------------------
  const highMaintenance = dealbreaker(answers, "high_maintenance");
  const maintenance_sensitivity = clamp01(
    AXIS_BASELINE.maintenance + w.maintenance.priority_low_maintenance *
      bool(hasPriority(answers, "low_maintenance")) +
      severityWeight(highMaintenance, w.maintenance.avoid_high_maintenance_soft, w.maintenance.avoid_high_maintenance_hard)
  );

  // --- Community -----------------------------------------------------------
  const community = clamp01(
    AXIS_BASELINE.community + w.community.priority_community * bool(hasPriority(answers, "community")) +
      w.community.visual_social_resort * visual.social_resort +
      w.community.purpose_family_children *
        bool(answers.purpose === "family_children") +
      w.community.purpose_parents_extended_family *
        bool(answers.purpose === "parents_extended_family")
  );

  // --- Flexibility -----------------------------------------------------------
  const hardConstraintCount = answers.dealbreakers.filter(
    (d) => d.severity === "hard" && d.type !== "none"
  ).length;
  const hardConstraintTerm =
    hardConstraintCount === 0
      ? w.flexibility.zero_hard_constraints
      : hardConstraintCount === 1
        ? w.flexibility.one_hard_constraint
        : -w.flexibility.two_plus_hard_constraints_penalty;
  const budgetFlexContribution =
    answers.budget.flexibility === "very_flexible"
      ? w.flexibility.budget_very_flexible
      : answers.budget.flexibility === "somewhat_flexible"
        ? w.flexibility.budget_somewhat_flexible
        : 0;
  const flexibility = clamp01(
    w.flexibility.open_to_suggestions * bool(answers.open_to_suggestions) +
      w.flexibility.show_me_everything * bool(answers.q4_value === "all") +
      w.flexibility.budget_not_sure * bool(answers.budget.not_sure) +
      budgetFlexContribution +
      w.flexibility.multiple_locations * bool(answers.locations.length >= 3) +
      hardConstraintTerm
  );

  // --- Supplementary architecture / atmosphere signals ---------------------
  const quiet_environment = clamp01(
    0.5 * bool(hasPriority(answers, "peace_and_quiet")) +
      0.3 * bool(!!noise) +
      0.2 * bool(!!heavyTraffic)
  );

  const scenic_environment = clamp01(
    0.4 * bool(hasPriority(answers, "nature")) +
      0.3 * visual.forest +
      0.3 * visual.mountain
  );

  const modern_architecture = clamp01(visual.modern);
  const rustic_architecture = clamp01(visual.rustic);

  const social_environment = clamp01(
    0.5 * visual.social_resort + 0.5 * bool(hasPriority(answers, "community"))
  );

  const private_environment = clamp01(
    0.5 * visual.private_retreat +
      0.3 * bool(hasPriority(answers, "privacy")) +
      0.2 * bool(hasPriority(answers, "peace_and_quiet"))
  );

  return {
    nature: round2(nature),
    privacy: round2(privacy),
    urban_access: round2(urban_access),
    investment: round2(investment),
    luxury: round2(luxury),
    maintenance_sensitivity: round2(maintenance_sensitivity),
    community: round2(community),
    flexibility: round2(flexibility),
    quiet_environment: round2(quiet_environment),
    scenic_environment: round2(scenic_environment),
    modern_architecture: round2(modern_architecture),
    rustic_architecture: round2(rustic_architecture),
    social_environment: round2(social_environment),
    private_environment: round2(private_environment),
  };
};
