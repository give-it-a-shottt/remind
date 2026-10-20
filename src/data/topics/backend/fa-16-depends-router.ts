import type { Topic } from '../../types'

const topic: Topic = {
  id: 'fa-16-depends-router',
  track: 'backend',
  group: 'FastAPI',
  title: '의존성 주입 · APIRouter · 미들웨어 · 프로젝트 구조',
  order: 36,
  sections: [
    {
      title: 'Depends: 필요한 것을 선언하면 FastAPI가 만들어 준다',
      points: [
        '의존성(dependency)은 라우트가 실행되기 전에 FastAPI가 먼저 호출해 주는 함수다. 라우트는 db: Session = Depends(get_db) 처럼 "이게 필요하다"고 선언만 하고, 만드는 방법은 의존성 함수가 책임진다.',
        '의존성 함수도 라우트처럼 경로·쿼리·헤더·본문 파라미터를 선언할 수 있고, 다른 의존성을 또 Depends 할 수 있다(의존성 체인). FastAPI가 순서대로 풀어서 호출한다.',
        '대표 용도: DB 세션 제공, 현재 로그인 사용자 확인, 권한 검사, 공통 페이지네이션 파라미터, 설정 값 제공.',
        '같은 요청 안에서 같은 의존성이 여러 번 쓰이면 기본적으로 한 번만 호출하고 결과를 재사용한다(use_cache=True).',
      ],
      code: `def pagination(page: int = Query(1, ge=1), size: int = Query(10, ge=1, le=100)):
    return {"offset": (page - 1) * size, "limit": size}

Pagination = Annotated[dict, Depends(pagination)]

@app.get("/posts")
def list_posts(p: Pagination):
    return p   # /posts?page=3 → {"offset": 20, "limit": 10}`,
    },
    {
      title: 'yield 의존성: 준비와 정리',
      points: [
        '의존성 함수에서 return 대신 yield를 쓰면, yield 앞은 "요청 전 준비", yield 뒤는 "응답 후 정리"가 된다.',
        'DB 세션이 대표적이다. 세션을 만들어 yield로 넘기고, 요청 처리가 끝나면(에러가 나도) finally에서 세션을 닫는다. 연결이 새지 않는다.',
        'yield 의존성 안에서 try/except로 라우트에서 난 예외를 잡아 rollback 할 수 있다. 잡은 뒤에는 다시 raise 해야 FastAPI가 에러 응답을 만든다.',
      ],
      code: `def get_db():
    db = SessionLocal()
    try:
        yield db            # 라우트 실행
        db.commit()         # 정상 종료 시 커밋 (팀 규칙에 따라 라우트에서 커밋하기도)
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()          # 항상 닫기

SessionDep = Annotated[Session, Depends(get_db)]`,
    },
    {
      title: '인증·권한을 의존성으로',
      points: [
        'get_current_user 의존성: 요청에서 세션 쿠키나 토큰을 읽어 사용자를 찾고, 없으면 401을 raise한다. 라우트는 user: CurrentUser 만 선언하면 로그인 필수 API가 된다.',
        '권한 검사는 그 위에 쌓는다: def require_admin(user: CurrentUser): if not user.is_admin: raise 403; return user.',
        '반환값이 필요 없는 검사는 데코레이터의 dependencies=[Depends(verify_api_key)] 에 넣는다. 라우터 전체나 앱 전체(FastAPI(dependencies=[...]))에도 걸 수 있다.',
        '이 방식은 직접 만든 데코레이터보다 낫다. 시그니처가 깨지지 않고, /docs에 보안 요구사항이 표시되고, 테스트에서 app.dependency_overrides 로 쉽게 바꿔 끼울 수 있다.',
      ],
      code: `def get_current_user(request: Request, db: SessionDep) -> User:
    user_id = request.session.get("user_id")
    user = db.get(User, user_id) if user_id else None
    if user is None:
        raise HTTPException(401, "로그인이 필요합니다")
    return user

CurrentUser = Annotated[User, Depends(get_current_user)]

def require_admin(user: CurrentUser) -> User:
    if not user.is_admin:
        raise HTTPException(403, "관리자 전용")
    return user

@app.delete("/posts/{post_id}", dependencies=[Depends(require_admin)])
def delete_post(post_id: int, db: SessionDep): ...`,
    },
    {
      title: 'APIRouter로 파일 나누기',
      notionIds: ['3efdf951bf80810d9b84c4922dc76208'],
      points: [
        'Flask의 Blueprint에 해당하는 것이 APIRouter다. 기능별 파일에서 router = APIRouter(prefix="/posts", tags=["posts"]) 를 만들고 @router.get("/") 으로 라우트를 등록한다.',
        'main.py에서 app.include_router(posts.router) 로 붙인다. prefix가 모든 경로 앞에 붙어 /posts/, /posts/{id} 가 된다.',
        'APIRouter에도 dependencies=[...]와 responses={...}를 줄 수 있어 "이 라우터 전체는 로그인 필요" 같은 규칙을 한 번에 적용한다.',
        '흔한 구조: app/main.py(앱 조립), app/core/(설정·DB), app/<기능>/router.py(라우트), schemas.py(Pydantic), models.py(SQLAlchemy), service.py(비즈니스 로직).',
      ],
      code: `# app/posts/router.py
router = APIRouter(prefix="/posts", tags=["posts"])

@router.get("/")
def list_posts(): ...

@router.get("/{post_id}")
def read_post(post_id: int): ...

# app/main.py
from app.posts import router as posts_router
app = FastAPI()
app.include_router(posts_router.router)`,
    },
    {
      title: '미들웨어와 MVC를 대하는 태도',
      notionIds: ['3efdf951bf8081d9a1ebdb20a03e7151', '3efdf951bf8081ff82c7d0b204182be2'],
      points: [
        '미들웨어는 모든 요청·응답을 감싸는 코드다. Flask의 before_request/after_request를 하나로 합친 모양이다. @app.middleware("http") 함수에서 call_next(request) 앞은 요청 전, 뒤는 응답 후 처리다.',
        '미들웨어 용도: 처리 시간 측정 헤더, 요청 ID 부여, 접근 로그, CORS·GZip·세션(기본 제공 미들웨어). 특정 라우트에만 필요한 로직(로그인 검사)은 미들웨어보다 의존성이 알맞다.',
        '앱 시작·종료 시 한 번 할 일(DB 연결 풀 만들기, 모델 로딩)은 lifespan 함수로 처리한다. Flask에서 없어진 before_first_request의 올바른 대체다.',
        'MVC(Model·View·Controller)처럼 계층을 나누면 유지보수가 쉬워진다는 주장이 있지만, 작은 프로젝트에서 과하게 쪼개면 기능 하나를 보려고 파일 다섯 개를 열어야 한다. 기존 구조가 있으면 따르고, 없으면 기능별 폴더 + 필요한 만큼의 계층으로 단순하게 시작한다.',
      ],
      code: `import time
from contextlib import asynccontextmanager

@app.middleware("http")
async def add_process_time(request: Request, call_next):
    start = time.perf_counter()
    response = await call_next(request)          # 실제 라우트 실행
    response.headers["X-Process-Time"] = f"{time.perf_counter() - start:.4f}"
    return response

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("시작: DB 풀 준비")    # 서버 시작 시 1번
    yield
    print("종료: 연결 정리")      # 서버 종료 시 1번

app = FastAPI(lifespan=lifespan)`,
    },
  ],
  questions: [
    {
      id: 'fa-16-01', type: 'mcq', source: 'Depends: 필요한 것을 선언하면 FastAPI가 만들어 준다',
      question: 'Depends(get_db)를 쓰는 라우트에 요청이 오면 무슨 일이 일어날까?',
      choices: ['요청마다 FastAPI가 get_db를 호출해 그 결과를 라우트 파라미터에 넣어 준다', '서버 시작 시 get_db가 한 번 호출되고 모든 요청이 같은 세션을 쓴다', '라우트 함수 안에서 get_db()를 직접 불러야 한다', 'get_db는 /docs에서만 호출된다'],
      answer: 0,
      choiceExplanations: [
        '정답. 의존성은 요청마다 호출돼요. 같은 요청 안에서는 결과가 재사용돼요.',
        '세션을 요청마다 새로 만드는 게 의존성의 핵심이에요. 전역 세션 공유는 위험해요.',
        '선언만 하면 FastAPI가 호출해요.',
        '실제 요청마다 호출돼요.',
      ],
      explanation: '의존성 주입(DI) = "필요한 것을 직접 만들지 않고 선언만 하면 밖에서 넣어 준다".\n장점: 라우트 코드가 짧아지고, 공통 로직(세션·인증)이 한 곳에 모이고, 테스트에서 가짜로 바꿔 끼우기 쉬워요.',
    },
    {
      id: 'fa-16-02', type: 'mcq', source: 'Depends: 필요한 것을 선언하면 FastAPI가 만들어 준다',
      question: '한 요청에서 get_current_user와 require_admin이 둘 다 get_db에 의존한다. get_db는 몇 번 호출될까?',
      choices: ['0번', '1번 (결과 캐시)', '2번', '의존성 개수만큼'],
      answer: 1,
      choiceExplanations: [
        '필요하니 호출돼요.',
        '정답. 같은 요청 안에서 같은 의존성은 한 번만 실행되고 결과를 공유해요. 그래서 같은 세션(같은 트랜잭션)을 쓰게 돼요.',
        '기본 설정(use_cache=True)에서는 재사용해요.',
        '기본적으로 재사용해요.',
      ],
      explanation: '같은 세션을 공유한다는 건 중요해요. 인증 단계에서 읽은 user 객체와 라우트에서 수정하는 객체가 같은 세션에 속해야 commit이 자연스럽게 동작해요.\n매번 새로 호출하고 싶으면 Depends(fn, use_cache=False).',
    },
    {
      id: 'fa-16-03', type: 'short', source: 'yield 의존성: 준비와 정리',
      question: '의존성 함수에서 "요청 처리 후 정리 작업(세션 닫기)"을 하려면 return 대신 어떤 키워드를 쓰나요?',
      answer: ['yield'],
      explanation: 'yield예요. yield 앞 = 준비, yield로 값 전달, yield 뒤(특히 finally) = 정리.\n파이썬 제너레이터와 with 문(컨텍스트 매니저)의 원리를 FastAPI가 빌려 쓴 거예요. finally에 넣어야 라우트에서 에러가 나도 세션이 닫혀요.',
    },
    {
      id: 'fa-16-04', type: 'mcq', source: 'yield 의존성: 준비와 정리',
      question: '아래 get_db에서 finally가 없다면 어떤 문제가 생길까?',
      code: `def get_db():
    db = SessionLocal()
    yield db
    db.close()`,
      choices: ['문제없다', 'db가 None이 된다', '세션이 두 번 닫힌다', '라우트에서 예외가 나면 yield 뒤가 실행되지 않아 세션이 닫히지 않고, 커넥션이 쌓여 결국 풀이 고갈될 수 있다'],
      answer: 3,
      choiceExplanations: [
        '정상 흐름에서는 닫히지만 예외 흐름이 문제예요.',
        'db는 정상적으로 전달돼요.',
        '오히려 닫히지 않는 게 문제예요.',
        '정답. try/finally로 감싸야 어떤 경우든 close가 실행돼요.',
      ],
      explanation: '"자원은 반드시 반납한다"는 원칙이에요. DB 커넥션 풀은 크기가 정해져 있어서(예: 5개) 반납되지 않은 커넥션이 쌓이면 새 요청이 커넥션을 기다리다 타임아웃이 나요. 에러가 몇 번 난 뒤 서버 전체가 멈추는 이상한 장애의 원인이 돼요.',
    },
    {
      id: 'fa-16-05', type: 'mcq', source: '인증·권한을 의존성으로',
      question: '"로그인한 사용자만" 호출할 수 있는 API를 만드는 FastAPI다운 방법은?',
      choices: ['get_current_user 의존성을 만들고 라우트에 user: CurrentUser 파라미터를 선언한다', '라우트마다 쿠키를 읽어 if 문으로 검사한다', '미들웨어에서 모든 요청을 막는다', '/docs를 끈다'],
      answer: 0,
      choiceExplanations: [
        '정답. 검사 로직이 한 곳에 있고, 라우트는 사용자 객체를 바로 받아 써요.',
        '중복이 생기고, 한 곳에서 빠뜨리면 구멍이 돼요.',
        '로그인 페이지나 공개 API까지 막혀요. 라우트별 요구사항은 의존성이 알맞아요.',
        '문서를 숨겨도 API는 호출할 수 있어요.',
      ],
      explanation: '의존성 체인: get_db → get_current_user → require_admin. 라우트는 필요한 수준만 선언하면 돼요.\n• 공개 API: 아무것도 안 붙임\n• 로그인 필요: user: CurrentUser\n• 관리자만: dependencies=[Depends(require_admin)]',
    },
    {
      id: 'fa-16-06', type: 'mcq', source: '인증·권한을 의존성으로',
      question: '테스트에서 실제 로그인 없이 get_current_user를 가짜 사용자로 바꾸려면?',
      choices: ['테스트용으로 라우트 코드를 복사한다', 'app.dependency_overrides[get_current_user] = lambda: fake_user', '운영 DB에 테스트 계정을 만든다', '인증 코드를 주석 처리한다'],
      answer: 1,
      choiceExplanations: [
        '테스트 대상이 실제 코드가 아니게 돼요.',
        '정답. 의존성 함수를 다른 함수로 갈아 끼워요. 테스트가 끝나면 dependency_overrides.clear().',
        '운영 데이터를 건드리면 안 돼요.',
        '실수로 그대로 배포될 위험이 있어요.',
      ],
      explanation: '의존성 주입의 큰 장점이 "교체 가능성"이에요. DB도 같은 방식으로 테스트용 DB 세션으로 바꿔요.\nTestClient(app)와 dependency_overrides를 함께 쓰면 실제 HTTP 흐름 그대로 빠르게 테스트할 수 있어요.',
    },
    {
      id: 'fa-16-07', type: 'ox', source: '인증·권한을 의존성으로',
      question: '반환값을 쓰지 않는 검사(API 키 확인 등)는 라우트 데코레이터의 dependencies=[Depends(...)]에 넣을 수 있다.',
      answer: true,
      explanation: '맞아요. 파라미터로 받을 필요가 없는 의존성은 dependencies 목록에 넣어요. 검사에 실패하면 의존성이 raise한 예외로 응답이 끝나고, 통과하면 라우트가 실행돼요.\nAPIRouter(dependencies=[...]), FastAPI(dependencies=[...])로 범위를 넓힐 수도 있어요.',
    },
    {
      id: 'fa-16-08', type: 'mcq', source: 'APIRouter로 파일 나누기',
      question: 'router = APIRouter(prefix="/users") 에 @router.get("/{user_id}")를 등록하고 app.include_router(router)를 했다. 최종 경로는?',
      choices: ['/{user_id}', '/users', '/router/users/{user_id}', '/users/{user_id}'],
      answer: 3,
      choiceExplanations: [
        'prefix가 붙어요.',
        '라우트 경로가 뒤에 붙어요.',
        '변수 이름은 경로와 관계없어요.',
        '정답. prefix + 라우트 경로.',
      ],
      explanation: 'include_router(router, prefix="/api/v1")처럼 붙일 때 prefix를 하나 더 줄 수 있어요. 그러면 /api/v1/users/{user_id}가 돼요.\nFlask의 register_blueprint(bp, url_prefix="/blog")와 같은 개념이에요.',
    },
    {
      id: 'fa-16-09', type: 'short', source: 'APIRouter로 파일 나누기',
      question: 'Flask의 Blueprint에 해당하는 FastAPI 클래스 이름은?',
      answer: ['APIRouter'],
      explanation: 'APIRouter예요. 등록은 app.include_router(router).\n라우터 단위로 prefix, tags, dependencies, responses를 지정할 수 있어서 기능별 규칙을 묶기 좋아요.',
    },
    {
      id: 'fa-16-10', type: 'mcq', source: '미들웨어와 MVC를 대하는 태도',
      question: '모든 응답에 처리 시간 헤더(X-Process-Time)를 붙이려 한다. 알맞은 도구는?',
      choices: ['각 라우트에 response 파라미터를 받아 직접 붙인다', 'Depends로 만든다', '@app.middleware("http")로 call_next 앞뒤 시간을 재서 헤더를 붙인다', 'Jinja2 필터를 쓴다'],
      answer: 2,
      choiceExplanations: [
        '모든 라우트를 고쳐야 해요.',
        '의존성은 라우트 실행 전에 동작해서 응답 이후 시간을 재기 어렵고, 모든 라우트에 붙여야 해요.',
        '정답. 모든 요청·응답을 감싸는 일은 미들웨어가 알맞아요.',
        '템플릿과 무관해요.',
      ],
      explanation: '판단 기준:\n• 모든 요청에 똑같이 적용 + 응답까지 손봐야 함 → 미들웨어\n• 특정 라우트에만 필요 + 값을 라우트에 넘겨야 함 → 의존성\n미들웨어는 404 같은 라우트 없음 응답에도 실행된다는 점도 기억하세요.',
    },
    {
      id: 'fa-16-11', type: 'mcq', source: '미들웨어와 MVC를 대하는 태도',
      question: '서버가 시작될 때 한 번만 ML 모델을 메모리에 올리고, 종료 시 정리하려 한다. FastAPI에서 권장하는 방법은?',
      choices: ['첫 요청이 왔는지 전역 변수로 확인한다', 'lifespan 함수(asynccontextmanager)를 FastAPI(lifespan=...)로 등록한다', '미들웨어에서 매 요청마다 로딩한다', '의존성에서 매 요청마다 로딩한다'],
      answer: 1,
      choiceExplanations: [
        '노션에서 Flask의 before_first_request 대체로 썼던 방식이지만, 동시 요청에서 두 번 로딩될 수 있고 첫 사용자가 느려져요.',
        '정답. yield 앞은 시작 시, 뒤는 종료 시 한 번 실행돼요.',
        '요청마다 로딩하면 엄청 느려져요.',
        '요청마다 로딩하면 엄청 느려져요.',
      ],
      explanation: 'lifespan은 앱 수준의 준비·정리예요. 예전 @app.on_event("startup"/"shutdown")은 사용 중단 예정이고 lifespan이 표준이에요.\nyield 의존성(요청 단위)과 lifespan(앱 단위)은 같은 yield 패턴이지만 범위가 달라요.',
    },
    {
      id: 'fa-16-12', type: 'ox', source: '미들웨어와 MVC를 대하는 태도',
      question: '작은 프로젝트라도 반드시 Controller, Service, Repository, DTO 등 모든 계층을 파일로 나눠야 좋은 설계다.',
      answer: false,
      explanation: '노션의 결론처럼 "Simple is Best"예요. 계층은 복잡도를 관리하려고 나누는 것이지 그 자체가 목적이 아니에요.\n작게 시작해서(router + schemas + models), 비즈니스 로직이 커지면 service를 분리하고, DB 접근이 복잡해지면 repository를 두는 식으로 필요할 때 나누면 돼요.',
    },
    {
      id: 'fa-16-13', type: 'mcq', source: 'APIRouter로 파일 나누기',
      question: 'app/posts/router.py와 app/users/router.py가 서로를 import하다 ImportError(circular import)가 났다. 가장 좋은 해결은?',
      choices: ['두 파일을 하나로 합친다', '공통으로 필요한 것(모델, 스키마, 의존성)을 별도 모듈로 빼서 둘 다 그쪽을 import하게 한다', 'import를 함수 안으로 모두 옮긴다', '파이썬 버전을 올린다'],
      answer: 1,
      choiceExplanations: [
        '구조를 나눈 의미가 사라져요.',
        '정답. 의존 방향을 한쪽으로 정리하는 게 근본 해결이에요. 라우터끼리는 서로 import하지 않는 게 원칙이에요.',
        '임시방편은 되지만 구조 문제를 숨겨요.',
        '버전과 무관해요.',
      ],
      explanation: '의존 방향 원칙: main → routers → services → models/schemas/core. 아래 계층은 위 계층을 import하지 않아요. 라우터끼리 공유할 게 있으면 더 아래 계층(service, deps.py)으로 내려요.',
    },
  ],
}

export default topic
