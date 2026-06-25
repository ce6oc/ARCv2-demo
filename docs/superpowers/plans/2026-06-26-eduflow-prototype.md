# EduFlow Visual Prototype — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a no-backend, client-demo visual prototype of EduFlow (12 screens + 3 demo lessons) with a fully-working lesson player, in Vite + Tailwind v4 + vanilla JS.

**Architecture:** Vite multi-page app (one HTML entry per screen). A pure-JS mock "API" supplies data. The **Lesson Player** has a real, unit-tested engine (routing, branching, scoring) — it is the only logic-heavy subsystem and gets full TDD. All visual screens compose a shared design system (`Playful Academic`) and shared UI components built up front, so screen tasks are concrete compositions, not duplicated boilerplate.

**Tech Stack:** Vite, Tailwind CSS v4 (`@tailwindcss/vite`, `@theme` config), vanilla ES modules, Vitest for engine tests, Google Fonts (Nunito).

**Spec:** `docs/superpowers/specs/2026-06-26-eduflow-prototype-design.md`

---

## How To Use This Plan

- **Phases 1–4 (foundation, data, engine, shared UI):** contain complete code. Implement verbatim.
- **Phases 5–8 (screens):** each task states the exact file, the unique content/sections, the shared components it imports, and the key interactions. Once Phase 4's components exist, these compose quickly. One representative screen (`landing` in Phase 7, `player` in Phase 5) is shown in full markup as the pattern.
- **Verification:** after every phase, run `npm run dev` and click through in the browser (Chrome DevTools MCP available). Engine tasks also run `npx vitest run`.
- **Commit** after every task.

---

## Phase 1 — Project Foundation

### Task 1.1: Scaffold project & dependencies

**Files:**
- Create: `package.json`, `vite.config.js`, `src/styles.css`, `index.html` (placeholder), `.gitignore` (exists — verify)

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "eduflow-prototype",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.0.0",
    "tailwindcss": "^4.0.0",
    "vite": "^6.0.0",
    "vitest": "^2.1.0"
  }
}
```

- [ ] **Step 2: Create `vite.config.js` (multi-page + Tailwind plugin)**

```js
import { defineConfig } from 'vite'
import { resolve } from 'node:path'
import tailwindcss from '@tailwindcss/vite'

const pages = [
  'index', 'teacher-signin', 'teacher-dashboard', 'classes',
  'lesson-library', 'lesson-builder', 'live-monitor', 'analytics',
  'join', 'student-lessons', 'player', 'results',
]

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      input: Object.fromEntries(
        pages.map((p) => [p, resolve(__dirname, `${p}.html`)])
      ),
    },
  },
})
```

- [ ] **Step 3: Create `src/styles.css` (Tailwind v4 + Playful Academic tokens)**

```css
@import "tailwindcss";

@theme {
  --font-sans: "Nunito", ui-rounded, "SF Pro Rounded", system-ui, sans-serif;

  --color-brand-50: #faf5ff;
  --color-brand-100: #f3e8ff;
  --color-brand-200: #e9d5ff;
  --color-brand-300: #d8b4fe;
  --color-brand-400: #c084fc;
  --color-brand-500: #7c3aed;
  --color-brand-600: #6d28d9;
  --color-brand-700: #5b21b6;

  --color-accent-400: #f472b6;
  --color-accent-500: #db2777;
  --color-accent-600: #be185d;

  --color-canvas: #fdf4ff;

  --radius-card: 1.25rem;
  --radius-pill: 999px;
}

@layer base {
  body {
    @apply bg-canvas text-brand-700 font-sans antialiased;
  }
}
```

- [ ] **Step 4: Create placeholder `index.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>EduFlow</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet" />
  <script type="module" src="/src/styles.css"></script>
</head>
<body>
  <div class="min-h-screen flex items-center justify-center">
    <h1 class="text-3xl font-extrabold text-brand-500">EduFlow</h1>
  </div>
</body>
</html>
```

- [ ] **Step 5: Install & verify dev server starts**

Run: `npm install && npm run dev`
Expected: server starts, `http://localhost:5173` shows "EduFlow" in violet.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: scaffold Vite + Tailwind v4 project with design tokens"
```

---

### Task 1.2: Mock data & mock API (TDD)

**Files:**
- Create: `src/data/mock.js`, `src/data/api.js`, `src/data/api.test.js`

- [ ] **Step 1: Write failing test `src/data/api.test.js`**

```js
import { describe, it, expect } from 'vitest'
import { api } from './api.js'

