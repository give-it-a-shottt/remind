import type { ReactNode } from 'react'
import { Icon } from './Icon'

export type ChoiceState = 'default' | 'selected' | 'correct' | 'wrong' | 'dim'

export function Choice({ n, label, state, onClick, disabled }: { n: number; label: string; state: ChoiceState; onClick?: () => void; disabled?: boolean }) {
  const box = {
    default: 'bg-surface ring-1 ring-line hover:bg-canvas hover:shadow-sm',
    dim: 'bg-surface ring-1 ring-line opacity-70',
    selected: 'bg-brand-soft ring-2 ring-brand',
    correct: 'bg-correct-bg ring-2 ring-correct',
    wrong: 'bg-wrong-bg ring-2 ring-wrong',
  }[state]
  const marker = {
    default: 'bg-fill text-ink-sub',
    dim: 'bg-fill text-ink-sub',
    selected: 'bg-brand text-white',
    correct: 'bg-correct text-white',
    wrong: 'bg-wrong text-white',
  }[state]
  return (
    <button type="button" onClick={onClick} disabled={disabled} aria-pressed={state === 'selected'} className={`flex w-full items-center gap-3 rounded-choice px-5 py-4 text-left ring-inset transition-colors ${box}`}>
      <span className={`flex size-7 shrink-0 items-center justify-center rounded-full text-14 font-semibold ${marker}`}>
        {state === 'correct' ? <Icon name="check" size={16} /> : state === 'wrong' ? <Icon name="close" size={16} /> : n}
      </span>
      <span className="text-15 font-medium">{label}</span>
    </button>
  )
}

export function OXButton({ value, state, onClick, disabled }: { value: 'O' | 'X'; state: ChoiceState; onClick?: () => void; disabled?: boolean }) {
  const box = {
    default: 'bg-surface ring-1 ring-line hover:bg-canvas',
    dim: 'bg-surface ring-1 ring-line opacity-70',
    selected: 'bg-brand-soft ring-2 ring-brand text-brand-text',
    correct: 'bg-correct-bg ring-2 ring-correct text-correct-text',
    wrong: 'bg-wrong-bg ring-2 ring-wrong text-wrong-text',
  }[state]
  return (
    <button type="button" onClick={onClick} disabled={disabled} className={`flex h-30 flex-1 flex-col items-center justify-center gap-1 rounded-card ring-inset transition-colors ${box}`}>
      <span className="text-40 font-semibold">{value}</span>
      <span className={`text-14 font-medium ${state === 'default' || state === 'dim' ? 'text-ink-weak' : ''}`}>{value === 'O' ? '맞다' : '아니다'}</span>
    </button>
  )
}

export function FeedbackPanel({ correct, answer, explanation, source, onSource, extra }: { correct: boolean; answer?: string; explanation: string; source?: string; onSource?: () => void; extra?: ReactNode }) {
  return (
    <section className={`flex flex-col gap-3 rounded-card p-5 ${correct ? 'bg-correct-bg' : 'bg-wrong-bg'}`} aria-live="polite">
      <div className="flex items-center gap-2">
        <span className={`flex size-6 items-center justify-center rounded-full text-white ${correct ? 'bg-correct' : 'bg-wrong'}`}>
          <Icon name={correct ? 'check' : 'close'} size={14} strokeWidth={2.5} />
        </span>
        <h2 className={`text-18 font-semibold ${correct ? 'text-correct-text' : 'text-wrong-text'}`}>{correct ? '정답이에요!' : '아쉬워요'}</h2>
      </div>
      {answer && <p className="text-15 font-semibold">정답: {answer}</p>}
      <p className="whitespace-pre-line text-15 text-ink-sub">{explanation}</p>
      {extra}
      {source && onSource && (
        <button type="button" onClick={onSource} className="flex items-start gap-1 self-start text-left text-14 font-medium text-brand-text">
          <Icon name="book" size={16} className="mt-0.5" />
          개념 보기 · {source}
        </button>
      )}
    </section>
  )
}

export function ChoiceNotes({ notes, answer, picked }: { notes: string[]; answer: number; picked: number | null }) {
  return (
    <section className="flex flex-col gap-2.5 rounded-card bg-surface p-5">
      <h3 className="text-14 font-semibold">보기별 설명</h3>
      {notes.map((t, i) => {
        const kind = i === answer ? 'correct' : i === picked ? 'wrong' : 'neutral'
        return (
          <div key={i} className="flex items-start gap-2">
            <span
              className={`mt-px flex size-5 shrink-0 items-center justify-center rounded-full text-12 font-semibold ${kind === 'correct' ? 'bg-correct text-white' : kind === 'wrong' ? 'bg-wrong text-white' : 'bg-fill text-ink-sub'}`}
            >
              {kind === 'correct' ? <Icon name="check" size={12} /> : kind === 'wrong' ? <Icon name="close" size={12} /> : i + 1}
            </span>
            <span className="whitespace-pre-line text-14 text-ink-sub">{t}</span>
          </div>
        )
      })}
    </section>
  )
}

export function SelfGrade({ onGrade }: { onGrade: (g: 'wrong' | 'unsure' | 'correct') => void }) {
  return (
    <div className="flex gap-2">
      <button type="button" onClick={() => onGrade('wrong')} className="h-12 flex-1 rounded-full bg-wrong-bg text-15 font-semibold text-wrong-text">
        몰랐음
      </button>
      <button type="button" onClick={() => onGrade('unsure')} className="h-12 flex-1 rounded-full bg-hint-bg text-15 font-semibold text-hint-text">
        애매함
      </button>
      <button type="button" onClick={() => onGrade('correct')} className="h-12 flex-1 rounded-full bg-correct-bg text-15 font-semibold text-correct-text">
        알았음
      </button>
    </div>
  )
}
