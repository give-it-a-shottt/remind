import type { Question, Topic, Track } from './types'

const modules = import.meta.glob<{ default: Topic }>('./topics/**/*.ts', { eager: true })

export const topics: Topic[] = Object.values(modules)
  .map((m) => m.default)
  .sort((a, b) => a.track.localeCompare(b.track) || a.order - b.order)

export const tracks: { id: Track; label: string; emoji: string; desc: string }[] = [
  { id: 'frontend', label: '프론트엔드', emoji: '🖥️', desc: 'HTML · CSS · 웹 기초' },
  { id: 'backend', label: '백엔드', emoji: '🗄️', desc: 'FastAPI · SQL · DB 설계 · MongoDB' },
  { id: 'design', label: '디자인', emoji: '🎨', desc: '디자인 기초 · 포토샵 · 일러스트 · 피그마' },
  { id: 'project', label: '프로젝트', emoji: '🧩', desc: '포트폴리오 · Accio · Maestro 코드 읽기' },
]

export const topicsByTrack = (track: Track) => topics.filter((t) => t.track === track)

export const topicById = (id: string) => topics.find((t) => t.id === id)

export const questionIndex = new Map<string, { topic: Topic; question: Question }>(
  topics.flatMap((topic) => topic.questions.map((q) => [q.id, { topic, question: q }] as const)),
)
