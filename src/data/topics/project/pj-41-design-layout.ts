import type { Topic } from '../../types'

const topic: Topic = {
  id: 'pj-41-design-layout',
  track: 'project',
  group: '디자인',
  title: '04-2. 레이아웃 컴포넌트 (Container · PageLayout · BottomSheet · 시안)',
  order: 41,
  notionId: '3f2df951bf80818e87e9dd1199b28087',
  addedAt: '2026-10-15',
  sections: [
    {
      title: 'Container · layout.ts · PageLayout',
      notionIds: ['3f2df951bf8081fd8a42f055a2bbffec', '3f2df951bf8081f08c5dcc6cf109fb35', '3f2df951bf8081ac85dbdc53aa7140ec'],
      code: `export const BLEED_CLASS = '-mx-4 scroll-px-4 px-4 sm:-mx-6 sm:scroll-px-6 sm:px-6 lg:mx-0 lg:scroll-px-0 lg:px-0'
export const CARD_CLASS = 'rounded-card border border-regular bg-white'`,
      points: [
        'Container: 바깥 div = 화면 가장자리 여백(px-4 sm:px-6 lg:px-10), 안쪽 div = max-w-[1200px] + mx-auto. 시안 1280px 기준',
        'className 으로 안쪽에 flex/gap 같은 배치를 덧붙임. 헤더 3종·홈 main·Footer·PageLayout 이 사용',
        'BLEED_CLASS 원리: -mx-4 로 양쪽 16px 밖으로 늘리고, px-4 로 첫 카드는 원래 자리, scroll-px-4 로 스냅 위치도 맞춤 → 카드가 화면 끝까지 끊기지 않고 흐름',
        '문자열 상수로 둔 이유: 다른 클래스와 `${CARD_CLASS} p-6` 처럼 섞어 쓰기 편해서',
        'PageLayout: 헤더 3종 + 회색 배경 + 제목/설명/aside + 카드 본문. narrow 면 읽기 폭 880px',
        'children + 선택 props 로 레이아웃만 맡는 "레이아웃 컴포넌트" 패턴. ListPage·DetailPage 는 모양이 달라 안 씀',
      ],
    },
    {
      title: 'maestro/components.tsx',
      notionIds: ['3f2df951bf80818e87e9dd1199b28087'],
      points: [
        'Screen: MobileFrame(375×812) + 서버 깨움 안내 띠 + 본문 — 모든 화면의 최상위',
        'ServerWakeNotice: useSyncExternalStore(subscribeServerState, getServerState) → waking 이면 sticky top + aria-live 안내',
        'Footer: sticky bottom-0 mt-auto, 홈 인디케이터 자리 34px',
        'BRAND_BUTTON_BASE / _CLASS: 보라 56px 버튼, 라운드·글자 크기는 화면마다 달라 BASE 에 따로',
        'SectionLabel("— SCORE · 10.17 SAT"), StepNav(‹ 뒤로 + 1 / 2), Tag/PartnerTag, PlacePhoto("예시 사진" 라벨)',
      ],
    },
    {
      title: 'BottomSheet 접근성과 드래그',
      notionIds: ['3f2df951bf80818e87e9dd1199b28087'],
      code: `<motion.div drag="y" dragControls={dragControls} dragListener={false}
  dragConstraints={{ top: 0, bottom: 0 }} dragElastic={{ top: 0, bottom: 0.7 }}
  onDragEnd={(_, info) => {
    if (info.offset.y > 100 || info.velocity.y > 500) onClose()
  }}>
  <button aria-label="시트 닫기" className="touch-none cursor-grab"
    onPointerDown={(e) => { dragged.current = false; dragControls.start(e) }}
    onClick={() => !dragged.current && onClose()} />`,
      points: [
        '열 때: 이전 포커스 기억 → 시트로 포커스 이동, Esc 리스너, body overflow hidden(뒤 화면 스크롤 잠금)',
        '닫을 때(cleanup): 리스너 제거, overflow 복구, 원래 자리로 포커스 복귀',
        'role="dialog" + aria-modal + aria-labelledby + tabIndex={-1}',
        'fixed(폰, 화면 전체) / sm:absolute(넓은 화면, 틀 안) — 같은 코드로 두 환경',
        '부모가 onClose 를 useCallback 으로 고정: 의존성 배열에 있어서 매 렌더 새 함수면 effect 가 다시 돌며 포커스가 튐',
        '27941ec: 닫는 방법 4가지 — 배경·Esc·손잡이 누르기·끌어내리기(100px 또는 초속 500px)',
        'dragListener={false}: 손잡이에서만 드래그 시작 → 시트 안 세로 스크롤·카드 스와이프와 충돌 방지',
        'dragElastic 아래만 0.7: 덜 끌고 놓으면 스프링처럼 제자리. touch-none 으로 브라우저가 스크롤로 가로채지 않게',
        '포커스 트랩(Tab 이 시트 밖으로 못 나가게)은 아직 없음 — 개선 과제',
      ],
    },
    {
      title: 'design_import/ (시안 파일)',
      notionIds: ['3f2df951bf8081dab782ea49e28667c4'],
      points: [
        '코드가 아니라 디자인 참고 자료 — Portfolio/frontend 밖이라 앱 빌드에 포함 안 됨',
        'Accio Redesign.dc.html: 리디자인 시안을 한 캔버스에 모은 HTML (홈·목록·상세·장바구니·마이페이지·배송·고객센터·대시보드·리뷰)',
        'support.js 는 "GENERATED ... do not edit" — 자동 생성 런타임이라 읽을 필요 없음',
        '"대시보드", "오늘의 타임특가"는 시안에만 있고 코드로는 아직 없음',
        '시안의 굵기 800 은 코드 토큰(최대 600)으로 옮기며 정리됨',
      ],
    },
  ],
  questions: [
    { id: 'pj-41-01', type: 'mcq', source: 'Container · layout.ts · PageLayout', question: 'Container 를 div 두 겹으로 만든 이유는?', choices: ['스타일 우선순위', '바깥은 화면 가장자리 여백, 안쪽은 최대 폭 1200px + 가운데 정렬로 역할 분리', 'SEO', '애니메이션'], answer: 1, explanation: '배경은 화면 전체, 콘텐츠만 제한.' },
    { id: 'pj-41-02', type: 'mcq', source: 'Container · layout.ts · PageLayout', question: 'BLEED_CLASS 에서 -mx-4 와 px-4 를 같이 쓰는 이유는?', choices: ['스크롤 방지', '상쇄돼서 의미 없음', '트랙은 화면 끝까지 늘리면서 첫 카드는 원래 콘텐츠 시작선에 맞추려고', '중앙 정렬'], answer: 2, explanation: '스와이프하면 카드가 가장자리까지 끊기지 않고 흘러요.' },
    { id: 'pj-41-03', type: 'mcq', source: 'Container · layout.ts · PageLayout', question: 'BLEED_CLASS 의 scroll-px-4 역할은?', choices: ['패딩 제거', '속도', '스크롤바 폭', '스크롤 스냅 위치도 콘텐츠 여백에 맞춤'], answer: 3, explanation: 'snap 이 화면 끝(0px)이 아니라 16px 안쪽에 멈추게.' },
    { id: 'pj-41-04', type: 'mcq', source: 'Container · layout.ts · PageLayout', question: 'CARD_CLASS 를 컴포넌트가 아니라 문자열 상수로 둔 이유는?', choices: ['다른 클래스와 `${CARD_CLASS} p-6` 처럼 섞어 쓰기 편해서', 'Tailwind 규칙', '타입', '성능'], answer: 0, explanation: '태그 종류(div, section, article)도 자유.' },
    { id: 'pj-41-05', type: 'mcq', source: 'Container · layout.ts · PageLayout', question: 'PageLayout 같은 "레이아웃 컴포넌트" 패턴의 특징은?', choices: ['데이터를 직접 fetch', 'children + 선택 props 로 틀만 맡고 내용은 호출하는 쪽이 채움', '상태가 많음', '전역 스타일'], answer: 1, explanation: 'narrow·aside 같은 옵션만 받아요.' },
    { id: 'pj-41-06', type: 'mcq', source: 'maestro/components.tsx', question: 'Maestro Footer 가 sticky bottom-0 mt-auto 인 효과는?', choices: ['고정 높이', '항상 맨 위', '내용이 짧으면 맨 아래로 밀리고, 길면 스크롤해도 화면 아래에 붙어 있음', '숨김'], answer: 2, explanation: 'mt-auto 는 flex 컬럼에서 남는 공간을 위로 밀어요.' },
    { id: 'pj-41-07', type: 'mcq', source: 'maestro/components.tsx', question: 'ServerWakeNotice 가 서버 상태를 읽는 방법은?', choices: ['Context', '폴링', 'props', 'useSyncExternalStore(subscribeServerState, getServerState)'], answer: 3, explanation: 'api.ts 의 모듈 변수를 구독해요.' },
    { id: 'pj-41-08', type: 'mcq', source: 'BottomSheet 접근성과 드래그', question: 'BottomSheet 를 열 때 하는 일이 아닌 것은?', choices: ['서버에 열림 기록', '이전 포커스 기억', '시트로 포커스 이동', 'body 스크롤 잠금'], answer: 0, explanation: '닫을 때는 반대로 복구하고 포커스를 되돌려요.' },
    { id: 'pj-41-09', type: 'mcq', source: 'BottomSheet 접근성과 드래그', question: '시트를 닫으면 원래 버튼으로 포커스를 돌려주는 이유는?', choices: ['디자인', '키보드·스크린리더 사용자가 어디 있었는지 잃지 않게', '성능', '필수 아님'], answer: 1, explanation: '모달 접근성의 기본이에요.' },
    { id: 'pj-41-10', type: 'mcq', source: 'BottomSheet 접근성과 드래그', question: 'onClose 를 부모가 useCallback 으로 고정해야 하는 이유는?', choices: ['메모리', '애니메이션', '타입', 'effect 의존성이라 매 렌더 새 함수면 effect 가 다시 돌며 포커스가 튀어서'], answer: 3, explanation: 'PlanScreen 의 closeSheet 가 그 예.' },
    { id: 'pj-41-11', type: 'mcq', source: 'BottomSheet 접근성과 드래그', question: 'dragListener={false} + useDragControls 조합의 목적은?', choices: ['손잡이에서만 드래그를 시작해 시트 안 스크롤·카드 스와이프와 충돌하지 않게', '가로 드래그', '속도 제한', '드래그 금지'], answer: 0, explanation: '손잡이 onPointerDown 에서 controls.start(e).' },
    { id: 'pj-41-12', type: 'mcq', source: 'BottomSheet 접근성과 드래그', question: 'dragElastic={{ top: 0, bottom: 0.7 }} 의 효과는?', choices: ['위로만 늘어남', '위로는 안 올라가고 아래로만 고무줄처럼 늘어남', '양쪽 고정', '무한 드래그'], answer: 1, explanation: 'dragConstraints 0/0 으로 원래 자리에 묶어둬요.' },
    { id: 'pj-41-13', type: 'mcq', source: 'BottomSheet 접근성과 드래그', question: '손잡이에 touch-none(touch-action: none) 을 준 이유는?', choices: ['접근성', '터치 막기', '손가락을 움직일 때 브라우저가 페이지 스크롤로 가로채지 않게', '확대 방지만'], answer: 2, explanation: '드래그 제스처를 JS 가 받게 해요.' },
    { id: 'pj-41-14', type: 'mcq', source: 'BottomSheet 접근성과 드래그', question: 'BottomSheet 에 아직 없는 접근성 기능은?', choices: ['포커스 복귀', 'Esc 로 닫기', 'aria-modal', '포커스 트랩 (Tab 이 시트 밖으로 못 나가게)'], answer: 3, explanation: '면접 "아쉬운 점"에도 나와요.' },
    { id: 'pj-41-15', type: 'mcq', source: 'design_import/ (시안 파일)', question: 'design_import/ 폴더가 앱 빌드에 포함되지 않는 이유는?', choices: ['Portfolio/frontend 밖에 있어서', '용량', '자동 삭제', 'gitignore'], answer: 0, explanation: 'Vite 는 프론트 폴더에서 import 를 따라가요.' },
    { id: 'pj-41-16', type: 'mcq', source: 'design_import/ (시안 파일)', question: '시안에 있던 굵기 800 은 코드에서 어떻게 됐나?', choices: ['그대로 800', '토큰 최대값 600 으로 정리', '700', '삭제'], answer: 1, explanation: '굵기는 400·500·600 세 개만 허용해요.' },
  ],
}

export default topic
