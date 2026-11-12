import { useState } from 'react'
import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom'
import { isLessonTopic, topicById } from '../data'
import { notionUrl } from '../data/meta'
import type { Topic } from '../data/types'
import { buttonClass, LinkButton } from '../components/Button'
import { ConceptCard, TRACK_STYLE } from '../components/Cards'
import { Icon } from '../components/Icon'
import { AppShell } from '../components/Layout'
import { ProgressBar } from '../components/ui'
import { quizUrl } from '../lib/quiz'
import { topicStats } from '../lib/stats'
import { useProgress } from '../lib/storage'

const TYPE_LABEL = { mcq: '객관식', ox: 'OX', short: '단답형', essay: '서술형' } as const

export default function TopicPage() {
  const { topicId } = useParams()
  const [sp, setSp] = useSearchParams()
  const p = useProgress()
  const topic = topicId ? topicById(topicId) : undefined
  if (!topic) return <Navigate to="/" replace />
  const tab = sp.get('tab') === 'list' ? 'list' : 'concept'
  const st = topicStats(topic, p)
  const s = TRACK_STYLE[topic.track]
  const all = quizUrl({ mode: 'topic', topicId: topic.id })
  const wrongUrl = quizUrl({ mode: 'wrong', topicId: topic.id })
  const changed = new Set(topic.changedSections ?? [])
  const lesson = isLessonTopic(topic)
  const ls = p.lessons?.[topic.id]
  const resumable = lesson && !!ls && ls.step > 0
  const lessonUrl = `/lesson/${topic.id}${resumable ? '?resume=1' : ''}`
  const lessonLabel = resumable ? '이어서 하기' : ls?.doneAt ? '수업 다시 듣기' : '수업 시작'
  const slideCount = topic.sections.reduce((n, sec) => n + (sec.slides?.length ?? 0), 0)

  const actions = lesson ? (
    <div className="flex gap-2 md:flex-col">
      {st.wrongCount > 0 && (
        <LinkButton to={wrongUrl} variant="secondary" className="flex-1 md:order-2">
          틀린 것만 {st.wrongCount}
        </LinkButton>
      )}
      <LinkButton to={lessonUrl} className="flex-[2] md:order-1 md:flex-none">
        {lessonLabel}
      </LinkButton>
    </div>
  ) : (
    <div className="flex gap-2 md:flex-col">
      {st.wrongCount > 0 && (
        <LinkButton to={wrongUrl} variant="secondary" className="flex-1 md:order-2">
          틀린 것만 {st.wrongCount}
        </LinkButton>
      )}
      <LinkButton to={all} className="flex-[2] md:order-1 md:flex-none">
        전체 풀기
      </LinkButton>
    </div>
  )

  return (
    <AppShell back title={topic.title} bottom={actions}>
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-10">
        <div className="flex flex-col gap-5">
          <div>
            <div className={`text-14 font-medium ${s.ink}`}>
              {s.label} · {topic.group}
            </div>
            <h1 className="mt-1 text-24 font-semibold md:text-32">{topic.title}</h1>
            <div className="mt-3 flex items-center gap-3">
              <span className="flex-1 text-15 text-ink-sub">
                개념 {topic.sections.length}{lesson ? ` · 수업 카드 ${slideCount}` : ''} · 문제 {topic.questions.length}
                {st.accuracy !== null ? ` · 정답률 ${st.accuracy}%` : ''}
              </span>
              {topic.notionId && (
                <a href={notionUrl(topic.notionId)} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-14 font-medium text-brand-text lg:hidden">
                  노션 원문 <Icon name="external" size={16} />
                </a>
              )}
            </div>
          </div>

          <div className="flex border-b border-line md:gap-8" role="tablist">
            {(
              [
                ['concept', lesson ? `수업 내용 ${topic.sections.length}` : `개념 ${topic.sections.length}`],
                ['list', `문제 목록 ${topic.questions.length}`],
              ] as const
            ).map(([k, l]) => (
              <button
                key={k}
                role="tab"
                aria-selected={tab === k}
                onClick={() => setSp(k === 'list' ? { tab: 'list' } : {}, { replace: true })}
                className={`-mb-px flex-1 border-b-2 py-3 text-15 md:flex-none ${tab === k ? 'border-line-black font-semibold text-ink' : 'border-transparent font-medium text-ink-weak'}`}
              >
                {l}
              </button>
            ))}
          </div>

          {tab === 'concept' && lesson ? (
            <LessonOutline topic={topic} />
          ) : tab === 'concept' ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
              {topic.sections.map((sec) => (
                <ConceptCard
                  key={sec.title}
                  section={sec}
                  updated={changed.has(sec.title)}
                  count={topic.questions.filter((q) => q.source === sec.title).length}
                  to={quizUrl({ mode: 'section', topicId: topic.id, section: sec.title })}
                />
              ))}
            </div>
          ) : (
            <ol className="overflow-hidden rounded-card bg-surface">
              {topic.questions.map((q, i) => {
                const r = p.questions[q.id]
                const state = !r ? 'none' : p.wrongNote.includes(q.id) ? 'wrong' : 'correct'
                return (
                  <li key={q.id} className={i ? 'border-t border-line-light' : ''}>
                    <Link to={quizUrl({ mode: 'single', qid: q.id })} className="flex items-center gap-3 p-4 hover:bg-canvas">
                      <span
                        className={`flex size-6 shrink-0 items-center justify-center rounded-full text-12 font-semibold ${
                          state === 'correct' ? 'bg-correct text-white' : state === 'wrong' ? 'bg-wrong text-white' : 'bg-fill text-ink-sub'
                        }`}
                      >
                        {state === 'correct' ? <Icon name="check" size={14} /> : state === 'wrong' ? <Icon name="close" size={14} /> : i + 1}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-12 font-medium text-ink-weak">
                          {TYPE_LABEL[q.type]} · {q.source}
                        </span>
                        <span className="mt-1 block text-14 font-medium">{q.question}</span>
                      </span>
                      <Icon name="chevron-right" size={20} className="text-icon-weak" />
                    </Link>
                  </li>
                )
              })}
            </ol>
          )}
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-26 flex flex-col gap-4 rounded-card bg-surface p-6">
            <div className="text-14 font-medium text-ink-weak">이 토픽</div>
            <div className="flex gap-2">
              {[
                ['문제', String(st.total), ''],
                ['정답률', st.accuracy === null ? '-' : `${st.accuracy}%`, ''],
                ['오답', String(st.wrongCount), 'text-wrong-text'],
              ].map(([l, v, c]) => (
                <div key={l} className="flex-1 rounded-thumb bg-canvas p-3">
                  <div className="text-12 font-medium text-ink-weak">{l}</div>
                  <div className={`text-18 font-semibold ${c}`}>{v}</div>
                </div>
              ))}
            </div>
            <div>
              <ProgressBar value={st.total ? st.seen / st.total : 0} />
              <div className="mt-2 text-12 font-medium text-ink-weak">
                푼 문제 {st.seen} / {st.total}
              </div>
            </div>
            {lesson ? (
              <>
                <Link to={lessonUrl} className={buttonClass('primary', 'md', true)}>
                  {lessonLabel}
                </Link>
                <Link to={all} className={buttonClass('neutral', 'md', true)}>
                  문제만 풀기
                </Link>
              </>
            ) : (
              <Link to={all} className={buttonClass('primary', 'md', true)}>
                전체 풀기
              </Link>
            )}
            {st.wrongCount > 0 && (
              <Link to={wrongUrl} className={buttonClass('secondary', 'md', true)}>
                틀린 것만 {st.wrongCount}
              </Link>
            )}
            {topic.notionId && (
              <a href={notionUrl(topic.notionId)} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-14 font-medium text-brand-text">
                노션 원문 보기 <Icon name="external" size={16} />
              </a>
            )}
          </div>
        </aside>
      </div>
    </AppShell>
  )
}

