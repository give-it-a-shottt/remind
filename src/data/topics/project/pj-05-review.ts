import type { Topic } from '../../types'

const topic: Topic = {
  id: 'pj-05-review',
  track: 'project',
  group: '복습',
  title: '05. 복습 (핵심 요약 · 연습 과제 · 면접)',
  order: 5,
  notionId: '3f2df951bf8081d98d96d4f088fe56b6',
  addedAt: '2026-10-15',
  sections: [
    {
      title: '전체 핵심 요약',
      points: [
        '라우팅: useHashRoute(useSyncExternalStore + hashchange), 프로젝트는 lazy() 로 코드 분할',
        '상태: 대부분 useState, 파생 값은 계산. Maestro 는 모듈 변수 + useSyncExternalStore 미니 스토어 + localStorage',
        '백엔드: router(검증) → service(규칙) → YumiClient 인터페이스 → mock / real. YUMI_MODE 로 전환, 테스트는 dependency_overrides',
        '알고리즘: 끼니마다 유미 검색 1번(100곳) → 상황 6개 규칙 → 신뢰도·최신성 정렬 → 3곳씩',
        '안전장치: 키는 백엔드·헤더에만, 사장님 알림 기능은 real 에서도 흉내(simulated), 10분 캐시 + 동시 4개 + 429 처리',
        '현실 점검: Accio 는 서버 없는 목업, Accio 백엔드는 헬스체크만, LLM 호출 코드 없음, CI 없음',
      ],
    },
    {
      title: '연습 과제',
      points: [
        '① 중복된 formatWon 을 utils/format 하나로 import (DRY, noUnusedLocals)',
        '② Suspense fallback={null} 대신 role="status" 로딩 컴포넌트 — Network Slow 3G 로 확인',
        '③ 목록 필터·정렬 실제 적용: useState 가 아니라 파생 값으로, toSorted 로 불변 정렬',
        '④ Maestro store.ts 를 본떠 accio cartStore.ts (모듈 변수 + listeners + useSyncExternalStore + localStorage)',
        '⑤ 새 상황 "아이와 함께": 테스트 EXPECTED 먼저(TDD) → situations.py → 프론트 types.ts·SPOKEN_HINTS',
        '보너스: push/PR 때 build + lint + pytest 를 돌리는 .github/workflows/ci.yml',
      ],
    },
    {
      title: '면접 질문',
      points: [
        '해시 라우팅: 화면이 적고 중첩 라우트가 필요 없어 13줄 훅으로 충분. 단점은 SEO·URL',
        '70요청 한도: 알고리즘(끼니당 1번) + 서버(10분 캐시·동시 4개·429 즉시 오류) + 클라이언트(localStorage 악보)',
        'mock/real: Protocol 인터페이스 + Depends 주입 + YUMI_MODE, 테스트는 dependency_overrides 와 httpx 가짜 transport',
        '콜드 스타트: 진입 즉시 /health, 2.5초 넘으면 안내 띠, 상태 unknown/waking/awake',
        'CORS: CORSMiddleware + CORS_ORIGINS 환경변수, JSON 요청은 프리플라이트',
        'API 키: 백엔드 중계, sync: false, URL 쿼리 대신 Authorization 헤더 (로그에 안 남게)',
        '상태 라이브러리 미사용: 전역 상태가 하나뿐이라 80줄 스토어로 충분',
        '롱폴링: 드문 이벤트 + 유미가 wait 파라미터 제공 → 웹소켓 유지 부담 없이',
        '아쉬운 점: Accio 목업, CI 없음, 타입 수동 동기화(OpenAPI 생성 고려), 프론트 테스트 없음',
      ],
    },
  ],
  questions: [
    { id: 'pj-05-01', type: 'mcq', source: '전체 핵심 요약', question: 'useHashRoute 가 hashchange 를 구독할 때 쓰는 React 훅은?', choices: ['useEffect + useState', 'useSyncExternalStore', 'useReducer', 'useContext'], answer: 1, explanation: '외부 저장소(브라우저 주소)를 안전하게 구독하는 공식 훅이에요.' },
    { id: 'pj-05-02', type: 'mcq', source: '전체 핵심 요약', question: '백엔드 계층 순서로 옳은 것은?', choices: ['service → router → client', 'router(검증) → service(규칙) → YumiClient → mock/real', 'client → router → service', 'router → DB → service'], answer: 1, explanation: '라우터는 검증·주입만, 규칙은 service, 외부 호출은 인터페이스 뒤로 숨겼어요.' },
    { id: 'pj-05-03', type: 'mcq', source: '전체 핵심 요약', question: 'real 모드에서 실시간 문의·예약을 보내면?', choices: ['사장님 앱으로 실제 푸시가 간다', 'HTTP 를 보내지 않고 흉낸 답(simulated: true)을 준다', '에러', 'mock 으로 자동 전환'], answer: 1, explanation: '실제 사장님께 알림이 가지 않도록 real 에서도 흉내만 내요.' },
    { id: 'pj-05-04', type: 'mcq', source: '전체 핵심 요약', question: '"현실 점검"에 해당하지 않는 것은?', choices: ['Accio 는 서버 없는 목업', 'Accio 백엔드는 헬스체크만', '레포에 LLM 호출 코드가 없음', 'push 때마다 CI 가 테스트를 돌림'], answer: 3, explanation: 'CI 는 없어요. 그래서 타입 에러를 Vercel 배포 실패로 알게 돼요.' },
    { id: 'pj-05-05', type: 'mcq', source: '연습 과제', question: '과제 ① 에서 npm run build 가 "좋은 검사"가 되는 이유는?', choices: ['빌드가 빨라서', 'noUnusedLocals 때문에 안 쓰는 함수·import 가 남으면 실패해서', '테스트를 같이 돌려서', '린트를 해서'], answer: 1, explanation: '중복 함수를 지우고 import 로 바꾸다 남은 찌꺼기를 잡아줘요.' },
    { id: 'pj-05-06', type: 'mcq', source: '연습 과제', question: '과제 ③ 목록 필터 결과는 어디에 두는 게 맞나?', choices: ['별도 useState', '렌더 때 계산하는 파생 값', 'localStorage', 'useRef'], answer: 1, explanation: 'CartPage 의 selectedItems 처럼 원본 + 필터 조건에서 매번 계산해요.' },
    { id: 'pj-05-07', type: 'mcq', source: '연습 과제', question: '과제 ③ 에서 sort 대신 toSorted 를 쓰는 이유는?', choices: ['더 빨라서', '원본 배열을 바꾸지 않는 불변 정렬이라', '숫자만 정렬해서', '안정 정렬이라'], answer: 1, explanation: 'sort 는 원본(mock 데이터)을 바꿔 버려요.' },
    { id: 'pj-05-08', type: 'mcq', source: '연습 과제', question: '과제 ⑤ 새 상황 추가에서 가장 먼저 하는 일은?', choices: ['프론트 타일 추가', '테스트 EXPECTED 에 조건을 쓰고 실패 확인 (TDD)', 'situations.py 수정', '배포'], answer: 1, explanation: '실패하는 테스트 → 구현 → 통과 순서.' },
    { id: 'pj-05-09', type: 'mcq', source: '연습 과제', question: '과제 ④ 장바구니 공유 스토어의 구성 요소가 아닌 것은?', choices: ['모듈 변수', 'listeners(구독자)', 'useSyncExternalStore', 'Redux Provider'], answer: 3, explanation: 'Maestro store.ts 처럼 라이브러리 없이 만들어요.' },
    { id: 'pj-05-10', type: 'mcq', source: '면접 질문', question: '외부 API 하루 70요청 한도를 줄인 "세 겹"이 아닌 것은?', choices: ['끼니당 검색 1번 알고리즘', '서버 10분 캐시·동시 4개 제한', '클라이언트 localStorage 악보 저장', '유료 플랜으로 업그레이드'], answer: 3, explanation: '알고리즘·서버·클라이언트 세 겹으로 줄였어요. 공개 배포는 아예 mock.' },
    { id: 'pj-05-11', type: 'mcq', source: '면접 질문', question: 'API 키를 URL 쿼리가 아니라 Authorization 헤더로 보내는 이유는?', choices: ['더 빨라서', 'URL 은 서버·프록시 로그에 남기 쉬워서', 'CORS 때문에', '표준이 그것뿐이라서'], answer: 1, explanation: '쿼리스트링은 접근 로그에 그대로 찍혀요.' },
    { id: 'pj-05-12', type: 'mcq', source: '면접 질문', question: '테스트에서 진짜 유미 대신 mock 을 끼워 넣는 FastAPI 기능은?', choices: ['middleware', 'app.dependency_overrides', 'lifespan', 'BackgroundTasks'], answer: 1, explanation: 'Depends 로 주입받기 때문에 테스트에서 의존성만 바꿔치기할 수 있어요.' },
    { id: 'pj-05-13', type: 'mcq', source: '면접 질문', question: '서버 깨움 상태를 unknown / waking / awake 로 나눈 이유는?', choices: ['디버깅용', '한 번 깨어난 뒤의 느린 요청에는 "깨우는 중" 안내를 띄우지 않으려고', '로그용', '서버가 요구해서'], answer: 1, explanation: '첫 응답이 2.5초 넘을 때만 안내해요.' },
    { id: 'pj-05-14', type: 'mcq', source: '면접 질문', question: '실시간 문의 답을 웹소켓이 아니라 롱폴링으로 받는 이유는?', choices: ['웹소켓이 느려서', '드문 이벤트이고 유미가 wait 롱폴링을 제공해 무료 서버에서 연결 유지 부담이 없어서', '브라우저가 웹소켓 미지원', 'HTTPS 때문'], answer: 1, explanation: '서버가 10초씩 붙잡고 프론트가 pending 이면 최대 30번 다시 물어요.' },
    { id: 'pj-05-15', type: 'mcq', source: '면접 질문', question: '상태 관리 라이브러리를 쓰지 않은 이유로 맞는 것은?', choices: ['라이브러리가 유료라서', '전역 공유 상태가 "일정 + 악보" 하나뿐이라 작은 스토어로 충분해서', 'React 19 에서 금지돼서', '번들러가 지원 안 해서'], answer: 1, explanation: '복잡해지면 Zustand 등을 고려한다고 답해요.' },
    { id: 'pj-05-16', type: 'mcq', source: '면접 질문', question: '백엔드 스키마와 프론트 types.ts 를 손으로 맞추는 문제의 개선안은?', choices: ['주석 추가', 'OpenAPI 스펙에서 타입 자동 생성', 'any 사용', '백엔드를 JS 로'], answer: 1, explanation: 'FastAPI 가 OpenAPI 를 자동으로 만들어 주니 거기서 TS 타입을 생성할 수 있어요.' },
  ],
}

export default topic
