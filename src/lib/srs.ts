import { questionIndex } from '../data'
import type { Question } from '../data/types'
import { addDays, today } from './date'
import type { Box, Grade, Progress, QuestionRecord } from './storage'

/** 단계별 복습 간격(일): 0→당일, 1→1, 2→3, 3→7, 4→14, 5→30 */
export const INTERVALS = [0, 1, 3, 7, 14, 30] as const

/** 오답노트 졸업에 필요한 연속 정답 수 */
export const GRADUATE_STREAK = 2

export function applyGrade(p: Progress, id: string, grade: Grade, answer?: string): Progress {
  const now = today()
  const prev: QuestionRecord = p.questions[id] ?? { box: 0, nextDue: now, correct: 0, wrong: 0, streak: 0, lastSeen: now }
  let box: Box = prev.box
  let wrongNote = p.wrongNote
  const rec: QuestionRecord = { ...prev, lastSeen: now, lastAnswer: answer ?? prev.lastAnswer }

  if (grade === 'correct') {
    box = Math.min(5, prev.box + 1) as Box
    rec.correct += 1
    rec.streak += 1
    if (wrongNote.includes(id) && rec.streak >= GRADUATE_STREAK) wrongNote = wrongNote.filter((x) => x !== id)
  } else if (grade === 'wrong') {
    box = 0
    rec.wrong += 1
    rec.streak = 0
    if (!wrongNote.includes(id)) wrongNote = [...wrongNote, id]
  }
  // 'unsure' → 단계 유지
  rec.box = box
  rec.nextDue = addDays(now, INTERVALS[box])

  const activity = p.activity.includes(now) ? p.activity : [...p.activity, now].slice(-120)
  return { ...p, questions: { ...p.questions, [id]: rec }, wrongNote, activity }
}

export function isDue(p: Progress, id: string, now = today()): boolean {
  const r = p.questions[id]
  return !!r && r.nextDue <= now
}

/** 오늘 복습: 오답노트 우선 + 복습일 도래, 최대 dailyLimit */
export function reviewQueue(p: Progress): string[] {
  const now = today()
  const wrong = p.wrongNote.filter((id) => questionIndex.has(id))
  const due = Object.keys(p.questions)
    .filter((id) => questionIndex.has(id) && !wrong.includes(id) && isDue(p, id, now))
    .sort((a, b) => p.questions[a].nextDue.localeCompare(p.questions[b].nextDue))
  return [...wrong, ...due].slice(0, p.settings.dailyLimit)
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** 단답형 비교: 공백·대소문자·끝 마침표 무시 */
export function normalize(s: string): string {
  return s.toLowerCase().replace(/\s+/g, '').replace(/[.。]+$/, '')
}

export function gradeShort(q: Extract<Question, { type: 'short' }>, input: string): boolean {
  const v = normalize(input)
  return v.length > 0 && q.answer.some((a) => normalize(a) === v)
}

/** 오늘 포함 연속 학습 일수 (오늘 안 했으면 어제까지) */
export function streakDays(p: Progress): number {
  const set = new Set(p.activity)
  let d = today()
  if (!set.has(d)) d = addDays(d, -1)
  let n = 0
  while (set.has(d)) {
    n += 1
    d = addDays(d, -1)
  }
  return n
}
