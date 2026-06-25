import { describe, it, expect, beforeEach } from 'vitest'
import { renderScene } from './scene-renderers.js'

const mount = () => {
  document.body.innerHTML = '<div id="m"></div>'
  return document.getElementById('m')
}

const collect = () => {
  const received = []
  const fn = (p) => received.push(p)
  return { received, fn }
}

let handlersBefore = 0
beforeEach(() => {
  // count message listeners indirectly is hard in jsdom; we rely on behaviour instead
  handlersBefore = 0
})

describe('scene renderers', () => {
  it('content submits {}', () => {
    const { received, fn } = collect()
    const m = mount()
    renderScene({ sceneType: 'content', content: '<p>hi</p>' }, fn, m)
    expect(m.className).toBe('scene scene-content')
    expect(m.querySelector('[data-action="continue"]')).toBeTruthy()
    m.querySelector('[data-action="continue"]').click()
    expect(received[0]).toEqual({})
  })

  it('video submits {watchedPercentage:100}', () => {
    const { received, fn } = collect()
    const m = mount()
    renderScene(
      { sceneType: 'video', content: '<p>v</p>', interactiveElement: { videoId: 'abc123' } },
      fn,
      m
    )
    const iframe = m.querySelector('iframe')
    expect(iframe.src).toContain('youtube.com/embed/abc123')
    m.querySelector('[data-action="continue"]').click()
    expect(received[0]).toEqual({ watchedPercentage: 100 })
  })

  it('multiple-choice submits {response, confidence} when rating enabled', () => {
    const { received, fn } = collect()
    const m = mount()
    const scene = {
      sceneType: 'multiple-choice-quiz',
      content: '<p>q</p>',
      interactiveElement: {
        question: 'Q?',
        options: [
          { optionId: 'a', text: 'A' },
          { optionId: 'c', text: 'C' },
        ],
        correctOptionId: 'c',
        enableConfidenceRating: true,
      },
    }
    renderScene(scene, fn, m)
    const submit = m.querySelector('[data-action="submit"]')
    expect(submit.disabled).toBe(true)
    m.querySelector('[data-option="c"]').click()
    expect(submit.disabled).toBe(false)
    submit.click()
    expect(received[0].response).toBe('c')
    expect(typeof received[0].confidence).toBe('number')
  })

  it('multiple-choice omits numeric confidence when rating disabled', () => {
    const { received, fn } = collect()
    const m = mount()
    renderScene(
      {
        sceneType: 'multiple-choice-quiz',
        interactiveElement: {
          question: 'Q?',
          options: [{ optionId: 'a', text: 'A' }],
          correctOptionId: 'a',
          enableConfidenceRating: false,
        },
      },
      fn,
      m
    )
    m.querySelector('[data-option="a"]').click()
    m.querySelector('[data-action="submit"]').click()
    expect(received[0].response).toBe('a')
    expect(received[0].confidence).toBeUndefined()
  })

  it('categorize submits {submittedCategorization} with all items', () => {
    const { received, fn } = collect()
    const m = mount()
    const scene = {
      sceneType: 'categorize-items',
      content: '<p>c</p>',
      interactiveElement: {
        categories: ['Noun', 'Verb'],
        items: [
          { itemId: 'run', text: 'run' },
          { itemId: 'ocean', text: 'ocean' },
        ],
        correctCategorization: { run: 'Verb', ocean: 'Noun' },
      },
    }
    renderScene(scene, fn, m)
    const submit = () => m.querySelector('[data-action="submit"]')
    expect(submit().disabled).toBe(true)
    // assign run -> Verb, ocean -> Noun
    m.querySelector('[data-item="run"]').click()
    m.querySelector('[data-category="Verb"]').click()
    m.querySelector('[data-item="ocean"]').click()
    m.querySelector('[data-category="Noun"]').click()
    expect(submit().disabled).toBe(false)
    submit().click()
    expect(received[0].submittedCategorization).toEqual({ run: 'Verb', ocean: 'Noun' })
  })

  it('categorize allows reassignment before submit', () => {
    const { received, fn } = collect()
    const m = mount()
    renderScene(
      {
        sceneType: 'categorize-items',
        interactiveElement: {
          categories: ['A', 'B'],
          items: [{ itemId: 'x', text: 'X' }],
        },
      },
      fn,
      m
    )
    m.querySelector('[data-item="x"]').click()
    m.querySelector('[data-category="A"]').click()
    // reassign to B
    m.querySelector('[data-item="x"]').click()
    m.querySelector('[data-category="B"]').click()
    m.querySelector('[data-action="submit"]').click()
    expect(received[0].submittedCategorization).toEqual({ x: 'B' })
  })

  it('match-pairs submits {submittedMapping}', () => {
    const { received, fn } = collect()
    const m = mount()
    const scene = {
      sceneType: 'match-pairs',
      content: '<p>m</p>',
      interactiveElement: {
        pairs: [
          { itemId: 'A', text: 'Mars' },
          { itemId: 'B', text: 'Saturn' },
        ],
        matches: [
          { matchId: '1', text: 'Rings' },
          { matchId: '2', text: 'Red Planet' },
        ],
        correctMapping: { A: '2', B: '1' },
      },
    }
    renderScene(scene, fn, m)
    expect(m.querySelector('[data-action="submit"]').disabled).toBe(true)
    m.querySelector('[data-pair="A"]').click()
    m.querySelector('[data-match="2"]').click()
    m.querySelector('[data-pair="B"]').click()
    m.querySelector('[data-match="1"]').click()
    expect(m.querySelector('[data-action="submit"]').disabled).toBe(false)
    m.querySelector('[data-action="submit"]').click()
    expect(received[0].submittedMapping).toEqual({ A: '2', B: '1' })
  })

  it('match-pairs disables a used match and allows change', () => {
    const { received, fn } = collect()
    const m = mount()
    renderScene(
      {
        sceneType: 'match-pairs',
        interactiveElement: {
          pairs: [{ itemId: 'A', text: 'A' }],
          matches: [
            { matchId: '1', text: 'one' },
            { matchId: '2', text: 'two' },
          ],
        },
      },
      fn,
      m
    )
    m.querySelector('[data-pair="A"]').click()
    m.querySelector('[data-match="1"]').click()
    expect(m.querySelector('[data-match="1"]').disabled).toBe(true)
    // change to match 2
    m.querySelector('[data-pair="A"]').click()
    m.querySelector('[data-match="2"]').click()
    m.querySelector('[data-action="submit"]').click()
    expect(received[0].submittedMapping).toEqual({ A: '2' })
  })

  it('open-text submits {response} and highlights keywords', () => {
    const { received, fn } = collect()
    const m = mount()
    renderScene(
      {
        sceneType: 'open-text-question',
        content: '<p>o</p>',
        interactiveElement: { question: 'Q?', suggestedKeywords: ['water', 'life'] },
      },
      fn,
      m
    )
    const ta = m.querySelector('[data-action="text"]')
    ta.value = 'Earth has WATER!'
    ta.dispatchEvent(new Event('input'))
    const waterPill = m.querySelector('[data-keyword="water"]')
    expect(waterPill.className).toContain('bg-brand-500')
    m.querySelector('[data-action="submit"]').click()
    expect(received[0]).toEqual({ response: 'Earth has WATER!' })
  })

  it('audio-response submits {audioUrl, durationSeconds:12}', () => {
    const { received, fn } = collect()
    const m = mount()
    renderScene(
      { sceneType: 'audio-response', content: '<p>a</p>', interactiveElement: { question: 'Q?' } },
      fn,
      m
    )
    expect(m.querySelector('[data-action="record"]')).toBeTruthy()
    m.querySelector('[data-action="continue"]').click()
    expect(received[0]).toEqual({ audioUrl: 'mock://recording.mp3', durationSeconds: 12 })
  })

  it('custom-interactive forwards postMessage data via onSubmit', () => {
    const { received, fn } = collect()
    const m = mount()
    renderScene(
      {
        sceneType: 'custom-interactive',
        content: '<p>c</p>',
        interactiveElement: { embedUrl: '/games/x.html' },
      },
      fn,
      m
    )
    expect(m.querySelector('iframe').getAttribute('src')).toBe('/games/x.html')
    expect(m.querySelector('[data-action="continue"]')).toBeTruthy()
    window.dispatchEvent(
      new MessageEvent('message', {
        data: { type: 'EDUFLOW_COMPLETE', data: { score: 100 } },
      })
    )
    expect(received[0]).toEqual({ score: 100 })
  })

  it('custom-interactive Continue fallback submits {data:{score:0}}', () => {
    const { received, fn } = collect()
    const m = mount()
    renderScene(
      { sceneType: 'custom-interactive', interactiveElement: { embedUrl: '/g.html' } },
      fn,
      m
    )
    m.querySelector('[data-action="continue"]').click()
    expect(received[0]).toEqual({ data: { score: 0 } })
  })

  it('custom-interactive message listener is cleaned up on re-render (no leak)', () => {
    const a = collect()
    const b = collect()
    const m = mount()
    renderScene(
      { sceneType: 'custom-interactive', interactiveElement: { embedUrl: '/a.html' } },
      a.fn,
      m
    )
    renderScene(
      { sceneType: 'custom-interactive', interactiveElement: { embedUrl: '/b.html' } },
      b.fn,
      m
    )
    window.dispatchEvent(
      new MessageEvent('message', {
        data: { type: 'EDUFLOW_COMPLETE', data: { score: 7 } },
      })
    )
    // only the latest renderer should receive the message
    expect(a.received).toHaveLength(0)
    expect(b.received).toEqual([{ score: 7 }])
  })

  it('cleans up custom listener even when switching to a non-custom scene', () => {
    const a = collect()
    const m = mount()
    renderScene(
      { sceneType: 'custom-interactive', interactiveElement: { embedUrl: '/a.html' } },
      a.fn,
      m
    )
    renderScene({ sceneType: 'content', content: '<p>done</p>' }, () => {}, m)
    window.dispatchEvent(
      new MessageEvent('message', {
        data: { type: 'EDUFLOW_COMPLETE', data: { score: 1 } },
      })
    )
    expect(a.received).toHaveLength(0)
  })
})
