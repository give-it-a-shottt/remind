import type { Topic } from '../../types'

const topic: Topic = {
  id: 're-02-2-async-class',
  track: 'react',
  group: '02. JS·TS 기초와 JSX',
  title: '2-2. 비동기(Promise·async/await)와 클래스',
  order: 202,
  notionId: '409df951bf8081cfb4f9d06ed5d19c02',
  addedAt: '2026-11-05',
  sections: [
    {
      title: '동기와 비동기',
      slides: [
        {
          title: '기다리는 동안 멈춰 있을 건가요?',
          blocks: [
            { type: 'say', text: '이번 수업은 React에서 서버 데이터를 가져올 때 꼭 필요한 **비동기**예요.\n\n강의 목록을 서버에서 가져오는 데 2초가 걸린다고 해 볼게요. 그 2초 동안 화면이 꽁꽁 얼어서 버튼도 안 눌리고 스크롤도 안 된다면? 사용자는 앱이 고장 난 줄 알겠죠.' },
            { type: 'note', tone: 'analogy', text: '카페에서 주문하면 **진동벨**을 받죠. 커피가 나올 때까지 카운터 앞에 서 있지 않고, 자리에 가서 친구랑 얘기하다가 벨이 울리면 받으러 가요.\n• 카운터 앞에서 계속 기다리기 = **동기**\n• 진동벨 받고 다른 일 하기 = **비동기**' },
            { type: 'say', text: '자바스크립트는 오래 걸리는 일(서버 요청, 타이머, 파일 읽기)을 **비동기**로 처리해요. 일을 맡겨 두고 다음 코드를 먼저 실행하다가, 결과가 오면 그때 이어서 처리해요.' },
          ],
        },
        {
          title: '코드로 확인해 보기',
          blocks: [
            {
              type: 'code',
              code: `console.log('1. 주문');
setTimeout(() => console.log('2. 커피 나옴'), 0);
console.log('3. 자리에 앉음');`,
            },
            { type: 'ask', q: '0초 뒤에 실행하라고 했는데, 찍히는 순서는?', a: '1 → 3 → 2 순서예요.\nsetTimeout은 0초라도 "나중에 할 일"로 맡겨져요. 지금 실행 중인 코드가 **전부 끝난 뒤에야** 실행돼요. 이 순서를 관리하는 장치를 **이벤트 루프**라고 불러요.' },
            { type: 'say', text: '"맡겨 둔 일이 나중에 끝나면 결과를 받는" 방식을 깔끔하게 다루는 도구가 다음 개념인 **Promise**예요.' },
          ],
        },
      ],
    },
    {
      title: 'Promise: 나중에 올 결과의 약속',
      slides: [
        {
          title: 'Promise = 진동벨',
          blocks: [
            { type: 'say', text: '**Promise**는 이름 그대로 "결과를 나중에 꼭 줄게"라는 **약속 객체**예요. 카페 진동벨이랑 똑같아요.' },
            {
              type: 'table',
              head: ['Promise 상태', '진동벨로 보면', '뜻'],
              rows: [
                ['pending (대기)', '벨이 아직 안 울림', '아직 결과가 없음'],
                ['fulfilled (성공)', '벨이 울리고 커피가 나옴', '결과 값이 도착함'],
                ['rejected (실패)', '"재료가 떨어졌어요"', '에러가 남'],
              ],
            },
            { type: 'say', text: '`fetch()`로 서버에 요청하면 바로 데이터가 오는 게 아니라 **Promise(진동벨)** 를 먼저 돌려받아요. 데이터는 나중에 와요.' },
          ],
        },
        {
          title: '.then으로 결과 받기',
          blocks: [
            {
              type: 'code',
              code: `fetch('/api/courses')            // Promise를 돌려준다
  .then((res) => res.json())      // 응답이 오면 JSON으로 바꾸고 (이것도 Promise)
  .then((data) => console.log(data))  // 바뀐 데이터를 받는다
  .catch((err) => console.error(err)); // 중간에 실패하면 여기로`,
            },
            { type: 'list', items: ['`.then(함수)` → 성공하면 이 함수를 실행해 줘', '`.catch(함수)` → 실패하면 이 함수를 실행해 줘', '`.then`이 또 Promise를 돌려주니까 계속 이어 붙일 수 있어요 (체인)'] },
            { type: 'say', text: '잘 동작하지만 `.then`이 길게 이어지면 읽기 힘들어요. 그래서 나온 게 다음 개념 **async/await**예요.' },
          ],
        },
      ],
    },
    {
      title: 'async/await',
      slides: [
        {
          title: '위에서 아래로 읽히는 비동기',
          blocks: [
            { type: 'say', text: '같은 일을 `async/await`로 쓰면 이렇게 돼요.' },
            {
              type: 'code',
              code: `async function loadCourses() {
  try {
    const res = await fetch('/api/courses');   // 벨이 울릴 때까지 기다림
    const data = await res.json();              // 또 기다림
    console.log(data);
  } catch (err) {
    console.error(err);                          // 실패하면 여기로
  }
}`,
            },
            {
              type: 'list',
              items: [
                '`async` → "이 함수 안에서 await를 쓸 거예요"라는 표시',
                '`await Promise` → 그 Promise가 끝날 때까지 **이 함수 안에서만** 기다렸다가 결과 값을 꺼내 줘요',
                '실패는 `.catch` 대신 평소처럼 `try / catch`로 잡아요',
              ],
            },
            { type: 'note', tone: 'tip', text: 'await는 앱 전체를 멈추지 않아요. **그 async 함수만** 잠깐 쉬고, 그동안 화면은 계속 움직여요. 진동벨 들고 자리에 앉아 있는 거예요.' },
          ],
        },
        {
          title: '"요즘은 Promise 안 쓰지 않아요?"',
          blocks: [
            { type: 'say', text: '많이 하는 오해예요. **async/await는 Promise를 대체한 게 아니라, Promise 위에 올라간 문법**이에요. `.then`을 직접 쓰는 일이 줄었을 뿐 Promise는 매일 써요.' },
            {
              type: 'list',
              items: [
                '**async 함수는 항상 Promise를 돌려줘요.** `async () => 1`을 부르면 1이 아니라 "1을 담은 Promise"가 나와요.',
                '**await는 Promise를 기다려요.** Promise가 없으면 기다릴 대상도 없어요.',
                '`fetch()`, `res.json()` 전부 Promise를 돌려줘요.',
              ],
            },
            { type: 'ask', q: 'const x = loadCourses(); 라고 await 없이 부르면 x에는 뭐가 들어 있을까요?', a: '데이터가 아니라 **Promise**가 들어 있어요. 아직 진동벨 상태예요.\n값을 꺼내려면 `await loadCourses()` 하거나 `.then()`을 붙여야 해요. React에서 "데이터가 [object Promise]로 찍혀요"라는 질문의 99%가 이거예요.' },
          ],
        },
      ],
    },
    {
      title: 'Promise.all로 동시에 기다리기',
      slides: [
        {
          title: '하나씩 기다리면 시간이 더해져요',
          blocks: [
            { type: 'say', text: '강의 목록(3초)과 공지사항(1초)을 둘 다 가져와야 해요. 이렇게 쓰면 몇 초 걸릴까요?' },
            {
              type: 'code',
              code: `const courses = await getCourses();   // 3초
const notices = await getNotices();   // 그다음 1초`,
            },
            { type: 'ask', q: '총 몇 초?', a: '**4초**예요. 첫 번째가 끝나야 두 번째를 **시작**하거든요. 둘은 서로 상관없는 요청인데 괜히 줄을 세운 거예요.' },
            { type: 'note', tone: 'analogy', text: '라면 물 끓이는 3분 동안 가만히 있다가, 다 끓고 나서야 계란을 꺼내는 것과 같아요. 물 올려 두고 계란을 같이 준비하면 되잖아요.' },
          ],
        },
        {
          title: '동시에 출발시키기',
          blocks: [
            {
              type: 'code',
              code: `const [courses, notices] = await Promise.all([
  getCourses(),   // 3초
  getNotices(),   // 1초
]);
// 둘을 동시에 출발 → 총 3초 (가장 오래 걸리는 것 기준)`,
            },
            {
              type: 'list',
              items: [
                '`Promise.all([...])` → 여러 Promise를 **동시에** 기다리고, 전부 끝나면 결과를 배열로 줘요',
                '결과 배열 순서는 **넣은 순서 그대로**예요. 공지가 먼저 끝나도 `[courses, notices]` 순서',
                '하나라도 실패하면 전체가 실패(catch)로 가요',
              ],
            },
            { type: 'note', tone: 'tip', text: '하나가 실패해도 나머지 결과는 받고 싶다면 `Promise.allSettled`를 써요. 각각 성공·실패 여부를 담아서 돌려줘요.' },
          ],
        },
      ],
    },
    {
      title: '클래스와 this 함정',
      slides: [
        {
          title: '클래스 = 붕어빵 틀',
          blocks: [
            { type: 'say', text: '마지막은 **클래스**예요. 요즘 React에서는 잘 안 쓰지만, 오래된 코드를 읽으려면 알아야 하고 "React가 왜 함수 컴포넌트로 바뀌었는지"를 이해하는 데 꼭 필요해요.' },
            { type: 'note', tone: 'analogy', text: '클래스는 **붕어빵 틀**이에요. 틀(class) 하나로 붕어빵(객체)을 계속 찍어 내죠. `new`가 틀에 반죽을 붓는 동작이에요.' },
            {
              type: 'code',
              code: `class Cat {
  #secret = '츄르 위치';               // # = 진짜 private (밖에서 못 봄)
  constructor(name) { this.name = name; }   // 파이썬 __init__(self, name)
  speak() { return this.name + ': 야옹'; }
}

const nabi = new Cat('나비');
nabi.speak();   // '나비: 야옹'`,
            },
          ],
        },
        {
          title: '메서드를 떼어 내면 this가 사라져요',
          blocks: [
            {
              type: 'code',
              code: `const speak = nabi.speak;   // 메서드만 떼어 냄
speak();
// TypeError: Cannot read properties of undefined (reading 'name')

const bound = nabi.speak.bind(nabi);   // this를 nabi로 고정
bound();   // '나비: 야옹'`,
            },
            { type: 'say', text: '2-1에서 배운 것 기억나요? 일반 함수의 this는 **부르는 방식**에 따라 바뀌어요. `nabi.speak()`로 부르면 this가 nabi인데, 떼어 내서 `speak()`만 부르면 앞에 아무도 없으니 this가 undefined가 돼요.' },
            {
              type: 'table',
              head: ['', 'JavaScript', 'Python'],
              rows: [
                ['자기 자신', '`this` — 부르는 방식에 따라 바뀜', '`self` — 항상 그 객체'],
                ['메서드를 떼어 내 호출', 'this가 사라져 에러', '그대로 동작'],
                ['private', '`#field` (진짜 접근 불가)', '`_field` 관례'],
                ['선언 전에 사용', 'TDZ로 ReferenceError (1-3 let과 같음)', 'NameError'],
              ],
            },
          ],
        },
        {
          title: 'React가 함수 컴포넌트로 바뀐 이유',
          blocks: [
            { type: 'say', text: '예전 React는 클래스로 컴포넌트를 만들었어요. 그때 `<button onClick={this.handleClick}>`처럼 메서드를 넘기면 **방금 본 그 문제**가 터졌어요. 버튼이 메서드를 떼어 가서 부르니까 this가 사라지는 거죠. 그래서 생성자마다 `this.handleClick = this.handleClick.bind(this)`를 줄줄이 써야 했어요.' },
            { type: 'say', text: '지금 React는 **함수 컴포넌트 + 훅(useState 등)** 으로 써요. this가 아예 안 나와서 이런 실수가 사라졌어요. 클래스 컴포넌트는 "오래된 코드를 읽을 수 있을 정도"면 충분해요.' },
            { type: 'say', text: '수고했어요! 확인 문제 풀고 마무리해요.' },
          ],
        },
      ],
    },
  ],
  questions: [
    {
      id: 're02-2-q1',
      source: '동기와 비동기',
      type: 'mcq',
      question: '아래 코드가 찍는 순서는?',
      code: `console.log('A');
setTimeout(() => console.log('B'), 0);
console.log('C');`,
      choices: ['A → B → C', 'A → C → B', 'B → A → C', 'C → A → B'],
      answer: 1,
      explanation: 'setTimeout은 0초라도 "나중에 할 일"로 맡겨져서, 지금 실행 중인 코드(A, C)가 끝난 뒤에 실행돼요.',
    },
    {
      id: 're02-2-q2',
      source: 'Promise: 나중에 올 결과의 약속',
      type: 'mcq',
      question: 'fetch()를 호출하면 바로 돌려받는 것은?',
      choices: ['서버의 JSON 데이터', 'HTML 문자열', '나중에 결과를 줄 Promise 객체', 'undefined'],
      answer: 2,
      explanation: 'fetch는 결과를 바로 주지 않고 Promise(진동벨)를 먼저 돌려줘요. 데이터는 .then이나 await로 나중에 받아요.',
    },
    {
      id: 're02-2-q3',
      source: 'Promise: 나중에 올 결과의 약속',
      type: 'short',
      question: 'Promise가 실패(rejected)했을 때 실행할 함수를 붙이는 메서드 이름은? (.then 처럼)',
      answer: ['catch', '.catch', 'catch()', '.catch()'],
      explanation: '.then은 성공, .catch는 실패를 받아요. async/await에서는 try/catch로 잡아요.',
    },
    {
      id: 're02-2-q4',
      source: 'async/await',
      type: 'ox',
      question: 'async/await가 생겼기 때문에 요즘은 Promise를 몰라도 된다.',
      answer: false,
      explanation: 'async/await는 Promise 위에 올라간 문법이에요. async 함수는 항상 Promise를 돌려주고, await는 Promise를 기다려요.',
    },
    {
      id: 're02-2-q5',
      source: 'async/await',
      type: 'mcq',
      question: 'async function getOne() { return 1 } 일 때 const x = getOne(); 의 x는?',
      choices: ['1', '1을 담은 Promise', 'undefined', '에러'],
      answer: 1,
      explanation: 'async 함수는 return 값을 항상 Promise로 감싸서 돌려줘요. 값을 꺼내려면 await getOne()이 필요해요.',
    },
    {
      id: 're02-2-q6',
      source: 'Promise.all로 동시에 기다리기',
      type: 'mcq',
      question: '3초 걸리는 a()와 1초 걸리는 b()를 await Promise.all([a(), b()]) 로 기다리면 대략 몇 초?',
      choices: ['1초', '3초', '4초', '0초'],
      answer: 1,
      explanation: '둘을 동시에 출발시켜서 가장 오래 걸리는 것(3초) 기준으로 끝나요. 하나씩 await하면 3+1=4초예요.',
    },
    {
      id: 're02-2-q7',
      source: 'Promise.all로 동시에 기다리기',
      type: 'ox',
      question: 'Promise.all의 결과 배열은 먼저 끝난 순서대로 담긴다.',
      answer: false,
      explanation: '결과는 넣은 순서 그대로예요. b가 먼저 끝나도 [a의 결과, b의 결과] 순서예요.',
    },
    {
      id: 're02-2-q8',
      source: '클래스와 this 함정',
      type: 'mcq',
      question: 'const speak = nabi.speak; speak(); 가 TypeError를 내는 이유는?',
      choices: ['클래스는 메서드를 가질 수 없어서', '메서드를 떼어 내 부르면 앞에 객체가 없어 this가 undefined가 되어서', 'speak가 화살표 함수라서', 'nabi가 아직 만들어지지 않아서'],
      answer: 1,
      explanation: '일반 함수의 this는 부르는 방식으로 정해져요. nabi.speak()처럼 앞에 객체가 있어야 this가 nabi예요. bind(nabi)로 고정할 수 있어요.',
    },
    {
      id: 're02-2-q9',
      source: '클래스와 this 함정',
      type: 'essay',
      question: '[면접] React가 클래스 컴포넌트에서 함수 컴포넌트 + 훅으로 바뀐 이유 중 하나를 this와 연결해 설명해 주세요.',
      answer: '클래스 컴포넌트에서는 onClick={this.handleClick}처럼 메서드를 이벤트로 넘기면, 메서드가 객체에서 떼어져 호출되면서 this가 undefined가 되는 문제가 있었습니다. 그래서 생성자에서 bind를 반복해야 했습니다. 함수 컴포넌트와 훅은 this를 쓰지 않아 이런 바인딩 실수가 사라지고, 상태 로직을 훅으로 재사용하기도 쉬워졌습니다.',
      keywords: ['this 바인딩', 'bind', '메서드를 떼어 호출', '훅', '함수 컴포넌트'],
      explanation: '"이벤트로 메서드를 넘기면 this가 사라진다 → bind를 반복해야 했다 → 함수 컴포넌트는 this가 없다" 흐름으로 말하면 돼요.',
    },
  ],
}

export default topic
