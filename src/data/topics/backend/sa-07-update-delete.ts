import type { Topic } from '../../types'

const topic: Topic = {
  id: 'sa-07-update-delete',
  track: 'backend',
  group: 'SQLAlchemy',
  title: 'SQLAlchemy 수정 · 삭제 · 트랜잭션',
  order: 47,
  sections: [
    {
      title: '객체를 바꿔서 수정하기',
      points: [
        '가장 기본적인 수정: 객체를 조회 → 속성 변경 → commit. 세션이 변경을 추적(dirty)하고 있다가 commit(flush) 때 바뀐 컬럼만 UPDATE 한다.',
        'PATCH API에서는 data = patch.model_dump(exclude_unset=True) 후 for key, value in data.items(): setattr(post, key, value) 로 보낸 필드만 반영한다.',
        '수정 전 권한 검사: 조회한 객체의 author_id가 현재 사용자와 같은지 확인하고, 아니면 403(또는 존재를 숨기려면 404).',
        '바뀐 값이 없으면 UPDATE가 아예 나가지 않는다. echo 로그로 확인할 수 있다.',
      ],
      code: `@router.patch("/{post_id}", response_model=PostRead)
def update_post(post_id: int, patch: PostUpdate, db: SessionDep, user: CurrentUser):
    post = db.get(Post, post_id)
    if post is None:
        raise HTTPException(404)
    if post.author_id != user.id:
        raise HTTPException(403)
    for key, value in patch.model_dump(exclude_unset=True).items():
        setattr(post, key, value)
    db.commit()
    db.refresh(post)
    return post`,
    },
    {
      title: '여러 행을 한 번에: update() · delete() 문',
      points: [
        '조건에 맞는 여러 행을 객체로 가져오지 않고 한 번에 바꾸려면 db.execute(update(Post).where(...).values(...)). SQL UPDATE 한 문장이다.',
        '삭제도 같다: db.execute(delete(Post).where(Post.created_at < 기준일)).',
        '이 방식은 빠르지만 세션에 이미 올라온 객체에는 변경이 바로 반영되지 않을 수 있다(SQLAlchemy가 synchronize_session으로 맞추려 시도한다). 또 ORM의 cascade, 이벤트 훅은 실행되지 않는다. DB의 ON DELETE CASCADE는 동작한다.',
        '조회수 증가처럼 동시에 여러 요청이 같은 값을 바꾸는 경우 values(views=Post.views + 1)로 DB가 계산하게 하면 "읽고-더하고-쓰기" 사이의 경쟁 조건(갱신 손실)을 피할 수 있다.',
      ],
      code: `from sqlalchemy import update, delete

# 조회수 +1 (원자적)
db.execute(update(Post).where(Post.id == post_id).values(views=Post.views + 1))

# 30일 지난 임시 글 삭제
db.execute(delete(Draft).where(Draft.created_at < cutoff))
db.commit()`,
    },
    {
      title: '객체 삭제와 소프트 삭제',
      points: [
        'db.delete(obj) → commit. ORM 삭제는 relationship의 cascade 설정(delete, delete-orphan)에 따라 자식도 함께 삭제한다.',
        'FK가 걸린 자식이 있는데 cascade도 ON DELETE도 없으면 IntegrityError가 나거나(FK 위반), ORM이 자식의 FK를 NULL로 바꾸려다 NOT NULL 위반이 난다.',
        '소프트 삭제(soft delete): 실제로 지우지 않고 deleted_at 같은 컬럼에 시각을 기록한다. 복구·감사 기록에 유리하지만, 모든 조회에 "삭제되지 않은 것만" 조건을 빠짐없이 걸어야 하고 UNIQUE 제약과 충돌할 수 있다(탈퇴한 이메일로 재가입).',
        '삭제 API는 보통 204(본문 없음)로 응답한다. 이미 없는 자원을 지우려 하면 404를 줄지, 멱등성을 강조해 204를 줄지 팀 규칙으로 정한다.',
      ],
      code: `@router.delete("/{post_id}", status_code=204)
def delete_post(post_id: int, db: SessionDep, user: CurrentUser):
    post = db.get(Post, post_id)
    if post is None:
        raise HTTPException(404)
    if post.author_id != user.id:
        raise HTTPException(403)
    db.delete(post)          # comments 는 cascade="all, delete-orphan" 이면 함께 삭제
    db.commit()`,
    },
    {
      title: '트랜잭션: 함께 성공하거나 함께 실패하기',
      points: [
        '트랜잭션은 여러 SQL을 하나의 작업 단위로 묶는다. 계좌 이체(A에서 빼고 B에 더하기)는 둘 다 되거나 둘 다 안 돼야 한다.',
        'SQLAlchemy 세션은 첫 SQL 실행 시 자동으로 트랜잭션을 시작하고, commit 또는 rollback 때 끝낸다(autobegin).',
        'with db.begin(): 블록은 정상 종료 시 commit, 예외 시 rollback을 자동으로 해 준다.',
        '중첩 일부 롤백이 필요하면 db.begin_nested()(SAVEPOINT)를 쓴다. 예: 여러 건 처리 중 실패한 건만 되돌리고 나머지는 계속.',
        '동시에 같은 행을 수정할 위험이 있으면 select(...).with_for_update() 로 행 잠금을 걸어 "읽고 판단하고 쓰기"를 보호한다(재고 차감). 잠금은 트랜잭션이 끝날 때 풀린다. 자세한 원리는 SQL 트랜잭션 토픽에서 다룬다.',
      ],
      code: `def transfer(db: Session, from_id: int, to_id: int, amount: int):
    with db.begin():                                    # 성공 commit / 실패 rollback
        src = db.scalar(select(Account).where(Account.id == from_id).with_for_update())
        dst = db.scalar(select(Account).where(Account.id == to_id).with_for_update())
        if src.balance < amount:
            raise ValueError("잔액 부족")                # → rollback
        src.balance -= amount
        dst.balance += amount`,
    },
  ],
  questions: [
    {
      id: 'sa-07-01', type: 'mcq', source: '객체를 바꿔서 수정하기',
      question: '다음 코드에서 실제로 DB에 UPDATE가 실행되는 시점은?',
      code: `post = db.get(Post, 1)
post.title = "새 제목"     # (A)
db.commit()               # (B)`,
      choices: ['(A) 속성을 바꾸는 순간', 'db.get 시점', '서버를 재시작할 때', '(B) commit(그 안의 flush) 시점'],
      answer: 3,
      choiceExplanations: [
        '속성 변경은 메모리에서만 일어나고, 세션이 "바뀜(dirty)"으로 표시해 둬요.',
        'get은 SELECT예요.',
        '관계없어요.',
        '정답. commit 직전 flush에서 바뀐 컬럼만 UPDATE posts SET title=? WHERE id=? 로 보내요.',
      ],
      explanation: 'ORM의 "변경 추적(Unit of Work)" 덕분에 save() 같은 메서드 없이 속성만 바꾸면 돼요. 그래서 db.add(post)를 다시 할 필요도 없어요(이미 세션에 있는 객체).\n단, 세션이 닫혀 detached 상태가 된 객체를 바꾸면 추적되지 않아요.',
    },
    {
      id: 'sa-07-02', type: 'mcq', source: '객체를 바꿔서 수정하기',
      question: 'PATCH API에서 setattr 반복문에 넣을 dict로 알맞은 것은?',
      choices: ['patch.model_dump()', 'patch.__dict__', 'patch.model_dump(exclude_unset=True)', 'dict(patch)'],
      answer: 2,
      choiceExplanations: [
        '보내지 않은 필드까지 None으로 덮어써요.',
        '내부 속성까지 섞일 수 있고, 보내지 않은 필드도 포함돼요.',
        '정답. 요청에 실제로 들어온 필드만 반영돼요.',
        '역시 모든 필드가 포함돼요.',
      ],
      explanation: 'PATCH의 핵심은 "보낸 것만 바꾼다"예요(HTTP 메서드 토픽 복습).\n추가로, 수정 가능한 필드만 PostUpdate 모델에 넣어 두면 author_id나 views 같은 필드를 setattr로 조작당할 일이 없어요.',
    },
    {
      id: 'sa-07-03', type: 'ox', source: '객체를 바꿔서 수정하기',
      question: '글 수정 API에서 "로그인했는지"만 확인하면 충분하고, 작성자 본인인지는 확인할 필요가 없다.',
      answer: false,
      explanation: '로그인만 확인하면 다른 사람의 글 id를 넣어 수정할 수 있어요. 이게 OWASP 1위 취약점인 "접근 통제 실패(IDOR)"의 대표 사례예요.\n조회 → 소유자 확인(post.author_id == user.id 또는 관리자) → 수정 순서를 지키세요. 조건을 쿼리에 넣는 방법도 있어요: where(Post.id == post_id, Post.author_id == user.id).',
    },
    {
      id: 'sa-07-04', type: 'mcq', source: '여러 행을 한 번에: update() · delete() 문',
      question: '인기 글 조회수를 올리는 코드다. 동시에 100명이 보면 100이 올라가지 않을 수 있는 코드는?',
      choices: [
        'post = db.get(Post, id); post.views = post.views + 1; db.commit()',
        'db.execute(update(Post).where(Post.id == id).values(views=Post.views + 1)); db.commit()',
        '둘 다 항상 정확하다',
        '둘 다 항상 틀린다',
      ],
      answer: 0,
      choiceExplanations: [
        '정답. 두 요청이 같은 값(예: 10)을 읽고 각자 11을 쓰면 1만 오르는 "갱신 손실"이 생겨요.',
        'DB가 SET views = views + 1을 원자적으로 계산해서 동시 요청에도 정확해요.',
        '첫 번째는 동시성 문제가 있어요.',
        '두 번째는 정확해요.',
      ],
      explanation: '"읽고(read) → 파이썬에서 계산 → 쓰기(write)"는 그 사이에 다른 요청이 끼어들 수 있어요. 값 증감은 DB에서 계산하게(views = views + 1) 하거나, 행 잠금(with_for_update)으로 보호해요.\n조회수처럼 아주 잦은 증가는 Redis에 모았다가 주기적으로 DB에 반영하기도 해요.',
    },
    {
      id: 'sa-07-05', type: 'short', source: '여러 행을 한 번에: update() · delete() 문',
      question: '조건에 맞는 여러 행을 객체로 불러오지 않고 한 문장으로 수정하는 SQLAlchemy 함수는? db.execute(______(Post).where(...).values(...))',
      answer: ['update', 'update()'],
      explanation: 'from sqlalchemy import update → update(Post).where(...).values(...).\n객체 하나하나를 불러와 바꾸면 SELECT N번 + UPDATE N번이지만, update 문은 UPDATE 1번이에요. 대량 처리(일괄 숨김, 상태 변경)에 써요.',
    },
    {
      id: 'sa-07-06', type: 'mcq', source: '여러 행을 한 번에: update() · delete() 문',
      question: 'db.execute(delete(Post).where(...))로 글을 지웠다. relationship에 cascade="all, delete-orphan"을 둔 댓글은 어떻게 될까? (DB의 FK에는 ON DELETE 설정 없음)',
      choices: ['ORM cascade로 함께 삭제된다', '댓글의 post_id가 NULL이 된다', 'ORM cascade는 실행되지 않아, 댓글의 FK 때문에 삭제가 실패(IntegrityError)할 수 있다', '댓글이 다른 글로 옮겨진다'],
      answer: 2,
      choiceExplanations: [
        'ORM cascade는 db.delete(obj)처럼 객체 단위로 지울 때만 동작해요.',
        'ORM이 관여하지 않으니 NULL로 바꾸지도 않아요.',
        '정답. 대량 delete 문은 SQL을 바로 보내서 ORM이 관여하지 않아요. DB 차원의 ON DELETE CASCADE를 두면 해결돼요.',
        '그런 동작은 없어요.',
      ],
      explanation: 'ORM cascade(파이썬) vs DB cascade(ON DELETE CASCADE): ORM cascade는 객체 삭제 경로에서만, DB cascade는 어떤 경로든 동작해요. 둘 다 두면 가장 안전해요(relationship에 passive_deletes=True를 주면 ORM이 DB cascade에 맡겨 추가 쿼리를 줄여요).',
    },
    {
      id: 'sa-07-07', type: 'mcq', source: '객체 삭제와 소프트 삭제',
      question: '소프트 삭제(deleted_at)를 도입했을 때 생기는 일이 아닌 것은?',
      choices: ['삭제된 데이터를 복구할 수 있다', '디스크 공간이 자동으로 줄어든다', '모든 조회 쿼리에 deleted_at IS NULL 조건을 잊지 않고 걸어야 한다', 'UNIQUE(email) 때문에 탈퇴한 이메일로 재가입이 막힐 수 있다'],
      answer: 1,
      choiceExplanations: [
        '장점이에요.',
        '정답(아님). 행이 남아 있으니 공간은 그대로예요. 오래된 소프트 삭제 데이터를 주기적으로 정리하기도 해요.',
        '비용이에요. 한 곳만 빠뜨려도 삭제된 글이 노출돼요.',
        '비용이에요. 부분 인덱스(WHERE deleted_at IS NULL)나 복합 UNIQUE로 해결해요.',
      ],
      explanation: '소프트 삭제는 공짜가 아니에요. 복구·감사가 정말 필요한 데이터에만 쓰고, 조건 누락을 막기 위해 공통 쿼리 함수나 기본 필터를 두는 게 좋아요.\n법적으로 "진짜 삭제"가 요구되는 개인정보는 소프트 삭제만으로는 부족해요.',
    },
    {
      id: 'sa-07-08', type: 'short', source: '객체 삭제와 소프트 삭제',
      question: '조회한 객체 하나를 삭제 대상으로 표시하는 세션 메서드는? (그다음 commit) db.______(post)',
      answer: ['delete', 'delete()'],
      explanation: 'db.delete(post) → db.commit(). 이 경로에서는 relationship의 cascade 설정이 적용돼요.\n이름이 같은 sqlalchemy.delete(Post)(대량 삭제 문)와 헷갈리지 마세요. 하나는 세션 메서드(객체), 하나는 SQL 문 생성 함수예요.',
    },
    {
      id: 'sa-07-09', type: 'mcq', source: '트랜잭션: 함께 성공하거나 함께 실패하기',
      question: '계좌 이체에서 출금은 성공하고 입금 직전에 서버 에러가 났다. 올바르게 설계된 트랜잭션이라면?',
      choices: ['출금만 반영된다', '둘 다 취소되어(rollback) 이체 전 상태로 돌아간다', '입금만 반영된다', '관리자가 직접 고쳐야 한다'],
      answer: 1,
      choiceExplanations: [
        '그러면 돈이 사라져요. 트랜잭션을 쓰는 이유가 이걸 막는 거예요.',
        '정답. 원자성(Atomicity): 전부 성공하거나 전부 실패.',
        '입금은 실행되지도 않았어요.',
        '트랜잭션이 자동으로 되돌려요.',
      ],
      explanation: '트랜잭션의 ACID 중 A(원자성)예요. 한 요청의 여러 변경은 하나의 commit으로 묶고, 중간에 commit을 하지 않아야 해요. 함수마다 commit을 해 버리면 일부만 반영되는 상태가 생겨요.\n그래서 "commit은 요청의 마지막(또는 서비스 함수의 경계)에서 한 번"이 좋은 습관이에요.',
    },
    {
      id: 'sa-07-10', type: 'mcq', source: '트랜잭션: 함께 성공하거나 함께 실패하기',
      question: 'with db.begin(): 블록 안에서 예외가 나면?',
      choices: ['블록 안의 변경이 commit된다', '자동으로 rollback되고 예외는 밖으로 다시 전달된다', '예외가 무시된다', '세션이 영원히 잠긴다'],
      answer: 1,
      choiceExplanations: [
        '예외 시에는 commit하지 않아요.',
        '정답. 정상 종료면 commit, 예외면 rollback 후 예외를 그대로 던져요.',
        '예외는 삼키지 않아요. 호출한 쪽(또는 FastAPI)이 처리해요.',
        '트랜잭션이 끝나며 잠금도 풀려요.',
      ],
      explanation: 'with db.begin()은 try/commit/except rollback/raise를 대신 써 주는 문법이에요. "트랜잭션 경계"가 코드 들여쓰기로 보여서 읽기 좋아요.\n주의: 이미 트랜잭션이 시작된 세션(autobegin 이후)에서 begin()을 다시 부르면 에러가 나요. 세션을 만든 직후 쓰거나 begin_nested()를 써요.',
    },
    {
      id: 'sa-07-11', type: 'short', source: '트랜잭션: 함께 성공하거나 함께 실패하기',
      question: '재고 차감 전에 해당 상품 행을 다른 트랜잭션이 동시에 수정하지 못하게 잠그는 select 옵션은? select(Product).where(...).______________()',
      answer: ['with_for_update', 'with_for_update()'],
      explanation: '.with_for_update() → SQL SELECT ... FOR UPDATE. 이 트랜잭션이 끝날 때까지 다른 트랜잭션은 그 행을 수정하거나 FOR UPDATE로 읽지 못하고 기다려요.\n잠금은 짧게 쓰는 게 원칙이에요. 잠근 채로 외부 API를 호출하면 다른 요청이 줄줄이 기다리게 돼요(SQL 트랜잭션·락 토픽).',
    },
    {
      id: 'sa-07-12', type: 'ox', source: '트랜잭션: 함께 성공하거나 함께 실패하기',
      question: 'SAVEPOINT(begin_nested)를 쓰면 큰 트랜잭션 안에서 일부 작업만 되돌리고 나머지는 계속 진행할 수 있다.',
      answer: true,
      explanation: '맞아요. 예: 1,000건 가져오기 중 중복 1건만 되돌리고 나머지는 계속 저장.\nfor row in rows:\n    try:\n        with db.begin_nested():\n            db.add(Item(**row))\n    except IntegrityError:\n        pass  # 이 건만 롤백\ndb.commit()',
    },
  ],
}

export default topic
