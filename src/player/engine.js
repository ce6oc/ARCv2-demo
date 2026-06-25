import { scoreScene } from './scoring.js'

export function createSession(lesson) {
  return {
    lessonId: lesson.id,
    currentSceneId: lesson.scenes[0].sceneId,
    responses: [],
    startedAt: Date.now(),
  }
}

export function getSceneById(lesson, sceneId) {
  return lesson.scenes.find((s) => s.sceneId === sceneId) ?? null
}

export function getCurrentScene(lesson, session) {
  return getSceneById(lesson, session.currentSceneId)
}

function sceneIndex(lesson, sceneId) {
  return lesson.scenes.findIndex((s) => s.sceneId === sceneId)
}

export function applyBranching(lesson, _session, evaluation, fromSceneId) {
  const scene = getSceneById(lesson, fromSceneId)
  if (!scene) return null
  const br = scene.branching || {}

  if (br.onCorrect || br.onIncorrect) {
    if (evaluation.isCorrect === true && br.onCorrect) return br.onCorrect
    if (evaluation.isCorrect === false && br.onIncorrect) return br.onIncorrect
  }

  if (Array.isArray(br.rules)) {
    for (const rule of br.rules) {
      if (matchesCondition(rule.condition, evaluation)) return rule.goto
    }
  }

  if (br.onComplete) return br.onComplete

  const idx = sceneIndex(lesson, fromSceneId)
  const next = lesson.scenes[idx + 1]
  return next ? next.sceneId : null
}

function matchesCondition(condition, evaluation) {
  if (!condition) return false
  if (condition.includes('isCorrect == false')) return evaluation.isCorrect === false
  if (condition.includes('isCorrect == true'))  return evaluation.isCorrect === true
  return false
}

export function recordResponse(session, responseEntry) {
  return { ...session, responses: [...session.responses, responseEntry] }
}

export function isComplete(lesson, session) {
  const last = session.responses.at(-1)
  if (!last) return false
  return applyBranching(lesson, session, { isCorrect: last.isCorrect }, last.sceneId) === null
}

export function computeScore(lesson, session) {
  const scorable = lesson.scenes.filter((s) => [
    'multiple-choice-quiz', 'categorize-items', 'match-pairs', 'open-text-question',
  ].includes(s.sceneType))
  const possible = scorable.length
  const achieved = session.responses.filter((r) => r.isCorrect === true).length
  const percentage = possible ? Math.round((achieved / possible) * 100) : 0
  return { achieved, possible, percentage }
}
