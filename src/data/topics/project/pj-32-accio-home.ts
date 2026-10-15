import type { Topic } from '../../types'

const topic: Topic = {
  id: 'pj-32-accio-home',
  track: 'project',
  group: '프론트',
  title: '03-3. projects/accio ① 앱 · 데이터 · 홈 화면',
  order: 32,
  notionId: '3f2df951bf8081d69807e9acb022bef2',
  addedAt: '2026-10-15',
  sections: [
    {
      title: 'AccioApp · routes.ts',
      notionIds: ['3f2df951bf80813e8be4e2807d7c43e5', '3f2df951bf80810e8828e6f4a8379afd'],
      code: `export function accioHref(path = '') {
  return \`#\${ACCIO_BASE}\${path}\`   // accioHref('/list') → '#/accio/list'
}
export const LEGACY_ROUTES = { '/home': '/', '/cart': '/cart', ... }`,
      points: [
        'AccioApp: App.tsx 가 #/accio 뒤 경로만 잘라 path 로 줌 → if 문으로 8개 페이지 분기, 모르는 경로는 쇼핑몰 홈',
        '홈 = TopUtilityHeader + MainHeader + CategoryNav + AiSearchHero + FeatureBanners + ShortFormSection + ProductSection ×4 + BrandSection + Footer',
        'ProductSection 하나를 데이터만 바꿔 4번 재사용 — "컴포넌트는 모양, 데이터는 props"',
        '모든 내부 링크는 accioHref() 함수로 → 포트폴리오 안으로 옮길 때(#/cart → #/accio/cart) 한 곳만 고치면 됨',
        'LEGACY_ROUTES: 이미 퍼진 옛 링크가 깨지지 않게 하는 호환표 (실무의 리다이렉트 처리와 같은 생각)',
      ],
    },
    {
      title: 'data/mock.ts',
      notionIds: ['3f2df951bf8081f18d79fd2243cdcee3'],
      points: [
        'Accio 화면의 모든 문구·상품·이미지·주문·리뷰·채팅 데이터 (약 860줄) — 컴포넌트는 모양만',
        'CART_COUNT = 2, CATEGORIES 11개, FEATURE_BANNERS 5장, 섹션당 상품 5개',
        'LIST_PAGE 상품 20개, PRODUCT_REVIEWS 별점 분포 합 = 2,341, CART_COUPON = { threshold: 120000, rate: 5 }',
        'Product 타입: listPrice, discountRate, price, badge.tone(gray / accent / accentStrong), highlighted',
        '진짜 API 를 붙이면 상수를 fetch 결과로 바꾸면 됨 — 타입이 백엔드 응답 스키마 초안 역할',
      ],
    },
    {
      title: 'useMediaQuery · format.ts',
      notionIds: ['3f2df951bf808199a49bd66345404df5'],
      code: `export const formatWon = (value: number) => \`\${value.toLocaleString('ko-KR')}원\`   // 57900 → "57,900원"`,
      points: [
        'useMediaQuery: matchMedia 의 change 이벤트를 useSyncExternalStore 로 구독해 불리언 반환',
        'CSS 로 바꿀 수 없는 값(input placeholder)을 화면 폭별로 고를 때 사용. Tailwind sm = 40rem(640px)',
        'formatWon·formatCount: toLocaleString("ko-KR") 로 천 단위 쉼표',
        'ProductCard·DetailPage 는 같은 formatWon 을 파일 안에 다시 선언(중복) → 복습 연습 과제 ①',
      ],
    },
    {
      title: '헤더 3종',
      notionIds: ['3f2df951bf8081fa820be66b49b4adcd', '3f2df951bf808149a346c9c8998b5a76', '3f2df951bf8081bebd85d7e35ecd563d'],
      points: [
        'TopUtilityHeader(36px 띠): i > 0 일 때만 세로 구분선 → 첫 항목 앞에는 선 없음. 알림 링크는 # (연결 없음)',
        'MainHeader: 로고·Ranking·장바구니(CART_COUNT 고정)·검색창. 검색 폼은 preventDefault 만 — 동작 없음',
        'md 미만에서 검색창이 두 번째 줄 전체 폭으로 (flex-wrap + w-full md:w-84)',
        '글자 없는 검색 버튼은 aria-label="검색", 아이콘 img 는 alt="" 로 장식 처리',
        'CategoryNav: 11개 모두 #/accio/list (목업), 첫 카테고리만 주황, 넘치면 가로 스크롤(scrollbar-none)',
        '"전체 카테고리" 글자는 sr-only sm:not-sr-only → 모바일은 아이콘만 보이고 스크린리더용 글자는 남김',
      ],
    },
    {
      title: 'AiSearchHero.tsx',
      notionIds: ['3f2df951bf80815c9c6acbae6ed07cd8'],
      points: [
        '"찾는 걸 말로 설명해 보세요" AI 검색창 + 추천 문장 칩 3개',
        '제어 컴포넌트: input value 가 query 상태에 묶여 칩을 누르면(setQuery(chip)) 입력창 글자가 바뀜',
        '제출: preventDefault 후 검색어와 상관없이 #/accio/ai (목업) — 항상 "4만원대 가성비 무선 이어폰" 답변',
        '음성인식 버튼은 type="button" — button 기본값은 submit 이라 명시하지 않으면 폼이 제출됨',
        'placeholder 는 useMediaQuery 로 긴 문구/짧은 문구',
      ],
    },
    {
      title: 'FeatureBanners.tsx',
      notionIds: ['3f2df951bf8081a5a22fd0e44e5d8269'],
      code: `const move = (dir: 1 | -1) => {
  const track = trackRef.current
  if (!track || track.scrollWidth <= track.clientWidth) {   // 넘치지 않음 = 다 보임
    setStart((prev) => (prev + dir + count) % count)
    return
  }
  ...
  track.scrollBy({ left: dir * getStep(track), behavior: 'smooth' })
}`,
      points: [
        '특가 배너 5장 + ‹ n / 5 › — 화면 폭에 따라 동작이 다름',
        '넓은 화면(5장 다 보임): ‹ › 가 시작 카드를 한 칸씩 회전(start), 순서는 banners[(start + i) % count]',
        '좁은 화면: 트랙을 한 장씩 스크롤, 끝에서 다음을 누르면 처음으로 되돌아감',
        'getStep: 두 카드의 offsetLeft 차이 = 카드 한 장 + 간격',
        '손가락으로 넘겨도 번호가 맞도록 onScroll 에서 Math.round(scrollLeft / step)',
        '"넓은지"를 미디어쿼리가 아니라 실제로 넘치는지(scrollWidth > clientWidth)로 판단 → 브레이크포인트가 바뀌어도 코드 수정 불필요',
      ],
    },
    {
      title: 'ShortForm · ProductSection · ProductCard',
      notionIds: ['3f2df951bf80816a9a15e641aece704e', '3f2df951bf80817098aadd342f0f1e9f', '3f2df951bf808154bfb3d4e87cebcfa0'],
      points: [
        'ShortFormSection: page 상태를 Math.max(1, p - 1) / Math.min(total, p + 1) 로 범위 고정. 숫자만 바뀌고 카드는 그대로(목업), 카드 비율 aspect-[9/14]',
        'ProductSection: useRef 로 트랙 DOM 을 잡아 scrollBy({ left: dir * clientWidth }) — 보이는 폭만큼, React 상태 없이',
        '제목을 TitleSegment[] 로 받아 일부 단어만 주황 강조, md 미만은 화살표 숨김(터치 스와이프로 충분)',
        'ProductCard: 홈 캐러셀·목록 그리드·마이페이지에서 재사용, widthClass 로 폭만 덮어씀 (기본 2.2 → 3.3 → 4 → 5장)',
        '"카드 전체 클릭 + 안에 버튼" 패턴: <a> 안에 <button> 은 HTML 규칙 위반 → 링크 ::after 를 카드 크기로 늘리고 찜 버튼만 z-10',
        '카드의 찜(♡) 버튼은 클릭 핸들러 없음(모양만), 모든 카드가 같은 상세로 감',
      ],
    },
  ],
  questions: [
    { id: 'pj-32-01', type: 'mcq', source: 'AccioApp · routes.ts', question: 'AccioApp 이 받는 path 는?', choices: ['URL 전체', '쿼리스트링', '전체 해시 "#/accio/cart"', '#/accio 뒤 경로만 잘린 "/cart"'], answer: 3, explanation: 'App.tsx 의 subPath 가 잘라서 넘겨줘요.' },
    { id: 'pj-32-02', type: 'mcq', source: 'AccioApp · routes.ts', question: '내부 링크를 "#/cart" 문자열 대신 accioHref("/cart") 로 만든 이점은?', choices: ['기본 경로가 바뀌어도(#/accio/...) 함수 한 곳만 고치면 됨', '타입 검사', 'SEO', '속도'], answer: 0, explanation: '포트폴리오 안으로 옮길 때 실제로 이 덕을 봤어요.' },
    { id: 'pj-32-03', type: 'mcq', source: 'AccioApp · routes.ts', question: 'ProductSection 을 홈에서 4번 쓰는 방식은?', choices: ['컴포넌트 4개 복사', '같은 컴포넌트에 섹션 데이터만 props 로 다르게', '상속', 'HOC'], answer: 1, explanation: '컴포넌트는 모양, 데이터는 props.' },
    { id: 'pj-32-04', type: 'mcq', source: 'data/mock.ts', question: 'mock.ts 의 타입(Product, CartItem 등)이 나중에 갖는 의미는?', choices: ['테스트 전용', '없음', '진짜 API 를 붙일 때 백엔드 응답 스키마의 초안', 'DB 테이블'], answer: 2, explanation: '상수만 fetch 결과로 바꾸면 돼요.' },
    { id: 'pj-32-05', type: 'mcq', source: 'data/mock.ts', question: '헤더 장바구니 숫자가 항상 2 인 이유는?', choices: ['서버 값', 'localStorage 값', '버그', 'mock.ts 의 고정값 CART_COUNT = 2'], answer: 3, explanation: '공유 장바구니 스토어가 없어요 (복습 과제 ④).' },
    { id: 'pj-32-06', type: 'mcq', source: 'useMediaQuery · format.ts', question: 'formatWon(57900) 의 결과는?', choices: ['"57,900원"', '"₩57,900"', '"5.79만원"', '"57900원"'], answer: 0, explanation: "toLocaleString('ko-KR') 이 천 단위 쉼표를 넣어요." },
    { id: 'pj-32-07', type: 'mcq', source: 'useMediaQuery · format.ts', question: 'useMediaQuery 가 구독하는 이벤트는?', choices: ['resize', 'matchMedia(query) 의 change', 'scroll', 'orientationchange'], answer: 1, explanation: 'resize 보다 효율적 — 조건이 바뀔 때만 알려줘요.' },
    { id: 'pj-32-08', type: 'mcq', source: 'useMediaQuery · format.ts', question: 'Tailwind sm 브레이크포인트 40rem 은 몇 px 인가?', choices: ['1024px', '400px', '640px', '768px'], answer: 2, explanation: '1rem = 16px 기준.' },
    { id: 'pj-32-09', type: 'mcq', source: '헤더 3종', question: 'TopUtilityHeader 에서 i > 0 일 때만 구분선을 넣는 이유는?', choices: ['접근성', '애니메이션', '성능', '첫 항목 앞에는 선이 없게 — 항목 "사이"에만'], answer: 3, explanation: '배열 렌더링에서 자주 쓰는 구분자 패턴.' },
    { id: 'pj-32-10', type: 'mcq', source: '헤더 3종', question: '글자 없는 아이콘 검색 버튼을 스크린리더가 "검색"으로 읽게 하는 방법은?', choices: ['title 속성', 'aria-label="검색" + 아이콘 img 는 alt=""', 'placeholder', 'role="img"'], answer: 1, explanation: '장식 이미지는 alt="" 로 건너뛰게.' },
    { id: 'pj-32-11', type: 'mcq', source: '헤더 3종', question: 'sr-only sm:not-sr-only 클래스 조합의 효과는?', choices: ['sm 이상에서 숨김', '항상 숨김', '모바일에선 시각적으로 숨기되 스크린리더엔 남기고, sm 이상에선 보임', '항상 보임'], answer: 2, explanation: 'display: none 과 달리 sr-only 는 보조기기에 읽혀요.' },
    { id: 'pj-32-12', type: 'mcq', source: 'AiSearchHero.tsx', question: '추천 칩을 누르면 입력창 글자가 바뀌는 이유는?', choices: ['defaultValue', 'ref', 'DOM 직접 수정', 'input 이 query 상태에 묶인 제어 컴포넌트라 setQuery(chip) 이 반영됨'], answer: 3, explanation: 'value={query} + onChange 패턴.' },
    { id: 'pj-32-13', type: 'mcq', source: 'AiSearchHero.tsx', question: '폼 안 음성인식 버튼에 type="button" 을 명시하지 않으면?', choices: ['기본값 submit 이라 누르면 폼이 제출됨', '버튼이 안 보임', '에러', '문제없음'], answer: 0, explanation: 'form 안 button 의 기본 type 은 submit.' },
    { id: 'pj-32-14', type: 'mcq', source: 'FeatureBanners.tsx', question: 'FeatureBanners 가 "다 보이는 화면"인지 판단하는 방법은?', choices: ['useMediaQuery("lg")', 'track.scrollWidth <= track.clientWidth (실제로 넘치지 않음)', 'window.innerWidth', 'User-Agent'], answer: 1, explanation: '브레이크포인트가 바뀌어도 코드를 안 고쳐도 돼요.' },
    { id: 'pj-32-15', type: 'mcq', source: 'FeatureBanners.tsx', question: '넓은 화면에서 ‹ › 를 누르면?', choices: ['아무 일도 없음', '스크롤', '시작 카드를 한 칸씩 회전 (start 변경)', '페이지 이동'], answer: 2, explanation: '5장이 다 보이니 스크롤할 곳이 없어 순서를 돌려요.' },
    { id: 'pj-32-16', type: 'mcq', source: 'FeatureBanners.tsx', question: '카드 한 장 + 간격 너비(step)를 구하는 방법은?', choices: ['getComputedStyle', 'CSS 변수', '고정 픽셀', '두 카드의 offsetLeft 차이'], answer: 3, explanation: 'gap 값이 바뀌어도 자동으로 맞아요.' },
    { id: 'pj-32-17', type: 'mcq', source: 'FeatureBanners.tsx', question: '손가락 스와이프로 넘겨도 "n / 5" 번호가 맞는 이유는?', choices: ['onScroll 에서 scrollLeft / step 을 반올림해 갱신', 'IntersectionObserver', '타이머', '터치 이벤트'], answer: 0, explanation: '끝에 닿으면 마지막 번호로 고정해요.' },
    { id: 'pj-32-18', type: 'mcq', source: 'ShortForm · ProductSection · ProductCard', question: 'ProductSection 이 화살표로 스크롤하는 방법은?', choices: ['상태로 translateX', 'useRef 로 잡은 트랙에 scrollBy({ left: dir * clientWidth, behavior: "smooth" })', 'CSS animation', '라이브러리'], answer: 1, explanation: 'DOM 에 직접 명령해 React 상태가 필요 없어요.' },
    { id: 'pj-32-19', type: 'mcq', source: 'ShortForm · ProductSection · ProductCard', question: '카드 전체를 링크로 만들면서 안에 찜 버튼을 두는 올바른 방법은?', choices: ['div 에 role=link', '<a> 안에 <button>', '링크 ::after 를 카드 전체로 늘리고 버튼만 z-index 로 위에', 'onClick 으로 location 변경'], answer: 2, explanation: '<a> 안 <button> 은 HTML 규칙 위반이에요.' },
    { id: 'pj-32-20', type: 'mcq', source: 'ShortForm · ProductSection · ProductCard', question: 'ShortFormSection 의 다음 버튼이 totalPages 를 넘지 않게 하는 코드는?', choices: ['Math.min(totalPages, p + 1)', 'Math.max(totalPages, p + 1)', '(p + 1) % totalPages', 'p + 1'], answer: 0, explanation: '이전은 Math.max(1, p - 1).' },
  ],
}

export default topic
