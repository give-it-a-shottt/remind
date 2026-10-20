import type { Topic } from '../../types'

const topic: Topic = {
  id: 'sql-03-select',
  track: 'backend',
  group: 'SQL',
  title: 'SELECT 심화: 정렬 · 페이지 · 별칭 · 함수 · CASE',
  order: 73,
  sections: [
    {
      title: '처음 보는 테이블 파악하기',
      notionIds: ['3efdf951bf8081c3ab6dc3b5d4c0528d'],
      points: [
        '현업 DB는 설명서가 부족한 경우가 많다. 구조(DESC 테이블)와 실제 값(SELECT * ... LIMIT 10)을 직접 보며 의미를 파악한다.',
        'SELECT COUNT(*) 로 규모를 보고, SELECT DISTINCT 컬럼 으로 어떤 값들이 있는지 본다. 예: Sakila의 film.rating은 G, PG, PG-13, R, NC-17 같은 등급이다(도메인 지식 필요).',
        '큰 테이블에서 LIMIT 없는 SELECT * 는 서버와 내 컴퓨터 모두를 힘들게 한다. 탐색할 때는 항상 LIMIT을 붙인다.',
      ],
      code: `DESC film;
SELECT * FROM film LIMIT 5;
SELECT COUNT(*) FROM film;
SELECT DISTINCT rating FROM film;`,
    },
    {
      title: 'ORDER BY와 LIMIT/OFFSET',
      notionIds: ['3efdf951bf8081c3ab6dc3b5d4c0528d'],
      points: [
        'ORDER BY 컬럼 ASC(오름차순, 기본) / DESC(내림차순). 여러 기준: ORDER BY rating, length DESC.',
        'ORDER BY가 없으면 결과 순서는 보장되지 않는다. "보통 id 순으로 나오던데"는 우연이다.',
        'LIMIT n: n개만. LIMIT n OFFSET m: m개 건너뛰고 n개(MySQL은 LIMIT m, n 표기도 가능). 페이지네이션의 기본.',
        'Top-N 질의: "가장 긴 영화 5개" → ORDER BY length DESC LIMIT 5.',
      ],
    },
    {
      title: '별칭(AS)과 계산 컬럼',
      notionIds: ['3efdf951bf8081c3ab6dc3b5d4c0528d'],
      points: [
        'SELECT 식 AS 이름 으로 결과 컬럼 이름을 바꾼다. AS는 생략 가능하다. 테이블에도 별칭을 붙인다: FROM film AS f.',
        'SELECT 안에서 계산할 수 있다: rental_rate * 1.1 AS price_with_tax, FLOOR(length / 60) AS hours.',
        'SELECT에서 만든 별칭은 WHERE에서 쓸 수 없다. WHERE가 SELECT보다 먼저 실행되기 때문이다. ORDER BY에서는 쓸 수 있다.',
        'SQL 작성 순서: SELECT → FROM → WHERE → GROUP BY → HAVING → ORDER BY → LIMIT. 실행 순서: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT.',
      ],
      code: `SELECT title, length, FLOOR(length / 60) AS hours
FROM film
WHERE length > 120          -- WHERE hours >= 2  ← 에러 (별칭 아직 없음)
ORDER BY hours DESC, title  -- ORDER BY 에서는 별칭 OK
LIMIT 10;`,
    },
    {
      title: '자주 쓰는 함수',
      points: [
        '문자열: CONCAT(a, b), LENGTH(s)(바이트)/CHAR_LENGTH(s)(글자 수), UPPER/LOWER, SUBSTRING(s, 시작, 길이), TRIM, REPLACE.',
        '숫자: ROUND(x, 자릿수), FLOOR(내림), CEIL(올림), ABS, MOD.',
        '날짜: NOW(), CURDATE(), DATE(dt), YEAR(dt), DATE_FORMAT(dt, \'%Y-%m\')(MySQL), DATE_ADD(dt, INTERVAL 7 DAY), DATEDIFF(a, b).',
        'NULL 처리: COALESCE(a, b, ...)(첫 번째 NULL이 아닌 값), IFNULL(a, 기본값)(MySQL). NULL과의 산술 결과는 NULL이다(5 + NULL = NULL).',
        '주의: WHERE YEAR(created_at) = 2026 처럼 컬럼에 함수를 씌우면 그 컬럼의 인덱스를 쓰지 못한다. created_at >= \'2026-01-01\' AND created_at < \'2027-01-01\' 로 바꾼다.',
      ],
      code: `SELECT CONCAT(first_name, ' ', last_name) AS full_name,
       COALESCE(email, '(없음)') AS email,
       DATE_FORMAT(create_date, '%Y-%m') AS joined_month
FROM customer
LIMIT 5;`,
    },
    {
      title: 'CASE 식',
      points: [
        'CASE WHEN 조건1 THEN 값1 WHEN 조건2 THEN 값2 ELSE 기본값 END. SQL 안의 if/elif/else다.',
        '구간 나누기: length < 60 → "짧음", < 120 → "보통", 그 외 → "긺".',
        '조건부 집계: SUM(CASE WHEN status = \'paid\' THEN amount ELSE 0 END) 처럼 한 번의 조회로 여러 조건의 합계를 구할 수 있다(피벗).',
        'ELSE가 없으면 해당하지 않는 경우 NULL이 된다.',
      ],
      code: `SELECT title,
       CASE
         WHEN length < 60  THEN '짧음'
         WHEN length < 120 THEN '보통'
         ELSE '긺'
       END AS length_group
FROM film;`,
    },
  ],
  questions: [
    {
      id: 'sql-03-01', type: 'mcq', source: '처음 보는 테이블 파악하기',
      question: '처음 받은 테이블 rental의 컬럼 구조와 값의 생김새를 빠르게 확인하는 방법으로 가장 알맞은 것은?',
      choices: ['SELECT * FROM rental;', 'DESC rental; 와 SELECT * FROM rental LIMIT 10;', 'DELETE FROM rental;', 'DROP TABLE rental;'],
      answer: 1,
      choiceExplanations: [
        '수만~수억 행을 다 가져와 느리고 화면도 넘쳐요.',
        '정답. 구조(DESC)와 일부 샘플(LIMIT)을 보면 충분해요.',
        '데이터를 지워요!',
        '테이블을 지워요!',
      ],
      explanation: '노션 Sakila 실습의 교훈: "현업 DB는 설명이 부족해서 데이터를 직접 봐야 한다". DESC → LIMIT 샘플 → COUNT(*) → DISTINCT로 값의 종류 확인 순서로 파악해요.',
    },
    {
      id: 'sql-03-02', type: 'short', source: '처음 보는 테이블 파악하기',
      question: 'film 테이블의 rating 컬럼에 어떤 값들이 있는지(중복 없이) 보려면 SELECT ________ rating FROM film; 의 빈칸은?',
      answer: ['DISTINCT', 'distinct'],
      explanation: 'SELECT DISTINCT rating FROM film; 이에요. 종류별 개수까지 보려면 SELECT rating, COUNT(*) FROM film GROUP BY rating;(다음 토픽).',
    },
    {
      id: 'sql-03-03', type: 'mcq', source: 'ORDER BY와 LIMIT/OFFSET',
      question: '"상영 시간이 가장 긴 영화 3개"를 구하는 SQL은?',
      choices: [
        'SELECT title FROM film LIMIT 3 ORDER BY length DESC;',
        'SELECT title FROM film ORDER BY length LIMIT 3;',
        'SELECT MAX(length) FROM film LIMIT 3;',
        'SELECT title FROM film ORDER BY length DESC LIMIT 3;',
      ],
      answer: 3,
      choiceExplanations: [
        '절 순서가 틀려 문법 에러예요. LIMIT은 마지막이에요.',
        '오름차순이라 가장 짧은 3개예요.',
        '최댓값 하나만 나와요.',
        '정답. 내림차순 정렬 후 위에서 3개.',
      ],
      explanation: 'Top-N = ORDER BY ... DESC LIMIT N. 동점이 있으면 어떤 행이 잘릴지 정해지지 않으니 ORDER BY length DESC, film_id처럼 두 번째 기준을 주면 결과가 일정해져요.',
    },
    {
      id: 'sql-03-04', type: 'ox', source: 'ORDER BY와 LIMIT/OFFSET',
      question: 'ORDER BY가 없어도 SELECT 결과는 항상 기본 키 순서로 나온다고 보장된다.',
      answer: false,
      explanation: '보장되지 않아요. 실행 계획, 인덱스 사용, 병렬 처리, 데이터 변경에 따라 순서가 바뀔 수 있어요. 순서가 중요하면(특히 페이지네이션) 반드시 ORDER BY를 써야 해요.',
    },
    {
      id: 'sql-03-05', type: 'mcq', source: '별칭(AS)과 계산 컬럼',
      question: '다음 SQL이 에러 나는 이유는?',
      code: `SELECT title, rental_rate * 1.1 AS price
FROM film
WHERE price > 3;`,
      choices: ['곱셈을 SELECT에서 쓸 수 없어서', 'WHERE가 SELECT보다 먼저 실행돼 별칭 price가 아직 없어서', 'AS를 생략해야 해서', 'price는 예약어라서'],
      answer: 1,
      choiceExplanations: [
        'SELECT에서 계산할 수 있어요.',
        '정답. WHERE rental_rate * 1.1 > 3 으로 식을 다시 쓰거나, 서브쿼리로 감싸야 해요.',
        'AS 유무와 관계없어요.',
        '예약어 문제가 아니에요.',
      ],
      explanation: '논리적 실행 순서 FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT 를 기억하세요. SELECT 별칭은 그 뒤인 ORDER BY에서만 쓸 수 있어요(MySQL은 HAVING에서도 허용하는 확장이 있어요).',
    },
    {
      id: 'sql-03-06', type: 'short', source: '별칭(AS)과 계산 컬럼',
      question: 'SQL의 논리적 실행 순서에서 FROM 다음으로 실행되는 절은?',
      answer: ['WHERE', 'where'],
      explanation: 'FROM(어디서) → WHERE(행 거르기) → GROUP BY(묶기) → HAVING(그룹 거르기) → SELECT(컬럼 고르기·계산) → ORDER BY(정렬) → LIMIT(자르기).\n이 순서가 "왜 WHERE에서 집계 함수를 못 쓰는가", "왜 별칭을 WHERE에서 못 쓰는가"의 답이에요.',
    },
    {
      id: 'sql-03-07', type: 'mcq', source: '자주 쓰는 함수',
      question: 'SELECT 5 + NULL; 의 결과는?',
      choices: ['5', '0', '에러', 'NULL'],
      answer: 3,
      choiceExplanations: [
        'NULL을 0으로 취급하지 않아요.',
        'NULL은 0이 아니에요.',
        '에러 없이 NULL이 나와요.',
        '정답. 모르는 값과의 계산 결과도 모르는 값이에요.',
      ],
      explanation: 'NULL은 계산에 섞이면 결과를 NULL로 만들어요. 할인 금액 컬럼이 NULL인 행에서 price - discount가 NULL이 되는 식의 버그가 흔해요. COALESCE(discount, 0)처럼 기본값을 줘서 계산해요.\n단, 집계 함수(SUM, AVG, COUNT(컬럼))는 NULL을 건너뛰고 계산해요.',
    },
    {
      id: 'sql-03-08', type: 'short', source: '자주 쓰는 함수',
      question: '인자 중 첫 번째로 NULL이 아닌 값을 돌려주는 표준 SQL 함수는? (예: ________(nickname, email, \'익명\'))',
      answer: ['COALESCE', 'coalesce'],
      explanation: 'COALESCE예요. 표준 SQL이라 MySQL·PostgreSQL·SQLite 모두에서 동작해요(MySQL IFNULL은 인자 2개 전용).\nSQLAlchemy: func.coalesce(User.nickname, User.email).',
    },
    {
      id: 'sql-03-09', type: 'mcq', source: '자주 쓰는 함수',
      question: 'created_at에 인덱스가 있다. 2026년 주문을 찾는 조건 중 인덱스를 잘 활용하는 것은?',
      choices: [
        "WHERE YEAR(created_at) = 2026",
        "WHERE created_at >= '2026-01-01' AND created_at < '2027-01-01'",
        "WHERE DATE_FORMAT(created_at, '%Y') = '2026'",
        "WHERE created_at LIKE '2026%'",
      ],
      answer: 1,
      choiceExplanations: [
        '컬럼에 함수를 씌우면 모든 행마다 함수를 계산해야 해서 인덱스 범위 검색을 못 해요.',
        '정답. 컬럼을 그대로 두고 범위로 비교하면 인덱스에서 시작점과 끝점을 바로 찾아요.',
        '마찬가지로 함수 때문에 인덱스를 못 써요.',
        '날짜를 문자열로 바꿔 비교해 인덱스를 제대로 못 쓰고 DB마다 동작이 달라요.',
      ],
      explanation: '인덱스 활용 원칙: "WHERE 절에서 인덱스 컬럼을 가공하지 말고, 비교 값 쪽을 가공한다". 이런 조건을 sargable(인덱스로 검색 가능한) 조건이라고 해요(DB 성능 토픽).',
    },
    {
      id: 'sql-03-10', type: 'mcq', source: 'CASE 식',
      question: '다음 CASE 식에서 length = 120인 영화의 결과는?',
      code: `CASE
  WHEN length < 60  THEN '짧음'
  WHEN length < 120 THEN '보통'
  ELSE '긺'
END`,
      choices: ['짧음', '보통', 'NULL', '긺'],
      answer: 3,
      choiceExplanations: [
        '120 < 60은 거짓이에요.',
        '120 < 120은 거짓이에요(같으면 미만이 아님).',
        'ELSE가 있어서 NULL이 아니에요.',
        '정답. 앞의 조건이 모두 거짓이라 ELSE로 가요.',
      ],
      explanation: 'CASE는 위에서부터 처음 참인 WHEN의 값을 돌려줘요(파이썬 if/elif와 같음). 경계값(60, 120)이 어느 구간에 들어가는지 늘 확인하세요.',
    },
    {
      id: 'sql-03-11', type: 'mcq', source: 'CASE 식',
      question: '주문 테이블에서 결제 완료 금액과 환불 금액을 한 번의 조회로 각각 합산하려 한다. 알맞은 방법은?',
      choices: [
        "SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END), SUM(CASE WHEN status = 'refunded' THEN amount ELSE 0 END)",
        '조회를 두 번 한다',
        "WHERE status = 'paid' AND status = 'refunded'",
        'GROUP BY amount',
      ],
      answer: 0,
      choiceExplanations: [
        '정답. 조건부 집계로 한 번 훑으며 두 합계를 동시에 구해요.',
        '동작은 하지만 테이블을 두 번 읽어요.',
        '한 행의 status가 동시에 두 값일 수 없어서 0건이에요.',
        '금액별로 묶여 의미 없는 결과가 나와요.',
      ],
      explanation: '조건부 집계(CASE + 집계 함수)는 대시보드 쿼리에서 정말 자주 써요. PostgreSQL은 SUM(amount) FILTER (WHERE status = \'paid\') 문법도 있어요.',
    },
    {
      id: 'sql-03-12', type: 'ox', source: '자주 쓰는 함수',
      question: "MySQL에서 LENGTH('가나다')와 CHAR_LENGTH('가나다')는 utf8mb4 기준으로 같은 값을 돌려준다.",
      answer: false,
      explanation: 'LENGTH는 바이트 수(한글 한 글자 = 3바이트 → 9), CHAR_LENGTH는 글자 수(3)예요. "닉네임 10자 이하" 같은 규칙은 CHAR_LENGTH로 검사해야 해요. VARCHAR(n)의 n도 MySQL에서는 글자 수예요.',
    },
  ],
}

export default topic
