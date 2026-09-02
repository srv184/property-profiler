"use client";

import { X } from "lucide-react";
import type { BuyerAnswers, Q4Value } from "@/types/form";
import {
  BUDGET_FLEXIBILITY_OPTIONS,
  BUILD_TYPE_OPTIONS,
  BUYER_STATUS_OPTIONS,
  EXPLORING_TYPE_OPTIONS,
  INTENT_OPTIONS,
  LAND_TYPE_OPTIONS,
  PROPERTY_TYPE_OPTIONS,
} from "@/data/options";
import { OptionCard } from "./OptionCard";
import { LocationAutocomplete } from "./LocationAutocomplete";
import { BudgetRangeSlider } from "./BudgetRangeSlider";
import { formatInr } from "@/utils/formatCurrency";

interface Props {
  answers: BuyerAnswers;
  update: (patch: Partial<BuyerAnswers>) => void;
  errors: Record<string, string>;
}

const Q4_HEADINGS: Record<string, string> = {
  buy_property: "What type of property are you looking for?",
  build_property: "What would you like to build?",
  buy_land: "What kind of land are you looking for?",
  exploring: "What are you most open to exploring?",
};

const q4OptionsFor = (intent: BuyerAnswers["intent"]) => {
  switch (intent) {
    case "buy_property":
      return PROPERTY_TYPE_OPTIONS;
    case "build_property":
      return BUILD_TYPE_OPTIONS;
    case "buy_land":
      return LAND_TYPE_OPTIONS;
    case "exploring":
      return EXPLORING_TYPE_OPTIONS;
    default:
      return [];
  }
};

const MIN_BUDGET = 1000000;
const MAX_BUDGET = 500000000;
const BUDGET_STEP = 100000;
const formatInrDisplay = (n: number | null): string => n == null ? "" : n.toLocaleString("en-IN");

const parseInrInput = (raw: string): number | null => {
  const digits = raw.replace(/[^0-9]/g, "");
  if (!digits) return null;
  return Number(digits);
};

