import type { BuyerAnswers, Dealbreaker } from "@/types/form";
import type { Constraints } from "@/types/buyerProfile";

export const calculateConstraints = (answers: BuyerAnswers): Constraints => {
  const relevant = answers.dealbreakers.filter((d) => d.type !== "none");

  const hard_constraints: Dealbreaker[] = relevant
    .filter((d) => d.severity === "hard")
    .map((d) => d.type);

  const soft_constraints: Dealbreaker[] = relevant
    .filter((d) => d.severity === "soft")
    .map((d) => d.type);

  return { hard_constraints, soft_constraints };
};
