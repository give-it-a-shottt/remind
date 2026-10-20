import type { Topic } from '../../types'

const topic: Topic = {
  id: 'sa-05-select-advanced-1',
  track: 'backend',
  group: 'SQLAlchemy',
  title: 'SQLAlchemy 검색 고급 ①: 패턴 · 범위 · 정렬 · 페이지',
  order: 45,
  sections: [
    {
      title: '문자열 검색: like · ilike · contains',
      points: [
        'Post.title.like("%fast%") → SQL LIKE. % 는 "아무 글자 0개 이상", _ 는 "아무 글자 1개".',
        'contains("fast") 는 like("%fast%")의 줄임, startswith("fast") 는 like("fast%"), endswith 도 있다.',
        'ilike 는 대소문자를 무시한다(PostgreSQL ILIKE, 다른 DB에서는 lower()로 흉내). MySQL은 기본 정렬 규칙(collation)이 대소문자를 구분하지 않는 경우가 많다.',
        '"%키워드%" 처럼 앞에 %가 붙은 검색은 일반 B-tree 인덱스를 쓰지 못해 데이터가 많으면 느리다. 본격적인 검색은 전문 검색(Full-Text) 인덱스나 검색 엔진을 쓴다.',
        '사용자가 입력한 검색어에 % 나 _ 가 들어 있으면 와일드카드로 해석된다. 정확히 그 글자를 찾으려면 escape 처리를 한다(contains(q, autoescape=True)).',
      ],
      code: `stmt = select(Post).where(Post.title.contains(q, autoescape=True))
stmt = select(User).where(User.email.ilike("%@gmail.com"))
stmt = select(Post).where(Post.title.startswith("[공지]"))`,
    },
    {
      title: '목록·범위 조건: in_ · between · not',
      points: [
        'Post.id.in_([1, 3, 5]) → IN (1, 3, 5). 목록이 비어 있으면 결과는 0건(SQLAlchemy가 안전하게 처리).',
        'Post.created_at.between(start, end) → BETWEEN (양 끝 포함). 날짜 범위는 끝 날짜의 시각 처리에 주의한다. 보통 created_at >= start AND created_at < 다음날 0시 로 쓴다.',
        '부정: ~Post.id.in_([...]) 또는 Post.id.not_in([...]), not_(조건).',
        'NOT IN에 NULL이 섞이면 결과가 비는 SQL 함정이 있다(NULL 비교는 참도 거짓도 아니기 때문).',
      ],
      code: `from datetime import datetime, timedelta

ids = [1, 3, 5]
stmt = select(Post).where(Post.id.in_(ids))

day = datetime(2026, 10, 20)
stmt = select(Post).where(Post.created_at >= day, Post.created_at < day + timedelta(days=1))`,
    },
    {
      title: '정렬: order_by',
      points: [
        '.order_by(Post.created_at.desc()) 최신순, .asc() 오름차순(기본). 여러 기준: .order_by(Post.pinned.desc(), Post.created_at.desc()).',
        '정렬 기준이 같은 행이 여러 개면 순서가 매번 달라질 수 있다. 페이지네이션에서는 고유한 값(id)을 마지막 정렬 기준으로 추가해 순서를 고정한다.',
        '사용자가 정렬 기준을 고르게 할 때 문자열을 그대로 컬럼 이름으로 쓰지 말고, 허용 목록(Literal/Enum) → 컬럼 매핑으로 처리한다.',
        'NULL의 정렬 위치는 DB마다 다르다. .desc().nulls_last() 로 명시할 수 있다(지원 DB에서).',
      ],
      code: `SORTS = {
    "latest": (Post.created_at.desc(), Post.id.desc()),
    "popular": (Post.likes.desc(), Post.id.desc()),
}

@router.get("/")
def list_posts(db: SessionDep, sort: Literal["latest", "popular"] = "latest"):
    stmt = select(Post).order_by(*SORTS[sort])
    return db.scalars(stmt).all()`,
    },
    {
      title: '페이지네이션: limit · offset · 개수',
      points: [
        '.limit(size).offset((page - 1) * size). SQL LIMIT/OFFSET. 정렬(order_by)과 반드시 함께 쓴다.',
        '전체 개수: db.scalar(select(func.count()).select_from(Post).where(...)). 목록 조회와 같은 where 조건을 써야 한다. 조건을 공유하려면 조건 목록을 변수로 만들어 두 쿼리에 함께 넘긴다.',
        'OFFSET이 크면(예: 50만 번째부터) DB가 앞의 50만 행을 읽고 버리므로 느려진다. 무한 스크롤처럼 깊이 들어가는 화면은 "마지막으로 본 id보다 작은 것" 조건을 쓰는 커서(keyset) 방식을 쓴다.',
        'distinct(): 중복 행 제거. select(Post.category).distinct() → 카테고리 종류 목록(노션의 SELECT DISTINCT CATEGORY).',
      ],
      code: `def list_posts(db, page: int, size: int, keyword: str | None):
    conds = [Post.deleted_at.is_(None)]
    if keyword:
        conds.append(Post.title.contains(keyword, autoescape=True))

    total = db.scalar(select(func.count()).select_from(Post).where(*conds))
    items = db.scalars(
        select(Post).where(*conds)
        .order_by(Post.id.desc())
        .limit(size).offset((page - 1) * size)
    ).all()
    return {"items": items, "total": total, "page": page, "size": size}

# 커서 방식: 마지막으로 본 id 이후
stmt = select(Post).where(Post.id < last_id).order_by(Post.id.desc()).limit(20)`,
    },
  ],
  questions: [
    {
      id: 'sa-05-01', type: 'mcq', source: '문자열 검색: like · ilike · contains',
      question: '제목에 "api"가 포함된 글을 찾는 조건은?',
      choices: ['Post.title == "%api%"', 'Post.title.like("%api%") 또는 Post.title.contains("api")', 'Post.title.in_("api")', 'Post.title.startswith("%api")'],
      answer: 1,
      choiceExplanations: [
        '== 는 정확히 "%api%"라는 글자와 같은지 비교해요.',
        '정답. contains는 양쪽에 %를 붙인 LIKE예요.',
        'in_은 목록 중 하나와 정확히 같은지 비교해요.',
        'startswith는 앞에 %를 직접 붙이면 의미가 이상해져요.',
      ],
      explanation: 'LIKE 패턴: "api%" (api로 시작), "%api" (api로 끝남), "%api%" (포함), "a_i" (a + 아무 한 글자 + i).\nSQLAlchemy 도우미: startswith, endswith, contains. 대소문자 무시는 ilike.',
    },
    {
      id: 'sa-05-02', type: 'mcq', source: '문자열 검색: like · ilike · contains',
      question: '글 100만 개에서 title LIKE \'%검색어%\' 가 느린 주된 이유는?',
      choices: ['앞에 %가 붙으면 B-tree 인덱스로 범위를 좁힐 수 없어 전체 행을 훑어야 해서', 'LIKE는 원래 지원이 안 돼서', '한글이라서', 'contains가 아니라 like를 써서'],
      answer: 0,
      choiceExplanations: [
        '정답. 인덱스는 "앞부분 기준" 정렬이라, 시작 글자를 모르면 쓸 수 없어요. "검색어%"(앞부분 고정)는 인덱스를 쓸 수 있어요.',
        'LIKE는 잘 지원돼요.',
        '언어와는 무관해요.',
        '둘은 같은 SQL이에요.',
      ],
      explanation: '사전에서 "단어가 \'api\'로 시작하는 것"은 빨리 찾지만 "중간에 \'api\'가 들어간 것"은 처음부터 끝까지 넘겨야 하는 것과 같아요.\n해결: MySQL FULLTEXT 인덱스, PostgreSQL pg_trgm(GIN 인덱스)이나 tsvector, 또는 Elasticsearch 같은 검색 엔진. (DB 성능 토픽에서 인덱스 원리를 자세히 다뤄요.)',
    },
    {
      id: 'sa-05-03', type: 'ox', source: '문자열 검색: like · ilike · contains',
      question: '사용자가 검색창에 "100%"를 입력했을 때 그대로 contains(q)에 넣으면 %가 와일드카드로 해석되어 의도와 다른 결과가 나올 수 있다.',
      answer: true,
      explanation: '맞아요. "100%"의 %가 "아무 글자"로 해석돼 "1000원", "100개" 등도 걸려요. contains(q, autoescape=True)를 쓰면 %와 _를 이스케이프해서 글자 그대로 찾아요.\nSQL 인젝션은 아니지만(값은 바인딩됨) 결과가 틀리는 버그예요.',
    },
    {
      id: 'sa-05-04', type: 'short', source: '목록·범위 조건: in_ · between · not',
      question: 'id가 [1, 3, 5] 중 하나인 글을 찾는 SQLAlchemy 메서드는? Post.id.___([1, 3, 5])',
      answer: ['in_', 'in_()'],
      explanation: 'in_이에요. 파이썬 예약어 in과 겹치지 않게 밑줄이 붙었어요(and_, or_, is_ 도 같은 이유).\n프론트가 여러 개를 선택해 일괄 처리할 때(선택 삭제, 장바구니 상품 조회) 자주 써요. 목록 크기에 상한을 두는 게 좋아요.',
    },
    {
      id: 'sa-05-05', type: 'mcq', source: '목록·범위 조건: in_ · between · not',
      question: '2026-10-20 하루 동안 작성된 글을 찾으려 한다. created_at은 DATETIME이다. 가장 정확한 조건은?',
      choices: [
        'created_at.between("2026-10-20", "2026-10-20")',
        'created_at >= 2026-10-20 00:00 AND created_at < 2026-10-21 00:00',
        'created_at == "2026-10-20"',
        'created_at.like("2026-10-20%")',
      ],
      answer: 1,
      choiceExplanations: [
        '"2026-10-20"은 0시 0분으로 해석돼서 0시 정각에 쓴 글만 걸려요.',
        '정답. 반열린 구간 [시작, 다음날)이 경계 문제 없이 정확하고, 인덱스도 잘 써요.',
        '시각이 있는 값과 날짜 문자열 비교는 0시 정각만 맞아요.',
        '날짜를 문자열로 바꿔 비교하면 인덱스를 못 쓰고 DB마다 동작이 달라요.',
      ],
      explanation: '날짜 범위는 "시작 이상, 끝 미만"(>= start, < end)이 정석이에요. BETWEEN은 양 끝을 포함해서 23:59:59.999 같은 끝 처리 문제가 생겨요.\n시간대(timezone)도 신경 써야 해요. 서버는 UTC로 저장하고, 한국 시간 하루는 UTC로 바꿔 범위를 만들어요.',
    },
    {
      id: 'sa-05-06', type: 'mcq', source: '정렬: order_by',
      question: '"고정 글을 먼저, 그다음 최신순"으로 정렬하는 코드는?',
      choices: [
        'order_by(Post.pinned.desc(), Post.created_at.desc())',
        'order_by(Post.created_at.desc(), Post.pinned.desc())',
        'order_by(Post.pinned).order_by(Post.created_at)',
        'order_by("pinned, created_at")',
      ],
      answer: 0,
      choiceExplanations: [
        '정답. 첫 번째 기준(pinned 내림차순: True가 먼저)으로 나누고, 같은 그룹 안에서 최신순.',
        '순서가 반대예요. 최신순이 먼저 적용되고 같은 시각일 때만 pinned를 봐요.',
        '둘 다 오름차순이라 고정 글(True)이 뒤로 가고 오래된 글이 먼저 와요.',
        '문자열 SQL 조각은 피하는 게 좋고, 방향도 빠졌어요.',
      ],
      explanation: '여러 정렬 기준은 "앞의 기준이 같을 때만 다음 기준을 본다"예요. 중요한 기준부터 적어요.',
    },
    {
      id: 'sa-05-07', type: 'mcq', source: '정렬: order_by',
      question: '정렬 기준을 쿼리 파라미터로 받는다. 가장 안전한 구현은?',
      choices: [
        'order_by(text(sort))  # sort는 사용자 입력 문자열',
        'order_by(getattr(Post, sort))  # 아무 컬럼 이름이나 허용',
        '정렬 기능을 없앤다',
        'sort: Literal["latest", "popular"]로 받고 미리 정한 컬럼 매핑(dict)으로 변환',
      ],
      answer: 3,
      choiceExplanations: [
        '사용자 문자열을 SQL 조각으로 넣으면 SQL 인젝션이 가능해요.',
        '인젝션은 아니지만 hashed_password 같은 컬럼으로 정렬해 정보를 추측하는 공격이나 인덱스 없는 컬럼 정렬로 인한 부하를 허용해요.',
        '기능을 없앨 필요는 없어요.',
        '정답. 허용 목록 + 매핑. 문서에도 선택지가 표시돼요.',
      ],
      explanation: '사용자 입력이 SQL의 "구조"(컬럼 이름, 정렬 방향, 테이블)를 결정하면 안 돼요. 값은 바인딩으로, 구조는 허용 목록으로.',
    },
    {
      id: 'sa-05-08', type: 'short', source: '페이지네이션: limit · offset · 개수',
      question: '3페이지(한 페이지 20개)를 가져오는 코드의 빈칸 숫자는? .limit(20).offset(__)',
      answer: ['40'],
      explanation: 'offset = (3 - 1) * 20 = 40이에요. 41번째부터 20개를 가져와요.\norder_by 없이 limit/offset을 쓰면 DB가 순서를 보장하지 않아 페이지 사이에 중복·누락이 생길 수 있어요.',
    },
    {
      id: 'sa-05-09', type: 'mcq', source: '페이지네이션: limit · offset · 개수',
      question: '목록 API에서 total(전체 개수)이 실제 목록 조건과 다르게 나온다. 가장 흔한 원인은?',
      choices: ['func.count()가 부정확해서', '목록 쿼리에는 where(검색어, 삭제 제외)를 걸고 개수 쿼리에는 같은 조건을 빠뜨려서', 'limit 때문에', 'offset 때문에'],
      answer: 1,
      choiceExplanations: [
        'COUNT는 정확해요.',
        '정답. 조건 목록(conds)을 한 번 만들어 두 쿼리에 같이 넘기면 이런 불일치가 사라져요.',
        '개수 쿼리에는 limit을 걸지 않아요.',
        '개수 쿼리에는 offset을 걸지 않아요.',
      ],
      explanation: 'conds = [...] → select(func.count()).select_from(Post).where(*conds) / select(Post).where(*conds).order_by(...).limit(...).offset(...).\n조건을 한 곳에서 만드는 습관이 "목록은 3개인데 총 120개라고 나와요" 같은 버그를 막아요.',
    },
    {
      id: 'sa-05-10', type: 'mcq', source: '페이지네이션: limit · offset · 개수',
      question: '무한 스크롤 피드가 뒤로 갈수록 느려진다(offset 10만 이상). 개선 방법은?',
      choices: ['limit을 늘린다', 'offset 대신 page를 쓴다', '정렬을 없앤다', '마지막으로 받은 글의 id를 cursor로 보내고 where(Post.id < cursor).order_by(Post.id.desc()).limit(20)으로 가져온다'],
      answer: 3,
      choiceExplanations: [
        '한 번에 많이 가져올 뿐 깊은 위치 문제는 그대로예요.',
        'page도 결국 offset으로 바뀌어요.',
        '정렬이 없으면 순서가 보장되지 않아요.',
        '정답. 커서(keyset) 페이지네이션은 인덱스로 바로 그 위치를 찾아 깊이와 상관없이 빨라요.',
      ],
      explanation: 'OFFSET N은 "N개를 읽고 버린다"라 N에 비례해 느려져요. 커서 방식은 "id < 마지막 id" 조건으로 인덱스에서 바로 시작점을 찾아요.\n단점: "몇 페이지로 바로 이동"이 어렵고, 정렬 기준이 고유해야 해요(같은 값이 있으면 (created_at, id) 쌍을 커서로 써요).',
    },
    {
      id: 'sa-05-11', type: 'short', source: '페이지네이션: limit · offset · 개수',
      question: '카테고리 컬럼의 중복을 없앤 종류 목록을 얻으려면 select(Product.category).________() 를 붙인다. 빈칸은?',
      answer: ['distinct'],
      explanation: '.distinct() → SQL SELECT DISTINCT category FROM products.\n노션 크롤링 실습의 "SELECT DISTINCT CATEGORY"와 같아요. 카테고리별 개수까지 원하면 group_by + count를 써요(다음 토픽).',
    },
    {
      id: 'sa-05-12', type: 'ox', source: '목록·범위 조건: in_ · between · not',
      question: 'SQL에서 WHERE id NOT IN (1, 2, NULL) 은 1, 2가 아닌 모든 행을 돌려준다.',
      answer: false,
      explanation: 'NOT IN 목록에 NULL이 있으면 결과가 0건이 돼요. "id != NULL"이 참도 거짓도 아닌 UNKNOWN이 되어 모든 행의 조건이 참이 될 수 없기 때문이에요.\n서브쿼리로 NOT IN을 쓸 때 서브쿼리 결과에 NULL이 섞여 이 함정에 빠지기 쉬워요. NOT EXISTS를 쓰거나 NULL을 걸러 내요(SQL 토픽).',
    },
  ],
}

export default topic
