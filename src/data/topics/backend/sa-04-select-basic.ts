import type { Topic } from '../../types'

const topic: Topic = {
  id: 'sa-04-select-basic',
  track: 'backend',
  group: 'SQLAlchemy',
  title: 'SQLAlchemy 검색 기본: get · select · where · scalars',
  order: 44,
  sections: [
    {
      title: '기본 키로 하나 찾기: session.get',
      slides: [
        {
          title: '가장 간단한 조회',
          blocks: [
            { type: 'code', code: `post = db.get(Post, post_id)
if post is None:
    raise HTTPException(404, "글이 없습니다")` },
            { type: 'say', text: '`session.get(Post, 3)`은 **기본 키가 3인** Post를 돌려줘요. 없으면 **None**. 이미 세션에 있으면 DB에 묻지 않아요(Identity Map).\n\n없을 때 None이 오니 **항상 None 검사 후 404**. 자주 쓰니 `get_or_404` 헬퍼로 만들어 두면 편해요.' },
            { type: 'note', tone: 'tip', text: '오래된 강의에서 `db.query(Post).get(3)`이나 `db.query(User).filter(User.id == 1).first()`를 보면, 2.0 스타일로는 `db.get(Post, 3)`, `db.scalars(select(User).where(User.id == 1)).first()`로 읽으면 돼요. `query()`는 옛 문법이에요.' },
          ],
        },
      ],
    },
    {
      title: 'select()와 실행 결과 꺼내기',
      slides: [
        {
          title: '문장을 만들고, 실행하고, 꺼내기',
          blocks: [
            { type: 'code', code: `from sqlalchemy import select

stmt = select(Post)                                 # 1) SQL 문장 객체 만들기
posts = db.scalars(stmt).all()                      # 2) 실행 + 모델 객체 리스트로
first = db.scalars(stmt).first()                    #    첫 번째 또는 None

rows = db.execute(select(Post.id, Post.title)).all()
for row in rows:
    print(row.id, row.title)                        # Row (튜플처럼, 이름으로도 접근)` },
            { type: 'say', text: '2.0 스타일 조회는 **`select()`로 문장을 만들고 → 세션으로 실행**해요.\n\n`db.execute(select(Post))`는 **Row** 객체들을 돌려줘요. 각 Row는 `(Post,)`처럼 **튜플 모양**이에요. 모델 객체만 원하면 **`.scalars()`** 로 첫 번째 열만 꺼내요. 그래서 실무에선 `db.scalars(...)`를 가장 많이 써요.' },
          ],
        },
        {
          title: '꺼내는 방법 고르기',
          blocks: [
            {
              type: 'table',
              head: ['메서드', '결과'],
              rows: [
                ['`.all()`', '리스트'],
                ['`.first()`', '첫 번째 또는 None'],
                ['`.one()`', '**정확히 1개**. 0개나 2개 이상이면 **에러**'],
                ['`.one_or_none()`', '0개면 None, 2개 이상이면 에러'],
                ['`db.scalar(stmt)`', '첫 행의 첫 값 또는 None'],
              ],
            },
            { type: 'code', code: `from sqlalchemy import func
total = db.scalar(select(func.count()).select_from(Post))   # ✅ DB가 셈
total = len(db.scalars(select(Post)).all())                 # ❌ 전부 꺼내서 셈` },
            { type: 'say', text: '전체 개수는 DB에게 **세어 달라고** 해요. 전부 꺼내서 `len()` 하면 10만 개를 메모리에 올리는 셈이에요.' },
          ],
        },
      ],
    },
    {
      title: 'where로 조건 걸기',
      slides: [
        {
          title: '파이썬 연산자가 SQL이 돼요',
          blocks: [
            { type: 'code', code: `from sqlalchemy import select, or_

stmt = (
    select(Post)
    .where(Post.author_id == user_id)        # AND
    .where(Post.deleted_at.is_(None))         # IS NULL
)
mine = db.scalars(stmt).all()

user = db.scalar(select(User).where(User.email == email))    # 없으면 None

hot = db.scalars(select(Post).where(or_(Post.views > 1000, Post.likes > 100))).all()` },
            { type: 'say', text: '신기한 점: `Post.author_id == 3`은 파이썬에서 True/False가 아니라 **SQL 조건식 객체**를 만들어요. SQLAlchemy가 `==` 연산자를 바꿔 놨거든요. 그래서 `WHERE posts.author_id = :param`으로 변환돼요.' },
          ],
        },
        {
          title: 'AND, OR, NULL 쓰는 법',
          blocks: [
            {
              type: 'table',
              head: ['하고 싶은 것', '쓰는 법'],
              rows: [
                ['AND', '`.where(A, B)` 또는 `.where(A).where(B)`'],
                ['OR', '`or_(A, B)` 또는 `A | B`'],
                ['NOT', '`not_(A)` 또는 `~A`'],
                ['IS NULL', '`.is_(None)` / `.is_not(None)`'],
              ],
            },
            { type: 'note', tone: 'warn', text: '파이썬 키워드 `and`, `or`, `not`은 **쓸 수 없어요.** 파이썬이 조건식 객체를 그냥 True/False로 판단해 버려서, 조건 하나가 **조용히 사라져요.** 에러도 안 나서 더 위험해요. 꼭 `or_()`, `and_()`를 써요.' },
          ],
        },
      ],
    },
    {
      title: '어떤 SQL이 나가는지 확인하기',
      slides: [
        {
          title: 'print(stmt)와 echo',
          blocks: [
            { type: 'code', code: `stmt = select(Post).where(Post.id == 3)
print(stmt)
# SELECT posts.id, posts.title, posts.content FROM posts WHERE posts.id = :id_1` },
            { type: 'say', text: '`print(stmt)`를 하면 **실행 전에** SQL 문장을 볼 수 있어요. 값은 `:id_1` 같은 **자리 표시자**로 나와요(바인딩되니까). 실제 실행된 SQL과 값은 `echo=True` 로그로 확인해요.' },
            { type: 'list', items: ['`scalars().all()`은 결과를 **전부 메모리**에 올려요. 결과가 많을 수 있으면 **limit(페이지네이션)** 을 먼저 걸어요', '조회만 하는 요청에서는 **commit할 필요가 없어요.** 그래도 세션은 닫아야 커넥션이 반납돼요 (의존성이 처리)'] },
          ],
        },
      ],
    },
  ],
  questions: [
    {
      id: 'sa-04-01', type: 'mcq', source: '기본 키로 하나 찾기: session.get',
      question: 'db.get(Post, 999)에서 999번 글이 없으면?',
      choices: ['None을 돌려준다', 'NoResultFound 예외', '빈 Post 객체', '404 응답이 자동으로 나간다'],
      answer: 0,
      choiceExplanations: [
        '정답. 그래서 None 검사와 404 처리를 직접 해야 해요.',
        'get은 예외를 내지 않아요. (scalars().one()은 0개면 NoResultFound를 내요.)',
        '빈 객체를 만들지 않아요.',
        'SQLAlchemy는 HTTP를 몰라요. 404는 우리가 raise해요.',
      ],
      explanation: '"없을 수 있다"는 신호(리턴 타입 Post | None)를 받으면 반드시 분기하세요. 그렇지 않으면 None.title에서 AttributeError → 500이 돼요(타입 힌트 토픽에서 본 패턴).',
    },
    {
      id: 'sa-04-02', type: 'mcq', source: 'select()와 실행 결과 꺼내기',
      question: 'db.execute(select(Post)).all() 과 db.scalars(select(Post)).all() 의 차이는?',
      choices: ['같다', 'execute는 Row(튜플 모양) 리스트, scalars는 Post 객체 리스트', 'scalars는 첫 행만 준다', 'execute는 SQL을 실행하지 않는다'],
      answer: 1,
      choiceExplanations: [
        '돌려주는 모양이 달라요.',
        '정답. execute 결과의 각 원소는 (Post,)라서 row[0]으로 꺼내야 해요. scalars는 그 첫 열만 바로 꺼내 줘요.',
        '.all()이라 전부 줘요.',
        '둘 다 실행해요.',
      ],
      explanation: '응답 모델(list[PostRead])로 바로 돌려주려면 scalars가 편해요. execute 결과(Row)를 그대로 돌려주면 응답 검증이 실패할 수 있어요.\n여러 엔티티나 컬럼을 함께 고를 때(select(Post, User))는 execute로 Row를 받아 row.Post, row.User처럼 써요.',
    },
    {
      id: 'sa-04-03', type: 'short', source: 'select()와 실행 결과 꺼내기',
      question: 'select 결과에서 "정확히 1개"를 기대할 때 쓰는 메서드는? 0개나 2개 이상이면 예외를 낸다. db.scalars(stmt).____()',
      answer: ['one', 'one()'],
      explanation: '.one()이에요. 0개 → NoResultFound, 2개 이상 → MultipleResultsFound.\n• .first(): 있으면 첫 번째, 없으면 None (여러 개여도 에러 없음)\n• .one_or_none(): 0개면 None, 1개면 그것, 2개 이상이면 에러\n• .one(): 반드시 1개\n"반드시 하나여야 한다"는 가정을 코드로 검증하고 싶을 때 one을 써요.',
    },
    {
      id: 'sa-04-04', type: 'mcq', source: 'where로 조건 걸기',
      question: '"작성자가 3이고 삭제되지 않은(deleted_at이 NULL인) 글"을 찾는 올바른 코드는?',
      choices: [
        'select(Post).where(Post.author_id == 3 and Post.deleted_at == None)',
        'select(Post).where("author_id = 3")',
        'select(Post).filter_by(author_id == 3)',
        'select(Post).where(Post.author_id == 3, Post.deleted_at.is_(None))',
      ],
      answer: 3,
      choiceExplanations: [
        '파이썬 and는 SQL 조건식을 합치지 못해요. 앞 조건이 무시되는 등 의도와 다른 SQL이 나와요.',
        '문자열 SQL 조각은 ORM의 장점을 버리고 실수와 인젝션 위험을 만들어요.',
        'filter_by는 키워드 인자를 받아요: filter_by(author_id=3).',
        '정답. where에 여러 조건을 쉼표로 주면 AND로 묶여요. NULL 비교는 is_(None).',
      ],
      explanation: 'SQL 조건식 조합 도구: where(A, B) / and_(A, B) / A & B → AND, or_(A, B) / A | B → OR, not_(A) / ~A → NOT.\n&, | 를 쓸 때는 연산자 우선순위 때문에 (A) & (B)처럼 괄호로 감싸야 해요.',
    },
    {
      id: 'sa-04-05', type: 'ox', source: 'where로 조건 걸기',
      question: 'Post.author_id == 3 은 파이썬에서 True나 False가 아니라 SQL 조건식 객체를 만든다.',
      answer: true,
      explanation: '맞아요. SQLAlchemy 컬럼 객체는 ==, >, < 같은 연산자를 오버로딩해서 BinaryExpression을 만들어요. print(Post.author_id == 3)을 해 보면 posts.author_id = :author_id_1 이 나와요.\n이게 ORM이 "파이썬 코드처럼 보이는 SQL"을 만드는 원리예요(클래스의 특별 메서드 __eq__ 활용).',
    },
    {
      id: 'sa-04-06', type: 'mcq', source: 'where로 조건 걸기',
      question: '로그인할 때 이메일로 사용자 한 명을 찾는다. 가장 알맞은 코드는?',
      choices: [
        'db.get(User, email)',
        'db.scalar(select(User).where(User.email == email))',
        'db.scalars(select(User)).all() 후 파이썬 for문으로 이메일 비교',
        'db.execute(select(User.email)).first()',
      ],
      answer: 1,
      choiceExplanations: [
        'get은 기본 키(id)로만 찾아요.',
        '정답. 조건으로 찾고, 없으면 None이에요. email에 UNIQUE(인덱스)가 있으면 빨라요.',
        '모든 사용자를 메모리에 올려요. 사용자가 100만 명이면 서버가 버티지 못해요.',
        '이메일 컬럼만 가져오고, 조건도 없어요.',
      ],
      explanation: '필터링은 DB에서(WHERE), 파이썬에서는 결과만 다루기. "전부 가져와서 파이썬으로 거르기"는 데이터가 작을 땐 티가 안 나지만 커지면 치명적이에요.',
    },
    {
      id: 'sa-04-07', type: 'mcq', source: 'where로 조건 걸기',
      question: '조회수 1000 초과 또는 좋아요 100 초과인 글을 찾는 조건은?',
      choices: [
        'where(Post.views > 1000, Post.likes > 100)',
        'where(Post.views > 1000 or Post.likes > 100)',
        'where(or_(Post.views > 1000, Post.likes > 100))',
        'where(Post.views > 1000).where(Post.likes > 100)',
      ],
      answer: 2,
      choiceExplanations: [
        '쉼표는 AND예요.',
        '파이썬 or는 SQL 조건을 합치지 못해요.',
        '정답. or_()로 OR 조건을 만들어요.',
        'where 체이닝도 AND예요.',
      ],
      explanation: 'AND는 여러 방법이 있지만 OR는 or_() (또는 |)만 기억하면 돼요.\nSQL: WHERE posts.views > 1000 OR posts.likes > 100.',
    },
    {
      id: 'sa-04-08', type: 'short', source: 'where로 조건 걸기',
      question: 'deleted_at 컬럼이 NULL인 행을 찾는 SQLAlchemy 표현은? Post.deleted_at.____(None)',
      answer: ['is_', 'is_()'],
      explanation: 'Post.deleted_at.is_(None) → SQL: deleted_at IS NULL. 반대는 is_not(None).\nSQL에서 NULL은 "모르는 값"이라 = NULL 비교는 항상 참이 아니에요(NULL). 그래서 IS NULL이라는 별도 문법이 있어요(SQL 토픽).',
    },
    {
      id: 'sa-04-09', type: 'mcq', source: '어떤 SQL이 나가는지 확인하기',
      question: 'print(select(Post).where(Post.id == 3)) 를 실행하면?',
      choices: ['SELECT ... FROM posts WHERE posts.id = :id_1 같은 SQL 문장이 출력되고, DB에는 아무 요청도 가지 않는다', '3번 글 객체가 출력된다', 'DB 에러', 'True'],
      answer: 0,
      choiceExplanations: [
        '정답. 실행은 db.execute/scalars에 넘길 때 일어나요.',
        'select()는 "문장"을 만들 뿐 실행하지 않아요.',
        '실행하지 않으니 DB 에러도 없어요.',
        '조건식 객체가 문장 안에 들어가 SQL로 바뀌어요.',
      ],
      explanation: '"만들기"와 "실행하기"가 분리된 덕분에 문장을 조건에 따라 단계적으로 조립할 수 있어요.\nstmt = select(Post)\nif keyword: stmt = stmt.where(Post.title.contains(keyword))\nif author_id: stmt = stmt.where(Post.author_id == author_id)\n마지막에 한 번만 실행해요.',
    },
    {
      id: 'sa-04-10', type: 'ox', source: '어떤 SQL이 나가는지 확인하기',
      question: '조회만 하는 API에서도 반드시 db.commit()을 호출해야 결과를 읽을 수 있다.',
      answer: false,
      explanation: '읽기만 할 때는 commit이 필요 없어요. 세션이 닫힐 때 열린 트랜잭션은 롤백되는데, 바꾼 게 없으니 영향이 없어요.\n다만 세션은 반드시 닫아야 커넥션이 풀로 돌아가요. yield 의존성의 finally(또는 with)가 이를 보장해요.',
    },
    {
      id: 'sa-04-11', type: 'mcq', source: 'select()와 실행 결과 꺼내기',
      question: '전체 글 수를 세는 가장 효율적인 코드는?',
      choices: [
        'len(db.scalars(select(Post)).all())',
        'db.scalar(select(func.count()).select_from(Post))',
        'db.get(Post, "count")',
        'db.scalars(select(Post)).first().id',
      ],
      answer: 1,
      choiceExplanations: [
        '모든 글을 메모리로 가져와서 세요. 매우 비효율적이에요.',
        '정답. DB가 COUNT(*)로 세고 숫자 하나만 돌려줘요.',
        'get은 기본 키 조회예요.',
        '첫 글의 id일 뿐 개수가 아니에요(삭제된 id가 있으면 더더욱 달라요).',
      ],
      explanation: '집계는 DB에게 맡기세요: func.count(), func.sum(), func.avg(), func.max().\n조건 개수: db.scalar(select(func.count()).select_from(Post).where(Post.author_id == 3)). 다음 토픽에서 정렬·페이징과 함께 자세히 다뤄요.',
    },
    {
      id: 'sa-04-12', type: 'mcq', source: '기본 키로 하나 찾기: session.get',
      question: '오래된 강의 코드 db.query(User).filter(User.id == 1).first() 를 2.0 스타일로 바꾼 것은?',
      choices: ['db.get(User, 1) 또는 db.scalars(select(User).where(User.id == 1)).first()', 'db.select(User, 1)', 'User.get(1)', 'db.query(User, 1)'],
      answer: 0,
      choiceExplanations: [
        '정답. 기본 키라면 get이 가장 간단하고, 일반 조건이라면 select + where + scalars예요.',
        '그런 메서드는 없어요.',
        '모델 클래스에 get 메서드는 없어요(Django ORM 스타일).',
        '그런 사용법은 없어요.',
      ],
      explanation: '1.x 스타일(session.query(...).filter(...))도 여전히 동작하지만, 2.0 스타일(select + execute/scalars)이 표준이고 비동기 세션에서는 2.0 스타일만 써요.\n대응: query(M) → select(M), filter → where, filter_by(x=1) → where(M.x == 1) 또는 filter_by 그대로, .all() → db.scalars(stmt).all().',
    },
  ],
}

export default topic
