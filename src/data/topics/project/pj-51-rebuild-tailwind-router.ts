import type { Topic } from '../../types'

const topic: Topic = {
  id: 'pj-51-rebuild-tailwind-router',
  track: 'project',
  group: '다시 만들기',
  title: '07-3~4. Tailwind 4 토큰 · 해시 라우터',
  order: 51,
  notionId: '3fadf951bf8081c1a8faf4cadf61ab3c',
  addedAt: '2026-10-15',
  sections: [
    {
      title: '07-3 Tailwind 4 설치와 vite.config',
      notionIds: ['3fadf951bf8081c1a8faf4cadf61ab3c'],
      code: `export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    fs: {
      allow: ['.', '../backend', '../../.github', '../../render.yaml'],
    },
  },
})`,
      points: [
        'Tailwind 4 는 tailwind.config.js·postcss.config.js 가 없음 — Vite 플러그인 하나 + CSS 파일 하나',
        'npm i tailwindcss @tailwindcss/vite 후 plugins 에 tailwindcss()',
        'server.fs.allow: 개발 서버는 기본적으로 frontend 밖 파일을 못 읽음 → 사례 상세가 backend·render.yaml 을 ?raw 로 보여주려고 열어 둠',
      ],
    },
    {
      title: '07-3 @theme 변수 → 클래스 규칙',
      notionIds: ['3fadf951bf8081c1a8faf4cadf61ab3c'],
      points: [
        '--text-32 (+ --line-height) → text-32: 크기·행간·자간이 한 번에',
        '--text-color-main → text-main (글자색에만), --background-color-light → bg-light, --border-color-regular → border-regular',
        '--color-accent → text-/bg-/border-accent 어디에나, --radius-card → rounded-card, --font-weight-semibold → font-semibold',
        '"별표 + initial" (--text-*: initial) 로 기본값을 전부 지움 — 굵기·라운드도 같은 방식',
        '간격(p-6, mt-2, max-w-160)은 지우지 않아 기본 4px 단위 그대로',
        '확인: 빌드 후 grep -o "\\.text-xs" dist/assets/*.css | wc -l → 0',
        '스타일이 안 먹으면: 토큰에 없는 값(text-xl, rounded-lg)인지, tailwindcss() 누락인지, main.tsx 가 index.css 를 import 하는지',
      ],
    },
    {
      title: '07-4 임시 App 으로 라우터 확인',
      notionIds: ['3fadf951bf8081079961eba0fd0458ae'],
      code: `function App() {
  const route = useHashRoute()
  const [path] = route.split('?')
  return (
    <h1 className="mt-2 text-32 font-semibold text-main">
      {path.startsWith('/accio') ? 'Accio' : path.startsWith('/maestro') ? 'Maestro' : '포트폴리오'}
    </h1>
  )
}`,
      points: [
        '아직 화면이 없으니 주소에 따라 제목만 바뀌는 임시 App 으로 확인 — 07-3 토큰도 눈으로 확인',
        '확인: 링크를 누르면 새로고침 없이 제목이 바뀜, 뒤로가기로 이전 제목, #/maestro 에서 새로고침해도 그대로',
        '제목 32px 굵게 + 링크 파란색(#2563eb)이면 토큰이 동작하는 것',
        '최종 App.tsx 는 PortfolioApp·accio/routes·maestro/routes 가 생긴 뒤(07-5·07-6·07-9)에 바꿈',
        '최종 확인: Network 탭에서 #/accio 로 갈 때 AccioApp 조각이 그때 내려오고, build 출력에 AccioApp-xxxx.js·MaestroApp-xxxx.js 가 따로',
      ],
    },
  ],
  questions: [
    { id: 'pj-51-01', type: 'mcq', source: '07-3 Tailwind 4 설치와 vite.config', question: 'Tailwind 4 를 Vite 에 붙이는 데 필요한 것은?', choices: ['Babel 플러그인', 'tailwind.config.js + postcss.config.js', 'Vite 플러그인 tailwindcss() + CSS 파일의 @import "tailwindcss"', 'CDN 스크립트'], answer: 2, explanation: '설정 파일이 사라진 게 Tailwind 4 의 큰 변화.' },
    { id: 'pj-51-02', type: 'mcq', source: '07-3 Tailwind 4 설치와 vite.config', question: 'server.fs.allow 에 ../backend 등을 넣은 이유는?', choices: ['보안 강화', '배포', '빌드 속도', '개발 서버가 frontend 밖 파일을 ?raw 로 읽을 수 있게'], answer: 3, explanation: 'Vite 개발 서버는 기본적으로 루트 밖 접근을 막아요.' },
    { id: 'pj-51-03', type: 'mcq', source: '07-3 @theme 변수 → 클래스 규칙', question: '--background-color-light 로 생기는 클래스는?', choices: ['bg-light (배경에만)', 'border-light', 'light', 'text-light'], answer: 0, explanation: '네임스페이스가 적용 대상을 정해요.' },
    { id: 'pj-51-04', type: 'mcq', source: '07-3 @theme 변수 → 클래스 규칙', question: '"--text-*: initial" 에서 지우지 않은 기본 스케일은?', choices: ['글자 크기', '간격(p-6, mt-2 같은 4px 단위)', '굵기', '라운드'], answer: 1, explanation: '크기·굵기·라운드만 토큰으로 제한했어요.' },
    { id: 'pj-51-05', type: 'mcq', source: '07-3 @theme 변수 → 클래스 규칙', question: '07-3 완료를 빌드 결과로 확인하는 방법은?', choices: ['콘솔 로그', 'dist 용량', 'dist CSS 에서 .text-xs 가 0개인지 grep', 'lint 결과'], answer: 2, explanation: '기본 크기가 사라졌다는 증거.' },
    { id: 'pj-51-06', type: 'mcq', source: '07-3 @theme 변수 → 클래스 규칙', question: 'className="rounded-lg" 가 안 먹을 때 가장 먼저 의심할 것은?', choices: ['React 버그', '폰트', '브라우저 캐시', '토큰에 없는 값 — --radius-*: initial 로 일부러 지움'], answer: 3, explanation: 'rounded-card 같은 토큰을 써야 해요.' },
    { id: 'pj-51-07', type: 'mcq', source: '07-4 임시 App 으로 라우터 확인', question: '07-4 에서 임시 App 을 먼저 만드는 이유는?', choices: ['최종 App 이 아직 없는 파일을 import 하므로, 라우터·토큰만 먼저 확인하려고', '성능', '테스트 도구 요구', '최종 App 이 불필요해서'], answer: 0, explanation: '각 단계에서 눈으로 확인하고 넘어가는 가이드 원칙.' },
    { id: 'pj-51-08', type: 'mcq', source: '07-4 임시 App 으로 라우터 확인', question: '#/maestro 에서 새로고침해도 Maestro 가 유지되는 이유는?', choices: ['localStorage', '# 뒤는 서버로 가지 않아 index.html 을 받은 뒤 해시를 다시 읽어서', '서비스 워커', 'Vercel 설정'], answer: 1, explanation: '정적 호스팅에서 404 가 안 나는 이유.' },
    { id: 'pj-51-09', type: 'mcq', source: '07-4 임시 App 으로 라우터 확인', question: '최종 App 으로 바꾼 뒤 코드 분할이 됐는지 확인하는 방법은?', choices: ['콘솔', 'lint', 'build 출력에 AccioApp-xxxx.js·MaestroApp-xxxx.js 가 따로 있는지, Network 탭에서 그 주소로 갈 때 내려오는지', 'tsc'], answer: 2, explanation: 'lazy() 가 별도 청크를 만들어요.' },
  ],
}

export default topic
