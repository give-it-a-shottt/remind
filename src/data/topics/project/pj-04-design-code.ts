import type { Topic } from '../../types'

const topic: Topic = {
  id: 'pj-04-design-code',
  track: 'project',
  group: '디자인',
  title: '04. 디자인 코드 (토큰 · 애니메이션 · 반응형)',
  order: 4,
  notionId: '3f2df951bf80817c8541c751612be7a9',
  addedAt: '2026-10-15',
  sections: [
    {
      title: '스타일 방식',
      code: `<h1 className="text-20 font-semibold text-main lg:text-24">장바구니</h1>`,
      points: [
        'Tailwind CSS 4 유틸리티 클래스 + index.css 의 @theme 토큰만 사용. CSS 파일은 index.css 하나',
        '--text-*: initial; --font-weight-*: initial; --radius-*: initial; 로 Tailwind 기본값(text-xs, font-bold, rounded-lg)을 지움 → 시안에 없는 값은 쓸 수조차 없음',
        '시안에만 있는 특수 값은 대괄호 임의값: rounded-[50px], bg-[#1C1917]',
        '반복 클래스 묶음은 문자열 상수: CARD_CLASS, BLEED_CLASS, BRAND_BUTTON_CLASS',
        '데이터에 따라 바뀌는 색은 style={{ background: banner.background }} 인라인',
      ],
    },
    {
      title: '토큰 규칙',
      points: [
        '색: text-main/sub/sub-weak/disabled, border-light/regular/black, bg-default/light/regular/main',
        '프로젝트별 포인트 색은 접두어로 분리: accent(Accio 주황), portfolio(파랑), maestro(보라)',
        '주황 위 글자는 대비 4.5:1 을 위해 더 어두운 accent-strong',
        '폰트 Pretendard Variable, 굵기는 400/500/600 세 개만 (bold 700 없음)',
        '행간: 32px 이상 130% / 16~28px 140% / 15px 이하 145%, 한글 자간 -2.5%',
        '라운드: card 16 / card-sm 12 / thumb 12 / thumb-sm 8 / badge 4 — 카드 안 썸네일은 카드 라운드 − 4',
        '좌우 여백 16 → 24 → 40px (px-4 sm:px-6 lg:px-10), 콘텐츠 최대 폭 1200px, 모바일 앱 375px',
      ],
    },
    {
      title: '공통 컴포넌트',
      points: [
        'shared/icons.tsx: 직접 그린 SVG 라인 아이콘 (20 그리드, 1.5 선, currentColor)',
        'shared/MobileFrame.tsx + frameLayer.ts: 모바일 시안을 넓은 화면에서 휴대폰 틀로',
        'Accio: Container, PageLayout, CARD_CLASS, BLEED_CLASS, ProductCard',
        '포트폴리오: SearchBox(size lg/md 를 SIZE 표로), CaseMeta',
        'Maestro components.tsx: Screen, Footer, StepNav, Tag, PartnerTag, PlacePhoto, BottomSheet',
      ],
    },
    {
      title: '애니메이션',
      points: [
        '10/14 부터 인트로는 IntroMotion(잔디 → JSH → 에디터 타이핑, 약 4.5초). 단계 시간은 TIMING 객체, 모양은 IntroMotion.css',
        '예전 PortfolioHero 는 3.2초 타임라인 위 times 비율로 등장 시점만 다르게, SPRING 은 감쇠 진동 수식을 쓴 커스텀 이징',
        'layoutId: 같은 id 의 요소가 자리를 옮기면 motion 이 위치·크기를 보간 (FLIP) → 인트로 글자가 헤더 로고로 날아감',
        'SearchHome rise(order): opacity 0→1, y 16→0, 0.6초, 순서마다 0.08초 지연(스태거)',
        'BottomSheet: y "100%" → 0 을 spring(damping 30, stiffness 320). 손잡이를 100px 또는 초속 500px 넘게 끌면 닫힘',
        '공통 이징 EASE_OUT = [0.22, 1, 0.36, 1]',
        'prefers-reduced-motion 존중: 인트로 생략, useReducedMotion() 이면 애니메이션 props 를 빈 객체로',
      ],
    },
    {
      title: '반응형',
      points: [
        '모바일 우선: 접두어 없는 클래스 = 모바일, sm(640)·md(768)·lg(1024) 가 큰 화면용 덮어쓰기',
        '세로 → 가로: flex flex-col lg:flex-row, 그리드 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
        '숨기기: hidden md:block / hidden md:flex',
        '가로 스와이프 캐러셀: overflow-x-auto snap-x snap-mandatory, 카드 폭 (100%-12px)/2.2 → 2.2장 (다음 카드가 살짝 보이는 단서)',
        'BLEED_CLASS: 음수 마진(-mx-4)으로 Container 여백을 무효화해 화면 끝까지',
        'MobileFrame: 폰은 전체 화면, sm 이상은 가운데 375×812 틀',
        'min-h-svh: 주소창이 나왔다 들어가도 안 흔들리는 small viewport height',
      ],
    },
  ],
  questions: [
    { id: 'pj-04-01', type: 'mcq', source: '스타일 방식', question: '이 프로젝트에서 className="text-xs" 를 쓰면?', choices: ['자동으로 text-12 로 바뀐다', '12px 로 보인다', '--text-*: initial 로 기본값을 지워 스타일이 생기지 않는다', '빌드 에러'], answer: 2, explanation: '시안에 없는 값은 쓸 수조차 없게 Tailwind 기본 스케일을 지웠어요.' },
    { id: 'pj-04-02', type: 'mcq', source: '스타일 방식', question: '시안에만 있는 50px 라운드는 어떻게 쓰나?', choices: ['style 태그', '새 CSS 파일', 'rounded-50', 'rounded-[50px] (대괄호 임의값)'], answer: 3, explanation: '토큰에 없는 특수 값은 임의값 문법으로.' },
    { id: 'pj-04-03', type: 'mcq', source: '스타일 방식', question: '반복되는 클래스 묶음(카드 표면 등)을 재사용하는 방법은?', choices: ['CARD_CLASS 같은 문자열 상수', '@apply', '별도 CSS 클래스', 'UI 라이브러리'], answer: 0, explanation: '별도 CSS 나 UI 라이브러리 없이 상수로 공유해요.' },
    { id: 'pj-04-04', type: 'mcq', source: '스타일 방식', question: '배너마다 다른 배경색(데이터 값)은 어떻게 칠하나?', choices: ['bg-[변수]', 'style={{ background: banner.background }} 인라인', 'CSS 변수 파일', '토큰 추가'], answer: 1, explanation: 'Tailwind 는 빌드 때 클래스를 만들어서, 런타임 값은 인라인 스타일로.' },
    { id: 'pj-04-05', type: 'mcq', source: '토큰 규칙', question: '포인트 색 이름에 portfolio-, maestro- 접두어를 붙인 이유는?', choices: ['번들 크기', 'Tailwind 규칙', '같은 CSS 를 쓰지만 프로젝트끼리 색이 섞이지 않게', '다크 모드'], answer: 2, explanation: 'Accio 는 accent(주황), 포트폴리오는 파랑, Maestro 는 보라.' },
    { id: 'pj-04-06', type: 'mcq', source: '토큰 규칙', question: '주황 배경 위 글자에 accent-strong(#b8470f)을 쓰는 이유는?', choices: ['인쇄용', '애니메이션', '브랜드 규정', '대비 4.5:1 (웹 접근성 기준)을 맞추려고'], answer: 3, explanation: '밝은 주황 위 흰 글자는 대비가 부족해요.' },
    { id: 'pj-04-07', type: 'mcq', source: '토큰 규칙', question: '이 디자인 시스템에서 쓸 수 있는 글자 굵기는?', choices: ['400 / 500 / 600 세 개 (bold 없음)', '400 / 700', '600 하나', '100~900 전부'], answer: 0, explanation: 'font-regular / font-medium / font-semibold 만 있어요.' },
    { id: 'pj-04-08', type: 'mcq', source: '토큰 규칙', question: 'rounded-card(16) 카드 안 썸네일의 라운드는?', choices: ['16', '12', '8', '4'], answer: 1, explanation: '규칙: 카드 안 썸네일 = 카드 라운드 − 4. 안쪽이 더 작아야 테두리가 평행해 보여요.' },
    { id: 'pj-04-09', type: 'mcq', source: '토큰 규칙', question: '18px 글자의 행간 규칙은?', choices: ['150%', '130%', '140%', '145%'], answer: 2, explanation: '16~28px 은 140%, 32px 이상은 130%, 15px 이하는 145%.' },
    { id: 'pj-04-10', type: 'mcq', source: '공통 컴포넌트', question: 'shared/icons.tsx 아이콘이 글자색을 따라가게 하는 방법은?', choices: ['stroke 에 currentColor', '이미지 파일', 'CSS filter', 'fill="black"'], answer: 0, explanation: 'currentColor 라 text-* 클래스로 아이콘 색이 바뀌어요.' },
    { id: 'pj-04-11', type: 'mcq', source: '공통 컴포넌트', question: 'MobileFrame 컴포넌트의 역할은?', choices: ['모바일 기기 감지', '모바일 시안을 넓은 화면에서 휴대폰 틀로 보여줌', '모바일 전용 API 호출', 'PWA 설치'], answer: 1, explanation: '폰에서는 전체 화면, sm 이상에서는 가운데 375×812 틀이에요.' },
    { id: 'pj-04-12', type: 'mcq', source: '애니메이션', question: '인트로의 큰 글자가 헤더 로고 자리로 "날아가는" 효과를 만드는 motion 기능은?', choices: ['drag', 'AnimatePresence', 'layoutId (공유 레이아웃, FLIP)', 'useScroll'], answer: 2, explanation: '같은 layoutId 를 가진 요소의 위치·크기를 보간해요.' },
    { id: 'pj-04-13', type: 'mcq', source: '애니메이션', question: 'SearchHome 의 rise(order) 가 순서마다 0.08초씩 지연시키는 기법은?', choices: ['키프레임', '패럴랙스', '스프링', '스태거(stagger)'], answer: 3, explanation: '요소가 차례로 떠오르게 해 시선을 위에서 아래로 이끌어요.' },
    { id: 'pj-04-14', type: 'mcq', source: '애니메이션', question: 'BottomSheet 를 손잡이로 끌어내렸을 때 닫히는 조건은?', choices: ['100px 넘게 또는 초속 500px 넘게', '화면 절반 넘게', '끌기로는 안 닫힘', '조금이라도 끌면'], answer: 0, explanation: '덜 끌면 제자리로 튕겨 돌아와요.' },
    { id: 'pj-04-15', type: 'mcq', source: '애니메이션', question: '사용자가 "움직임 줄이기"를 켰을 때 이 프로젝트의 처리는?', choices: ['무시', '인트로를 건너뛰고, 애니메이션 props 를 빈 객체로 바꿔 마지막 상태를 바로 보여줌', '애니메이션을 2배 느리게', '경고창'], answer: 1, explanation: 'prefers-reduced-motion — 어지러움을 느끼는 사용자를 위한 접근성 처리.' },
    { id: 'pj-04-16', type: 'mcq', source: '반응형', question: 'px-4 sm:px-6 lg:px-10 에서 접두어 없는 px-4 는?', choices: ['인쇄용', '큰 화면 전용', '모든 화면의 기본값(모바일) — 큰 화면은 sm·lg 가 덮어씀', '태블릿 전용'], answer: 2, explanation: '모바일 우선: 작은 화면부터 쓰고 큰 화면을 덮어써요.' },
    { id: 'pj-04-17', type: 'mcq', source: '반응형', question: '캐러셀 카드 폭을 한 화면 2.2장으로 둔 이유는?', choices: ['이미지 비율', '성능', '계산이 쉬워서', '다음 카드가 살짝 보여 옆으로 넘길 수 있다는 단서를 주려고'], answer: 3, explanation: '딱 2장이면 더 있는지 알 수 없어요.' },
    { id: 'pj-04-18', type: 'mcq', source: '반응형', question: 'BLEED_CLASS 의 -mx-4 같은 음수 마진의 목적은?', choices: ['Container 좌우 여백을 무효화해 가로 스크롤을 화면 끝까지', '가운데 정렬', '겹치기', '요소 숨기기'], answer: 0, explanation: '스크롤 영역만 화면 가장자리까지 늘리고 내용 시작점은 scroll-px 로 맞춰요.' },
    { id: 'pj-04-19', type: 'mcq', source: '반응형', question: '모바일 높이에 100vh 대신 min-h-svh 를 쓴 이유는?', choices: ['더 짧게 쓰려고', '주소창이 숨겨지면 vh 가 커져 하단 버튼이 가려지거나 화면이 튀어서', '구형 브라우저 지원', 'SEO'], answer: 1, explanation: 'svh 는 "주소창이 보일 때의 높이"로 고정돼요.' },
  ],
}

export default topic
