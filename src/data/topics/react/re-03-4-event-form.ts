import type { Topic } from '../../types'

const topic: Topic = {
  id: 're-03-4-event-form',
  track: 'react',
  group: '03. 상태·스타일·이벤트·폼',
  title: '3-4. 이벤트와 폼 입력',
  order: 304,
  notionId: '409df951bf8081e39a3bd5e6fc7cb76d',
  addedAt: '2026-11-05',
  sections: [
    {
      title: '이벤트에는 함수를 넘겨요',
      slides: [
        {
          title: 'HTML과 React의 차이',
          blocks: [
            { type: 'say', text: '3장 마지막 수업이에요. 버튼 클릭, 입력칸 타이핑 같은 **사용자 행동**을 다루는 법을 배워요.\n\n먼저 HTML과 React에서 클릭 이벤트를 다는 모양을 비교해 볼게요.' },
            {
              type: 'table',
              head: ['', 'HTML', 'React'],
              rows: [
                ['이름', '`onclick` (소문자)', '`onClick` (카멜)'],
                ['값', '문자열 `"handle()"`', '함수 자체 `{handle}`'],
              ],
            },
            { type: 'say', text: 'React에서는 **"클릭되면 이 함수를 불러 줘"라고 함수를 맡겨요.** 지금 당장 부르는 게 아니라요.' },
            {
              type: 'code',
              code: `<button onClick={handle}>저장</button>               // ✅ 함수를 넘긴다
<button onClick={() => remove(todo.id)}>삭제</button>  // ✅ 인자가 필요하면 화살표 함수로 감싼다
<button onClick={handle()}>저장</button>             // ❌ 틀림!`,
            },
          ],
        },
        {
          title: 'handle() 에 괄호를 붙이면',
          blocks: [
            { type: 'ask', q: 'onClick={handle()} 은 정확히 무슨 일을 할까요?', a: '클릭을 기다리지 않고 **화면을 그리는 순간** handle을 실행해 버려요. 그리고 handle이 **돌려준 값**(보통 undefined)을 onClick에 넣어요. 그래서 정작 클릭하면 아무 일도 안 일어나요.' },
            { type: 'note', tone: 'warn', text: 'handle 안에 setState가 있으면 더 심각해요.\n렌더링 → handle 실행 → setState → 다시 렌더링 → handle 실행 → setState → …\n끝없이 반복되다가 **`Too many re-renders`** 에러가 나요. 이 에러를 보면 제일 먼저 `onClick={함수()}`를 찾아보세요.' },
            { type: 'note', tone: 'analogy', text: '`handle`은 "벨 누르면 이 사람한테 연락해"라고 **전화번호를 남기는 것**이고, `handle()`은 그 자리에서 **바로 전화를 걸어 버리는 것**이에요.' },
          ],
        },
      ],
    },
    {
      title: '이벤트 객체 e',
      slides: [
        {
          title: 'React가 자동으로 넣어 주는 첫 번째 인자',
          blocks: [
            { type: 'say', text: 'React는 이벤트 핸들러를 부를 때 **첫 번째 인자로 이벤트 정보가 담긴 객체**를 자동으로 넣어 줘요. 보통 `e`라고 이름 붙여요.' },
            {
              type: 'code',
              code: `import { useState, type ChangeEvent } from 'react';

const [value, setValue] = useState('');

const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
  setValue(e.target.value);     // e.target = 이벤트가 일어난 input
};

<input value={value} onChange={handleChange} />   // React가 e를 넣어서 불러 줌`,
            },
            { type: 'say', text: 'input이면 `e.target.value`로 지금 입력된 글자를 꺼내요. TypeScript에서는 `ChangeEvent<HTMLInputElement>`처럼 "어떤 요소의 어떤 이벤트인지"를 적어요.' },
          ],
        },
        {
          title: '자주 쓰는 속성과 메서드',
          blocks: [
            {
              type: 'table',
              head: ['', '뜻'],
              rows: [
                ['`e.target`', '이벤트가 **실제로 일어난** 요소 (버튼 안의 아이콘을 눌렀다면 아이콘)'],
                ['`e.currentTarget`', '핸들러가 **달려 있는** 요소 (버튼)'],
                ['`e.preventDefault()`', '브라우저 기본 동작 막기 (폼 제출 시 새로고침, 링크 이동)'],
                ['`e.stopPropagation()`', '부모 요소로 이벤트가 올라가는 것 막기'],
              ],
            },
            { type: 'say', text: '사실 이 `e`는 브라우저의 진짜 이벤트가 아니라 React가 한 번 감싼 **합성 이벤트(SyntheticEvent)** 예요. 브라우저마다 조금씩 다른 이벤트를 **같은 모양으로 맞춰** 주는 포장지예요. 진짜 브라우저 이벤트가 필요하면 `e.nativeEvent`로 꺼내요.' },
            { type: 'note', tone: 'tip', text: '오래된 자료에 나오는 `e.persist()`는 React 17부터 필요 없어요. 보이면 그냥 지워도 돼요.' },
          ],
        },
      ],
    },
    {
      title: '컴포넌트의 onClick은 그냥 prop',
      slides: [
        {
          title: '눌러도 반응이 없는 버튼',
          blocks: [
            { type: 'say', text: '직접 만든 버튼 컴포넌트에 onClick을 달았는데 아무 반응이 없어요. 왜일까요?' },
            {
              type: 'code',
              code: `function MyButton({ label }) {
  return <button>{label}</button>;
}

<MyButton label="저장" onClick={() => setCount((c) => c + 1)} />
// 눌러도 count가 안 올라간다!`,
            },
            { type: 'say', text: '`<button>`, `<input>` 같은 **진짜 DOM 요소**에 단 `onClick`은 이벤트예요. 그런데 **내가 만든 컴포넌트**에 단 `onClick`은 이벤트가 아니라 **그냥 이름이 onClick인 prop**이에요. `title`, `label`과 다를 게 없어요.' },
          ],
        },
        {
          title: '안쪽 진짜 요소에 연결해 줘야 해요',
          blocks: [
            {
              type: 'code',
              code: `function MyButton({ label, onClick }) {
  return <button onClick={onClick}>{label}</button>;   // 받은 함수를 진짜 button에 연결
}`,
            },
            { type: 'say', text: 'MyButton이 받은 onClick을 안쪽 `<button>`에 **직접 넘겨 줘야** 클릭이 동작해요. "props는 부모→자식 전달일 뿐"이라는 1장 내용 그대로예요.' },
            { type: 'note', tone: 'tip', text: '공통 Button을 만들 때는 `function Button(props) { return <button {...props} /> }`처럼 받은 props를 통째로 넘기는 경우가 많아요. 그러면 onClick, disabled, type 같은 걸 하나하나 적지 않아도 돼요. 이 앱의 Button도 이렇게 돼 있어요.' },
          ],
        },
      ],
    },
    {
      title: '제어 컴포넌트',
      slides: [
        {
          title: '입력칸 값의 주인은 누구?',
          blocks: [
            { type: 'say', text: '폼 입력칸을 만드는 방법은 두 가지예요. 기준은 딱 하나, **"입력칸 값의 주인이 누구냐"** 예요.\n\n• 주인이 **React state** → **제어 컴포넌트**\n• 주인이 **브라우저(DOM)** → **비제어 컴포넌트**\n\n먼저 제어 컴포넌트부터 볼게요.' },
            {
              type: 'code',
              code: `function NameInput() {
  const [value, setValue] = useState('');
  return (
    <input
      value={value}                                         // 화면에 보일 값 = state
      onChange={(e) => setValue(e.target.value.toUpperCase())}  // 칠 때마다 state 갱신
    />
  );
}
// "react" 를 치면 → 칸에 바로 "REACT"`,
            },
            { type: 'say', text: '글자를 칠 때마다 onChange → setValue → 다시 렌더링 → 칸에 state 값 표시. React가 입력칸을 **완전히 쥐고 있어서** 치는 즉시 대문자로 바꾸거나, 전화번호에 하이픈을 넣거나, 바로 검사할 수 있어요.' },
          ],
        },
        {
          title: 'onChange를 빼먹으면',
          blocks: [
            { type: 'ask', q: 'value={value}만 주고 onChange를 지우면 어떻게 될까요?', a: '**아무리 쳐도 글자가 안 써져요.** 칸에 보일 값은 state인데, state를 바꿔 주는 코드가 없으니 계속 빈칸이에요. 콘솔에는 "value만 있고 onChange가 없다"는 경고가 떠요.\n제어 컴포넌트는 **value와 onChange가 항상 짝**이에요.' },
            { type: 'note', tone: 'warn', text: '입력칸이 10개인 회원가입 폼을 전부 제어 컴포넌트로 만들면 state 10개, 핸들러 10개가 필요하고 **글자 하나 칠 때마다 폼 전체가 다시 렌더링**돼요. 그래서 다음 개념이 필요해요.' },
          ],
        },
      ],
    },
    {
      title: '비제어 컴포넌트와 form action',
      slides: [
        {
          title: '제출할 때 한 번에 읽기',
          blocks: [
            { type: 'say', text: '비제어 컴포넌트는 값을 **브라우저가 들고 있게** 두고, 필요할 때(보통 제출할 때) 한 번에 읽어요. React 19부터는 `<form action={함수}>`가 제출 데이터를 **FormData**로 바로 넘겨 줘서 정말 간단해졌어요.' },
            {
              type: 'code',
              code: `function NicknameForm() {
  const [submitted, setSubmitted] = useState('');

  const handleSubmit = (formData: FormData) => {
    setSubmitted(String(formData.get('nickname')));   // name으로 꺼냄
  };

  return (
    <form action={handleSubmit}>
      <input name="nickname" defaultValue="" />   {/* value 대신 defaultValue */}
      <button type="submit">제출</button>
      <span>{submitted}</span>
    </form>
  );
}`,
            },
            { type: 'list', items: ['`name="nickname"` → FormData에서 꺼낼 때 쓰는 이름표', '`defaultValue` → 처음 값만 정하고 이후는 브라우저가 관리 (`value`를 쓰면 제어 컴포넌트가 돼요)', '글자를 칠 때는 **렌더링이 한 번도 안 일어나요.** 제출할 때만!'] },
          ],
        },
        {
          title: '언제 무엇을 쓸까',
          blocks: [
            {
              type: 'table',
              head: ['', '제어', '비제어'],
              rows: [
                ['값의 주인', 'React state', 'DOM (브라우저)'],
                ['쓰는 법', '`value` + `onChange`', '`defaultValue` + 제출 때 `FormData`'],
                ['글자 칠 때마다', '다시 렌더링', '렌더링 없음'],
                ['잘 맞는 곳', '즉시 검사, 형식 변환, 입력에 따라 다른 UI가 바뀔 때', '제출할 때만 값이 필요한 폼, 파일 업로드'],
              ],
            },
            { type: 'say', text: '고르는 기준 한 줄: **"입력하는 도중에 그 값이 필요한가?"** 필요하면 제어, 제출할 때만 필요하면 비제어.' },
            { type: 'note', tone: 'warn', text: '책에 "비제어는 꼭 필요할 때만"이라고 나오면 반쯤만 맞아요. 비제어는 렌더링을 안 해서 **오히려 성능에 유리**해요. 책이 경계하는 건 ref로 DOM 값을 **강제로 바꾸는** 조작이에요. 파일 업로드(`type="file"`)는 항상 비제어예요.' },
          ],
        },
        {
          title: '폼이 커지면',
          blocks: [
            { type: 'say', text: '실무의 큰 폼은 **React Hook Form**(비제어 기반이라 빠름) + **zod**(검사 규칙과 TypeScript 타입을 한 번에)를 묶어서 많이 써요. 오늘 배운 "비제어 = 성능 유리"와 3-1의 "외부 데이터는 zod"가 합쳐진 거예요.' },
            { type: 'note', tone: 'tip', text: 'Next.js에서는 `<form action>`에 **서버에서 실행되는 함수(Server Action)** 를 바로 연결할 수 있어요. API를 따로 안 만들어도 폼 데이터가 서버로 가요. 그래서 Next.js에서는 비제어 폼이 거의 기본이에요. Next.js 챕터에서 직접 해 볼 거예요.' },
            { type: 'say', text: '3장 끝! 상태, 불변성, 스타일, 이벤트, 폼까지. 이제 웬만한 화면은 혼자 만들 수 있어요. 마지막 확인 문제 가 볼게요.' },
          ],
        },
      ],
    },
  ],
  questions: [
    {
      id: 're03-4-q1',
      source: '이벤트에는 함수를 넘겨요',
      type: 'mcq',
      question: '다음 중 클릭했을 때 remove(todo.id)를 올바르게 실행하는 코드는?',
      choices: ['<button onClick={remove(todo.id)}>', '<button onClick={() => remove(todo.id)}>', '<button onClick="remove(todo.id)">', '<button onclick={remove}>'],
      answer: 1,
      explanation: '인자가 필요하면 화살표 함수로 감싸서 "클릭되면 이걸 실행해"라고 함수를 넘겨요. 1번은 렌더링하는 순간 바로 실행돼요.',
    },
    {
      id: 're03-4-q2',
      source: '이벤트에는 함수를 넘겨요',
      type: 'mcq',
      question: '"Too many re-renders" 에러가 났다. 가장 먼저 의심할 코드는?',
      choices: ['onClick={handle}', 'onClick={handle()} (handle 안에 setState가 있음)', 'className="btn"', 'key={todo.id}'],
      answer: 1,
      explanation: '괄호를 붙이면 렌더링 중에 handle이 실행되고, 안의 setState가 다시 렌더링을 부르고… 끝없이 반복돼요.',
    },
    {
      id: 're03-4-q3',
      source: '이벤트 객체 e',
      type: 'short',
      question: 'onChange 핸들러에서 input에 지금 입력된 글자를 꺼내는 코드는? (e.____.value)',
      answer: ['target', 'e.target.value', 'e.target'],
      explanation: 'e.target은 이벤트가 일어난 요소(input)라서 e.target.value로 입력값을 꺼내요.',
    },
    {
      id: 're03-4-q4',
      source: '이벤트 객체 e',
      type: 'mcq',
      question: '폼을 제출할 때 페이지가 새로고침되는 브라우저 기본 동작을 막는 메서드는?',
      choices: ['e.stopPropagation()', 'e.preventDefault()', 'e.persist()', 'e.nativeEvent()'],
      answer: 1,
      explanation: 'preventDefault는 기본 동작(새로고침, 링크 이동)을 막고, stopPropagation은 부모로 이벤트가 올라가는 걸 막아요.',
    },
    {
      id: 're03-4-q5',
      source: '이벤트 객체 e',
      type: 'ox',
      question: 'React 이벤트 핸들러가 받는 e는 브라우저마다 다른 이벤트를 같은 모양으로 맞춘 합성 이벤트(SyntheticEvent)다.',
      answer: true,
      explanation: 'React가 진짜 이벤트를 한 번 감싸서 정규화해요. 진짜 브라우저 이벤트는 e.nativeEvent에 있어요.',
    },
    {
      id: 're03-4-q6',
      source: '컴포넌트의 onClick은 그냥 prop',
      type: 'mcq',
      question: 'function MyButton({ label }) { return <button>{label}</button> } 에 <MyButton onClick={f} /> 를 쓰면?',
      choices: ['클릭하면 f가 실행된다', '클릭해도 아무 일도 없다 (onClick이 안쪽 button에 연결되지 않았으므로)', '빌드 에러가 난다', 'label이 사라진다'],
      answer: 1,
      explanation: '직접 만든 컴포넌트의 onClick은 그냥 prop이에요. 안쪽 진짜 <button onClick={onClick}>에 넘겨 줘야 동작해요.',
    },
    {
      id: 're03-4-q7',
      source: '제어 컴포넌트',
      type: 'ox',
      question: '<input value={value} /> 처럼 value만 주고 onChange가 없으면, 타이핑해도 글자가 써지지 않는다.',
      answer: true,
      explanation: '제어 컴포넌트는 칸에 state 값을 보여 주는데, state를 바꿀 onChange가 없으니 계속 그대로예요. value와 onChange는 항상 짝이에요.',
    },
    {
      id: 're03-4-q8',
      source: '제어 컴포넌트',
      type: 'mcq',
      question: '입력하는 즉시 전화번호에 하이픈을 넣어 보여 주고 싶다. 알맞은 방식은?',
      choices: ['비제어 컴포넌트 + defaultValue', '제어 컴포넌트 (value + onChange)', '인라인 스타일', 'CSS 모듈'],
      answer: 1,
      explanation: '입력하는 도중에 값이 필요하고 바꿔서 보여 줘야 하니까, state가 값을 쥐는 제어 컴포넌트가 맞아요.',
    },
    {
      id: 're03-4-q9',
      source: '비제어 컴포넌트와 form action',
      type: 'mcq',
      question: 'React 19의 <form action={handleSubmit}> 에서 handleSubmit이 받는 것은?',
      choices: ['이벤트 객체 e', '입력칸들의 값이 담긴 FormData', '아무것도 받지 않는다', 'state 객체'],
      answer: 1,
      explanation: 'form action 함수는 제출된 값을 FormData로 받아요. input의 name으로 formData.get("nickname")처럼 꺼내요.',
    },
    {
      id: 're03-4-q10',
      source: '비제어 컴포넌트와 form action',
      type: 'ox',
      question: '비제어 컴포넌트는 글자를 칠 때마다 다시 렌더링되기 때문에 제어 컴포넌트보다 느리다.',
      answer: false,
      explanation: '반대예요. 비제어는 값을 브라우저가 들고 있어서 타이핑 중에는 렌더링이 없어요. 그래서 큰 폼에 유리하고 React Hook Form도 이 방식을 써요.',
    },
    {
      id: 're03-4-q11',
      source: '비제어 컴포넌트와 form action',
      type: 'essay',
      question: '[면접] 제어 컴포넌트와 비제어 컴포넌트를 어떤 기준으로 고르시나요?',
      answer: '입력하는 도중에 그 값이 필요한지로 고릅니다. 즉시 검사, 형식 변환, 입력값에 따라 다른 UI가 바뀌어야 하면 value와 onChange로 state가 값을 갖는 제어 컴포넌트를 씁니다. 제출할 때만 값이 필요하면 defaultValue와 FormData로 읽는 비제어 방식이 더 간단하고, 글자마다 다시 렌더링하지 않아 성능에도 유리합니다. React 19의 form action과 React Hook Form이 비제어 방식을 잘 활용합니다.',
      keywords: ['값의 주인', 'value/onChange', 'defaultValue/FormData', '리렌더링', 'form action'],
      explanation: '기준 한 줄("도중에 값이 필요한가")과 각각의 쓰는 법, 성능 차이를 말하면 돼요.',
    },
  ],
}

export default topic
