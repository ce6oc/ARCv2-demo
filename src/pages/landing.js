import { api } from '../data/api.js'
import { logo, button, badge, tag, card, esc } from '../components/ui.js'

const app = document.getElementById('app')

// Paint the full page immediately; the "See it in action" grid shows a
// loading skeleton until listLessons() resolves (top-level await below).
app.innerHTML = page()

const lessons = await api.listLessons()
const demosGrid = document.getElementById('demos-grid')
if (demosGrid) demosGrid.innerHTML = lessonsGrid(lessons)

function page() {
  return nav() + hero() + features() + forTeachers() + forStudents() + demos() + quote() + finalCta() + footerHtml()
}

// ---------- Nav ----------
function nav() {
  const links =
    '<nav class="hidden md:flex items-center gap-7">' +
    '<a href="#features" class="text-sm font-bold text-brand-600 hover:text-brand-700 transition">Features</a>' +
    '<a href="#teachers" class="text-sm font-bold text-brand-600 hover:text-brand-700 transition">For Teachers</a>' +
    '<a href="#students" class="text-sm font-bold text-brand-600 hover:text-brand-700 transition">For Students</a>' +
    '</nav>'
  const ctas =
    '<div class="flex items-center gap-2">' +
    button('Sign in', { variant: 'ghost', href: '/teacher-signin.html' }) +
    button('Join a class', { variant: 'primary', href: '/join.html' }) +
    '</div>'
  return (
    '<header class="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-brand-100">' +
    '<div class="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">' +
    logo() + links + ctas +
    '</div>' +
    '</header>'
  )
}

// ---------- Hero ----------
function hero() {
  const headline =
    '<h1 class="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">' +
    '<span class="bg-gradient-to-r from-brand-500 to-accent-500 bg-clip-text text-transparent">Lessons that actually click.</span>' +
    '</h1>'
  const subcopy =
    '<p class="mt-5 text-lg md:text-xl text-brand-600 max-w-xl">ARCFlow lets teachers build rich, interactive lessons in minutes — quizzes, sorting, voice responses, even mini-games. Students join with a code. No app, no friction.</p>'
  const ctas =
    '<div class="mt-7 flex flex-wrap gap-3">' +
    button("I'm a teacher", { variant: 'primary', size: 'lg', href: '/teacher-signin.html' }) +
    button("I'm a student", { variant: 'accent', size: 'lg', href: '/join.html' }) +
    '</div>'
  const copy =
    '<div class="flex-1 text-center md:text-left">' +
    '<span class="inline-flex">' + badge('✨ Interactive micro-lessons', { color: 'brand' }) + '</span>' +
    '<div class="mt-4">' + headline + '</div>' +
    subcopy + ctas +
    '</div>'
  return (
    '<section class="relative overflow-hidden">' +
    '<div class="absolute inset-0 bg-gradient-to-br from-brand-50 via-canvas to-pink-50"></div>' +
    '<div class="absolute -top-24 -right-24 w-96 h-96 bg-brand-200/40 rounded-full blur-3xl"></div>' +
    '<div class="absolute -bottom-24 -left-24 w-96 h-96 bg-accent-400/20 rounded-full blur-3xl"></div>' +
    '<div class="relative max-w-6xl mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center gap-12">' +
    copy +
    '<div class="flex-1 w-full flex justify-center md:justify-end">' + mockQuizCard() + '</div>' +
    '</div>' +
    '</section>'
  )
}

function mockQuizCard() {
  return (
    '<div class="transform md:rotate-3 w-full max-w-sm drop-shadow-xl">' +
    card(
      '<div class="flex items-center gap-2 mb-3">' +
      '<span class="text-2xl">🪐</span>' +
      '<span class="text-xs font-bold uppercase tracking-wide text-brand-400">Live scene</span>' +
      '</div>' +
      '<h3 class="text-lg font-extrabold text-brand-700 mb-4">Which planet is closest to the Sun?</h3>' +
      '<div class="space-y-2.5">' +
      '<div class="px-4 py-2.5 rounded-pill border border-green-300 bg-green-50 text-green-700 font-bold flex items-center justify-between"><span>Mercury</span><span>✓</span></div>' +
      '<div class="px-4 py-2.5 rounded-pill border border-brand-200 bg-white text-brand-600 font-semibold">Venus</div>' +
      '<div class="px-4 py-2.5 rounded-pill border border-brand-200 bg-white text-brand-600 font-semibold">Earth</div>' +
      '</div>' +
      '<div class="mt-4 flex items-center gap-2 text-xs font-bold text-brand-400">' +
      '<span class="w-2.5 h-2.5 rounded-full bg-green-500"></span>14 of 24 answered' +
      '</div>'
    ) +
    '</div>'
  )
}

