export const teacher = {
  id: 'user-1', name: 'Ms. Rivera', email: 'rivera@eduflow.app',
  avatar: '👩‍🏫', school: 'Maple Grove Elementary',
}

export const classes = [
  {
    id: 'class-1', className: 'Room 204 — Explorers', classCode: 'SPACE-2024-A',
    registrationLink: 'https://eduflow.app/join?code=SPACE-2024-A',
    gradeLevel: '3', studentCount: 24, isActive: true, createdAt: '2026-01-12',
  },
  {
    id: 'class-2', className: 'Reading Rockets', classCode: 'READ-2024-B',
    registrationLink: 'https://eduflow.app/join?code=READ-2024-B',
    gradeLevel: '4', studentCount: 19, isActive: true, createdAt: '2026-02-03',
  },
]

export const students = [
  { id: 's1', classId: 'class-1', nickname: 'SuperNova',   avatarId: 'avatar_05', avgScore: 82, lessonsDone: 4 },
  { id: 's2', classId: 'class-1', nickname: 'MoonBeam',    avatarId: 'avatar_02', avgScore: 91, lessonsDone: 5 },
  { id: 's3', classId: 'class-1', nickname: 'CometKid',    avatarId: 'avatar_08', avgScore: 64, lessonsDone: 3 },
  { id: 's4', classId: 'class-1', nickname: 'StarDust',    avatarId: 'avatar_11', avgScore: 76, lessonsDone: 4 },
  { id: 's5', classId: 'class-1', nickname: 'OrbitOwl',    avatarId: 'avatar_04', avgScore: 88, lessonsDone: 5 },
  { id: 's6', classId: 'class-1', nickname: 'NebulaNova',  avatarId: 'avatar_09', avgScore: 55, lessonsDone: 2 },
  { id: 's7', classId: 'class-2', nickname: 'WordWeaver',  avatarId: 'avatar_03', avgScore: 79, lessonsDone: 3 },
  { id: 's8', classId: 'class-2', nickname: 'PagePirate',  avatarId: 'avatar_07', avgScore: 70, lessonsDone: 3 },
]

export const avatars = ['avatar_01','avatar_02','avatar_03','avatar_04','avatar_05','avatar_06','avatar_07','avatar_08','avatar_09','avatar_10','avatar_11','avatar_12']

export const lessonSummaries = [
  { id: 'lesson-solar',  title: 'Journey Through the Solar System', subject: 'Science',        gradeLevel: '2-4', emoji: '🪐', scenes: 8, description: 'An interactive tour of the planets with quizzes, sorting, and voice reflection.' },
  { id: 'lesson-words',  title: 'Word Wizards: Poetry & Vocabulary',subject: 'Language Arts',  gradeLevel: '3-5', emoji: '📖', scenes: 7, description: 'Build vocabulary with matching, word-sorting, and a drag-to-spell mini-game.' },
  { id: 'lesson-math',   title: 'Math Quest: Fractions & Logic',    subject: 'Math',           gradeLevel: '4-6', emoji: '➗', scenes: 7, description: 'Master fractions with adaptive hints that branch when you get stuck.' },
]

export const analytics = {
  'lesson-solar': {
    completions: 22, avgScore: 78, avgDurationSec: 740, avgConfidence: 3.8,
    sceneBreakdown: [
      { sceneId: 's1', title: 'Intro',               errorRate: 0.02, avgSec: 20 },
      { sceneId: 's2', title: 'Sun video',           errorRate: 0.0,  avgSec: 95 },
      { sceneId: 's3', title: 'Mercury quiz',        errorRate: 0.18, avgSec: 28 },
      { sceneId: 's4', title: 'Sort planets',        errorRate: 0.41, avgSec: 150 },
      { sceneId: 's5', title: 'Match features',      errorRate: 0.33, avgSec: 110 },
      { sceneId: 's6', title: 'Open text',           errorRate: 0.12, avgSec: 180 },
      { sceneId: 's7', title: 'Audio response',      errorRate: 0.0,  avgSec: 60 },
    ],
    confidenceVsCorrect: [
      { bucket: 'High confidence, correct', count: 14 },
      { bucket: 'High confidence, wrong',   count: 5  },
      { bucket: 'Low confidence, correct',  count: 2  },
      { bucket: 'Low confidence, wrong',    count: 1  },
    ],
  },
  'lesson-words':  { completions: 16, avgScore: 84, avgDurationSec: 520, avgConfidence: 4.1, sceneBreakdown: [], confidenceVsCorrect: [] },
  'lesson-math':   { completions: 19, avgScore: 71, avgDurationSec: 810, avgConfidence: 3.2, sceneBreakdown: [], confidenceVsCorrect: [] },
}
