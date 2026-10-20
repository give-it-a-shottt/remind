import type { Topic } from '../../types'

const topic: Topic = {
  id: 'sql-02-dml',
  track: 'backend',
  group: 'SQL',
  title: 'DML: INSERT · SELECT · UPDATE · DELETE',
  order: 72,
  sections: [
    {
      title: 'INSERT',
      notionIds: ['3efdf951bf80815f9a40d4819038b9ca'],
      points: [
        'INSERT INTO 테이블 (컬럼1, 컬럼2) VALUES (값1, 값2); 컬럼 목록을 적는 것이 안전하다. 나중에 컬럼이 추가되거나 순서가 바뀌어도 깨지지 않는다.',
        '생략한 컬럼은 DEFAULT 값이나 NULL이 된다. NOT NULL인데 기본값도 없으면 에러.',
        '여러 행: VALUES (..), (..), (..) 로 한 문장에 넣으면 행마다 INSERT 하는 것보다 훨씬 빠르다.',
        'INSERT INTO t2 (a, b) SELECT x, y FROM t1 WHERE ... 로 조회 결과를 그대로 넣을 수도 있다.',
        '문자열은 작은따옴표로 감싼다. 값에 작은따옴표가 들어 있으면 문자열이 깨진다. 앱에서는 항상 파라미터 바인딩(%s, :name)을 쓴다.',
      ],
      code: `INSERT INTO students (name, age, grade) VALUES ('김철수', 17, 2);

INSERT INTO students (name, age, grade) VALUES
  ('이영희', 18, 3),
  ('박민수', 16, 1);`,
    },
    {
      title: 'SELECT와 WHERE',
      notionIds: ['3efdf951bf80815f9a40d4819038b9ca'],
      points: [
        'SELECT 컬럼들 FROM 테이블 WHERE 조건; SELECT * 는 모든 컬럼. 실제 코드에서는 필요한 컬럼만 고르는 것이 네트워크·메모리에 유리하다.',
        '비교: =, != (또는 <>), <, >, <=, >=. 논리: AND, OR, NOT. 범위: BETWEEN a AND b(양 끝 포함). 목록: IN (..). 패턴: LIKE.',
        'AND가 OR보다 먼저 계산된다. 섞을 때는 괄호로 의도를 명확히 한다.',
        'NULL은 "모르는 값"이라 = NULL 비교는 참이 되지 않는다. IS NULL / IS NOT NULL을 쓴다.',
        'LIKE 패턴: % 는 0글자 이상, _ 는 정확히 한 글자. LIKE \'박%\'(박으로 시작), \'%영%\'(영 포함), \'__\'(두 글자).',
      ],
      code: `SELECT name, age FROM students
WHERE grade = 2 AND (age >= 17 OR name LIKE '김%');

SELECT * FROM students WHERE phone IS NULL;`,
    },
    {
      title: 'UPDATE',
      notionIds: ['3efdf951bf80815f9a40d4819038b9ca'],
      points: [
        'UPDATE 테이블 SET 컬럼1 = 값1, 컬럼2 = 값2 WHERE 조건;',
        'WHERE를 빼면 모든 행이 바뀐다. 실행 전에 같은 WHERE로 SELECT 해서 대상이 맞는지 확인하는 습관을 들인다. MySQL Workbench의 safe update 모드는 키 조건 없는 UPDATE/DELETE를 막아 준다.',
        '현재 값을 이용한 갱신: SET stock = stock - 1 WHERE id = 3 AND stock > 0. DB가 원자적으로 계산하므로 동시 요청에도 안전하다. 영향받은 행 수(affected rows)가 0이면 재고가 없었다는 뜻이다.',
        '중요한 데이터는 트랜잭션 안에서 UPDATE 후 결과를 확인하고 COMMIT, 이상하면 ROLLBACK 한다.',
      ],
      code: `UPDATE students SET age = 18 WHERE name = '박민수';

-- 재고 차감: 남아 있을 때만
UPDATE products SET stock = stock - 1 WHERE id = 3 AND stock > 0;`,
    },
    {
      title: 'DELETE',
      notionIds: ['3efdf951bf80815f9a40d4819038b9ca'],
      points: [
        'DELETE FROM 테이블 WHERE 조건; WHERE가 없으면 전체 삭제.',
        'FK로 참조되는 부모 행은 자식이 남아 있으면 지울 수 없다(기본 RESTRICT). 자식을 먼저 지우거나 ON DELETE CASCADE를 설계한다.',
        '대량 삭제(수백만 행)는 한 번에 하면 잠금과 로그가 커져 서비스에 영향을 준다. LIMIT으로 나눠 반복하거나, 오래된 데이터 정리는 파티션을 통째로 지우는 방식을 쓴다.',
        '삭제 대신 deleted_at을 기록하는 소프트 삭제를 선택할 수도 있다.',
      ],
      code: `-- 먼저 확인
SELECT COUNT(*) FROM logs WHERE created_at < '2026-01-01';
-- 나눠서 삭제 (MySQL)
DELETE FROM logs WHERE created_at < '2026-01-01' LIMIT 10000;`,
    },
  ],
  questions: [
    {
      id: 'sql-02-01', type: 'mcq', source: 'INSERT',
      question: 'INSERT INTO students VALUES (\'김철수\', 17, 2); 처럼 컬럼 목록 없이 쓰는 방식의 위험은?',
      choices: ['테이블에 컬럼이 추가되거나 순서가 바뀌면 값이 엉뚱한 컬럼에 들어가거나 에러가 난다', '문법 에러가 난다', '속도가 느려진다', '자동 증가가 동작하지 않는다는 점 외에는 없다'],
      answer: 0,
      choiceExplanations: [
        '정답. 컬럼 목록을 명시하면 구조 변경에도 안전해요.',
        '컬럼 개수와 값 개수가 맞으면 동작해요.',
        '속도와는 관계없어요.',
        '자동 증가 컬럼에도 값을 줘야 해서(또는 NULL/DEFAULT) 실수하기 쉽고, 더 큰 문제는 구조 변경에 약하다는 점이에요.',
      ],
      explanation: '실무 원칙: INSERT는 항상 (컬럼 목록)을 적고, SELECT는 *보다 필요한 컬럼을 적는다. "지금은 되는" 코드보다 "구조가 바뀌어도 되는" 코드가 좋아요.',
    },
    {
      id: 'sql-02-02', type: 'mcq', source: 'INSERT',
      question: '1만 개의 행을 넣을 때 가장 빠른 방법은?',
      choices: ['INSERT 1만 번, 매번 COMMIT', 'INSERT ... VALUES (..), (..), ... 로 여러 행을 묶어 넣고 한 번(또는 몇 번)만 COMMIT', '하나씩 넣고 마지막에 COMMIT 없이 종료', 'UPDATE로 넣는다'],
      answer: 1,
      choiceExplanations: [
        '문장 1만 번 + 커밋 1만 번이라 가장 느려요.',
        '정답. 네트워크 왕복과 커밋(디스크 동기화) 횟수가 크게 줄어요.',
        '커밋하지 않으면 모두 사라져요.',
        'UPDATE는 기존 행을 바꾸는 명령이에요.',
      ],
      explanation: '대량 입력 속도의 핵심은 "왕복 횟수"와 "커밋 횟수"예요. SQLAlchemy의 insert(Model)에 dict 리스트를 넘기는 방식, 노션 크롤링 실습의 executemany가 같은 원리예요. 더 큰 규모는 LOAD DATA(MySQL), COPY(PostgreSQL)를 써요.',
    },
    {
      id: 'sql-02-03', type: 'mcq', source: 'SELECT와 WHERE',
      question: '다음 SQL의 결과로 맞는 설명은?',
      code: `SELECT * FROM students
WHERE grade = 1 OR grade = 2 AND age > 17;`,
      choices: ['(1학년 또는 2학년) 중 17세 초과', '1학년 중 17세 초과 + 2학년 전체', '1학년 전체 + (2학년 중 17세 초과)', '에러'],
      answer: 2,
      choiceExplanations: [
        '그렇게 하려면 (grade = 1 OR grade = 2) AND age > 17 처럼 괄호가 필요해요.',
        '묶이는 방향이 반대예요.',
        '정답. AND가 OR보다 먼저 묶여 grade = 1 OR (grade = 2 AND age > 17)이 돼요.',
        '문법은 맞아요.',
      ],
      explanation: 'AND가 곱셈, OR가 덧셈처럼 우선순위가 있어요. AND와 OR을 섞을 때는 항상 괄호를 쓰세요(노션의 "AND와 OR을 섞을 땐 괄호로 의도를 명확히").\nSQLAlchemy에서도 or_(and_(...), ...)처럼 구조를 명시하면 헷갈리지 않아요.',
    },
    {
      id: 'sql-02-04', type: 'mcq', source: 'SELECT와 WHERE',
      question: '전화번호가 등록되지 않은(NULL) 학생을 찾는 조건은?',
      choices: ["WHERE phone = NULL", "WHERE phone = ''", 'WHERE phone == NULL', 'WHERE phone IS NULL'],
      answer: 3,
      choiceExplanations: [
        'NULL과의 = 비교는 결과가 UNKNOWN이라 어떤 행도 선택되지 않아요.',
        '빈 문자열과 NULL은 달라요.',
        'SQL에는 == 연산자가 없어요.',
        '정답. NULL 여부는 IS NULL로 검사해요.',
      ],
      explanation: 'SQL의 NULL은 "값이 없음/알 수 없음"이라 비교 결과가 TRUE도 FALSE도 아닌 UNKNOWN이에요. WHERE는 TRUE인 행만 고르니 = NULL은 아무것도 안 나와요.\n빈 문자열(\'\')과 NULL을 섞어 쓰면 조건이 복잡해지니, 한 가지로 통일하는 설계가 좋아요.',
    },
    {
      id: 'sql-02-05', type: 'short', source: 'SELECT와 WHERE',
      question: '이름이 정확히 두 글자인 학생을 찾으려 한다. WHERE name LIKE \'?\' 에서 따옴표 안에 들어갈 패턴은? (와일드카드 문자만)',
      answer: ['__', "'__'"],
      explanation: '언더스코어(_) 두 개예요. _ 는 정확히 한 글자, % 는 0글자 이상.\n\'박%\'(박으로 시작), \'%영%\'(영 포함), \'%수\'(수로 끝남), \'김_\'(김 + 한 글자).',
    },
    {
      id: 'sql-02-06', type: 'mcq', source: 'UPDATE',
      question: '실수로 UPDATE students SET grade = 3; 을 실행했다. 무슨 일이 일어났나?',
      choices: ['아무 일도 없다(WHERE가 없으면 실행 안 됨)', '모든 학생의 학년이 3이 됐다', '첫 번째 학생만 바뀌었다', '에러가 난다'],
      answer: 1,
      choiceExplanations: [
        'WHERE가 없으면 전체 행이 대상이에요.',
        '정답. 그래서 UPDATE/DELETE 전에는 같은 조건으로 SELECT를 먼저 해 봐요.',
        '모든 행이 바뀌어요.',
        '문법상 정상이라 그대로 실행돼요(safe update 모드가 켜져 있으면 막혀요).',
      ],
      explanation: '방어 습관:\n① 같은 WHERE로 SELECT COUNT(*) 먼저\n② 트랜잭션(START TRANSACTION) 안에서 실행 → 영향받은 행 수 확인 → COMMIT 또는 ROLLBACK\n③ Workbench safe update 모드 켜기\n④ 운영 DB 직접 접속 권한 최소화',
    },
    {
      id: 'sql-02-07', type: 'mcq', source: 'UPDATE',
      question: '재고가 1개 남은 상품을 두 사람이 동시에 주문했다. 재고가 음수가 되지 않게 하는 SQL은?',
      choices: [
        'SELECT stock 후 앱에서 stock - 1을 계산해 UPDATE SET stock = 계산값',
        'UPDATE products SET stock = 0',
        'UPDATE products SET stock = stock - 1 WHERE id = 3 AND stock > 0 후 영향받은 행 수로 성공 여부 판단',
        'DELETE FROM products WHERE stock = 1',
      ],
      answer: 2,
      choiceExplanations: [
        '두 요청이 모두 stock=1을 읽고 각자 0으로 써서 2개가 팔릴 수 있어요(갱신 손실).',
        '재고 관리가 아니에요.',
        '정답. 조건 검사와 감소가 한 문장에서 원자적으로 일어나요. 두 번째 요청은 stock > 0이 거짓이라 0행이 바뀌어요.',
        '상품이 사라져요.',
      ],
      explanation: '"조건부 원자적 UPDATE + affected rows 확인"은 재고·좌석·쿠폰 같은 한정 자원 처리의 기본 패턴이에요. SQLAlchemy에서는 result = db.execute(update(...).where(...)) 후 result.rowcount로 확인해요.',
    },
    {
      id: 'sql-02-08', type: 'short', source: 'UPDATE',
      question: '모든 학생의 나이를 1씩 올리는 SQL의 빈칸은? UPDATE students SET age = ______;',
      answer: ['age + 1', 'age+1'],
      explanation: 'SET age = age + 1. 오른쪽의 age는 "그 행의 현재 값"이에요. 각 행마다 자기 값을 기준으로 계산돼요.\n이렇게 DB가 직접 계산하게 하면 앱에서 읽고-더하고-쓰는 것보다 빠르고 동시성에도 안전해요.',
    },
    {
      id: 'sql-02-09', type: 'mcq', source: 'DELETE',
      question: '사용자를 삭제하려는데 "Cannot delete or update a parent row: a foreign key constraint fails" 에러가 났다. 의미는?',
      choices: ['그 사용자를 참조하는 자식 행(예: 주문)이 남아 있어 FK가 삭제를 막았다', '사용자가 존재하지 않는다', 'DELETE 문법이 틀렸다', 'DB 연결이 끊겼다'],
      answer: 0,
      choiceExplanations: [
        '정답. 자식을 먼저 처리하거나, 설계상 CASCADE/SET NULL을 고려해요.',
        '없는 행을 지우면 에러 없이 0행이 삭제돼요.',
        '문법 에러 메시지가 아니에요.',
        '연결 문제가 아니에요.',
      ],
      explanation: 'FK의 기본 동작(RESTRICT)이 고아 데이터를 막아 준 거예요. 해결은 업무 규칙에 따라 달라요. 주문 기록은 남겨야 하니 사용자를 지우는 대신 "탈퇴" 상태로 바꾸고 개인정보만 지우는 방식이 흔해요.',
    },
    {
      id: 'sql-02-10', type: 'ox', source: 'DELETE',
      question: '수천만 행의 오래된 로그를 DELETE 한 문장으로 한 번에 지우는 것은 운영 중인 서비스에 영향을 줄 수 있다.',
      answer: true,
      explanation: '맞아요. 큰 DELETE는 오랫동안 잠금을 잡고, 되돌리기 위한 로그(undo)를 대량으로 만들고, 복제 지연을 일으켜요.\n나눠서(LIMIT 1만씩 반복) 지우거나, 날짜별 파티션 테이블을 만들어 오래된 파티션을 통째로 DROP 하는 방식을 써요(물리 설계 토픽).',
    },
    {
      id: 'sql-02-11', type: 'mcq', source: 'SELECT와 WHERE',
      question: '나이가 15 이상 17 이하인 학생을 찾는 조건과 같은 것은?',
      choices: ['age > 15 AND age < 17', 'age BETWEEN 15 AND 17', 'age IN (15, 17)', 'age LIKE \'1%\''],
      answer: 1,
      choiceExplanations: [
        '15와 17이 빠져요.',
        '정답. BETWEEN은 양 끝(15와 17)을 포함해요.',
        '15와 17만 고르고 16이 빠져요.',
        '숫자에 패턴 검색을 쓰면 10~19, 100대까지 섞여요.',
      ],
      explanation: 'BETWEEN a AND b = (>= a AND <= b). 정수에는 편하지만, 시각이 있는 DATETIME 범위에서는 끝 경계 처리가 애매해서 >= 시작 AND < 다음날 형태를 권장해요.',
    },
    {
      id: 'sql-02-12', type: 'mcq', source: 'INSERT',
      question: '앱에서 사용자 입력으로 SQL을 만드는 가장 안전한 방법은?',
      choices: [
        'cursor.execute("INSERT INTO t (name) VALUES (%s)", (name,))',
        'sql = "INSERT INTO t VALUES (\'" + name + "\')"',
        'sql = f"INSERT INTO t VALUES (\'{name}\')"',
        'name의 작은따옴표만 지우고 문자열로 붙인다',
      ],
      answer: 0,
      choiceExplanations: [
        '정답. 값은 드라이버가 SQL과 분리해 안전하게 전달해요. 값이 하나여도 (name,) 처럼 쉼표가 필요해요.',
        'SQL 인젝션에 취약하고, 이름에 작은따옴표가 있으면 문법 에러가 나요.',
        'f-string도 문자열 붙이기라 똑같이 위험해요.',
        '우회 방법이 많아 근본 해결이 아니에요.',
      ],
      explanation: '노션 pymysql 노트의 핵심 교훈: SQL에는 자리 표시자(%s)만, 값은 execute의 두 번째 인자로. SQLAlchemy ORM은 이걸 자동으로 해 주고, text() 쓸 때는 :name 파라미터로 해요.',
    },
  ],
}

export default topic
