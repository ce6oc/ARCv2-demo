import { api } from '../data/api.js'
import { studentShell } from '../components/student-layout.js'
import { avatar, donut, tag, badge, button, card, esc } from '../components/ui.js'

const params = new URLSearchParams(location.search)
const name = params.get('name') || 'SuperNova'
const avatarId = params.get('avatar') || 'avatar_05'

const app = document.getElementById('app')
app.innerHTML = '<div class="min-h-screen grid place-items-center text-brand-400 font-semibold">Loading…</div>'

const lessons = await api.listLessons()

const greeting =
  '<div class="flex items-center gap-4 mb-6">' +
  avatar(avatarId, { size: 'lg' }) +
  '<div>' +
  `<h1 class="text-2xl md:text-3xl font-extrabold text-brand-700">Hi, ${esc(name)} 👋</h1>` +
  '<p class="text-brand-400">Ready for today\'s adventure?</p>' +
  '</div>' +
  '</div>'

const progress = card(
  '<div class="flex items-center gap-5">' +
  donut(67, { size: 110 }) +
  '<div>' +
  '<p class="text-lg font-extrabold text-brand-700">2 of 3 lessons done</p>' +
  '<p class="text-sm text-brand-400">Keep it up — you\'re on a roll! 🎉</p>' +
  '</div>' +
  '</div>'
)

const sectionLabel = (text) =>
  `<h2 class="text-lg font-extrabold text-brand-700 mt-7 mb-3">${esc(text)}</h2>`

const lessonsHtml = lessons
  .map((l, i) =>
    card(
      '<div class="flex items-center gap-4">' +
      `<div class="text-4xl shrink-0">${l.emoji}</div>` +
      '<div class="flex-1 min-w-0">' +
      `<div class="flex items-center gap-2 mb-1">${tag(l.subject)}${tag('Grade ' + l.gradeLevel)}</div>` +
      `<h3 class="font-extrabold text-brand-700 text-lg leading-tight">${esc(l.title)}</h3>` +
      `<p class="text-sm text-gray-500 mt-1 line-clamp-2">${esc(l.description)}</p>` +
      '</div>' +
      '<div class="shrink-0">' +
      button(i === 1 ? 'Resume →' : 'Start →', {
        variant: 'primary',
        href: `/player.html?id=${encodeURIComponent(l.id)}`,
      }) +
      '</div>' +
      '</div>',
      { pad: 'p-4' }
    )
  )
  .join('<div class="h-3"></div>')

const badges =
  '<div class="flex flex-wrap gap-2">' +
  badge('🚀 First Lesson', { color: 'green' }) +
  badge('⭐ Perfect Score', { color: 'amber' }) +
  badge('🔥 3-Day Streak', { color: 'accent' }) +
  badge('🔒 Sharpshooter', { color: 'gray' }) +
  '</div>'

const switchLink = `<div class="mt-8 text-center">${button('Switch class', { variant: 'ghost', href: '/join.html' })}</div>`

const content = greeting + progress + sectionLabel('Your lessons') + lessonsHtml + sectionLabel('Your badges') + badges + switchLink

app.innerHTML = studentShell({ content })
