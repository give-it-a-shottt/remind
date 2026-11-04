import type { Topic } from '../../types'

const topic: Topic = {
  id: 're-06-4-server-client',
  track: 'react',
  group: '06. 렌더링 전략과 Next.js',
  title: '6-4. 서버 컴포넌트와 클라이언트 컴포넌트',
  order: 604,
  addedAt: '2026-11-05',
  sections: [
    {
      title: '기본은 서버 컴포넌트',
      slides: [
        {
          title: '브라우저로 가지 않는 컴포넌트',
          blocks: [
            { type: 'say', text: '이번 수업이 Next.js에서 **가장 중요한** 개념이에요.\n\nApp Router의 컴포넌트는 아무것도 안 쓰면 **서버 컴포넌트(React Server Component, RSC)** 예요. 서버 컴포넌트는 **서버에서만 실행되고, 그 코드는 브라우저로 전송되지 않아요.** 브라우저는 결과(화면 설명)만 받아요.' },
            {
              type: 'code',
              code: `// app/courses/page.tsx — 아무것도 안 붙임 = 서버 컴포넌트
import { db } from '@/lib/db';

export default async function CoursesPage() {
  const courses = await db.course.findMany();   // DB를 바로 조회!
  return (
    <ul>
      {courses.map((c) => <li key={c.id}>{c.title}</li>)}
    </ul>
  );
}`,
            },
            { type: 'say', text: '컴포넌트 안에서 **DB를 바로 조회**하고 있어요. 서버에서만 실행되니까 가능해요. API를 따로 만들 필요도, useEffect로 가져올 필요도 없어요. 그리고 이 컴포넌트의 JS는 브라우저로 안 가니까 **하이드레이션할 것도 없어요**(6-2).' },
          ],
        },
        {
          title: '할 수 있는 것과 없는 것',
          blocks: [
            {
              type: 'table',
              head: ['', '서버 컴포넌트', '클라이언트 컴포넌트 (`\'use client\'`)'],
              rows: [
                ['실행 위치', '서버에서만', '서버(첫 HTML) + 브라우저'],
                ['`async` 컴포넌트, 바로 `await`', '가능', '불가'],
                ['DB·파일·비밀키 접근', '가능', '불가 (브라우저로 코드가 가니까)'],
                ['`useState`·`useEffect` 등 훅', '불가', '가능'],
                ['`onClick` 같은 이벤트', '불가', '가능'],
                ['`window`·`localStorage`', '불가', '가능 (useEffect·이벤트 안에서)'],
                ['브라우저로 보내는 JS', '**없음**', '있음'],
              ],
            },
            { type: 'note', tone: 'analogy', text: '식당 **주방**(서버 컴포넌트)과 **홀**(클라이언트 컴포넌트)이에요. 주방은 냉장고(DB)와 비밀 레시피(비밀키)에 접근할 수 있지만 손님과 대화(클릭)는 못 해요. 홀 직원은 손님 주문을 받고 반응하지만 냉장고에는 못 들어가요. 손님(브라우저)은 완성된 요리만 받아요.' },
          ],
        },
      ],
    },
    {
      title: "'use client' 경계는 잎에",
      slides: [
        {
          title: '상호작용이 필요한 부분만 떼어 내기',
          blocks: [
            { type: 'say', text: '강의 상세 페이지에 "찜하기" 버튼이 있어요. 버튼은 클릭해야 하니까 클라이언트 컴포넌트가 필요해요. 그럼 페이지 전체에 `\'use client\'`를 붙여야 할까요? **아니요.** 버튼만 떼어 내요.' },
            {
              type: 'code',
              code: `// app/courses/[id]/page.tsx — 서버 컴포넌트 (데이터)
import WishButton from './WishButton';

export default async function CoursePage({ params }) {
  const { id } = await params;
  const course = await getCourse(id);
  return (
    <article>
      <h1>{course.title}</h1>
      <p>{course.description}</p>                   {/* 긴 글: JS 안 보냄 */}
      <WishButton courseId={course.id} initial={course.wished} />
    </article>
  );
}

// app/courses/[id]/WishButton.tsx — 클라이언트 컴포넌트 (상호작용)
'use client';
import { useState } from 'react';
export default function WishButton({ courseId, initial }) {
  const [wished, setWished] = useState(initial);
  return <button onClick={() => setWished(!wished)}>{wished ? '♥' : '♡'}</button>;
}`,
            },
          ],
        },
        {
          title: "'use client'는 모듈 경계예요",
          blocks: [
            { type: 'say', text: '`\'use client\'`는 컴포넌트 하나가 아니라 **파일(모듈)의 경계**를 표시해요. 그 파일과, 그 파일이 import 하는 **모든 모듈**이 브라우저 번들에 들어가요.' },
            { type: 'ask', q: '편하려고 page.tsx 맨 위에 \'use client\'를 붙이면 어떻게 될까요?', a: '그 페이지와 그 아래 import된 **모든 컴포넌트가 클라이언트 컴포넌트**가 돼요. 긴 강의 설명, 커리큘럼 목록까지 전부 JS로 브라우저에 가고 하이드레이션돼요. 서버 컴포넌트의 장점이 다 사라지고, DB도 직접 조회 못 해요.' },
            { type: 'say', text: '규칙: **`\'use client\'`는 트리의 잎(leaf)에.** 버튼, 입력 폼, 드롭다운처럼 상호작용이 필요한 **가장 작은 부분**에만 붙여요. 1-2에서 "모듈을 잘 나누는 게 번들 크기를 정한다"고 했던 게 Next.js에서는 이렇게 드러나요.' },
            { type: 'note', tone: 'warn', text: '`\'use client\'`는 import보다도 위, **파일 첫 줄**에 있어야 해요. import는 호이스팅되지만(1-3), 지시어는 "파일 맨 앞에 있을 때만" 인정돼요.' },
          ],
        },
      ],
    },
    {
      title: '서버에서 클라이언트로 넘기는 props',
      slides: [
        {
          title: '네트워크를 건너는 값',
          blocks: [
            { type: 'say', text: '서버 컴포넌트가 클라이언트 컴포넌트에 props를 넘기는 건 1장의 단방향 흐름 그대로예요. 다만 차이가 하나 있어요. 그 props는 **서버에서 브라우저로 네트워크를 건너가야** 해요. 그래서 **직렬화할 수 있는 값**만 넘길 수 있어요.' },
            {
              type: 'table',
              head: ['넘길 수 있음 ✅', '넘길 수 없음 ❌'],
              rows: [
                ['문자열, 숫자, 불리언, null', '일반 함수 (`onClick={() => ...}`)'],
                ['배열, 일반 객체', '클래스 인스턴스 (DB가 돌려준 모델 객체 등)'],
                ['Date, Map, Set', '`Symbol` 같은 특수 값'],
                ['JSX (서버 컴포넌트 결과)', ''],
                ["`'use server'`로 만든 서버 함수 (6-6)", ''],
              ],
            },
          ],
        },
        {
          title: '함수는 못 넘겨요',
          blocks: [
            { type: 'code', code: `// 서버 컴포넌트에서
<WishButton onToggle={() => console.log('찜')} />
// ❌ 에러: Functions cannot be passed directly to Client Components` },
            { type: 'say', text: '1장에서 배운 "부모가 함수를 내려 주고 자식이 부른다" 패턴은 **클라이언트 컴포넌트끼리** 써요. 서버의 함수는 브라우저에서 실행될 수 없으니까요.\n\n예외는 `\'use server\'`로 만든 **서버 함수(Server Action)** 예요. 이건 브라우저가 "이 함수 실행해 주세요"라고 서버에 요청하는 방식이라 넘길 수 있어요. 6-6에서 배워요.' },
            { type: 'note', tone: 'tip', text: 'props로 받은 객체를 클라이언트에서 고쳐도 서버 데이터는 안 바뀌어요. 복사본이 건너온 거니까요. 서버 데이터를 바꾸려면 Server Action이나 API를 불러야 해요.' },
          ],
        },
      ],
    },
    {
      title: 'children으로 서버 컴포넌트 끼우기',
      slides: [
        {
          title: '클라이언트가 서버 컴포넌트를 import 하면',
          blocks: [
            { type: 'say', text: '중요한 규칙: **클라이언트 컴포넌트 파일에서 서버 컴포넌트를 import 하면, 그 컴포넌트도 클라이언트 컴포넌트가 돼요.** `\'use client\'` 경계 아래의 import는 전부 브라우저로 가니까요.' },
            { type: 'say', text: '그런데 "접었다 펼 수 있는 패널"(클라이언트) 안에 "강의 커리큘럼"(서버, DB 조회)을 넣고 싶다면요? 4-5에서 배운 **children** 기법을 써요.' },
            {
              type: 'code',
              code: `// Collapsible.tsx — 클라이언트
'use client';
export function Collapsible({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <section>
      <button onClick={() => setOpen(!open)}>커리큘럼</button>
      {open && children}          {/* 받은 걸 그리기만 */}
    </section>
  );
}

// page.tsx — 서버
<Collapsible>
  <Curriculum courseId={id} />    {/* 서버 컴포넌트를 "위에서" 끼워 넣음 */}
</Collapsible>`,
            },
            { type: 'say', text: 'Curriculum을 import 한 건 **서버 컴포넌트인 page**예요. Collapsible은 이미 서버에서 만들어진 결과를 children으로 **받기만** 해요. 그래서 Curriculum은 서버 컴포넌트로 남아요.' },
          ],
        },
        {
          title: 'Context Provider도 이렇게',
          blocks: [
            { type: 'say', text: '4-5의 Context는 훅이라 서버 컴포넌트에서 못 써요. 그래서 Next.js에서는 **Provider를 클라이언트 컴포넌트로 따로 만들고**, 서버 컴포넌트인 `app/layout.tsx`에서 children을 감싸요.' },
            {
              type: 'code',
              code: `// app/theme-provider.tsx
'use client';
export default function ThemeProvider({ children }) {
  const [mode, setMode] = useState('light');
  return <ThemeContext value={{ mode, setMode }}>{children}</ThemeContext>;
}

// app/layout.tsx — 서버 컴포넌트 그대로
export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <ThemeProvider>{children}</ThemeProvider>   {/* 페이지들은 서버 컴포넌트로 유지 */}
      </body>
    </html>
  );
}`,
            },
            { type: 'note', tone: 'tip', text: '5-5의 Redux Provider도 같은 방식이에요. 단, Next.js 서버는 여러 사용자의 요청을 동시에 처리해서, 스토어를 모듈 맨 바깥에 하나 만들면 **사용자끼리 데이터가 섞일 수 있어요.** 그래서 Provider 안에서 요청(사용자)마다 새 스토어를 만들어요.' },
          ],
        },
      ],
    },
    {
      title: '서버 전용 코드 지키기',
      slides: [
        {
          title: '비밀키가 브라우저로 새는 사고',
          blocks: [
            { type: 'say', text: '서버 컴포넌트에서 쓰던 `lib/db.ts`(DB 비밀번호가 든 파일)를 누군가 실수로 클라이언트 컴포넌트에서 import 했다고 해 볼게요. 그러면 **그 코드가 브라우저 번들에 들어가요.** 누구나 개발자 도구로 볼 수 있죠. 실제로 일어나는 보안 사고예요.' },
            {
              type: 'code',
              code: `// lib/db.ts
import 'server-only';           // ← 이 한 줄
import { Pool } from 'pg';
export const db = new Pool({ connectionString: process.env.DATABASE_URL });`,
            },
            { type: 'say', text: '`server-only` 패키지를 import 해 두면, 이 파일을 클라이언트 컴포넌트에서 import 하는 순간 **빌드 에러**로 막아 줘요. 실수를 배포 전에 잡는 안전장치예요.' },
          ],
        },
        {
          title: '환경변수 규칙',
          blocks: [
            {
              type: 'table',
              head: ['환경변수', '어디서 보이나'],
              rows: [
                ['`DATABASE_URL`, `API_SECRET`', '**서버에서만** (`process.env`)'],
                ['`NEXT_PUBLIC_API_URL`', '**브라우저 번들에도** 들어감 → 누구나 볼 수 있음'],
              ],
            },
            { type: 'say', text: '5-3의 Vite `VITE_` 규칙과 같아요. `NEXT_PUBLIC_`이 붙은 것만 브라우저로 가요. **비밀값에는 절대 붙이지 마세요.**' },
            { type: 'say', text: '정리할게요. Next.js 설계의 핵심 한 줄.\n\n**데이터와 비밀은 서버 컴포넌트에, 상호작용은 잎의 클라이언트 컴포넌트에, 둘은 직렬화된 props와 children으로 연결.**\n\n확인 문제 가요.' },
          ],
        },
      ],
    },
  ],
  questions: [
    {
      id: 're06-4-q1',
      source: '기본은 서버 컴포넌트',
      type: 'mcq',
      question: "App Router에서 'use client'를 붙이지 않은 컴포넌트는?",
      choices: ['클라이언트 컴포넌트', '서버 컴포넌트', 'CSR 전용 컴포넌트', '에러가 난다'],
      answer: 1,
      explanation: 'App Router는 기본이 서버 컴포넌트예요. 서버에서만 실행되고 코드가 브라우저로 가지 않아요.',
    },
    {
      id: 're06-4-q2',
      source: '기본은 서버 컴포넌트',
      type: 'mcq',
      question: '서버 컴포넌트에서 할 수 없는 것은?',
      choices: ['async 함수로 만들고 await 하기', 'DB를 직접 조회하기', 'useState와 onClick 쓰기', '비밀 환경변수 읽기'],
      answer: 2,
      explanation: '훅과 이벤트는 브라우저에서 반응해야 하는 것이라 클라이언트 컴포넌트에서만 써요.',
    },
    {
      id: 're06-4-q3',
      source: "'use client' 경계는 잎에",
      type: 'mcq',
      question: '강의 상세 페이지에 찜하기 버튼 하나만 클릭이 필요하다. 가장 좋은 구조는?',
      choices: ["page.tsx 맨 위에 'use client'", "찜하기 버튼만 별도 파일로 떼어 'use client'를 붙이고, page는 서버 컴포넌트로 둔다", '모든 컴포넌트에 use client', 'useEffect로 버튼을 만든다'],
      answer: 1,
      explanation: "'use client'는 잎에. 그래야 긴 설명·목록은 JS 없이 서버에서 그려지고, 버튼만 브라우저로 가요.",
    },
    {
      id: 're06-4-q4',
      source: "'use client' 경계는 잎에",
      type: 'ox',
      question: "'use client' 파일이 import 하는 다른 모듈들도 브라우저 번들에 포함된다.",
      answer: true,
      explanation: "'use client'는 모듈 경계예요. 그 아래 import된 것은 전부 클라이언트 코드가 돼요.",
    },
    {
      id: 're06-4-q5',
      source: '서버에서 클라이언트로 넘기는 props',
      type: 'mcq',
      question: '서버 컴포넌트가 클라이언트 컴포넌트에 넘길 수 없는 props는?',
      choices: ["title='React'", 'price={39000}', 'onToggle={() => console.log(1)}', 'tags={["a", "b"]}'],
      answer: 2,
      explanation: '서버→클라이언트 props는 네트워크를 건너서 직렬화 가능한 값만 돼요. 일반 함수는 안 되고, use server로 만든 서버 함수만 예외예요.',
    },
    {
      id: 're06-4-q6',
      source: 'children으로 서버 컴포넌트 끼우기',
      type: 'mcq',
      question: '클라이언트 컴포넌트(Collapsible) 안에 서버 컴포넌트(Curriculum)를 서버 컴포넌트로 유지한 채 넣는 방법은?',
      choices: ['Collapsible 파일에서 Curriculum을 import 한다', '서버 컴포넌트(page)에서 <Collapsible><Curriculum /></Collapsible> 처럼 children으로 넘긴다', 'Curriculum에도 use client를 붙인다', '불가능하다'],
      answer: 1,
      explanation: '클라이언트 파일에서 import 하면 클라이언트가 돼요. 서버 쪽에서 만든 결과를 children으로 넘기면 서버 컴포넌트로 남아요.',
    },
    {
      id: 're06-4-q7',
      source: 'children으로 서버 컴포넌트 끼우기',
      type: 'ox',
      question: 'Next.js에서 Context Provider를 app/layout.tsx(서버 컴포넌트)에 바로 만들어 useState와 함께 쓸 수 있다.',
      answer: false,
      explanation: "Provider는 훅을 쓰니 'use client' 파일로 따로 만들고, layout에서 children을 감싸요. 그래야 페이지는 서버 컴포넌트로 남아요.",
    },
    {
      id: 're06-4-q8',
      source: '서버 전용 코드 지키기',
      type: 'short',
      question: '이 파일을 클라이언트 컴포넌트에서 import 하면 빌드 에러가 나도록 막는 패키지 이름은? (import \'____\')',
      answer: ['server-only'],
      explanation: 'DB 접속·비밀키를 쓰는 파일에 import "server-only"를 두면 실수로 브라우저 번들에 섞이는 걸 막아요.',
    },
    {
      id: 're06-4-q9',
      source: '서버 전용 코드 지키기',
      type: 'mcq',
      question: 'Next.js에서 브라우저 코드에서도 읽을 수 있는(그래서 누구나 볼 수 있는) 환경변수는?',
      choices: ['DATABASE_URL', 'NEXT_PUBLIC_API_URL', 'API_SECRET', 'SERVER_KEY'],
      answer: 1,
      explanation: 'NEXT_PUBLIC_이 붙은 것만 브라우저 번들에 들어가요. 비밀값에는 절대 붙이지 않아요.',
    },
    {
      id: 're06-4-q10',
      source: '서버 전용 코드 지키기',
      type: 'essay',
      question: '[면접] 서버 컴포넌트와 클라이언트 컴포넌트의 차이와, use client를 어디에 두는지 설명해 주세요.',
      answer: "서버 컴포넌트는 서버에서만 실행되어 코드가 브라우저로 전송되지 않고, async로 DB나 API를 바로 조회할 수 있지만 훅과 이벤트는 쓸 수 없습니다. 클라이언트 컴포넌트는 'use client'로 표시하며, 첫 HTML은 서버에서 그려지고 브라우저에서 하이드레이션되어 상태와 이벤트를 씁니다. 'use client'는 모듈 경계라 그 아래 import가 전부 브라우저 번들에 들어가므로, 버튼이나 폼처럼 상호작용이 필요한 잎 컴포넌트에만 둡니다. 서버에서 클라이언트로는 직렬화 가능한 props와 children만 넘기고, 비밀 코드는 server-only로 보호합니다.",
      keywords: ['서버에서만 실행', 'JS 전송 없음', 'use client는 모듈 경계', '잎에 배치', '직렬화 props', 'children'],
      explanation: '실행 위치·할 수 있는 것의 차이, 경계의 의미, 잎에 두는 이유, props 제약까지 말하면 시니어다운 답이에요.',
    },
  ],
}

export default topic
