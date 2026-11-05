import type { Topic } from '../../types'

const topic: Topic = {
  id: 're-04-2-effect',
  track: 'react',
  group: '04. 훅·생명주기·Context',
  title: '4-2. useEffect와 생명주기',
  order: 402,
  notionId: '409df951bf808131b12af91514be27c4',
  addedAt: '2026-11-05',
  sections: [
    {
      title: '마운트·업데이트·언마운트',
      slides: [
        {
          title: '컴포넌트의 일생',
          blocks: [
            { type: 'say', text: '이번 수업은 React에서 가장 헷갈리고, 가장 많이 틀리는 훅인 **useEffect**예요. 천천히 갈게요.\n\n먼저 컴포넌트의 **일생**부터요. 컴포넌트도 태어나고, 바뀌고, 사라져요.' },
            {
              type: 'table',
              head: ['단계', '뜻', '비유'],
              rows: [
                ['**마운트**', '컴포넌트가 **처음** 화면에 붙음', '이사 들어옴'],
                ['**업데이트**', 'state·props가 바뀌어 **다시** 렌더링됨', '인테리어 바꿈'],
                ['**언마운트**', '화면에서 **없어짐** (조건부 렌더링이 false가 되거나 페이지 이동)', '이사 나감'],
              ],
            },
            { type: 'say', text: '이 셋을 **생명주기**라고 불러요. 클래스 시절에는 `componentDidMount`, `componentDidUpdate`, `componentWillUnmount` 메서드를 따로 썼는데, 지금은 **useEffect 하나**가 세 역할을 다 해요.' },
          ],
        },
        {
          title: 'useEffect의 모양',
          blocks: [
            {
              type: 'code',
              code: `useEffect(() => {
  // ① 마운트 때 실행
  // ② deps 안의 값이 바뀔 때마다 다시 실행
  return () => {
    // ③ 언마운트 때 실행 (+ 다음 실행 직전에도)
  };
}, [deps]);`,
            },
            { type: 'say', text: 'useEffect 안의 코드를 **이펙트(effect)** 라고 해요. "렌더링이 끝나고 화면이 보인 **뒤에** 해야 할 일"을 넣어요. 서버에서 데이터 가져오기, 타이머 시작, 이벤트 구독 같은 거요.' },
            { type: 'note', tone: 'warn', text: '책에 "윌마운트"라고 나오면 **언마운트 직전**(componentWill**Unmount**)을 말하는 거예요. 마운트 직전 메서드(componentWillMount)는 오래전에 위험한 메서드로 분류됐고, useEffect가 대체하지 않아요.' },
          ],
        },
      ],
    },
    {
      title: '의존성 배열(deps)',
      slides: [
        {
          title: '언제 다시 실행할지 정하는 목록',
          blocks: [
            { type: 'say', text: 'useEffect의 두 번째 인자 `[ ]`를 **의존성 배열(deps)** 이라고 해요. "이 값들이 바뀌면 이펙트를 다시 실행해 줘"라는 목록이에요.' },
            {
              type: 'table',
              head: ['deps', '실행 시점'],
              rows: [
                ['없음 `useEffect(fn)`', '**매** 렌더링마다'],
                ['빈 배열 `useEffect(fn, [])`', '마운트 때 **한 번** (언마운트 때 정리)'],
                ['값 있음 `useEffect(fn, [id])`', '마운트 때 + **id가 바뀔 때마다**'],
              ],
            },
            {
              type: 'code',
              code: `useEffect(() => {
  fetch(\`/api/courses/\${id}\`).then(...);   // id 강의를 가져온다
}, [id]);   // id가 바뀌면 다른 강의를 다시 가져온다`,
            },
          ],
        },
        {
          title: '빼먹으면 예전 값을 봐요',
          blocks: [
            { type: 'ask', q: '위 코드에서 deps를 [] 로 바꾸면 어떻게 될까요?', a: '마운트 때 한 번만 실행돼요. 사용자가 다른 강의를 눌러서 id가 바뀌어도 **처음 강의를 계속** 보여 줘요. 이펙트가 id가 바뀐 줄 모르니까요.' },
            { type: 'note', tone: 'warn', text: '규칙: **이펙트 안에서 쓰는 props·state는 빠짐없이 deps에 넣어요.** 빼먹으면 이펙트가 예전 값을 계속 보는 버그가 생겨요. Vite 템플릿의 린트가 빠진 걸 노란 줄로 알려 주니까, 그 경고는 무시하지 마세요.' },
          ],
        },
      ],
    },
    {
      title: '클린업 함수',
      slides: [
        {
          title: '시작한 건 되돌려 놓고 가요',
          blocks: [
            { type: 'say', text: '이펙트가 `return`으로 돌려주는 함수를 **클린업(cleanup) 함수**라고 해요. 이펙트가 **시작한 일을 되돌리는** 역할이에요.' },
            {
              type: 'code',
              code: `useEffect(() => {
  const id = setInterval(() => console.log('째깍'), 1000);   // 타이머 시작
  return () => clearInterval(id);                            // 타이머 정리
}, []);`,
            },
            { type: 'say', text: '클린업은 두 번 실행돼요.\n• **언마운트될 때**\n• deps가 바뀌어 이펙트가 다시 실행되기 **직전**' },
            { type: 'note', tone: 'analogy', text: '캠핑장 규칙 "왔을 때보다 깨끗하게"예요. 텐트(타이머)를 쳤으면 떠날 때(언마운트) 걷어야 하고, 자리를 옮길 때(deps 변경)도 이전 텐트를 걷고 새로 쳐야죠.' },
          ],
        },
        {
          title: '클린업을 빼먹으면',
          blocks: [
            {
              type: 'table',
              head: ['시작', '클린업'],
              rows: [
                ['`setInterval`', '`clearInterval`'],
                ['`addEventListener`', '`removeEventListener`'],
                ['웹소켓·구독 연결', '연결 해제'],
                ['fetch 요청', '취소(`AbortController`) 또는 결과 무시'],
              ],
            },
            { type: 'ask', q: '타이머 컴포넌트를 보였다 숨겼다 5번 반복했어요. 클린업이 없으면?', a: '컴포넌트는 화면에서 사라졌는데 **타이머 5개가 계속** 돌아요. "째깍" 로그가 점점 많이 찍히죠. 쓰지도 않는 일이 쌓여서 메모리를 먹는 걸 **메모리 누수**라고 해요.' },
            { type: 'note', tone: 'tip', text: '`npm run dev`에서는 마운트 직후 "이펙트 실행 → 클린업 → 다시 실행"이 **일부러 한 번 더** 일어나요. StrictMode가 "클린업 빼먹은 거 없나?" 확인해 주는 거예요. 클린업을 제대로 짰다면 두 번 돌아도 문제가 없어야 해요. 배포 빌드에서는 한 번만 실행돼요.' },
          ],
        },
      ],
    },
    {
      title: '마운트 순서와 useLayoutEffect',
      slides: [
        {
          title: '정확히 어떤 순서로 일어날까',
          blocks: [
            { type: 'say', text: '컴포넌트가 처음 화면에 나올 때 일어나는 일을 순서대로 볼게요. 2-5의 "렌더링 vs 커밋"이 여기서 다시 나와요.' },
            {
              type: 'table',
              head: ['순서', '단계', '하는 일'],
              rows: [
                ['①', '렌더링', '컴포넌트 함수 실행, 화면 모양 계산. 아직 실제 DOM 없음'],
                ['②', 'DOM 반영 (커밋)', '계산 결과를 실제 DOM에 붙임'],
                ['③', '**useLayoutEffect**', 'DOM은 있지만 **화면에 그리기 전**'],
                ['④', '화면 그리기', '브라우저가 픽셀을 칠함'],
                ['⑤', '**useEffect**', '화면이 보인 **뒤**'],
              ],
            },
            { type: 'note', tone: 'warn', text: '책에 "LayoutEffects 실행 → 브라우저 DOM 업데이트" 순서로 나오면 순서가 반대예요. **DOM 반영이 먼저**, 그다음 useLayoutEffect예요. 실제로 useLayoutEffect 안에서 이미 DOM 글자를 읽을 수 있어요.' },
          ],
        },
        {
          title: 'useLayoutEffect는 언제 쓰나요',
          blocks: [
            { type: 'say', text: 'useLayoutEffect는 **화면을 그리기 직전**에 실행돼요. 그래서 "그리기 전에 DOM 크기를 재서 위치를 고쳐야 하는" 경우에 써요.' },
            { type: 'ask', q: '툴팁을 버튼 위에 띄우려는데 툴팁 높이를 재서 위치를 정해야 해요. useEffect로 하면 어떤 일이 생길까요?', a: '화면이 **먼저 그려진 뒤** 위치를 고치니까, 툴팁이 엉뚱한 곳에 잠깐 보였다가 **휙 움직이는** 깜빡임이 생겨요. useLayoutEffect로 하면 그리기 전에 위치를 고쳐서 처음부터 제자리에 나와요.' },
            { type: 'note', tone: 'warn', text: 'useLayoutEffect는 화면 그리기를 **막고** 실행돼요. 안에서 무거운 일을 하면 화면이 멈춰요. 크기·위치 계산처럼 꼭 필요할 때만 쓰고, **나머지는 전부 useEffect**예요.' },
          ],
        },
      ],
    },
    {
      title: 'effect가 필요 없는 경우',
      slides: [
        {
          title: 'useEffect는 "동기화" 장치예요',
          blocks: [
            { type: 'say', text: 'React 공식 문서는 useEffect를 "마운트·업데이트·언마운트"보다 **"컴포넌트를 바깥 세상과 맞춰 두는(동기화) 장치"** 로 생각하라고 해요. 바깥 세상은 서버, 브라우저 API, 타이머, 웹소켓 같은 React 밖의 것들이에요.\n\n"채팅방 id가 바뀌면 → 이전 방 연결을 끊고(클린업) → 새 방에 연결한다." 이런 게 진짜 이펙트예요.' },
            { type: 'say', text: '반대로 말하면 **바깥 세상과 상관없는 일에는 useEffect가 필요 없어요.** 그런데 이걸 남용하는 코드가 정말 많아요. AI가 짠 코드에서도 자주 나와요.' },
          ],
        },
        {
          title: '흔한 오용 3가지',
          blocks: [
            {
              type: 'code',
              code: `// ❌ 계산할 수 있는 값을 이펙트로 state에 넣음
const [filtered, setFiltered] = useState([]);
useEffect(() => {
  setFiltered(todos.filter((t) => !t.done));
}, [todos]);

// ✅ 렌더링 중에 바로 계산
const filtered = todos.filter((t) => !t.done);`,
            },
            { type: 'say', text: '첫 번째 방식은 "렌더링 → 이펙트 → setFiltered → **또 렌더링**"으로 렌더링을 한 번 더 만들어요. 게다가 한 번은 예전 filtered가 화면에 잠깐 보여요.' },
            {
              type: 'table',
              head: ['❌ 흔한 오용', '✅ 대신'],
              rows: [
                ['다른 state로 계산되는 값을 이펙트에서 setState', '렌더링 중에 바로 계산 (무거우면 useMemo)'],
                ['버튼 클릭 후 할 일을 이펙트에서 처리', '이벤트 핸들러 안에서 바로 처리'],
                ['props가 바뀌면 state를 초기화', '컴포넌트에 `key`를 주면 새로 마운트되며 초기화'],
              ],
            },
          ],
        },
      ],
    },
    {
      title: '데이터 가져오기와 경쟁 상태',
      slides: [
        {
          title: '늦게 온 응답이 덮어써요',
          blocks: [
            { type: 'say', text: '이펙트로 데이터를 가져올 때 숨은 함정이 있어요. 사용자가 강의 1번을 눌렀다가 바로 2번을 눌렀어요. 요청이 두 개 나가죠.' },
            {
              type: 'list',
              ordered: true,
              items: ['1번 요청 출발', '2번 요청 출발', '2번 응답 도착 → 화면에 2번 강의', '1번 응답이 **늦게** 도착 → 화면에 **1번 강의**로 덮어써짐!'],
            },
            { type: 'say', text: '사용자는 2번을 눌렀는데 1번 강의가 보여요. 먼저 출발한 게 꼭 먼저 도착하진 않거든요. 이렇게 "누가 먼저 끝나느냐"에 따라 결과가 달라지는 버그를 **경쟁 상태(race condition)** 라고 해요.' },
          ],
        },
        {
          title: '클린업으로 이전 요청 무시하기',
          blocks: [
            {
              type: 'code',
              code: `useEffect(() => {
  let ignore = false;
  fetch(\`/api/courses/\${id}\`)
    .then((r) => r.json())
    .then((data) => {
      if (!ignore) setCourse(data);    // 이미 다음 id로 넘어갔으면 무시
    });
  return () => { ignore = true; };      // id가 바뀌면 이전 이펙트의 클린업이 먼저 실행됨
}, [id]);`,
            },
            { type: 'say', text: 'id가 1 → 2로 바뀌면, 2번 이펙트가 실행되기 **직전에** 1번 이펙트의 클린업이 `ignore = true`를 해요. 그래서 1번 응답이 늦게 와도 무시돼요. 아까 배운 "클린업은 다음 실행 직전에도 실행된다"가 여기서 빛나요.' },
            { type: 'note', tone: 'tip', text: '캐시, 재시도, 경쟁 상태, 로딩·에러 처리를 매번 직접 짜기는 어려워요. 그래서 실무에서는 **TanStack Query** 같은 도구나 Next.js 서버 컴포넌트로 데이터를 가져와요. 둘 다 뒤 챕터에서 배워요.' },
            { type: 'say', text: 'useEffect 수업 끝! 오늘이 4장에서 제일 어려운 날이었어요. 확인 문제로 꼭 다져요.' },
          ],
        },
      ],
    },
  ],
  questions: [
    {
      id: 're04-2-q1',
      source: '마운트·업데이트·언마운트',
      type: 'mcq',
      question: '{show && <Child />} 에서 show가 true → false가 될 때 Child에 일어나는 일은?',
      choices: ['마운트', '업데이트', '언마운트', '아무 일도 없다'],
      answer: 2,
      explanation: '화면에서 없어지는 게 언마운트예요. 이때 useEffect의 클린업 함수가 실행돼요.',
    },
    {
      id: 're04-2-q2',
      source: '의존성 배열(deps)',
      type: 'mcq',
      question: 'useEffect(fn, []) 의 fn은 언제 실행될까?',
      choices: ['매 렌더링마다', '마운트 때 한 번', '언마운트 때만', '절대 실행되지 않는다'],
      answer: 1,
      explanation: '빈 배열은 "다시 실행할 이유가 되는 값이 없다"는 뜻이라 마운트 때 한 번만 실행돼요. deps를 아예 안 쓰면 매 렌더링마다예요.',
    },
    {
      id: 're04-2-q3',
      source: '의존성 배열(deps)',
      type: 'ox',
      question: 'effect 안에서 props의 id를 쓰는데 deps를 []로 두어도, id가 바뀌면 effect가 알아서 다시 실행된다.',
      answer: false,
      explanation: 'deps에 id가 없으면 effect는 id가 바뀐 걸 몰라요. 예전 값을 계속 보는 버그가 생겨요. effect 안에서 쓰는 값은 빠짐없이 deps에 넣어요.',
    },
    {
      id: 're04-2-q4',
      source: '클린업 함수',
      type: 'mcq',
      question: 'useEffect의 클린업 함수가 실행되는 때를 모두 고른 것은?',
      choices: ['마운트될 때만', '언마운트될 때, 그리고 deps가 바뀌어 effect가 다시 실행되기 직전', '매 렌더링 시작 전', '서버에 요청을 보낼 때'],
      answer: 1,
      explanation: '클린업은 언마운트 때와 다음 effect 실행 직전에 이전 effect가 시작한 것을 되돌려요.',
    },
    {
      id: 're04-2-q5',
      source: '클린업 함수',
      type: 'short',
      question: 'useEffect 안에서 setInterval로 타이머를 시작했다. 클린업에서 호출할 함수 이름은?',
      answer: ['clearInterval', 'clearInterval()'],
      explanation: '시작한 걸 되돌려요. addEventListener는 removeEventListener, 구독은 해제로 짝을 맞춰요. 빼먹으면 메모리 누수예요.',
    },
    {
      id: 're04-2-q6',
      source: '마운트 순서와 useLayoutEffect',
      type: 'mcq',
      question: '마운트 때 일어나는 순서로 옳은 것은?',
      choices: ['useEffect → 렌더링 → DOM 반영 → 화면 그리기', '렌더링 → DOM 반영 → useLayoutEffect → 화면 그리기 → useEffect', '렌더링 → useLayoutEffect → DOM 반영 → useEffect → 화면 그리기', 'DOM 반영 → 렌더링 → useEffect → useLayoutEffect'],
      answer: 1,
      explanation: 'DOM이 먼저 반영되고, 화면을 그리기 전에 useLayoutEffect, 그린 뒤에 useEffect가 실행돼요.',
    },
    {
      id: 're04-2-q7',
      source: '마운트 순서와 useLayoutEffect',
      type: 'mcq',
      question: 'useLayoutEffect를 쓰기에 가장 알맞은 경우는?',
      choices: ['서버에서 강의 목록 가져오기', '그리기 전에 툴팁 크기를 재서 위치를 정하기', '1초마다 타이머 돌리기', '로그 보내기'],
      answer: 1,
      explanation: '그리기 전에 DOM을 재서 고쳐야 깜빡임이 없어요. 나머지는 화면을 막지 않는 useEffect로 해요.',
    },
    {
      id: 're04-2-q8',
      source: 'effect가 필요 없는 경우',
      type: 'mcq',
      question: 'todos로 미완료 목록을 만들고 싶다. 가장 좋은 방법은?',
      choices: ['useEffect에서 setFiltered(todos.filter(...))', '렌더링 중에 const filtered = todos.filter(...)', 'useLayoutEffect에서 계산', '서버에 요청해서 받아오기'],
      answer: 1,
      explanation: '계산할 수 있는 값은 렌더링 중에 바로 계산해요. effect로 하면 렌더링이 한 번 더 일어나고 잠깐 예전 값이 보여요.',
    },
    {
      id: 're04-2-q9',
      source: 'effect가 필요 없는 경우',
      type: 'ox',
      question: 'useEffect는 바깥 시스템(서버, 브라우저 API, 타이머)과 컴포넌트를 맞춰 두는 동기화에 쓰는 것이 원칙이다.',
      answer: true,
      explanation: '바깥 세상과 상관없는 계산이나 클릭 후 처리에는 effect가 필요 없어요.',
    },
    {
      id: 're04-2-q10',
      source: '데이터 가져오기와 경쟁 상태',
      type: 'mcq',
      question: '강의 1번 → 2번을 빠르게 눌렀는데 화면에 1번 강의가 뜨는 버그의 원인은?',
      choices: ['key를 안 써서', '늦게 도착한 1번 응답이 2번 결과를 덮어써서 (경쟁 상태)', 'useState를 두 번 써서', 'CSS가 늦게 로드돼서'],
      answer: 1,
      explanation: '먼저 출발한 요청이 꼭 먼저 도착하진 않아요. 클린업에서 ignore = true로 이전 요청 결과를 무시해요.',
    },
    {
      id: 're04-2-q11',
      source: '데이터 가져오기와 경쟁 상태',
      type: 'essay',
      question: '[면접] useEffect의 의존성 배열과 클린업 함수가 하는 일을 설명해 주세요.',
      answer: '의존성 배열은 effect를 언제 다시 실행할지 정합니다. 없으면 매 렌더링마다, 빈 배열이면 마운트 때 한 번, 값이 있으면 그 값이 바뀔 때마다 실행되며, effect 안에서 쓰는 props와 state는 빠짐없이 넣어야 예전 값을 보는 버그가 없습니다. 클린업 함수는 effect가 시작한 타이머·구독·요청을 되돌리는 함수로, 언마운트될 때와 effect가 다시 실행되기 직전에 호출됩니다. 빼먹으면 메모리 누수나 이전 요청 결과가 덮어쓰는 경쟁 상태가 생깁니다.',
      keywords: ['의존성 배열', '클린업', '메모리 누수', '경쟁 상태', '동기화'],
      explanation: 'deps 세 가지 경우, 클린업의 두 실행 시점, 빼먹었을 때의 문제(누수·경쟁 상태)를 말하면 좋아요.',
    },
  ],
}

export default topic
