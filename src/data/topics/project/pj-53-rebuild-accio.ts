import type { Topic } from '../../types'

const topic: Topic = {
  id: 'pj-53-rebuild-accio',
  track: 'project',
  group: '다시 만들기',
  title: '07-6~7. Accio 쇼핑몰 만들기 · accio-v1 정적 빌드',
  order: 53,
  notionId: '3fadf951bf808158a803ecf230d148ce',
  addedAt: '2026-10-15',
  sections: [
    {
      title: '07-6 Accio 만드는 순서',
      notionIds: ['3fadf951bf808158a803ecf230d148ce'],
      points: [
        '공통 틀 → 데이터 → 홈 섹션 → 서브 페이지 순서',
        'routes.ts 먼저 — 07-4 최종 App.tsx 가 import. 처음 만든다면 LEGACY_ROUTES 는 빈 객체 {} 로 둬도 됨',
        'Container·layout.ts·PageLayout 공통 틀, 반응형은 모바일 먼저(기본 = 휴대폰, sm 태블릿, lg 데스크톱)',
        '① 헤더·푸터(모든 화면 공통) ② ProductCard ③ 홈 섹션(AiSearchHero → FeatureBanners → ShortForm → ProductSection → BrandSection) ④ AccioApp 조립 ⑤ 서브 페이지 8개',
        '화면 수가 적어 라우터 대신 if 문 — 서브 페이지를 만들 때마다 AccioApp 에 한 줄씩',
        '반복 패턴: 파생 값은 저장하지 않는다 (CartPage 합계), 선택은 Set',
        '확인: #/accio 홈, 서브 페이지 8개, 수량 변경 시 합계 즉시 변경, 폭을 줄이면 모바일 레이아웃, 옛 주소 #/cart 도 열림',
      ],
    },
    {
      title: '07-7 accio-v1 정적 빌드',
      notionIds: ['3fadf951bf80814bbc4bc3104ba2387a'],
      code: `MSYS_NO_PATHCONV=1 npx vite build --mode v1 --base=/accio-v1/ \\
  --outDir ../../Portfolio/frontend/public/accio-v1 --emptyOutDir
rm -rf ../../Portfolio/frontend/public/accio-v1/Fonts`,
      points: [
        '노션만으로 재현할 수 없는 단계 — 원본 소스(add_/)는 백엔드·.env 가 섞여 git 에서 뺐고 빌드 결과만 저장소에',
        '서버가 닫힌 팀 프로젝트 v1 을 원본의 목 모드로 정적 빌드해 public/accio-v1/ 에 → /accio-v1/ 주소에서 별도 앱처럼 열림',
        '노션만 볼 땐 public/accio-v1/(index.html + assets 12개)을 통째로 복사',
        '--base=/accio-v1/: HTML 이 JS·CSS 를 /accio-v1/assets/ 에서 찾게 — 빠뜨리면 하얀 화면',
        '--mode v1: .env.v1 을 읽음 → VITE_API_URL 을 상대 경로 /api 로 두어 원본 목업이 요청을 받음',
        '--emptyOutDir: frontend 폴더 밖에 출력하므로 예전 파일을 지우려면 꼭 명시',
        'add_/ 는 git 이 안 보므로 소스만 고치면 아무것도 안 올라감 — 빌드해서 public/accio-v1 이 바뀌어야 커밋할 게 생김',
        'Fonts 폴더 삭제: CSS 가 이미 번들한 폰트의 중복본',
      ],
    },
  ],
  questions: [
    { id: 'pj-53-01', type: 'mcq', source: '07-6 Accio 만드는 순서', question: 'Accio 를 만들 때 헤더·푸터를 먼저 만드는 이유는?', choices: ['모든 화면에 공통으로 들어가서', '데이터가 없어서', '규칙', '가장 쉬워서'], answer: 0, explanation: '그다음 재사용되는 ProductCard.' },
    { id: 'pj-53-02', type: 'mcq', source: '07-6 Accio 만드는 순서', question: '처음부터 새로 만든다면 LEGACY_ROUTES 는?', choices: ['필수', '빈 객체 {} 로 둬도 됨 — 옛 주소가 없으니까', '삭제 불가', 'Vercel 설정으로'], answer: 1, explanation: 'Accio 가 사이트 전체였던 시절 주소 호환용.' },
    { id: 'pj-53-03', type: 'mcq', source: '07-6 Accio 만드는 순서', question: 'AccioApp 이 라우터 라이브러리 대신 if 문으로 화면을 고르는 이유는?', choices: ['SSR', '라이브러리 금지', '화면 수가 적어서 충분', '성능'], answer: 2, explanation: '서브 페이지마다 한 줄씩 더하면 돼요.' },
    { id: 'pj-53-04', type: 'mcq', source: '07-6 Accio 만드는 순서', question: '합계를 useState 로 따로 두면 생기는 문제는?', choices: ['렌더 불가', '타입 오류', '없음', '수량을 바꿀 때마다 합계도 고쳐야 하고, 빠뜨리면 숫자가 어긋남'], answer: 3, explanation: '계산할 수 있는 값은 계산해요.' },
    { id: 'pj-53-05', type: 'mcq', source: '07-7 accio-v1 정적 빌드', question: 'accio-v1 원본 소스가 저장소에 없는 이유는?', choices: ['백엔드·.env 가 섞여 있어 git 에서 뺌 — 빌드 결과만 저장소에', '라이선스', '삭제됨', '용량'], answer: 0, explanation: '노션만으로 재현할 수 없는 단계예요.' },
    { id: 'pj-53-06', type: 'mcq', source: '07-7 accio-v1 정적 빌드', question: 'vite build 에 --base=/accio-v1/ 을 빠뜨리면?', choices: ['정상', 'HTML 이 /assets/ 에서 JS·CSS 를 찾다 실패해 하얀 화면', '빌드 실패', '404 페이지'], answer: 1, explanation: '하위 경로에 배포할 땐 base 가 필요해요.' },
    { id: 'pj-53-07', type: 'mcq', source: '07-7 accio-v1 정적 빌드', question: '--mode v1 의 효과는?', choices: ['소스맵', '개발 모드', '.env.v1 을 읽어 VITE_API_URL 을 /api 로 — 원본 목업이 요청을 받게', '압축'], answer: 2, explanation: '닫힌 서버 대신 목 모드.' },
    { id: 'pj-53-08', type: 'mcq', source: '07-7 accio-v1 정적 빌드', question: '--emptyOutDir 를 꼭 명시해야 하는 이유는?', choices: ['보안', '용량', '속도', '출력 폴더가 프로젝트 밖이라 Vite 가 기본으로 비우지 않아 예전 파일이 남아서'], answer: 3, explanation: '프로젝트 루트 밖 outDir 은 안전을 위해 기본으로 안 지워요.' },
    { id: 'pj-53-09', type: 'mcq', source: '07-7 accio-v1 정적 빌드', question: 'add_/frontend 소스만 고치고 커밋하면?', choices: ['add_/ 는 gitignore 라 아무것도 안 올라감 — 빌드해서 public/accio-v1 이 바뀌어야 함', '에러', '자동 빌드', '반영된다'], answer: 0, explanation: '수정 → 빌드 → public 커밋 순서.' },
    { id: 'pj-53-10', type: 'mcq', source: '07-7 accio-v1 정적 빌드', question: 'Git Bash 에서 이 빌드 명령 앞에 MSYS_NO_PATHCONV=1 을 붙이는 이유는?', choices: ['속도', '권한', '/accio-v1/ 인자가 윈도 경로로 바뀌지 않게', '인코딩'], answer: 2, explanation: '07-0 준비물에서 예고한 부분.' },
  ],
}

export default topic
