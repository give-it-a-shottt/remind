import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { useSyncExternalStore } from 'react'
import { mergeProgress, sameSynced, toSynced, type SyncedProgress } from './merge'
import { getProgress, onProgressChange, setProgress } from './storage'

/**
 * 기기 간 학습 기록 동기화 (Supabase)
 * - 기본 저장소는 여전히 localStorage. 서버는 "같이 보는 한 곳"일 뿐이라 오프라인에서도 풀 수 있다
 * - 열 때·화면으로 돌아올 때·기록이 바뀐 뒤 몇 초 뒤에: 서버가 바뀌었으면 받아 합치고, 다르면 올린다
 */

const URL_ = import.meta.env.VITE_SUPABASE_URL as string | undefined
const KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined
export const supabase: SupabaseClient | null = URL_ && KEY ? createClient(URL_, KEY) : null

/** 회원가입 없이 쓰는 아이디 → Supabase 계정 이메일 */
const toEmail = (id: string) => (id.includes('@') ? id.trim() : `${id.trim()}@remind.local`)

const META_KEY = 'remind:v1:sync'
type Meta = { remoteAt?: string; dirty?: boolean }
const readMeta = (): Meta => {
  try {
    return JSON.parse(localStorage.getItem(META_KEY) ?? '{}') as Meta
  } catch {
    return {}
  }
}
const writeMeta = (m: Meta) => localStorage.setItem(META_KEY, JSON.stringify(m))

export interface SyncStatus {
  /** off: 설정 없음 · signedOut: 로그인 전 · idle · syncing · error */
  state: 'off' | 'signedOut' | 'idle' | 'syncing' | 'error'
  user?: string
  lastAt?: number
  error?: string
}

let status: SyncStatus = { state: supabase ? 'signedOut' : 'off' }
const listeners = new Set<() => void>()
function setStatus(s: Partial<SyncStatus>) {
  status = { ...status, ...s }
  for (const l of listeners) l()
}
export function useSyncStatus(): SyncStatus {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l)
      return () => listeners.delete(l)
    },
    () => status,
  )
}

let running = false
let again = false
/** 이 기기에서 기록이 바뀐 횟수 — 맞추는 도중에 또 풀었으면 "아직 안 올림"을 남기려고 */
let changes = 0

/** 서버와 한 번 맞추기. 이미 도는 중이면 끝난 뒤 한 번 더 */
export async function syncNow(): Promise<void> {
  if (!supabase) return
  if (running) {
    again = true
    return
  }
  const { data: auth } = await supabase.auth.getSession()
  const user = auth.session?.user
  if (!user) {
    setStatus({ state: 'signedOut', user: undefined })
    return
  }
  running = true
  setStatus({ state: 'syncing', user: user.email?.replace('@remind.local', '') })
  const changesAtStart = changes
  try {
    const meta = readMeta()
    const head = await supabase.from('progress').select('updated_at').eq('user_id', user.id).maybeSingle()
    if (head.error) throw head.error

    let base: SyncedProgress | null = null
    if (head.data && head.data.updated_at !== meta.remoteAt) {
      // 서버가 내가 마지막으로 본 뒤에 바뀌었다 → 받아서 합친다
      const full = await supabase.from('progress').select('data, updated_at').eq('user_id', user.id).single()
      if (full.error) throw full.error
      base = full.data.data as SyncedProgress
      const merged = mergeProgress(getProgress(), base)
      setProgress(merged, { silent: true })
      meta.remoteAt = full.data.updated_at
    }

    const mine = toSynced(getProgress())
    const needPush = !head.data || meta.dirty || (base !== null && !sameSynced(mine, base))
    if (needPush) {
      const up = await supabase
        .from('progress')
        .upsert({ user_id: user.id, data: mine, updated_at: new Date().toISOString() })
        .select('updated_at')
        .single()
      if (up.error) throw up.error
      meta.remoteAt = up.data.updated_at
    }
    writeMeta({ remoteAt: meta.remoteAt, dirty: changes !== changesAtStart })
    setStatus({ state: 'idle', lastAt: Date.now(), error: undefined })
  } catch (e) {
    setStatus({ state: 'error', error: e instanceof Error ? e.message : String(e) })
  } finally {
    running = false
    if (again) {
      again = false
      void syncNow()
    }
  }
}

export async function signIn(id: string, password: string): Promise<string | null> {
  if (!supabase) return '동기화 설정이 없어요'
  const { error } = await supabase.auth.signInWithPassword({ email: toEmail(id), password })
  if (error) return error.message === 'Invalid login credentials' ? '아이디 또는 비밀번호가 맞지 않아요' : error.message
  // 다른 계정의 기록과 섞이지 않게, 로그인할 때마다 "마지막으로 본 서버 시각"을 비우고 처음부터 맞춘다
  writeMeta({ dirty: true })
  await syncNow()
  return null
}

export async function signOut(): Promise<void> {
  if (!supabase) return
  await supabase.auth.signOut()
  writeMeta({})
  setStatus({ state: 'signedOut', user: undefined, lastAt: undefined })
}

let started = false

/** 앱 시작 때 한 번 */
export function startSync(): void {
  if (!supabase || started) return
  started = true
  let timer: ReturnType<typeof setTimeout> | undefined
  onProgressChange(() => {
    changes++
    writeMeta({ ...readMeta(), dirty: true })
    clearTimeout(timer)
    timer = setTimeout(() => void syncNow(), 3000) // 문제를 연달아 풀 때 매번 보내지 않게
  })
  const wake = () => {
    if (document.visibilityState === 'visible') void syncNow()
  }
  document.addEventListener('visibilitychange', wake)
  window.addEventListener('online', () => void syncNow())
  void syncNow()
}
