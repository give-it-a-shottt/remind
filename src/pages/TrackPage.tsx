import { useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { topicsByTrack } from '../data'
import type { Track } from '../data/types'
import { TopicRow, TRACK_STYLE } from '../components/Cards'
import { AppShell } from '../components/Layout'
import { Chip, EmptyState } from '../components/ui'
import { topicStats, trackStats } from '../lib/stats'
import { useProgress } from '../lib/storage'

export default function TrackPage() {
  const { trackId } = useParams()
  const p = useProgress()
  const [group, setGroup] = useState('전체')
  if (!trackId || !(trackId in TRACK_STYLE)) return <Navigate to="/" replace />
  const track = trackId as Track
  const s = TRACK_STYLE[track]
  const list = topicsByTrack(track)
  const groups = ['전체', ...new Set(list.map((t) => t.group))]
  const shown = group === '전체' ? list : list.filter((t) => t.group === group)
  const st = trackStats(track, p)

  return (
    <AppShell back title={s.label}>
      <div className="flex flex-col gap-6">
        <section className={`rounded-card p-5 md:p-8 ${s.bg}`}>
          <div className={`text-14 font-medium ${s.ink}`}>{s.label}</div>
          <h1 className="mt-1 text-20 font-semibold md:text-28">{s.title}</h1>
          <div className="mt-3 flex gap-2 md:max-w-[480px]">
            {[
              ['토픽', String(st.topics)],
              ['진도', `${Math.round(st.progress * 100)}%`],
              ['정답률', st.accuracy === null ? '-' : `${st.accuracy}%`],
            ].map(([l, v]) => (
              <div key={l} className="flex-1 rounded-thumb bg-surface p-3">
                <div className="text-12 font-medium text-ink-weak">{l}</div>
                <div className="text-18 font-semibold">{v}</div>
              </div>
            ))}
          </div>
        </section>
        {groups.length > 2 && (
          <div className="-mx-5 flex gap-2 overflow-x-auto px-5 md:mx-0 md:flex-wrap md:px-0">
            {groups.map((g) => (
              <Chip key={g} selected={g === group} onClick={() => setGroup(g)}>
                {g}
              </Chip>
            ))}
          </div>
        )}
        {shown.length ? (
          <div className="grid gap-3 lg:grid-cols-2 lg:gap-4">
            {shown.map((t) => (
              <TopicRow key={t.id} topic={t} stats={topicStats(t, p)} />
            ))}
          </div>
        ) : (
          <EmptyState icon="book" title="아직 토픽이 없어요" desc="노션에 정리한 내용이 다음 업데이트 때 들어와요." />
        )}
      </div>
    </AppShell>
  )
}
