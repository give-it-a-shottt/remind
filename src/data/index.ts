import type { Question, Topic, Track } from './types'

const modules = import.meta.glob<{ default: Topic }>('./topics/**/*.ts', { eager: true })

export const topics: Topic[] = Object.values(modules)
  .map((m) => m.default)
  .sort((a, b) => a.track.localeCompare(b.track) || a.order - b.order)

export const tracks: { id: Track; label: string; emoji: string; desc: string }[] = [
  { id: 'frontend', label: '프론트엔드', emoji: '🖥️', desc: 'HTML · CSS · 웹 기초' },
  { id: 'backend', label: '백엔드', emoji: '🗄️', desc: 'FastAPI · SQL · DB 설계 · MongoDB' },
  { id: 'fullstack', label: '풀스택 코스', emoji: '🧱', desc: '미니 인프런 만들기 · FastAPI · PostgreSQL · Next.js' },
  { id: 'react', label: 'React', emoji: '⚛️', desc: 'React 기초부터 Next.js · 시니어 실무까지' },
]

/**
 * 토픽마다 정한다 — 수업 카드(slides)가 있으면 레슨형, 없으면 복습형.
 * - 복습형: 개념 요점을 먼저 읽고 문제를 푼다
 * - 레슨형: 수업 카드를 넘기다 개념마다 확인 문제가 나온다
 * 그래서 한 트랙 안에서도 다 쓴 토픽부터 하나씩 레슨형으로 바꿀 수 있다.
 */
export const isLessonTopic = (topic: Topic) => topic.sections.some((s) => s.slides?.length)

export const topicsByTrack = (track: Track) => topics.filter((t) => t.track === track)

export const topicById = (id: string) => topics.find((t) => t.id === id)

export const questionIndex = new Map<string, { topic: Topic; question: Question }>(
  topics.flatMap((topic) => topic.questions.map((q) => [q.id, { topic, question: q }] as const)),
)
