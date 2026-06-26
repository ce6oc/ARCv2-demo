import { studentShell } from '../components/student-layout.js'
import { donut, stat, badge, button, card, emptyState, esc } from '../components/ui.js'

const app = document.getElementById('app')

function fmtDur(sec) {
  const s = Math.max(0, Math.round(Number(sec) || 0))
  const m = Math.floor(s / 60)
  const r = s % 60
  if (m === 0) return `${r}s`
  return `${m}m ${r}s`
}

let result = null
try {
  const raw = sessionStorage.getItem('eduflow:lastResult')
  result = raw ? JSON.parse(raw) : null
} catch {
  result = null
}

if (!result || !result.score || typeof result.score.percentage !== 'number') {
  app.innerHTML = studentShell({
    back: '/student-lessons.html',
    content:
      emptyState('No result to show — go complete a lesson first') +
      `<div class="mt-4 text-center">${button('Browse lessons', { variant: 'primary', href: '/student-lessons.html' })}</div>`,
  })
} else {
  const { lessonId, title, score, durationInSeconds, responses } = result
  const { achieved, possible, percentage } = score
  const respList = Array.isArray(responses) ? responses : []

  const header =
    '<div class="mb-6">' +
    '<h1 class="text-2xl md:text-3xl font-extrabold text-brand-700">Lesson complete! 🎉</h1>' +
    `<p class="text-brand-400 mt-1">${esc(title || 'Lesson')}</p>` +
    '</div>'

  const hero = card(
    '<div class="flex flex-col items-center gap-2">' +
    donut(percentage, { size: 160 }) +
    `<p class="text-brand-400 font-semibold">${achieved}/${possible} correct</p>` +
    '</div>',
    { cls: 'text-center' }
  )

  const stats =
    '<div class="grid grid-cols-3 gap-3 mt-4">' +
    stat('Score', `${percentage}%`) +
    stat('Correct', `${achieved}/${possible}`) +
    stat('Time', fmtDur(durationInSeconds)) +
    '</div>'

  const rows = respList
    .map((r) => {
      let icon, color
      if (r.isCorrect === true) {
        icon = '✅'
        color = 'green'
      } else if (r.isCorrect === false) {
        icon = '💡'
        color = 'accent'
      } else {
        icon = '➖'
        color = 'gray'
      }
      return (
        '<li class="flex items-center justify-between py-2">' +
        `<span class="text-sm text-brand-700 font-semibold">Scene ${esc(r.sceneId)}</span>` +
        badge(icon, { color }) +
        '</li>'
      )
    })
    .join('')

  const breakdown = card(
    '<h3 class="font-extrabold text-brand-700 mb-2">Scene breakdown</h3>' +
    (rows
      ? `<ul class="divide-y divide-brand-50">${rows}</ul>`
      : '<p class="text-sm text-brand-400">No scene data recorded.</p>')
  )

  const earned =
    '<div class="flex flex-wrap gap-2 mt-4">' +
    badge('🚀 Lesson Complete', { color: 'green' }) +
    (percentage === 100 ? badge('⭐ Perfect Score', { color: 'amber' }) : '') +
    badge('🔒 Speedy', { color: 'gray' }) +
    badge('🔒 Flawless', { color: 'gray' }) +
    '</div>'

  const actions =
    '<div class="flex flex-wrap gap-3 mt-6">' +
    button('Try again', { variant: 'soft', href: `/player.html?id=${encodeURIComponent(lessonId)}` }) +
    button('Back to lessons', { variant: 'primary', href: '/student-lessons.html' }) +
    '</div>'

  const content = header + hero + stats + '<div class="mt-6">' + breakdown + '</div>' + earned + actions

  app.innerHTML = studentShell({ back: '/student-lessons.html', content })
}
