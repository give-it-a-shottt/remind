import type { Topic } from '../../types'

const topic: Topic = {
  id: 'fs-01-3-cors-screen',
  track: 'fullstack',
  group: '01. 웹의 기본: HTTP·API·CORS',
  title: '1-3. 화면에 데이터 띄우기와 CORS',
  order: 103,
  notionId: '3fddf951bf8080518c67fb1a903277a1',
  addedAt: '2026-11-06',
  sections: [
    {
      title: '누가 누구에게 요청하나',
      slides: [
        {
          title: '등장인물 셋',
          blocks: [
            { type: 'say', text: '이제 1-2에서 만든 강의 3개를 **Next.js 화면에** 띄워 볼 거예요. 등장인물이 셋으로 늘어나요.' },
            {
              type: 'table',
              head: ['등장인물', '주소', '하는 일'],
              rows: [
                ['Next.js 서버', '`localhost:3000`', '화면 설계도(HTML + JS) 전달'],
                ['브라우저', '-', '설계도를 실행하고, `fetch` 요청을 보냄'],
                ['FastAPI', '`localhost:8000`', '강의 데이터 JSON 응답'],
              ],
            },
            { type: 'ask', q: 'Next.js 화면 코드 안의 fetch("http://localhost:8000/courses")는 누가 실행할까요? Next.js 서버? 브라우저?', a: '**브라우저**예요. 특히 `useEffect` 안의 코드는 브라우저에서만 실행돼요. Next.js 서버는 "어떻게 그릴지, 어떤 요청을 보낼지" 설계도를 주고, 실제로 요청을 보내고 화면을 그리는 건 브라우저예요.' },
          ],
        },
      ],
    },
    {
      title: '출처와 CORS',
      slides: [
        {
          title: '포트가 다르면 다른 출처',
          blocks: [
            { type: 'say', text: '코드를 짜고 실행하면 이런 빨간 에러를 만나요. 거의 모든 풀스택 입문자가 만나는 벽이에요.' },
            { type: 'code', code: `Access to fetch at 'http://localhost:8000/courses'
from origin 'http://localhost:3000' has been blocked by CORS policy:
No 'Access-Control-Allow-Origin' header is present on the requested resource.` },
            { type: 'say', text: '**출처(origin) = 프로토콜 + 주소 + 포트**예요. 경로는 포함하지 않아요. `localhost`가 같아도 포트가 3000과 8000으로 다르면 **다른 출처**예요.\n\n브라우저는 **동일 출처 정책**에 따라, 다른 출처에서 온 응답은 서버가 허락하지 않으면 JS에 넘겨주지 않아요.' },
          ],
        },
        {
          title: '서버는 200인데 화면엔 없어요',
          blocks: [
            { type: 'code', code: `# FastAPI 터미널
INFO: 127.0.0.1:56041 - "GET /courses HTTP/1.1" 200 OK   ← 서버는 응답했어요!` },
            { type: 'say', text: '이게 CORS 에러의 특징이에요. 요청은 서버에 **도착했고**, 서버는 **200으로 응답까지** 했어요. 그런데 브라우저가 응답을 받아 보니 "3000번에게 보여 줘도 된다"는 **허가증**(`Access-Control-Allow-Origin` 헤더)이 없어서, JS 손에 쥐여주지 않은 거예요.' },
            { type: 'note', tone: 'warn', text: '"CORS가 막는다"는 말은 반만 맞아요. **막는 건 브라우저의 동일 출처 정책**이고, **CORS는 서버가 "이 출처는 괜찮아요"라고 풀어 주는 규칙**이에요. 그래서 고칠 곳은 프론트가 아니라 **서버**예요.' },
            { type: 'ask', q: '허가증은 왜 서버가 붙여야 할까요? 프론트에서 "나 허가됐어요"라고 하면 안 될까요?', a: '프론트가 스스로 허가할 수 있다면 **아무 사이트나** "나 허가됐어요"라고 우길 수 있겠죠. "내 데이터를 누구에게 보여 줄지"는 **데이터 주인(서버)** 이 정해야 해요. 허가증은 응답 헤더에 붙고, 응답을 만드는 건 서버뿐이에요.' },
          ],
        },
      ],
    },
    {
      title: 'CORSMiddleware 설정',
      slides: [
        {
          title: 'FastAPI에 허가증 붙이기',
          blocks: [
            {
              type: 'code',
              code: `from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],   # 출처 = 프로토콜+주소+포트, 끝에 / 금지
    allow_methods=["*"],                       # 허락할 메서드
    allow_headers=["*"],                       # 허락할 요청 헤더 "이름"
)`,
            },
            {
              type: 'table',
              head: ['설정', '허락하는 것', '주의'],
              rows: [
                ['`allow_origins`', '출처 목록', '글자 그대로 비교. `"http://localhost:3000/"`처럼 끝에 `/`가 붙으면 불일치'],
                ['`allow_methods`', 'GET·POST 등', '`["*"]` = 전부'],
                ['`allow_headers`', '요청 헤더의 **이름**', '경로(`/courses`)를 넣는 칸이 아님'],
              ],
            },
          ],
        },
        {
          title: 'CORS는 사용자를 지켜요',
          blocks: [
            { type: 'say', text: '"서버 비용을 아끼려고 CORS가 있다"고 생각하기 쉬운데, 서버는 이미 200으로 응답했으니 비용과는 상관없어요.\n\n은행 사이트에 로그인한 채로 수상한 사이트 탭을 열었다고 상상해 보세요. 그 사이트의 JS가 **내 브라우저를 빌려서** 은행 데이터를 읽어 가면 큰일이죠. CORS(동일 출처 정책)는 이걸 막아 **사용자**를 지키는 규칙이에요.' },
            { type: 'note', tone: 'warn', text: 'CORS는 **브라우저만** 지키는 규칙이에요. curl이나 Postman, 서버끼리의 요청은 CORS 설정과 상관없이 데이터를 받아요. 그래서 CORS는 서버 보안 장치가 **아니에요.** 진짜로 서버 데이터를 지키려면 로그인(인증·권한)이 필요해요.' },
            { type: 'note', tone: 'tip', text: 'JSON을 보내는 POST처럼 "단순하지 않은 요청"은 브라우저가 진짜 요청 전에 `OPTIONS`로 **미리 물어봐요**(preflight). 허락이 없으면 진짜 요청은 아예 안 보내요. 나중에 수강 신청(POST)을 만들 때 FastAPI 터미널에 OPTIONS만 찍히면 이걸 떠올리세요. React 트랙 5-4에서 더 자세히 다뤄요.' },
          ],
        },
      ],
    },
    {
      title: 'useState로 화면에 신호 보내기',
      slides: [
        {
          title: '받은 데이터를 화면에',
          blocks: [
            {
              type: 'code',
              code: `// frontend/pages/courses.tsx
import { useEffect, useState } from "react";

type Course = { id: number; title: string; price: number };

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);   // 응답 모양 [ {}, {}, {} ] 그대로
  useEffect(() => {
    fetch("http://localhost:8000/courses")
      .then((res) => res.json())
      .then((data) => setCourses(data));                  // React에게 "값 바뀜" 신호
  }, []);
  return (
    <>
      <h1>강의 목록</h1>
      <ol>{courses.map((c) => <li key={c.id}>{c.title}</li>)}</ol>
    </>
  );
}`,
            },
          ],
        },
        {
          title: '일반 변수로는 안 되는 이유',
          blocks: [
            { type: 'ask', q: 'setCourses 대신 일반 변수 list = data 에 넣으면 화면에 강의가 뜰까요?', a: '**안 떠요.** 순서를 보면 ① 컴포넌트 실행(목록 비어 있음) → ② 화면을 빈 채로 그림 → ③ useEffect가 fetch 출발 → ④ 나중에 응답 도착. 화면은 ②에서 이미 그려졌고, React는 일반 변수를 **지켜보지 않아요.**\n`setCourses(data)`를 **부르는 것 자체가** "값 바뀌었어요, 다시 그려 주세요"라는 **신호**예요.' },
            { type: 'note', tone: 'warn', text: '`useState([])`만 쓰면 TypeScript가 빈 배열만 보고 "아무것도 못 들어오는 배열(`never[]`)"로 추측해서 `course.id`에 빨간 줄이 생겨요. 응답 모양대로 `type Course`를 만들고 `useState<Course[]>([])`로 빈칸을 채워 주세요.' },
            { type: 'note', tone: 'tip', text: '`useEffect(() => {...}, [])`의 두 번째 `[]`는 "처음 한 번만 실행"이에요. 빼면 setCourses → 다시 그림 → 또 fetch → … **무한 요청**이 돼요. (React 트랙 4-2에서 자세히)' },
          ],
        },
      ],
    },
    {
      title: 'Pages Router와 App Router',
      slides: [
        {
          title: '이 코스는 Pages Router',
          blocks: [
            { type: 'say', text: 'Next.js에는 주소를 정하는 방식이 두 가지 있어요. 이 코스의 미니 인프런은 **Pages Router**로 만들어요.' },
            {
              type: 'table',
              head: ['방식', '/courses 파일', '주소를 정하는 것'],
              rows: [
                ['**Pages Router** (이 코스)', '`pages/courses.tsx`', '파일 이름'],
                ['App Router', '`app/courses/page.tsx`', '폴더 이름 + 고정 파일 `page.tsx`'],
              ],
            },
            { type: 'note', tone: 'warn', text: '`npx create-next-app@latest`에서 "recommended defaults"를 고르면 **App Router**(+ Tailwind)로 설치돼요. 이 코스를 따라오려면 "No, customize settings" → TypeScript Yes → App Router **No**로 골라 주세요. 설치 후 `pages/` 폴더가 있어야 해요.' },
            { type: 'say', text: '오늘 방식은 빈 화면을 먼저 그리고 브라우저가 데이터를 채우는 **CSR**이에요. 4장에서 Next.js 서버가 데이터를 미리 받아 HTML에 채워 보내는 **SSR**로 바꿀 거예요. 그때는 서버끼리 요청하니까 **CORS가 필요 없어져요.**\n\n1장 끝! 확인 문제 가요.' },
          ],
        },
      ],
    },
  ],
  questions: [
    {
      id: 'fs01-3-q1',
      source: '누가 누구에게 요청하나',
      type: 'mcq',
      question: 'useEffect 안의 fetch("http://localhost:8000/courses")를 실행하는 것은?',
      choices: ['Next.js 서버', '브라우저', 'FastAPI', 'Postgres'],
      answer: 1,
      explanation: 'useEffect 안의 코드는 브라우저에서만 실행돼요. 브라우저가 FastAPI에 요청을 보내요.',
    },
    {
      id: 'fs01-3-q2',
      source: '출처와 CORS',
      type: 'ox',
      question: 'localhost:3000과 localhost:8000은 같은 컴퓨터라서 같은 출처다.',
      answer: false,
      explanation: '출처는 프로토콜+주소+포트예요. 포트가 다르면 다른 출처라서 CORS 허락이 필요해요.',
    },
    {
      id: 'fs01-3-q3',
      source: '출처와 CORS',
      type: 'mcq',
      question: 'GET 요청에서 CORS 에러가 났을 때 FastAPI 터미널에는 무엇이 찍혀 있을까?',
      choices: ['아무것도 안 찍힌다', '"GET /courses" 200 OK', '500 에러', 'CORS 에러 메시지'],
      answer: 1,
      explanation: '서버는 요청을 받고 200으로 응답했어요. 허가증이 없어서 브라우저가 JS에 안 넘긴 거예요.',
    },
    {
      id: 'fs01-3-q4',
      source: 'CORSMiddleware 설정',
      type: 'mcq',
      question: 'allow_origins에 넣을 값으로 올바른 것은?',
      choices: ['"http://localhost:3000/"', '"http://localhost:3000"', '"localhost"', '"/courses"'],
      answer: 1,
      explanation: '출처는 경로를 포함하지 않고 글자 그대로 비교해요. 끝에 /가 붙으면 다른 값이 돼요.',
    },
    {
      id: 'fs01-3-q5',
      source: 'CORSMiddleware 설정',
      type: 'ox',
      question: 'FastAPI에 CORS를 설정하면 curl이나 Postman 같은 도구의 요청도 막을 수 있다.',
      answer: false,
      explanation: 'CORS는 브라우저만 지키는 규칙이에요. 서버 데이터 보호는 로그인(인증·권한)으로 해야 해요.',
    },
    {
      id: 'fs01-3-q6',
      source: 'useState로 화면에 신호 보내기',
      type: 'mcq',
      question: 'fetch로 받은 데이터를 화면에 그리려면?',
      choices: ['일반 변수에 넣는다', 'setCourses(data)처럼 state의 set 함수를 불러 React에 신호를 보낸다', 'console.log로 찍는다', 'window에 저장한다'],
      answer: 1,
      explanation: 'React는 일반 변수를 지켜보지 않아요. set 함수 호출이 "다시 그려 주세요" 신호예요.',
    },
    {
      id: 'fs01-3-q7',
      source: 'Pages Router와 App Router',
      type: 'short',
      question: 'Pages Router에서 /courses 화면을 만드는 파일 경로는? (pages/______.tsx)',
      answer: ['courses', 'pages/courses.tsx', 'courses.tsx'],
      explanation: 'Pages Router는 파일 이름이 주소예요. App Router라면 app/courses/page.tsx예요.',
    },
  ],
}

export default topic
