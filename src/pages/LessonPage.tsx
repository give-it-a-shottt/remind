import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { isLessonTrack, questionIndex, topicById, topicsByTrack } from '../data'
import type { Topic } from '../data/types'
import { Button, LinkButton } from '../components/Button'
import { answerText, ConceptCard, TRACK_STYLE, WrongCard } from '../components/Cards'
import { Icon } from '../components/Icon'
import { BottomSheet, Dialog } from '../components/Overlay'
import { QuestionView } from '../components/QuestionView'
import { SlideBody } from '../components/Slide'
import { ProgressBar, StatTile } from '../components/ui'
import { today } from '../lib/date'
import { lessonSteps, prevSlide } from '../lib/lesson'
import { quizUrl, TYPE_LABEL } from '../lib/quiz'
import { applyGrade } from '../lib/srs'
import { getProgress, setProgress, type Grade, type SessionResult } from '../lib/storage'

export default function LessonPage() {
  const { topicId } = useParams()
  const topic = topicId ? topicById(topicId) : undefined
  if (!topic || !isLessonTrack(topic.track)) return <Navigate to="/" replace />
  return <LessonRunner key={topic.id} topic={topic} />
}

function LessonRunner({ topic }: { topic: Topic }) {
  const nav = useNavigate()
  const [sp] = useSearchParams()
  const steps = useMemo(() => lessonSteps(topic), [topic])
  // ?resume=1 이면 저장된 자리에서, 아니면 처음부터
  const [state, setState] = useState(() => {
    const saved = getProgress().lessons?.[topic.id]
    return sp.get('resume') && saved && saved.step < steps.length ? { step: saved.step, results: saved.results } : { step: 0, results: [] as SessionResult[] }
  })
  const [sheet, setSheet] = useState(false)
  const [exit, setExit] = useState(false)
  const { step: i, results } = state
  const cur = steps[i]
  const done = i >= steps.length

  function save(step: number, res: SessionResult[]) {
    const finished = step >= steps.length
    setState({ step, results: res })
    setProgress((pp) => ({
      ...pp,
      lessons: { ...pp.lessons, [topic.id]: finished ? { step: 0, results: [], doneAt: today(), at: Date.now() } : { ...pp.lessons?.[topic.id], step, results: res, at: Date.now() } },
    }))
    window.scrollTo({ top: 0 })
  }
  const next = () => save(i + 1, results)
  const back = prevSlide(steps, i)
  const prev = () => back >= 0 && save(back, results)

  function answer(grade: Grade, ans: string) {
    if (cur?.kind !== 'quiz') return
    setProgress((pp) => applyGrade(pp, cur.q.id, grade, ans))
    save(i + 1, [...results, { id: cur.q.id, grade, answer: ans }])
  }

  // 카드 화면: ← → 키, 좌우 스와이프로 넘기기
  const slideMode = cur?.kind === 'slide' && !sheet && !exit
  useEffect(() => {
    if (!slideMode) return
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && e.target.closest('input, textarea')) return
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })
  const touch = useRef<{ x: number; y: number } | null>(null)
  const swipe = slideMode
    ? {
        onTouchStart: (e: React.TouchEvent) => {
          // 옆으로 스크롤되는 코드·표 위에서는 스와이프로 넘기지 않는다
          touch.current = (e.target as HTMLElement).closest('pre, table') ? null : { x: e.touches[0].clientX, y: e.touches[0].clientY }
        },
        onTouchEnd: (e: React.TouchEvent) => {
          const t = touch.current
          touch.current = null
          if (!t) return
          const dx = e.changedTouches[0].clientX - t.x
          const dy = e.changedTouches[0].clientY - t.y
          if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.5) return
          if (dx < 0) next()
          else prev()
        },
      }
    : {}

  if (done) return <LessonDone topic={topic} results={results} onRestart={() => save(0, [])} />

  const s = TRACK_STYLE[topic.track]
  const nextStep = steps[i + 1]
  const nextLabel = !nextStep ? '레슨 마치기' : nextStep.kind === 'quiz' ? '확인 문제 풀기' : nextStep.section !== cur.section ? '다음 개념으로' : '다음'
  const quizNext = i + 1 >= steps.length ? '레슨 마치기' : steps[i + 1].kind === 'quiz' ? '다음 문제' : '다음 개념으로'

  const slideCta = (
    <div className="flex gap-2">
      {back >= 0 && (
        <Button variant="neutral" className="flex-1" onClick={prev}>
          이전
        </Button>
      )}
      <Button className="flex-[2]" onClick={next}>
        {nextLabel}
      </Button>
    </div>
  )

  return (
    <div className="min-h-dvh bg-canvas" {...swipe}>
      <header className="sticky top-0 z-30 bg-surface shadow-md">
        <div className="container-page flex h-14 items-center gap-3 md:h-16">
          <button type="button" aria-label="나가기" onClick={() => (i === 0 ? nav(`/topic/${topic.id}`) : setExit(true))} className="-ml-1 p-1">
            <Icon name="close" />
          </button>
          <ProgressBar value={i / steps.length} className="flex-1" />
          <span className="text-14 font-medium text-ink-weak">
            {i + 1} / {steps.length}
          </span>
        </div>
      </header>

      <main className="container-page max-w-[784px] pt-6 pb-36 md:pt-10 md:pb-20">
        {cur.kind === 'slide' ? (
          <div className="flex flex-col gap-6">
            <article className="rounded-card bg-surface px-5 py-6 md:p-8">
              <div className={`text-14 font-medium ${s.ink}`}>
                개념 {cur.sectionNo} · {cur.section.title}
                {cur.count > 1 && <span className="text-ink-weak"> ({cur.no}/{cur.count})</span>}
              </div>
              {cur.slide.title && <h1 className="mt-1 text-20 font-semibold md:text-24">{cur.slide.title}</h1>}
              <div className="mt-5">
                <SlideBody key={i} slide={cur.slide} />
              </div>
            </article>
            <div className="hidden md:flex md:justify-end [&>*]:md:min-w-[320px]">{slideCta}</div>
          </div>
        ) : (
          <QuestionView
            key={i}
            q={cur.q}
            eyebrow={
              <div className="mb-3 inline-flex items-center gap-1 rounded-full bg-brand-soft px-3 py-1 text-13 font-semibold text-brand-text">
                ✅ 학습 확인{cur.count > 1 ? ` ${cur.no}/${cur.count}` : ''}
              </div>
            }
            meta={`${TYPE_LABEL[cur.q.type]} · ${cur.section.title}`}
            nextLabel={quizNext}
            onNext={answer}
            sourceTitle={cur.section.title}
            onSource={() => setSheet(true)}
          />
        )}
      </main>

      {cur.kind === 'slide' && <div className="pb-safe fixed inset-x-0 bottom-0 z-30 border-t border-line-light bg-surface px-5 pt-3 md:hidden">{slideCta}</div>}

      {sheet && (
        <BottomSheet title="개념 다시 보기" onClose={() => setSheet(false)}>
          <ConceptCard section={cur.section} count={0} />
        </BottomSheet>
      )}
      {exit && (
        <Dialog
          title="수업을 그만 볼까요?"
          desc="여기까지 저장돼요. 토픽 화면의 '이어서 하기'로 계속할 수 있어요."
          cancel="계속 보기"
          confirm="저장하고 나가기"
          onCancel={() => setExit(false)}
          onConfirm={() => nav(`/topic/${topic.id}`)}
        />
      )}
    </div>
  )
}

