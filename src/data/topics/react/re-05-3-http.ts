import type { Topic } from '../../types'

const topic: Topic = {
  id: 're-05-3-http',
  track: 'react',
  group: '05. 라우터·HTTP·CORS·Redux',
  title: '5-3. 서버와 통신하기: fetch와 axios',
  order: 503,
  notionId: '409df951bf8081548b16e7c8671ce171',
  addedAt: '2026-11-05',
  sections: [
    {
      title: 'fetch·axios·jQuery',
      slides: [
        {
          title: '서버에 데이터를 달라고 하는 도구들',
          blocks: [
            { type: 'say', text: '이번 수업은 React 앱이 **서버(백엔드)와 데이터를 주고받는 법**이에요. 풀스택 코스에서 FastAPI랑 연결할 때 바로 쓰는 내용이에요.\n\n도구가 세 가지 있어요.' },
            {
              type: 'table',
              head: ['도구', '정체', '2026년 상황'],
              rows: [
                ['`fetch`', '브라우저와 Node.js에 **내장**', '설치 없음. Next.js는 fetch에 캐시 기능을 얹어서 씀'],
                ['axios', '설치하는 라이브러리', '여전히 많이 쓰임 (회사 코드에 특히)'],
                ['jQuery ajax', 'jQuery의 일부', '새 React 프로젝트에서는 안 씀'],
              ],
            },
            { type: 'say', text: '2-2에서 배운 Promise와 async/await가 여기서 본격적으로 쓰여요. fetch도 axios도 **Promise를 돌려주거든요.**' },
          ],
        },
      ],
    },
    {
      title: 'fetch의 함정: 404는 에러가 아니다',
      slides: [
        {
          title: 'try/catch로 감쌌는데 왜 안 잡히죠?',
          blocks: [
            { type: 'say', text: 'fetch에서 가장 흔한 버그예요. 이 코드를 보세요.' },
            {
              type: 'code',
              code: `try {
  const res = await fetch('/api/courses/999');   // 없는 강의 → 서버가 404
  const course = await res.json();
  setCourse(course);
} catch (e) {
  setError('강의를 불러오지 못했어요');           // 여기로 올까?
}`,
            },
            { type: 'ask', q: '서버가 404를 돌려주면 catch로 갈까요?', a: '**안 가요!** fetch는 404·500 같은 응답을 **에러로 보지 않아요.** "서버가 대답은 했잖아"라고 생각하거든요.\nfetch가 에러를 던지는 건 인터넷이 끊기거나 서버에 아예 닿지 못한 **네트워크 실패** 때뿐이에요. 그래서 위 코드는 404 에러 내용(`{ error: "없음" }`)을 강의 데이터인 줄 알고 화면에 넣어 버려요.' },
          ],
        },
        {
          title: 'res.ok를 꼭 확인해요',
          blocks: [
            {
              type: 'code',
              code: `const res = await fetch('/api/courses/999');
if (!res.ok) throw new Error(\`HTTP \${res.status}\`);   // 이 줄이 핵심!
const course = await res.json();`,
            },
            { type: 'say', text: '`res.ok`는 상태 코드가 200~299면 true예요. 이걸 직접 확인해서 아니면 에러를 던져야 catch로 가요.' },
            { type: 'note', tone: 'analogy', text: '택배 기사(fetch)는 "택배를 배달했어요"까지만 책임져요. 상자 안에 든 게 주문한 물건인지 "품절 안내문"인지는 **내가 열어 보고(res.ok) 확인**해야 해요. 택배 기사가 에러를 내는 건 트럭이 고장 나서 아예 못 왔을 때뿐이에요.' },
          ],
        },
      ],
    },
    {
      title: 'fetch vs axios',
      slides: [
        {
          title: '같은 일, 다른 모양',
          blocks: [
            {
              type: 'table',
              head: ['', 'fetch', 'axios'],
              rows: [
                ['404·500 응답', '**에러로 안 봄** — `res.ok` 직접 확인', '바로 에러(throw)'],
                ['JSON 변환', '`await res.json()` 직접', '`res.data`에 이미 객체'],
                ['공통 설정 (기본 주소, 토큰 자동 첨부)', '함수로 직접 감싸서 만듦', '인스턴스·인터셉터 제공'],
                ['설치', '필요 없음', '필요'],
              ],
            },
            {
              type: 'code',
              code: `// fetch
const res = await fetch('/api/courses/7');
if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
const course = await res.json();

// axios
const { data: course } = await axios.get('/api/courses/7');   // 404면 알아서 throw`,
            },
          ],
        },
        {
          title: '그래서 뭘 써요?',
          blocks: [
            { type: 'say', text: 'axios가 편해 보이죠. 실제로 회사 코드에 많아요. 그런데 요즘은 **fetch로 충분하면 fetch**를 쓰는 쪽으로 가고 있어요. 이유는 두 가지예요.\n• **Next.js**가 fetch에 캐시·재검증 기능을 얹어 놔서, axios로는 그 기능을 못 써요\n• 설치하는 패키지가 하나 줄면 **보안 위험**도 하나 줄어요 (이 수업 마지막 개념)' },
            { type: 'say', text: 'axios의 편한 점(res.ok 확인, JSON 변환, 기본 주소)은 다음 개념처럼 **작은 함수 하나로** 직접 만들 수 있어요.' },
          ],
        },
      ],
    },
    {
      title: 'API 호출은 한 곳에 모으기',
      slides: [
        {
          title: '컴포넌트마다 fetch를 쓰면',
          blocks: [
            { type: 'say', text: '컴포넌트 20개가 각자 `fetch(\'http://localhost:8000/...\')`를 쓰고 있다고 해 볼게요. 배포하면서 서버 주소가 바뀌면? 20군데를 고쳐야 해요. res.ok 확인을 빼먹은 곳도 분명 있을 거고요.' },
            {
              type: 'code',
              code: `// src/api/client.ts — 딱 한 곳에
const BASE = import.meta.env.VITE_API_URL ?? '';
// 개발: '' (다음 수업의 프록시 사용), 배포: 'https://api.mysite.com'

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(\`\${BASE}\${path}\`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });
  if (!res.ok) throw new Error(\`HTTP \${res.status} \${path}\`);   // 404·500도 에러로
  return res.json() as Promise<T>;
}`,
            },
          ],
        },
        {
          title: '쓰는 쪽은 한 줄',
          blocks: [
            { type: 'code', code: `const course = await api<Course>('/api/courses/7');   // 타입까지 붙어서 나옴` },
            {
              type: 'list',
              items: [
                '서버 주소는 **환경변수** `VITE_API_URL`로 받아요. 코드를 안 고치고 개발·배포 주소를 바꿀 수 있어요',
                '`res.ok` 확인과 JSON 변환을 **한 번만** 짰으니 빼먹을 일이 없어요',
                '2-3의 **제네릭** `<T>`로 "이 호출은 Course를 돌려줘요"라고 타입을 붙여요',
                '로그인 토큰 첨부 같은 공통 기능도 여기 한 곳에 넣으면 돼요',
              ],
            },
            { type: 'note', tone: 'warn', text: 'Vite에서는 `VITE_`로 시작하는 환경변수만 브라우저 코드에 들어가요. 그 말은 **누구나 볼 수 있다**는 뜻이에요. API 비밀키 같은 건 절대 `VITE_` 변수에 넣지 마세요. 비밀은 서버에만 둬요.' },
          ],
        },
      ],
    },
    {
      title: '패키지 공급망 공격과 npm ci',
      slides: [
        {
          title: '2026년 3월 31일, axios에 생긴 일',
          blocks: [
            { type: 'say', text: '실제로 일어난 사건 하나를 알려 줄게요. 2026년 3월 31일, axios 메인테이너의 npm 계정이 탈취돼서 **악성 버전 `axios@1.14.1`과 `0.30.4`** 가 몇 시간 동안 npm에 올라갔어요. 설치하면 원격 제어 악성코드가 같이 깔리는 버전이었어요. 지금은 지워졌고, 최신 버전은 안전해요.' },
            { type: 'say', text: '이렇게 **내가 쓰는 패키지를 통해 들어오는 공격**을 **공급망 공격**이라고 해요. 내 코드가 아무리 안전해도, 설치한 패키지가 오염되면 끝이에요.' },
            { type: 'ask', q: 'package.json에 "axios": "^1.14.0" 이라고 적혀 있었다면, 그날 npm install을 한 사람은 어떻게 됐을까요?', a: '`^1.14.0`은 "1.x 중에서 1.14.0 이상 최신"이라는 뜻이에요. 그날 install 한 사람은 **악성 1.14.1이 자동으로** 깔렸을 수 있어요. 본인은 아무것도 안 바꿨는데도요.' },
          ],
        },
        {
          title: '두 가지 습관',
          blocks: [
            {
              type: 'list',
              ordered: true,
              items: [
                '**내장 기능으로 충분하면 패키지를 늘리지 않는다.** fetch로 되는데 axios를 깔 필요가 있는지 한 번 생각해요.',
                '**package-lock.json을 커밋하고, 배포·CI에서는 `npm ci`로 설치한다.** lock 파일에 적힌 정확한 버전만 깔아서 "갑자기 새 버전이 설치되는 일"을 막아요 (1-3에서 배운 명령이에요).',
              ],
            },
            { type: 'note', tone: 'tip', text: '시니어 면접에서 "의존성 관리는 어떻게 하세요?"라는 질문이 나오면 이 사건과 lock 파일·npm ci 얘기를 하면 좋아요. 보안을 생각하는 개발자라는 인상을 줘요.' },
            { type: 'say', text: '수업 끝! 확인 문제 가요.' },
          ],
        },
      ],
    },
  ],
  questions: [
    {
      id: 're05-3-q1',
      source: 'fetch·axios·jQuery',
      type: 'ox',
      question: 'fetch를 쓰려면 npm으로 따로 설치해야 한다.',
      answer: false,
      explanation: 'fetch는 브라우저와 Node.js에 내장돼 있어요. axios는 설치가 필요해요.',
    },
    {
      id: 're05-3-q2',
      source: 'fetch의 함정: 404는 에러가 아니다',
      type: 'mcq',
      question: 'try { const res = await fetch(url); ... } catch {} 에서 서버가 404를 돌려주면?',
      choices: ['catch로 간다', 'catch로 가지 않는다 (res.ok가 false인 정상 응답으로 처리됨)', '브라우저가 멈춘다', '자동으로 다시 요청한다'],
      answer: 1,
      explanation: 'fetch는 응답이 오기만 하면 성공으로 봐요. 에러를 던지는 건 네트워크 실패 때뿐이라 res.ok를 직접 확인해야 해요.',
    },
    {
      id: 're05-3-q3',
      source: 'fetch의 함정: 404는 에러가 아니다',
      type: 'short',
      question: 'fetch 응답의 상태 코드가 200~299인지 알려 주는 속성은? (res.__)',
      answer: ['ok', 'res.ok'],
      explanation: 'if (!res.ok) throw new Error(...)로 404·500을 에러로 바꿔요.',
    },
    {
      id: 're05-3-q4',
      source: 'fetch vs axios',
      type: 'mcq',
      question: 'axios와 fetch의 차이로 옳은 것은?',
      choices: ['axios는 404를 에러로 던지고 JSON을 자동 변환한다', 'fetch는 404를 에러로 던진다', 'axios는 브라우저에 내장돼 있다', '둘은 완전히 같다'],
      answer: 0,
      explanation: 'axios는 2xx가 아니면 바로 에러를 던지고 res.data에 객체를 줘요. fetch는 res.ok 확인과 res.json()을 직접 해야 해요.',
    },
    {
      id: 're05-3-q5',
      source: 'API 호출은 한 곳에 모으기',
      type: 'mcq',
      question: 'API 호출 함수를 src/api/client.ts 한 곳에 모으는 이유로 가장 알맞은 것은?',
      choices: ['파일 수를 줄이려고', '서버 주소·에러 처리·토큰 첨부를 한 곳에서 관리해 빼먹지 않고 쉽게 바꾸려고', '번들 크기를 0으로 만들려고', 'CORS를 없애려고'],
      answer: 1,
      explanation: '주소가 바뀌거나 공통 처리를 추가할 때 한 곳만 고치면 돼요. 각 컴포넌트는 api<Course>(...) 한 줄만 써요.',
    },
    {
      id: 're05-3-q6',
      source: 'API 호출은 한 곳에 모으기',
      type: 'ox',
      question: 'Vite의 VITE_ 로 시작하는 환경변수에 API 비밀키를 넣으면 브라우저 사용자에게 노출되지 않는다.',
      answer: false,
      explanation: 'VITE_ 변수는 브라우저 번들에 그대로 들어가서 누구나 볼 수 있어요. 비밀키는 서버에만 둬요.',
    },
    {
      id: 're05-3-q7',
      source: '패키지 공급망 공격과 npm ci',
      type: 'mcq',
      question: '공급망 공격으로 오염된 새 버전이 "갑자기" 설치되는 것을 막는 데 가장 도움이 되는 습관은?',
      choices: ['npm install -g 로 설치한다', 'package-lock.json을 커밋하고 배포·CI에서는 npm ci로 설치한다', 'node_modules를 GitHub에 올린다', '패키지를 매일 최신으로 올린다'],
      answer: 1,
      explanation: 'npm ci는 lock 파일에 적힌 정확한 버전만 설치해요. ^ 범위 때문에 새 버전이 자동으로 깔리는 일을 막아요.',
    },
    {
      id: 're05-3-q8',
      source: '패키지 공급망 공격과 npm ci',
      type: 'mcq',
      question: 'package.json의 "axios": "^1.14.0" 이 뜻하는 것은?',
      choices: ['정확히 1.14.0만', '1.x 중 1.14.0 이상의 최신 버전', '1.14.0 이하', '2.0.0 이상'],
      answer: 1,
      explanation: '^는 같은 메이저(1.x) 안에서 최신을 허용해요. 그래서 lock 파일 없이 install 하면 새로 올라온 버전이 깔릴 수 있어요.',
    },
  ],
}

export default topic
