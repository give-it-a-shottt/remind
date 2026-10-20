import type { Topic } from '../../types'

const topic: Topic = {
  id: 'fa-11-response-class',
  track: 'backend',
  group: 'FastAPI',
  title: '응답 클래스: JSON 말고 다른 것 보내기',
  order: 31,
  sections: [
    {
      title: '기본 응답은 JSONResponse',
      notionIds: ['3efdf951bf808199b333e12b0e63ba46'],
      points: [
        '라우트가 dict나 모델을 리턴하면 FastAPI는 jsonable_encoder로 JSON 호환 값으로 바꾼 뒤 JSONResponse로 감싼다. Content-Type은 application/json.',
        'Response 객체(또는 그 하위 클래스)를 직접 리턴하면 FastAPI는 변환·응답 모델 검증을 건너뛰고 그대로 보낸다. 상태 코드·헤더·본문을 완전히 제어하고 싶을 때 쓴다.',
        'JSONResponse(content={...}, status_code=202, headers={"X-Job-Id": "1"}) 처럼 직접 만들 수 있다. 이때 content는 이미 JSON으로 바꿀 수 있는 값이어야 한다(datetime 등은 jsonable_encoder로 먼저 변환).',
      ],
      code: `from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder

@app.post("/jobs")
def start_job():
    job = {"id": 1, "created_at": datetime.now()}
    return JSONResponse(
        content=jsonable_encoder(job),   # datetime → ISO 문자열
        status_code=202,
        headers={"Location": "/jobs/1"},
    )`,
    },
    {
      title: 'HTML, 텍스트, 리다이렉트',
      points: [
        'HTMLResponse: Content-Type text/html. 문자열 HTML을 그대로 보낸다. 라우트에 response_class=HTMLResponse 를 주면 리턴한 문자열이 HTML로 나가고 /docs에도 HTML 응답으로 표시된다.',
        'PlainTextResponse: 일반 텍스트(text/plain). 헬스 체크나 robots.txt 같은 곳에 쓴다.',
        'RedirectResponse(url="/login"): 다른 주소로 이동시킨다. 기본 상태 코드는 307(메서드 유지). 폼 POST 처리 후 목록 페이지로 보낼 때는 status_code=303(See Other)을 써서 브라우저가 GET으로 이동하게 한다(PRG 패턴).',
      ],
      code: `from fastapi.responses import HTMLResponse, RedirectResponse, PlainTextResponse

@app.get("/hello", response_class=HTMLResponse)
def hello():
    return "<h1>안녕하세요</h1>"

@app.post("/posts/form")
def create_from_form(title: Annotated[str, Form()]):
    save_post(title)
    return RedirectResponse(url="/posts", status_code=303)

@app.get("/robots.txt", response_class=PlainTextResponse)
def robots():
    return "User-agent: *\\nDisallow: /admin"`,
    },
    {
      title: '파일과 스트리밍',
      points: [
        'FileResponse(path): 디스크의 파일을 보낸다. 파일 크기·종류(Content-Type)를 알아서 설정하고, filename="report.pdf"를 주면 브라우저가 다운로드한다(Content-Disposition).',
        'StreamingResponse(generator): 데이터를 조금씩 흘려보낸다. 큰 CSV 내보내기, 실시간 로그, AI 답변을 글자 단위로 보내는 것(Server-Sent Events, text/event-stream)에 쓴다.',
        '스트리밍을 쓰면 전체 데이터를 메모리에 다 올리지 않아도 된다. 10GB 파일도 조금씩 읽어 보낼 수 있다.',
        '사용자가 지정한 경로로 FileResponse를 만들면 "../" 를 이용한 경로 조작 공격이 가능하므로 허용 폴더 안인지 반드시 검사한다.',
      ],
      code: `from fastapi.responses import FileResponse, StreamingResponse

@app.get("/download")
def download():
    return FileResponse("files/report.pdf", filename="report.pdf")

def csv_rows():
    yield "id,title\\n"
    for i in range(100_000):
        yield f"{i},title {i}\\n"

@app.get("/export.csv")
def export():
    return StreamingResponse(csv_rows(), media_type="text/csv")`,
    },
    {
      title: '헤더와 쿠키 다루기',
      points: [
        '응답 헤더를 추가하는 두 방법: ① 파라미터 response: Response 를 받아 response.headers["X-Total-Count"] = "120" ② Response 객체를 직접 만들어 headers= 로 지정.',
        '쿠키 설정: response.set_cookie(key="theme", value="dark", max_age=3600, httponly=True, secure=True, samesite="lax"). 삭제는 response.delete_cookie("theme").',
        'httponly=True면 자바스크립트(document.cookie)에서 읽을 수 없어 XSS 공격으로 쿠키를 훔치기 어려워진다. 세션·인증 쿠키는 항상 httponly로 둔다.',
        '주의: response 파라미터에 설정한 쿠키·헤더는 "FastAPI가 만드는 응답"에 합쳐진다. 직접 만든 Response 객체를 return 하면 그 객체에 직접 설정해야 한다.',
      ],
      code: `@app.post("/login")
def login(response: Response):
    response.set_cookie(
        key="session_id", value="abc123",
        httponly=True, secure=True, samesite="lax", max_age=60 * 60 * 24,
    )
    return {"ok": True}`,
    },
  ],
  questions: [
    {
      id: 'fa-11-01', type: 'mcq', source: '기본 응답은 JSONResponse',
      question: '라우트에서 JSONResponse 객체를 직접 return 할 때의 특징으로 맞는 것은?',
      choices: ['response_model 검증과 필터링을 그대로 거친다', '상태 코드는 항상 200이다', 'Content-Type이 text/html이 된다', 'FastAPI가 변환·응답 모델 처리를 건너뛰고 그 객체를 그대로 보낸다'],
      answer: 3,
      choiceExplanations: [
        'Response 객체를 직접 돌려주면 응답 모델 처리가 생략돼요. 필터링도 안 되니 주의하세요.',
        'status_code 인자로 원하는 코드를 줄 수 있어요.',
        'application/json이에요.',
        '정답. 완전히 직접 제어하는 대신, 검증·필터링 책임도 내가 져요.',
      ],
      explanation: 'FastAPI 응답 경로는 두 가지예요.\n① 값(dict, 모델, ORM 객체)을 리턴 → 응답 모델 검증·필터링 → JSON 변환 → JSONResponse\n② Response 객체를 리턴 → 그대로 전송\n②에서 민감한 필드를 직접 빼먹으면 그대로 노출되니, 보통은 ①을 쓰고 특별한 경우에만 ②를 써요.',
    },
    {
      id: 'fa-11-02', type: 'short', source: '기본 응답은 JSONResponse',
      question: 'datetime, Pydantic 모델 등을 JSON으로 보낼 수 있는 값(dict, str 등)으로 바꿔 주는 FastAPI 함수 이름은?',
      answer: ['jsonable_encoder', 'jsonable_encoder()'],
      explanation: 'fastapi.encoders.jsonable_encoder예요. datetime → ISO 문자열, 모델 → dict, UUID → 문자열처럼 바꿔 줘요.\nFastAPI가 값을 리턴할 때 내부적으로 쓰는 함수이고, JSONResponse를 직접 만들거나 JSON 컬럼에 저장할 때 직접 호출해요.',
    },
    {
      id: 'fa-11-03', type: 'mcq', source: 'HTML, 텍스트, 리다이렉트',
      question: '"<h1>hi</h1>" 문자열을 return 했는데 브라우저에 태그가 글자 그대로 "<h1>hi</h1>" 보인다. 원인과 해결은?',
      choices: ['HTML 문법 오류 → 태그를 고친다', '기본 JSONResponse라 JSON 문자열로 나갔다 → response_class=HTMLResponse를 지정한다', '브라우저 캐시 → 새로고침', 'CORS 문제 → 미들웨어 추가'],
      answer: 1,
      choiceExplanations: [
        'HTML은 맞아요. 문제는 Content-Type이에요.',
        '정답. 따옴표로 감싼 JSON 문자열로 나가고 Content-Type도 application/json이라 브라우저가 HTML로 해석하지 않아요.',
        '캐시와 관계없어요.',
        'CORS와 관계없어요.',
      ],
      explanation: '브라우저는 본문 내용이 아니라 Content-Type 헤더를 보고 어떻게 보여줄지 정해요.\n@app.get("/", response_class=HTMLResponse)로 지정하거나 HTMLResponse(content=html)을 직접 돌려주세요. HTML 화면이 많다면 Jinja2 템플릿(다음 토픽)을 써요.',
    },
    {
      id: 'fa-11-04', type: 'mcq', source: 'HTML, 텍스트, 리다이렉트',
      question: 'HTML 폼으로 글을 저장(POST)한 뒤 목록 페이지로 보내려 한다. 새로고침 시 중복 저장을 막으려면?',
      choices: ['RedirectResponse(url="/posts", status_code=303)', 'RedirectResponse(url="/posts")  (기본 307)', '목록 HTML을 바로 return', 'HTTPException(302)'],
      answer: 0,
      choiceExplanations: [
        '정답. 303 See Other는 "GET으로 다른 곳을 보라"는 뜻이라, 새로고침해도 GET /posts만 반복돼요.',
        '307은 메서드를 유지해서 /posts로 POST가 다시 가요.',
        '주소창이 여전히 POST 결과라 새로고침하면 "양식 다시 제출" 경고와 함께 중복 저장돼요.',
        '리다이렉트는 예외가 아니라 응답으로 만들어요.',
      ],
      explanation: 'PRG 패턴(Post → Redirect → Get): 폼 POST 처리 후 303으로 리다이렉트해서 최종 화면은 GET으로 보여줘요.\n리다이렉트 코드 정리: 301(영구, 검색엔진이 주소 갱신), 302(임시, 역사적으로 모호), 303(GET으로 전환), 307/308(메서드 유지).',
    },
    {
      id: 'fa-11-05', type: 'ox', source: 'HTML, 텍스트, 리다이렉트',
      question: 'RedirectResponse의 기본 상태 코드는 307이다.',
      answer: true,
      explanation: '맞아요. Starlette의 RedirectResponse 기본값은 307 Temporary Redirect예요. 307은 원래 메서드와 본문을 그대로 유지해서 리다이렉트해요.\n폼 처리 후 이동에는 status_code=303을 명시하는 습관을 들이세요.',
    },
    {
      id: 'fa-11-06', type: 'mcq', source: '파일과 스트리밍',
      question: '100만 행짜리 주문 내역을 CSV로 내려받게 하려 한다. 메모리를 아끼는 방법은?',
      choices: ['모든 행을 리스트로 만든 뒤 join해서 PlainTextResponse로 보낸다', 'JSONResponse로 보낸다', '제너레이터로 한 줄씩 yield하고 StreamingResponse로 보낸다', 'FileResponse에 리스트를 넘긴다'],
      answer: 2,
      choiceExplanations: [
        '100만 행이 한 번에 메모리에 올라가요.',
        'JSON도 전부 메모리에 만든 뒤 보내요.',
        '정답. 만들어지는 대로 조금씩 전송해서 메모리 사용량이 일정해요.',
        'FileResponse는 디스크 파일 경로를 받아요.',
      ],
      explanation: 'StreamingResponse(제너레이터, media_type="text/csv")는 yield마다 데이터를 보내요. DB에서도 한꺼번에 가져오지 말고 yield_per 같은 기능으로 나눠 읽으면 끝까지 메모리를 아낄 수 있어요.\n다운로드 파일 이름은 headers={"Content-Disposition": "attachment; filename=orders.csv"}로 지정해요.',
    },
    {
      id: 'fa-11-07', type: 'short', source: '파일과 스트리밍',
      question: '디스크에 있는 PDF 파일을 응답으로 보낼 때 쓰는 응답 클래스 이름은?',
      answer: ['FileResponse'],
      explanation: 'FileResponse예요. FileResponse("files/a.pdf", filename="a.pdf")처럼 filename을 주면 다운로드 창이 떠요.\n파일 경로를 사용자 입력으로 받는다면 Path(base / name).resolve()가 base 폴더 안에 있는지 확인해 경로 조작(../) 공격을 막아야 해요.',
    },
    {
      id: 'fa-11-08', type: 'mcq', source: '파일과 스트리밍',
      question: 'ChatGPT처럼 AI 답변을 글자가 생기는 대로 브라우저에 보여 주고 싶다. 가장 알맞은 응답 방식은?',
      choices: ['StreamingResponse로 text/event-stream(SSE) 형식으로 조각을 보낸다', '답변이 끝날 때까지 기다렸다가 JSONResponse', 'RedirectResponse', 'FileResponse'],
      answer: 0,
      choiceExplanations: [
        '정답. 조각이 생길 때마다 data: ...\\n\\n 형식으로 흘려보내면 프론트가 EventSource나 fetch 스트림으로 받아 바로 표시해요.',
        '사용자는 답변이 끝날 때까지 빈 화면을 봐요.',
        '이동과는 관계없어요.',
        '파일 전송용이에요.',
      ],
      explanation: '스트리밍 응답은 "체감 속도"를 크게 바꿔요. 전체 시간은 같아도 첫 글자가 바로 보이니까요.\n비동기 제너레이터(async def gen(): ... yield ...)를 StreamingResponse에 넘기면 외부 API를 await하면서 받은 조각을 바로 전달할 수 있어요.',
    },
    {
      id: 'fa-11-09', type: 'mcq', source: '헤더와 쿠키 다루기',
      question: '로그인 세션 쿠키를 설정할 때 반드시 켜야 하는 옵션으로 가장 중요한 것은?',
      choices: ['max_age=None', 'path="/admin"', 'samesite="none" 만 단독 설정', 'httponly=True'],
      answer: 3,
      choiceExplanations: [
        '만료가 없으면 브라우저 종료 시까지 유지되는 세션 쿠키가 될 뿐, 보안 옵션은 아니에요.',
        '쿠키 경로를 좁히면 다른 경로에서 로그인 상태를 인식하지 못해요.',
        'SameSite=None은 Secure와 함께여야 하고, 오히려 다른 사이트 요청에도 쿠키가 실려 CSRF 위험이 커져요.',
        '정답. 자바스크립트가 쿠키를 읽지 못하게 해서 XSS로 세션이 탈취되는 것을 막아요.',
      ],
      explanation: '인증 쿠키 기본 세트: httponly=True(JS 접근 차단) + secure=True(HTTPS에서만 전송) + samesite="lax"(다른 사이트에서 오는 대부분의 요청에 쿠키 미전송, CSRF 완화).\n로컬 개발(http)에서는 secure=True면 쿠키가 저장되지 않으니 환경별로 설정을 나누기도 해요.',
    },
    {
      id: 'fa-11-10', type: 'mcq', source: '헤더와 쿠키 다루기',
      question: '아래 코드에서 클라이언트가 받는 응답에 쿠키가 없다. 이유는?',
      code: `@app.post("/login")
def login(response: Response):
    response.set_cookie("session_id", "abc", httponly=True)
    return JSONResponse({"ok": True})`,
      choices: ['httponly 때문에', '새 JSONResponse를 직접 리턴해서, 주입받은 response에 설정한 쿠키가 버려졌다', 'POST에서는 쿠키를 설정할 수 없다', 'set_cookie 인자 순서가 틀렸다'],
      answer: 1,
      choiceExplanations: [
        'httponly는 JS 접근만 막을 뿐 쿠키는 정상 저장돼요.',
        '정답. 주입받은 response의 설정은 "FastAPI가 만드는 응답"에 합쳐지는데, Response 객체를 직접 돌려주면 그 객체가 그대로 나가요.',
        'POST 응답에서도 쿠키를 설정할 수 있어요.',
        '첫 두 인자가 key, value로 맞아요.',
      ],
      explanation: '둘 중 하나로 통일하세요.\n① response 파라미터에 설정하고 dict를 리턴: return {"ok": True}\n② 직접 만든 객체에 설정: res = JSONResponse({"ok": True}); res.set_cookie(...); return res',
    },
    {
      id: 'fa-11-11', type: 'ox', source: '헤더와 쿠키 다루기',
      question: 'httponly=True로 설정된 쿠키는 브라우저가 서버로 요청을 보낼 때에도 함께 전송되지 않는다.',
      answer: false,
      explanation: 'httponly는 "자바스크립트에서 읽기 금지"일 뿐, 요청에는 정상적으로 함께 보내져요. 그래서 세션 인증이 동작해요.\n프론트에서 다른 출처의 API로 쿠키를 보내려면 fetch(url, { credentials: "include" })와 서버의 CORS allow_credentials=True가 필요해요.',
    },
    {
      id: 'fa-11-12', type: 'mcq', source: 'HTML, 텍스트, 리다이렉트',
      question: '헬스 체크 엔드포인트가 JSON이 아닌 순수 텍스트 "ok"를 돌려줘야 한다(모니터링 도구 요구). 알맞은 선언은?',
      choices: ['@app.get("/health") 후 return "ok"', 'return {"ok"}', 'return HTMLResponse("ok")', '@app.get("/health", response_class=PlainTextResponse) 후 return "ok"'],
      answer: 3,
      choiceExplanations: [
        '기본 JSONResponse라 본문이 따옴표까지 포함된 JSON 문자열로 나가요.',
        '{"ok"}는 파이썬 set이에요. JSON 변환 시 리스트처럼 바뀌어 ["ok"]가 돼요.',
        '동작은 하지만 Content-Type이 text/html이라 의미가 맞지 않아요.',
        '정답. Content-Type: text/plain으로 ok가 그대로 나가요.',
      ],
      explanation: 'JSON 문자열 "ok"와 텍스트 ok는 본문 바이트가 달라요(따옴표 유무). 외부 도구와 연동할 땐 정확한 Content-Type과 본문 형식을 맞춰야 해요.',
    },
  ],
}

export default topic
