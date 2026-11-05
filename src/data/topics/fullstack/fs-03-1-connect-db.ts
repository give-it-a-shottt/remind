import type { Topic } from '../../types'

const topic: Topic = {
  id: 'fs-03-1-connect-db',
  track: 'fullstack',
  group: '03. FastAPI와 DB 연결',
  title: '3-1. FastAPI와 Postgres 연결하기',
  order: 301,
  notionId: '402df951bf8080f996c8da2ebbd32a9e',
  addedAt: '2026-11-06',
  sections: [
    {
      title: '번역가와 전화선',
      slides: [
        {
          title: 'FastAPI와 DB 사이에 필요한 것',
          blocks: [
            { type: 'say', text: '3장에서는 드디어 FastAPI가 코드에 적힌 고정 데이터 대신 **Postgres의 courses 테이블**에서 강의를 읽어 와요.\n\n파이썬과 DB 사이에는 두 가지 도구가 필요해요.' },
            {
              type: 'table',
              head: ['도구', '역할', '비유'],
              rows: [
                ['**SQLAlchemy** (ORM)', '파이썬 코드 ↔ SQL 문장 바꾸기', '번역가'],
                ['**psycopg** (드라이버)', 'DB와 실제로 연결을 맺고 SQL을 보내고 결과를 받아 옴', '전화선'],
              ],
            },
            { type: 'ask', q: 'SQLAlchemy만 설치하고 psycopg는 안 깔면 어떻게 될까요?', a: 'SQL 문장은 만들 수 있지만 **DB까지 전달할 수단이 없어요.** 통역사가 있어도 전화가 연결돼 있지 않으면 말이 안 전해지죠. 그래서 둘 다 설치해요: `uv add sqlalchemy "psycopg[binary]"`' },
          ],
        },
      ],
    },
    {
      title: '접속 URL 다섯 칸',
      slides: [
        {
          title: '누구:비번@어디:몇호/어느DB',
          blocks: [
            { type: 'code', code: `postgresql+psycopg://postgres:inflearn1234@localhost:5433/postgres

나눠 보면
postgresql      ← DB 종류
+psycopg        ← 드라이버
://postgres     ← 사용자
:inflearn1234   ← 비밀번호
@localhost      ← 주소
:5433           ← 포트 (바깥쪽, 2-3)
/postgres       ← DB 이름` },
            { type: 'say', text: '`@` 앞은 "**누구인지**(아이디:비밀번호)", `@` 뒤는 "**어디로 가는지**(건물:호수/방)"예요. 2-3에서 compose에 적은 값들이 그대로 들어가요.' },
          ],
        },
        {
          title: '주소는 localhost? db?',
          blocks: [
            { type: 'say', text: '여기서 많이들 헷갈려요. compose에 서비스 이름을 `db`라고 했으니 주소에 `db`를 써야 할까요?' },
            {
              type: 'table',
              head: ['FastAPI가 도는 곳', 'DB 주소', '포트'],
              rows: [
                ['내 노트북 (uvicorn 직접 실행) — **지금 우리**', '`localhost`', '`5433` (바깥쪽)'],
                ['같은 compose 안의 다른 컨테이너', '`db` (서비스 이름)', '`5432` (안쪽)'],
              ],
            },
            { type: 'say', text: '`db`라는 이름표는 **같은 compose로 띄운 컨테이너끼리만** 알아들어요. 우리 FastAPI는 컨테이너 밖 노트북에서 돌고 있으니 "이 컴퓨터 자신"인 `localhost`와 바깥 포트 5433을 써요.' },
            { type: 'note', tone: 'warn', text: '나중에 FastAPI도 컨테이너로 넣으면, 그 안에서 `localhost`는 **FastAPI 컨테이너 자기 자신**이에요. 거기엔 Postgres가 없으니 연결 거부가 나요. 그때는 `db:5432`로 바꿔요. **"그 코드가 어디서 도는가"** 가 주소를 정해요.' },
          ],
        },
      ],
    },
    {
      title: 'engine과 커넥션 풀',
      slides: [
        {
          title: 'DB에서 강의 읽어 오기',
          blocks: [
            {
              type: 'code',
              code: `from sqlalchemy import create_engine, text

# 서버 켤 때 한 번만 만든다
engine = create_engine(
    "postgresql+psycopg://postgres:inflearn1234@localhost:5433/postgres", echo=True)

@app.get("/courses")
def get_courses():
    with engine.connect() as conn:                          # 보관함에서 연결 하나 빌리기
        result = conn.execute(text("SELECT * FROM courses ORDER BY id;"))
        return [dict(row) for row in result.mappings()]     # 행마다 열 이름표 붙이기`,
            },
            {
              type: 'list',
              items: [
                '**engine**: 접속 URL을 들고 연결 **보관함(커넥션 풀)** 을 관리하는 접속 담당자. 앱에 **하나**',
                '`with engine.connect() as conn`: 보관함에서 연결을 빌려 쓰고, 블록이 끝나면 **반납**',
                '`text("...")`: "이 문자열은 SQL이에요"라는 포장지',
                '`.mappings()`: DB 행 `(1, \'파이썬\', ...)`에 `{\'id\': 1, \'title\': ...}`처럼 **열 이름을 키로** 붙여 줌. 이름표가 없으면 프론트에서 `course.title`로 못 꺼내요',
              ],
            },
          ],
        },
        {
          title: '인사말 로그가 한 번만 찍히는 이유',
          blocks: [
            { type: 'say', text: '`echo=True`로 켜 두면 SQLAlchemy가 보내는 SQL이 터미널에 다 찍혀요. 새로고침을 세 번 했더니 이상한 게 보여요.' },
            { type: 'code', code: `# 첫 요청
select pg_catalog.version()      ← 처음 연결할 때 하는 인사말 (버전 확인)
SELECT * FROM courses ORDER BY id;
# 두 번째, 세 번째 요청
SELECT * FROM courses ORDER BY id;   ← 인사말 없이 바로` },
            { type: 'ask', q: '왜 인사말은 첫 요청에만 찍힐까요?', a: '`with` 블록이 끝나도 연결을 **끊지 않고 보관함에 반납**하기 때문이에요. 다음 요청은 이미 인사를 마친 연결을 **다시 빌려** 써요. DB 연결을 새로 맺는 건 비싸서(네트워크 왕복, 인증), 미리 열어 두고 돌려 쓰는 게 **커넥션 풀**이에요.' },
            { type: 'note', tone: 'warn', text: '그래서 engine은 파일 맨 위에서 **한 번만** 만들어요. 요청마다 `create_engine`을 하면 풀이 매번 새로 생겨서 연결 비용을 계속 치르고, 사람이 몰리면 DB의 최대 연결 수를 넘길 수도 있어요.' },
          ],
        },
      ],
    },
    {
      title: '트랜잭션: commit을 안 하면',
      slides: [
        {
          title: '에러 없이 사라진 INSERT',
          blocks: [
            { type: 'code', code: `with engine.connect() as conn:
    conn.execute(text("INSERT INTO courses (title, instructor, price) VALUES ('고장실험', '나', 0);"))
# 에러 없음. 그런데 SELECT 해 보면 '고장실험'이 없다!` },
            { type: 'code', code: `# echo 로그
BEGIN (implicit)        ← 작업 묶음 시작 (SQLAlchemy가 알아서)
INSERT INTO courses ...
ROLLBACK                ← 묶음을 되돌림!` },
            { type: 'say', text: 'SQLAlchemy는 첫 SQL을 실행할 때 **트랜잭션**(작업 묶음)을 자동으로 시작해요. 트랜잭션은 **COMMIT**(확정)으로 끝나야 저장되고, **ROLLBACK**(되돌리기)으로 끝나면 없던 일이 돼요. commit 없이 `with` 블록이 끝나면 SQLAlchemy가 **ROLLBACK**을 보내요.' },
            { type: 'note', tone: 'analogy', text: '장바구니에 담고(INSERT) **결제 버튼(commit)** 을 안 누르고 창을 닫으면 주문이 없죠. 엑셀에 다 쳐 놓고 Ctrl+S를 안 누르면 날아가는 것과 같아요.' },
          ],
        },
        {
          title: 'commit과 begin',
          blocks: [
            {
              type: 'code',
              code: `# 방법 1: 직접 확정
with engine.connect() as conn:
    conn.execute(text("INSERT ..."))
    conn.commit()                       # ← 이 줄이 있어야 저장

# 방법 2: 성공하면 자동 확정, 에러면 자동 취소
with engine.begin() as conn:
    conn.execute(text("INSERT ..."))`,
            },
            { type: 'say', text: '나중에 수강 신청처럼 "포인트 차감 + 신청 기록"을 **둘 다 하거나 둘 다 안 하거나** 해야 하는 작업이 바로 이 원리를 써요. 하나만 되고 하나가 실패하면 돈만 빠지는 사고가 나니까요.' },
            { type: 'note', tone: 'tip', text: 'ROLLBACK된 INSERT도 **id 번호표는 소비**해요. 그래서 다음에 저장된 행의 id가 4가 아니라 7일 수 있어요. 2-4에서 "id에 빈 번호가 생겨도 정상"이라고 한 이유예요.' },
          ],
        },
      ],
    },
    {
      title: 'SQL에 값을 끼울 때는 파라미터로',
      slides: [
        {
          title: 'f-string으로 붙이면 위험해요',
          blocks: [
            {
              type: 'code',
              code: `course_id = request_value

# ❌ 문자열에 직접 붙이기
conn.execute(text(f"SELECT * FROM courses WHERE id = {course_id}"))
# course_id 가 "1; DROP TABLE courses" 라면? 😱

# ✅ 자리표시자 :id 로
conn.execute(text("SELECT * FROM courses WHERE id = :id"), {"id": course_id})`,
            },
            { type: 'say', text: '사용자 입력을 SQL 문자열에 직접 붙이면, 입력이 **SQL 명령으로 해석**될 수 있어요. 이게 **SQL 인젝션**이에요. 웹 해킹의 고전이죠. `:id` 같은 자리표시자를 쓰면 드라이버가 값을 **값으로만** 안전하게 전달해요.' },
            { type: 'note', tone: 'tip', text: '접속 URL에 비밀번호가 그대로 있는 것도 실무에서는 안 돼요. git에 올라가면 누구나 보니까요. 나중에 `DATABASE_URL` **환경변수**로 빼요(React 트랙 9-1 환경변수와 같은 원리).\n\n수업 끝! 확인 문제 가요.' },
          ],
        },
      ],
    },
  ],
  questions: [
    {
      id: 'fs03-1-q1',
      source: '번역가와 전화선',
      type: 'mcq',
      question: 'SQLAlchemy와 psycopg의 역할로 옳은 것은?',
      choices: ['둘 다 같은 일을 한다', 'SQLAlchemy는 파이썬↔SQL 번역, psycopg는 DB와 실제 연결을 맺어 SQL을 보내고 받는 드라이버', 'psycopg가 번역, SQLAlchemy가 연결', '둘 다 웹 서버다'],
      answer: 1,
      explanation: '번역가(ORM)와 전화선(드라이버) 둘 다 있어야 DB와 대화할 수 있어요.',
    },
    {
      id: 'fs03-1-q2',
      source: '접속 URL 다섯 칸',
      type: 'mcq',
      question: '노트북에서 직접 실행한 FastAPI가 compose로 띄운 Postgres(ports "5433:5432")에 접속할 주소와 포트는?',
      choices: ['db:5432', 'localhost:5433', 'localhost:5432', '0.0.0.0:8000'],
      answer: 1,
      explanation: 'db라는 이름은 compose 안의 컨테이너끼리만 알아요. 노트북에서는 localhost와 바깥 포트 5433이에요.',
    },
    {
      id: 'fs03-1-q3',
      source: 'engine과 커넥션 풀',
      type: 'mcq',
      question: 'engine을 요청마다 create_engine으로 새로 만들면 생기는 문제는?',
      choices: ['문제 없다', '커넥션 풀이 매번 새로 생겨 연결 비용을 계속 치르고 DB 최대 연결 수를 넘길 수 있다', 'SQL이 안 써진다', 'CORS 에러'],
      answer: 1,
      explanation: 'engine은 앱에 하나만 두고, 연결은 풀에서 빌려 쓰고 반납해요.',
    },
    {
      id: 'fs03-1-q4',
      source: 'engine과 커넥션 풀',
      type: 'short',
      question: 'DB 행 튜플에 열 이름을 키로 붙여 딕셔너리처럼 쓰게 해 주는 결과 메서드는? (result.________())',
      answer: ['mappings', 'mappings()', 'result.mappings()'],
      explanation: '이름표가 있어야 JSON이 {"title": ...} 모양이 되고, 프론트에서 course.title로 꺼낼 수 있어요.',
    },
    {
      id: 'fs03-1-q5',
      source: '트랜잭션: commit을 안 하면',
      type: 'mcq',
      question: 'with engine.connect() 안에서 INSERT만 하고 commit을 안 했다. 결과는?',
      choices: ['자동으로 저장된다', '에러가 난다', '블록이 끝날 때 SQLAlchemy가 ROLLBACK을 보내 저장되지 않는다', 'DB가 꺼진다'],
      answer: 2,
      explanation: '로그에 INSERT 다음 ROLLBACK이 찍혀요. conn.commit()을 하거나 engine.begin()을 써요.',
    },
    {
      id: 'fs03-1-q6',
      source: '트랜잭션: commit을 안 하면',
      type: 'ox',
      question: 'engine.begin()으로 감싸면 블록이 정상 종료될 때 자동으로 COMMIT, 에러가 나면 ROLLBACK된다.',
      answer: true,
      explanation: '"둘 다 되거나 둘 다 안 되거나"가 필요한 작업(수강 신청 + 포인트 차감)에 딱 맞아요.',
    },
    {
      id: 'fs03-1-q7',
      source: 'SQL에 값을 끼울 때는 파라미터로',
      type: 'mcq',
      question: 'SQL 인젝션을 막는 올바른 방법은?',
      choices: ['f-string으로 값을 붙인다', 'text("... WHERE id = :id")와 {"id": value}처럼 자리표시자로 넘긴다', '값을 대문자로 바꾼다', 'CORS를 설정한다'],
      answer: 1,
      explanation: '자리표시자를 쓰면 드라이버가 값을 SQL 명령이 아닌 값으로만 전달해요.',
    },
  ],
}

export default topic
