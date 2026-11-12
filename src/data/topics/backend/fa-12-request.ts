import type { Topic } from '../../types'

const topic: Topic = {
  id: 'fa-12-request',
  track: 'backend',
  group: 'FastAPI',
  title: 'Request · Query · Body · Header · Form',
  order: 32,
  sections: [
    {
      title: '값의 출처를 명시하는 함수들',
      slides: [
        {
          title: '이 값은 어디서 오나요?',
          blocks: [
            { type: 'say', text: 'FastAPI는 기본 규칙(경로 이름 → 경로, 단순 타입 → 쿼리, 모델 → 본문)으로 값의 출처를 정해요. 규칙과 **다르게** 받거나, 검증·문서 정보를 붙이려면 출처를 **직접 적어** 줘요.' },
            {
              type: 'table',
              head: ['함수', '값의 출처'],
              rows: [
                ['`Path()`', '경로'],
                ['`Query()`', '쿼리 스트링'],
                ['`Body()`', 'JSON 본문'],
                ['`Header()`', '요청 헤더'],
                ['`Cookie()`', '쿠키'],
                ['`Form()`', 'HTML 폼 데이터'],
                ['`File()` / `UploadFile`', '업로드 파일'],
              ],
            },
            { type: 'say', text: '모두 같은 검증 인자(`gt`, `min_length`, `pattern`…)와 문서 인자(`description`, `examples`, `alias`)를 받아요. 하나를 익히면 나머지도 똑같아요.' },
          ],
        },
        {
          title: '함께 쓰는 모습',
          blocks: [
            { type: 'code', code: `from typing import Annotated
from fastapi import Query, Header, Cookie

@app.get("/items")
def items(
    q: Annotated[str | None, Query(min_length=2, max_length=50)] = None,
    user_agent: Annotated[str | None, Header()] = None,
    x_request_id: Annotated[str | None, Header()] = None,
    ads_id: Annotated[str | None, Cookie()] = None,
):
    return {"q": q, "ua": user_agent, "ads_id": ads_id}` },
          ],
        },
      ],
    },
    {
      title: 'Query 심화',
      slides: [
        {
          title: '이상한 이름과 묶어 받기',
          blocks: [
            { type: 'code', code: `# 하이픈이 든 쿼리 이름: ?item-query=abc
def f(item_query: Annotated[str | None, Query(alias="item-query")] = None): ...

# 여러 쿼리를 모델 하나로 묶기 (최신 FastAPI)
class FilterParams(BaseModel):
    model_config = {"extra": "forbid"}
    limit: int = Field(10, gt=0, le=100)
    offset: int = Field(0, ge=0)
    order_by: Literal["created_at", "updated_at"] = "created_at"

@app.get("/posts")
def list_posts(filters: Annotated[FilterParams, Query()]):
    return filters` },
            { type: 'list', items: ['`item-query`처럼 **파이썬 변수 이름이 될 수 없는** 쿼리는 `alias`로 받아요', '필수 쿼리에 검증을 붙이려면 **기본값 없이** `Annotated[str, Query(min_length=3)]`', '여러 목록 API가 같은 limit·offset·order_by를 받는다면 **모델 하나로 묶어** 재사용해요'] },
          ],
        },
      ],
    },
    {
      title: 'Body 심화',
      slides: [
        {
          title: '단순 값도 본문에서',
          blocks: [
            { type: 'say', text: 'fa-09에서 봤듯이 모델이 아닌 단순 값(`importance: int`)을 본문에서 받으려면 **`Body()`가 꼭** 필요해요. 없으면 쿼리로 해석돼요.' },
            { type: 'list', items: ['`Body(examples=[...])` → `/docs`의 요청 예시 채우기 (모델에서는 `model_config = {"json_schema_extra": {"examples": [...]}}`)', '`data: dict[str, Any] = Body()` → 아무 모양이나 받기. 하지만 **검증이 사라지니** 마지막 수단이에요'] },
          ],
        },
      ],
    },
    {
      title: 'Header와 Cookie',
      slides: [
        {
          title: '밑줄은 하이픈으로',
          blocks: [
            { type: 'say', text: '`Header()`는 파이썬 이름의 **밑줄(`_`)을 하이픈(`-`)으로** 자동으로 바꿔요. `user_agent` → `User-Agent`, `x_request_id` → `X-Request-Id`. HTTP 헤더 이름은 **대소문자를 구분하지 않아서** `user-agent`도 같은 헤더예요.\n\n같은 헤더가 여러 번 오면 `x_token: list[str] | None = Header(default=None)`로 모두 받아요.' },
          ],
        },
        {
          title: '인증 토큰은 보안 도구로',
          blocks: [
            { type: 'say', text: '인증 토큰은 보통 `Authorization: Bearer <토큰>` 헤더로 와요. `Header()`로 직접 꺼내서 "Bearer " 떼어 내기를 할 수도 있지만, FastAPI의 **보안 도구**(`HTTPBearer`, `OAuth2PasswordBearer`)를 쓰는 게 나아요.\n• 형식 검사와 401 응답을 알아서 해 주고\n• `/docs`의 **Authorize 버튼**과 연결돼서 문서에서 바로 로그인해 테스트할 수 있어요' },
            { type: 'say', text: '`Cookie()`는 같은 이름의 쿠키 값을 읽어요. 세션 쿠키 같은 값은 인증 수업에서 의존성으로 다뤄요.' },
          ],
        },
      ],
    },
    {
      title: 'Form과 파일 업로드',
      slides: [
        {
          title: '폼은 JSON이 아니에요',
          blocks: [
            { type: 'say', text: 'HTML `<form method="post">`은 **JSON이 아니라** `application/x-www-form-urlencoded`(파일이 있으면 `multipart/form-data`)로 보내요. 그래서 Pydantic 모델(JSON 본문)로 받으면 **422**가 나요. 폼은 `Form()`으로 받아요. **`python-multipart`** 패키지가 필요해요.' },
            { type: 'code', code: `from fastapi import Form, UploadFile

@app.post("/login-form")
def login_form(username: Annotated[str, Form()], password: Annotated[str, Form()]):
    ...` },
            { type: 'note', tone: 'warn', text: '한 엔드포인트에서 **JSON 본문과 Form을 동시에** 받을 수는 없어요. 요청 하나의 Content-Type은 하나뿐이니까요.' },
          ],
        },
        {
          title: '파일 받기와 꼭 할 검사',
          blocks: [
            { type: 'code', code: `@app.post("/avatar")
async def upload_avatar(file: UploadFile):
    if file.content_type not in {"image/png", "image/jpeg"}:
        raise HTTPException(400, "PNG/JPEG만 가능합니다")
    data = await file.read()
    ...` },
            { type: 'say', text: '`UploadFile`은 `file.filename`, `file.content_type`, `await file.read()`를 제공해요. 큰 파일은 **디스크 임시 파일**에 둬서 메모리를 아껴요.' },
            { type: 'list', items: ['**크기** 검사 — 10GB 파일을 올리면?', '**확장자·MIME 타입** 검사 — 이미지 자리에 실행 파일이 오면?', '저장할 때 **새 이름**(UUID) 붙이기 — 사용자 파일 이름을 그대로 경로로 쓰면 덮어쓰기·경로 조작 위험'] },
          ],
        },
      ],
    },
    {
      title: 'Request 객체를 직접 쓰기',
      slides: [
        {
          title: '날것의 요청 객체',
          blocks: [
            { type: 'code', code: `from fastapi import Request

@app.post("/webhook")
async def webhook(request: Request):
    raw = await request.body()                     # 서명 검증용 원본 바이트
    sig = request.headers.get("X-Signature")
    ip = request.client.host if request.client else None
    ...` },
            { type: 'say', text: '`request: Request`를 선언하면 **원본 요청 객체**를 받아요. `request.method`, `request.url`, `request.headers`, `request.query_params`, `request.client.host`(IP), `request.cookies`, 그리고 `await request.json()`, `await request.body()`.' },
            { type: 'note', tone: 'warn', text: '`await request.json()`으로 받은 값은 **검증되지 않은 날것**이에요. 자동 검증도, `/docs` 표시도 없어요. 일반적인 입력은 지금까지처럼 **선언형 파라미터**로 받아요.' },
          ],
        },
        {
          title: '언제 Request를 쓸까',
          blocks: [
            { type: 'list', items: ['**웹훅 서명 검증** — 결제사가 보낸 "받은 그대로의 바이트"가 필요해서 `await request.body()`', '**로그·감사 기록** — IP, User-Agent 남기기', '**템플릿 렌더링** — `TemplateResponse`에 request 넘기기 (Jinja 수업)'] },
            { type: 'say', text: '클라우드에 배포하면 `request.client.host`가 항상 같은 내부 IP일 수 있어요. 요청이 **프록시(로드밸런서)를 거쳐서** 오기 때문이에요. 진짜 사용자 IP는 `X-Forwarded-For` 헤더에 있고, `uvicorn --proxy-headers` 옵션으로 반영해요.' },
          ],
        },
      ],
    },
  ],
  questions: [
    {
      id: 'fa-12-01', type: 'mcq', source: '값의 출처를 명시하는 함수들',
      question: '요청 헤더 X-Request-Id 값을 받으려 한다. 올바른 선언은?',
      choices: ['x_request_id: Annotated[str | None, Header()] = None', 'x_request_id: str = Query()', 'x_request_id: str (아무것도 안 붙임)', 'X-Request-Id: str = Header()'],
      answer: 0,
      choiceExplanations: [
        '정답. Header가 밑줄을 하이픈으로 바꿔 X-Request-Id 헤더를 찾아요(대소문자 무시).',
        '쿼리 스트링에서 찾아요.',
        '단순 타입이라 쿼리로 해석돼요.',
        '파이썬 변수 이름에 하이픈을 쓸 수 없어요.',
      ],
      explanation: 'Header()의 자동 변환: user_agent → User-Agent, x_request_id → X-Request-Id.\n변환을 끄려면 Header(convert_underscores=False). 단, 일부 프록시는 밑줄이 들어간 헤더를 버리니 하이픈 헤더를 쓰는 게 안전해요.',
    },
    {
      id: 'fa-12-02', type: 'mcq', source: 'Query 심화',
      question: '쿼리 이름이 item-query 처럼 하이픈을 포함한다. 파이썬에서 받는 방법은?',
      choices: ['item-query: str', 'item_query: Annotated[str, Query(alias="item-query")]', 'item_query: str (자동 변환됨)', '받을 수 없다'],
      answer: 1,
      choiceExplanations: [
        '파이썬 변수 이름에 하이픈을 쓸 수 없어요.',
        '정답. alias로 외부 이름을 지정해요.',
        '자동 변환은 Header()에만 있어요. 쿼리는 이름이 정확히 같아야 해요.',
        'alias로 받을 수 있어요.',
      ],
      explanation: 'alias = "바깥에서 쓰는 이름". 파이썬 안에서는 item_query, URL에서는 item-query.\nPydantic Field의 alias와 같은 개념이에요.',
    },
    {
      id: 'fa-12-03', type: 'mcq', source: 'Query 심화',
      question: '여러 목록 API에서 limit, offset, order_by 쿼리를 똑같이 받는다. 가장 깔끔한 방법은?',
      choices: ['모든 라우트에 세 파라미터를 복사해 넣는다', 'request.query_params를 직접 파싱한다', 'FilterParams(BaseModel)를 만들고 filters: Annotated[FilterParams, Query()]로 받는다', '세 값을 하나의 문자열로 받아 split한다'],
      answer: 2,
      choiceExplanations: [
        '규칙이 바뀌면 모든 곳을 고쳐야 해요.',
        '검증과 문서화가 사라져요.',
        '정답. 쿼리 묶음을 모델로 재사용하고, 검증 규칙도 한 곳에 모여요. (의존성 클래스로 만드는 방법도 있어요.)',
        '형식이 모호하고 검증이 어려워져요.',
      ],
      explanation: '최신 FastAPI는 Pydantic 모델을 Query()로 받아 쿼리 묶음으로 쓸 수 있어요. 예전 방식은 Depends로 공통 파라미터 함수를 만드는 거예요(의존성 토픽). 둘 다 "반복되는 파라미터를 한 곳에 모으기"가 목적이에요.',
    },
    {
      id: 'fa-12-04', type: 'short', source: 'Body 심화',
      question: '함수 파라미터 importance: int 를 쿼리가 아니라 JSON 본문에서 받으려면 Annotated[int, ____()] 의 빈칸에 들어갈 함수는?',
      answer: ['Body', 'Body()'],
      explanation: 'Body()예요. 단순 타입의 기본 출처는 쿼리라서, 본문에서 받으려면 반드시 명시해야 해요.\nBody 파라미터가 하나뿐이면 본문은 {"importance": 5}가 아니라 값 5 자체가 될 수 있어요. 키로 감싸려면 Body(embed=True)를 써요.',
    },
    {
      id: 'fa-12-05', type: 'mcq', source: 'Header와 Cookie',
      question: 'API 토큰을 Authorization: Bearer abc 헤더로 받는다. FastAPI 보안 도구(HTTPBearer 등)를 쓰는 것이 Header()로 직접 파싱하는 것보다 나은 점은?',
      choices: ['/docs의 Authorize 버튼과 OpenAPI 보안 스키마가 연결되고, 형식이 틀리면 표준 401/403 응답을 준다', '토큰이 자동으로 검증된다', '헤더를 암호화한다', '토큰을 DB에 저장해 준다'],
      answer: 0,
      choiceExplanations: [
        '정답. 문서·테스트 연동과 일관된 에러 처리가 장점이에요.',
        '토큰의 유효성(서명, 만료) 검증은 여전히 직접 해야 해요. 도구는 "꺼내기"까지만 해 줘요.',
        '암호화는 HTTPS가 해요.',
        '저장 기능은 없어요.',
      ],
      explanation: 'FastAPI의 보안 클래스(HTTPBasic, HTTPBearer, OAuth2PasswordBearer, APIKeyHeader)는 "자격 증명을 요청에서 꺼내는 의존성"이에요. 꺼낸 값이 진짜인지 확인하는 로직은 그 위에 직접 만들어요(인증 토픽).',
    },
    {
      id: 'fa-12-06', type: 'ox', source: 'Header와 Cookie',
      question: 'HTTP 헤더 이름은 대소문자를 구분하므로 user-agent와 User-Agent는 다른 헤더다.',
      answer: false,
      explanation: 'HTTP 헤더 이름은 대소문자를 구분하지 않아요. HTTP/2에서는 아예 모두 소문자로 전송돼요.\nStarlette의 request.headers도 대소문자 구분 없이 조회돼요. request.headers["user-agent"] == request.headers["User-Agent"].',
    },
    {
      id: 'fa-12-07', type: 'mcq', source: 'Form과 파일 업로드',
      question: 'Jinja2로 만든 HTML 로그인 폼(<form method="post">)을 제출했더니 422가 난다. 함수는 def login(data: LoginModel) 이다. 원인은?',
      choices: ['비밀번호가 틀려서', 'GET으로 보내서', '폼은 JSON이 아니라 form 데이터로 오는데, 모델 파라미터는 JSON 본문을 기대해서', 'CSRF 때문에'],
      answer: 2,
      choiceExplanations: [
        '422는 검증 단계 에러라 로그인 로직까지 가지 않았어요.',
        'method="post"라 POST로 왔어요.',
        '정답. username: Annotated[str, Form()] 처럼 Form으로 받아야 해요(python-multipart 필요).',
        'CSRF 보호는 기본으로 켜져 있지 않아요.',
      ],
      explanation: 'Content-Type이 다르면 파싱 방법도 달라요.\n• application/json → Body/모델\n• application/x-www-form-urlencoded, multipart/form-data → Form/File\n최신 FastAPI에서는 data: Annotated[LoginModel, Form()]처럼 모델을 Form으로 받을 수도 있어요.',
    },
    {
      id: 'fa-12-08', type: 'short', source: 'Form과 파일 업로드',
      question: 'FastAPI에서 Form()이나 파일 업로드를 쓰려면 추가로 설치해야 하는 패키지 이름은? (pip install python-_______)',
      answer: ['multipart', 'python-multipart'],
      explanation: 'python-multipart예요. 폼 데이터 파싱을 담당해요. "fastapi[standard]"로 설치했다면 이미 포함돼 있어요.\n설치가 안 돼 있으면 서버 시작 시 "Form data requires python-multipart to be installed" 에러가 나요.',
    },
    {
      id: 'fa-12-09', type: 'mcq', source: 'Form과 파일 업로드',
      question: '프로필 사진 업로드 API에서 꼭 해야 하는 처리가 아닌 것은?',
      choices: ['사용자가 보낸 파일 이름 그대로 서버 경로에 저장', '허용할 파일 형식(MIME, 확장자) 검사', '파일 크기 제한', '저장할 때 UUID 같은 새 파일 이름 사용'],
      answer: 0,
      choiceExplanations: [
        '정답(하면 안 되는 처리). "../../app/main.py" 같은 이름으로 서버 파일을 덮어쓰는 공격이 가능해요.',
        '실행 파일이나 HTML 같은 위험한 파일 업로드를 막아요.',
        '거대한 파일로 디스크와 메모리를 채우는 공격을 막아요.',
        '이름 충돌과 경로 조작을 막아요.',
      ],
      explanation: '업로드 = 외부에서 서버 디스크에 무언가를 쓰는 일이라 공격 표면이 커요.\n체크리스트: 형식 화이트리스트, 크기 제한, 새 이름(uuid4().hex + 확장자), 웹 루트 밖 저장, 가능하면 S3 같은 별도 저장소 사용.',
    },
    {
      id: 'fa-12-10', type: 'ox', source: 'Form과 파일 업로드',
      question: '하나의 엔드포인트에서 Pydantic 모델(JSON 본문)과 Form 필드를 동시에 받을 수 있다.',
      answer: false,
      explanation: '안 돼요. 요청 하나의 본문은 Content-Type이 하나라서 JSON이면서 동시에 폼일 수 없어요.\n파일과 함께 구조화된 데이터를 보내야 한다면 ① 모든 값을 Form 필드로 받거나 ② 메타데이터는 Form 필드에 JSON 문자열로 넣고 서버에서 Model.model_validate_json()으로 검증해요.',
    },
    {
      id: 'fa-12-11', type: 'mcq', source: 'Request 객체를 직접 쓰기',
      question: '결제사 웹훅의 서명을 검증하려면 "받은 그대로의 본문 바이트"가 필요하다. 어떻게 받을까?',
      choices: ['data: dict 모델로 받는다', 'request: Request를 받아 await request.body()', 'Query()로 받는다', 'Form()으로 받는다'],
      answer: 1,
      choiceExplanations: [
        '파싱된 dict를 다시 JSON으로 만들면 공백·키 순서가 달라져 서명이 맞지 않아요.',
        '정답. 원본 바이트 그대로를 받아 HMAC 서명을 계산해 비교해요.',
        '본문을 쿼리로 받을 수 없어요.',
        '웹훅은 보통 JSON이에요.',
      ],
      explanation: 'Request 객체는 "선언형 파라미터로 표현할 수 없는 특별한 경우"에 써요. 원본 바이트, 클라이언트 IP, 전체 헤더 목록 등이 대표적이에요.\n서명 확인 후에는 Model.model_validate_json(raw)로 검증해서 쓰면 안전해요.',
    },
    {
      id: 'fa-12-12', type: 'mcq', source: 'Request 객체를 직접 쓰기',
      question: 'Render 같은 클라우드에 배포했더니 request.client.host가 항상 같은 내부 IP다. 실제 사용자 IP를 얻으려면?',
      choices: ['프록시가 넣어 주는 X-Forwarded-For 헤더를 신뢰하도록 uvicorn을 --proxy-headers(신뢰할 프록시 설정 포함)로 실행한다', 'IP는 얻을 수 없다', 'request.url.host를 쓴다', '클라이언트에게 IP를 쿼리로 보내 달라고 한다'],
      answer: 0,
      choiceExplanations: [
        '정답. 로드밸런서가 원래 IP를 X-Forwarded-For에 담아 줘요. 단, 신뢰할 프록시에서 온 값만 믿어야 해요(--forwarded-allow-ips).',
        '프록시 헤더로 얻을 수 있어요.',
        'url.host는 서버 도메인이에요.',
        '클라이언트가 보낸 IP는 조작 가능해서 믿을 수 없어요.',
      ],
      explanation: '서버 앞에 프록시가 있으면 "TCP 연결 상대"는 프록시예요. 원래 IP는 헤더로 전달되는데, 아무 클라이언트나 그 헤더를 위조할 수 있어서 신뢰할 프록시 목록을 정해 두고 그 프록시가 넣은 값만 믿어야 해요.',
    },
    {
      id: 'fa-12-13', type: 'ox', source: 'Request 객체를 직접 쓰기',
      question: 'await request.json()으로 받은 값은 Pydantic 모델 파라미터로 받은 값처럼 자동 검증되고 /docs에 표시된다.',
      answer: false,
      explanation: 'request.json()은 날것의 dict예요. 타입 변환·검증·문서화가 모두 빠져요.\n그래서 일반 입력은 반드시 선언형(모델, Query, Path…)으로 받고, Request는 특수 목적으로만 써요.',
    },
  ],
}

export default topic
