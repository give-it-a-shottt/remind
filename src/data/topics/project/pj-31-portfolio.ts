import type { Topic } from '../../types'

const topic: Topic = {
  id: 'pj-31-portfolio',
  track: 'project',
  group: '프론트',
  title: '03-2. src/portfolio (검색형 포트폴리오)',
  order: 31,
  notionId: '3f2df951bf8081dd9ef5f8f2e4c754f5',
  addedAt: '2026-10-15',
  sections: [
    {
      title: '폴더 개요',
      points: [
        '"구글처럼 검색해서 문제 해결 사례를 찾는" 사이트 입구',
        'PortfolioApp → (첫 방문) 인트로 / PortfolioHeader / 본문: "/" SearchHome, "/search" SearchResults, "/case" DesignCaseDetail',
        '데이터 data.ts(CASES, KEYWORDS, matchesQuery, getSuggestions, splitMatch), 주소 routes.ts(searchHref, caseHref, readTab, goTo)',
        '이 노트는 10/7 기준 — 이후 PortfolioHero 삭제(IntroMotion 으로), EngineeringCaseDetail·caseDetails·rank.ts 추가, data.ts 는 실제 사례만 남김',
      ],
    },
    {
      title: 'PortfolioApp.tsx',
      notionIds: ['3f2df951bf8081aaae57edc6d0634296'],
      code: `function shouldPlayIntro() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  try { return sessionStorage.getItem(INTRO_SEEN_KEY) !== '1' }
  catch { return true }
}`,
      points: [
        '인트로 재생 여부 + 헤더 + (검색 홈 / 결과 / 상세) 중 하나 + 전역 "/" 단축키',
        '결과·상세 주소로 바로 들어온 경우 인트로를 보여주지 않음 (path === "/" 일 때만)',
        'useState(() => ...) 지연 초기화: sessionStorage 를 매번 읽지 않음',
        'useCallback 으로 finishIntro 고정 — 매 렌더 새 함수면 인트로의 useEffect([onDone]) 가 타이머를 계속 다시 걸게 됨',
        'try/catch: 사생활 보호 모드 등에서 저장소 접근이 예외를 던질 수 있어서 (못 쓰면 매번 보여줌)',
        '"/" 단축키: input·textarea·contenteditable 안이면 무시, 아니면 preventDefault 후 검색창 focus',
      ],
    },
    {
      title: 'PortfolioHero.tsx (삭제됨)',
      notionIds: ['3f2df951bf80812ba4dfe7f4056bdb6d'],
      code: `const SKIP_EVENTS = ['pointerdown', 'keydown', 'wheel', 'touchmove'] as const
useEffect(() => {
  const timer = window.setTimeout(onDone, INTRO_SECONDS * 1000)
  SKIP_EVENTS.forEach((type) => window.addEventListener(type, onDone, { passive: true }))
  return () => { window.clearTimeout(timer); SKIP_EVENTS.forEach(...removeEventListener) }
}, [onDone])`,
      points: [
        '10/14 98c1bcd 에서 삭제, IntroMotion 으로 교체 — 예전 인트로 기록',
        '언제 끝낼지만 담당: 3.5초 타이머 또는 아무 입력(포인터·키·휠·터치)',
        'passive: true — 스크롤을 막지 않겠다는 약속 → 브라우저가 스크롤을 더 부드럽게',
        'cleanup 을 안 하면 인트로가 사라진 뒤에도 타이머·키 입력이 onDone 을 계속 부름',
      ],
    },
    {
      title: 'PortfolioHeader · SearchHome',
      notionIds: ['3f2df951bf80812090e4d969a71084ec', '3f2df951bf8081ab825ff0b681f2af8b'],
      points: [
        '헤더: 왼쪽 로고(홈 링크, LOGO_LAYOUT_ID), 가운데 검색창(결과 화면에서만), 오른쪽 Front/Back/Design',
        'key={search.query} 트릭: 검색어가 바뀌면 SearchBox 를 새로 만들어 내부 useState(defaultValue) 를 초기화',
        '탭 링크는 aria-current="page" 로 현재 위치를 알림',
        'SearchHome: 큰 검색창(size="lg") + 추천 키워드 칩(<a href={searchHref(label)}>)',
        '칩 앞 점 색(Back 파랑/Front 회색/Design 주황) + sr-only 텍스트 — 색만으로 구분하지 않게',
        '자동완성 목록이 아래 칩 위로 펼쳐지도록 relative z-10',
      ],
    },
    {
      title: 'SearchBox.tsx',
      notionIds: ['3f2df951bf8081068539dbc332d3503f'],
      code: `const [value, setValue] = useState(defaultValue)
const [focused, setFocused] = useState(false)
const [active, setActive] = useState(-1)
const suggestions = getSuggestions(value)   // 상태 아님
const open = focused && suggestions.length > 0`,
      points: [
        '크기 lg(홈 64px) / md(결과 헤더 48px)',
        'ArrowDown: Math.min(i + 1, 끝), ArrowUp: Math.max(i - 1, -1), Escape: blur',
        '제출: suggestions[active]?.text ?? value — 고른 항목이 있으면 그걸로',
        '제안 항목은 onClick 이 아니라 onMouseDown + preventDefault → 클릭 순간 blur 로 목록이 먼저 사라지는 문제 방지',
        '검색 후 blur() 로 목록을 닫고 모바일 키보드를 내림',
        'WAI-ARIA 콤보박스: role=combobox, aria-expanded, aria-controls, aria-activedescendant, listbox/option',
        'suggestions 는 value 에서 계산되는 파생 값이라 useState 로 두지 않음',
      ],
    },
    {
      title: 'SearchResults · DesignCaseDetail · CaseMeta',
      notionIds: ['3f2df951bf808179a456ce7cd1f3ed7f', '3f2df951bf8081858a4ec2fd9fe7e641', '3f2df951bf8081ccac44c3a6dff2f944'],
      points: [
        'matched = CASES.filter(matchesQuery) → 탭별 개수, results 는 탭으로 한 번 더 거름',
        '제목 링크에 after:absolute after:inset-0 → 행 전체가 클릭 영역',
        '보이지 않는 <h1 className="sr-only"> 로 페이지 제목을 스크린리더에',
        '탭은 <a href> 링크 — 주소로 공유, 새 탭 열기(가운데 클릭) 가능',
        'DesignCaseDetail: slug 로 사례를 찾고 없으면 "찾을 수 없어요" + 목록 링크, DESIGN_DEMOS[slug] 의 데모를 휴대폰 틀 안에',
        '변수에 담은 컴포넌트(Demo)는 대문자 이름이어야 JSX 로 쓸 수 있음',
        'CaseMeta: [배지] 코드 · 날짜 한 줄, 결과·상세가 같이 씀. 영문에 lang="en" → 영어 발음으로 읽힘',
      ],
    },
    {
      title: 'data.ts · routes.ts',
      notionIds: ['3f2df951bf80816488c4e5a14d55a1df', '3f2df951bf808104ae90cd418d26b164'],
      code: `export function matchesQuery(item, query) {
  const words = query.trim().toLowerCase().split(/\\s+/).filter(Boolean)
  const text = haystack(item)
  return words.every((word) => text.includes(word))
}`,
      points: [
        '서버 없이 프론트에서 검색: haystack = 제목 + 설명 + 태그 + 숨은 keywords 를 소문자로 합친 문자열',
        'matchesQuery: 공백으로 나눈 모든 단어가 들어 있으면 일치 (AND)',
        'getSuggestions: 빈 입력이면 추천 키워드, 입력이 있으면 키워드 + 사례 제목 부분 일치 (최대 6개)',
        "splitMatch('커넥션 풀', '풀') → { before: '커넥션 ', match: '풀', after: '' } — 일치 부분만 굵게",
        'searchHref: 빈 검색어와 "전체" 탭은 주소에서 뺌, URLSearchParams 가 한글·공백 자동 인코딩',
        'readTab: 주소의 이상한 값은 "all" 로 방어 / goTo: location.hash 변경 → hashchange → 다시 그림',
        '10/7 당시 시안 예시 사례·지표가 섞여 있었고, 10/15 f1810ec 에서 직접 하지 않은 사례를 삭제',
      ],
    },
    {
      title: 'demos (StayLoginDemo)',
      notionIds: ['3f2df951bf8081e98574e54d587bba8a'],
      code: `const notify = (message: string) => {
  window.clearTimeout(timer.current)
  setNotice(message)
  timer.current = window.setTimeout(() => setNotice(''), NOTICE_MS)
}`,
      points: [
        'DESIGN_DEMOS: Design 사례 slug → 실제로 동작하는 최종안 화면 등록표',
        '숙박 앱 로그인 데모: 실제 인증 없음, 입력·비밀번호 보기·아이디 저장·토스트',
        '연달아 누르면 이전 타이머 취소 후 새로, 언마운트 시 useEffect cleanup 으로 타이머 정리',
        '타이머 id 는 useRef — 화면에 보이는 값이 아니라 바뀌어도 다시 그릴 필요 없음',
        '토스트 role="status" 로 스크린리더가 읽음, 비밀번호 보기 버튼 aria-pressed',
      ],
    },
  ],
  questions: [
    { id: 'pj-31-01', type: 'mcq', source: '폴더 개요', question: '10/7 이후 portfolio 폴더의 변화로 옳은 것은?', choices: ['SearchBox 삭제', 'PortfolioHero 삭제 → IntroMotion, Front·Back 상세(EngineeringCaseDetail) 추가', '라우터 라이브러리 도입', '서버 검색 도입'], answer: 1, explanation: '06. 업데이트 기록에 정리돼 있어요.' },
    { id: 'pj-31-02', type: 'mcq', source: 'PortfolioApp.tsx', question: '#/search?q=캐시 주소로 바로 들어오면 인트로는?', choices: ['재생된다', '재생되지 않는다 — path 가 "/" 일 때만', '짧게 재생', '랜덤'], answer: 1, explanation: '공유 링크로 들어온 사람이 인트로를 기다리지 않게.' },
    { id: 'pj-31-03', type: 'mcq', source: 'PortfolioApp.tsx', question: 'finishIntro 를 useCallback 으로 감싼 이유는?', choices: ['성능 측정', '매 렌더 새 함수면 인트로 useEffect([onDone]) 가 타이머를 계속 다시 걸게 돼서', '문법상 필수', '메모리 해제'], answer: 1, explanation: '의존성 배열의 함수는 참조가 같아야 effect 가 다시 안 돌아요.' },
    { id: 'pj-31-04', type: 'mcq', source: 'PortfolioApp.tsx', question: 'sessionStorage 접근을 try/catch 로 감싼 이유는?', choices: ['습관', '사생활 보호 모드 등에서 저장소 접근이 예외를 던질 수 있어서', 'SSR', 'JSON 파싱'], answer: 1, explanation: '실패하면 인트로를 매번 보여주는 쪽으로 안전하게.' },
    { id: 'pj-31-05', type: 'mcq', source: 'PortfolioApp.tsx', question: '"/" 단축키가 검색창 입력 중에는 동작하지 않게 하는 방법은?', choices: ['e.stopPropagation', "target.closest('input, textarea, [contenteditable=\"true\"]') 이면 무시", 'tabindex', 'blur'], answer: 1, explanation: '안 그러면 "/" 글자를 입력할 수 없어요.' },
    { id: 'pj-31-06', type: 'mcq', source: 'PortfolioHero.tsx (삭제됨)', question: '이벤트 리스너에 { passive: true } 를 준 효과는?', choices: ['이벤트를 한 번만', 'preventDefault 를 안 하겠다는 약속 → 브라우저가 스크롤을 더 부드럽게 처리', '캡처 단계', '비동기 처리'], answer: 1, explanation: 'wheel·touchmove 리스너에 특히 중요해요.' },
    { id: 'pj-31-07', type: 'mcq', source: 'PortfolioHero.tsx (삭제됨)', question: '인트로 useEffect 의 cleanup 을 빼먹으면?', choices: ['문제없음', '인트로가 사라진 뒤에도 타이머·키 입력이 onDone 을 계속 부름', '인트로가 안 뜸', '빌드 실패'], answer: 1, explanation: '타이머는 clearTimeout, 리스너는 removeEventListener 로 정리.' },
    { id: 'pj-31-08', type: 'mcq', source: 'PortfolioHeader · SearchHome', question: '<SearchBox key={search.query} .../> 의 key 트릭 효과는?', choices: ['렌더 성능 향상', '검색어가 바뀌면 컴포넌트를 새로 만들어 내부 useState(defaultValue) 가 새 검색어로 초기화', '리스트 정렬', 'CSS 적용'], answer: 1, explanation: 'key 가 바뀌면 React 는 이전 인스턴스를 버리고 새로 마운트해요.' },
    { id: 'pj-31-09', type: 'mcq', source: 'PortfolioHeader · SearchHome', question: '키워드 칩 앞 점 색 외에 sr-only "(Back)" 텍스트를 둔 이유는?', choices: ['SEO', '색만으로 정보를 구분하지 않게 — 스크린리더 사용자도 분류를 알 수 있게', '디버깅', '번역'], answer: 1, explanation: '접근성 원칙: 색에만 의존하지 않기.' },
    { id: 'pj-31-10', type: 'mcq', source: 'PortfolioHeader · SearchHome', question: '헤더 탭 링크의 aria-current="page" 역할은?', choices: ['스타일', '현재 위치한 탭을 스크린리더에 알림', '링크 비활성화', '새 창'], answer: 1, explanation: '시각적 강조와 같은 정보를 보조기기에도.' },
    { id: 'pj-31-11', type: 'mcq', source: 'SearchBox.tsx', question: '제안 항목에 onClick 대신 onMouseDown + preventDefault 를 쓰는 이유는?', choices: ['모바일 대응', '클릭 순간 input 이 blur 되어 목록이 먼저 사라지는 문제를 막으려고', '더블클릭 방지', '속도'], answer: 1, explanation: 'mousedown → blur → click 순서라 click 시점엔 목록이 이미 닫혀요.' },
    { id: 'pj-31-12', type: 'mcq', source: 'SearchBox.tsx', question: '↑ 키를 계속 누르면 active 는 어디서 멈추나?', choices: ['0', '-1 (선택 없음)', '마지막 항목', '순환'], answer: 1, explanation: 'Math.max(i - 1, -1).' },
    { id: 'pj-31-13', type: 'mcq', source: 'SearchBox.tsx', question: '항목을 고르지 않고 Enter 를 누르면 검색어는?', choices: ['첫 번째 제안', '입력한 value 그대로', '빈 문자열', '마지막 검색어'], answer: 1, explanation: 'suggestions[-1] 은 undefined → ?? value.' },
    { id: 'pj-31-14', type: 'mcq', source: 'SearchBox.tsx', question: '검색 후 input.blur() 를 하는 이유는?', choices: ['접근성 위반 방지', '자동완성 목록을 닫고 모바일 키보드를 내리려고', '포커스 이동 금지', '값 초기화'], answer: 1, explanation: '결과 화면을 바로 볼 수 있게.' },
    { id: 'pj-31-15', type: 'mcq', source: 'SearchResults · DesignCaseDetail · CaseMeta', question: '제목 링크에 after:absolute after:inset-0 을 준 효과는?', choices: ['밑줄', '행 전체가 클릭 영역이 됨', '그림자', '애니메이션'], answer: 1, explanation: '가상 요소가 부모(relative) 전체를 덮어요.' },
    { id: 'pj-31-16', type: 'mcq', source: 'SearchResults · DesignCaseDetail · CaseMeta', question: 'const Demo = DESIGN_DEMOS[slug] 처럼 변수에 담은 컴포넌트를 JSX 로 쓰려면?', choices: ['소문자 이름', '대문자로 시작하는 이름 (<Demo />)', 'React.create 필수', '불가능'], answer: 1, explanation: '소문자면 HTML 태그로 해석돼요.' },
    { id: 'pj-31-17', type: 'mcq', source: 'SearchResults · DesignCaseDetail · CaseMeta', question: 'CaseMeta 의 영문 텍스트에 lang="en" 을 붙인 이유는?', choices: ['폰트', '스크린리더가 영어 발음으로 읽게', 'SEO', '번역 방지'], answer: 1, explanation: '한국어 문서 안 영어를 한국어 발음으로 읽는 걸 막아요.' },
    { id: 'pj-31-18', type: 'mcq', source: 'data.ts · routes.ts', question: 'matchesQuery("캐시 redis") 가 true 가 되려면?', choices: ['둘 중 하나만 포함', '"캐시"와 "redis" 둘 다 포함 (AND)', '정확히 일치', '태그에만'], answer: 1, explanation: 'words.every(...) 로 모든 단어를 확인해요.' },
    { id: 'pj-31-19', type: 'mcq', source: 'data.ts · routes.ts', question: 'searchHref("", "all") 의 결과는?', choices: ['"#/search?q=&tab=all"', '"#/search"', '"#/"', '"#/search?tab=all"'], answer: 1, explanation: '빈 검색어와 전체 탭은 주소에서 빼요.' },
    { id: 'pj-31-20', type: 'mcq', source: 'data.ts · routes.ts', question: '주소에 tab=hello 처럼 이상한 값이 오면 readTab 은?', choices: ['에러', '"all" 로 방어', '"hello" 그대로', '빈 화면'], answer: 1, explanation: '사용자가 고친 주소도 안전하게.' },
    { id: 'pj-31-21', type: 'mcq', source: 'data.ts · routes.ts', question: 'goTo(href) 가 화면을 바꾸는 흐름은?', choices: ['history.pushState', 'location.hash 변경 → hashchange → useHashRoute → 다시 그림', '페이지 새로고침', 'fetch'], answer: 1, explanation: '라우터 라이브러리 없이 브라우저 이벤트로.' },
    { id: 'pj-31-22', type: 'mcq', source: 'demos (StayLoginDemo)', question: 'notify() 가 setTimeout 전에 clearTimeout 을 먼저 하는 이유는?', choices: ['문법', '연달아 누르면 이전 타이머를 취소해 새 토스트가 일찍 사라지지 않게', '메모리', '애니메이션'], answer: 1, explanation: '새 메시지 기준으로 2.4초를 다시 세요.' },
    { id: 'pj-31-23', type: 'mcq', source: 'demos (StayLoginDemo)', question: '타이머 id 를 useState 가 아니라 useRef 에 두는 이유는?', choices: ['useState 는 숫자 불가', '화면에 안 보이는 값이라 바뀌어도 다시 그릴 필요가 없어서', '비동기라서', '타입 때문'], answer: 1, explanation: 'ref 는 값이 바뀌어도 렌더를 일으키지 않아요.' },
  ],
}

export default topic
