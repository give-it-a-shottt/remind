import { topics } from '../data'
import type { Topic, Track } from '../data/types'
import { contentMeta } from '../data/meta'
import { daysBetween } from './date'
import type { Progress } from './storage'

export type TopicStatus = '미학습' | '학습중' | '완료'

export interface TopicStats {
  total: number
  seen: number
  correct: number
  wrong: number
  /** 푼 문제 기준 정답률 0~100, 없으면 null */
  accuracy: number | null
  wrongCount: number
  lastSeen?: string
  status: TopicStatus
}

export function topicStats(t: Topic, p: Progress): TopicStats {
  let seen = 0
  let correct = 0
  let wrong = 0
  let lastSeen: string | undefined
  for (const q of t.questions) {
    const r = p.questions[q.id]
    if (!r) continue
    seen += 1
    correct += r.correct
    wrong += r.wrong
    if (!lastSeen || r.lastSeen > lastSeen) lastSeen = r.lastSeen
  }
  const attempts = correct + wrong
  const accuracy = attempts ? Math.round((correct / attempts) * 100) : null
  const wrongCount = t.questions.filter((q) => p.wrongNote.includes(q.id)).length
  const status: TopicStatus = seen === 0 ? '미학습' : seen === t.questions.length && (accuracy ?? 0) >= 80 ? '완료' : '학습중'
  return { total: t.questions.length, seen, correct, wrong, accuracy, wrongCount, lastSeen, status }
}

export function trackStats(track: Track, p: Progress) {
  const list = topics.filter((t) => t.track === track)
  let done = 0
  let correct = 0
  let wrong = 0
  let seenQ = 0
  let totalQ = 0
  for (const t of list) {
    const s = topicStats(t, p)
    if (s.status === '완료') done += 1
    correct += s.correct
    wrong += s.wrong
    seenQ += s.seen
    totalQ += s.total
  }
  const attempts = correct + wrong
  return {
    topics: list.length,
    done,
    questions: totalQ,
    seen: seenQ,
    progress: totalQ ? seenQ / totalQ : 0,
    accuracy: attempts ? Math.round((correct / attempts) * 100) : null,
  }
}

/** 마지막 동기화 기준 7일 안에 추가·수정된 토픽 */
export function recentUpdates(): { topic: Topic; kind: 'NEW' | 'UPDATED'; date: string }[] {
  const out: { topic: Topic; kind: 'NEW' | 'UPDATED'; date: string }[] = []
  for (const t of topics) {
    const date = t.updatedAt ?? t.addedAt
    if (!date || daysBetween(date, contentMeta.lastSyncedAt) > 7) continue
    out.push({ topic: t, kind: t.updatedAt ? 'UPDATED' : 'NEW', date })
  }
  return out.sort((a, b) => b.date.localeCompare(a.date))
}