// ---------- Features ----------
function features() {
  const items = [
    { icon: '🎯', title: '8 interactive scene types', blurb: 'Multiple choice, categorize, matching, open text, audio, video, and embeddable games.' },
    { icon: '🌿', title: 'Branching that adapts', blurb: 'Lessons reroute to hints when a student struggles, then back on track.' },
    { icon: '🔓', title: 'No sign-up friction', blurb: 'Students join as guests with a nickname, or register to save progress.' },
    { icon: '📊', title: 'Real analytics', blurb: 'See exactly which scenes trip students up — and where confidence hides misconceptions.' },
  ]
  const cards = items
    .map((f) =>
      card(
        '<div class="text-3xl mb-3">' + f.icon + '</div>' +
        '<h3 class="text-lg font-extrabold text-brand-700">' + esc(f.title) + '</h3>' +
        '<p class="mt-2 text-sm text-brand-600/80">' + esc(f.blurb) + '</p>'
      )
    )
    .join('')
  return section(
    'features',
    '<h2 class="text-3xl md:text-4xl font-extrabold text-brand-700 text-center">Everything you need to engage a classroom</h2>' +
    '<div class="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">' + cards + '</div>'
  )
}

// ---------- For Teachers / For Students ----------
function forTeachers() {
  const copy =
    '<div class="flex-1">' +
    '<span class="inline-flex">' + badge('For Teachers', { color: 'accent' }) + '</span>' +
    '<h2 class="mt-3 text-3xl font-extrabold text-brand-700">Build, assign, and watch it happen live</h2>' +
    '<ul class="mt-5 space-y-3 text-brand-600">' +
    checkRow('🎨', 'Compose lessons from 8 scene types — no code required.') +
    checkRow('📡', 'Launch a live session and watch answers roll in real time.') +
    checkRow('📈', 'Drill into per-scene analytics and confidence signals.') +
    '</ul>' +
    '<div class="mt-6">' + button('Open the dashboard', { variant: 'primary', href: '/teacher-dashboard.html' }) + '</div>' +
    '</div>'
  return section('teachers', '<div class="grid md:grid-cols-2 gap-10 items-center">' + copy + teacherVisual() + '</div>')
}

function forStudents() {
  const copy =
    '<div class="flex-1">' +
    '<span class="inline-flex">' + badge('For Students', { color: 'brand' }) + '</span>' +
    '<h2 class="mt-3 text-3xl font-extrabold text-brand-700">Join, play, and learn by doing</h2>' +
    '<ul class="mt-5 space-y-3 text-brand-600">' +
    checkRow('🎟️', 'Join with a code — no app, no account required.') +
    checkRow('🎮', 'Play through quizzes, games, and voice activities.') +
    checkRow('✨', 'Get instant feedback and celebrate with badges.') +
    '</ul>' +
    '<div class="mt-6">' + button('Join a class', { variant: 'accent', href: '/join.html' }) + '</div>' +
    '</div>'
  return section('students', '<div class="grid md:grid-cols-2 gap-10 items-center">' + studentVisual() + copy + '</div>')
}

function checkRow(icon, text) {
  return '<li class="flex items-start gap-3"><span class="text-xl shrink-0">' + icon + '</span><span>' + esc(text) + '</span></li>'
}

function teacherVisual() {
  const rows = [
    { name: 'MoonBeam', pct: 100, color: 'bg-green-500' },
    { name: 'SuperNova', pct: 60, color: 'bg-brand-500' },
    { name: 'CometKid', pct: 30, color: 'bg-amber-500' },
  ]
    .map(
      (s) =>
        '<div class="mb-3 last:mb-0">' +
        '<div class="flex items-center justify-between mb-1">' +
        '<span class="text-sm font-semibold text-brand-700">' + esc(s.name) + '</span>' +
        '<span class="text-xs text-brand-400">' + s.pct + '%</span>' +
        '</div>' +
        '<div class="h-2.5 bg-brand-100 rounded-pill"><div class="h-full ' + s.color + ' rounded-pill" style="width:' + s.pct + '%"></div></div>' +
        '</div>'
    )
    .join('')
  return (
    '<div class="flex-1 w-full">' +
    card(
      '<div class="flex items-center justify-between mb-4">' +
      '<span class="inline-flex items-center gap-2 text-sm font-bold text-brand-700"><span class="w-2.5 h-2.5 rounded-full bg-green-500"></span>Live · 6 students</span>' +
      '<span class="text-xs font-bold text-brand-400">SCENE 3/8</span>' +
      '</div>' +
      '<p class="text-sm font-semibold text-brand-600 mb-4">Sort planets by size</p>' +
      rows
    ) +
    '</div>'
  )
}

