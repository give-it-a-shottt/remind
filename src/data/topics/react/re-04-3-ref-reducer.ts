import type { Topic } from '../../types'

const topic: Topic = {
  id: 're-04-3-ref-reducer',
  track: 'react',
  group: '04. 훅·생명주기·Context',
  title: '4-3. 레이지 초기화·useRef·useReducer',
  order: 403,
  notionId: '409df951bf808131b12af91514be27c4',
  addedAt: '2026-11-05',
  sections: [
    {
      title: '레이지 초기화',
      slides: [
        {
          title: 'useState(0)과 useState(() => 0)',
          blocks: [
            { type: 'say', text: '이번 수업은 useState를 한 단계 더 알고, useRef와 useReducer를 새로 배워요.\n\n먼저 퀴즈. 이 두 줄은 뭐가 다를까요?' },
            {
              type: 'code',
              code: `const [todos] = useState(loadTodos());          // ① 값을 넣음
const [todos] = useState(() => loadTodos());    // ② 값을 만드는 함수를 넣음

function loadTodos() {
  return JSON.parse(localStorage.getItem('todos') ?? '[]');   // 조금 무거운 작업
}`,
            },
            { type: 'say', text: '초깃값은 **마운트 때 딱 한 번만** 쓰이고, 그 뒤로는 무시돼요. 그런데 ①은 컴포넌트 함수가 다시 실행될 **때마다** `loadTodos()`도 매번 실행돼요. 결과는 그냥 버려지고요.' },
          ],
        },
        {
          title: '함수로 넘기면 한 번만',
          blocks: [
            {
              type: 'table',
              head: ['쓰는 법', '마운트 + 다시 렌더링 3번 동안 실행 횟수'],
              rows: [
                ['`useState(loadTodos())`', '**4번** (매번 실행, 결과는 버려짐)'],
                ['`useState(() => loadTodos())` 또는 `useState(loadTodos)`', '**1번**'],
              ],
            },
            { type: 'say', text: '②처럼 **함수를 넘기면** React가 마운트 때 한 번만 불러요. 이걸 **레이지 초기화(lazy initialization)** 라고 해요. 초깃값 만드는 데 비용이 들 때 써요. 숫자 0 같은 단순한 값은 그냥 써도 돼요.' },
            { type: 'note', tone: 'warn', text: '"레이지(게으른)"라서 **비동기로 나중에 실행된다**고 오해하기 쉬워요. 아니에요. 첫 렌더링 중에 **바로(동기적으로)** 불려요. "필요할 때(마운트 때) 한 번만 하고 그 뒤로는 안 한다"는 뜻의 게으름이에요. async 함수를 넣으면 state에 Promise 객체가 들어가 버려요.' },
          ],
        },
      ],
    },
    {
      title: 'useRef: 기억하지만 화면은 안 바꾸는 서랍',
      slides: [
        {
          title: '세 가지 저장 방법',
          blocks: [
            { type: 'say', text: '컴포넌트 안에서 값을 저장하는 방법이 세 가지 있어요. 차이를 정확히 알아야 해요.' },
            {
              type: 'table',
              head: ['', '다시 렌더링돼도 값 유지?', '바꾸면 다시 렌더링?', '쓰는 곳'],
              rows: [
                ['일반 변수 `let`', '아니요 (매번 초깃값)', '아니요', '렌더링 중 잠깐 쓰는 계산'],
                ['`useRef`', '**예**', '**아니요**', 'DOM 요소 잡기, 타이머 id, 이전 값 기억'],
                ['`useState`', '예', '**예**', '화면에 보여야 하는 값'],
              ],
            },
            { type: 'note', tone: 'analogy', text: '• 일반 변수 = 칠판. 수업(렌더링)이 끝나면 지워져요.\n• useRef = 내 **비밀 서랍**. 계속 남아 있지만, 서랍에 뭘 넣었다고 선생님이 칠판을 다시 쓰진 않아요.\n• useState = **게시판**. 계속 남고, 바뀌면 모두가 보게 다시 붙여요.' },
          ],
        },
        {
          title: '실험으로 확인하기',
          blocks: [
            {
              type: 'code',
              code: `function RefVsState() {
  let plain = 0;
  const ref = useRef(0);
  const [state, setState] = useState(0);

  return (
    <div>
      <button onClick={() => { plain++; }}>plain++</button>
      <button onClick={() => { ref.current++; }}>ref++</button>
      <button onClick={() => setState(state + 1)}>state++</button>
      <p>plain={plain} ref={ref.current} state={state}</p>
    </div>
  );
}`,
            },
            { type: 'ask', q: 'plain++ 1번, ref++ 2번 누른 다음 state++ 1번 누르면 화면에 뭐가 보일까요?', a: '처음 세 번 클릭까지는 화면이 그대로예요(plain과 ref는 렌더링을 안 일으켜요).\nstate++를 누르면 다시 렌더링되면서 **plain=0 ref=2 state=1**이 보여요.\n• ref는 **2를 기억**하고 있었고\n• plain은 렌더링되면서 `let plain = 0`으로 **리셋**됐어요.' },
          ],
        },
        {
          title: 'ref 값을 화면에 보여 주면 안 돼요',
          blocks: [
            { type: 'say', text: '방금 실험에서 ref를 2번 눌러도 화면은 0이었다가, 엉뚱하게 state 버튼을 누르자 2가 나타났죠. ref 값을 화면에 보여 주면 이렇게 **"언제 바뀔지 모르는"** 화면이 돼요.\n\n규칙: **화면에 보여야 하면 state, 기억만 하면 되면 ref.**' },
            { type: 'note', tone: 'warn', text: '책에 "다시 렌더링되면 상태(useState)가 리셋된다"고 적혀 있다면 틀린 말이에요. **state는 다시 렌더링돼도 유지돼요.** 리셋되는 건 일반 변수예요.' },
            { type: 'code', code: `const timerId = useRef<number | null>(null);
timerId.current = setInterval(tick, 1000);   // 나중에 clearInterval(timerId.current) 하려고 기억` },
          ],
        },
      ],
    },
    {
      title: 'useRef로 DOM 요소 잡기',
      slides: [
        {
          title: '입력칸에 자동으로 커서 두기',
          blocks: [
            { type: 'say', text: 'useRef의 또 다른 큰 용도는 **진짜 DOM 요소를 잡는 것**이에요. 포커스, 스크롤, 크기 재기처럼 React가 직접 안 해 주는 일을 할 때요.' },
            {
              type: 'code',
              code: `function SearchBox() {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();    // 마운트되면 입력칸에 커서
  }, []);

  return <input ref={inputRef} placeholder="강의 검색" />;
}`,
            },
            { type: 'list', items: ['`ref={inputRef}` → React가 이 input 요소를 `inputRef.current`에 넣어 줘요', '처음 렌더링 중에는 아직 DOM이 없어서 `current`가 **null**이에요 (4-2 마운트 순서 ①)', '그래서 useEffect(화면에 붙은 뒤)에서 써요. `?.`는 null이면 그냥 넘어가라는 뜻이에요'] },
          ],
        },
        {
          title: 'React 19: ref도 그냥 prop',
          blocks: [
            { type: 'say', text: '내가 만든 Input 컴포넌트에 ref를 넘기고 싶을 때, 예전에는 `forwardRef`라는 걸로 감싸야 했어요.' },
            {
              type: 'code',
              code: `// 예전 (React 18까지)
const MyInput = forwardRef((props, ref) => <input ref={ref} {...props} />);

// React 19부터: ref를 일반 prop처럼 받는다
function MyInput({ ref, ...props }) {
  return <input ref={ref} {...props} />;
}`,
            },
            { type: 'note', tone: 'tip', text: '오래된 코드에서 `forwardRef`를 보면 "예전 방식이구나" 하고 읽으면 돼요. React 19에서는 필요 없어요.' },
          ],
        },
      ],
    },
    {
      title: 'useReducer: 무슨 일이 있었는지만 알리기',
      slides: [
        {
          title: '상태 바꾸는 방법이 많아지면',
          blocks: [
            { type: 'say', text: '할 일 앱에 기능이 늘었어요. 추가, 완료 토글, 삭제, 전체 완료, 완료 항목 지우기… 핸들러마다 `setTodos(...)` 로직이 흩어지면 "todos가 어떻게 바뀌는지" 한눈에 보기 어려워요.\n\n**useReducer**는 상태를 바꾸는 규칙을 **한 함수(reducer)** 에 모으는 훅이에요.' },
            { type: 'note', tone: 'analogy', text: '식당에서 손님(컴포넌트)은 "김치찌개 하나요"라고 **주문서(action)** 만 내요. 어떻게 끓일지는 **주방(reducer)** 이 정하죠. 손님이 주방에 들어가서 직접 끓이지 않아요.' },
          ],
        },
        {
          title: '코드로 보면',
          blocks: [
            {
              type: 'code',
              code: `type Action =
  | { type: 'add'; title: string }
  | { type: 'toggle'; id: number }
  | { type: 'remove'; id: number };        // 주문서 종류 = 액션 목록

function todoReducer(todos: Todo[], action: Action): Todo[] {   // 주방 (컴포넌트 밖)
  switch (action.type) {
    case 'add':    return [...todos, { id: Date.now(), title: action.title, done: false }];
    case 'toggle': return todos.map((t) => (t.id === action.id ? { ...t, done: !t.done } : t));
    case 'remove': return todos.filter((t) => t.id !== action.id);
  }
}

const [todos, dispatch] = useReducer(todoReducer, []);
dispatch({ type: 'toggle', id: 3 });     // "3번 토글해 주세요" 주문만`,
            },
            {
              type: 'list',
              items: [
                '`dispatch(action)` → 주문서를 내는 함수',
                'reducer는 (지금 상태, 주문서)를 받아 **새 상태**를 돌려줘요. 3장 불변성 패턴 그대로',
                'reducer는 화면과 상관없는 **순수 함수**라 화면 없이 테스트하기 쉬워요',
              ],
            },
          ],
        },
        {
          title: '언제 useReducer를 쓸까',
          blocks: [
            { type: 'say', text: '4-1에서 "유저플로우에서 **액션**을 뽑는다"고 했죠? 그 액션 목록이 **그대로 Action 타입**이 돼요. 기획 → 설계 → 코드가 이렇게 이어져요.' },
            {
              type: 'table',
              head: ['useState로 충분', 'useReducer가 나음'],
              rows: [
                ['값이 단순하고 바꾸는 방법이 한두 가지', '바꾸는 방법이 여러 가지 (추가·삭제·수정·초기화…)'],
                ['토글, 입력값, 카운터', '여러 값이 함께 바뀌는 복잡한 상태'],
                ['', '상태 변경 규칙을 테스트하고 싶을 때'],
              ],
            },
            { type: 'note', tone: 'tip', text: '5장에서 배울 Redux도 "action을 dispatch하면 reducer가 새 상태를 만든다"는 같은 구조예요. 오늘 useReducer를 이해하면 Redux가 쉬워져요.' },
            { type: 'say', text: '수업 끝! 확인 문제 가요.' },
          ],
        },
      ],
    },
  ],
  questions: [
    {
      id: 're04-3-q1',
      source: '레이지 초기화',
      type: 'mcq',
      question: 'useState(loadTodos()) 를 useState(() => loadTodos()) 로 바꾸면 생기는 차이는?',
      choices: ['초깃값이 비동기로 나중에 들어간다', 'loadTodos가 렌더링마다가 아니라 마운트 때 한 번만 실행된다', 'state가 매번 초기화된다', '차이가 없다'],
      answer: 1,
      explanation: '함수를 넘기면 React가 마운트 때 한 번만 불러요(레이지 초기화). 값을 넣으면 렌더링마다 실행되고 결과는 버려져요.',
    },
    {
      id: 're04-3-q2',
      source: '레이지 초기화',
      type: 'ox',
      question: '레이지 초기화 함수는 첫 렌더링이 끝난 뒤 비동기로 실행된다.',
      answer: false,
      explanation: '첫 렌더링 중에 동기적으로 바로 실행돼요. "레이지"는 "마운트 때 한 번만"이라는 뜻이에요.',
    },
    {
      id: 're04-3-q3',
      source: 'useRef: 기억하지만 화면은 안 바꾸는 서랍',
      type: 'mcq',
      question: '다시 렌더링돼도 값이 유지되지만, 바꿔도 다시 렌더링을 일으키지 않는 것은?',
      choices: ['일반 변수 let', 'useRef', 'useState', 'props'],
      answer: 1,
      explanation: 'ref는 값을 기억하지만 렌더링을 일으키지 않아요. state는 렌더링을 일으키고, 일반 변수는 렌더링마다 리셋돼요.',
    },
    {
      id: 're04-3-q4',
      source: 'useRef: 기억하지만 화면은 안 바꾸는 서랍',
      type: 'mcq',
      question: 'plain(let) 1번, ref 2번 클릭 후 state를 1번 클릭하면 화면에 보이는 값은?',
      choices: ['plain=1 ref=2 state=1', 'plain=0 ref=2 state=1', 'plain=0 ref=0 state=1', 'plain=1 ref=0 state=1'],
      answer: 1,
      explanation: 'state 클릭으로 다시 렌더링될 때 ref는 기억한 2가 보이고, plain은 let plain = 0으로 리셋돼요.',
    },
    {
      id: 're04-3-q5',
      source: 'useRef: 기억하지만 화면은 안 바꾸는 서랍',
      type: 'ox',
      question: '화면에 보여야 하는 카운터 값은 useRef로 관리해도 괜찮다.',
      answer: false,
      explanation: 'ref는 바꿔도 화면이 안 바뀌어요. 다른 이유로 렌더링될 때 갑자기 바뀐 값이 보여서 혼란스러워요. 화면에 보여야 하면 state예요.',
    },
    {
      id: 're04-3-q6',
      source: 'useRef로 DOM 요소 잡기',
      type: 'mcq',
      question: 'const inputRef = useRef<HTMLInputElement>(null) 일 때, 컴포넌트 함수 본문(첫 렌더링 중)에서 inputRef.current 값은?',
      choices: ['input 요소', 'null', 'undefined', '빈 문자열'],
      answer: 1,
      explanation: '첫 렌더링 중에는 아직 DOM이 없어서 null이에요. DOM이 붙은 뒤(useEffect)에서 focus() 같은 걸 해요.',
    },
    {
      id: 're04-3-q7',
      source: 'useRef로 DOM 요소 잡기',
      type: 'ox',
      question: 'React 19에서는 함수 컴포넌트가 ref를 받으려면 반드시 forwardRef로 감싸야 한다.',
      answer: false,
      explanation: 'React 19부터 ref를 일반 prop처럼 받을 수 있어서 forwardRef가 필요 없어요.',
    },
    {
      id: 're04-3-q8',
      source: 'useReducer: 무슨 일이 있었는지만 알리기',
      type: 'mcq',
      question: 'useReducer에서 컴포넌트가 상태를 바꾸려고 부르는 함수는?',
      choices: ['setState', 'dispatch', 'reducer', 'useEffect'],
      answer: 1,
      explanation: '컴포넌트는 dispatch({ type: ... })로 "무슨 일이 있었는지"만 알리고, 새 상태는 reducer가 계산해요.',
    },
    {
      id: 're04-3-q9',
      source: 'useReducer: 무슨 일이 있었는지만 알리기',
      type: 'mcq',
      question: 'reducer 함수에 대한 설명으로 옳은 것은?',
      choices: ['state를 직접 고쳐서(push 등) 돌려준다', '(지금 상태, action)을 받아 새 상태를 돌려주는 순수 함수다', '컴포넌트 안에서만 정의할 수 있다', '비동기로 서버 요청을 보낸다'],
      answer: 1,
      explanation: 'reducer는 원본을 바꾸지 않고 새 상태를 돌려주는 순수 함수예요. 컴포넌트 밖에 두면 화면 없이 테스트하기 좋아요.',
    },
  ],
}

export default topic
