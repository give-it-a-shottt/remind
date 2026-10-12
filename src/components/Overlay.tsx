import { useEffect, type ReactNode } from 'react'
import { Button } from './Button'
import { Icon } from './Icon'

function useEsc(onClose: () => void) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', h)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', h)
      document.body.style.overflow = prev
    }
  }, [onClose])
}

export function Dialog({ title, desc, cancel, confirm, onCancel, onConfirm }: { title: string; desc: string; cancel: string; confirm: string; onCancel: () => void; onConfirm: () => void }) {
  useEsc(onCancel)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-5" onClick={onCancel}>
      <div role="dialog" aria-modal="true" aria-labelledby="dlg-title" className="w-full max-w-[320px] rounded-card bg-surface p-6 shadow-lg" onClick={(e) => e.stopPropagation()}>
        <h2 id="dlg-title" className="text-18 font-semibold">
          {title}
        </h2>
        <p className="mt-2 text-14 text-ink-sub">{desc}</p>
        <div className="mt-6 flex gap-2">
          <Button variant="neutral" size="sm" className="flex-1" onClick={onCancel}>
            {cancel}
          </Button>
          <Button size="sm" className="flex-1" onClick={onConfirm}>
            {confirm}
          </Button>
        </div>
      </div>
    </div>
  )
}

export function BottomSheet({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  useEsc(onClose)
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 md:items-center md:p-5" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        className="max-h-[85dvh] w-full overflow-y-auto rounded-t-card bg-canvas px-5 pt-2 pb-8 shadow-lg md:max-w-[560px] md:rounded-card md:pt-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-3 h-1 w-9 rounded-full bg-line md:hidden" />
        <div className="mb-4 flex items-center">
          <span className="flex-1 text-14 font-medium text-ink-weak">{title}</span>
          <button type="button" aria-label="닫기" onClick={onClose} className="text-ink-sub">
            <Icon name="close" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
