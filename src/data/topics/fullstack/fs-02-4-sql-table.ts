import type { Topic } from '../../types'

const topic: Topic = {
  id: 'fs-02-4-sql-table',
  track: 'fullstack',
  group: '02. 개발 환경과 데이터베이스',
  title: '2-4. SQL로 courses 테이블 만들기',
  order: 204,
  notionId: '400df951bf8080afa0ebefe667836df0',
  addedAt: '2026-11-06',
  sections: [
    {
      title: 'CREATE TABLE: 표의 설계도',
      slides: [
        {
          title: '열마다 이름과 타입과 규칙',
          blocks: [
            { type: 'say', text: '2장 마지막 수업이에요. psql에 들어가서 강의를 담을 **courses 테이블**을 만들어요. DB에게 말을 거는 언어가 **SQL**이에요.' },
            {
              type: 'code',
              code: `CREATE TABLE courses (
  id         INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title      VARCHAR(200) NOT NULL,
  instructor VARCHAR(100) NOT NULL,
  price      INT NOT NULL CHECK (price >= 0)
);`,
            },
            {
              type: 'list',
              items: [
                '열마다 **이름 + 타입 + 규칙**을 적어요',
                '`VARCHAR(200)`: 최대 200자 문자열 / `INT`: 정수',
                '`NOT NULL`: 비워 둘 수 없음',
                '`CHECK (price >= 0)`: 가격은 0 이상만',
              ],
            },
            { type: 'say', text: '이 규칙들을 **제약 조건**이라고 해요. 프론트나 FastAPI에서 실수로 가격을 -1000으로 보내도 **DB가 거절해요.** 데이터를 지키는 마지막 방어선이에요.' },
          ],
        },
      ],
    },
    {
      title: '기본 키와 IDENTITY',
      slides: [
        {
          title: 'PRIMARY KEY = 겹치지 않는 이름표',
          blocks: [
            { type: 'say', text: '**기본 키(PRIMARY KEY)** 는 행 하나를 콕 집는 **겹치지 않는 이름표**예요. 강의 제목은 같을 수 있지만(파이썬 입문이 두 개), id는 절대 안 겹쳐요. `/courses/3`의 3이 바로 이 id예요.' },
            { type: 'say', text: '`GENERATED ALWAYS AS IDENTITY`는 "**id는 DB가 알아서 1, 2, 3… 매겨 줘**"라는 뜻이에요. 우리는 INSERT 할 때 id를 안 적어요.' },
            { type: 'code', code: `INSERT INTO courses (title, instructor, price)
VALUES ('파이썬 입문', '클로드', 33000);      -- id는 안 적음 → DB가 1번을 줌` },
          ],
        },
        {
          title: 'id를 직접 넣으면',
          blocks: [
            { type: 'code', code: `INSERT INTO courses (id, title, instructor, price) VALUES (99, '테스트', '나', 0);
-- ERROR: cannot insert a non-DEFAULT value into column "id"
-- Column "id" is an identity column defined as GENERATED ALWAYS.` },
            { type: 'ask', q: '왜 DB는 id를 직접 넣는 걸 막을까요? 넣게 해 주면 편하지 않을까요?', a: '내가 99를 넣어 두면, 나중에 DB의 자동 번호가 99에 도달했을 때 **"이미 있는 번호"라며 충돌**(duplicate key)이 나요. 그래서 `ALWAYS`는 "번호는 무조건 DB만 매긴다"고 강제하는 거예요. **DB가 자동으로 관리하는 건 건드리지 말자.** 직접 넣어야 하는 특별한 경우(데이터 옮기기)에는 `BY DEFAULT`를 써요.' },
            { type: 'note', tone: 'tip', text: 'id에 빈 번호(1, 2, 3, 7…)가 생겨도 정상이에요. 실패한 INSERT도 번호표는 소비하거든요(3-1에서 직접 봐요). id는 "몇 번째"가 아니라 "**겹치지 않는 이름표**"예요.' },
          ],
        },
      ],
    },
    {
      title: '데이터 넣고 꺼내기',
      slides: [
        {
          title: 'INSERT와 SELECT',
          blocks: [
            {
              type: 'code',
              code: `-- 여러 개 한 번에 넣기
INSERT INTO courses (title, instructor, price) VALUES
  ('FastAPI 기초', '클로드', 44000),
  ('Next.js 시작하기', '클로드', 0);

-- 전부 보기
SELECT * FROM courses;

-- 조건과 정렬
SELECT title, price FROM courses
WHERE price <= 40000          -- 4만 원 이하만
ORDER BY price DESC;          -- 비싼 순 (ASC는 싼 순)`,
            },
            {
              type: 'table',
              head: ['SQL', '뜻'],
              rows: [
                ['`SELECT 열 FROM 테이블`', '어떤 열을, 어느 테이블에서 (`*`는 전부)'],
                ['`WHERE 조건`', '조건에 맞는 행만'],
                ['`ORDER BY 열 DESC`', '정렬 (DESC 내림차순, ASC 오름차순)'],
              ],
            },
          ],
        },
        {
          title: '정렬을 안 쓰면 순서는?',
          blocks: [
            { type: 'ask', q: 'ORDER BY 없이 SELECT * FROM courses 를 하면 항상 id 순서로 나올까요?', a: '**보장되지 않아요.** 지금은 우연히 id 순서로 나오는 것처럼 보이지만, 데이터를 수정·삭제하다 보면 순서가 바뀔 수 있어요. SQL은 ORDER BY가 없으면 순서를 약속하지 않아요. 화면에 보여 줄 목록이라면 **항상 ORDER BY를 적어요.**' },
            { type: 'code', code: `\\d courses    -- 테이블 설계도 보기 (열, 타입, NOT NULL, 기본값)
SELECT * FROM courses;   -- 테이블에 든 데이터 보기` },
            { type: 'note', tone: 'tip', text: '`\\d`는 **설계도**, SELECT는 **데이터**예요. "왜 INSERT가 거절되지?" 싶으면 `\\d courses`로 제약 조건부터 확인하세요.' },
          ],
        },
      ],
    },
    {
      title: '수정과 삭제는 조심',
      slides: [
        {
          title: 'WHERE를 빼먹으면',
          blocks: [
            { type: 'code', code: `UPDATE courses SET price = 0 WHERE id = 2;   -- 2번 강의만 무료로
DELETE FROM courses WHERE title = '테스트';   -- 테스트 강의만 삭제

UPDATE courses SET price = 0;                 -- ⚠️ WHERE 없음: 모든 강의가 무료가 됨!` },
            { type: 'note', tone: 'warn', text: 'UPDATE·DELETE에서 **WHERE를 빼먹으면 테이블 전체**가 바뀌거나 지워져요. 실무에서 실제로 일어나는 대형 사고예요. 습관: ① 먼저 같은 WHERE로 `SELECT`해서 몇 줄이 대상인지 확인 ② 그다음 UPDATE·DELETE.' },
            { type: 'say', text: '이제 DB에 강의가 들어 있어요. 다음 3장에서는 FastAPI가 코드에 적힌 고정 데이터 대신 **이 테이블에서** 강의를 읽어 오게 바꿔요.\n\n2장 끝! 확인 문제 가요.' },
          ],
        },
      ],
    },
  ],
  questions: [
    {
      id: 'fs02-4-q1',
      source: 'CREATE TABLE: 표의 설계도',
      type: 'mcq',
      question: 'price INT NOT NULL CHECK (price >= 0) 인 열에 -1000을 넣으면?',
      choices: ['-1000으로 저장된다', '0으로 바뀐다', 'DB가 거절한다(제약 조건 위반)', 'NULL로 저장된다'],
      answer: 2,
      explanation: 'CHECK 제약이 0 이상만 허용해요. 앱에서 실수해도 DB가 마지막 방어선이 돼요.',
    },
    {
      id: 'fs02-4-q2',
      source: '기본 키와 IDENTITY',
      type: 'mcq',
      question: 'GENERATED ALWAYS AS IDENTITY 인 id 열에 INSERT 할 때 올바른 방법은?',
      choices: ['id에 원하는 번호를 직접 넣는다', 'id는 적지 않고 나머지 열만 넣어 DB가 번호를 매기게 한다', 'id에 NULL을 넣는다', 'id에 문자열을 넣는다'],
      answer: 1,
      explanation: 'ALWAYS는 DB만 번호를 매기게 강제해요. 직접 넣으면 에러가 나고, 억지로 넣으면 나중에 번호가 충돌해요.',
    },
    {
      id: 'fs02-4-q3',
      source: '기본 키와 IDENTITY',
      type: 'short',
      question: '행 하나를 콕 집는, 절대 겹치지 않는 이름표 열을 무엇이라고 할까? (영어 두 단어)',
      answer: ['PRIMARY KEY', 'primary key', '기본 키', '기본키', 'PK'],
      explanation: '/courses/3의 3이 기본 키예요. 제목은 겹칠 수 있지만 id는 안 겹쳐요.',
    },
    {
      id: 'fs02-4-q4',
      source: '데이터 넣고 꺼내기',
      type: 'mcq',
      question: '4만 원 이하 강의를 비싼 순으로 보여 주는 SQL은?',
      choices: ['SELECT * FROM courses ORDER BY price', 'SELECT * FROM courses WHERE price <= 40000 ORDER BY price DESC', 'SELECT price <= 40000 FROM courses', 'DELETE FROM courses WHERE price > 40000'],
      answer: 1,
      explanation: 'WHERE로 거르고 ORDER BY ... DESC로 내림차순 정렬해요.',
    },
    {
      id: 'fs02-4-q5',
      source: '데이터 넣고 꺼내기',
      type: 'ox',
      question: 'ORDER BY 없이 SELECT 하면 항상 id 순서로 결과가 나온다고 보장된다.',
      answer: false,
      explanation: 'SQL은 ORDER BY가 없으면 순서를 약속하지 않아요. 화면용 목록엔 항상 ORDER BY를 적어요.',
    },
    {
      id: 'fs02-4-q6',
      source: '수정과 삭제는 조심',
      type: 'mcq',
      question: 'UPDATE courses SET price = 0; 을 실행하면?',
      choices: ['아무 일도 없다', '첫 번째 강의만 무료가 된다', '모든 강의가 무료가 된다', '문법 에러'],
      answer: 2,
      explanation: 'WHERE가 없으면 테이블 전체가 대상이에요. 먼저 같은 조건으로 SELECT해서 대상을 확인하는 습관을 들여요.',
    },
  ],
}

export default topic
