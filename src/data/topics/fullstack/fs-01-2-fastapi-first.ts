import type { Topic } from '../../types'

const topic: Topic = {
  id: 'fs-01-2-fastapi-first',
  track: 'fullstack',
  group: '01. 웹의 기본: HTTP·API·CORS',
  title: '1-2. FastAPI로 첫 API 만들기',
  order: 102,
  notionId: '3fbdf951bf8080448922ee6fd742f83d',
  addedAt: '2026-11-06',
  sections: [
    {
      title: '요청 하나가 처리되는 순서',
      slides: [
        {
          title: '서버는 먼저 주소부터 봐요',
          blocks: [
            { type: 'say', text: '이번 수업에서는 진짜 API를 만들어요. 목표는 **`GET /courses`가 강의 3개를 JSON으로 돌려주는 것**이에요.\n\n그 전에, 서버가 요청 하나를 받으면 무슨 순서로 일하는지 볼게요.' },
            {
              type: 'list',
              ordered: true,
              items: [
                '**요청 받기**: `GET /courses`',
                '**처리할 함수 찾기**: 메서드 + 경로가 **정확히 일치**하는 함수를 찾아요. 이걸 **라우팅**이라고 해요',
                '**데이터 준비**: 오늘은 고정 데이터, 나중엔 DB',
                '**JSON으로 응답**: 상태 코드(200)와 함께',
              ],
            },
            { type: 'ask', q: '왜 "함수 찾기"가 "데이터 준비"보다 먼저일까요?', a: '서버에는 `/courses`, `/users`, `/orders`처럼 경로가 여러 개 있어요. 주소를 보기 전에 짐부터 내리면 엉뚱한 집에 배달하게 되죠. 어떤 함수가 처리할지 정해야 그 함수가 필요한 데이터를 준비할 수 있어요.' },
          ],
        },
      ],
    },
    {
      title: '데코레이터로 경로 연결하기',
      slides: [
        {
          title: '첫 FastAPI 코드',
          blocks: [
            {
              type: 'code',
              code: `from fastapi import FastAPI

app = FastAPI()                 # 서버 앱 하나 만들기

@app.get("/courses")            # GET /courses 요청이 오면 아래 함수를 실행해 줘
def get_courses():
    return [
        {"id": 1, "title": "파이썬 입문", "price": 0},
        {"id": 2, "title": "FastAPI 기초", "price": 33000},
        {"id": 3, "title": "Next.js 시작하기", "price": 44000},
    ]`,
            },
            { type: 'say', text: '`@app.get("/courses")`가 핵심이에요. 함수 위에 `@`로 붙이는 이것을 **데코레이터**라고 해요. "GET /courses 요청이 오면 아래 함수를 실행하라"고 서버에 **등록하는 이름표**예요.' },
            { type: 'code', code: `uv add "fastapi[standard]"
uv run fastapi dev main.py
# Uvicorn running on http://127.0.0.1:8000 → 브라우저에서 /courses 열기` },
          ],
        },
        {
          title: '데코레이터가 없으면',
          blocks: [
            { type: 'ask', q: '@app.get("/courses") 앞에 #을 붙여 주석 처리하고 /courses 로 요청하면 어떻게 될까요?', a: '**404 `{"detail":"Not Found"}`** 가 나와요. 함수는 있지만 **어떤 주소와도 연결되지 않았으니까요.** 라우팅은 "가장 비슷한 함수"를 고르는 게 아니라 **정확히 일치하는 것만** 찾아요. 없으면 아무것도 실행하지 않고 404예요.' },
            {
              type: 'table',
              head: ['함수에 적는 것', '연결 수단이 될까?'],
              rows: [
                ['함수 이름만 courses로', '✗ 서버가 받는 건 메서드와 경로지 함수 이름이 아니에요'],
                ['데이터만', '✗ 데이터는 배달할 짐이지 주소가 아니에요'],
                ['메서드 + 경로 (데코레이터)', '○'],
              ],
            },
            { type: 'note', tone: 'warn', text: 'HTTP에서는 `GET`이라고 부르지만 파이썬은 대소문자를 구분해요. `@app.GET(...)`이라고 쓰면 `AttributeError`예요. 코드에서는 소문자 `@app.get`, `@app.post`.' },
          ],
        },
      ],
    },
    {
      title: '목록은 [] 로 감싸기',
      slides: [
        {
          title: '바깥 [] 는 포장지',
          blocks: [
            { type: 'say', text: '1-1에서 "목록은 배열 `[ ]`"이라고 했죠. 코드에서도 바깥 `[ ]`를 꼭 써요.' },
            { type: 'ask', q: '바깥 [ ] 없이 {...}, {...}, {...} 처럼 객체 3개를 쉼표로만 이어서 응답하면 무엇이 문제일까요?', a: 'JSON 응답은 **값 하나**만 담을 수 있어요. 낱개 3개는 하나의 JSON이 아니라서 프론트가 읽지 못해요. 그리고 프론트에서 `courses.map(...)`으로 그리려면 배열이어야 하고요. 바깥 `[ ]`는 "이 셋은 한 묶음"이라는 **포장지**예요.' },
            { type: 'note', tone: 'tip', text: '파이썬에서 `return {...}, {...}, {...}`처럼 쓰면 사실 **튜플**이 되고, FastAPI가 그걸 배열로 바꿔 줘서 우연히 `[...]`가 나가요. 결과는 맞지만 의도가 코드에 안 보이니, 목록은 항상 `[ ]`로 **명시**해요.' },
          ],
        },
        {
          title: '키는 반드시 따옴표',
          blocks: [
            { type: 'code', code: `{"id": 1, "title": "파이썬 입문"}   # ✅
{id: 1, title: "파이썬 입문"}       # ❌` },
            { type: 'say', text: '파이썬 딕셔너리의 키는 문자열이라 `"id"`처럼 따옴표가 필요해요. 특히 `id`는 파이썬 **내장 함수** 이름이라, 따옴표 없이 쓰면 에러 없이 **함수 자체가 키로** 들어가서 JSON으로 바꿀 때 알 수 없는 에러가 나요. 조용히 틀리는 경우라 더 위험해요.' },
            { type: 'note', tone: 'warn', text: '키 오타(`tiele`)도 에러 없이 나가요. 그런데 프론트에서 `course.title`로 꺼내면 아무것도 안 떠요. 오타 하나가 프론트 버그로 나타나는 거예요. 나중에 3-3에서 배울 **Pydantic 응답 모델**이 이런 실수를 막아 줘요.' },
          ],
        },
      ],
    },
    {
      title: '자동 문서와 파라미터',
      slides: [
        {
          title: '/docs: 공짜 API 문서',
          blocks: [
            { type: 'say', text: '서버를 켠 채로 `http://127.0.0.1:8000/docs`를 열어 보세요. FastAPI가 등록된 경로 목록을 **자동으로** 문서로 보여 줘요. 라우팅 표를 눈으로 보는 셈이에요.' },
            { type: 'say', text: '"Try it out" 버튼으로 주소창 없이 요청을 보낼 수 있어요. 주소창으로는 GET만 보낼 수 있으니, **POST 같은 요청을 테스트**하거나 **프론트 없이 백엔드만** 확인할 때 정말 유용해요.' },
          ],
        },
        {
          title: '경로 파라미터와 쿼리 파라미터',
          blocks: [
            {
              type: 'code',
              code: `@app.get("/courses/{course_id}")      # {course_id} 자리가 경로 파라미터
def get_course(course_id: int):        # /courses/2 → course_id = 2 (숫자로 변환까지)
    return {"id": course_id}           # 하나니까 {}

@app.get("/search")
def search(q: str, page: int = 1):     # /search?q=파이썬&page=2 → 쿼리 파라미터
    return {"q": q, "page": page}`,
            },
            {
              type: 'table',
              head: ['', '경로 파라미터', '쿼리 파라미터'],
              rows: [
                ['모양', '`/courses/2`', '`/courses?page=2&sort=price`'],
                ['쓰는 때', '**무엇을**: 특정 대상 하나', '**어떻게 볼지**: 필터·정렬·페이지'],
              ],
            },
            { type: 'say', text: '함수 인자에 `course_id: int`라고 **타입**을 적으면 FastAPI가 문자열 "2"를 숫자 2로 바꿔 주고, `/courses/abc`처럼 숫자가 아니면 자동으로 **422 에러**를 돌려줘요. 3-4에서 다시 볼게요.\n\n수업 끝! 확인 문제 가요.' },
          ],
        },
      ],
    },
  ],
  questions: [
    {
      id: 'fs01-2-q1',
      source: '요청 하나가 처리되는 순서',
      type: 'mcq',
      question: '서버가 요청을 처리하는 순서로 옳은 것은?',
      choices: ['데이터 준비 → 함수 찾기 → 요청 받기 → 응답', '요청 받기 → 처리할 함수 찾기(라우팅) → 데이터 준비 → JSON 응답', '응답 → 요청 받기 → 데이터 준비', '함수 찾기 → 응답 → 데이터 준비'],
      answer: 1,
      explanation: '메서드+경로로 함수를 먼저 찾아야 그 함수가 필요한 데이터를 준비할 수 있어요.',
    },
    {
      id: 'fs01-2-q2',
      source: '데코레이터로 경로 연결하기',
      type: 'mcq',
      question: '@app.get("/courses") 를 지우고 /courses 로 요청하면?',
      choices: ['가장 비슷한 함수가 실행된다', '404 {"detail":"Not Found"}', '500 에러', '빈 배열 []'],
      answer: 1,
      explanation: '함수는 있지만 어떤 경로와도 연결되지 않아서, 일치하는 게 없으니 404예요.',
    },
    {
      id: 'fs01-2-q3',
      source: '데코레이터로 경로 연결하기',
      type: 'ox',
      question: 'FastAPI에서 @app.GET("/courses") 라고 대문자로 써도 동작한다.',
      answer: false,
      explanation: '파이썬은 대소문자를 구분해서 AttributeError가 나요. 코드에서는 소문자 get, post를 써요.',
    },
    {
      id: 'fs01-2-q4',
      source: '목록은 [] 로 감싸기',
      type: 'mcq',
      question: '딕셔너리 키를 따옴표 없이 {id: 1} 로 쓰면?',
      choices: ['"id"로 자동 변환된다', 'id는 내장 함수라 함수 자체가 키로 들어가 JSON 변환 때 문제가 생긴다', '항상 문법 에러', '아무 문제 없다'],
      answer: 1,
      explanation: '키는 문자열이라 "id"처럼 따옴표가 필요해요. id는 내장 함수라 조용히 틀려서 더 위험해요.',
    },
    {
      id: 'fs01-2-q5',
      source: '자동 문서와 파라미터',
      type: 'short',
      question: 'FastAPI 서버에서 등록된 API 목록을 자동 문서로 보여 주는 경로는? (/____)',
      answer: ['/docs', 'docs'],
      explanation: '/docs에서 Try it out으로 POST 같은 요청도 프론트 없이 테스트할 수 있어요.',
    },
    {
      id: 'fs01-2-q6',
      source: '자동 문서와 파라미터',
      type: 'mcq',
      question: '강의 목록을 가격순으로 정렬해 보여 주는 값은 어디에 두는 게 알맞을까?',
      choices: ['경로 파라미터 /courses/price', '쿼리 파라미터 /courses?sort=price', '요청 헤더', 'DB 이름'],
      answer: 1,
      explanation: '"어떻게 볼지"(정렬·필터·페이지)는 쿼리 파라미터, "무엇을"(특정 대상)은 경로 파라미터예요.',
    },
  ],
}

export default topic
