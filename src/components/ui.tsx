import type { ReactNode } from 'react'
import { Icon, type IconName } from './Icon'

export type BadgeType = 'NEW' | 'UPDATED' | '완료' | '학습중' | '미학습' | '오답'
const badgeStyle: Record<BadgeType, string> = {
  NEW: 'bg-brand-soft text-brand-text',
  UPDATED: 'bg-hint-bg text-hint-text',
  완료: 'bg-correct-bg text-correct-text',
  학습중: 'bg-fill text-ink-sub',
  미학습: 'bg-canvas text-ink-weak ring-1 ring-inset ring-line',
  오답: 'bg-wrong-bg text-wrong-text',
}
export function Badge({ type, children }: { type: BadgeType; children?: ReactNode }) {
  return <span className={`inline-flex h-6 shrink-0 items-center rounded-full px-2.5 text-12 font-semibold ${badgeStyle[type]}`}>{children ?? type}</span>
}

export function Chip({ selected, onClick, children }: { selected?: boolean; onClick?: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`inline-flex h-9 shrink-0 items-center rounded-full border px-4 text-14 font-medium transition-colors ${
        selected ? 'border-brand bg-brand-soft text-brand-text' : 'border-line bg-surface text-ink-sub hover:bg-canvas'
      }`}
    >
      {children}
    </button>
  )
}

export function ProgressBar({ value, className = '' }: { value: number; className?: string }) {
  const pct = Math.max(0, Math.min(1, value)) * 100
  return (
    <div className={`h-2 w-full overflow-hidden rounded-full bg-fill ${className}`} role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100}>
      <div className="h-full rounded-full bg-brand transition-[width] duration-300" style={{ width: `${pct}%` }} />
    </div>
  )
}

export function CodeBlock({ code, lang }: { code: string; lang?: string }) {
  return (
    <div className="rounded-choice bg-code-bg p-4">
      {lang && <div className="mb-2 text-11 font-medium text-ink-disabled">{lang}</div>}
      <pre className="overflow-x-auto text-13 leading-[1.45] text-code-text">
        <code>{code}</code>
      </pre>
    </div>
  )
}

export function StatTile({ label, value, tone = 'main' }: { label: string; value: string; tone?: 'main' | 'correct' | 'wrong' }) {
  const color = tone === 'correct' ? 'text-correct-text' : tone === 'wrong' ? 'text-wrong-text' : 'text-ink'
  return (
    <div className="flex-1 rounded-thumb bg-canvas p-4">
      <div className="text-12 font-medium text-ink-weak">{label}</div>
      <div className={`mt-1 text-24 font-semibold ${color}`}>{value}</div>
    </div>
  )
}

export function EmptyState({ icon, tone = 'neutral', title, desc, action }: { icon: IconName; tone?: 'neutral' | 'correct'; title: string; desc: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-card bg-surface px-6 py-10 text-center">
      <div className={`flex size-14 items-center justify-center rounded-full ${tone === 'correct' ? 'bg-correct-bg text-correct' : 'bg-fill text-ink-sub'}`}>
        <Icon name={icon} size={28} />
      </div>
      <h3 className="mt-4 text-18 font-semibold">{title}</h3>
      <p className="mt-2 text-14 text-ink-sub">{desc}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <h2 className="flex-1 text-20 font-semibold md:text-24">{children}</h2>
      {action}
    </div>
  )
}

export function Toast({ message }: { message: string | null }) {
  if (!message) return null
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex justify-center px-5 md:bottom-10" role="status">
      <div className="flex items-center gap-2 rounded-full bg-code-bg px-5 py-3.5 text-14 font-medium text-code-text shadow-md">
        <Icon name="check" size={18} className="text-white" />
        {message}
      </div>
    </div>
  )
}
