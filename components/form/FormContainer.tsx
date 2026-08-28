"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { createEmptyAnswers, TOTAL_SCREENS, type BuyerAnswers } from "@/types/form";
import { validateScreen } from "@/utils/validation";
import { deriveBuyerProfile } from "@/lib/derivation/deriveBuyerProfile";
import { ProgressIndicator } from "./ProgressIndicator";
import { Screen1IntentProperty } from "./Screen1IntentProperty";
import { Screen2Priorities } from "./Screen2Priorities";
import { Screen3VisualPreferences } from "./Screen3VisualPreferences";
import { Screen4Context } from "./Screen4Context";
import { ResultsScreen } from "../results/ResultsScreen";

const SCREEN_TITLES = [
  "Your search",
  "Priorities",
  "Visual read",
  "About you",
  "Your Buyer DNA",
];

export function FormContainer() {
  const [screen, setScreen] = useState(1);
  const [answers, setAnswers] = useState<BuyerAnswers>(createEmptyAnswers());
  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = (patch: Partial<BuyerAnswers>) => {
    setAnswers((prev) => ({ ...prev, ...patch }));
  };

  const profile = useMemo(() => {
    if (screen !== 5) return null;
    return deriveBuyerProfile(answers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen]);

  const goNext = () => {
    const result = validateScreen(screen, answers);
    if (!result.valid) {
      setErrors(result.errors);
      return;
    }
    setErrors({});
    setScreen((s) => Math.min(TOTAL_SCREENS, s + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBack = () => {
    setErrors({});
    setScreen((s) => Math.max(1, s - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const startOver = () => {
    setAnswers(createEmptyAnswers());
    setErrors({});
    setScreen(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBackFromResults = () => {
    setScreen(4);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (screen === 5 && profile) {
    return <ResultsScreen profile={profile} onBack={goBackFromResults} onStartOver={startOver} />;
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-5 py-12 sm:px-8 sm:py-16">
      <ProgressIndicator
        current={screen}
        total={TOTAL_SCREENS}
        label={SCREEN_TITLES[screen - 1]}
      />

      <div key={screen} className="animate-fadeUp">
        {screen === 1 && (
          <Screen1IntentProperty
            answers={answers}
            update={update}
            errors={errors}
          />
        )}
        {screen === 2 && (
          <Screen2Priorities
            answers={answers}
            update={update}
            errors={errors}
          />
        )}
        {screen === 3 && (
          <Screen3VisualPreferences
            answers={answers}
            update={update}
            errors={errors}
          />
        )}
        {screen === 4 && (
          <Screen4Context answers={answers} update={update} errors={errors} />
        )}
      </div>

      <div className="mt-12 flex items-center justify-between border-t border-line pt-6">
        <button
          type="button"
          onClick={goBack}
          disabled={screen === 1}
          className="focus-ring flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-medium text-ink-faint transition-colors hover:bg-canvas-sunken hover:text-ink disabled:cursor-not-allowed disabled:opacity-0"
        >
          <ArrowLeft size={16} /> Back
        </button>
        <button
          type="button"
          onClick={goNext}
          className="focus-ring flex items-center gap-1.5 rounded-full bg-ink px-6 py-2.5 text-sm font-medium text-canvas transition-colors hover:bg-accent-deep"
        >
          {screen === TOTAL_SCREENS - 1 ? "View My Buyer DNA" : "Continue"}
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
