import type { Topic } from '../../types'

const topic: Topic = {
  id: 'fs-01-1-http',
  track: 'fullstack',
  group: '01. 웹의 기본: HTTP·API·CORS',
  title: '1-1. HTTP 요청과 응답',
  order: 101,
  notionId: '3fadf951bf808038b396d65a097f513d',
  addedAt: '2026-11-06',
  sections: [
    {
      title: 'HTTP는 대화의 약속',
      slides: [
        {
          title: '미니 인프런을 만들어 볼 거예요',
          blocks: [
            { type: 'say', text: '풀스택 코스에 온 걸 환영해요! 이 코스에서는 **미니 인프런**을 처음부터 만들어요. 화면은 **Next.js**, 서버는 **FastAPI**, 데이터는 **PostgreSQL**이에요.\n\n첫 수업은 이 셋이 서로 **어떻게 대화하는지**예요. 모든 웹 개발의 출발점이에요.' },
            {
              type: 'code',
              code: `브라우저
  ↓ 요청 (강의 목록 주세요)
서버 (FastAPI)
  ↓ 조회
데이터베이스 (Postgres)
  ↑
서버
  ↓ 응답 (강의 3개예요)
브라우저`,
            },
            { type: 'say', text: '브라우저는 DB에 **직접** 닿지 않아요. 항상 서버를 거쳐요. DB 비밀번호를 브라우저가 알면 아무나 데이터를 지울 수 있으니까요.' },
          ],
        },
        {
          title: '형식이 정해져 있어야 대화가 돼요',
          blocks: [
            { type: 'say', text: '브라우저와 서버가 주고받는 말의 **형식**을 정한 약속이 **HTTP**예요.' },
            { type: 'note', tone: 'analogy', text: '식당 주문을 생각해 보세요. "포장으로 김치찌개 하나요"처럼 **주문 방식 + 메뉴**를 말하면, 어느 식당이든 알아들어요. 그리고 "네, 나왔습니다 + 음식"으로 대답하죠. 이 형식이 정해져 있으니 처음 가는 식당에서도 주문할 수 있어요. HTTP도 마찬가지로, 어떤 브라우저와 어떤 서버든 서로를 이해해요.' },
          ],
        },
      ],
    },
    {
      title: '요청: 메서드 + 경로',
      slides: [
        {
          title: '무슨 동작을, 어떤 자원에',
          blocks: [
            { type: 'say', text: '요청(주문서)에는 반드시 두 가지가 들어가요.\n• **메서드**: 무슨 동작을 할지 (주문 방식)\n• **경로(path)**: 어떤 자원에 대해서인지 (메뉴판 항목)' },
            { type: 'code', code: `GET /courses          ← 강의 목록 보여 주세요
GET /courses/3        ← 3번 강의 보여 주세요
POST /enrollments     ← 수강 신청할게요` },
            { type: 'say', text: '`https://inflearn.com/courses/3`에서 도메인 뒤의 `/courses/3`이 경로예요. 그중 `3`처럼 **특정 대상을 콕 집는 부분**을 **경로 파라미터**라고 해요.' },
            { type: 'note', tone: 'warn', text: '"요청에는 파라미터가 들어간다"고 말하기 쉬운데, 정확한 용어는 **경로(path)** 예요. 파라미터는 경로 안의 일부일 뿐이에요.' },
          ],
        },
        {
          title: 'GET과 POST 고르는 기준',
          blocks: [
            {
              type: 'table',
              head: ['메서드', '동작', '인프런 예시'],
              rows: [
                ['`GET`', '조회 (읽기만)', '강의 목록 보기'],
                ['`POST`', '생성', '수강 신청'],
                ['`PUT` / `PATCH`', '전체 수정 / 일부 수정', '내 프로필 수정'],
                ['`DELETE`', '삭제', '수강 취소'],
              ],
            },
            { type: 'say', text: '기준은 딱 하나예요. **서버의 데이터를 읽기만 하면 GET, 새 기록을 남기거나 바꾸면 POST(또는 PUT·DELETE).**' },
            { type: 'ask', q: '수강 신청을 GET으로 만들면 어떤 일이 생길 수 있을까요?', a: 'GET은 "여러 번 보내도 아무것도 안 바뀐다"는 약속이라, 브라우저가 새로고침하거나 카톡 링크 미리보기가 **마음대로 다시 보내요.** 수강 신청이 GET이면 새로고침만 해도 **신청이 중복**될 수 있어요. "바꾸면 POST"는 단순한 관습이 아니에요.' },
          ],
        },
      ],
    },
    {
      title: '응답: 상태 코드 + 헤더 + 본문',
      slides: [
        {
          title: '응답의 세 덩어리',
          blocks: [
            {
              type: 'code',
              code: `HTTP/1.1 200 OK                   ← ① 상태 줄 (결과 도장)
Content-Type: application/json    ← ② 헤더 (설명서)
Content-Length: 292
                                  ← 빈 줄
{"id": 1, "title": "파이썬 입문"}  ← ③ 본문 (실제 데이터)`,
            },
            { type: 'list', ordered: true, items: ['**상태 줄**: 성공했는지 실패했는지 숫자로', '**헤더**: 본문이 어떤 형식인지(JSON), 얼마나 긴지', '**본문**: 실제 데이터. API는 보통 JSON'] },
          ],
        },
        {
          title: '상태 코드는 왜 숫자일까',
          blocks: [
            {
              type: 'table',
              head: ['무리', '뜻', '대표 코드'],
              rows: [
                ['2xx', '성공', '200 OK, 201 Created(새로 만들어짐)'],
                ['4xx', '**요청한 쪽** 잘못', '400 형식 오류, 401 로그인 필요, 403 권한 없음, 404 없음, 409 충돌(이미 신청함)'],
                ['5xx', '**서버** 잘못', '500 서버 내부 오류'],
              ],
            },
            { type: 'ask', q: '서버가 "강의를 찾을 수 없어요"라고 글로만 알려 주면 안 될까요? 왜 숫자를 따로 줄까요?', a: '응답을 받는 쪽은 사람이 아니라 **프로그램**인 경우가 많아요. 글은 서버마다 "Not found", "없는 강의예요"처럼 제각각이라 코드로 판단하기 어렵지만, 숫자는 **표준**이라 `if (status === 404)`처럼 바로 비교할 수 있어요.' },
          ],
        },
      ],
    },
    {
      title: 'JSON: 객체 {} 와 배열 []',
      slides: [
        {
          title: '하나는 {}, 여러 개는 []',
          blocks: [
            { type: 'code', code: `GET /courses/1   →  {"id": 1, "title": "파이썬 입문"}              ← 강의 하나 = 객체
GET /courses     →  [{"id": 1, ...}, {"id": 2, ...}, {"id": 3, ...}]  ← 목록 = 배열` },
            { type: 'list', items: ['`{ }` **객체**: 대상 하나. 이름표(키)와 값의 묶음', '`[ ]` **배열**: 여러 대상을 순서대로 담은 목록. 안에 객체들이 들어가요'] },
            { type: 'ask', q: '없는 번호 /courses/99999 를 요청했더니 404와 함께 본문이 2글자 왔어요. [] 일까요, {} 일까요?', a: '`{}`예요. 글 **하나**를 요청했으니, 비어 있는 결과도 **객체 모양**이에요. 목록을 요청했을 때 비어 있으면 `[]`이고요.' },
          ],
        },
        {
          title: '404만으로는 원인을 몰라요',
          blocks: [
            {
              type: 'table',
              head: ['요청', '상태', '뜻'],
              rows: [
                ['`/courses/99999`', '404', '메뉴(강의 목록)는 있는데 **그 번호가 없음**'],
                ['`/coursess` (오타)', '404', '그런 메뉴(경로) **자체가 없음**'],
              ],
            },
            { type: 'say', text: '둘 다 404라서 숫자만으로는 "주소 오타인지, 데이터가 없는 건지" 구분이 안 돼요. 그래서 잘 만든 API는 본문에 `{"detail": "Course not found"}`처럼 **설명을 함께** 담아요. 우리가 쓸 FastAPI도 기본으로 이런 `detail` 형식을 써요.' },
          ],
        },
      ],
    },
    {
      title: 'curl로 직접 보기',
      slides: [
        {
          title: '터미널에서 요청 보내기',
          blocks: [
            { type: 'code', code: `# Windows PowerShell은 curl.exe, Mac·Git Bash는 curl
# -i : 상태 줄과 헤더까지 보여 줘
curl.exe -i https://jsonplaceholder.typicode.com/posts/1       # 200, 본문 { 로 시작
curl.exe -i https://jsonplaceholder.typicode.com/posts         # 200, 본문 [ 로 시작
curl.exe -i https://jsonplaceholder.typicode.com/posts/99999   # 404, 본문 {}` },
            { type: 'say', text: '실행하기 **전에** 상태 코드와 본문 첫 글자를 먼저 예측해 보세요. 예측 → 실행 → 비교가 가장 빨리 배우는 방법이에요.' },
            { type: 'note', tone: 'tip', text: '`-i`를 빼면 본문 `{}`만 보여서 404인지 알 수 없어요. 디버깅할 때는 **상태 코드부터** 확인하는 습관을 들이세요. 브라우저에서는 F12 → Network 탭에서 같은 정보를 볼 수 있어요.\n\n첫 수업 끝! 확인 문제 가요.' },
          ],
        },
      ],
    },
  ],
  questions: [
    {
      id: 'fs01-1-q1',
      source: 'HTTP는 대화의 약속',
      type: 'ox',
      question: '브라우저는 DB에 직접 요청해서 강의 데이터를 가져온다.',
      answer: false,
      explanation: '브라우저는 항상 서버(FastAPI)에 요청하고, 서버가 DB를 조회해서 응답해요. DB 비밀번호를 브라우저가 알면 안 되니까요.',
    },
    {
      id: 'fs01-1-q2',
      source: '요청: 메서드 + 경로',
      type: 'mcq',
      question: '수강 신청 버튼에 알맞은 HTTP 메서드는?',
      choices: ['GET', 'POST', 'HEAD', 'OPTIONS'],
      answer: 1,
      explanation: '서버에 새 기록을 남기니까 POST예요. GET은 새로고침·미리보기가 다시 보낼 수 있어서 중복 신청 위험이 있어요.',
    },
    {
      id: 'fs01-1-q3',
      source: '요청: 메서드 + 경로',
      type: 'short',
      question: 'https://inflearn.com/courses/3 에서 /courses/3 부분을 부르는 이름은? (한글 두 글자)',
      answer: ['경로', 'path', '경로(path)'],
      explanation: '요청에는 메서드와 경로가 들어가요. 그중 3처럼 특정 대상을 집는 부분은 경로 파라미터예요.',
    },
    {
      id: 'fs01-1-q4',
      source: '응답: 상태 코드 + 헤더 + 본문',
      type: 'mcq',
      question: '서버 코드에 버그가 있어 처리 중 예외가 터졌다. 어떤 상태 코드 무리일까?',
      choices: ['2xx', '3xx', '4xx', '5xx'],
      answer: 3,
      explanation: '5xx는 서버 잘못이에요. 4xx는 없는 주소나 잘못된 형식처럼 요청한 쪽 잘못이에요.',
    },
    {
      id: 'fs01-1-q5',
      source: '응답: 상태 코드 + 헤더 + 본문',
      type: 'mcq',
      question: '이미 신청한 강의를 또 신청했을 때 알맞은 상태 코드는?',
      choices: ['200 OK', '201 Created', '409 Conflict', '500 Internal Server Error'],
      answer: 2,
      explanation: '409는 "지금 상태와 충돌"이에요. 나중에 수강 신청 중복 방지를 만들 때 다시 만나요.',
    },
    {
      id: 'fs01-1-q6',
      source: 'JSON: 객체 {} 와 배열 []',
      type: 'mcq',
      question: 'GET /courses (강의 목록) 응답 본문의 모양은?',
      choices: ['{ }', '[ {..}, {..}, {..} ]', '"강의 목록"', '숫자 3'],
      answer: 1,
      explanation: '목록은 객체들을 담은 배열이에요. 강의 하나(GET /courses/1)는 객체 { }예요.',
    },
    {
      id: 'fs01-1-q7',
      source: 'curl로 직접 보기',
      type: 'ox',
      question: 'curl에서 -i 옵션을 빼면 상태 줄과 헤더가 사라지고 본문만 보인다.',
      answer: true,
      explanation: '-i가 있어야 200/404 같은 상태 코드를 볼 수 있어요. 디버깅은 상태 코드 확인부터예요.',
    },
  ],
}

export default topic
