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
      points: [
        'func.count(), func.sum(), func.avg(), func.max(), func.min() 로 집계한다. func.이름(...) 은 같은 이름의 SQL 함수를 만든다.',
        'select(Post.author_id, func.count(Post.id)).group_by(Post.author_id) → 작성자별 글 수. 결과는 (author_id, count) Row다.',
        '집계 결과에 조건을 걸 때는 where가 아니라 having을 쓴다. where는 묶기 전 행을 거르고, having은 묶은 뒤 그룹을 거른다.',
        '집계 결과에 이름을 붙이려면 .label("post_count"). 정렬에도 그 이름(또는 표현식)을 쓴다.',
      ],
      code: `from sqlalchemy import func, desc

post_count = func.count(Post.id).label("post_count")
stmt = (
    select(Post.author_id, post_count)
    .where(Post.deleted_at.is_(None))          # 묶기 전 필터
    .group_by(Post.author_id)
    .having(func.count(Post.id) >= 5)          # 묶은 뒤 필터
    .order_by(desc("post_count"))
)
for row in db.execute(stmt):
    print(row.author_id, row.post_count)`,
    },
    {
      title: 'relationship 정의',
      points: [
        'relationship은 FK로 연결된 객체를 속성처럼 탐색하게 해 준다. post.author(다대일), user.posts(일대다).',
        '양쪽에 relationship을 두고 back_populates로 서로를 가리키게 하면, 한쪽을 바꿀 때 다른 쪽도 메모리에서 함께 맞춰진다.',
        '일대다의 "다" 쪽 타입은 Mapped[list["Post"]], 다대일은 Mapped["User"]. 문자열로 클래스 이름을 쓰면 아직 정의되지 않은 클래스도 가리킬 수 있다.',
        'cascade="all, delete-orphan": 부모 삭제 시 자식도 ORM이 삭제하고, 부모에서 떼어 낸 자식(고아)도 삭제한다. 주문-주문항목처럼 생명 주기가 같은 관계에 쓴다.',
        '다대다는 연결 테이블(association table)을 두고 relationship(secondary=연결테이블)로 표현한다. 연결 자체에 데이터(좋아요 누른 시각 등)가 있으면 연결 테이블을 별도 모델로 만든다.',
      ],
      code: `from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True)
    posts: Mapped[list["Post"]] = relationship(back_populates="author")

class Post(Base):
    __tablename__ = "posts"
    id: Mapped[int] = mapped_column(primary_key=True)
    author_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    author: Mapped["User"] = relationship(back_populates="posts")
    comments: Mapped[list["Comment"]] = relationship(
        back_populates="post", cascade="all, delete-orphan"
    )`,
    },
    {
      title: 'join으로 함께 조회하기',
      points: [
        'select(Post).join(Post.author) 는 relationship을 따라 INNER JOIN을 만든다. 조인한 테이블의 컬럼으로 조건을 걸 수 있다: .where(User.nickname == "kim").',
        'outerjoin 은 LEFT OUTER JOIN이다. 댓글이 없는 글도 포함해야 할 때 쓴다.',
        'select(Post, User).join(Post.author) 처럼 두 엔티티를 함께 고르면 Row(Post, User)가 나온다.',
        '주의: join은 "조건과 필터링"을 위한 것이다. join만 했다고 post.author가 미리 채워지지는 않는다. 관계를 미리 채우는 것은 아래의 로딩 옵션이다.',
      ],
      code: `# kim 이 쓴 글
stmt = select(Post).join(Post.author).where(User.nickname == "kim")

# 글별 댓글 수 (댓글 0개 글 포함)
stmt = (
    select(Post.id, Post.title, func.count(Comment.id).label("comment_count"))
    .outerjoin(Post.comments)
    .group_by(Post.id, Post.title)
)`,
    },
    {
      title: 'N+1 문제와 로딩 전략',
      points: [
        '기본 관계 로딩은 lazy(지연 로딩)다. post.author에 처음 접근하는 순간 SELECT가 나간다.',
        'N+1: 글 목록 1번 조회(1) + 각 글의 작성자 접근마다 1번씩(N). 글 20개면 21번 쿼리다. 응답 모델에 author를 중첩하면 변환 중에 숨어서 일어난다.',
        'selectinload(Post.author): 목록을 가져온 뒤 "WHERE id IN (...)" 쿼리 하나로 관련 객체를 한 번에 가져온다. 총 2번. 일대다(user.posts, post.comments)에 특히 좋다.',
        'joinedload(Post.author): JOIN으로 한 번에 가져온다. 다대일(post.author)에 잘 맞는다. 일대다에 쓰면 부모 행이 자식 수만큼 늘어나 중복이 생기므로 .unique() 가 필요하다.',
        'raiseload: 지연 로딩이 일어나면 에러를 내게 해서 N+1을 개발 중에 바로 발견하게 한다.',
      ],
      code: `from sqlalchemy.orm import selectinload, joinedload

stmt = (
    select(Post)
    .options(joinedload(Post.author), selectinload(Post.comments))
    .order_by(Post.id.desc())
    .limit(20)
)
posts = db.scalars(stmt).unique().all()   # joinedload 와 함께면 unique()
# 쿼리: 글+작성자 JOIN 1번 + 댓글 IN 1번 = 2번`,
    },
    {
      title: '서브쿼리',
      points: [
        '쿼리 안의 쿼리. .subquery() 로 만들어 다른 select의 FROM처럼 쓰거나, .scalar_subquery() 로 값 하나를 돌려주는 식으로 쓴다.',
        '예: 평균보다 조회수가 높은 글 → where(Post.views > select(func.avg(Post.views)).scalar_subquery()).',
        '"댓글이 하나라도 있는 글"은 exists() 로 표현한다: where(exists().where(Comment.post_id == Post.id)). 관계가 있으면 Post.comments.any() 가 같은 SQL을 만든다.',
      ],
      code: `from sqlalchemy import exists

avg_views = select(func.avg(Post.views)).scalar_subquery()
popular = select(Post).where(Post.views > avg_views)

has_comment = select(Post).where(Post.comments.any())          # EXISTS 서브쿼리
no_comment = select(Post).where(~Post.comments.any())`,
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
