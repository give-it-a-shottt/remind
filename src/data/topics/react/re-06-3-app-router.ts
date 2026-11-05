import type { Topic } from '../../types'

const topic: Topic = {
  id: 're-06-3-app-router',
  track: 'react',
  group: '06. 렌더링 전략과 Next.js',
  title: '6-3. App Router: 폴더가 곧 라우트',
  order: 603,
  addedAt: '2026-11-05',
  sections: [
    {
      title: '폴더가 곧 주소',
      slides: [
        {
          title: 'Next.js에는 React Router가 없어요',
          blocks: [
            { type: 'say', text: '5장에서 `createBrowserRouter([...])`로 주소와 화면을 코드로 연결했죠. Next.js에는 React Router가 **없어요.** 대신 **`app/` 폴더 구조 자체가 주소**가 돼요. 이 방식을 **App Router**(파일 기반 라우팅)라고 불러요.' },
            {
              type: 'code',
              code: `app/
├─ page.tsx              → /
├─ about/
│  └─ page.tsx           → /about
└─ courses/
   ├─ page.tsx           → /courses
   └─ [id]/
      └─ page.tsx        → /courses/7, /courses/42 ...`,
            },
            { type: 'say', text: '규칙은 간단해요. **폴더 = 주소의 한 칸, 그 안의 `page.tsx` = 그 주소의 화면.** `page.tsx`가 없는 폴더는 주소로 접속할 수 없어요.' },
          ],
        },
        {
          title: '기획 문서와 폴더가 1:1',
          blocks: [
            { type: 'say', text: '4-1에서 "IA(화면 목록)에서 상태를 뽑는다"고 했죠. Next.js에서는 **IA가 그대로 폴더 구조**가 돼요. 화면 목록 문서와 `app/` 폴더를 나란히 놓으면 빠진 화면이 바로 보여요.' },
            { type: 'ask', q: '/courses/7/reviews (강의 7번의 수강평) 화면을 만들려면 어떤 파일을 만들어야 할까요?', a: '`app/courses/[id]/reviews/page.tsx`예요. 폴더를 주소 칸 순서대로 만들고, 마지막에 page.tsx를 두면 돼요.' },
            { type: 'note', tone: 'tip', text: '폴더 이름을 `(marketing)`처럼 **괄호**로 감싸면 주소에는 안 나타나는 "묶음 폴더"가 돼요(Route Group). `app/(marketing)/about/page.tsx`는 그냥 `/about`이에요. 레이아웃을 다르게 쓰고 싶은 화면끼리 묶을 때 써요.' },
          ],
        },
      ],
    },
    {
      title: '특수 파일: layout·loading·error·not-found',
      slides: [
        {
          title: '이름이 정해진 파일들',
          blocks: [
            { type: 'say', text: '5장에서 React Router로 직접 만들던 것들을 Next.js는 **이름이 정해진 파일**로 대신해요.' },
            {
              type: 'table',
              head: ['파일', '하는 일', '5장의 무엇과 같나'],
              rows: [
                ['`layout.tsx`', '그 폴더와 하위 화면을 감싸는 공통 틀. `{children}` 자리에 하위 화면', 'Outlet이 있는 부모 라우트'],
                ['`page.tsx`', '그 주소의 화면', 'Route의 element, index 라우트'],
                ['`loading.tsx`', '그 구간이 준비되는 동안 보여 줄 화면 (자동으로 Suspense)', 'Suspense fallback'],
                ['`error.tsx`', '그 구간에서 에러가 나면 대신 보여 줄 화면 (에러 바운더리)', '4-1의 에러 바운더리'],
                ['`not-found.tsx`', '없는 주소일 때', "`path: '*'`"],
              ],
            },
            { type: 'note', tone: 'tip', text: '4-1에서 "에러 바운더리는 아직 클래스가 필요하다"고 했죠? Next.js에서는 `error.tsx` 파일 하나만 두면 그 경계가 자동으로 만들어져요. 클래스를 짤 일이 거의 없어요. (error.tsx는 `\'use client\'`여야 해요.)' },
          ],
        },
        {
          title: 'layout은 이동해도 다시 마운트되지 않아요',
          blocks: [
            {
              type: 'code',
              code: `// app/courses/layout.tsx
export default function CoursesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <CategorySidebar />      {/* /courses, /courses/7 어디서든 그대로 */}
      <main>{children}</main>  {/* 여기만 바뀜 */}
    </div>
  );
}`,
            },
            { type: 'say', text: '`/courses`에서 `/courses/7`로 이동해도 layout은 **다시 마운트되지 않아요.** 그래서 사이드바의 스크롤 위치나 "접힘/펼침" state가 그대로 유지돼요. 5-2의 Outlet 부모와 같은 동작이에요.' },
            { type: 'note', tone: 'tip', text: '로그인 안 한 사람을 `/login`으로 보내는 것처럼 **화면이 그려지기 전에** 요청을 가로채고 싶다면 프로젝트 루트의 `proxy.ts`를 써요. Next.js 16에서 `middleware.ts`의 이름이 `proxy.ts`로 바뀌었어요. 책이나 블로그에서 middleware.ts를 보면 같은 거예요.' },
          ],
        },
      ],
    },
    {
      title: '동적 라우트와 params',
      slides: [
        {
          title: '[id] 폴더',
          blocks: [
            { type: 'say', text: '5-1의 `/courses/:id`를 Next.js에서는 **대괄호 폴더**로 만들어요.' },
            {
              type: 'table',
              head: ['폴더 이름', '매칭되는 주소', 'params'],
              rows: [
                ['`[id]`', '`/courses/7`', "`{ id: '7' }`"],
                ['`[...slug]`', '`/docs/a/b/c` (1칸 이상)', "`{ slug: ['a', 'b', 'c'] }`"],
                ['`[[...slug]]`', '`/docs`, `/docs/a/b` (0칸도 OK)', '없으면 `{}`'],
              ],
            },
          ],
        },
        {
          title: 'params는 Promise예요',
          blocks: [
            {
              type: 'code',
              code: `// app/courses/[id]/page.tsx — 서버 컴포넌트
export default async function CoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;                 // ← await 필수
  const course = await getCourse(id);
  return <h1>{course.title}</h1>;
}`,
            },
            { type: 'note', tone: 'warn', text: 'Next.js 15부터 `params`와 `searchParams`가 **Promise**가 됐고, 16에서는 동기 방식이 완전히 없어졌어요. 그래서 반드시 `await params`를 해야 해요. 2-2에서 "Promise 안 쓴다고 생각하면 여기서 막힌다"고 한 게 바로 이거예요. (`cookies()`, `headers()`도 똑같이 `await`가 필요해요.)' },
            { type: 'say', text: '컴포넌트에 `async`가 붙어 있는 것도 보이죠? 2장에서 "컴포넌트 함수에는 async를 못 붙인다"고 했는데, **서버 컴포넌트는 붙일 수 있어요.** 6-4와 6-5에서 자세히 배워요.' },
            { type: 'note', tone: 'tip', text: '인기 강의 100개처럼 미리 알고 있는 id는 `generateStaticParams`로 알려 주면 **빌드할 때 HTML을 미리 만들어 둬요**(6-1의 SSG). 나머지 id는 첫 요청 때 만들고 저장해요(ISR).' },
          ],
        },
      ],
    },
    {
      title: '링크와 이동',
      slides: [
        {
          title: 'Link와 useRouter',
          blocks: [
            {
              type: 'table',
              head: ['하고 싶은 것', 'React Router (5장)', 'Next.js'],
              rows: [
                ['링크', "`<Link to>` from 'react-router'", "`<Link href>` from 'next/link'"],
                ['코드로 이동', '`useNavigate()`', "`useRouter().push('/courses')` from 'next/navigation'"],
                ['뒤로', '`navigate(-1)`', '`router.back()`'],
                ['서버에서 이동시키기', '—', "`redirect('/login')` (서버 컴포넌트·Server Action)"],
                ['지금 경로 읽기', '`useLocation().pathname`', '`usePathname()`'],
                ['검색 파라미터', '`useSearchParams()`', '`useSearchParams()` (클라이언트) 또는 page의 `searchParams` prop (서버)'],
              ],
            },
            { type: 'note', tone: 'warn', text: '`useRouter`, `usePathname`, `useSearchParams`는 **훅**이라 클라이언트 컴포넌트에서만 써요. 서버 컴포넌트에서는 page가 받는 `params`, `searchParams` prop과 `redirect()`를 써요. 그리고 `useRouter`는 반드시 `next/navigation`에서 import 해요 (`next/router`는 옛날 Pages Router용이에요).' },
          ],
        },
        {
          title: 'NavLink는 직접 만들어요',
          blocks: [
            { type: 'say', text: 'Next.js에는 5-1의 NavLink(현재 메뉴 자동 표시)가 없어요. `usePathname`으로 간단히 만들어요.' },
            {
              type: 'code',
              code: `'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const active = href === '/' ? pathname === '/' : pathname.startsWith(href);   // 홈은 end처럼
  return (
    <Link href={href} aria-current={active ? 'page' : undefined} className={active ? 'font-bold' : ''}>
      {children}
    </Link>
  );
}`,
            },
            { type: 'say', text: 'Next.js의 `<Link>`는 화면에 보이면 그 페이지를 **미리 받아 둬요(prefetch).** 그래서 클릭하면 거의 즉시 이동해요. 5-2의 레이지 로딩을 자동으로, 더 똑똑하게 해 주는 셈이에요.' },
          ],
        },
      ],
    },
    {
      title: '상태를 URL에 두기',
      slides: [
        {
          title: '새로고침해도, 공유해도 그대로',
          blocks: [
            { type: 'say', text: '5-1에서 "정렬·필터는 검색 파라미터에"라고 했죠. Next.js에서는 이게 **특히 자연스러워요.** 서버 컴포넌트인 page가 `searchParams`를 바로 받아서 **서버에서** 필터링된 목록을 그릴 수 있거든요.' },
            {
              type: 'code',
              code: `// app/courses/page.tsx — /courses?category=react&sort=new
export default async function CoursesPage({
  searchParams,
}: { searchParams: Promise<{ category?: string; sort?: string }> }) {
  const { category, sort = 'popular' } = await searchParams;
  const courses = await getCourses({ category, sort });   // 서버에서 바로 조회
  return <CourseList courses={courses} />;
}`,
            },
            { type: 'ask', q: '카테고리 필터를 useState로 두면 어떤 점이 불편할까요?', a: '• **새로고침**하면 필터가 풀려요\n• **링크를 공유**해도 상대방은 필터 없는 화면을 봐요\n• 뒤로 가기를 해도 필터가 안 돌아와요\n• 그리고 useState는 클라이언트 컴포넌트에서만 쓸 수 있어서, 목록을 서버에서 그릴 수 없어요\nURL에 두면 이 문제가 전부 사라져요.' },
            { type: 'say', text: '실무 기준: **공유하거나 새로고침해도 유지돼야 하는 화면 상태**(검색어, 필터, 정렬, 페이지 번호, 탭)는 **URL에**, 드롭다운 열림처럼 잠깐 쓰는 것만 useState에.\n\nApp Router 끝! 확인 문제 가요.' },
          ],
        },
      ],
    },
  ],
  questions: [
    {
      id: 're06-3-q1',
      source: '폴더가 곧 주소',
      type: 'mcq',
      question: 'Next.js App Router에서 /courses/7/reviews 화면을 만드는 파일 경로는?',
      choices: ['app/courses-7-reviews.tsx', 'app/courses/[id]/reviews/page.tsx', 'pages/courses/reviews.tsx', 'app/reviews/[id].tsx'],
      answer: 1,
      explanation: '폴더가 주소 한 칸이고, 그 안의 page.tsx가 화면이에요. 동적인 칸은 [id] 폴더로 만들어요.',
    },
    {
      id: 're06-3-q2',
      source: '폴더가 곧 주소',
      type: 'ox',
      question: 'app/(marketing)/about/page.tsx 의 주소는 /marketing/about 이다.',
      answer: false,
      explanation: '괄호 폴더(Route Group)는 주소에 나타나지 않아요. 주소는 /about이에요.',
    },
    {
      id: 're06-3-q3',
      source: '특수 파일: layout·loading·error·not-found',
      type: 'mcq',
      question: '데이터를 불러오는 동안 그 구간에 보여 줄 화면을 만드는 Next.js 파일은?',
      choices: ['layout.tsx', 'loading.tsx', 'error.tsx', 'not-found.tsx'],
      answer: 1,
      explanation: 'loading.tsx를 두면 그 구간이 자동으로 Suspense로 감싸지고, 준비되는 동안 이 화면이 보여요.',
    },
    {
      id: 're06-3-q4',
      source: '특수 파일: layout·loading·error·not-found',
      type: 'ox',
      question: '/courses 에서 /courses/7 로 이동하면 app/courses/layout.tsx 가 다시 마운트되어 그 안의 state가 초기화된다.',
      answer: false,
      explanation: 'layout은 하위 화면 사이를 이동해도 다시 마운트되지 않아 state가 유지돼요. children 자리만 바뀌어요.',
    },
    {
      id: 're06-3-q5',
      source: '특수 파일: layout·loading·error·not-found',
      type: 'short',
      question: 'Next.js 16에서 middleware.ts를 대신하는 파일 이름은?',
      answer: ['proxy.ts', 'proxy'],
      explanation: '화면이 그려지기 전에 요청을 가로채는 파일이에요. 이름만 바뀌고 하는 일은 같아요.',
    },
    {
      id: 're06-3-q6',
      source: '동적 라우트와 params',
      type: 'mcq',
      question: 'Next.js 16의 app/courses/[id]/page.tsx 에서 id를 꺼내는 올바른 코드는?',
      choices: ['const { id } = params;', 'const { id } = await params;', 'const { id } = useParams();', 'const id = window.location.id;'],
      answer: 1,
      explanation: 'params는 Promise라서 await해야 해요. 16부터 동기 접근이 완전히 없어졌어요.',
    },
    {
      id: 're06-3-q7',
      source: '동적 라우트와 params',
      type: 'mcq',
      question: '인기 강의 100개의 상세 페이지 HTML을 빌드할 때 미리 만들어 두고 싶다. 쓰는 함수는?',
      choices: ['generateStaticParams', 'useEffect', 'redirect', 'usePathname'],
      answer: 0,
      explanation: 'generateStaticParams로 id 목록을 알려 주면 빌드 때 그 페이지들을 미리 만들어요(SSG).',
    },
    {
      id: 're06-3-q8',
      source: '링크와 이동',
      type: 'mcq',
      question: '클라이언트 컴포넌트에서 버튼을 누르면 /courses 로 이동하려고 한다. 옳은 코드는?',
      choices: ["import { useRouter } from 'next/router'", "import { useRouter } from 'next/navigation' 후 router.push('/courses')", "import { useNavigate } from 'react-router'", "window.location = '/courses'"],
      answer: 1,
      explanation: 'App Router의 useRouter는 next/navigation에서 가져와요. next/router는 옛 Pages Router용이에요. 서버에서는 redirect()를 써요.',
    },
    {
      id: 're06-3-q9',
      source: '상태를 URL에 두기',
      type: 'mcq',
      question: '강의 목록의 카테고리 필터를 두기에 가장 알맞은 곳은?',
      choices: ['useState', 'URL 검색 파라미터 (?category=react)', 'useRef', '전역 변수'],
      answer: 1,
      explanation: 'URL에 두면 새로고침·공유·뒤로 가기에도 유지되고, 서버 컴포넌트 page가 searchParams로 받아 서버에서 바로 목록을 그릴 수 있어요.',
    },
  ],
}

export default topic
