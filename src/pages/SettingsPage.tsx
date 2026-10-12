import { useRef, useState, type ReactNode } from 'react'
import { questionIndex, topics } from '../data'
import { contentMeta } from '../data/meta'
import { Icon, type IconName } from '../components/Icon'
import { AppShell } from '../components/Layout'
import { Dialog } from '../components/Overlay'
import { Toast } from '../components/ui'
import { today } from '../lib/date'
import { emptyProgress, exportProgress, importProgress, setProgress, useProgress } from '../lib/storage'

function Row({ label, desc, right, onClick, danger }: { label: string; desc?: string; right?: ReactNode; onClick?: () => void; danger?: boolean }) {
  const Comp = onClick ? 'button' : 'div'
  return (
    <Comp type={onClick ? 'button' : undefined} onClick={onClick} className={`flex w-full items-center gap-3 px-5 py-4 text-left md:px-0 ${onClick ? 'hover:bg-canvas md:hover:bg-transparent' : ''}`}>
      <span className="flex-1">
        <span className={`block text-15 font-medium ${danger ? 'text-wrong-text' : ''}`}>{label}</span>
        {desc && <span className="mt-1 block text-12 text-ink-weak">{desc}</span>}
      </span>
      {right}
    </Comp>
  )
}

const RowIcon = ({ name }: { name: IconName }) => <Icon name={name} size={20} className="text-ink-sub" />

export default function SettingsPage() {
  const p = useProgress()
  const fileRef = useRef<HTMLInputElement>(null)
  const [pending, setPending] = useState<{ name: string; json: string; count: number } | null>(null)
  const [reset, setReset] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const flash = (m: string) => {
    setToast(m)
    setTimeout(() => setToast(null), 2000)
  }

  function download() {
    const blob = new Blob([exportProgress()], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `remind-backup-${today().replaceAll('-', '')}.json`
    a.click()
    URL.revokeObjectURL(a.href)
    flash('백업 파일을 저장했어요')
  }

  async function onFile(f: File | undefined) {
    if (!f) return
    const json = await f.text()
    try {
      const count = Object.keys(JSON.parse(json).questions ?? {}).length
      setPending({ name: f.name, json, count })
    } catch {
      flash('파일을 읽을 수 없어요')
    }
    if (fileRef.current) fileRef.current.value = ''
  }

  const LIMITS = [10, 20, 30, 50]
  const qCount = questionIndex.size

  const band = <div className="h-3 bg-fill md:hidden" />
  const group = (title: string, children: ReactNode) => (
    <section className="py-6 md:rounded-card md:bg-surface md:px-6 md:py-4">
      <h2 className="px-5 pb-2 text-14 font-semibold text-ink-weak md:px-0 md:pt-2">{title}</h2>
      <div className="md:divide-y md:divide-line-light">{children}</div>
    </section>
  )

  return (
    <AppShell tabBar bg="surface">
      <div className="-mx-5 md:mx-0 md:max-w-[720px]">
        <h1 className="px-5 pb-2 text-24 font-semibold md:px-0 md:pb-6 md:text-32">설정</h1>
        <div className="md:flex md:flex-col md:gap-4">
          {group(
            '퀴즈',
            <>
              <Row
                label="문제 순서 섞기"
                onClick={() => setProgress((pp) => ({ ...pp, settings: { ...pp.settings, shuffle: !pp.settings.shuffle } }))}
                right={
                  <span role="switch" aria-checked={p.settings.shuffle} className={`flex h-6 w-11 items-center rounded-full p-0.5 transition-colors ${p.settings.shuffle ? 'justify-end bg-brand-strong' : 'justify-start bg-fill'}`}>
                    <span className="size-5 rounded-full bg-surface shadow-sm" />
                  </span>
                }
              />
              <Row
                label="오늘 복습 최대 문제 수"
                onClick={() => setProgress((pp) => ({ ...pp, settings: { ...pp.settings, dailyLimit: LIMITS[(LIMITS.indexOf(pp.settings.dailyLimit) + 1) % LIMITS.length] } }))}
                right={
                  <span className="flex items-center gap-1 text-15 font-medium text-ink-sub">
                    {p.settings.dailyLimit}개 <Icon name="chevron-right" size={20} className="text-icon-weak" />
                  </span>
                }
              />
            </>,
          )}
          {band}
          {group(
            '학습 기록',
            <>
              <Row label="내보내기" desc="JSON 파일로 저장해 다른 기기로 옮겨요" onClick={download} right={<RowIcon name="download" />} />
              <Row label="가져오기" desc="백업 파일로 기록을 복원해요" onClick={() => fileRef.current?.click()} right={<RowIcon name="upload" />} />
              <Row label="기록 초기화" desc="모든 풀이 기록과 오답노트를 지워요" danger onClick={() => setReset(true)} right={<RowIcon name="trash" />} />
              <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={(e) => onFile(e.target.files?.[0])} />
            </>,
          )}
          {band}
          {group(
            '정보',
            <>
              <Row label="마지막 콘텐츠 업데이트" right={<span className="text-15 font-medium text-ink-sub">{contentMeta.lastSyncedAt}</span>} />
              <Row label="토픽 · 문제" right={<span className="text-15 font-medium text-ink-sub">{topics.length} · {qCount.toLocaleString()}</span>} />
              <Row label="푼 문제" right={<span className="text-15 font-medium text-ink-sub">{Object.keys(p.questions).length.toLocaleString()}</span>} />
            </>,
          )}
        </div>
      </div>

      {pending && (
        <Dialog
          title="기록을 덮어쓸까요?"
          desc={`${pending.name} (문제 ${pending.count}개 기록)으로 지금 기록을 바꿔요. 되돌릴 수 없어요.`}
          cancel="취소"
          confirm="덮어쓰기"
          onCancel={() => setPending(null)}
          onConfirm={() => {
            const r = importProgress(pending.json)
            setPending(null)
            flash(r.ok ? '기록을 복원했어요' : r.error)
          }}
        />
      )}
      {reset && (
        <Dialog
          title="기록을 모두 지울까요?"
          desc="풀이 기록, 오답노트, 이어서 풀기가 모두 사라져요. 지우기 전에 내보내기를 권장해요."
          cancel="취소"
          confirm="초기화"
          onCancel={() => setReset(false)}
          onConfirm={() => {
            setProgress((pp) => ({ ...emptyProgress(), settings: pp.settings }))
            setReset(false)
            flash('기록을 초기화했어요')
          }}
        />
      )}
      <Toast message={toast} />
    </AppShell>
  )
}
