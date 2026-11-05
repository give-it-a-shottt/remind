import type { Topic } from '../../types'

const topic: Topic = {
  id: 're-07-1-tanstack-query',
  track: 'react',
  group: '07. 서버 상태와 클라이언트 상태',
  title: '7-1. 서버 상태와 TanStack Query 시작',
  order: 701,
  addedAt: '2026-11-05',
  sections: [
    {
      title: '서버 상태는 왜 다를까',
      slides: [
        {
          title: '내 것이 아닌 데이터',
          blocks: [
            { type: 'say', text: '7장은 채용 공고 단골, "**TanStack Query 등 서버 상태 관리 라이브러리를 실무에서 활용해본 경험**"이에요.\n\n3-1에서 상태를 종류별로 나눴죠. 그중 **서버 상태**(강의 목록, 내 주문 내역)는 다른 상태와 근본적으로 달라요. **진짜 주인이 서버**라는 거예요. 브라우저에 있는 건 그 순간 찍어 온 **사진(복사본)** 일 뿐이에요.' },
            { type: 'say', text: '사진이니까 이런 문제가 따라와요.\n• 다른 사람이 서버 데이터를 바꾸면 내 사진은 **오래된 것**이 돼요\n• 여러 컴포넌트가 같은 데이터를 원하면 **같은 요청이 여러 번** 나가요\n• 가져오는 동안 **로딩**, 실패하면 **에러**, 다시 시도하면 **재시도**를 다 처리해야 해요\n• 다른 페이지 갔다 오면 또 가져와야 할까? **캐시**는 얼마나 둘까?' },
          ],
        },
        {
          title: 'useEffect로 직접 하면',
          blocks: [
            {
              type: 'code',
              code: `function CourseList() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let ignore = false;                                  // 4-2 경쟁 상태 처리
    setLoading(true);
    api<Course[]>('/api/courses')
      .then((data) => { if (!ignore) setCourses(data); })
      .catch((e) => { if (!ignore) setError(e); })
      .finally(() => { if (!ignore) setLoading(false); });
    return () => { ignore = true; };
  }, []);
  // ... 그리고 캐시도, 재시도도, 다른 컴포넌트와 공유도 안 됨
}`,
            },
            { type: 'say', text: '데이터 하나 가져오는 데 이만큼이에요. 그런데도 캐시·중복 제거·재시도·오래된 데이터 갱신은 **하나도 없어요.** 화면마다 이걸 반복하면 버그가 생길 수밖에 없죠. 이걸 대신해 주는 게 **TanStack Query**예요(예전 이름: React Query).' },
          ],
        },
      ],
    },
    {
      title: 'useQuery 기본',
      slides: [
        {
          title: '같은 일을 세 줄로',
          blocks: [
            {
              type: 'code',
              code: `import { useQuery } from '@tanstack/react-query';

function CourseList() {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['courses'],                          // 이 데이터의 이름표 (캐시 키)
    queryFn: () => api<Course[]>('/api/courses'),   // 가져오는 방법 (Promise를 돌려주면 됨)
  });

  if (isPending) return <p>불러오는 중...</p>;
  if (isError) return <p>에러: {error.message}</p>;
  return <ul>{data.map((c) => <li key={c.id}>{c.title}</li>)}</ul>;
}`,
            },
            {
              type: 'list',
              items: [
                '`queryKey` → 이 데이터의 **이름표**. TanStack Query는 이 이름으로 캐시에 저장해요',
                '`queryFn` → 데이터를 가져오는 함수. Promise만 돌려주면 fetch든 axios든 상관없어요',
                '`isPending` → 아직 데이터가 한 번도 없음 / `isError` → 실패 / `data` → 결과',
              ],
            },
            { type: 'note', tone: 'warn', text: '`queryFn`이 에러를 **던져야** isError가 돼요. 5-3에서 배운 대로 fetch는 404를 에러로 안 보니까, `res.ok`를 확인해서 throw 하는 `api()` 같은 함수를 써야 해요.' },
          ],
        },
        {
          title: '시작하려면 Provider 하나',
          blocks: [
            {
              type: 'code',
              code: `import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();   // 캐시 저장소

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>,
);`,
            },
            { type: 'say', text: '`QueryClient`가 **모든 서버 데이터의 캐시 저장소**예요. Provider로 앱을 감싸면 어느 컴포넌트에서든 useQuery를 쓸 수 있어요. 4-5의 Context와 같은 방식이에요.' },
            { type: 'note', tone: 'tip', text: '`@tanstack/react-query-devtools`를 설치하면 화면 구석에 버튼이 생기고, 지금 캐시에 어떤 queryKey가 있는지, 신선한지 오래됐는지 눈으로 볼 수 있어요. 처음 배울 때 꼭 켜 두세요.' },
          ],
        },
      ],
    },
    {
      title: '저절로 생기는 것들',
      slides: [
        {
          title: '공짜로 얻는 기능',
          blocks: [
            { type: 'say', text: 'useQuery 몇 줄로 이런 게 **기본으로** 따라와요.' },
            {
              type: 'table',
              head: ['기능', '뜻'],
              rows: [
                ['**캐시**', '같은 queryKey를 다시 쓰면 저장해 둔 데이터를 바로 보여 줌'],
                ['**중복 제거**', '헤더와 사이드바가 동시에 `[\'me\']`를 요청해도 실제 요청은 **한 번**'],
                ['**자동 재시도**', '실패하면 조용히 **3번** 다시 시도 (간격을 점점 늘려서)'],
                ['**백그라운드 갱신**', '창으로 다시 돌아오거나 인터넷이 다시 연결되면 오래된 데이터를 뒤에서 새로 가져옴'],
                ['**경쟁 상태 처리**', '4-2에서 직접 짰던 ignore 처리를 알아서'],
              ],
            },
          ],
        },
        {
          title: '중복 제거를 느껴 보기',
          blocks: [
            {
              type: 'code',
              code: `function useMe() {
  return useQuery({ queryKey: ['me'], queryFn: () => api<User>('/api/me') });
}

function Header() { const { data } = useMe(); return <span>{data?.name}</span>; }
function Sidebar() { const { data } = useMe(); return <img src={data?.avatar} />; }
// 둘이 동시에 마운트돼도 /api/me 요청은 한 번`,
            },
            { type: 'say', text: '4-4에서 "커스텀 훅은 로직을 공유하지 **상태를 공유하진 않는다**"고 했죠? 그런데 TanStack Query를 쓰면 `useMe()`를 부르는 모든 곳이 **같은 캐시를 봐요.** 상태는 QueryClient에 하나만 있고, 컴포넌트들은 그걸 구독하는 거예요. 그래서 props 드릴링도, Context도 필요 없어요.' },
            { type: 'note', tone: 'tip', text: '실무 패턴: `useQuery`를 컴포넌트에 바로 쓰지 말고 `useCourses()`, `useMe()` 같은 **커스텀 훅으로 감싸요.** queryKey와 queryFn이 한 곳에 모여서 오타로 키가 어긋나는 일이 없어요.' },
          ],
        },
      ],
    },
    {
      title: '서버 상태와 클라이언트 상태 나누기',
      slides: [
        {
          title: '서버 데이터를 useState·Zustand에 복사하지 마세요',
          blocks: [
            { type: 'code', code: `// ❌ 흔한 실수: 서버 데이터를 받아서 전역 저장소에 또 복사
const { data } = useQuery({ queryKey: ['cart'], queryFn: getCart });
useEffect(() => { if (data) useCartStore.setState({ items: data }); }, [data]);` },
            { type: 'ask', q: '이렇게 하면 무엇이 문제일까요?', a: '같은 데이터가 **두 군데**(TanStack Query 캐시, Zustand)에 생겨요. 서버에서 다시 가져와도 Zustand 쪽은 옛날 값일 수 있고, Zustand를 고쳐도 서버는 몰라요. 3-1의 "진짜 데이터는 한 곳에만"이 깨진 거예요. 4-2의 "effect 남용" 패턴이기도 하고요.' },
            {
              type: 'table',
              head: ['종류', '주인', '도구'],
              rows: [
                ['서버 상태 (강의, 장바구니 내역, 내 정보)', '서버', '**TanStack Query** — 캐시가 곧 저장소'],
                ['클라이언트 상태 (모달 열림, 필터 UI, 편집 중인 초안)', '브라우저', 'useState, **Zustand**'],
              ],
            },
            { type: 'say', text: '이 구분이 7장의 뼈대예요. 7-1~7-3은 TanStack Query, 7-4~7-5는 Zustand, 7-6은 Next.js와 함께 쓰는 법이에요. 확인 문제 가요.' },
          ],
        },
      ],
    },
  ],
  questions: [
    {
      id: 're07-1-q1',
      source: '서버 상태는 왜 다를까',
      type: 'mcq',
      question: '서버 상태가 클라이언트 상태와 근본적으로 다른 점은?',
      choices: ['숫자만 담을 수 있다', '진짜 주인이 서버라, 브라우저의 값은 언제든 오래된 복사본이 될 수 있다', '항상 localStorage에 있다', 'useState로만 다룰 수 있다'],
      answer: 1,
      explanation: '서버 데이터는 다른 사람이 바꿀 수 있어서 내 화면의 값은 그 순간의 사진이에요. 그래서 캐시·갱신·재시도 같은 처리가 필요해요.',
    },
    {
      id: 're07-1-q2',
      source: 'useQuery 기본',
      type: 'mcq',
      question: 'useQuery의 queryKey가 하는 일은?',
      choices: ['API 주소를 정한다', '이 데이터의 이름표로, 캐시에 저장하고 찾을 때 쓰는 키', '요청 횟수를 정한다', 'CSS 클래스 이름'],
      answer: 1,
      explanation: '같은 queryKey를 쓰는 곳은 같은 캐시를 봐요. 그래서 키 설계가 중요해요(7-2).',
    },
    {
      id: 're07-1-q3',
      source: 'useQuery 기본',
      type: 'ox',
      question: 'queryFn 안에서 fetch로 404를 받았는데 res.ok를 확인하지 않으면, useQuery는 isError가 된다.',
      answer: false,
      explanation: 'queryFn이 에러를 던져야 isError가 돼요. fetch는 404를 에러로 안 보니 res.ok를 확인해서 throw 해야 해요.',
    },
    {
      id: 're07-1-q4',
      source: 'useQuery 기본',
      type: 'short',
      question: 'TanStack Query의 캐시 저장소를 앱에 제공하는 Provider 컴포넌트 이름은?',
      answer: ['QueryClientProvider'],
      explanation: 'new QueryClient()로 만든 저장소를 QueryClientProvider로 감싸서 넘겨요.',
    },
    {
      id: 're07-1-q5',
      source: '저절로 생기는 것들',
      type: 'mcq',
      question: 'Header와 Sidebar가 동시에 같은 queryKey ["me"]로 useQuery를 부르면 실제 /api/me 요청 수는?',
      choices: ['0번', '1번', '2번', '컴포넌트 수 × 3번'],
      answer: 1,
      explanation: '같은 키의 요청은 중복 제거돼서 한 번만 나가고, 두 컴포넌트가 같은 캐시를 봐요.',
    },
    {
      id: 're07-1-q6',
      source: '저절로 생기는 것들',
      type: 'mcq',
      question: 'TanStack Query v5에서 실패한 쿼리의 기본 동작은?',
      choices: ['바로 에러를 보여 준다', '조용히 3번 다시 시도한 뒤 에러가 된다', '무한히 다시 시도한다', '앱을 새로고침한다'],
      answer: 1,
      explanation: '기본 retry는 3번이고 간격을 점점 늘려요(지수 백오프). 옵션으로 바꿀 수 있어요.',
    },
    {
      id: 're07-1-q7',
      source: '서버 상태와 클라이언트 상태 나누기',
      type: 'ox',
      question: 'useQuery로 받은 장바구니 데이터를 useEffect로 Zustand 저장소에 다시 복사해 두는 것이 좋은 패턴이다.',
      answer: false,
      explanation: '같은 데이터가 두 군데 생겨 어긋나요. 서버 상태는 TanStack Query 캐시가 곧 저장소예요. Zustand에는 클라이언트 상태만 둬요.',
    },
    {
      id: 're07-1-q8',
      source: '서버 상태와 클라이언트 상태 나누기',
      type: 'mcq',
      question: '다음 중 TanStack Query로 다루기에 가장 알맞은 것은?',
      choices: ['모달 열림 여부', '다크 모드 토글', '서버에서 가져오는 내 주문 내역', '입력 중인 검색어'],
      answer: 2,
      explanation: '주인이 서버인 데이터가 서버 상태예요. 나머지는 브라우저가 주인인 클라이언트 상태예요.',
    },
  ],
}

export default topic
