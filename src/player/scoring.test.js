import { describe, it, expect } from 'vitest'
import { scoreMultipleChoice, scoreCategorize, scoreMatch, scoreOpenText } from './scoring.js'

describe('scoring', () => {
  const mc = { sceneType: 'multiple-choice-quiz', interactiveElement: { correctOptionId: 'c' } }
  it('mc correct/incorrect', () => {
    expect(scoreMultipleChoice(mc, 'c').isCorrect).toBe(true)
    expect(scoreMultipleChoice(mc, 'a').isCorrect).toBe(false)
  })

  const cat = { sceneType: 'categorize-items', interactiveElement: { correctCategorization: { earth: 'Terrestrial', mars: 'Terrestrial', jupiter: 'Gas Giant' } } }
  it('categorize all-correct', () => {
    const r = scoreCategorize(cat, { earth: 'Terrestrial', mars: 'Terrestrial', jupiter: 'Gas Giant' })
    expect(r.isCorrect).toBe(true)
    expect(r.detail.correct).toBe(3)
  })
  it('categorize partial', () => {
    const r = scoreCategorize(cat, { earth: 'Terrestrial', mars: 'Gas Giant', jupiter: 'Gas Giant' })
    expect(r.isCorrect).toBe(false)
    expect(r.detail.correct).toBe(2)
    expect(r.detail.total).toBe(3)
  })

  const match = { sceneType: 'match-pairs', interactiveElement: { correctMapping: { A: '2', B: '1' } } }
  it('match correct count', () => {
    const r = scoreMatch(match, { A: '1', B: '1' })
    expect(r.isCorrect).toBe(false)
    expect(r.detail.correctPairs).toBe(1)
    expect(r.detail.totalPairs).toBe(2)
  })

  const ot = { sceneType: 'open-text-question', interactiveElement: { suggestedKeywords: ['water', 'life'] } }
  it('open-text finds keywords case-insensitively', () => {
    const r = scoreOpenText(ot, 'Earth has WATER and Life.')
    expect(r.detail.keywordsFound).toEqual(['water', 'life'])
    expect(r.isCorrect).toBe(true)
  })
})
