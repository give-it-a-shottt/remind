import type { Topic } from '../../types'

const topic: Topic = {
  id: 're-07-6-query-nextjs',
  track: 'react',
  group: '07. 서버 상태와 클라이언트 상태',
  title: '7-6. Next.js에서 TanStack Query 쓰기',
  order: 706,
  addedAt: '2026-11-05',
  sections: [
    {
      title: '서버 컴포넌트가 있는데 왜 필요해요?',
      slides: [
        {
          title: '둘의 역할이 달라요',
          blocks: [
            { type: 'say', text: '7장 마지막 수업이에요. 6-5에서 "서버 컴포넌트에서 await하면 끝"이라고 했는데, 그럼 Next.js에서는 TanStack Query가 필요 없을까요?\n\n**읽기만 하는 화면**은 서버 컴포넌트로 충분해요. 하지만 **브라우저에서 계속 살아 움직이는 데이터**가 있으면 TanStack Query가 여전히 강력해요.' },
            {
              type: 'table',
              head: ['서버 컴포넌트 fetch로 충분', 'TanStack Query가 유리'],
              rows: [
                ['강의 소개, 블로그 글처럼 한 번 그리면 끝', '무한 스크롤, "더 보기"'],
                ['페이지 이동 때 새로 그려도 되는 데이터', '몇 초마다 새로고침(폴링): 알림 수, 주문 상태'],
                ['SEO가 중요한 첫 화면', '좋아요·찜 같은 낙관적 업데이트 (7-3)'],
                ['', '창으로 돌아올 때 자동 갱신, 오프라인 후 재연결'],
              ],
            },
            { type: 'say', text: '그래서 실무에서는 **둘을 같이** 써요. 첫 데이터는 서버에서 가져와 빠르게 보여 주고, 그 뒤의 상호작용은 TanStack Query가 맡는 식이에요.' },
          ],
        },
      ],
    },
    {
      title: 'Provider 설정',
      slides: [
        {
          title: 'QueryClient도 요청마다',
          blocks: [
            {
              type: 'code',
              code: `// app/query-provider.tsx
'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () => new QueryClient({ defaultOptions: { queries: { staleTime: 60 * 1000 } } }),
  );
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

// app/layout.tsx — 서버 컴포넌트 그대로
<body><QueryProvider>{children}</QueryProvider></body>`,
            },
            { type: 'ask', q: '7-1에서는 new QueryClient()를 모듈 맨 바깥에 만들었어요. 여기선 왜 useState 안에 만들까요?', a: '7-5의 Zustand와 같은 이유예요. Next.js 서버에서 모듈 맨 바깥에 만들면 **모든 사용자가 같은 캐시를 공유**해서, A의 데이터가 B 화면에 나올 수 있어요. useState 레이지 초기화로 **Provider(사용자)마다 하나씩, 한 번만** 만들어요.' },
          ],
        },
        {
          title: 'staleTime을 0보다 크게',
          blocks: [
            { type: 'say', text: '위 코드에서 staleTime을 60초로 준 것도 이유가 있어요.' },
            { type: 'say', text: '서버에서 데이터를 미리 가져와 HTML을 그렸는데 staleTime이 0이면, 브라우저에서 하이드레이션되자마자 "오래됐네?" 하고 **같은 데이터를 바로 또 요청**해요. 서버에서 가져온 의미가 반쯤 사라지죠. 그래서 Next.js와 함께 쓸 때는 공식 문서도 **staleTime을 0보다 크게** 두라고 권해요.' },
          ],
        },
      ],
    },
    {
      title: '서버에서 미리 가져와 넘겨주기',
      slides: [
        {
          title: 'prefetch → dehydrate → HydrationBoundary',
          blocks: [
            { type: 'say', text: '가장 많이 쓰는 패턴이에요. **서버 컴포넌트에서 미리 가져와 캐시를 채우고**, 그 캐시를 브라우저로 넘겨서 클라이언트의 useQuery가 **로딩 없이 바로** 쓰게 해요.' },
            {
              type: 'code',
              code: `// app/courses/page.tsx — 서버 컴포넌트
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import CourseList from './CourseList';

export default async function CoursesPage() {
  const queryClient = new QueryClient();                  // 이 요청만을 위한 것
  await queryClient.prefetchQuery({
    queryKey: ['courses'],
    queryFn: getCourses,
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>    {/* 캐시를 직렬화해 넘김 */}
      <CourseList />
    </HydrationBoundary>
  );
}`,
            },
          ],
        },
        {
          title: '클라이언트는 평소처럼',
          blocks: [
            {
              type: 'code',
              code: `// app/courses/CourseList.tsx
'use client';
export default function CourseList() {
  const { data } = useQuery({ queryKey: ['courses'], queryFn: getCourses });   // 같은 키!
  // 처음부터 data가 있음 → 로딩 없이 바로 그림
  // 이후 무한 스크롤·재요청·낙관적 업데이트는 평소처럼
  return <ul>{data?.map((c) => <li key={c.id}>{c.title}</li>)}</ul>;
}`,
            },
            {
              type: 'list',
              ordered: true,
              items: ['서버: `prefetchQuery`로 캐시를 채움', '서버: `dehydrate`로 캐시를 직렬화 (6-4: 네트워크를 건너려면 직렬화)', '`HydrationBoundary`가 그 캐시를 브라우저의 QueryClient에 넣어 줌', '클라이언트: **같은 queryKey**의 useQuery가 캐시를 바로 씀'],
            },
            { type: 'note', tone: 'warn', text: '서버와 클라이언트의 **queryKey가 정확히 같아야** 해요. 한 글자라도 다르면 다른 데이터로 보고 클라이언트에서 또 요청해요. 7-2의 query key factory로 키를 한 곳에서 만들면 이 실수가 없어져요.' },
          ],
        },
      ],
    },
    {
      title: '정리: 상태의 집 지도',
      slides: [
        {
          title: '이제 모든 상태의 집을 알아요',
          blocks: [
            { type: 'say', text: '3-1에서 시작한 "상태 종류별 집"을 7장에서 완성했어요. 시니어는 새 기능을 만들 때 코드보다 먼저 **"이 상태는 어느 집에 살아야 하지?"** 를 정해요.' },
            {
              type: 'table',
              head: ['질문', '집'],
              rows: [
                ['한 컴포넌트만 쓰나?', '`useState` / `useReducer`'],
                ['새로고침·공유해도 유지돼야 하나? (필터, 정렬, 페이지)', '**URL** (6-3)'],
                ['주인이 서버인가?', '**서버 컴포넌트 fetch** (읽기) / **TanStack Query** (상호작용)'],
                ['가끔 바뀌고 넓게 쓰나? (테마, 언어)', 'Context'],
                ['자주 바뀌고 여러 곳에서 쓰나? (장바구니 초안, 편집기)', '**Zustand** (큰 팀이면 Redux Toolkit)'],
                ['다른 값으로 계산할 수 있나?', '**state로 두지 않음** — 렌더링 중 계산'],
              ],
            },
            { type: 'say', text: '7장 끝! 이제 "서버 상태 관리 라이브러리 써 보셨어요?"라는 질문에 **왜 필요한지부터** 답할 수 있어요. 다음 8장은 TypeScript 실전이에요. 마지막 확인 문제 가요.' },
          ],
        },
      ],
    },
  ],
  questions: [
    {
      id: 're07-6-q1',
      source: '서버 컴포넌트가 있는데 왜 필요해요?',
      type: 'mcq',
      question: 'Next.js에서도 TanStack Query를 함께 쓰는 것이 유리한 경우는?',
      choices: ['한 번 그리면 끝인 강의 소개 페이지', '무한 스크롤·폴링·낙관적 업데이트처럼 브라우저에서 계속 바뀌는 데이터', '이용약관 페이지', 'SEO만 중요한 정적 페이지'],
      answer: 1,
      explanation: '읽기만 하는 화면은 서버 컴포넌트로 충분하고, 브라우저에서 살아 움직이는 서버 데이터는 TanStack Query가 강해요.',
    },
    {
      id: 're07-6-q2',
      source: 'Provider 설정',
      type: 'ox',
      question: 'Next.js에서 QueryClient를 모듈 맨 바깥에 const queryClient = new QueryClient()로 하나만 만들어 써도 사용자끼리 데이터가 섞일 걱정은 없다.',
      answer: false,
      explanation: '서버에서는 모든 요청이 모듈 전역을 공유해요. Provider 안에서 useState(() => new QueryClient())로 사용자마다 만들어요.',
    },
    {
      id: 're07-6-q3',
      source: 'Provider 설정',
      type: 'mcq',
      question: 'SSR과 함께 쓸 때 staleTime을 0보다 크게 두는 이유는?',
      choices: ['캐시를 지우려고', '서버에서 가져온 데이터를 하이드레이션 직후 바로 또 요청하지 않게 하려고', '에러를 숨기려고', '빌드를 빠르게 하려고'],
      answer: 1,
      explanation: 'staleTime 0이면 받자마자 오래된 것으로 봐서 브라우저에서 즉시 재요청해요.',
    },
    {
      id: 're07-6-q4',
      source: '서버에서 미리 가져와 넘겨주기',
      type: 'mcq',
      question: '서버에서 prefetchQuery로 채운 캐시를 클라이언트 컴포넌트에 넘겨주는 컴포넌트는?',
      choices: ['QueryClientProvider', 'HydrationBoundary', 'Suspense', 'ErrorBoundary'],
      answer: 1,
      explanation: 'dehydrate(queryClient)로 직렬화한 캐시를 HydrationBoundary의 state로 넘기면, 안의 useQuery가 로딩 없이 바로 써요.',
    },
    {
      id: 're07-6-q5',
      source: '서버에서 미리 가져와 넘겨주기',
      type: 'ox',
      question: "서버에서 ['courses'], 클라이언트에서 ['course'] 로 키가 조금 달라도 미리 가져온 데이터를 그대로 쓴다.",
      answer: false,
      explanation: '키가 다르면 다른 데이터로 봐서 다시 요청해요. query key factory로 키를 한 곳에서 만들어요.',
    },
    {
      id: 're07-6-q6',
      source: '정리: 상태의 집 지도',
      type: 'mcq',
      question: '"강의 목록 정렬 기준(새로고침·공유해도 유지)"의 집으로 알맞은 것은?',
      choices: ['useState', 'URL 검색 파라미터', 'Zustand', 'TanStack Query'],
      answer: 1,
      explanation: '공유·새로고침에도 유지돼야 하는 화면 상태는 URL에 둬요.',
    },
    {
      id: 're07-6-q7',
      source: '정리: 상태의 집 지도',
      type: 'essay',
      question: '[면접] 상태를 어떤 기준으로 나눠서 관리하시나요?',
      answer: '먼저 다른 값으로 계산할 수 있으면 상태로 두지 않습니다. 한 컴포넌트만 쓰면 useState나 useReducer, 새로고침이나 공유에도 유지돼야 하는 필터·정렬·페이지는 URL에 둡니다. 주인이 서버인 데이터는 서버 상태로 보고, 읽기 전용이면 서버 컴포넌트에서 가져오고 브라우저에서 갱신·무한 스크롤·낙관적 업데이트가 필요하면 TanStack Query로 캐시와 동기화를 맡깁니다. 여러 곳에서 쓰는 클라이언트 상태는 가끔 바뀌면 Context, 자주 바뀌면 선택 구독이 되는 Zustand를 씁니다. 서버 데이터를 전역 저장소에 복사하지 않는 것이 원칙입니다.',
      keywords: ['계산 가능한 값은 상태 아님', 'URL', '서버 상태 vs 클라이언트 상태', 'TanStack Query', 'Zustand', 'Context'],
      explanation: '"주인이 누구인가 / 누가 쓰나 / 유지돼야 하나"의 질문으로 집을 고르는 흐름을 말하면 시니어다운 답이에요.',
    },
  ],
}

export default topic
