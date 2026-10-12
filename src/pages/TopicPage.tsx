import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom'
import { topicById } from '../data'
import { notionUrl } from '../data/meta'
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

  const actions = (
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
      <div className="lg:grid lg:grid-cols-[1fr_360px] lg:gap-10">
        <div className="flex flex-col gap-5">
          <div>
            <div className={`text-14 font-medium ${s.ink}`}>
              {s.label} · {topic.group}
            </div>
            <h1 className="mt-1 text-24 font-semibold md:text-32">{topic.title}</h1>
            <div className="mt-3 flex items-center gap-3">
              <span className="flex-1 text-15 text-ink-sub">
                개념 {topic.sections.length} · 문제 {topic.questions.length}
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
                ['concept', `개념 ${topic.sections.length}`],
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

          {tab === 'concept' ? (
            <div className="grid gap-4 md:grid-cols-2 md:gap-6">
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
            <Link to={all} className={buttonClass('primary', 'md', true)}>
              전체 풀기
            </Link>
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
