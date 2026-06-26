import { api } from '../data/api.js'
import { teacherShell } from '../components/teacher-layout.js'
import { card, button, stat, donut, bars, esc } from '../components/ui.js'
import { $, $$, app } from '../components/page.js'

const KEYWORDS = [
  { label: 'water', value: 18 },
  { label: 'life', value: 14 },
  { label: 'atmosphere', value: 6 },
  { label: 'people', value: 4 },
  { label: 'oxygen', value: 3 },
]

app().innerHTML =
  '<div class="min-h-screen grid place-items-center text-brand-400 font-semibold">Loading analytics…</div>'

const lessons = await api.listLessons()
let selectedId = 'lesson-solar'
let a = await api.getLessonAnalytics(selectedId)

render()

function render() {
  app().innerHTML = teacherShell({ active: 'analytics', title: 'Analytics', content: build() })
  wire()
}

async function selectLesson(id) {
  selectedId = id
  app().innerHTML = teacherShell({
    active: 'analytics', title: 'Analytics',
    content: '<div class="text-brand-400 font-semibold py-10">Loading…</div>',
  })
  a = await api.getLessonAnalytics(selectedId)
  render()
}

function fmtDuration(sec) {
  const s = Math.max(0, Math.round(Number(sec) || 0))
  return Math.floor(s / 60) + 'm ' + (s % 60) + 's'
}

function lessonSelector() {
  const pills = lessons.map((l) => {
    const on = l.id === selectedId
    const cls = on
      ? 'bg-brand-500 text-white border-brand-500'
      : 'bg-white text-brand-600 border-brand-200 hover:bg-brand-50'
    return (
      '<button type="button" data-lesson="' + esc(l.id) + '" class="px-4 py-2 rounded-pill font-bold text-sm border transition ' + cls + '">' +
      esc(l.emoji || '') + ' ' + esc(l.title) + '</button>'
    )
  }).join('')
  return '<div class="flex flex-wrap gap-2 mb-6">' + pills + '</div>'
}

function statsRow() {
  const scoreCard = card(
    '<p class="text-xs font-bold uppercase tracking-wide text-brand-400">Avg Score</p>' +
    '<div class="flex items-center gap-3 mt-2">' +
    donut(Number(a?.avgScore) || 0, { size: 64 }) +
    '<span class="text-3xl font-extrabold text-brand-700">' + esc(Number(a?.avgScore) || 0) + '%</span>' +
    '</div>'
  )
  return (
    '<div class="grid grid-cols-2 lg:grid-cols-4 gap-4">' +
    stat('Completions', Number(a?.completions) || 0, { icon: '✅' }) +
    scoreCard +
    stat('Avg Duration', fmtDuration(a?.avgDurationSec), { icon: '⏱️' }) +
    stat('Avg Confidence', (Number(a?.avgConfidence) || 0) + ' / 5', { icon: '🧭' }) +
    '</div>'
  )
}

function sceneDifficulty() {
  const sb = a?.sceneBreakdown || []
  const head = '<h3 class="text-lg font-extrabold text-brand-700 mb-3">Scene difficulty</h3>'
  if (!sb.length) {
    return card(
      head +
      '<div class="text-center py-6"><div class="text-4xl mb-2">🌱</div>' +
      '<p class="text-brand-400">Detailed scene data available for Solar System lesson</p></div>'
    )
  }
  const hardest = sb.reduce((m, s) => (s.errorRate > m.errorRate ? s : m), sb[0])
  return card(
    head +
    '<p class="text-sm text-brand-400 mb-4">Error rate per scene. Hardest: <b class="text-accent-600">' +
    esc(hardest.title) + '</b> (' + Math.round(hardest.errorRate * 100) + '%)</p>' +
    bars(sb.map((s) => ({
      label: s.title,
      value: Math.round(s.errorRate * 100),
      max: 100,
      color: s.errorRate > 0.3 ? 'accent' : 'brand',
    })))
  )
}

