import type { Topic } from '../../types'

const topic: Topic = {
  id: 'sa-03-insert',
  track: 'backend',
  group: 'SQLAlchemy',
  title: 'SQLAlchemy 입력(INSERT)',
  order: 43,
  sections: [
    {
      title: '객체 하나 저장하기',
      notionIds: ['3efdf951bf8081c88fdcc74323cc24b7'],
      slides: [
        {
          title: '만들고, 담고, 확정하기',
          blocks: [
            { type: 'code', code: `with SessionLocal() as db:
    post = Post(title="첫 글", content="안녕하세요")
    db.add(post)
    db.commit()
    print(post.id)     # 1   (commit 후 채워짐)

# echo=True 로그
# INSERT INTO posts (title, content) VALUES (?, ?)  ('첫 글', '안녕하세요')
# COMMIT` },
            { type: 'say', text: '순서는 **객체 생성 → `add` → `commit`** 이에요. `add`만 하면 아직 장바구니에 담긴 상태라, **commit을 빼먹으면** 세션이 닫힐 때 그냥 사라지고 다른 요청에서는 그 글이 안 보여요.\n\nid는 보통 지정하지 않아요. 자동 증가라 INSERT 후 DB가 정한 값이 `post.id`에 채워져요.' },
            { type: 'say', text: 'pymysql로 `execute("INSERT ... VALUES (%s, %s)", (값,))` 하던 걸 떠올려 보세요. ORM은 SQL 문자열과 **파라미터 바인딩을 대신** 만들어 줘요. 그래서 상품명에 작은따옴표(`\'`)가 있어도 문법 에러가 안 나고, SQL 인젝션도 막혀요.' },
          ],
        },
      ],
    },
    {
      title: 'FastAPI 생성 API의 정석',
      slides: [
        {
          title: '네 단계 공식',
          blocks: [
            { type: 'code', code: `@router.post("/", response_model=PostRead, status_code=201)
def create_post(post_in: PostCreate, db: SessionDep, user: CurrentUser):
    post = Post(**post_in.model_dump(), author_id=user.id)   # ② dict → ORM 객체
    db.add(post)                                              # ③ add
    db.commit()                                               #   commit
    db.refresh(post)                                          #   refresh
    return post                                               # ④ 응답 모델로` },
            { type: 'list', ordered: true, items: ['Pydantic 입력 모델로 **검증된 값**을 받고', '`model_dump()`로 dict를 만들어 **ORM 객체**를 만들고', '**add → commit → refresh**', '**응답 모델**로 돌려줘요'] },
            { type: 'note', tone: 'warn', text: '작성자(author_id)처럼 **서버가 정하는 값**은 요청 본문에서 받지 않아요. 본문으로 받으면 남의 이름으로 글을 쓸 수 있어요. **로그인 의존성**(`CurrentUser`)에서 가져와 넣어요.' },
          ],
        },
        {
          title: '그대로 저장하면 안 되는 값',
          blocks: [
            { type: 'code', code: `# ❌ TypeError: 'password' is an invalid keyword argument for User
user = User(**user_in.model_dump())

# ✅ 비밀번호는 해시로 바꿔 다른 필드에, 원래 필드는 빼기
data = user_in.model_dump(exclude={"password"})
user = User(**data, hashed_password=hash_pw(user_in.password))` },
            { type: 'say', text: '입력 모델에는 `password`가 있지만 DB 모델에는 `hashed_password`만 있어요. 그래서 그대로 풀어 넣으면 "그런 인자 없어요" 에러가 나요. **변환이 필요한 값은 빼고**(`exclude`), 변환한 값을 다른 이름으로 넣어요. 비밀번호를 평문으로 저장하지 않는 건 인증 수업에서 자세히 봐요.' },
          ],
        },
      ],
    },
    {
      title: '여러 개 한 번에 넣기',
      slides: [
        {
          title: 'commit은 반복문 밖에서',
          blocks: [
            { type: 'code', code: `# 😣 5,000번 commit → 5,000번 트랜잭션
for item in items:
    db.add(Product(**item))
    db.commit()

# 😊 한 번에
db.add_all([Product(**item) for item in items])
db.commit()` },
            { type: 'say', text: '`commit`을 반복문 **안에서** 하면 행마다 트랜잭션이 생겨서 **엄청 느려요.** 크롤링 데이터를 저장하던 코드를 묶음 commit으로 바꾸기만 해도 속도가 확 좋아져요.' },
          ],
        },
        {
          title: '대량은 bulk insert',
          blocks: [
            { type: 'code', code: `from sqlalchemy import insert

rows = [{"title": f"글 {i}", "content": "..."} for i in range(10_000)]

db.execute(insert(Post), rows)   # ORM bulk insert (executemany)
db.commit()` },
            { type: 'say', text: '수천~수만 행이면 ORM **객체를 만드는 것 자체**가 부담이에요. dict 리스트를 `execute(insert(모델), rows)`로 넘기면 훨씬 빨라요.' },
            { type: 'note', tone: 'warn', text: '하나의 commit으로 1,000개를 넣다가 500번째에서 UNIQUE 위반이 나면, 트랜잭션은 "전부 아니면 전무"라 **앞의 499개도 함께 롤백**돼요. 그게 싫다면 일정 개수씩 나눠 commit해요.' },
          ],
        },
      ],
    },
    {
      title: '관계를 통한 저장과 중복 처리',
      slides: [
        {
          title: '부모만 add 해도 자식까지',
          blocks: [
            { type: 'code', code: `order = Order(user_id=user.id)
order.items.append(OrderItem(product_id=1, quantity=2))
order.items.append(OrderItem(product_id=5, quantity=1))
db.add(order)        # 주문만 add
db.commit()          # → 주문 INSERT, 항목 INSERT 2번 (order_id 는 자동으로 채워짐)` },
            { type: 'say', text: '`relationship`이 설정돼 있으면(다음 수업들에서 자세히), 부모 객체에 자식을 붙이고 **부모만 add** 해도 함께 저장돼요. 순서도 알아서 맞춰서 주문을 먼저 INSERT하고, 그 id를 항목의 FK에 채워 넣어요.' },
          ],
        },
        {
          title: '중복은 IntegrityError로',
          blocks: [
            { type: 'code', code: `from sqlalchemy.exc import IntegrityError

user = User(email=data.email, hashed_password=hash_pw(data.password))
db.add(user)
try:
    db.commit()
except IntegrityError:
    db.rollback()
    raise HTTPException(409, "이미 가입된 이메일입니다")` },
            { type: 'say', text: 'UNIQUE 제약 위반은 commit(또는 flush) 순간 **`IntegrityError`** 로 나타나요. 잡아서 **rollback 후 409**로 바꿔요. FastAPI 수업에서 말한 "예상 가능한 실패는 500이 아니라 알맞은 4xx로"를 실제로 하는 장면이에요.\n\n"먼저 조회해서 있으면 409"만 하면 동시 가입 두 건이 **둘 다 조회를 통과**할 수 있어요. 조회는 친절한 안내용, **DB 제약 + IntegrityError 처리**가 진짜 방어예요.' },
            { type: 'note', tone: 'tip', text: '"있으면 수정, 없으면 생성"(**upsert**)도 조회 후 분기는 동시성에 약해요. PostgreSQL `insert(...).on_conflict_do_update()`, MySQL `on_duplicate_key_update()`로 **DB가 한 번에** 처리하게 하는 게 안전해요.' },
          ],
        },
      ],
    },
  ],
  questions: [
    {
      id: 'sa-03-01', type: 'mcq', source: '객체 하나 저장하기',
      question: '다음 코드를 실행한 뒤 다른 요청(다른 세션)에서 이 글을 조회할 수 있을까?',
      code: `db = SessionLocal()
db.add(Post(title="hi", content="..."))
db.close()`,
      choices: ['조회된다', '조회되지만 title이 비어 있다', '에러가 나서 실행되지 않는다', '조회되지 않는다. commit하지 않아서 트랜잭션이 확정되지 않았다'],
      answer: 3,
      choiceExplanations: [
        'add는 세션에 "저장 예정"으로 올려 둔 것뿐이에요.',
        '행 자체가 없어요.',
        '에러 없이 조용히 사라져요. 그래서 더 찾기 어려운 버그예요.',
        '정답. commit 없이 close하면 변경이 버려져요(롤백).',
      ],
      explanation: '"저장했는데 DB에 없어요"의 1순위 원인이 commit 누락이에요. echo=True 로그에서 INSERT 뒤에 COMMIT이 찍혔는지 확인하세요. ROLLBACK이 찍혔다면 커밋 전에 세션이 닫힌 거예요.',
    },
    {
      id: 'sa-03-02', type: 'short', source: '객체 하나 저장하기',
      question: '모델 객체를 세션에 올려 저장 대상으로 만드는 세션 메서드 이름은? (커밋 전 단계)',
      answer: ['add', 'add()', 'db.add', 'session.add'],
      explanation: 'session.add(obj)예요. 여러 개는 add_all([...]).\n순서 암기: add(올리기) → flush(SQL 보내기, 자동으로도 일어남) → commit(확정) → refresh(DB 값 다시 읽기, 필요할 때).',
    },
    {
      id: 'sa-03-03', type: 'mcq', source: 'FastAPI 생성 API의 정석',
      question: '글 작성 API에서 작성자(author_id)를 어디서 가져와야 할까?',
      choices: ['요청 본문의 author_id 필드', '로그인 사용자를 주는 의존성(CurrentUser)의 user.id', '쿼리 파라미터 ?author_id=', '가장 최근 가입한 사용자'],
      answer: 1,
      choiceExplanations: [
        '본문으로 받으면 다른 사람 이름으로 글을 쓸 수 있어요.',
        '정답. 서버가 인증으로 확인한 값만 믿어요.',
        '쿼리도 클라이언트가 마음대로 바꿀 수 있어요.',
        '말이 안 되는 방법이에요.',
      ],
      explanation: '원칙: 권한·소유와 관련된 값은 클라이언트에게 받지 않고 서버가 정한다. 입력 모델(PostCreate)에 author_id 필드가 아예 없어야 해요.\nPost(**post_in.model_dump(), author_id=user.id) 처럼 서버 값을 따로 넣어요.',
    },
    {
      id: 'sa-03-04', type: 'mcq', source: 'FastAPI 생성 API의 정석',
      question: '회원가입에서 Post(**data.model_dump())처럼 User(**user_in.model_dump())를 했더니 TypeError: \'password\' is an invalid keyword argument for User 가 났다. 원인과 해결은?',
      choices: ['User 모델에 password 컬럼이 없고 hashed_password만 있어서 → password를 빼고 해시해서 hashed_password로 넣는다', 'Pydantic 버전 문제 → 버전을 올린다', 'commit을 안 해서', 'email이 중복이라서'],
      answer: 0,
      choiceExplanations: [
        '정답. User(**user_in.model_dump(exclude={"password"}), hashed_password=hash_password(user_in.password)).',
        '버전과 관계없어요. 필드 이름이 맞지 않는 문제예요.',
        '객체를 만드는 단계에서 이미 에러가 났어요.',
        '중복은 commit 때 IntegrityError로 나요.',
      ],
      explanation: '입력 모델과 DB 모델의 필드는 일부러 달라요. 비밀번호 원문은 DB에 절대 저장하지 않고 해시만 저장해요.\nSQLAlchemy 모델 생성자는 정의된 컬럼·관계 이름만 키워드로 받아서, 모르는 키가 오면 TypeError를 내요.',
    },
    {
      id: 'sa-03-05', type: 'mcq', source: '여러 개 한 번에 넣기',
      question: '크롤링한 상품 5,000개를 저장하는 코드다. 가장 큰 성능 문제는?',
      code: `for item in items:
    db.add(Product(name=item["name"], price=item["price"]))
    db.commit()`,
      choices: ['add를 써서', 'Product 이름이 길어서', 'price가 숫자라서', '반복마다 commit해서 5,000번의 트랜잭션(디스크 동기화)이 생겨서'],
      answer: 3,
      choiceExplanations: [
        'add 자체는 메모리 작업이라 가벼워요.',
        '관계없어요.',
        '관계없어요.',
        '정답. commit은 DB가 디스크에 확정 기록하는 비싼 작업이에요. 반복 밖에서 한 번만 하세요.',
      ],
      explanation: '개선: add_all 후 commit 1번 → 더 많으면 db.execute(insert(Product), rows) 후 commit.\n너무 커서 한 트랜잭션에 넣기 부담되면 1,000개씩 나눠 commit해요. "commit 횟수 = 트랜잭션 횟수 = 디스크 동기화 횟수"로 생각하면 돼요.',
    },
    {
      id: 'sa-03-06', type: 'short', source: '여러 개 한 번에 넣기',
      question: '모델 객체 여러 개를 한 번에 세션에 올리는 메서드는? session.______([p1, p2, p3])',
      answer: ['add_all'],
      explanation: 'add_all이에요. 그다음 commit 한 번이면 돼요.\n더 큰 규모에서는 객체를 만들지 않고 insert(Model)에 dict 리스트를 넘기는 방식이 빨라요. 객체 생성·상태 추적 비용이 없기 때문이에요.',
    },
    {
      id: 'sa-03-07', type: 'ox', source: '여러 개 한 번에 넣기',
      question: '하나의 commit으로 1,000개를 넣다가 500번째에서 UNIQUE 위반이 나면, 기본적으로 앞의 499개도 함께 롤백된다.',
      answer: true,
      explanation: '맞아요. 트랜잭션은 "전부 아니면 전무(원자성)"예요. 실패하면 rollback해야 하고, 그 트랜잭션의 모든 변경이 취소돼요.\n일부 성공을 허용하려면 나눠서 commit하거나, 중복을 무시하는 INSERT(PostgreSQL ON CONFLICT DO NOTHING, MySQL INSERT IGNORE)를 써요.',
    },
    {
      id: 'sa-03-08', type: 'mcq', source: '관계를 통한 저장과 중복 처리',
      question: '주문과 주문 항목을 함께 저장한다. relationship이 설정돼 있을 때 가장 자연스러운 코드는?',
      code: `order = Order(user_id=user.id)
order.items.append(OrderItem(product_id=1, quantity=2))
order.items.append(OrderItem(product_id=5, quantity=1))
db.add(order)
db.commit()`,
      choices: ['Order를 먼저 INSERT하고 생긴 id로 OrderItem들을 INSERT한다. FK는 SQLAlchemy가 채운다', 'OrderItem의 order_id를 직접 넣어야 해서 에러가 난다', 'OrderItem은 저장되지 않는다', 'Order가 두 번 저장된다'],
      answer: 0,
      choiceExplanations: [
        '정답. add(order)만 해도 cascade로 items까지 세션에 올라가고, 의존 순서대로 INSERT돼요.',
        'relationship이 FK 값을 알아서 채워요.',
        '기본 cascade("save-update")로 함께 저장돼요.',
        '한 번만 저장돼요.',
      ],
      explanation: 'relationship의 큰 장점이 "객체 그래프로 저장"이에요. 부모-자식 INSERT 순서와 FK 연결을 SQLAlchemy가 처리해요. 그리고 전부 한 트랜잭션이라 항목 저장이 실패하면 주문도 함께 롤백돼요.',
    },
    {
      id: 'sa-03-09', type: 'mcq', source: '관계를 통한 저장과 중복 처리',
      question: '이메일 중복 가입을 처리하는 코드로 가장 안전한 것은?',
      choices: [
        '조회해서 있으면 409, 없으면 저장 (DB에 UNIQUE 없음)',
        '프론트에서 중복 확인 버튼을 누르게 한다',
        '이메일을 소문자로 바꾸기만 한다',
        'DB에 UNIQUE 제약 + commit 시 IntegrityError를 잡아 rollback 후 409',
      ],
      answer: 3,
      choiceExplanations: [
        '동시에 같은 이메일로 두 요청이 오면 둘 다 "없음"을 보고 저장해 중복이 생길 수 있어요.',
        'API를 직접 호출하면 우회돼요.',
        '정규화는 좋은 습관이지만 중복을 막지는 못해요.',
        '정답. DB 제약이 동시성까지 막아 줘요. 조회 검사를 함께 두면 친절한 메시지를 더 빨리 줄 수 있어요.',
      ],
      explanation: '"확인 후 저장(check-then-act)"은 동시성에 약한 대표 패턴이에요. 최종 보장은 DB 제약으로 하고, 앱은 그 실패를 우아하게 처리해요.\n이메일은 저장 전에 .strip().lower()로 정규화해야 "A@b.com"과 "a@b.com"이 같은 값으로 취급돼요.',
    },
    {
      id: 'sa-03-10', type: 'short', source: '관계를 통한 저장과 중복 처리',
      question: 'UNIQUE·FK 같은 DB 제약을 위반했을 때 SQLAlchemy가 던지는 예외 클래스 이름은? (sqlalchemy.exc.___________)',
      answer: ['IntegrityError'],
      explanation: 'IntegrityError예요. 무결성(integrity) 제약 위반이라는 뜻이에요. UNIQUE 중복, 없는 부모를 가리키는 FK, NOT NULL 위반, CHECK 위반 모두 여기에 해당해요.\n잡은 뒤엔 반드시 rollback()해야 세션을 다시 쓸 수 있어요.',
    },
    {
      id: 'sa-03-11', type: 'mcq', source: '관계를 통한 저장과 중복 처리',
      question: '"이 사용자의 설정이 있으면 수정, 없으면 생성"을 동시 요청에도 안전하게 하려면?',
      choices: ['SELECT 후 if로 분기한다', '두 번 저장한다', 'DB의 upsert 기능(PostgreSQL ON CONFLICT DO UPDATE, MySQL ON DUPLICATE KEY UPDATE)을 쓴다', '삭제 후 다시 넣는다'],
      answer: 2,
      choiceExplanations: [
        '두 요청이 동시에 "없음"을 보면 둘 다 INSERT를 시도해 하나는 IntegrityError가 나요.',
        '중복이 생겨요.',
        '정답. DB가 한 문장 안에서 원자적으로 처리해요(UNIQUE 키 기준).',
        '그 사이에 다른 요청이 끼어들 수 있고, FK로 연결된 데이터가 사라질 수 있어요.',
      ],
      explanation: 'SQLAlchemy: from sqlalchemy.dialects.postgresql import insert → insert(Setting).values(...).on_conflict_do_update(index_elements=["user_id"], set_={...}).\nupsert에는 기준이 되는 UNIQUE 제약(또는 기본 키)이 꼭 필요해요.',
    },
    {
      id: 'sa-03-12', type: 'ox', source: '객체 하나 저장하기',
      question: 'SQLAlchemy ORM으로 저장하면 값이 자동으로 파라미터 바인딩되므로, 상품명에 작은따옴표(\')가 있어도 SQL 문법 에러가 나지 않는다.',
      answer: true,
      explanation: '맞아요. 노션 크롤링 실습에서 "상품명에 작은따옴표가 있으면 문자열 더하기 SQL은 에러 + 보안 취약"이었던 문제를 ORM이 원천적으로 막아 줘요. 값은 SQL 문장과 분리되어 전달되기 때문이에요.',
    },
  ],
}

export default topic
