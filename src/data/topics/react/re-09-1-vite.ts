import type { Topic } from '../../types'

const topic: Topic = {
  id: 're-09-1-vite',
  track: 'react',
  group: '09. 빌드와 번들러',
  title: '9-1. Vite 깊이 보기: 개발 서버와 빌드',
  order: 901,
  addedAt: '2026-11-05',
  sections: [
    {
      title: '개발과 빌드는 다르게 동작해요',
      slides: [
        {
          title: 'Vite가 빠른 이유',
          blocks: [
            { type: 'say', text: '9장은 공고의 "**Webpack, Vite 등 번들러를 직접 구성하거나, 빌드 관련 문제를 해결해본 경험**"이에요. 1-2에서 번들러가 하는 일 4가지를 배웠죠. 이번엔 한 단계 들어가서 **직접 설정하고 고치는** 법이에요.\n\n먼저 Vite가 왜 빠른지부터요. Vite는 **개발할 때와 빌드할 때 완전히 다르게** 동작해요.' },
            {
              type: 'table',
              head: ['', '개발 (`npm run dev`)', '빌드 (`npm run build`)'],
              rows: [
                ['내 코드', '**묶지 않음.** 브라우저가 요청하는 파일만 그때그때 변환해서 줌 (네이티브 ESM)', 'Rolldown으로 **묶고** 압축·해시'],
                ['node_modules 라이브러리', '처음 한 번 **미리 묶어 둠** (사전 번들링, `node_modules/.vite`)', '같이 묶음'],
                ['타입 검사', '**안 함** (변환만)', '`tsc -b`가 따로 함 (package.json 스크립트)'],
                ['목표', '시작·수정 반영이 빠르게', '사용자가 받는 파일이 작고 빠르게'],
              ],
            },
          ],
        },
        {
          title: '개발 서버는 타입 에러를 몰라요',
          blocks: [
            { type: 'ask', q: 'npm run dev에서는 잘 돌아가는데 npm run build를 하면 타입 에러로 실패해요. 왜 그럴까요?', a: 'Vite 개발 서버는 빠르려고 TypeScript를 **타입 검사 없이 JS로 변환만** 해요. 그래서 타입이 틀려도 화면은 떠요. 빌드 스크립트(`tsc -b && vite build`)에서야 진짜 타입 검사를 하니까 그때 에러가 나는 거예요.\n에디터의 빨간 줄을 무시하지 않거나, 커밋 전에 `tsc --noEmit`을 돌리는 습관이 필요해요.' },
            { type: 'note', tone: 'tip', text: '이 앱의 `npm run build`는 `콘텐츠 검사 → tsc -b → vite build` 세 단계예요. 하나라도 실패하면 빌드가 멈춰요. CI에서도 이 순서 그대로 돌리면 "개발에선 됐는데" 사고를 막아요.' },
          ],
        },
      ],
    },
    {
      title: 'vite.config 읽기',
      slides: [
        {
          title: '자주 만지는 설정',
          blocks: [
            {
              type: 'code',
              code: `import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],                          // JSX 변환, Fast Refresh
  base: '/',                                   // 배포 경로 (하위 폴더에 올리면 '/app/')
  resolve: { tsconfigPaths: true },            // 2-3: @/ 절대 경로
  server: {
    port: 5173,
    proxy: { '/api': 'http://localhost:8000' } // 5-4: 개발용 프록시
  },
  build: {
    outDir: 'dist',
    sourcemap: true,                           // 9-4에서 배워요
  },
});`,
            },
            { type: 'say', text: '1~5장에서 하나씩 나왔던 설정들이 한 파일에 모였어요. **plugins**가 Vite의 핵심이에요. Vite 자체는 작고, React·Tailwind·PWA 같은 기능은 전부 플러그인으로 붙여요.' },
          ],
        },
        {
          title: 'base를 틀리면 하얀 화면',
          blocks: [
            { type: 'say', text: '배포했더니 하얀 화면만 나와요. 개발자 도구 Network를 보면 JS 파일이 전부 404예요. 아주 흔한 사고예요.' },
            { type: 'ask', q: '사이트를 `https://me.github.io/remind/`처럼 하위 폴더에 올렸는데 base가 기본값 "/"이면 무슨 일이 생길까요?', a: '빌드된 HTML이 JS를 `/assets/index-xxx.js`(도메인 맨 앞)에서 찾아요. 그런데 실제 파일은 `/remind/assets/...`에 있죠. 그래서 404가 나고 하얀 화면이에요. `base: \'/remind/\'`로 맞춰 주면 돼요. 라우터에도 같은 base(basename)를 알려 줘야 하고요.' },
          ],
        },
      ],
    },
    {
      title: '환경변수와 모드',
      slides: [
        {
          title: '.env 파일',
          blocks: [
            {
              type: 'table',
              head: ['파일', '언제 읽나'],
              rows: [
                ['`.env`', '항상'],
                ['`.env.development`', '`vite` (개발 서버)'],
                ['`.env.production`', '`vite build`'],
                ['`.env.local`', '항상 + **git에 올리지 않음** (내 컴퓨터 전용 비밀값)'],
              ],
            },
            { type: 'code', code: `# .env.production
VITE_API_URL=https://api.mysite.com

// 코드에서
const base = import.meta.env.VITE_API_URL;
const isProd = import.meta.env.PROD;    // 빌드면 true
const mode = import.meta.env.MODE;      // 'development' | 'production' | ...` },
          ],
        },
        {
          title: '빌드할 때 글자로 박혀요',
          blocks: [
            { type: 'say', text: '중요한 사실: `import.meta.env.VITE_API_URL`은 실행할 때 읽는 게 아니라 **빌드할 때 그 자리에 글자로 박혀요.** 빌드 결과 JS를 열어 보면 `"https://api.mysite.com"`이 그대로 들어 있어요.' },
            { type: 'list', items: ['그래서 5-3에서 말했듯 `VITE_` 값은 **누구나 볼 수 있어요.** 비밀값 금지', '배포 후에 서버 주소를 바꾸려면 **다시 빌드**해야 해요. 환경변수만 바꾸고 재시작해도 안 바뀌어요', '`VITE_`가 안 붙은 변수는 아예 코드에 안 들어가요 (그래서 undefined로 나와 당황하는 일이 많아요)'] },
            { type: 'note', tone: 'warn', text: '"배포 서버의 환경변수를 바꿨는데 화면에 반영이 안 돼요" → CSR 앱에서는 정상이에요. 빌드 때 이미 박혔거든요. Next.js의 서버 쪽 `process.env`는 실행할 때 읽지만, `NEXT_PUBLIC_`은 Vite처럼 빌드 때 박혀요.\n\n수업 끝! 확인 문제 가요.' },
          ],
        },
      ],
    },
  ],
  questions: [
    {
      id: 're09-1-q1',
      source: '개발과 빌드는 다르게 동작해요',
      type: 'mcq',
      question: 'Vite 개발 서버가 빠르게 시작하는 이유로 옳은 것은?',
      choices: ['처음에 앱 전체를 한 파일로 묶어 두어서', '내 코드는 묶지 않고 브라우저가 요청하는 파일만 그때그때 변환해서', '타입 검사를 미리 끝내 두어서', '서버 렌더링을 해서'],
      answer: 1,
      explanation: '개발 중에는 네이티브 ESM으로 필요한 파일만 변환해요. node_modules만 처음에 미리 묶어 둬요.',
    },
    {
      id: 're09-1-q2',
      source: '개발과 빌드는 다르게 동작해요',
      type: 'ox',
      question: 'npm run dev(Vite 개발 서버)는 TypeScript 타입 에러가 있으면 화면을 띄우지 않는다.',
      answer: false,
      explanation: '개발 서버는 타입 검사 없이 변환만 해요. 타입 검사는 빌드 스크립트의 tsc가 따로 해요.',
    },
    {
      id: 're09-1-q3',
      source: 'vite.config 읽기',
      type: 'mcq',
      question: 'https://me.github.io/remind/ 에 배포했더니 JS 파일이 404로 하얀 화면이다. 가장 먼저 확인할 vite 설정은?',
      choices: ['server.port', "base (예: '/remind/')", 'plugins', 'build.sourcemap'],
      answer: 1,
      explanation: '하위 폴더에 올리면 base를 그 경로로 맞춰야 파일 주소가 맞아요.',
    },
    {
      id: 're09-1-q4',
      source: '환경변수와 모드',
      type: 'short',
      question: 'git에 올리지 않는 내 컴퓨터 전용 비밀값을 두는 Vite env 파일 이름은?',
      answer: ['.env.local', 'env.local'],
      explanation: '.env.local은 항상 읽히지만 .gitignore에 들어가 있어서 저장소에 안 올라가요.',
    },
    {
      id: 're09-1-q5',
      source: '환경변수와 모드',
      type: 'mcq',
      question: 'Vite CSR 앱을 배포한 뒤 서버의 VITE_API_URL 환경변수만 바꾸고 재시작했다. 화면은?',
      choices: ['바로 새 주소를 쓴다', '바뀌지 않는다 (빌드할 때 값이 코드에 글자로 박혔으므로 다시 빌드해야 함)', '에러가 난다', '절반만 바뀐다'],
      answer: 1,
      explanation: 'import.meta.env.VITE_ 값은 빌드 때 치환돼요. 값을 바꾸려면 다시 빌드해야 해요.',
    },
    {
      id: 're09-1-q6',
      source: '환경변수와 모드',
      type: 'ox',
      question: 'Vite에서 VITE_로 시작하지 않는 환경변수도 import.meta.env로 브라우저 코드에서 읽을 수 있다.',
      answer: false,
      explanation: 'VITE_ 접두사가 붙은 것만 코드에 들어가요. 실수로 비밀값이 노출되지 않게 막는 규칙이에요.',
    },
  ],
}

export default topic
