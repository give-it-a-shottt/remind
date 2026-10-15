import type { Topic } from '../../types'

const topic: Topic = {
  id: 'pj-11-build-config',
  track: 'project',
  group: '배포',
  title: '01-2. 프론트 빌드 설정 (package.json · vite · tsconfig · eslint)',
  order: 11,
  notionId: '3f2df951bf8081b5aa90dce471c374c6',
  addedAt: '2026-10-15',
  sections: [
    {
      title: 'package.json',
      notionId: '3f2df951bf8081b5aa90dce471c374c6',
      points: [
        'scripts: dev = vite(5173), build = tsc -b && vite build, lint = eslint ., preview = vite preview(dist 미리보기)',
        '"type": "module" → .js 파일을 ES 모듈(import/export)로 해석',
        '^4.3.3 은 4.x 안 최신 허용, ~6.0.2 는 6.0.x 만 허용',
        '라우터·상태관리 라이브러리가 없다 → 직접 만든 훅으로 해결',
        'test 스크립트 없음 — 프론트 자동 테스트는 아직 없음',
      ],
    },
    {
      title: 'vite.config.ts',
      notionId: '3f2df951bf8081eaabbefe50949a2b0a',
      code: `export default defineConfig({
  plugins: [react(), tailwindcss()],
})`,
      points: [
        'react(): JSX 변환 + Fast Refresh (저장하면 상태 유지한 채 화면만 교체)',
        'tailwindcss(): @import "tailwindcss" 와 @theme 처리, 실제로 쓴 클래스만 CSS 로',
        'VITE_ 로 시작하는 변수는 별도 설정 없이 import.meta.env 로 들어옴',
        'base 설정이 없음 → 도메인 루트(/) 배포 전제. Vercel 은 루트 배포라 문제 없음',
      ],
    },
    {
      title: 'index.html',
      notionId: '3f2df951bf8081d9bbdfdd99e313e816',
      points: [
        '브라우저가 가장 먼저 받는 파일: 빈 div#root + <script type="module" src="/src/main.tsx"> 뿐 (SPA)',
        'Pretendard 가변 폰트 dynamic-subset — 필요한 글자만 나눠 받음',
        'Google Fonts &text=A — "A 한 글자"만 요청해 폰트 파일이 수십 바이트로',
        'vite build 가 script 태그를 /assets/index-해시.js 로 바꿔 dist/index.html 에 씀',
      ],
    },
    {
      title: 'tsconfig 3종',
      notionId: '3f2df951bf808152a5e3f826bd7e033c',
      points: [
        'tsconfig.json: files: [] + references 로 app·node 두 프로젝트를 묶음. tsc -b 가 참조를 따라 둘 다 검사',
        'tsconfig.app.json (src 전용): types ["vite/client"], moduleResolution "bundler", noEmit',
        'verbatimModuleSyntax: 타입만 가져올 땐 반드시 import type',
        'noUnusedLocals / noUnusedParameters: 안 쓴 변수 하나로 빌드 실패 → Vercel 배포 실패',
        'erasableSyntaxOnly: enum 처럼 런타임 코드가 생기는 TS 문법 금지',
        'tsconfig.node.json: vite.config.ts 전용, types ["node"], module "nodenext"',
      ],
    },
    {
      title: 'eslint.config.js',
      notionId: '3f2df951bf8081ffb375d083030e0b84',
      points: [
        'ESLint 9+ flat config 형식, globalIgnores(["dist"])',
        'js·typescript-eslint recommended + react-hooks(훅은 최상단에서만, useEffect 의존성 검사) + react-refresh(파일이 컴포넌트만 export 하는지)',
        '린트는 build 에 포함돼 있지 않아 린트 에러가 있어도 Vercel 배포는 됨. CI 도 없어 직접 돌려야 함',
      ],
    },
  ],
  questions: [
    { id: 'pj-11-01', type: 'mcq', source: 'package.json', question: '"typescript": "~6.0.2" 가 허용하는 버전 범위는?', choices: ['6.x 전부', '6.0.x 만', '정확히 6.0.2 만', '6.0.2 이상 전부'], answer: 1, explanation: '~ 는 패치 버전만, ^ 는 메이저가 같은 범위까지 허용해요.' },
    { id: 'pj-11-02', type: 'mcq', source: 'package.json', question: 'npm run preview 가 하는 일은?', choices: ['개발 서버 실행', '빌드 결과(dist)를 로컬에서 미리보기', '타입 검사', '배포'], answer: 1, explanation: 'dev 는 소스를, preview 는 빌드 결과를 서빙해요.' },
    { id: 'pj-11-03', type: 'mcq', source: 'package.json', question: 'package.json 의 "type": "module" 의 의미는?', choices: ['TypeScript 사용', '.js 파일을 ES 모듈(import/export)로 해석', '모듈 번들링 끔', 'CommonJS 강제'], answer: 1, explanation: '없으면 .js 는 require 기반 CommonJS 로 해석돼요.' },
    { id: 'pj-11-04', type: 'mcq', source: 'vite.config.ts', question: '@vitejs/plugin-react 의 Fast Refresh 란?', choices: ['빌드 속도 향상', '파일을 저장하면 상태를 유지한 채 바뀐 컴포넌트만 교체', '이미지 압축', '자동 배포'], answer: 1, explanation: '전체 새로고침 없이 입력값 등이 유지돼요.' },
    { id: 'pj-11-05', type: 'mcq', source: 'vite.config.ts', question: 'Tailwind 플러그인이 만드는 CSS 의 특징은?', choices: ['모든 유틸리티를 다 포함', '코드에서 실제로 쓴 클래스만 생성', 'CSS 를 만들지 않음', '런타임에 생성'], answer: 1, explanation: '그래서 클래스명을 문자열 조합으로 동적으로 만들면 안 잡혀요.' },
    { id: 'pj-11-06', type: 'mcq', source: 'vite.config.ts', question: 'vite.config 에 base 설정이 없다는 것은?', choices: ['빌드 불가', '도메인 루트(/) 배포를 전제로 한다', '상대 경로 사용', 'CDN 사용'], answer: 1, explanation: 'GitHub Pages 처럼 /repo/ 아래 배포하면 base 가 필요해요.' },
    { id: 'pj-11-07', type: 'mcq', source: 'index.html', question: 'Google Fonts URL 에 &text=A 를 붙인 효과는?', choices: ['A 글자만 굵게', '"A" 한 글자 모양만 받아 폰트 파일이 아주 작아짐', '대문자만 받음', '캐시 무효화'], answer: 1, explanation: '로고 한 글자 때문에 폰트 전체를 받지 않는 최적화예요.' },
    { id: 'pj-11-08', type: 'mcq', source: 'index.html', question: '빌드 후 dist/index.html 의 script 는?', choices: ['/src/main.tsx 그대로', '/assets/index-해시.js 로 바뀜', '인라인 스크립트로', '삭제됨'], answer: 1, explanation: 'vite build 가 번들 파일 경로로 바꿔 써 줘요. 해시는 캐시 무효화용.' },
    { id: 'pj-11-09', type: 'mcq', source: 'index.html', question: 'SPA 의 index.html 에 들어 있는 것은?', choices: ['모든 화면의 HTML', '빈 div#root 와 main 스크립트 정도 — 화면은 React 가 그림', '서버 렌더링 결과', 'CSS 전부'], answer: 1, explanation: 'Single Page Application 은 HTML 껍데기 하나에 JS 가 화면을 그려요.' },
    { id: 'pj-11-10', type: 'mcq', source: 'tsconfig 3종', question: 'noEmit: true 인데 JS 파일은 누가 만드나?', choices: ['tsc', 'Vite(vite build)', 'Babel 수동 실행', '만들지 않는다'], answer: 1, explanation: 'tsc 는 타입 검사만, 변환·번들은 Vite 가 해요.' },
    { id: 'pj-11-11', type: 'mcq', source: 'tsconfig 3종', question: 'verbatimModuleSyntax 가 켜져 있으면 타입만 가져올 때 써야 하는 문법은?', choices: ['import * as', 'import type { X }', 'require', 'export type'], answer: 1, explanation: '빌드 시 지워져야 할 import 를 명확히 표시하게 해요.' },
    { id: 'pj-11-12', type: 'mcq', source: 'tsconfig 3종', question: 'erasableSyntaxOnly 가 금지하는 문법의 예는?', choices: ['interface', 'enum', 'type alias', '제네릭'], answer: 1, explanation: 'enum 은 런타임 객체를 만들어 "지우기만으로" JS 가 되지 않아요.' },
    { id: 'pj-11-13', type: 'mcq', source: 'tsconfig 3종', question: '안 쓰는 import 하나를 남기고 push 하면?', choices: ['경고만 뜬다', 'noUnusedLocals 로 tsc -b 실패 → Vercel 배포 실패', '자동 제거', '린트만 실패'], answer: 1, explanation: '그래서 push 전에 npm run build 를 돌려보는 습관이 중요해요.' },
    { id: 'pj-11-14', type: 'mcq', source: 'tsconfig 3종', question: 'tsconfig.node.json 이 담당하는 파일은?', choices: ['src 전체', 'vite.config.ts (Node 에서 도는 설정)', '테스트 파일', 'public 폴더'], answer: 1, explanation: '브라우저 코드와 Node 코드는 타입 환경(DOM vs node)이 달라서 나눠요.' },
    { id: 'pj-11-15', type: 'mcq', source: 'eslint.config.js', question: 'react-hooks 규칙이 잡아내는 것은?', choices: ['CSS 오류', '조건문 안에서 훅 호출, useEffect 의존성 배열 누락', '타입 오류', '번들 크기'], answer: 1, explanation: '훅은 컴포넌트 최상단에서 항상 같은 순서로 불려야 해요.' },
    { id: 'pj-11-16', type: 'mcq', source: 'eslint.config.js', question: '린트 에러가 있는 상태로 push 하면 Vercel 배포는?', choices: ['실패한다', '된다 — 린트가 build 에 포함돼 있지 않아서', '경고 후 중단', '롤백'], answer: 1, explanation: 'CI 도 없어서 린트는 직접 돌려야 해요.' },
  ],
}

export default topic
