import type { Topic } from '../../types'

const topic: Topic = {
  id: 'pr-01-design-to-model',
  track: 'backend',
  group: '종합 실전',
  title: '실전 ①: 요구사항 → ERD → SQLAlchemy 모델',
  order: 201,
  sections: [
    {
      title: '요구사항에서 엔티티 찾기',
      points: [
        '예제 서비스: "복습 기록 앱". 사용자는 가입·로그인한다. 문제 세트(덱)를 만들고, 덱에는 문제가 여러 개 있다. 사용자는 문제를 풀고, 풀 때마다 결과(정답 여부, 시각)가 남는다. 문제에는 태그를 여러 개 붙일 수 있다.',
        '명사 → 엔티티 후보: 사용자(User), 덱(Deck), 문제(Question), 풀이 기록(Attempt), 태그(Tag).',
        '관계 질문(양방향): 사용자 1 - 덱 N, 덱 1 - 문제 N, 사용자 1 - 풀이 N, 문제 1 - 풀이 N, 문제 N - 태그 M(→ question_tags 관계 엔터티).',
        '"풀이 기록"은 사용자와 문제 사이의 관계이자 그 자체로 사실(정답 여부, 시각)을 가진 엔티티다. 같은 문제를 여러 번 풀 수 있으므로 (user_id, question_id)는 유일하지 않다. 대리키 id를 둔다.',
      ],
    },
    {
      title: '정규화와 키 결정',
      points: [
        '문제 테이블에 덱 이름을 복사하지 않는다(덱 이름은 덱에 대한 사실, 3NF). 문제에 태그를 "a,b"로 넣지 않는다(1NF) → question_tags.',
        '키: 모든 엔티티에 대리키 id(BIGINT). 업무상 유일한 값에는 UNIQUE: users.email, tags.name, question_tags(question_id, tag_id).',
        '필수 관계는 FK NOT NULL: questions.deck_id, attempts.user_id, attempts.question_id. 삭제 규칙: 덱 삭제 → 문제 CASCADE, 문제 삭제 → 풀이 기록 CASCADE(또는 기록 보존이 중요하면 소프트 삭제).',
        '비정규화 후보: 사용자별 "문제 상태(복습 단계, 다음 복습일)"는 풀이 기록에서 계산할 수 있지만, 매번 계산하면 무거워 user_question_states(user_id, question_id, box, next_due) 테이블을 두고 풀이 저장과 같은 트랜잭션에서 갱신한다. (user_id, question_id) UNIQUE.',
      ],
      code: `users(id PK, email UNIQUE, hashed_password, created_at)
decks(id PK, owner_id FK→users, title, created_at)
questions(id PK, deck_id FK→decks CASCADE, prompt, answer)
tags(id PK, name UNIQUE)
question_tags(question_id FK, tag_id FK, PK(question_id, tag_id))
attempts(id PK, user_id FK, question_id FK, is_correct, answered_at)
user_question_states(user_id FK, question_id FK, box, next_due, UNIQUE(user_id, question_id))`,
    },
    {
      title: '인덱스 설계',
      points: [
        '자주 실행될 쿼리를 먼저 적는다: ① 내 덱 목록(owner_id) ② 덱의 문제 목록(deck_id) ③ 오늘 복습할 문제(user_id, next_due <= 오늘) ④ 내 최근 풀이 기록(user_id, answered_at 최신순) ⑤ 태그로 문제 찾기(tag_id).',
        '인덱스: decks(owner_id), questions(deck_id), user_question_states(user_id, next_due)(등호 → 범위 순), attempts(user_id, answered_at), question_tags(tag_id)(PK가 (question_id, tag_id)라 tag_id 단독 조회용).',
        'FK 컬럼은 대부분 인덱스가 필요하다(JOIN과 부모 삭제 시 검사). MySQL InnoDB는 FK에 인덱스를 자동으로 만들지만 PostgreSQL은 만들지 않는다.',
      ],
    },
    {
      title: 'SQLAlchemy 모델로 옮기기',
      points: [
        'DeclarativeBase 상속, Mapped 타입 힌트로 NULL 여부 표현, mapped_column으로 제약, relationship + back_populates로 양방향 관계.',
        'cascade="all, delete-orphan"은 생명 주기를 함께하는 관계(덱 → 문제)에만. FK의 ondelete="CASCADE"와 relationship의 passive_deletes=True를 함께 쓰면 DB가 삭제를 처리한다.',
        '__table_args__로 복합 UNIQUE·인덱스를 선언한다.',
        '다대다 태그는 secondary 테이블(Table 객체)로 간단히 표현할 수 있다. 연결에 추가 정보가 생기면 모델 클래스로 승격한다.',
      ],
      code: `question_tags = Table(
    "question_tags", Base.metadata,
    Column("question_id", ForeignKey("questions.id", ondelete="CASCADE"), primary_key=True),
    Column("tag_id", ForeignKey("tags.id", ondelete="CASCADE"), primary_key=True, index=True),
)

class Deck(Base):
    __tablename__ = "decks"
    id: Mapped[int] = mapped_column(primary_key=True)
    owner_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    title: Mapped[str] = mapped_column(String(100))
    questions: Mapped[list["Question"]] = relationship(
        back_populates="deck", cascade="all, delete-orphan", passive_deletes=True
    )

class Question(Base):
    __tablename__ = "questions"
    id: Mapped[int] = mapped_column(primary_key=True)
    deck_id: Mapped[int] = mapped_column(ForeignKey("decks.id", ondelete="CASCADE"), index=True)
    prompt: Mapped[str] = mapped_column(Text)
    answer: Mapped[str] = mapped_column(Text)
    deck: Mapped["Deck"] = relationship(back_populates="questions")
    tags: Mapped[list["Tag"]] = relationship(secondary=question_tags)

class UserQuestionState(Base):
    __tablename__ = "user_question_states"
    __table_args__ = (
        UniqueConstraint("user_id", "question_id"),
        Index("ix_uqs_user_due", "user_id", "next_due"),
    )
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    question_id: Mapped[int] = mapped_column(ForeignKey("questions.id", ondelete="CASCADE"))
    box: Mapped[int] = mapped_column(default=0)
    next_due: Mapped[date]`,
    },
  ],
  questions: [
    {
      id: 'pr-01-01', type: 'mcq', source: '요구사항에서 엔티티 찾기',
      question: '"사용자는 같은 문제를 여러 번 풀 수 있고, 풀 때마다 정답 여부와 시각이 남는다." 풀이 기록 테이블의 기본키로 알맞은 것은?',
      choices: ['(user_id, question_id) 복합 기본키', 'answered_at', 'question_id', '대리키 id (그리고 user_id, question_id는 일반 FK)'],
      answer: 3,
      choiceExplanations: [
        '같은 사용자가 같은 문제를 두 번 풀면 키가 중복돼 저장할 수 없어요.',
        '시각은 겹칠 수 있고 식별자로 부적절해요.',
        '한 문제의 풀이가 하나만 남게 돼요.',
        '정답. 반복 가능한 사건(event)은 대리키로 행마다 식별해요.',
      ],
      explanation: '"관계"인데 반복 가능하면 조합 키가 유일하지 않아요. 좋아요(한 번만)는 (user_id, post_id) UNIQUE, 풀이 기록(여러 번)은 대리키. 요구사항의 "여러 번"이라는 단어 하나가 키를 바꿔요.',
    },
    {
      id: 'pr-01-02', type: 'mcq', source: '요구사항에서 엔티티 찾기',
      question: '문제와 태그의 관계를 표현하는 올바른 방법은?',
      choices: ['questions.tags에 "sql,index" 문자열', 'tags.question_id', 'question_tags(question_id, tag_id) 관계 엔터티', 'questions에 tag1, tag2 컬럼'],
      answer: 2,
      choiceExplanations: [
        '1NF 위반(비스칼라 값)이에요.',
        '태그 하나가 문제 하나에만 붙어요.',
        '정답. 다대다는 관계 엔터티로 풀어요.',
        '반복 그룹이에요.',
      ],
      explanation: '양방향 질문: 문제 하나에 태그 여러 개? 예. 태그 하나에 문제 여러 개? 예. → 다대다 → 관계 엔터티 + (question_id, tag_id) 기본키.',
    },
    {
      id: 'pr-01-03', type: 'short', source: '요구사항에서 엔티티 찾기',
      question: '"사용자 1명은 덱 여러 개를 가진다"를 표현하려면 외래키 owner_id를 어느 테이블에 두나요? (영어 테이블 이름)',
      answer: ['decks', 'deck'],
      explanation: 'decks.owner_id예요. 1:N에서는 N 쪽에 FK. 덱은 반드시 주인이 있어야 하니 NOT NULL로 둬요.',
    },
    {
      id: 'pr-01-04', type: 'mcq', source: '정규화와 키 결정',
      question: '문제 목록 화면에 덱 이름이 필요하다고 questions 테이블에 deck_title 컬럼을 추가하자는 의견이 나왔다. 설계 관점의 판단은?',
      choices: ['덱 이름은 덱에 대한 사실이라 3NF 위반이다. 먼저 JOIN이나 selectinload로 해결하고, 측정된 성능 문제가 있을 때만 동기화 계획과 함께 비정규화한다', '좋다. 항상 그렇게 한다', '덱 테이블을 없앤다', '덱 이름을 문제 본문에 적는다'],
      answer: 0,
      choiceExplanations: [
        '정답. 정규화 우선, 비정규화는 근거와 함께.',
        '덱 이름을 바꿀 때 모든 문제 행을 고쳐야 해요(갱신 이상).',
        '데이터를 잃어요.',
        '더블 미닝과 다를 바 없어요.',
      ],
      explanation: '덱 하나에 문제 수백 개면 이름 변경 한 번이 수백 행 UPDATE가 돼요. 목록 화면은 덱을 한 번 조회하거나 관계 로딩으로 충분해요.',
    },
    {
      id: 'pr-01-05', type: 'mcq', source: '정규화와 키 결정',
      question: '사용자별 복습 상태(box, next_due)를 매번 풀이 기록에서 계산하지 않고 user_question_states에 저장했다. 이 결정의 성격과 반드시 지켜야 할 것은?',
      choices: ['정규화 / 아무것도', 'EAV / 속성을 행으로', '테이블 분할 / 연도별 테이블', '파생 데이터를 저장하는 비정규화 / 풀이 저장과 상태 갱신을 같은 트랜잭션에서 하고, (user_id, question_id) UNIQUE로 중복을 막는다'],
      answer: 3,
      choiceExplanations: [
        '풀이 기록에서 계산 가능한 값을 따로 저장했으니 비정규화예요.',
        '관계없는 패턴이에요.',
        '관계없는 패턴이에요.',
        '정답. 원본(attempts)과 파생(states)이 어긋나지 않게 함께 갱신해요.',
      ],
      explanation: '"오늘 복습할 문제"는 앱에서 가장 자주 실행되는 쿼리라, 상태를 미리 저장하고 (user_id, next_due) 인덱스로 바로 찾는 게 합리적이에요. 대신 동기화 책임을 코드 한 곳(서비스 함수)에 모아요.',
    },
    {
      id: 'pr-01-06', type: 'ox', source: '정규화와 키 결정',
      question: '대리키 id를 모든 테이블에 두었다면, users.email이나 tags.name에 따로 UNIQUE를 걸 필요는 없다.',
      answer: false,
      explanation: '대리키는 "행"을 구분할 뿐, 같은 이메일·같은 태그 이름이 중복 저장되는 걸 막지 못해요. 업무적으로 유일한 값에는 반드시 UNIQUE를 걸어요(8장 대리키 토픽).',
    },
    {
      id: 'pr-01-07', type: 'mcq', source: '인덱스 설계',
      question: '"오늘 복습할 문제" 쿼리 WHERE user_id = ? AND next_due <= ? 에 가장 알맞은 인덱스는?',
      choices: ['(next_due, user_id)', '(user_id, next_due)', '(box)', '(question_id)'],
      answer: 1,
      choiceExplanations: [
        '범위 컬럼이 앞이면 user_id 등호 조건을 효율적으로 못 써요.',
        '정답. 등호(user_id) → 범위(next_due) 순서라 해당 사용자의 구간을 바로 잘라 내요.',
        '조건에 없는 컬럼이에요.',
        '조건에 없는 컬럼이에요.',
      ],
      explanation: '복합 인덱스 원칙: = 조건 컬럼 먼저, 범위 조건 컬럼 나중. ORDER BY next_due까지 인덱스로 처리돼 정렬 비용도 없어요.',
    },
    {
      id: 'pr-01-08', type: 'short', source: '인덱스 설계',
      question: 'question_tags의 기본키가 (question_id, tag_id)일 때, "태그로 문제 찾기"(WHERE tag_id = ?)를 빠르게 하려면 어떤 컬럼에 인덱스를 추가하나요?',
      answer: ['tag_id'],
      explanation: 'tag_id 단독 인덱스(또는 (tag_id, question_id))예요. 기본키 (question_id, tag_id)는 왼쪽 접두어 규칙 때문에 tag_id만으로는 쓰기 어려워요. 관계 엔터티는 양방향 조회가 모두 필요하면 반대 방향 인덱스를 하나 더 둬요.',
    },
    {
      id: 'pr-01-09', type: 'mcq', source: 'SQLAlchemy 모델로 옮기기',
      question: 'Deck.questions에 cascade="all, delete-orphan"과 passive_deletes=True를 주고, questions.deck_id FK에 ondelete="CASCADE"를 줬다. 덱을 db.delete(deck)로 지우면?',
      choices: ['문제는 남는다', '에러가 난다', '덱이 지워지지 않는다', 'SQLAlchemy가 문제들을 하나씩 불러와 지우지 않고, DB의 ON DELETE CASCADE가 문제를 함께 삭제한다'],
      answer: 3,
      choiceExplanations: [
        'CASCADE가 설정돼 있어 함께 지워져요.',
        '설정이 일관돼 있어 정상 동작해요.',
        '정상적으로 지워져요.',
        '정답. passive_deletes=True는 "자식 삭제는 DB에 맡긴다"는 뜻이라 불필요한 SELECT·DELETE가 줄어요.',
      ],
      explanation: 'ORM cascade와 DB cascade를 함께 설계하면, ORM 경로·대량 delete 문·직접 SQL 어느 쪽으로 지워도 결과가 같아요(SQLAlchemy 수정·삭제 토픽 복습).',
    },
    {
      id: 'pr-01-10', type: 'mcq', source: 'SQLAlchemy 모델로 옮기기',
      question: '다음 중 NULL을 허용하는 컬럼 선언은?',
      choices: ['title: Mapped[str] = mapped_column(String(100))', 'memo: Mapped[str | None] = mapped_column(Text)', 'next_due: Mapped[date]', 'owner_id: Mapped[int] = mapped_column(ForeignKey("users.id"))'],
      answer: 1,
      choiceExplanations: [
        'Mapped[str]은 NOT NULL이에요.',
        '정답. | None이 NULL 허용이에요.',
        'Mapped[date]는 NOT NULL이에요.',
        'Mapped[int]라 NOT NULL(필수 관계)이에요.',
      ],
      explanation: '2.0 스타일에서는 타입 힌트가 제약을 정해요. 그래서 모델 코드만 읽어도 ERD의 필수/선택 관계가 보여요.',
    },
    {
      id: 'pr-01-11', type: 'short', source: 'SQLAlchemy 모델로 옮기기',
      question: 'SQLAlchemy 모델에서 복합 UNIQUE 제약이나 복합 인덱스를 선언하는 클래스 속성 이름은?',
      answer: ['__table_args__', 'table_args'],
      explanation: '__table_args__ = (UniqueConstraint("user_id", "question_id"), Index("ix_uqs_user_due", "user_id", "next_due")). 튜플이라 요소가 하나여도 끝에 쉼표가 필요해요.',
    },
    {
      id: 'pr-01-12', type: 'ox', source: 'SQLAlchemy 모델로 옮기기',
      question: '다대다 연결에 "태그를 붙인 사람·시각" 같은 정보가 추가로 필요해지면, secondary Table 대신 연결 모델 클래스로 승격하는 것이 자연스럽다.',
      answer: true,
      explanation: '맞아요. secondary는 순수 연결만 표현해요. 연결에 속성이 생기면 Association Object(연결 모델 클래스)로 만들고, 양쪽과 각각 일대다 관계를 맺어요(ER 다이어그램의 관계 엔터티와 같은 생각).',
    },
  ],
}

export default topic
