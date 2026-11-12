import type { Topic } from '../../types'

const topic: Topic = {
  id: 'sa-01-orm-basic',
  track: 'backend',
  group: 'SQLAlchemy',
  title: 'ORM과 SQLAlchemy 기본: engine · Base · 모델',
  order: 41,
  sections: [
    {
      title: '드라이버 직접 사용 vs ORM',
      notionIds: ['3efdf951bf80819ab08cdba80c22bde2', '3efdf951bf8081d28650fb1b07a48c28'],
      slides: [
        {
          title: 'SQL을 직접 보내는 방법',
          blocks: [
            { type: 'say', text: 'SQL을 배웠으니, 이제 **파이썬 코드에서** DB를 다룰 차례예요. 방법은 두 가지예요.\n\n첫째, **DB 드라이버**(pymysql 등)를 직접 써서 SQL 문자열을 그대로 보내는 방법. `connect()` → `cursor()` → `execute(SQL)` → `fetchall()`/`commit()` → `close()`. 결과는 **튜플**로 와요.' },
            { type: 'code', code: `# pymysql: SQL 직접
cur.execute("SELECT id, title FROM post WHERE id = %s", (3,))
row = cur.fetchone()          # (3, '제목')  ← 0번이 id, 1번이 title… 외워야 함

# SQLAlchemy ORM
post = session.get(Post, 3)   # Post 객체
print(post.title)             # 이름으로 접근` },
          ],
        },
        {
          title: 'ORM: 테이블을 클래스로',
          blocks: [
            { type: 'say', text: '둘째, **ORM**(Object-Relational Mapping)이에요. **테이블은 클래스, 행은 객체, 컬럼은 속성**으로 다뤄요. `post.title`처럼 쓰면 SQL은 ORM이 만들어 줘요. 파이썬에서 가장 많이 쓰는 ORM이 **SQLAlchemy**예요.' },
            {
              type: 'table',
              head: ['ORM 장점', 'ORM 단점'],
              rows: [
                ['파이썬 타입·**자동 완성**', '어떤 SQL이 나가는지 모르면 **느린 쿼리**(N+1)를 만들기 쉬움'],
                ['값을 항상 바인딩 → **SQL 인젝션 기본 방지**', 'ORM 문법을 따로 배워야 함'],
                ['DB 종류(SQLite ↔ PostgreSQL)를 **바꾸기 쉬움**', ''],
                ['관계(글 ↔ 댓글)를 **객체로 탐색**', ''],
              ],
            },
            { type: 'note', tone: 'tip', text: '그래서 **SQL을 먼저 이해하고** ORM을 쓰는 게 좋아요. 그리고 `echo=True`로 **생성된 SQL을 항상 확인**하는 습관을 들여요. 필요하면 ORM 안에서도 `text("SELECT ...")`로 원본 SQL을 실행할 수 있어요.' },
            { type: 'say', text: 'SQLAlchemy는 두 층이에요. **Core**(SQL 표현식, select 객체)와 **ORM**(클래스 매핑, 세션). FastAPI 프로젝트에서는 대부분 ORM 층을 써요.' },
          ],
        },
      ],
    },
    {
      title: 'engine과 접속 URL',
      slides: [
        {
          title: 'engine: DB로 가는 길',
          blocks: [
            { type: 'code', code: `from sqlalchemy import create_engine

DATABASE_URL = "sqlite:///./app.db"
engine = create_engine(
    DATABASE_URL,
    echo=True,                                   # SQL 로그
    connect_args={"check_same_thread": False},   # SQLite + FastAPI(동기)
)` },
            { type: 'say', text: '**engine**은 "DB에 연결하는 방법 + **커넥션 풀**"을 가진 객체예요. 커넥션 풀은 DB 연결을 미리 몇 개 만들어 두고 **돌려 쓰는** 저장소예요. 그래서 engine은 **앱 전체에서 하나만** 만들어 재사용해요. 요청마다 만들면 풀이 의미가 없어져요.' },
            { type: 'list', items: ['`echo=True` → 실행되는 SQL을 로그로 출력. 학습·디버깅 **필수**', 'SQLite는 파일 하나짜리 DB라 설치 없이 바로 연습 가능', 'SQLite를 FastAPI에서 동기로 쓸 땐 `check_same_thread: False` 필요 (여러 스레드가 연결을 쓰니까)'] },
          ],
        },
        {
          title: '접속 URL 읽는 법',
          blocks: [
            { type: 'code', code: `방언+드라이버://사용자:비밀번호@호스트:포트/DB이름

sqlite:///./app.db
postgresql+psycopg://user:pw@localhost:5432/app
mysql+pymysql://user:pw@localhost:3306/app?charset=utf8mb4` },
            { type: 'note', tone: 'warn', text: 'URL에 **비밀번호**가 들어 있어요. 코드에 직접 쓰지 말고 **환경 변수(.env)** 에서 읽어요. SQL DCL 수업의 "비밀은 코드 밖에"와 같은 이야기예요.' },
          ],
        },
      ],
    },
    {
      title: 'Base와 모델 클래스 (2.0 스타일)',
      slides: [
        {
          title: '테이블을 클래스로 적기',
          blocks: [
            { type: 'code', code: `from datetime import datetime
from sqlalchemy import String, Text, func
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

class Base(DeclarativeBase):
    pass

class Post(Base):
    __tablename__ = "posts"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(200))
    content: Mapped[str] = mapped_column(Text)
    summary: Mapped[str | None]                    # NULL 허용
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())

    def __repr__(self) -> str:
        return f"Post(id={self.id!r}, title={self.title!r})"` },
            { type: 'list', items: ['`class Base(DeclarativeBase)` — 모든 모델의 부모. `Base.metadata`가 모든 테이블 정보를 모아요', '`__tablename__` — 실제 DB 테이블 이름', '`Mapped[int]` + `primary_key=True` — 정수 기본 키는 **자동 증가**', '`__repr__` — py-02에서 배운 그것! 디버깅할 때 읽기 좋게'] },
          ],
        },
        {
          title: 'Mapped가 NULL까지 정해요',
          blocks: [
            {
              type: 'table',
              head: ['선언', 'DB 컬럼'],
              rows: [
                ['`Mapped[str]`', '**NOT NULL**'],
                ['`Mapped[str | None]`', '**NULL 허용**'],
                ['`server_default=func.now()`', 'INSERT 때 값을 안 주면 **DB가** 현재 시각을 채움'],
              ],
            },
            { type: 'say', text: '타입 힌트 수업의 `str | None`이 여기서는 **DB의 NULL 허용**까지 정해요. 예전 스타일 `title = Column(String(200), nullable=False)`도 동작하지만 타입 힌트·자동 완성이 약해서, 새 코드는 2.0 스타일로 써요.' },
            { type: 'note', tone: 'warn', text: '헷갈리기 쉬워요! `PostRead`(**Pydantic**)는 API로 **주고받는 모양**을 정하고, `Post`(**SQLAlchemy**)는 **DB 테이블**의 모양을 정해요. 비슷해 보여도 역할이 달라서 둘 다 필요해요.' },
          ],
        },
      ],
    },
    {
      title: '테이블 만들기와 마이그레이션',
      slides: [
        {
          title: 'create_all의 한계',
          blocks: [
            { type: 'code', code: `Base.metadata.create_all(engine)   # 없는 테이블만 생성` },
            { type: 'say', text: '`create_all`은 **아직 없는 테이블만** 만들어요. **이미 있는 테이블은 건드리지 않아요.** 그래서 Post에 `summary` 컬럼을 새로 추가하고 서버를 재시작해도, 기존 posts 테이블에는 컬럼이 **생기지 않아요.**\n\n학습용 SQLite라면 파일을 지우고 다시 만들어도 되지만, 운영 DB에서 `drop_all`은 **모든 데이터를 지워요.**' },
          ],
        },
        {
          title: 'Alembic: 스키마 변경 이력',
          blocks: [
            { type: 'code', code: `alembic init migrations
alembic revision --autogenerate -m "add summary to posts"   # 모델 vs DB 차이 → 변경 스크립트
alembic upgrade head                                          # 적용` },
            { type: 'say', text: '운영에서는 **Alembic** 같은 마이그레이션 도구로 스키마 변경을 **이력**으로 관리해요. `--autogenerate`가 모델과 DB의 차이를 비교해서 `ALTER TABLE` 스크립트를 만들어 주고, `upgrade head`로 적용해요.\n\n마이그레이션 파일은 **git에 함께** 올려요. 그래야 모든 개발자와 서버가 **같은 순서로** 스키마를 바꿔요.' },
            { type: 'note', tone: 'analogy', text: '마이그레이션은 **집 리모델링 공사 일지**예요. "1번: 방 추가, 2번: 창문 넓힘" 순서가 적혀 있어서, 어느 집이든 이 일지대로 공사하면 똑같은 집이 돼요.' },
          ],
        },
      ],
    },
  ],
  questions: [
    {
      id: 'sa-01-01', type: 'mcq', source: '드라이버 직접 사용 vs ORM',
      question: 'ORM을 쓸 때의 장점이 아닌 것은?',
      choices: ['테이블 행을 파이썬 객체로 다룰 수 있다', 'SQL을 전혀 몰라도 항상 빠른 쿼리가 만들어진다', '값을 파라미터로 바인딩해 SQL 인젝션을 기본으로 막는다', 'DB 종류를 바꿀 때 코드 수정이 적다'],
      answer: 1,
      choiceExplanations: [
        '맞는 장점이에요.',
        '정답(장점이 아님). ORM이 만든 SQL이 비효율적일 수 있어서, 어떤 SQL이 나가는지 이해하고 확인해야 해요.',
        '맞는 장점이에요. 노션에서 강조한 "%s + 튜플" 방식을 ORM이 자동으로 해 줘요.',
        '맞는 장점이에요. URL과 일부 설정만 바꾸면 되는 경우가 많아요.',
      ],
      explanation: 'ORM은 SQL을 대신 써 주는 도구지 SQL 지식을 대체하지 않아요. echo=True로 SQL을 보면서 "이 코드가 쿼리를 몇 번 보내는지"를 늘 확인하세요. 이 트랙에서 SQL 그룹을 함께 공부하는 이유예요.',
    },
    {
      id: 'sa-01-02', type: 'mcq', source: '드라이버 직접 사용 vs ORM',
      question: 'pymysql에서 아래 코드가 위험한 이유는?',
      code: `name = request_value   # 사용자 입력
cur.execute("SELECT * FROM users WHERE name = '" + name + "'")`,
      choices: ['입력에 \' OR \'1\'=\'1 같은 값이 오면 SQL 구조가 바뀌는 SQL 인젝션이 가능해서', '속도가 느려서', 'pymysql은 SELECT를 지원하지 않아서', '작은따옴표를 쓸 수 없어서'],
      answer: 0,
      choiceExplanations: [
        '정답. 입력값이 SQL의 일부로 해석돼 모든 사용자가 조회되거나, 더 나쁘게는 데이터가 지워질 수 있어요.',
        '속도보다 훨씬 큰 문제가 있어요.',
        'SELECT를 잘 지원해요.',
        '문제는 사용자 입력을 문자열로 이어 붙인 것이에요.',
      ],
      explanation: '해결: cur.execute("SELECT * FROM users WHERE name = %s", (name,)). 값은 드라이버가 안전하게 전달해요.\nSQLAlchemy ORM과 select().where(User.name == name)도 내부적으로 파라미터 바인딩을 해요. 단, text()로 원본 SQL을 쓸 때 f-string으로 값을 넣으면 똑같이 위험해요. text("... WHERE name = :name")에 params로 넘겨야 해요.',
    },
    {
      id: 'sa-01-03', type: 'short', source: 'engine과 접속 URL',
      question: 'create_engine에서 실행되는 SQL을 로그로 보려면 어떤 옵션을 True로 주나요?',
      answer: ['echo', 'echo=True'],
      explanation: 'echo=True예요. 학습할 때는 항상 켜 두고 "내 파이썬 코드 → 실제 SQL"을 짝지어 보는 게 ORM 실력을 가장 빨리 늘리는 방법이에요.\n운영에서는 로그가 너무 많아지니 끄고, 느린 쿼리만 따로 기록해요.',
    },
    {
      id: 'sa-01-04', type: 'mcq', source: 'engine과 접속 URL',
      question: 'PostgreSQL에 psycopg 드라이버로 접속하는 URL로 맞는 것은?',
      choices: ['postgres://localhost/app', 'psycopg://app@user', 'postgresql+psycopg://user:pw@localhost:5432/app', 'http://localhost:5432/app'],
      answer: 2,
      choiceExplanations: [
        'SQLAlchemy 1.4부터 postgres:// 스킴은 인식하지 않아요(postgresql로 써야 해요). 일부 클라우드가 주는 URL을 그대로 쓰면 에러가 나는 이유예요.',
        '형식이 맞지 않아요.',
        '정답. 방언+드라이버://사용자:비밀번호@호스트:포트/DB이름.',
        'DB 접속은 HTTP가 아니에요.',
      ],
      explanation: 'URL 구조를 이해하면 어떤 DB든 연결할 수 있어요.\n• sqlite:///./app.db (상대 경로 파일, 슬래시 3개)\n• mysql+pymysql://u:p@host:3306/db?charset=utf8mb4\n• postgresql+psycopg://u:p@host:5432/db\n• 비동기: postgresql+asyncpg://..., sqlite+aiosqlite:///... (비동기 토픽)',
    },
    {
      id: 'sa-01-05', type: 'ox', source: 'engine과 접속 URL',
      question: 'engine은 요청마다 새로 만들어야 커넥션이 섞이지 않는다.',
      answer: false,
      explanation: 'engine은 앱 전체에 하나만 만들어요. engine 안에 커넥션 풀이 있어서 연결을 재사용하는 게 핵심이에요. 요청마다 engine을 만들면 풀이 의미 없어지고 연결 비용이 커져요.\n요청마다 새로 만드는 건 세션(Session)이에요. "engine 1개 → 요청마다 세션"이 기본 구조예요.',
    },
    {
      id: 'sa-01-06', type: 'mcq', source: 'Base와 모델 클래스 (2.0 스타일)',
      question: '다음 모델에서 DB 컬럼이 NULL을 허용하는 것은?',
      code: `class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True)
    nickname: Mapped[str | None] = mapped_column(String(30))
    bio: Mapped[str] = mapped_column(Text, default="")`,
      choices: ['nickname', 'email', 'bio', 'id'],
      answer: 0,
      choiceExplanations: [
        '정답. Mapped[str | None]이라 NULL을 허용해요.',
        'Mapped[str]이라 NOT NULL이에요.',
        'Mapped[str]이라 NOT NULL이고, 값을 안 주면 파이썬 쪽 기본값 ""가 들어가요.',
        '기본 키는 항상 NOT NULL이에요.',
      ],
      explanation: '2.0 스타일에서는 타입 힌트가 NULL 여부를 정해요. Mapped[X] → NOT NULL, Mapped[X | None] → NULL 허용. mapped_column(nullable=...)로 직접 덮어쓸 수도 있어요.\nPydantic의 str | None과 같은 표기라 스키마와 모델을 맞추기 쉬워요.',
    },
    {
      id: 'sa-01-07', type: 'short', source: 'Base와 모델 클래스 (2.0 스타일)',
      question: '모델 클래스에서 실제 DB 테이블 이름을 지정하는 클래스 속성 이름은?',
      answer: ['__tablename__', 'tablename'],
      explanation: '__tablename__ = "posts"예요. 클래스 이름(Post, 단수)과 테이블 이름(posts, 복수)을 다르게 짓는 관례가 많아요. 팀에서 하나로 정해 일관되게 쓰면 돼요.',
    },
    {
      id: 'sa-01-08', type: 'mcq', source: 'Base와 모델 클래스 (2.0 스타일)',
      question: 'Pydantic 모델(PostRead)과 SQLAlchemy 모델(Post)의 역할 차이로 맞는 것은?',
      choices: ['둘은 같은 것이라 하나만 만들면 된다', 'Pydantic 모델이 DB 테이블을 만든다', 'SQLAlchemy 모델은 DB 테이블 구조, Pydantic 모델은 API 입출력 데이터의 검증·형식을 담당한다', 'SQLAlchemy 모델이 요청 본문을 검증한다'],
      answer: 2,
      choiceExplanations: [
        '역할이 달라서 보통 둘 다 만들어요.',
        '테이블은 SQLAlchemy 모델 + create_all/Alembic이 만들어요.',
        '정답. DB 구조(내부)와 API 계약(외부)을 분리하면 각각 독립적으로 바꿀 수 있어요.',
        '요청 검증은 Pydantic이에요.',
      ],
      explanation: '흐름: 요청 JSON → (Pydantic PostCreate로 검증) → Post(**data) SQLAlchemy 객체 → DB 저장 → Post 객체 → (Pydantic PostRead로 변환·필터링) → 응답 JSON.\nSQLModel이라는 라이브러리는 둘을 하나로 합치려는 시도인데, 입출력 모델은 여전히 따로 두는 게 권장돼요.',
    },
    {
      id: 'sa-01-09', type: 'mcq', source: '테이블 만들기와 마이그레이션',
      question: 'Post 모델에 summary 컬럼을 새로 추가하고 서버를 재시작했다. create_all을 쓰는데 DB에 컬럼이 생기지 않았다. 이유는?',
      choices: ['summary가 예약어라서', 'create_all은 이미 존재하는 테이블은 변경하지 않아서', 'echo가 꺼져 있어서', '서버를 두 번 재시작해야 해서'],
      answer: 1,
      choiceExplanations: [
        '예약어가 아니에요.',
        '정답. create_all은 "없는 테이블 만들기"만 해요. 컬럼 추가·변경은 마이그레이션 도구가 담당해요.',
        'echo는 로그 출력 옵션일 뿐이에요.',
        '몇 번을 재시작해도 같아요.',
      ],
      explanation: '스키마 변경 = 마이그레이션. Alembic으로 "users에 summary 컬럼 추가" 같은 변경 스크립트를 만들고 순서대로 적용해요.\n학습용 SQLite라면 db 파일을 지우고 다시 만들어도 되지만, 운영 데이터가 있는 DB에서는 절대 그렇게 하면 안 돼요.',
    },
    {
      id: 'sa-01-10', type: 'short', source: '테이블 만들기와 마이그레이션',
      question: 'SQLAlchemy와 함께 쓰는 대표적인 DB 마이그레이션(스키마 변경 이력 관리) 도구 이름은?',
      answer: ['alembic'],
      explanation: 'Alembic이에요(SQLAlchemy 제작자가 만듦).\n흐름: 모델 수정 → alembic revision --autogenerate -m "메시지" → 생성된 스크립트 검토 → alembic upgrade head.\nautogenerate는 완벽하지 않아서(컬럼 이름 변경을 삭제+추가로 인식하는 등) 생성된 파일을 꼭 읽어 봐야 해요.',
    },
    {
      id: 'sa-01-11', type: 'mcq', source: 'Base와 모델 클래스 (2.0 스타일)',
      question: 'created_at: Mapped[datetime] = mapped_column(server_default=func.now()) 의 의미는?',
      choices: ['INSERT 때 값을 안 주면 DB가 자신의 현재 시각(DEFAULT now())을 넣는다', '파이썬이 객체를 만들 때 현재 시각을 넣는다', '조회할 때마다 현재 시각으로 바뀐다', '수정할 때마다 갱신된다'],
      answer: 0,
      choiceExplanations: [
        '정답. 테이블 정의에 DEFAULT로 들어가서 DB가 값을 채워요.',
        '그건 default=datetime.now(파이썬 쪽 기본값)예요.',
        '저장된 값은 바뀌지 않아요.',
        '수정 시 갱신은 onupdate=func.now()를 따로 줘야 해요.',
      ],
      explanation: 'default(파이썬 측) vs server_default(DB 측):\n• default: SQLAlchemy가 INSERT문에 값을 넣어요. ORM으로 넣을 때만 적용.\n• server_default: 테이블 DDL에 DEFAULT가 들어가요. 다른 경로(직접 SQL, 다른 앱)로 넣어도 적용.\n서버 기본값을 쓰면 객체를 만든 직후에는 값이 없고, 커밋 후 새로 읽어야(refresh) 값이 보여요.',
    },
    {
      id: 'sa-01-12', type: 'ox', source: '드라이버 직접 사용 vs ORM',
      question: 'SQLAlchemy를 쓰더라도 필요하면 text("SELECT ...")로 원본 SQL을 실행할 수 있다.',
      answer: true,
      explanation: '맞아요. 복잡한 통계 쿼리나 DB 전용 기능은 원본 SQL이 더 명확할 때가 있어요. session.execute(text("SELECT ... WHERE id = :id"), {"id": 3}).\n이때도 값은 :이름 파라미터로 넘겨야 SQL 인젝션을 막을 수 있어요.',
    },
  ],
}

export default topic
