import type { Topic } from '../../types'

const topic: Topic = {
  id: 'sa-02-column-session',
  track: 'backend',
  group: 'SQLAlchemy',
  title: '컬럼 설정과 세션',
  order: 42,
  sections: [
    {
      title: '컬럼 옵션',
      points: [
        'primary_key=True: 기본 키. autoincrement는 정수 단일 기본 키면 자동이다.',
        'unique=True: 같은 값 중복 금지(UNIQUE 제약). index=True: 조회를 빠르게 하는 인덱스 생성. unique=True는 내부적으로 인덱스를 함께 만든다.',
        'nullable=False/True: NULL 허용 여부. 2.0 스타일에서는 Mapped[X] / Mapped[X | None]으로 정해지지만 명시적으로 덮어쓸 수 있다.',
        'default=값 또는 함수: 파이썬 쪽 기본값. server_default=text("0") 또는 func.now(): DB 쪽 기본값. onupdate=func.now(): UPDATE 시 자동 갱신.',
        '자료형: Integer, BigInteger, String(길이), Text, Boolean, DateTime(timezone=True), Date, Numeric(10, 2)(금액), JSON, Enum.',
      ],
      code: `from decimal import Decimal
from sqlalchemy import String, Numeric, Boolean, DateTime, func, text

class Product(Base):
    __tablename__ = "products"
    id: Mapped[int] = mapped_column(primary_key=True)
    sku: Mapped[str] = mapped_column(String(30), unique=True)
    name: Mapped[str] = mapped_column(String(100), index=True)
    price: Mapped[Decimal] = mapped_column(Numeric(10, 2))
    is_active: Mapped[bool] = mapped_column(Boolean, server_default=text("true"))
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )`,
    },
    {
      title: '외래 키와 제약 조건',
      points: [
        'ForeignKey("users.id")는 "이 컬럼 값은 users 테이블의 id에 반드시 존재해야 한다"는 참조 무결성 제약이다. author_id: Mapped[int] = mapped_column(ForeignKey("users.id")).',
        'ondelete="CASCADE": 부모(사용자)가 삭제되면 자식(글)도 DB가 함께 삭제. ondelete="SET NULL": 자식의 FK를 NULL로. 기본은 부모 삭제를 막는다(RESTRICT/NO ACTION).',
        '여러 컬럼에 걸친 제약은 __table_args__ 에 넣는다. UniqueConstraint("user_id", "post_id")는 "한 사용자는 한 글에 좋아요 1번"을 DB 수준에서 보장한다. CheckConstraint("price >= 0")는 값 범위를 보장한다.',
        '앱 코드 검증만으로는 동시 요청이나 다른 경로의 입력을 막을 수 없다. 제약은 DB가 지키는 마지막 방어선이다.',
      ],
      code: `from sqlalchemy import ForeignKey, UniqueConstraint, CheckConstraint

class Like(Base):
    __tablename__ = "likes"
    __table_args__ = (UniqueConstraint("user_id", "post_id", name="uq_like_user_post"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    post_id: Mapped[int] = mapped_column(ForeignKey("posts.id", ondelete="CASCADE"))`,
    },
    {
      title: '세션이란',
      points: [
        'Session은 DB와 대화하는 작업 단위다. ① 객체 변경을 모아 두었다가(add, 속성 변경) ② flush 때 SQL로 보내고 ③ commit 때 트랜잭션을 확정한다.',
        '세션은 "Identity Map"을 가진다. 같은 세션에서 같은 기본 키를 두 번 조회하면 같은 파이썬 객체가 돌아온다. 두 번째는 DB에 묻지 않을 수도 있다.',
        '세션은 가볍게 만들고 짧게 쓴다. 웹에서는 "요청 1개 = 세션 1개"가 원칙이다. 전역 세션 하나를 여러 요청이 공유하면 트랜잭션이 섞이고 스레드 안전하지 않다.',
        'sessionmaker(engine)로 세션 공장을 만들고, 요청마다 SessionLocal()로 세션을 만든다. with Session(engine) as session: 처럼 with 문을 쓰면 블록이 끝날 때 자동으로 닫힌다.',
      ],
      code: `from sqlalchemy.orm import sessionmaker, Session

SessionLocal = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)

def get_db():
    with SessionLocal() as db:     # 블록 끝에서 close
        yield db

SessionDep = Annotated[Session, Depends(get_db)]`,
    },
    {
      title: '객체 상태와 flush · commit · refresh',
      points: [
        '객체 상태: transient(그냥 만든 객체) → pending(add 후, 아직 SQL 안 보냄) → persistent(flush 후, DB에 행이 있음) → detached(세션이 닫힘).',
        'flush: 모아 둔 변경을 SQL(INSERT/UPDATE)로 보내지만 트랜잭션은 열린 상태. 자동 증가 id가 이때 채워진다. commit 전에 id가 필요하면 db.flush().',
        'commit: 트랜잭션 확정. 다른 세션(다른 요청)에서도 보이게 된다. 기본 설정(expire_on_commit=True)에서는 commit 후 객체 속성이 만료되어 다음 접근 때 다시 SELECT 한다.',
        'refresh(obj): DB에서 최신 값을 다시 읽는다. server_default로 DB가 채운 값(created_at)을 응답에 넣으려면 commit 후 refresh 한다.',
        'rollback: 트랜잭션의 변경을 모두 취소한다. 에러 후에는 반드시 rollback해야 세션을 다시 쓸 수 있다.',
      ],
      code: `post = Post(title="hi", content="...")   # transient
db.add(post)                              # pending
db.flush()                                # INSERT 실행, post.id 채워짐
print(post.id)
db.commit()                               # 트랜잭션 확정
db.refresh(post)                          # created_at 등 DB 값 다시 읽기`,
    },
  ],
  questions: [
    {
      id: 'sa-02-01', type: 'mcq', source: '컬럼 옵션',
      question: '이메일은 중복 가입을 막아야 하고 로그인 때 자주 조회된다. 알맞은 컬럼 설정은?',
      choices: ['mapped_column(String(255))', 'mapped_column(String(255), primary_key=True)', 'mapped_column(String(255), unique=True)', 'mapped_column(Text, index=False)'],
      answer: 2,
      choiceExplanations: [
        '중복을 막지 못하고 조회도 느려요.',
        '이메일을 기본 키로 쓰면 이메일 변경이 어렵고, 다른 테이블의 FK도 모두 바꿔야 해요(DB 설계의 "부적절한 키").',
        '정답. UNIQUE 제약이 중복을 막고, 그 제약을 위한 인덱스가 함께 생겨 조회도 빨라요.',
        '인덱스가 없어 로그인마다 전체 스캔해요.',
      ],
      explanation: 'unique=True만으로 인덱스가 생기니 index=True를 따로 줄 필요는 없어요.\n기본 키는 바뀌지 않는 값(보통 정수 id)으로 두고, 이메일처럼 업무상 고유하지만 바뀔 수 있는 값은 UNIQUE로 따로 지켜요(대리 키 토픽).',
    },
    {
      id: 'sa-02-02', type: 'mcq', source: '컬럼 옵션',
      question: '상품 가격(원 단위, 소수점 둘째 자리까지)을 저장할 자료형으로 가장 알맞은 것은?',
      choices: ['Float', 'String(20)', 'Boolean', 'Numeric(10, 2)'],
      answer: 3,
      choiceExplanations: [
        'Float은 이진 부동소수점이라 0.1 + 0.2 = 0.30000000000000004 같은 오차가 생겨요. 돈 계산에 쓰면 안 돼요.',
        '문자열이면 합계·정렬·비교가 이상해져요.',
        '참/거짓 값이에요.',
        '정답. 정확한 십진수(DECIMAL)로 저장되고, 파이썬에서는 Decimal로 다뤄요.',
      ],
      explanation: '돈 = Numeric/DECIMAL(또는 최소 단위 정수, 예: 원·센트를 정수로). 절대 Float를 쓰지 않아요.\nPydantic 쪽 스키마도 price: Decimal로 맞추면 끝까지 정확하게 계산돼요.',
    },
    {
      id: 'sa-02-03', type: 'short', source: '컬럼 옵션',
      question: '행을 UPDATE 할 때마다 updated_at을 자동으로 현재 시각으로 바꾸려면 mapped_column에 어떤 옵션을 주나요? (옵션 이름만)',
      answer: ['onupdate', 'onupdate=func.now()'],
      explanation: 'onupdate=func.now()예요. ORM을 통한 UPDATE 때 SQLAlchemy가 값을 넣어 줘요.\nDB가 직접 갱신하게 하려면 MySQL의 ON UPDATE CURRENT_TIMESTAMP나 PostgreSQL 트리거를 써요(server_onupdate는 "DB가 갱신한다"는 표시일 뿐 직접 만들지 않아요).',
    },
    {
      id: 'sa-02-04', type: 'mcq', source: '외래 키와 제약 조건',
      question: '"한 사용자는 같은 글에 좋아요를 한 번만" 규칙을 가장 확실하게 지키는 방법은?',
      choices: ['좋아요 API에서 먼저 조회해 있으면 거절한다', 'likes 테이블에 UniqueConstraint("user_id", "post_id")를 건다', '프론트에서 버튼을 비활성화한다', 'likes 테이블에 인덱스를 지운다'],
      answer: 1,
      choiceExplanations: [
        '동시에 두 요청이 오면 둘 다 "없음"을 보고 둘 다 저장할 수 있어요(경쟁 조건).',
        '정답. DB가 어떤 경로의 입력이든 중복을 거절해요. 앱은 IntegrityError를 잡아 409로 바꾸면 돼요.',
        '빠른 연속 클릭이나 API 직접 호출을 막을 수 없어요.',
        '관계없어요.',
      ],
      explanation: '앱 검사는 "친절한 에러 메시지"용, DB 제약은 "정합성 보장"용이에요. 둘 다 두는 게 좋아요.\n노션 알고리즘 노트의 "(reporter_id, target_id) UNIQUE" 문제와 같은 원리예요.',
    },
    {
      id: 'sa-02-05', type: 'mcq', source: '외래 키와 제약 조건',
      question: 'posts.author_id = ForeignKey("users.id", ondelete="CASCADE")일 때 사용자를 삭제하면?',
      choices: ['삭제가 거부된다', '글의 author_id가 NULL이 된다', '그 사용자의 글도 DB가 함께 삭제한다', '아무 일도 없다'],
      answer: 2,
      choiceExplanations: [
        '그건 기본(RESTRICT/NO ACTION) 동작이에요.',
        '그건 ondelete="SET NULL"이에요.',
        '정답. 부모 행 삭제가 자식 행으로 이어져요.',
        'FK 동작이 지정돼 있어요.',
      ],
      explanation: '어떤 ondelete를 고를지는 업무 규칙이에요.\n• 댓글·좋아요처럼 부모 없이 의미 없는 데이터 → CASCADE\n• 주문처럼 기록으로 남아야 하는 데이터 → RESTRICT(또는 사용자를 지우지 않고 탈퇴 상태로 표시)\n• 담당자가 바뀔 수 있는 데이터 → SET NULL\nSQLite는 PRAGMA foreign_keys=ON을 켜야 FK가 실제로 동작해요.',
    },
    {
      id: 'sa-02-06', type: 'ox', source: '세션이란',
      question: '웹 서버에서는 모든 요청이 전역 세션 하나를 공유하는 것이 커넥션을 아끼는 좋은 방법이다.',
      answer: false,
      explanation: '아니에요. 세션은 트랜잭션 상태를 들고 있어서, 공유하면 한 요청의 rollback이 다른 요청의 변경까지 취소하는 등 데이터가 섞여요. 스레드 안전하지도 않아요.\n커넥션을 아끼는 건 engine의 커넥션 풀이 해요. 세션은 요청마다 만들고 닫아요.',
    },
    {
      id: 'sa-02-07', type: 'mcq', source: '세션이란',
      question: '같은 세션에서 아래를 실행했다. a is b 의 결과는?',
      code: `a = db.get(User, 1)
b = db.get(User, 1)
print(a is b)`,
      choices: ['True', 'False', '에러', 'None'],
      answer: 0,
      choiceExplanations: [
        '정답. 세션의 Identity Map 덕분에 같은 기본 키는 같은 객체예요. 두 번째 get은 DB에 묻지 않고 바로 돌려줘요.',
        '같은 세션이라 같은 객체예요. 다른 세션이었다면 False예요.',
        '정상 동작이에요.',
        '객체가 돌아와요.',
      ],
      explanation: 'Identity Map = "세션 안에서 기본 키 하나당 객체 하나". 한 요청 안에서 같은 사용자를 여러 곳에서 읽어도 같은 객체를 수정하게 돼 일관성이 지켜져요.\n대신 다른 요청이 그사이 DB를 바꿔도 이 세션의 객체에는 바로 반영되지 않을 수 있어요. 필요하면 refresh나 populate_existing을 써요.',
    },
    {
      id: 'sa-02-08', type: 'short', source: '객체 상태와 flush · commit · refresh',
      question: '트랜잭션을 확정하지 않고 지금까지 모아 둔 변경을 SQL로 DB에 보내, 자동 증가 id를 미리 얻게 해 주는 세션 메서드는?',
      answer: ['flush', 'flush()', 'db.flush()', 'session.flush()'],
      explanation: 'flush()예요. INSERT가 실행돼 post.id가 채워지지만 아직 commit 전이라 rollback하면 취소돼요.\n예: 주문을 만들고 그 id로 주문 항목을 만들어야 할 때 db.add(order); db.flush(); 그다음 OrderItem(order_id=order.id). (relationship을 쓰면 flush 없이도 SQLAlchemy가 순서를 알아서 처리해 줘요.)',
    },
    {
      id: 'sa-02-09', type: 'mcq', source: '객체 상태와 flush · commit · refresh',
      question: 'created_at이 server_default=func.now()인 글을 만들고 commit 후 바로 응답했다. 응답의 created_at을 정확히 얻으려면?',
      choices: ['아무것도 안 해도 객체에 이미 있다', 'datetime.now()로 직접 넣는다', 'commit 후 db.refresh(post)로 DB 값을 다시 읽는다', 'flush만 한다'],
      answer: 2,
      choiceExplanations: [
        'DB가 채운 값은 파이썬 객체가 모르는 상태예요. (expire_on_commit=True라면 접근 시 자동으로 다시 읽기는 해요.)',
        'DB 시각과 서버 시각이 다를 수 있고, server_default를 둔 의미가 없어져요.',
        '정답. refresh는 해당 행을 SELECT해서 DB가 채운 기본값까지 객체에 반영해요.',
        'flush만으로는 DB 기본값이 객체에 들어오지 않아요.',
      ],
      explanation: 'FastAPI 생성 API의 정석 순서: db.add(obj) → db.commit() → db.refresh(obj) → return obj.\nPostgreSQL에서는 INSERT ... RETURNING으로 한 번에 받아오도록 eager_defaults 설정을 쓰기도 해요.',
    },
    {
      id: 'sa-02-10', type: 'mcq', source: '객체 상태와 flush · commit · refresh',
      question: 'commit 중 IntegrityError가 났다. 같은 세션으로 다른 쿼리를 계속하려면 먼저 무엇을 해야 할까?',
      choices: ['db.rollback()을 한다', 'db.commit()을 다시 한다', 'db.flush()를 한다', '아무것도 안 해도 된다'],
      answer: 0,
      choiceExplanations: [
        '정답. rollback으로 실패한 트랜잭션을 정리해야 세션을 다시 쓸 수 있어요.',
        '실패한 트랜잭션 상태라 다시 커밋할 수 없어요.',
        'flush도 실패 상태에서는 에러가 나요.',
        '"This Session\'s transaction has been rolled back due to a previous exception during flush" 같은 에러가 나요.',
      ],
      explanation: '에러 처리 패턴:\ntry:\n    db.commit()\nexcept IntegrityError:\n    db.rollback()\n    raise HTTPException(409, "이미 존재합니다")\nyield 의존성의 except에서 rollback을 해 두면 라우트마다 쓰지 않아도 돼요.',
    },
    {
      id: 'sa-02-11', type: 'ox', source: '객체 상태와 flush · commit · refresh',
      question: '기본 설정(expire_on_commit=True)에서는 commit 후 객체 속성에 접근하면 SQLAlchemy가 DB에서 값을 다시 읽어 온다.',
      answer: true,
      explanation: '맞아요. commit 후 모든 객체가 만료(expire)되고, 속성에 접근할 때 자동으로 SELECT해요. 다른 트랜잭션의 변경을 반영하기 위한 안전장치예요.\n그런데 세션이 이미 닫혔다면 다시 읽을 수 없어 DetachedInstanceError가 나고, 비동기 세션에서는 이 자동 로딩이 에러가 돼요. 그래서 FastAPI에서는 sessionmaker(expire_on_commit=False)를 자주 써요.',
    },
    {
      id: 'sa-02-12', type: 'mcq', source: '세션이란',
      question: 'with SessionLocal() as db: 블록의 장점은?',
      choices: ['자동으로 commit된다', '세션을 여러 요청이 공유하게 된다', '블록이 끝나면(에러가 나도) 세션이 닫힌다', 'SQL 로그가 켜진다'],
      answer: 2,
      choiceExplanations: [
        'with Session()은 close만 보장해요. commit은 직접 해야 해요. (with session.begin(): 블록은 성공 시 commit, 에러 시 rollback을 해 줘요.)',
        '공유하지 않아요.',
        '정답. 커넥션이 풀로 반납돼요.',
        '로그는 echo 설정이에요.',
      ],
      explanation: '두 가지 with를 구분하세요.\n• with Session(engine) as s: → 끝나면 close\n• with s.begin(): → 끝나면 commit, 예외면 rollback\n둘을 합친 with Session(engine) as s, s.begin(): 도 자주 써요.',
    },
  ],
}

export default topic
