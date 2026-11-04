import type { Topic } from '../../types'

const topic: Topic = {
  id: 're-02-5-props-list',
  track: 'react',
  group: '02. JS·TS 기초와 JSX',
  title: '2-5. props와 리스트 렌더링',
  order: 205,
  notionId: '409df951bf8081cfb4f9d06ed5d19c02',
  addedAt: '2026-11-05',
  sections: [
    {
      title: 'props는 읽기 전용',
      slides: [
        {
          title: '1장 복습부터',
          blocks: [
            { type: 'say', text: '2장 마지막 수업이에요! 오늘은 할 일 목록 하나를 만들면서 props, key, 렌더링을 제대로 정리할 거예요.\n\n먼저 1장에서 배운 걸 떠올려 볼게요.\n• props는 **부모 → 자식**으로만 내려가요.\n• 자식은 받은 props를 **바꾸지 않아요.** 바꾸고 싶으면 부모가 준 함수를 불러서 부탁해요.' },
            { type: 'ask', q: 'props.todo.title = "수정" 이라고 쓰면 에러가 날까요?', a: '**에러 없이 실행은 돼요.** 객체 안쪽 값은 자바스크립트 문법상 바꿀 수 있거든요.\n하지만 React는 그 변화를 **모르고**, 화면도 안 바뀌어요. 그러다 나중에 부모가 다시 그려지면 엉뚱한 값이 튀어나와요. 그래서 "못 바꾼다"는 말은 "**바꾸면 안 된다**(규칙)"는 뜻이에요.' },
          ],
        },
        {
          title: '화면이 이상하면 데이터를 보세요',
          blocks: [
            { type: 'say', text: 'React에서 화면은 **상태와 props의 결과**예요. 공식처럼 쓰면 `UI = f(state)`.\n\n그래서 화면이 이상할 때는 화면 코드를 고치기 전에 **"지금 state·props가 무슨 값이지?"** 부터 봐요. 값이 맞는데 화면이 틀리면 JSX 문제, 값부터 틀리면 데이터를 바꾸는 코드 문제예요.' },
            { type: 'note', tone: 'tip', text: '크롬 확장 **React Developer Tools**를 설치하면 개발자 도구에 Components 탭이 생겨요. 컴포넌트를 클릭하면 지금 props와 state 값을 바로 볼 수 있어요. 디버깅의 첫걸음이에요.' },
          ],
        },
      ],
    },
    {
      title: '상태 끌어올리기',
      slides: [
        {
          title: '형제끼리는 직접 말할 수 없어요',
          blocks: [
            { type: 'say', text: '할 일 앱에 컴포넌트가 두 개 있어요.\n• `TodoForm`: 입력칸에 할 일을 쓰고 추가 버튼을 누름\n• `TodoList`: 할 일 목록을 보여 줌\n\nTodoForm에서 추가한 할 일이 TodoList에 나와야 해요. 그런데 둘은 **형제**예요. props는 부모 → 자식으로만 흐르니까 형제끼리는 직접 데이터를 주고받을 수 없어요.' },
            { type: 'ask', q: '그럼 todos 상태를 어디에 두어야 할까요?', a: '**둘의 공통 부모(App)** 에 둬요.\nApp이 todos를 가지고 → TodoList에는 todos를, TodoForm에는 "추가해 줘" 함수를 내려 줘요. 이렇게 상태를 위로 옮기는 걸 **상태 끌어올리기(lifting state up)** 라고 해요.' },
          ],
        },
        {
          title: '코드로 보면',
          blocks: [
            {
              type: 'code',
              code: `function App() {
  const [todos, setTodos] = useState<Todo[]>([]);   // 데이터의 주인

  const add = (title: string) =>
    setTodos([...todos, { id: Date.now(), title, status: 'todo' }]);

  return (
    <>
      <TodoForm onAdd={add} />        {/* 요청할 함수만 */}
      <TodoList todos={todos} />      {/* 보여 줄 데이터만 */}
    </>
  );
}`,
            },
            { type: 'say', text: '데이터는 App 한 곳에만 있어요. 여러 컴포넌트가 각자 todos를 가지고 있으면 "어느 게 진짜지?" 하는 순간이 반드시 와요. **진짜 데이터는 한 곳에만** 두는 게 원칙이에요. 이걸 **단일 진실 공급원(single source of truth)** 이라고도 불러요.' },
          ],
        },
      ],
    },
    {
      title: '목록을 컴포넌트로 쪼개기',
      slides: [
        {
          title: 'App → TodoList → TodoItem',
          blocks: [
            {
              type: 'code',
              code: `App                 ← todos 상태를 가짐 (데이터의 주인)
└─ TodoList        ← todos를 받아서 map으로 반복
   ├─ TodoItem     ← todo 하나만 받아서 그림
   ├─ TodoItem
   └─ TodoItem`,
            },
            {
              type: 'code',
              code: `function TodoList({ todos }: { todos: Todo[] }) {
  return (
    <ul>
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
}

function TodoItem({ todo }: { todo: Todo }) {
  return <li>{todo.title} — {todo.status}</li>;
}`,
            },
          ],
        },
        {
          title: '꼭 쪼개야 하나요?',
          blocks: [
            { type: 'say', text: '**항상은 아니에요.** 항목이 `<li>{name}</li>` 한 줄이면 굳이 쪼갤 필요 없어요. 항목에 버튼, 체크박스, 여러 줄의 마크업이 생기면 그때 쪼개요.' },
            {
              type: 'table',
              head: ['쪼개면 좋은 점', '왜'],
              rows: [
                ['테스트·디버깅이 쉬움', 'TodoItem은 "todo 하나 그리기"만 해서 todo 하나만 넣어 보면 돼요'],
                ['재사용', '검색 결과, 완료 목록 같은 다른 화면에서도 TodoItem을 써요'],
                ['렌더링 최적화의 단위', '마지막 개념에서 배울 memo를 붙일 수 있는 단위가 생겨요 (저절로 빨라지는 건 아님!)'],
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'key 규칙',
      slides: [
        {
          title: 'key는 항목의 이름표',
          blocks: [
            { type: 'say', text: '1-1에서 key를 잠깐 봤죠. React는 목록이 바뀌었을 때 **key를 보고** "누가 추가됐고, 누가 빠졌고, 누가 자리를 옮겼는지" 알아내요. 오늘은 규칙을 확실히 정리할게요.' },
            {
              type: 'table',
              head: ['규칙', '이유'],
              rows: [
                ['형제 사이에서만 고유하면 됨', '앱 전체에서 고유할 필요는 없어요'],
                ['**바뀌지 않는** 값 (DB id)', '렌더링마다 바뀌면 매번 새 항목인 줄 알고 통째로 다시 만들어요'],
                ['`Math.random()` 금지', '매 렌더링마다 바뀌는 값의 대표예요'],
                ['배열 index는 조심', '중간에 추가·삭제·정렬하면 항목과 key가 어긋나요. 절대 안 바뀌는 고정 목록만 OK'],
              ],
            },
          ],
        },
        {
          title: 'key를 어디에 붙이나요',
          blocks: [
            {
              type: 'code',
              code: `// ✅ map 바로 안쪽 요소에
{todos.map((todo) => <TodoItem key={todo.id} todo={todo} />)}

// ❌ TodoItem 안쪽의 li에 붙이면 소용없다
function TodoItem({ todo }) {
  return <li key={todo.id}>{todo.title}</li>;
}`,
            },
            { type: 'say', text: 'key는 **map이 바로 돌려주는 요소**에 붙여요. React가 형제들을 비교하는 자리가 거기거든요.' },
            { type: 'ask', q: 'TodoItem 안에서 props.key 로 id를 읽을 수 있을까요?', a: '**못 읽어요.** key는 React가 쓰는 특별한 속성이라 자식에게 props로 전달되지 않아요. 자식에서 id가 필요하면 `todo={todo}`처럼 따로 넘기거나 `id={todo.id}`를 하나 더 넘겨요.' },
          ],
        },
      ],
    },
    {
      title: '렌더링과 커밋은 달라요',
      slides: [
        {
          title: '"렌더링 = 화면을 그리는 것"?',
          blocks: [
            { type: 'say', text: '보통 "렌더링"이라고 하면 화면을 그린다고 생각하죠. 그런데 React에서 말하는 렌더링은 더 좁은 뜻이에요.\n\n**렌더링 = React가 컴포넌트 함수를 불러서 "화면이 어떻게 생겨야 하는지(JSX)"를 계산하는 것.**\n\n실제 화면(DOM)을 바꾸는 건 그다음 단계예요.' },
            {
              type: 'table',
              head: ['단계', '하는 일'],
              rows: [
                ['① 트리거', '처음 화면을 띄우거나, state가 바뀜'],
                ['② 렌더링', '컴포넌트 함수를 실행해 새 JSX(가상 DOM 트리)를 계산하고 이전과 비교'],
                ['③ 커밋', '달라진 부분만 실제 DOM에 반영'],
                ['(브라우저) 페인트', '브라우저가 화면에 픽셀을 칠함 — React 밖의 일'],
              ],
            },
            { type: 'note', tone: 'analogy', text: '식당으로 보면 렌더링은 "주문서를 새로 쓰고 이전 주문서와 비교하기", 커밋은 "달라진 메뉴만 실제로 조리해서 내보내기"예요. 주문서를 다시 썼다고 요리를 다시 하는 건 아니에요.' },
          ],
        },
        {
          title: '다시 렌더링돼도 화면은 그대로일 수 있어요',
          blocks: [
            { type: 'say', text: '그래서 "다시 렌더링됐다 = 화면이 다시 그려졌다"가 **아니에요.** 함수가 다시 실행돼서 계산했는데 결과가 이전과 같으면 커밋할 게 없어서 실제 DOM은 그대로예요.' },
            { type: 'note', tone: 'warn', text: '`npm run dev`(개발 모드)에서 console.log가 **두 번씩** 찍혀서 놀랄 수 있어요. main.tsx의 `<StrictMode>`가 실수를 찾으려고 개발 모드에서만 컴포넌트를 일부러 두 번 실행하기 때문이에요. 버그가 아니에요. 배포 빌드에서는 한 번만 실행돼요.' },
          ],
        },
      ],
    },
    {
      title: 'memo로 다시 렌더링 건너뛰기',
      slides: [
        {
          title: '부모가 다시 그려지면 자식도 전부',
          blocks: [
            { type: 'say', text: '여기 진짜 중요한 사실이 있어요. React의 기본 동작은 **부모가 다시 렌더링되면 자식도 props가 같든 말든 전부 다시 렌더링**하는 거예요.' },
            {
              type: 'code',
              code: `function App() {
  const [count, setCount] = useState(0);
  const [todos] = useState(initialTodos);   // 할 일 3개, 안 바뀜
  return (
    <>
      <button onClick={() => setCount(count + 1)}>카운트 {count}</button>
      <TodoList todos={todos} />
    </>
  );
}`,
            },
            { type: 'ask', q: 'TodoItem 안에 console.log를 넣고 버튼을 2번 누르면, 처음 포함 몇 번 찍힐까요?', a: '**9번**이에요. 처음 3번 + 클릭마다 3번씩 2번.\ntodos는 하나도 안 바뀌었는데, 부모인 App이 count 때문에 다시 렌더링되니까 자식들도 따라서 다시 실행된 거예요. (커밋할 건 없어서 실제 DOM은 그대로예요.)' },
          ],
        },
        {
          title: 'memo로 감싸면',
          blocks: [
            {
              type: 'code',
              code: `import { memo } from 'react';

function TodoItem({ todo }: { todo: Todo }) {
  console.log('렌더링:', todo.title);
  return <li>{todo.title}</li>;
}

export default memo(TodoItem);   // props가 같으면 다시 렌더링 안 함`,
            },
            {
              type: 'table',
              head: ['버튼 2번 클릭 (todos는 그대로)', 'TodoItem 렌더링 횟수'],
              rows: [
                ['memo 없음', '처음 3 + 클릭마다 3 = **9번**'],
                ['`memo(TodoItem)`', '처음 3 + 클릭해도 0 = **3번**'],
              ],
            },
            { type: 'say', text: '`memo`는 "지난번이랑 props가 같으면 이번엔 건너뛰어 줘"라는 표시예요. 앞 개념에서 "쪼개면 최적화의 **단위**가 생긴다"고 한 게 이 뜻이에요. 쪼개기만 해서는 안 빨라지고, memo를 붙여야 건너뛰어요.' },
          ],
        },
        {
          title: 'memo가 소용없어지는 경우',
          blocks: [
            { type: 'say', text: 'memo는 props를 **같은 상자(같은 주소)인지**로 비교해요. 2-1 전개 연산자에서 배운 그 원리예요.' },
            {
              type: 'code',
              code: `<TodoItem todo={todo} onDelete={() => remove(todo.id)} />
// 화살표 함수가 렌더링마다 새로 만들어짐 → 매번 "다른 props" → memo 무력화`,
            },
            { type: 'say', text: '해결 방법은 함수를 `useCallback`으로, 객체를 `useMemo`로 고정하는 거예요(4장에서 배워요). 또는 1-1에서 말한 **React Compiler**를 켜면 이런 걸 자동으로 처리해 줘요. 그래서 요즘은 "memo를 손으로 도배"하기보다 Compiler에 맡기는 추세예요.' },
            { type: 'note', tone: 'tip', text: 'memo를 모든 컴포넌트에 붙이지는 않아요. props 비교 자체도 비용이고, 대부분의 다시 렌더링은 충분히 빨라요. **목록이 길거나 항목이 무겁고, 실제로 느릴 때** 붙여요.' },
            { type: 'say', text: '2장 수업 끝! 정말 많은 걸 배웠어요. 마지막 확인 문제 풀고 마무리해요.' },
          ],
        },
      ],
    },
  ],
  questions: [
    {
      id: 're02-5-q1',
      source: 'props는 읽기 전용',
      type: 'ox',
      question: '자식 컴포넌트에서 props.todo.title = "수정" 을 실행하면 자바스크립트 에러가 나서 막힌다.',
      answer: false,
      explanation: '객체 안쪽 값은 문법상 바뀌어서 에러는 안 나요. 하지만 React는 변화를 모르고 화면도 안 바뀌어요. 그래서 "바꾸면 안 된다"는 규칙이에요.',
    },
    {
      id: 're02-5-q2',
      source: 'props는 읽기 전용',
      type: 'mcq',
      question: '화면에 이상한 값이 보일 때 가장 먼저 확인할 것은?',
      choices: ['CSS 파일', '지금 state와 props가 어떤 값인지', '브라우저 버전', 'node_modules 용량'],
      answer: 1,
      explanation: 'UI = f(state). 화면은 데이터의 결과라서, 데이터 값부터 확인해요. React Developer Tools의 Components 탭이 도움이 돼요.',
    },
    {
      id: 're02-5-q3',
      source: '상태 끌어올리기',
      type: 'mcq',
      question: '형제인 TodoForm과 TodoList가 같은 todos를 써야 한다. todos 상태는 어디에 두어야 할까?',
      choices: ['TodoForm 안에', 'TodoList 안에', '둘의 공통 부모(App)에', '둘 다 각자 하나씩'],
      answer: 2,
      explanation: '형제끼리는 props를 주고받을 수 없어서 공통 부모로 상태를 끌어올려요. 부모가 데이터와 함수를 각각 내려 줘요.',
      choiceExplanations: ['TodoList가 todos를 받을 방법이 없어요.', 'TodoForm이 todos를 바꿀 방법이 없어요.', '맞아요. 상태 끌어올리기예요.', '둘이 따로 놀아서 "어느 게 진짜지?" 문제가 생겨요.'],
    },
    {
      id: 're02-5-q4',
      source: '목록을 컴포넌트로 쪼개기',
      type: 'ox',
      question: '목록 항목을 별도 컴포넌트(TodoItem)로 쪼개기만 하면 React가 자동으로 다시 렌더링을 줄여 준다.',
      answer: false,
      explanation: '쪼개는 건 memo를 붙일 수 있는 단위를 만드는 것뿐이에요. 기본으로는 부모가 다시 그려지면 자식도 전부 다시 렌더링돼요.',
    },
    {
      id: 're02-5-q5',
      source: 'key 규칙',
      type: 'mcq',
      question: '할 일 목록(추가·삭제·정렬 가능)의 key로 가장 알맞은 것은?',
      choices: ['Math.random()', '배열 index', 'todo.id (DB에서 온 고유 값)', 'todo.title'],
      answer: 2,
      explanation: 'key는 형제 사이에서 고유하고 바뀌지 않아야 해요. random은 매번 바뀌고, index는 순서가 바뀌면 어긋나고, title은 겹칠 수 있어요.',
      choiceExplanations: ['렌더링마다 바뀌어서 매번 새 항목으로 다시 만들어요.', '추가·삭제·정렬하면 항목과 key가 어긋나요.', '맞아요.', '같은 제목의 할 일이 두 개면 겹쳐요.'],
    },
    {
      id: 're02-5-q6',
      source: 'key 규칙',
      type: 'ox',
      question: '<TodoItem key={todo.id} /> 로 넘긴 key는 TodoItem 안에서 props.key 로 읽을 수 있다.',
      answer: false,
      explanation: 'key는 React가 비교에 쓰는 특별한 속성이라 props로 전달되지 않아요. id가 필요하면 따로 넘겨요.',
    },
    {
      id: 're02-5-q7',
      source: '렌더링과 커밋은 달라요',
      type: 'mcq',
      question: 'React에서 "렌더링"의 정확한 뜻은?',
      choices: ['브라우저가 화면에 픽셀을 칠하는 것', '컴포넌트 함수를 실행해 화면이 어떻게 생겨야 하는지 계산하는 것', '실제 DOM 전체를 새로 만드는 것', 'CSS를 적용하는 것'],
      answer: 1,
      explanation: '렌더링은 "계산", 실제 DOM에 반영하는 건 "커밋"이에요. 다시 렌더링돼도 결과가 같으면 DOM은 그대로예요.',
    },
    {
      id: 're02-5-q8',
      source: '렌더링과 커밋은 달라요',
      type: 'ox',
      question: 'npm run dev에서 컴포넌트의 console.log가 두 번씩 찍히는 건 버그다.',
      answer: false,
      explanation: 'StrictMode가 개발 모드에서만 일부러 두 번 실행해 실수를 찾아 줘요. 배포 빌드에서는 한 번만 실행돼요.',
    },
    {
      id: 're02-5-q9',
      source: 'memo로 다시 렌더링 건너뛰기',
      type: 'mcq',
      question: 'App의 count만 바뀌고 todos(3개)는 그대로일 때, memo가 없는 TodoItem은 버튼 2번 클릭 후 처음 포함 몇 번 렌더링될까?',
      choices: ['3번', '6번', '9번', '0번'],
      answer: 2,
      explanation: '처음 3번 + 클릭마다 3번씩 2번 = 9번이에요. 부모가 다시 렌더링되면 자식도 기본으로 전부 다시 렌더링돼요. memo로 감싸면 3번이에요.',
    },
    {
      id: 're02-5-q10',
      source: 'memo로 다시 렌더링 건너뛰기',
      type: 'mcq',
      question: 'memo(TodoItem)인데도 매번 다시 렌더링된다. 가장 의심스러운 코드는?',
      choices: ['<TodoItem todo={todo} />', '<TodoItem todo={todo} onDelete={() => remove(todo.id)} />', '<TodoItem key={todo.id} todo={todo} />', 'export default memo(TodoItem)'],
      answer: 1,
      explanation: 'memo는 props를 같은 주소인지로 비교해요. 화살표 함수를 JSX에서 바로 만들면 렌더링마다 새 함수라 매번 "다른 props"가 돼요. useCallback이나 React Compiler로 해결해요.',
    },
    {
      id: 're02-5-q11',
      source: 'memo로 다시 렌더링 건너뛰기',
      type: 'essay',
      question: '[면접] 컴포넌트를 세분화하면 렌더링이 자동으로 줄어드나요? 렌더링과 커밋의 차이와 함께 설명해 주세요.',
      answer: '자동으로 줄지는 않습니다. React는 부모가 다시 렌더링되면 자식도 props가 같아도 기본으로 다시 렌더링합니다. memo로 감싸거나 React Compiler를 켜야 건너뜁니다. 또 렌더링은 컴포넌트 함수를 실행해 결과를 계산하는 단계이고, 실제 DOM 변경은 이전 결과와 비교해 달라진 부분만 반영하는 커밋 단계에서 일어나므로, 다시 렌더링되어도 DOM은 바뀌지 않을 수 있습니다.',
      keywords: ['부모 리렌더링 → 자식 리렌더링', 'memo', 'React Compiler', '렌더링은 계산', '커밋은 반영'],
      explanation: '"세분화는 memo를 붙일 단위를 만드는 것"과 "렌더링(계산) ≠ 커밋(반영)" 두 가지를 말하면 돼요.',
    },
  ],
}

export default topic
