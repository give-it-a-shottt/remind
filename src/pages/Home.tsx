import { Link } from 'react-router-dom'
import { topics, tracks } from '../data'
import { LinkButton } from '../components/Button'
import { TopicRow, TrackCard } from '../components/Cards'
import { Icon } from '../components/Icon'
import { AppShell } from '../components/Layout'
import { EmptyState, SectionTitle } from '../components/ui'
import { reviewQueue } from '../lib/srs'
import { recentUpdates, topicStats, trackStats } from '../lib/stats'
import { useProgress } from '../lib/storage'

export default function Home() {
  const p = useProgress()
  const queue = reviewQueue(p)
  const wrongIn = queue.filter((id) => p.wrongNote.includes(id)).length
  const firstVisit = Object.keys(p.questions).length === 0
  const updates = recentUpdates()
  const unstudied = topics.filter((t) => topicStats(t, p).status === '미학습').slice(0, 3)
  const s = p.session

  return (
    <AppShell tabBar>
      <div className="flex flex-col gap-8 md:gap-10">
        <div className="grid gap-6 lg:grid-cols-[1fr_480px]">
          <div className="flex flex-col gap-4">
            {queue.length > 0 ? (
              <section className="rounded-card bg-brand-soft p-4">
                <div className="rounded-thumb bg-surface p-5">
                  <div className="flex items-center gap-1 text-14 font-medium text-brand-text">
                    <Icon name="flame" size={16} className="text-brand" />
                    오늘 복습
                  </div>
                  <h1 className="mt-1 text-24 font-semibold">{queue.length}문제가 기다려요</h1>
                  <p className="mt-3 text-15 text-ink-sub">
                    {[queue.length - wrongIn ? `복습일이 된 문제 ${queue.length - wrongIn}개` : '', wrongIn ? `오답 ${wrongIn}개` : ''].filter(Boolean).join(' + ')} · 약 {Math.max(1, Math.round(queue.length * 0.4))}분
                  </p>
                  <LinkButton to="/quiz?mode=review" full className="mt-5">
                    오늘 복습 시작
                  </LinkButton>
                </div>
              </section>
            ) : firstVisit ? (
              <EmptyState icon="book" title="첫 복습을 시작해요" desc="트랙을 골라 개념을 읽고 문제를 풀어보세요." action={<LinkButton to="/track/frontend" variant="secondary" size="sm">프론트엔드부터 시작</LinkButton>} />
            ) : (
              <EmptyState icon="check" tone="correct" title="오늘 복습 끝!" desc="새 토픽을 풀어볼까요? 푼 문제는 정해진 날에 다시 나와요." />
            )}
            {s && s.index < s.ids.length && (
              <Link to="/quiz?resume=1" className="flex items-center gap-3 rounded-card border border-line bg-surface p-4">
                <Icon name="clock" className="text-ink-sub" />
                <div className="min-w-0 flex-1">
                  <div className="text-12 font-medium text-ink-weak">이어서 풀기</div>
                  <div className="truncate text-16 font-semibold">
                    {s.label} · {s.index} / {s.ids.length}
                  </div>
                </div>
                <span className="inline-flex h-10 items-center rounded-full border border-line px-4 text-14 font-semibold">계속</span>
              </Link>
            )}
          </div>

          {updates.length > 0 ? (
            <section>
              <SectionTitle>이번 주 업데이트</SectionTitle>
              <div className="flex flex-col gap-3">
                {updates.slice(0, 4).map((u) => (
                  <TopicRow key={u.topic.id} topic={u.topic} stats={topicStats(u.topic, p)} badge={u.kind} />
                ))}
              </div>
            </section>
          ) : (
            unstudied.length > 0 && (
              <section>
                <SectionTitle>아직 안 푼 토픽</SectionTitle>
                <div className="flex flex-col gap-3">
                  {unstudied.map((t) => (
                    <TopicRow key={t.id} topic={t} stats={topicStats(t, p)} />
                  ))}
                </div>
              </section>
            )
          )}
        </div>

        <section>
          <SectionTitle>트랙</SectionTitle>
          <div className="grid gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-3">
            {tracks.map((t) => {
              const st = trackStats(t.id, p)
              return <TrackCard key={t.id} track={t.id} topics={st.topics} done={st.done} progress={st.progress} accuracy={st.accuracy} />
            })}
          </div>
        </section>
      </div>
    </AppShell>
  )
}
