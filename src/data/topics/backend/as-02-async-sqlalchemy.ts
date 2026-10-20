import type { Topic } from '../../types'

const topic: Topic = {
  id: 'as-02-async-sqlalchemy',
  track: 'backend',
  group: '비동기',
  title: '비동기 SQLAlchemy 실행 환경',
  order: 52,
  sections: [
    {
      title: '비동기 드라이버와 URL',
      points: [
        '비동기 SQLAlchemy는 비동기 DB 드라이버 위에서 동작한다. PostgreSQL: asyncpg(또는 psycopg 3 async), MySQL: aiomysql/asyncmy, SQLite: aiosqlite.',
        'URL의 드라이버 부분만 바뀐다: postgresql+asyncpg://..., mysql+aiomysql://..., sqlite+aiosqlite:///./app.db.',
        '동기 드라이버(psycopg2, pymysql)로는 비동기 엔진을 만들 수 없다. "The asyncio extension requires an async driver" 같은 에러가 난다.',
        'Supabase처럼 커넥션 풀러(PgBouncer, transaction 모드)를 거치는 경우 asyncpg의 prepared statement 캐시가 문제를 일으킬 수 있어, connect_args={"statement_cache_size": 0} 같은 설정이 필요할 수 있다.',
      ],
      code: `pip install "sqlalchemy[asyncio]" asyncpg aiosqlite

DATABASE_URL = "postgresql+asyncpg://user:pw@localhost:5432/app"
# 개발용: "sqlite+aiosqlite:///./app.db"`,
    },
    {
      title: 'create_async_engine과 async_sessionmaker',
      points: [
        'engine = create_async_engine(URL, echo=True). 앱 전체에 하나.',
        'SessionLocal = async_sessionmaker(engine, expire_on_commit=False). 비동기에서는 expire_on_commit=False가 사실상 필수다. commit 후 속성에 접근할 때 자동 재조회(지연 로딩)가 일어나면 에러가 나기 때문이다.',
        '의존성: async def get_db(): async with SessionLocal() as session: yield session. async with가 블록 끝에서 세션을 닫는다.',
        '테이블 생성은 동기 함수인 metadata.create_all을 run_sync로 실행한다: async with engine.begin() as conn: await conn.run_sync(Base.metadata.create_all).',
        '앱 종료 시 await engine.dispose()로 커넥션 풀을 정리한다. lifespan에서 처리하면 깔끔하다.',
      ],
      code: `from contextlib import asynccontextmanager
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession

engine = create_async_engine(DATABASE_URL, echo=True)
SessionLocal = async_sessionmaker(engine, expire_on_commit=False)

async def get_db():
    async with SessionLocal() as session:
        yield session

AsyncSessionDep = Annotated[AsyncSession, Depends(get_db)]

@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)   # 개발용
    yield
    await engine.dispose()

app = FastAPI(lifespan=lifespan)`,
    },
    {
      title: '무엇을 await 하나',
      points: [
        'DB와 통신하는 메서드는 await: await session.execute(stmt), await session.scalars(stmt), await session.scalar(stmt), await session.get(Model, id), await session.commit(), await session.flush(), await session.refresh(obj), await session.delete(obj), await session.rollback().',
        '메모리에서만 일어나는 메서드는 await 하지 않는다: session.add(obj), session.add_all([...]). 결과 객체의 .all(), .first(), .one() 도 이미 받은 결과를 꺼내는 것이라 await 하지 않는다.',
        'await를 빼먹으면 코루틴 객체가 그대로 남고 "was never awaited" 경고가 나며, 결과가 없거나 커밋이 안 된다.',
      ],
      code: `post = Post(title="hi", content="...")
session.add(post)              # await 없음 (메모리)
await session.commit()         # await (DB)
await session.refresh(post)

result = await session.scalars(select(Post))   # await (DB)
posts = result.all()                           # await 없음 (이미 받은 결과)`,
    },
    {
      title: '비동기에서 지연 로딩이 안 되는 이유',
      points: [
        '동기 ORM에서는 post.author에 접근하면 그 순간 몰래 SELECT를 실행한다(지연 로딩). 속성 접근은 await할 수 없으므로 비동기에서는 이 "몰래 실행"이 불가능하다.',
        '그래서 비동기에서 로딩 안 된 관계에 접근하면 MissingGreenlet 에러("greenlet_spawn has not been called...")가 난다. 응답 모델 변환 중에 나면 원인을 찾기 더 어렵다.',
        '해결 1: 쿼리에서 관계를 미리 로딩한다. select(Post).options(selectinload(Post.author)).',
        '해결 2: 모델의 relationship(lazy="selectin" 또는 lazy="raise")로 기본 전략을 바꾼다. lazy="raise"는 실수로 접근하면 명확한 에러를 낸다.',
        '해결 3: 꼭 필요하면 await session.refresh(obj, ["author"]) 나 AsyncAttrs 믹스인의 await obj.awaitable_attrs.author 로 명시적으로 불러온다.',
      ],
      code: `# MissingGreenlet 발생
post = await session.get(Post, 1)
print(post.author.nickname)          # 💥 지연 로딩 시도

# 해결
stmt = select(Post).where(Post.id == 1).options(selectinload(Post.author))
post = await session.scalar(stmt)
print(post.author.nickname)          # OK (이미 로딩됨)`,
    },
  ],
  questions: [
    {
      id: 'as-02-01', type: 'mcq', source: '비동기 드라이버와 URL',
      question: 'PostgreSQL을 비동기 SQLAlchemy로 쓰기 위한 URL로 맞는 것은?',
      choices: ['postgresql+psycopg2://...', 'postgresql://... (드라이버 생략)', 'postgresql+asyncpg://...', 'async+postgresql://...'],
      answer: 2,
      choiceExplanations: [
        'psycopg2는 동기 드라이버라 비동기 엔진에 쓸 수 없어요.',
        '생략하면 기본 동기 드라이버(psycopg2)가 선택돼 비동기 엔진에서 에러가 나요.',
        '정답. asyncpg는 비동기 전용 PostgreSQL 드라이버예요.',
        '그런 형식은 없어요.',
      ],
      explanation: '형식은 같고 드라이버만 바뀌어요: 방언+비동기드라이버://...\n테스트나 학습용으로는 sqlite+aiosqlite:///./app.db 가 설치 부담이 없어 편해요.',
    },
    {
      id: 'as-02-02', type: 'short', source: 'create_async_engine과 async_sessionmaker',
      question: '비동기 엔진을 만드는 SQLAlchemy 함수 이름은?',
      answer: ['create_async_engine'],
      explanation: 'sqlalchemy.ext.asyncio.create_async_engine이에요. 세션 공장은 async_sessionmaker, 세션 타입은 AsyncSession.\n동기: create_engine / sessionmaker / Session ↔ 비동기: create_async_engine / async_sessionmaker / AsyncSession.',
    },
    {
      id: 'as-02-03', type: 'mcq', source: 'create_async_engine과 async_sessionmaker',
      question: '비동기 세션 공장에 expire_on_commit=False를 주는 이유는?',
      choices: ['commit 후 객체 속성에 접근할 때 자동 재조회(암묵적 I/O)가 일어나 비동기에서 에러가 나는 것을 막으려고', '커밋을 빠르게 하려고', '세션을 공유하려고', '트랜잭션을 끄려고'],
      answer: 0,
      choiceExplanations: [
        '정답. 기본값(True)이면 commit 후 모든 속성이 만료돼, 응답을 만들 때 post.title 접근만으로 DB 조회가 필요해져요. 비동기에서는 그게 불가능해요.',
        '속도 옵션이 아니에요.',
        '공유와 무관해요.',
        '트랜잭션은 그대로예요.',
      ],
      explanation: '비동기 SQLAlchemy의 철학: "DB I/O는 반드시 await로 눈에 보이게". 속성 접근 같은 숨은 I/O는 허용되지 않아요.\nexpire_on_commit=False로 두면 commit 후에도 메모리의 값이 유지돼요. DB가 채운 값(server_default)이 필요하면 await session.refresh(obj)로 명시적으로 읽어요.',
    },
    {
      id: 'as-02-04', type: 'mcq', source: 'create_async_engine과 async_sessionmaker',
      question: '비동기 엔진으로 테이블을 만들 때 Base.metadata.create_all을 어떻게 호출할까?',
      choices: ['Base.metadata.create_all(engine)', 'async with engine.begin() as conn: await conn.run_sync(Base.metadata.create_all)', 'await Base.metadata.create_all(engine)', 'create_all은 비동기에서 쓸 수 없다'],
      answer: 1,
      choiceExplanations: [
        '비동기 엔진을 동기 함수에 바로 넘길 수 없어요.',
        '정답. run_sync가 동기 함수를 비동기 연결 위에서 실행해 줘요.',
        'create_all은 코루틴이 아니라 await할 수 없어요.',
        'run_sync로 쓸 수 있어요.',
      ],
      explanation: 'run_sync는 "동기 API밖에 없는 기능을 비동기 연결에서 실행"하는 다리예요.\n운영에서는 create_all 대신 Alembic 마이그레이션을 쓰고, Alembic도 비동기 엔진용 템플릿(alembic init -t async)을 제공해요.',
    },
    {
      id: 'as-02-05', type: 'mcq', source: '무엇을 await 하나',
      question: '비동기 세션에서 await를 붙이지 않는 것은?',
      choices: ['session.commit()', 'session.execute(stmt)', 'session.add(post)', 'session.refresh(post)'],
      answer: 2,
      choiceExplanations: [
        'DB에 COMMIT을 보내니 await해요.',
        'DB에 SQL을 보내니 await해요.',
        '정답. add는 세션(메모리)에 올리기만 해서 I/O가 없어요.',
        'DB에서 다시 읽으니 await해요.',
      ],
      explanation: '판단 기준: "DB와 통신하는가?" → await. add, add_all, expunge처럼 메모리 작업은 await 없이.\n결과 객체의 .all(), .first(), .scalars()(Result에서 꺼낼 때)도 이미 받은 데이터를 다루는 거라 await하지 않아요.',
    },
    {
      id: 'as-02-06', type: 'mcq', source: '무엇을 await 하나',
      question: '아래 코드에서 문제가 되는 줄은?',
      code: `async def create(session: AsyncSession, data: PostCreate):
    post = Post(**data.model_dump())   # (1)
    session.add(post)                  # (2)
    session.commit()                   # (3)
    return post`,
      choices: ['(1)', '(2)', '문제없다', '(3) await가 빠져 커밋되지 않는다'],
      answer: 3,
      choiceExplanations: [
        '객체 생성은 정상이에요.',
        'add는 await하지 않는 게 맞아요.',
        '커밋이 실행되지 않아요.',
        '정답. 코루틴만 만들어지고 실행되지 않아요. "coroutine \'AsyncSession.commit\' was never awaited" 경고가 나고 데이터는 저장되지 않아요.',
      ],
      explanation: 'await 누락은 비동기 코드의 가장 흔한 버그예요. 에러가 아니라 경고만 나와서 놓치기 쉬워요.\nmypy/pyright 같은 타입 검사기나 ruff의 관련 규칙을 켜 두면 "await되지 않은 코루틴"을 미리 잡아 줘요.',
    },
    {
      id: 'as-02-07', type: 'short', source: '비동기에서 지연 로딩이 안 되는 이유',
      question: '비동기 세션에서 로딩되지 않은 관계 속성(post.author)에 접근할 때 나는 대표 에러 이름은? (Missing______)',
      answer: ['MissingGreenlet', 'greenlet', 'Greenlet'],
      explanation: 'sqlalchemy.exc.MissingGreenlet: greenlet_spawn has not been called...\n뜻: "await 없이 DB I/O를 하려 했다". 해결은 쿼리에서 selectinload/joinedload로 미리 로딩하거나, refresh(obj, ["author"])로 명시적으로 불러오는 거예요.',
    },
    {
      id: 'as-02-08', type: 'mcq', source: '비동기에서 지연 로딩이 안 되는 이유',
      question: '응답 모델 PostRead에 author: UserSummary가 있다. 비동기에서 글 목록을 안전하게 돌려주는 쿼리는?',
      choices: [
        'await session.scalars(select(Post))',
        'await session.scalars(select(Post).options(selectinload(Post.author)))',
        'await session.scalars(select(Post).join(Post.author))',
        'await session.get(Post, all)',
      ],
      answer: 1,
      choiceExplanations: [
        '응답 변환 중 post.author 접근에서 MissingGreenlet이 나요.',
        '정답. 작성자를 미리 로딩해서 응답 변환 중에 추가 I/O가 없어요. N+1도 함께 해결돼요.',
        'join은 필터용이라 관계 속성을 채우지 않아요.',
        '잘못된 사용법이에요.',
      ],
      explanation: '동기에서는 "느리지만 동작하는" N+1이 비동기에서는 "에러"가 돼요. 오히려 좋은 면도 있어요. 숨은 쿼리를 강제로 드러내 주니까요.\n원칙: 응답 모델에 들어가는 관계는 모두 쿼리의 options로 명시적으로 로딩한다.',
    },
    {
      id: 'as-02-09', type: 'ox', source: '비동기에서 지연 로딩이 안 되는 이유',
      question: 'relationship(lazy="raise")로 설정하면 로딩되지 않은 관계에 접근할 때 몰래 쿼리를 보내는 대신 명확한 에러를 낸다.',
      answer: true,
      explanation: '맞아요. 개발 중에 N+1이나 MissingGreenlet을 더 이해하기 쉬운 에러로 바꿔 줘요. 필요한 곳에서는 쿼리 options로 로딩 전략을 지정하면 돼요.\n반대로 lazy="selectin"은 "이 관계는 항상 selectin으로 함께 로딩"이라는 기본값이라 편하지만, 필요 없는 곳에서도 쿼리가 나가요.',
    },
    {
      id: 'as-02-10', type: 'mcq', source: 'create_async_engine과 async_sessionmaker',
      question: '비동기 세션 의존성으로 가장 알맞은 코드는?',
      choices: [
        'async def get_db(): async with SessionLocal() as session: yield session',
        'def get_db(): return SessionLocal()',
        'async def get_db(): session = SessionLocal(); return session',
        'session = SessionLocal()  # 전역 하나',
      ],
      answer: 0,
      choiceExplanations: [
        '정답. async with가 블록 끝에서(에러가 나도) 세션을 닫아요.',
        '세션을 닫는 정리 단계가 없어요.',
        '닫히지 않아 커넥션이 새요.',
        '전역 세션 공유는 동시성 문제를 만들어요.',
      ],
      explanation: '동기 버전(with + yield)과 모양이 같고 async만 붙었어요. 커밋을 의존성에서 할지 라우트에서 할지는 팀 규칙으로 정하되, 정리(close)는 항상 의존성이 책임져요.',
    },
    {
      id: 'as-02-11', type: 'ox', source: '비동기 드라이버와 URL',
      question: '비동기 엔진에는 psycopg2나 pymysql 같은 동기 드라이버를 그대로 쓸 수 있다.',
      answer: false,
      explanation: '안 돼요. 비동기 엔진은 비동기 드라이버(asyncpg, aiomysql, aiosqlite 등)를 요구해요. 동기 드라이버를 쓰면 엔진을 만들 때 에러가 나요.\nrequirements에 드라이버를 빠뜨려 배포 서버에서만 에러가 나는 경우가 많으니, 로컬과 같은 드라이버가 설치되는지 확인하세요.',
    },
    {
      id: 'as-02-12', type: 'mcq', source: 'create_async_engine과 async_sessionmaker',
      question: '서버 종료 시 비동기 엔진의 커넥션 풀을 정리하는 코드는?',
      choices: ['engine.close()', 'del engine', 'await engine.dispose()', 'engine = None'],
      answer: 2,
      choiceExplanations: [
        'engine에는 close가 없어요.',
        '참조만 지울 뿐 연결이 깔끔하게 닫힌다는 보장이 없어요.',
        '정답. 풀의 모든 커넥션을 닫아요. lifespan의 yield 뒤에서 호출해요.',
        '마찬가지예요.',
      ],
      explanation: 'lifespan 패턴: yield 앞(시작) → 풀 준비·테이블 확인, yield 뒤(종료) → await engine.dispose().\n테스트에서도 테스트가 끝날 때 dispose해야 "Event loop is closed" 같은 경고를 피할 수 있어요.',
    },
  ],
}

export default topic
