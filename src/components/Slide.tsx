import { useState, type ReactNode } from 'react'
import type { Block, Slide } from '../data/types'
import { Icon } from './Icon'
import { CodeBlock } from './ui'

/** `코드` 와 **굵게** 만 지원하는 아주 작은 인라인 문법 */
export function Inline({ text }: { text: string }) {
  const out: ReactNode[] = []
  const re = /(`[^`]+`|\*\*[^*]+\*\*)/g
  let last = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index))
    const t = m[0]
    out.push(
      t.startsWith('`') ? (
        <code key={m.index} className="rounded bg-fill px-1.5 py-0.5 font-mono text-[0.9em] text-ink">
          {t.slice(1, -1)}
        </code>
      ) : (
        <strong key={m.index} className="font-semibold text-ink">
          {t.slice(2, -2)}
        </strong>
      ),
    )
    last = m.index + t.length
  }
  if (last < text.length) out.push(text.slice(last))
  return <>{out}</>
}

const NOTE = {
  analogy: { label: '비유로 보면', icon: '💡', box: 'bg-brand-soft' },
  tip: { label: '알아 두면 좋아요', icon: '✅', box: 'bg-correct-bg' },
  warn: { label: '자주 하는 오해', icon: '⚠️', box: 'bg-hint-bg' },
} as const

function Ask({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="rounded-choice ring-1 ring-line">
      <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} className="flex w-full items-start gap-2 p-4 text-left">
        <span className="text-16">🤔</span>
        <span className="min-w-0 flex-1 text-15 font-semibold whitespace-pre-line">
          <Inline text={q} />
        </span>
        <Icon name="chevron-down" size={20} className={`mt-0.5 text-icon-weak transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open ? (
        <p className="border-t border-line-light px-4 py-3.5 text-15 leading-relaxed whitespace-pre-line text-ink-sub">
          <Inline text={a} />
        </p>
      ) : (
        <p className="px-4 pb-3.5 -mt-1 text-13 text-ink-weak">잠깐 생각해 보고 눌러서 답을 확인해요</p>
      )}
    </div>
  )
}

export function BlockView({ b }: { b: Block }) {
  switch (b.type) {
    case 'say':
      return (
        <p className="text-16 leading-[1.75] whitespace-pre-line text-ink-sub">
          <Inline text={b.text} />
        </p>
      )
    case 'ask':
      return <Ask q={b.q} a={b.a} />
    case 'list': {
      const Tag = b.ordered ? 'ol' : 'ul'
      return (
        <Tag className="flex flex-col gap-2">
          {b.items.map((it, i) => (
            <li key={i} className="flex gap-2.5 text-15 leading-relaxed text-ink-sub">
              <span className={`shrink-0 ${b.ordered ? 'flex size-6 items-center justify-center rounded-full bg-fill text-12 font-semibold text-ink' : 'text-ink-weak'}`}>{b.ordered ? i + 1 : '•'}</span>
              <span className="min-w-0 [overflow-wrap:anywhere]">
                <Inline text={it} />
              </span>
            </li>
          ))}
        </Tag>
      )
    }
    case 'code':
      return (
        <figure className="flex flex-col gap-2">
          <CodeBlock code={b.code} />
          {b.caption && (
            <figcaption className="text-13 text-ink-weak">
              <Inline text={b.caption} />
            </figcaption>
          )}
        </figure>
      )
    case 'table':
      return (
        <div className="overflow-x-auto rounded-choice ring-1 ring-line">
          <table className="w-full min-w-[480px] border-collapse text-left text-14">
            <thead className="bg-canvas">
              <tr>
                {b.head.map((h, i) => (
                  <th key={i} className="px-3 py-2.5 font-semibold">
                    <Inline text={h} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {b.rows.map((r, i) => (
                <tr key={i} className="border-t border-line-light">
                  {r.map((c, j) => (
                    <td key={j} className={`px-3 py-2.5 align-top text-ink-sub ${j === 0 ? 'font-medium text-ink' : ''}`}>
                      <Inline text={c} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    case 'note': {
      const n = NOTE[b.tone]
      return (
        <aside className={`rounded-choice p-4 ${n.box}`}>
          <div className="mb-1 text-13 font-semibold text-ink">
            {n.icon} {n.label}
          </div>
          <p className="text-15 leading-relaxed whitespace-pre-line text-ink-sub">
            <Inline text={b.text} />
          </p>
        </aside>
      )
    }
  }
}

export function SlideBody({ slide }: { slide: Slide }) {
  return (
    <div className="flex flex-col gap-5">
      {slide.blocks.map((b, i) => (
        <BlockView key={i} b={b} />
      ))}
    </div>
  )
}
