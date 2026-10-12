import { questionIndex, topicById, topics } from '../data'
import type { Track } from '../data/types'
import { reviewQueue, shuffle } from './srs'
import type { Progress, QuizMode, Session } from './storage'

export interface QuizRequest {
  mode: QuizMode
  topicId?: string
  section?: string
  track?: Track
  qid?: string
  ids?: string[]
}

export function parseRequest(sp: URLSearchParams): QuizRequest {
  return {
    mode: (sp.get('mode') as QuizMode) ?? 'review',
    topicId: sp.get('topic') ?? undefined,
    section: sp.get('section') ?? undefined,
    track: (sp.get('track') as Track) ?? undefined,
    qid: sp.get('q') ?? undefined,
    ids: sp.get('ids')?.split(',').filter(Boolean),
  }
}

export function quizUrl(r: QuizRequest): string {
  const sp = new URLSearchParams({ mode: r.mode })
  if (r.topicId) sp.set('topic', r.topicId)
  if (r.section) sp.set('section', r.section)
  if (r.track) sp.set('track', r.track)
  if (r.qid) sp.set('q', r.qid)
  if (r.ids?.length) sp.set('ids', r.ids.join(','))
  return `/quiz?${sp.toString()}`
}

export function buildSession(r: QuizRequest, p: Progress): Session {
  const topic = r.topicId ? topicById(r.topicId) : undefined
  let ids: string[] = []
  let label = '퀴즈'
  const mix = (a: string[]) => (p.settings.shuffle ? shuffle(a) : a)

  if (r.ids?.length) {
    ids = r.ids.filter((id) => questionIndex.has(id))
    label = '틀린 것만 다시'
  } else if (r.mode === 'review') {
    ids = reviewQueue(p)
    label = '오늘 복습'
  } else if (r.mode === 'topic' && topic) {
    ids = mix(topic.questions.map((q) => q.id))
    label = topic.title
  } else if (r.mode === 'section' && topic) {
    ids = mix(topic.questions.filter((q) => q.source === r.section).map((q) => q.id))
    label = `${topic.title} · ${r.section}`
  } else if (r.mode === 'wrong') {
    const scope = topic ? topic.questions.map((q) => q.id) : r.track ? topics.filter((t) => t.track === r.track).flatMap((t) => t.questions.map((q) => q.id)) : null
    ids = mix(p.wrongNote.filter((id) => questionIndex.has(id) && (!scope || scope.includes(id))))
    label = topic ? `${topic.title} · 틀린 것만` : '오답노트'
  } else if (r.mode === 'single' && r.qid && questionIndex.has(r.qid)) {
    ids = [r.qid]
    label = questionIndex.get(r.qid)!.topic.title
  }
  return { mode: r.mode, topicId: topic?.id, label, ids, index: 0, results: [], startedAt: Date.now() }
}
