import type { Topic } from '../../types'

const topic: Topic = {
  id: 'fs-03-2-sqlalchemy-orm',
  track: 'fullstack',
  group: '03. FastAPI와 DB 연결',
  title: '3-2. SQLAlchemy ORM으로 바꾸기',
  order: 302,
  notionId: '406df951bf8080e5a83fc4f1907c46cf',
  addedAt: '2026-11-06',
  sections: [
    {
      title: 'SQL 문자열의 한계',
      slides: [
        {
          title: '오타는 실행해 봐야 알아요',
          blocks: [
            { type: 'say', text: '3-1에서는 `text("SELECT * FROM courses")`처럼 SQL을 **문자열**로 썼어요. 잘 동작하지만 API가 늘어나면 문제가 보여요.' },
            {
              type: 'list',
              items: [
                '`"SELECT * FROM cousres"` 같은 오타를 **실행해 봐야** 알아요 (에디터는 그냥 문자열로 봐요)',
                '결과가 딕셔너리라 `row["titel"]` 오타도 에디터가 못 잡아요',
                '테이블 구조가 SQL 파일과 파이썬 코드에 **따로** 흩어져 있어요',
              ],
            },
            { type: 'say', text: '**ORM**(Object-Relational Mapping)은 테이블을 **파이썬 클래스**로, 행을 **객체**로 다루게 해 줘요. SQL은 SQLAlchemy가 대신 만들어요. React 트랙 2-3의 "TypeScript가 오타를 쓰는 순간 잡아 준다"를 DB 코드에 적용하는 셈이에요.' },
          ],
        },
      ],
    },
    {
      title: '모델 클래스',
      slides: [
        {
          title: '테이블을 클래스로',
          blocks: [
            {
              type: 'code',
              code: `from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

class Base(DeclarativeBase):          # 모든 모델의 뿌리
    pass

class Course(Base):
    __tablename__ = "courses"         # 어느 테이블과 연결되는지

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str]
    instructor: Mapped[str]
    price: Mapped[int]`,
            },
            {
              type: 'list',
              items: [
                '`__tablename__`: 2-4에서 만든 **courses 테이블**과 연결',
                '`Mapped[int]`: "이 속성은 DB 열이고, 파이썬에서는 int예요"',
                '`mapped_column(primary_key=True)`: 기본 키 표시',
                '`Mapped[str]`만 쓰면 NOT NULL 열로 봐요. 비워도 되는 열은 `Mapped[str | None]`',
              ],
            },
            { type: 'note', tone: 'tip', text: '클래스 이름은 단수(`Course`, 강의 하나), 테이블 이름은 복수(`courses`, 강의들)로 짓는 게 흔한 관례예요. 객체 하나 = 행 하나니까요.' },
          ],
        },
      ],
    },
    {
      title: 'Session으로 조회하기',
      slides: [
        {
          title: 'select()와 scalars()',
          blocks: [
            {
              type: 'code',
              code: `from sqlalchemy import select
from sqlalchemy.orm import Session, sessionmaker

SessionLocal = sessionmaker(bind=engine)       # 세션 공장 (engine은 3-1 그대로)

with SessionLocal() as db:
    stmt = select(Course).order_by(Course.id)  # SELECT * FROM courses ORDER BY id
    courses = db.scalars(stmt).all()           # Course 객체들의 리스트
    print(courses[0].title)                    # 객체.속성으로 꺼냄 → 오타면 에디터가 빨간 줄`,
            },
            {
              type: 'table',
              head: ['3-1 (text SQL)', '3-2 (ORM)'],
              rows: [
                ['`text("SELECT * FROM courses ORDER BY id")`', '`select(Course).order_by(Course.id)`'],
                ['`conn.execute(...).mappings()`', '`db.scalars(...).all()`'],
                ["`row[\"title\"]`", '`course.title`'],
              ],
            },
            { type: 'say', text: '**Session**은 3-1의 connection을 한 단계 감싼 "작업 단위"예요. 객체를 불러오고, 바꾸고, `db.commit()`으로 한꺼번에 확정해요. 3-1의 트랜잭션 원리는 그대로예요.' },
          ],
        },
        {
          title: '추가도 객체로',
          blocks: [
            { type: 'code', code: `with SessionLocal() as db:
    course = Course(title="SQL 기초", instructor="클로드", price=22000)   # id는 안 줌 (DB가)
    db.add(course)
    db.commit()            # ← 3-1과 마찬가지로 commit이 있어야 저장
    print(course.id)       # 저장 후 DB가 매긴 id가 채워짐` },
            { type: 'ask', q: 'echo=True로 보면 db.add() 줄에서는 INSERT가 안 찍히고, db.commit() 줄에서 찍혀요. 왜일까요?', a: 'Session은 add한 객체를 **모아 뒀다가** commit(또는 조회) 직전에 한꺼번에 DB로 보내요. 이걸 **flush**라고 해요. 그래서 "add = 장바구니에 담기, commit = 결제"예요. commit을 빼먹으면 3-1처럼 아무것도 저장되지 않아요.' },
          ],
        },
      ],
    },
    {
      title: 'Depends로 요청마다 세션',
      slides: [
        {
          title: 'get_db 의존성',
          blocks: [
            {
              type: 'code',
              code: `from fastapi import Depends

def get_db():
    db = SessionLocal()
    try:
        yield db          # 요청 처리 함수에 세션을 빌려줌
    finally:
        db.close()        # 요청이 끝나면 반드시 반납

@app.get("/courses")
def get_courses(db: Session = Depends(get_db)):
    return db.scalars(select(Course).order_by(Course.id)).all()`,
            },
            { type: 'say', text: '`Depends(get_db)`는 FastAPI에게 "이 함수를 실행하기 **전에** get_db를 불러서 세션을 만들어 넣어 주고, **끝나면** 정리해 줘"라고 부탁하는 거예요. 이걸 **의존성 주입**이라고 해요.' },
            { type: 'note', tone: 'analogy', text: '식당에서 손님(요청)이 올 때마다 **깨끗한 접시(세션)** 를 하나 내주고, 식사가 끝나면 **수거**하는 거예요. 접시를 손님끼리 같이 쓰지 않아요. `yield` 다음의 `finally`가 수거 담당이라, 처리 중 에러가 나도 세션은 반드시 닫혀요.' },
          ],
        },
        {
          title: '그런데 이대로 돌려주면',
          blocks: [
            { type: 'say', text: '위 코드는 SQLAlchemy의 `Course` **객체**를 그대로 return 해요. FastAPI는 이걸 JSON으로 바꿔야 하는데, ORM 객체 안에는 DB 연결 상태 같은 **내부 정보**도 붙어 있어요. FastAPI가 어떤 속성만 내보내야 할지 확실히 모르면 에러가 나거나, 보내면 안 되는 값까지 나갈 수 있어요.' },
            { type: 'say', text: '그래서 "응답은 **이 모양**으로만 내보내"라고 정해 주는 게 다음 수업의 **Pydantic 응답 모델**이에요.\n\n수업 끝! 확인 문제 가요.' },
          ],
        },
      ],
    },
  ],
  questions: [
    {
      id: 'fs03-2-q1',
      source: 'SQL 문자열의 한계',
      type: 'mcq',
      question: 'ORM을 쓰는 가장 큰 장점은?',
      choices: ['DB가 필요 없어진다', '테이블을 클래스·객체로 다뤄 에디터가 오타를 잡고, SQL은 ORM이 만들어 준다', 'SQL이 더 빨라진다', 'CORS가 해결된다'],
      answer: 1,
      explanation: '문자열 SQL은 실행해 봐야 오타를 알지만, 모델 클래스는 에디터가 course.titel 같은 실수를 바로 잡아 줘요.',
    },
    {
      id: 'fs03-2-q2',
      source: '모델 클래스',
      type: 'short',
      question: 'SQLAlchemy 모델 클래스에서 연결할 DB 테이블 이름을 적는 속성은? (__________)',
      answer: ['__tablename__', 'tablename'],
      explanation: '__tablename__ = "courses"로 2-4에서 만든 테이블과 연결해요.',
    },
    {
      id: 'fs03-2-q3',
      source: 'Session으로 조회하기',
      type: 'mcq',
      question: 'select(Course).order_by(Course.id) 의 결과를 Course 객체 리스트로 받는 코드는?',
      choices: ['db.execute(stmt).mappings()', 'db.scalars(stmt).all()', 'db.add(stmt)', 'db.commit(stmt)'],
      answer: 1,
      explanation: 'scalars()는 행마다 Course 객체 하나를 꺼내 줘요. course.title처럼 속성으로 써요.',
    },
    {
      id: 'fs03-2-q4',
      source: 'Session으로 조회하기',
      type: 'ox',
      question: 'db.add(course)만 하고 commit을 하지 않아도 세션이 닫히면 자동으로 저장된다.',
      answer: false,
      explanation: 'add는 장바구니에 담기, commit이 결제예요. commit 없이 닫히면 저장되지 않아요.',
    },
    {
      id: 'fs03-2-q5',
      source: 'Depends로 요청마다 세션',
      type: 'mcq',
      question: 'get_db에서 yield db 뒤의 finally: db.close() 가 하는 일은?',
      choices: ['DB를 삭제한다', '요청 처리가 끝나면(에러가 나도) 세션을 반드시 닫아 반납한다', 'commit을 한다', 'CORS를 설정한다'],
      answer: 1,
      explanation: 'Depends가 요청 전에 세션을 만들어 주고, 끝나면 finally로 정리해요. 요청마다 깨끗한 세션이에요.',
    },
  ],
}

export default topic
