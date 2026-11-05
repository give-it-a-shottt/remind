import { useState, type ReactNode } from 'react'
import type { Question } from '../data/types'
import { gradeShort } from '../lib/srs'
import type { Grade } from '../lib/storage'
import { Button } from './Button'
import { answerText } from './Cards'
import { Icon } from './Icon'
import { Choice, ChoiceNotes, FeedbackPanel, OXButton, SelfGrade, type ChoiceState } from './Quiz'
import { CodeBlock } from './ui'

interface Graded {
  grade: Grade
  answer: string
}

/**
 * 문제 하나를 풀고 채점·해설까지 보여 준다. 다음으로 넘어갈 때 onNext(채점, 내 답).
 * 퀴즈 화면과 레슨 화면이 같이 쓴다. 문제가 바뀌면 부모가 key 로 새로 만든다.
 */
export function QuestionView({ q, meta, eyebrow, nextLabel, onNext, onSource, sourceTitle }: { q: Question; meta: string; eyebrow?: ReactNode; nextLabel: string; onNext: (grade: Grade, answer: string) => void; onSource?: () => void; sourceTitle?: string }) {
  const [picked, setPicked] = useState<number | null>(null)
  const [text, setText] = useState('')
  const [graded, setGraded] = useState<Graded | null>(null)
  const [revealed, setRevealed] = useState(false)

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
  const sourceProps = sourceTitle && onSource ? { source: sourceTitle, onSource } : {}

  // 하단 버튼
  let cta: ReactNode = null
  if (q.type === 'essay') {
    cta = revealed ? (
      <SelfGrade onGrade={(g) => onNext(g, text.trim())} />
    ) : (
      <Button full variant="secondary" onClick={() => setRevealed(true)}>
        모범답안 보기
      </Button>
    )
  } else if (!graded) {
    if (q.type === 'mcq')
      cta = (
        <Button full disabled={picked === null} onClick={submitMcq}>
          제출하기
        </Button>
      )
    if (q.type === 'short')
      cta = (
        <Button full disabled={!text.trim()} onClick={submitShort}>
          제출하기
        </Button>
      )
  } else {
    cta = (
      <div className="flex gap-2">
        {q.type === 'short' && !isCorrect && (
          <Button variant="neutral" className="flex-1" onClick={() => setGraded({ ...graded, grade: 'correct' })}>
            정답으로 인정
          </Button>
        )}
        <Button className="flex-1" onClick={() => onNext(graded.grade, graded.answer)}>
          {nextLabel}
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col gap-6">
        <section className="rounded-card bg-surface px-5 py-6 md:p-8">
          {eyebrow}
          <div className="text-14 font-medium text-ink-weak">{meta}</div>
          <h1 className="mt-1 whitespace-pre-line text-20 font-semibold md:text-24">{q.question}</h1>
          {q.code && (
            <div className="mt-4">
              <CodeBlock code={q.code} />
            </div>
          )}
        </section>

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
          <form onSubmit={(e) => (e.preventDefault(), graded ? onNext(graded.grade, graded.answer) : submitShort())}>
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
                {sourceTitle && onSource && (
                  <button type="button" onClick={onSource} className="flex items-center gap-1 self-start text-14 font-medium text-brand-text">
                    <Icon name="book" size={16} />
                    개념 보기 · {sourceTitle}
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

      {cta && <div className="pb-safe fixed inset-x-0 bottom-0 z-30 border-t border-line-light bg-surface px-5 pt-3 md:hidden">{cta}</div>}
    </>
  )
}
