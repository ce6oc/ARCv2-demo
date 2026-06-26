import { describe, it, expect } from 'vitest'
import { api } from './api.js'

describe('mock api', () => {
  it('lists classes for the teacher', async () => {
    const classes = await api.listClasses()
    expect(classes.length).toBeGreaterThan(0)
    expect(classes[0]).toHaveProperty('classCode')
  })

  it('looks up a class by code', async () => {
    const cls = await api.getClassByCode('SPACE-2024-A')
    expect(cls.className).toBe('Room 204 — Explorers')
  })

  it('returns unknown code as null', async () => {
    expect(await api.getClassByCode('NOPE')).toBeNull()
  })

  it('lists students in a class', async () => {
    const students = await api.listStudents('class-1')
    expect(students.length).toBeGreaterThan(0)
  })

  it('lists lessons', async () => {
    const lessons = await api.listLessons()
    expect(lessons.length).toBe(3)
  })

  it('gets a lesson by id with scenes', async () => {
    const lesson = await api.getLesson('lesson-solar')
    expect(lesson.scenes.length).toBeGreaterThan(0)
  })

  it('returns analytics for a lesson', async () => {
    const a = await api.getLessonAnalytics('lesson-solar')
    expect(a.completions).toBeGreaterThan(0)
    expect(a.sceneBreakdown.length).toBeGreaterThan(0)
  })
})
