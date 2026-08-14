// Shared UI primitives for ARCFlow prototype.
// Contract: every export returns an HTML STRING (no DOM nodes, no event
// listeners). Interactivity is the page's job. Dynamic text is escaped via esc().

const AVATAR_EMOJIS = ['🦊', '🐼', '🦉', '🐙', '🦄', '🐝', '🐢', '🦋', '🐧', '🐬', '🦜', '🐳']
const AVATAR_BGS = ['bg-brand-100', 'bg-pink-100', 'bg-violet-100', 'bg-fuchsia-100']

export function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

// Prefix internal (root-absolute) paths with the deployment base so links work
// under a sub-path (GitHub project Pages serve at /ARCv2-demo/). External,
// protocol-relative, data, mailto, tel, and hash-only URLs pass through.
// In dev and tests import.meta.env.BASE_URL is '/', so behaviour is unchanged.
export function link(path) {
  if (path == null) return path
  const s = String(path)
  if (s === '' || /^(?:[a-z][a-z0-9+.-]*:|\/\/|data:|mailto:|tel:|#|\?)/i.test(s)) return s
  const base = import.meta.env.BASE_URL || '/'
  return base.replace(/\/$/, '') + '/' + s.replace(/^\//, '')
}

export function logo({ small = false } = {}) {
  const size = small ? 'w-8 h-8' : 'w-10 h-10'
  const word = small ? 'text-lg' : 'text-2xl'
  return (
    '<a href="' + link('/') + '" class="inline-flex items-center gap-2">' +
    `<img src="${esc(link('/logo.png'))}" alt="ARCFlow" class="inline-block rounded-full object-cover shrink-0 ${size}">` +
    `<span class="font-extrabold ${word}"><span class="text-brand-700">ARC</span><span class="text-accent-500">Flow</span></span>` +
    '</a>'
  )
}

export function button(label, { variant = 'primary', href, size = 'md', cls = '', ariaLabel } = {}) {
  const variants = {
    primary: 'bg-brand-500 text-white hover:bg-brand-600',
    accent: 'bg-accent-500 text-white hover:bg-accent-600',
    ghost: 'text-brand-600 hover:bg-brand-50',
    soft: 'bg-brand-50 text-brand-600',
    outline: 'border border-brand-300 text-brand-600 hover:bg-brand-50',
  }
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5',
    lg: 'px-7 py-3 text-lg',
  }
  const base = 'rounded-pill font-bold inline-flex items-center gap-2 transition'
  const classes = `${base} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${cls}`.trim()
  const inner = esc(label)
  const aria = ariaLabel ? ` aria-label="${esc(ariaLabel)}"` : ''
  if (href) return `<a href="${esc(link(href))}" class="${classes}"${aria}>${inner}</a>`
  return `<button type="button" class="${classes}"${aria}>${inner}</button>`
}

export function badge(label, { color = 'brand' } = {}) {
  const colors = {
    brand: 'bg-brand-100 text-brand-700',
    accent: 'bg-pink-100 text-accent-600',
    green: 'bg-green-100 text-green-700',
    amber: 'bg-amber-100 text-amber-700',
    gray: 'bg-gray-100 text-gray-600',
  }
  return `<span class="text-xs font-bold px-2.5 py-1 rounded-pill ${colors[color] || colors.brand}">${esc(label)}</span>`
}

export function tag(label) {
  return (
    '<span class="inline-block text-xs font-semibold text-brand-600 bg-brand-50 border border-brand-100 px-2.5 py-0.5 rounded-md">' +
    `${esc(label)}</span>`
  )
}

export function card(inner, { cls = '', pad = 'p-6' } = {}) {
  return `<div class="bg-white rounded-card shadow-sm border border-brand-100 ${pad} ${cls}">${inner}</div>`
}

export function progressBar(percent) {
  const p = Math.max(0, Math.min(100, Math.round(Number(percent) || 0)))
  return (
    '<div class="h-3 bg-brand-100 rounded-pill overflow-hidden">' +
    `<div class="h-full bg-brand-500 rounded-pill transition-all" style="width:${p}%"></div>` +
    '</div>'
  )
}

export function stat(label, value, { sub, icon } = {}) {
  return card(
    `<p class="text-xs font-bold uppercase tracking-wide text-brand-400">${esc(label)}</p>` +
    `<p class="text-3xl font-extrabold text-brand-700 mt-1">${icon ? `${esc(icon)} ` : ''}${esc(value)}</p>` +
    (sub ? `<p class="text-sm text-gray-500 mt-1">${esc(sub)}</p>` : '')
  )
}

export function avatar(avatarId, { size = 'md' } = {}) {
  const num = Number(String(avatarId ?? '').replace(/\D/g, '')) || 0
  const emoji = AVATAR_EMOJIS[num % AVATAR_EMOJIS.length]
  const bg = AVATAR_BGS[num % AVATAR_BGS.length]
  const sizes = {
    sm: 'w-8 h-8 text-base',
    md: 'w-10 h-10 text-xl',
    lg: 'w-16 h-16 text-3xl',
  }
  return `<span class="inline-flex items-center justify-center rounded-full ${sizes[size] || sizes.md} ${bg}">${emoji}</span>`
}

export function donut(percent, { size = 120, label } = {}) {
  const p = Math.max(0, Math.min(100, Math.round(Number(percent) || 0)))
  const stroke = Math.max(8, Math.round(size / 12))
  const r = size / 2 - stroke / 2
  const c = 2 * Math.PI * r
  const dash = `${(p / 100) * c} ${c}`
  const svg =
    `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" class="-rotate-90" aria-hidden="true">` +
    `<circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="currentColor" stroke-width="${stroke}" class="text-brand-100"/>` +
    `<circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="currentColor" stroke-width="${stroke}" stroke-linecap="round" stroke-dasharray="${dash}" class="text-brand-500 transition-all"/>` +
    '</svg>'
  const center =
    '<span class="absolute inset-0 flex flex-col items-center justify-center">' +
    `<span class="text-xl font-extrabold text-brand-700">${p}%</span>` +
    (label ? `<span class="text-xs text-brand-400">${esc(label)}</span>` : '') +
    '</span>'
  return `<span class="relative inline-grid place-items-center" style="width:${size}px;height:${size}px;">${svg}${center}</span>`
}

export function bars(rows) {
  const list = Array.isArray(rows) ? rows : []
  const inner = list
    .map((row) => {
      const value = Number(row.value) || 0
      const max = Number(row.max) || 0
      const pct = max > 0 ? Math.max(0, Math.min(100, Math.round((value / max) * 100))) : 0
      const fill = row.color === 'accent' ? 'bg-accent-500' : 'bg-brand-500'
      return (
        '<div class="mb-3 last:mb-0">' +
        '<div class="flex items-center justify-between mb-1">' +
        `<span class="text-sm text-brand-700 font-semibold">${esc(row.label)}</span>` +
        `<span class="text-sm text-brand-400">${pct}%</span>` +
        '</div>' +
        `<div class="h-2.5 bg-brand-100 rounded-pill"><div class="h-full ${fill} rounded-pill transition-all" style="width:${pct}%"></div></div>` +
        '</div>'
      )
    })
    .join('')
  return `<div>${inner}</div>`
}

export function pageHead(title, subtitle, { back } = {}) {
  const backHtml = back ? `<div class="mb-3">${button('← Back', { variant: 'ghost', href: back, size: 'sm' })}</div>` : ''
  return (
    '<div class="mb-6">' +
    backHtml +
    `<h1 class="text-2xl md:text-3xl font-extrabold text-brand-700">${esc(title)}</h1>` +
    (subtitle ? `<p class="text-brand-400 mt-1">${esc(subtitle)}</p>` : '') +
    '</div>'
  )
}

export function footer() {
  return '<footer class="text-xs text-brand-300 py-6 text-center">ARCFlow — interactive micro-lessons · prototype demo</footer>'
}

export function emptyState(message) {
  return card(
    '<div class="text-center py-6">' +
    '<div class="text-4xl mb-2">🌱</div>' +
    `<p class="text-brand-400">${esc(message)}</p>` +
    '</div>'
  )
}
