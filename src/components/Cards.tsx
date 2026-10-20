import { Link } from 'react-router-dom'
import type { Question, Section, Topic, Track } from '../data/types'
import type { TopicStats } from '../lib/stats'
import { relativeDay } from '../lib/date'
import { LinkButton } from './Button'
import { Icon } from './Icon'
import { Badge, CodeBlock, ProgressBar, type BadgeType } from './ui'

export const TRACK_STYLE: Record<Track, { bg: string; ink: string; label: string; title: string }> = {
  frontend: { bg: 'bg-cat-sky', ink: 'text-cat-sky-ink', label: '프론트엔드', title: 'HTML · CSS · 웹 기초' },
  backend: { bg: 'bg-cat-mint', ink: 'text-cat-mint-ink', label: '백엔드', title: 'FastAPI · SQL · DB 설계 · MongoDB' },
  design: { bg: 'bg-cat-pink', ink: 'text-cat-pink-ink', label: '디자인', title: '디자인 기초 · 포토샵 · 피그마' },
  project: { bg: 'bg-cat-lavender', ink: 'text-cat-lavender-ink', label: '프로젝트', title: '포트폴리오 · Accio · Maestro' },
}

export function TrackCard({ track, topics, done, progress, accuracy }: { track: Track; topics: number; done: number; progress: number; accuracy: number | null }) {
  const s = TRACK_STYLE[track]
  return (
    <Link to={`/track/${track}`} className={`block rounded-card p-5 transition-shadow hover:shadow-md ${s.bg}`}>
      <div className={`text-14 font-medium ${s.ink}`}>{s.label}</div>
      <div className="mt-1 text-18 font-semibold">{s.title}</div>
      <div className="mt-4 rounded-thumb bg-surface p-4">
        <div className="mb-2 flex text-13">
          <span className="flex-1 font-medium text-ink-sub">
            완료 {done} / {topics} 토픽
          </span>
          <span className="font-semibold">정답률 {accuracy === null ? '-' : `${accuracy}%`}</span>
        </div>
        <ProgressBar value={progress} />
      </div>
    </Link>
  )
}

export function TopicRow({ topic, stats, badge }: { topic: Topic; stats: TopicStats; badge?: BadgeType }) {
  const b: BadgeType = badge ?? (stats.wrongCount > 0 ? '오답' : stats.status)
  const meta = stats.seen === 0 ? `문제 ${stats.total}개` : `문제 ${stats.total}개 · 정답률 ${stats.accuracy ?? 0}%${stats.lastSeen ? ` · ${relativeDay(stats.lastSeen)}` : ''}`
  return (
    <Link to={`/topic/${topic.id}`} className="flex items-center gap-3 rounded-card border border-line bg-surface p-4 transition-shadow hover:shadow-sm">
      <div className="min-w-0 flex-1">
        <div className="text-12 font-medium text-ink-weak">{topic.group}</div>
        <div className="mt-1 text-16 font-semibold">{topic.title}</div>
        <div className="mt-1.5 text-12 text-ink-weak">{meta}</div>
      </div>
      <Badge type={b}>{b === '오답' ? `오답 ${stats.wrongCount}` : undefined}</Badge>
      <Icon name="chevron-right" size={20} className="text-icon-weak" />
    </Link>
  )
}

export function ConceptCard({ section, count, updated, to }: { section: Section; count: number; updated?: boolean; to?: string }) {
  return (
    <article className={`flex min-w-0 flex-col gap-3 rounded-card bg-surface p-5 ${updated ? 'ring-1 ring-hint' : ''}`}>
      <div className="flex items-start gap-2">
        <h3 className="min-w-0 flex-1 text-18 font-semibold [overflow-wrap:anywhere]">{section.title}</h3>
        {updated && <Badge type="UPDATED" />}
      </div>
      <ul className="flex flex-col gap-1.5">
        {section.points.map((p) => (
          <li key={p} className="flex gap-2 text-15 text-ink-sub">
            <span className="text-ink-weak">•</span>
            <span className="min-w-0 [overflow-wrap:anywhere]">{p}</span>
          </li>
        ))}
      </ul>
      {section.code && <CodeBlock code={section.code} />}
      {to && (
        <div className="mt-1 flex items-center">
          <span className="flex-1 text-12 text-ink-weak">문제 {count}개</span>
          <LinkButton to={to} variant="text" size="sm">
            이 부분만 풀기 →
          </LinkButton>
        </div>
      )}
    </article>
  )
}

export function WrongCard({ topic, question, myAnswer, answer, meta, to }: { topic: string; question: string; myAnswer?: string; answer: string; meta: string; to?: string }) {
  return (
    <article className="rounded-card border border-line bg-surface p-4">
      <div className="text-12 font-medium text-ink-weak">{topic}</div>
      <h3 className="mt-1 text-16 font-semibold">{question}</h3>
      <div className="mt-3 flex flex-col gap-1 rounded-input bg-canvas px-3 py-2.5 text-14 font-medium">
        {myAnswer && <span className="text-wrong-text">✕ 내 답: {myAnswer}</span>}
        <span className="text-correct-text">✓ 정답: {answer}</span>
      </div>
      <div className="mt-3 flex items-center">
        <span className="flex-1 text-12 text-ink-weak">{meta}</span>
        {to && (
          <LinkButton to={to} variant="text" size="sm">
            다시 풀기
          </LinkButton>
        )}
      </div>
    </article>
  )
}

/** 문제의 정답을 사람이 읽는 문자열로 */
export function answerText(q: Question): string {
  switch (q.type) {
    case 'mcq':
      return `${q.answer + 1}. ${q.choices[q.answer]}`
    case 'ox':
      return q.answer ? 'O' : 'X'
    case 'short':
      return q.answer.join(' / ')
    case 'essay':
      return q.answer
  }
}
