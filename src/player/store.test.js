import { describe, it, expect, beforeEach } from 'vitest'
import { saveProgress, loadProgress, clearProgress } from './store.js'

beforeEach(() => localStorage.clear())

describe('store', () => {
  it('round-trips a session', () => {
    const session = { lessonId: 'x', currentSceneId: 's2', responses: [], startedAt: 1 }
    saveProgress(session)
    expect(loadProgress('x')).toEqual(session)
  })
  it('returns null when nothing saved', () => {
    expect(loadProgress('nope')).toBeNull()
  })
  it('clears a session', () => {
    saveProgress({ lessonId: 'x', currentSceneId: 's1', responses: [], startedAt: 1 })
    clearProgress('x')
    expect(loadProgress('x')).toBeNull()
  })
})
