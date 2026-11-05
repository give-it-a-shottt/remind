import type { Topic } from '../../types'

const topic: Topic = {
  id: 're-06-6-server-actions',
  track: 'react',
  group: '06. 렌더링 전략과 Next.js',
  title: '6-6. Server Actions와 Route Handler',
  order: 606,
  addedAt: '2026-11-05',
  sections: [
    {
      title: 'Server Action이란',
      slides: [
        {
          title: '폼이 서버 함수를 바로 부른다',
          blocks: [
            { type: 'say', text: '6장 마지막 수업이에요! 지금까지는 서버에서 데이터를 **읽는** 법을 배웠어요. 이번엔 **쓰는(바꾸는)** 법이에요. 수강평 등록, 프로필 수정, 장바구니 담기 같은 거요.\n\n3-4에서 React 19의 `<form action={함수}>`를 배웠죠. Next.js에서는 그 함수를 **서버에서 실행되는 함수**로 만들 수 있어요. 이걸 **Server Action**(서버 함수)이라고 해요.' },
            {
              type: 'code',
              code: `// app/courses/[id]/review-form.tsx — 서버 컴포넌트여도 OK
async function createReview(formData: FormData) {
  'use server';                                   // ← 이 함수는 서버에서 실행
  const content = String(formData.get('content'));
  await db.review.create({ data: { content } });  // DB에 바로 저장
}

export default function ReviewForm() {
  return (
    <form action={createReview}>
      <textarea name="content" />
      <button type="submit">등록</button>
    </form>
  );
}`,
            },
          ],
        },
        {
          title: '무엇이 좋아졌나요',
          blocks: [
            {
              type: 'list',
              items: [
                '**API를 따로 안 만들어도 돼요.** 예전엔 `/api/reviews` POST API를 만들고, fetch로 부르고, 응답을 처리해야 했어요',
                '**useState·onClick 없이** 폼 제출이 돼요. 그래서 서버 컴포넌트에서도 쓸 수 있어요 (3-4의 비제어 폼)',
                '**JS가 아직 안 받아졌어도** 기본 HTML 폼처럼 제출이 돼요. 느린 네트워크에서도 동작해요',
              ],
            },
            { type: 'say', text: '`\'use server\'`가 붙은 함수는 브라우저에서 부를 수 있지만 **실행은 서버에서** 돼요. 브라우저는 함수 코드를 받는 게 아니라 "이 함수 실행해 주세요"라는 **요청**을 보내요. 6-4에서 "서버 함수는 클라이언트에 props로 넘길 수 있다"고 한 이유가 이거예요.' },
            { type: 'note', tone: 'tip', text: "Server Action은 보통 `app/actions.ts`처럼 파일 맨 위에 `'use server'`를 쓴 파일에 모아 둬요. 그러면 클라이언트 컴포넌트에서도 import 해서 쓸 수 있어요." },
          ],
        },
      ],
    },
    {
      title: '저장 후 화면 갱신하기',
      slides: [
        {
          title: '저장했는데 목록에 안 보여요',
          blocks: [
            { type: 'say', text: '수강평을 등록했는데 아래 수강평 목록에 새 글이 안 보여요. 6-5에서 배운 **캐시** 때문이에요. 목록이 캐시돼 있으면 DB가 바뀐 걸 모르니까요. 그래서 저장한 뒤에 **캐시를 갱신**해 줘야 해요.' },
            {
              type: 'code',
              code: `// app/actions.ts
'use server';
import { updateTag } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createReview(courseId: string, formData: FormData) {
  const content = String(formData.get('content'));
  await db.review.create({ data: { courseId, content } });

  updateTag(\`reviews-\${courseId}\`);       // 6-5: 이 이름표의 캐시를 즉시 새로
  redirect(\`/courses/\${courseId}\`);       // 필요하면 다른 화면으로 이동
}`,
            },
            { type: 'say', text: '6-5에서 배운 `updateTag`는 Server Action 전용이에요. "수정한 사람이 결과를 바로 봐야 할 때" 쓰라고 했죠? 바로 이 상황이에요. 캐시하지 않은 데이터만 다시 그리고 싶을 때는 `refresh()`도 있어요.' },
          ],
        },
        {
          title: '등록 중… 표시와 에러 보여 주기',
          blocks: [
            { type: 'say', text: '버튼을 누르고 저장될 때까지 "등록 중…"을 보여 주고, 실패하면 에러를 보여 주고 싶어요. React 19의 **`useActionState`** 훅을 써요(클라이언트 컴포넌트).' },
            {
              type: 'code',
              code: `'use client';
import { useActionState } from 'react';
import { createReview } from '@/app/actions';

export function ReviewForm({ courseId }: { courseId: string }) {
  const [state, formAction, isPending] = useActionState(
    async (_prev: string | null, formData: FormData) => {
      try { await createReview(courseId, formData); return null; }
      catch { return '등록에 실패했어요'; }
    },
    null,
  );
  return (
    <form action={formAction}>
      <textarea name="content" />
      <button disabled={isPending}>{isPending ? '등록 중…' : '등록'}</button>
      {state && <p role="alert">{state}</p>}
    </form>
  );
}`,
            },
            { type: 'list', items: ['`state` → 액션이 마지막으로 돌려준 값 (여기선 에러 메시지)', '`formAction` → form의 action에 넣을 함수', '`isPending` → 실행 중이면 true. 버튼을 막아서 **두 번 제출**을 방지해요'] },
          ],
        },
      ],
    },
    {
      title: 'Server Action은 공개 API예요',
      slides: [
        {
          title: '누구나 부를 수 있어요',
          blocks: [
            { type: 'note', tone: 'warn', text: '**이 수업에서 가장 중요한 경고예요.** Server Action은 함수처럼 보이지만 실제로는 **인터넷에 열린 POST 엔드포인트**예요. 화면에 버튼이 없어도, 누구나 개발자 도구나 스크립트로 그 함수를 부를 수 있어요.' },
            { type: 'ask', q: '"수강평 삭제" Server Action이 reviewId만 받아서 바로 지운다면 어떤 일이 생길까요?', a: '로그인도 안 한 사람이, 혹은 **남의 수강평 id**를 넣어서 아무 글이나 지울 수 있어요. "화면에 내 글에만 삭제 버튼을 보여 줬으니 괜찮겠지"는 착각이에요. 버튼 숨기기는 보안이 아니에요.' },
          ],
        },
        {
          title: '함수 안에서 반드시 확인하기',
          blocks: [
            {
              type: 'code',
              code: `'use server';
import { z } from 'zod';

const Schema = z.object({ content: z.string().min(10).max(1000) });

export async function createReview(courseId: string, formData: FormData) {
  const user = await getSessionUser();                 // ① 로그인했나?
  if (!user) throw new Error('로그인이 필요해요');

  const enrolled = await isEnrolled(user.id, courseId); // ② 권한이 있나? (수강생인가)
  if (!enrolled) throw new Error('수강생만 작성할 수 있어요');

  const parsed = Schema.safeParse({ content: formData.get('content') });   // ③ 입력이 올바른가?
  if (!parsed.success) throw new Error('10자 이상 써 주세요');

  await db.review.create({ data: { courseId, userId: user.id, content: parsed.data.content } });
}`,
            },
            { type: 'say', text: 'Server Action마다 **세 가지**를 확인해요.\n① **인증**: 로그인한 사람인가\n② **권한**: 이 사람이 이 일을 해도 되나 (남의 것이 아닌가)\n③ **입력 검증**: 들어온 값이 올바른가 (3-1에서 말한 "외부 데이터는 zod")\n\n그리고 userId 같은 건 폼에서 받지 말고 **서버의 세션에서** 꺼내요. 폼 값은 얼마든지 조작할 수 있으니까요.' },
          ],
        },
      ],
    },
    {
      title: 'Route Handler',
      slides: [
        {
          title: 'Next.js 안에 API 만들기',
          blocks: [
            { type: 'say', text: 'Server Action은 "내 앱의 화면에서 쓰는" 쓰기 작업에 딱 좋아요. 그런데 **다른 곳에서 부르는 API**가 필요할 때도 있어요. 그럴 땐 **Route Handler**를 써요.' },
            {
              type: 'code',
              code: `// app/api/courses/route.ts → GET /api/courses
export async function GET(request: Request) {
  const courses = await db.course.findMany();
  return Response.json(courses);
}

// POST /api/courses
export async function POST(request: Request) {
  const body = await request.json();
  // ... 인증·검증 후 저장
  return Response.json({ ok: true }, { status: 201 });
}`,
            },
            { type: 'say', text: '폴더에 `page.tsx` 대신 **`route.ts`** 를 두고, HTTP 메서드 이름(`GET`, `POST`…)으로 함수를 export 해요. 같은 폴더에 page.tsx와 route.ts를 같이 둘 수는 없어요.' },
          ],
        },
        {
          title: '언제 무엇을 쓸까',
          blocks: [
            {
              type: 'table',
              head: ['상황', '도구'],
              rows: [
                ['데이터 읽기 (내 앱 화면)', '서버 컴포넌트에서 직접 조회 (6-5)'],
                ['데이터 쓰기 (내 앱의 폼·버튼)', '**Server Action**'],
                ['외부에서 부르는 API (모바일 앱, 다른 서비스)', '**Route Handler**'],
                ['결제사·GitHub의 **웹훅** 받기', '**Route Handler**'],
                ['클라이언트 컴포넌트에서 FastAPI를 감싸 부르기 (BFF)', 'Route Handler 또는 다음 개념의 rewrites'],
              ],
            },
            { type: 'note', tone: 'tip', text: '**BFF**(Backend For Frontend)는 "프론트를 위한 중간 서버"예요. Next.js 서버가 FastAPI를 대신 부르고, 화면에 필요한 것만 골라서 돌려줘요. 비밀키를 브라우저에 노출하지 않고, 여러 API를 한 번에 합쳐 줄 수 있어요.' },
          ],
        },
      ],
    },
    {
      title: '브라우저에서 백엔드 부르기: rewrites',
      slides: [
        {
          title: '배포에서도 동작하는 프록시',
          blocks: [
            { type: 'say', text: '5-4에서 Vite 프록시는 **개발 서버 전용**이라 배포하면 사라진다고 했죠. Next.js의 **rewrites**는 같은 일을 하는데 **배포에서도 동작해요.** Next.js 서버가 항상 떠 있으니까요.' },
            {
              type: 'code',
              code: `// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: '/api/:path*', destination: \`\${process.env.API_URL}/api/:path*\` },
    ];
  },
};
export default nextConfig;

// 클라이언트 컴포넌트에서
fetch('/api/courses');   // 같은 오리진 → Next.js 서버가 FastAPI로 대신 전달`,
            },
            { type: 'say', text: '브라우저는 같은 오리진(내 Next.js 주소)에만 요청하고, Next.js 서버가 FastAPI에 대신 다녀와요. 5-4의 "안내 데스크" 비유 그대로예요. CORS 설정 없이도 돼요.' },
          ],
        },
        {
          title: '6장 정리',
          blocks: [
            { type: 'say', text: '6장에서 배운 걸 한 장으로 모아 볼게요.' },
            {
              type: 'table',
              head: ['주제', '한 줄'],
              rows: [
                ['렌더링 전략', 'HTML을 언제·어디서 만들까. 페이지마다, 부분마다 다르게 (PPR)'],
                ['하이드레이션', '서버 HTML에 JS로 기능을 연결. 서버·브라우저 첫 결과가 같아야 함'],
                ['App Router', '폴더가 주소, layout·loading·error는 이름 정해진 파일, params는 await'],
                ['서버/클라이언트', "데이터·비밀은 서버, 상호작용은 잎의 'use client', props는 직렬화"],
                ['데이터와 캐시', "서버에서 await, 느린 건 Suspense로 스트리밍, 캐시는 'use cache'로 명시"],
                ['쓰기', 'Server Action + 인증·권한·검증 필수, 외부 API는 Route Handler'],
              ],
            },
            { type: 'say', text: '6장 끝! 이제 "SSR/SSG 경험 있으세요?"라는 면접 질문에 원리부터 설명할 수 있어요. 다음 7장은 공고 단골인 **TanStack Query와 Zustand**예요. 마지막 확인 문제 가요.' },
          ],
        },
      ],
    },
  ],
  questions: [
    {
      id: 're06-6-q1',
      source: 'Server Action이란',
      type: 'mcq',
      question: "함수 본문 맨 위에 'use server'를 쓴 함수에 대한 설명으로 옳은 것은?",
      choices: ['브라우저에서 실행된다', '브라우저에서 부를 수 있지만 실행은 서버에서 되는 Server Action이 된다', '빌드 때 한 번만 실행된다', '캐시된다'],
      answer: 1,
      explanation: "브라우저는 함수 코드가 아니라 '실행해 주세요' 요청을 보내고, 서버에서 실행돼요. form action에 바로 연결할 수 있어요.",
    },
    {
      id: 're06-6-q2',
      source: 'Server Action이란',
      type: 'ox',
      question: 'Server Action을 form action에 연결하면 useState나 onClick 없이도 폼을 제출할 수 있다.',
      answer: true,
      explanation: 'HTML 폼 제출이라 서버 컴포넌트에서도 쓸 수 있고, JS가 아직 안 받아졌어도 동작해요.',
    },
    {
      id: 're06-6-q3',
      source: '저장 후 화면 갱신하기',
      type: 'mcq',
      question: '수강평을 저장했는데 캐시된 수강평 목록에 새 글이 안 보인다. Server Action 안에서 할 일은?',
      choices: ['브라우저를 새로고침하라고 안내한다', "저장 후 updateTag('reviews-7')로 그 목록의 캐시를 갱신한다", "'use cache'를 하나 더 붙인다", 'useEffect로 다시 불러온다'],
      answer: 1,
      explanation: '캐시된 목록은 DB가 바뀐 걸 몰라요. updateTag로 즉시 만료하고 새 데이터를 읽게 해요.',
    },
    {
      id: 're06-6-q4',
      source: '저장 후 화면 갱신하기',
      type: 'short',
      question: 'Server Action의 실행 중 여부(isPending)와 마지막 결과(state)를 함께 다루는 React 19 훅은?',
      answer: ['useActionState', 'useActionState()'],
      explanation: '[state, formAction, isPending]을 돌려줘요. isPending으로 버튼을 막아 두 번 제출을 방지해요.',
    },
    {
      id: 're06-6-q5',
      source: 'Server Action은 공개 API예요',
      type: 'ox',
      question: '삭제 버튼을 내 글에만 보여 줬다면, 삭제 Server Action 안에서 작성자인지 다시 확인할 필요는 없다.',
      answer: false,
      explanation: 'Server Action은 누구나 부를 수 있는 공개 엔드포인트예요. 버튼 숨기기는 보안이 아니라서 함수 안에서 인증·권한을 꼭 확인해요.',
    },
    {
      id: 're06-6-q6',
      source: 'Server Action은 공개 API예요',
      type: 'mcq',
      question: 'Server Action 안에서 작성자 userId를 얻는 가장 안전한 방법은?',
      choices: ['폼의 hidden input으로 받는다', '서버의 세션(로그인 정보)에서 꺼낸다', 'URL 검색 파라미터로 받는다', 'localStorage에서 읽는다'],
      answer: 1,
      explanation: '폼·URL 값은 사용자가 얼마든지 조작할 수 있어요. 신원은 서버가 확인한 세션에서 꺼내요.',
    },
    {
      id: 're06-6-q7',
      source: 'Route Handler',
      type: 'mcq',
      question: '결제사가 결제 완료를 알려 주는 웹훅을 받을 주소를 Next.js에 만들려면?',
      choices: ['page.tsx', 'app/api/payments/webhook/route.ts 에 POST 함수', 'layout.tsx', "'use client' 컴포넌트"],
      answer: 1,
      explanation: '외부에서 부르는 API와 웹훅은 Route Handler(route.ts)로 만들어요. HTTP 메서드 이름으로 함수를 export 해요.',
    },
    {
      id: 're06-6-q8',
      source: '브라우저에서 백엔드 부르기: rewrites',
      type: 'mcq',
      question: 'Vite server.proxy와 비교한 Next.js rewrites의 장점은?',
      choices: ['CSS를 압축해 준다', '배포 환경에서도 프록시로 동작한다 (Next.js 서버가 항상 떠 있으므로)', 'DB를 만들어 준다', '빌드가 필요 없다'],
      answer: 1,
      explanation: 'Vite 프록시는 개발 서버 전용이지만, rewrites는 배포된 Next.js 서버가 계속 대신 전달해 줘요.',
    },
    {
      id: 're06-6-q9',
      source: '브라우저에서 백엔드 부르기: rewrites',
      type: 'essay',
      question: '[면접] Server Action을 쓸 때 보안상 꼭 지켜야 할 점은 무엇인가요?',
      answer: 'Server Action은 함수처럼 보이지만 누구나 호출할 수 있는 공개 POST 엔드포인트입니다. 그래서 화면에서 버튼을 숨기는 것과 상관없이, 함수 안에서 매번 로그인 여부(인증), 이 사용자가 이 리소스를 바꿀 수 있는지(권한), 들어온 입력이 올바른지(zod 같은 검증)를 확인해야 합니다. 또 작성자 id 같은 신원 정보는 폼 값이 아니라 서버 세션에서 꺼내고, 저장 후에는 updateTag 등으로 관련 캐시를 갱신합니다.',
      keywords: ['공개 엔드포인트', '인증', '권한', '입력 검증(zod)', '세션에서 신원', '캐시 갱신'],
      explanation: '"공개 API다"라는 인식과 인증·권한·검증 세 가지를 반드시 말해요.',
    },
  ],
}

export default topic
