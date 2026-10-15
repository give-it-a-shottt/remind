import type { Topic } from '../../types'

const topic: Topic = {
  id: 'pj-03-frontend',
  track: 'project',
  group: '프론트',
  title: '03. 기능 코드 (프론트 · 해시 라우팅 · 상태)',
  order: 3,
  notionId: '3f2df951bf8081a0a023c2871cdb7ccb',
  addedAt: '2026-10-15',
  sections: [
    {
      title: '해시 라우팅',
      points: [
        '주소의 # 뒤는 서버로 보내지지 않고 브라우저 안에서만 바뀐다',
        '<a href="#/accio/cart"> 클릭 → 새로고침 없이 hashchange 이벤트 → useHashRoute() 가 듣고 App 을 다시 그림',
        'App: route.split("?") 로 path·search 분리 → /accio(옛 주소 포함)는 lazy(AccioApp), /maestro 는 lazy(MaestroApp), 그 외는 PortfolioApp',
        '검색어(q)·탭(tab)·열린 상황 시트(s)가 주소에 있어 뒤로가기·공유·새로고침이 그대로 동작',
        'lazy(() => import(...)) 덕분에 포트폴리오 방문자는 쇼핑몰·마에스트로 코드를 받지 않음. 받는 동안 Suspense fallback={null}',
        '#/home, #/list 같은 접두어 없는 옛 주소는 LEGACY_ROUTES 로 Accio 화면에 연결(공유된 링크 호환)',
      ],
    },
    {
      title: '상태 저장 위치',
      points: [
        '주소(hash): 현재 화면, 검색어, 탭, 열린 시트, 선택한 끼니 — 뒤로가기·공유 가능',
        'useState: Accio 장바구니 수량·필터·탭·찜 등 대부분 — 화면을 떠나면 초기화',
        'sessionStorage jsh-intro-seen: 인트로를 봤는지 — 탭을 닫을 때까지',
        'localStorage maestro-plan-v1: 마에스트로 일정 + 만든 악보 — 삭제할 때까지 (유미 재호출 방지)',
        '모듈 변수(api.ts serverState, store.ts state): 서버 깨움 상태, 마에스트로 전역 상태 — 새로고침 전까지',
      ],
    },
    {
      title: '포트폴리오 흐름',
      points: [
        'useState(() => path === "/" && shouldPlayIntro()) — 초기값 함수라 처음 한 번만 계산',
        '움직임 줄이기 설정이거나 sessionStorage 에 jsh-intro-seen 이 있으면 인트로 생략',
        '클릭·키·휠·터치 중 하나라도 하면(또는 Skip) onDone → markIntroSeen() + setIntroPlaying(false)',
        '어디서든 / 키 → 검색창 focus (입력 중이면 무시)',
        'SearchBox: ↓↑ 로 active 이동(aria-activedescendant), Esc 로 닫기, Enter 로 goTo(searchHref(q))',
        '결과 탭은 버튼이 아니라 링크(#/search?q=..&tab=back), 사례 행 전체가 링크(after:absolute after:inset-0)',
      ],
    },
    {
      title: 'Accio 흐름',
      points: [
        '검색 제출 → preventDefault 후 검색어와 상관없이 #/accio/ai (목업 답변)',
        'useMediaQuery("(min-width: 40rem)") 로 placeholder 긴 문구/짧은 문구',
        '캐러셀: trackRef.current.scrollBy({ left: ±폭, behavior: "smooth" }), 브랜드 순환은 (i + dir + n) % n',
        '목록 필터: Set 에 "가격:3~6만원" 같은 키를 넣고 빼기',
        '장바구니 금액·쿠폰 진행 막대는 상태에서 매번 계산(파생 값)',
        '운송장 복사: navigator.clipboard.writeText → 2초간 "복사했어요"',
        '서버 호출이 하나도 없는 클릭 가능한 목업 — 헤더 장바구니 숫자는 항상 CART_COUNT = 2',
      ],
    },
    {
      title: 'Maestro 흐름',
      points: [
        '#/maestro 진입 → useEffect(() => wakeServer(), []) 로 /health 미리 호출',
        'store.ts 가 처음 읽힐 때 localStorage 를 불러옴, 없으면 예시 일정 3끼',
        'saveMeal(): 시간순 정렬 + score: null (일정이 바뀌면 예전 악보 무효) → 저장 → 구독자 다시 그림',
        '지휘 시작 → POST /api/score → saveScore + goTo("#/maestro/score"), 실패면 ApiError.message 표시',
        '상황 타일 클릭 → 주소에 s=rain → VariationSheet 열림. 대안은 이미 악보 안에 있어 네트워크 대기 0',
        'PlaceScreen 은 findInScore() 로 악보 안에서 먼저 찾고, 주소로 바로 들어온 경우에만 GET /api/places/{id}',
        '실시간 문의: POST 후 pending 이면 waitForAnswer 최대 30번(롱폴링). 화면을 떠나면 alive ref·cancelled 플래그로 setState 안 함',
      ],
    },
  ],
  questions: [
    { id: 'pj-03-01', type: 'mcq', source: '해시 라우팅', question: '<a href="#/accio/cart"> 를 누르면 일어나는 일은?', choices: ['페이지 전체가 새로고침된다', '404 가 뜬다', '서버에 /accio/cart 를 요청한다', '새로고침 없이 hashchange 이벤트만 생긴다'], answer: 3, explanation: '# 뒤는 서버로 보내지지 않아요. useHashRoute 가 이벤트를 듣고 다시 그려요.' },
    { id: 'pj-03-02', type: 'mcq', source: '해시 라우팅', question: 'AccioApp·MaestroApp 을 lazy(() => import(...)) 로 불러오는 효과는?', choices: ['포트폴리오만 보는 방문자는 두 앱의 코드를 내려받지 않는다', '타입 검사 생략', '서버 렌더링', 'SEO 향상'], answer: 0, explanation: '들어갈 때 청크를 받고, 받는 동안 Suspense fallback 을 보여줘요.' },
    { id: 'pj-03-03', type: 'mcq', source: '해시 라우팅', question: '변주 시트를 연 상태에서 휴대폰 뒤로가기를 누르면 시트가 닫히는 이유는?', choices: ['popstate 를 막아서', '열린 시트(s)가 주소에 들어 있어 뒤로가기 = s 없는 주소로 이동', 'BottomSheet 가 history API 를 직접 조작해서', '브라우저 기본 동작'], answer: 1, explanation: '"상태를 주소에 담는" 설계라 뒤로가기·공유·새로고침이 자연스러워요.' },
    { id: 'pj-03-04', type: 'mcq', source: '해시 라우팅', question: '#/home, #/list 같은 접두어 없는 옛 주소를 처리하는 것은?', choices: ['포트폴리오 홈', '404 페이지', 'LEGACY_ROUTES 로 Accio 화면에 연결', 'Vercel 리다이렉트'], answer: 2, explanation: '예전에 공유된 링크가 깨지지 않게 호환표를 둬요.' },
    { id: 'pj-03-05', type: 'mcq', source: '상태 저장 위치', question: '"인트로를 봤는지"를 sessionStorage 에 저장했을 때의 수명은?', choices: ['화면을 떠날 때까지', '새로고침 전까지', '영원히', '탭을 닫을 때까지'], answer: 3, explanation: 'localStorage 와 달리 sessionStorage 는 탭이 닫히면 사라져요.' },
    { id: 'pj-03-06', type: 'mcq', source: '상태 저장 위치', question: 'Maestro 일정과 악보를 localStorage 에 저장하는 주된 이유는?', choices: ['새로고침해도 유지해 헤이유미를 다시 부르지 않으려고', '서버 대신 DB 로 쓰려고', 'SEO', '보안'], answer: 0, explanation: '하루 70요청 한도 때문에 클라이언트에서도 재호출을 막아요.' },
    { id: 'pj-03-07', type: 'mcq', source: '상태 저장 위치', question: 'Accio 장바구니 수량이 다른 화면에 갔다 오면 초기화되는 이유는?', choices: ['localStorage 에 저장해서', '컴포넌트 안 useState 라 화면을 떠나면 사라져서', '서버가 지워서', '버그'], answer: 1, explanation: '공유 저장소가 없는 목업이라 그래요. (복습 연습 과제 ④)' },
    { id: 'pj-03-08', type: 'mcq', source: '포트폴리오 흐름', question: 'useState(() => path === "/" && shouldPlayIntro()) 처럼 초기값을 함수로 넘긴 효과는?', choices: ['렌더 후 계산', '매 렌더마다 계산', '처음 한 번만 계산', '비동기로 계산'], answer: 2, explanation: '지연 초기화 — 다시 그릴 때는 함수를 부르지 않아요.' },
    { id: 'pj-03-09', type: 'mcq', source: '포트폴리오 흐름', question: '인트로를 건너뛰는 조건이 아닌 것은?', choices: ['움직임 줄이기 설정', 'sessionStorage 에 jsh-intro-seen 이 있음', '방문자가 클릭·키·휠·터치를 함', '화면 폭이 640px 미만'], answer: 3, explanation: '화면 폭은 조건이 아니에요. 나머지 셋은 인트로를 생략하거나 바로 끝내요.' },
    { id: 'pj-03-10', type: 'mcq', source: '포트폴리오 흐름', question: '검색 자동완성에서 ↓↑ 로 고른 항목을 스크린리더에 알리는 속성은?', choices: ['aria-label', 'aria-activedescendant', 'aria-hidden', 'tabindex'], answer: 1, explanation: '포커스는 입력창에 두고 "활성 항목"만 알려주는 combobox 패턴이에요.' },
    { id: 'pj-03-11', type: 'mcq', source: '포트폴리오 흐름', question: '검색 결과의 탭(전체/Front/Back/Design)을 버튼이 아니라 링크로 만든 이유는?', choices: ['성능', '스타일 때문에', '탭 선택이 주소(tab=)에 남아 뒤로가기·공유가 되게', '접근성 규칙상 버튼 금지'], answer: 2, explanation: '#/search?q=..&tab=back 처럼 상태가 주소에 담겨요.' },
    { id: 'pj-03-12', type: 'mcq', source: 'Accio 흐름', question: 'Accio 홈 AI 검색창에 무엇을 입력하고 제출하든 일어나는 일은?', choices: ['백엔드 LLM 호출', '오류 표시', '상품 목록 필터링', '#/accio/ai 로 가서 고정된 목업 답변(AI_CHAT)'], answer: 3, explanation: 'Accio 는 서버 없는 목업이에요.' },
    { id: 'pj-03-13', type: 'mcq', source: 'Accio 흐름', question: '브랜드 칩 이전/다음 순환에 쓴 (i + dir + n) % n 에서 + n 을 더하는 이유는?', choices: ['dir 이 -1 일 때 음수 인덱스가 되지 않게', '배열 복사', '애니메이션', '속도 향상'], answer: 0, explanation: 'JS 의 % 는 음수를 그대로 남겨서 n 을 더해 0 ~ n-1 로 맞춰요.' },
    { id: 'pj-03-14', type: 'mcq', source: 'Accio 흐름', question: '장바구니의 총 금액을 useState 에 따로 저장하지 않는 이유는?', choices: ['useState 는 숫자를 못 담아서', 'items·selected 에서 매번 계산하는 파생 값이라 — 따로 두면 어긋날 수 있음', '성능 때문에', '서버에서 받아서'], answer: 1, explanation: '파생 값은 저장하지 않고 계산하는 것이 정석이에요.' },
    { id: 'pj-03-15', type: 'mcq', source: 'Accio 흐름', question: '"CSS 로 못 하는 것"이라 useMediaQuery 훅으로 처리한 것은?', choices: ['요소 숨기기', '글자 크기 변경', '화면 폭에 따라 placeholder 문구 교체', '그리드 열 수'], answer: 2, explanation: 'placeholder 는 속성 값이라 미디어쿼리 CSS 로 바꿀 수 없어요.' },
    { id: 'pj-03-16', type: 'mcq', source: 'Maestro 흐름', question: '끼니를 수정해 저장하면 saveMeal() 이 score 를 null 로 만드는 이유는?', choices: ['서버 요청을 막으려고', '버그', '메모리 절약', '일정이 바뀌면 예전 악보는 더 이상 맞지 않아 무효로'], answer: 3, explanation: '다시 "지휘 시작"을 눌러야 새 악보가 만들어져요.' },
    { id: 'pj-03-17', type: 'mcq', source: 'Maestro 흐름', question: '상황 타일(비 와)을 눌렀을 때 네트워크 대기가 0 인 이유는?', choices: ['대안이 이미 악보(score.meals[i].variations.rain)에 들어 있어서', '서비스 워커', 'mock 이라서', '캐시 서버'], answer: 0, explanation: '"미리 계산해 두고 당일엔 꺼내 쓰기"가 Maestro 의 핵심이에요.' },
    { id: 'pj-03-18', type: 'mcq', source: 'Maestro 흐름', question: 'PlaceScreen 이 GET /api/places/{id} 를 부르는 경우는?', choices: ['항상', '주소로 바로 들어와 악보 안에 그 식당이 없을 때만', '사진을 볼 때', '예약할 때'], answer: 1, explanation: 'findInScore() 로 먼저 찾아 유미 재호출을 피해요.' },
    { id: 'pj-03-19', type: 'mcq', source: 'Maestro 흐름', question: '롱폴링 중 화면을 떠났을 때 alive ref 를 쓰는 이유는?', choices: ['재시도 횟수를 늘리려고', '요청을 빠르게 하려고', '언마운트 뒤 늦게 온 응답으로 setState 하지 않으려고', '서버를 깨우려고'], answer: 2, explanation: '비동기 + React 에서 자주 나오는 정석 패턴이에요.' },
  ],
}

export default topic
