import type { Topic } from '../../types'

const topic: Topic = {
  id: 'pj-00-map',
  track: 'project',
  group: '개요',
  title: '00. 전체 지도 (Portfolio · Accio · Maestro)',
  order: 0,
  notionId: '3f2df951bf8081cc8b2cd0f08de6e66f',
  addedAt: '2026-10-15',
  sections: [
    {
      title: '한 줄 요약',
      points: [
        '레포 하나 = 검색형 포트폴리오(입구) 안에 프로젝트 두 개(Accio, Maestro)',
        '포트폴리오: 구글처럼 검색해서 작업 사례를 찾는 화면 — #/, #/search, #/case/...',
        'Accio: AI 자연어 검색 쇼핑몰 UI. 서버 없이 목업 데이터로만 동작 — #/accio/...',
        'Maestro: 짜둔 일정의 끼니마다 상황별 대안 식당(플랜 B)을 미리 붙여두는 모바일 웹. FastAPI + 헤이유미 API — #/maestro/...',
      ],
    },
    {
      title: '폴더 트리',
      points: [
        'Portfolio/frontend — React 앱 하나에 portfolio/, projects/accio, projects/maestro, shared/',
        'Portfolio/backend/accio — FastAPI + Supabase(Postgres) 연결, 지금은 헬스체크만',
        'Portfolio/backend/maestro — 헤이유미 중계 + 변주(대안) 생성, DB 없음',
        'render.yaml — Render 블루프린트(maestro-api 하나), .github/workflows/keep-supabase-awake.yml — 3일마다 DB 깨우기',
        'yumi/mock.py 는 키 없이 쓰는 가짜 유미, fixtures/places.json 에 가상 매장 29곳',
        '트리에서 뺀 것: node_modules, lock 파일, 이미지, 빈 __init__.py 등',
      ],
    },
    {
      title: '기술 스택과 쓰는 이유',
      points: [
        'React 19 + TypeScript 6: 컴포넌트 재사용, 타입으로 응답 모양·props 실수를 컴파일 단계에서',
        'Vite 8: 빠른 개발 서버(HMR), vite build 로 dist 정적 파일, lazy() 코드 분할',
        'Tailwind CSS 4: @theme 에 디자인 토큰을 정의해 시안 값만 쓰도록 강제',
        'motion: 인트로, layoutId 로고 전환, 바텀시트 스프링',
        '라우팅은 직접 만든 해시 라우터(useHashRoute) — 정적 호스팅에서 새로고침해도 404 없음',
        'FastAPI + pydantic-settings + uv, pytest·ruff, 배포는 Vercel(프론트)·Render(백엔드)·GitHub Actions(크론)',
      ],
    },
    {
      title: '전체 구조 그림',
      points: [
        '브라우저 → Vercel 정적 파일(index.html + JS/CSS 번들)',
        '포트폴리오와 Accio 는 서버 호출 없음, Maestro 만 fetch(VITE_MAESTRO_API_URL + /api/...) 로 Render 백엔드 호출',
        '백엔드가 Vercel 주소를 CORS 로 허락해야 통과',
        'Render 무료 서버는 15분 요청 없으면 잠들고, 첫 요청 때 ~1분 걸려 깨어남',
        'YUMI_MODE=mock 이면 fixtures JSON(외부 호출 0), real 이면 HTTPS + Bearer 키로 헤이유미(하루 70요청 한도)',
        'render.yaml 에는 maestro-api 하나뿐, vercel.json 은 레포에 없음(대시보드 설정)',
      ],
    },
    {
      title: '추천 읽기 순서',
      points: [
        '00 지도 → 03 앱 입구(main.tsx → App.tsx) → portfolio → accio → 02 백엔드 maestro → 03 maestro 프론트',
        '→ 01 배포 → 04 디자인 코드 → 05 복습 → 07 처음부터 다시 만들기',
        'Accio 화면이 백엔드 없이 동작하는 이유: 데이터가 projects/accio/data/mock.ts 에 하드코딩, 버튼은 useState 만 바꿈',
      ],
    },
  ],
  questions: [
    { id: 'pj-00-01', type: 'mcq', source: '한 줄 요약', question: '이 레포의 "입구" 역할을 하는 앱은?', choices: ['Accio 쇼핑몰', 'Maestro', '검색형 포트폴리오', 'Accio 백엔드'], answer: 2, explanation: '검색형 포트폴리오가 입구이고, 그 안에 Accio·Maestro 두 프로젝트가 들어 있는 구조예요.' },
    { id: 'pj-00-02', type: 'mcq', source: '한 줄 요약', question: 'Maestro 가 하는 일로 옳은 것은?', choices: ['AI 자연어로 상품을 검색한다', '일정의 끼니마다 상황별 대안 식당(플랜 B)을 미리 붙여둔다', '검색어로 작업 사례를 찾는다', '쇼핑몰 주문을 처리한다'], answer: 1, explanation: 'Maestro 는 해커톤 앱으로, 끼니마다 "비 와" 같은 상황별 대안을 미리 계산해 둬요.' },
    { id: 'pj-00-03', type: 'mcq', source: '한 줄 요약', question: '세 앱 중 실제 백엔드를 호출하는 것은?', choices: ['포트폴리오', 'Accio', 'Maestro', '셋 다'], answer: 2, explanation: '포트폴리오와 Accio 는 서버 호출이 없고, Maestro 만 FastAPI 백엔드(헤이유미 중계)를 불러요.' },
    { id: 'pj-00-04', type: 'mcq', source: '폴더 트리', question: 'Accio 백엔드(Portfolio/backend/accio)가 지금 제공하는 API는?', choices: ['상품 검색 API', '헬스체크(/health, /health/db)만', '로그인 API', 'AI 채팅 API'], answer: 1, explanation: 'Supabase DB 연결만 된 뼈대로, GET /health 와 GET /health/db 두 개뿐이에요.' },
    { id: 'pj-00-05', type: 'mcq', source: '폴더 트리', question: '키 없이 개발할 때 Maestro 가 쓰는 가짜 헤이유미 데이터는 어디에 있나?', choices: ['app/yumi/real.py', 'app/yumi/fixtures/ (places.json 등)', 'frontend/src/projects/maestro/store.ts', 'Supabase DB'], answer: 1, explanation: 'mock.py 가 fixtures 의 places.json(가상 매장 29곳)·regions.json 을 읽어 응답해요.' },
    { id: 'pj-00-06', type: 'mcq', source: '폴더 트리', question: '.github/workflows/keep-supabase-awake.yml 의 역할은?', choices: ['push 때 테스트 실행', '3일마다 Accio /health/db 를 불러 Supabase 무료 DB 정지를 막음', 'Vercel 배포', 'Render 서버 재시작'], answer: 1, explanation: 'Supabase 무료 DB 는 7일 미사용이면 일시정지돼서 크론으로 주기적으로 깨워요.' },
    { id: 'pj-00-07', type: 'mcq', source: '기술 스택과 쓰는 이유', question: '라우터 라이브러리 대신 직접 만든 해시 라우터를 쓴 이유로 옳은 것은?', choices: ['SEO 가 좋아져서', '정적 호스팅에서 새로고침해도 404 가 나지 않아서', '서버 사이드 렌더링을 하려고', '번들 크기를 늘리려고'], answer: 1, explanation: '# 뒤는 서버로 안 가므로 서버는 항상 index.html 만 주면 돼요.' },
    { id: 'pj-00-08', type: 'mcq', source: '기술 스택과 쓰는 이유', question: 'Tailwind 4 의 @theme 에 디자인 토큰을 정의한 목적은?', choices: ['CSS 파일을 여러 개로 나누려고', '시안에 있는 값만 쓰도록 강제하려고', '애니메이션을 만들려고', '다크 모드를 끄려고'], answer: 1, explanation: '색·글자 크기·라운드를 토큰으로 두고 기본값을 지워 시안 값만 쓰게 했어요.' },
    { id: 'pj-00-09', type: 'mcq', source: '기술 스택과 쓰는 이유', question: '백엔드 패키지 관리 도구 uv 의 `uv sync --frozen` 이 하는 일은?', choices: ['패키지를 최신 버전으로 올린다', 'lock 파일 그대로 빠르게 설치한다', 'lock 파일을 새로 만든다', '테스트를 돌린다'], answer: 1, explanation: '--frozen 은 lock 을 바꾸지 않고 그대로 설치해요. Render 빌드 명령에도 쓰여요.' },
    { id: 'pj-00-10', type: 'mcq', source: '기술 스택과 쓰는 이유', question: '배포를 맡는 서비스 조합으로 옳은 것은?', choices: ['프론트 Render · 백엔드 Vercel', '프론트 Vercel · 백엔드 Render · 크론 GitHub Actions', '모두 Vercel', '모두 GitHub Pages'], answer: 1, explanation: '무료 플랜으로 정적 사이트 + 파이썬 서버 + 정기 작업을 나눠 맡겨요.' },
    { id: 'pj-00-11', type: 'mcq', source: '전체 구조 그림', question: 'Render 무료 플랜 서버의 특징은?', choices: ['항상 켜져 있다', '15분 요청이 없으면 잠들고 첫 요청 때 깨어나는 데 ~1분', '하루에 한 번 재시작된다', '요청마다 새 서버를 만든다'], answer: 1, explanation: '그래서 프론트가 #/maestro 진입 즉시 /health 를 불러 미리 깨워요.' },
    { id: 'pj-00-12', type: 'mcq', source: '전체 구조 그림', question: 'YUMI_MODE=mock 일 때 외부 헤이유미 API 호출 횟수는?', choices: ['끼니당 1번', '0번', '상황당 1번', '하루 70번'], answer: 1, explanation: 'mock 은 fixtures/*.json 만 읽어서 외부 호출이 0이에요. 공개 배포도 mock 모드예요.' },
    { id: 'pj-00-13', type: 'mcq', source: '전체 구조 그림', question: '레포 기준으로 사실인 것은?', choices: ['render.yaml 에 Accio 백엔드도 정의돼 있다', 'vercel.json 이 루트에 있다', 'render.yaml 에는 maestro-api 하나만 있고 vercel.json 은 없다', 'Accio 백엔드는 Vercel 에 배포된다'], answer: 2, explanation: 'Accio 백엔드 배포는 레포 기준 "없음/수동", Vercel 은 대시보드에서 설정해요.' },
    { id: 'pj-00-14', type: 'mcq', source: '추천 읽기 순서', question: 'Accio 화면들이 백엔드 없이도 동작하는 이유는?', choices: ['서비스 워커가 캐시해서', '데이터가 mock.ts 에 하드코딩돼 있고 버튼은 화면 상태(useState)만 바꿔서', 'Supabase 를 직접 불러서', 'Maestro 백엔드를 같이 써서'], answer: 1, explanation: 'Accio 는 서버 없는 클릭 가능한 목업이에요.' },
  ],
}

export default topic
