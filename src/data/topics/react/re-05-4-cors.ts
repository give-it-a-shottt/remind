import type { Topic } from '../../types'

const topic: Topic = {
  id: 're-05-4-cors',
  track: 'react',
  group: '05. 라우터·HTTP·CORS·Redux',
  title: '5-4. CORS와 프록시',
  order: 504,
  notionId: '409df951bf8081548b16e7c8671ce171',
  addedAt: '2026-11-05',
  sections: [
    {
      title: '오리진이란',
      slides: [
        {
          title: '풀스택 개발자의 첫 번째 벽',
          blocks: [
            { type: 'say', text: '이번 수업은 프론트와 백엔드를 처음 연결할 때 **거의 100%** 만나는 에러예요.\n\nVite(5173번)에서 FastAPI(8000번)를 부르면 콘솔에 빨간 글씨가 떠요.' },
            { type: 'code', code: `Access to fetch at 'http://localhost:8000/api/hello' from origin
'http://localhost:5173' has been blocked by CORS policy:
No 'Access-Control-Allow-Origin' header is present on the requested resource.` },
            { type: 'say', text: '"같은 내 컴퓨터인데 왜 막혀요?" 다들 여기서 막혀요. 이걸 이해하려면 먼저 **오리진(origin)** 을 알아야 해요.' },
          ],
        },
        {
          title: '프로토콜 + 도메인 + 포트',
          blocks: [
            { type: 'say', text: '오리진은 "같은 컴퓨터"가 아니라 **주소의 앞부분 세 가지**예요. **프로토콜 + 도메인 + 포트**가 **전부** 같아야 같은 오리진이에요.' },
            {
              type: 'table',
              head: ['비교', '같은 오리진?', '이유'],
              rows: [
                ['`http://localhost:5173` vs `http://localhost:5173/api`', '같음', '경로(`/api`)는 상관없음'],
                ['`http://localhost:5173` vs `http://localhost:8000`', '**다름**', '같은 컴퓨터지만 **포트**가 다름'],
                ['`https://inflearn.com` vs `https://api.inflearn.com`', '**다름**', '**도메인**(서브도메인)이 다름'],
                ['`http://site.com` vs `https://site.com`', '**다름**', '**프로토콜**이 다름'],
              ],
            },
            { type: 'note', tone: 'analogy', text: '오리진은 **아파트 동·호수**예요. 같은 아파트 단지(같은 컴퓨터)라도 101동 501호와 101동 802호(다른 포트)는 다른 집이에요.' },
          ],
        },
      ],
    },
    {
      title: 'CORS는 브라우저가 막는다',
      slides: [
        {
          title: '서버는 이미 대답했어요',
          blocks: [
            { type: 'say', text: '여기 정말 중요한 사실이 있어요. 위 에러가 났을 때 FastAPI 서버 로그를 보면, **요청은 도착했고 서버는 응답까지 보냈어요.**\n\n막은 건 서버가 아니라 **브라우저**예요. 브라우저가 응답을 받아 보고 "어, 이 응답에 \'5173번한테 보여 줘도 됨\'이라는 **허락서**(`Access-Control-Allow-Origin` 헤더)가 없네?" 하고 **자바스크립트에 결과를 안 넘겨준** 거예요.' },
            { type: 'say', text: '이 규칙을 **CORS**(Cross-Origin Resource Sharing, 다른 오리진 사이의 자원 공유) 정책이라고 해요. 정확히는 "다른 오리진의 응답은 **서버가 허락했을 때만** 읽게 해 준다"는 규칙이에요.' },
          ],
        },
        {
          title: '왜 이런 규칙이 있을까',
          blocks: [
            { type: 'ask', q: '이런 귀찮은 규칙이 왜 있을까요? 힌트: 내가 은행 사이트에 로그인한 채로 이상한 사이트에 들어갔다면?', a: '그 이상한 사이트의 자바스크립트가 **내 브라우저에 저장된 로그인 정보로** 은행 API를 불러서, 내 계좌 내역을 **읽어 갈** 수 있겠죠. CORS는 이걸 막아요. 은행 서버가 "우리 사이트만 읽어도 됨"이라고 허락하지 않으면, 다른 사이트의 JS는 응답을 못 읽어요.' },
            { type: 'say', text: '그래서 CORS는 **브라우저만** 지키는 규칙이에요. **서버끼리 통신할 때는 CORS가 없어요.** Node.js나 Python 서버에서 다른 서버를 부르면 그냥 돼요. 이 사실이 다음 개념(프록시)의 핵심이에요.' },
            { type: 'note', tone: 'warn', text: 'CORS를 "서버 보안 장치"로 착각하면 안 돼요. 브라우저가 아닌 곳(curl, 서버, 해커의 스크립트)에서는 그냥 요청이 가요. **서버 보안(로그인·권한 확인)은 따로** 해야 해요.' },
          ],
        },
        {
          title: '예외: 미리 물어보는 요청 (preflight)',
          blocks: [
            { type: 'say', text: '"요청은 서버에 도착한다"에는 예외가 있어요. 시니어라면 알아 둬야 해요.\n\nJSON을 보내는 POST(`Content-Type: application/json`), 커스텀 헤더(`Authorization` 등), PUT·DELETE 같은 요청은 브라우저가 **진짜 요청을 보내기 전에** `OPTIONS` 메서드로 **"이런 요청 보내도 돼요?"라고 먼저 물어봐요.** 이걸 **preflight(사전 요청)** 라고 해요.' },
            {
              type: 'table',
              head: ['요청 종류', '서버에 도착하나'],
              rows: [
                ['단순 요청 (일반 GET 등)', '도착하고 서버가 처리함. 브라우저가 결과만 안 보여 줌'],
                ['preflight가 필요한 요청 (JSON POST, 토큰 헤더 등)', '먼저 OPTIONS로 물어봄 → 허락이 없으면 **진짜 요청은 아예 안 보냄**'],
              ],
            },
            { type: 'note', tone: 'tip', text: '개발자 도구 Network 탭에서 같은 주소로 OPTIONS 요청이 하나 더 보이면 그게 preflight예요. "POST는 CORS 에러가 나는데 GET은 된다"면 preflight를 의심하세요.' },
          ],
        },
      ],
    },
    {
      title: '해결 1: 백엔드에서 허용하기',
      slides: [
        {
          title: '허락서를 붙여 주기',
          blocks: [
            { type: 'say', text: '가장 정석적인 해결은 **백엔드가 응답에 허락서를 붙이는** 거예요. FastAPI라면 이렇게 해요.' },
            {
              type: 'code',
              code: `from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],   # 이 오리진은 응답을 읽어도 됨
    allow_methods=["*"],
    allow_headers=["*"],
)`,
            },
            { type: 'say', text: '이제 응답에 `Access-Control-Allow-Origin: http://localhost:5173`이 붙고, 브라우저는 "허락서 있네" 하고 결과를 넘겨줘요. preflight(OPTIONS)에도 이 미들웨어가 알아서 대답해요.' },
          ],
        },
        {
          title: '"*" 는 조심해서',
          blocks: [
            { type: 'note', tone: 'warn', text: '`allow_origins=["*"]`(모두 허용)은 **개발 중 임시로만** 써요. 배포에서는 내 프론트 주소만 정확히 적어요. 그리고 쿠키로 로그인하는 경우(`allow_credentials=True`)에는 `*`가 **아예 동작하지 않아요.** 브라우저가 "누구에게나 + 로그인 정보까지"는 허락하지 않거든요.' },
            { type: 'ask', q: '배포했더니 다시 CORS 에러가 나요. 개발 때는 allow_origins에 localhost:5173을 넣었었어요. 뭘 빠뜨렸을까요?', a: '배포한 프론트 주소(예: `https://myapp.vercel.app`)를 allow_origins에 **추가**하지 않았을 거예요. 오리진은 주소마다 다르니까, 프론트가 실제로 떠 있는 주소를 전부 적어 줘야 해요. 보통 환경변수로 넣어요.' },
          ],
        },
      ],
    },
    {
      title: '해결 2: 프록시',
      slides: [
        {
          title: '같은 건물 안내 데스크에 부탁하기',
          blocks: [
            { type: 'say', text: '두 번째 방법은 **프록시**예요. 브라우저는 **같은 오리진에만** 요청하고, 그 서버가 백엔드에 **대신** 다녀오게 하는 거예요.' },
            { type: 'note', tone: 'analogy', text: '나는 우리 건물 안내 데스크(같은 오리진)에만 부탁할 수 있어요. 안내 데스크 직원(Vite 서버)이 건너편 건물(백엔드)에 대신 다녀와서 결과를 줘요. 나는 건너편 건물에 간 적이 없어요. 그리고 직원끼리의 심부름(서버끼리 통신)에는 CORS 규칙이 없어요.' },
            {
              type: 'code',
              code: `[프록시 없이]
브라우저 (페이지 5173)
  ↓ localhost:8000/api/hello
  ✕ 다른 오리진 → 브라우저가 막음

[프록시 사용]
브라우저 (페이지 5173)
  ↓ localhost:5173/api/hello
  ✓ 같은 오리진이라 문제 없음
Vite 개발 서버 (5173)
  ↓ localhost:8000/api/hello 대신 요청
  ✓ 서버끼리라 CORS 없음
FastAPI (8000)`,
            },
          ],
        },
        {
          title: 'Vite 프록시 설정',
          blocks: [
            {
              type: 'code',
              code: `// vite.config.ts
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:8000',   // /api로 시작하는 요청은 8000번으로 대신 전달
    },
  },
});

// 컴포넌트에서는 주소 앞부분 없이
fetch('/api/hello');`,
            },
            { type: 'say', text: '5-3의 `api()` 함수에서 개발할 때 `BASE`를 빈 문자열로 둔 이유가 이거예요. `/api/...`로만 부르면 Vite가 알아서 8000번으로 넘겨 줘요.' },
            { type: 'note', tone: 'warn', text: 'Vite의 `server.proxy`는 **개발 서버 전용**이에요. 빌드한 파일을 배포하면 Vite가 없으니 프록시도 없어요. 배포 환경에서는 ① 백엔드에 CORS 허용을 하거나 ② nginx 같은 **리버스 프록시**로 프론트와 API를 같은 도메인 아래(`site.com`, `site.com/api`)에 두거나 ③ Next.js의 rewrites를 써요.' },
            { type: 'say', text: 'CORS 끝! 이제 그 빨간 에러를 봐도 당황하지 않을 거예요. 확인 문제 가요.' },
          ],
        },
      ],
    },
  ],
  questions: [
    {
      id: 're05-4-q1',
      source: '오리진이란',
      type: 'mcq',
      question: 'http://localhost:5173 과 같은 오리진인 것은?',
      choices: ['http://localhost:8000', 'https://localhost:5173', 'http://localhost:5173/api/courses', 'http://127.0.0.1:5173'],
      answer: 2,
      explanation: '오리진은 프로토콜·도메인·포트가 모두 같아야 해요. 경로(/api/courses)는 상관없어요. 127.0.0.1도 도메인 글자가 달라서 다른 오리진이에요.',
    },
    {
      id: 're05-4-q2',
      source: '오리진이란',
      type: 'ox',
      question: '같은 컴퓨터에서 띄운 Vite(5173)와 FastAPI(8000)는 같은 오리진이다.',
      answer: false,
      explanation: '같은 컴퓨터여도 포트가 다르면 다른 오리진이에요. 그래서 CORS 문제가 생겨요.',
    },
    {
      id: 're05-4-q3',
      source: 'CORS는 브라우저가 막는다',
      type: 'mcq',
      question: '일반 GET 요청에서 CORS 에러가 났을 때 실제로 일어난 일은?',
      choices: ['요청이 서버에 도착하지 못했다', '서버가 요청을 거부했다', '요청은 서버에 도착했고 응답도 왔지만, 허락서 헤더가 없어 브라우저가 JS에 결과를 넘기지 않았다', '인터넷이 끊겼다'],
      answer: 2,
      explanation: 'CORS는 브라우저의 읽기 제한이에요. 서버는 이미 일을 했어요. 그래서 서버 보안은 따로 해야 해요.',
    },
    {
      id: 're05-4-q4',
      source: 'CORS는 브라우저가 막는다',
      type: 'ox',
      question: 'Python 서버에서 다른 서버의 API를 호출할 때도 CORS 정책 때문에 막힐 수 있다.',
      answer: false,
      explanation: 'CORS는 브라우저만 지키는 규칙이에요. 서버끼리의 통신에는 적용되지 않아요. 프록시가 이 점을 이용해요.',
    },
    {
      id: 're05-4-q5',
      source: 'CORS는 브라우저가 막는다',
      type: 'mcq',
      question: 'JSON을 보내는 POST 요청 전에 브라우저가 먼저 보내는 "이런 요청 보내도 돼요?" 요청의 HTTP 메서드는?',
      choices: ['GET', 'HEAD', 'OPTIONS', 'PATCH'],
      answer: 2,
      explanation: '이걸 preflight라고 해요. 서버가 허락하지 않으면 진짜 POST 요청은 아예 보내지지 않아요.',
    },
    {
      id: 're05-4-q6',
      source: '해결 1: 백엔드에서 허용하기',
      type: 'mcq',
      question: '배포 환경의 FastAPI CORS 설정으로 가장 알맞은 것은?',
      choices: ['allow_origins=["*"]', 'allow_origins=["https://myapp.vercel.app"] 처럼 실제 프론트 주소만', 'CORS 미들웨어를 지운다', 'allow_origins=[]'],
      answer: 1,
      explanation: '*는 개발 중 임시로만, 배포에서는 실제 프론트 주소만 적어요. 쿠키 인증을 쓰면 *는 동작하지도 않아요.',
    },
    {
      id: 're05-4-q7',
      source: '해결 2: 프록시',
      type: 'mcq',
      question: 'Vite 프록시로 CORS를 피할 수 있는 이유는?',
      choices: ['Vite가 CORS를 끄는 설정을 해서', '브라우저는 같은 오리진(5173)에만 요청하고, 백엔드 호출은 Vite 서버가 하므로(서버끼리라 CORS 없음)', '백엔드가 자동으로 허락서를 붙여서', 'HTTPS로 바꿔서'],
      answer: 1,
      explanation: '브라우저 입장에선 같은 오리진에 요청한 것뿐이에요. 다른 오리진 호출은 서버가 대신 해서 CORS 규칙이 적용되지 않아요.',
    },
    {
      id: 're05-4-q8',
      source: '해결 2: 프록시',
      type: 'ox',
      question: 'vite.config.ts의 server.proxy 설정은 npm run build로 배포한 사이트에서도 그대로 동작한다.',
      answer: false,
      explanation: 'server.proxy는 개발 서버 전용이에요. 배포에서는 백엔드 CORS 허용, 리버스 프록시(nginx), Next.js rewrites 중 하나를 써요.',
    },
    {
      id: 're05-4-q9',
      source: '해결 2: 프록시',
      type: 'essay',
      question: '[면접] CORS가 무엇이고, 개발 중에 발생하면 어떻게 해결하나요?',
      answer: '브라우저는 페이지와 프로토콜·도메인·포트가 하나라도 다른 오리진의 응답을, 서버가 Access-Control-Allow-Origin으로 허락하지 않으면 자바스크립트에 넘겨주지 않습니다. 같은 컴퓨터라도 Vite 5173과 API 8000처럼 포트가 다르면 다른 오리진입니다. 해결은 백엔드에서 허용할 오리진을 명시하거나, 개발 중에는 Vite 프록시로 브라우저가 같은 오리진에만 요청하게 하고 개발 서버가 API에 대신 전달하게 합니다. 서버끼리의 통신에는 CORS가 적용되지 않기 때문입니다. 배포에서는 CORS 허용 목록이나 리버스 프록시를 씁니다.',
      keywords: ['오리진(프로토콜·도메인·포트)', '브라우저 정책', 'Access-Control-Allow-Origin', '프록시', 'preflight'],
      explanation: '오리진 정의 → 누가 막는지(브라우저) → 해결 두 가지(허용·프록시) → 배포 때 주의 순서로 말해요. preflight까지 말하면 더 좋아요.',
    },
  ],
}

export default topic
