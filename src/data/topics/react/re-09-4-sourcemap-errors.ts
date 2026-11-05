import type { Topic } from '../../types'

const topic: Topic = {
  id: 're-09-4-sourcemap-errors',
  track: 'react',
  group: '09. 빌드와 번들러',
  title: '9-4. 소스맵과 빌드 에러 해결',
  order: 904,
  addedAt: '2026-11-06',
  sections: [
    {
      title: '소스맵',
      slides: [
        {
          title: '압축된 코드에서 에러가 나면',
          blocks: [
            { type: 'say', text: '9장 마지막 수업이에요. 배포한 사이트에서 에러가 났어요. 콘솔을 보니 이래요.' },
            { type: 'code', code: `TypeError: Cannot read properties of undefined (reading 'title')
    at e (index-CP7plaov.js:1:48213)` },
            { type: 'say', text: '`index-CP7plaov.js`의 **1번째 줄 48,213번째 글자**. 빌드하면서 코드를 압축해 한 줄로 만들고 변수 이름도 `e`처럼 줄였거든요(1-2). 이걸로는 내 코드 어디인지 알 수가 없어요.\n\n**소스맵(source map)** 은 "압축된 코드의 이 위치 = 원래 코드의 `CourseCard.tsx` 23번째 줄"이라는 **대응표**예요.' },
            { type: 'note', tone: 'analogy', text: '책을 요약본으로 줄여 놓고, 요약본 몇 쪽이 원본 몇 쪽인지 적어 둔 **색인표**예요. 요약본에서 오타를 발견하면 색인표를 보고 원본을 찾아가 고쳐요.' },
          ],
        },
        {
          title: '켜는 법과 보안',
          blocks: [
            {
              type: 'table',
              head: ['설정 (Vite `build.sourcemap`)', '결과'],
              rows: [
                ['`false` (기본)', '소스맵 없음'],
                ['`true`', '`.js.map` 파일을 만들고, JS 끝에 위치를 적어 둠 → 누구나 개발자 도구에서 원본 코드를 볼 수 있음'],
                ["`'hidden'`", '`.map` 파일은 만들지만 JS에 위치를 안 적음 → 브라우저에는 안 보임'],
              ],
            },
            { type: 'ask', q: '배포 사이트에 소스맵을 그대로 올리면 어떤 걱정이 있을까요?', a: '누구나 **원래 소스 코드를 읽을 수 있어요.** 프론트 코드는 어차피 브라우저로 가니 완전한 비밀은 아니지만, 주석·내부 API 구조·로직이 훨씬 읽기 쉽게 드러나요.\n그래서 실무에서는 `hidden`으로 만들고 `.map` 파일은 **에러 모니터링 도구(Sentry 등)에만 올려요.** 에러가 나면 도구가 대응표로 원래 위치를 보여 주고, 사용자는 소스맵을 못 받아요.' },
          ],
        },
      ],
    },
    {
      title: '경로와 대소문자 에러',
      slides: [
        {
          title: '내 컴퓨터에선 되는데 CI에서 실패해요',
          blocks: [
            { type: 'say', text: '빌드 에러 중 가장 억울한 유형이에요.' },
            { type: 'code', code: `[vite]: Rolldown failed to resolve import "./components/courseCard" from "src/App.tsx".` },
            { type: 'ask', q: '실제 파일 이름은 CourseCard.tsx예요. 내 Windows 컴퓨터에선 잘 되는데 GitHub Actions(리눅스)에서만 실패해요. 왜일까요?', a: 'Windows와 macOS는 기본적으로 파일 이름의 **대소문자를 구분하지 않아요.** `courseCard`라고 써도 `CourseCard.tsx`를 찾아 줘요.\n그런데 리눅스(CI 서버, 배포 서버)는 **구분해요.** `courseCard`라는 파일은 없다고 하죠. import 경로를 파일 이름과 **정확히 같게** 써야 해요.' },
          ],
        },
        {
          title: '경로 에러 확인 순서',
          blocks: [
            {
              type: 'list',
              ordered: true,
              items: [
                '**대소문자**가 파일 이름과 정확히 같은가?',
                '`@/` 같은 **별칭**이 tsconfig와 vite.config **둘 다**에 설정돼 있나? (2-3)',
                '파일을 옮기거나 이름을 바꾼 뒤 **git이 이름 변경을 알고 있나?** (대소문자만 바꾸면 git이 모를 때가 있음 → `git mv`)',
                '패키지라면 **설치돼 있나?** (dependencies에 있나, `npm ci`를 했나)',
              ],
            },
            { type: 'note', tone: 'tip', text: 'CI(자동 빌드)를 리눅스에서 돌리는 이유 중 하나가 이거예요. 배포 서버와 같은 환경에서 미리 터뜨려 보는 거죠.' },
          ],
        },
      ],
    },
    {
      title: 'ESM과 CommonJS 에러',
      slides: [
        {
          title: '두 모듈 방식이 부딪힐 때',
          blocks: [
            { type: 'say', text: '1-3에서 ESM(import)과 CommonJS(require)를 배웠죠. 둘이 섞이면 이런 에러가 나요.' },
            {
              type: 'table',
              head: ['에러', '원인', '해결'],
              rows: [
                ['`does not provide an export named \'default\'`', 'CommonJS 라이브러리를 `import X from` 으로 가져옴', '`import * as X from`, 또는 그 라이브러리의 ESM 버전 사용'],
                ['`require is not defined`', '브라우저용 ESM 코드에서 `require()`를 씀', '`import`로 바꾸기'],
                ['`process is not defined`', 'webpack 4 시절엔 자동으로 넣어 주던 Node 전역(`process`)을 Vite·webpack 5는 안 넣어 줌', '`process.env.X` → `import.meta.env.VITE_X` (9-1)'],
                ['`Cannot use import statement outside a module`', 'Node가 .js 파일을 CommonJS로 읽음', "package.json에 `\"type\": \"module\"` 또는 `.mjs` 확장자"],
              ],
            },
            { type: 'note', tone: 'tip', text: '이런 에러는 대부분 **오래된 라이브러리**나 **webpack에서 옮겨 온 코드**(9-2 마이그레이션)에서 나요. 에러 메시지에 나온 모듈 이름을 보고 "이게 ESM인가 CJS인가"부터 확인하세요.' },
          ],
        },
      ],
    },
    {
      title: '환경 차이로 나는 에러',
      slides: [
        {
          title: '이 프로젝트에서 실제로 있었던 일',
          blocks: [
            { type: 'say', text: '이 앱(remind)을 만들면서 실제로 있었던 빌드 에러를 보여 줄게요. `npm run build`가 이렇게 실패했어요.' },
            { type: 'code', code: `> node scripts/check-content.ts
TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts"` },
            { type: 'say', text: '콘텐츠 검사 스크립트가 `.ts` 파일인데, 이 컴퓨터의 **Node 22.17**은 .ts 파일을 그냥 실행하지 못했어요. Node는 22.18부터 타입을 지우고 바로 실행하는 기능이 기본으로 켜졌거든요. 다른 사람 컴퓨터(더 새 Node)에선 잘 됐을 거예요.\n\n해결은 `node --experimental-strip-types scripts/check-content.ts`처럼 그 기능을 켜는 옵션을 package.json 스크립트에 넣는 거였어요. 지금 package.json에 그 옵션이 들어 있어요.' },
          ],
        },
        {
          title: '환경 차이 막기',
          blocks: [
            {
              type: 'table',
              head: ['차이', '증상', '막는 법'],
              rows: [
                ['**Node 버전**', '어떤 컴퓨터에서만 문법·기능 에러', '`.nvmrc`, package.json `engines`로 버전 고정, CI도 같은 버전'],
                ['**패키지 버전**', '어제 되던 빌드가 오늘 실패', 'lock 파일 커밋 + `npm ci` (5-3)'],
                ['**환경변수**', 'CI에서만 `undefined`', 'CI 비밀값 설정, zod로 시작할 때 검사 (8-5)'],
                ['**메모리**', '`JavaScript heap out of memory`', '`NODE_OPTIONS=--max-old-space-size=4096`, 번들 줄이기'],
              ],
            },
          ],
        },
      ],
    },
    {
      title: '빌드 에러 디버깅 순서',
      slides: [
        {
          title: '당황하지 말고 이 순서대로',
          blocks: [
            {
              type: 'list',
              ordered: true,
              items: [
                '**첫 번째 에러부터** 읽어요. 아래쪽 에러들은 대부분 첫 에러 때문에 줄줄이 생긴 거예요',
                '에러 메시지의 **파일 이름·줄 번호·모듈 이름**을 찾아요',
                '**깨끗한 상태로 재현**해요: `node_modules`를 지우고 `npm ci` → 다시 빌드. 캐시 문제면 여기서 사라져요',
                '**언제부터** 안 됐는지 찾아요: 어제 커밋은 되나? `git log`, lock 파일 변경을 확인',
                '에러 메시지를 **그대로** 검색하거나 AI에게 물어요. 단, 버전(Vite 8, Node 22 등)을 꼭 같이 알려 줘요',
              ],
            },
            { type: 'note', tone: 'tip', text: '해결하면 **기록**해요. 무슨 에러, 원인, 해결, 다음에 막는 법. 이게 공고의 "빌드 관련 문제를 해결해본 경험"을 이력서와 면접에서 **구체적으로** 말할 수 있게 해 주는 재료예요. 방금 본 Node 22.17 사례처럼요.' },
            { type: 'say', text: '9장 끝! 이제 빌드가 실패해도 겁먹지 않고 원인을 좁혀 갈 수 있어요. 다음 10장은 모노레포와 Micro Frontend예요. 마지막 확인 문제 가요.' },
          ],
        },
      ],
    },
  ],
  questions: [
    {
      id: 're09-4-q1',
      source: '소스맵',
      type: 'mcq',
      question: '소스맵(source map)의 역할은?',
      choices: ['코드를 압축한다', '압축된 코드의 위치를 원래 소스 코드의 파일·줄로 대응시킨다', '이미지를 최적화한다', '타입을 검사한다'],
      answer: 1,
      explanation: '배포된 압축 코드에서 난 에러를 원래 코드 위치로 찾아가게 해 주는 대응표예요.',
    },
    {
      id: 're09-4-q2',
      source: '소스맵',
      type: 'mcq',
      question: '원본 코드를 사용자에게 노출하지 않으면서 에러 위치는 추적하고 싶다. 가장 알맞은 방법은?',
      choices: ['sourcemap: true로 배포', "sourcemap: 'hidden'으로 만들고 .map 파일은 에러 모니터링 도구에만 올린다", '소스맵을 아예 안 만든다', '코드를 압축하지 않는다'],
      answer: 1,
      explanation: 'hidden은 JS에 소스맵 위치를 적지 않아 브라우저가 못 받고, 도구만 대응표를 써요.',
    },
    {
      id: 're09-4-q3',
      source: '경로와 대소문자 에러',
      type: 'mcq',
      question: 'Windows에서는 빌드되는데 리눅스 CI에서 "failed to resolve import ./components/courseCard"가 난다. 파일은 CourseCard.tsx. 원인은?',
      choices: ['리눅스는 파일 이름 대소문자를 구분해서', 'CI가 느려서', 'TypeScript 버전 차이', 'React 버그'],
      answer: 0,
      explanation: 'Windows·macOS는 기본적으로 대소문자를 구분하지 않지만 리눅스는 구분해요. import 경로를 파일 이름과 정확히 맞춰요.',
    },
    {
      id: 're09-4-q4',
      source: 'ESM과 CommonJS 에러',
      type: 'mcq',
      question: 'webpack 4에서 Vite로 옮겼더니 "process is not defined" 에러가 난다. 해결은?',
      choices: ['process 패키지를 전역으로 설치', 'process.env.X를 import.meta.env.VITE_X로 바꾼다', 'Node를 재설치', '브라우저를 바꾼다'],
      answer: 1,
      explanation: 'Vite는 Node 전역 process를 브라우저에 넣어 주지 않아요. 환경변수는 import.meta.env로 읽어요.',
    },
    {
      id: 're09-4-q5',
      source: '환경 차이로 나는 에러',
      type: 'mcq',
      question: '컴퓨터마다 Node 버전이 달라 빌드 결과가 다르다. 막는 방법으로 알맞은 것은?',
      choices: ['.nvmrc나 package.json engines로 Node 버전을 고정하고 CI도 같은 버전을 쓴다', 'node_modules를 커밋한다', '빌드를 안 한다', '전역 설치를 늘린다'],
      answer: 0,
      explanation: '버전을 문서·설정으로 고정하고, 패키지는 lock 파일 + npm ci로 맞춰요.',
    },
    {
      id: 're09-4-q6',
      source: '빌드 에러 디버깅 순서',
      type: 'ox',
      question: '빌드 에러가 여러 개 나오면 맨 마지막 에러부터 고치는 것이 좋다.',
      answer: false,
      explanation: '첫 번째 에러부터 봐요. 뒤의 에러들은 대부분 첫 에러 때문에 줄줄이 생긴 거예요.',
    },
    {
      id: 're09-4-q7',
      source: '빌드 에러 디버깅 순서',
      type: 'essay',
      question: '[면접] 빌드 관련 문제를 해결해 본 경험이나 접근 방법을 말해 주세요.',
      answer: '첫 번째 에러 메시지에서 파일·줄·모듈 이름을 확인하고, node_modules를 지우고 npm ci로 깨끗한 상태에서 재현해 캐시 문제를 먼저 배제합니다. 그다음 언제부터 실패했는지 커밋과 lock 파일 변경으로 범위를 좁힙니다. 흔한 원인은 리눅스 CI의 대소문자 구분, 별칭 설정 누락, ESM과 CommonJS 혼용, Node·패키지 버전 차이, 환경변수 누락입니다. 예를 들어 Node 22.17에서 .ts 스크립트가 실행되지 않던 문제를 --experimental-strip-types 옵션으로 해결했고, 재발을 막으려고 Node 버전과 lock 파일을 고정하고 CI도 같은 환경에서 빌드하도록 했습니다.',
      keywords: ['첫 에러부터', '깨끗한 재현(npm ci)', '범위 좁히기', '대소문자·별칭·ESM/CJS', '버전 고정', '기록'],
      explanation: '접근 순서와 함께 구체적인 사례 하나를 숫자·버전까지 말하면 좋아요.',
    },
  ],
}

export default topic