function studentVisual() {
  return (
    '<div class="flex-1 w-full">' +
    card(
      '<div class="text-center">' +
      '<div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-amber-100 to-pink-100 text-3xl">🏆</div>' +
      '<h3 class="mt-3 text-lg font-extrabold text-brand-700">Nice work, SuperNova!</h3>' +
      '<p class="text-sm text-brand-600">You scored 91% on the Solar System.</p>' +
      '<div class="mt-4 flex flex-wrap justify-center gap-2">' +
      badge('⭐ Perfect Score', { color: 'amber' }) +
      badge('🚀 Speedy', { color: 'brand' }) +
      badge('🔥 4-day streak', { color: 'accent' }) +
      '</div>' +
      '</div>'
    ) +
    '</div>'
  )
}

// ---------- Demos (live data) ----------
function demos() {
  return section(
    'demos',
    '<h2 class="text-3xl md:text-4xl font-extrabold text-brand-700 text-center">Try a demo lesson right now</h2>' +
    '<p class="mt-3 text-center text-brand-600">No sign-up needed — just click and play.</p>' +
    '<div id="demos-grid" class="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">' +
    skeletonCard() + skeletonCard() + skeletonCard() +
    '</div>'
  )
}

function skeletonCard() {
  return (
    '<div class="bg-white rounded-card border border-brand-100 p-6 animate-pulse">' +
    '<div class="w-14 h-14 rounded-xl bg-brand-100"></div>' +
    '<div class="h-5 bg-brand-100 rounded mt-4 w-3/4"></div>' +
    '<div class="h-3 bg-brand-100 rounded mt-2 w-1/2"></div>' +
    '<div class="h-3 bg-brand-100 rounded mt-4 w-full"></div>' +
    '<div class="h-3 bg-brand-100 rounded mt-2 w-5/6"></div>' +
    '<div class="h-9 bg-brand-100 rounded-pill mt-5 w-2/5"></div>' +
    '</div>'
  )
}

function lessonsGrid(lessons) {
  return lessons
    .map(
      (l) =>
        card(
          '<div class="flex items-start gap-4">' +
          '<div class="w-14 h-14 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center text-3xl shrink-0">' +
          esc(l.emoji) +
          '</div>' +
          '<div class="min-w-0">' +
          '<h3 class="text-lg font-extrabold text-brand-700 leading-tight">' + esc(l.title) + '</h3>' +
          '<div class="flex flex-wrap gap-1.5 mt-1.5">' +
          tag(l.subject) +
          tag('Grade ' + l.gradeLevel) +
          tag(l.scenes + ' scenes') +
          '</div>' +
          '</div>' +
          '</div>' +
          '<p class="mt-4 text-sm text-brand-600/80">' + esc(l.description) + '</p>' +
          '<div class="mt-5">' +
          button('Try demo →', { variant: 'primary', href: '/player.html?id=' + encodeURIComponent(l.id) }) +
          '</div>'
        )
    )
    .join('')
}

// ---------- Quote / CTA / Footer ----------
function quote() {
  return (
    '<section class="py-16 md:py-20">' +
    '<div class="max-w-4xl mx-auto px-4">' +
    '<div class="rounded-card bg-gradient-to-r from-brand-500 to-accent-500 text-white p-10 md:p-14 text-center shadow-lg">' +
    '<div class="text-5xl mb-4">💬</div>' +
    '<p class="text-2xl md:text-3xl font-extrabold leading-snug">“My students actually ask to do ARCFlow lessons.”</p>' +
    '<p class="mt-4 text-white/80 font-semibold">— Ms. Rivera, Grade 3</p>' +
    '</div>' +
    '</div>' +
    '</section>'
  )
}

function finalCta() {
  return (
    '<section class="py-16 md:py-20">' +
    '<div class="max-w-3xl mx-auto px-4 text-center">' +
    '<h2 class="text-3xl md:text-4xl font-extrabold text-brand-700">Ready to try ARCFlow?</h2>' +
    '<p class="mt-3 text-lg text-brand-600">Join in seconds. Build your first lesson today.</p>' +
    '<div class="mt-7 flex flex-wrap justify-center gap-3">' +
    button("I'm a teacher", { variant: 'primary', size: 'lg', href: '/teacher-signin.html' }) +
    button("I'm a student", { variant: 'accent', size: 'lg', href: '/join.html' }) +
    '</div>' +
    '</div>' +
    '</section>'
  )
}

function footerHtml() {
  return (
    '<footer class="border-t border-brand-100 bg-white">' +
    '<div class="max-w-6xl mx-auto px-4 py-10 flex flex-col md:flex-row items-center justify-between gap-4">' +
    logo() +
    '<p class="text-sm text-brand-400 text-center">Prototype demo · Built with Vite + Tailwind</p>' +
    '<p class="text-sm text-brand-300">© ' + new Date().getFullYear() + ' ARCFlow</p>' +
    '</div>' +
    '</footer>'
  )
}

// ---------- shared section wrapper ----------
function section(id, inner) {
  return '<section id="' + id + '" class="max-w-6xl mx-auto px-4 py-16 md:py-20">' + inner + '</section>'
}
