"use client";

import type { BuyerAnswers } from "@/types/form";
import {
  AGE_RANGE_OPTIONS,
  PAYMENT_METHOD_OPTIONS,
  PURPOSE_OPTIONS,
  TIMELINE_OPTIONS,
  USAGE_OPTIONS,
} from "@/data/options";
import { OptionCard } from "./OptionCard";

interface Props {
  answers: BuyerAnswers;
  update: (patch: Partial<BuyerAnswers>) => void;
  errors: Record<string, string>;
}

export function Screen4Context({ answers, update, errors }: Props) {
  const showUsage = answers.purpose && answers.purpose !== "investment_only";

  const setPurpose = (purpose: BuyerAnswers["purpose"]) => {
    // Investment-only purpose makes Q10 (usage) irrelevant — clear any
    // stale value so it can never leak into the derived profile.
    update({
      purpose,
      usage: purpose === "investment_only" ? null : answers.usage,
    });
  };

  return (
    <div className="space-y-8">
      {/* Q8 */}
      <section className="rounded-xl border border-line bg-canvas-raised p-5 shadow-sm sm:p-6">
        <h2 className="mb-1 font-serif text-[22px] text-ink">Your age range</h2>
        <p className="mb-5 text-sm text-ink-faint">
          This helps calibrate context, nothing more.
        </p>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-5">
          {AGE_RANGE_OPTIONS.map((opt) => (
            <OptionCard
              key={opt.value}
              label={opt.label}
              selected={answers.age_range === opt.value}
              onSelect={() => update({ age_range: opt.value })}
            />
          ))}
        </div>
        {errors.age_range && (
          <p className="mt-2 text-sm text-red-700">{errors.age_range}</p>
        )}
      </section>

      {/* Q9 */}
      <section className="rounded-xl border border-line bg-canvas-raised p-5 shadow-sm sm:p-6">
        <h2 className="mb-1 font-serif text-[22px] text-ink">
          Who is this for?
        </h2>
        <p className="mb-5 text-sm text-ink-faint">Choose the closest fit.</p>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {PURPOSE_OPTIONS.map((opt) => (
            <OptionCard
              key={opt.value}
              label={opt.label}
              selected={answers.purpose === opt.value}
              onSelect={() => setPurpose(opt.value)}
            />
          ))}
        </div>
        {answers.purpose === "other" && (
          <div className="mt-3">
            <input
              type="text"
              value={answers.purpose_other_text}
              onChange={(e) =>
                update({ purpose_other_text: e.target.value })
              }
              placeholder="Tell us more"
              className="focus-ring w-full rounded-xl border border-line bg-canvas-raised px-3.5 py-3 text-[15px] shadow-sm placeholder:text-ink-faint/70"
            />
            {errors.purpose_other_text && (
              <p className="mt-2 text-sm text-red-700">
                {errors.purpose_other_text}
              </p>
            )}
          </div>
        )}
        {errors.purpose && (
          <p className="mt-2 text-sm text-red-700">{errors.purpose}</p>
        )}
      </section>

      {/* Q10 - conditional */}
      {showUsage && (
        <section className="rounded-xl border border-line bg-canvas-raised p-5 shadow-sm sm:p-6">
          <h2 className="mb-1 font-serif text-[22px] text-ink">
            How will you use it?
          </h2>
          <p className="mb-5 text-sm text-ink-faint">
            Choose the closest fit.
          </p>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {USAGE_OPTIONS.map((opt) => (
              <OptionCard
                key={opt.value}
                label={opt.label}
                selected={answers.usage === opt.value}
                onSelect={() => update({ usage: opt.value })}
              />
            ))}
          </div>
          {errors.usage && (
            <p className="mt-2 text-sm text-red-700">{errors.usage}</p>
          )}
        </section>
      )}

      {/* Q11 */}
      <section className="rounded-xl border border-line bg-canvas-raised p-5 shadow-sm sm:p-6">
        <h2 className="mb-1 font-serif text-[22px] text-ink">
          When are you planning to buy?
        </h2>
        <p className="mb-5 text-sm text-ink-faint">Choose your timeline.</p>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {TIMELINE_OPTIONS.map((opt) => (
            <OptionCard
              key={opt.value}
              label={opt.label}
              selected={answers.timeline === opt.value}
              onSelect={() => update({ timeline: opt.value })}
            />
          ))}
        </div>
        {errors.timeline && (
          <p className="mt-2 text-sm text-red-700">{errors.timeline}</p>
        )}
      </section>

      {/* Q12 - optional */}
      <section className="rounded-xl border border-line bg-canvas-raised p-5 shadow-sm sm:p-6">
        <div className="mb-1 flex items-baseline justify-between">
          <h2 className="font-serif text-[22px] text-ink">
            How are you planning to pay?
          </h2>
          {answers.payment_method && (
            <button
              type="button"
              onClick={() => update({ payment_method: null })}
              className="focus-ring text-xs font-medium text-ink-faint underline decoration-line underline-offset-2 hover:text-ink"
            >
              Skip
            </button>
          )}
        </div>
        <p className="mb-5 text-sm text-ink-faint">Optional.</p>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
          {PAYMENT_METHOD_OPTIONS.map((opt) => (
            <OptionCard
              key={opt.value}
              label={opt.label}
              selected={answers.payment_method === opt.value}
              onSelect={() => update({ payment_method: opt.value })}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
