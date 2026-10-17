import { useState } from 'react'
import { questionIndex, tracks } from '../data'
import type { Track } from '../data/types'
import { LinkButton } from '../components/Button'
import { answerText, WrongCard } from '../components/Cards'
import { AppShell } from '../components/Layout'
import { Chip, EmptyState } from '../components/ui'
import { quizUrl } from '../lib/quiz'
import { GRADUATE_STREAK } from '../lib/srs'
import { useProgress } from '../lib/storage'

export default function WrongPage() {
  const p = useProgress()
  const [track, setTrack] = useState<Track | 'all'>('all')
  const all = p.wrongNote.map((id) => ({ id, e: questionIndex.get(id) })).filter((x) => x.e)
  const shown = track === 'all' ? all : all.filter((x) => x.e!.topic.track === track)

  return (
    <AppShell tabBar>
      <div className="flex flex-col gap-5">
        <div>
          <h1 className="text-24 font-semibold md:text-32">오답노트</h1>
          {all.length > 0 && <p className="mt-3 text-15 text-ink-sub">틀린 문제 {all.length}개 · 연속 {GRADUATE_STREAK}번 맞히면 자동으로 졸업해요</p>}
        </div>
        {all.length === 0 ? (
          <EmptyState icon="wrong-note" title="오답이 없어요" desc="틀린 문제가 생기면 여기에 모여요." />
        ) : (
          <>
            <div className="-mx-5 flex gap-2 overflow-x-auto px-5 md:mx-0 md:px-0">
              <Chip selected={track === 'all'} onClick={() => setTrack('all')}>
                전체 {all.length}
              </Chip>
              {tracks.map((t) => {
                const c = all.filter((x) => x.e!.topic.track === t.id).length
                return c ? (
                  <Chip key={t.id} selected={track === t.id} onClick={() => setTrack(t.id)}>
                    {t.label} {c}
                  </Chip>
                ) : null
              })}
            </div>
            <LinkButton to={quizUrl({ mode: 'wrong', track: track === 'all' ? undefined : track })} full className="md:w-auto md:self-start">
              오답 {shown.length}문제 전체 풀기
            </LinkButton>
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 lg:gap-4">
              {shown.map(({ id, e }) => {
                const r = p.questions[id]
                return (
                  <WrongCard
                    key={id}
                    topic={`${e!.topic.group} · ${e!.topic.title}`}
                    question={e!.question.question}
                    myAnswer={r?.lastAnswer}
                    answer={answerText(e!.question)}
                    meta={`틀린 횟수 ${r?.wrong ?? 1} · 연속 정답 ${r?.streak ?? 0}/${GRADUATE_STREAK}`}
                    to={quizUrl({ mode: 'single', qid: id })}
                  />
                )
              })}
            </div>
          </>
        )}
      </div>
    </AppShell>
  )
}
