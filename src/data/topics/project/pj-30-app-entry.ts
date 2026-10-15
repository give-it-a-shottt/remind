import type { Topic } from '../../types'

const topic: Topic = {
  id: 'pj-30-app-entry',
  track: 'project',
  group: '프론트',
  title: '03-1. src 앱 입구 (main.tsx · App.tsx · useHashRoute)',
  order: 30,
  notionId: '3f2df951bf80813a89cee0cbfcae20e1',
  addedAt: '2026-10-15',
  sections: [
    {
      title: 'src 폴더 구성',
      points: [
        'src/ 최상단: main.tsx(시작점), App.tsx(최상위 라우터), index.css',
        'shared/ 에는 "두 프로젝트 이상이 같이 쓰는 것"만 (ee7d672 리팩터링)',
        '새 프로젝트는 projects/이름/ 을 만들고 App.tsx 에 lazy 한 줄 + 라우트 한 줄만 더하면 됨',
      ],
    },
    {
      title: 'main.tsx',
      notionIds: ['3f2df951bf80812b8357d5d05e55eea3'],
      code: `createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)`,
      points: [
        'index.html 의 div#root 를 찾아 <App/> 을 그림. index.css 를 여기서 한 번 import',
        '! (non-null 단언): "root 는 무조건 있다"고 TS 에게 알림',
        'StrictMode: 개발 모드에서만 effect 를 두 번 실행해 cleanup 누락을 찾아줌 — 배포 빌드엔 영향 없음',
        '개발 중 wakeServer 가 두 번 불리는 것처럼 보이면 StrictMode 때문. waking 변수로 중복 호출을 막아둠',
      ],
    },
    {
      title: 'App.tsx',
      notionIds: ['3f2df951bf8081d38900d71808233ee4'],
      code: `function subPath(path: string, base: string) {
  if (path === base) return "/";
  return path.startsWith(\`\${base}/\`) ? path.slice(base.length) : null;
}

const accioPath = subPath(path, ACCIO_BASE) ?? LEGACY_ROUTES[path];`,
      points: [
        'AccioApp·MaestroApp 은 lazy(() => import(...)) 로 들어갈 때 코드를 받음 (코드 분할)',
        '해시 라우팅은 페이지를 바꿔도 스크롤이 유지되므로 useEffect(() => scrollTo(0, 0), [route])',
        'subPath 는 "/accio" 자체도 처리하고 "/accioX" 처럼 접두어만 같은 주소는 걸러냄 (`${base}/` 로 검사)',
        '?? : 왼쪽이 null/undefined 일 때만 오른쪽 → 새 주소가 아니면 옛 주소표(LEGACY_ROUTES)',
        '포트폴리오는 lazy 가 아님 — 입구라서 처음부터 번들에 포함',
        'Suspense fallback={null} 이라 프로젝트 코드를 받는 동안 빈 화면 → 로딩 표시는 fallback 을 바꾸면 됨',
      ],
    },
    {
      title: 'shared/hooks/useHashRoute.ts',
      notionIds: ['3f2df951bf8081ea860dce63befb24db'],
      code: `export default function useHashRoute() {
  return useSyncExternalStore(
    (onChange) => {
      window.addEventListener('hashchange', onChange)
      return () => window.removeEventListener('hashchange', onChange)
    },
    () => window.location.hash.replace(/^#/, '') || '/',
    () => '/',
  )
}`,
      points: [
        '라우터 라이브러리 역할을 13줄로: ① 구독 함수 ② 지금 값 읽기("#/login" → "/login") ③ 서버 렌더링용 값',
        'useSyncExternalStore = React 바깥 값(브라우저 주소, 미디어쿼리, 전역 스토어)을 안전하게 구독하는 공식 훅',
        '이 프로젝트에서 4번 사용: useHashRoute, useMediaQuery, Maestro useMaestro, 서버 깨움 상태',
        'useState + useEffect 로도 가능하지만 첫 렌더와 구독 사이 변화를 놓칠 수 있고(tearing) 코드도 길어짐',
      ],
    },
  ],
  questions: [
    { id: 'pj-30-01', type: 'mcq', source: 'src 폴더 구성', question: 'shared/ 폴더에 두는 기준은?', choices: ['자주 바뀌는 코드', '두 프로젝트 이상이 같이 쓰는 것만', '모든 컴포넌트', '타입만'], answer: 1, explanation: '한 프로젝트만 쓰면 projects/이름/ 안에 둬요.' },
    { id: 'pj-30-02', type: 'mcq', source: 'src 폴더 구성', question: '새 프로젝트를 추가할 때 App.tsx 에서 할 일은?', choices: ['vite 설정 변경', '라우터 라이브러리 설치', 'lazy 한 줄 + 라우트 한 줄', 'index.html 수정'], answer: 2, explanation: '해시 라우터 구조라 이것만으로 연결돼요.' },
    { id: 'pj-30-03', type: 'mcq', source: 'main.tsx', question: "document.getElementById('root')! 의 ! 는?", choices: ['필수 props', '에러 무시', '부정 연산자', 'non-null 단언 — null 이 아니라고 TS 에 알림'], answer: 3, explanation: 'getElementById 는 HTMLElement | null 을 돌려줘요.' },
    { id: 'pj-30-04', type: 'mcq', source: 'main.tsx', question: 'StrictMode 가 개발 모드에서 하는 일은?', choices: ['effect 를 두 번 실행해 cleanup 누락을 드러냄', '배포 최적화', '에러를 숨김', '타입 검사 강화'], answer: 0, explanation: '배포 빌드에는 영향이 없어요.' },
    { id: 'pj-30-05', type: 'mcq', source: 'main.tsx', question: '개발 중 wakeServer 가 두 번 불리는 것처럼 보이는 이유는?', choices: ['버그', 'StrictMode 가 effect 를 두 번 실행해서 (waking 변수로 중복 방지)', '라우터 문제', '서버 문제'], answer: 1, explanation: 'effect 는 여러 번 실행돼도 안전하게 짜야 해요.' },
    { id: 'pj-30-06', type: 'mcq', source: 'App.tsx', question: 'App 에서 route 가 바뀔 때마다 window.scrollTo(0, 0) 을 하는 이유는?', choices: ['성능', '애니메이션', '해시 라우팅은 화면이 바뀌어도 스크롤 위치가 유지돼서', 'SEO'], answer: 2, explanation: '실제 페이지 이동이 아니라 같은 문서 안 변화예요.' },
    { id: 'pj-30-07', type: 'mcq', source: 'App.tsx', question: 'subPath("/accioX", "/accio") 의 결과는?', choices: ['"/"', '"/accioX"', '"/X"', 'null'], answer: 3, explanation: '`${base}/` 로 시작하는지 봐서 접두어만 같은 주소를 걸러요.' },
    { id: 'pj-30-08', type: 'mcq', source: 'App.tsx', question: 'subPath(...) ?? LEGACY_ROUTES[path] 에서 ?? 의 동작은?', choices: ['왼쪽이 null/undefined 일 때만 오른쪽', '둘 다 평가 후 합침', '오른쪽 우선', '왼쪽이 falsy 면 오른쪽'], answer: 0, explanation: '|| 와 달리 "" 나 0 은 그대로 둬요.' },
    { id: 'pj-30-09', type: 'mcq', source: 'App.tsx', question: 'PortfolioApp 을 lazy 로 불러오지 않는 이유는?', choices: ['너무 커서', '사이트 입구라 처음부터 필요해서 번들에 포함', 'lazy 미지원', '실수'], answer: 1, explanation: '처음 보이는 화면을 늦게 받으면 오히려 느려져요.' },
    { id: 'pj-30-10', type: 'mcq', source: 'App.tsx', question: 'Accio 에서 Maestro 로 이동할 때 잠깐 빈 화면이 보이는 원인은?', choices: ['서버 지연', 'StrictMode', 'CSS', 'Suspense fallback={null} — 코드를 받는 동안 아무것도 안 그림'], answer: 3, explanation: 'fallback 에 로딩 컴포넌트를 넣으면 해결돼요 (복습 과제 ②).' },
    { id: 'pj-30-11', type: 'mcq', source: 'shared/hooks/useHashRoute.ts', question: 'useSyncExternalStore 의 세 인자 순서는?', choices: ['구독 함수, 현재 값 읽기, 서버 렌더링용 값', '초기값, 리듀서, 디스패치', '이벤트, 핸들러, 정리', '값, 구독, 서버값'], answer: 0, explanation: '구독 함수는 해제 함수를 돌려줘야 해요.' },
    { id: 'pj-30-12', type: 'mcq', source: 'shared/hooks/useHashRoute.ts', question: '주소가 "https://site/#/login" 일 때 useHashRoute() 의 값은?', choices: ['"#/login"', '"/login"', '"login"', '"/"'], answer: 1, explanation: "replace(/^#/, '') 로 # 만 떼요. 해시가 없으면 '/'." },
    { id: 'pj-30-13', type: 'mcq', source: 'shared/hooks/useHashRoute.ts', question: 'useState + useEffect 대신 useSyncExternalStore 를 쓰는 이점은?', choices: ['성능 저하', '코드가 길어짐', '첫 렌더와 구독 사이 변화를 놓치는 tearing 없이 안전하게 구독', 'SSR 불가'], answer: 2, explanation: 'React 가 외부 저장소 구독을 위해 만든 공식 훅이에요.' },
    { id: 'pj-30-14', type: 'mcq', source: 'shared/hooks/useHashRoute.ts', question: '이 프로젝트에서 useSyncExternalStore 를 쓰는 곳이 아닌 것은?', choices: ['useHashRoute', 'useMediaQuery', 'Maestro useMaestro 스토어', 'SearchBox 입력값'], answer: 3, explanation: '입력값은 컴포넌트 안 useState 예요.' },
  ],
}

export default topic
