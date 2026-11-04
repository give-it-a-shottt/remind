import type { Topic } from '../../types'

const topic: Topic = {
  id: 're-06-2-hydration',
  track: 'react',
  group: '06. 렌더링 전략과 Next.js',
  title: '6-2. 하이드레이션',
  order: 602,
  addedAt: '2026-11-05',
  sections: [
    {
      title: '하이드레이션이란',
      slides: [
        {
          title: '보이는데 안 눌리는 버튼',
          blocks: [
            { type: 'say', text: '6-1에서 "SSR은 HTML이 바로 보이지만 JS가 도착하기 전에는 버튼이 안 눌린다"고 했죠. 오늘은 그 사이에 무슨 일이 일어나는지 배워요.\n\n서버가 보낸 HTML은 **그림**일 뿐이에요. `<button>장바구니 담기</button>`라는 모양은 있지만, `onClick`도 `useState`도 없어요. 이벤트와 상태는 자바스크립트에만 있으니까요.' },
            { type: 'say', text: 'JS가 도착하면 React가 브라우저에서 컴포넌트를 **한 번 더 실행**해서 "이 버튼에는 이 onClick, 이 숫자는 이 state" 하고 **이미 있는 HTML에 기능을 연결**해요. 이걸 **하이드레이션(hydration)** 이라고 해요.' },
            { type: 'note', tone: 'analogy', text: '하이드레이션은 "물을 준다"는 뜻이에요. **건조 컵라면**을 떠올려 보세요. 모양(HTML)은 이미 다 있지만 딱딱해서 먹을 수 없죠. 뜨거운 물(JS)을 부어야 비로소 먹을 수 있는(클릭되는) 상태가 돼요.' },
          ],
        },
        {
          title: '순서대로 보면',
          blocks: [
            {
              type: 'list',
              ordered: true,
              items: [
                '서버가 컴포넌트를 실행해 **HTML** 생성 → 브라우저에 전송',
                '브라우저가 HTML을 바로 화면에 그림 → **보임** (아직 안 눌림)',
                'JS 파일 다운로드',
                'React가 브라우저에서 컴포넌트를 다시 실행해 결과를 계산',
                '계산 결과를 **이미 있는 HTML과 맞춰 보면서** 이벤트를 연결 → **눌림**',
              ],
            },
            { type: 'say', text: '4번에서 React는 DOM을 새로 만들지 않아요. 서버가 만든 DOM을 **그대로 재사용**하고 기능만 붙여요. 그래서 4번의 계산 결과가 서버 HTML과 **똑같다는 전제**가 깔려 있어요. 이 전제가 깨지면 다음 개념의 문제가 생겨요.' },
          ],
        },
      ],
    },
    {
      title: '하이드레이션 불일치',
      slides: [
        {
          title: '서버와 브라우저의 결과가 다르면',
          blocks: [
            { type: 'say', text: 'Next.js로 개발하다 보면 이런 빨간 에러를 꼭 한 번은 만나요.' },
            { type: 'code', code: `Hydration failed because the server rendered HTML didn't match the client.` },
            { type: 'say', text: '서버가 만든 HTML과, 브라우저에서 React가 처음 계산한 결과가 **달라서** 생기는 **하이드레이션 불일치(hydration mismatch)** 예요. React는 "어느 게 맞는 거지?" 하고 혼란에 빠져서 그 부분을 버리고 브라우저에서 다시 그려요. 화면이 깜빡이고, 성능도 손해예요.' },
          ],
        },
        {
          title: '흔한 원인 4가지',
          blocks: [
            {
              type: 'table',
              head: ['원인', '예', '왜 다르냐면'],
              rows: [
                ['매번 다른 값', '`Date.now()`, `new Date().toLocaleTimeString()`, `Math.random()`', '서버에서 실행한 시각과 브라우저에서 실행한 시각이 다름'],
                ['브라우저에만 있는 값', '`window.innerWidth`, `localStorage`', '서버에는 window가 없음 → 서버와 브라우저가 다른 분기를 탐'],
                ['잘못된 HTML 중첩', '`<p>` 안에 `<div>`, `<a>` 안에 `<a>`', '브라우저가 HTML을 고쳐서 읽어 버려 구조가 달라짐'],
                ['브라우저 확장 프로그램', '번역기·광고 차단기가 DOM을 건드림', 'React가 모르는 요소가 끼어듦'],
              ],
            },
            { type: 'ask', q: '"오늘 날짜: {new Date().toLocaleDateString()}" 를 그대로 쓰면 언제 불일치가 날까요?', a: '서버가 한국이 아닌 다른 시간대에 있거나, 자정 근처에서 서버와 브라우저의 날짜가 다르면 나요. 시각(시:분:초)까지 보여 주면 **거의 항상** 나고요. 서버에서 실행한 순간과 브라우저에서 실행한 순간이 다르니까요.' },
          ],
        },
      ],
    },
    {
      title: '불일치 고치기',
      slides: [
        {
          title: '브라우저 전용 값은 useEffect에서',
          blocks: [
            { type: 'say', text: '가장 기본적인 해결법이에요. 4-2에서 배운 것 기억나요? **useEffect는 서버에서 실행되지 않아요.** 그래서 브라우저 전용 값은 처음엔 서버와 같은 기본값으로 그리고, useEffect에서 바꿔요.' },
            {
              type: 'code',
              code: `'use client';
function RecentCourses() {
  // ❌ useState(() => JSON.parse(localStorage.getItem('recent') ?? '[]'))
  //    → 서버에는 localStorage가 없어서 에러 / 서버·브라우저 결과가 달라짐

  const [recent, setRecent] = useState<string[]>([]);   // 서버와 같은 기본값
  useEffect(() => {
    setRecent(JSON.parse(localStorage.getItem('recent') ?? '[]'));   // 브라우저에서만
  }, []);
  return <ul>{recent.map((t) => <li key={t}>{t}</li>)}</ul>;
}`,
            },
            { type: 'say', text: '첫 렌더링 결과는 서버와 브라우저 모두 빈 목록이라 **일치**해요. 하이드레이션이 끝난 뒤 useEffect가 진짜 값을 넣어요. 4-3의 레이지 초기화가 Next.js에서는 함정이 되는 이유예요.' },
          ],
        },
        {
          title: '다른 해결법들',
          blocks: [
            {
              type: 'table',
              head: ['상황', '해결'],
              rows: [
                ['시각처럼 다를 수밖에 없는 글자 하나', '그 요소에 `suppressHydrationWarning`을 붙여 "여기는 달라도 괜찮아"라고 알림 (한 단계 깊이까지만 효과)'],
                ['잘못된 HTML 중첩', '`<p>` 안에 `<div>` 넣지 않기. 구조를 고치는 게 정답'],
                ['차트·지도처럼 아예 브라우저에서만 그려야 하는 컴포넌트', "`next/dynamic`으로 `ssr: false` 옵션을 줘서 서버에서 그리지 않기 (클라이언트 컴포넌트 안에서만 가능)"],
              ],
            },
            { type: 'note', tone: 'warn', text: '`suppressHydrationWarning`을 에러를 숨기려고 아무 데나 붙이면 안 돼요. 진짜 문제를 가리는 거예요. "값이 다른 게 정상인 곳"(시각, 타임스탬프)에만 써요.' },
          ],
        },
      ],
    },
    {
      title: "'use client'도 서버에서 한 번 그려진다",
      slides: [
        {
          title: '가장 흔한 오해',
          blocks: [
            { type: 'say', text: 'Next.js에서 파일 맨 위에 `\'use client\'`를 쓰면 **클라이언트 컴포넌트**가 돼요(6-4에서 자세히). 그런데 많은 사람이 이렇게 오해해요.\n\n"`\'use client\'` = 브라우저에서만 실행된다 = CSR이다"\n\n**아니에요.** 클라이언트 컴포넌트도 **첫 HTML은 서버에서 미리 그려져요.** 그다음 브라우저에서 하이드레이션돼요.' },
            {
              type: 'table',
              head: ['', '서버 (첫 HTML 만들 때)', '브라우저'],
              rows: [
                ['컴포넌트 함수 본문', '실행됨', '실행됨 (하이드레이션 + 이후 렌더링)'],
                ['useState 초깃값·레이지 초기화', '실행됨', '실행됨'],
                ['useEffect·useLayoutEffect', '**실행 안 됨**', '실행됨'],
                ['onClick 등 이벤트', '없음', '하이드레이션 후 연결'],
              ],
            },
          ],
        },
        {
          title: 'window is not defined',
          blocks: [
            { type: 'code', code: `'use client';
export default function Banner() {
  const isMobile = window.innerWidth < 768;   // ❌ ReferenceError: window is not defined
  return <p>{isMobile ? '모바일' : 'PC'}</p>;
}` },
            { type: 'ask', q: "'use client'를 썼는데 왜 window가 없다고 할까요?", a: "첫 HTML을 만들려고 **서버에서도** 이 함수 본문을 실행했기 때문이에요. 서버(Node.js)에는 브라우저 창이 없으니 window도 없어요. 이 에러를 보면 \"아, 서버에서도 실행되는구나\"를 떠올리고, window·document·localStorage는 **useEffect 안이나 이벤트 핸들러 안**에서만 쓰세요." },
          ],
        },
      ],
    },
    {
      title: '하이드레이션 비용 줄이기',
      slides: [
        {
          title: '하이드레이션도 공짜가 아니에요',
          blocks: [
            { type: 'say', text: '하이드레이션하려면 **페이지 전체 컴포넌트의 JS를 다 받아서 다 실행**해야 해요. 글만 잔뜩 있는 블로그 글도, 버튼 하나 때문에 글 전체를 그리는 JS를 받고 다시 실행해야 했죠. 느린 폰에서는 이게 몇 초씩 걸려요.' },
            { type: 'say', text: 'React와 Next.js는 이걸 두 가지로 줄여요.' },
            {
              type: 'list',
              ordered: true,
              items: [
                '**서버 컴포넌트**: 상호작용이 없는 부분은 서버에서만 실행하고 **JS를 아예 안 보내요.** 하이드레이션할 것도 없어요 (6-4)',
                '**Suspense 단위 하이드레이션**: Suspense로 나눈 구역은 **준비된 곳부터** 하이드레이션하고, 사용자가 먼저 누른 곳을 우선 처리해요. 전부 끝날 때까지 기다리지 않아요',
              ],
            },
            { type: 'note', tone: 'tip', text: '그래서 Next.js에서의 성능 감각은 "**브라우저로 보내는 JS를 얼마나 줄였나**"예요. `\'use client\'`를 어디에 붙이느냐가 곧 하이드레이션 비용이에요. 다음 두 수업에서 이걸 직접 다뤄요.' },
            { type: 'say', text: '하이드레이션 끝! 확인 문제 가요.' },
          ],
        },
      ],
    },
  ],
  questions: [
    {
      id: 're06-2-q1',
      source: '하이드레이션이란',
      type: 'mcq',
      question: '하이드레이션(hydration)에 대한 설명으로 옳은 것은?',
      choices: ['서버가 HTML을 새로 만드는 것', '브라우저에서 React가 서버가 보낸 HTML에 이벤트·상태를 연결해 상호작용 가능하게 만드는 것', 'CSS를 적용하는 것', '이미지를 압축하는 것'],
      answer: 1,
      explanation: '서버 HTML은 모양만 있고, JS가 도착하면 React가 그 DOM을 재사용하면서 onClick·state를 연결해요.',
    },
    {
      id: 're06-2-q2',
      source: '하이드레이션이란',
      type: 'ox',
      question: '하이드레이션할 때 React는 서버가 만든 DOM을 버리고 처음부터 새로 만든다.',
      answer: false,
      explanation: '정상적이면 서버 DOM을 그대로 재사용하고 기능만 붙여요. 그래서 서버와 브라우저의 첫 계산 결과가 같아야 해요.',
    },
    {
      id: 're06-2-q3',
      source: '하이드레이션 불일치',
      type: 'mcq',
      question: '하이드레이션 불일치를 일으키기 쉬운 코드는?',
      choices: ['<h1>{title}</h1>', '<p>지금 시각: {new Date().toLocaleTimeString()}</p>', '<button onClick={save}>저장</button>', '{items.map((i) => <li key={i.id}>{i.name}</li>)}'],
      answer: 1,
      explanation: '서버에서 실행한 시각과 브라우저에서 실행한 시각이 달라서 결과가 달라져요.',
    },
    {
      id: 're06-2-q4',
      source: '하이드레이션 불일치',
      type: 'ox',
      question: '<p> 태그 안에 <div>를 넣으면 하이드레이션 불일치가 생길 수 있다.',
      answer: true,
      explanation: '브라우저가 잘못된 중첩을 고쳐서 읽어 버려 서버 HTML 구조와 React의 계산이 달라져요.',
    },
    {
      id: 're06-2-q5',
      source: '불일치 고치기',
      type: 'mcq',
      question: 'localStorage에 저장된 최근 본 강의를 Next.js 클라이언트 컴포넌트에서 보여 주는 안전한 방법은?',
      choices: ['useState(() => localStorage.getItem(...)) 로 바로 읽는다', '처음엔 빈 값으로 그리고 useEffect 안에서 localStorage를 읽어 state에 넣는다', '서버 컴포넌트에서 localStorage를 읽는다', 'suppressHydrationWarning을 body에 붙인다'],
      answer: 1,
      explanation: 'useEffect는 서버에서 실행되지 않아요. 첫 렌더링은 서버·브라우저 모두 빈 값으로 일치시키고, 하이드레이션 뒤에 진짜 값을 넣어요.',
    },
    {
      id: 're06-2-q6',
      source: '불일치 고치기',
      type: 'short',
      question: '시각처럼 서버·브라우저 값이 다를 수밖에 없는 요소에 붙여 경고를 끄는 속성 이름은?',
      answer: ['suppressHydrationWarning'],
      explanation: '값이 다른 게 정상인 곳에만 써요. 진짜 문제를 가리는 용도로 쓰면 안 돼요.',
    },
    {
      id: 're06-2-q7',
      source: "'use client'도 서버에서 한 번 그려진다",
      type: 'ox',
      question: "'use client'를 붙인 컴포넌트는 서버에서 전혀 실행되지 않고 브라우저에서만 실행된다.",
      answer: false,
      explanation: '클라이언트 컴포넌트도 첫 HTML은 서버에서 미리 그려지고 브라우저에서 하이드레이션돼요. 다만 useEffect는 서버에서 실행되지 않아요.',
    },
    {
      id: 're06-2-q8',
      source: "'use client'도 서버에서 한 번 그려진다",
      type: 'mcq',
      question: "'use client' 컴포넌트 본문에서 window.innerWidth를 읽었더니 'window is not defined' 에러가 났다. 이유는?",
      choices: ['오타가 있어서', '첫 HTML을 만들 때 서버(Node.js)에서도 본문이 실행되는데, 서버에는 window가 없어서', 'React 19에서 window가 삭제돼서', "'use client'를 두 번 써서"],
      answer: 1,
      explanation: 'window·document·localStorage는 useEffect나 이벤트 핸들러 안에서만 써요.',
    },
    {
      id: 're06-2-q9',
      source: '하이드레이션 비용 줄이기',
      type: 'mcq',
      question: '하이드레이션 비용을 줄이는 가장 효과적인 방법은?',
      choices: ['모든 컴포넌트에 use client를 붙인다', '상호작용이 없는 부분은 서버 컴포넌트로 두어 브라우저로 보내는 JS를 줄인다', 'CSS 파일을 늘린다', 'HashRouter를 쓴다'],
      answer: 1,
      explanation: '서버 컴포넌트는 JS를 브라우저로 보내지 않아 하이드레이션할 것도 없어요. use client를 어디에 붙이느냐가 곧 비용이에요.',
    },
  ],
}

export default topic
