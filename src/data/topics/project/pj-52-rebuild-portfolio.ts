import type { Topic } from '../../types'

const topic: Topic = {
  id: 'pj-52-rebuild-portfolio',
  track: 'project',
  group: '다시 만들기',
  title: '07-5. 검색형 포트폴리오 만들기',
  order: 52,
  notionId: '3fadf951bf80810db88df256c20a292c',
  addedAt: '2026-10-15',
  sections: [
    {
      title: '만드는 순서와 데이터',
      code: `export interface PortfolioCase {
  slug: string; type: CaseType; code: string; date: string
  level: Level          // 1~3, 화면에는 안 보임
  title: string; description: string
  metrics: { label: string; value: string }[]
  tags: string[]; keywords: string
  image?: string; href?: string
  links?: { label: string; href: string }[]
  design?: DesignCase
}`,
      points: [
        '순서: 데이터 → 주소 → 검색 화면 → 상세 → 인트로 → 파비콘 — 단계마다 화면에서 확인하며 갈 수 있게',
        'data.ts(472줄) → rank.ts → routes.ts → motion·CaseMeta → SearchBox·SearchHome → SearchResults → PortfolioHeader → PortfolioApp → DesignCaseDetail → EngineeringCaseDetail → IntroMotion → public/',
        '화면보다 데이터 모양을 먼저 — 모든 화면이 이 타입을 보고 그려짐',
        '이미지는 import 해서 넣음 → Vite 가 빌드 때 파일 이름에 해시를 붙여 캐시 문제 없음',
        '처음엔 사례 2~3개만 넣고 시작해도 됨',
      ],
    },
    {
      title: 'rank.ts · routes.ts',
      code: `export function rankCases(cases: PortfolioCase[]) {
  return [...cases].sort((a, b) => b.level - a.level || b.date.localeCompare(a.date))
}`,
      points: [
        'level 3: 실제 문제를 풀었고 결과가 분명한 것 / 2: 의미 있는 설계 판단 / 1: 작은 개선·운영 세팅',
        '작은 작업까지 싣되, 위의 몇 개만 읽어도 핵심이 보이게',
        '레벨 높은 순 → 같으면 최신순 → 날짜까지 같으면 data.ts 순서 (sort 는 안정 정렬)',
        '[...cases].sort: 원본을 복사해서 정렬 — cases.sort() 는 CASES 자체를 바꿈',
        'caseHref(slug) → #/case/{slug}. 검색어·탭을 useState 가 아니라 주소에 두는 게 핵심',
      ],
    },
    {
      title: 'PortfolioApp 조립',
      points: [
        'LayoutGroup 안에 AnimatePresence(인트로) + 헤더/본문 — 인트로 출력의 "jsh." 와 헤더 로고가 같은 layoutId 로 이어짐',
        '인트로 퇴장: exit opacity 0, 0.5초, EASE_OUT, fixed inset-0 z-30',
        'EngineeringCaseDetail 은 lazy — 코드 원문·하이라이터를 열 때만 받음',
        '분기: caseItem 이 있고 design 이 없으면 EngineeringCaseDetail, /case 면 DesignCaseDetail(Design 사례 또는 없는 사례 안내), /search 면 결과, 아니면 홈',
        '상세 화면에서는 그 사례 분류를 헤더 바로가기 activeTab 으로 표시',
        'markIntroSeen 도 try/catch — 기록 못 하면 다음 방문에 한 번 더 보여줄 뿐',
      ],
    },
    {
      title: '사례 상세와 ?raw',
      code: `import yumiClient from '../../../backend/maestro/app/yumi/client.py?raw'

const allLines = sample.source.split('\\n')
const [start, end] = sample.lines ?? [1, allLines.length]
const code = allLines.slice(start - 1, end).join('\\n')`,
      points: [
        'Design 상세: variants·screens·system 중 있는 것만, 이미지 width/height 를 데이터에 넣어 로딩 중 화면이 출렁이지 않게',
        'Front·Back 상세: 저장소의 실제 파일을 Vite ?raw 로 문자열로 불러와 줄 범위만 잘라 prism 으로 색칠 — 복사본이 없어 원본과 어긋나지 않음',
        '필수 ①: vite.config server.fs.allow (없으면 개발 서버 403)',
        '필수 ②: Vercel "Include files outside the root directory in the Build Step" 켜짐 확인 (기본값 켜짐)',
        '원본 파일을 고쳐 줄이 밀리면 lines 도 같이 고쳐야 함',
      ],
    },
    {
      title: '인트로 · 파비콘',
      points: [
        'IntroMotion: 20×7 잔디 → J·S·H (5×7 비트맵 FONT) → 에디터에 print("Hello, jsh. world") 타이핑 → "jsh." 가 헤더 로고로',
        '단계별 시간은 위쪽 TIMING 객체에 모여 있음 (합쳐서 약 4.5초)',
        '아무 키·클릭으로 건너뜀, 같은 탭에선 sessionStorage 로 한 번만, 움직임 줄이기면 아예 건너뜀',
        'public/ 의 favicon.svg·favicon-192.png·apple-touch-icon.png — public 파일은 빌드해도 이름이 안 바뀌고 /favicon.svg 로 그대로 열림',
      ],
    },
  ],
  questions: [
    { id: 'pj-52-01', type: 'mcq', source: '만드는 순서와 데이터', question: '07-5 에서 데이터(data.ts)를 가장 먼저 만드는 이유는?', choices: ['가장 짧아서', '모든 화면이 이 타입을 보고 그려지기 때문 — 데이터 모양을 먼저 정함', '테스트 때문', '규칙'], answer: 1, explanation: '데이터 → 주소 → 화면 순서.' },
    { id: 'pj-52-02', type: 'mcq', source: '만드는 순서와 데이터', question: '이미지를 import 해서 쓰면 Vite 가 해 주는 일은?', choices: ['webp 변환', '압축만', '빌드 때 파일 이름에 해시를 붙여 캐시 문제를 없앰', 'CDN 업로드'], answer: 2, explanation: '내용이 바뀌면 이름도 바뀌어 새로 받아요.' },
    { id: 'pj-52-03', type: 'mcq', source: 'rank.ts · routes.ts', question: 'level 3 사례의 기준은?', choices: ['코드가 긴 것', '디자인 사례', '가장 최근', '실제 문제를 풀었고 결과가 분명한 것'], answer: 3, explanation: '2 는 설계 판단, 1 은 작은 개선·운영 세팅.' },
    { id: 'pj-52-04', type: 'mcq', source: 'rank.ts · routes.ts', question: 'rankCases 의 정렬 순서는?', choices: ['레벨 높은 순 → 같으면 최신순 → 같으면 data.ts 순서', '제목순', '랜덤', '최신순만'], answer: 0, explanation: 'b.level - a.level || b.date.localeCompare(a.date).' },
    { id: 'pj-52-05', type: 'mcq', source: 'rank.ts · routes.ts', question: 'rankCases 가 cases.sort() 대신 [...cases].sort() 를 쓰는 이유는?', choices: ['속도', '원본 CASES 배열이 바뀌지 않게 복사해서 정렬', '타입', '안정 정렬'], answer: 1, explanation: 'toSorted() 와 같은 효과.' },
    { id: 'pj-52-06', type: 'mcq', source: 'rank.ts · routes.ts', question: '날짜까지 같은 사례가 data.ts 순서를 유지하는 이유는?', choices: ['level 때문', '우연', 'Array.prototype.sort 가 안정 정렬이라서', 'id 정렬'], answer: 2, explanation: 'ES2019 부터 sort 는 안정 정렬이 보장돼요.' },
    { id: 'pj-52-07', type: 'mcq', source: 'PortfolioApp 조립', question: 'EngineeringCaseDetail 을 lazy 로 불러오는 이유는?', choices: ['보안', '테스트', 'SEO', '코드 원문·prism 하이라이터가 첫 화면 용량에 들어가지 않게'], answer: 3, explanation: '열 때만 받아요.' },
    { id: 'pj-52-08', type: 'mcq', source: 'PortfolioApp 조립', question: '인트로와 헤더를 LayoutGroup 으로 감싸는 이유는?', choices: ['서로 다른 컴포넌트의 같은 layoutId 요소를 이어 날아가는 애니메이션을 만들려고', '성능', '접근성', '스타일 공유'], answer: 0, explanation: '인트로 "jsh." → 헤더 로고.' },
    { id: 'pj-52-09', type: 'mcq', source: 'PortfolioApp 조립', question: '#/case/{slug} 에서 Front·Back 사례와 Design 사례를 가르는 기준은?', choices: ['slug 접두어', '사례 데이터에 design 필드가 있는지', 'type 필드만', '주소 쿼리'], answer: 1, explanation: 'caseItem && !caseItem.design 이면 EngineeringCaseDetail.' },
    { id: 'pj-52-10', type: 'mcq', source: '사례 상세와 ?raw', question: "import x from './file.py?raw' 의 의미는?", choices: ['바이너리', 'JSON 파싱', '파이썬 실행', '파일 내용을 문자열로 가져옴 (Vite)'], answer: 3, explanation: '코드를 복사해 두지 않아 원본과 어긋나지 않아요.' },
    { id: 'pj-52-11', type: 'mcq', source: '사례 상세와 ?raw', question: 'Vercel 에서 frontend 밖 파일을 ?raw 로 빌드하려면 확인할 설정은?', choices: ['"Include files outside the root directory in the Build Step" (기본 켜짐)', 'Output Directory', 'Node 버전', '환경변수'], answer: 0, explanation: 'Root Directory 가 Portfolio/frontend 라서요.' },
    { id: 'pj-52-12', type: 'mcq', source: '사례 상세와 ?raw', question: '원본 파일을 고쳐 줄이 밀리면 함께 고칠 것은?', choices: ['slug', 'caseDetails 의 lines 줄 범위', 'level', '이미지'], answer: 1, explanation: '잘라 보여주는 범위가 어긋나요.' },
    { id: 'pj-52-13', type: 'mcq', source: '사례 상세와 ?raw', question: 'Design 상세 이미지에 width/height 를 데이터로 넣은 이유는?', choices: ['반응형 불가', 'SEO', '이미지 로딩 중 레이아웃이 출렁이지 않게(공간 미리 확보)', '압축'], answer: 2, explanation: 'CLS(레이아웃 이동) 방지.' },
    { id: 'pj-52-14', type: 'mcq', source: '인트로 · 파비콘', question: '인트로 단계별 시간을 바꾸려면 어디를 보나?', choices: ['index.css', 'data.ts', 'motion.ts', 'IntroMotion.tsx 위쪽 TIMING 객체'], answer: 3, explanation: '합치면 약 4.5초.' },
    { id: 'pj-52-15', type: 'mcq', source: '인트로 · 파비콘', question: 'public/favicon.svg 를 빌드하면?', choices: ['이름이 바뀌지 않고 /favicon.svg 로 그대로 열림', '삭제', '번들에 인라인', '해시가 붙음'], answer: 0, explanation: 'public 은 그대로 복사돼요.' },
  ],
}

export default topic
