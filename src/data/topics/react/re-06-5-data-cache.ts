import type { Topic } from '../../types'

const topic: Topic = {
  id: 're-06-5-data-cache',
  track: 'react',
  group: '06. 렌더링 전략과 Next.js',
  title: '6-5. 데이터 가져오기와 캐시',
  order: 605,
  addedAt: '2026-11-05',
  sections: [
    {
      title: '서버 컴포넌트에서 데이터 가져오기',
      slides: [
        {
          title: 'useEffect가 사라졌어요',
          blocks: [
            { type: 'say', text: '4-2에서 useEffect로 데이터를 가져올 때 고생했던 것들 기억나요? 빈 화면 → 로딩 → 데이터, 경쟁 상태, 클린업…\n\n서버 컴포넌트에서는 이렇게 끝나요.' },
            {
              type: 'code',
              code: `// app/courses/[id]/page.tsx
export default async function CoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await fetch(\`\${process.env.API_URL}/courses/\${id}\`);
  if (!res.ok) notFound();                 // 5-3: res.ok 확인은 여전히 필수
  const course: Course = await res.json();
  return <h1>{course.title}</h1>;
}`,
            },
            {
              type: 'list',
              items: [
                '**useState·useEffect 없음**: 서버에서 다 가져온 뒤 HTML을 만들어요',
                '**CORS 없음**: Next.js 서버 → FastAPI 서버, 서버끼리 통신이라서요 (5-4)',
                '**비밀키 OK**: `process.env.API_URL`이나 토큰이 브라우저로 안 가요 (6-4)',
                '**경쟁 상태 없음**: 요청 하나에 한 번 실행되고 끝이에요',
              ],
            },
          ],
        },
        {
          title: '폭포수를 조심하세요',
          blocks: [
            { type: 'code', code: `const course = await getCourse(id);       // 1초
const reviews = await getReviews(id);     // 그다음 1초
const related = await getRelated(id);     // 그다음 1초   → 총 3초` },
            { type: 'say', text: '서로 상관없는 요청을 줄줄이 await하면 하나가 끝나야 다음이 출발해요. 이렇게 계단처럼 기다리는 걸 **폭포수(waterfall)** 라고 해요. 2-2에서 배운 **Promise.all**로 동시에 출발시켜요.' },
            { type: 'code', code: `const [course, reviews, related] = await Promise.all([
  getCourse(id), getReviews(id), getRelated(id),
]);   // 동시에 출발 → 총 1초` },
            { type: 'note', tone: 'tip', text: '같은 데이터를 layout과 page 양쪽에서 쓴다면? 함수를 `React.cache(getUser)`로 감싸 두면 **한 번의 요청 안에서는** 여러 번 불러도 실제 조회는 한 번만 해요. 매번 props로 넘길 필요가 없어요.' },
          ],
        },
      ],
    },
    {
      title: 'Suspense로 스트리밍',
      slides: [
        {
          title: '느린 부분 때문에 전체를 기다릴 필요는 없어요',
          blocks: [
            { type: 'say', text: '강의 상세 페이지에서 강의 정보는 0.1초, "추천 강의"는 3초 걸린다고 해 볼게요. 페이지 전체를 3초 기다렸다 보여 주면 너무 느리죠.' },
            {
              type: 'code',
              code: `export default async function CoursePage({ params }) {
  const { id } = await params;
  const course = await getCourse(id);          // 빠름
  return (
    <>
      <h1>{course.title}</h1>
      <Suspense fallback={<p>추천 강의 불러오는 중...</p>}>
        <Recommended courseId={id} />          {/* 느림: 따로 기다림 */}
      </Suspense>
    </>
  );
}

async function Recommended({ courseId }) {
  const list = await getRecommended(courseId); // 3초
  return <ul>{list.map((c) => <li key={c.id}>{c.title}</li>)}</ul>;
}`,
            },
          ],
        },
        {
          title: '조각조각 흘려보내기',
          blocks: [
            { type: 'say', text: '이렇게 하면 서버는 **준비된 부분(제목 + "불러오는 중")을 먼저 보내고**, 3초 뒤 추천 강의가 준비되면 **그 조각을 이어서 보내요.** 같은 응답 안에서 HTML을 조금씩 흘려보내는 이걸 **스트리밍**이라고 해요.' },
            { type: 'note', tone: 'analogy', text: '코스 요리예요. 메인 요리가 오래 걸린다고 식전 빵과 수프까지 안 내주고 기다리게 하지 않죠. 준비된 것부터 차례로 내요.' },
            { type: 'say', text: '6-3의 `loading.tsx`는 이걸 **페이지 단위로** 자동으로 해 주는 파일이에요. 페이지 전체를 Suspense로 감싸 주는 거죠. 더 잘게 나누고 싶으면 이렇게 직접 Suspense를 둬요. 그리고 6-2에서 배운 대로 **Suspense 구역마다 따로 하이드레이션**돼요.' },
            { type: 'note', tone: 'warn', text: 'Cache Components가 켜진 Next.js 16에서는 **캐시하지 않은 데이터를 기다리는 컴포넌트는 Suspense(또는 loading.tsx) 안에 있어야** 해요. 이 수업 첫 예제처럼 page 맨 위에서 바로 await한다면 그 폴더에 `loading.tsx`를 같이 두세요. 안 그러면 개발 화면이 "blocking route" 안내를 띄워요. 이유는 다음 다음 개념(PPR)에서 나와요.' },
          ],
        },
      ],
    },
    {
      title: '캐시는 직접 켜요: use cache',
      slides: [
        {
          title: 'Next.js 캐시의 역사',
          blocks: [
            { type: 'say', text: 'Next.js 캐시는 버전마다 크게 바뀌어서 블로그 글마다 말이 달라요. 한 번 정리해 줄게요.' },
            {
              type: 'table',
              head: ['버전', 'fetch 기본 동작', '한 줄'],
              rows: [
                ['14', '**자동으로 캐시**', '"왜 데이터가 안 바뀌죠?" 질문이 쏟아짐'],
                ['15', '**캐시 안 함**이 기본으로 바뀜', '필요하면 직접 캐시 옵션'],
                ['16', '**Cache Components**: 캐시는 `\'use cache\'`로 **직접 켜는 것**', '아무것도 안 하면 요청마다 실행'],
              ],
            },
            { type: 'say', text: '16의 원칙은 단순해요. **"캐시는 명시적으로."** 아무것도 안 쓰면 매 요청마다 새로 가져와요. 캐시하고 싶은 함수나 컴포넌트에 `\'use cache\'`를 붙여요. 지금 `create-next-app`으로 새 프로젝트를 만들면 Cache Components가 켜진 상태로 시작해요.' },
          ],
        },
        {
          title: "'use cache'와 cacheLife",
          blocks: [
            {
              type: 'code',
              code: `import { cacheLife } from 'next/cache';

// 데이터 함수 단위로
export async function getCourses() {
  'use cache';
  cacheLife('hours');          // 몇 시간 동안 재사용
  return db.course.findMany();
}

// 컴포넌트 단위로도
async function PopularCourses() {
  'use cache';
  cacheLife('hours');
  const list = await getPopular();
  return <ul>{list.map((c) => <li key={c.id}>{c.title}</li>)}</ul>;
}`,
            },
            {
              type: 'list',
              items: [
                "`'use cache'` → 이 함수(컴포넌트)의 결과를 **저장해 두고 재사용**해요",
                '함수에 넘긴 **인자가 자동으로 캐시 키**가 돼요. `getCourse(7)`과 `getCourse(8)`은 따로 저장돼요',
                "`cacheLife('hours')` → 얼마나 오래 쓸지. 공식 문서는 `'use cache'`마다 cacheLife를 같이 쓰라고 권해요",
              ],
            },
            { type: 'note', tone: 'warn', text: '로그인 사용자마다 다른 데이터를 아무 생각 없이 `\'use cache\'` 하면 **다른 사람에게 내 데이터가 보일 수** 있어요. 캐시는 "모두에게 같은 결과"에 쓰는 게 기본이에요. 사용자별 값은 인자로 넘겨서 키를 나누거나 캐시하지 않아요.' },
          ],
        },
      ],
    },
    {
      title: 'PPR: 정적 껍데기 + 스트리밍',
      slides: [
        {
          title: '6-1에서 말한 "한 페이지 안에서 섞기"',
          blocks: [
            { type: 'say', text: '이제 6-1의 **PPR(부분 사전 렌더링)** 을 코드로 볼 수 있어요. Next.js 16은 빌드할 때 페이지를 미리 그려 보면서 각 부분을 이렇게 처리해요.' },
            {
              type: 'table',
              head: ['부분', '처리', '결과'],
              rows: [
                ['고정된 내용 (헤더, 메뉴)', '빌드 때 그냥 그려짐', '정적 껍데기에 포함'],
                ["`'use cache'` 붙은 부분", '캐시된 결과를 그려 둠', '정적 껍데기에 포함'],
                ['Suspense 안의 캐시 안 한 데이터, `cookies()` 등', 'fallback만 그려 둠', '요청 때 만들어서 **스트리밍**'],
              ],
            },
            { type: 'say', text: '이렇게 만든 **정적 껍데기(static shell)** 는 CDN에서 즉시 나가요. 그래서 사용자는 바로 페이지 틀을 보고, 개인화된 부분만 잠깐 뒤에 채워져요.' },
          ],
        },
        {
          title: '코드로 보면',
          blocks: [
            {
              type: 'code',
              code: `export default function CoursePage() {
  return (
    <>
      <Header />                          {/* 고정: 정적 껍데기 */}
      <PopularCourses />                  {/* 'use cache': 정적 껍데기 */}
      <Suspense fallback={<p>내 학습 현황 불러오는 중...</p>}>
        <MyProgress />                    {/* cookies()로 사용자 확인: 요청 때 스트리밍 */}
      </Suspense>
    </>
  );
}`,
            },
            { type: 'note', tone: 'tip', text: '캐시도 안 하고 Suspense로 감싸지도 않은 느린 데이터가 있으면, Next.js 16 개발 화면이 "blocking route" 안내로 **"Suspense로 감싸거나 캐시하세요"** 라고 알려 줘요. 정적 껍데기가 항상 나오도록 도와주는 거예요. 그 안내를 따라가면 PPR이 자연스럽게 만들어져요.' },
          ],
        },
      ],
    },
    {
      title: '캐시 다시 만들기',
      slides: [
        {
          title: '시간이 지나면 vs 데이터가 바뀌면',
          blocks: [
            { type: 'say', text: '캐시를 했으면 "언제 새로 만들지"도 정해야 해요. 두 가지 방법이 있어요.' },
            {
              type: 'table',
              head: ['방식', '어떻게', '예'],
              rows: [
                ['시간 기준', "`cacheLife('hours')` 등으로 수명 지정", '인기 강의 목록: 몇 시간마다 새로 (6-1의 ISR)'],
                ['필요할 때(on-demand)', '`cacheTag`로 이름표를 붙이고, 데이터가 바뀌면 그 이름표를 무효화', '관리자가 강의 가격을 수정한 순간'],
              ],
            },
            {
              type: 'code',
              code: `import { cacheLife, cacheTag } from 'next/cache';

export async function getCourse(id: string) {
  'use cache';
  cacheLife('days');
  cacheTag(\`course-\${id}\`);          // 이름표
  return db.course.findUnique({ where: { id } });
}`,
            },
          ],
        },
        {
          title: 'revalidateTag와 updateTag',
          blocks: [
            {
              type: 'table',
              head: ['함수', '동작', '언제'],
              rows: [
                ["`revalidateTag('course-7', 'max')`", '이름표 붙은 캐시를 "오래됨"으로 표시 → 다음 요청은 일단 예전 걸 받고 뒤에서 새로 (stale-while-revalidate)', '조금 늦게 반영돼도 되는 콘텐츠'],
                ["`updateTag('course-7')`", '즉시 만료하고 **바로 새 데이터**를 읽음 (Server Action 전용)', '수정한 사람이 자기 수정 결과를 바로 봐야 할 때'],
              ],
            },
            { type: 'note', tone: 'warn', text: "Next.js 16에서 `revalidateTag`는 두 번째 인자(`'max'` 같은 cacheLife 프로필)가 필요해졌어요. 인자 하나짜리 옛날 방식은 deprecated예요. 블로그 글을 볼 때 버전을 꼭 확인하세요." },
            { type: 'say', text: '"내가 프로필을 수정했는데 저장 후에도 예전 이름이 보인다"는 버그, 이제 왜 생기는지 알겠죠? 캐시를 다시 만들지 않았거나, revalidateTag처럼 "뒤에서 천천히" 방식을 써서 그래요. 수정한 사람에게는 updateTag가 맞아요. 다음 수업에서 Server Action과 함께 써 볼게요.' },
          ],
        },
      ],
    },
  ],
  questions: [
    {
      id: 're06-5-q1',
      source: '서버 컴포넌트에서 데이터 가져오기',
      type: 'ox',
      question: '서버 컴포넌트에서 FastAPI를 fetch하면 서버끼리의 통신이라 CORS 문제가 생기지 않는다.',
      answer: true,
      explanation: 'CORS는 브라우저만 지키는 규칙이에요. Next.js 서버 → API 서버 통신에는 적용되지 않아요.',
    },
    {
      id: 're06-5-q2',
      source: '서버 컴포넌트에서 데이터 가져오기',
      type: 'mcq',
      question: '서로 상관없는 getCourse, getReviews, getRelated를 줄줄이 await하면 생기는 문제와 해결은?',
      choices: ['문제 없다', '폭포수(하나씩 기다림)로 느려진다 → Promise.all로 동시에 출발', '에러가 난다 → try/catch', 'CORS 에러 → 프록시'],
      answer: 1,
      explanation: '앞 요청이 끝나야 다음이 출발해서 시간이 더해져요. Promise.all로 동시에 보내면 가장 느린 것 기준으로 끝나요.',
    },
    {
      id: 're06-5-q3',
      source: 'Suspense로 스트리밍',
      type: 'mcq',
      question: '페이지의 느린 "추천 강의" 부분 때문에 전체가 늦게 뜨는 걸 막는 방법은?',
      choices: ['느린 부분을 Suspense로 감싸서 나머지를 먼저 보내고 나중에 스트리밍한다', "페이지 전체에 'use client'를 붙인다", 'useEffect로 바꾼다', '추천 강의를 지운다'],
      answer: 0,
      explanation: '준비된 부분과 fallback을 먼저 보내고, 느린 조각은 준비되면 이어서 보내요(스트리밍).',
    },
    {
      id: 're06-5-q4',
      source: '캐시는 직접 켜요: use cache',
      type: 'mcq',
      question: 'Next.js 16(Cache Components)에서 아무 설정 없이 쓴 데이터 조회는?',
      choices: ['영원히 캐시된다', '요청마다 새로 실행된다 (캐시는 use cache로 직접 켠다)', '빌드 때 한 번만 실행된다', '브라우저에서 실행된다'],
      answer: 1,
      explanation: "16의 원칙은 '캐시는 명시적으로'예요. 14처럼 자동 캐시가 아니에요.",
    },
    {
      id: 're06-5-q5',
      source: '캐시는 직접 켜요: use cache',
      type: 'short',
      question: "Next.js 16에서 함수나 컴포넌트의 결과를 캐시하려고 본문 맨 위에 쓰는 지시어는? ('use ____')",
      answer: ['cache', 'use cache', "'use cache'"],
      explanation: "'use cache'를 쓰고 cacheLife로 수명을 함께 정하는 게 권장 방식이에요. 인자는 자동으로 캐시 키가 돼요.",
    },
    {
      id: 're06-5-q6',
      source: '캐시는 직접 켜요: use cache',
      type: 'ox',
      question: "로그인 사용자마다 다른 데이터도 아무 고민 없이 'use cache'로 캐시해도 안전하다.",
      answer: false,
      explanation: '모두에게 같은 결과를 저장하는 캐시에 개인 데이터를 넣으면 다른 사람에게 보일 수 있어요. 사용자별 값은 키를 나누거나 캐시하지 않아요.',
    },
    {
      id: 're06-5-q7',
      source: 'PPR: 정적 껍데기 + 스트리밍',
      type: 'mcq',
      question: 'PPR(부분 사전 렌더링)에서 Suspense 안에서 cookies()로 사용자를 확인하는 부분은 어떻게 처리될까?',
      choices: ['빌드 때 그려져 모두에게 같은 내용이 간다', '정적 껍데기에는 fallback만 들어가고, 요청 때 만들어 스트리밍된다', '아예 안 보인다', '브라우저에서만 그려진다'],
      answer: 1,
      explanation: '고정·캐시된 부분은 정적 껍데기로 즉시 나가고, 요청이 있어야 아는 부분은 그 자리에 fallback을 뒀다가 스트리밍해요.',
    },
    {
      id: 're06-5-q8',
      source: '캐시 다시 만들기',
      type: 'mcq',
      question: '사용자가 프로필을 저장한 직후 자기 수정 결과를 바로 봐야 한다. Server Action에서 쓸 함수는?',
      choices: ["revalidateTag('user-1', 'max')", "updateTag('user-1')", "cacheLife('days')", 'notFound()'],
      answer: 1,
      explanation: 'updateTag는 즉시 만료하고 새 데이터를 읽어요(read-your-writes). revalidateTag는 일단 예전 걸 주고 뒤에서 새로 만들어요.',
    },
    {
      id: 're06-5-q9',
      source: '캐시 다시 만들기',
      type: 'ox',
      question: "Next.js 16에서도 revalidateTag('posts') 처럼 인자 하나만 넣는 방식이 권장된다.",
      answer: false,
      explanation: "16부터 두 번째 인자(cacheLife 프로필, 보통 'max')가 필요해졌고 한 인자 방식은 deprecated예요.",
    },
  ],
}

export default topic
