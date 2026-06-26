export function scoreMultipleChoice(scene, optionId) {
  return { isCorrect: optionId === scene.interactiveElement.correctOptionId }
}

export function scoreCategorize(scene, submitted) {
  const correct = scene.interactiveElement.correctCategorization
  const keys = Object.keys(correct)
  const right = keys.filter((k) => submitted[k] === correct[k]).length
  return { isCorrect: right === keys.length, detail: { correct: right, total: keys.length } }
}

export function scoreMatch(scene, submitted) {
  const correct = scene.interactiveElement.correctMapping
  const keys = Object.keys(correct)
  const right = keys.filter((k) => submitted[k] === correct[k]).length
  return { isCorrect: right === keys.length, detail: { correctPairs: right, totalPairs: keys.length } }
}

export function scoreOpenText(scene, text) {
  const lower = (text || '').toLowerCase()
  const found = (scene.interactiveElement.suggestedKeywords || []).filter((k) => lower.includes(k.toLowerCase()))
  return { isCorrect: found.length > 0, detail: { keywordsFound: found } }
}

export function scoreScene(scene, response) {
  switch (scene.sceneType) {
    case 'multiple-choice-quiz': return scoreMultipleChoice(scene, response)
    case 'categorize-items':     return scoreCategorize(scene, response)
    case 'match-pairs':          return scoreMatch(scene, response)
    case 'open-text-question':   return scoreOpenText(scene, response)
    default: return { isCorrect: null }
  }
}
