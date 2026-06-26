import { describe, it, expect } from 'vitest'
import { createSession, getCurrentScene, applyBranching, recordResponse, computeScore, isComplete } from './engine.js'

const lesson = {
  id: 'L', scenes: [
    { sceneId: 's1', sceneType: 'content' },
    { sceneId: 's2', sceneType: 'multiple-choice-quiz', interactiveElement: { correctOptionId: 'b' },
      branching: { onComplete: 's4', rules: [{ condition: 'isCorrect == false', goto: 's3' }] } },
    { sceneId: 's3', sceneType: 'content' },
    { sceneId: 's4', sceneType: 'content' },
  ],
}

describe('engine', () => {
  it('starts at first scene', () => {
    const session = createSession(lesson)
    expect(getCurrentScene(lesson, session).sceneId).toBe('s1')
  })

  it('rules branching sends wrong answer to help scene', () => {
    const session = createSession(lesson)
    expect(applyBranching(lesson, session, { isCorrect: false }, 's2')).toBe('s3')
  })

  it('rules branching sends correct answer to onComplete', () => {
    const session = createSession(lesson)
    expect(applyBranching(lesson, session, { isCorrect: true }, 's2')).toBe('s4')
  })

  it('falls back to next scene in order when no branching', () => {
    const session = createSession(lesson)
    expect(applyBranching(lesson, session, {}, 's1')).toBe('s2')
  })

  it('returns null after the last scene (complete)', () => {
    const session = createSession(lesson)
    expect(applyBranching(lesson, session, {}, 's4')).toBeNull()
  })

  it('records a response and computes score', () => {
    let session = createSession(lesson)
    session = recordResponse(session, { sceneId: 's2', response: 'b', isCorrect: true })
    expect(computeScore(lesson, session)).toEqual({ achieved: 1, possible: 1, percentage: 100 })
    expect(isComplete(lesson, session)).toBe(false)
  })

  it('onCorrect/onIncorrect shape works too', () => {
    const l2 = { id: 'X', scenes: [
      { sceneId: 'a', sceneType: 'multiple-choice-quiz', interactiveElement: { correctOptionId: 'x' }, branching: { onCorrect: 'b', onIncorrect: 'c' } },
      { sceneId: 'b', sceneType: 'content' }, { sceneId: 'c', sceneType: 'content' },
    ]}
    const session = createSession(l2)
    expect(applyBranching(l2, session, { isCorrect: false }, 'a')).toBe('c')
    expect(applyBranching(l2, session, { isCorrect: true }, 'a')).toBe('b')
  })
})
