import type { ReactNode } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { streakDays } from '../lib/srs'
import { useProgress } from '../lib/storage'
import { Icon, type IconName } from './Icon'

const NAV: { to: string; label: string; icon: IconName }[] = [
  { to: '/', label: '홈', icon: 'home' },
  { to: '/quiz?mode=review', label: '복습', icon: 'review' },
  { to: '/wrong', label: '오답노트', icon: 'wrong-note' },
  { to: '/settings', label: '설정', icon: 'settings' },
]

function Streak() {
  const p = useProgress()
  const n = streakDays(p)
  if (!n) return null
  return (
    <span className="flex items-center gap-1 text-14 font-semibold">
      <Icon name="flame" size={20} className="text-brand" />
      {n}일 연속
    </span>
  )
}

/** 768 이상: 상단 메뉴 헤더 */
function PcHeader() {
  return (
    <header className="sticky top-0 z-30 hidden h-16 bg-surface shadow-md md:block">
      <div className="container-page flex h-full items-center gap-10">
        <Link to="/" className="text-20 font-semibold text-brand">
          remind
        </Link>
        <nav className="flex flex-1 items-center gap-8">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === '/'}
              className={({ isActive }) => `text-15 ${isActive && !n.to.startsWith('/quiz') ? 'font-semibold text-brand-text' : 'font-medium text-ink-sub hover:text-ink'}`}
            >
              {n.label}
            </NavLink>
          ))}
        </nav>
        <Streak />
      </div>
    </header>
  )
}

/** 0~767: 메인 / 뒤로가기 헤더 */
function MobileHeader({ back, title }: { back?: boolean; title?: string }) {
  const nav = useNavigate()
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 bg-surface px-5 shadow-md md:hidden">
      {back ? (
        <>
          <button type="button" onClick={() => (history.length > 1 ? nav(-1) : nav('/'))} aria-label="뒤로" className="-ml-1 p-1">
            <Icon name="chevron-left" />
          </button>
          <h1 className="flex-1 truncate text-18 font-semibold">{title}</h1>
        </>
      ) : (
        <>
          <Link to="/" className="flex-1 text-20 font-semibold text-brand">
            remind
          </Link>
          <Streak />
        </>
      )}
    </header>
  )
}

function TabBar() {
  return (
    <nav className="pb-safe fixed inset-x-0 bottom-0 z-30 flex border-t border-line-light bg-surface pt-2 md:hidden">
      {NAV.map((n) => (
        <NavLink
          key={n.to}
          to={n.to}
          end={n.to === '/'}
          className={({ isActive }) => {
            const on = isActive && !n.to.startsWith('/quiz')
            return `flex flex-1 flex-col items-center gap-0.5 py-1 text-11 ${on ? 'font-semibold text-brand-text' : 'font-medium text-ink-weak'}`
          }}
        >
          {({ isActive }) => (
            <>
              <Icon name={n.icon} className={isActive && !n.to.startsWith('/quiz') ? 'text-brand-text' : 'text-icon-weak'} />
              {n.label}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}

/**
 * 최상위 화면(홈·오답노트·설정): tabBar. 하위 화면(트랙·토픽): back + 하단 CTA.
 */
export function AppShell({ children, back, title, tabBar, bottom, bg = 'canvas' }: { children: ReactNode; back?: boolean; title?: string; tabBar?: boolean; bottom?: ReactNode; bg?: 'canvas' | 'surface' }) {
  return (
    <div className={`min-h-dvh ${bg === 'surface' ? 'bg-surface' : 'bg-canvas'}`}>
      <PcHeader />
      <MobileHeader back={back} title={title} />
      <main className={`container-page pt-6 md:pt-10 ${tabBar ? 'pb-28 md:pb-20' : bottom ? 'pb-32 lg:pb-20' : 'pb-16 md:pb-20'}`}>{children}</main>
      {bottom && <div className="pb-safe fixed inset-x-0 bottom-0 z-30 border-t border-line-light bg-surface px-5 pt-3 lg:hidden">{bottom}</div>}
      {tabBar && <TabBar />}
    </div>
  )
}
