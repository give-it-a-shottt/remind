import type { Topic } from '../../types'

const topic: Topic = {
  id: 'pj-40-design-shared',
  track: 'project',
  group: '디자인',
  title: '04-1. 디자인 공통 파일 (index.css · icons · MobileFrame · motion)',
  order: 40,
  notionId: '3f2df951bf8081079549fb04cccae913',
  addedAt: '2026-10-15',
  sections: [
    {
      title: 'src/index.css',
      notionIds: ['3f2df951bf8081079549fb04cccae913'],
      code: `@theme {
  --font-weight-*: initial;
  --font-weight-semibold: 600;
  --text-*: initial;
  --text-14: 14px;
  --text-14--line-height: 1.45;
  --text-color-main: #111111;     /* → text-main */
  --color-accent: #f2641d;        /* → text-/bg-/border-accent */
  --radius-*: initial;
  --radius-card: 16px;            /* → rounded-card */
}
@utility scrollbar-none { scrollbar-width: none; &::-webkit-scrollbar { display: none; } }`,
      points: [
        '프로젝트의 유일한 CSS 파일: Tailwind import + @theme 토큰 + 커스텀 유틸리티 1개 + 기본 스타일',
        'Tailwind 4: tailwind.config.js 대신 CSS 안 @theme 에서 변수를 선언하면 그 이름으로 클래스가 생김',
        '--text-color-* 는 text- 에만, --color-* 는 text/bg/border 모두에 생김',
        '--text-14--line-height 처럼 크기 토큰에 행간·자간을 함께 묶음',
        '@utility scrollbar-none: 스크롤은 되고 막대만 숨김',
        '@layer base: button { cursor: pointer } — Tailwind 4 는 버튼 커서를 기본으로 안 바꿈',
        '--text-*: initial 을 지우면 text-sm 같은 기본 크기가 되살아나 시안 밖 크기가 섞일 수 있음 — "실수를 불가능하게 만드는" 설정',
      ],
    },
    {
      title: 'shared/icons.tsx',
      notionIds: ['3f2df951bf8081bfa5c3ee11043cfe0b'],
      code: `<svg width={size} height={size} viewBox="0 0 20 20" fill="none"
     stroke="currentColor" strokeWidth={1.5} strokeLinecap="square" strokeLinejoin="miter"
     aria-hidden="true" {...props}>`,
      points: [
        '직접 그린 라인 아이콘 13개: 20 그리드, 1.5 선, 각진 끝(square·miter)으로 통일',
        '반짝이·로봇·마법봉처럼 AI 서비스에서 흔한 아이콘은 의도적으로 두지 않음',
        'stroke="currentColor" → 부모 text-* 색을 그대로 따름',
        'aria-hidden 기본 — 아이콘은 장식, 의미는 버튼의 aria-label 이 담당',
        'IconProps = Omit<SVGProps, "children"> & { size?: number } — 나머지 SVG 속성은 그대로 전달',
        'Accio 일부 화면은 피그마에서 내보낸 svg 를 <img> 로 씀 → 이미지 아이콘은 CSS 로 색을 바꿀 수 없음',
      ],
    },
    {
      title: 'shared/MobileFrame.tsx · frameLayer.ts',
      notionIds: ['3f2df951bf8081c4b738c7807e0fb8d1', '3f2df951bf80815e9c0cd72151666076'],
      code: `const [frame, setFrame] = useState<HTMLDivElement | null>(null)   // 콜백 ref
const size = { '--frame-w': \`\${width}px\`, '--frame-h': \`\${height}px\` } as CSSProperties
...
<div ref={setFrame} style={size}
  className="... sm:h-[min(var(--frame-h),calc(100svh-48px))] sm:w-(--frame-w) sm:overflow-hidden sm:rounded-[30px]">
  <FrameLayerContext.Provider value={frame}>{children}</FrameLayerContext.Provider>`,
      points: [
        '휴대폰(sm 미만)은 화면을 꽉 채우고 페이지가 스크롤, 넓은 화면은 가운데 둥근 틀 + 틀 안에서만 스크롤',
        '틀 크기를 CSS 변수(--frame-w, --frame-h)로 전달, 높이는 min(812px, 화면높이 - 48px) → 낮은 노트북에서도 안 잘림',
        'hashchange 때 틀 안 스크롤도 맨 위로 (페이지 스크롤은 App 이 올림)',
        'ref={setFrame}: state setter 를 ref 로 → 요소가 생기면 리렌더되어 Context 에 실제 DOM 을 넣을 수 있음 (useRef 는 바뀌어도 리렌더 X)',
        'overflow-hidden 은 넓은 화면에서만 — 폰에서 걸면 sticky 버튼이 그 조상 안에 갇혀 화면 아래에 붙지 않는 CSS 함정',
        'frameLayer: 틀 DOM 을 Context 로 전달 → BottomSheet 가 createPortal(시트, layer ?? document.body) 로 틀 안에 띄움',
        'createPortal = 컴포넌트 트리는 그대로, 실제 DOM 위치만 다른 곳에',
      ],
    },
    {
      title: 'portfolio/motion.ts',
      notionIds: ['3f2df951bf8081ac8672cdef7de678b1'],
      code: `export const EASE_OUT: Easing = [0.22, 1, 0.36, 1]`,
      points: [
        'Figma 모션의 등장 이징을 cubic-bezier 상수 하나로 — 빠르게 시작해 부드럽게 멈춤',
        '모든 등장 모션이 같은 "느낌"을 갖게: 애니메이션도 디자인 토큰처럼 관리',
        '예전 INTRO_SECONDS = 3.5 (모션 약 2.5초 + 1초 머묾)는 10/14 98c1bcd 에서 삭제, 지금은 EASE_OUT 만',
      ],
    },
  ],
  questions: [
    { id: 'pj-40-01', type: 'mcq', source: 'src/index.css', question: 'Tailwind 4 에서 디자인 토큰을 정의하는 곳은?', choices: ['vite.config.ts', 'tailwind.config.js', 'CSS 안의 @theme 블록', 'package.json'], answer: 2, explanation: '변수 이름으로 유틸리티 클래스가 생성돼요.' },
    { id: 'pj-40-02', type: 'mcq', source: 'src/index.css', question: '--color-accent 와 --text-color-main 의 차이는?', choices: ['반대', '--color 는 배경만', '같다', '--color-* 는 text·bg·border 모두에, --text-color-* 는 text- 에만 클래스 생성'], answer: 3, explanation: '네임스페이스가 생성 범위를 정해요.' },
    { id: 'pj-40-03', type: 'mcq', source: 'src/index.css', question: '--text-14--line-height 같은 변수의 역할은?', choices: ['text-14 를 쓰면 행간도 함께 적용되게 크기 토큰에 묶음', '폰트 변경', '반응형', '별도 클래스 생성'], answer: 0, explanation: '크기·행간·자간을 한 클래스로.' },
    { id: 'pj-40-04', type: 'mcq', source: 'src/index.css', question: '@layer base 에 button { cursor: pointer } 를 넣은 이유는?', choices: ['접근성 규칙', 'Tailwind 4 는 버튼 커서를 기본으로 pointer 로 바꾸지 않아서', '브라우저 버그', '모바일'], answer: 1, explanation: 'Preflight 변경 사항이에요.' },
    { id: 'pj-40-05', type: 'mcq', source: 'src/index.css', question: '커스텀 유틸리티 scrollbar-none 의 효과는?', choices: ['부드러운 스크롤', '스크롤 막기', '스크롤은 되고 스크롤바 막대만 숨김', 'overflow hidden'], answer: 2, explanation: 'Firefox(scrollbar-width)·Chrome(::-webkit-scrollbar) 모두 처리.' },
    { id: 'pj-40-06', type: 'mcq', source: 'shared/icons.tsx', question: '아이콘 SVG 에 stroke="currentColor" 를 쓰면?', choices: ['투명', '랜덤', '검정 고정', '부모 요소의 글자색(text-*)을 따라감'], answer: 3, explanation: '<SearchIcon className="text-icon-sub-weak" /> 처럼 색을 바꿔요.' },
    { id: 'pj-40-07', type: 'mcq', source: 'shared/icons.tsx', question: '아이콘 컴포넌트에 aria-hidden="true" 가 기본인 이유는?', choices: ['아이콘은 장식이고 의미는 버튼의 aria-label 이 담당해서', '숨기려고', 'SEO', '성능'], answer: 0, explanation: '같은 정보를 두 번 읽지 않게.' },
    { id: 'pj-40-08', type: 'mcq', source: 'shared/icons.tsx', question: '피그마 svg 를 <img> 로 쓴 아이콘의 한계는?', choices: ['느림', 'CSS 로 색을 바꿀 수 없음', '크기 고정', '접근성 불가'], answer: 1, explanation: 'img 안 SVG 는 currentColor 를 상속하지 않아요.' },
    { id: 'pj-40-09', type: 'mcq', source: 'shared/icons.tsx', question: '이 프로젝트 아이콘 세트에 반짝이(✨)·로봇 아이콘이 없는 이유는?', choices: ['실수', '라이선스', 'AI 서비스에서 흔한 아이콘을 의도적으로 피한 디자인 결정', '용량'], answer: 2, explanation: 'Accio AI 표시도 워드마크로 했어요.' },
    { id: 'pj-40-10', type: 'mcq', source: 'shared/MobileFrame.tsx · frameLayer.ts', question: 'MobileFrame 이 ref={setFrame} 처럼 state setter 를 ref 로 쓰는 이유는?', choices: ['요소가 생길 때 리렌더가 일어나 Context 에 실제 DOM 을 넣을 수 있어서 (useRef 는 리렌더 X)', '성능', '타입', '문법상 필수'], answer: 0, explanation: '콜백 ref 패턴이에요.' },
    { id: 'pj-40-11', type: 'mcq', source: 'shared/MobileFrame.tsx · frameLayer.ts', question: '폰에서 틀에 overflow-hidden 을 걸지 않는 이유는?', choices: ['디자인', 'overflow: hidden 조상이 있으면 position: sticky 가 그 안에 갇혀 하단 버튼이 화면에 붙지 않아서', '성능', '접근성'], answer: 1, explanation: '그래서 sm:overflow-hidden 으로 넓은 화면에서만.' },
    { id: 'pj-40-12', type: 'mcq', source: 'shared/MobileFrame.tsx · frameLayer.ts', question: '틀 높이를 min(812px, 100svh - 48px) 로 한 이유는?', choices: ['애니메이션', '디자인 규칙', '화면이 낮은 노트북에서도 틀이 잘리지 않게', '스크롤 방지'], answer: 2, explanation: '위아래 py-6(24px × 2) 여백을 뺀 값이에요.' },
    { id: 'pj-40-13', type: 'mcq', source: 'shared/MobileFrame.tsx · frameLayer.ts', question: 'BottomSheet 가 document.body 가 아니라 틀 요소에 createPortal 하는 이유는?', choices: ['접근성', 'z-index', '성능', '넓은 화면에서 시트가 휴대폰 틀의 둥근 모서리 밖으로 삐져나오지 않게'], answer: 3, explanation: '폰에서는 틀 = 화면 전체라 차이가 없어요.' },
    { id: 'pj-40-14', type: 'mcq', source: 'shared/MobileFrame.tsx · frameLayer.ts', question: 'createPortal 의 의미는?', choices: ['컴포넌트 트리 위치는 그대로 두고 실제 DOM 은 다른 노드에 그리기', 'iframe', '서버 렌더', '새 창 열기'], answer: 0, explanation: '이벤트·Context 는 원래 트리를 따라가요.' },
    { id: 'pj-40-15', type: 'mcq', source: 'portfolio/motion.ts', question: 'EASE_OUT = [0.22, 1, 0.36, 1] 의 느낌은?', choices: ['천천히 시작해 빨라짐', '빠르게 시작해 부드럽게 멈춤', '일정 속도', '튕김'], answer: 1, explanation: 'cubic-bezier ease-out 계열.' },
    { id: 'pj-40-16', type: 'mcq', source: 'portfolio/motion.ts', question: '이징을 상수로 모아둔 의도는?', choices: ['필수', '번들 크기', '모든 등장 모션이 같은 느낌을 갖게 — 모션도 디자인 토큰처럼 관리', '테스트'], answer: 2, explanation: '디자인 도구의 값을 한 곳에서.' },
  ],
}

export default topic
