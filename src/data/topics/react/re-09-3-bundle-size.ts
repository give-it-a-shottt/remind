import type { Topic } from '../../types'

const topic: Topic = {
  id: 're-09-3-bundle-size',
  track: 'react',
  group: '09. 빌드와 번들러',
  title: '9-3. 번들 크기 줄이기',
  order: 903,
  addedAt: '2026-11-06',
  sections: [
    {
      title: '번들 크기는 왜 중요할까',
      slides: [
        {
          title: '다운로드만의 문제가 아니에요',
          blocks: [
            { type: 'say', text: '이번 수업은 "사이트가 느려요"를 번들러 쪽에서 고치는 법이에요.\n\nJS 파일이 크면 다운로드만 오래 걸리는 게 아니에요. 브라우저는 받은 JS를 **읽고(파싱), 실행하고**, SSR이면 **하이드레이션**(6-2)까지 해야 해요. 이미지 1MB와 JS 1MB는 무게가 달라요. JS는 받은 뒤에도 CPU를 많이 써서, 느린 휴대폰에서는 몇 초씩 멈춰요.' },
            { type: 'list', ordered: true, items: ['다운로드 (네트워크)', '파싱·컴파일 (CPU)', '실행', '하이드레이션 (SSR이면)', '→ 이제야 버튼이 눌림'] },
          ],
        },
        {
          title: '이 앱의 진짜 빌드 결과',
          blocks: [
            { type: 'say', text: '지금 보고 있는 이 앱(remind)을 `npm run build`하면 이렇게 나와요.' },
            {
              type: 'code',
              code: `dist/assets/index-xxxx.js      69 kB │ gzip:  20 kB   ← 앱 코드
dist/assets/vendor-xxxx.js    259 kB │ gzip:  82 kB   ← react, react-dom, router
dist/assets/content-xxxx.js 1,065 kB │ gzip: 336 kB   ← 문제·수업 데이터 전부

(!) Some chunks are larger than 500 kB after minification.`,
              caption: '지금 이 수업 카드들이 들어 있는 게 content 파일이에요',
            },
            { type: 'ask', q: 'content 파일이 1MB나 되는 이유가 뭘까요? 그리고 홈 화면을 처음 열 때 이게 다 필요할까요?', a: '모든 트랙의 모든 토픽(문제 1,300개 이상, 수업 카드 수백 장)이 **한 파일**에 들어 있어서예요. 이 수업도 그 안에 있죠.\n홈 화면은 트랙 목록과 통계만 보여 주니까 수업 내용 전체가 필요하진 않아요. 그런데 지금은 처음부터 다 받아요. 이게 오늘 배울 "줄일 수 있는 곳"이에요.' },
            { type: 'note', tone: 'tip', text: '**gzip** 크기가 실제로 네트워크로 오가는 크기예요. 서버가 압축해서 보내거든요. 하지만 브라우저는 압축을 푼 뒤 원래 크기(1,065 kB)만큼 파싱해야 해요. 둘 다 봐야 해요.' },
          ],
        },
      ],
    },
    {
      title: '번들 분석하기',
      slides: [
        {
          title: '감으로 줄이지 말고 먼저 보기',
          blocks: [
            { type: 'say', text: '줄이기 전에 **무엇이 큰지** 봐야 해요. 감으로 하면 엉뚱한 걸 줄여요. 번들 분석 도구는 번들 안을 **사각형 지도(트리맵)** 로 보여 줘요. 사각형이 클수록 큰 파일이에요.' },
            {
              type: 'table',
              head: ['번들러', '분석 도구'],
              rows: [
                ['Vite', '`rollup-plugin-visualizer` (빌드하면 stats.html 생성)'],
                ['webpack', '`webpack-bundle-analyzer`'],
                ['Next.js', '`@next/bundle-analyzer`'],
              ],
            },
            { type: 'code', code: `// vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [react(), visualizer({ open: true, gzipSize: true })],   // 빌드 후 지도가 열림
});` },
          ],
        },
        {
          title: '지도에서 찾는 것',
          blocks: [
            {
              type: 'list',
              items: [
                '**예상보다 큰 라이브러리**: 날짜 하나 포맷하려고 넣은 라이브러리가 200 kB',
                '**두 번 들어간 라이브러리**: 같은 라이브러리의 다른 버전이 둘 다 들어 있음',
                '**첫 화면에 필요 없는 큰 덩어리**: 차트, 에디터, 지도, 관리자 화면',
                '**데이터 파일**: 이 앱의 content처럼 코드가 아닌 데이터',
              ],
            },
            { type: 'note', tone: 'tip', text: '분석 → 줄이기 → **다시 빌드해서 숫자로 확인**. 이 순서를 지켜요. "줄였을 것 같다"가 아니라 "content가 1,065 kB → 120 kB가 됐다"처럼 말할 수 있어야 해요. 면접에서 이런 숫자가 정말 강해요.' },
          ],
        },
      ],
    },
    {
      title: '청크 나누기',
      slides: [
        {
          title: '이 앱이 이미 하고 있는 것',
          blocks: [
            { type: 'say', text: '이 앱의 `vite.config.ts`를 열어 보면 이런 설정이 있어요.' },
            {
              type: 'code',
              code: `build: {
  rolldownOptions: {
    output: {
      // 문제 데이터는 자주 바뀌고 크므로 앱 코드와 분리해 캐시 효율을 높인다
      codeSplitting: {
        groups: [
          { name: 'content', test: /src[\\\\/]data[\\\\/]topics/ },
          { name: 'vendor', test: /node_modules/ },
        ],
      },
    },
  },
},`,
            },
            { type: 'say', text: '파일 경로에 따라 **덩어리(청크)** 를 나눠요. 수업 데이터는 content로, 라이브러리는 vendor로. 왜 나눌까요?' },
          ],
        },
        {
          title: '나누는 목적은 캐시',
          blocks: [
            {
              type: 'table',
              head: ['청크', '얼마나 자주 바뀌나', '나눠서 얻는 것'],
              rows: [
                ['vendor (react 등)', '라이브러리를 올릴 때만 (몇 달에 한 번)', '수업을 고쳐도 해시가 그대로 → 브라우저 캐시를 계속 씀 (1-2)'],
                ['content (수업 데이터)', '수업을 추가할 때마다', '앱 코드를 고쳐도 다시 안 받음'],
                ['index (앱 코드)', '기능을 고칠 때', '데이터를 고쳐도 다시 안 받음'],
              ],
            },
            { type: 'ask', q: '그럼 청크를 나누면 처음 방문한 사람이 받는 양도 줄어들까요?', a: '**아니요.** 처음 방문한 사람은 셋 다 받아야 해서 총량은 같아요. 나누기는 **재방문**할 때 바뀐 것만 다시 받게 하는 **캐시 전략**이에요.\n첫 방문 양을 줄이려면 **필요할 때 받기**(5-2의 레이지 로딩, 동적 import)가 필요해요. 이 앱이라면 "트랙을 열 때 그 트랙 수업만 import" 하도록 바꾸면 홈 화면의 content 다운로드가 크게 줄어요.' },
            { type: 'note', tone: 'warn', text: '청크를 **너무 잘게** 나누면 요청이 수십 개로 늘어나서 오히려 느려질 수 있어요. "같이 바뀌고 같이 쓰이는 것끼리" 묶는 게 기준이에요.' },
          ],
        },
      ],
    },
    {
      title: '트리 셰이킹이 안 되는 경우',
      slides: [
        {
          title: '하나만 썼는데 전부 딸려 와요',
          blocks: [
            { type: 'say', text: '1-2에서 "안 쓰는 export는 트리 셰이킹으로 빠진다"고 했죠. 그런데 실무에서는 **빠져야 할 게 안 빠지는** 경우가 많아요.' },
            {
              type: 'table',
              head: ['원인', '예', '해결'],
              rows: [
                ['**CommonJS** 라이브러리 (1-3)', "`import _ from 'lodash'` → 전체 70 kB", "ESM 버전 `lodash-es`, 또는 `import debounce from 'lodash/debounce'`"],
                ['**부작용 있는 모듈**', '모듈 맨 바깥에서 전역을 바꾸는 코드 (1-2 규칙 3)', "라이브러리 package.json의 `\"sideEffects\": false`가 있어야 안심하고 뺌"],
                ['**배럴 파일**', "`import { Button } from '@/components'` (index.ts가 전부 re-export)", '직접 경로로 import'],
                ['**큰 라이브러리 통째로**', '아이콘 수천 개 묶음을 통째로 import', '쓰는 아이콘만 개별 import'],
              ],
            },
          ],
        },
        {
          title: '가벼운 대안 찾기',
          blocks: [
            { type: 'say', text: '분석 지도에서 큰 라이브러리를 찾았으면 **더 가벼운 대안**이 있는지 봐요.' },
            {
              type: 'list',
              items: [
                '날짜: `moment`(크고 트리 셰이킹 안 됨) → `date-fns`, `dayjs`, 또는 브라우저 내장 `Intl.DateTimeFormat`',
                '요청: `axios` → 내장 `fetch` (5-3)',
                '깊은 복사: 라이브러리 → 내장 `structuredClone` (2-1)',
                '고유 id: 라이브러리 → 내장 `crypto.randomUUID()`',
              ],
            },
            { type: 'say', text: '5-3의 공급망 공격 얘기 기억나요? **내장 기능으로 바꾸면 번들도 줄고 보안 위험도 줄어요.** 일석이조예요.\n\n수업 끝! 확인 문제 가요.' },
          ],
        },
      ],
    },
  ],
  questions: [
    {
      id: 're09-3-q1',
      source: '번들 크기는 왜 중요할까',
      type: 'ox',
      question: 'JS 1MB와 이미지 1MB는 다운로드 시간이 같으면 사용자 경험에 주는 영향도 같다.',
      answer: false,
      explanation: 'JS는 받은 뒤에도 파싱·실행·하이드레이션에 CPU를 많이 써요. 느린 기기에서 JS가 훨씬 무거워요.',
    },
    {
      id: 're09-3-q2',
      source: '번들 크기는 왜 중요할까',
      type: 'mcq',
      question: 'Vite 빌드 결과의 "gzip: 336 kB"가 뜻하는 것은?',
      choices: ['파일의 원래 크기', '서버가 압축해서 실제로 네트워크로 보내는 크기', '파싱에 걸리는 시간', '캐시 크기'],
      answer: 1,
      explanation: '네트워크 전송은 압축 크기, 브라우저가 파싱하는 건 원래 크기예요. 둘 다 봐야 해요.',
    },
    {
      id: 're09-3-q3',
      source: '번들 분석하기',
      type: 'mcq',
      question: '번들을 줄이기 전에 가장 먼저 할 일은?',
      choices: ['느낌상 큰 라이브러리를 지운다', '번들 분석 도구로 무엇이 큰지 지도(트리맵)로 확인한다', '모든 파일을 lazy로 바꾼다', 'gzip을 끈다'],
      answer: 1,
      explanation: '분석 → 줄이기 → 다시 빌드해서 숫자로 확인 순서예요.',
    },
    {
      id: 're09-3-q4',
      source: '청크 나누기',
      type: 'mcq',
      question: 'vendor(라이브러리)와 앱 코드를 다른 청크로 나누는 주된 목적은?',
      choices: ['첫 방문 다운로드 총량을 줄이려고', '자주 안 바뀌는 vendor의 해시를 유지해 재방문 때 브라우저 캐시를 쓰게 하려고', '타입 검사를 빠르게 하려고', 'CORS를 피하려고'],
      answer: 1,
      explanation: '나누기는 캐시 전략이에요. 첫 방문 총량은 같고, 첫 방문을 줄이려면 레이지 로딩이 필요해요.',
    },
    {
      id: 're09-3-q5',
      source: '청크 나누기',
      type: 'ox',
      question: '청크는 잘게 나눌수록 항상 빨라진다.',
      answer: false,
      explanation: '너무 잘게 나누면 요청 수가 늘어 오히려 느려질 수 있어요. 같이 바뀌고 같이 쓰이는 것끼리 묶어요.',
    },
    {
      id: 're09-3-q6',
      source: '트리 셰이킹이 안 되는 경우',
      type: 'mcq',
      question: "import _ from 'lodash' 로 debounce 하나만 썼는데 번들에 lodash 전체가 들어갔다. 이유와 해결은?",
      choices: ['Vite 버그 → 재설치', 'lodash가 CommonJS라 트리 셰이킹이 안 됨 → lodash-es나 lodash/debounce로 import', 'TypeScript 때문 → any로', '해결 방법 없음'],
      answer: 1,
      explanation: 'CommonJS는 정적 분석이 어려워 통째로 들어가요(1-3). ESM 버전이나 개별 경로로 가져와요.',
    },
    {
      id: 're09-3-q7',
      source: '트리 셰이킹이 안 되는 경우',
      type: 'short',
      question: '라이브러리가 "모듈을 import만 해도 생기는 부작용이 없으니 안 쓰는 건 빼도 된다"고 알리는 package.json 필드 이름은?',
      answer: ['sideEffects', '"sideEffects"', 'sideEffects: false'],
      explanation: '"sideEffects": false가 있으면 번들러가 안 쓰는 모듈을 안심하고 빼요.',
    },
  ],
}

export default topic
