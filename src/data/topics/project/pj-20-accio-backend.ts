import type { Topic } from '../../types'

const topic: Topic = {
  id: 'pj-20-accio-backend',
  track: 'project',
  group: '백엔드',
  title: '02-1. backend/accio (FastAPI + 비동기 SQLAlchemy 뼈대)',
  order: 20,
  notionId: '3f2df951bf808157bfd2de04cee34956',
  addedAt: '2026-10-15',
  sections: [
    {
      title: '폴더 개요',
      points: [
        'Accio 쇼핑몰용 API 서버의 뼈대 — 기능은 "서버가 살아 있나", "DB 에 연결되나" 두 가지뿐',
        'c424e5f 커밋에서 Portfolio/backend/ → accio/ 로 옮겨짐 (내용 그대로)',
        '작지만 정석 구조: 설정 분리, 세션 의존성 주입, lifespan 정리, 라이브니스/레디니스 분리',
      ],
    },
    {
      title: 'app/main.py',
      notionId: '3f2df951bf8081ecba62f43fa1189aa2',
      code: `@asynccontextmanager
async def lifespan(app: FastAPI):
    yield                    # 여기까지 = 켜질 때, 이후 = 꺼질 때
    await engine.dispose()

def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(title=settings.app_name, lifespan=lifespan)
    app.add_middleware(CORSMiddleware, allow_origins=settings.cors_origins, ...)
    app.include_router(health_router)
    return app

app = create_app()   # fastapi run 이 찾는 변수`,
      points: [
        '팩토리 함수(create_app): 테스트에서 설정을 바꿔 새 앱을 만들 수 있게 하는 관용 패턴',
        'lifespan 은 예전 @app.on_event("shutdown") 을 대체하는 최신 방식. yield 앞 = 시작, 뒤 = 종료',
        'maestro main.py 와 차이: accio 는 DB 가 있어 lifespan 이 있고, maestro 는 라우터 4개 + 오류 핸들러, lifespan 없음',
      ],
    },
    {
      title: 'app/core/config.py',
      notionId: '3f2df951bf8081a7ab80e9c4f1ff6849',
      code: `class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")
    app_name: str = "Accio API"
    environment: Literal["local", "production"] = "local"
    cors_origins: list[str] = ["http://localhost:5173"]
    database_url: str          # 기본값 없음 = 필수`,
      points: [
        '환경변수 이름은 필드 이름의 대문자 (DATABASE_URL, CORS_ORIGINS)',
        'list[str] 는 환경변수에 JSON 배열 문자열(["https://a.com"])로',
        'Literal 이라 ENVIRONMENT=prod 같은 오타면 서버가 아예 안 켜짐 (일찍 실패)',
        '@lru_cache 로 처음 만든 객체 재사용',
        'database_url 이 필수라 테스트도 DATABASE_URL(실제 DB)이 있어야 돈다',
      ],
    },
    {
      title: 'app/core/db.py',
      notionId: '3f2df951bf80814a9339c630d8229ae3',
      code: `engine = create_async_engine(
    get_settings().database_url,   # postgresql+asyncpg://...
    pool_size=5, max_overflow=5,
    pool_pre_ping=True,
    connect_args={"timeout": 5},
)
SessionLocal = async_sessionmaker(engine, expire_on_commit=False)

async def get_db():
    async with SessionLocal() as session:
        yield session`,
      points: [
        'pool_size=5: 항상 열어두는 연결 수, max_overflow=5: 바쁠 때 추가 (최대 10)',
        'pool_pre_ping: 오래된 연결을 쓰기 전에 살아 있나 확인 → Supabase 가 끊어도 복구',
        'connect_args timeout 5: asyncpg 접속 시도 5초 제한',
        'create_async_engine 은 만들 때 접속하지 않음 — 첫 쿼리 때 실제 연결',
        'expire_on_commit=False: commit 후에도 속성을 다시 조회하지 않고 사용 (비동기에서 흔한 설정)',
        'yield 의존성: 요청 시작에 세션 생성, 응답이 끝나면 async with 를 빠져나가며 닫힘. 테이블·ORM 모델은 아직 없음',
      ],
    },
    {
      title: 'app/health/router.py',
      notionId: '3f2df951bf80813dbeabfb5b732b2183',
      code: `@router.get("/db")
async def readiness(settings: Annotated[Settings, Depends(get_settings)],
                    db: Annotated[AsyncSession, Depends(get_db)]) -> HealthResponse:
    try:
        await db.execute(text("SELECT 1"))
    except (SQLAlchemyError, OSError) as exc:
        raise HTTPException(status.HTTP_503_SERVICE_UNAVAILABLE, "database unavailable") from exc
    return HealthResponse(status="ok", environment=settings.environment)`,
      points: [
        'GET /health (liveness): 프로세스가 살아 있나, DB 안 건드림',
        'GET /health/db (readiness): DB 까지 연결되나, SELECT 1',
        'Annotated[X, Depends(f)]: "이 매개변수에 f() 결과를 넣어줘" — 의존성 주입',
        '반환 타입 -> HealthResponse 를 보고 응답 스키마 생성·검증',
        'OSError 도 잡는 이유: 포트 닫힘·타임아웃처럼 아예 접속이 안 되면 OS 에러가 날 수 있어서',
      ],
    },
    {
      title: 'tests/test_health.py',
      notionId: '3f2df951bf8081b09040ccbcb5913f72',
      points: [
        'TestClient(app): 실제 서버를 띄우지 않고 앱에 직접 요청을 넣어보는 도구',
        'test_liveness_returns_ok: 200 + {"status": "ok", "environment": "local"}',
        'test_readiness_checks_database 는 진짜 DB 가 있어야 통과 (docker compose up 필요) — maestro 처럼 가짜를 끼우는 구조가 아님',
      ],
    },
    {
      title: '설정 파일 (pyproject · docker-compose · .env.example)',
      notionId: '3f2df951bf80812c82bfdba14d36b939',
      points: [
        'dependencies: asyncpg(Postgres 비동기 드라이버), fastapi[standard](uvicorn·httpx·CLI 포함), pydantic-settings, sqlalchemy[asyncio]',
        'dependency-groups dev: pytest, ruff 등 — --no-dev 로 운영 설치에서 제외',
        'docker-compose: pgvector/pgvector:pg17 (Postgres 17 + 벡터 확장), 5432 포트, volumes 로 컨테이너를 지워도 데이터 유지',
        'healthcheck: pg_isready -U accio -d accio',
        '.python-version 3.13 — uv 가 이 버전을 골라 씀',
        'pgvector 를 고른 이유: 나중에 임베딩 기반 "비슷한 의미" AI 검색을 붙이려는 준비로 보임 (현재 벡터 사용 코드 없음)',
      ],
    },
  ],
  questions: [
    { id: 'pj-20-01', type: 'mcq', source: '폴더 개요', question: 'backend/accio 가 보여주는 "정석 구조"가 아닌 것은?', choices: ['설정 분리', '세션 의존성 주입', 'lifespan 정리', 'ORM 모델로 상품 테이블 관리'], answer: 3, explanation: '테이블·ORM 모델은 아직 없어요. 연결만 준비된 상태.' },
    { id: 'pj-20-02', type: 'mcq', source: 'app/main.py', question: '앱을 create_app() 팩토리 함수로 감싸는 이유는?', choices: ['속도', '테스트에서 설정을 바꿔 새 앱을 만들 수 있게', '필수 문법', '메모리 절약'], answer: 1, explanation: '모듈 전역에 앱 하나만 있으면 설정을 바꾼 앱을 만들기 어려워요.' },
    { id: 'pj-20-03', type: 'mcq', source: 'app/main.py', question: 'lifespan 함수에서 yield 뒤에 둔 engine.dispose() 는 언제 실행되나?', choices: ['서버 시작 시', '서버 종료 시', '매 요청 후', '첫 요청 전'], answer: 1, explanation: 'yield 앞은 시작, 뒤는 종료 시점이에요.' },
    { id: 'pj-20-04', type: 'mcq', source: 'app/main.py', question: 'lifespan 이 대체하는 예전 방식은?', choices: ['@app.middleware', '@app.on_event("startup"/"shutdown")', 'Depends', 'BackgroundTasks'], answer: 1, explanation: 'on_event 는 deprecated 되고 lifespan 컨텍스트 매니저를 권장해요.' },
    { id: 'pj-20-05', type: 'mcq', source: 'app/core/config.py', question: 'Settings 의 cors_origins: list[str] 를 환경변수로 넣는 형식은?', choices: ['https://a.com,https://b.com', '["https://a.com"] (JSON 배열 문자열)', 'https://a.com https://b.com', '아무 형식이나'], answer: 1, explanation: 'pydantic-settings 는 복합 타입을 JSON 으로 파싱해요.' },
    { id: 'pj-20-06', type: 'mcq', source: 'app/core/config.py', question: 'environment: Literal["local", "production"] 에 ENVIRONMENT=prod 를 넣으면?', choices: ['local 로 대체', '검증 실패로 서버가 아예 안 켜짐', 'prod 로 저장', '경고만'], answer: 1, explanation: '오타를 운영 중이 아니라 시작 단계에서 잡는 "일찍 실패" 설계예요.' },
    { id: 'pj-20-07', type: 'mcq', source: 'app/core/db.py', question: 'pool_size=5, max_overflow=5 일 때 동시에 열 수 있는 최대 연결 수는?', choices: ['5', '10', '25', '무제한'], answer: 1, explanation: '기본 5 + 바쁠 때 추가 5.' },
    { id: 'pj-20-08', type: 'mcq', source: 'app/core/db.py', question: 'pool_pre_ping=True 의 효과는?', choices: ['연결을 미리 많이 열어둠', '연결을 쓰기 전에 살아 있는지 확인해 끊긴 연결을 복구', '쿼리 캐시', '로그 출력'], answer: 1, explanation: 'Supabase 가 유휴 연결을 끊어도 다음 요청이 실패하지 않아요.' },
    { id: 'pj-20-09', type: 'mcq', source: 'app/core/db.py', question: 'create_async_engine 을 호출하는 순간 DB 에 접속하나?', choices: ['예, 바로 접속', '아니요, 첫 쿼리 때 실제로 연결', '서버 종료 때', '설정에 따라 다름'], answer: 1, explanation: '엔진은 연결 풀 "설정"만 만들어요.' },
    { id: 'pj-20-10', type: 'mcq', source: 'app/core/db.py', question: 'get_db 처럼 yield 를 쓰는 의존성의 동작은?', choices: ['세션을 전역으로 하나만 공유', '요청마다 세션을 만들어 주고, 응답이 끝나면 닫아줌', '매 쿼리마다 새 세션', '세션을 닫지 않음'], answer: 1, explanation: 'yield 이후 코드(async with 종료)가 응답 뒤 정리 역할을 해요.' },
    { id: 'pj-20-11', type: 'mcq', source: 'app/health/router.py', question: 'liveness 와 readiness 의 차이는?', choices: ['같다', 'liveness = 프로세스가 살아 있나, readiness = DB 등 의존 대상까지 준비됐나', 'liveness 가 DB 확인', 'readiness 는 인증 확인'], answer: 1, explanation: '/health 는 DB 를 안 건드리고, /health/db 는 SELECT 1 을 보내요.' },
    { id: 'pj-20-12', type: 'mcq', source: 'app/health/router.py', question: 'readiness 에서 SQLAlchemyError 외에 OSError 도 잡는 이유는?', choices: ['습관', '포트 닫힘·타임아웃처럼 접속 자체가 안 되면 OS 에러가 날 수 있어서', '파일 읽기 때문에', 'Python 3.13 규칙'], answer: 1, explanation: '어느 쪽이든 503 으로 바꿔 응답해요.' },
    { id: 'pj-20-13', type: 'mcq', source: 'app/health/router.py', question: 'Annotated[AsyncSession, Depends(get_db)] 의 의미는?', choices: ['타입 주석일 뿐', '이 매개변수에 get_db() 가 준 세션을 넣어 달라는 의존성 주입', '세션 생성 금지', '전역 변수 사용'], answer: 1, explanation: 'FastAPI 가 요청마다 get_db 를 실행해 값을 넣어줘요.' },
    { id: 'pj-20-14', type: 'mcq', source: 'tests/test_health.py', question: 'TestClient 의 역할은?', choices: ['실제 서버를 띄운다', '서버 없이 앱에 직접 요청을 넣어 응답을 확인', 'DB mock', '부하 테스트'], answer: 1, explanation: '네트워크 없이 빠르게 API 를 검사해요.' },
    { id: 'pj-20-15', type: 'mcq', source: 'tests/test_health.py', question: 'test_readiness_checks_database 를 통과시키려면?', choices: ['아무것도 필요 없음', '진짜 Postgres 가 필요 (docker compose up)', '헤이유미 키', 'Render 배포'], answer: 1, explanation: 'maestro 처럼 가짜를 끼우는 구조가 아니에요.' },
    { id: 'pj-20-16', type: 'mcq', source: '설정 파일 (pyproject · docker-compose · .env.example)', question: 'docker-compose 의 volumes: pgdata:/var/lib/postgresql/data 의 목적은?', choices: ['속도', '컨테이너를 지워도 DB 데이터를 유지', '백업 자동화', '포트 연결'], answer: 1, explanation: '이름 있는 볼륨에 데이터를 저장해요.' },
    { id: 'pj-20-17', type: 'mcq', source: '설정 파일 (pyproject · docker-compose · .env.example)', question: '로컬 DB 이미지로 pgvector/pgvector:pg17 을 쓴 이유로 추정되는 것은?', choices: ['더 빨라서', '나중에 임베딩(벡터) 기반 의미 검색을 붙이려는 준비', 'Supabase 필수', '무료라서'], answer: 1, explanation: '현재 코드에서 벡터를 쓰는 곳은 없어요.' },
    { id: 'pj-20-18', type: 'mcq', source: '설정 파일 (pyproject · docker-compose · .env.example)', question: 'asyncpg 패키지의 역할은?', choices: ['ORM', 'Postgres 비동기 드라이버', '마이그레이션 도구', '웹 서버'], answer: 1, explanation: 'SQLAlchemy 가 postgresql+asyncpg:// 주소로 이 드라이버를 써요.' },
  ],
}

export default topic
