import type { Topic } from '../../types'

const topic: Topic = {
  id: 're-05-1-router',
  track: 'react',
  group: '05. 라우터·HTTP·CORS·Redux',
  title: '5-1. React Router 기본',
  order: 501,
  notionId: '409df951bf8081548b16e7c8671ce171',
  addedAt: '2026-11-05',
  sections: [
    {
      title: 'URL과 화면을 연결하기',
      slides: [
        {
          title: '페이지가 하나뿐인데 주소가 바뀐다?',
          blocks: [
            { type: 'say', text: '5장에 온 걸 환영해요! 이번 장은 진짜 서비스처럼 **여러 화면, 서버 통신, 전역 상태**를 다뤄요. 첫 수업은 **React Router**예요.\n\nVite로 만든 React 앱은 HTML 파일이 `index.html` **하나뿐**이에요. 이걸 **SPA**(Single Page Application)라고 해요. 그런데 `/courses`, `/courses/7`처럼 주소마다 다른 화면이 나오죠? 그걸 해 주는 게 React Router예요.' },
            { type: 'say', text: 'React Router는 **주소창의 URL을 지켜보다가, 그 주소에 맞는 컴포넌트로 바꿔 끼워요.** 서버에서 새 페이지를 받지 않아서 빠르고, state도 날아가지 않아요.' },
          ],
        },
        {
          title: '안내 데스크, 안내판, 안내 한 줄',
          blocks: [
            {
              type: 'table',
              head: ['구성 요소', '역할', '비유'],
              rows: [
                ['Router', 'URL을 지켜보는 최상위 감싸개', '건물 안내 데스크'],
                ['Routes', '안의 Route 중 URL에 맞는 것을 골라 그림', '층별 안내판'],
                ['Route', '"이 경로면 이 컴포넌트" 규칙 하나', '"3층 = 강의실" 한 줄'],
              ],
            },
            {
              type: 'code',
              code: `import { BrowserRouter } from 'react-router/dom';
import { Routes, Route } from 'react-router';

<BrowserRouter>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/courses/:id" element={<CourseDetail />} />
  </Routes>
</BrowserRouter>`,
            },
            { type: 'say', text: '`element`에는 컴포넌트를 **JSX로** 넣어요. 그래서 `element={<Home title="메인" />}`처럼 props도 바로 줄 수 있어요. (아주 오래된 자료의 `component={Home}`은 이제 안 돼요.)' },
          ],
        },
      ],
    },
    {
      title: 'v8에서 바뀐 설치와 import',
      slides: [
        {
          title: 'react-router-dom이 아니에요',
          blocks: [
            { type: 'say', text: '중요한 최신 소식부터요. **2026년 6월 17일 React Router v8**이 나왔어요. 그러면서 책과 블로그에 나오는 `react-router-dom` 패키지가 **v8부터는 더 이상 나오지 않아요.** 마지막 버전이 7.18이에요.' },
            {
              type: 'table',
              head: ['', '책 (v6 시절)', '지금 (v8)'],
              rows: [
                ['설치', '`npm i react-router-dom`', '`npm i react-router`'],
                ['import', "`from 'react-router-dom'`", "대부분 `from 'react-router'`, 브라우저 전용(`RouterProvider` 등)은 `from 'react-router/dom'`"],              ],
            },
            { type: 'note', tone: 'tip', text: '재밌는 사실: 지금 보고 있는 **이 앱(remind)도 아직 v7의 `react-router-dom`을 써요.** 회사 코드도 대부분 이렇게 한 버전씩 늦어요. 그래서 두 import 경로를 다 읽을 줄 알아야 해요.' },
          ],
        },
        {
          title: '두 가지 설정 방식',
          blocks: [
            {
              type: 'code',
              code: `// ① JSX 방식 (책 방식, v8에서도 동작)
<BrowserRouter><Routes><Route ... /></Routes></BrowserRouter>

// ② 객체 방식 (데이터 불러오기 같은 기능까지 쓸 수 있음)
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/courses/:id', element: <CourseDetail /> },
]);
<RouterProvider router={router} />`,
            },
            { type: 'say', text: '둘 다 돼요. 새로 시작한다면 ②**객체 방식**을 추천해요. 화면이 뜨기 전에 데이터를 불러오는 `loader` 같은 기능은 객체 방식에서만 쓸 수 있거든요(다음 수업 끝에 잠깐 나와요).' },
          ],
        },
      ],
    },
    {
      title: '라우터 종류',
      slides: [
        {
          title: '대부분은 BrowserRouter',
          blocks: [
            {
              type: 'table',
              head: ['라우터', 'URL 모양', '쓰는 곳'],
              rows: [
                ['BrowserRouter (`createBrowserRouter`)', '`/courses/7`', '**기본.** 일반 웹사이트 (배포할 때 서버 설정 필요 → 다음 수업)'],
                ['HashRouter', '`/#/courses/7`', '서버 설정을 못 바꾸는 정적 호스팅'],
                ['MemoryRouter', '주소창에 안 보임', '테스트, Storybook, 팝업 안의 단계별 화면'],
              ],
            },
            { type: 'say', text: '지금은 "**기본은 BrowserRouter**, HashRouter는 `#`이 붙는 대신 서버 설정이 필요 없다" 정도만 기억하세요. HashRouter를 왜 쓰는지는 다음 수업의 "새로고침 404" 문제에서 확실히 이해하게 될 거예요.' },
          ],
        },
      ],
    },
    {
      title: 'URL 파라미터와 검색 파라미터',
      slides: [
        {
          title: '/courses/7 의 7 꺼내기',
          blocks: [
            { type: 'say', text: '강의가 100개면 Route를 100개 만들 수는 없죠. 경로에 **빈칸**을 둬요.' },
            {
              type: 'table',
              head: ['패턴', '예', '매칭되는 URL', '값 꺼내기'],
              rows: [
                ['`:id` 동적 자리', '`/courses/:id`', '`/courses/7`', "`useParams().id` → `'7'` (**항상 문자열**)"],
                ['`?` 선택', '`/courses/:lang?`', '`/courses`, `/courses/ko`', '없으면 `undefined`'],
                ['`*` 나머지 전부', "`path: '*'`", '어떤 주소든', '하나만 쓰면 **404 페이지**'],
              ],
            },
            { type: 'note', tone: 'warn', text: '`useParams().id`는 숫자처럼 보여도 **문자열 `\'7\'`** 이에요. 숫자 id와 비교할 때 `courses.find((c) => c.id === id)`는 항상 실패해요. `Number(id)`로 바꾸거나 비교 쪽을 문자열로 맞추세요.' },
          ],
        },
        {
          title: '?sort=new 는 다른 거예요',
          blocks: [
            { type: 'say', text: '`/courses/7`(URL 파라미터)과 `/courses?sort=new`(검색 파라미터)는 달라요.' },
            {
              type: 'code',
              code: `// /courses/7
const { id } = useParams();                 // '7'

// /courses?sort=new
const [params, setParams] = useSearchParams();
const sort = params.get('sort') ?? 'popular';
setParams({ sort: 'new' });                 // 주소가 /courses?sort=new 로 바뀜`,
            },
            { type: 'ask', q: '"인기순/최신순" 정렬 값은 useState와 검색 파라미터 중 어디에 두는 게 좋을까요?', a: '**검색 파라미터**가 좋아요. 주소에 남으니까 새로고침해도 유지되고, 링크를 친구에게 보내면 같은 정렬로 보여요.\n구분 기준: "**어떤 대상인가**(강의 7번)" → URL 파라미터, "**어떻게 보여 줄까**(정렬·필터·페이지)" → 검색 파라미터.' },
          ],
        },
      ],
    },
    {
      title: '라우터 훅과 Link·NavLink',
      slides: [
        {
          title: '자주 쓰는 훅',
          blocks: [
            {
              type: 'table',
              head: ['훅', '하는 일'],
              rows: [
                ['`useParams`', 'URL 파라미터 읽기'],
                ['`useSearchParams`', '`?` 뒤 검색 파라미터 읽기·바꾸기 (useState처럼 생김)'],
                ['`useNavigate`', '**코드로 이동** — `navigate(\'/courses\')`, `navigate(-1)`(뒤로)'],
                ['`useLocation`', '지금 위치 정보 **읽기 전용** — `{ pathname, search, state }`'],
              ],
            },
            { type: 'ask', q: 'useLocation으로 다른 페이지로 이동할 수 있을까요?', a: '**못 해요.** useLocation은 "지금 어디 있나"를 알려 주는 **읽기 전용**이에요. 이동은 `useNavigate`(코드) 또는 `<Link>`(클릭)로 해요.' },
            {
              type: 'code',
              code: `// 실무 단골 패턴: 로그인 후 원래 있던 페이지로 돌아가기
const location = useLocation();
const navigate = useNavigate();

navigate('/login', { state: { from: location } });          // 지금 위치를 들고 로그인으로
// 로그인 성공 후
navigate(location.state?.from ?? '/', { replace: true });   // 원래 자리로`,
            },
          ],
        },
        {
          title: '<a> 대신 <Link>',
          blocks: [
            {
              type: 'table',
              head: ['', '`<a href>`', '`<Link to>`', '`<NavLink to>`'],
              rows: [
                ['페이지 새로 받기', '함 (state가 전부 날아감)', '안 함', '안 함'],
                ['현재 위치 표시', '없음', '없음', '지금 주소면 `class="active"` + `aria-current="page"` 자동'],
                ['쓰는 곳', '외부 사이트', '일반 내부 링크', '메뉴·탭·사이드바'],
              ],
            },
            { type: 'ask', q: 'NavLink로 홈(/) 메뉴를 만들었더니 어느 페이지에 가도 홈이 active예요. 왜일까요?', a: '모든 주소가 `/`로 시작하잖아요. NavLink는 기본으로 "**이 경로로 시작하면** active"라서 홈이 항상 켜져요. 홈 메뉴에는 `<NavLink to="/" end>`처럼 **end**를 붙여서 "정확히 /일 때만"으로 바꿔요.' },
            { type: 'note', tone: 'tip', text: '`aria-current="page"`는 화면 낭독기가 "현재 페이지"라고 읽어 주는 **접근성** 속성이에요. NavLink가 자동으로 붙여 줘요. 이 앱의 상단 메뉴도 NavLink로 만들었어요.' },
            { type: 'say', text: '첫 수업 끝! 확인 문제 가요.' },
          ],
        },
      ],
    },
  ],
  questions: [
    {
      id: 're05-1-q1',
      source: 'URL과 화면을 연결하기',
      type: 'ox',
      question: 'React Router로 /courses 에서 /courses/7 로 이동하면 서버에서 새 HTML 페이지를 받아 온다.',
      answer: false,
      explanation: 'SPA는 index.html 하나예요. React Router가 URL에 맞는 컴포넌트로 바꿔 끼울 뿐, 페이지를 새로 받지 않아요.',
    },
    {
      id: 're05-1-q2',
      source: 'v8에서 바뀐 설치와 import',
      type: 'mcq',
      question: '2026년에 새 프로젝트에서 React Router v8을 설치하는 명령은?',
      choices: ['npm i react-router-dom', 'npm i react-router', 'npm i react-router-v8', 'npm i @react/router'],
      answer: 1,
      explanation: 'v8부터 react-router-dom 패키지는 나오지 않아요(마지막이 7.18). react-router를 설치하고, 브라우저 전용 기능은 react-router/dom에서 import 해요.',
    },
    {
      id: 're05-1-q3',
      source: '라우터 종류',
      type: 'mcq',
      question: '주소에 # 이 붙는 라우터(/#/courses/7)는?',
      choices: ['BrowserRouter', 'HashRouter', 'MemoryRouter', 'NativeRouter'],
      answer: 1,
      explanation: 'HashRouter는 # 뒤를 경로로 써요. 기본은 BrowserRouter이고, HashRouter는 서버 설정을 못 바꿀 때 써요.',
    },
    {
      id: 're05-1-q4',
      source: 'URL 파라미터와 검색 파라미터',
      type: 'mcq',
      question: 'path가 /courses/:id 이고 주소가 /courses/7 일 때 useParams().id 의 값은?',
      choices: ['숫자 7', "문자열 '7'", 'undefined', "'/courses/7'"],
      answer: 1,
      explanation: 'URL 파라미터는 항상 문자열이에요. 숫자 id와 비교하려면 Number(id)로 바꿔요.',
    },
    {
      id: 're05-1-q5',
      source: 'URL 파라미터와 검색 파라미터',
      type: 'mcq',
      question: '강의 목록의 "정렬 기준"을 저장하기에 가장 알맞은 곳은?',
      choices: ['URL 파라미터 /courses/:sort', '검색 파라미터 ?sort=new', '전역 변수', 'useRef'],
      answer: 1,
      explanation: '"어떻게 보여 줄까"는 검색 파라미터예요. 주소에 남아서 새로고침·공유해도 유지돼요.',
    },
    {
      id: 're05-1-q6',
      source: '라우터 훅과 Link·NavLink',
      type: 'mcq',
      question: '버튼을 누르면 코드로 /courses 페이지로 이동하고 싶다. 쓰는 훅은?',
      choices: ['useLocation', 'useParams', 'useNavigate', 'useSearchParams'],
      answer: 2,
      explanation: 'useNavigate가 돌려주는 navigate 함수로 이동해요. useLocation은 현재 위치를 읽기만 해요.',
    },
    {
      id: 're05-1-q7',
      source: '라우터 훅과 Link·NavLink',
      type: 'mcq',
      question: '앱 안에서 <a href="/courses"> 대신 <Link to="/courses"> 를 쓰는 이유는?',
      choices: ['글자 색이 예뻐서', '<a>는 페이지를 새로 받아 state가 날아가지만 Link는 컴포넌트만 바꿔 끼워서', 'Link만 외부 사이트로 갈 수 있어서', '<a>는 React에서 금지라서'],
      answer: 1,
      explanation: '<a href>는 브라우저가 페이지를 새로 요청해요. Link는 React Router가 처리해서 빠르고 상태가 유지돼요. 외부 사이트는 <a>를 써요.',
    },
    {
      id: 're05-1-q8',
      source: '라우터 훅과 Link·NavLink',
      type: 'short',
      question: '홈(/) NavLink가 모든 페이지에서 active가 되는 걸 막으려고 붙이는 속성 이름은?',
      answer: ['end'],
      explanation: '<NavLink to="/" end>처럼 쓰면 정확히 / 일 때만 active가 돼요.',
    },
  ],
}

export default topic
