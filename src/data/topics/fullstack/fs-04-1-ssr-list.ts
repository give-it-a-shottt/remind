import type { Topic } from '../../types'

const topic: Topic = {
  id: 'fs-04-1-ssr-list',
  track: 'fullstack',
  group: '04. Next.js 화면 만들기',
  title: '4-1. 강의 목록을 SSR로: getServerSideProps',
  order: 401,
  notionId: '40cdf951bf80802584a3d9417f850d3e',
  addedAt: '2026-11-06',
  sections: [
    {
      title: 'Ctrl+U와 Elements 탭',
      slides: [
        {
          title: '서버가 보낸 원본 vs 지금 화면',
          blocks: [
            { type: 'say', text: '4장에 왔어요! 백엔드가 준비됐으니 이제 화면을 제대로 만들어요.\n\n1-3에서 만든 `useEffect` 버전 강의 목록 페이지를 열고, 두 가지를 비교해 보세요.\n• **Ctrl+U** (페이지 소스 보기)\n• **F12 → Elements 탭**' },
            {
              type: 'table',
              head: ['', 'Ctrl+U (페이지 소스)', 'Elements 탭'],
              rows: [
                ['보여 주는 것', '**서버가 처음 보낸** HTML 원본', 'JS 실행 후 **지금 화면** (DOM)'],
                ['useEffect 버전의 강의 제목', '**없음**', '있음'],
              ],
            },
            { type: 'note', tone: 'analogy', text: 'Ctrl+U는 택배 상자를 **처음 열었을 때** 사진, Elements는 **조립까지 끝낸** 지금 모습이에요. Elements에 있다고 해서 서버가 보낸 HTML에 있었다는 뜻이 아니에요.' },
          ],
        },
        {
          title: '누가 손해를 볼까',
          blocks: [
            { type: 'ask', q: 'JS를 실행하지 않는 검색 로봇이나 카톡 링크 미리보기에게 이 페이지는 어떻게 보일까요?', a: '강의 목록이 **비어 있는** 페이지로 보여요. 그들은 Ctrl+U와 같은 것(서버가 보낸 원본)만 보거든요. 사람 사용자는 JS가 실행되니 결국 채워진 화면을 보지만, 검색에 안 걸리고 링크 미리보기도 비어서 손해를 봐요.' },
            { type: 'say', text: '이게 React 트랙 6-1에서 배운 **CSR**의 단점이에요. 강의 목록처럼 **검색에 나와야 하는 공개 페이지**는 서버가 데이터를 넣은 HTML을 보내야 해요. 그게 **SSR**이에요.' },
          ],
        },
      ],
    },
    {
      title: 'getServerSideProps',
      slides: [
        {
          title: 'HTML을 보내기 전에 데이터부터',
          blocks: [
            { type: 'say', text: 'Pages Router에서 SSR은 **`getServerSideProps`** 라는 이름의 함수로 해요. 이 이름으로 export 하면 Next.js가 **요청마다 서버에서 먼저** 실행해요.' },
            {
              type: 'code',
              code: `// frontend/pages/courses.tsx
type Course = { id: number; title: string; price: number };

// 요청마다 Next.js 서버에서 먼저 실행 (브라우저에서는 실행 안 됨)
export async function getServerSideProps() {
  const res = await fetch("http://localhost:8000/courses");   // FastAPI에 요청
  const courses: Course[] = await res.json();
  return { props: { courses } };                              // props 상자에 담기
}

// props 상자 안의 courses를 같은 이름으로 꺼낸다
export default function Courses({ courses }: { courses: Course[] }) {
  return (
    <>
      <h1>강의 목록</h1>
      <ol>{courses.map((c) => <li key={c.id}>{c.title}</li>)}</ol>
    </>
  );
}`,
            },
            { type: 'say', text: '`useState`, `useEffect`가 **사라졌어요.** 데이터가 처음부터 props로 들어오니 나중에 채울 일이 없거든요.' },
          ],
        },
        {
          title: '순서가 핵심이에요',
          blocks: [
            {
              type: 'list',
              ordered: true,
              items: [
                '브라우저가 `localhost:3000/courses`를 요청',
                'Next.js 서버가 `getServerSideProps` 실행 → FastAPI에서 강의 받기',
                '`return { props: { courses } }` → Next.js가 `Courses({ courses })`로 HTML을 만듦',
                '**강의 제목이 들어간** HTML을 브라우저에 보냄 → Ctrl+U에 제목이 보여요',
              ],
            },
            { type: 'note', tone: 'tip', text: '1-3에서 "SSR로 바꾸면 CORS가 필요 없어진다"고 했죠? 2번의 요청은 **Next.js 서버 → FastAPI 서버**, 서버끼리라 브라우저 규칙인 CORS가 적용되지 않아요(React 트랙 5-4).' },
          ],
        },
      ],
    },
    {
      title: 'props 상자에서 꺼내기',
      slides: [
        {
          title: '이름이 같아야 해요',
          blocks: [
            { type: 'ask', q: 'return { props: { courses } } 일 때, 컴포넌트를 function Courses({ props }) 로 쓰면 어떻게 될까요?', a: '`props`는 `undefined`예요. Next.js는 `props` **상자를 열어서 그 안의 내용물**을 컴포넌트에 넘겨요. 그러니 중괄호로 꺼낼 이름은 상자 **안의** 이름인 `courses`예요. `{ list }`처럼 다른 이름을 써도 undefined가 돼요.' },
            { type: 'note', tone: 'analogy', text: '`props`는 이름표 붙은 택배 상자예요. 서버가 `courses`라는 이름표를 붙여 넣으면, 컴포넌트는 **같은 이름표**로 꺼내요. React 트랙 2-1의 구조 분해 할당 그대로예요.' },
            { type: 'note', tone: 'tip', text: 'Ctrl+U에서 `__NEXT_DATA__`를 검색해 보세요. Next.js가 props를 HTML 안에 **JSON으로도** 넣어 보낸 게 보여요. 브라우저가 같은 데이터로 한 번 더 그려서 버튼 같은 동작을 연결하기 때문이에요. 이게 React 트랙 6-2의 **하이드레이션**이에요.' },
          ],
        },
      ],
    },
    {
      title: 'FastAPI가 꺼지면',
      slides: [
        {
          title: '페이지 전체가 500',
          blocks: [
            { type: 'say', text: '고장 실험이에요. FastAPI 터미널에서 Ctrl+C로 끄고 `/courses`를 새로고침해 보세요.' },
            { type: 'code', code: `# Next.js 터미널
TypeError: fetch failed    (courses.tsx:8)
  cause: ECONNREFUSED 127.0.0.1:8000
GET /courses 500 in 514ms` },
            { type: 'ask', q: '500은 누가 보낸 걸까요? FastAPI는 꺼져 있는데요.', a: '**Next.js**가 브라우저에게 보낸 거예요. 꺼진 서버는 상태 코드조차 못 보내요. `ECONNREFUSED`는 "그 포트에서 기다리는 프로그램이 없어서 **바로 거절**됐다"는 뜻이에요(514ms 만에 끝났으니 기다린 게 아니에요). getServerSideProps가 실패해서 HTML을 못 만들었으니, Next.js가 "내가 실패했어요"라고 500을 보낸 거예요.' },
            { type: 'say', text: 'CSR 때는 FastAPI가 꺼져도 "강의 목록" 제목이라도 떴는데, SSR은 **페이지 전체**가 실패해요. 데이터를 받아야 HTML을 만드니까요. SSR의 대가예요.' },
          ],
        },
        {
          title: '에러를 잡아 안내하기',
          blocks: [
            {
              type: 'code',
              code: `export async function getServerSideProps() {
  try {
    const res = await fetch("http://localhost:8000/courses");
    if (!res.ok) throw new Error(\`FastAPI \${res.status}\`);   // 404·500 응답도 실패로
    const courses: Course[] = await res.json();
    return { props: { courses, error: null } };
  } catch {
    return { props: { courses: [], error: "강의를 불러오지 못했어요" } };
  }
}`,
            },
            { type: 'say', text: '이제 FastAPI가 잠깐 멈춰도 페이지는 뜨고 "강의를 불러오지 못했어요"를 보여 줄 수 있어요. 재료 납품이 끊겨도 가게 문을 닫지 않고 "오늘은 품절" 안내판을 거는 거예요.' },
            { type: 'note', tone: 'warn', text: '`fetch`는 서버가 404·500을 **응답한** 경우에는 에러를 던지지 않아요. 연결 자체가 안 될 때만 던져요. 그래서 `res.ok` 검사를 따로 해요(React 트랙 5-3).\n\n수업 끝! 확인 문제 가요.' },
          ],
        },
      ],
    },
  ],
  questions: [
    {
      id: 'fs04-1-q1',
      source: 'Ctrl+U와 Elements 탭',
      type: 'mcq',
      question: 'useEffect로 데이터를 불러오는 페이지에서 강의 제목이 Elements에는 있는데 Ctrl+U에는 없는 이유는?',
      choices: ['Ctrl+U가 캐시를 보여 줘서', 'Ctrl+U는 서버가 처음 보낸 HTML이고, 제목은 그 뒤 브라우저가 JS로 넣었기 때문', 'Elements가 FastAPI에 직접 요청해서', '서버가 li만 지워서'],
      answer: 1,
      explanation: 'Ctrl+U는 원본, Elements는 JS 실행 후 현재 화면이에요. 검색 로봇은 원본만 봐요.',
    },
    {
      id: 'fs04-1-q2',
      source: 'getServerSideProps',
      type: 'mcq',
      question: '강의 제목이 검색 로봇에게도 보이게 하려면 FastAPI 요청 코드를 어디에 둬야 할까?',
      choices: ['컴포넌트 안의 useEffect', '버튼 onClick', 'getServerSideProps (HTML을 만들기 전, 서버에서)', '_document.tsx의 script 태그'],
      answer: 2,
      explanation: 'HTML을 보내기 전에 데이터가 있어야 해요. 그 시점에 코드를 실행할 수 있는 곳은 서버예요.',
    },
    {
      id: 'fs04-1-q3',
      source: 'getServerSideProps',
      type: 'ox',
      question: 'getServerSideProps 안의 fetch는 Next.js 서버에서 실행되므로 FastAPI에 CORS 설정이 없어도 된다.',
      answer: true,
      explanation: '서버끼리의 요청이라 브라우저 규칙인 CORS가 적용되지 않아요.',
    },
    {
      id: 'fs04-1-q4',
      source: 'props 상자에서 꺼내기',
      type: 'mcq',
      question: 'return { props: { courses } } 일 때 올바른 컴포넌트 시그니처는?',
      choices: ['function Courses({ props })', 'function Courses({ courses })', 'function Courses({ list })', 'function Courses() + useState'],
      answer: 1,
      explanation: 'Next.js가 props 상자를 열어 넘기니, 상자 안의 이름(courses)으로 꺼내요.',
    },
    {
      id: 'fs04-1-q5',
      source: 'FastAPI가 꺼지면',
      type: 'mcq',
      question: 'FastAPI를 끄고 SSR 페이지를 새로고침했더니 ECONNREFUSED와 GET /courses 500이 찍혔다. 옳은 설명은?',
      choices: ['FastAPI가 500을 보냈다', '빈 배열에 map을 해서 에러가 났다', 'FastAPI는 응답을 못 했고(연결 거절), HTML을 못 만든 Next.js가 브라우저에 500을 보냈다', '타임아웃이 났다'],
      answer: 2,
      explanation: '꺼진 서버는 상태 코드를 보낼 수 없어요. 브라우저가 아는 유일한 서버인 Next.js가 실패를 알린 거예요.',
    },
    {
      id: 'fs04-1-q6',
      source: 'FastAPI가 꺼지면',
      type: 'essay',
      question: '[면접] CSR과 SSR의 차이를, 직접 만든 강의 목록 페이지 경험으로 설명해 주세요.',
      answer: 'CSR로 만들었을 때는 useEffect에서 브라우저가 FastAPI에 요청해 데이터를 채워서, Ctrl+U로 본 서버 원본 HTML에는 강의 제목이 없었습니다. 검색 로봇이나 링크 미리보기에는 빈 페이지로 보이는 문제가 있었습니다. getServerSideProps로 SSR을 적용하자 Next.js 서버가 요청마다 FastAPI에서 데이터를 먼저 받아 props로 넘기고 내용이 찬 HTML을 보내서 원본에도 제목이 보였고, 서버끼리 요청이라 CORS도 필요 없어졌습니다. 대신 FastAPI가 꺼지면 HTML을 못 만들어 페이지 전체가 500이 되는 것을 실험으로 확인했고, try/catch와 res.ok 검사로 실패 시 안내 문구를 보여 주도록 개선했습니다.',
      keywords: ['Ctrl+U vs Elements', 'getServerSideProps', 'props', 'SEO·미리보기', 'CORS 불필요', 'ECONNREFUSED·500', 'try/catch'],
      explanation: '직접 해 본 관찰(원본에 제목 없음 → 있음)과 대가(전체 500)와 개선까지 말하면 경험 있는 답이 돼요.',
    },
  ],
}

export default topic
