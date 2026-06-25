import { api } from '../data/api.js'
import { teacherShell } from '../components/teacher-layout.js'
import { card, button, badge, avatar, progressBar, esc } from '../components/ui.js'
import { $, $$, app } from '../components/page.js'

const JOIN_CODE = 'SPACE-2024-A'

app().innerHTML =
  '<div class="min-h-screen grid place-items-center text-brand-400 font-semibold">Loading monitor…</div>'

const lesson = await api.getLesson('lesson-solar')
const realStudents = await api.listStudents('class-1')
const scenes = lesson?.scenes || []

const TYPE_LABELS = {
  'content': 'Reading',
  'video': 'Watching',
  'multiple-choice-quiz': 'Quiz',
  'categorize-items': 'Sorting',
  'match-pairs': 'Matching',
  'open-text-question': 'Writing',
  'audio-response': 'Speaking',
  'custom-interactive': 'Activity',
}

function stripTags(html) {
  return String(html || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

function sceneLabel(sc) {
  const h = (sc.content || '').match(/<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/i)
  if (h) { const t = stripTags(h[1]); if (t) return t }
  const p = (sc.content || '').match(/<p[^>]*>([\s\S]*?)<\/p>/i)
  if (p) { const t = stripTags(p[1]); if (t) return t }
  return TYPE_LABELS[sc.sceneType] || sc.sceneType || 'Scene'
}

const hardIndex = (() => {
  const i = scenes.findIndex((s) => s.sceneType === 'categorize-items')
  return i >= 0 ? i : 3
})()

const students = []
realStudents.forEach((s, i) => {
  students.push({
    id: s.id, nickname: s.nickname, avatarId: s.avatarId,
    sceneIndex: Math.floor(Math.random() * Math.max(1, scenes.length)),
    stuckTicks: 0, stuckApplied: false, canStick: i < 2,
  })
})
let n = realStudents.length
while (n < 15) {
  n++
  students.push({
    id: 'mock-' + n,
    nickname: 'AstroKid' + n,
    avatarId: 'avatar_' + String(((n * 3) % 12) + 1).padStart(2, '0'),
    sceneIndex: Math.floor(Math.random() * Math.max(1, scenes.length)),
    stuckTicks: 0, stuckApplied: false, canStick: false,
  })
}

let running = false
let intervalId = null

function tick() {
  students.forEach((st) => {
    if (st.stuckTicks > 0) { st.stuckTicks--; return }
    if (Math.random() < 0.7) st.sceneIndex = (st.sceneIndex + 1) % Math.max(1, scenes.length)
    if (st.sceneIndex === hardIndex && st.canStick && !st.stuckApplied) {
      st.stuckTicks = 3 + Math.floor(Math.random() * 3)
      st.stuckApplied = true
    }
  })
  paint()
}

function start() {
  if (running) return
  running = true
  intervalId = setInterval(tick, 1200)
  updateRunBtn()
}

function pause() {
  running = false
  if (intervalId) { clearInterval(intervalId); intervalId = null }
  updateRunBtn()
}

function statusFor(st) {
  if (scenes.length && st.sceneIndex >= scenes.length - 1) return { label: 'Done', color: 'green' }
  if (st.stuckTicks > 0) return { label: 'Stuck', color: 'accent' }
  const sc = scenes[st.sceneIndex]
  if (sc && sc.sceneType === 'multiple-choice-quiz') return { label: 'Reviewing', color: 'amber' }
  return { label: 'On track', color: 'green' }
}

function studentCard(st) {
  const sc = scenes[st.sceneIndex]
  const label = sc ? sceneLabel(sc) : '—'
  const pct = scenes.length ? Math.round(((st.sceneIndex + 1) / scenes.length) * 100) : 0
  const status = statusFor(st)
  return card(
    '<div class="flex items-center gap-2 mb-2">' +
    avatar(st.avatarId, { size: 'sm' }) +
    '<span class="font-bold text-brand-700 text-sm truncate">' + esc(st.nickname) + '</span>' +
    '</div>' +
    '<p class="text-xs text-brand-400 mb-1 truncate">' + esc(label) + '</p>' +
    '<div class="mb-2">' + progressBar(pct) + '</div>' +
    '<div class="flex items-center justify-between">' +
    '<span class="text-xs text-brand-400">Scene ' + (st.sceneIndex + 1) + '/' + scenes.length + '</span>' +
    badge(status.label, { color: status.color }) +
    '</div>',
    { pad: 'p-4' }
  )
}

function heatmapRows() {
  const counts = scenes.map(() => 0)
  students.forEach((st) => { if (counts[st.sceneIndex] != null) counts[st.sceneIndex]++ })
  const max = Math.max(1, ...counts)
  return scenes.map((sc, i) => {
    const c = counts[i]
    const pct = Math.round((c / max) * 100)
    const hard = i === hardIndex
    return (
      '<div class="mb-2 last:mb-0">' +
      '<div class="flex items-center justify-between mb-0.5">' +
      '<span class="text-xs font-semibold text-brand-700 truncate">' + (i + 1) + '. ' + esc(sceneLabel(sc)) + (hard ? ' ⚠️' : '') + '</span>' +
      '<span class="text-xs font-bold text-brand-500">' + c + '</span>' +
      '</div>' +
      '<div class="h-2 bg-brand-100 rounded-pill"><div class="h-full rounded-pill ' + (hard ? 'bg-accent-500' : 'bg-brand-400') + '" style="width:' + pct + '%"></div></div>' +
      '</div>'
    )
  }).join('')
}

function paint() {
  const grid = $('#monitor-grid')
  if (grid) grid.innerHTML = students.map(studentCard).join('')
  const heat = $('#heatmap')
  if (heat) heat.innerHTML = heatmapRows()
  const count = $('#count')
  if (count) count.textContent = students.length + ' of 24 students'
}

function updateRunBtn() {
  const btn = $('#run-wrap button')
  if (!btn) return
  btn.textContent = running ? '⏸ Pause' : '▶ Start'
}

function renderOnce() {
  const header = card(
    '<div class="flex items-start justify-between gap-4 flex-wrap">' +
    '<div>' +
    '<h2 class="text-xl font-extrabold text-brand-700">' + esc(lesson?.title || 'Live Lesson') + '</h2>' +
    '<div class="flex items-center gap-2 mt-2 flex-wrap">' +
    '<button type="button" id="copy-code" class="font-mono text-sm font-extrabold tracking-[0.12em] bg-brand-50 text-brand-700 border border-dashed border-brand-300 rounded-pill px-3 py-1 hover:bg-brand-100 transition">' + esc(JOIN_CODE) + '</button>' +
    '<span class="text-sm text-brand-400" id="count">' + students.length + ' of 24 students</span>' +
    '</div></div>' +
    '<span id="run-wrap">' + button('▶ Start', { variant: 'primary', size: 'sm' }) + '</span>' +
    '</div>'
  )
  const layout =
    '<div class="grid lg:grid-cols-[260px_1fr] gap-6 items-start">' +
    card('<h3 class="text-sm font-bold uppercase tracking-wide text-brand-400 mb-3">Scene heatmap</h3>' +
      '<div id="heatmap" class="space-y-1"></div>') +
    '<div id="monitor-grid" class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3"></div>' +
    '</div>'

  app().innerHTML = teacherShell({
    active: 'monitor',
    title: 'Live Monitor',
    content: header + '<div class="mt-6">' + layout + '</div>',
  })

  const runWrap = $('#run-wrap')
  if (runWrap) runWrap.addEventListener('click', () => { running ? pause() : start() })
  const copy = $('#copy-code')
  if (copy) {
    copy.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(JOIN_CODE) } catch { /* clipboard may be unavailable */ }
      const orig = copy.textContent
      copy.textContent = 'Copied!'
      setTimeout(() => { copy.textContent = orig }, 1200)
    })
  }
  paint()
}

renderOnce()

window.addEventListener('beforeunload', pause)
document.addEventListener('visibilitychange', () => { if (document.hidden) pause() })
