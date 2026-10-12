import { Navigate } from 'react-router-dom'
import { questionIndex } from '../data'
import { LinkButton } from '../components/Button'
import { answerText, WrongCard } from '../components/Cards'
import { Icon } from '../components/Icon'
import { StatTile } from '../components/ui'
import { quizUrl } from '../lib/quiz'
import { streakDays } from '../lib/srs'
import { useProgress } from '../lib/storage'

export default function ResultPage() {
  const p = useProgress()
  const r = p.lastResult
  if (!r) return <Navigate to="/" replace />
  const correct = r.results.filter((x) => x.grade === 'correct').length
  const wrongs = r.results.filter((x) => x.grade === 'wrong')
  const total = r.results.length
  const minutes = Math.max(1, Math.round((r.finishedAt - r.startedAt) / 60000))
  const rate = total ? Math.round((correct / total) * 100) : 0
  const streak = streakDays(p)
  const perfect = wrongs.length === 0

  const actions = perfect ? (
    <LinkButton to="/" full>
      홈으로
    </LinkButton>
  ) : (
    <div className="flex gap-2">
      <LinkButton to={r.topicId ? `/topic/${r.topicId}` : '/'} variant="neutral" className="flex-1">
        {r.topicId ? '토픽으로' : '홈으로'}
      </LinkButton>
      <LinkButton to={quizUrl({ mode: 'wrong', ids: wrongs.map((w) => w.id) })} className="flex-[2]">
        틀린 것만 다시
      </LinkButton>
    </div>
  )

  return (
    <div className="min-h-dvh bg-surface">
      <header className="sticky top-0 z-30 bg-surface shadow-md">
        <div className="container-page flex h-14 items-center md:h-16">
          <h1 className="text-18 font-semibold">{r.label} 결과</h1>
        </div>
      </header>
      <main className="container-page max-w-[784px] pt-8 pb-36 md:pb-20">
        <div className="flex flex-col gap-12">
          <section className="flex flex-col items-center text-center">
            <p className="text-16 font-medium text-brand-text">{perfect ? '전부 맞혔어요 🎉' : '복습 완료'}</p>
            <p className="mt-2 text-56 font-semibold">
              {correct} / {total}
            </p>
            <p className="mt-3 text-16 text-ink-sub">정답률 {rate}%</p>
            {streak > 0 && (
              <span className="mt-4 flex items-center gap-1 rounded-full bg-brand-soft px-3 py-1.5 text-14 font-semibold text-brand-text">
                <Icon name="flame" size={16} className="text-brand" />
                {streak}일 연속 복습 중
              </span>
            )}
          </section>
          <div className="flex gap-3">
            <StatTile label="정답" value={String(correct)} tone="correct" />
            <StatTile label="오답" value={String(wrongs.length)} tone="wrong" />
            <StatTile label="소요 시간" value={`${minutes}분`} />
          </div>
          {wrongs.length > 0 && (
            <section>
              <h2 className="mb-4 text-20 font-semibold">틀린 문제 {wrongs.length}</h2>
              <div className="flex flex-col gap-3">
                {wrongs.map((w) => {
                  const e = questionIndex.get(w.id)
                  if (!e) return null
                  return <WrongCard key={w.id} topic={`${e.topic.group} · ${e.topic.title}`} question={e.question.question} myAnswer={w.answer || undefined} answer={answerText(e.question)} meta="오답노트에 추가됨" to={quizUrl({ mode: 'single', qid: w.id })} />
                })}
              </div>
            </section>
          )}
          <div className="hidden md:flex md:justify-end [&>*]:md:min-w-[360px]">{actions}</div>
        </div>
      </main>
      <div className="pb-safe fixed inset-x-0 bottom-0 z-30 border-t border-line-light bg-surface px-5 pt-3 md:hidden">{actions}</div>
    </div>
  )
}
