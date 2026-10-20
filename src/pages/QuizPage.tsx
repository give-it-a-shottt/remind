import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { questionIndex } from '../data'
import type { Question } from '../data/types'
import { Button, LinkButton } from '../components/Button'
import { answerText, ConceptCard } from '../components/Cards'
import { Icon } from '../components/Icon'
import { BottomSheet, Dialog } from '../components/Overlay'
import { Choice, ChoiceNotes, FeedbackPanel, OXButton, SelfGrade, type ChoiceState } from '../components/Quiz'
import { CodeBlock, EmptyState, ProgressBar } from '../components/ui'
import { buildSession, parseRequest } from '../lib/quiz'
import { applyGrade, gradeShort } from '../lib/srs'
import { getProgress, setProgress, useProgress, type Grade, type Session } from '../lib/storage'

const TYPE_LABEL = { mcq: '객관식', ox: 'OX', short: '단답형', essay: '서술형' } as const

interface Graded {
  grade: Grade
  answer: string
}

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
  const [picked, setPicked] = useState<number | null>(null)
  const [text, setText] = useState('')
  const [graded, setGraded] = useState<Graded | null>(null)
  const [revealed, setRevealed] = useState(false)
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

  function submitMcq() {
    if (q.type !== 'mcq' || picked === null) return
    setGraded({ grade: picked === q.answer ? 'correct' : 'wrong', answer: q.choices[picked] })
  }
  function pickOx(v: boolean) {
    if (q.type !== 'ox' || graded) return
    setPicked(v ? 1 : 0)
    setGraded({ grade: v === q.answer ? 'correct' : 'wrong', answer: v ? 'O' : 'X' })
  }
  function submitShort() {
    if (q.type !== 'short' || !text.trim()) return
    setGraded({ grade: gradeShort(q, text) ? 'correct' : 'wrong', answer: text.trim() })
  }

  const isCorrect = graded?.grade === 'correct'
  const sourceProps = section ? { source: section.title, onSource: () => setSheet(true) } : {}

  // 하단 버튼
  let cta: React.ReactNode = null
  if (q.type === 'essay') {
    cta = revealed ? <SelfGrade onGrade={(g) => advance(g, text.trim())} /> : <Button full variant="secondary" onClick={() => setRevealed(true)}>모범답안 보기</Button>
  } else if (!graded) {
    if (q.type === 'mcq') cta = <Button full disabled={picked === null} onClick={submitMcq}>제출하기</Button>
    if (q.type === 'short') cta = <Button full disabled={!text.trim()} onClick={submitShort}>제출하기</Button>
  } else {
    cta = (
      <div className="flex gap-2">
        {q.type === 'short' && !isCorrect && (
          <Button variant="neutral" className="flex-1" onClick={() => setGraded({ ...graded, grade: 'correct' })}>
            정답으로 인정
          </Button>
        )}
        <Button className="flex-1" onClick={() => advance(graded.grade, graded.answer)}>
          {n === total ? (session.mode === 'single' ? '완료' : '결과 보기') : '다음 문제'}
        </Button>
      </div>
    )
  }

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
        <div className="flex flex-col gap-6">
          <QuestionCard q={q} meta={`${TYPE_LABEL[q.type]} · ${entry.topic.title}`} />

          {q.type === 'mcq' && (
            <div className="flex flex-col gap-3">
              {q.choices.map((c, i) => {
                let st: ChoiceState = picked === i ? 'selected' : 'default'
                if (graded) st = i === q.answer ? 'correct' : i === picked ? 'wrong' : 'dim'
                return <Choice key={i} n={i + 1} label={c} state={st} disabled={!!graded} onClick={() => setPicked(i)} />
              })}
            </div>
          )}

          {q.type === 'ox' && (
            <div className="flex gap-4">
              {(['O', 'X'] as const).map((v) => {
                const val = v === 'O'
                let st: ChoiceState = 'default'
                if (graded) st = val === q.answer ? 'correct' : (picked === 1) === val ? 'wrong' : 'dim'
                return <OXButton key={v} value={v} state={st} disabled={!!graded} onClick={() => pickOx(val)} />
              })}
            </div>
          )}

          {q.type === 'short' && (
            <form onSubmit={(e) => (e.preventDefault(), graded ? advance(graded.grade, graded.answer) : submitShort())}>
              <input
                autoFocus
                value={text}
                onChange={(e) => setText(e.target.value)}
                readOnly={!!graded}
                placeholder="정답을 입력하세요"
                className={`h-12 w-full rounded-input px-4 text-16 outline-none md:text-15 placeholder:text-ink-disabled ${
                  !graded ? 'border border-line bg-surface focus:border-brand' : isCorrect ? 'border-2 border-correct bg-correct-bg' : 'border-2 border-wrong bg-wrong-bg'
                }`}
              />
            </form>
          )}

          {q.type === 'essay' && (
            <>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="생각나는 대로 적어보세요 (선택)"
                rows={4}
                className="w-full resize-y rounded-input border border-line bg-surface px-4 py-3.5 text-16 outline-none md:text-15 placeholder:text-ink-disabled focus:border-brand"
              />
              {revealed && (
                <section className="flex flex-col gap-3 rounded-card bg-brand-soft p-5">
                  <h2 className="text-14 font-semibold text-brand-text">모범답안</h2>
                  <p className="text-15 text-ink-sub">{q.answer}</p>
                  {q.keywords && q.keywords.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-12 font-medium text-ink-weak">핵심 키워드</span>
                      {q.keywords.map((k) => (
                        <span key={k} className="rounded-full bg-surface px-2.5 py-0.5 text-12 font-semibold">
                          {k}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="whitespace-pre-line text-15 text-ink-sub">{q.explanation}</p>
                  {section && (
                    <button type="button" onClick={() => setSheet(true)} className="flex items-center gap-1 self-start text-14 font-medium text-brand-text">
                      <Icon name="book" size={16} />
                      개념 보기 · {section.title}
                    </button>
                  )}
                </section>
              )}
              {revealed && <p className="text-14 font-medium text-ink-sub">내 답과 비교해서 직접 채점해 주세요</p>}
            </>
          )}

          {graded && q.type !== 'essay' && (
            <>
              <FeedbackPanel correct={isCorrect} answer={isCorrect ? undefined : answerText(q)} explanation={q.explanation} {...sourceProps} />
              {q.type === 'mcq' && q.choiceExplanations && <ChoiceNotes notes={q.choiceExplanations} answer={q.answer} picked={picked} />}
            </>
          )}

          {cta && <div className="hidden md:flex md:justify-end [&>*]:md:min-w-[240px]">{cta}</div>}
        </div>
      </main>

      {cta && <div className="pb-safe fixed inset-x-0 bottom-0 z-30 border-t border-line-light bg-surface px-5 pt-3 md:hidden">{cta}</div>}

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

function QuestionCard({ q, meta }: { q: Question; meta: string }) {
  return (
    <section className="rounded-card bg-surface px-5 py-6 md:p-8">
      <div className="text-14 font-medium text-ink-weak">{meta}</div>
      <h1 className="mt-1 whitespace-pre-line text-20 font-semibold md:text-24">{q.question}</h1>
      {q.code && (
        <div className="mt-4">
          <CodeBlock code={q.code} />
        </div>
      )}
    </section>
  )
}
