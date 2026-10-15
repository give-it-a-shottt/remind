import type { Topic } from '../../types'

const topic: Topic = {
  id: 'pj-34-maestro-front-core',
  track: 'project',
  group: '프론트',
  title: '03-5. projects/maestro ① 앱 · api · store · format',
  order: 34,
  notionId: '3f2df951bf8081cda392fbeaa45290fc',
  addedAt: '2026-10-15',
  sections: [
    {
      title: '폴더 개요 · MaestroApp · routes.ts',
      notionIds: ['3f2df951bf80818ea9e9dadd4985e445', '3f2df951bf8081f3951fef7e1f9eafe0'],
      code: `export function maestroHref(path = '', params: Record<string, string | number | undefined> = {}) {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) search.set(key, String(value))
  }
  ...
}`,
      points: [
        '모바일 시안(375×812) 5화면 + 바텀시트 3개. 데이터 흐름: screens → api.ts → 백엔드, saveScore → store.ts → localStorage',
        '상태 관리 라이브러리 없이 useSyncExternalStore + 모듈 변수로 작은 전역 스토어를 직접 만든 게 핵심',
        'MaestroApp: 들어오자마자 useEffect(() => wakeServer(), []) — 사용자가 홈을 읽는 동안 서버를 깨워 cold start 를 숨김',
        '/place/{id} 는 decodeURIComponent 로 id 를 꺼냄',
        'maestroHref 는 undefined 값을 빼서 { s: key ?? undefined } 처럼 선택적 파라미터를 깔끔하게',
      ],
    },
    {
      title: 'api.ts',
      notionIds: ['3f2df951bf8081c48a75d7625712dc4c'],
      code: `const hint = serverState === 'awake' ? undefined
  : setTimeout(() => serverState !== 'awake' && setServerState('waking'), WAKE_HINT_MS)
try {
  response = await fetch(\`\${API_URL}\${path}\`, { ...init, headers: { 'Content-Type': 'application/json', ...init?.headers } })
} catch {
  throw new ApiError('offline', '서버에 연결하지 못했어요. ...')
} finally {
  clearTimeout(hint)
}`,
      points: [
        '모든 백엔드 호출이 request() 를 지나감 — 화면은 fetch 를 직접 쓰지 않음',
        'ApiError extends Error 에 code 필드. 4xx/5xx 면 {detail:{code,message}} 를 꺼내 ApiError 로, 모양이 다르면 "잠시 후 다시 시도"',
        '서버 상태 기계 unknown → waking → awake: 첫 응답 전 2.5초가 지나면 waking → "서버를 깨우는 중" 띠',
        '한 번 awake 가 되면 이후 느린 요청(유미 검색)에는 안내를 띄우지 않음',
        'CORS 에 막히면 브라우저가 응답을 숨겨 fetch 자체가 예외 → catch → offline. 그래서 CORS 실수도 "서버에 연결하지 못했어요"',
        '내보내는 함수: wakeServer(중복 방지 waking 변수), createScore, getPlace, askWaitTime, waitForAnswer, subscribeServerState/getServerState',
      ],
    },
    {
      title: 'store.ts',
      notionIds: ['3f2df951bf8081d08e2ad0df344cf2d1'],
      code: `let state = load()
const listeners = new Set<() => void>()

function update(next: Partial<MaestroState>) {
  state = { ...state, ...next }
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)) } catch {}
  listeners.forEach((listener) => listener())
}

export function useMaestro() {
  return useSyncExternalStore(subscribe, () => state)
}`,
      points: [
        '일정(meals)과 악보(score)를 담는 미니 전역 스토어 — 모든 화면이 useMaestro() 로 같은 값',
        'update 는 항상 새 객체(불변) → 저장 → 구독자에게 알림',
        'saveMeal·removeMeal 은 score: null 로 악보 무효화, saveScore 는 악보 저장',
        '저장 이유: 새로고침해도 유미를 다시 부르지 않게 (하루 한도)',
        '키 maestro-plan-v1 의 -v1: 모양이 바뀌면 -v2 로 깔끔하게 갈아탈 수 있게',
        '저장된 JSON 을 as MaestroState 로 검증 없이 믿음 → 예전 모양 데이터가 남으면 깨질 수 있어 버전 키가 중요',
        'SAMPLE_MEALS: 해커톤 날(10.17 토) 을지로 12:00·15:30 → 성수 18:00',
      ],
    },
    {
      title: 'types.ts · format.ts',
      notionIds: ['3f2df951bf8081e4bbbcea2077370b94', '3f2df951bf80818083a0ed2a5c7e50d1'],
      code: `function toDate(date: string) {
  const [y, m, d] = date.slice(0, 10).split('-').map(Number)
  return new Date(y, m - 1, d)   // 현지 날짜로
}`,
      points: [
        'types.ts: 백엔드 응답의 TS 거울 (SituationKey, MealKind, MealScore, Score, LiveStatus…) — 자동 동기화 없음',
        'format.ts: 백엔드 데이터 → 화면 글자를 만드는 순수 함수 모음',
        'opusNumber("2026-10-17") → "Op. 1017", priceBand(12000) → "1만원대", walkText(280m) → "도보 4분" (분속 70m)',
        'joinInfo(...parts): null 을 빼고 " · " 로 잇기, trustBadges: 노포·교차검증·최근 활동',
        'examplePhoto: 실제 매장 사진(media 등급 8토큰) 대신 음식 종류에 맞는 예시 사진 3장 중 하나 + "예시 사진" 라벨 — 비용과 정직함의 타협',
        'currentMealIndex: 지금이 시작+90분 전인 첫 끼니, 다 지났으면 마지막',
        'new Date("2026-10-17") 은 UTC 자정으로 해석돼 미국 시간대에선 하루 전으로 보일 수 있음 → new Date(y, m - 1, d)',
      ],
    },
  ],
  questions: [
    { id: 'pj-34-01', type: 'mcq', source: '폴더 개요 · MaestroApp · routes.ts', question: 'MaestroApp 이 들어오자마자 wakeServer() 를 부르는 UX 목적은?', choices: ['로그 기록', '사용자가 홈을 읽고 일정을 고르는 동안 서버를 미리 깨워 "지휘 시작" 때 대기를 없애려고', '캐시 비우기', '인증'], answer: 1, explanation: 'Render 무료 서버의 cold start(~1분)를 숨기는 방법이에요.' },
    { id: 'pj-34-02', type: 'mcq', source: '폴더 개요 · MaestroApp · routes.ts', question: "maestroHref('/live', { meal: 1, s: undefined }) 의 결과는?", choices: ['에러', "'#/maestro/live?meal=1&s=undefined'", "'#/maestro/live?meal=1'", "'#/maestro/live'"], answer: 2, explanation: 'undefined 값은 주소에서 빼요.' },
    { id: 'pj-34-03', type: 'mcq', source: '폴더 개요 · MaestroApp · routes.ts', question: 'Maestro 전역 상태 관리 방식은?', choices: ['Context API', 'Redux', 'Zustand', '모듈 변수 + 구독자 Set + useSyncExternalStore'], answer: 3, explanation: '라이브러리 없이 약 80줄로 만들었어요.' },
    { id: 'pj-34-04', type: 'mcq', source: 'api.ts', question: 'CORS 설정이 틀렸을 때 Maestro 화면에 뜨는 메시지는?', choices: ['"서버에 연결하지 못했어요" — 브라우저가 응답을 숨겨 fetch 자체가 예외라 offline 분기', '"잠시 후 다시 시도"', '404', 'CORS 에러'], answer: 0, explanation: '그래서 배포 후 연결 문제는 CORS 와 API 주소를 먼저 봐요.' },
    { id: 'pj-34-05', type: 'mcq', source: 'api.ts', question: '서버 상태가 한 번 awake 가 된 뒤 느린 요청이 오면?', choices: ['"깨우는 중" 띠를 다시 표시', '안내를 띄우지 않음 — 서버가 자는 게 아니라 작업이 느린 것이라서', '에러', '재시도'], answer: 1, explanation: 'awake 면 hint 타이머 자체를 걸지 않아요.' },
    { id: 'pj-34-06', type: 'mcq', source: 'api.ts', question: 'request() 에서 hint 타이머를 finally 에서 clearTimeout 하는 이유는?', choices: ['테스트', '성공 시만 정리', '성공이든 실패든 응답이 오면 "깨우는 중" 안내 타이머를 정리하려고', '메모리 누수 방지만'], answer: 2, explanation: 'finally 는 try·catch 어느 쪽이든 실행돼요.' },
    { id: 'pj-34-07', type: 'mcq', source: 'api.ts', question: '응답 body 에 detail.code 가 없으면 ApiError 는?', choices: ['던지지 않음', "code 'validation'", "code 'offline'", "code 'unknown' + '잠시 후 다시 시도해 주세요.'"], answer: 3, explanation: 'FastAPI 기본 422 같은 다른 모양 대응.' },
    { id: 'pj-34-08', type: 'mcq', source: 'store.ts', question: 'store 의 update() 가 하는 세 가지는?', choices: ['새 객체로 state 교체 → localStorage 저장 → 구독자 알림', '검증, 저장, 로그', '정렬, 필터, 저장', 'fetch, 저장, 렌더'], answer: 0, explanation: '저장 로직이 update 한 곳에 모여 있어요.' },
    { id: 'pj-34-09', type: 'mcq', source: 'store.ts', question: '끼니를 추가·수정·삭제하면 score 를 null 로 만드는 이유는?', choices: ['메모리', '일정이 바뀌면 예전 악보가 더 이상 맞지 않아서', '서버 요청 방지', '버그'], answer: 1, explanation: '다시 "지휘 시작"을 눌러야 해요.' },
    { id: 'pj-34-10', type: 'mcq', source: 'store.ts', question: "localStorage 키 'maestro-plan-v1' 에 버전을 붙인 이유는?", choices: ['캐시', '규칙', '보안', '저장 모양이 바뀌면 -v2 로 갈아타 예전 데이터로 화면이 깨지는 걸 막으려고'], answer: 3, explanation: '저장된 JSON 을 검증 없이 믿기 때문에 더 중요해요.' },
    { id: 'pj-34-11', type: 'mcq', source: 'store.ts', question: 'useMaestro() 가 같은 state 객체를 계속 돌려줄 때 리렌더가 일어나지 않는 이유는?', choices: ['useSyncExternalStore 가 스냅샷 참조가 같으면 다시 그리지 않아서 — 그래서 update 는 항상 새 객체', 'key', 'StrictMode', 'memo'], answer: 0, explanation: '불변 업데이트가 구독 패턴의 전제예요.' },
    { id: 'pj-34-12', type: 'mcq', source: 'types.ts · format.ts', question: 'walkText(280) 의 결과는? (분속 70m)', choices: ["'도보 3분'", "'도보 4분'", "'도보 5분'", "'280m'"], answer: 1, explanation: '280 ÷ 70 = 4.' },
    { id: 'pj-34-13', type: 'mcq', source: 'types.ts · format.ts', question: "날짜 '2026-10-17' 을 new Date('2026-10-17') 로 만들지 않는 이유는?", choices: ['지원 안 됨', '느려서', 'UTC 자정으로 해석돼 서쪽 시간대 브라우저에서 하루 전으로 보일 수 있어서', '형식 오류'], answer: 2, explanation: 'new Date(y, m - 1, d) 는 현지 날짜로 만들어요. 월은 0부터.' },
    { id: 'pj-34-14', type: 'mcq', source: 'types.ts · format.ts', question: '매장 사진 대신 "예시 사진"을 쓰는 이유는?', choices: ['용량', '디자인', '저작권', '실제 사진은 유미 media 등급이라 비싸서 — 대신 예시임을 라벨로 밝힘'], answer: 3, explanation: '비용과 정직함 사이의 타협.' },
    { id: 'pj-34-15', type: 'mcq', source: 'types.ts · format.ts', question: '백엔드에 새 상황을 추가했을 때 프론트에서 손으로 고쳐야 하는 곳은?', choices: ['types.ts 의 SituationKey (+ LiveScreen 의 SPOKEN_HINTS)', 'store.ts', 'api.ts', '없음 — 자동'], answer: 0, explanation: '자동 동기화가 없어서요.' },
  ],
}

export default topic
