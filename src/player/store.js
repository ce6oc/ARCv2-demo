const KEY = (lessonId) => `arcflow:progress:${lessonId}`

export function saveProgress(session) {
  localStorage.setItem(KEY(session.lessonId), JSON.stringify(session))
}
export function loadProgress(lessonId) {
  const raw = localStorage.getItem(KEY(lessonId))
  return raw ? JSON.parse(raw) : null
}
export function clearProgress(lessonId) {
  localStorage.removeItem(KEY(lessonId))
}