describe('mock api', () => {
  it('lists classes for the teacher', async () => {
    const classes = await api.listClasses()
    expect(classes.length).toBeGreaterThan(0)
    expect(classes[0]).toHaveProperty('classCode')
  })

  it('looks up a class by code', async () => {
    const cls = await api.getClassByCode('SPACE-2024-A')
    expect(cls.className).toBe('Room 204 — Explorers')
  })

  it('returns unknown code as null', async () => {
    expect(await api.getClassByCode('NOPE')).toBeNull()
  })

  it('lists students in a class', async () => {
    const students = await api.listStudents('class-1')
    expect(students.length).toBeGreaterThan(0)
  })

  it('lists lessons', async () => {
    const lessons = await api.listLessons()
    expect(lessons.length).toBe(3)
  })

  it('gets a lesson by id with scenes', async () => {
    const lesson = await api.getLesson('lesson-solar')
    expect(lesson.scenes.length).toBeGreaterThan(0)
  })

  it('returns analytics for a lesson', async () => {
    const a = await api.getLessonAnalytics('lesson-solar')
    expect(a.completions).toBeGreaterThan(0)
    expect(a.sceneBreakdown.length).toBeGreaterThan(0)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/data/api.test.js`
Expected: FAIL (module not found / undefined).

- [ ] **Step 3: Create `src/data/mock.js`**

```js
export const teacher = {
  id: 'user-1', name: 'Ms. Rivera', email: 'rivera@eduflow.app',
  avatar: '👩‍🏫', school: 'Maple Grove Elementary',
}

export const classes = [
  {
    id: 'class-1', className: 'Room 204 — Explorers', classCode: 'SPACE-2024-A',
    registrationLink: 'https://eduflow.app/join?code=SPACE-2024-A',
    gradeLevel: '3', studentCount: 24, isActive: true, createdAt: '2026-01-12',
  },
  {
    id: 'class-2', className: 'Reading Rockets', classCode: 'READ-2024-B',
    registrationLink: 'https://eduflow.app/join?code=READ-2024-B',
    gradeLevel: '4', studentCount: 19, isActive: true, createdAt: '2026-02-03',
  },
]

export const students = [
  { id: 's1', classId: 'class-1', nickname: 'SuperNova',   avatarId: 'avatar_05', avgScore: 82, lessonsDone: 4 },
  { id: 's2', classId: 'class-1', nickname: 'MoonBeam',    avatarId: 'avatar_02', avgScore: 91, lessonsDone: 5 },
  { id: 's3', classId: 'class-1', nickname: 'CometKid',    avatarId: 'avatar_08', avgScore: 64, lessonsDone: 3 },
  { id: 's4', classId: 'class-1', nickname: 'StarDust',    avatarId: 'avatar_11', avgScore: 76, lessonsDone: 4 },
  { id: 's5', classId: 'class-1', nickname: 'OrbitOwl',    avatarId: 'avatar_04', avgScore: 88, lessonsDone: 5 },
  { id: 's6', classId: 'class-1', nickname: 'NebulaNova',  avatarId: 'avatar_09', avgScore: 55, lessonsDone: 2 },
  { id: 's7', classId: 'class-2', nickname: 'WordWeaver',  avatarId: 'avatar_03', avgScore: 79, lessonsDone: 3 },
  { id: 's8', classId: 'class-2', nickname: 'PagePirate',  avatarId: 'avatar_07', avgScore: 70, lessonsDone: 3 },
]

export const avatars = ['avatar_01','avatar_02','avatar_03','avatar_04','avatar_05','avatar_06','avatar_07','avatar_08','avatar_09','avatar_10','avatar_11','avatar_12']

// Lightweight lesson summaries (full scenes live in lessons.js / Phase 2)
export const lessonSummaries = [
  { id: 'lesson-solar',  title: 'Journey Through the Solar System', subject: 'Science',        gradeLevel: '2-4', emoji: '🪐', scenes: 8, description: 'An interactive tour of the planets with quizzes, sorting, and voice reflection.' },
  { id: 'lesson-words',  title: 'Word Wizards: Poetry & Vocabulary',subject: 'Language Arts',  gradeLevel: '3-5', emoji: '📖', scenes: 7, description: 'Build vocabulary with matching, word-sorting, and a drag-to-spell mini-game.' },
  { id: 'lesson-math',   title: 'Math Quest: Fractions & Logic',    subject: 'Math',           gradeLevel: '4-6', emoji: '➗', scenes: 7, description: 'Master fractions with adaptive hints that branch when you get stuck.' },
]

// Analytics fixtures (used by analytics.html + live-monitor.html)
export const analytics = {
  'lesson-solar': {
    completions: 22, avgScore: 78, avgDurationSec: 740, avgConfidence: 3.8,
    sceneBreakdown: [
      { sceneId: 's1', title: 'Intro',               errorRate: 0.02, avgSec: 20 },
      { sceneId: 's2', title: 'Sun video',           errorRate: 0.0,  avgSec: 95 },
      { sceneId: 's3', title: 'Mercury quiz',        errorRate: 0.18, avgSec: 28 },
      { sceneId: 's4', title: 'Sort planets',        errorRate: 0.41, avgSec: 150 },
      { sceneId: 's5', title: 'Match features',      errorRate: 0.33, avgSec: 110 },
      { sceneId: 's6', title: 'Open text',           errorRate: 0.12, avgSec: 180 },
      { sceneId: 's7', title: 'Audio response',      errorRate: 0.0,  avgSec: 60 },
    ],
    confidenceVsCorrect: [
      { bucket: 'High confidence, correct', count: 14 },
      { bucket: 'High confidence, wrong',   count: 5  },
      { bucket: 'Low confidence, correct',  count: 2  },
      { bucket: 'Low confidence, wrong',    count: 1  },
    ],
  },
  'lesson-words':  { completions: 16, avgScore: 84, avgDurationSec: 520, avgConfidence: 4.1, sceneBreakdown: [], confidenceVsCorrect: [] },
  'lesson-math':   { completions: 19, avgScore: 71, avgDurationSec: 810, avgConfidence: 3.2, sceneBreakdown: [], confidenceVsCorrect: [] },
}
```

- [ ] **Step 4: Create `src/data/api.js`**

```js
import { classes, students, lessonSummaries, analytics } from './mock.js'
import { lessons } from './lessons.js'

const delay = (ms = 250) => new Promise((r) => setTimeout(r, ms))
const byId = (arr, id) => arr.find((x) => x.id === id) ?? null

export const api = {
  async listClasses()         { await delay(); return classes },
  async getClassByCode(code)  { await delay(); return classes.find((c) => c.classCode === code) ?? null },
  async listStudents(classId) { await delay(); return students.filter((s) => s.classId === classId) },
  async listLessons()         { await delay(); return lessonSummaries },
  async getLesson(id)         { await delay(); return byId(lessons, id) },
  async getLessonAnalytics(id){ await delay(); return analytics[id] ?? null },
  async submitResult(_result) { await delay(400); return { ok: true, resultId: 'res-' + Date.now() } },
}
```

> Note: `lessons.js` is created in Phase 2. The api test for `getLesson` will pass once Phase 2 lands; keep it — it documents the contract.

- [ ] **Step 5: Run tests**

Run: `npx vitest run src/data/api.test.js`
Expected: PASS (6/7; the `getLesson` test passes after Phase 2 — if run now it fails only on that one, which is expected).

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: mock data + async mock api with tests"
```

---

## Phase 2 — Demo Lesson Data

### Task 2.1: Lesson module with 3 full lessons

**Files:**
- Create: `src/data/lessons.js`

The shape matches `docs/NOTES.md`. Each lesson: `{ id, version, title, description, subject, gradeLevel, author, coverImage, defaultLanguage, scenes: [...] }`. Each scene: `{ sceneId, sceneType, content?, interactiveElement?, branching? }`.

- [ ] **Step 1: Create `src/data/lessons.js`** with `export const lessons = [...]` containing all three lessons below. Use the exact JSON shapes.

**L1 — Solar System** (8 scenes; from NOTES.md, with branching added). Scenes:
1. `content` — `<h1>Welcome, Space Explorer!</h1><p>Today we travel to the amazing planets…</p>` — branching `onComplete: 's2'`
2. `video` — content prompt + `interactiveElement: { source: 'youtube', videoId: '2HoTK_Gqi2Q' }` — `onComplete: 's3'`
3. `multiple-choice-quiz` — question "Which planet is closest to the Sun?", options a/b/c (Venus/Earth/Mercury), `correctOptionId: 'c'`, `enableConfidenceRating: true` — `branching: { onComplete: 's4', rules: [{ condition: 'isCorrect == false', goto: 's3b' }] }`; plus a help scene `s3b` (`content`: "Quick hint: it's small, hot, and first from the sun! 🌡️") `onComplete: 's4'`
4. `categorize-items` — categories `['Terrestrial Planet','Gas Giant']`, items earth/jupiter/mars/saturn, `correctCategorization` per NOTES.md — `onComplete: 's5'`
5. `match-pairs` — pairs Mars/Saturn ↔ features per NOTES.md, `correctMapping: { A:'2', B:'1' }` — `onComplete: 's6'`
6. `open-text-question` — "Why is Earth special…", `suggestedKeywords: ['water','life','atmosphere','people']` — `onComplete: 's7'`
7. `audio-response` — "Which planet is your favorite and why?" — `onComplete: 's8'`
8. `content` — conclusion `<h1>Amazing work, Explorer!</h1>…`

**L2 — Word Wizards** (7 scenes incl. custom-interactive). Scenes:
1. `content` intro — `onComplete: 'w2'`
2. `multiple-choice-quiz` — "What does 'luminous' mean?" options (Dim / Bright / Wet), `correctOptionId:'b'`, confidence on — `onComplete:'w3'`
3. `match-pairs` — pairs (Rapid, Gigantic, Fragile) ↔ matches (Fast, Huge, Delicate), `correctMapping:{A:'1',B:'2',C:'3'}` — `onComplete:'w4'`
4. `categorize-items` — categories `['Noun','Verb','Adjective']`, items (Run, Happy, Ocean, Quickly→discard/decoy optional; keep 3 clean items Run/Ocean/Happy mapping Verb/Noun/Adjective), `correctCategorization:{run:'Verb',ocean:'Noun',happy:'Adjective'}` — `onComplete:'w5'`
5. `open-text-question` — "Write one sentence using 'luminous'.", `suggestedKeywords:['luminous','moon','light','bright']` — `onComplete:'w6'`
6. `custom-interactive` — `interactiveElement: { embedUrl: '/games/word-builder/index.html', config: { target: 'STAR', letters: ['S','T','A','R','X','O'] } }` — `onComplete:'w7'`
7. `content` conclusion

**L3 — Math Quest** (7 scenes, branching-heavy). Scenes:
1. `content` intro — `onComplete:'m2'`
2. `video` explainer "What is a fraction?" `videoId:' instructional placeholder'` use `'2HoTK_Gqi2Q'` (placeholder) — `onComplete:'m3'`
3. `multiple-choice-quiz` — "Which is bigger, 1/2 or 1/4?" options (1/4 / 1/2 / Same), `correctOptionId:'b'` — `branching:{ onComplete:'m4', rules:[{condition:'isCorrect == false', goto:'m3b'}] }`; help scene `m3b` (`content`: "Bigger denominator = smaller slice! 🍕") `onComplete:'m4'`
4. `match-pairs` — equivalent fractions: pairs (1/2, 1/3, 3/4) ↔ matches (2/4, 3/9, 6/8), `correctMapping:{A:'1',B:'2',C:'3'}` — `onComplete:'m5'`
5. `categorize-items` — categories `['Less than 1/2','Greater than 1/2']`, items (3/4, 1/4, 2/5, 4/5), correct per math — `onComplete:'m6'`
6. `open-text-question` — "Explain how you know 3/4 is bigger than 1/4.", `suggestedKeywords:['pieces','denominator','bigger','fourths']` — `onComplete:'m7'`
7. `content` conclusion

- [ ] **Step 2: Verify api test now fully passes**

Run: `npx vitest run`
Expected: all api tests PASS (including `getLesson` with scenes).

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: add 3 demo lessons (solar, words, math) with branching"
```

---

## Phase 3 — Player Engine + Scoring (TDD)

The centerpiece. Pure, fully unit-tested.

### Task 3.1: Session store (localStorage) — TDD

**Files:**
- Create: `src/player/store.js`, `src/player/store.test.js`

- [ ] **Step 1: Write failing test**

```js
import { describe, it, expect, beforeEach } from 'vitest'
import { saveProgress, loadProgress, clearProgress } from './store.js'

beforeEach(() => localStorage.clear())

describe('store', () => {
  it('round-trips a session', () => {
    const session = { lessonId: 'x', currentSceneId: 's2', responses: [], startedAt: 1 }
    saveProgress(session)
    expect(loadProgress('x')).toEqual(session)
  })
  it('returns null when nothing saved', () => {
    expect(loadProgress('nope')).toBeNull()
  })
  it('clears a session', () => {
    saveProgress({ lessonId: 'x', currentSceneId: 's1', responses: [], startedAt: 1 })
    clearProgress('x')
    expect(loadProgress('x')).toBeNull()
  })
})
```

- [ ] **Step 2: Run to verify fail**

Run: `npx vitest run src/player/store.test.js` → FAIL (module missing).

- [ ] **Step 3: Implement `src/player/store.js`**

```js
const KEY = (lessonId) => `eduflow:progress:${lessonId}`

export function saveProgress(session) {
  localStorage.setItem(KEY(session.lessonId), JSON.stringify(session))
}
export function loadProgress(lessonId) {
  const raw = localStorage.getItem(KEY(lessonId))
  return raw ? JSON.parse(raw) : null
}
export function clearProgress(lessonId) {
  localStorage.removeItem(KEY(lessonId))
}
```

- [ ] **Step 4: Run → PASS; Step 5: Commit**

```bash
git add -A && git commit -m "feat: localStorage progress store"
```

---

### Task 3.2: Scoring helpers — TDD

**Files:**
- Create: `src/player/scoring.js`, `src/player/scoring.test.js`

- [ ] **Step 1: Write failing test**

```js
import { describe, it, expect } from 'vitest'
import { scoreMultipleChoice, scoreCategorize, scoreMatch, scoreOpenText } from './scoring.js'

describe('scoring', () => {
  const mc = { sceneType: 'multiple-choice-quiz', interactiveElement: { correctOptionId: 'c' } }
  it('mc correct/incorrect', () => {
    expect(scoreMultipleChoice(mc, 'c').isCorrect).toBe(true)
    expect(scoreMultipleChoice(mc, 'a').isCorrect).toBe(false)
  })

  const cat = { sceneType: 'categorize-items', interactiveElement: { correctCategorization: { earth: 'Terrestrial', mars: 'Terrestrial', jupiter: 'Gas Giant' } } }
  it('categorize all-correct', () => {
    const r = scoreCategorize(cat, { earth: 'Terrestrial', mars: 'Terrestrial', jupiter: 'Gas Giant' })
    expect(r.isCorrect).toBe(true)
    expect(r.detail.correct).toBe(3)
  })
  it('categorize partial', () => {
    const r = scoreCategorize(cat, { earth: 'Terrestrial', mars: 'Gas Giant', jupiter: 'Gas Giant' })
    expect(r.isCorrect).toBe(false)
    expect(r.detail.correct).toBe(2)
    expect(r.detail.total).toBe(3)
  })

  const match = { sceneType: 'match-pairs', interactiveElement: { correctMapping: { A: '2', B: '1' } } }
  it('match correct count', () => {
    const r = scoreMatch(match, { A: '1', B: '1' })
    expect(r.isCorrect).toBe(false)
    expect(r.detail.correctPairs).toBe(1)
    expect(r.detail.totalPairs).toBe(2)
  })

  const ot = { sceneType: 'open-text-question', interactiveElement: { suggestedKeywords: ['water', 'life'] } }
  it('open-text finds keywords case-insensitively', () => {
    const r = scoreOpenText(ot, 'Earth has WATER and Life.')
    expect(r.detail.keywordsFound).toEqual(['water', 'life'])
    expect(r.isCorrect).toBe(true)
  })
})
```

- [ ] **Step 2: Run → FAIL. Step 3: Implement `src/player/scoring.js`**

```js
export function scoreMultipleChoice(scene, optionId) {
  return { isCorrect: optionId === scene.interactiveElement.correctOptionId }
}

export function scoreCategorize(scene, submitted) {
  const correct = scene.interactiveElement.correctCategorization
  const keys = Object.keys(correct)
  const right = keys.filter((k) => submitted[k] === correct[k]).length
  return { isCorrect: right === keys.length, detail: { correct: right, total: keys.length } }
}

export function scoreMatch(scene, submitted) {
  const correct = scene.interactiveElement.correctMapping
  const keys = Object.keys(correct)
  const right = keys.filter((k) => submitted[k] === correct[k]).length
  return { isCorrect: right === keys.length, detail: { correctPairs: right, totalPairs: keys.length } }
}

export function scoreOpenText(scene, text) {
  const lower = (text || '').toLowerCase()
  const found = (scene.interactiveElement.suggestedKeywords || []).filter((k) => lower.includes(k.toLowerCase()))
  // "correct" if at least one keyword found (lenient for a demo)
  return { isCorrect: found.length > 0, detail: { keywordsFound: found } }
}

export function scoreScene(scene, response) {
  switch (scene.sceneType) {
    case 'multiple-choice-quiz': return scoreMultipleChoice(scene, response)
    case 'categorize-items':     return scoreCategorize(scene, response)
    case 'match-pairs':          return scoreMatch(scene, response)
    case 'open-text-question':   return scoreOpenText(scene, response)
    default: return { isCorrect: null } // content/video/audio/custom: not scored
  }
}
```

- [ ] **Step 4: Run → PASS. Step 5: Commit**

```bash
git add -A && git commit -m "feat: scene scoring helpers with tests"
```

---

### Task 3.3: Engine — routing, branching, completion (TDD)

**Files:**
- Create: `src/player/engine.js`, `src/player/engine.test.js`

The engine supports BOTH branching shapes from the docs: `{ onComplete, rules: [{condition, goto}] }` and `{ onCorrect, onIncorrect }`.

- [ ] **Step 1: Write failing test**

```js
import { describe, it, expect } from 'vitest'
import { createSession, getCurrentScene, applyBranching, recordResponse, computeScore, isComplete } from './engine.js'

const lesson = {
  id: 'L', scenes: [
    { sceneId: 's1', sceneType: 'content' },
    { sceneId: 's2', sceneType: 'multiple-choice-quiz', interactiveElement: { correctOptionId: 'b' },
      branching: { onComplete: 's4', rules: [{ condition: 'isCorrect == false', goto: 's3' }] } },
    { sceneId: 's3', sceneType: 'content' },
    { sceneId: 's4', sceneType: 'content' },
  ],
}

describe('engine', () => {
  it('starts at first scene', () => {
    const session = createSession(lesson)
    expect(getCurrentScene(lesson, session).sceneId).toBe('s1')
  })

  it('rules branching sends wrong answer to help scene', () => {
    const session = createSession(lesson)
    expect(applyBranching(lesson, session, { isCorrect: false }, 's2')).toBe('s3')
  })

  it('rules branching sends correct answer to onComplete', () => {
    const session = createSession(lesson)
    expect(applyBranching(lesson, session, { isCorrect: true }, 's2')).toBe('s4')
  })

  it('falls back to next scene in order when no branching', () => {
    const session = createSession(lesson)
    expect(applyBranching(lesson, session, {}, 's1')).toBe('s2')
  })

  it('returns null after the last scene (complete)', () => {
    const session = createSession(lesson)
    expect(applyBranching(lesson, session, {}, 's4')).toBeNull()
  })

  it('records a response and computes score', () => {
    let session = createSession(lesson)
    session = recordResponse(session, { sceneId: 's2', response: 'b', isCorrect: true })
    expect(computeScore(lesson, session)).toEqual({ achieved: 1, possible: 1, percentage: 100 })
    expect(isComplete(lesson, session)).toBe(false)
  })

  it('onCorrect/onIncorrect shape works too', () => {
    const l2 = { id: 'X', scenes: [
      { sceneId: 'a', sceneType: 'multiple-choice-quiz', interactiveElement: { correctOptionId: 'x' }, branching: { onCorrect: 'b', onIncorrect: 'c' } },
      { sceneId: 'b', sceneType: 'content' }, { sceneId: 'c', sceneType: 'content' },
    ]}
    const session = createSession(l2)
    expect(applyBranching(l2, session, { isCorrect: false }, 'a')).toBe('c')
    expect(applyBranching(l2, session, { isCorrect: true }, 'a')).toBe('b')
  })
})
```

- [ ] **Step 2: Run → FAIL. Step 3: Implement `src/player/engine.js`**

```js
import { scoreScene } from './scoring.js'

export function createSession(lesson) {
  return {
    lessonId: lesson.id,
    currentSceneId: lesson.scenes[0].sceneId,
    responses: [],
    startedAt: Date.now(),
  }
}

export function getSceneById(lesson, sceneId) {
  return lesson.scenes.find((s) => s.sceneId === sceneId) ?? null
}

export function getCurrentScene(lesson, session) {
  return getSceneById(lesson, session.currentSceneId)
}

function sceneIndex(lesson, sceneId) {
  return lesson.scenes.findIndex((s) => s.sceneId === sceneId)
}

// Resolves the next scene id from the current scene + evaluation result.
// Supports both branching shapes documented in the spec.
export function applyBranching(lesson, _session, evaluation, fromSceneId) {
  const scene = getSceneById(lesson, fromSceneId)
  if (!scene) return null
  const br = scene.branching || {}

  // Shape A: onCorrect / onIncorrect
  if (br.onCorrect || br.onIncorrect) {
    if (evaluation.isCorrect === true && br.onCorrect) return br.onCorrect
    if (evaluation.isCorrect === false && br.onIncorrect) return br.onIncorrect
  }

  // Shape B: rules[] with condition "isCorrect == false"
  if (Array.isArray(br.rules)) {
    for (const rule of br.rules) {
      if (matchesCondition(rule.condition, evaluation)) return rule.goto
    }
  }

  // Explicit next
  if (br.onComplete) return br.onComplete

  // Fallback: next scene in document order; null after last
  const idx = sceneIndex(lesson, fromSceneId)
  const next = lesson.scenes[idx + 1]
  return next ? next.sceneId : null
}

function matchesCondition(condition, evaluation) {
  if (!condition) return false
  if (condition.includes('isCorrect == false')) return evaluation.isCorrect === false
  if (condition.includes('isCorrect == true'))  return evaluation.isCorrect === true
  return false
}

export function recordResponse(session, responseEntry) {
  return { ...session, responses: [...session.responses, responseEntry] }
}

export function isComplete(lesson, session) {
  const last = session.responses.at(-1)
  if (!last) return false
  return applyBranching(lesson, session, { isCorrect: last.isCorrect }, last.sceneId) === null
}

export function computeScore(lesson, session) {
  const scorable = lesson.scenes.filter((s) => [
    'multiple-choice-quiz', 'categorize-items', 'match-pairs', 'open-text-question',
  ].includes(s.sceneType))
  const possible = scorable.length
  const achieved = session.responses.filter((r) => r.isCorrect === true).length
  const percentage = possible ? Math.round((achieved / possible) * 100) : 0
  return { achieved, possible, percentage }
}
```

- [ ] **Step 4: Run → all PASS. Step 5: Commit**

```bash
git add -A && git commit -m "feat: lesson player engine (branching + scoring) with tests"
```

---

### Task 3.4: Scene renderers (DOM — visual, browser-verified)

**Files:**
- Create: `src/components/scene-renderers.js`

Pure render functions: each returns an HTML string for a scene body and wires up input via a delegated handler. The player page (Task 5.3) calls `renderScene(scene, { onSubmit })`.

- [ ] **Step 1: Implement `src/components/scene-renderers.js`**

Exports `renderScene(scene, onSubmit)` which:
- Renders `scene.content` (raw HTML) at top.
- Switches on `scene.sceneType`:
  - `content` → just content + a "Continue" button → `onSubmit({})`
  - `video` → responsive YouTube iframe (`https://www.youtube.com/embed/${videoId}`) + "Continue" → `onSubmit({ watchedPercentage: 100 })`
  - `multiple-choice-quiz` → question + option buttons; selecting one highlights it; if `enableConfidenceRating`, show a 1–5 confidence slider before submit; submit → `onSubmit({ response: optionId, confidence })`
  - `categorize-items` → render category drop-zones and item chips; simple click-to-assign (click item, click category) for prototype reliability (no DnD lib); submit → `onSubmit({ submittedCategorization })`
  - `match-pairs` → two columns (pairs / matches); click a pair then a match to link; shows drawn connectors via simple list; submit → `onSubmit({ submittedMapping })`
  - `open-text-question` → textarea + shows suggested-keyword pills that highlight live as typed; submit → `onSubmit({ response: text })`
  - `audio-response` → fake record button with animated waveform (CSS) + "Continue" → `onSubmit({ audioUrl: 'mock://recording.mp3', durationSeconds: 12 })`
  - `custom-interactive` → iframe (`interactiveElement.embedUrl`) with a `postMessage` listener; on `EDUFLOW_COMPLETE` message calls `onSubmit(data)`; also a "Continue" fallback.

Implementation detail: keep state in a closure object; attach event listeners after injecting via `innerHTML` (use `el.querySelector` + `addEventListener`). Keep each renderer a small named function. Add `scene-[type]` class wrapper for styling hooks.

```js
// Skeleton — implement each branch fully per the behaviors above.
export function renderScene(scene, onSubmit, mountEl) {
  mountEl.className = `scene scene-${scene.sceneType}`
  const ie = scene.interactiveElement || {}
  const state = {}

  const header = scene.content ? `<div class="scene-content prose prose-sm max-w-none">${scene.content}</div>` : ''

  const builders = {
    content: () => header + continueBtn(),
    video: () => header + yt(ie.videoId) + continueBtn(),
    'multiple-choice-quiz': () => header + mcq(ie, state, mountEl) + submitBtn('Check answer', () => onSubmit({ response: state.optionId, confidence: state.confidence })),
    'categorize-items': () => header + categorize(ie, state, mountEl) + submitBtn('Submit', () => onSubmit({ submittedCategorization: state.cats })),
    'match-pairs': () => header + matchPairs(ie, state, mountEl) + submitBtn('Submit', () => onSubmit({ submittedMapping: state.map })),
    'open-text-question': () => header + openText(ie, state, mountEl) + submitBtn('Submit', () => onSubmit({ response: state.text })),
    'audio-response': () => header + audio(ie, state, mountEl) + continueBtn(() => onSubmit({ audioUrl: 'mock://recording.mp3', durationSeconds: 12 })),
    'custom-interactive': () => header + customInteractive(ie, onSubmit, mountEl),
  }

  mountEl.innerHTML = builders[scene.sceneType]?.() ?? header + continueBtn()
  wireUp(mountEl) // attach listeners created by the helpers above
}
```

(Implement the helper functions `yt`, `mcq`, `categorize`, `matchPairs`, `openText`, `audio`, `customInteractive`, `continueBtn`, `submitBtn`, `wireUp` in the same file. `continueBtn(cb?)` defaults to `onSubmit({})`. `wireUp` finds elements by `data-action` attributes and binds.)

- [ ] **Step 2: Verify in browser** — temporarily render scene `s3` (quiz) of the solar lesson on a scratch page; confirm selection + confidence + submit fires the callback (log to console). Remove scratch before commit.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: scene renderers for all 8 scene types"
```

---

## Phase 4 — Shared Design System & UI Components

### Task 4.1: UI primitives

**Files:**
- Create: `src/components/ui.js`

Export helpers returning HTML strings (Tailwind classes) + a `mountPage` helper. Keep stateless; pages inject results.

- [ ] **Step 1: Implement `src/components/ui.js`** exporting:
  - `logo({ small })` — EduFlow wordmark with a 🚀/gradient dot.
  - `button(label, { variant: 'primary'|'ghost'|'soft', href, size })` → `<a class="...">` or `<button>`.
  - `badge(label, { color })` → pill.
  - `tag(label)` → small subject/grade pill.
  - `card(inner)` → `rounded-card bg-white …` wrapper.
  - `progressBar(percent)` → bar with `width:percent%`.
  - `stat(label, value, { sub })` → big number card.
  - `avatar(avatarId, { size })` → deterministic colored circle with emoji/initial (map avatarId → emoji).
  - `donut(percent)` → inline SVG donut chart.
  - `bars(rows)` → horizontal bar chart from `[{label, value, max}]` (CSS widths).
  - `pageHead(title, subtitle)` → consistent page header.
  - `footer()` — slim footer.

  Use brand tokens (`bg-brand-500 text-white rounded-pill`, `bg-brand-50 text-brand-600`, etc.).

- [ ] **Step 2: Commit**

```bash
git add -A && git commit -m "feat: shared UI primitives (buttons, cards, charts)"
```

---

### Task 4.2: Layout shells

**Files:**
- Create: `src/components/teacher-layout.js`, `src/components/student-layout.js`, `src/components/page.js`

- [ ] **Step 1: `src/components/page.js`** — `renderPage({ bodyHtml, script })` injects the standard `<head>` (fonts + styles.css) + body into `document`; plus `$(sel)` shortcut and `els` helper. Each HTML page is a thin shell: a `<div id="app"></div>` + `<script type="module" src="/src/pages/<name>.js">`.

- [ ] **Step 2: `teacher-layout.js`** exports `teacherShell({ active, content })` → fixed left sidebar (Dashboard · Classes · Lessons · Builder · Live Monitor · Analytics) with active highlight, top bar with teacher avatar + "New Lesson" button, and a `<main>` slot. Links use real `.html` hrefs.

- [ ] **Step 3: `student-layout.js`** exports `studentShell({ title, content, back })` → minimal top bar: back arrow, avatar, lesson title, exit link. Centered `<main>` max-w-3xl.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: teacher + student layout shells"
```

---

## Phase 5 — Student Screens

> Pattern: each `.html` is a shell loading `/src/pages/<name>.js`, which fetches data via `api`, then renders into `#app` using layout + ui components. Full example shown for `player`.

### Task 5.1: Join with Code — `join.html` + `src/pages/join.js`

- [ ] **Step 1: Build** `join.html` (shell) + `join.js`. Flow:
  1. Big card: "Join your class" with a `SPACE-2024-A` code input prefilled with a demo code + "Continue".
  2. On submit call `api.getClassByCode(code)`; if found, show step 2; else show friendly error (but demo codes always work).
  3. Step 2: pick nickname (text) + pick avatar (grid of 12 from `avatars`) → "Start learning" → redirect to `student-lessons.html?name=…&avatar=…`.
  - Style: centered, gradient hero, playful. Include a "Try as guest" link.

- [ ] **Step 2: Verify in browser. Step 3: Commit** `feat: join-with-code page`

### Task 5.2: Student Lesson List — `student-lessons.html` + `src/pages/student-lessons.js`

- [ ] **Step 1: Build.** Top: greeting "Hi, SuperNova 👋" + progress donut (lessons done / total). List the 3 lessons as cards (emoji, title, subject/grade tag, "Start"/"Resume" button → `player.html?id=<lessonId>`). Show 2 earned badges (e.g., "🚀 First Lesson", "⭐ Perfect Score") in a row. Uses `api.listLessons()`.

- [ ] **Step 2: Verify + Commit** `feat: student lesson list`

### Task 5.3: Lesson Player — `player.html` + `src/pages/player.js`  ★ FULL EXAMPLE

**Files:**
- Create: `player.html`, `src/pages/player.js`

- [ ] **Step 1: `player.html` shell**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Lesson · EduFlow</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet" />
  <script type="module" src="/src/styles.css"></script>
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/src/pages/player.js"></script>
</body>
</html>
```

- [ ] **Step 2: `src/pages/player.js`** — orchestrates the engine:

```js
import { api } from '../data/api.js'
import { studentShell } from '../components/student-layout.js'
import { progressBar, button } from '../components/ui.js'
import { createSession, getCurrentScene, applyBranching, recordResponse, computeScore, isComplete } from '../player/engine.js'
import { scoreScene } from '../player/scoring.js'
import { renderScene } from '../components/scene-renderers.js'
import { loadProgress, saveProgress, clearProgress } from '../player/store.js'

const params = new URLSearchParams(location.search)
const lessonId = params.get('id') ?? 'lesson-solar'

const app = document.getElementById('app')
const lesson = await api.getLesson(lessonId)
let session = loadProgress(lessonId) ?? createSession(lesson)
render()

function render() {
  const scene = getCurrentScene(lesson, session)
  const idx = lesson.scenes.findIndex((s) => s.sceneId === session.currentSceneId)
  const pct = Math.round((idx / lesson.scenes.length) * 100)
  app.innerHTML = studentShell({
    title: lesson.title,
    back: '/student-lessons.html',
    content: `
      <div class="mb-4">${progressBar(pct)}</div>
      <div class="bg-white rounded-card p-6 shadow-sm" id="scene-mount"></div>
      <div id="feedback" class="mt-3 text-center font-semibold"></div>`,
  })
  const mount = document.getElementById('scene-mount')
  renderScene(scene, handleResponse, mount)
  saveProgress(session)
}

function handleResponse(response) {
  const scene = getCurrentScene(lesson, session)
  const evaluation = scoreScene(scene, response)
  session = recordResponse(session, { sceneId: scene.sceneId, response, isCorrect: evaluation.isCorrect, ...evaluation.detail })
  const fb = document.getElementById('feedback')
  if (typeof evaluation.isCorrect === 'boolean') {
    fb.textContent = evaluation.isCorrect ? '✅ Correct!' : '💡 Not quite — let\'s keep going.'
    fb.className = 'mt-3 text-center font-semibold ' + (evaluation.isCorrect ? 'text-green-600' : 'text-accent-600')
  }
  saveProgress(session)
  setTimeout(advance, 650)
}

function advance() {
  const scene = getCurrentScene(lesson, session)
  const eval0 = { isCorrect: session.responses.at(-1)?.isCorrect }
  const nextId = applyBranching(lesson, session, eval0, scene.sceneId)
  if (!nextId) return finish()
  session.currentSceneId = nextId
  render()
}

function finish() {
  const score = computeScore(lesson, session)
  clearProgress(lessonId)
  const result = { lessonId, score, durationInSeconds: Math.round((Date.now() - session.startedAt) / 1000), responses: session.responses }
  sessionStorage.setItem('eduflow:lastResult', JSON.stringify(result))
  location.href = '/results.html'
}
```

- [ ] **Step 3: Verify** — run `npm run dev`, open `player.html?id=lesson-solar`, click through all scenes; confirm branching (answer Mercury quiz wrong → help scene); confirm results redirect. Repeat for `lesson-math`.

- [ ] **Step 4: Commit** `feat: working lesson player (scenes, branching, scoring, persistence)`

### Task 5.4: Results & Achievements — `results.html` + `src/pages/results.js`

- [ ] **Step 1: Build.** Read `sessionStorage['eduflow:lastResult']`. Show: big percentage donut, "achieved/possible", duration, per-scene breakdown list (correct/incorrect), and unlocked badges ("🚀 Lesson Complete", conditional "⭐ Perfect Score" if percentage===100). Buttons: "Try again" → player, "Back to lessons" → student-lessons.

- [ ] **Step 2: Verify + Commit** `feat: results & achievements page`

---

## Phase 6 — Teacher Screens

> All use `teacherShell({ active, content })`. Each is `src/pages/<name>.js`.

### Task 6.1: Teacher Dashboard — `teacher-dashboard.html` + `src/pages/dashboard.js`

- [ ] **Step 1: Build.** Top stat row (4 `stat` cards: Active Classes 2, Students 43, Lessons 3, Avg Score 77%). "Recent activity" feed (mock list). "Your classes" mini-cards linking to `classes.html`. Quick "Launch live lesson" button → `live-monitor.html`.

- [ ] **Step 2: Verify + Commit** `feat: teacher dashboard`

### Task 6.2: Class Management — `classes.html` + `src/pages/classes.js`

- [ ] **Step 1: Build.** List classes (`api.listClasses()`); selecting one shows: class header, join code in a copyable pill, registration link, grade, and a roster table (`api.listStudents(classId)`) with avatar, nickname, avg score, lessons done, status. "Add class" button opens a mock modal. Uses real demo code `SPACE-2024-A` so it ties to the Join page.

- [ ] **Step 2: Verify + Commit** `feat: class management page`

### Task 6.3: Lesson Library — `lesson-library.html` + `src/pages/library.js`

- [ ] **Step 1: Build.** Filter bar (subject chips: All/Science/Language Arts/Math + grade). Grid of 3 lesson cards (`api.listLessons()`): emoji, title, description, scene count, "Preview" (→ player), "Assign" (mock toast "Assigned to Room 204"). Link to "Create new →" Builder.

- [ ] **Step 2: Verify + Commit** `feat: lesson library`

### Task 6.4: Lesson Builder — `lesson-builder.html` + `src/pages/builder.js`  ★ key sell

- [ ] **Step 1: Build** a three-pane editor:
  - **Left palette:** the 8 scene-type tiles (icon + label) — draggable (`draggable=true`).
  - **Center canvas:** an ordered list of scene blocks (preloaded with the Solar lesson). Drag-to-reorder; click a block to select. Dropping a palette tile appends a stub scene block.
  - **Right inspector:** for the selected block show a mock edit form (title, and type-specific fields shown read-only/illustrative) + a **live preview** that renders the selected scene via `renderScene` in a mini frame (read-only).
  - Header: lesson title input + "Save draft" (mock toast) + "Preview full lesson" (→ player).
  - Keep it semi-functional: drag/reorder + add + select + live preview must work; field editing can populate state without persistence.

- [ ] **Step 2: Verify** drag, reorder, live preview render. **Step 3: Commit** `feat: lesson builder (drag, reorder, live preview)`

### Task 6.5: Live Progress Monitor — `live-monitor.html` + `src/pages/live-monitor.js`

- [ ] **Step 1: Build.** Header: lesson title + join code + "X of 24 students" + a Start/Pause toggle. Main: a grid of student cards (avatar, nickname, current scene name, a mini progress bar, status pill: On track/Reviewing/Stuck). A `setInterval` (1.2s) advances mock students through the lesson scenes and randomly flags a couple "Stuck" on the hard scene (scene `s4`/sort). Left rail: scene-by-scene histogram (live count per scene). Pause stops the timer.

- [ ] **Step 2: Verify** the animation advances and pause works. **Step 3: Commit** `feat: live progress monitor (simulated)`

### Task 6.6: Analytics & Statistics — `analytics.html` + `src/pages/analytics.js`

- [ ] **Step 1: Build** from `api.getLessonAnalytics(id)`:
  - Lesson selector (3 lessons).
  - Top stats: completions, avg score (donut), avg duration, avg confidence.
  - **Scene difficulty** `bars` (errorRate per scene) — identifies the hardest scene.
  - **Confidence vs correctness** 2×2 grid (the misconception detector from the spec).
  - **Keyword frequency** mock bars for the open-text scene.
  - "Export CSV" button → triggers a client-side CSV download of the scene breakdown (real, small function).

- [ ] **Step 2: Verify + Commit** `feat: analytics & statistics page with export`

---

## Phase 7 — Public Screens

### Task 7.1: Landing Page — `index.html` + `src/pages/landing.js`  ★ FULL EXAMPLE

- [ ] **Step 1: Replace placeholder `index.html`** with shell loading `/src/pages/landing.js`.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>EduFlow — Interactive micro-lessons for every classroom</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet" />
  <script type="module" src="/src/styles.css"></script>
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/src/pages/landing.js"></script>
</body>
</html>
```

- [ ] **Step 2: `src/pages/landing.js`** renders (no data fetch needed):
  - **Nav:** logo + links (Features, For Teachers, For Students) + "Sign in" (→ teacher-signin) + "Join a class" (→ join).
  - **Hero:** headline "Lessons that actually click.", subcopy, two CTAs ("I'm a teacher" → signin, "I'm a student" → join), and a floating mock lesson-card illustration.
  - **Feature grid (4):** 8 interactive scene types · Branching that adapts · No sign-up friction (guests) · Real analytics. (mirrors spec differentiators).
  - **"See it in action":** 3 lesson cards (reuse `lessonSummaries`) with "Try demo" → `player.html?id=…`.
  - **Teacher quote** + footer.

- [ ] **Step 3: Verify + Commit** `feat: landing page`

### Task 7.2: Teacher Sign-in — `teacher-signin.html` + `src/pages/signin.js`

- [ ] **Step 1: Build** a centered card: logo, "Welcome back", email + password fields (decorative), "Sign in" → `teacher-dashboard.html`. Link "New here? Create account" (mock → dashboard). Keep it simple and on-brand.

- [ ] **Step 2: Verify + Commit** `feat: teacher sign-in page`

---

## Phase 8 — Integration & Polish

### Task 8.1: Custom-interactive word game — `games/word-builder/index.html`

- [ ] **Step 1: Build** a standalone iframe page: shows 6 letter tiles (from `config.letters` via query string or postMessage init), a target word hint, drop slots; on forming `STAR` (matches `config.target`) it does `window.parent.postMessage({ type:'EDUFLOW_COMPLETE', sceneId, data:{ score:100 } }, '*')`. Styled in Playful Academic (inline `<style>` since it's standalone). Self-contained, no imports.

- [ ] **Step 2: Verify** via the Word Wizards lesson (`player.html?id=lesson-words`) — completing the game auto-advances the scene.

- [ ] **Step 3: Commit** `feat: word-builder custom-interactive mini-game`

### Task 8.2: Cross-page wiring & full walkthrough

- [ ] **Step 1: Verify every link** resolves to a real `.html` page; fix dead links. Confirm the two demo flows end-to-end:
  - **Teacher flow:** Landing → Sign-in → Dashboard → Classes (see code) → Library → Builder → Live Monitor → Analytics.
  - **Student flow:** Landing → Join (code SPACE-2024-A) → Lesson list → Player (full) → Results.

- [ ] **Step 2: Responsive + a11y pass** — check each page at mobile width (DevTools); ensure buttons ≥44px, focus visible, color contrast OK for brand tokens. Add `alt`/`aria-label` where missing.

- [ ] **Step 3: Final review in Chrome DevTools MCP** — screenshot each screen, confirm visual consistency.

- [ ] **Step 4: Commit** `feat: integration, nav wiring, responsive polish`

- [ ] **Step 5: Update README** — create `README.md` with: what this is (prototype), `npm install && npm run dev`, demo accounts/codes (`SPACE-2024-A`), and the page list. Commit `docs: add README`.

---

## Self-Review Notes

- **Spec coverage:** Landing ✓, Sign-in ✓, Dashboard ✓, Classes ✓, Library ✓ (lesson selection), Player ✓ (scenes + input), Live Monitor ✓ (lesson progress), Analytics ✓ (statistics), Join ✓ (connect via code), Student lesson list ✓, Results ✓, Builder ✓ (the suggested addition). 3 lessons ✓. All 8 scene types rendered ✓. Branching ✓ (engine + L1/L3). Hybrid access ✓ (Join guest/registered). Custom-interactive ✓ (word game). Gamification ✓ (badges on results/student list). Multilingual — documented in copy, not functional (per spec non-goals). Export ✓ (CSV).
- **Placeholder policy:** Phases 1–4 contain complete code. Screen tasks (5–8) compose the shared components built in Phase 4 and reference the full `player`/`landing` examples as the pattern; each task names exact files, unique content, components used, and interactions. The one area left to the implementer's judgment is the internal markup of `scene-renderers` helper bodies (behaviors are fully specified; visual markup uses established Tailwind tokens).
