import type { Topic } from '../../types'

const topic: Topic = {
  id: 'fs-04-2-detail-route',
  track: 'fullstack',
  group: '04. Next.js 화면 만들기',
  title: '4-2. 강의 상세 SSR: 동적 라우트 [id]',
  order: 402,
  notionId: '40ddf951bf80803a9bfceeeb2468fac2',
  addedAt: '2026-11-06',
  sections: [
    {
      title: '[id] 파일 하나로 모든 강의',
      slides: [
        {
          title: '강의마다 파일을 만들 순 없어요',
          blocks: [
            { type: 'say', text: '이번엔 3-4에서 만든 상세 API를 화면으로 만들어요. `/courses/1`, `/courses/2`, `/courses/3`… 강의가 100개면 파일을 100개 만들 수는 없죠.\n\nPages Router에서는 **대괄호 파일 이름**으로 "빈칸이 있는 주소"를 만들어요.' },
            {
              type: 'code',
              code: `frontend/pages/
├─ courses.tsx   → /courses (목록)
└─ courses/
   └─ [id].tsx    → /courses/1, 2, 3…`,
            },
            { type: 'say', text: '`[id].tsx`의 `id`가 빈칸 이름이에요. `/courses/7`로 들어오면 id 자리에 "7"이 들어가요. 백엔드 3-4의 `{course_id}` 경로 파라미터와 같은 아이디어를 프론트 파일 이름으로 표현한 거예요. 이런 주소를 **동적 라우트**라고 해요.' },
          ],
        },
      ],
    },
    {
      title: 'context.params로 id 꺼내기',
      slides: [
        {
          title: '상세 페이지 코드',
          blocks: [
            {
              type: 'code',
              code: `// frontend/pages/courses/[id].tsx
import type { GetServerSideProps } from "next";

type Course = { id: number; title: string; instructor: string; price: number };

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context.params?.id;                                 // 주소의 [id] 자리 값
  const res = await fetch(\`http://localhost:8000/courses/\${id}\`);
  if (res.status === 404) return { notFound: true };             // 없는 강의 → 404 페이지
  if (!res.ok) throw new Error(\`FastAPI \${res.status}\`);
  const course: Course = await res.json();
  return { props: { course } };
};

export default function CourseDetail({ course }: { course: Course }) {
  return (
    <article>
      <h1>{course.title}</h1>
      <p>강사: {course.instructor}</p>
      <p>{course.price.toLocaleString()}원</p>
    </article>
  );
}`,
            },
          ],
        },
        {
          title: 'context에 든 것',
          blocks: [
            { type: 'say', text: '`getServerSideProps`는 **context**라는 인자를 받아요. 요청에 대한 정보가 담긴 상자예요.' },
            {
              type: 'table',
              head: ['context 안', '뜻', '예'],
              rows: [
                ['`params`', '동적 라우트의 빈칸 값', "`/courses/7` → `{ id: '7' }`"],
                ['`query`', '주소의 쿼리 파라미터 (+ params)', "`?tab=review` → `{ tab: 'review', id: '7' }`"],
                ['`req`, `res`', '요청·응답 객체 (쿠키, 헤더)', '나중에 로그인 확인할 때'],
              ],
            },
            { type: 'note', tone: 'warn', text: '`params.id`는 숫자처럼 보여도 **문자열 "7"** 이에요(React 트랙 5-1의 useParams와 같아요). 지금은 그대로 주소에 붙이니 괜찮지만, 숫자 비교를 할 땐 `Number(id)`로 바꿔요. 그리고 FastAPI 쪽에서 `course_id: int`가 다시 검사해 줘요(3-4).' },
          ],
        },
      ],
    },
    {
      title: '없는 강의는 notFound',
      slides: [
        {
          title: '500이 아니라 404 페이지로',
          blocks: [
            { type: 'ask', q: '/courses/99999 를 열면 FastAPI는 404 {"detail":"Course not found"}를 돌려줘요. notFound 처리가 없다면 화면은 어떻게 될까요?', a: '`res.json()`이 `{"detail": ...}`을 course로 받아서, `course.price.toLocaleString()`에서 **price가 없어 에러** → 페이지 전체가 500이 돼요. 사용자 입장에선 "사이트가 고장 났다"로 보이죠.\n없는 강의는 고장이 아니라 "**없는 페이지**"예요. 그래서 `return { notFound: true }`로 Next.js의 **404 페이지**를 보여 줘요.' },
            {
              type: 'table',
              head: ['FastAPI 응답', '상세 페이지가 할 일', '사용자가 보는 것'],
              rows: [
                ['200 + 강의', '`props: { course }`', '강의 상세'],
                ['404', '`notFound: true`', '404 페이지'],
                ['500, 연결 실패', '에러를 던지거나 안내 (4-1처럼)', '에러 페이지 또는 안내 문구'],
              ],
            },
            { type: 'say', text: '백엔드가 상태 코드를 정확히 보내 주니까(3-4) 프론트가 이렇게 **상황별로** 다르게 대응할 수 있어요. 1-1에서 "상태 코드는 프로그램이 판단하려고 숫자로 준다"고 한 게 바로 이 장면이에요.' },
            { type: 'note', tone: 'tip', text: '`pages/404.tsx` 파일을 만들면 기본 404 화면 대신 "찾는 강의가 없어요 + 강의 목록으로 가기" 같은 **우리 서비스다운** 404 페이지를 보여 줄 수 있어요.\n\n수업 끝! 확인 문제 가요.' },
          ],
        },
      ],
    },
  ],
  questions: [
    {
      id: 'fs04-2-q1',
      source: '[id] 파일 하나로 모든 강의',
      type: 'mcq',
      question: 'Pages Router에서 /courses/1, /courses/2 … 를 한 파일로 처리하려면 파일 경로는?',
      choices: ['pages/courses/id.tsx', 'pages/courses/[id].tsx', 'pages/courses/{id}.tsx', 'pages/[courses].tsx'],
      answer: 1,
      explanation: '대괄호 파일 이름이 동적 라우트예요. id 자리에 주소의 값이 들어가요.',
    },
    {
      id: 'fs04-2-q2',
      source: 'context.params로 id 꺼내기',
      type: 'short',
      question: 'getServerSideProps(context)에서 [id] 자리 값을 꺼내는 코드는? (context.______.id)',
      answer: ['params', 'context.params.id', 'context.params?.id'],
      explanation: 'params에 동적 라우트 값, query에 쿼리 파라미터, req·res에 요청 정보가 들어 있어요.',
    },
    {
      id: 'fs04-2-q3',
      source: 'context.params로 id 꺼내기',
      type: 'ox',
      question: '/courses/7 에서 context.params.id 는 숫자 7이다.',
      answer: false,
      explanation: "주소에서 온 값은 문자열 '7'이에요. 숫자로 써야 하면 Number(id)로 바꿔요.",
    },
    {
      id: 'fs04-2-q4',
      source: '없는 강의는 notFound',
      type: 'mcq',
      question: 'FastAPI가 404를 돌려줬을 때 상세 페이지의 getServerSideProps가 할 일로 알맞은 것은?',
      choices: ['그대로 props로 넘긴다', 'return { notFound: true } 로 404 페이지를 보여 준다', '페이지를 새로고침한다', 'useEffect로 다시 요청한다'],
      answer: 1,
      explanation: '없는 강의는 고장이 아니라 없는 페이지예요. notFound를 안 하면 {detail}을 강의로 착각해 500이 나요.',
    },
  ],
}

export default topic
