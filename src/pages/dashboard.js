import { api } from '../data/api.js'
import { teacherShell } from '../components/teacher-layout.js'
import { stat, button, card, tag, esc, link } from '../components/ui.js'
import { $, app } from '../components/page.js'

app().innerHTML =
  '<div class="min-h-screen grid place-items-center text-brand-400 font-semibold">Loading…</div>'

const classes = await api.listClasses()

const banner =
  '<div class="rounded-card p-6 bg-gradient-to-r from-brand-500 to-accent-500 text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">' +
  '<div>' +
  '<h2 class="text-xl font-extrabold">Launch a live lesson 📡</h2>' +
  '<p class="text-white/80 text-sm mt-1">Run a lesson in real time and watch answers roll in.</p>' +
  '</div>' +
  '<a href="' + link('/live-monitor.html') + '" class="inline-flex items-center gap-2 rounded-pill bg-white text-brand-600 font-bold px-6 py-3 hover:bg-brand-50 transition shrink-0">Start live session ▶</a>' +
  '</div>'

const stats =
  '<div class="grid grid-cols-2 lg:grid-cols-4 gap-4">' +
  stat('Active Classes', 2, { icon: '🏫' }) +
  stat('Students', 43, { icon: '🧑\u200d🎓' }) +
  stat('Lessons', 3, { icon: '📚' }) +
  stat('Avg Score', '77%', { icon: '📈' }) +
  '</div>'

const classHeader =
  '<div class="flex items-center justify-between mb-3">' +
  '<h2 class="text-lg font-extrabold text-brand-700">Your classes</h2>' +
  '<span id="new-class-btn">' + button('New class', { variant: 'outline', size: 'sm' }) + '</span>' +
  '</div>'

const classRows = classes
  .map((c) =>
    card(
      '<div class="flex items-center justify-between gap-4">' +
      '<div class="min-w-0">' +
      `<h3 class="font-extrabold text-brand-700 text-lg leading-tight">${esc(c.className)}</h3>` +
      '<div class="flex items-center gap-2 mt-1 flex-wrap">' +
      tag('Grade ' + c.gradeLevel) +
      `<span class="text-sm text-brand-400">${esc(c.studentCount)} students</span>` +
      '</div>' +
      '</div>' +
      button('View →', { variant: 'ghost', size: 'sm', href: `/classes.html?class=${encodeURIComponent(c.id)}` }) +
      '</div>',
      { pad: 'p-4' }
    )
  )
  .join('<div class="h-3"></div>')

const activity = [
  { color: 'bg-green-500', html: '<b>MoonBeam</b> completed Solar System — 91%', time: '2m ago' },
  { color: 'bg-accent-500', html: '<b>CometKid</b> is stuck on Sort planets', time: '18m ago' },
  { color: 'bg-brand-500', html: 'New student joined Reading Rockets', time: '1h ago' },
  { color: 'bg-violet-500', html: 'You assigned Math Quest', time: '3h ago' },
  { color: 'bg-amber-500', html: 'SuperNova earned ⭐ Perfect Score', time: 'Yesterday' },
]

const timeline = activity
  .map(
    (a) =>
      '<div class="flex items-start gap-3 py-2.5 border-b border-brand-50 last:border-0">' +
      `<span class="w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${a.color}"></span>` +
      `<p class="flex-1 text-sm text-brand-700">${a.html}</p>` +
      `<span class="text-xs text-brand-300 shrink-0">${a.time}</span>` +
      '</div>'
  )
  .join('')

const recent = card('<h2 class="text-lg font-extrabold text-brand-700 mb-1">Recent activity</h2>' + timeline)

const twoCol =
  '<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">' +
  `<div class="lg:col-span-2">${classHeader}${classRows}</div>` +
  `<div>${recent}</div>` +
  '</div>'

const content = '<div class="space-y-6">' + banner + stats + twoCol + '</div>'

app().innerHTML = teacherShell({ active: 'dashboard', title: 'Dashboard', content })

const newClass = $('#new-class-btn button')
if (newClass) newClass.addEventListener('click', () => alert('Demo only — class creation is not wired up.'))
