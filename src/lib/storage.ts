import { useSyncExternalStore } from 'react'

/** 0~5 Leitner 단계 */
export type Box = 0 | 1 | 2 | 3 | 4 | 5

export interface QuestionRecord {
  box: Box
  nextDue: string
  correct: number
  wrong: number
  /** 연속 정답 — 오답노트 졸업 판정 */
  streak: number
  lastAnswer?: string
  lastSeen: string
}

export type QuizMode = 'review' | 'topic' | 'section' | 'wrong' | 'single'

/** 문제 1개 채점 결과 */
export type Grade = 'correct' | 'wrong' | 'unsure'

export interface SessionResult {
  id: string
  grade: Grade
  answer?: string
}

export interface Session {
  mode: QuizMode
  /** 결과 화면 "토픽으로" 등에 쓰는 출처 */
  topicId?: string
  label: string
  ids: string[]
  index: number
  results: SessionResult[]
  startedAt: number
}

export interface Progress {
  version: 1
  questions: Record<string, QuestionRecord>
  wrongNote: string[]
  /** 학습한 날짜 (연속 학습 계산) */
  activity: string[]
  session?: Session
  lastResult?: Session & { finishedAt: number }
  settings: { shuffle: boolean; dailyLimit: number }
}

const KEY = 'remind:v1:progress'

export const emptyProgress = (): Progress => ({
  version: 1,
  questions: {},
  wrongNote: [],
  activity: [],
  settings: { shuffle: true, dailyLimit: 20 },
})

function read(): Progress {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return emptyProgress()
    const parsed = JSON.parse(raw) as Progress
    if (parsed.version !== 1) return emptyProgress()
    return { ...emptyProgress(), ...parsed, settings: { ...emptyProgress().settings, ...parsed.settings } }
  } catch {
    return emptyProgress()
  }
}

let state: Progress = read()
const listeners = new Set<() => void>()

function emit() {
  for (const l of listeners) l()
}

export function getProgress(): Progress {
  return state
}

export function setProgress(next: Progress | ((p: Progress) => Progress)) {
  state = typeof next === 'function' ? next(state) : next
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    /* 저장 공간 부족 등 — 메모리 상태는 유지 */
  }
  emit()
}

function subscribe(l: () => void) {
  listeners.add(l)
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      state = read()
      emit()
    }
  }
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(l)
    window.removeEventListener('storage', onStorage)
  }
}

export function useProgress(): Progress {
  return useSyncExternalStore(subscribe, getProgress, getProgress)
}

/** 백업 파일 내용 검증 후 교체 */
export function importProgress(json: string): { ok: true; count: number } | { ok: false; error: string } {
  try {
    const data = JSON.parse(json) as Progress
    if (data.version !== 1 || typeof data.questions !== 'object' || !Array.isArray(data.wrongNote)) {
      return { ok: false, error: 'remind 백업 파일이 아니에요.' }
    }
    setProgress({ ...emptyProgress(), ...data, session: undefined })
    return { ok: true, count: Object.keys(data.questions).length }
  } catch {
    return { ok: false, error: '파일을 읽을 수 없어요.' }
  }
}

export function exportProgress(): string {
  return JSON.stringify(state, null, 2)
}
