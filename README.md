# Buyer DNA — Property Preference Profiling System

A standalone Next.js application that collects ~12 high-value inputs from a
prospective buyer, deterministically derives a much richer structured Buyer
Profile from them, and presents that profile as:

1. A **Buyer DNA** visual (radar chart + score cards + generated summaries)
2. A complete **structured JSON** output suitable as future LLM input

There is exactly **one canonical Buyer Profile**. Both the Buyer DNA UI and
the JSON view read from the same object, produced by
`deriveBuyerProfile()` in `lib/derivation/deriveBuyerProfile.ts`.

```
RawAnswers → deriveBuyerProfile() → CanonicalBuyerProfile
                                        ├── BuyerDNAView
                                        └── JsonView
```

No login, no database, no LLM connection, no property recommendations —
the app is entirely client-side and stops at Buyer DNA + JSON.

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Build

```bash
npm run build
npm run start
```

## Project structure

```
app/                      Next.js App Router entry (layout, page, globals.css)
components/form/          The 4-screen input flow
components/results/       Buyer DNA + JSON results screen
lib/derivation/           The deterministic derivation engine
data/                     Option definitions + scoring configuration
types/                    Strongly typed form + canonical profile shapes
utils/validation.ts       Per-screen validation + a final Zod safety net
```

## Tech

Next.js (App Router) · React · TypeScript · Tailwind CSS · Zod · Recharts ·
lucide-react. No database, no auth, no external APIs.
