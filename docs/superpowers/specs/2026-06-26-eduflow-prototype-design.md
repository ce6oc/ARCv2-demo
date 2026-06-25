# EduFlow — Visual Prototype Design

**Date:** 2026-06-26
**Status:** Approved
**Purpose:** A no-backend visual prototype to demonstrate EduFlow to potential clients — the user workflow and the project's key features. Not production-functional; built to *show*, not to *run for real*.

---

## 1. Goals & Non-Goals

**Goals**
- Demonstrate the full teacher + student workflow end-to-end.
- Showcase the platform's headline feature: the JSON lesson format and its **8 scene types** + **branching logic**.
- Feel polished and "minimalist yet stylish" for client demos.
- Run with a single `npm install && npm run dev`.

**Non-Goals**
- Real authentication, persistence, or multi-user state.
- A real backend/database.
- Production accessibility/compliance (WCAG, COPPA) — out of scope for a demo.
- The AI lesson-generation feature (referenced in spec, not demoed).

---

## 2. Confirmed Decisions

| Decision | Choice |
|---|---|
| UI language | **English** |
| Visual style | **Playful Academic** — warm violet/pink, large radii, rounded sans, friendly-but-polished |
| Tech stack | **Vite + Tailwind + vanilla JS** (multi-page app) |
| Backend | **None** — a JS mock "API" returns Promises from in-memory data. No PHP needed. |
| Scope | **12 screens** + **3 demo lessons** |

---

## 3. The 3 Demo Lessons

Each lesson is a different subject. Together they exercise all 8 scene types and demonstrate branching. Lesson data follows the JSON shape in `docs/NOTES.md`.

| # | Lesson | Subject / Grade | Scenes | Showcases |
|---|---|---|---|---|
| L1 | Journey Through the Solar System | Science · 2–4 | 8 | content, video, MC-quiz (+confidence), categorize, match, open-text, audio-response — the richest lesson (from NOTES.md) |
| L2 | Word Wizards: Poetry & Vocabulary | Language Arts · 3–5 | 7 | match (word→definition), categorize (noun/verb/adj), open-text, **custom-interactive** drag-to-build-a-word game via iframe + `postMessage` bridge |
| L3 | Math Quest: Fractions & Logic | Math · 4–6 | 7 | **branching/remedial routing** (wrong answer → help scene → back), video, equivalent-fraction matching, sort categorizing, explain-reasoning open-text |

**Scene-type coverage matrix** (all 8 + branching = ✓):

| Scene type | L1 | L2 | L3 |
|---|---|---|---|
| content | ✓ | ✓ | ✓ |
| video | ✓ | · | ✓ |
| multiple-choice-quiz | ✓ | ✓ | ✓ |
| categorize-items | ✓ | ✓ | ✓ |
| match-pairs | ✓ | ✓ | ✓ |
| open-text-question | ✓ | ✓ | ✓ |
| audio-response | ✓ | · | · |
| custom-interactive | · | ✓ | · |
| branching logic | ✓ | ✓ | ✓ |

---

## 4. Screen Set (12)

**Public / Marketing**
1. **Landing** — hero, feature highlights, CTAs (teacher sign-in / student join).
2. **Teacher Sign-in** — decorative login screen, entry to dashboard.

**Teacher**
3. **Teacher Dashboard** — overview: classes, active lessons, recent activity, quick stats.
4. **Class Management** — create class, enrolled students, join code & registration link.
5. **Lesson Library** — browse/select/assign the 3 demo lessons; filter by subject & grade.
6. **Lesson Builder** *(key sell)* — drag-and-drop scene editor showing all 8 scene types + live scene preview.
7. **Live Progress Monitor** — real-time view of students moving through a running lesson (per-scene, who's stuck).
8. **Analytics & Statistics** — class/lesson scores, scene-level difficulty, confidence-vs-correctness, export button.

**Student**
9. **Join with Code** — enter class code → nickname + avatar selection (hybrid-access entry).
10. **Student Lesson List** — assigned lessons with progress & badges.
11. **Lesson Player** *(the star)* — scenes change, all 8 interaction types, branching, feedback.
12. **Results & Achievements** — post-lesson score, confidence, earned badges (gamification payoff).

(The custom-interactive game for L2 renders *inside* the Lesson Player via an iframe, not as a separate page.)

---

## 5. Architecture

Vite multi-page app: one HTML entry per screen, shared `src/`.

```
ARCv2-demo/
├── *.html                      12 page entries (vite.config rollupOptions.input)
├── src/
│   ├── styles.css              Tailwind layers + design tokens
│   ├── data/
│   │   ├── lessons.js          3 demo lessons (NOTES.md JSON shape)
│   │   ├── mock.js             fake classes, students, results
│   │   └── api.js              mock backend → Promises w/ simulated latency
│   ├── components/
│   │   ├── ui.js               buttons, cards, badges, progress bars, charts
│   │   └── scene-renderers.js  one renderer per scene type (8)
│   └── player/
│       ├── engine.js           scene routing + branching + scoring
│       └── store.js            localStorage progress persistence
├── games/word-builder/         custom-interactive iframe demo (postMessage bridge)
├── tailwind.config.js
├── vite.config.js
└── package.json
```

**Mock "API" (`src/data/api.js`):** wraps the in-memory data in functions returning `Promise` (with a small `setTimeout` to simulate latency). Keeps page code looking like real async data fetches without a server.

---

## 6. Design System ("Playful Academic")

- **Primary:** violet `#7c3aed` · **Accent:** pink `#db2777`
- **Backgrounds:** soft `#fdf4ff` page bg, white cards
- **Shape:** large radii (16–24px), pill buttons
- **Type:** rounded sans (Nunito via Google Fonts, fallback system-rounded)
- Exposed as Tailwind theme tokens (`colors`, `borderRadius`, `fontFamily`) so every screen stays consistent.

---

## 7. Interactivity Level (how "real" each part is)

| Screen | Level |
|---|---|
| **Lesson Player** | **Fully working** — renders all 8 scene types, accepts input, scores, shows feedback, follows `branching.rules`, persists progress to localStorage, shows final results. |
| **Lesson Builder** | Semi-interactive — drag scenes from a palette, mock "edit", live scene preview. |
| **Analytics** | Real charts (CSS/SVG) computed from mock data; working filters. |
| **Live Monitor** | Simulated — animated fake students advancing through scenes on a JS timer. |
| **Join / Results / Library / Dashboard / Classes / Landing / Sign-in** | Rich static — realistic content, working navigation & hover states, no real data mutation. |

---

## 8. Navigation / Wiring

Top-level nav differs by persona:
- **Teacher pages** share a persistent left sidebar (Dashboard · Classes · Lessons · Builder · Monitor · Analytics) + avatar menu.
- **Student pages** share a minimal top bar (avatar + lesson title + exit).
- Landing CTAs route to `teacher-signin.html` → dashboard, and `join.html` → student flow.
- Lesson Library "Open" and Student Lesson List "Start" both route to `player.html?id=<lessonId>`.

---

## 9. Out of Scope / Deferred

- AI lesson generation (spec Epic 6) — not demoed.
- Real RTL/multilingual switching — UI is English-only (multilingual is mentioned in copy, not functional).
- Audio actually recording/uploading — the audio-response scene simulates a recording UI (waveform animation) without persisting audio.
- Production accessibility audit — basic semantic HTML/keyboard support only.

---

## 10. Open Questions Resolved

- *PHP needed?* No — pure JS mock API (per chosen tech approach).
- *How functional?* Player fully works; rest are realistic mockups (per §7).
- *Lesson subjects?* Solar System / Word Wizards / Math Quest (approved).
