import { api } from '../data/api.js'
import { studentShell } from '../components/student-layout.js'
import { progressBar, link } from '../components/ui.js'
import { createSession, getCurrentScene, applyBranching, recordResponse, computeScore } from '../player/engine.js'
import { scoreScene } from '../player/scoring.js'
import { renderScene } from '../components/scene-renderers.js'
import { loadProgress, saveProgress, clearProgress } from '../player/store.js'

// Scene renderers (Unit 4) and scoreScene (Unit 3) use different payload shapes.
// Normalize the renderer payload into the argument each scorer expects so the
// two units integrate correctly. Without this, quizzes always score wrong and
// open-text throws (scoreOpenText does (text||'').toLowerCase() on a string).
function toScoringArg(scene, response) {
  switch (scene.sceneType) {
    case 'multiple-choice-quiz': return response?.response
    case 'categorize-items':     return response?.submittedCategorization
    case 'match-pairs':          return response?.submittedMapping
    case 'open-text-question':   return response?.response
    default:                     return response
  }
}

const params = new URLSearchParams(location.search)
const lessonId = params.get('id') ?? 'lesson-solar'

const app = document.getElementById('app')
// Loading state first (api has simulated latency):
app.innerHTML = '<div class="min-h-screen grid place-items-center text-brand-400 font-semibold">Loading lesson…</div>'
const lesson = await api.getLesson(lessonId)

// Guard: unknown lesson id
if (!lesson) {
  app.innerHTML = studentShell({ title: 'Lesson not found', back: '/student-lessons.html',
    content: '<div class="bg-white rounded-card p-8 text-center text-brand-400">Sorry, we couldn’t find that lesson.</div>' })
} else {
  let session = loadProgress(lessonId) ?? createSession(lesson)
  render()

  function render() {
    const scene = getCurrentScene(lesson, session)
    const idx = Math.max(0, lesson.scenes.findIndex((s) => s.sceneId === session.currentSceneId))
    const pct = Math.round((idx / lesson.scenes.length) * 100)
    app.innerHTML = studentShell({
      title: lesson.title,
      back: '/student-lessons.html',
      content: `
        <div class="mb-4">${progressBar(pct)}</div>
        <div class="bg-white rounded-card p-6 shadow-sm" id="scene-mount"></div>
        <div id="feedback" class="mt-3 text-center font-semibold h-6"></div>`,
    })
    const mount = document.getElementById('scene-mount')
    renderScene(scene, handleResponse, mount)
    saveProgress(session)
  }

  function handleResponse(response) {
    const scene = getCurrentScene(lesson, session)
    const evaluation = scoreScene(scene, toScoringArg(scene, response))
    session = recordResponse(session, {
      sceneId: scene.sceneId, response, isCorrect: evaluation.isCorrect, ...(evaluation.detail || {}),
    })
    const fb = document.getElementById('feedback')
    if (typeof evaluation.isCorrect === 'boolean') {
      fb.textContent = evaluation.isCorrect ? '✅ Correct!' : '💡 Not quite — let’s keep going.'
      fb.className = 'mt-3 text-center font-semibold h-6 ' + (evaluation.isCorrect ? 'text-green-600' : 'text-accent-600')
    }
    saveProgress(session)
    setTimeout(advance, 650)
  }

  function advance() {
    const scene = getCurrentScene(lesson, session)
    const lastEval = { isCorrect: session.responses.at(-1)?.isCorrect }
    const nextId = applyBranching(lesson, session, lastEval, scene.sceneId)
    if (!nextId) return finish()
    session.currentSceneId = nextId
    render()
  }

  function finish() {
    const score = computeScore(lesson, session)
    clearProgress(lessonId)
    const result = {
      lessonId, title: lesson.title,
      score, durationInSeconds: Math.round((Date.now() - session.startedAt) / 1000),
      responses: session.responses,
    }
    sessionStorage.setItem('arcflow:lastResult', JSON.stringify(result))
    location.href = link('/results.html')
  }
}
