// Teacher app shell. Pure HTML string — pages inject `content` and mount into #app.
import { logo, button, avatar, esc } from './ui.js'
import { teacher } from '../data/mock.js'

const NAV = [
  { key: 'dashboard', label: 'Dashboard', href: '/teacher-dashboard.html', icon: '📊' },
  { key: 'classes', label: 'Classes', href: '/classes.html', icon: '🏫' },
  { key: 'lessons', label: 'Lessons', href: '/lesson-library.html', icon: '📚' },
  { key: 'builder', label: 'Builder', href: '/lesson-builder.html', icon: '🛠️' },
  { key: 'monitor', label: 'Live Monitor', href: '/live-monitor.html', icon: '📡' },
  { key: 'analytics', label: 'Analytics', href: '/analytics.html', icon: '📈' },
]

export function teacherShell({ active, content, title } = {}) {
  const navItems = NAV.map((n) => {
    const on = n.key === active
    const cls = on
      ? 'bg-brand-50 text-brand-700 font-bold border-l-4 border-brand-500'
      : 'text-brand-400 hover:bg-brand-50 hover:text-brand-700 border-l-4 border-transparent'
    return (
      `<a href="${n.href}" class="flex items-center gap-3 px-3 py-2 rounded-pill text-sm transition ${cls}">` +
      `<span class="text-lg">${n.icon}</span><span>${n.label}</span></a>`
    )
  }).join('')

  const sidebar =
    '<aside class="hidden md:flex flex-col w-60 shrink-0 bg-white border-r border-brand-100 p-4">' +
    `<div class="mb-6">${logo()}</div>` +
    `<nav class="flex flex-col gap-1 flex-1">${navItems}</nav>` +
    '</aside>'

  const topbar =
    '<header class="flex items-center justify-between bg-white border-b border-brand-100 px-6 py-3">' +
    `<h1 class="text-lg font-bold text-brand-700">${esc(title || 'Dashboard')}</h1>` +
    '<div class="flex items-center gap-3">' +
    button('New lesson', { variant: 'ghost', size: 'sm', href: '/lesson-builder.html' }) +
    `<div class="flex items-center gap-2">${avatar(teacher.id, { size: 'sm' })}` +
    `<span class="text-sm font-semibold text-brand-700">${esc(teacher.name)}</span></div>` +
    '</div>' +
    '</header>'

  return (
    '<div class="flex min-h-screen">' +
    sidebar +
    '<div class="flex-1 flex flex-col bg-canvas min-w-0">' +
    topbar +
    `<main class="flex-1 p-6 md:p-8">${content || ''}</main>` +
    '</div>' +
    '</div>'
  )
}
