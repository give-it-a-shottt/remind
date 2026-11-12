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
      slides: [
        {
          title: '글자 패턴으로 찾기',
          blocks: [
            { type: 'code', code: `stmt = select(Post).where(Post.title.contains(q, autoescape=True))   # LIKE '%q%'
stmt = select(User).where(User.email.ilike("%@gmail.com"))           # 대소문자 무시
stmt = select(Post).where(Post.title.startswith("[공지]"))           # LIKE '[공지]%'` },
            {
              type: 'table',
              head: ['메서드', 'SQL'],
              rows: [
                ['`.like("%fast%")`', '`LIKE` 그대로 (`%` 0글자 이상, `_` 한 글자)'],
                ['`.contains("fast")`', '`LIKE \'%fast%\'` 줄임'],
                ['`.startswith` / `.endswith`', '`LIKE \'fast%\'` / `LIKE \'%fast\'`'],
                ['`.ilike(...)`', '**대소문자 무시** (PostgreSQL ILIKE, 다른 DB는 lower로 흉내)'],
              ],
            },
          ],
        },
        {
          title: '검색의 두 가지 함정',
          blocks: [
            { type: 'say', text: '**① 앞에 %가 붙으면 느려요.** `%검색어%`는 "어디에든 들어 있나"라서, 정렬된 인덱스(B-tree)를 쓸 수 없어요. 사전에서 "**가운데에** \'사\'가 들어간 단어"를 찾으려면 처음부터 끝까지 넘겨 봐야 하는 것과 같아요. 글 100만 개라면 본격적인 검색은 **전문 검색(Full-Text) 인덱스**나 검색 엔진을 써요.' },
            { type: 'say', text: '**② 사용자가 %를 입력하면?** 검색창에 "100%"를 쓰면 `%`가 **와일드카드**로 해석돼서 "100으로 시작하는 모든 것"이 나와요. `contains(q, autoescape=True)`를 주면 `%`, `_`를 **글자 그대로** 찾아요.' },
          ],
        },
      ],
    },
    {
      title: '목록·범위 조건: in_ · between · not',
      slides: [
        {
          title: 'IN과 범위',
          blocks: [
            { type: 'code', code: `from datetime import datetime, timedelta

stmt = select(Post).where(Post.id.in_([1, 3, 5]))       # IN (1, 3, 5)
stmt = select(Post).where(Post.id.not_in([1, 3, 5]))    # NOT IN (또는 ~Post.id.in_(...))

day = datetime(2026, 10, 20)
stmt = select(Post).where(Post.created_at >= day,
                          Post.created_at < day + timedelta(days=1))` },
            { type: 'say', text: '`in_([])`처럼 목록이 **비어 있으면** SQLAlchemy가 알아서 0건으로 안전하게 처리해요.\n\n`between(start, end)`는 **양 끝 포함**이에요. 그런데 날짜를 DATETIME으로 저장했다면 `between("2026-10-20", "2026-10-20")`은 **0시 0분 0초 딱 그 순간**만 찾아요. 하루를 찾으려면 **"그날 0시 이상, 다음 날 0시 미만"** 으로 써요.' },
            { type: 'note', tone: 'warn', text: 'SQL 수업에서 본 함정 기억나죠? `NOT IN (1, 2, NULL)`은 **아무 행도** 돌려주지 않아요. NULL과의 비교가 "모름"이 되어 조건 전체가 참이 될 수 없거든요.' },
          ],
        },
      ],
    },
    {
      title: '정렬: order_by',
      slides: [
        {
          title: '정렬 기준 여러 개',
          blocks: [
            { type: 'code', code: `.order_by(Post.created_at.desc())                     # 최신순
.order_by(Post.pinned.desc(), Post.created_at.desc())  # 고정 글 먼저, 그다음 최신순
.order_by(Post.likes.desc(), Post.id.desc())           # 좋아요 같으면 id 로 순서 고정
.order_by(Post.score.desc().nulls_last())              # NULL 은 맨 뒤로 (지원 DB)` },
            { type: 'say', text: '정렬 기준이 **같은 행이 여러 개**면 그 사이 순서는 매번 달라질 수 있어요. 페이지를 넘길 때 같은 글이 두 번 나오거나 빠지는 원인이에요. 그래서 **고유한 값(id)을 마지막 정렬 기준**으로 붙여 순서를 고정해요.' },
          ],
        },
        {
          title: '사용자가 정렬을 고를 때',
          blocks: [
            { type: 'code', code: `SORTS = {
    "latest": (Post.created_at.desc(), Post.id.desc()),
    "popular": (Post.likes.desc(), Post.id.desc()),
}

@router.get("/")
def list_posts(db: SessionDep, sort: Literal["latest", "popular"] = "latest"):
    stmt = select(Post).order_by(*SORTS[sort])
    return db.scalars(stmt).all()` },
            { type: 'say', text: '`?sort=created_at` 같은 문자열을 **그대로 컬럼 이름으로** 쓰면, 엉뚱한 컬럼(비밀번호 해시!)으로 정렬하거나 SQL 조작의 틈이 생겨요. **허용 목록**(Literal) → **컬럼 매핑**(dict)으로 처리하면 정해진 정렬만 가능해요.' },
          ],
        },
      ],
    },
    {
      title: '페이지네이션: limit · offset · 개수',
      slides: [
        {
          title: '목록 + 전체 개수',
          blocks: [
            { type: 'code', code: `def list_posts(db, page: int, size: int, keyword: str | None):
    conds = [Post.deleted_at.is_(None)]
    if keyword:
        conds.append(Post.title.contains(keyword, autoescape=True))

    total = db.scalar(select(func.count()).select_from(Post).where(*conds))
    items = db.scalars(
        select(Post).where(*conds)
        .order_by(Post.id.desc())
        .limit(size).offset((page - 1) * size)
    ).all()
    return {"items": items, "total": total, "page": page, "size": size}` },
            { type: 'say', text: '`.limit(size).offset((page - 1) * size)`. 3페이지(20개씩)면 `.limit(20).offset(40)`이에요. **order_by와 반드시 함께** 써요.\n\n전체 개수(total)는 목록과 **같은 조건**이어야 해요. 목록엔 검색어 조건을 넣고 total엔 깜빡하면 숫자가 안 맞아요. 그래서 조건을 **`conds` 리스트로 한 번 만들어** 두 쿼리에 함께 넘겼어요.' },
          ],
        },
        {
          title: '깊은 페이지는 커서 방식',
          blocks: [
            { type: 'code', code: `# offset: 앞의 10만 행을 읽고 버림 → 뒤로 갈수록 느림
select(Post).order_by(Post.id.desc()).offset(100_000).limit(20)

# 커서(keyset): "마지막으로 본 id 이후" → 인덱스로 바로 찾아감
select(Post).where(Post.id < last_id).order_by(Post.id.desc()).limit(20)` },
            { type: 'say', text: 'OFFSET이 크면 DB는 앞의 행을 **전부 읽고 버려요.** 무한 스크롤처럼 깊이 들어가는 화면은 "**마지막으로 본 id보다 작은 것**" 조건을 쓰는 **커서 방식**이 빨라요. 대신 "37페이지로 바로 가기"는 못 해요.' },
            { type: 'say', text: '`select(Product.category).distinct()`는 중복을 없앤 **종류 목록**이에요. SQL의 `SELECT DISTINCT`와 같아요.' },
          ],
        },
      ],
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
