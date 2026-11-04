import type { Topic } from '../../types'

const topic: Topic = {
  id: 're-05-2-nested-lazy',
  track: 'react',
  group: '05. 라우터·HTTP·CORS·Redux',
  title: '5-2. 중첩 라우트·레이지 로딩·새로고침 404',
  order: 502,
  notionId: '409df951bf8081548b16e7c8671ce171',
  addedAt: '2026-11-05',
  sections: [
    {
      title: '중첩 라우트와 Outlet',
      slides: [
        {
          title: '화면 일부는 그대로, 안쪽만 바뀌는 경우',
          blocks: [
            { type: 'say', text: '인프런 강의 상세 페이지를 떠올려 보세요. 위에는 강의 제목·가격·탭 메뉴가 있고, "소개 / 커리큘럼 / 수강평" 탭을 누르면 **아래 내용만** 바뀌어요. 제목 부분은 그대로고요.\n\n이렇게 "**바깥 화면은 그대로 두고 안쪽만 바뀌는**" 구조가 **중첩 라우트**예요. 생각보다 정말 많아요.' },
            {
              type: 'table',
              head: ['실제 사례', '부모 (그대로)', '자식 (바뀜)'],
              rows: [
                ['인프런 강의 상세', '강의 제목·가격·탭 메뉴', '소개 / 커리큘럼 / 수강평'],
                ['관리자 페이지', '왼쪽 사이드바 + 상단 헤더', '회원 관리, 주문 관리'],
                ['마이페이지', '프로필 카드 + 메뉴', '내 강의 / 좋아요 / 설정'],
                ['음악 앱', '플레이리스트 목록', '선택한 플레이리스트의 곡 목록'],
              ],
            },
          ],
        },
        {
          title: '<Outlet />은 자식이 들어갈 자리',
          blocks: [
            {
              type: 'code',
              code: `const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,                    // 헤더·메뉴 (항상 보임)
    children: [
      { path: 'courses/:id', element: <CourseDetail />,   // 제목·탭 (강의 페이지에서 항상)
        children: [
          { path: 'reviews', element: <Reviews /> },     // 탭 내용만 바뀜
        ],
      },
    ],
  },
]);

function Layout() {
  return (
    <>
      <Header />
      <Outlet />     {/* ← 자식 라우트가 여기에 그려짐 */}
    </>
  );
}`,
            },
            { type: 'say', text: '`/courses/7/reviews`로 가면 Layout → 그 안의 Outlet에 CourseDetail → 그 안의 Outlet에 Reviews가 들어가요. **Outlet은 "자식 화면이 들어갈 빈칸"** 이에요.' },
            { type: 'note', tone: 'analogy', text: '액자 안에 액자가 있는 거예요. 바깥 액자(Layout)는 계속 걸려 있고, 안쪽 사진(Outlet 자리)만 바꿔 끼워요.' },
            { type: 'note', tone: 'tip', text: '4-1에서 배운 **IA**의 "상위 메뉴 > 하위 메뉴" 구조가 그대로 중첩 라우트 구조가 돼요.' },
          ],
        },
      ],
    },
    {
      title: 'index 라우트와 404',
      slides: [
        {
          title: '부모 주소까지만 왔을 때 빈칸 채우기',
          blocks: [
            { type: 'ask', q: '/courses 에는 목록, /courses/7 에는 목록 아래 상세가 나오게 했어요. 그럼 그냥 /courses 일 때 Outlet 자리에는 뭐가 나올까요?', a: '**아무것도 안 나와요.** 자식 중에 `/courses`에 맞는 게 없으니 빈칸이에요. 이 빈칸에 넣을 "기본 자식"이 **index 라우트**예요.' },
            {
              type: 'code',
              code: `{ path: 'courses', element: <CourseList />, children: [
  { index: true, element: <p>강의를 선택하세요</p> },   // /courses   → 기본 자식
  { path: ':id', element: <CourseDetail /> },           // /courses/7 → 상세
]}`,
            },
          ],
        },
        {
          title: '없는 주소는 404 페이지로',
          blocks: [
            { type: 'code', code: `{ path: '*', element: <NotFound /> }   // 위에서 아무것도 안 맞으면 여기` },
            { type: 'say', text: '`*`는 "나머지 전부"예요. 다른 Route가 하나도 안 맞으면 여기로 와요. 사용자가 주소를 잘못 쳤을 때 하얀 빈 화면 대신 "페이지를 찾을 수 없어요" 화면을 보여 줘요.' },
            { type: 'note', tone: 'tip', text: '이 앱(remind)은 없는 주소로 가면 홈으로 보내요. `<Route path="*" element={<Navigate to="/" replace />} />`. 404 화면을 보여 주느냐, 홈으로 돌려보내느냐는 서비스마다 고르는 거예요.' },
          ],
        },
      ],
    },
    {
      title: '레이지 로딩과 Suspense',
      slides: [
        {
          title: '빌드는 다 하고, 다운로드는 나눠서',
          blocks: [
            { type: 'say', text: '1-2에서 배운 **코드 스플리팅**을 라우터에 쓰면 **레이지 로딩**이 돼요.\n\n흔한 오해부터 고칠게요. "안 보는 페이지는 빌드를 안 한다"가 아니에요.\n• 빌드는 **전부** 해요. 다만 페이지별로 **여러 파일로 쪼개서** 만들어요.\n• 사용자가 그 페이지에 **들어가는 순간** 그 파일만 내려받아요.\n\n느린 건 "렌더링"이 아니라 **다운로드**예요. 그걸 나눠서 첫 화면을 빨리 띄우는 거예요.' },
            {
              type: 'code',
              code: `import { lazy, Suspense } from 'react';

const About = lazy(() => import('./About'));   // 빌드 때 About-xxxx.js 로 분리

{ path: 'about', element: (
  <Suspense fallback={<p>불러오는 중...</p>}>
    <About />
  </Suspense>
)}`,
            },
          ],
        },
        {
          title: 'Suspense는 기다리는 동안의 화면',
          blocks: [
            { type: 'say', text: '"소개"를 클릭하는 순간 브라우저가 `About-xxxx.js`를 받으러 가요. 그 잠깐 동안 보여 줄 화면이 **Suspense의 fallback**이에요. 레이지 컴포넌트는 **반드시 Suspense 안에** 있어야 해요.' },
            { type: 'ask', q: '개발자 도구의 Network 탭을 열고 "소개"를 처음 클릭하면 무엇이 보일까요?', a: '`About-xxxx.js` 파일이 그 순간 **새로** 내려받아지는 게 보여요. 두 번째 클릭부터는 이미 받아 둔 걸 써서 다시 받지 않아요.' },
            { type: 'note', tone: 'tip', text: '무엇을 lazy로 할지 기준: **첫 화면에 필요 없고, 무거운 것.** 관리자 페이지, 차트·에디터 라이브러리가 든 화면이 대표적이에요. 작은 페이지까지 다 쪼개면 오히려 요청이 많아져요.' },
          ],
        },
      ],
    },
    {
      title: '새로고침하면 404?!',
      slides: [
        {
          title: '배포하고 나서 터지는 버그',
          blocks: [
            { type: 'say', text: '이건 정말 많은 사람이 배포하고 나서 처음 겪는 버그예요.\n\n개발할 때는 잘 되다가, 배포 후 `/courses/7`에서 **새로고침**하거나 주소를 직접 치면 **404**가 떠요. 앱 안에서 링크로 이동할 때는 멀쩡한데요.' },
            { type: 'ask', q: '왜 링크 이동은 되고 새로고침은 안 될까요? 힌트: SPA의 HTML 파일은 몇 개죠?', a: 'HTML은 `index.html` **하나뿐**이에요.\n• **링크 이동**: 브라우저 안의 React Router가 처리해요. 서버에 안 물어봐요.\n• **새로고침·직접 접속**: 브라우저가 서버에 "`/courses/7` 파일 주세요"라고 요청해요. 그런 파일은 없으니 서버가 404를 줘요.' },
          ],
        },
        {
          title: '해결: 서버가 index.html을 주게',
          blocks: [
            { type: 'say', text: '해결은 서버(호스팅)에 "**없는 경로로 요청이 오면 index.html을 돌려줘**"라고 설정하는 거예요. 이걸 **fallback**(또는 rewrite) 설정이라고 해요. index.html을 받으면 그 안의 React Router가 `/courses/7`을 보고 맞는 화면을 그려요.' },
            {
              type: 'table',
              head: ['호스팅', '설정'],
              rows: [
                ['Vercel·Netlify', 'rewrite 설정 (모든 경로 → /index.html)'],
                ['nginx', '`try_files $uri /index.html;`'],
                ['Vite 미리보기(`vite preview`)', '자동으로 해 줌 (그래서 로컬에선 안 보이는 버그)'],
              ],
            },
            { type: 'note', tone: 'warn', text: '"fallback"이라는 말이 두 번 나와서 헷갈려요.\n• **Suspense의 fallback**: React 안에서, 기다리는 동안 보여 주는 화면\n• **서버 fallback**: 호스팅 설정에서, 없는 경로에 index.html을 주는 것\n완전히 다른 얘기예요.' },
          ],
        },
        {
          title: 'HashRouter는 왜 404가 안 날까',
          blocks: [
            { type: 'say', text: '5-1에서 HashRouter는 `/#/courses/7`처럼 `#`이 붙는다고 했죠. 브라우저는 **`#` 뒤를 서버에 보내지 않아요.** 그래서 서버는 항상 `/`만 받고 index.html을 줘요. 새로고침해도 404가 안 나요.' },
            { type: 'say', text: '그럼 다 HashRouter 쓰면 되지 않냐고요? 대가가 있어요.\n• 주소에 `#`이 붙어서 보기 안 좋아요\n• 검색 엔진이 페이지를 따로 인식하기 어려워요\n• 서버 렌더링을 못 해요\n\n그래서 **기본은 BrowserRouter + 서버 fallback 설정**, HashRouter는 서버 설정을 정말 못 바꿀 때만 써요.' },
            { type: 'note', tone: 'tip', text: 'Next.js는 이 문제가 아예 없어요. 서버가 `/courses/7` 요청을 직접 받아서 그 페이지를 그려 주거든요. Next.js 챕터에서 다시 볼게요.' },
          ],
        },
      ],
    },
    {
      title: '화면 뜨기 전에 데이터 불러오기 (loader)',
      slides: [
        {
          title: '4-2의 고민을 라우터가 해결',
          blocks: [
            { type: 'say', text: '4-2에서 useEffect로 데이터를 가져오면 "빈 화면 → 로딩 → 데이터" 순서에, 경쟁 상태까지 직접 처리해야 했죠. 객체 방식 라우터(`createBrowserRouter`)는 라우트에 **loader**를 달 수 있어요. 그 경로로 **이동하기 전에** 데이터를 불러와요.' },
            {
              type: 'code',
              code: `{
  path: 'courses/:id',
  loader: async ({ params }) => {                   // 이동 전에 실행
    const res = await fetch(\`/api/courses/\${params.id}\`);
    if (!res.ok) throw new Response('없음', { status: 404 });
    return res.json();
  },
  element: <CourseDetail />,                        // 안에서 useLoaderData()로 받음
}`,
            },
            { type: 'say', text: '강의 id를 빠르게 바꿔도 마지막 요청만 반영해 줘서 경쟁 상태 걱정도 줄어요. 5-1에서 "새로 시작하면 객체 방식 추천"이라고 한 이유가 이거예요.\n\n수업 끝! 확인 문제 가요.' },
          ],
        },
      ],
    },
  ],
  questions: [
    {
      id: 're05-2-q1',
      source: '중첩 라우트와 Outlet',
      type: 'mcq',
      question: '중첩 라우트에서 자식 라우트의 화면이 그려지는 자리를 표시하는 컴포넌트는?',
      choices: ['<Route />', '<Outlet />', '<Link />', '<Suspense />'],
      answer: 1,
      explanation: '부모 컴포넌트 안의 <Outlet /> 자리에 자식 라우트가 그려져요. 지우면 자식이 보이지 않아요.',
    },
    {
      id: 're05-2-q2',
      source: '중첩 라우트와 Outlet',
      type: 'ox',
      question: 'CourseList 컴포넌트에서 <Outlet />을 지우면, /courses/7 로 가도 자식인 CourseDetail이 보이지 않는다.',
      answer: true,
      explanation: '자식이 그려질 빈칸이 없으니 라우트는 맞아도 화면에 나오지 않아요.',
    },
    {
      id: 're05-2-q3',
      source: 'index 라우트와 404',
      type: 'mcq',
      question: '{ index: true, element: <CourseIndex /> } 는 언제 보일까?',
      choices: ['모든 페이지에서', '부모 경로(/courses)까지만 왔을 때 Outlet 자리에', '404일 때', '로딩 중일 때'],
      answer: 1,
      explanation: 'index 라우트는 부모 주소까지만 매칭됐을 때 Outlet에 들어가는 기본 자식이에요.',
    },
    {
      id: 're05-2-q4',
      source: 'index 라우트와 404',
      type: 'short',
      question: '어떤 Route에도 맞지 않는 주소를 받는 404 라우트의 path 값은?',
      answer: ['*', "'*'", '"*"'],
      explanation: "path: '*'는 나머지 전부를 뜻해서, 다른 라우트가 안 맞으면 여기로 와요.",
    },
    {
      id: 're05-2-q5',
      source: '레이지 로딩과 Suspense',
      type: 'mcq',
      question: '레이지 로딩(lazy + 라우트)에 대한 설명으로 옳은 것은?',
      choices: ['안 보는 페이지는 빌드에서 빠진다', '빌드는 다 하되 페이지별 파일로 쪼개고, 그 페이지에 들어갈 때 파일을 내려받는다', '렌더링을 서버에서 한다', '이미지만 늦게 불러온다'],
      answer: 1,
      explanation: '빌드는 전부, 다운로드는 필요할 때. 첫 화면의 다운로드 크기를 줄이는 기술이에요.',
    },
    {
      id: 're05-2-q6',
      source: '레이지 로딩과 Suspense',
      type: 'ox',
      question: 'lazy로 불러온 컴포넌트는 Suspense로 감싸지 않아도 된다.',
      answer: false,
      explanation: '파일을 받는 동안 보여 줄 화면이 필요해서, 레이지 컴포넌트는 반드시 Suspense(fallback) 안에 있어야 해요.',
    },
    {
      id: 're05-2-q7',
      source: '새로고침하면 404?!',
      type: 'mcq',
      question: 'BrowserRouter로 만든 SPA를 배포했더니 /courses/7 에서 새로고침하면 404가 난다. 가장 알맞은 해결은?',
      choices: ['모든 링크를 <a>로 바꾼다', '호스팅에 "없는 경로는 index.html을 돌려주라"는 fallback(rewrite) 설정을 한다', 'React를 다시 설치한다', 'useEffect로 새로고침을 막는다'],
      answer: 1,
      explanation: '새로고침하면 브라우저가 서버에 /courses/7 파일을 요청하는데 없어서 404예요. index.html을 주게 하면 React Router가 처리해요.',
    },
    {
      id: 're05-2-q8',
      source: '새로고침하면 404?!',
      type: 'mcq',
      question: 'HashRouter(/#/courses/7)가 새로고침해도 404가 나지 않는 이유는?',
      choices: ['HashRouter가 서버를 대신해서', '브라우저가 # 뒤 부분을 서버에 보내지 않아 서버는 항상 / 만 받기 때문', '해시가 암호화라서', 'HashRouter는 캐시를 써서'],
      answer: 1,
      explanation: '서버는 / 요청만 받아 index.html을 주고, # 뒤는 React Router가 읽어요. 대신 URL이 지저분하고 검색 엔진에 불리해요.',
    },
    {
      id: 're05-2-q9',
      source: '화면 뜨기 전에 데이터 불러오기 (loader)',
      type: 'ox',
      question: 'createBrowserRouter의 loader는 그 경로로 이동하기 전에 데이터를 불러올 수 있다.',
      answer: true,
      explanation: 'loader가 이동 전에 실행되고, 컴포넌트는 useLoaderData()로 받아요. useEffect로 가져올 때의 로딩·경쟁 상태 고민이 줄어요.',
    },
    {
      id: 're05-2-q10',
      source: '새로고침하면 404?!',
      type: 'essay',
      question: '[면접] BrowserRouter로 만든 SPA를 배포했더니 새로고침하면 404가 나요. 왜이고 어떻게 고치나요?',
      answer: 'SPA는 index.html 하나이고 페이지 이동은 브라우저의 React Router가 처리합니다. 새로고침이나 직접 접속을 하면 브라우저가 /courses/7 같은 경로를 서버에 요청하는데, 그런 파일이 없으니 404가 납니다. 호스팅이나 nginx에 "없는 경로는 index.html을 돌려주라"는 fallback(rewrite) 설정을 하면 됩니다. 서버 설정을 못 바꾸면 # 뒤를 서버에 보내지 않는 HashRouter를 쓸 수 있지만 URL과 SEO 면에서 불리합니다.',
      keywords: ['SPA', 'index.html 하나', '서버 fallback', 'rewrite', 'HashRouter'],
      explanation: '"링크 이동은 브라우저, 새로고침은 서버가 처리한다"는 차이를 먼저 말하고 해결책 두 가지를 말해요.',
    },
  ],
}

export default topic
