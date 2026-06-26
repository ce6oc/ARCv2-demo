// Student lesson shell. Minimal centered column. Pure HTML string.
import { logo, button, avatar, esc } from './ui.js'

export function studentShell({ title, content, back } = {}) {
  const backHtml = back ? button('←', { variant: 'ghost', href: back, size: 'sm', ariaLabel: 'Back' }) : '<span></span>'

  const topbar =
    '<header class="sticky top-0 bg-white/80 backdrop-blur border-b border-brand-100 px-4 py-3 flex items-center justify-between">' +
    `<div class="flex items-center gap-2">${backHtml}${logo({ small: true })}</div>` +
    `<div>${avatar('avatar_05', { size: 'sm' })}</div>` +
    '</header>'

  const titleRow = title
    ? `<div class="max-w-3xl mx-auto px-4 pt-6"><p class="text-sm text-brand-400 font-semibold">${esc(title)}</p></div>`
    : ''

  return (
    topbar +
    titleRow +
    `<main class="max-w-3xl mx-auto px-4 py-8">${content || ''}</main>`
  )
}