/** 레슨형 토픽: 어떤 순서로 배우는지 목차 + 개념별 다시 읽기 */
function LessonOutline({ topic }: { topic: Topic }) {
  // 여러 개를 따로 펼친다. 하나만 열리게 하면 위쪽이 접히면서 화면이 아래로 튀어 버린다
  const [open, setOpen] = useState<Set<string>>(() => new Set())
  const toggle = (t: string) =>
    setOpen((prev) => {
      const next = new Set(prev)
      if (next.has(t)) next.delete(t)
      else next.add(t)
      return next
    })
  return (
    <div className="flex flex-col gap-4">
      <section className="rounded-card bg-surface p-5 md:p-6">
        <h2 className="text-16 font-semibold">이렇게 배워요</h2>
        <p className="mt-1 text-14 text-ink-sub">수업 카드를 넘기며 개념을 배우고, 개념이 끝날 때마다 확인 문제를 바로 풀어요.</p>
        <ol className="mt-4 flex flex-col">
          {topic.sections.map((sec, i) => {
            const n = topic.questions.filter((q) => q.source === sec.title).length
            const isOpen = open.has(sec.title)
            return (
              <li key={sec.title} className={i ? 'border-t border-line-light' : ''}>
                <button type="button" onClick={() => toggle(sec.title)} aria-expanded={isOpen} className="flex w-full items-center gap-3 py-3.5 text-left">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-fill text-13 font-semibold">{i + 1}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-15 font-semibold">{sec.title}</span>
                    <span className="mt-0.5 block text-12 text-ink-weak">
                      수업 카드 {sec.slides?.length ?? 0} · 확인 문제 {n}
                    </span>
                  </span>
                  <Icon name="chevron-down" size={20} className={`text-icon-weak transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="pb-4">
                    <ConceptCard section={sec} count={n} to={quizUrl({ mode: 'section', topicId: topic.id, section: sec.title })} />
                  </div>
                )}
              </li>
            )
          })}
        </ol>
      </section>
    </div>
  )
}
