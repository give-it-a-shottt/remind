import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { questionIndex } from '../data'
import { LinkButton } from '../components/Button'
import { ConceptCard } from '../components/Cards'
import { Icon } from '../components/Icon'
import { BottomSheet, Dialog } from '../components/Overlay'
import { QuestionView } from '../components/QuestionView'
import { EmptyState, ProgressBar } from '../components/ui'
import { buildSession, parseRequest, TYPE_LABEL } from '../lib/quiz'
import { applyGrade } from '../lib/srs'
import { getProgress, setProgress, useProgress, type Grade, type Session } from '../lib/storage'

export default function QuizPage() {
  const [sp] = useSearchParams()
  const nav = useNavigate()
  const p = useProgress()
  const [ready, setReady] = useState(false)
  const [empty, setEmpty] = useState(false)

  // 세션 준비: ?resume=1 이면 저장된 세션, 아니면 새로 만든다
  useEffect(() => {
    const cur = getProgress()
    if (sp.get('resume') && cur.session && cur.session.index < cur.session.ids.length) {
      setReady(true)
      return
    }
    const s = buildSession(parseRequest(sp), cur)
    if (!s.ids.length) {
      setEmpty(true)
      return
    }
    setProgress((pp) => ({ ...pp, session: s }))
    setEmpty(false)
    setReady(true)
  }, [sp])

  const session = p.session
  if (empty) return <EmptyQuiz mode={parseRequest(sp).mode} />
  if (!ready || !session || session.index >= session.ids.length) return null
  return <QuizRunner key={`${session.startedAt}-${session.index}`} session={session} onExit={() => (session.mode === 'single' ? nav(-1) : nav('/'))} onFinished={(single) => (single ? nav(-1) : nav('/quiz/result', { replace: true }))} />
}

function EmptyQuiz({ mode }: { mode: string }) {
  return (
    <div className="min-h-dvh bg-canvas">
      <div className="container-page max-w-[720px] pt-16">
        {mode === 'review' ? (
          <EmptyState icon="check" tone="correct" title="오늘 복습 끝!" desc="복습할 문제가 없어요. 새 토픽을 풀면 정해진 날에 다시 나와요." action={<LinkButton to="/" variant="secondary" size="sm">홈으로</LinkButton>} />
        ) : (
          <EmptyState icon="book" title="풀 문제가 없어요" desc="조건에 맞는 문제가 없어요." action={<LinkButton to="/" variant="secondary" size="sm">홈으로</LinkButton>} />
        )}
      </div>
    </div>
  )
}

function QuizRunner({ session, onExit, onFinished }: { session: Session; onExit: () => void; onFinished: (single: boolean) => void }) {
  const id = session.ids[session.index]
  const entry = questionIndex.get(id)
  const [sheet, setSheet] = useState(false)
  const [exit, setExit] = useState(false)
  const total = session.ids.length
  const n = session.index + 1

  const section = useMemo(() => entry?.topic.sections.find((s) => s.title === entry.question.source), [entry])

  function advance(grade: Grade, answer: string) {
    const single = session.mode === 'single'
    let finished = false
    setProgress((pp) => {
      let next = applyGrade(pp, id, grade, answer)
      const s = next.session
      if (!s) return next
      const ns: Session = { ...s, index: s.index + 1, results: [...s.results, { id, grade, answer }] }
      if (ns.index >= ns.ids.length) {
        finished = true
        next = single ? { ...next, session: undefined } : { ...next, session: undefined, lastResult: { ...ns, finishedAt: Date.now() } }
      } else next = { ...next, session: ns }
      return next
    })
    if (finished) onFinished(single)
    window.scrollTo({ top: 0 })
  }

  if (!entry) {
    // 업데이트로 삭제된 문제 — 건너뛴다
    queueMicrotask(() => advance('unsure', ''))
    return null
  }
  const q = entry.question

  return (
    <div className="min-h-dvh bg-canvas">
      <header className="sticky top-0 z-30 bg-surface shadow-md">
        <div className="container-page flex h-14 items-center gap-3 md:h-16">
          <button type="button" aria-label="나가기" onClick={() => (session.mode === 'single' || n === 1 ? onExit() : setExit(true))} className="-ml-1 p-1">
            <Icon name="close" />
          </button>
          <ProgressBar value={session.index / total} className="flex-1" />
          <span className="text-14 font-medium text-ink-weak">
            {n} / {total}
          </span>
        </div>
      </header>

      <main className="container-page max-w-[784px] pt-6 pb-36 md:pt-10 md:pb-20">
        <QuestionView
          q={q}
          meta={`${TYPE_LABEL[q.type]} · ${entry.topic.title}`}
          nextLabel={n === total ? (session.mode === 'single' ? '완료' : '결과 보기') : '다음 문제'}
          onNext={advance}
          sourceTitle={section?.title}
          onSource={() => setSheet(true)}
        />
      </main>

      {sheet && section && (
        <BottomSheet title="개념 다시 보기" onClose={() => setSheet(false)}>
          <ConceptCard section={section} count={entry.topic.questions.filter((x) => x.source === section.title).length} />
        </BottomSheet>
      )}
      {exit && (
        <Dialog
          title="그만 풀까요?"
          desc={`지금까지 푼 ${session.index}문제는 저장돼요. 홈의 "이어서 풀기"에서 계속할 수 있어요.`}
          cancel="계속 풀기"
          confirm="저장하고 나가기"
          onCancel={() => setExit(false)}
          onConfirm={onExit}
        />
      )}
    </div>
  )
}
