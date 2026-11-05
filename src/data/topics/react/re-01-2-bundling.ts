import type { Topic } from '../../types'

const topic: Topic = {
  id: 're-01-2-bundling',
  track: 'react',
  group: '01. React 시작하기',
  title: '1-2. 모듈과 번들링: 파일을 묶어서 보내기',
  order: 102,
  notionId: '409df951bf8080af92d9cfc8bd08af30',
  addedAt: '2026-11-05',
  sections: [
    {
      title: '왜 script 태그로 다 붙이지 않을까',
      slides: [
        {
          title: '옛날 방식부터 볼게요',
          blocks: [
            { type: 'say', text: '이번 수업은 "내가 쓴 파일들이 어떻게 브라우저까지 가는지"예요.\n\n처음 자바스크립트를 배울 때는 이렇게 했을 거예요. 파일을 만들고, HTML에 `<script>` 태그로 하나씩 붙이기.' },
            {
              type: 'code',
              code: `<script src="format.js"></script>
<script src="PriceTag.js"></script>
<script src="main.js"></script>`,
            },
            { type: 'say', text: '파일이 3개일 때는 아무 문제 없어요. 그런데 React로 진짜 서비스를 만들면 컴포넌트가 **수백 개**가 돼요. 파일도 수백 개예요.' },
            { type: 'ask', q: '파일 500개를 전부 script 태그로 붙이면 어떤 문제가 생길지 2개만 떠올려 볼래요?', a: '이런 것들이 있어요.\n• 네트워크 요청이 500번 일어나요.\n• 순서를 사람이 맞춰야 해요. A가 B를 쓰면 B가 반드시 먼저 와야 하거든요.\n다음 카드에서 전부 정리해 볼게요.' },
          ],
        },
        {
          title: '파일이 많아지면 생기는 일',
          blocks: [
            {
              type: 'table',
              head: ['문제', '무슨 뜻이냐면'],
              rows: [
                ['요청 폭증', '파일 500개 = 네트워크 요청 500번. 첫 화면이 느려져요'],
                ['순서 지옥', 'A가 B를 쓰면 B의 script가 반드시 먼저 와야 해요. 사람이 순서를 관리해야 해요'],
                ['이름 충돌', '모든 파일이 전역 공간을 같이 써서 같은 이름의 변수가 서로 덮어써요'],
                ['안 쓰는 코드도 다운로드', '필요한 것만 골라 보낼 방법이 없어요'],
                ['JSX를 못 읽음', '브라우저는 JSX를 몰라요. 미리 일반 자바스크립트로 바꿔 줘야 해요'],
              ],
            },
            { type: 'say', text: '그래서 큰 앱은 **파일을 모듈로 나눠 쓰고, 도구로 묶어서(번들링) 보내는 방식**이 사실상 필수예요. 작은 실험은 script 태그로도 되지만요.' },
            { type: 'note', tone: 'warn', text: '예전에는 `<script src="react.js">` 한 줄로 React를 불러올 수 있었어요. 하지만 **React 19부터 그 방식(UMD 빌드)이 없어졌어요.** 잠깐 실험하려면 esm.sh 같은 CDN을 `<script type="module">`로 불러오고, 실무는 처음부터 Vite나 Next.js로 시작해요.' },
          ],
        },
      ],
    },
    {
      title: '모듈과 의존성',
      slides: [
        {
          title: '모듈 = 자기 방이 있는 파일',
          blocks: [
            { type: 'say', text: '**모듈**은 어렵게 생각할 것 없이 **파일 하나**예요. 다만 특별한 점이 하나 있어요.\n\n모듈은 **자기만의 방(스코프)** 을 가져요. 방 안에서 만든 변수와 함수는 밖에서 안 보여요. 밖에 보여 주고 싶은 것만 `export`로 문을 열어 두고, 다른 파일은 `import`로 그걸 가져가요.' },
            { type: 'note', tone: 'analogy', text: '책으로 생각해 보세요. 챕터 파일 하나하나가 모듈이에요. "3장을 이해하려면 2장을 먼저 읽어야 해요" 같은 관계가 **의존성**이고요.' },
            {
              type: 'code',
              code: `// utils/format.js
export function formatPrice(n) {
  return n.toLocaleString('ko-KR') + '원';
}

// components/PriceTag.js  ← format.js에 "의존"
import { formatPrice } from '../utils/format.js';
export default function PriceTag(price) {
  return \`<span>\${formatPrice(price)}</span>\`;
}

// main.js  ← 진입점
import PriceTag from './components/PriceTag.js';
console.log(PriceTag(12000));`,
            },
          ],
        },
        {
          title: '의존성 그래프',
          blocks: [
            { type: 'say', text: '`main.js`에서 시작해서 `import`를 따라가 보면 이렇게 연결돼요.\n\n**main.js → PriceTag.js → format.js**\n\n이렇게 진입 파일부터 import를 따라가며 그린 연결 지도를 **의존성 그래프**라고 해요. 다음 개념에 나오는 번들러는 바로 이 지도를 보고 일해요.' },
            { type: 'ask', q: 'format.js에서 formatPrice 앞의 export를 지우면 어떻게 될까요?', a: '실행하자마자 에러가 나요.\n`SyntaxError: ... does not provide an export named \'formatPrice\'`\n문을 닫아 버렸으니(export를 지웠으니) 다른 모듈은 formatPrice를 못 가져가요. 모듈이 자기만의 방을 가진다는 증거예요.' },
            {
              type: 'table',
              head: ['용어', '한 줄 정의', '코드에서 보이는 모습'],
              rows: [
                ['모듈', '자기만의 스코프를 가진 파일 하나', '`export function …`'],
                ['의존성', '이 모듈은 저 모듈이 있어야 동작한다는 관계', '`import { … } from \'./format.js\'`'],
                ['의존성 그래프', '진입 파일부터 import를 따라간 연결 지도', 'main → PriceTag → format'],
              ],
            },
          ],
        },
      ],
    },
    {
      title: '번들러가 하는 일 4가지',
      slides: [
        {
          title: '번들러 = 제본 기계',
          blocks: [
            { type: 'say', text: '**번들링**은 의존성 그래프를 따라가서 여러 모듈을 **한 개 또는 몇 개 파일로 합치는 작업**이에요. 그걸 해 주는 도구가 **번들러**고요.' },
            { type: 'note', tone: 'analogy', text: '챕터 파일들을 순서대로 엮어서 책 한 권으로 제본하는 기계예요. 독자(브라우저)는 낱장 500장 대신 책 한 권만 받으면 돼요.' },
            { type: 'ask', q: '그래서 "뭐를" 묶는 건데요?', a: '내가 쪼개 놓은 JS·JSX·CSS 파일들, 그리고 `node_modules`에서 가져온 라이브러리(react, react-dom 등)까지 전부요. 이걸 의존 순서대로 엮어요.' },
          ],
        },
        {
          title: '하는 일 4가지',
          blocks: [
            {
              type: 'list',
              ordered: true,
              items: [
                '**합치기**: 의존 순서대로 몇 개 파일로 → 요청 수가 줄고 순서 문제가 사라져요',
                '**트리 셰이킹**: 아무도 import 하지 않는 코드를 빼요 (나무를 흔들어 마른 잎을 떨어뜨리는 것처럼)',
                '**변환**: JSX, TypeScript → 브라우저가 읽는 일반 자바스크립트',
                '**압축 + 파일명 해시**: 공백과 긴 이름을 줄이고, 파일 이름 끝에 내용으로 만든 꼬리표를 붙여요',
              ],
            },
            {
              type: 'code',
              code: `// utils/format.js 에 함수가 2개 있었는데
export function formatPrice(n) { ... }
export function unused() { ... }   // 아무도 import 안 함

// 번들 결과에는 formatPrice만 남고 unused는 사라진다`,
              caption: '트리 셰이킹 예시',
            },
          ],
        },
        {
          title: '파일 이름에 붙는 이상한 글자는 뭐예요?',
          blocks: [
            { type: 'say', text: '빌드하면 `index-CgVI4JUS.js` 같은 이름이 나와요. 뒤에 붙은 `CgVI4JUS`가 **해시**예요. 파일 **내용**으로 계산한 꼬리표라서, 내용이 바뀔 때만 이름이 바뀌어요.' },
            { type: 'ask', q: '이게 왜 좋을까요? 힌트: 브라우저는 한 번 받은 파일을 저장(캐시)해 두고 재사용해요.', a: '이름이 같으면 브라우저는 "이미 있는 파일"이라고 생각하고 저장해 둔 걸 써요.\n코드를 고쳐서 배포하면 해시가 바뀌어 **이름 자체가 달라지니까**, 브라우저가 무조건 새 파일을 받아요. 안 바뀐 파일은 이름도 그대로라 캐시를 계속 써서 빨라요. 캐시를 오래 둬도 안전해지는 거예요.' },
            { type: 'note', tone: 'tip', text: '트리 셰이킹이 가능한 이유는 `import { formatPrice }`처럼 **무엇을 가져오는지가 코드에 고정**돼 있어서예요. 번들러가 실행해 보지 않고도 "unused는 아무도 안 가져가네"를 알 수 있어요. 이 얘기는 1-3 레슨 마지막에 한 번 더 나와요.' },
          ],
        },
      ],
    },
    {
      title: 'Vite와 Next.js 속의 번들러',
      slides: [
        {
          title: 'Vite·Next.js는 번들러인가요?',
          blocks: [
            { type: 'say', text: '정확히 말하면 **번들러 자체는 아니고, 번들러를 품고 있는 도구**예요. 그래서 요즘은 번들러를 직접 설치하고 설정할 일이 거의 없어요. Vite나 Next.js가 안에서 알아서 돌려요.' },
            {
              type: 'table',
              head: ['', 'Vite', 'Next.js'],
              rows: [
                ['정체', '빌드 도구 (개발 서버 + 빌드)', 'React 프레임워크 (라우팅·서버 렌더링·빌드까지)'],
                ['품은 번들러', 'Rolldown (Vite 8부터)', 'Turbopack (16부터 기본)'],
                ['개발 중', '미리 다 묶지 않고 요청된 파일만 그때그때 변환 → 시작이 빠름', '필요한 부분만 점진적으로 번들'],
                ['빌드 결과', '`dist/` 정적 파일 (SPA)', '`.next/` 서버용 + 브라우저용 번들'],
              ],
            },
          ],
        },
        {
          title: '번들러 이름 정리',
          blocks: [
            { type: 'say', text: '이름이 많아서 헷갈리죠. 지금 기준으로 한 번에 정리해 볼게요.' },
            {
              type: 'table',
              head: ['번들러', '한 줄 소개', '2026년 기준 쓰이는 곳'],
              rows: [
                ['webpack', '가장 오래된 대표 번들러, 설정이 많음', '구형 프로젝트, Next.js에서 `--webpack`으로 선택 가능'],
                ['Rollup', '결과물이 깔끔해 라이브러리 배포에 많이 씀', 'Vite 7까지의 빌드 엔진'],
                ['esbuild', 'Go로 만든 아주 빠른 번들러·변환기', 'Vite 7까지 개발 서버 변환'],
                ['Rolldown', 'Rust로 다시 만든 Rollup 호환 번들러', '**Vite 8부터 기본**'],
                ['Turbopack', 'Vercel이 Rust로 만든 번들러', '**Next.js 16부터 기본**'],
              ],
            },
            { type: 'note', tone: 'warn', text: '책에 "번들러 = webpack, Rollup"이라고 나오면 예전 기준이에요. 실제로 Vite 8 프로젝트의 `node_modules`를 열어 보면 rollup·esbuild 대신 rolldown이 들어 있어요.' },
          ],
        },
        {
          title: '코드 스플리팅: 필요할 때만 받기',
          blocks: [
            { type: 'say', text: '앱이 커지면 한 파일로 다 묶는 것도 문제가 돼요. 첫 화면에 필요 없는 페이지까지 다 받아야 하니까요.\n\n그래서 **"이 부분은 필요할 때 따로 받아 와"** 하고 쪼개는 걸 **코드 스플리팅**이라고 해요. React에서는 `lazy`와 동적 `import()`로 해요.' },
            {
              type: 'code',
              code: `import { lazy } from 'react';

// 일반 import → index.js 한 파일 안에 합쳐진다
// import About from './About.jsx';

// 동적 import → About-Crv7eM9I.js 라는 별도 파일로 분리된다
const About = lazy(() => import('./About.jsx'));`,
            },
            { type: 'say', text: '`npm run build`를 해 보면 파일이 하나 더 생겨요. 사용자가 About 페이지로 갈 때 그 조각만 받아 와요.\n\n확인 문제 풀어 볼게요!' },
          ],
        },
      ],
    },
    {
      title: '모듈을 잘 나누는 규칙',
      slides: [
        {
          title: '번들러는 import만 보고 일해요',
          blocks: [
            { type: 'say', text: '번들러는 우리가 적은 `import` 관계만 보고 묶어요. 그래서 **모듈을 어떻게 나누고 연결했는지가 곧 번들 크기, 로딩 속도, 고치기 쉬운 정도**를 정해요.\n\n실무에서 쓰는 규칙 4가지를 알려 드릴게요.' },
            {
              type: 'list',
              ordered: true,
              items: [
                '**컴포넌트 1개 = 파일 1개**, 파일 이름 = 컴포넌트 이름',
                '**import는 한 방향으로**: `pages → features → components → utils`. 아래층(utils)이 위층(pages)을 import 하지 않아요',
                '**모듈 맨 바깥에서 부작용 금지**: 전역 값 바꾸기, fetch 실행 같은 건 함수·훅 안에서만',
                '**무거운 화면·라이브러리는 동적 import로 쪼개기**',
              ],
            },
          ],
        },
        {
          title: '규칙을 어기면 생기는 일',
          blocks: [
            { type: 'ask', q: 'A 파일이 B를 import 하고, B도 A를 import 하면 어떻게 될까요?', a: '이걸 **순환 의존**이라고 해요. 한쪽이 아직 준비가 안 된 상태에서 다른 쪽이 값을 쓰게 돼서, 분명히 export 했는데 `undefined`로 보이는 이상한 버그가 생겨요. 개발 중 자동 새로고침(핫 리로드)도 꼬여요. 규칙 2(한 방향 import)를 지키면 생기지 않아요.' },
            { type: 'ask', q: '규칙 3은 왜 있을까요? 모듈 맨 바깥에 fetch를 적으면?', a: '그 파일을 **import 하기만 해도** fetch가 실행돼요. 쓰지도 않았는데 뭔가 실행되는 예측하기 어려운 코드가 되고, 트리 셰이킹도 "이 파일은 부작용이 있어서 못 빼겠다"며 포기할 수 있어요.' },
            { type: 'note', tone: 'tip', text: '`components/index.js`에서 모든 컴포넌트를 다시 export 하는 파일을 **배럴 파일**이라고 해요. import 경로는 짧아지지만, 번들러가 그 안의 파일을 전부 따라가야 해서 개발 서버가 느려지거나 안 쓰는 코드가 딸려 올 수 있어요. 커지면 직접 경로로 import 하는 게 안전해요.' },
          ],
        },
      ],
    },
  ],
  questions: [
    {
      id: 're01-2-q1',
      source: '왜 script 태그로 다 붙이지 않을까',
      type: 'mcq',
      question: '파일 수백 개를 script 태그로 하나씩 붙일 때 생기는 문제가 아닌 것은?',
      choices: ['네트워크 요청이 파일 수만큼 늘어난다', '파일 순서를 사람이 맞춰야 한다', '같은 이름의 전역 변수가 덮어써진다', '브라우저가 CSS를 읽지 못하게 된다'],
      answer: 3,
      explanation: 'script 태그를 많이 붙인다고 CSS를 못 읽게 되지는 않아요. 요청 폭증, 순서 관리, 전역 이름 충돌, 안 쓰는 코드 다운로드, JSX 변환 불가가 진짜 문제예요.',
    },
    {
      id: 're01-2-q2',
      source: '왜 script 태그로 다 붙이지 않을까',
      type: 'ox',
      question: 'React 19도 <script src="react.js"> 한 줄(UMD 빌드)로 불러와 쓸 수 있다.',
      answer: false,
      explanation: 'React 19부터 UMD 빌드가 없어졌어요. 실험은 esm.sh 같은 ESM CDN을 `<script type="module">`로, 실무는 Vite나 Next.js로 시작해요.',
    },
    {
      id: 're01-2-q3',
      source: '모듈과 의존성',
      type: 'short',
      question: '모듈 안의 함수를 다른 파일에서 import 할 수 있게 "문을 열어 주는" 키워드는?',
      answer: ['export'],
      explanation: '모듈은 자기만의 스코프를 가져서, `export`한 것만 밖에서 `import`로 가져갈 수 있어요.',
    },
    {
      id: 're01-2-q4',
      source: '모듈과 의존성',
      type: 'mcq',
      question: '의존성 그래프에 대한 설명으로 옳은 것은?',
      choices: ['파일 크기를 막대그래프로 그린 것', '진입 파일부터 import를 따라가며 그린 모듈 연결 지도', 'npm 패키지 다운로드 순위', '브라우저가 만든 HTML 태그 트리'],
      answer: 1,
      explanation: '예: main.js → PriceTag.js → format.js. 번들러는 이 지도를 따라가며 파일을 묶어요. HTML 태그 트리는 DOM이에요.',
    },
    {
      id: 're01-2-q5',
      source: '번들러가 하는 일 4가지',
      type: 'mcq',
      question: '트리 셰이킹(tree shaking)이란?',
      choices: ['폴더 구조를 나무 모양으로 정리하는 것', '아무도 import 하지 않는 코드를 번들에서 빼는 것', 'DOM 트리를 다시 그리는 것', '의존성을 최신 버전으로 올리는 것'],
      answer: 1,
      explanation: '나무를 흔들어 마른 잎을 떨어뜨리듯, 쓰이지 않는 export를 결과물에서 빼서 번들을 작게 만들어요.',
    },
    {
      id: 're01-2-q6',
      source: '번들러가 하는 일 4가지',
      type: 'mcq',
      question: '빌드 결과 파일 이름에 index-CgVI4JUS.js 처럼 해시를 붙이는 가장 큰 이유는?',
      choices: ['파일을 암호화해서 코드를 숨기려고', '내용이 바뀔 때만 이름이 바뀌게 해서 브라우저 캐시를 안전하게 쓰려고', '파일 크기를 줄이려고', '검색 엔진 순위를 올리려고'],
      answer: 1,
      explanation: '해시는 파일 내용으로 계산해요. 고치면 이름이 바뀌어 브라우저가 새 파일을 받고, 안 고친 파일은 이름이 그대로라 캐시를 계속 써요.',
    },
    {
      id: 're01-2-q7',
      source: 'Vite와 Next.js 속의 번들러',
      type: 'mcq',
      question: 'Vite 8에서 기본으로 쓰는 번들러는?',
      choices: ['webpack', 'Rollup', 'Rolldown', 'Turbopack'],
      answer: 2,
      explanation: 'Vite 8부터 Rust로 만든 Rolldown이 Rollup과 esbuild를 대신해요. Turbopack은 Next.js 16의 기본이에요.',
    },
    {
      id: 're01-2-q8',
      source: 'Vite와 Next.js 속의 번들러',
      type: 'mcq',
      question: 'const About = lazy(() => import(\'./About.jsx\')) 로 바꾸고 빌드하면 어떻게 될까?',
      choices: ['About 코드가 사라져서 화면에 안 나온다', 'About이 별도 파일로 분리되어 필요할 때만 받아 온다', '모든 파일이 하나로 합쳐진다', '빌드 에러가 난다'],
      answer: 1,
      explanation: '동적 import는 번들러에게 "여기서 쪼개 줘"라는 신호예요. 이걸 코드 스플리팅이라고 해요. 일반 import로 되돌리면 다시 index.js 안으로 합쳐져요.',
    },
    {
      id: 're01-2-q9',
      source: 'Vite와 Next.js 속의 번들러',
      type: 'essay',
      question: '[면접] Vite와 Next.js는 번들러인가요? 차이를 설명해 주세요.',
      answer: '둘 다 번들러 자체라기보다 번들러를 품은 도구입니다. Vite는 개발 서버와 빌드를 담당하는 빌드 도구로, 8버전부터 Rolldown으로 번들링하고 결과물은 정적 SPA 파일입니다. Next.js는 라우팅과 서버 렌더링까지 포함한 React 프레임워크로, 16버전부터 Turbopack이 기본이며 서버용과 브라우저용 번들을 함께 만듭니다.',
      keywords: ['빌드 도구 vs 프레임워크', 'Rolldown', 'Turbopack', 'SPA vs 서버 렌더링'],
      explanation: '"번들러를 품은 도구"라는 한마디와 각각 품은 번들러 이름, 결과물 차이(정적 vs 서버+브라우저)를 말하면 돼요.',
    },
    {
      id: 're01-2-q10',
      source: '모듈을 잘 나누는 규칙',
      type: 'ox',
      question: '아래층 utils 파일이 위층 pages 파일을 import 해도 구조상 문제가 없다.',
      answer: false,
      explanation: 'import는 pages → features → components → utils 한 방향으로만. 거꾸로 import 하면 순환 의존이 생기기 쉽고, 작은 수정이 여기저기를 깨뜨려요.',
    },
    {
      id: 're01-2-q11',
      source: '모듈을 잘 나누는 규칙',
      type: 'mcq',
      question: '모듈 맨 바깥(함수 밖)에 fetch 코드를 두면 생기는 문제는?',
      choices: ['fetch가 절대 실행되지 않는다', '그 파일을 import 하기만 해도 fetch가 실행된다', 'export를 쓸 수 없게 된다', '파일명 해시가 사라진다'],
      answer: 1,
      explanation: 'import는 파일을 실행해요. 맨 바깥 코드는 import 순간 바로 돌아서, 쓰지도 않았는데 요청이 나가는 예측하기 어려운 코드가 돼요. 부작용은 함수·훅 안에 두세요.',
    },
  ],
}

export default topic
