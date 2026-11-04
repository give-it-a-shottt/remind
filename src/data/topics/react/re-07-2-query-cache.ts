import type { Topic } from '../../types'

const topic: Topic = {
  id: 're-07-2-query-cache',
  track: 'react',
  group: '07. 서버 상태와 클라이언트 상태',
  title: '7-2. 캐시와 신선도: staleTime·gcTime·queryKey',
  order: 702,
  addedAt: '2026-11-05',
  sections: [
    {
      title: 'staleTime: 언제까지 신선할까',
      slides: [
        {
          title: '신선함과 오래됨',
          blocks: [
            { type: 'say', text: 'TanStack Query를 쓰다 보면 "왜 이렇게 요청이 많이 나가지?" 하는 순간이 와요. 이번 수업은 **캐시가 언제 쓰이고 언제 새로 가져오는지** 정확히 알아볼게요.\n\n캐시된 데이터는 두 상태 중 하나예요.\n• **fresh(신선함)**: 믿고 그대로 써요. 요청 안 보내요\n• **stale(오래됨)**: 일단 보여 주긴 하지만, 기회가 되면 **뒤에서 새로 가져와요**' },
            { type: 'say', text: '**staleTime**은 "받아 온 뒤 몇 ms 동안 신선한가"예요. 그런데 기본값이 **0**이에요. 받자마자 오래된 것으로 봐요.' },
            { type: 'ask', q: 'staleTime이 0이면 어떤 일이 생길까요?', a: '같은 데이터를 쓰는 컴포넌트가 새로 마운트되거나, 다른 탭에 갔다가 창으로 돌아오거나, 인터넷이 다시 연결될 때마다 **뒤에서 다시 요청**해요. 화면에는 캐시가 바로 보이니 사용자는 모르지만, 네트워크 탭을 보면 요청이 꽤 많아요.' },
          ],
        },
        {
          title: '데이터 성격에 맞게 정해요',
          blocks: [
            {
              type: 'code',
              code: `useQuery({
  queryKey: ['categories'],
  queryFn: getCategories,
  staleTime: 1000 * 60 * 60,      // 카테고리 목록은 1시간 동안 신선 (거의 안 바뀜)
});

useQuery({
  queryKey: ['notifications'],
  queryFn: getNotifications,
  staleTime: 0,                   // 알림은 항상 최신이 중요 (기본값)
});`,
            },
            {
              type: 'table',
              head: ['데이터', 'staleTime 감각'],
              rows: [
                ['카테고리, 설정값', '길게 (분~시간)'],
                ['강의 목록', '중간 (수십 초~몇 분)'],
                ['알림, 재고, 실시간 가격', '짧게 (0~몇 초)'],
              ],
            },
            { type: 'note', tone: 'tip', text: '앱 전체 기본값을 바꾸려면 `new QueryClient({ defaultOptions: { queries: { staleTime: 60_000 } } })`처럼 해요. 실무에서는 0 대신 수십 초 정도를 기본으로 두는 팀이 많아요.' },
          ],
        },
      ],
    },
    {
      title: 'gcTime: 언제 지울까',
      slides: [
        {
          title: '아무도 안 쓰는 캐시',
          blocks: [
            { type: 'say', text: '두 번째 시간은 **gcTime**(garbage collection time)이에요. "**아무 컴포넌트도 이 데이터를 안 쓰게 된 뒤** 얼마나 캐시에 남겨 둘까"예요. 기본값은 **5분**이에요.' },
            { type: 'list', ordered: true, items: ['강의 목록 페이지 → `[\'courses\']` 캐시 생김', '상세 페이지로 이동 → 목록을 쓰는 컴포넌트가 없음 → 5분 타이머 시작', '3분 뒤 목록으로 돌아옴 → **캐시가 남아 있어서 즉시 보임** (그리고 오래됐으면 뒤에서 새로 가져옴)', '10분 동안 안 돌아옴 → 캐시 삭제 → 다음엔 처음부터 로딩'] },
          ],
        },
        {
          title: '두 시간을 헷갈리지 마세요',
          blocks: [
            {
              type: 'table',
              head: ['', 'staleTime', 'gcTime'],
              rows: [
                ['질문', '"이 데이터 믿어도 돼?"', '"이 데이터 아직 갖고 있어?"'],
                ['기본값', '0', '5분'],
                ['지나면', '오래됨 표시 → 기회 되면 뒤에서 새로 요청', '캐시에서 **삭제**'],
                ['적용 시점', '받아 온 순간부터', '아무도 안 쓰게 된 순간부터'],
              ],
            },
            { type: 'note', tone: 'analogy', text: '냉장고 음식으로 보면 staleTime은 "**맛있게 먹을 수 있는 기간**"이에요. 지나도 먹을 수는 있지만 새로 사 오는 게 좋죠. gcTime은 "**아무도 안 먹으면 버리는 기한**"이에요.' },
            { type: 'note', tone: 'warn', text: 'v4까지는 gcTime 이름이 `cacheTime`이었어요. 블로그에서 cacheTime을 보면 같은 거예요. 또 v5에서 로딩 상태 이름도 `isLoading` → `isPending`으로 바뀌었어요.' },
          ],
        },
      ],
    },
    {
      title: 'queryKey 설계',
      slides: [
        {
          title: '키는 배열, 바뀌는 값은 다 넣기',
          blocks: [
            { type: 'say', text: 'queryKey는 **배열**이에요. 쿼리 결과가 달라지게 만드는 값은 **전부** 키에 넣어요.' },
            {
              type: 'code',
              code: `function useCourses(category: string, page: number) {
  return useQuery({
    queryKey: ['courses', { category, page }],      // ← category, page 모두 키에
    queryFn: () => api<Course[]>(\`/api/courses?category=\${category}&page=\${page}\`),
  });
}`,
            },
            { type: 'ask', q: "queryKey를 ['courses']로만 두고 queryFn에서 category를 쓰면 어떻게 될까요?", a: "카테고리를 react에서 python으로 바꿔도 키가 똑같아서, TanStack Query는 \"같은 데이터네\" 하고 **react 강의 캐시를 그대로** 보여 줘요. 4-2의 \"deps를 빼먹으면 예전 값을 본다\"와 같은 버그예요. queryKey는 useEffect의 deps 같은 거예요." },
          ],
        },
        {
          title: '계층으로 짜면 무효화가 쉬워요',
          blocks: [
            {
              type: 'code',
              code: `['courses']                                // 강의 전체
['courses', { category: 'react', page: 1 }] // 목록
['courses', 7]                              // 강의 7 상세
['courses', 7, 'reviews']                   // 강의 7의 수강평`,
            },
            { type: 'say', text: '이렇게 **큰 것 → 작은 것** 순서로 짜 두면, 다음 수업에서 배울 무효화를 `[\'courses\']` 하나로 강의 관련 캐시 **전부**에 할 수 있어요. 앞부분이 같은 키는 모두 해당되거든요.' },
            { type: 'note', tone: 'tip', text: '규모가 커지면 키를 한 파일에 모아 둬요. `export const courseKeys = { all: [\'courses\'] as const, detail: (id: number) => [\'courses\', id] as const }` 같은 식으로요(**query key factory**). 키 오타가 사라져요.' },
          ],
        },
      ],
    },
    {
      title: '의존 쿼리와 페이지네이션',
      slides: [
        {
          title: 'enabled: 준비되면 가져오기',
          blocks: [
            { type: 'say', text: '"내 정보를 먼저 가져온 뒤, 그 사람의 수강 목록을 가져온다"처럼 앞 결과가 있어야 다음을 가져올 수 있을 때는 **enabled**를 써요.' },
            {
              type: 'code',
              code: `const { data: me } = useQuery({ queryKey: ['me'], queryFn: getMe });

const { data: enrollments } = useQuery({
  queryKey: ['enrollments', me?.id],
  queryFn: () => getEnrollments(me!.id),
  enabled: !!me,           // me가 생기기 전에는 실행하지 않음
});`,
            },
            { type: 'note', tone: 'warn', text: '이건 어쩔 수 없는 **폭포수**(6-5)예요. 서로 상관없는 쿼리까지 enabled로 줄 세우지 마세요. 상관없는 건 그냥 나란히 쓰면 **동시에** 출발해요.' },
          ],
        },
        {
          title: '페이지를 넘길 때 깜빡임 없애기',
          blocks: [
            { type: 'say', text: '2페이지 버튼을 누르면 queryKey가 `[\'courses\', { page: 2 }]`로 바뀌어요. 처음 보는 키라 캐시가 없으니 `isPending`이 되고 화면이 "불러오는 중..."으로 **깜빡**여요.' },
            {
              type: 'code',
              code: `import { keepPreviousData, useQuery } from '@tanstack/react-query';

const { data, isPlaceholderData } = useQuery({
  queryKey: ['courses', { page }],
  queryFn: () => getCourses(page),
  placeholderData: keepPreviousData,     // 새 페이지가 올 때까지 이전 페이지를 계속 보여 줌
});

<button disabled={isPlaceholderData}>다음 페이지</button>`,
            },
            { type: 'say', text: '`placeholderData: keepPreviousData`를 주면 새 데이터가 올 때까지 **이전 페이지를 계속 보여 줘요.** 깜빡임 없이 자연스럽게 바뀌죠. 끝없이 내리는 무한 스크롤은 `useInfiniteQuery`를 써요.\n\n수업 끝! 확인 문제 가요.' },
          ],
        },
      ],
    },
  ],
  questions: [
    {
      id: 're07-2-q1',
      source: 'staleTime: 언제까지 신선할까',
      type: 'mcq',
      question: 'TanStack Query의 staleTime 기본값과 그 의미는?',
      choices: ['5분, 5분 뒤 삭제', '0, 받자마자 오래된 것으로 보고 기회가 되면 뒤에서 새로 가져옴', '무한, 절대 다시 안 가져옴', '1초, 1초마다 새로고침'],
      answer: 1,
      explanation: '기본 staleTime은 0이라 곧바로 stale이 돼요. 마운트·창 포커스·재연결 때 뒤에서 다시 요청해요.',
    },
    {
      id: 're07-2-q2',
      source: 'staleTime: 언제까지 신선할까',
      type: 'mcq',
      question: '거의 바뀌지 않는 카테고리 목록 쿼리에 알맞은 설정은?',
      choices: ['staleTime: 0', 'staleTime을 1시간 정도로 길게', 'gcTime: 0', 'retry: 100'],
      answer: 1,
      explanation: '잘 안 바뀌는 데이터는 staleTime을 길게 둬서 불필요한 재요청을 줄여요.',
    },
    {
      id: 're07-2-q3',
      source: 'gcTime: 언제 지울까',
      type: 'mcq',
      question: 'gcTime(기본 5분)이 세기 시작하는 때는?',
      choices: ['데이터를 받아 온 순간', '그 쿼리를 쓰는 컴포넌트가 하나도 없게 된 순간', '앱을 켠 순간', '에러가 난 순간'],
      answer: 1,
      explanation: 'gcTime은 아무도 안 쓰게 된 캐시를 얼마나 남길지예요. staleTime은 받아 온 순간부터 세요.',
    },
    {
      id: 're07-2-q4',
      source: 'gcTime: 언제 지울까',
      type: 'short',
      question: 'TanStack Query v4까지 gcTime의 옛 이름은? (영문 camelCase)',
      answer: ['cacheTime'],
      explanation: 'v5에서 cacheTime → gcTime, isLoading → isPending으로 이름이 바뀌었어요.',
    },
    {
      id: 're07-2-q5',
      source: 'queryKey 설계',
      type: 'mcq',
      question: '카테고리별 강의 목록 쿼리의 queryKey로 알맞은 것은?',
      choices: ["['courses']", "['courses', { category }]", "['react']", '[]'],
      answer: 1,
      explanation: '결과를 바꾸는 값(category)은 키에 꼭 넣어요. 빠뜨리면 카테고리를 바꿔도 예전 캐시가 보여요.',
    },
    {
      id: 're07-2-q6',
      source: 'queryKey 설계',
      type: 'ox',
      question: "queryKey를 ['courses', ...] 처럼 계층으로 짜 두면 ['courses'] 하나로 강의 관련 캐시를 한꺼번에 무효화할 수 있다.",
      answer: true,
      explanation: '앞부분이 같은 키는 모두 해당돼요. 그래서 큰 것 → 작은 것 순서로 키를 설계해요.',
    },
    {
      id: 're07-2-q7',
      source: '의존 쿼리와 페이지네이션',
      type: 'mcq',
      question: '내 정보(me)를 받은 뒤에만 수강 목록 쿼리를 실행하고 싶다. 쓰는 옵션은?',
      choices: ['staleTime', 'enabled: !!me', 'gcTime', 'retry: 0'],
      answer: 1,
      explanation: 'enabled가 false인 동안은 쿼리가 실행되지 않아요. 상관없는 쿼리까지 이렇게 줄 세우지는 않아요.',
    },
    {
      id: 're07-2-q8',
      source: '의존 쿼리와 페이지네이션',
      type: 'mcq',
      question: '페이지를 넘길 때 "불러오는 중"으로 깜빡이지 않고 이전 페이지를 유지하는 옵션은?',
      choices: ['placeholderData: keepPreviousData', 'enabled: false', 'staleTime: 0', 'refetchOnWindowFocus: true'],
      answer: 0,
      explanation: '새 페이지 데이터가 올 때까지 이전 데이터를 보여 줘요. isPlaceholderData로 그 상태인지 알 수 있어요.',
    },
  ],
}

export default topic
