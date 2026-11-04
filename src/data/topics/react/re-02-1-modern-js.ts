import type { Topic } from '../../types'

const topic: Topic = {
  id: 're-02-1-modern-js',
  track: 'react',
  group: '02. JS·TS 기초와 JSX',
  title: '2-1. React에서 매일 쓰는 모던 JS 문법',
  order: 201,
  notionId: '409df951bf8081cfb4f9d06ed5d19c02',
  addedAt: '2026-11-05',
  sections: [
    {
      title: 'ES6+가 뭐예요?',
      slides: [
        {
          title: '자바스크립트도 버전이 있어요',
          blocks: [
            { type: 'say', text: '2장에 온 걸 환영해요! 이번 장은 React 코드를 읽기 위해 꼭 필요한 **자바스크립트·타입스크립트 문법**부터 시작해요.\n\nReact 코드를 처음 보면 `const { name } = props`, `[...todos, newTodo]` 같은 낯선 기호가 많죠. React 문법이 아니라 전부 **자바스크립트 문법**이에요. 오늘 이걸 하나씩 풀어 볼게요.' },
            { type: 'say', text: '자바스크립트도 휴대폰 OS처럼 해마다 새 버전이 나와요. 공식 이름은 **ECMAScript(ES)** 예요. 그중 2015년에 나온 **ES6**(= ES2015)에서 문법이 한꺼번에 엄청 많이 바뀌었어요.\n\n그래서 "ES6 이후의 요즘 문법"을 묶어서 **ES6+** 또는 **모던 JS**라고 불러요.' },
            {
              type: 'table',
              head: ['문법', '들어온 버전'],
              rows: [
                ['let·const, 화살표 함수, 구조 분해, 템플릿 리터럴, 클래스, 모듈, Promise, 배열 전개', 'ES2015 (ES6)'],
                ['async / await', 'ES2017'],
                ['객체 전개 `{ ...obj }`', 'ES2018'],
                ['옵셔널 체이닝 `a?.b`, 널 병합 `a ?? b`', 'ES2020'],
              ],
            },
            { type: 'note', tone: 'tip', text: '버전 숫자를 외울 필요는 없어요. "책에서 ES6라고 묶은 것 중 몇 개는 사실 더 나중에 나왔다" 정도만 알면 충분해요.' },
          ],
        },
      ],
    },
    {
      title: '기본 파라미터와 나머지 파라미터',
      slides: [
        {
          title: '값이 안 들어오면 쓸 기본값',
          blocks: [
            { type: 'say', text: '카페 주문 함수를 만든다고 해 볼게요. 사이즈를 안 말하면 M으로 하고 싶어요.' },
            {
              type: 'code',
              code: `function order(menu, size = 'M') {
  return menu + '(' + size + ')';
}

order('라떼');        // '라떼(M)'  ← size를 안 넣어서 기본값
order('라떼', 'L');   // '라떼(L)'`,
            },
            { type: 'say', text: '`size = \'M\'`처럼 파라미터 옆에 기본값을 적는 걸 **기본 파라미터**라고 해요.' },
            { type: 'ask', q: "order('라떼', null) 이라고 부르면 size는 뭐가 될까요?", a: "'M'이 아니라 `null`이에요.\n기본값은 값이 **undefined일 때만** 들어가요. null은 \"일부러 비웠어요\"라는 진짜 값이라서 그대로 들어가요." },
          ],
        },
        {
          title: '남은 인수를 배열로 모으기',
          blocks: [
            { type: 'say', text: '이번엔 옵션(샷 추가, 시럽…)을 몇 개든 받고 싶어요. 개수를 미리 알 수 없죠.\n\n이럴 때 `...`을 파라미터 앞에 붙이면 **남은 인수를 전부 배열로 모아** 줘요. 이걸 **나머지 파라미터(rest parameters)** 라고 해요.' },
            {
              type: 'code',
              code: `function order(menu, size = 'M', ...options) {
  return menu + '(' + size + ') 옵션: ' + (options.join(', ') || '없음');
}

order('라떼');                       // 라떼(M) 옵션: 없음
order('라떼', 'L', '샷추가', '시럽');  // 라떼(L) 옵션: 샷추가, 시럽
// options = ['샷추가', '시럽']`,
            },
            { type: 'note', tone: 'warn', text: '나머지 파라미터는 **항상 맨 끝에만** 올 수 있어요. `function f(...a, b)`는 문법 에러예요. "남은 걸 전부 모은다"는 뜻이니 뒤에 또 뭐가 오면 말이 안 되겠죠?' },
          ],
        },
      ],
    },
    {
      title: '구조 분해 할당',
      slides: [
        {
          title: '상자에서 물건을 한 번에 꺼내기',
          blocks: [
            { type: 'say', text: 'React 코드에서 제일 많이 보는 문법이에요. 이미 1장에서 봤어요.\n\n`const [count, setCount] = useState(0)`\n`function ProductCard({ name, price })`\n\n이게 다 **구조 분해 할당**이에요. 객체나 배열에서 값을 꺼내서 변수에 **한 번에** 담는 문법이에요.' },
            { type: 'note', tone: 'analogy', text: '택배 상자를 열어서 안에 든 물건을 하나씩 꺼내 서랍에 넣는 걸 한 동작으로 하는 거예요. 객체는 **이름표**를 보고 꺼내고, 배열은 **순서**대로 꺼내요.' },
            {
              type: 'code',
              code: `const user = { name: '성훈', job: '프론트엔드' };

// 예전 방식
const name1 = user.name;
const job1 = user.job;

// 구조 분해: 이름표(key)로 꺼낸다
const { name, job } = user;`,
            },
          ],
        },
        {
          title: '이름 바꾸기, 기본값, 건너뛰기',
          blocks: [
            {
              type: 'code',
              code: `const user = { name: '성훈', job: '프론트엔드', city: undefined };

const { job: role, city = '서울' } = user;
// role = '프론트엔드'  ← job을 꺼내서 role이라는 이름으로
// city = '서울'        ← undefined라서 기본값

const [first, , third = '없음'] = ['a', 'b'];
// first = 'a', 두 번째는 건너뜀, third = '없음'`,
            },
            {
              type: 'list',
              items: [
                '`job: role` → "job을 꺼내서 **role이라는 이름으로** 담아 줘"',
                '`city = \'서울\'` → 꺼낸 값이 undefined면 기본값 사용 (기본 파라미터랑 같은 규칙)',
                '배열에서 `,` 사이를 비우면 그 자리는 **건너뛰어요**',
              ],
            },
            { type: 'ask', q: 'useState(0)은 배열을 돌려줘요. 왜 객체가 아니라 배열로 돌려줄까요?', a: '배열은 **순서**로 꺼내니까 이름을 내 마음대로 붙일 수 있어서예요.\n`const [count, setCount]`, `const [name, setName]`처럼요. 객체로 돌려줬다면 매번 `{ value: count, setValue: setCount }`처럼 이름 바꾸기를 써야 했을 거예요.' },
          ],
        },
      ],
    },
    {
      title: '전개 연산자',
      slides: [
        {
          title: '...으로 펼쳐서 복사하기',
          blocks: [
            { type: 'say', text: '`...`이 또 나왔네요. 이번엔 **펼치는** 쪽이에요. 배열이나 객체를 **펼쳐서 새 배열·새 객체를 만들 때** 써요. 이걸 **전개 연산자(spread)** 라고 해요.' },
            {
              type: 'code',
              code: `const base = { size: 'M', ice: true };
const custom = { ...base, size: 'L' };
// custom = { size: 'L', ice: true }   ← 뒤에 쓴 값이 이긴다
// base는 그대로 { size: 'M', ice: true }

const nums = [1, 2];
const more = [...nums, 3];   // [1, 2, 3]`,
            },
            { type: 'say', text: '포인트는 **원본은 그대로 두고 새 것을 만든다**는 거예요. 이게 React에서 정말 중요해요.' },
          ],
        },
        {
          title: 'React가 전개 연산자를 좋아하는 이유',
          blocks: [
            { type: 'say', text: 'React는 상태가 바뀌었는지 확인할 때 **안쪽을 하나하나 뒤지지 않아요.** "이전 값과 지금 값이 **같은 상자(같은 주소)** 인가?"만 빠르게 봐요.' },
            {
              type: 'code',
              code: `// ❌ 화면이 안 바뀐다
todos.push(newTodo);
setTodos(todos);          // 같은 배열(같은 상자) → React: "안 바뀌었네"

// ✅ 화면이 바뀐다
setTodos([...todos, newTodo]);   // 새 배열(새 상자) → React: "바뀌었다!"`,
            },
            { type: 'note', tone: 'analogy', text: '선생님이 "숙제 다시 냈어?" 확인할 때 공책 내용을 다 읽지 않고 **공책이 새 공책인지**만 본다고 생각해 보세요. 옛 공책에 몰래 써 넣으면(push) 못 알아채요. 새 공책에 옮겨 써서 내야(전개) 알아채요.' },
            { type: 'say', text: '이렇게 원본을 고치지 않고 새로 만드는 걸 **불변성**이라고 해요. 3장에서 자세히 배울 거예요.' },
          ],
        },
        {
          title: '같은 ...인데 두 가지 일을 해요',
          blocks: [
            {
              type: 'table',
              head: ['어디에 쓰나', '하는 일', '이름', '예시'],
              rows: [
                ['함수 파라미터, 구조 분해 왼쪽', '**모으기**', '나머지 (rest)', '`function f(...args)`, `const [a, ...rest] = arr`'],
                ['값을 만드는 자리', '**펼치기**', '전개 (spread)', '`[...arr, 3]`, `{ ...obj, a: 1 }`'],
              ],
            },
            { type: 'note', tone: 'warn', text: '전개 연산자는 **얕은 복사**예요. 바깥 상자만 새로 만들고, 안에 든 객체는 원래 것을 그대로 가리켜요.\n`const copy = { ...user }` 후에 `copy.address.city = \'부산\'`을 하면 **user의 address도 바뀌어요.** 안쪽까지 전부 복사하려면 `structuredClone(user)`를 써요.' },
          ],
        },
      ],
    },
    {
      title: '화살표 함수와 this',
      slides: [
        {
          title: '짧게 쓰는 함수',
          blocks: [
            { type: 'say', text: '`(a) => a * 2` 같은 걸 **화살표 함수**라고 해요. `function` 대신 `=>`로 써요.' },
            {
              type: 'code',
              code: `function double(a) { return a * 2; }   // 일반 함수
const double2 = (a) => a * 2;           // 화살표 함수 (한 줄이면 return 생략)

// React에서는 이런 곳에 많이 써요
todos.map((todo) => <li key={todo.id}>{todo.title}</li>)
<button onClick={() => setCount(count + 1)}>+</button>`,
            },
            { type: 'say', text: '그런데 화살표 함수는 **단순히 짧은 것만이 아니에요.** 진짜 차이는 `this`에 있어요.' },
          ],
        },
        {
          title: 'this는 "나를 부른 사람"이에요',
          blocks: [
            { type: 'say', text: '일반 함수의 `this`는 **그 함수를 어떻게 불렀느냐에 따라 바뀌어요.** `counter.start()`로 부르면 this는 counter예요. 그런데 같은 함수를 setTimeout이 대신 부르면 this가 사라져요.\n\n화살표 함수는 **자기 this가 없어요.** 그래서 **만들어진 자리의 바깥 this를 그대로** 써요.' },
            {
              type: 'code',
              code: `const counter = {
  count: 0,
  startArrow() {
    setTimeout(() => console.log(++this.count), 0);         // 1
  },
  startNormal() {
    setTimeout(function () { console.log(this?.count); }, 0); // undefined
  },
};`,
            },
            { type: 'note', tone: 'analogy', text: '일반 함수는 "전화 받은 사람이 곧 나"라서 누가 전화를 돌려주느냐에 따라 달라져요. 화살표 함수는 "나는 원래 있던 집 사람"이라 누가 전화를 돌려줘도 그대로예요.' },
            {
              type: 'table',
              head: ['', '일반 함수', '화살표 함수'],
              rows: [
                ['this', '부르는 방식에 따라 바뀜', '바깥 this를 그대로'],
                ['`new`로 만들기', '가능', '불가'],
                ['React에서', '컴포넌트 선언', '이벤트 핸들러, map 콜백'],
              ],
            },
          ],
        },
      ],
    },
    {
      title: '템플릿 리터럴과 객체 단축 문법',
      slides: [
        {
          title: '백틱 문자열과 ${ }',
          blocks: [
            { type: 'say', text: '문자열을 따옴표 대신 **백틱**(키보드 숫자 1 왼쪽 키)으로 감싸면 `${ }` 안에 값을 바로 끼워 넣을 수 있어요. 이걸 **템플릿 리터럴**이라고 해요.' },
            {
              type: 'code',
              code: `const price = 4500, qty = 2, isVip = true;

'합계 ' + price * qty + '원'          // 예전
\`합계 \${price * qty}원\`               // 템플릿 리터럴
\`\${isVip ? 'VIP' : '일반'} 회원\`      // 조건도 OK`,
            },
            { type: 'say', text: '`${ }` 안에는 변수만이 아니라 **값이 나오는 코드(표현식)라면 뭐든** 들어가요. 계산, 삼항 연산자, 함수 호출까지요. 줄바꿈도 그대로 돼요.' },
          ],
        },
        {
          title: '객체를 더 짧게 만들기',
          blocks: [
            {
              type: 'table',
              head: ['문법', '예전', 'ES6+'],
              rows: [
                ['단축 속성', '`{ name: name }`', '`{ name }`'],
                ['메서드 단축', '`{ hello: function() {} }`', '`{ hello() {} }`'],
                ['계산된 속성명', '만든 뒤 `obj[key] = v`', '`{ [key]: v }`'],
              ],
            },
            { type: 'say', text: '특히 **계산된 속성명**은 React 폼에서 자주 써요. 입력칸이 여러 개일 때 칸 이름으로 한 번에 바꾸거든요.' },
            {
              type: 'code',
              code: `// 입력칸 name="email" 이면 form.email 을, name="pw" 면 form.pw 를 바꾼다
setForm({ ...form, [e.target.name]: e.target.value });`,
              caption: '전개 연산자 + 계산된 속성명 조합. 3장 폼 수업에서 다시 나와요',
            },
            { type: 'say', text: '오늘 배운 문법들이 이 한 줄에 다 들어 있어요. 마지막 확인 문제 가 볼게요!' },
          ],
        },
      ],
    },
  ],
  questions: [
    {
      id: 're02-1-q1',
      source: 'ES6+가 뭐예요?',
      type: 'ox',
      question: 'async/await는 ES6(ES2015)에 처음 들어온 문법이다.',
      answer: false,
      explanation: 'async/await는 ES2017에 들어왔어요. 그래서 요즘 문법을 묶어 "ES6+"라고 불러요.',
    },
    {
      id: 're02-1-q2',
      source: '기본 파라미터와 나머지 파라미터',
      type: 'mcq',
      question: "function order(menu, size = 'M') 에서 order('라떼', null) 을 부르면 size는?",
      choices: ["'M'", 'null', 'undefined', '에러'],
      answer: 1,
      explanation: '기본값은 값이 undefined일 때만 들어가요. null은 진짜 값이라 그대로 들어가요.',
    },
    {
      id: 're02-1-q3',
      source: '기본 파라미터와 나머지 파라미터',
      type: 'mcq',
      question: "function f(a, ...rest) 에 f(1, 2, 3) 을 넣으면 rest는?",
      choices: ['3', '[2, 3]', '[1, 2, 3]', '2'],
      answer: 1,
      explanation: '나머지 파라미터는 앞에서 받고 "남은" 인수를 배열로 모아요. a=1, rest=[2, 3]이에요.',
    },
    {
      id: 're02-1-q4',
      source: '구조 분해 할당',
      type: 'mcq',
      question: "const { job: role, city = '서울' } = { job: '디자이너' } 실행 후 값으로 옳은 것은?",
      choices: ["job = '디자이너', city = undefined", "role = '디자이너', city = '서울'", "role = undefined, city = '서울'", '문법 에러'],
      answer: 1,
      explanation: '`job: role`은 job을 꺼내 role이라는 이름으로 담아요. city는 객체에 없어서(undefined) 기본값 서울이 들어가요.',
    },
    {
      id: 're02-1-q5',
      source: '구조 분해 할당',
      type: 'short',
      question: 'const [first, , third] = ["a", "b", "c"] 에서 third 의 값은? (따옴표 없이)',
      answer: ['c'],
      explanation: '배열 구조 분해는 순서대로 꺼내요. 두 번째 자리는 비워서 건너뛰었으니 third는 "c"예요.',
    },
    {
      id: 're02-1-q6',
      source: '전개 연산자',
      type: 'mcq',
      question: 'todos 배열에 새 항목을 추가해 화면을 바꾸고 싶다. 올바른 코드는?',
      choices: ['todos.push(newTodo); setTodos(todos);', 'setTodos([...todos, newTodo]);', 'todos[todos.length] = newTodo;', 'setTodos(todos.push(newTodo));'],
      answer: 1,
      explanation: 'React는 "같은 상자(같은 주소)인가"만 봐요. 새 배열을 만들어 넘겨야 바뀐 걸 알아채요. push는 원본을 고쳐서 같은 배열이 그대로예요.',
      choiceExplanations: ['같은 배열을 다시 넣어서 React가 변화를 못 알아채요.', '맞아요. 새 배열을 만들어 넘겨요.', '원본을 직접 고쳤고 setTodos도 안 불렀어요.', 'push는 배열이 아니라 새 길이(숫자)를 돌려줘요. todos가 숫자가 돼 버려요.'],
    },
    {
      id: 're02-1-q7',
      source: '전개 연산자',
      type: 'ox',
      question: '{ ...user } 로 복사하면 user 안에 든 address 객체까지 전부 새로 복사된다.',
      answer: false,
      explanation: '전개는 얕은 복사예요. 바깥 객체만 새로 만들고 안쪽 address는 같은 것을 가리켜요. 깊은 복사는 structuredClone을 써요.',
    },
    {
      id: 're02-1-q8',
      source: '화살표 함수와 this',
      type: 'mcq',
      question: '화살표 함수와 일반 함수의 가장 중요한 차이는?',
      choices: ['화살표 함수가 항상 더 빠르다', '화살표 함수는 자기 this가 없고 바깥 this를 그대로 쓴다', '화살표 함수는 값을 돌려줄 수 없다', '화살표 함수는 React에서만 쓸 수 있다'],
      answer: 1,
      explanation: '일반 함수의 this는 부르는 방식에 따라 바뀌지만, 화살표 함수는 만들어진 자리의 바깥 this를 써요. 그래서 setTimeout·이벤트 콜백 안에서 바깥 객체를 가리킬 때 편해요.',
    },
    {
      id: 're02-1-q9',
      source: '템플릿 리터럴과 객체 단축 문법',
      type: 'mcq',
      question: "const key = 'email'; const obj = { [key]: 'a@b.c' }; 의 결과는?",
      choices: ["{ key: 'a@b.c' }", "{ email: 'a@b.c' }", "{ '[key]': 'a@b.c' }", '문법 에러'],
      answer: 1,
      explanation: '대괄호 안의 값을 계산해서 속성 이름으로 써요(계산된 속성명). key가 email이니 { email: ... }이 돼요.',
    },
  ],
}

export default topic
