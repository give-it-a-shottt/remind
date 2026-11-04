import type { Topic } from '../../types'

const topic: Topic = {
  id: 're-04-4-memo-custom-hook',
  track: 'react',
  group: '04. 훅·생명주기·Context',
  title: '4-4. 메모이제이션과 커스텀 훅',
  order: 404,
  notionId: '409df951bf808131b12af91514be27c4',
  addedAt: '2026-11-05',
  sections: [
    {
      title: 'useMemo: 계산 결과 기억하기',
      slides: [
        {
          title: '매번 다시 계산할 필요가 있을까',
          blocks: [
            { type: 'say', text: '이번 수업은 **메모이제이션**이에요. 어려운 말 같지만 뜻은 간단해요. **"한 번 계산한 결과를 메모해 두고, 재료가 같으면 메모를 다시 쓰기."**' },
            { type: 'say', text: '강의 10,000개 중에서 검색어에 맞는 것만 거르는 컴포넌트가 있어요. 그런데 이 컴포넌트에는 "다크 모드" 버튼도 있어요. 다크 모드를 누를 때마다 컴포넌트가 다시 렌더링되면서 **10,000개 거르기를 또** 해요. 검색어는 하나도 안 바뀌었는데요.' },
            {
              type: 'code',
              code: `// 렌더링마다 매번 10,000개를 다시 거름
const result = courses.filter((c) => c.title.includes(query));

// query나 courses가 바뀔 때만 다시 거르고, 아니면 지난 결과를 그대로
const result = useMemo(
  () => courses.filter((c) => c.title.includes(query)),
  [courses, query],
);`,
            },
          ],
        },
        {
          title: 'useMemo 읽는 법',
          blocks: [
            { type: 'list', items: ['첫 번째 인자: 계산하는 함수', '두 번째 인자: 재료 목록(deps). useEffect의 deps와 같은 규칙이에요', '재료가 지난번과 같으면 함수를 실행하지 않고 **지난 결과값**을 돌려줘요'] },
            { type: 'note', tone: 'analogy', text: '수학 숙제에서 "37 × 48"을 한 번 계산했으면 답을 옆에 메모해 두죠. 같은 문제가 또 나오면 다시 곱하지 않고 메모를 봐요. 숫자가 바뀌면 그때 다시 계산하고요.' },
            { type: 'say', text: 'useMemo는 두 가지 때 써요.\n• **계산이 무거울 때** (큰 목록 거르기·정렬)\n• memo로 감싼 자식에게 넘길 **객체·배열의 주소를 고정**할 때 (다음 개념)' },
          ],
        },
      ],
    },
    {
      title: 'useCallback: 함수 자체 기억하기',
      slides: [
        {
          title: '2-5의 "memo 무력화" 기억나요?',
          blocks: [
            { type: 'say', text: '2-5에서 이런 문제가 있었죠. memo로 감싼 TodoItem에 화살표 함수를 넘기면 렌더링마다 **새 함수**가 만들어져서 memo가 소용없어졌어요.' },
            {
              type: 'code',
              code: `// 부모가 렌더링될 때마다 remove가 새 함수 → memo(TodoItem)이 매번 다시 렌더링
const remove = (id: number) => setTodos((prev) => prev.filter((t) => t.id !== id));

// 함수 자체를 기억해 둔다 → 주소가 그대로 → memo가 건너뛸 수 있다
const remove = useCallback(
  (id: number) => setTodos((prev) => prev.filter((t) => t.id !== id)),
  [],
);

<TodoItem todo={todo} onRemove={remove} />`,
            },
          ],
        },
        {
          title: 'useMemo와 useCallback의 차이',
          blocks: [
            {
              type: 'table',
              head: ['훅', '기억하는 것', '예시'],
              rows: [
                ['`useMemo`', '함수를 **실행한 결과값**', '`useMemo(() => todos.filter(...), [todos])`'],
                ['`useCallback`', '**함수 자체**', '`useCallback((id) => remove(id), [remove])`'],
              ],
            },
            { type: 'say', text: '사실 둘은 같은 원리예요. `useCallback(fn, deps)`는 `useMemo(() => fn, deps)`와 똑같아요. "함수를 돌려주는 계산"을 기억하면 함수가 기억되니까요.' },
            { type: 'ask', q: '위 remove는 deps가 [] 인데, todos를 안 넣어도 괜찮을까요?', a: '괜찮아요. 안에서 `todos`를 직접 쓰지 않고 3-2에서 배운 **함수형 업데이트** `setTodos((prev) => ...)`를 썼거든요. React가 최신 값을 prev로 넣어 주니 todos를 deps에 넣을 필요가 없어요. 덕분에 remove가 한 번 만들어지면 계속 같은 함수로 유지돼요.' },
          ],
        },
      ],
    },
    {
      title: '어디에나 붙이지 마세요',
      slides: [
        {
          title: '메모도 공짜가 아니에요',
          blocks: [
            { type: 'say', text: '"그럼 모든 계산과 함수에 다 붙이면 빨라지겠네?" 아니에요.' },
            {
              type: 'list',
              items: [
                '메모를 해 두는 것 자체도 **메모리와 비교 비용**이 들어요',
                '`a + b` 같은 가벼운 계산은 메모를 확인하는 게 더 느릴 수 있어요',
                'deps를 잘못 넣으면 **예전 값이 메모에 남는 버그**가 생겨요',
                '코드가 읽기 어려워져요',
              ],
            },
            { type: 'say', text: '규칙: **실제로 느리거나, memo 자식에 넘기는 값일 때만** 붙여요. 느린지는 감으로 말고 React Developer Tools의 Profiler로 재 보고요.' },
          ],
        },
        {
          title: 'React Compiler가 대신해 줘요',
          blocks: [
            { type: 'say', text: '1-1에서 잠깐 말한 **React Compiler**(2025년 10월 1.0)가 바로 이 일을 해요. 빌드할 때 코드를 분석해서 **useMemo·useCallback·memo를 필요한 곳에 자동으로** 넣어 줘요.' },
            { type: 'say', text: '그래서 요즘 흐름은 이래요.\n• 새 프로젝트: Compiler를 켜고, 손으로는 거의 안 씀\n• 기존 프로젝트: 이미 들어 있는 useMemo·useCallback을 읽을 줄 알아야 함\n• 면접: "왜 필요한지(주소 비교 때문)"를 설명할 수 있어야 함' },
            { type: 'note', tone: 'tip', text: 'Compiler가 해 준다고 원리를 몰라도 되는 건 아니에요. "왜 memo가 안 먹히지?"를 디버깅하려면 오늘 배운 주소 비교 원리를 알아야 해요.' },
          ],
        },
      ],
    },
    {
      title: '커스텀 훅 만들기',
      slides: [
        {
          title: '훅을 조립해서 나만의 훅',
          blocks: [
            { type: 'say', text: '3-1과 4-1에서 커스텀 훅을 봤죠. 오늘은 직접 하나 만들어 볼게요. **localStorage에 자동 저장되는 state**예요.' },
            {
              type: 'code',
              code: `function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {           // 4-3 레이지 초기화
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : initial;
  });

  useEffect(() => {                                       // 4-2 동기화
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}

// 쓰는 쪽: useState랑 똑같이
const [todos, setTodos] = useLocalStorage<Todo[]>('todos', []);`,
            },
            { type: 'say', text: '이번 장에서 배운 레이지 초기화, useEffect, 제네릭(2-3)이 한 훅에 다 들어 있어요. 이렇게 **훅을 조합해서 로직을 하나로 묶은 함수**가 커스텀 훅이에요.' },
          ],
        },
        {
          title: '커스텀 훅 규칙과 오해',
          blocks: [
            { type: 'note', tone: 'tip', text: '이름은 **반드시 `use`로 시작**해요. React와 린트가 "이건 훅이니까 훅의 규칙(4-1)을 검사해야지" 하고 알아보는 기준이에요.' },
            { type: 'ask', q: '두 컴포넌트가 같은 useLocalStorage("todos", []) 를 부르면 todos를 같이 쓰는 걸까요?', a: '**아니요, 각자 따로예요.** 커스텀 훅은 **로직을 공유**하는 거지 **상태를 공유**하는 게 아니에요. 훅을 부를 때마다 그 안의 useState가 새로 생겨요.\n(이 예시는 localStorage에 같은 키로 저장하긴 하지만, 화면의 state는 서로 따로 놀아요.) 같은 값을 공유하려면 상태를 끌어올리거나, 다음 수업의 **Context**를 써요.' },
          ],
        },
      ],
    },
    {
      title: '고차 컴포넌트(HOC)와 memo',
      slides: [
        {
          title: '컴포넌트를 받아 컴포넌트를 돌려주는 함수',
          blocks: [
            { type: 'say', text: '**고차 컴포넌트(HOC, Higher-Order Component)** 는 "컴포넌트를 받아서 기능을 덧붙인 새 컴포넌트를 돌려주는 함수"예요.' },
            { type: 'code', code: `const WithLogin = withAuth(MyPage);   // MyPage를 감싸서 로그인 검사 기능을 덧붙임` },
            { type: 'say', text: '훅이 없던 클래스 시절에는 공통 로직을 나누는 거의 유일한 방법이었어요. 그런데 HOC를 여러 겹 감싸면 `withA(withB(withC(MyPage)))`처럼 되고, props가 어디서 왔는지 알기 어려워져요. 그래서 **지금은 공통 로직 재사용은 커스텀 훅**이 기본이에요.' },
          ],
        },
        {
          title: '그런데 memo가 바로 HOC예요',
          blocks: [
            { type: 'say', text: 'HOC가 사라진 건 아니에요. 2-5에서 쓴 `memo(TodoItem)`이 바로 HOC예요. "컴포넌트를 받아서 **렌더링을 건너뛸 수 있는** 새 컴포넌트를 돌려주는 함수"니까요.' },
            { type: 'ask', q: '커스텀 훅 안에서 useMemo를 쓰면, memo 없이도 컴포넌트 렌더링 자체를 건너뛸 수 있을까요?', a: '**못 해요.** 커스텀 훅은 컴포넌트 **안에서** 실행돼요. 훅이 실행됐다는 건 이미 그 컴포넌트가 렌더링 중이라는 뜻이죠. 훅 안의 useMemo로 "계산"은 건너뛸 수 있어도 **렌더링 자체**는 못 건너뛰어요.\n렌더링할지 말지는 컴포넌트 **바깥**에서 먼저 정해야 하는데, 그게 컴포넌트를 감싸는 HOC `memo`의 역할이에요.' },
            {
              type: 'table',
              head: ['도구', '위치', '할 수 있는 것'],
              rows: [
                ['커스텀 훅 + useMemo', '컴포넌트 안', '무거운 계산 재사용, 로직 재사용'],
                ['`memo` (HOC)', '컴포넌트 밖', 'props가 같으면 렌더링 자체를 건너뜀'],
              ],
            },
            { type: 'say', text: '수업 끝! 확인 문제 가요.' },
          ],
        },
      ],
    },
  ],
  questions: [
    {
      id: 're04-4-q1',
      source: 'useMemo: 계산 결과 기억하기',
      type: 'mcq',
      question: 'useMemo(() => courses.filter(...), [courses, query]) 가 다시 계산되는 때는?',
      choices: ['매 렌더링마다', 'courses나 query가 바뀌었을 때만', '마운트 때 한 번만', '언마운트 때'],
      answer: 1,
      explanation: '재료(deps)가 지난번과 같으면 지난 결과를 돌려주고, 바뀌었을 때만 다시 계산해요.',
    },
    {
      id: 're04-4-q2',
      source: 'useCallback: 함수 자체 기억하기',
      type: 'mcq',
      question: 'useMemo와 useCallback의 차이로 옳은 것은?',
      choices: ['useMemo는 함수 자체를, useCallback은 결과값을 기억한다', 'useMemo는 결과값을, useCallback은 함수 자체를 기억한다', '둘 다 서버 데이터를 캐시한다', 'useCallback은 클래스에서만 쓴다'],
      answer: 1,
      explanation: 'useCallback(fn, deps)는 useMemo(() => fn, deps)와 같아요. 결과값이냐 함수냐의 차이예요.',
    },
    {
      id: 're04-4-q3',
      source: 'useCallback: 함수 자체 기억하기',
      type: 'ox',
      question: 'memo로 감싼 자식에게 넘기는 함수를 useCallback으로 고정하면, 부모가 다시 렌더링돼도 자식이 건너뛸 수 있다.',
      answer: true,
      explanation: '함수 주소가 그대로라 memo가 "props가 같다"고 판단해요. 화살표 함수를 그냥 넘기면 매번 새 함수라 건너뛰지 못해요.',
    },
    {
      id: 're04-4-q4',
      source: '어디에나 붙이지 마세요',
      type: 'ox',
      question: '모든 계산과 함수에 useMemo·useCallback을 붙이면 항상 더 빨라진다.',
      answer: false,
      explanation: '메모 자체도 비용이고 deps 실수로 버그가 생길 수 있어요. 실제로 느리거나 memo 자식에 넘길 때만 붙여요. React Compiler가 켜져 있으면 대부분 자동이에요.',
    },
    {
      id: 're04-4-q5',
      source: '어디에나 붙이지 마세요',
      type: 'mcq',
      question: 'React Compiler가 하는 일은?',
      choices: ['JSX를 HTML로 바꾼다', '빌드할 때 메모이제이션(useMemo·useCallback·memo)을 필요한 곳에 자동으로 넣는다', 'TypeScript 타입을 검사한다', '서버 컴포넌트를 만든다'],
      answer: 1,
      explanation: 'Compiler가 불필요한 다시 렌더링을 막는 코드를 자동으로 넣어 줘요. 손으로 쓰는 메모이제이션이 크게 줄어요.',
    },
    {
      id: 're04-4-q6',
      source: '커스텀 훅 만들기',
      type: 'short',
      question: '커스텀 훅 이름은 반드시 어떤 글자로 시작해야 할까?',
      answer: ['use'],
      explanation: 'use로 시작해야 React와 린트가 훅으로 알아보고 훅의 규칙을 검사해요.',
    },
    {
      id: 're04-4-q7',
      source: '커스텀 훅 만들기',
      type: 'ox',
      question: '두 컴포넌트가 같은 커스텀 훅을 부르면, 그 안의 state를 서로 공유한다.',
      answer: false,
      explanation: '커스텀 훅은 로직을 공유하지 상태를 공유하지 않아요. 부를 때마다 그 안의 useState가 따로 생겨요. 공유하려면 상태 끌어올리기나 Context를 써요.',
    },
    {
      id: 're04-4-q8',
      source: '고차 컴포넌트(HOC)와 memo',
      type: 'mcq',
      question: '컴포넌트의 렌더링 자체를 건너뛰게 하는 도구는?',
      choices: ['커스텀 훅 안의 useMemo', 'memo (고차 컴포넌트)', 'useRef', 'useLayoutEffect'],
      answer: 1,
      explanation: '훅은 컴포넌트 안에서 실행되니 이미 렌더링 중이에요. 렌더링 여부는 컴포넌트 밖에서 감싸는 memo가 정해요.',
    },
    {
      id: 're04-4-q9',
      source: '고차 컴포넌트(HOC)와 memo',
      type: 'essay',
      question: '[면접] useMemo와 useCallback은 언제 쓰고, 왜 모든 곳에 쓰지 않나요?',
      answer: 'useMemo는 계산 결과를, useCallback은 함수 자체를 deps가 같을 동안 기억합니다. 무거운 계산을 렌더링마다 반복하지 않거나, memo로 감싼 자식에 넘기는 객체·함수의 주소를 고정해 불필요한 다시 렌더링을 막을 때 씁니다. 다만 메모 자체에도 메모리와 비교 비용이 들고, deps를 잘못 넣으면 예전 값이 남는 버그가 생기며 코드도 복잡해지므로 실제로 느린 곳에만 씁니다. React Compiler를 켜면 이런 메모이제이션을 대부분 자동으로 넣어 줍니다.',
      keywords: ['결과값 vs 함수', '주소 고정', 'memo', '비용', 'React Compiler'],
      explanation: '각자 무엇을 기억하는지, 쓰는 두 경우, 남용하면 안 되는 이유, Compiler까지 말하면 좋아요.',
    },
  ],
}

export default topic
