import type { Topic } from '../../types'

const topic: Topic = {
  id: 'fa-04-query-curl',
  track: 'backend',
  group: 'FastAPI',
  title: '쿼리 파라미터와 cURL',
  order: 24,
  sections: [
    {
      title: '쿼리 파라미터 기본',
      notionIds: ['3efdf951bf8081d0a7cacadcbe6e2608'],
      points: [
        'URL의 ? 뒤에 이름=값 을 &로 이어 붙인 것이 쿼리 파라미터다. /posts?page=2&size=10.',
        'FastAPI에서는 함수 파라미터 중 경로에 없는 단순 타입(int, str, bool 등)이 자동으로 쿼리 파라미터가 된다. Flask의 request.args.get("page") 를 직접 쓸 필요가 없다.',
        '기본값이 있으면 선택, 없으면 필수다. page: int = 1 은 선택(없으면 1), keyword: str 은 필수(없으면 422).',
        '"없어도 되는데 기본값도 없는" 값은 keyword: str | None = None 으로 쓴다. 함수 안에서 if keyword: 로 들어왔는지 확인한다.',
      ],
      code: `@app.get("/posts")
def list_posts(page: int = 1, size: int = 10, keyword: str | None = None):
    return {"page": page, "size": size, "keyword": keyword}

# GET /posts                 → {"page": 1, "size": 10, "keyword": null}
# GET /posts?page=3&keyword=fastapi
#                            → {"page": 3, "size": 10, "keyword": "fastapi"}`,
    },
    {
      title: '타입 변환: bool과 list',
      points: [
        'bool 쿼리는 true/1/yes/on 은 True, false/0/no/off 는 False로 바뀐다(대소문자 무시). 그 밖의 값은 422.',
        '같은 이름을 여러 번 보내 목록을 받으려면 Query를 명시해야 한다. tags: list[str] = Query(default=[]) → ?tags=a&tags=b 는 ["a", "b"].',
        'Query를 쓰지 않고 tags: list[str] 이라고만 쓰면 FastAPI는 이를 요청 본문(body)으로 해석한다. list 같은 복합 타입은 기본이 본문이기 때문이다.',
      ],
      code: `from fastapi import Query

@app.get("/search")
def search(
    q: str,
    published: bool = True,
    tags: list[str] = Query(default=[]),
):
    return {"q": q, "published": published, "tags": tags}

# /search?q=api&published=no&tags=py&tags=web
# → {"q": "api", "published": false, "tags": ["py", "web"]}`,
    },
    {
      title: '경로 + 쿼리 + 페이지네이션',
      points: [
        '경로 파라미터와 쿼리 파라미터는 함께 쓸 수 있고, 함수 파라미터 순서는 상관없다. FastAPI는 이름으로 구분한다.',
        '목록 API의 기본은 페이지네이션이다. 데이터가 10만 개인데 한 번에 다 주면 서버·네트워크·브라우저 모두 느려진다.',
        'offset 방식: skip(건너뛸 개수)과 limit(가져올 개수). page와 size로 받는다면 offset = (page - 1) * size.',
        'limit에는 반드시 상한을 둔다. size: int = Query(10, ge=1, le=100). 상한이 없으면 ?size=1000000 한 번으로 서버가 힘들어진다.',
      ],
      code: `@app.get("/users/{user_id}/posts")
def user_posts(
    user_id: int,
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
):
    offset = (page - 1) * size
    return {"user_id": user_id, "offset": offset, "limit": size}`,
    },
    {
      title: 'cURL로 API 테스트하기',
      points: [
        'curl은 터미널에서 HTTP 요청을 보내는 도구다. 브라우저 없이 API를 빠르게 확인하고, 스크립트로 자동화할 수 있다. 브라우저가 아니라서 CORS 제한이 없다.',
        'curl URL 은 GET 요청이다. -X 로 메서드를 지정한다(-X POST, -X DELETE).',
        '-H 로 헤더를 붙인다. JSON을 보낼 때는 -H "Content-Type: application/json" 이 필요하다. -d 로 본문을 보낸다. -d를 쓰면 메서드를 안 적어도 POST가 된다.',
        '-i 는 응답 헤더와 상태 코드까지 보여 주고, -v 는 요청 헤더까지 자세히 보여 준다.',
        '쿼리 스트링에 &가 있으면 셸이 이를 "백그라운드 실행"으로 해석하므로 URL 전체를 따옴표로 감싼다.',
        'Windows PowerShell에서는 curl이 Invoke-WebRequest의 별칭일 수 있으므로 curl.exe 로 실행하는 것이 안전하다. JSON 따옴표 이스케이프도 셸마다 다르다.',
      ],
      code: `curl "http://127.0.0.1:8000/posts?page=2&size=5"
curl -i http://127.0.0.1:8000/health
curl -X POST http://127.0.0.1:8000/posts \\
  -H "Content-Type: application/json" \\
  -d '{"title": "hi", "content": "first"}'
curl -X DELETE http://127.0.0.1:8000/posts/3`,
    },
  ],
  questions: [
    {
      id: 'fa-04-01', type: 'mcq', source: '쿼리 파라미터 기본',
      question: '다음 함수에서 필수 쿼리 파라미터는?',
      code: `@app.get("/items")
def list_items(category: str, page: int = 1, q: str | None = None):
    ...`,
      choices: ['page', 'category', 'q', 'category와 q'],
      answer: 1,
      choiceExplanations: [
        '기본값 1이 있어서 선택이에요.',
        '정답. 기본값이 없으니 필수예요. ?category= 없이 요청하면 422예요.',
        '기본값 None이 있어서 선택이에요.',
        'q는 기본값이 None이라 선택이에요. 타입에 None이 들어갔다고 필수 여부가 바뀌는 게 아니라, 기본값 유무가 결정해요.',
      ],
      explanation: '필수 여부는 "기본값이 있느냐"로 정해져요.\n• category: str → 필수\n• page: int = 1 → 선택(기본 1)\n• q: str | None = None → 선택(기본 None)\n주의: q: str | None (기본값 없음)은 None을 허용하지만 여전히 필수예요.',
    },
    {
      id: 'fa-04-02', type: 'mcq', source: '쿼리 파라미터 기본',
      question: 'Flask에서 request.args.get("page", 1, type=int) 로 하던 일을 FastAPI에서는 어떻게 하나?',
      choices: ['함수 파라미터에 page: int = 1 을 선언', 'from fastapi import request 후 request.args.get 사용', '@app.get("/posts?page=1")로 경로에 직접 쓴다', 'Pydantic 모델을 반드시 만들어야 한다'],
      answer: 0,
      choiceExplanations: [
        '정답. 파라미터 선언만으로 추출·변환·검증·문서화가 한 번에 돼요.',
        'FastAPI에는 Flask 같은 전역 request 객체가 없어요.',
        '경로 문자열에 쿼리를 넣으면 안 돼요. 쿼리는 경로 매칭에 쓰이지 않아요.',
        '단순 값은 모델 없이 파라미터로 충분해요.',
      ],
      explanation: 'FastAPI의 핵심 철학: "필요한 값을 함수 파라미터로 선언하면 FastAPI가 채워 준다."\n원본 요청이 정말 필요하면 request: Request 파라미터를 선언해서 받을 수도 있어요(Request 토픽).',
    },
    {
      id: 'fa-04-03', type: 'mcq', source: '타입 변환: bool과 list',
      question: 'published: bool = False 일 때 ?published=yes 와 ?published=hello 의 결과는?',
      choices: ['True / True', 'False / False', '422 / 422', 'True / 422'],
      answer: 3,
      choiceExplanations: [
        '아무 문자열이나 True가 되지 않아요.',
        'yes는 True예요.',
        'yes는 허용 값이에요.',
        '정답. yes는 True로 인정되고, hello는 bool로 해석할 수 없어 422예요.',
      ],
      explanation: 'True로 인정: true, 1, yes, on (대소문자 무시)\nFalse로 인정: false, 0, no, off\n그 외의 값은 422예요. 파이썬의 bool("hello")가 True인 것과 다르게 동작하니 주의하세요.',
    },
    {
      id: 'fa-04-04', type: 'mcq', source: '타입 변환: bool과 list',
      question: '?tags=py&tags=web 로 태그 목록을 받으려 한다. 올바른 선언은?',
      choices: ['tags: list[str]', 'tags: str = "py,web"', 'tags: list[str] = Query(default=[])', 'tags: set'],
      answer: 2,
      choiceExplanations: [
        'Query 없이 list를 쓰면 FastAPI가 요청 본문(JSON)에서 찾으려 해요.',
        '쉼표로 합친 문자열을 직접 split하는 방법도 가능하지만, FastAPI의 목록 쿼리 기능과는 달라요.',
        '정답. Query로 "이건 쿼리 파라미터"라고 명시하면 같은 이름의 값들을 리스트로 모아 줘요.',
        '타입 정보가 부족하고, 역시 본문으로 해석돼요.',
      ],
      explanation: 'FastAPI의 기본 해석 규칙:\n• 경로에 이름이 있으면 → 경로 파라미터\n• 단순 타입(int, str, bool, float…) → 쿼리 파라미터\n• Pydantic 모델이나 list, dict 같은 복합 타입 → 본문(body)\n복합 타입을 쿼리로 받고 싶을 때만 Query()를 명시하면 돼요.',
    },
    {
      id: 'fa-04-05', type: 'short', source: '경로 + 쿼리 + 페이지네이션',
      question: 'page=3, size=20 일 때 DB 조회에 넘길 offset 값은? (숫자)',
      answer: ['40'],
      explanation: 'offset = (page - 1) * size = (3 - 1) * 20 = 40이에요. 앞의 40개(1~2페이지)를 건너뛰고 41번째부터 20개를 가져와요.\nSQL: SELECT ... ORDER BY id LIMIT 20 OFFSET 40\nSQLAlchemy: select(Post).order_by(Post.id).offset(40).limit(20)\n정렬(ORDER BY) 없이 페이지를 나누면 페이지마다 순서가 바뀔 수 있으니 꼭 정렬 기준을 두세요.',
    },
    {
      id: 'fa-04-06', type: 'mcq', source: '경로 + 쿼리 + 페이지네이션',
      question: 'size 쿼리 파라미터에 상한(le=100)을 두는 이유로 가장 알맞은 것은?',
      choices: ['?size=1000000 같은 요청으로 서버와 DB에 과도한 부하가 걸리는 것을 막으려고', 'FastAPI는 100보다 큰 숫자를 처리하지 못해서', '문서에 숫자가 예쁘게 보이도록', 'offset 계산이 틀려서'],
      answer: 0,
      choiceExplanations: [
        '정답. 클라이언트 입력은 믿을 수 없어요. 실수든 공격이든 큰 값이 오면 메모리와 DB가 버티지 못해요.',
        '큰 숫자도 문제없이 다뤄요.',
        '부가 효과일 뿐 이유는 아니에요.',
        '계산은 정확해요. 문제는 한 번에 가져오는 양이에요.',
      ],
      explanation: '목록 API 체크리스트: ① 기본 페이지 크기 ② 최대 크기 제한(le) ③ 최소값(ge=1) ④ 정렬 기준 고정.\n데이터가 아주 많아지면 OFFSET이 커질수록 느려지는 문제가 있어서, "마지막으로 본 id 다음부터" 가져오는 커서(keyset) 페이지네이션을 쓰기도 해요(DB 성능 토픽).',
    },
    {
      id: 'fa-04-07', type: 'ox', source: '경로 + 쿼리 + 페이지네이션',
      question: 'def f(page: int = 1, user_id: int) 처럼 경로 파라미터 user_id를 기본값 있는 파라미터 뒤에 두면 파이썬 문법 에러가 난다.',
      answer: true,
      explanation: '맞아요. 파이썬 규칙상 기본값이 없는 파라미터는 기본값이 있는 파라미터 뒤에 올 수 없어요(SyntaxError).\n해결: 순서를 바꾸거나(user_id 먼저), Annotated와 Query/Path를 쓰거나, 맨 앞에 * 를 넣어 키워드 전용 인자로 만들면 돼요. FastAPI는 이름으로 구분하니 순서는 자유롭게 바꿔도 괜찮아요.',
    },
    {
      id: 'fa-04-08', type: 'mcq', source: 'cURL로 API 테스트하기',
      question: 'JSON 본문으로 게시글을 생성하는 curl 명령으로 맞는 것은?',
      choices: [
        'curl http://localhost:8000/posts?title=hi',
        'curl -X GET http://localhost:8000/posts -d \'{"title":"hi"}\'',
        'curl -X POST http://localhost:8000/posts -H "Content-Type: application/json" -d \'{"title":"hi"}\'',
        'curl -X POST http://localhost:8000/posts -d title=hi',
      ],
      answer: 2,
      choiceExplanations: [
        'GET 요청에 쿼리 스트링이라 본문이 없어요.',
        'GET으로 본문을 보내는 건 관례에 맞지 않아요. 요청이 생성 라우트(@app.post)가 아니라 GET 라우트로 가서(없으면 405) 글이 만들어지지 않아요.',
        '정답. 메서드(POST) + JSON 헤더 + 본문(-d)이 모두 있어요.',
        'Content-Type이 form 형식(application/x-www-form-urlencoded)이 돼서 JSON 본문을 기대하는 FastAPI 모델은 422를 줘요.',
      ],
      explanation: 'JSON POST의 3요소: -X POST, -H "Content-Type: application/json", -d \'{...}\'.\n-d만 써도 curl이 POST로 바꿔 주지만, 명시하는 게 읽기 좋아요. Content-Type을 빼먹으면 서버가 본문을 JSON으로 해석하지 못하는 경우가 많아요.',
    },
    {
      id: 'fa-04-09', type: 'short', source: 'cURL로 API 테스트하기',
      question: 'curl에서 응답 본문뿐 아니라 상태 줄(HTTP/1.1 200 OK)과 응답 헤더도 함께 출력하는 옵션은? (한 글자 옵션)',
      answer: ['-i', 'i', '--include'],
      explanation: '-i(--include)예요. 상태 코드와 Content-Type, set-cookie 같은 응답 헤더를 확인할 때 써요.\n-v(--verbose)는 요청 헤더까지 포함해 주고받는 전체 과정을 보여 줘요. 세션 쿠키가 제대로 오가는지 볼 때 유용해요.',
    },
    {
      id: 'fa-04-10', type: 'mcq', source: 'cURL로 API 테스트하기',
      question: 'curl http://localhost:8000/posts?page=2&size=5 를 따옴표 없이 실행했더니 size가 적용되지 않았다. 이유는?',
      choices: ['FastAPI가 size를 지원하지 않아서', 'curl은 쿼리 스트링을 지원하지 않아서', '포트가 틀려서', '셸이 &를 "명령을 백그라운드로 실행"으로 해석해 URL이 page=2에서 잘려서'],
      answer: 3,
      choiceExplanations: [
        '서버 문제가 아니에요.',
        'curl은 쿼리 스트링을 잘 보내요.',
        '포트는 요청이 간 것으로 보아 맞아요.',
        '정답. URL 전체를 "..."로 감싸야 해요.',
      ],
      explanation: '셸 특수 문자(&, ?, *, 공백 등)가 들어간 URL은 항상 따옴표로 감싸는 습관을 들이세요.\ncurl "http://localhost:8000/posts?page=2&size=5"',
    },
    {
      id: 'fa-04-11', type: 'ox', source: 'cURL로 API 테스트하기',
      question: '프론트(브라우저)에서는 CORS 에러가 나는데 curl에서는 같은 요청이 성공할 수 있다.',
      answer: true,
      explanation: '맞아요. CORS는 브라우저가 거는 제한이라 curl에는 없어요.\n그래서 "curl은 되고 브라우저만 안 된다"는 건 오히려 진단 정보예요. 서버 로직은 정상이고 CORS 설정만 고치면 된다는 뜻이에요.',
    },
    {
      id: 'fa-04-12', type: 'mcq', source: '쿼리 파라미터 기본',
      question: 'GET /posts?keyword= (값이 빈 문자열) 요청에서 keyword: str | None = None 의 값은?',
      choices: ['None', '"" (빈 문자열)', '422 에러', '"keyword"'],
      answer: 1,
      choiceExplanations: [
        '파라미터 자체는 왔기 때문에 기본값 None이 쓰이지 않아요.',
        '정답. 이름은 있고 값이 비어 있으니 빈 문자열이 들어와요.',
        '빈 문자열도 유효한 str이에요.',
        '값이 아니라 이름이에요.',
      ],
      explanation: '"안 보냄"(None)과 "빈 값을 보냄"("")은 달라요.\nif keyword: 로 검사하면 둘 다 거짓이라 함께 처리되지만, if keyword is not None: 은 빈 문자열을 통과시켜요. 검색어가 비면 전체 목록을 주려면 if keyword: 가 더 자연스러워요. 빈 값을 막으려면 Query(min_length=1)을 쓰세요.',
    },
  ],
}

export default topic
