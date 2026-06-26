import { describe, it, expect } from 'vitest'
import {
  button,
  card,
  progressBar,
  avatar,
  donut,
  bars,
  stat,
  badge,
  tag,
  logo,
  pageHead,
  footer,
  emptyState,
  esc,
} from './ui.js'

describe('ui helpers', () => {
  it('button primary renders anchor when href', () => {
    const h = button('Go', { href: '/x' })
    expect(h).toContain('<a')
    expect(h).toContain('Go')
    expect(h).toContain('/x')
  })

  it('button renders <button> when no href', () => {
    expect(button('OK')).toContain('<button')
  })

  it('button supports variants and sizes', () => {
    expect(button('x', { variant: 'accent' })).toContain('bg-accent-500')
    expect(button('x', { size: 'lg' })).toContain('px-7')
  })

  it('card wraps inner', () => {
    expect(card('<p>hi</p>')).toContain('hi')
    expect(card('x', { cls: 'extra', pad: 'p-4' })).toContain('p-4')
  })

  it('progressBar clamps width', () => {
    expect(progressBar(150)).toContain('width:100%')
    expect(progressBar(-5)).toContain('width:0%')
    expect(progressBar(42)).toContain('width:42%')
  })

  it('avatar returns an emoji circle', () => {
    expect(avatar('avatar_05')).toMatch(/rounded-full/)
  })

  it('avatar is deterministic for same id', () => {
    expect(avatar('avatar_03')).toBe(avatar('avatar_03'))
  })

  it('donut contains svg', () => {
    expect(donut(75)).toContain('<svg')
    expect(donut(75)).toContain('75%')
  })

  it('bars renders rows as divs (no svg)', () => {
    const h = bars([{ label: 'A', value: 2, max: 5 }])
    expect(h).toContain('A')
    expect(h).not.toContain('<svg')
    expect(h).toContain('40%')
  })

  it('stat shows value', () => {
    expect(stat('Students', 43).toString()).toContain('43')
  })

  it('badge/tag/logo/pageHead/footer/emptyState return strings', () => {
    for (const h of [badge('x'), tag('Science'), logo(), pageHead('T', 's'), footer(), emptyState('none')]) {
      expect(typeof h).toBe('string')
      expect(h.length).toBeGreaterThan(0)
    }
  })

  it('esc escapes unsafe characters', () => {
    expect(esc('<b>"&\'</b>')).not.toContain('<')
    expect(esc('<')).toBe('&lt;')
    expect(esc(undefined)).toBe('')
  })

  it('handles edge inputs without throwing', () => {
    expect(() => bars([])).not.toThrow()
    expect(() => bars()).not.toThrow()
    expect(() => donut(0)).not.toThrow()
    expect(() => avatar('')).not.toThrow()
    expect(() => avatar(undefined)).not.toThrow()
    expect(() => progressBar(NaN)).not.toThrow()
  })
})
