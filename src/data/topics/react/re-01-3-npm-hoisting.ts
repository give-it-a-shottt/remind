import type { Topic } from '../../types'

const topic: Topic = {
  id: 're-01-3-npm-hoisting',
  track: 'react',
  group: '01. React 시작하기',
  title: '1-3. npm과 호이스팅',
  order: 103,
  notionId: '409df951bf8080af92d9cfc8bd08af30',
  addedAt: '2026-11-05',
  sections: [
    {
      title: 'npm install 명령어',
      slides: [
        {
          title: 'npm은 개발자용 앱스토어',
          blocks: [
            { type: 'say', text: '이번 수업 앞부분은 npm이에요. React 프로젝트를 만들면 제일 먼저 치는 게 `npm install`이죠.\n\n**npm**은 다른 개발자들이 만든 코드 묶음(**패키지**)을 받아 오는 도구예요.' },
            { type: 'note', tone: 'analogy', text: '휴대폰 앱스토어랑 비슷해요.\n• `package.json` = "이 프로젝트에 필요한 앱 목록" 메모\n• `node_modules/` = 실제로 설치된 앱들이 들어 있는 폴더\n• `package-lock.json` = 정확히 몇 버전을 깔았는지 적힌 영수증' },
            { type: 'ask', q: 'GitHub에 node_modules 폴더는 안 올리는데, 팀원은 어떻게 같은 패키지를 받을까요?', a: '`package.json`(목록)과 `package-lock.json`(영수증)만 올려요. 팀원은 받아서 `npm install`을 치면 목록대로 다시 설치돼요. node_modules는 크기가 엄청 커서 올리지 않아요.' },
          ],
        },
        {
          title: '자주 쓰는 명령 정리',
          blocks: [
            {
              type: 'table',
              head: ['명령', '뜻', '언제 쓰나'],
              rows: [
                ['`npm install` (= `npm i`)', 'package.json에 적힌 걸 전부 설치', '레포를 처음 받았을 때'],
                ['`npm install 패키지`', '이 프로젝트에 설치 → `dependencies`에 기록', '라이브러리 추가'],
                ['`npm install -D 패키지`', '개발할 때만 필요한 도구 → `devDependencies`', 'vite, eslint, typescript'],
                ['`npm install -g 패키지`', '컴퓨터 전체에 설치', '요즘은 잘 안 씀'],
                ['`npx 패키지`', '설치 없이(또는 프로젝트에 있는 걸로) 명령 실행', '일회성 도구 실행'],
                ['`npm ci`', 'package-lock.json 그대로 깨끗하게 설치', 'CI·배포 서버'],
              ],
            },
            { type: 'note', tone: 'tip', text: '`npm install --save 패키지`의 `--save`는 npm 5(2017년)부터 기본값이에요. 안 붙여도 똑같이 dependencies에 기록돼요.' },
          ],
        },
        {
          title: '-g를 덜 쓰는 이유',
          blocks: [
            { type: 'ask', q: '프로젝트 A는 도구 v5가, 프로젝트 B는 v8이 필요해요. -g로 전역 설치하면?', a: '컴퓨터에는 버전이 하나만 깔려요. 둘 중 하나는 맞지 않는 버전으로 돌아가요. 팀원마다 깔린 버전이 달라서 "내 컴퓨터에선 되는데?"도 생기고요.\n그래서 요즘은 프로젝트에 `-D`로 설치하고 `npm run 스크립트`나 `npx`로 실행해요.' },
            { type: 'note', tone: 'warn', text: '책에 나오는 `npx create-react-app`은 **2025년 2월에 공식 지원이 중단**됐어요. 지금은 `npm create vite@latest` 또는 `npx create-next-app@latest`로 시작해요.' },
            { type: 'say', text: 'pnpm, yarn, bun 같은 다른 패키지 매니저도 있어요. 명령 모양만 조금 다르고(`pnpm add -D`처럼) 개념은 똑같아요.' },
          ],
        },
      ],
    },
    {
      title: 'dependencies vs devDependencies',
      slides: [
        {
          title: '딱 하나만 물어보면 돼요',
          blocks: [
            { type: 'say', text: '패키지를 어느 칸에 넣을지 헷갈리면 이 질문 하나만 하세요.\n\n**"앱이 실제로 돌아갈 때 이게 필요한가?"**' },
            {
              type: 'table',
              head: ['패키지', '앱이 돌아갈 때 필요?', '어디에'],
              rows: [
                ['react, react-dom', '네, 화면을 그려요', '`dependencies`'],
                ['next', '네, 서버에서 실행돼요', '`dependencies`'],
                ['vite', '아니요, 개발·빌드할 때만', '`devDependencies`'],
                ['typescript, @types/*', '아니요, 빌드 때 JS로 바뀌면 끝', '`devDependencies`'],
                ['eslint, 테스트 도구', '아니요, 코드 검사용', '`devDependencies`'],
              ],
            },
          ],
        },
        {
          title: '언제 진짜로 중요해질까',
          blocks: [
            { type: 'say', text: '재밌는 사실 하나. **Vite로 만든 프론트엔드 앱은** 번들러가 import 된 것만 묶기 때문에, 이 구분을 틀려도 결과물 크기는 안 바뀌어요.' },
            { type: 'say', text: '그런데 **서버(Node)에서 도는 앱**은 달라요. Next.js 같은 앱을 배포할 때 `npm ci --omit=dev`로 devDependencies를 빼고 설치하는 경우가 많거든요.' },
            { type: 'ask', q: '실행에 꼭 필요한 패키지를 실수로 devDependencies에 넣고 --omit=dev로 배포하면?', a: '배포 서버에는 그 패키지가 설치되지 않아요. 서버를 켜는 순간 "모듈을 찾을 수 없다"는 에러로 죽어요. 그래서 서버에서 도는 앱일수록 구분이 중요해요.' },
          ],
        },
      ],
    },
    {
      title: '호이스팅 (var)',
      slides: [
        {
          title: '퀴즈부터 하나',
          blocks: [
            { type: 'say', text: '이제 자바스크립트 이야기로 넘어갈게요. 먼저 이 코드 결과를 맞혀 보세요.' },
            {
              type: 'code',
              code: `console.log(a);
var a = 1;`,
            },
            { type: 'ask', q: '에러가 날까요, 뭔가 찍힐까요?', a: '에러가 아니라 `undefined`가 찍혀요.\n선언하기도 전에 썼는데 "있긴 한" 것처럼 동작하죠. 이 현상을 **호이스팅(hoisting)** 이라고 불러요.' },
          ],
        },
        {
          title: '실행 전에 이름부터 등록해요',
          blocks: [
            { type: 'say', text: '자바스크립트 엔진은 코드를 바로 한 줄씩 실행하지 않아요. **실행하기 전에 먼저 쭉 훑어서 "이 스코프에 어떤 변수·함수 이름이 있는지"를 등록**해 둬요.\n\n`var`로 선언한 이름은 등록할 때 `undefined`를 넣어 둬요. 그리고 `= 1` 같은 **할당은 원래 자리에서** 실행돼요.' },
            { type: 'note', tone: 'analogy', text: '수업 시작 전에 선생님이 출석부에 학생 이름을 미리 다 적어 두는 것과 같아요. 이름(선언)은 처음부터 있지만, 점수 칸(값)은 아직 비어 있어요(`undefined`). 점수는 수업 중 그 순서가 와야 적혀요(할당).' },
            {
              type: 'code',
              code: `// 엔진이 보는 순서로 풀어 쓰면
var a;            // ← 실행 전에 등록 (값은 undefined)
console.log(a);   // undefined
a = 1;            // ← 할당은 제자리`,
            },
          ],
        },
        {
          title: '"맨 위로 옮긴다"는 말은 반만 맞아요',
          blocks: [
            { type: 'note', tone: 'warn', text: '"호이스팅 = 선언을 맨 위로 옮기는 것"이라고 많이들 말해요. 하지만 엔진이 코드를 **실제로 옮겨 적지는 않아요.** 실행 전에 선언을 미리 등록할 뿐이에요. "옮긴 것처럼 보인다"는 결과를 설명하는 비유예요.' },
            { type: 'ask', q: 'var는 왜 같은 이름을 두 번 선언해도 에러가 없을까요?', a: '언어 규칙(스펙)이 var 중복 선언을 허용해서예요. 등록할 때 같은 이름이 이미 있으면 새로 만들지 않고 그 칸을 재사용해요. 그래서 두 번째 `var a = 2`는 사실상 `a = 2`처럼 동작해요.' },
            {
              type: 'table',
              head: ['순서', '단계', '하는 일'],
              rows: [
                ['①', '파싱', '코드를 읽어 구조로 만들고, 스코프마다 어떤 선언이 있는지 파악 (문법 에러는 여기서 남)'],
                ['②', '컴파일', 'V8 같은 엔진이 실행할 수 있는 형태로 바꿈'],
                ['③', '선언 등록', 'var → undefined, let/const → 초기화 안 된 채로, function → 함수 통째로 등록 **← 호이스팅이 보이는 지점**'],
                ['④', '실행', '위에서 아래로 한 줄씩. 할당은 여기서'],
              ],
            },
            { type: 'say', text: '"호이스팅 단계"라는 공식 이름은 없어요. 호이스팅은 ①에서 분석하고 ③에서 등록한 결과로 생기는 **현상의 별명**이에요. 그리고 ③은 함수가 **호출될 때마다** 그 함수 안에서 다시 일어나요.' },
          ],
        },
      ],
    },
    {
      title: 'let·const와 TDZ',
      slides: [
        {
          title: 'let도 호이스팅돼요. 다만…',
          blocks: [
            { type: 'say', text: '"let과 const는 호이스팅이 안 된다"는 말, 들어 본 적 있죠? **틀린 말이에요.**\n\nlet과 const도 실행 전에 등록돼요. 다만 **값을 넣지 않은(초기화하지 않은) 상태로** 등록돼요. 그래서 선언 줄에 도착하기 전에 쓰면 `undefined`가 아니라 **에러**가 나요.\n\n선언 줄에 도착하기 전까지의 이 구간을 **TDZ**(Temporal Dead Zone, 일시적 사각지대)라고 불러요.' },
            { type: 'note', tone: 'analogy', text: '출석부 비유로 다시 볼게요. let은 이름은 적혀 있는데 옆에 "입장 전, 부르지 마세요" 딱지가 붙어 있어요. 그 학생이 입장(선언 줄 실행)하기 전에 부르면 선생님이 화를 내요(ReferenceError).' },
          ],
        },
        {
          title: '등록돼 있다는 증거',
          blocks: [
            {
              type: 'code',
              code: `let x = '바깥';
{
  console.log(x);   // ReferenceError — '바깥'이 찍히지 않는다!
  let x = '안쪽';
}`,
            },
            { type: 'ask', q: '안쪽 x가 등록되지 않았다면 뭐가 찍혀야 했을까요?', a: "바깥 x의 값 '바깥'이 찍혀야 했어요. 그런데 에러가 났죠. 블록에 들어가는 순간 안쪽 x가 이미 등록돼서 바깥 x를 가렸다는 뜻이에요. 등록은 됐는데 초기화 전이라 에러가 난 거예요." },
            {
              type: 'table',
              head: ['선언', '등록될 때 값', '선언 전에 쓰면', '같은 스코프 중복 선언', '스코프'],
              rows: [
                ['`var`', 'undefined', 'undefined', '허용', '함수'],
                ['`let`', '초기화 안 됨 (TDZ)', 'ReferenceError', 'SyntaxError', '블록'],
                ['`const`', '초기화 안 됨 (TDZ)', 'ReferenceError', 'SyntaxError', '블록'],
                ['`function` 선언문', '함수 통째로', '호출 가능', '허용 (나중 것이 덮어씀)', '함수'],
                ['`var f = function(){}`', 'var 규칙 → undefined', 'TypeError (f is not a function)', '허용', '함수'],
              ],
            },
          ],
        },
        {
          title: 'let 중복 선언은 한 줄도 실행 안 돼요',
          blocks: [
            {
              type: 'code',
              code: `console.log('이 줄이 찍힐까?');
let c = 1;
let c = 2;`,
            },
            { type: 'ask', q: '첫 줄의 console.log는 찍힐까요?', a: '안 찍혀요. 바로 `SyntaxError: Identifier \'c\' has already been declared`가 나요.\nlet 중복 선언은 ①파싱 단계에서 걸리는 문법 에러라서 ④실행까지 가지도 못해요. var로 바꾸면 첫 줄이 정상으로 찍혀요.' },
            { type: 'say', text: '그래서 요즘은 **기본은 const, 바꿔야 할 때만 let, var는 쓰지 않기**가 규칙이에요. 실수를 실행 전에 잡아 주니까요.' },
          ],
        },
      ],
    },
    {
      title: 'import 호이스팅과 ESM',
      slides: [
        {
          title: 'import도 먼저 처리돼요',
          blocks: [
            { type: 'say', text: '마지막 개념이에요. ES 모듈의 `import`는 파일 어디에 적어도 **코드 실행 전에 먼저 처리**돼요.' },
            {
              type: 'code',
              code: `// side.js
console.log('B) side.js 실행됨');

// entry.js
console.log('A) entry.js 첫 줄');
import './side.js';`,
            },
            { type: 'ask', q: 'node entry.js를 실행하면 A와 B 중 뭐가 먼저 찍힐까요?', a: 'B가 먼저예요.\nB) side.js 실행됨\nA) entry.js 첫 줄\nimport가 A보다 아래에 적혀 있어도, 엔진은 실행 전에 import부터 처리해서 side.js를 먼저 실행해요. 그래서 1-2에서 "모듈 맨 바깥에 부작용 코드를 두지 말자"고 한 거예요.' },
          ],
        },
        {
          title: 'ESM vs CommonJS',
          blocks: [
            { type: 'say', text: '자바스크립트 모듈 문법은 두 가지가 있어요. 오래된 Node.js 코드에서 `require()`를 보면 CommonJS예요.' },
            {
              type: 'table',
              head: ['', 'ES 모듈 (ESM)', 'CommonJS'],
              rows: [
                ['문법', '`import` / `export`', '`require()` / `module.exports`'],
                ['분석 시점', '실행 전에 정적으로 분석 가능', '실행해 봐야 앎 (require는 그냥 함수 호출)'],
                ['트리 셰이킹', '잘 됨', '어려움'],
                ['쓰는 곳', '브라우저 표준, Vite·Next.js', '옛 Node.js 코드, 일부 오래된 패키지'],
              ],
            },
            { type: 'say', text: '1-2에서 "트리 셰이킹이 되는 이유는 무엇을 가져오는지가 코드에 고정돼 있어서"라고 했죠? 그게 바로 ESM의 **정적 분석** 덕분이에요.' },
            { type: 'note', tone: 'tip', text: '일반 `<script>`에서 맨 바깥 `var a`는 `window.a`가 돼서 전역을 더럽혀요. 하지만 ES 모듈(Vite·Next.js 프로젝트 전부)에서는 **모듈 스코프**에 갇혀서 전역으로 새지 않아요. 모듈은 자동으로 strict 모드이기도 해요.' },
            { type: 'say', text: '1장 수업 끝! 마지막 확인 문제 풀고 마무리해요. 고생했어요.' },
          ],
        },
      ],
    },
  ],
  questions: [
    {
      id: 're01-3-q1',
      source: 'npm install 명령어',
      type: 'mcq',
      question: 'CI나 배포 서버에서 package-lock.json에 적힌 버전 그대로 깨끗하게 설치할 때 쓰는 명령은?',
      choices: ['npm install -g', 'npm ci', 'npx create-vite', 'npm install --save'],
      answer: 1,
      explanation: '`npm ci`는 lock 파일 그대로 설치해서 어디서든 같은 버전이 깔리게 해 줘요.',
    },
    {
      id: 're01-3-q2',
      source: 'npm install 명령어',
      type: 'ox',
      question: '요즘 npm에서는 --save를 붙여야만 패키지가 dependencies에 기록된다.',
      answer: false,
      explanation: 'npm 5(2017년)부터 `--save`가 기본이에요. `npm install 패키지`만 해도 dependencies에 기록돼요.',
    },
    {
      id: 're01-3-q3',
      source: 'npm install 명령어',
      type: 'mcq',
      question: '도구를 -g(전역)로 잘 설치하지 않는 이유로 가장 알맞은 것은?',
      choices: ['전역 설치는 유료라서', '컴퓨터에 버전이 하나뿐이라 프로젝트·팀원마다 버전이 꼬이기 쉬워서', '전역 설치하면 인터넷이 끊겨서', 'npx가 없어져서'],
      answer: 1,
      explanation: '프로젝트에 `-D`로 설치하고 `npm run`이나 `npx`로 실행하면 프로젝트마다 맞는 버전을 쓸 수 있어요.',
    },
    {
      id: 're01-3-q4',
      source: 'dependencies vs devDependencies',
      type: 'mcq',
      question: '다음 중 devDependencies에 넣는 것이 알맞은 패키지는?',
      choices: ['react', 'react-dom', 'next', 'vite'],
      answer: 3,
      explanation: '"앱이 실제로 돌아갈 때 필요한가?"로 판단해요. vite는 개발·빌드할 때만 쓰는 도구라 devDependencies예요.',
    },
    {
      id: 're01-3-q5',
      source: 'dependencies vs devDependencies',
      type: 'ox',
      question: 'Next.js 앱을 npm ci --omit=dev로 배포할 때, 실행에 필요한 패키지를 devDependencies에 잘못 넣으면 서버가 켜지지 않을 수 있다.',
      answer: true,
      explanation: '--omit=dev는 devDependencies를 빼고 설치해요. 실행에 필요한 패키지가 거기 있으면 "모듈을 찾을 수 없다" 에러로 서버가 죽어요.',
    },
    {
      id: 're01-3-q6',
      source: '호이스팅 (var)',
      type: 'mcq',
      question: '아래 코드를 실행하면 콘솔에 무엇이 찍힐까?',
      code: `console.log(a);
var a = 1;
var a = 2;
console.log(a);`,
      choices: ['1 그리고 2', 'undefined 그리고 2', 'ReferenceError', 'SyntaxError'],
      answer: 1,
      explanation: 'var a는 실행 전에 undefined로 등록돼서 첫 줄은 undefined. var 중복 선언은 허용되고 할당은 제자리에서 일어나서 마지막에는 2예요.',
    },
    {
      id: 're01-3-q7',
      source: '호이스팅 (var)',
      type: 'ox',
      question: '호이스팅은 자바스크립트 엔진이 선언 코드를 실제로 파일 맨 위로 옮겨 적는 것이다.',
      answer: false,
      explanation: '엔진은 코드를 옮기지 않아요. 실행 전에 선언을 미리 등록할 뿐이고, 할당은 원래 자리에서 실행돼요.',
    },
    {
      id: 're01-3-q8',
      source: 'let·const와 TDZ',
      type: 'mcq',
      question: '아래 코드의 결과는?',
      code: `let x = '바깥';
{
  console.log(x);
  let x = '안쪽';
}`,
      choices: ["'바깥'이 찍힌다", "'안쪽'이 찍힌다", 'undefined가 찍힌다', 'ReferenceError가 난다'],
      answer: 3,
      explanation: '블록 안의 x가 이미 등록돼서 바깥 x를 가렸지만 아직 초기화 전(TDZ)이라 ReferenceError가 나요. let도 호이스팅된다는 증거예요.',
    },
    {
      id: 're01-3-q9',
      source: 'let·const와 TDZ',
      type: 'mcq',
      question: 'sayHi(); var sayHi = function () {}; 를 실행하면?',
      choices: ['정상 실행된다', 'ReferenceError', 'TypeError: sayHi is not a function', 'SyntaxError'],
      answer: 2,
      explanation: '함수 "표현식"은 var 규칙을 따라 sayHi가 undefined로 등록돼요. undefined를 함수처럼 부르니 TypeError예요. 함수 "선언문"(function sayHi(){})이었다면 호출됐을 거예요.',
    },
    {
      id: 're01-3-q10',
      source: 'let·const와 TDZ',
      type: 'essay',
      question: '[면접] var는 중복 선언이 되고 let은 안 되는 이유를 호이스팅과 연결해 설명해 주세요.',
      answer: '엔진은 실행 전에 스코프의 선언을 먼저 등록하는데 이 현상을 호이스팅이라고 합니다. var는 스펙상 중복 선언이 허용돼서 같은 이름이 있으면 그 칸을 재사용하고 undefined로 초기화됩니다. let과 const는 같은 스코프 중복 선언이 파싱 단계에서 SyntaxError가 되고, 등록은 되지만 초기화되지 않아 선언 전에 접근하면 TDZ 때문에 ReferenceError가 납니다.',
      keywords: ['선언 등록', 'undefined 초기화', 'TDZ', '파싱 단계 SyntaxError'],
      explanation: '"let도 호이스팅은 된다, 다만 초기화가 안 된 채로"라는 점과 중복 선언 에러가 실행 전(파싱)에 난다는 점을 꼭 말해요.',
    },
    {
      id: 're01-3-q11',
      source: 'import 호이스팅과 ESM',
      type: 'mcq',
      question: "entry.js에 console.log('A') 다음 줄에 import './side.js'(안에 console.log('B'))가 있다. 실행 결과 순서는?",
      choices: ['A → B', 'B → A', 'A만 찍힌다', 'B만 찍힌다'],
      answer: 1,
      explanation: 'import는 코드 실행 전에 먼저 처리돼요. 그래서 side.js가 먼저 실행되어 B가 먼저 찍혀요.',
    },
    {
      id: 're01-3-q12',
      source: 'import 호이스팅과 ESM',
      type: 'ox',
      question: 'CommonJS(require)가 ES 모듈(import)보다 트리 셰이킹이 더 잘 된다.',
      answer: false,
      explanation: '반대예요. ESM은 무엇을 가져오는지가 코드에 고정돼 있어서 실행 없이 분석할 수 있고, 그래서 트리 셰이킹이 잘 돼요. require는 그냥 함수 호출이라 실행해 봐야 알아요.',
    },
  ],
}

export default topic
