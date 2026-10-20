import type { Topic } from '../../types'

const topic: Topic = {
  id: 'as-03-async-crud',
  track: 'backend',
  group: '비동기',
  title: '비동기 SQLAlchemy로 CRUD 만들기',
  order: 53,
  sections: [
    {
      title: '비동기 입력',
      points: [
        '동기와 순서는 같고 DB 통신에만 await가 붙는다: 객체 생성 → session.add(obj) → await session.commit() → await session.refresh(obj).',
        'UNIQUE 위반은 await session.commit()에서 IntegrityError로 난다. except에서 await session.rollback() 후 409로 바꾼다.',
        '대량 입력: await session.execute(insert(Model), rows) 후 await session.commit().',
      ],
      code: `@router.post("/", response_model=PostRead, status_code=201)
async def create_post(data: PostCreate, db: AsyncSessionDep, user: CurrentUser):
    post = Post(**data.model_dump(), author_id=user.id)
    db.add(post)
    await db.commit()
    await db.refresh(post)
    return post`,
    },
    {
      title: '비동기 검색',
      points: [
        '하나: await db.get(Post, post_id) → Post | None.',
        '조건 하나: await db.scalar(select(User).where(User.email == email)).',
        '여러 개: result = await db.scalars(stmt) → result.all(). 한 줄로 (await db.scalars(stmt)).all() 처럼 괄호로 감싸야 한다. await db.scalars(stmt).all() 은 .all()을 먼저 호출하려다 에러가 난다.',
        '응답 모델에 들어갈 관계는 options(selectinload(...))로 반드시 미리 로딩한다.',
        '개수: await db.scalar(select(func.count()).select_from(Post).where(*conds)).',
      ],
      code: `@router.get("/", response_model=Page)
async def list_posts(db: AsyncSessionDep, page: int = 1, size: int = 10):
    conds = [Post.deleted_at.is_(None)]
    total = await db.scalar(select(func.count()).select_from(Post).where(*conds))
    stmt = (
        select(Post).where(*conds)
        .options(selectinload(Post.author))
        .order_by(Post.id.desc())
        .limit(size).offset((page - 1) * size)
    )
    items = (await db.scalars(stmt)).all()
    return {"items": items, "total": total, "page": page, "size": size}`,
    },
    {
      title: '비동기 수정과 삭제',
      points: [
        '객체 수정: obj = await db.get(...) → 속성 변경 → await db.commit(). 변경 추적 원리는 동기와 같다.',
        '객체 삭제: await db.delete(obj) → await db.commit(). (비동기 세션에서는 delete가 코루틴이다. cascade 대상 자식을 불러와야 할 수 있기 때문.)',
        '여러 행: await db.execute(update(Post).where(...).values(...)), await db.execute(delete(Post).where(...)) 후 commit.',
        '트랜잭션 블록: async with db.begin(): ... (성공 시 commit, 예외 시 rollback).',
      ],
      code: `@router.delete("/{post_id}", status_code=204)
async def delete_post(post_id: int, db: AsyncSessionDep, user: CurrentUser):
    post = await db.get(Post, post_id)
    if post is None:
        raise HTTPException(404)
    if post.author_id != user.id:
        raise HTTPException(403)
    await db.delete(post)
    await db.commit()`,
    },
    {
      title: '비동기에서 자주 하는 실수',
      points: [
        '하나의 AsyncSession을 asyncio.gather로 여러 쿼리에 동시에 쓰면 안 된다. 세션은 한 번에 하나의 작업만 처리한다. 병렬 쿼리가 꼭 필요하면 쿼리마다 세션을 따로 만든다.',
        '비동기 라우트 안에서 동기 함수(requests, 동기 세션)를 부르면 루프가 막힌다.',
        'commit 후 관계 속성에 접근하면(지연 로딩) MissingGreenlet. 필요한 관계는 refresh(obj, ["관계명"]) 또는 다시 조회하며 options로 로딩한다.',
        '백그라운드 작업(BackgroundTasks)에 요청의 세션을 넘기면 안 된다. 응답 후에는 그 세션이 닫힌다. 백그라운드 작업은 자기 세션을 새로 연다.',
      ],
      code: `# 잘못: 같은 세션으로 동시 실행
await asyncio.gather(db.scalars(q1), db.scalars(q2))   # 💥

# 올바름: 순서대로
r1 = (await db.scalars(q1)).all()
r2 = (await db.scalars(q2)).all()`,
    },
  ],
  questions: [
    {
      id: 'as-03-01', type: 'mcq', source: '비동기 입력',
      question: '비동기 세션으로 글을 저장하는 순서로 맞는 것은?',
      choices: [
        'await db.add(post) → db.commit() → db.refresh(post)',
        'db.add(post) → db.commit() → db.refresh(post)',
        'await db.add(post) → await db.commit() → await db.refresh(post)',
        'db.add(post) → await db.commit() → await db.refresh(post)',
      ],
      answer: 3,
      choiceExplanations: [
        'add는 await하지 않고, commit·refresh는 await해야 해요. 반대예요.',
        'commit과 refresh에 await가 없어 실행되지 않아요.',
        'add는 코루틴이 아니라 await하면 TypeError가 나요.',
        '정답. 메모리 작업(add)은 그냥, DB 통신(commit, refresh)은 await.',
      ],
      explanation: '"DB와 통신하면 await"라는 기준 하나로 판단하면 돼요. add는 세션의 목록에 올리기만 하는 메모리 작업이에요.',
    },
    {
      id: 'as-03-02', type: 'mcq', source: '비동기 검색',
      question: '다음 중 에러가 나는 코드는?',
      choices: [
        'items = (await db.scalars(stmt)).all()',
        'result = await db.scalars(stmt); items = result.all()',
        'items = await db.scalars(stmt).all()',
        'post = await db.get(Post, 1)',
      ],
      answer: 2,
      choiceExplanations: [
        '괄호로 await 결과를 먼저 받은 뒤 .all()을 불러요. 올바른 코드예요.',
        '두 줄로 나눈 올바른 코드예요.',
        '정답. 연산 순서상 db.scalars(stmt).all()이 먼저 평가되는데, db.scalars(stmt)는 아직 코루틴이라 .all()이 없어 AttributeError가 나요.',
        '올바른 코드예요.',
      ],
      explanation: 'await는 바로 뒤의 "전체 표현식"에 적용돼요. await a.b().c()는 await (a.b().c())예요.\n그래서 체이닝할 때는 (await db.scalars(stmt)).all()처럼 괄호로 await 범위를 정해 줘야 해요.',
    },
    {
      id: 'as-03-03', type: 'short', source: '비동기 검색',
      question: '비동기 세션에서 기본 키로 한 건을 찾는 코드의 빈칸은? post = _____ db.get(Post, post_id)',
      answer: ['await'],
      explanation: 'await db.get(Post, post_id)예요. 결과는 Post 또는 None.\n동기 코드에서 비동기로 옮길 때 "DB 메서드 앞에 await"만 기계적으로 붙여도 대부분 동작해요. 남는 문제는 지연 로딩(관계 접근)이라 그 부분만 options로 고치면 돼요.',
    },
    {
      id: 'as-03-04', type: 'mcq', source: '비동기 검색',
      question: '비동기 목록 API가 응답을 만들 때 MissingGreenlet 에러가 난다. 응답 모델에 comments: list[CommentRead]가 있다. 해결은?',
      choices: ['쿼리에 .options(selectinload(Post.comments))를 추가한다', '라우트를 def로 바꾼다', 'expire_on_commit=True로 바꾼다', 'response_model을 지운다'],
      answer: 0,
      choiceExplanations: [
        '정답. 응답 변환 전에 댓글이 이미 메모리에 올라와 있어 추가 I/O가 없어요.',
        '비동기 세션을 쓰면서 def로 바꾸면 await를 쓸 수 없어요.',
        '오히려 commit 후 접근 시 재조회가 필요해져 같은 에러가 늘어나요.',
        '응답 검증과 필터링을 잃어요. 근본 해결이 아니에요.',
      ],
      explanation: '비동기 + 응답 모델 + 관계 = 반드시 eager loading. 이 공식만 기억하면 MissingGreenlet의 대부분을 피할 수 있어요.',
    },
    {
      id: 'as-03-05', type: 'mcq', source: '비동기 수정과 삭제',
      question: '비동기 세션에서 객체를 삭제하는 올바른 코드는?',
      choices: ['db.delete(post); await db.commit()', 'await db.remove(post)', 'del post; await db.commit()', 'await db.delete(post); await db.commit()'],
      answer: 3,
      choiceExplanations: [
        'AsyncSession.delete는 코루틴이라 await하지 않으면 실행되지 않아요.',
        'remove라는 세션 메서드는 없어요.',
        '파이썬 변수만 지울 뿐 DB에는 영향이 없어요.',
        '정답. 동기 Session.delete와 달리 비동기에서는 await가 필요해요.',
      ],
      explanation: 'add는 await 없음, delete는 await 있음. 헷갈리기 쉬운 짝이에요. delete는 cascade로 함께 지울 자식을 확인하느라 DB 조회가 필요할 수 있어서 코루틴이에요.',
    },
    {
      id: 'as-03-06', type: 'mcq', source: '비동기 수정과 삭제',
      question: '비동기 세션에서 조회수를 원자적으로 1 올리는 코드는?',
      choices: [
        'post = await db.get(Post, id); post.views += 1; await db.commit()',
        'db.execute(update(Post).values(views=1))',
        'await db.execute(update(Post).where(Post.id == id).values(views=Post.views + 1)); await db.commit()',
        'await db.refresh(post, views=+1)',
      ],
      answer: 2,
      choiceExplanations: [
        '동작은 하지만 동시 요청에서 갱신 손실이 생길 수 있어요(읽고-계산-쓰기).',
        'await가 없고, 모든 글의 조회수를 1로 덮어써요.',
        '정답. DB가 views = views + 1을 계산해서 동시에 와도 정확해요.',
        'refresh는 다시 읽기일 뿐이에요.',
      ],
      explanation: '동기 버전에서 배운 원자적 갱신이 비동기에서도 똑같이 중요해요. 비동기 서버는 동시 요청을 더 많이 받기 때문에 경쟁 조건이 더 자주 드러나요.',
    },
    {
      id: 'as-03-07', type: 'short', source: '비동기 수정과 삭제',
      question: '비동기 세션에서 "성공하면 commit, 예외면 rollback"을 자동으로 해 주는 블록 문법은? _____ with db.begin():',
      answer: ['async'],
      explanation: 'async with db.begin(): 이에요. 비동기 컨텍스트 매니저라 with 앞에 async가 붙어요.\n비동기 세계에서는 with → async with, for → async for(비동기 반복자), 함수 → async def처럼 짝이 있어요.',
    },
    {
      id: 'as-03-08', type: 'mcq', source: '비동기에서 자주 하는 실수',
      question: '대시보드에서 쿼리 3개를 빠르게 하려고 같은 세션으로 asyncio.gather를 썼더니 에러가 난다. 이유는?',
      code: `a, b, c = await asyncio.gather(
    db.scalar(q_users), db.scalar(q_posts), db.scalar(q_comments)
)`,
      choices: ['AsyncSession 하나는 동시에 여러 작업을 처리할 수 없어서(하나의 연결)', 'gather는 3개까지만 받는다', 'scalar는 gather에 쓸 수 없다', 'await를 두 번 써서'],
      answer: 0,
      choiceExplanations: [
        '정답. 세션은 연결 하나 위에서 순서대로 동작해요. 동시에 쓰면 "This session is provisioning a new connection; concurrent operations are not permitted" 같은 에러가 나요.',
        '개수 제한은 없어요.',
        '코루틴이면 gather에 넣을 수 있어요. 문제는 세션 공유예요.',
        'await는 gather 앞에 한 번이에요.',
      ],
      explanation: '정말 병렬이 필요하면 쿼리마다 async with SessionLocal() as s: 로 세션을 따로 만들어요(커넥션도 따로 쓰게 됨).\n대부분은 쿼리를 하나로 합치거나(서브쿼리로 개수 3개를 한 번에), 순서대로 실행해도 충분히 빨라요.',
    },
    {
      id: 'as-03-09', type: 'ox', source: '비동기에서 자주 하는 실수',
      question: '응답을 보낸 뒤 실행되는 BackgroundTasks 작업에 요청에서 받은 db 세션을 그대로 넘겨 써도 안전하다.',
      answer: false,
      explanation: '응답 후에는 의존성 정리(세션 close)가 이미 끝났거나 진행 중이라 그 세션을 쓰면 에러가 나거나 예측할 수 없게 동작해요.\n백그라운드 작업은 필요한 ID만 받고, 작업 안에서 async with SessionLocal() as db: 로 새 세션을 열어요.',
    },
    {
      id: 'as-03-10', type: 'mcq', source: '비동기 입력',
      question: '비동기 회원가입에서 이메일 중복을 처리하는 코드로 맞는 것은?',
      choices: [
        'try: db.commit() → except IntegrityError: pass',
        'try: await db.commit() → except IntegrityError: await db.rollback(); raise HTTPException(409)',
        'if await db.add(user): ...',
        'await db.commit(unique=True)',
      ],
      answer: 1,
      choiceExplanations: [
        'await가 없어 commit이 실행되지 않고, 에러를 삼켜 버려요.',
        '정답. commit 실패를 잡아 rollback하고 409로 바꿔요.',
        'add는 코루틴이 아니고 결과를 돌려주지 않아요.',
        '그런 옵션은 없어요.',
      ],
      explanation: '동기와 같은 패턴에 await만 붙어요. rollback도 DB 통신이라 await가 필요해요.',
    },
    {
      id: 'as-03-11', type: 'mcq', source: '비동기 검색',
      question: '비동기 라우트에서 이메일로 사용자 한 명을 찾는 코드는?',
      choices: [
        'db.scalar(select(User).where(User.email == email))',
        'await db.get(User, email)',
        'await db.scalar(select(User).where(User.email == email))',
        'await select(User).where(User.email == email)',
      ],
      answer: 2,
      choiceExplanations: [
        'await가 없어 코루틴 객체가 돌아와요.',
        'get은 기본 키 조회예요. email이 기본 키가 아니에요.',
        '정답. 결과는 User 또는 None.',
        'select는 문장을 만들 뿐 실행하지 않아요. 실행은 세션이 해요.',
      ],
      explanation: '"문장 만들기(select, 동기)"와 "실행(세션 메서드, await)"이 분리돼 있다는 걸 기억하면 await 위치를 헷갈리지 않아요.',
    },
    {
      id: 'as-03-12', type: 'ox', source: '비동기 수정과 삭제',
      question: '비동기 세션에서도 조회한 객체의 속성을 바꾸고 await db.commit()만 하면 UPDATE가 실행된다.',
      answer: true,
      explanation: '맞아요. 변경 추적(Unit of Work)은 동기와 똑같이 동작해요. 속성 변경은 메모리 작업이라 await가 필요 없고, commit(내부 flush)에서 UPDATE가 나가요.',
    },
  ],
}

export default topic