function LessonDone({ topic, results, onRestart }: { topic: Topic; results: SessionResult[]; onRestart: () => void }) {
  const correct = results.filter((r) => r.grade === 'correct').length
  const wrongs = results.filter((r) => r.grade === 'wrong')
  const list = topicsByTrack(topic.track)
  const nextTopic = list[list.findIndex((t) => t.id === topic.id) + 1]

  const actions = (
    <div className="flex gap-2">
      {wrongs.length > 0 ? (
        <LinkButton to={quizUrl({ mode: 'wrong', ids: wrongs.map((w) => w.id) })} variant="neutral" className="flex-1">
          틀린 것 다시
        </LinkButton>
      ) : (
        <Button variant="neutral" className="flex-1" onClick={onRestart}>
          처음부터 다시
        </Button>
      )}
      {nextTopic ? (
        <LinkButton to={`/lesson/${nextTopic.id}`} className="flex-[2]">
          다음 레슨
        </LinkButton>
      ) : (
        <LinkButton to={`/track/${topic.track}`} className="flex-[2]">
          트랙으로
        </LinkButton>
      )}
    </div>
  )

  return (
    <div className="min-h-dvh bg-surface">
      <header className="sticky top-0 z-30 bg-surface shadow-md">
        <div className="container-page flex h-14 items-center gap-3 md:h-16">
          <Link to={`/topic/${topic.id}`} aria-label="닫기" className="-ml-1 p-1">
            <Icon name="close" />
          </Link>
          <h1 className="truncate text-18 font-semibold">{topic.title}</h1>
        </div>
      </header>
      <main className="container-page max-w-[784px] pt-8 pb-36 md:pb-20">
        <div className="flex flex-col gap-10">
          <section className="flex flex-col items-center text-center">
            <p className="text-40">🎉</p>
            <p className="mt-2 text-24 font-semibold">레슨 완료!</p>
            <p className="mt-2 text-16 text-ink-sub">
              {results.length ? `확인 문제 ${results.length}개 중 ${correct}개를 맞혔어요` : '수업을 끝까지 봤어요'}
            </p>
            {nextTopic && <p className="mt-1 text-14 text-ink-weak">다음 레슨: {nextTopic.title}</p>}
          </section>
          {results.length > 0 && (
            <div className="flex gap-3">
              <StatTile label="정답" value={String(correct)} tone="correct" />
              <StatTile label="오답" value={String(wrongs.length)} tone="wrong" />
            </div>
          )}
          {wrongs.length > 0 && (
            <section>
              <h2 className="mb-1 text-20 font-semibold">틀린 문제 {wrongs.length}</h2>
              <p className="mb-4 text-14 text-ink-sub">오답노트에 넣어 뒀어요. 오늘 복습에도 나와요.</p>
              <div className="flex flex-col gap-3">
                {wrongs.map((w) => {
                  const e = questionIndex.get(w.id)
                  if (!e) return null
                  return <WrongCard key={w.id} topic={e.question.source} question={e.question.question} myAnswer={w.answer || undefined} answer={answerText(e.question)} meta="오답노트에 추가됨" to={quizUrl({ mode: 'single', qid: w.id })} />
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
