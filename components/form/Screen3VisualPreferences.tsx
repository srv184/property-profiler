"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { BuyerAnswers, VisualChoice } from "@/types/form";
import { VISUAL_PAIRS } from "@/data/options";

interface Props {
  answers: BuyerAnswers;
  update: (patch: Partial<BuyerAnswers>) => void;
  errors: Record<string, string>;
}

const CHOICE_LABEL: Record<VisualChoice, string> = {
  A: "This one",
  B: "This one",
  both: "Both",
  neither: "Neither",
};

export function Screen3VisualPreferences({ answers, update, errors }: Props) {
  const [index, setIndex] = useState(0);
  const pair = VISUAL_PAIRS[index];
  const currentChoice = answers.visual[pair.id];

  const setChoice = (choice: VisualChoice) => {
    update({
      visual: { ...answers.visual, [pair.id]: choice },
    });
  };

  const goNext = () => setIndex((i) => Math.min(VISUAL_PAIRS.length - 1, i + 1));
  const goPrev = () => setIndex((i) => Math.max(0, i - 1));

  return (
    <div>
      <h2 className="mb-1 font-serif text-[22px] text-ink">
        A quick visual read
      </h2>
      <p className="mb-6 text-sm text-ink-faint">
        Trust your gut — there are no right answers. {pair.question}
      </p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {(["A", "B"] as const).map((side) => {
          const opt = side === "A" ? pair.optionA : pair.optionB;
          const selected = currentChoice === side;
          return (
            <button
              key={side}
              type="button"
              onClick={() => setChoice(side)}
              aria-pressed={selected}
              className={`focus-ring group relative aspect-[4/3] overflow-hidden rounded-xl2 border-2 transition-all duration-200 ${
                selected
                  ? "border-accent shadow-raised"
                  : "border-transparent hover:border-line"
              }`}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${opt.gradient} transition-transform duration-500 ${
                  selected ? "scale-105" : "group-hover:scale-105"
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-black/10" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <span className="text-[15px] font-medium text-white drop-shadow">
                  {opt.label}
                </span>
              </div>
              {selected && (
                <div className="absolute right-3 top-3 rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-ink shadow-card">
                  Selected
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex justify-center gap-2.5">
        {(["both", "neither"] as const).map((choice) => (
          <button
            key={choice}
            type="button"
            onClick={() => setChoice(choice)}
            className={`focus-ring rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
              currentChoice === choice
                ? "border-accent bg-accent/10 text-accent-deep"
                : "border-line bg-canvas-raised text-ink-faint hover:bg-canvas-sunken"
            }`}
          >
            {CHOICE_LABEL[choice]}
          </button>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={goPrev}
          disabled={index === 0}
          aria-label="Previous pair"
          className="focus-ring flex items-center gap-1 rounded-full p-2 text-ink-faint transition-colors hover:bg-canvas-sunken hover:text-ink disabled:cursor-not-allowed disabled:opacity-30"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="flex gap-2" aria-label={`Pair ${index + 1} of ${VISUAL_PAIRS.length}`}>
          {VISUAL_PAIRS.map((p, i) => (
            <button
              key={p.id}
              type="button"
              aria-label={`Go to pair ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-2 w-2 rounded-full transition-all ${
                i === index
                  ? "w-5 bg-accent"
                  : answers.visual[p.id]
                    ? "bg-accent-soft"
                    : "bg-line"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={goNext}
          disabled={index === VISUAL_PAIRS.length - 1}
          aria-label="Next pair"
          className="focus-ring flex items-center gap-1 rounded-full p-2 text-ink-faint transition-colors hover:bg-canvas-sunken hover:text-ink disabled:cursor-not-allowed disabled:opacity-30"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {errors.visual && (
        <p className="mt-4 text-center text-sm text-red-700">{errors.visual}</p>
      )}
    </div>
  );
}
