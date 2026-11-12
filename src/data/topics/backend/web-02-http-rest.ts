import type { Topic } from '../../types'

const topic: Topic = {
  id: 'web-02-http-rest',
  track: 'backend',
  group: '큰 그림',
  title: 'HTTP · REST · 상태 코드 · CORS',
  order: 2,
  sections: [
    {
      title: 'HTTP 요청과 응답의 구조',
      notionIds: ['3efdf951bf8081bb922cd8bbf0ed803b'],
      slides: [
        {
          title: '요청과 응답을 뜯어 보면',
          blocks: [
            { type: 'say', text: '지난 수업에서 웹은 요청과 응답이라고 했죠. 이번엔 그 **편지 봉투를 직접 열어** 볼 거예요. 형식이 정해져 있어서, 한 번 보면 어떤 API든 읽을 수 있어요.' },
            { type: 'code', code: `POST /users?notify=true HTTP/1.1          ← 메서드 + 경로(+쿼리)
Host: api.example.com                      ← 헤더
Content-Type: application/json

{"name": "kim", "email": "kim@example.com"}   ← 본문(body)

---- 응답 ----
HTTP/1.1 201 Created                       ← 상태 코드
Content-Type: application/json             ← 헤더

{"id": 1, "name": "kim", "email": "kim@example.com"}   ← 본문` },
            { type: 'list', items: ['**요청** = 메서드 + 경로(URL) + 헤더 + 본문', '**응답** = 상태 코드 + 헤더 + 본문', '**헤더**는 "본문이 JSON이에요" 같은 **봉투 겉면 정보**'] },
          ],
        },
        {
          title: '쿼리 스트링 vs 본문',
          blocks: [
            { type: 'say', text: '주소 뒤 `?page=2&size=10` 부분을 **쿼리 스트링**이라고 해요. 값을 보낼 곳이 두 군데인 셈인데, 기준이 있어요.' },
            {
              type: 'table',
              head: ['어디에', '무엇을'],
              rows: [
                ['쿼리 스트링 `?page=2`', '**조회 조건**처럼 짧은 값 (검색어, 페이지 번호, 정렬)'],
                ['본문(body)', '**긴 데이터**, 그리고 **비밀번호처럼 숨겨야 하는 값**'],
              ],
            },
            { type: 'note', tone: 'warn', text: '주소(URL)는 브라우저 방문 기록, 서버 로그, 공유한 링크 어디에나 **그대로 남아요.** 비밀번호를 쿼리 스트링에 넣으면 로그에 평문으로 찍혀요. 회원가입·로그인 값은 반드시 본문에!' },
          ],
        },
        {
          title: 'HTTP는 기억하지 못해요',
          blocks: [
            { type: 'say', text: 'HTTP의 중요한 성질 하나 더. HTTP는 **상태가 없어요(Stateless).** 서버는 이전 요청을 **기억하지 않아요.** 방금 로그인한 사람이 다음 요청을 보내도, 서버 입장에선 "처음 보는 사람"이에요.' },
            { type: 'note', tone: 'analogy', text: '매번 처음 보는 직원이 받는 **콜센터**예요. 전화할 때마다 "회원번호가 어떻게 되세요?"를 다시 물어요. 그래서 로그인을 유지하려면 요청마다 **"저 아까 그 사람이에요"라는 증표**(쿠키·세션·토큰)를 함께 보내야 해요. 인증 수업에서 자세히 배워요.' },
          ],
        },
      ],
    },
    {
      title: 'REST: 자원은 URL, 행위는 메서드',
      notionIds: ['3efdf951bf808199b333e12b0e63ba46'],
      slides: [
        {
          title: 'URL은 명사, 메서드는 동사',
          blocks: [
            { type: 'say', text: 'API 주소를 아무렇게나 지으면 사람마다 규칙이 달라 금방 엉망이 돼요. **REST**는 주소 짓는 약속이에요. 핵심은 한 줄이에요.\n\n**URL은 "무엇(자원)"을 가리키는 명사, 메서드는 "어떻게(행위)"를 나타내는 동사.**' },
            {
              type: 'table',
              head: ['요청', '뜻'],
              rows: [
                ['`GET /posts`', '글 **목록** 조회'],
                ['`GET /posts/3`', '3번 글 **하나** 조회'],
                ['`POST /posts`', '글 **생성**'],
                ['`PUT /posts/3`', '3번 글 **전체** 수정 (통째로 교체)'],
                ['`PATCH /posts/3`', '3번 글 **일부** 수정 (제목만 등)'],
                ['`DELETE /posts/3`', '3번 글 **삭제**'],
              ],
            },
          ],
        },
        {
          title: '나쁜 예와 하위 자원',
          blocks: [
            { type: 'code', code: `❌ GET  /getPost?id=3
❌ POST /deletePost
✅ GET    /posts/3
✅ DELETE /posts/3

✅ GET /posts/3/comments      ← 3번 글의 댓글 목록 (하위 자원)` },
            { type: 'say', text: 'URL에 `get`, `delete` 같은 **동사를 넣으면** 메서드와 뜻이 겹치고, `POST /deletePost`처럼 메서드와 URL이 서로 다른 말을 하게 돼요. 동사는 메서드에게 맡기고 URL은 **자원 이름**만 써요.\n\n자원 안의 자원은 **경로를 이어서** 표현해요. "3번 글의 댓글"은 `/posts/3/comments`예요.' },
          ],
        },
      ],
    },
    {
      title: '메서드의 성질: 안전함과 멱등성',
      slides: [
        {
          title: '안전한 메서드',
          blocks: [
            { type: 'say', text: '메서드에는 두 가지 중요한 성질이 있어요. 이름이 어려워 보이지만 뜻은 단순해요.\n\n**안전(safe)** — 서버 데이터를 **바꾸지 않는** 메서드. `GET`, `HEAD`, `OPTIONS`.\n그래서 브라우저나 검색엔진이 GET은 마음대로 미리 보내 보기도 해요. 수정·삭제를 GET으로 만들면 안 되는 이유예요.' },
          ],
        },
        {
          title: '멱등성: 여러 번 보내도 결과가 같은가',
          blocks: [
            { type: 'say', text: '**멱등(idempotent)** — 같은 요청을 **여러 번 보내도 서버 상태가 한 번 보낸 것과 같은** 성질이에요.' },
            {
              type: 'table',
              head: ['메서드', '멱등?', '이유'],
              rows: [
                ['`GET`', 'O', '읽기만 하니까'],
                ['`PUT`', 'O', '"통째로 이 값으로" — 10번 보내도 결과는 같은 값'],
                ['`DELETE`', 'O', '두 번째엔 404가 와도 **서버 상태**는 "삭제됨" 그대로'],
                ['`POST`', '**X**', '보낼 때마다 **새 글이 하나씩** 생김'],
                ['`PATCH`', '설계에 따라', '"제목을 A로"는 멱등, "조회수 +1"은 멱등 아님'],
              ],
            },
            { type: 'note', tone: 'warn', text: 'DELETE를 두 번 보내 두 번째에 404가 났다고 멱등이 아닌 건 아니에요. 멱등은 **응답**이 아니라 **서버 상태**가 같은지를 봐요. 두 번 보내도 "그 글은 없다"는 상태는 똑같죠.' },
          ],
        },
        {
          title: '왜 중요할까: 재시도',
          blocks: [
            { type: 'say', text: '요청을 보냈는데 네트워크가 끊겨 응답을 못 받았어요. 서버가 처리했는지 안 했는지 모르는 상황이에요. 다시 보내도 될까요?\n• **멱등**한 요청(PUT, DELETE) → 다시 보내도 안전해요\n• **POST** → 다시 보내면 **주문이 두 번** 들어갈 수 있어요' },
            { type: 'ask', q: '결제 버튼(POST)을 사용자가 빠르게 두 번 눌렀어요. 어떤 일이 생길 수 있을까요?', a: 'POST는 멱등이 아니라 **결제가 두 번** 될 수 있어요. 그래서 실무에선 버튼을 한 번 누르면 비활성화하거나, 요청마다 고유 키(멱등 키)를 붙여 서버가 중복을 걸러내게 해요.' },
          ],
        },
      ],
    },
    {
      title: '상태 코드',
      slides: [
        {
          title: '숫자 하나로 결과를 알려요',
          blocks: [
            { type: 'say', text: '응답 첫 줄의 **상태 코드**는 "어떻게 됐는지"를 숫자로 알려 줘요. 받는 쪽이 프로그램이라 글보다 숫자가 판단하기 쉬워요. 백 단위 무리로 나뉘어요.' },
            {
              type: 'table',
              head: ['무리', '뜻', '대표 코드'],
              rows: [
                ['2xx', '**성공**', '200 OK, **201 Created**(POST로 생성), **204 No Content**(성공했지만 본문 없음, DELETE)'],
                ['3xx', '**다른 곳으로**', '301 영구 이동, 302/303/307 임시 이동 (로그인 후 이동 등)'],
                ['4xx', '**클라이언트** 잘못', '아래 슬라이드에서'],
                ['5xx', '**서버** 잘못', '500 코드 예외, 502/503/504 게이트웨이·과부하·시간 초과'],
              ],
            },
          ],
        },
        {
          title: '자주 헷갈리는 4xx',
          blocks: [
            {
              type: 'table',
              head: ['코드', '언제'],
              rows: [
                ['400 Bad Request', '요청 자체가 이상함'],
                ['**401** Unauthorized', '**로그인 안 함** — 너 누구야?'],
                ['**403** Forbidden', '**로그인은 했지만 권한 없음** — 너인 건 알아, 근데 안 돼'],
                ['404 Not Found', '없는 자원'],
                ['405 Method Not Allowed', '그 경로에 그 메서드가 없음'],
                ['**409** Conflict', '**중복** 등 현재 상태와 충돌 (이미 가입된 이메일)'],
                ['**422** Unprocessable Entity', '형식은 맞지만 **값 검증 실패** — FastAPI 기본'],
              ],
            },
            { type: 'note', tone: 'analogy', text: '건물 출입으로 생각해요. **401**은 출입증이 **없는** 사람, **403**은 출입증은 있는데 **그 층 권한이 없는** 사람이에요.' },
          ],
        },
        {
          title: '4xx냐 5xx냐 판단법',
          blocks: [
            { type: 'say', text: '헷갈리면 이 질문 하나만 던지세요.\n\n**"클라이언트가 요청을 고치면 해결되나?"**\n• 그렇다 → **4xx** (잘못된 값, 로그인 필요, 없는 주소)\n• 아니다, 서버 코드나 서버 상태 문제다 → **5xx**' },
            { type: 'ask', q: '내 코드에서 `None.title`로 접근하다 예외가 터졌어요. 몇 번대 코드가 나가야 할까요?', a: '**500**이에요. 클라이언트가 요청을 아무리 고쳐도 서버 코드 버그는 안 고쳐지니까요. 반대로 "없는 글 번호를 요청해서" 생긴 일이라면 예외가 나기 전에 **404**로 막아 주는 게 맞아요.' },
          ],
        },
      ],
    },
    {
      title: 'CORS와 Same-Origin Policy',
      notionIds: ['3efdf951bf8081598e39c4da0c36cf64'],
      slides: [
        {
          title: '출처(Origin)란?',
          blocks: [
            { type: 'say', text: '프론트엔드와 백엔드를 연결하다 보면 **반드시** 한 번은 만나는 에러가 있어요. **CORS 에러**예요. 이해하려면 먼저 **출처**를 알아야 해요.\n\n**출처(Origin) = 프로토콜 + 호스트 + 포트**. 셋 중 하나라도 다르면 다른 출처예요.' },
            {
              type: 'table',
              head: ['주소', '`http://localhost:5173`과 같은 출처?'],
              rows: [
                ['`http://localhost:5173/about`', '**O** (경로는 상관없음)'],
                ['`http://localhost:8000`', 'X — 포트가 다름'],
                ['`https://localhost:5173`', 'X — 프로토콜이 다름'],
                ['`http://127.0.0.1:5173`', 'X — 호스트 글자가 다름'],
              ],
            },
          ],
        },
        {
          title: '브라우저가 막는 거예요',
          blocks: [
            { type: 'say', text: '브라우저는 보안을 위해, 자바스크립트(`fetch`, axios)가 **다른 출처로 보낸 요청의 응답을 읽지 못하게** 막아요. 이게 **Same-Origin Policy**(동일 출처 정책)예요. 아무 사이트나 내 은행 사이트 데이터를 몰래 읽어 가면 안 되니까요.\n\n**CORS**(Cross-Origin Resource Sharing)는 그 예외를 여는 방법이에요. **서버가** 응답 헤더 `Access-Control-Allow-Origin`으로 "이 출처는 괜찮아요"라고 알려 주면, 브라우저가 응답을 읽게 해 줘요.' },
            { type: 'note', tone: 'warn', text: 'CORS는 **브라우저가 거는** 제한이에요. curl, Postman, 서버끼리의 호출에는 CORS가 없어요. 그래서 **"curl은 되는데 브라우저만 안 된다"** 면 CORS예요. 그리고 고치는 곳은 프론트가 아니라 **서버 설정**이에요.' },
          ],
        },
        {
          title: '프리플라이트와 FastAPI 설정',
          blocks: [
            { type: 'say', text: 'JSON을 보내는 POST, 커스텀 헤더, PUT·DELETE 같은 요청은 브라우저가 진짜 요청 전에 **`OPTIONS` 메서드로 "보내도 되나요?"** 를 먼저 물어봐요. 이걸 **프리플라이트(preflight)** 요청이라고 해요. 개발자 도구 Network 탭에 OPTIONS가 하나 더 보이는 이유예요.' },
            { type: 'code', code: `from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://my-app.vercel.app"],
    allow_credentials=True,   # 쿠키 같이 보내기 허용
    allow_methods=["*"],
    allow_headers=["*"],
)` },
            { type: 'note', tone: 'warn', text: '`allow_origins=["*"]`(모두 허용)와 `allow_credentials=True`(쿠키 전송)는 **함께 쓸 수 없어요.** 쿠키가 오가는데 아무 사이트나 허용하면 위험하니까요. 쿠키를 쓴다면 실제 프론트 주소를 적어요.' },
          ],
        },
      ],
    },
  ],
  questions: [
    {
      id: 'web-02-01', type: 'mcq', source: 'HTTP 요청과 응답의 구조',
      question: '회원가입 API에 이메일과 비밀번호를 보내려 한다. 어디에 담는 것이 맞을까?',
      choices: ['GET 요청의 쿼리 스트링 (?email=..&password=..)', 'URL 경로 /signup/kim@a.com/1234', 'POST 요청의 본문(body)에 JSON으로', '응답 헤더'],
      answer: 2,
      choiceExplanations: [
        '쿼리 스트링은 URL에 그대로 보여서 브라우저 기록·서버 로그에 비밀번호가 남아요. 또 GET은 조회용이에요.',
        '경로에 비밀번호를 넣으면 쿼리 스트링과 같은 문제가 생겨요.',
        '정답. 새 자원(회원)을 만드는 요청이니 POST이고, 민감한 데이터는 본문에 담아요(HTTPS로 암호화).',
        '응답 헤더는 서버가 클라이언트에게 보내는 정보예요.',
      ],
      explanation: '정리하면 이래요.\n• 경로: 자원 식별 (/users/3)\n• 쿼리 스트링: 조회 조건·페이지 (?page=2)\n• 본문: 생성·수정할 데이터, 민감한 데이터\n본문도 HTTPS가 아니면 도청될 수 있으니 실제 서비스는 반드시 HTTPS를 써요.',
    },
    {
      id: 'web-02-02', type: 'ox', source: 'HTTP 요청과 응답의 구조',
      question: 'HTTP 서버는 기본적으로 같은 사용자의 이전 요청을 기억한다.',
      answer: false,
      explanation: 'HTTP는 무상태(Stateless)예요. 각 요청은 독립적이고, 서버는 기본적으로 이전 요청을 기억하지 않아요.\n그래서 "로그인한 사람"을 알아보려면 요청마다 쿠키(세션 ID)나 토큰을 같이 보내야 해요. 이 내용은 인증 토픽에서 자세히 다뤄요.',
    },
    {
      id: 'web-02-03', type: 'mcq', source: 'REST: 자원은 URL, 행위는 메서드',
      question: 'REST 원칙에 가장 잘 맞는 "3번 게시글 삭제" API는?',
      choices: ['DELETE /posts/3', 'GET /deletePost?id=3', 'POST /posts/3/delete', 'DELETE /deletePosts/3'],
      answer: 0,
      choiceExplanations: [
        '정답. 자원(/posts/3) + 행위(DELETE)로 깔끔하게 나뉘어요.',
        'GET은 조회용(안전한 메서드)인데 삭제를 하고, URL에 동사가 들어갔어요.',
        '동작은 하겠지만 행위(delete)가 URL에 들어가 메서드와 역할이 겹쳐요.',
        '메서드가 이미 DELETE인데 URL에 또 동사가 들어가 있어요.',
      ],
      explanation: 'REST = URL은 명사(자원), 메서드는 동사(행위).\n특히 GET으로 데이터를 바꾸면 위험해요. 브라우저나 검색 로봇이 링크를 미리 열어 보는(prefetch) 것만으로도 삭제가 일어날 수 있어요.',
    },
    {
      id: 'web-02-04', type: 'short', source: 'REST: 자원은 URL, 행위는 메서드',
      question: '게시글의 제목만 일부 수정할 때 REST에서 주로 쓰는 HTTP 메서드는? (전체 교체가 아니라 부분 수정)',
      answer: ['patch'],
      explanation: 'PATCH예요.\n• PUT: 자원 전체를 보낸 값으로 교체. 빠진 필드는 비워지거나 기본값이 될 수 있어요.\n• PATCH: 보낸 필드만 수정.\nFastAPI에서는 PATCH용 Pydantic 모델의 필드를 모두 선택(Optional)으로 두고, model_dump(exclude_unset=True)로 실제로 보낸 필드만 반영하는 패턴을 써요(응답 모델 토픽).',
    },
    {
      id: 'web-02-05', type: 'mcq', source: '메서드의 성질: 안전함과 멱등성',
      question: '네트워크가 끊겨 응답을 못 받았다. 클라이언트가 같은 요청을 자동으로 다시 보내도 안전하지 않은 것은?',
      choices: ['GET /posts/3', 'PUT /posts/3 (제목="안녕", 본문="hi" 전체 교체)', 'POST /orders (주문 생성)', 'DELETE /posts/3'],
      answer: 2,
      choiceExplanations: [
        'GET은 데이터를 바꾸지 않아 몇 번을 보내도 괜찮아요.',
        'PUT은 같은 값으로 덮어쓰니 여러 번 보내도 결과가 같아요(멱등).',
        '정답. POST는 멱등이 아니라서 다시 보내면 주문이 두 번 생길 수 있어요.',
        '이미 삭제됐다면 두 번째 요청은 404가 나겠지만 서버 상태는 똑같아요(멱등).',
      ],
      explanation: '멱등(idempotent) = 같은 요청을 N번 보내도 서버 상태가 1번 보낸 것과 같음.\nGET·PUT·DELETE는 멱등, POST는 멱등이 아니에요.\n결제·주문처럼 중복이 치명적인 POST에는 실무에서 "멱등 키(Idempotency-Key)" 헤더를 받아 같은 키의 요청은 한 번만 처리하는 방법을 써요.',
    },
    {
      id: 'web-02-06', type: 'ox', source: '메서드의 성질: 안전함과 멱등성',
      question: 'DELETE 요청을 두 번 보내 두 번째에 404가 나왔다면 DELETE는 멱등이 아니다.',
      answer: false,
      explanation: '멱등성은 "응답 코드"가 아니라 "서버 상태"로 판단해요.\n첫 번째 DELETE 후 글이 없는 상태, 두 번째 DELETE 후에도 글이 없는 상태로 같아요. 그래서 DELETE는 멱등이에요. 응답이 200 → 404로 달라도 괜찮아요.',
    },
    {
      id: 'web-02-07', type: 'mcq', source: '상태 코드',
      question: 'POST /posts로 글을 새로 만드는 데 성공했다. 가장 알맞은 상태 코드는?',
      choices: ['201 Created', '200 OK', '204 No Content', '302 Found'],
      answer: 0,
      choiceExplanations: [
        '정답. "새 자원이 만들어졌다"는 뜻이에요. FastAPI에서는 @app.post("/posts", status_code=201)로 지정해요.',
        '틀린 건 아니지만, 생성이 일어났다는 걸 더 정확히 알려주는 코드가 있어요.',
        '본문이 없는 성공이에요. 만든 글을 응답으로 돌려줄 거라면 맞지 않아요.',
        '리다이렉트 코드예요.',
      ],
      explanation: 'FastAPI는 아무 설정이 없으면 성공 응답을 200으로 보내요. 생성 API라면 status_code=201(또는 status.HTTP_201_CREATED)을 직접 지정하는 습관을 들이세요.\n삭제 API는 본문 없이 204를 많이 써요.',
    },
    {
      id: 'web-02-08', type: 'mcq', source: '상태 코드',
      question: '로그인은 했지만 다른 사람의 글을 수정하려 한다. 가장 알맞은 상태 코드는?',
      choices: ['400 Bad Request', '403 Forbidden', '401 Unauthorized', '404 Not Found'],
      answer: 1,
      choiceExplanations: [
        '요청 형식은 정상이에요. 문제는 권한이에요.',
        '정답. 누구인지는 알지만 그 작업을 할 권한(Authorization)이 없을 때예요.',
        '401은 "누구인지 모름", 즉 로그인(인증)이 안 됐을 때예요. 이름과 달리 인증(Authentication) 문제예요.',
        '보안상 남의 자원이 있다는 사실조차 숨기고 싶으면 일부러 404를 주기도 하지만, 의미상 정답은 403이에요.',
      ],
      explanation: '헷갈리기 쉬운 쌍이에요.\n• 401 Unauthorized: 인증 실패. "너 누구야?" → 로그인하면 해결.\n• 403 Forbidden: 인가 실패. "너인 건 아는데 안 돼." → 로그인해도 해결 안 됨.\n인증(Authentication)과 인가(Authorization)의 차이는 인증 토픽에서 다시 나와요.',
    },
    {
      id: 'web-02-09', type: 'short', source: '상태 코드',
      question: 'FastAPI에서 요청 값이 타입 힌트나 Pydantic 검증을 통과하지 못했을 때 기본으로 돌려주는 상태 코드 숫자는?',
      answer: ['422'],
      explanation: '422 Unprocessable Entity예요. "요청 형식(JSON)은 읽었지만 값이 규칙에 맞지 않는다"는 뜻이에요.\n본문의 detail 배열에 loc(어디), msg(왜), type(무슨 종류)이 들어 있어서 프론트가 어떤 필드를 고쳐야 하는지 알 수 있어요.\n400으로 바꾸고 싶다면 RequestValidationError 예외 핸들러를 등록하면 돼요(예외 처리 토픽).',
    },
    {
      id: 'web-02-10', type: 'mcq', source: '상태 코드',
      question: '회원가입에서 이미 존재하는 이메일로 가입하려 한다. 의미상 가장 알맞은 상태 코드는?',
      choices: ['409 Conflict', '500 Internal Server Error', '201 Created', '405 Method Not Allowed'],
      answer: 0,
      choiceExplanations: [
        '정답. 현재 서버 상태(이미 있는 이메일)와 충돌하는 요청이에요. 400으로 처리하는 곳도 있지만 409가 의미가 더 정확해요.',
        'DB의 UNIQUE 제약 위반을 그냥 두면 500이 나요. 이건 처리를 안 한 버그예요. 잡아서 4xx로 바꿔야 해요.',
        '생성에 실패했으니 201이 아니에요.',
        '405는 그 경로에 해당 메서드가 없을 때예요.',
      ],
      explanation: '실무 패턴: DB에 email UNIQUE 제약을 걸고, 저장 시 IntegrityError가 나면 잡아서 HTTPException(status_code=409, detail="이미 가입된 이메일")로 바꿔요.\n앱에서 먼저 조회해서 확인하는 것만으로는 동시에 두 요청이 오면 둘 다 통과할 수 있어요. 최종 방어선은 DB 제약이에요.',
    },
    {
      id: 'web-02-11', type: 'mcq', source: 'CORS와 Same-Origin Policy',
      question: '다음 중 http://localhost:5173 과 "같은 출처(Same Origin)"인 것은?',
      choices: ['http://localhost:8000', 'https://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:5173/api/users'],
      answer: 3,
      choiceExplanations: [
        '포트가 달라요(5173 vs 8000).',
        '프로토콜이 달라요(http vs https).',
        '같은 컴퓨터를 가리키지만 호스트 문자열(localhost vs 127.0.0.1)이 달라서 브라우저는 다른 출처로 봐요.',
        '정답. 경로(/api/users)는 출처에 포함되지 않아요. 프로토콜·호스트·포트가 모두 같아요.',
      ],
      explanation: '출처 = 프로토콜 + 호스트 + 포트. 셋 중 하나라도 다르면 다른 출처예요. 경로·쿼리는 상관없어요.\nVite 개발 서버(5173)에서 FastAPI(8000)를 부르면 포트가 달라 CORS 설정이 필요해요. 또는 Vite의 proxy 설정으로 같은 출처처럼 보이게 우회할 수도 있어요.',
    },
    {
      id: 'web-02-12', type: 'mcq', source: 'CORS와 Same-Origin Policy',
      question: 'curl로는 API가 잘 되는데 React 앱의 fetch에서만 CORS 에러가 난다. 어디를 고쳐야 할까?',
      choices: ['React의 fetch 코드에 mode: "no-cors"를 넣는다', 'curl을 다시 설치한다', 'FastAPI 서버에 CORSMiddleware를 추가해 프론트 출처를 허용한다', '브라우저 캐시를 지운다'],
      answer: 2,
      choiceExplanations: [
        'no-cors를 쓰면 에러는 사라지지만 응답 본문을 읽을 수 없는(opaque) 상태가 돼서 쓸모가 없어요.',
        'curl은 브라우저가 아니라 CORS 검사를 하지 않아요. 그래서 curl에서는 잘 되는 거예요.',
        '정답. CORS는 "서버가 허용한다고 응답 헤더로 알려주는" 방식이라 서버에서 고쳐요.',
        '캐시와는 관계없어요.',
      ],
      explanation: 'CORS는 브라우저 보안 정책이라 curl·Postman·서버 간 통신에서는 생기지 않아요.\n해결은 서버 쪽: FastAPI는 app.add_middleware(CORSMiddleware, allow_origins=[...])로 허용할 출처를 적어요. 그러면 응답에 Access-Control-Allow-Origin 헤더가 붙고, 브라우저가 응답을 읽게 해 줘요.',
    },
    {
      id: 'web-02-13', type: 'short', source: 'CORS와 Same-Origin Policy',
      question: '브라우저가 JSON POST 같은 요청을 보내기 전에 "보내도 되나요?"를 묻기 위해 먼저 보내는 요청의 HTTP 메서드는?',
      answer: ['options'],
      explanation: 'OPTIONS예요. 이 사전 요청을 프리플라이트(preflight)라고 해요.\n서버가 Access-Control-Allow-Methods, Access-Control-Allow-Headers 등으로 허용한다고 답하면 그다음에 실제 요청을 보내요.\n서버 로그에 OPTIONS 요청이 찍히고 실제 POST가 안 온다면 프리플라이트 단계에서 막힌 거예요.',
    },
    {
      id: 'web-02-14', type: 'ox', source: 'CORS와 Same-Origin Policy',
      question: '쿠키를 함께 보내는 요청(allow_credentials=True)에서도 allow_origins=["*"]로 모든 출처를 허용할 수 있다.',
      answer: false,
      explanation: '안 돼요. 인증 정보(쿠키)를 포함한 요청에는 브라우저가 와일드카드(*) 허용을 받아들이지 않아요.\n쿠키 기반 로그인(세션 인증)을 프론트와 다른 출처에서 쓰려면 allow_origins에 실제 프론트 주소를 적고 allow_credentials=True로 설정해야 해요. 프론트 fetch에도 credentials: "include"가 필요해요.',
    },
  ],
}

export default topic
