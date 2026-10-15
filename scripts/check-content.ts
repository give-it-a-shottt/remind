// 콘텐츠 검사: 설명·해설 누락, 커버리지, ID 중복, sync.json 과의 불일치를 잡는다.
// 실행: npm run check
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import type { Topic } from '../src/data/types.ts'

const root = join(import.meta.dirname, '..')
const topicsDir = join(root, 'src/data/topics')
const errors: string[] = []
const err = (where: string, msg: string) => errors.push(`${where}: ${msg}`)

const files = readdirSync(topicsDir, { recursive: true, encoding: 'utf8' }).filter((f) => f.endsWith('.ts'))
const topics: Topic[] = []
for (const f of files) {
  const mod = await import(pathToFileURL(join(topicsDir, f)).href)
  topics.push(mod.default as Topic)
}

const topicIds = new Set<string>()
const questionIds = new Set<string>()
for (const t of topics) {
  const at = `[${t.id}]`
  if (topicIds.has(t.id)) err(at, '토픽 ID 중복')
  topicIds.add(t.id)
  if (t.sections.length === 0) err(at, '섹션(개념 설명) 없음')

  const titles = new Set(t.sections.map((s) => s.title))
  for (const s of t.sections) {
    if (s.points.length === 0 || s.points.some((p) => !p.trim())) err(at, `섹션 "${s.title}" 설명 비어 있음`)
    if (!t.questions.some((q) => q.source === s.title)) err(at, `섹션 "${s.title}" 에 문제 없음`)
  }
  for (const q of t.questions) {
    const qa = `${at} ${q.id}`
    if (questionIds.has(q.id)) err(qa, '문제 ID 중복')
    questionIds.add(q.id)
    if (!titles.has(q.source)) err(qa, `source "${q.source}" 가 섹션에 없음`)
    if (!q.question.trim()) err(qa, '문제 비어 있음')
    if (!q.explanation.trim()) err(qa, '해설 비어 있음')
    if (q.type === 'mcq') {
      if (q.answer < 0 || q.answer >= q.choices.length) err(qa, '정답 인덱스 범위 밖')
      if (q.choiceExplanations && q.choiceExplanations.length !== q.choices.length) err(qa, '선택지 설명 개수 불일치')
    }
    if (q.type === 'short' && q.answer.length === 0) err(qa, '단답 정답 없음')
  }
}

// sync.json 에 있는 (빈 페이지가 아닌) 노션 페이지는 모두 토픽이 있어야 한다
const sync = JSON.parse(readFileSync(join(root, 'content/sync.json'), 'utf8'))
const covered = new Set(topics.flatMap((t) => [t.notionId, ...t.sections.flatMap((s) => s.notionIds ?? [])]).filter(Boolean))
const missing = sync.pages.filter((p: { id: string; empty?: boolean }) => !p.empty && !covered.has(p.id))

const total = topics.reduce((n, t) => n + t.questions.length, 0)
console.log(`토픽 ${topics.length}개 · 문제 ${total}개 · 노션 페이지 미작성 ${missing.length}개`)
if (process.argv.includes('--strict')) {
  for (const p of missing) err(`[notion ${p.id}]`, `"${p.title}" 토픽 없음`)
}
if (errors.length) {
  console.error(errors.join('\n'))
  process.exit(1)
}
console.log('OK')
