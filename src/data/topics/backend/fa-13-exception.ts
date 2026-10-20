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
      points: [
        'raise HTTPException(status_code=404, detail="Post not found") 는 함수를 즉시 중단하고 해당 상태 코드와 {"detail": ...} 본문을 응답한다.',
        'return이 아니라 raise인 이유: 예외는 호출 스택을 거슬러 올라가므로, 라우트 함수가 부른 서비스 함수나 의존성 깊은 곳에서 raise해도 그대로 응답이 된다.',
        'detail에는 문자열뿐 아니라 dict·list도 넣을 수 있다. detail={"code": "POST_NOT_FOUND", "message": "..."} 처럼 프론트가 분기하기 좋은 코드를 함께 주는 팀도 많다.',
        'headers={"WWW-Authenticate": "Bearer"} 처럼 에러 응답에 헤더를 붙일 수 있다(인증 실패 시 표준).',
      ],
      code: `from fastapi import HTTPException, status

def get_post_or_404(db, post_id: int) -> Post:
    post = db.get(Post, post_id)
    if post is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "POST_NOT_FOUND", "message": f"{post_id}번 글이 없습니다"},
        )
    return post`,
    },
    {
      title: '사용자 정의 예외와 exception_handler',
      notionIds: ['3efdf951bf8081e6bf73ca497056d696'],
      points: [
        '비즈니스 로직(서비스 계층)에서 HTTP를 몰라도 되도록 도메인 예외를 만든다. class PostNotFound(Exception): ...',
        '@app.exception_handler(PostNotFound) 로 "이 예외가 나면 이런 응답을 보내라"를 한 곳에 등록한다. Flask의 @app.errorhandler(404)와 비슷한 역할이다.',
        '예외 클래스를 상속 구조로 만들면(AppError → NotFoundError → PostNotFound) 부모 예외 하나에 핸들러를 걸어 일관된 응답 형식을 강제할 수 있다.',
        '핸들러 함수는 (request, exc)를 받아 Response를 리턴한다.',
      ],
      code: `class AppError(Exception):
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

# 서비스 코드: raise NotFoundError("글이 없습니다")  ← HTTP 를 몰라도 됨`,
    },
    {
      title: '기본 예외 핸들러 바꾸기',
      points: [
        '요청 검증 실패는 RequestValidationError로 발생하고 기본 응답은 422다. @app.exception_handler(RequestValidationError) 로 형식(예: 400, 한국어 메시지)을 바꿀 수 있다.',
        'HTTPException 응답 형식도 바꿀 수 있다. 이때는 starlette.exceptions.HTTPException 에 등록해야 FastAPI 내부(404 라우트 없음 등)에서 나는 예외까지 잡힌다.',
        '처리되지 않은 일반 Exception에 핸들러를 걸면 500 응답의 본문을 통일할 수 있다. 단, 원인 정보(스택트레이스)는 응답에 넣지 말고 로그에만 남긴다.',
      ],
      code: `from fastapi.exceptions import RequestValidationError

@app.exception_handler(RequestValidationError)
async def validation_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=400,
        content={"code": "INVALID_INPUT", "errors": exc.errors()},
    )`,
    },
    {
      title: '로깅',
      notionIds: ['3efdf951bf8081e6bf73ca497056d696'],
      points: [
        '서버는 24시간 돌아가므로 문제가 생긴 순간을 나중에 재구성할 수 있게 기록(로그)을 남긴다. print는 수준 구분·파일 저장·형식 지정이 어려워 운영에 맞지 않는다.',
        '로그 수준: DEBUG < INFO < WARNING < ERROR < CRITICAL. 설정한 수준 이상만 기록된다. 운영은 보통 INFO, 개발은 DEBUG.',
        'logger = logging.getLogger(__name__) 로 모듈별 로거를 만들고, logger.info("주문 생성 id=%s", order.id) 처럼 쓴다. 예외 블록 안에서는 logger.exception("...")이 스택트레이스까지 남긴다.',
        '파일에 쓸 때는 RotatingFileHandler(maxBytes, backupCount)로 크기가 넘으면 새 파일로 돌려 디스크가 가득 차는 것을 막는다. 클라우드에서는 보통 표준 출력에 찍고 플랫폼이 수집한다.',
        '로그에 비밀번호·토큰·주민번호 같은 민감 정보를 남기지 않는다.',
      ],
      code: `import logging

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
    return order`,
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