function confidenceCard() {
  const cv = a?.confidenceVsCorrect || []
  const head = '<h3 class="text-lg font-extrabold text-brand-700 mb-3">Confidence vs. Correctness</h3>'
  if (!cv.length) {
    return card(
      head +
      '<div class="text-center py-6"><div class="text-4xl mb-2">🌱</div>' +
      '<p class="text-brand-400">Confidence breakdown available for Solar System lesson</p></div>'
    )
  }
  const cells = cv.map((b) => {
    const low = b.bucket.toLowerCase().includes('low')
    const wrong = b.bucket.toLowerCase().includes('wrong')
    const flag = !low && wrong
    const cls = flag ? 'border-accent-400 bg-pink-50' : 'border-green-200 bg-green-50'
    const dot = flag ? 'bg-accent-500' : 'bg-green-500'
    return (
      '<div class="rounded-card border-2 p-3 ' + cls + '">' +
      '<div class="flex items-center gap-2 mb-1"><span class="w-2 h-2 rounded-full ' + dot + '"></span>' +
      '<span class="text-xs font-bold text-brand-700">' + esc(b.bucket) + '</span></div>' +
      '<p class="text-2xl font-extrabold text-brand-700">' + Number(b.count) + '</p>' +
      (flag ? '<p class="text-xs text-accent-600 font-semibold mt-1">⚠ Review misconceptions</p>' : '') +
      '</div>'
    )
  }).join('')
  return card(
    head +
    '<p class="text-sm text-brand-400 mb-3">Where confident students were actually wrong.</p>' +
    '<div class="grid grid-cols-2 gap-3">' + cells + '</div>'
  )
}

function keywordCard() {
  const max = Math.max(...KEYWORDS.map((k) => k.value), 1)
  return card(
    '<h3 class="text-lg font-extrabold text-brand-700 mb-1">Keyword frequency</h3>' +
    '<p class="text-sm text-brand-400 mb-4">Top terms in open-text responses.</p>' +
    bars(KEYWORDS.map((k) => ({ label: k.label + ' (' + k.value + ')', value: k.value, max, color: 'brand' })))
  )
}

function exportCard() {
  return card(
    '<h3 class="text-lg font-extrabold text-brand-700 mb-1">Export</h3>' +
    '<p class="text-sm text-brand-400 mb-4">Download this lesson\'s analytics as a CSV file.</p>' +
    '<span id="export-wrap">' + button('⬇ Export CSV', { variant: 'primary', size: 'sm' }) + '</span>' +
    '<p id="export-fb" class="text-sm text-green-600 font-semibold mt-2 opacity-0 transition">Downloaded ✓</p>'
  )
}

function build() {
  return (
    lessonSelector() + statsRow() +
    '<div class="grid lg:grid-cols-2 gap-6 mt-6">' + sceneDifficulty() + confidenceCard() + '</div>' +
    '<div class="grid lg:grid-cols-2 gap-6 mt-6">' + keywordCard() + exportCard() + '</div>'
  )
}

function wire() {
  $$('[data-lesson]').forEach((btn) => {
    btn.addEventListener('click', () => selectLesson(btn.dataset.lesson))
  })
  const exp = $('#export-wrap button')
  if (exp) {
    exp.addEventListener('click', () => {
      exportCSV()
      const fb = $('#export-fb')
      if (fb) {
        fb.classList.remove('opacity-0')
        clearTimeout(wire._t)
        wire._t = setTimeout(() => fb.classList.add('opacity-0'), 1800)
      }
    })
  }
}

function csvCell(v) {
  const s = String(v ?? '')
  return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s
}

function exportCSV() {
  let csv, filename
  const sb = a?.sceneBreakdown || []
  if (sb.length) {
    csv = 'sceneId,title,errorRate,avgSec\n' +
      sb.map((s) => [s.sceneId, csvCell(s.title), s.errorRate, s.avgSec].join(',')).join('\n')
    filename = 'lesson-' + selectedId + '-analytics.csv'
  } else {
    csv = 'metric,value\n' +
      'completions,' + (a?.completions ?? '') + '\n' +
      'avgScore,' + (a?.avgScore ?? '') + '\n' +
      'avgDurationSec,' + (a?.avgDurationSec ?? '') + '\n' +
      'avgConfidence,' + (a?.avgConfidence ?? '') + '\n'
    filename = 'lesson-' + selectedId + '-analytics-summary.csv'
  }
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
