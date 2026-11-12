import type { Topic } from '../../types'

const topic: Topic = {
  id: 'fa-13-exception',
  track: 'backend',
  group: 'FastAPI',
  title: '예외 처리와 로깅',
  order: 33,
  sections: [
    {
      title: 'HTTPException',
      slides: [
        {
          title: '깊은 곳에서 던져도 응답이 돼요',
          blocks: [
            { type: 'say', text: '이번 수업은 **일이 잘못됐을 때** 어떻게 응답하고 기록하는지예요. 먼저 이미 써 본 `HTTPException`을 다시 정리해요.\n\n`raise HTTPException(status_code=404, detail="...")`는 함수를 **즉시 중단**하고 그 상태 코드와 `{"detail": ...}` 본문을 응답해요.' },
            { type: 'code', code: `from fastapi import HTTPException, status

def get_post_or_404(db, post_id: int) -> Post:
    post = db.get(Post, post_id)
    if post is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "POST_NOT_FOUND", "message": f"{post_id}번 글이 없습니다"},
        )
    return post` },
            { type: 'say', text: 'return이 아니라 raise인 이유: 예외는 **호출 스택을 거슬러 올라가요.** 라우트가 부른 서비스 함수, 그 함수가 부른 도우미 함수 **깊은 곳에서 raise해도** 그대로 응답이 돼요. 중간 함수들이 일일이 에러를 전달할 필요가 없어요.' },
          ],
        },
        {
          title: 'detail과 headers, 그리고 함정',
          blocks: [
            { type: 'list', items: ['`detail`에는 문자열뿐 아니라 **dict**도 넣을 수 있어요. `{"code": "POST_NOT_FOUND", ...}`처럼 프론트가 분기하기 좋은 코드를 함께 주는 팀이 많아요', '`headers={"WWW-Authenticate": "Bearer"}`처럼 에러 응답에 헤더도 붙일 수 있어요 (인증 실패의 표준)'] },
            { type: 'code', code: `try:
    post = get_post_or_404(db, post_id)
    ...
except Exception:              # ← HTTPException 도 Exception 이라 여기서 잡힘!
    raise HTTPException(500)   # 404 가 500 으로 바뀌어 버림` },
            { type: 'note', tone: 'warn', text: '`HTTPException`도 `Exception`의 한 종류예요. 중간에 `except Exception:`이 있으면 **404를 삼켜 버리고** 500으로 바꿔요. 넓은 except는 꼭 필요할 때만, 그리고 `except HTTPException: raise`를 먼저 두세요.' },
          ],
        },
      ],
    },
    {
      title: '사용자 정의 예외와 exception_handler',
      notionIds: ['3efdf951bf8081e6bf73ca497056d696'],
      slides: [
        {
          title: '서비스 코드는 HTTP를 몰라도 돼요',
          blocks: [
            { type: 'say', text: '비즈니스 로직(서비스 계층)에서 `HTTPException`을 던지면, 그 코드는 **HTTP에 묶여요.** 같은 로직을 배치 작업이나 CLI에서 쓰려 해도 "404"는 어색하죠.\n\n그래서 **도메인 예외**를 만들어요. 서비스는 "글이 없다"는 사실만 말하고, **HTTP로 어떻게 응답할지는 한 곳**에서 정해요.' },
            { type: 'code', code: `class AppError(Exception):
    status_code = 400
    code = "APP_ERROR"
    def __init__(self, message: str):
        self.message = message

class NotFoundError(AppError):
    status_code = 404
    code = "NOT_FOUND"

@app.exception_handler(AppError)
async def app_error_handler(request: Request, exc: AppError):
    return JSONResponse(
        status_code=exc.status_code,
        content={"code": exc.code, "message": exc.message},
    )

# 서비스 코드: raise NotFoundError("글이 없습니다")  ← HTTP 를 몰라도 됨` },
          ],
        },
        {
          title: '부모에 하나만 걸면',
          blocks: [
            { type: 'say', text: '`@app.exception_handler(예외클래스)`는 "이 예외가 나면 이렇게 응답해"를 등록해요. Flask의 `@app.errorhandler`와 비슷해요. 핸들러는 `(request, exc)`를 받아 Response를 돌려줘요.\n\n예외를 **상속 구조**(AppError → NotFoundError → PostNotFound)로 만들면, **부모 하나에만** 핸들러를 걸어도 자식 예외들이 전부 거기로 와요. 모든 에러 응답이 `{code, message}` 한 가지 형식으로 통일되죠.' },
          ],
        },
      ],
    },
    {
      title: '기본 예외 핸들러 바꾸기',
      slides: [
        {
          title: '422 형식도 바꿀 수 있어요',
          blocks: [
            { type: 'code', code: `from fastapi.exceptions import RequestValidationError

@app.exception_handler(RequestValidationError)
async def validation_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=400,
        content={"code": "INVALID_INPUT", "errors": exc.errors()},
    )` },
            { type: 'say', text: '입력 검증 실패는 `RequestValidationError`로 발생하고 기본 응답이 422예요. 프론트 팀이 "검증 실패도 400으로, 우리 형식으로 달라"고 하면 이 예외에 핸들러를 걸면 돼요.\n\n`HTTPException` 형식을 바꾸고 싶다면 **`starlette.exceptions.HTTPException`** 에 등록해요. 그래야 "라우트 없음 404"처럼 FastAPI **내부**에서 나는 예외까지 잡혀요.' },
          ],
        },
        {
          title: '500 응답에 넣지 말 것',
          blocks: [
            { type: 'say', text: '처리되지 않은 일반 `Exception`에 핸들러를 걸면 500 응답 본문을 통일할 수 있어요.' },
            { type: 'note', tone: 'warn', text: '500 응답에 **스택트레이스를 넣으면 안 돼요.** 파일 경로, 라이브러리 버전, 쿼리 모양 같은 내부 정보가 공격자에게 지도가 돼요. 응답엔 "서버 오류가 발생했습니다" + 요청 ID 정도만, **원인은 로그에만** 남겨요.' },
          ],
        },
      ],
    },
    {
      title: '로깅',
      notionIds: ['3efdf951bf8081e6bf73ca497056d696'],
      slides: [
        {
          title: 'print 대신 logging',
          blocks: [
            { type: 'say', text: '서버는 24시간 돌아가요. 새벽 3시에 생긴 문제를 아침에 **재구성**하려면 기록, 즉 **로그**가 있어야 해요. `print`는 수준 구분도, 파일 저장도, 형식 지정도 어려워서 운영에 맞지 않아요.' },
            {
              type: 'table',
              head: ['수준', '언제'],
              rows: [
                ['DEBUG', '개발 중 세세한 정보'],
                ['INFO', '정상 흐름 기록 (주문 생성됨)'],
                ['WARNING', '이상하지만 동작은 함'],
                ['ERROR', '요청 하나가 실패함'],
                ['CRITICAL', '서비스 전체가 위험'],
              ],
            },
            { type: 'say', text: '설정한 수준 **이상만** 기록돼요. WARNING으로 설정하면 WARNING, ERROR, CRITICAL만 남고 INFO는 버려져요. 운영은 보통 INFO, 개발은 DEBUG예요.' },
          ],
        },
        {
          title: '실제로 쓰는 모습',
          blocks: [
            { type: 'code', code: `import logging

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s %(message)s")
logger = logging.getLogger(__name__)

@app.post("/orders")
def create_order(order_in: OrderCreate):
    try:
        order = service.create(order_in)
    except PaymentError:
        logger.exception("결제 실패 user=%s", order_in.user_id)   # 스택트레이스 포함
        raise HTTPException(402, "결제에 실패했습니다")
    logger.info("주문 생성 id=%s", order.id)
    return order` },
            { type: 'list', items: ['`getLogger(__name__)` — 모듈별 로거. 로그에 **어느 파일**에서 찍혔는지 남아요', '`logger.exception(...)` — except 블록 안에서 메시지 + **스택트레이스**까지', '`RotatingFileHandler(maxBytes, backupCount)` — 파일이 커지면 새 파일로 돌려서 **디스크가 가득 차는 걸** 막아요. 클라우드에선 보통 표준 출력에 찍고 플랫폼이 수집해요'] },
            { type: 'note', tone: 'warn', text: '로그에 **비밀번호·토큰·주민번호**를 남기지 마세요. 로그는 여러 사람이 보고 오래 보관돼요. "디버깅용으로 입력한 비밀번호도 남기자"는 절대 안 돼요.' },
          ],
        },
      ],
    },
  ],
  questions: [
    {
      id: 'fa-13-01', type: 'mcq', source: 'HTTPException',
      question: '라우트가 호출한 서비스 함수 안에서 raise HTTPException(404)를 하면?',
      choices: ['서비스 함수만 멈추고 라우트는 계속 실행된다', '예외가 라우트를 거쳐 올라가 FastAPI가 404 응답을 만든다', '500 에러가 된다', '무시된다'],
      answer: 1,
      choiceExplanations: [
        '예외는 잡지 않으면 호출한 쪽으로 계속 올라가요.',
        '정답. 깊은 곳에서 raise해도 FastAPI가 최종적으로 잡아 응답으로 바꿔요.',
        'HTTPException은 FastAPI가 알고 있는 예외라 지정한 코드로 나가요.',
        '무시되지 않아요.',
      ],
      explanation: '이 성질 때문에 get_post_or_404 같은 헬퍼를 만들어 여러 라우트에서 재사용할 수 있어요.\n다만 서비스 계층이 HTTPException에 의존하면 웹 밖(배치 스크립트 등)에서 재사용하기 어려워져요. 그래서 규모가 커지면 도메인 예외 + exception_handler로 분리해요.',
    },
    {
      id: 'fa-13-02', type: 'mcq', source: 'HTTPException',
      question: '중간에 try/except Exception: 이 있는 코드다. HTTPException(404)를 raise했는데 클라이언트가 500을 받았다. 원인은?',
      code: `@app.get("/posts/{post_id}")
def read(post_id: int):
    try:
        post = get_post_or_404(post_id)   # 여기서 HTTPException(404)
        return post
    except Exception:
        raise HTTPException(500, "서버 오류")`,
      choices: ['HTTPException은 Exception을 상속하므로 except Exception에 잡혀 500으로 바뀌었다', 'get_post_or_404가 잘못됐다', '404는 raise할 수 없다', 'FastAPI 버그다'],
      answer: 0,
      choiceExplanations: [
        '정답. 넓은 except가 의도한 404까지 삼켜 버렸어요.',
        '헬퍼는 정상적으로 404를 raise했어요.',
        '404도 raise할 수 있어요.',
        '파이썬 예외 상속 구조대로 동작한 거예요.',
      ],
      explanation: 'except Exception: 은 거의 모든 예외를 잡아요. 해결: ① 잡을 예외를 구체적으로 지정(except SQLAlchemyError:) ② except HTTPException: raise 를 먼저 두기 ③ 애초에 넓은 try를 라우트마다 쓰지 말고 전역 예외 핸들러에 맡기기.',
    },
    {
      id: 'fa-13-03', type: 'short', source: 'HTTPException',
      question: 'FastAPI의 HTTPException이 만드는 기본 에러 응답 본문의 키 이름은? {"_____": "Post not found"}',
      answer: ['detail'],
      explanation: 'detail이에요. 422 검증 에러도 {"detail": [...]} 형식이에요.\n프론트에서는 res.json().detail을 읽어 메시지를 보여 주는 공통 처리를 만들 수 있어요. 팀마다 {"code", "message"} 같은 자체 형식을 쓰고 싶으면 exception_handler로 바꿔요.',
    },
    {
      id: 'fa-13-04', type: 'mcq', source: '사용자 정의 예외와 exception_handler',
      question: '서비스 계층에서 HTTPException 대신 도메인 예외(NotFoundError)를 쓰는 가장 큰 장점은?',
      choices: ['응답 속도가 빨라진다', '상태 코드를 쓸 수 없게 된다', '비즈니스 로직이 HTTP를 몰라도 돼서 배치 작업·테스트 등 웹 밖에서도 재사용하기 쉽다', '로그가 필요 없어진다'],
      answer: 2,
      choiceExplanations: [
        '속도와는 관계없어요.',
        '핸들러에서 상태 코드를 정해요.',
        '정답. "글이 없다"는 사실만 알리고, 그걸 어떤 HTTP 응답으로 바꿀지는 웹 계층(exception_handler)이 정해요.',
        '로그와는 관계없어요.',
      ],
      explanation: '계층별 책임: 서비스 = "무슨 일이 일어났나"(도메인 예외), 웹 계층 = "그걸 HTTP로 어떻게 표현하나"(핸들러). 이렇게 나누면 CLI나 스케줄러에서 같은 서비스를 불러도 HTTP 개념이 섞이지 않아요.',
    },
    {
      id: 'fa-13-05', type: 'mcq', source: '사용자 정의 예외와 exception_handler',
      question: '@app.exception_handler(AppError)를 등록했다. AppError를 상속한 NotFoundError를 raise하면?',
      choices: ['핸들러가 실행되지 않는다', 'AppError 핸들러가 실행된다(가장 가까운 부모 클래스의 핸들러)', '500 에러', '422 에러'],
      answer: 1,
      choiceExplanations: [
        '상속 관계를 따라 핸들러를 찾아요.',
        '정답. 자식 전용 핸들러가 없으면 부모 클래스의 핸들러가 쓰여요.',
        '처리할 핸들러가 있으니 500이 아니에요.',
        '검증 에러가 아니에요.',
      ],
      explanation: '예외 계층 설계 예: AppError(400) → NotFoundError(404), ConflictError(409), PermissionDenied(403). 핸들러는 AppError 하나에만 걸고, 각 클래스의 status_code 속성으로 코드를 정하면 응답 형식이 저절로 통일돼요.',
    },
    {
      id: 'fa-13-06', type: 'short', source: '사용자 정의 예외와 exception_handler',
      question: '특정 예외 클래스가 발생했을 때 실행할 응답 함수를 등록하는 FastAPI 데코레이터는? @app.______________(MyError)',
      answer: ['exception_handler'],
      explanation: '@app.exception_handler(MyError)예요. 함수는 async def handler(request: Request, exc: MyError) 형태로 만들고 Response(보통 JSONResponse)를 리턴해요.\nFlask의 @app.errorhandler와 같은 역할이에요.',
    },
    {
      id: 'fa-13-07', type: 'mcq', source: '기본 예외 핸들러 바꾸기',
      question: '프론트 팀이 "입력 검증 실패도 400으로, 우리 형식({code, errors})으로 달라"고 요청했다. 어떻게 할까?',
      choices: ['모든 라우트에 try/except를 넣는다', 'Pydantic을 쓰지 않는다', 'status_code=400을 모든 데코레이터에 넣는다', '@app.exception_handler(RequestValidationError)를 등록해 원하는 형식으로 응답한다'],
      answer: 3,
      choiceExplanations: [
        '검증은 함수 실행 전에 일어나서 라우트 안의 try로는 잡을 수 없어요.',
        '검증을 포기하면 더 큰 문제가 생겨요.',
        '데코레이터의 status_code는 성공 응답 코드예요.',
        '정답. 검증 실패 예외 하나에 핸들러를 걸면 모든 라우트에 적용돼요. exc.errors()로 상세 정보를 얻어요.',
      ],
      explanation: '422 → 400 변경은 흔한 요구예요. 이때 exc.errors()의 loc, msg를 가공해 {"field": "email", "message": "이메일 형식이 아닙니다"}처럼 프론트 친화적인 형태로 바꿔 주면 좋아요.',
    },
    {
      id: 'fa-13-08', type: 'ox', source: '기본 예외 핸들러 바꾸기',
      question: '처리되지 않은 예외의 500 응답 본문에 스택트레이스를 넣어 주면 사용자에게 친절하므로 운영에서도 권장된다.',
      answer: false,
      explanation: '아니에요. 스택트레이스에는 파일 경로, 라이브러리 버전, SQL, 때로는 설정 값까지 들어 있어 공격자에게 힌트가 돼요.\n응답에는 "서버 오류" + 추적용 요청 ID만 주고, 상세 내용은 서버 로그에만 남겨요. 사용자가 요청 ID를 알려 주면 로그에서 찾아볼 수 있어요.',
    },
    {
      id: 'fa-13-09', type: 'mcq', source: '로깅',
      question: '로거의 수준을 WARNING으로 설정했다. 다음 중 기록되는 것은?',
      choices: ['logger.debug("...")', 'logger.error("...")', 'logger.info("...")', '모두 기록된다'],
      answer: 1,
      choiceExplanations: [
        'DEBUG < WARNING이라 기록되지 않아요.',
        '정답. ERROR ≥ WARNING이라 기록돼요(WARNING, ERROR, CRITICAL만).',
        'INFO < WARNING이라 기록되지 않아요.',
        '설정 수준 이상만 기록돼요.',
      ],
      explanation: '로그 수준 순서: DEBUG(10) < INFO(20) < WARNING(30) < ERROR(40) < CRITICAL(50).\n설정한 수준 이상만 남으니, 운영에서 INFO로 두면 DEBUG 로그는 자동으로 빠져요. 그래서 코드 곳곳에 debug 로그를 남겨도 운영 로그가 지저분해지지 않아요.',
    },
    {
      id: 'fa-13-10', type: 'mcq', source: '로깅',
      question: 'except 블록 안에서 에러 메시지와 스택트레이스를 함께 남기기에 가장 알맞은 것은?',
      choices: ['print(e)', 'logger.info(str(e))', 'logger.debug("실패")', 'logger.exception("결제 실패")'],
      answer: 3,
      choiceExplanations: [
        '수준 구분이 없고 스택트레이스도 없어요.',
        '수준이 너무 낮고 스택트레이스가 없어요.',
        '운영에서는 보통 DEBUG가 기록되지 않아요.',
        '정답. ERROR 수준으로 기록하면서 현재 처리 중인 예외의 스택트레이스를 자동으로 붙여요.',
      ],
      explanation: 'logger.exception()은 except 블록 안에서만 쓰는 게 원칙이에요(현재 예외 정보를 읽기 때문). 같은 효과로 logger.error("...", exc_info=True)도 있어요.\n메시지에는 주문 ID, 사용자 ID처럼 "무엇을 하다가" 실패했는지 맥락을 넣어야 나중에 추적할 수 있어요.',
    },
    {
      id: 'fa-13-11', type: 'short', source: '로깅',
      question: '로그 파일이 일정 크기를 넘으면 새 파일로 넘어가고, 정해진 개수를 넘으면 오래된 파일부터 지우는 핸들러 이름은?',
      answer: ['RotatingFileHandler', 'logging.handlers.RotatingFileHandler'],
      explanation: 'RotatingFileHandler(파일명, maxBytes=10_000_000, backupCount=5)예요. 날짜 기준으로 나누려면 TimedRotatingFileHandler.\n로그가 디스크를 가득 채우면 DB까지 멈출 수 있어요. 로그 보관 정책은 운영의 기본이에요.',
    },
    {
      id: 'fa-13-12', type: 'ox', source: '로깅',
      question: '로그인 실패를 기록할 때 디버깅을 위해 사용자가 입력한 비밀번호도 함께 로그에 남기는 것이 좋다.',
      answer: false,
      explanation: '절대 안 돼요. 로그는 여러 사람과 시스템(로그 수집 서비스)이 보기 때문에 비밀번호·토큰·카드번호가 남으면 유출 사고가 돼요. 사용자는 오타로 다른 사이트 비밀번호를 입력하기도 해요.\n기록할 것: 시각, 사용자 식별자(이메일 일부 마스킹), IP, 실패 이유 코드.',
    },
  ],
}

export default topic
