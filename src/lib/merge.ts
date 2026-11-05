import type { LessonState, Progress, QuestionRecord } from './storage'

/** 서버에 올리는 모양 — 풀던 세트(session)와 마지막 결과(lastResult)는 기기마다 따로라 뺀다 */
export type SyncedProgress = Omit<Progress, 'session' | 'lastResult'>

export function toSynced(p: Progress): SyncedProgress {
  const { session: _s, lastResult: _r, ...rest } = p
  return rest
}

/** 두 기록 중 더 최근에 푼 쪽. 정확한 시각(at) → 날짜(lastSeen) → 푼 횟수 순으로 비교, 같으면 a */
function newerRecord(a: QuestionRecord, b: QuestionRecord): 'a' | 'b' {
  if ((a.at ?? 0) !== (b.at ?? 0)) return (a.at ?? 0) > (b.at ?? 0) ? 'a' : 'b'
  if (a.lastSeen !== b.lastSeen) return a.lastSeen > b.lastSeen ? 'a' : 'b'
  return a.correct + a.wrong >= b.correct + b.wrong ? 'a' : 'b'
}

function newerLesson(a: LessonState, b: LessonState): LessonState {
  if ((a.at ?? 0) !== (b.at ?? 0)) return (a.at ?? 0) > (b.at ?? 0) ? a : b
  if ((a.doneAt ?? '') !== (b.doneAt ?? '')) return (a.doneAt ?? '') > (b.doneAt ?? '') ? a : b
  return a.step >= b.step ? a : b
}

/**
 * 이 기기 기록(local)과 서버 기록(remote)을 합친다.
 * - 판 번호(epoch)가 다르면 큰 쪽이 통째로 이긴다 (초기화·가져오기를 존중)
 * - 문제마다 더 최근에 푼 기록을 고르고, 오답노트도 고른 쪽 기준
 * - 학습한 날은 합집합, 설정·레슨 진도는 더 최근 것
 * - 풀던 세트와 마지막 결과는 항상 이 기기 것
 */
export function mergeProgress(local: Progress, remote: SyncedProgress): Progress {
  const keepLocal = { session: local.session, lastResult: local.lastResult }
  const le = local.epoch ?? 0
  const re = remote.epoch ?? 0
  if (re > le) return { ...local, ...remote, ...keepLocal }
  if (le > re) return local

  const questions: Record<string, QuestionRecord> = {}
  const fromRemote = new Set<string>()
  for (const id of new Set([...Object.keys(local.questions), ...Object.keys(remote.questions)])) {
    const a = local.questions[id]
    const b = remote.questions[id]
    if (a && b) {
      const pick = newerRecord(a, b)
      questions[id] = pick === 'a' ? a : b
      if (pick === 'b') fromRemote.add(id)
    } else if (a) questions[id] = a
    else if (b) {
      questions[id] = b
      fromRemote.add(id)
    }
  }

  // 오답노트: 문제마다 고른 쪽의 오답노트를 따른다 (한쪽에서 졸업했으면 졸업)
  const wrongNote: string[] = []
  for (const id of [...local.wrongNote, ...remote.wrongNote]) {
    if (wrongNote.includes(id)) continue
    const src = fromRemote.has(id) ? remote.wrongNote : local.wrongNote
    if (src.includes(id)) wrongNote.push(id)
  }

  const activity = [...new Set([...local.activity, ...remote.activity])].sort().slice(-120)

  const settings = (remote.settings.at ?? 0) > (local.settings.at ?? 0) ? remote.settings : local.settings

  const lessons: Record<string, LessonState> = { ...remote.lessons }
  for (const [id, l] of Object.entries(local.lessons ?? {})) {
    lessons[id] = lessons[id] ? newerLesson(l, lessons[id]) : l
  }

  return { ...local, questions, wrongNote, activity, settings, lessons, epoch: le, ...keepLocal }
}

/** 키 순서와 상관없이 같은 값이면 같은 문자열 (Postgres jsonb는 키 순서를 바꿔 저장한다) */
function stable(v: unknown): string {
  if (Array.isArray(v)) return `[${v.map(stable).join(',')}]`
  if (v && typeof v === 'object') {
    const entries = Object.entries(v as Record<string, unknown>)
      .filter(([, x]) => x !== undefined)
      .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    return `{${entries.map(([k, x]) => `${JSON.stringify(k)}:${stable(x)}`).join(',')}}`
  }
  return JSON.stringify(v)
}

/** 올릴 필요가 있는지: 합친 결과가 서버 것과 다르면 올린다 */
export function sameSynced(a: SyncedProgress, b: SyncedProgress): boolean {
  return stable(a) === stable(b)
}
