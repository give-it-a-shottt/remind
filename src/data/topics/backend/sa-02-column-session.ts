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
      slides: [
        {
          title: 'mapped_column에 붙이는 옵션',
          blocks: [
            { type: 'code', code: `from decimal import Decimal
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
    )` },
            {
              type: 'table',
              head: ['옵션', '뜻'],
              rows: [
                ['`unique=True`', '중복 금지 (내부적으로 **인덱스도** 만듦)'],
                ['`index=True`', '조회를 빠르게 하는 인덱스'],
                ['`nullable=`', 'NULL 허용 여부 (Mapped로 정해지지만 덮어쓸 수 있음)'],
                ['`default=`', '**파이썬 쪽** 기본값'],
                ['`server_default=`', '**DB 쪽** 기본값'],
                ['`onupdate=func.now()`', 'UPDATE 때마다 **자동 갱신**'],
              ],
            },
          ],
        },
        {
          title: '자료형 고르기',
          blocks: [
            { type: 'say', text: 'SQL 수업의 자료형이 SQLAlchemy 이름으로 바뀌었을 뿐이에요.\n`Integer`, `BigInteger`, `String(길이)`, `Text`, `Boolean`, `DateTime(timezone=True)`, `Date`, **`Numeric(10, 2)`**(금액), `JSON`, `Enum`.' },
            { type: 'ask', q: '이메일은 중복 가입을 막아야 하고 로그인 때 자주 조회돼요. 어떤 옵션을 줄까요?', a: '`unique=True` 하나면 돼요. UNIQUE 제약이 중복을 막고, 내부적으로 인덱스도 만들어져서 조회도 빨라요. `index=True`를 또 줄 필요는 없어요.' },
          ],
        },
      ],
    },
    {
      title: '외래 키와 제약 조건',
      slides: [
        {
          title: 'ForeignKey와 ondelete',
          blocks: [
            { type: 'code', code: `author_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))` },
            { type: 'say', text: '`ForeignKey("users.id")`는 "이 값은 **users.id에 반드시 있어야** 한다"는 참조 무결성 제약이에요. 테이블 이름.컬럼 이름으로 적어요(클래스 이름이 아니라).\n• `ondelete="CASCADE"` → 사용자 삭제 시 **글도 DB가 함께** 삭제\n• `ondelete="SET NULL"` → 글의 author_id를 NULL로\n• 기본 → 글이 남아 있으면 사용자 삭제를 **막음**' },
          ],
        },
        {
          title: '여러 컬럼에 걸친 제약',
          blocks: [
            { type: 'code', code: `from sqlalchemy import ForeignKey, UniqueConstraint, CheckConstraint

class Like(Base):
    __tablename__ = "likes"
    __table_args__ = (UniqueConstraint("user_id", "post_id", name="uq_like_user_post"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    post_id: Mapped[int] = mapped_column(ForeignKey("posts.id", ondelete="CASCADE"))` },
            { type: 'say', text: '"한 사용자는 한 글에 좋아요 **한 번만**"은 `(user_id, post_id)` **조합**이 유일해야 한다는 규칙이에요. 여러 컬럼에 걸친 제약은 `__table_args__`에 넣어요. `CheckConstraint("price >= 0")`도 여기에요.' },
            { type: 'note', tone: 'warn', text: '앱 코드에서 "이미 눌렀나?" 확인만으로는 부족해요. 두 요청이 **동시에** 확인하면 둘 다 "아직 안 눌렀네"를 보고 둘 다 저장하거든요. **DB 제약이 마지막 방어선**이에요.' },
          ],
        },
      ],
    },
    {
      title: '세션이란',
      slides: [
        {
          title: 'DB와 대화하는 작업 단위',
          blocks: [
            { type: 'say', text: '**Session**은 DB와 대화하는 작업 단위예요. 세 단계로 일해요.\n① 객체 변경을 **모아 두었다가** (add, 속성 변경)\n② **flush** 때 SQL로 보내고\n③ **commit** 때 트랜잭션을 확정해요.' },
            { type: 'note', tone: 'analogy', text: '세션은 **장바구니**예요. 담기(add)만 해서는 아직 결제가 안 됐어요. 결제 버튼(commit)을 눌러야 주문이 확정되고 다른 사람(다른 요청)도 그 주문을 볼 수 있어요.' },
            { type: 'say', text: '세션은 **Identity Map**을 가져요. 같은 세션에서 같은 기본 키를 두 번 조회하면 **같은 파이썬 객체**가 돌아와요(`a is b`가 True). 두 번째는 DB에 묻지도 않을 수 있어요.' },
          ],
        },
        {
          title: '요청 1개 = 세션 1개',
          blocks: [
            { type: 'code', code: `from sqlalchemy.orm import sessionmaker, Session

SessionLocal = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)

def get_db():
    with SessionLocal() as db:     # 블록 끝에서 자동 close
        yield db

SessionDep = Annotated[Session, Depends(get_db)]` },
            { type: 'say', text: '세션은 **가볍게 만들고 짧게** 써요. 웹에서는 **요청 1개 = 세션 1개**가 원칙이에요. 전역 세션 하나를 모든 요청이 공유하면 트랜잭션이 섞이고 스레드 안전하지도 않아요.\n\n`sessionmaker`로 세션 **공장**을 만들고, 요청마다 하나씩 찍어 내요. `with`를 쓰면 블록이 끝날 때(에러가 나도) **자동으로 닫혀서** 커넥션이 반납돼요. FastAPI 수업의 yield 의존성과 그대로 이어지죠.' },
          ],
        },
      ],
    },
    {
      title: '객체 상태와 flush · commit · refresh',
      slides: [
        {
          title: '객체의 네 가지 상태',
          blocks: [
            { type: 'code', code: `post = Post(title="hi", content="...")   # transient  (그냥 만든 객체)
db.add(post)                              # pending    (세션에 올림, SQL 아직)
db.flush()                                # persistent (INSERT 실행, post.id 채워짐)
print(post.id)
db.commit()                               # 트랜잭션 확정
db.refresh(post)                          # created_at 등 DB 값 다시 읽기
db.close()                                # detached   (세션과 분리)` },
            {
              type: 'table',
              head: ['메서드', '하는 일'],
              rows: [
                ['`flush()`', '변경을 SQL로 **보내지만** 트랜잭션은 열린 채. 자동 증가 **id가 이때 채워짐**'],
                ['`commit()`', '트랜잭션 **확정**. 다른 세션에서도 보임'],
                ['`refresh(obj)`', 'DB에서 **최신 값을 다시 읽음**'],
                ['`rollback()`', '트랜잭션 변경을 **모두 취소**'],
              ],
            },
          ],
        },
        {
          title: '자주 쓰는 장면',
          blocks: [
            { type: 'say', text: '**commit 전에 id가 필요하면** `flush()`. 주문을 만들고 그 id로 주문 항목을 넣을 때처럼요.\n\n**DB가 채운 값을 응답에 넣으려면** commit 후 `refresh()`. `server_default=func.now()`인 created_at은 DB가 정한 값이라, 파이썬 객체는 아직 모르거든요.\n\n**에러 후에는 반드시** `rollback()`. IntegrityError가 난 세션은 "실패한 트랜잭션" 상태라, rollback 하기 전엔 다른 쿼리를 못 해요.' },
            { type: 'note', tone: 'tip', text: '기본 설정(`expire_on_commit=True`)에서는 commit 후 객체 속성이 **만료**돼서, 다음에 `post.title`에 접근하면 SQLAlchemy가 DB에서 **다시 읽어 와요.** 위 sessionmaker는 이걸 False로 꺼서 commit 후에도 값을 그대로 쓰게 했어요.' },
          ],
        },
      ],
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