export function Screen1IntentProperty({ answers, update, errors }: Props) {
  const addLocation = (location: string) => {
    const trimmed = location.trim();
    if (!trimmed) return;
    if (answers.locations.includes(trimmed)) return;
    update({ locations: [...answers.locations, trimmed] });
  };

  const updateBudget = (min_inr: number | null, max_inr: number | null) => update({ budget: { ...answers.budget, min_inr, max_inr } });
  const updateMinimum = (value: number | null) => {
    if (value == null) return updateBudget(null, answers.budget.max_inr);
    const min = Math.min(MAX_BUDGET, Math.max(MIN_BUDGET, value));
    const max = Math.max(min, answers.budget.max_inr ?? min);
    updateBudget(min, max);
  };
  const updateMaximum = (value: number | null) => {
    if (value == null) return updateBudget(answers.budget.min_inr, null);
    const max = Math.min(MAX_BUDGET, Math.max(MIN_BUDGET, value));
    const min = Math.min(max, answers.budget.min_inr ?? max);
    updateBudget(min, max);
  };

  const removeLocation = (loc: string) => {
    update({ locations: answers.locations.filter((l) => l !== loc) });
  };

  const setIntent = (intent: BuyerAnswers["intent"]) => {
    // Changing Q1 invalidates any previously selected Q4 value — no stale
    // conditional data may influence the final profile.
    update({ intent, q4_value: null });
  };

  return (
    <div className="space-y-8">
      {/* Q1 */}
      <section className="rounded-xl border border-line bg-canvas-raised p-5 shadow-sm sm:p-6">
        <h2 className="mb-1 font-serif text-[22px] text-ink">
          What are you looking to do?
        </h2>
        <p className="mb-5 text-sm text-ink-faint">
          This sets the direction for everything else.
        </p>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {INTENT_OPTIONS.map((opt) => (
            <OptionCard
              key={opt.value}
              label={opt.label}
              selected={answers.intent === opt.value}
              onSelect={() => setIntent(opt.value)}
            />
          ))}
        </div>
        {errors.intent && (
          <p className="mt-2 text-sm text-red-700">{errors.intent}</p>
        )}
      </section>

      {/* Q2 */}
      <section className="rounded-xl border border-line bg-canvas-raised p-5 shadow-sm sm:p-6">
        <h2 className="mb-1 font-serif text-[22px] text-ink">Your buyer status</h2>
        <p className="mb-5 text-sm text-ink-faint">
          This helps frame relevant considerations later.
        </p>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {BUYER_STATUS_OPTIONS.map((opt) => (
            <OptionCard
              key={opt.value}
              label={opt.label}
              selected={answers.buyer_status === opt.value}
              onSelect={() => update({ buyer_status: opt.value })}
            />
          ))}
        </div>
        {errors.buyer_status && (
          <p className="mt-2 text-sm text-red-700">{errors.buyer_status}</p>
        )}
      </section>

      {/* Q3 */}
      <section className="rounded-xl border border-line bg-canvas-raised p-5 shadow-sm sm:p-6">
        <h2 className="mb-1 font-serif text-[22px] text-ink">
          Where would you like to be?
        </h2>
        <p className="mb-5 text-sm text-ink-faint">
          Add as many locations as you like.
        </p>

        <LocationAutocomplete disabled={answers.open_to_suggestions} onAdd={addLocation} />

        {answers.locations.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {answers.locations.map((loc) => (
              <span
                key={loc}
                className="inline-flex items-center gap-1.5 rounded-full border border-accent/25 bg-orange-50/50 py-1.5 pl-3 pr-2 text-sm font-medium text-ink"
              >
                {loc}
                <button
                  type="button"
                  aria-label={`Remove ${loc}`}
                  onClick={() => removeLocation(loc)}
                  className="focus-ring rounded-full p-0.5 text-ink-faint hover:bg-line hover:text-ink"
                >
                  <X size={13} />
                </button>
              </span>
            ))}
          </div>
        )}

        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-ink/85">
          <input
            type="checkbox"
            checked={answers.open_to_suggestions}
            onChange={(e) =>
              update({ open_to_suggestions: e.target.checked })
            }
            className="focus-ring h-4 w-4 rounded border-line accent-accent"
          />
          I&apos;m open to suggestions
        </label>

        {errors.locations && (
          <p className="mt-2 text-sm text-red-700">{errors.locations}</p>
        )}
      </section>

      {/* Q4 - dynamic */}
      {answers.intent && (
        <section className="rounded-xl border border-line bg-canvas-raised p-5 shadow-sm sm:p-6">
          <h2 className="mb-1 font-serif text-[22px] text-ink">
            {Q4_HEADINGS[answers.intent]}
          </h2>
          <p className="mb-5 text-sm text-ink-faint">
            Choose the option that fits best right now.
          </p>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {q4OptionsFor(answers.intent).map((opt) => (
              <OptionCard
                key={opt.value}
                label={opt.label}
                selected={answers.q4_value === opt.value}
                onSelect={() => update({ q4_value: opt.value as Q4Value })}
              />
            ))}
          </div>
          {errors.q4_value && (
            <p className="mt-2 text-sm text-red-700">{errors.q4_value}</p>
          )}
        </section>
      )}

      {/* Q5 - budget */}
      <section className="rounded-xl border border-line bg-canvas-raised p-5 shadow-sm sm:p-6">
        <h2 className="mb-1 font-serif text-[22px] text-ink">Budget</h2>
        <p className="mb-5 text-sm text-ink-faint">
          All figures in Indian Rupees (INR).
        </p>

        <BudgetRangeSlider min={MIN_BUDGET} max={MAX_BUDGET} step={BUDGET_STEP} valueMin={answers.budget.min_inr ?? MIN_BUDGET} valueMax={answers.budget.max_inr ?? MAX_BUDGET} disabled={answers.budget.not_sure} onChange={updateBudget} />
        <p className="-mt-3 mb-4 text-xs text-ink-faint">Selected range: {formatInr(answers.budget.min_inr ?? MIN_BUDGET)} – {formatInr(answers.budget.max_inr ?? MAX_BUDGET)}</p>
        <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-faint">
              Minimum
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint">
                ₹
              </span>
              <input
                type="text"
                inputMode="numeric"
                value={formatInrDisplay(answers.budget.min_inr)}
                disabled={answers.budget.not_sure}
                onChange={(e) => updateMinimum(parseInrInput(e.target.value))}
                placeholder="1,50,00,000"
                className="focus-ring w-full rounded-xl border border-line bg-canvas-raised py-3 pl-7 pr-3.5 text-[15px] tabular-nums shadow-sm placeholder:text-ink-faint/60 disabled:cursor-not-allowed disabled:opacity-40"
              />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-faint">
              Maximum
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint">
                ₹
              </span>
              <input
                type="text"
                inputMode="numeric"
                value={formatInrDisplay(answers.budget.max_inr)}
                disabled={answers.budget.not_sure}
                onChange={(e) => updateMaximum(parseInrInput(e.target.value))}
                placeholder="2,50,00,000"
                className="focus-ring w-full rounded-xl border border-line bg-canvas-raised py-3 pl-7 pr-3.5 text-[15px] tabular-nums shadow-sm placeholder:text-ink-faint/60 disabled:cursor-not-allowed disabled:opacity-40"
              />
            </div>
          </div>
        </div>

        <label className="mb-1 flex cursor-pointer items-center gap-2.5 text-sm text-ink/85">
          <input
            type="checkbox"
            checked={answers.budget.not_sure}
            onChange={(e) =>
              update({
                budget: {
                  ...answers.budget,
                  not_sure: e.target.checked,
                  min_inr: e.target.checked ? null : answers.budget.min_inr,
                  max_inr: e.target.checked ? null : answers.budget.max_inr,
                },
              })
            }
            className="focus-ring h-4 w-4 rounded border-line accent-accent"
          />
          Not sure yet
        </label>

        {(errors.budget_min || errors.budget_max || errors.budget_range) && (
          <p className="mt-2 text-sm text-red-700">
            {errors.budget_range || errors.budget_min || errors.budget_max}
          </p>
        )}

        <div className="mt-6">
          <h3 className="mb-3 text-[15px] font-medium text-ink">
            How flexible is that budget?
          </h3>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
            {BUDGET_FLEXIBILITY_OPTIONS.map((opt) => (
              <OptionCard
                key={opt.value}
                label={opt.label}
                selected={answers.budget.flexibility === opt.value}
                onSelect={() =>
                  update({
                    budget: { ...answers.budget, flexibility: opt.value },
                  })
                }
              />
            ))}
          </div>
          {errors.budget_flexibility && (
            <p className="mt-2 text-sm text-red-700">
              {errors.budget_flexibility}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
