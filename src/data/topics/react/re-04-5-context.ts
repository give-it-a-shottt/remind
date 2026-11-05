import type { Topic } from '../../types'

const topic: Topic = {
  id: 're-04-5-context',
  track: 'react',
  group: '04. 훅·생명주기·Context',
  title: '4-5. Context: 멀리 있는 자식에게 값 전달하기',
  order: 405,
  notionId: '409df951bf808131b12af91514be27c4',
  addedAt: '2026-11-05',
  sections: [
    {
      title: 'Context는 구역 방송',
      slides: [
        {
          title: '5단계 아래까지 props를 내려야 한다면',
          blocks: [
            { type: 'say', text: '4장 마지막 수업이에요! 3-1에서 **props 드릴링**을 배웠죠. 다크 모드 값을 App에서 저 아래 ThemeButton까지 보내려고 중간 컴포넌트 다섯 개가 쓰지도 않는 props를 그냥 전달만 하는 문제요.\n\n**Context**는 이걸 해결해요. props로 한 단계씩 내려보내지 않아도 **멀리 있는 자식이 값을 바로 받을 수 있게** 해 줘요.' },
            {
              type: 'code',
              code: `App
└─ ThemeProvider  ← 방송
   ├─ Header
   │  └─ ThemeButton  ← 받음
   └─ Main
      └─ Article
         └─ ThemeLabel  ← 받음`,
              caption: 'Header·Main·Article은 아무것도 전달하지 않아요',
            },
          ],
        },
        {
          title: '창고보다는 방송',
          blocks: [
            { type: 'note', tone: 'analogy', text: '아파트 **단지 방송**을 떠올려 보세요. 관리실(Provider)이 방송하면, 그 단지 안에서 스피커를 켠(useContext) 집만 들어요. 옆 단지(Provider 바깥)에서는 안 들려요. 그리고 방송 내용이 바뀌면 **스피커를 켠 집 전부**가 다시 들어요.' },
            { type: 'say', text: '포인트 두 가지.\n• **Provider가 감싼 범위 안에서만** 값을 받을 수 있어요. 전국 방송이 아니에요.\n• Context는 값을 **전달하는 통로**일 뿐이에요. 값을 바꾸는 건 여전히 useState나 useReducer예요.' },
          ],
        },
      ],
    },
    {
      title: 'Context 만들고 쓰기',
      slides: [
        {
          title: '세 단계',
          blocks: [
            {
              type: 'code',
              code: `import { createContext, use, useState, type ReactNode } from 'react';

type Theme = { mode: 'light' | 'dark'; toggle: () => void };

// ① 채널 만들기
const ThemeContext = createContext<Theme | null>(null);

// ② 방송하기 (Provider)
function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const toggle = () => setMode((m) => (m === 'light' ? 'dark' : 'light'));
  return <ThemeContext value={{ mode, toggle }}>{children}</ThemeContext>;
}

// ③ 받기
function ThemeButton() {
  const theme = use(ThemeContext);      // 또는 useContext(ThemeContext)
  return <button onClick={theme?.toggle}>{theme?.mode}</button>;
}`,
            },
          ],
        },
        {
          title: 'React 19에서 바뀐 문법',
          blocks: [
            {
              type: 'table',
              head: ['', '예전', 'React 19'],
              rows: [
                ['방송하기', '`<ThemeContext.Provider value={...}>`', '`<ThemeContext value={...}>` (.Provider 생략)'],
                ['받기', '`useContext(ThemeContext)`', '`use(ThemeContext)`도 가능'],
              ],
            },
            { type: 'say', text: '`.Provider`는 아직 동작하지만 앞으로 없어질 예정이에요. 그리고 새로 생긴 `use`는 **if문 안에서도 부를 수 있어요.** 4-1의 "훅은 맨 위에서만" 규칙의 유일한 예외예요.' },
            { type: 'note', tone: 'tip', text: '실무에서는 `useTheme()` 같은 작은 커스텀 훅을 같이 만들어요. 안에서 `use(ThemeContext)`를 부르고, null이면 "ThemeProvider 안에서 써 주세요" 에러를 던지게 하면 Provider를 깜빡했을 때 바로 알 수 있어요.' },
          ],
        },
      ],
    },
    {
      title: 'Context가 바뀌면 누가 다시 그려질까',
      slides: [
        {
          title: '스피커를 켠 집 전부',
          blocks: [
            { type: 'say', text: '테마를 바꾸면 어떤 컴포넌트가 다시 렌더링될까요?' },
            {
              type: 'list',
              items: [
                '그 Context를 **읽는** 컴포넌트(ThemeLabel, ThemeButton) → **전부** 다시 렌더링',
                'Context를 안 읽고 memo로 감싼 컴포넌트 → 건너뜀',
                '중간 컴포넌트(Header, Main)가 memo라면 → 건너뜀. 값은 Context로 "뚫고" 내려가요',
              ],
            },
            { type: 'ask', q: '자주 바뀌는 값(예: 마우스 위치)을 큰 Context 하나에 넣고 여러 컴포넌트가 읽으면?', a: '마우스가 움직일 때마다 그 Context를 읽는 **모든** 컴포넌트가 다시 렌더링돼요. 그중 대부분은 마우스 위치가 필요 없는데도요. 그래서 Context는 **가끔 바뀌는 값**(테마, 로그인 사용자, 언어)에 잘 맞아요.' },
          ],
        },
        {
          title: 'value에 매번 새 객체를 넣으면',
          blocks: [
            {
              type: 'code',
              code: `function ThemeProvider({ children }) {
  const [mode, setMode] = useState('light');
  // ⚠️ 렌더링마다 새 객체 {...} → 주소가 바뀜 → 읽는 쪽 전부 다시 렌더링
  return <ThemeContext value={{ mode, toggle }}>{children}</ThemeContext>;
}`,
            },
            { type: 'say', text: '3-2의 얕은 비교가 여기서도 나와요. React는 Context 값이 바뀌었는지 **주소로** 비교해요. `{ mode, toggle }`을 JSX에 바로 쓰면 ThemeProvider가 렌더링될 때마다 새 객체라 mode가 그대로여도 "바뀜"이에요.' },
            { type: 'code', code: `const value = useMemo(() => ({ mode, toggle }), [mode, toggle]);   // mode가 바뀔 때만 새 객체
return <ThemeContext value={value}>{children}</ThemeContext>;` },
            { type: 'note', tone: 'tip', text: 'Provider를 가진 컴포넌트가 자주 렌더링될 때만 신경 쓰면 돼요. React Compiler를 켜면 이것도 자동으로 처리해 줘요.' },
          ],
        },
      ],
    },
    {
      title: 'Context vs Zustand·Redux',
      slides: [
        {
          title: '같은 문제, 다른 도구',
          blocks: [
            { type: 'say', text: '"Context면 Redux나 Zustand는 필요 없는 거 아니에요?" 시니어 공고에 Zustand가 자주 나오는 이유가 여기 있어요. 셋 다 "멀리 있는 컴포넌트끼리 값 공유"를 풀지만 **성격이 달라요.**' },
            {
              type: 'table',
              head: ['', 'Context + useState', 'Zustand·Redux'],
              rows: [
                ['정체', 'React 내장 **배달 통로**', '별도 **상태 관리 라이브러리**'],
                ['값이 바뀌면', '그 Context를 읽는 컴포넌트 **전부** 다시 렌더링', '내가 **골라 구독한** 값이 바뀔 때만 다시 렌더링'],
                ['잘 맞는 값', '가끔 바뀌는 값: 테마, 로그인 사용자, 언어', '자주 바뀌고 여러 곳에서 쓰는 값: 장바구니, 편집 중인 문서'],
                ['설치', '없음', '패키지 설치'],
              ],
            },
          ],
        },
        {
          title: '골라 구독한다는 게 뭐예요?',
          blocks: [
            { type: 'code', code: `// Zustand 예시 (5장에서 자세히)
const count = useCartStore((s) => s.items.length);   // 장바구니 "개수"만 구독
// 장바구니의 다른 정보(쿠폰 등)가 바뀌어도, 개수가 그대로면 다시 렌더링 안 됨` },
            { type: 'say', text: 'Context는 "방송이 바뀌면 다 다시 들어"라면, Zustand는 "**내가 관심 있는 뉴스만** 알림 받기"예요. 그래서 자주 바뀌는 큰 상태에 유리해요.' },
            { type: 'note', tone: 'tip', text: '서버에서 온 데이터(강의 목록, 주문 내역)는 Context도 Zustand도 아니고 **TanStack Query**로 다뤄요(3-1 상태 종류 표). 상태의 종류에 맞는 집을 찾아 주는 게 시니어의 판단이에요.' },
          ],
        },
      ],
    },
    {
      title: 'props와 Context 구분하기',
      slides: [
        {
          title: 'Context부터 꺼내지 마세요',
          blocks: [
            { type: 'say', text: 'Context가 편하니까 다 Context로 하고 싶어지죠. React 공식 문서는 반대로 말해요. **"Context를 쓰기 전에 props로 넘기는 것부터 해 보라."**' },
            {
              type: 'table',
              head: ['props로', 'Context로'],
              rows: [
                ['목록의 각 항목 데이터 (몇 번째 항목인지는 부모가 알려줘야 함)', '앱 전체나 넓은 영역에서 쓰는 값 (테마, 로그인 사용자, 언어)'],
                ['부모-자식 사이 1~2단계', '많은 컴포넌트가 여러 깊이에서 필요'],
                ['컴포넌트를 어디서나 재사용하고 싶을 때 (3-1 무상태)', '특정 Provider 아래에서만 동작해도 될 때'],
              ],
            },
            { type: 'ask', q: 'CourseCard가 props 대신 Context에서 강의 정보를 읽게 만들면 어떤 문제가 생길까요?', a: 'CourseCard는 **그 Provider 안에서만** 동작하는 컴포넌트가 돼요. 검색 결과, 찜 목록 같은 다른 화면에 가져다 쓰기 어려워지고, Storybook에서 따로 보기도 힘들어요. 목록 항목처럼 "부모가 알려줘야 하는 데이터"는 props가 맞아요.' },
          ],
        },
        {
          title: 'Context 전에 해 볼 것: children',
          blocks: [
            { type: 'say', text: 'props 드릴링이 심할 때 Context 말고 먼저 해 볼 방법이 있어요. 중간 컴포넌트가 **children을 받게** 바꾸는 거예요.' },
            {
              type: 'code',
              code: `// ❌ Layout이 user를 쓰지도 않는데 전달만 함
<Layout user={user} />   // Layout 안에서 <Sidebar user={user} /> ...

// ✅ 쓰는 컴포넌트를 위에서 바로 끼워 넣는다
<Layout>
  <Sidebar user={user} />
</Layout>
// Layout은 { children } 을 받아 그 자리에 그리기만`,
            },
            { type: 'say', text: 'Layout은 user를 몰라도 돼요. 값을 쓰는 Sidebar를 **위에서 직접 끼워 넣었으니까** 중간 단계를 건너뛰었어요. 구조만 바꿔서 드릴링이 사라졌죠.\n\n4장 끝! 훅과 생명주기, Context까지 오면 React 기본기는 거의 다 왔어요. 마지막 확인 문제 가요.' },
          ],
        },
      ],
    },
  ],
  questions: [
    {
      id: 're04-5-q1',
      source: 'Context는 구역 방송',
      type: 'mcq',
      question: 'Context가 주로 해결하는 문제는?',
      choices: ['CSS 클래스 충돌', '여러 단계를 거쳐 props를 전달만 하는 props 드릴링', '서버 응답 캐시', '번들 크기'],
      answer: 1,
      explanation: 'Context는 Provider 아래의 멀리 있는 자식이 props 없이 값을 바로 받게 해 줘요.',
    },
    {
      id: 're04-5-q2',
      source: 'Context는 구역 방송',
      type: 'ox',
      question: 'Provider 바깥에 있는 컴포넌트도 useContext로 그 Provider의 value를 받을 수 있다.',
      answer: false,
      explanation: 'Provider가 감싼 범위 안에서만 받을 수 있어요. 바깥에서는 createContext의 기본값(예: null)을 받아요.',
    },
    {
      id: 're04-5-q3',
      source: 'Context 만들고 쓰기',
      type: 'mcq',
      question: 'React 19에서 Context 값을 방송하는 새 문법은?',
      choices: ['<ThemeContext.Consumer>', '<ThemeContext value={...}>', '<Provider context={ThemeContext}>', 'ThemeContext.set(...)'],
      answer: 1,
      explanation: 'React 19부터 .Provider 없이 <ThemeContext value={...}>로 바로 써요. .Provider는 아직 동작하지만 없어질 예정이에요.',
    },
    {
      id: 're04-5-q4',
      source: 'Context 만들고 쓰기',
      type: 'ox',
      question: 'React 19의 use(ThemeContext)는 if문 안에서도 부를 수 있다.',
      answer: true,
      explanation: 'use는 훅의 "맨 위에서만" 규칙의 예외예요. useContext는 여전히 맨 위에서만 불러요.',
    },
    {
      id: 're04-5-q5',
      source: 'Context가 바뀌면 누가 다시 그려질까',
      type: 'mcq',
      question: '테마 Context 값이 바뀌었을 때 반드시 다시 렌더링되는 컴포넌트는?',
      choices: ['앱의 모든 컴포넌트', '그 Context를 읽는 컴포넌트', 'memo로 감싼 모든 컴포넌트', 'Provider 바깥의 컴포넌트'],
      answer: 1,
      explanation: 'Context를 읽는 컴포넌트는 전부 다시 렌더링돼요. Context를 안 읽는 memo 컴포넌트는 건너뛸 수 있어요.',
    },
    {
      id: 're04-5-q6',
      source: 'Context가 바뀌면 누가 다시 그려질까',
      type: 'mcq',
      question: '<ThemeContext value={{ mode, toggle }}> 에서 mode가 안 바뀌었는데도 읽는 쪽이 매번 다시 렌더링되는 이유는?',
      choices: ['Context는 원래 매번 렌더링된다', 'value에 렌더링마다 새 객체가 들어가 주소가 바뀌기 때문', 'toggle이 화살표 함수라서 문법 에러', 'mode가 문자열이라서'],
      answer: 1,
      explanation: 'Context 값도 주소로 비교해요. useMemo로 value를 고정하면 mode가 바뀔 때만 새 객체가 돼요.',
    },
    {
      id: 're04-5-q7',
      source: 'Context vs Zustand·Redux',
      type: 'mcq',
      question: '장바구니처럼 자주 바뀌고 여러 곳에서 일부만 골라 쓰는 상태에 더 알맞은 것은?',
      choices: ['큰 Context 하나', 'Zustand 같은 상태 관리 라이브러리 (선택 구독)', 'useRef', 'CSS 변수'],
      answer: 1,
      explanation: 'Context는 바뀌면 읽는 쪽 전부가 다시 렌더링돼요. Zustand는 골라 구독한 값이 바뀔 때만 다시 렌더링해서 자주 바뀌는 상태에 유리해요.',
    },
    {
      id: 're04-5-q8',
      source: 'props와 Context 구분하기',
      type: 'mcq',
      question: '강의 목록의 각 CourseCard가 보여 줄 강의 정보는 어떻게 전달하는 것이 좋을까?',
      choices: ['Context로', 'props로', '전역 변수로', 'localStorage로'],
      answer: 1,
      explanation: '목록 항목처럼 부모가 "이 항목은 이거야"라고 알려줘야 하는 데이터는 props예요. Context로 하면 재사용이 어려워져요.',
    },
    {
      id: 're04-5-q9',
      source: 'props와 Context 구분하기',
      type: 'essay',
      question: '[면접] Context API와 Zustand 같은 상태 관리 라이브러리는 어떻게 다르고, 각각 언제 쓰나요?',
      answer: 'Context는 props 없이 멀리 있는 컴포넌트에 값을 전달하는 React 내장 통로이고, 값을 바꾸는 건 useState나 useReducer가 합니다. 값이 바뀌면 그 Context를 읽는 컴포넌트가 전부 다시 렌더링되므로 테마나 로그인 사용자처럼 가끔 바뀌는 값에 적합합니다. Zustand 같은 라이브러리는 상태 저장과 변경까지 담당하고 필요한 값만 골라 구독할 수 있어서, 장바구니처럼 자주 바뀌고 여러 곳에서 쓰는 값에 유리합니다. 목록 항목처럼 부모가 알려줘야 하는 데이터는 그대로 props로 넘기고, 서버 데이터는 TanStack Query로 다룹니다.',
      keywords: ['전달 통로 vs 상태 관리', '읽는 쪽 전체 리렌더링', '선택 구독', '가끔 vs 자주 바뀌는 값', 'props'],
      explanation: 'Context의 정체(통로)와 리렌더링 범위, Zustand의 선택 구독, 그리고 props·서버 상태까지 구분하면 시니어다운 답이 돼요.',
    },
  ],
}

export default topic
