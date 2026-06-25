import { api } from '../data/api.js'
import { teacherShell } from '../components/teacher-layout.js'
import { tag, button, card, esc } from '../components/ui.js'
import { $, $$, app } from '../components/page.js'

app().innerHTML =
  '<div class="min-h-screen grid place-items-center text-brand-400 font-semibold">Loading…</div>'

const lessons = await api.listLessons()
const subjects = ['All', 'Science', 'Language Arts', 'Math']
let subject = 'All'

render()

function filtered() {
  return subject === 'All' ? lessons : lessons.filter((l) => l.subject === subject)
}

function render() {
  app().innerHTML = teacherShell({ active: 'lessons', title: 'Lesson Library', content: build() })
  wireFilters()
  wireAssign()
}

function build() {
  const header =
    '<div class="flex items-center justify-between gap-4 flex-wrap mb-5">' +
    '<h2 class="text-xl font-extrabold text-brand-700">All lessons</h2>' +
    button('Create new lesson →', { variant: 'outline', size: 'sm', href: '/lesson-builder.html' }) +
    '</div>'

  const chips =
    '<div class="flex flex-wrap gap-2 mb-6">' +
    subjects
      .map((s) => {
        const on = s === subject
        const cls = on
          ? 'bg-brand-500 text-white border-brand-500'
          : 'bg-white text-brand-600 border-brand-200 hover:bg-brand-50'
        return `<button type="button" data-subject="${esc(s)}" class="px-4 py-2 rounded-pill font-bold text-sm border transition ${cls}">${esc(s)}</button>`
      })
      .join('') +
    '</div>'

  const grid =
    '<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">' +
    filtered().map(lessonCard).join('') +
    '</div>'

  return '<div>' + header + chips + grid + toast() + '</div>'
}

function lessonCard(l) {
  return card(
    '<div class="flex flex-col h-full">' +
    `<div class="text-4xl w-16 h-16 rounded-card bg-brand-50 grid place-items-center mb-3">${l.emoji}</div>` +
    `<h3 class="font-extrabold text-brand-700 text-lg leading-tight">${esc(l.title)}</h3>` +
    '<div class="flex items-center gap-2 mt-2 flex-wrap">' +
    tag(l.subject) +
    tag('Grade ' + l.gradeLevel) +
    '</div>' +
    `<p class="text-sm text-gray-500 mt-2 line-clamp-2">${esc(l.description)}</p>` +
    `<p class="text-xs text-brand-400 mt-2">${esc(l.scenes)} scenes</p>` +
    '<div class="flex items-center gap-2 mt-4">' +
    button('Preview', { variant: 'soft', size: 'sm', href: `/player.html?id=${encodeURIComponent(l.id)}` }) +
    `<button type="button" data-assign="${esc(l.id)}" data-title="${esc(l.title)}" class="rounded-pill font-bold inline-flex items-center gap-2 transition bg-brand-500 text-white hover:bg-brand-600 px-3 py-1.5 text-sm">Assign</button>` +
    '</div>' +
    '</div>',
    { cls: 'flex flex-col h-full' }
  )
}

function toast() {
  return (
    '<div id="toast" class="fixed bottom-6 left-1/2 -translate-x-1/2 bg-brand-700 text-white font-semibold px-5 py-3 rounded-pill shadow-lg opacity-0 translate-y-2 pointer-events-none transition-all duration-300 z-50"></div>'
  )
}

function wireFilters() {
  $$('[data-subject]').forEach((b) => {
    b.addEventListener('click', () => {
      subject = b.dataset.subject
      render()
    })
  })
}

function wireAssign() {
  $$('[data-assign]').forEach((b) => {
    b.addEventListener('click', () => {
      showToast(`Assigned ${b.dataset.title} to Room 204 — Explorers ✅`)
    })
  })
}

function showToast(msg) {
  const t = $('#toast')
  if (!t) return
  t.textContent = msg
  t.classList.remove('opacity-0', 'translate-y-2')
  t.classList.add('opacity-100', 'translate-y-0')
  clearTimeout(showToast._t)
  showToast._t = setTimeout(() => {
    t.classList.add('opacity-0', 'translate-y-2')
    t.classList.remove('opacity-100', 'translate-y-0')
  }, 2200)
}
