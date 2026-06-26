import { classes, students, lessonSummaries, analytics } from './mock.js'
import { lessons } from './lessons.js'

const delay = (ms = 250) => new Promise((r) => setTimeout(r, ms))
const byId = (arr, id) => arr.find((x) => x.id === id) ?? null

export const api = {
  async listClasses()         { await delay(); return classes },
  async getClassByCode(code)  { await delay(); return classes.find((c) => c.classCode === code) ?? null },
  async listStudents(classId) { await delay(); return students.filter((s) => s.classId === classId) },
  async listLessons()         { await delay(); return lessonSummaries },
  async getLesson(id)         { await delay(); return byId(lessons, id) },
  async getLessonAnalytics(id){ await delay(); return analytics[id] ?? null },
  async submitResult(_result) { await delay(400); return { ok: true, resultId: 'res-' + Date.now() } },
}
