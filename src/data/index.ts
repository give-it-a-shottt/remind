import type { Question, Topic, Track } from './types'

const modules = import.meta.glob<{ default: Topic }>('./topics/**/*.ts', { eager: true })

export const topics: Topic[] = Object.values(modules)
  .map((m) => m.default)
  .sort((a, b) => a.track.localeCompare(b.track) || a.order - b.order)

/**
 * kind — review: 개념을 먼저 읽고 문제를 푸는 복습형
 *        lesson: 수업 카드를 넘기다 개념마다 확인 문제가 나오는 레슨형
 */
export const tracks: { id: Track; label: string; emoji: string; desc: string; kind: 'review' | 'lesson' }[] = [
  { id: 'frontend', label: '프론트엔드', emoji: '🖥️', desc: 'HTML · CSS · 웹 기초', kind: 'review' },
  { id: 'backend', label: '백엔드', emoji: '🗄️', desc: 'FastAPI · SQL · DB 설계 · MongoDB', kind: 'review' },
  { id: 'fullstack', label: '풀스택 코스', emoji: '🧱', desc: '미니 인프런 만들기 · FastAPI · PostgreSQL · Next.js', kind: 'lesson' },
  { id: 'react', label: 'React', emoji: '⚛️', desc: 'React 기초부터 Next.js · 시니어 실무까지', kind: 'lesson' },
]

export const isLessonTrack = (track: Track) => tracks.find((t) => t.id === track)?.kind === 'lesson'

export const topicsByTrack = (track: Track) => topics.filter((t) => t.track === track)

export const topicById = (id: string) => topics.find((t) => t.id === id)

export const questionIndex = new Map<string, { topic: Topic; question: Question }>(
  topics.flatMap((topic) => topic.questions.map((q) => [q.id, { topic, question: q }] as const)),
)
