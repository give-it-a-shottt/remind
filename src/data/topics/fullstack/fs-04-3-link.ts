import type { Topic } from '../../types'

const topic: Topic = {
  id: 'fs-04-3-link',
  track: 'fullstack',
  group: '04. Next.js 화면 만들기',
  title: '4-3. 목록에서 상세로: Link',
  order: 403,
  notionId: '40edf951bf80804ba3a1ddddbbd34a37',
  addedAt: '2026-11-06',
  sections: [
    {
      title: '<a> 대신 <Link>',
      slides: [
        {
          title: '목록과 상세를 이어 주기',
          blocks: [
            { type: 'say', text: '풀스택 코스 마지막 수업이에요! 4-1의 목록과 4-2의 상세를 **이어 줄** 차례예요. 강의 제목을 누르면 상세로 가게 해 볼게요.' },
            {
              type: 'code',
              code: `import Link from "next/link";

export default function Courses({ courses }: { courses: Course[] }) {
  return (
    <ol>
      {courses.map((c) => (
        <li key={c.id}>
          <Link href={\`/courses/\${c.id}\`}>{c.title}</Link>
        </li>
      ))}
    </ol>
  );
}`,
            },
            { type: 'say', text: '`href`에 템플릿 리터럴(React 트랙 2-1)로 `/courses/1`, `/courses/2`… 주소를 만들어요. 4-2의 `[id].tsx`가 이 주소들을 받아요.' },
          ],
        },
        {
          title: '<a href>와 뭐가 달라요',
          blocks: [
            {
              type: 'table',
              head: ['', '`<a href>`', '`<Link href>`'],
              rows: [
                ['이동 방식', '페이지를 **통째로 새로** 받음 (화면 깜빡, 모든 JS 다시)', '**바뀐 부분만** 갈아 끼움'],
                ['state', '전부 날아감', '유지 (공통 레이아웃 등)'],
                ['속도', '느림', '빠름 (+ 미리 받아 두기)'],
                ['쓰는 곳', '외부 사이트', '앱 안의 이동'],
              ],
            },
            { type: 'say', text: 'React 트랙 5-1에서 React Router의 Link를 배웠죠? Next.js의 `next/link`도 같은 역할이에요. 앱 안에서 움직일 때는 항상 Link를 써요.' },
          ],
        },
      ],
    },
    {
      title: 'Link로 이동하면 SSR은 어떻게 될까',
      slides: [
        {
          title: '그래도 getServerSideProps는 실행돼요',
          blocks: [
            { type: 'ask', q: '목록에서 Link로 상세로 이동하면, 페이지를 새로 받지 않으니까 상세 페이지의 getServerSideProps는 실행되지 않을까요?', a: '**실행돼요.** Link로 이동하면 Next.js가 브라우저에서 서버에 "이 페이지의 **데이터만** 주세요"라고 따로 요청해요. 서버는 getServerSideProps를 실행해서 **props를 JSON으로만** 돌려주고, 브라우저는 그걸로 화면을 바꿔 그려요.\n처음 접속할 때는 **HTML 전체**, Link로 이동할 때는 **데이터(JSON)만**. 그래서 이동이 빠르면서도 데이터는 항상 서버에서 가져와요.' },
            {
              type: 'table',
              head: ['', '처음 접속 / 새로고침', 'Link로 이동'],
              rows: [
                ['getServerSideProps', '서버에서 실행', '서버에서 실행'],
                ['브라우저가 받는 것', '완성된 HTML', 'props JSON만'],
                ['화면', '처음부터 그림', '바뀐 부분만 다시 그림'],
              ],
            },
            { type: 'note', tone: 'tip', text: '개발자 도구 Network 탭을 열고 강의를 클릭해 보세요. `_next/data/.../courses/3.json` 같은 요청이 보여요. 그게 "데이터만 주세요" 요청이에요.' },
          ],
        },
        {
          title: '미리 받아 두기',
          blocks: [
            { type: 'say', text: '배포용 빌드(`npm run build && npm start`)에서는 Link가 **화면에 보이면** 그 페이지의 JS 파일을 **미리** 받아 둬요(prefetch). 그래서 클릭하는 순간 바로 이동할 준비가 돼 있어요. 개발 모드에서는 이 기능이 꺼져 있어서 차이를 느끼려면 빌드해서 확인해야 해요.' },
            { type: 'note', tone: 'tip', text: 'getServerSideProps 페이지는 **데이터는** 미리 받지 않아요(요청마다 새 데이터가 필요하니까). 미리 받는 건 페이지를 그릴 **코드**예요.' },
          ],
        },
      ],
    },
    {
      title: '풀스택 코스 정리',
      slides: [
        {
          title: '처음부터 끝까지 한 번에',
          blocks: [
            { type: 'say', text: '축하해요! 미니 인프런의 **첫 번째 기능 한 바퀴**가 완성됐어요. 강의 제목 하나를 누르는 순간 일어나는 일을 이제 처음부터 끝까지 설명할 수 있어요.' },
            {
              type: 'code',
              code: `강의 제목 클릭 (Link, 4-3)
  ↓
Next.js가 /courses/3 데이터 요청
  ↓
getServerSideProps (4-2)
  ↓ fetch (서버끼리, CORS 없음)
FastAPI GET /courses/{id} (3-4)
  ↓ Depends(get_db) (3-2)
SQLAlchemy → psycopg → Postgres (3-1)
  ↓ courses 테이블 (2-4, Docker 2-3)
Pydantic CourseOut으로 응답 (3-3)
  ↓ 200 JSON { } 또는 404 (1-1)
props → 화면 (4-2)`,
            },
          ],
        },
        {
          title: '다음에 만들 것',
          blocks: [
            {
              type: 'table',
              head: ['다음 기능', '새로 배울 것', '이미 배운 것과 연결'],
              rows: [
                ['수강 신청', 'POST + 중복 방지(409), 트랜잭션', '1-1 메서드, 2-2 동시성, 3-1 commit'],
                ['로그인', '비밀번호 암호화, 세션·JWT, 쿠키', '1-3 CORS는 보안이 아님 → 인증이 필요'],
                ['내 강의 (마이페이지)', '로그인 사용자별 데이터, CSR', '4-1 "공개 페이지는 SSR, 개인 화면은 CSR"'],
                ['배포', '환경변수, 서버 주소, CORS 출처 바꾸기', '3-1 DATABASE_URL, 1-3 allow_origins'],
              ],
            },
            { type: 'say', text: '앞으로 미니 인프런을 키우면서 새로 배운 건 노션에 정리해 주세요. 그 노트가 이 코스의 다음 장이 돼요. 더 깊은 React·Next.js 내용(App Router, 캐시, TanStack Query)은 **React 트랙 6~7장**에 있어요.\n\n풀스택 코스 끝! 정말 고생했어요. 마지막 확인 문제 가요. 🎉' },
          ],
        },
      ],
    },
  ],
  questions: [
    {
      id: 'fs04-3-q1',
      source: '<a> 대신 <Link>',
      type: 'mcq',
      question: '강의 목록에서 상세로 이동하는 링크로 알맞은 코드는?',
      choices: ['<a href={`/courses/${c.id}`}>', '<Link href={`/courses/${c.id}`}>', '<button onClick={() => location.reload()}>', '<Link to="/courses/:id">'],
      answer: 1,
      explanation: '앱 안의 이동은 next/link의 Link로 해요. href에 실제 주소를 템플릿 리터럴로 만들어요.',
    },
    {
      id: 'fs04-3-q2',
      source: '<a> 대신 <Link>',
      type: 'ox',
      question: '<a href>로 앱 안을 이동하면 페이지를 통째로 새로 받아서 state가 날아가고 느려진다.',
      answer: true,
      explanation: 'Link는 바뀐 부분만 갈아 끼워서 빠르고 state가 유지돼요. a는 외부 사이트에 써요.',
    },
    {
      id: 'fs04-3-q3',
      source: 'Link로 이동하면 SSR은 어떻게 될까',
      type: 'mcq',
      question: 'Link로 getServerSideProps가 있는 상세 페이지로 이동하면?',
      choices: ['getServerSideProps가 실행되지 않는다', 'getServerSideProps가 서버에서 실행되고, 브라우저는 props JSON만 받아 화면을 바꾼다', '완성된 HTML 전체를 다시 받는다', '브라우저에서 getServerSideProps가 실행된다'],
      answer: 1,
      explanation: '처음 접속은 HTML 전체, Link 이동은 데이터(JSON)만이에요. Network 탭의 _next/data 요청이 그거예요.',
    },
    {
      id: 'fs04-3-q4',
      source: '풀스택 코스 정리',
      type: 'essay',
      question: '[면접] 사용자가 강의 목록에서 강의 하나를 클릭했을 때, 화면에 상세 정보가 뜨기까지 무슨 일이 일어나는지 처음부터 끝까지 설명해 주세요.',
      answer: 'Next.js의 Link로 이동하면 브라우저가 Next.js 서버에 해당 페이지의 데이터만 요청합니다. Next.js 서버는 pages/courses/[id].tsx의 getServerSideProps를 실행하고, context.params의 id로 FastAPI의 GET /courses/{id}에 요청합니다. 서버끼리의 요청이라 CORS는 필요 없습니다. FastAPI는 Depends로 요청마다 DB 세션을 받아 SQLAlchemy로 courses 테이블을 기본 키로 조회하고, 없으면 HTTPException으로 404를, 있으면 Pydantic 응답 모델로 걸러 200 JSON을 돌려줍니다. Next.js는 404면 notFound로 404 페이지를, 성공하면 props로 컴포넌트에 넘겨 화면을 그리고, 브라우저는 받은 props로 바뀐 부분만 다시 그립니다.',
      keywords: ['Link', 'getServerSideProps', 'context.params', 'FastAPI 경로 파라미터', 'Depends·세션', 'SQLAlchemy', '404·notFound', 'Pydantic', 'CORS 불필요'],
      explanation: '정답보다 흐름이 중요해요. 프론트 → Next.js 서버 → FastAPI → DB → 다시 화면까지, 각 단계의 도구와 실패 처리를 말하면 풀스택 답변이 돼요.',
    },
  ],
}

export default topic
