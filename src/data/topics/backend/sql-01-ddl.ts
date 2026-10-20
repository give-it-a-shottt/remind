import type { Topic } from '../../types'

const topic: Topic = {
  id: 'sql-01-ddl',
  track: 'backend',
  group: 'SQL',
  title: 'RDBMS 개념과 DDL: 테이블 만들기',
  order: 71,
  sections: [
    {
      title: '관계형 데이터베이스의 구성',
      notionIds: ['3efdf951bf808157a036c1577d79644d'],
      points: [
        '데이터베이스는 여러 시스템이 함께 쓰도록 체계적으로 정리한 데이터 묶음이고, DBMS는 그것을 저장·검색·보호하는 소프트웨어다. 파일로 직접 관리할 때보다 중복이 줄고, 동시 접근·일관성·보안·복구를 DBMS가 책임진다.',
        '관계형(RDB)은 데이터를 테이블(2차원 표)로 표현한다. 행(row, 레코드) = 하나의 사실, 열(column, 속성) = 사실의 항목.',
        '기본 키(Primary Key): 각 행을 유일하게 구분하는 컬럼(들). NULL 불가 + 중복 불가. 외래 키(Foreign Key): 다른 테이블의 기본 키를 참조해 테이블 사이 관계를 만든다.',
        '스키마(Schema): 테이블 구조·자료형·제약·관계의 정의, 즉 DB 설계도. 스키마만 있으면 같은 구조의 빈 DB를 다시 만들 수 있다(데이터 백업과 다르다).',
      ],
    },
    {
      title: 'SQL 명령의 분류',
      notionIds: ['3efdf951bf808157a036c1577d79644d'],
      points: [
        'DDL(Data Definition, 정의): CREATE, ALTER, DROP, TRUNCATE. 구조를 만든다·바꾼다·지운다.',
        'DML(Data Manipulation, 조작): SELECT, INSERT, UPDATE, DELETE. 데이터를 다룬다.',
        'DCL(Data Control, 제어): GRANT, REVOKE. 권한을 준다·뺏는다.',
        'TCL(Transaction Control): BEGIN(START TRANSACTION), COMMIT, ROLLBACK, SAVEPOINT. 교재에 따라 DCL에 포함하기도 한다.',
        'MySQL에서는 대부분의 DDL이 실행 즉시 암묵적으로 커밋된다. 트랜잭션 안에서 ALTER TABLE을 하면 그 전까지의 변경도 함께 확정되니 주의한다(PostgreSQL은 DDL도 트랜잭션으로 되돌릴 수 있다).',
      ],
    },
    {
      title: 'CREATE TABLE과 자료형',
      notionIds: ['3efdf951bf80817db4e8f62c8f32e1df'],
      points: [
        'CREATE TABLE 이름 (컬럼 자료형 [제약], ..., PRIMARY KEY(컬럼)). DB를 먼저 만들고(CREATE DATABASE) 선택한다(USE).',
        '정수: TINYINT(1바이트) < SMALLINT < INT(4바이트, 약 ±21억) < BIGINT(8바이트). UNSIGNED는 음수를 없애 양수 범위를 두 배로 늘린다(MySQL).',
        '문자: CHAR(n)은 고정 길이(남는 칸을 공백으로 채움, 국가 코드처럼 길이가 일정한 값), VARCHAR(n)은 가변 길이(이름·이메일), TEXT는 긴 본문.',
        '숫자: 금액은 DECIMAL(10, 2)(정확한 십진수), FLOAT/DOUBLE은 근사값이라 돈에 쓰지 않는다.',
        '날짜: DATE(날짜), DATETIME(날짜+시각), TIMESTAMP(MySQL: UTC로 저장하고 세션 시간대로 변환, 2038년 한계). 한글·이모지를 위해 MySQL 문자셋은 utf8mb4를 쓴다(utf8은 3바이트라 이모지 불가).',
      ],
      code: `CREATE DATABASE IF NOT EXISTS shop DEFAULT CHARACTER SET utf8mb4;
USE shop;

CREATE TABLE users (
  id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  email      VARCHAR(255)    NOT NULL,
  nickname   VARCHAR(30)     NULL,
  country    CHAR(2)         NOT NULL DEFAULT 'KR',
  created_at DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email)
);`,
    },
    {
      title: '제약 조건',
      notionIds: ['3efdf951bf80815593d8ef50293c054f'],
      points: [
        'NOT NULL(값 필수), DEFAULT(값을 안 주면 기본값), UNIQUE(중복 금지), PRIMARY KEY(NOT NULL + UNIQUE, 테이블당 하나), CHECK(조건식, 예: price >= 0), FOREIGN KEY(참조 무결성).',
        'AUTO_INCREMENT(MySQL) / SERIAL·IDENTITY(PostgreSQL): 정수 기본 키를 자동으로 1씩 증가. 값을 생략하고 INSERT 한다.',
        '외래 키가 막아 주는 것: 부모에 없는 값으로 자식 INSERT → 에러, 자식이 참조 중인 부모 DELETE → 에러(기본). 그래서 넣을 때는 부모 먼저, 지울 때는 자식 먼저.',
        'ON DELETE CASCADE(부모 삭제 시 자식도 삭제), ON DELETE SET NULL(자식의 FK를 NULL로)로 동작을 바꿀 수 있다.',
        '현업에서는 성능이나 유연성을 이유로 FK를 생략하기도 하지만, 그 경우 앱이 무결성을 책임져야 하고 고아 데이터가 생기기 쉽다.',
      ],
      code: `CREATE TABLE orders (
  id       BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id  BIGINT UNSIGNED NOT NULL,
  total    DECIMAL(12, 2)  NOT NULL CHECK (total >= 0),
  status   VARCHAR(20)     NOT NULL DEFAULT 'pending',
  CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users (id)
    ON DELETE RESTRICT
);`,
    },
    {
      title: 'ALTER, DROP, TRUNCATE',
      notionIds: ['3efdf951bf80817db4e8f62c8f32e1df'],
      points: [
        'ALTER TABLE t ADD COLUMN c 자료형 / MODIFY COLUMN c 새자료형(MySQL, 타입만) / CHANGE COLUMN old new 자료형(MySQL, 이름+타입) / RENAME COLUMN old TO new / DROP COLUMN c.',
        'DROP TABLE t: 테이블 구조와 데이터를 모두 삭제. IF EXISTS를 붙이면 없을 때 에러를 내지 않는다.',
        'TRUNCATE TABLE t: 구조는 남기고 모든 행을 빠르게 삭제(AUTO_INCREMENT도 초기화). DELETE FROM t(조건 없음)는 행을 하나씩 지우고 트랜잭션으로 되돌릴 수 있지만 느리다.',
        '큰 운영 테이블의 ALTER는 테이블 잠금·재작성으로 오래 걸릴 수 있다. 사용량이 적은 시간에 하거나 온라인 스키마 변경 도구를 쓴다.',
        'DESC t(또는 SHOW CREATE TABLE t)로 구조를 확인한다.',
      ],
    },
  ],
  questions: [
    {
      id: 'sql-01-01', type: 'mcq', source: '관계형 데이터베이스의 구성',
      question: '기본 키(Primary Key)의 조건으로 맞는 것은?',
      choices: ['중복은 되지만 NULL은 안 된다', 'NULL과 중복 모두 허용', '반드시 문자열이어야 한다', 'NULL 불가 + 중복 불가'],
      answer: 3,
      choiceExplanations: [
        '중복되면 행을 구분할 수 없어요.',
        '기본 키의 존재 이유(유일한 식별)가 사라져요.',
        '정수가 가장 흔하고, 문자열·UUID·여러 컬럼 조합도 가능해요.',
        '정답. 모든 행을 유일하게 식별하려면 값이 반드시 있고, 겹치지 않아야 해요.',
      ],
      explanation: '기본 키 = NOT NULL + UNIQUE + 테이블당 하나. 여러 컬럼을 합쳐 기본 키로 쓰면 복합 키예요(예: (order_id, product_id)).\n좋은 기본 키는 바뀌지 않는 값이에요. 그래서 업무 의미가 없는 자동 증가 정수(대리 키)를 많이 써요(DB 설계 토픽).',
    },
    {
      id: 'sql-01-02', type: 'mcq', source: 'SQL 명령의 분류',
      question: 'DDL에 해당하는 명령만 고른 것은?',
      choices: ['SELECT, INSERT', 'GRANT, REVOKE', 'CREATE, ALTER, DROP', 'COMMIT, ROLLBACK'],
      answer: 2,
      choiceExplanations: [
        'DML(데이터 조작)이에요.',
        'DCL(권한 제어)이에요.',
        '정답. 구조를 정의·변경·삭제하는 DDL이에요.',
        'TCL(트랜잭션 제어)이에요.',
      ],
      explanation: '외우는 법: Definition(구조) / Manipulation(데이터) / Control(권한) / Transaction(묶음 확정).\nSQLAlchemy로 치면 create_all·Alembic = DDL, select/insert/update/delete = DML, commit/rollback = TCL이에요.',
    },
    {
      id: 'sql-01-03', type: 'ox', source: 'SQL 명령의 분류',
      question: 'MySQL에서 트랜잭션 도중 ALTER TABLE을 실행하면, 그 전까지의 변경 사항이 암묵적으로 커밋될 수 있다.',
      answer: true,
      explanation: '맞아요. MySQL의 대부분 DDL은 실행 전후에 암묵적 커밋을 일으켜요. 그래서 "데이터 변경 + 스키마 변경"을 한 트랜잭션으로 묶어 되돌리는 건 MySQL에서 기대할 수 없어요.\nPostgreSQL은 DDL도 트랜잭션 안에서 롤백할 수 있어서 마이그레이션이 실패해도 깔끔하게 되돌릴 수 있어요.',
    },
    {
      id: 'sql-01-04', type: 'mcq', source: 'CREATE TABLE과 자료형',
      question: '국가 코드(KR, US, JP처럼 항상 2글자)와 이메일을 저장할 자료형으로 가장 알맞은 짝은?',
      choices: ['둘 다 TEXT', 'CHAR(2) / VARCHAR(255)', 'VARCHAR(2) / CHAR(255)', 'INT / VARCHAR(255)'],
      answer: 1,
      choiceExplanations: [
        'TEXT는 긴 본문용이에요. 인덱스·정렬에 제약이 있을 수 있어요.',
        '정답. 길이가 고정된 값은 CHAR, 길이가 제각각인 값은 VARCHAR.',
        '이메일을 CHAR(255)로 두면 짧은 이메일도 255칸을 차지해요(공백 채움).',
        '국가 코드는 문자예요.',
      ],
      explanation: 'CHAR(n): 고정 길이, 남는 칸 공백 채움. VARCHAR(n): 실제 길이만큼 + 길이 정보. 길이가 일정한 코드값이 아니면 VARCHAR가 기본이에요.',
    },
    {
      id: 'sql-01-05', type: 'mcq', source: 'CREATE TABLE과 자료형',
      question: 'MySQL에서 이모지(😀)가 들어간 닉네임 저장 시 "Incorrect string value" 에러가 난다. 원인은?',
      choices: ['VARCHAR 길이가 짧아서', 'NOT NULL 때문에', 'AUTO_INCREMENT 때문에', '문자셋이 utf8(3바이트)이라 4바이트 문자인 이모지를 저장하지 못해서'],
      answer: 3,
      choiceExplanations: [
        '길이 초과면 "Data too long" 에러예요.',
        '값이 있으니 NOT NULL과 무관해요.',
        '관계없어요.',
        '정답. 테이블·컬럼·연결 문자셋을 utf8mb4로 맞춰야 해요.',
      ],
      explanation: 'MySQL의 utf8은 이름과 달리 최대 3바이트만 지원하는 반쪽짜리예요. utf8mb4(4바이트)가 진짜 UTF-8이에요. 접속 URL에도 ?charset=utf8mb4를 붙이세요.\n노션의 charset="utf8"(한글 깨짐 방지) 설정은 한글은 되지만 이모지는 안 돼요.',
    },
    {
      id: 'sql-01-06', type: 'short', source: 'CREATE TABLE과 자료형',
      question: '금액처럼 소수 계산에 오차가 없어야 하는 값을 저장하는 SQL 자료형 이름은? (예: ______(10, 2))',
      answer: ['DECIMAL', 'decimal', 'NUMERIC', 'numeric'],
      explanation: 'DECIMAL(= NUMERIC)이에요. DECIMAL(10, 2) = 전체 10자리 중 소수 2자리.\nFLOAT/DOUBLE은 이진 근사라 0.1을 정확히 표현하지 못해 합계가 어긋나요. SQLAlchemy에서는 Numeric(10, 2), 파이썬에서는 Decimal로 다뤄요.',
    },
    {
      id: 'sql-01-07', type: 'mcq', source: '제약 조건',
      question: 'orders.user_id가 users.id를 참조하는 FK(기본 RESTRICT)일 때 에러가 나는 작업은?',
      choices: ['주문이 없는 사용자 삭제', '주문이 있는 사용자 삭제', '존재하는 user_id로 주문 INSERT', '주문 삭제'],
      answer: 1,
      choiceExplanations: [
        '참조하는 자식이 없으니 삭제돼요.',
        '정답. 자식(주문)이 참조 중인 부모를 지우면 고아 데이터가 생기므로 막아요.',
        '부모가 있으니 정상이에요.',
        '자식을 지우는 건 언제나 가능해요.',
      ],
      explanation: '외래 키 = 참조 무결성. "가리키는 대상이 반드시 존재한다"를 DB가 보장해요.\n넣을 때 부모 → 자식, 지울 때 자식 → 부모 순서. 부모를 지울 때 자식도 지우고 싶으면 ON DELETE CASCADE, 연결만 끊고 싶으면 SET NULL.',
    },
    {
      id: 'sql-01-08', type: 'short', source: '제약 조건',
      question: '"상품 가격은 0 이상"처럼 컬럼 값이 조건식을 만족해야 한다는 제약의 키워드는?',
      answer: ['CHECK', 'check'],
      explanation: 'CHECK (price >= 0)이에요. MySQL은 8.0.16부터 실제로 검사해요(그 전에는 문법만 받고 무시).\n앱의 Pydantic 검증(Field(ge=0))과 DB CHECK를 함께 두면, 다른 경로(관리 스크립트, 직접 SQL)로 들어오는 잘못된 값까지 막을 수 있어요.',
    },
    {
      id: 'sql-01-09', type: 'mcq', source: '제약 조건',
      question: 'AUTO_INCREMENT 기본 키가 있는 테이블에 데이터를 넣는 방법으로 알맞은 것은?',
      choices: ['id 값을 직접 계산해 넣는다(SELECT MAX(id) + 1)', 'id에 0을 넣는다', 'id에 문자열을 넣는다', 'id 컬럼을 생략하고 나머지 컬럼만 INSERT 한다'],
      answer: 3,
      choiceExplanations: [
        '동시에 두 요청이 같은 MAX를 보고 같은 id를 만들 수 있어요(경쟁 조건).',
        'MySQL 설정에 따라 0이 자동 증가로 처리되기도 하지만 의도가 불명확해요. 생략이 정석이에요.',
        '정수 컬럼이에요.',
        '정답. DB가 원자적으로 다음 번호를 정해 줘요.',
      ],
      explanation: '노션 크롤링 실습에서도 ID는 AUTO_INCREMENT라 생략했어요. 번호 발급은 DB에 맡기세요.\n참고로 롤백되거나 삭제된 번호는 재사용되지 않아 id에 구멍이 생기는 게 정상이에요. id를 "개수"로 쓰면 안 되는 이유예요.',
    },
    {
      id: 'sql-01-10', type: 'mcq', source: 'ALTER, DROP, TRUNCATE',
      question: 'MySQL에서 컬럼 이름 modelnumber를 model_num으로 바꾸면서 타입도 VARCHAR(10) NOT NULL로 지정하는 명령은?',
      choices: [
        'ALTER TABLE t MODIFY COLUMN modelnumber model_num VARCHAR(10) NOT NULL;',
        'ALTER TABLE t CHANGE COLUMN modelnumber model_num VARCHAR(10) NOT NULL;',
        'ALTER TABLE t RENAME modelnumber;',
        'UPDATE t SET modelnumber = model_num;',
      ],
      answer: 1,
      choiceExplanations: [
        'MODIFY는 타입만 바꾸고 이름은 못 바꿔요.',
        '정답. CHANGE는 (옛 이름, 새 이름, 타입)을 모두 적어요. 노션 연습 문제와 같은 구문이에요.',
        '테이블 이름 변경 문법과 섞였어요.',
        'UPDATE는 데이터(DML)를 바꾸는 명령이에요.',
      ],
      explanation: 'MySQL ALTER 정리: ADD COLUMN(추가), MODIFY COLUMN(타입), CHANGE COLUMN(이름+타입, 타입을 꼭 다시 적음), RENAME COLUMN a TO b(8.0+, 이름만), DROP COLUMN(삭제).\nCHANGE에서 NOT NULL을 빼먹으면 NULL 허용으로 바뀌어 버리니 기존 제약도 다시 적어야 해요.',
    },
    {
      id: 'sql-01-11', type: 'mcq', source: 'ALTER, DROP, TRUNCATE',
      question: '테스트 데이터를 비우되 테이블 구조는 남기고 싶다. 빠르고 AUTO_INCREMENT도 1부터 다시 시작하게 하는 명령은?',
      choices: ['DROP TABLE t;', 'DELETE FROM t WHERE id = 1;', 'TRUNCATE TABLE t;', 'ALTER TABLE t DROP COLUMN id;'],
      answer: 2,
      choiceExplanations: [
        '구조까지 사라져요.',
        '한 행만 지워요.',
        '정답. 구조는 남고 데이터만 한꺼번에 비워요.',
        '컬럼을 지워요.',
      ],
      explanation: 'DELETE FROM t: 행 단위 삭제, 조건 가능, 롤백 가능, 트리거 실행, 느림, AUTO_INCREMENT 유지.\nTRUNCATE: 전체 비우기, 조건 불가, (MySQL에서) 롤백 불가, 빠름, AUTO_INCREMENT 초기화. FK로 참조되는 테이블은 TRUNCATE가 막힐 수 있어요.',
    },
    {
      id: 'sql-01-12', type: 'ox', source: '관계형 데이터베이스의 구성',
      question: '스키마(구조 정의)를 저장해 두면 데이터까지 복원할 수 있으므로 백업이 필요 없다.',
      answer: false,
      explanation: '스키마는 "빈 테이블 구조"만 다시 만들 수 있어요. 데이터는 별도의 백업(덤프, 스냅숏, 로그)으로 지켜야 해요(백업·복구 설계 토픽).\n마이그레이션 파일(Alembic)은 스키마의 변경 이력이고, 백업은 데이터의 사본이에요. 둘은 역할이 달라요.',
    },
  ],
}

export default topic
