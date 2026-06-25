import { api } from '../data/api.js'
import { teacherShell } from '../components/teacher-layout.js'
import { tag, badge, button, card, avatar, esc } from '../components/ui.js'
import { $, $$, app } from '../components/page.js'

const params = new URLSearchParams(location.search)

app().innerHTML =
  '<div class="min-h-screen grid place-items-center text-brand-400 font-semibold">Loading…</div>'

const classes = await api.listClasses()
let selectedId = params.get('class') || classes[0]?.id
let roster = selectedId ? await api.listStudents(selectedId) : []

render()

function selectedCls() {
  return classes.find((c) => c.id === selectedId) || classes[0]
}

function render() {
  const cls = selectedCls()
  app().innerHTML = teacherShell({ active: 'classes', title: 'Classes', content: build(cls) })
  wireSelector()
  wireActions(cls)
}

function classSelector() {
  const pills = classes
    .map((c) => {
      const on = c.id === selectedId
      const cls = on
        ? 'bg-brand-500 text-white border-brand-500'
        : 'bg-white text-brand-600 border-brand-200 hover:bg-brand-50'
      return `<button type="button" data-class-pill="${esc(c.id)}" class="px-4 py-2 rounded-pill font-bold text-sm border transition ${cls}">${esc(c.className)}</button>`
    })
    .join('')
  return '<div class="flex flex-wrap gap-2 mb-6">' + pills + '</div>'
}

function headerCard(cls) {
  return card(
    '<div class="flex items-start justify-between gap-4 flex-wrap">' +
    '<div>' +
    `<h2 class="text-2xl font-extrabold text-brand-700">${esc(cls.className)}</h2>` +
    '<div class="flex items-center gap-2 mt-2">' +
    tag('Grade ' + cls.gradeLevel) +
    `<span class="text-sm text-brand-400">Created ${esc(cls.createdAt)}</span>` +
    '</div>' +
    '</div>' +
    '<span id="new-class-wrap">' + button('+ New class', { variant: 'outline', size: 'sm' }) + '</span>' +
    '</div>'
  )
}

function accessCard(cls) {
  return card(
    '<h3 class="text-sm font-bold uppercase tracking-wide text-brand-400 mb-3">Access</h3>' +
    '<div class="flex items-center gap-3 flex-wrap">' +
    `<button type="button" id="copy-code" class="font-mono text-xl font-extrabold tracking-[0.15em] bg-brand-50 text-brand-700 border-2 border-dashed border-brand-300 rounded-pill px-5 py-2 hover:bg-brand-100 transition">${esc(cls.classCode)}</button>` +
    '<span id="copy-feedback" class="text-sm font-semibold text-green-600 opacity-0 transition">Copied!</span>' +
    '</div>' +
    '<p class="text-sm text-brand-400 mt-3">Students use this code at <a href="/join.html" class="text-brand-600 underline font-semibold">/join</a>.</p>' +
    `<p class="text-sm mt-2"><a href="${esc(cls.registrationLink)}" target="_blank" rel="noopener" class="text-brand-600 underline font-semibold break-all">Registration link</a></p>`
  )
}

function rosterCard(cls) {
  const label = '<h3 class="text-sm font-bold uppercase tracking-wide text-brand-400 mb-3">Roster</h3>'
  if (!roster.length) {
    return card(
      label +
      '<div class="text-center py-6">' +
      '<div class="text-4xl mb-2">🌱</div>' +
      `<p class="text-brand-400">No students yet — share your code: <span class="font-mono font-bold text-brand-700">${esc(cls.classCode)}</span></p>` +
      '</div>'
    )
  }
  const rows = roster
    .map((s) => {
      const score = Number(s.avgScore) || 0
      const color = score >= 80 ? 'green' : score >= 65 ? 'amber' : 'accent'
      return (
        '<tr class="border-b border-brand-50 last:border-0">' +
        '<td class="py-3 pr-3"><div class="flex items-center gap-2">' +
        avatar(s.avatarId, { size: 'sm' }) +
        `<span class="font-semibold text-brand-700">${esc(s.nickname)}</span></div></td>` +
        `<td class="py-3 pr-3">${badge(score + '%', { color })}</td>` +
        `<td class="py-3 pr-3 text-brand-600 font-semibold">${esc(s.lessonsDone)}</td>` +
        '<td class="py-3">' + badge('Active', { color: 'green' }) + '</td>' +
        '</tr>'
      )
    })
    .join('')
  return card(
    '<div class="flex items-center justify-between mb-3">' +
    '<h3 class="text-sm font-bold uppercase tracking-wide text-brand-400">Roster</h3>' +
    `<span class="text-sm text-brand-400">${roster.length} student${roster.length === 1 ? '' : 's'}</span>` +
    '</div>' +
    '<div class="overflow-x-auto"><table class="w-full text-sm">' +
    '<thead><tr class="text-left text-xs uppercase tracking-wide text-brand-400">' +
    '<th class="py-2 pr-3">Student</th>' +
    '<th class="py-2 pr-3">Avg Score</th>' +
    '<th class="py-2 pr-3">Lessons</th>' +
    '<th class="py-2">Status</th>' +
    '</tr></thead>' +
    `<tbody>${rows}</tbody>` +
    '</table></div>'
  )
}

function actionRow() {
  return (
    '<div class="flex items-center gap-3 flex-wrap">' +
    '<span id="add-student-btn">' + button('Add student', { variant: 'outline', size: 'sm' }) + '</span>' +
    '<span id="deactivate-btn">' + button('Deactivate class', { variant: 'ghost', size: 'sm' }) + '</span>' +
    '</div>'
  )
}

function build(cls) {
  return (
    classSelector() +
    '<div class="space-y-6">' +
    headerCard(cls) +
    '<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">' +
    accessCard(cls) +
    rosterCard(cls) +
    '</div>' +
    actionRow() +
    '</div>'
  )
}

function wireSelector() {
  $$('[data-class-pill]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      selectedId = btn.dataset.classPill
      roster = await api.listStudents(selectedId)
      const u = new URL(location.href)
      u.searchParams.set('class', selectedId)
      history.replaceState({}, '', u)
      render()
    })
  })
}

function wireActions(cls) {
  const copyBtn = $('#copy-code')
  const feedback = $('#copy-feedback')
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(cls.classCode)
      } catch {
        /* clipboard may be unavailable in some contexts */
      }
      if (feedback) {
        feedback.classList.remove('opacity-0')
        clearTimeout(wireActions._t)
        wireActions._t = setTimeout(() => feedback.classList.add('opacity-0'), 1500)
      }
    })
  }
  const nc = $('#new-class-wrap button')
  if (nc) nc.addEventListener('click', () => alert('Demo only — class creation is not wired up.'))
  const add = $('#add-student-btn button')
  if (add) add.addEventListener('click', () => alert('Demo only — adding students is not wired up.'))
  const deact = $('#deactivate-btn button')
  if (deact) deact.addEventListener('click', () => alert('Demo only — deactivation is not wired up.'))
}
