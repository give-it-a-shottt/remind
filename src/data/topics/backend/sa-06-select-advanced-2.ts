import type { Topic } from '../../types'

const topic: Topic = {
  id: 'sa-06-select-advanced-2',
  track: 'backend',
  group: 'SQLAlchemy',
  title: 'SQLAlchemy 검색 고급 ②: 집계 · 조인 · 관계 · N+1',
  order: 46,
  sections: [
    {
      title: '집계 함수와 group_by',
      slides: [
        {
          title: 'SQL의 GROUP BY를 파이썬으로',
          blocks: [
            { type: 'code', code: `from sqlalchemy import func, desc

post_count = func.count(Post.id).label("post_count")
stmt = (
    select(Post.author_id, post_count)
    .where(Post.deleted_at.is_(None))          # 묶기 전 필터
    .group_by(Post.author_id)
    .having(func.count(Post.id) >= 5)          # 묶은 뒤 필터
    .order_by(desc("post_count"))
)
for row in db.execute(stmt):
    print(row.author_id, row.post_count)` },
            { type: 'say', text: '`func.이름(...)`은 **같은 이름의 SQL 함수**를 만들어요. `func.count`, `func.sum`, `func.avg`, `func.max`… SQL 수업의 집계 그대로예요.\n\n`.label("post_count")`로 이름을 붙이면 결과 Row에서 `row.post_count`로 꺼낼 수 있고, 정렬에도 그 이름을 써요.' },
            { type: 'note', tone: 'tip', text: '"글을 5개 이상 쓴 작성자"는 **집계 결과**에 거는 조건이니 `having`이에요. `where`는 묶기 **전** 개별 행을 거르는 곳이라 COUNT를 모르거든요. sql-04의 WHERE vs HAVING과 똑같아요.' },
          ],
        },
      ],
    },
    {
      title: 'relationship 정의',
      slides: [
        {
          title: '객체에서 객체로 걸어가기',
          blocks: [
            { type: 'code', code: `from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True)
    posts: Mapped[list["Post"]] = relationship(back_populates="author")   # 일대다

class Post(Base):
    __tablename__ = "posts"
    id: Mapped[int] = mapped_column(primary_key=True)
    author_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    author: Mapped["User"] = relationship(back_populates="posts")         # 다대일
    comments: Mapped[list["Comment"]] = relationship(
        back_populates="post", cascade="all, delete-orphan"
    )` },
            { type: 'say', text: 'FK는 DB에 "이 글의 작성자는 3번"이라고 적어 둔 숫자일 뿐이에요. **relationship**을 정의하면 `post.author`(작성자 객체), `user.posts`(글 리스트)처럼 **객체에서 객체로 걸어갈** 수 있어요.\n\n"다" 쪽은 `Mapped[list["Post"]]`, "일" 쪽은 `Mapped["User"]`. 클래스 이름을 **문자열**로 쓰면 아직 정의되지 않은 클래스도 가리킬 수 있어요.' },
          ],
        },
        {
          title: 'back_populates와 cascade',
          blocks: [
            { type: 'say', text: '**`back_populates`** 로 양쪽을 서로 연결하면, 한쪽을 바꿀 때 **다른 쪽도 메모리에서 함께** 맞춰져요. `post.author = user`라고 하면 commit 전이라도 `user.posts`에 post가 들어 있어요.\n\n**`cascade="all, delete-orphan"`** 은 부모를 지우면 자식도 ORM이 지우고, 부모에서 **떼어 낸 자식(고아)** 도 지워요. 주문과 주문 항목처럼 **생명 주기가 같은** 관계에 써요. 주문 없는 주문 항목은 의미가 없으니까요.' },
            { type: 'note', tone: 'tip', text: '**다대다**(글 ↔ 태그)는 연결 테이블을 두고 `relationship(secondary=연결테이블)`로 표현해요. 그런데 연결 자체에 데이터(태그를 붙인 **시각**)가 있으면, 연결 테이블을 **별도 모델**(PostTag)로 만들어 일대다 두 개로 풀어요.' },
          ],
        },
      ],
    },
    {
      title: 'join으로 함께 조회하기',
      slides: [
        {
          title: 'relationship을 따라 JOIN',
          blocks: [
            { type: 'code', code: `# kim 이 쓴 글
stmt = select(Post).join(Post.author).where(User.nickname == "kim")

# 글별 댓글 수 (댓글 0개 글 포함)
stmt = (
    select(Post.id, Post.title, func.count(Comment.id).label("comment_count"))
    .outerjoin(Post.comments)
    .group_by(Post.id, Post.title)
)

# 두 엔티티 함께: Row(Post, User)
rows = db.execute(select(Post, User).join(Post.author)).all()` },
            { type: 'say', text: '`.join(Post.author)`는 relationship을 따라 **INNER JOIN**을 만들어요. 그러면 **조인한 테이블의 컬럼**(`User.nickname`)으로 조건을 걸 수 있어요. 댓글이 없는 글도 포함하려면 **`outerjoin`** (LEFT OUTER JOIN)이에요.' },
            { type: 'note', tone: 'warn', text: 'join은 **조건과 필터링**을 위한 거예요. `select(Post).join(Post.author)`만 했다고 `post.author`가 **미리 채워지진 않아요.** 나중에 `post.author`에 접근하면 또 쿼리가 나가요. 미리 채우는 건 다음 개념의 **로딩 옵션**이에요.' },
          ],
        },
      ],
    },
    {
      title: 'N+1 문제와 로딩 전략',
      slides: [
        {
          title: '21번의 쿼리',
          blocks: [
            { type: 'code', code: `posts = db.scalars(select(Post).limit(20)).all()   # 1번
for p in posts:
    print(p.author.nickname)                         # 글마다 1번씩 → 20번
# 합계 21번` },
            { type: 'say', text: '관계는 기본이 **지연 로딩(lazy)** 이에요. `post.author`에 **처음 접근하는 순간** SELECT가 나가요. 그래서 목록 1번 + 글마다 작성자 1번씩 = **N+1**번 쿼리가 나가요.\n\n응답 모델에 `author: UserSummary`를 중첩하면, FastAPI가 응답을 만들며 `post.author`를 읽는 순간 **숨어서** 일어나요. echo 로그에 SELECT가 21번 찍히면 의심하세요.' },
            { type: 'note', tone: 'analogy', text: '반 친구 20명의 부모님 연락처가 필요할 때, 한 명씩 **20번 교무실에 가서** 묻는 게 N+1이에요. "이 20명 부모님 연락처 **한꺼번에** 주세요" 하고 **한 번만** 가면 되죠.' },
          ],
        },
        {
          title: 'selectinload와 joinedload',
          blocks: [
            { type: 'code', code: `from sqlalchemy.orm import selectinload, joinedload

stmt = (
    select(Post)
    .options(joinedload(Post.author), selectinload(Post.comments))
    .order_by(Post.id.desc())
    .limit(20)
)
posts = db.scalars(stmt).unique().all()   # joinedload 와 함께면 unique()
# 쿼리: 글+작성자 JOIN 1번 + 댓글 IN 1번 = 2번` },
            {
              type: 'table',
              head: ['옵션', '방식', '잘 맞는 관계'],
              rows: [
                ['`selectinload`', '목록을 가져온 뒤 **`WHERE id IN (...)` 쿼리 하나**로 한꺼번에', '**일대다** (user.posts, post.comments)'],
                ['`joinedload`', '**JOIN으로** 한 번에', '**다대일** (post.author). 일대다에 쓰면 행이 늘어나 `.unique()` 필요'],
                ['`raiseload`', '지연 로딩이 일어나면 **에러**', '개발 중 N+1 바로 발견'],
              ],
            },
          ],
        },
      ],
    },
    {
      title: '서브쿼리',
      slides: [
        {
          title: '쿼리 안의 쿼리',
          blocks: [
            { type: 'code', code: `from sqlalchemy import exists

# 값 하나를 돌려주는 서브쿼리
avg_views = select(func.avg(Post.views)).scalar_subquery()
popular = select(Post).where(Post.views > avg_views)

# 존재 여부
has_comment = select(Post).where(Post.comments.any())     # EXISTS 서브쿼리
no_comment  = select(Post).where(~Post.comments.any())
# 관계가 없다면: where(exists().where(Comment.post_id == Post.id))` },
            { type: 'list', items: ['`.scalar_subquery()` — **값 하나**를 돌려주는 서브쿼리 (평균 조회수)', '`.subquery()` — 다른 select의 **FROM처럼** 쓰는 서브쿼리', '`Post.comments.any()` — relationship이 있으면 **EXISTS**를 만들어 줘요. "댓글이 하나라도 있는 글"을 JOIN + DISTINCT보다 효율적으로 찾아요'] },
          ],
        },
      ],
    },
  ],
  questions: [
    {
      id: 'sa-06-01', type: 'mcq', source: '집계 함수와 group_by',
      question: '"글을 5개 이상 쓴 작성자"만 고르려면 조건을 어디에 걸어야 할까?',
      choices: ['.where(func.count(Post.id) >= 5)', '.order_by(func.count(Post.id) >= 5)', '.having(func.count(Post.id) >= 5)', '.limit(5)'],
      answer: 2,
      choiceExplanations: [
        'WHERE는 그룹을 만들기 전 개별 행에 적용돼서 집계 함수를 쓸 수 없어요(에러).',
        '정렬일 뿐 거르지 않아요.',
        '정답. HAVING은 GROUP BY로 묶은 뒤 그룹 단위 조건이에요.',
        '결과 행 수를 5개로 자를 뿐이에요.',
      ],
      explanation: 'SQL 실행 순서: FROM → WHERE(행 필터) → GROUP BY(묶기) → HAVING(그룹 필터) → SELECT → ORDER BY → LIMIT.\n이 순서를 알면 "왜 WHERE에 COUNT를 못 쓰는지", "왜 SELECT에서 붙인 별칭을 WHERE에서 못 쓰는지"가 설명돼요(SQL 집계 토픽).',
    },
    {
      id: 'sa-06-02', type: 'short', source: '집계 함수와 group_by',
      question: '집계 표현식 func.count(Post.id)에 "post_count"라는 이름을 붙이는 메서드는? .______("post_count")',
      answer: ['label'],
      explanation: '.label("post_count") → SQL AS post_count. Row에서 row.post_count로 꺼낼 수 있고, 응답 모델 필드 이름과 맞추면 바로 변환돼요.',
    },
    {
      id: 'sa-06-03', type: 'mcq', source: 'relationship 정의',
      question: 'User.posts와 Post.author를 back_populates로 연결했다. 다음 코드 후 user.posts에 post가 들어 있을까? (아직 commit 전)',
      code: `post = Post(title="hi", content="...")
post.author = user`,
      choices: ['들어 있다. back_populates가 반대쪽 컬렉션도 메모리에서 맞춰 준다', '들어 있지 않다. commit해야 반영된다', '에러', 'user가 삭제된다'],
      answer: 0,
      choiceExplanations: [
        '정답. 한쪽을 설정하면 반대쪽도 즉시 동기화돼요.',
        'back_populates 덕분에 commit 전에도 메모리에서 일관돼요.',
        '정상 동작이에요.',
        '관계없어요.',
      ],
      explanation: 'back_populates는 "두 relationship이 같은 관계의 양 끝"이라고 알려 주는 설정이에요. 없으면 commit 후 다시 읽기 전까지 반대쪽이 어긋날 수 있어요.\n예전 코드의 backref="posts"는 한쪽에서 반대쪽을 자동 생성하는 방식이에요. 명시적인 back_populates가 권장돼요.',
    },
    {
      id: 'sa-06-04', type: 'mcq', source: 'relationship 정의',
      question: '주문(Order)과 주문항목(OrderItem)의 relationship에 cascade="all, delete-orphan"을 주는 이유는?',
      choices: ['조회 속도를 높이려고', '주문을 삭제하거나 항목을 주문에서 떼어 내면 그 항목도 함께 삭제되도록(생명 주기 일치)', '항목을 여러 주문이 공유하게 하려고', 'FK를 없애려고'],
      answer: 1,
      choiceExplanations: [
        '로딩 속도와는 관계없어요.',
        '정답. 주문 없이 주문항목은 의미가 없으니 함께 사라지게 해요.',
        '공유하는 관계(예: 상품)에 delete-orphan을 쓰면 위험해요.',
        'FK는 그대로 있어요.',
      ],
      explanation: 'delete-orphan은 "부모만이 자식을 소유하는" 관계에만 써요. order.items.remove(item)만 해도 commit 때 item이 DELETE돼요.\n반대로 사용자-글처럼 독립적인 데이터에 걸면, 실수 한 번에 대량 삭제가 일어날 수 있어요.',
    },
    {
      id: 'sa-06-05', type: 'mcq', source: 'join으로 함께 조회하기',
      question: '"댓글이 하나도 없는 글도 포함해서" 글별 댓글 수를 구하려 한다. 알맞은 조인은?',
      choices: ['join(Post.comments)', 'join 없이 select(func.count(Comment.id))', 'outerjoin(Post.comments)', 'crossjoin'],
      answer: 2,
      choiceExplanations: [
        'INNER JOIN은 짝이 있는 행만 남겨서 댓글 0개인 글이 결과에서 사라져요.',
        '전체 댓글 수 하나만 나와요.',
        '정답. LEFT OUTER JOIN은 짝이 없어도 왼쪽(글)을 남기고, count(Comment.id)는 NULL을 세지 않아 0이 나와요.',
        '모든 조합을 만드는 조인이라 의미가 없어요.',
      ],
      explanation: 'count(*)와 count(컬럼)의 차이도 중요해요. LEFT JOIN 결과에서 count(*)는 짝이 없는 행도 1로 세지만, count(Comment.id)는 NULL을 세지 않아 0이 돼요.',
    },
    {
      id: 'sa-06-06', type: 'mcq', source: 'N+1 문제와 로딩 전략',
      question: '글 20개 목록 응답에 작성자 닉네임이 들어간다. echo 로그에 SELECT가 21번 찍혔다. 원인은?',
      choices: ['페이지네이션 오류', 'commit 누락', '인덱스 부족', '응답 변환 중 각 글의 post.author에 접근할 때마다 지연 로딩 쿼리가 나간 N+1 문제'],
      answer: 3,
      choiceExplanations: [
        '목록 쿼리는 1번이에요.',
        '조회와 무관해요.',
        '쿼리 횟수 문제예요.',
        '정답. 1(목록) + 20(작성자) = 21. selectinload나 joinedload로 2번 또는 1번으로 줄여요.',
      ],
      explanation: 'N+1은 ORM에서 가장 흔한 성능 문제예요. 데이터가 적을 땐 티가 안 나다가 목록이 커지면 급격히 느려져요.\n해결: stmt.options(joinedload(Post.author)) 또는 selectinload(Post.author). 개발 중에는 raiseload("*")로 숨은 지연 로딩을 에러로 드러내는 것도 좋은 방법이에요.',
    },
    {
      id: 'sa-06-07', type: 'mcq', source: 'N+1 문제와 로딩 전략',
      question: '사용자 목록과 각 사용자의 글 목록(일대다)을 함께 가져올 때 일반적으로 더 알맞은 로딩 옵션은?',
      choices: ['selectinload(User.posts)', 'joinedload(User.posts)', 'lazy 기본값', 'raiseload(User.posts)'],
      answer: 0,
      choiceExplanations: [
        '정답. 사용자 목록 1번 + "WHERE author_id IN (...)" 1번으로 깔끔하게 가져와요.',
        '가능하지만 사용자 행이 글 수만큼 복제돼 전송량이 늘고, limit이 사용자 단위로 동작하지 않는 문제가 생겨요.',
        'N+1이 생겨요.',
        '접근하면 에러가 나요. 가져오는 옵션이 아니에요.',
      ],
      explanation: '경험칙: 다대일(post.author) → joinedload, 일대다·다대다(user.posts, post.tags) → selectinload.\njoinedload로 일대다를 가져오면 결과에 같은 부모가 반복돼 scalars().unique()가 필요해요.',
    },
    {
      id: 'sa-06-08', type: 'short', source: 'N+1 문제와 로딩 전략',
      question: '목록을 먼저 조회한 뒤, 관련 객체를 "WHERE id IN (...)" 쿼리 하나로 한꺼번에 가져오는 로딩 옵션 이름은?',
      answer: ['selectinload', 'selectinload()'],
      explanation: 'selectinload예요. from sqlalchemy.orm import selectinload → select(User).options(selectinload(User.posts)).\n비동기 SQLAlchemy에서는 지연 로딩이 에러(MissingGreenlet)가 나기 때문에, 관계는 이런 옵션으로 반드시 미리 로딩해야 해요(비동기 토픽).',
    },
    {
      id: 'sa-06-09', type: 'ox', source: 'join으로 함께 조회하기',
      question: 'select(Post).join(Post.author)만 하면 각 post.author가 미리 채워져 지연 로딩 쿼리가 나가지 않는다.',
      answer: false,
      explanation: 'join은 조건·필터를 위해 테이블을 붙일 뿐, 관계 속성을 채우지 않아요. post.author에 접근하면 여전히 지연 로딩이 일어나요.\n조인한 결과로 관계까지 채우고 싶으면 .options(contains_eager(Post.author))를 함께 쓰거나, 처음부터 joinedload를 써요.',
    },
    {
      id: 'sa-06-10', type: 'mcq', source: '서브쿼리',
      question: '"평균 조회수보다 조회수가 높은 글"을 찾는 코드로 맞는 것은?',
      choices: [
        'select(Post).where(Post.views > select(func.avg(Post.views)).scalar_subquery())',
        'select(Post).where(Post.views > func.avg(Post.views))',
        'select(Post).having(Post.views > 0)',
        'select(func.avg(Post.views)).where(Post.views > 0)',
      ],
      answer: 0,
      choiceExplanations: [
        '정답. 평균을 구하는 서브쿼리가 값 하나를 돌려주고, 바깥 쿼리가 그 값과 비교해요.',
        '집계 함수를 WHERE에 바로 쓸 수 없어요.',
        'GROUP BY도 없고 조건도 맞지 않아요.',
        '평균만 구해요.',
      ],
      explanation: 'scalar_subquery()는 "값 하나를 돌려주는 서브쿼리"라서 비교식 오른쪽에 쓸 수 있어요. 테이블처럼 쓰려면 .subquery()로 만들어 join하거나 select_from에 넣어요.',
    },
    {
      id: 'sa-06-11', type: 'mcq', source: '서브쿼리',
      question: '"댓글이 하나라도 있는 글"을 찾는 가장 효율적인 표현은?',
      choices: [
        '모든 글을 가져와 파이썬에서 len(post.comments) > 0으로 거른다',
        'select(Post).join(Post.comments)  # 중복 제거 없이',
        'select(Comment.post_id)',
        'select(Post).where(Post.comments.any())  # EXISTS',
      ],
      answer: 3,
      choiceExplanations: [
        'N+1까지 생기는 최악의 방법이에요.',
        '댓글 수만큼 같은 글이 중복돼요(distinct 필요).',
        '글 객체가 아니라 id만, 그것도 중복으로 나와요.',
        '정답. EXISTS 서브쿼리는 댓글을 하나 찾는 순간 멈춰서 효율적이에요.',
      ],
      explanation: '"있는지 없는지"만 필요하면 EXISTS가 COUNT나 JOIN보다 의도가 분명하고 빨라요. 없는 글은 ~Post.comments.any() 로 NOT EXISTS가 돼요.',
    },
    {
      id: 'sa-06-12', type: 'mcq', source: 'relationship 정의',
      question: '게시글과 태그는 다대다 관계다. 태그를 붙인 시각도 저장해야 한다. 알맞은 설계는?',
      choices: ['posts 테이블에 tags 컬럼을 두고 "a,b,c" 문자열로 저장', 'tags 테이블에 post_id 컬럼 하나', 'post_tags 연결 테이블을 별도 모델(PostTag: post_id, tag_id, created_at)로 만들고 각각과 관계를 맺는다', '태그를 JSON으로 저장하고 시각은 버린다'],
      answer: 2,
      choiceExplanations: [
        '한 칸에 여러 값을 넣는 것은 제1정규형 위반이고, 태그별 검색·집계가 어려워요.',
        '그러면 태그 하나가 글 하나에만 붙을 수 있어요(일대다).',
        '정답. 연결 자체에 데이터가 있으면 연결 테이블을 "관계 엔터티"로 승격해 모델로 만들어요(ER 다이어그램 토픽).',
        '요구사항(시각 저장)을 만족하지 못해요.',
      ],
      explanation: '다대다는 항상 연결 테이블로 풀어요. 연결 테이블에 추가 정보가 없으면 relationship(secondary=post_tags)로 간단히, 있으면 Association Object 패턴(연결 모델)으로 만들어요.',
    },
  ],
}

export default topic
