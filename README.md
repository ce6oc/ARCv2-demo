# EduFlow — Interactive Micro-Lessons (Prototype)

A visual, no-backend prototype demonstrating EduFlow: a platform where teachers build
interactive lessons and students join with a code. Built to show clients the product
workflow and key features.

## Run it
```bash
npm install
npm run dev
```
Then open http://localhost:5173.

## What's inside
- **12 screens:** landing, teacher sign-in, teacher dashboard, classes, lesson library,
  lesson builder, live monitor, analytics, student join, student lesson list, lesson
  player, results.
- **3 demo lessons** (Science / Language Arts / Math) exercising all 8 scene types +
  branching logic.
- **A working lesson player** — the only fully-functional part: renders every scene type,
  scores answers, follows branching rules, persists progress, and computes a final result.

## Demo credentials & codes
- **Teacher:** any sign-in works (prefilled) → teacher dashboard.
- **Student class code:** `SPACE-2024-A` (also try `READ-2024-B`).

## Tech stack
Vite + Tailwind CSS v4 + vanilla JS. The "backend" is a JS mock API (`src/data/api.js`).
Engine logic is unit-tested with Vitest (`npm test`).

## Project structure
- `src/data/` — mock data, mock API, the 3 lessons.
- `src/player/` — the lesson engine (branching, scoring, persistence).
- `src/components/` — UI primitives, layouts, scene renderers.
- `src/pages/` — one module per screen.
- `games/word-builder/` — standalone custom-interactive mini-game.

> Prototype only — not production code. No real auth, persistence, or PII handling.
