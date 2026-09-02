"use client";

import type { BuyerAnswers, Dealbreaker, DealbreakerSeverity, Priority } from "@/types/form";
import { DEALBREAKER_OPTIONS, PRIORITY_OPTIONS } from "@/data/options";
import { OptionCard } from "./OptionCard";

interface Props {
  answers: BuyerAnswers;
  update: (patch: Partial<BuyerAnswers>) => void;
  errors: Record<string, string>;
}

const MAX_PRIORITIES = 3;
const MAX_DEALBREAKERS = 3;

export function Screen2Priorities({ answers, update, errors }: Props) {
  const togglePriority = (value: Priority) => {
    const isSelected = answers.priorities.includes(value);
    if (isSelected) {
      update({ priorities: answers.priorities.filter((p) => p !== value) });
      return;
    }
    if (answers.priorities.length >= MAX_PRIORITIES) return;
    update({ priorities: [...answers.priorities, value] });
  };

  const activeDealbreakers = answers.dealbreakers.filter(
    (d) => d.type !== "none"
  );
  const noneSelected = answers.dealbreakers.some((d) => d.type === "none");

  const toggleDealbreaker = (value: Dealbreaker) => {
    if (value === "none") {
      if (noneSelected) {
        update({ dealbreakers: [] });
      } else {
        update({ dealbreakers: [{ type: "none", severity: "hard" }] });
      }
      return;
    }

    const existing = answers.dealbreakers.find((d) => d.type === value);
    if (existing) {
      update({
        dealbreakers: answers.dealbreakers.filter((d) => d.type !== value),
      });
      return;
    }
    if (activeDealbreakers.length >= MAX_DEALBREAKERS) return;
    update({
      dealbreakers: [
        ...answers.dealbreakers.filter((d) => d.type !== "none"),
        { type: value, severity: "soft" },
      ],
    });
  };

  const setSeverity = (value: Dealbreaker, severity: DealbreakerSeverity) => {
    update({
      dealbreakers: answers.dealbreakers.map((d) =>
        d.type === value ? { ...d, severity } : d
      ),
    });
  };

  const remaining = MAX_PRIORITIES - answers.priorities.length;
  const remainingDealbreakers = MAX_DEALBREAKERS - activeDealbreakers.length;

  return (
    <div className="space-y-8">
      {/* Q6 */}
      <section className="rounded-xl border border-line bg-canvas-raised p-5 shadow-sm sm:p-6">
        <div className="mb-1 flex items-baseline justify-between">
          <h2 className="font-serif text-[22px] text-ink">
            Which 3 matter most?
          </h2>
          <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-accent-deep">
            {answers.priorities.length}/3 selected
          </span>
        </div>
        <p className="mb-5 text-sm text-ink-faint">
          Choose up to three. These carry the most weight in your profile.
        </p>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {PRIORITY_OPTIONS.map((opt) => {
            const selected = answers.priorities.includes(opt.value);
            const disabled =
              !selected && answers.priorities.length >= MAX_PRIORITIES;
            return (
              <OptionCard
                key={opt.value}
                label={opt.label}
                selected={selected}
                disabled={disabled}
                multi
                onSelect={() => togglePriority(opt.value)}
              />
            );
          })}
        </div>

        {answers.priorities.includes("other") && (
          <div className="mt-3">
            <input
              type="text"
              value={answers.priority_other_text}
              onChange={(e) =>
                update({ priority_other_text: e.target.value })
              }
              placeholder="What else matters to you?"
              className="focus-ring w-full rounded-lg border border-line bg-canvas-raised px-3.5 py-2.5 text-[15px] placeholder:text-ink-faint/70"
            />
            {errors.priority_other_text && (
              <p className="mt-2 text-sm text-red-700">
                {errors.priority_other_text}
              </p>
            )}
          </div>
        )}

        {errors.priorities && (
          <p className="mt-2 text-sm text-red-700">{errors.priorities}</p>
        )}
      </section>

      {/* Q7 */}
      <section className="rounded-xl border border-line bg-canvas-raised p-5 shadow-sm sm:p-6">
        <div className="mb-1 flex items-baseline justify-between">
          <h2 className="font-serif text-[22px] text-ink">
            What should we avoid?
          </h2>
          {!noneSelected && (
            <span className="text-xs font-medium text-ink-faint">
              {remainingDealbreakers > 0
                ? `up to ${remainingDealbreakers} more`
                : "3 selected"}
            </span>
          )}
        </div>
        <p className="mb-5 text-sm text-ink-faint">
          Choose up to three. Optional.
        </p>

        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {DEALBREAKER_OPTIONS.map((opt) => {
            const selected =
              opt.value === "none"
                ? noneSelected
                : answers.dealbreakers.some((d) => d.type === opt.value);
            const disabled =
              opt.value !== "none" &&
              !selected &&
              (noneSelected || activeDealbreakers.length >= MAX_DEALBREAKERS);
            return (
              <OptionCard
                key={opt.value}
                label={opt.label}
                selected={selected}
                disabled={disabled}
                multi
                onSelect={() => toggleDealbreaker(opt.value)}
              />
            );
          })}
        </div>

        {activeDealbreakers.length > 0 && (
          <div className="mt-5 space-y-2.5">
            <h3 className="text-xs font-medium uppercase tracking-wide text-ink-faint">
              How strongly should we weigh each?
            </h3>
            {activeDealbreakers.map((d) => {
              const label = DEALBREAKER_OPTIONS.find(
                (o) => o.value === d.type
              )?.label;
              return (
                <div
                  key={d.type}
                  className="flex flex-col gap-2 rounded-lg border border-line bg-canvas-sunken/50 px-3.5 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <span className={`text-sm font-medium ${d.severity === "hard" ? "text-red-700 line-through decoration-red-500 decoration-2" : "text-ink"}`}>{label}</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setSeverity(d.type, "soft")}
                      className={`focus-ring rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                        d.severity === "soft"
                          ? "border-accent bg-accent/10 text-accent-deep"
                          : "border-line bg-canvas-raised text-ink-faint hover:bg-canvas-sunken"
                      }`}
                    >
                      Prefer to avoid
                    </button>
                    <button
                      type="button"
                      onClick={() => setSeverity(d.type, "hard")}
                      className={`focus-ring rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                        d.severity === "hard"
                          ? "border-red-500 bg-red-50 text-red-700"
                          : "border-line bg-canvas-raised text-ink-faint hover:bg-canvas-sunken"
                      }`}
                    >
                      Must avoid
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {errors.dealbreakers && (
          <p className="mt-2 text-sm text-red-700">{errors.dealbreakers}</p>
        )}
      </section>
    </div>
  );
}
