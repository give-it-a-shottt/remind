import type { Topic } from '../../types'

const topic: Topic = {
  id: 'sql-05-join',
  track: 'backend',
  group: 'SQL',
  title: 'JOIN과 서브쿼리',
  order: 75,
  sections: [
    {
      title: 'INNER JOIN',
      notionIds: ['3efdf951bf808121b05edb966958d9e4'],
      points: [
        'JOIN은 두 테이블을 공통 컬럼(보통 FK = PK)으로 이어 하나의 결과로 만든다. FROM a JOIN b ON a.id = b.a_id.',
        'INNER JOIN(INNER 생략 가능)은 양쪽에 짝이 있는 행만 남긴다.',
        '테이블 별칭(u, o)을 붙이면 짧아지고, 같은 이름의 컬럼(id)이 어느 테이블 것인지 명확해진다. 두 테이블에 같은 이름이 있는데 테이블을 안 적으면 "ambiguous" 에러가 난다.',
        '일대다 JOIN은 "다" 쪽 수만큼 행이 늘어난다. 사용자 1명이 주문 5개면 결과에 그 사용자가 5번 나온다.',
      ],
      code: `SELECT u.nickname, o.id AS order_id, o.total
FROM users AS u
JOIN orders AS o ON o.user_id = u.id
WHERE o.status = 'paid';`,
    },
    {
      title: 'OUTER JOIN',
      notionIds: ['3efdf951bf808121b05edb966958d9e4'],
      points: [
        'LEFT (OUTER) JOIN: 왼쪽 테이블의 모든 행 + 오른쪽은 짝이 있으면 채우고 없으면 NULL.',
        'RIGHT JOIN은 반대 방향이다. 보통 테이블 순서를 바꿔 LEFT JOIN으로 통일해 읽기 쉽게 쓴다. FULL OUTER JOIN은 양쪽 모두(MySQL은 미지원, UNION으로 흉내).',
        '"한쪽에만 있는 데이터 찾기": LEFT JOIN 후 WHERE 오른쪽.id IS NULL → 주문한 적 없는 사용자.',
        '함정: LEFT JOIN한 오른쪽 테이블 조건을 WHERE에 쓰면(WHERE o.status = \'paid\') NULL 행이 걸러져 사실상 INNER JOIN이 된다. 오른쪽 조건은 ON 절에 넣는다.',
      ],
      code: `-- 주문한 적 없는 사용자
SELECT u.id, u.nickname
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
WHERE o.id IS NULL;

-- 사용자별 결제 완료 주문 수 (0건 포함)
SELECT u.id, COUNT(o.id) AS paid_orders
FROM users u
LEFT JOIN orders o ON o.user_id = u.id AND o.status = 'paid'   -- 조건은 ON 에
GROUP BY u.id;`,
    },
    {
      title: '여러 테이블과 셀프 조인',
      notionIds: ['3efdf951bf808121b05edb966958d9e4'],
      points: [
        'JOIN을 이어서 세 개 이상 연결할 수 있다: orders → order_items → products.',
        'JOIN + WHERE + GROUP BY + HAVING + ORDER BY 조합이 분석 쿼리의 기본 뼈대다.',
        '셀프 조인: 같은 테이블을 다른 별칭으로 두 번 쓰기. 직원 테이블의 manager_id → 같은 테이블의 id(상사 이름 붙이기). 트리 구조 토픽과 연결된다.',
        '조인 조건을 빠뜨리면 모든 조합(카티션 곱)이 만들어진다. 1만 × 1만 = 1억 행. 결과 행 수가 이상하게 많으면 ON 절부터 확인한다.',
      ],
      code: `SELECT p.name, SUM(oi.quantity) AS sold
FROM orders o
JOIN order_items oi ON oi.order_id = o.id
JOIN products p     ON p.id = oi.product_id
WHERE o.status = 'paid'
GROUP BY p.id, p.name
HAVING SUM(oi.quantity) >= 10
ORDER BY sold DESC;`,
    },
    {
      title: '서브쿼리',
      notionIds: ['3efdf951bf808121b05edb966958d9e4'],
      points: [
        '괄호 안의 또 다른 SELECT. 위치에 따라 역할이 다르다.',
        'WHERE 컬럼 IN (서브쿼리): 목록에 포함되는지. WHERE 컬럼 > (서브쿼리): 값 하나와 비교(스칼라 서브쿼리, 결과가 2행 이상이면 에러).',
        'FROM (서브쿼리) AS 별칭: 결과를 임시 테이블처럼 쓴다(파생 테이블, MySQL은 별칭 필수).',
        'EXISTS (서브쿼리): 하나라도 있으면 참. 상관 서브쿼리(바깥 쿼리의 컬럼을 참조)와 자주 쓴다.',
        'NOT IN 함정: 서브쿼리 결과에 NULL이 섞이면 NOT IN은 아무 행도 돌려주지 않는다. NOT EXISTS가 안전하다.',
        '여러 테이블의 컬럼이 결과에 필요하면 JOIN, 한 테이블 컬럼만 필요하고 다른 테이블은 조건으로만 쓰면 서브쿼리가 읽기 쉽다. 대부분은 서로 바꿔 쓸 수 있다.',
      ],
      code: `-- JOIN 버전
SELECT i.* FROM items i JOIN ranking r ON r.item_code = i.item_code
WHERE r.sub_category = '여성신발';

-- 서브쿼리 버전
SELECT * FROM items
WHERE item_code IN (SELECT item_code FROM ranking WHERE sub_category = '여성신발');

-- 상관 서브쿼리 + EXISTS: 댓글이 있는 글
SELECT p.* FROM posts p
WHERE EXISTS (SELECT 1 FROM comments c WHERE c.post_id = p.id);`,
    },
  ],
  questions: [
    {
      id: 'sql-05-01', type: 'mcq', source: 'INNER JOIN',
      question: '사용자 3명(A, B, C) 중 A는 주문 2개, B는 1개, C는 0개다. users JOIN orders 의 결과 행 수는?',
      choices: ['2 (짝이 있는 사용자 수)', '4 (C는 NULL로 1행 추가)', '9 (사용자 3 × 주문 3)', '3 (A 2행 + B 1행)'],
      answer: 3,
      choiceExplanations: [
        '사용자 수가 아니라 짝지어진 조합 수예요.',
        'INNER JOIN은 짝이 없는 C를 버려요. NULL 행은 LEFT JOIN에서 생겨요.',
        '그건 조인 조건이 없을 때의 카티션 곱이에요.',
        '정답. A-주문1, A-주문2, B-주문3 = 3행. C는 짝이 없어 빠져요.',
      ],
      explanation: 'INNER JOIN 결과 = 짝이 맞는 모든 조합. 일대다에서는 "다" 쪽 개수만큼 늘어나고, 짝이 없는 행은 사라져요.\nC까지 포함하려면 LEFT JOIN을 써요(C의 주문 컬럼은 NULL).',
    },
    {
      id: 'sql-05-02', type: 'mcq', source: 'INNER JOIN',
      question: 'SELECT id, nickname, total FROM users JOIN orders ON orders.user_id = users.id; 가 "Column \'id\' in field list is ambiguous" 에러를 낸다. 해결은?',
      choices: ['JOIN을 LEFT JOIN으로 바꾼다', 'id 컬럼을 삭제한다', 'id 앞에 어느 테이블인지 적는다(users.id 또는 u.id)', 'ORDER BY를 추가한다'],
      answer: 2,
      choiceExplanations: [
        '조인 종류와 무관해요.',
        '컬럼을 지울 이유가 없어요.',
        '정답. 두 테이블 모두 id가 있어서 어느 것인지 지정해야 해요. 별칭(users AS u)을 쓰면 u.id처럼 짧아요.',
        '관계없어요.',
      ],
      explanation: 'JOIN 쿼리에서는 모든 컬럼에 테이블 별칭을 붙이는 습관을 들이세요. 나중에 다른 테이블을 조인했을 때 갑자기 ambiguous 에러가 나는 걸 막고, 읽는 사람도 출처를 바로 알아요.',
    },
    {
      id: 'sql-05-03', type: 'short', source: 'OUTER JOIN',
      question: '왼쪽 테이블의 모든 행을 남기고 오른쪽은 짝이 없으면 NULL로 채우는 조인은? ______ JOIN',
      answer: ['LEFT', 'left', 'LEFT OUTER', 'left outer'],
      explanation: 'LEFT (OUTER) JOIN이에요. "주문한 적 없는 회원", "댓글 0개인 글 포함 목록", "재고 없는 상품 찾기" 같은 문제는 LEFT JOIN + IS NULL 또는 LEFT JOIN + COUNT(오른쪽.id)로 풀어요.',
    },
    {
      id: 'sql-05-04', type: 'mcq', source: 'OUTER JOIN',
      question: '"모든 사용자와 각자의 결제 완료 주문 수(0건 포함)"를 원했는데 주문 없는 사용자가 결과에서 빠졌다. 원인은?',
      code: `SELECT u.id, COUNT(o.id)
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
WHERE o.status = 'paid'
GROUP BY u.id;`,
      choices: ["오른쪽 테이블 조건(o.status = 'paid')을 WHERE에 둬서, o가 NULL인 행이 걸러져 INNER JOIN처럼 동작했다", 'COUNT(o.id) 때문에', 'GROUP BY 때문에', 'LEFT JOIN은 원래 짝 없는 행을 버린다'],
      answer: 0,
      choiceExplanations: [
        "정답. 짝이 없는 사용자는 o.status가 NULL이라 WHERE를 통과하지 못해요. 조건을 ON 절로 옮기세요: LEFT JOIN orders o ON o.user_id = u.id AND o.status = 'paid'.",
        'COUNT(o.id)는 오히려 0건을 0으로 세 줘요.',
        '그룹화는 정상이에요.',
        'LEFT JOIN은 왼쪽 행을 모두 남겨요. 문제는 그 뒤의 WHERE예요.',
      ],
      explanation: 'LEFT JOIN의 대표 함정이에요. 규칙: "왼쪽 테이블 조건은 WHERE, 오른쪽 테이블 조건은 ON". ON 조건은 "짝을 고르는 조건", WHERE는 "결과를 거르는 조건"이에요.',
    },
    {
      id: 'sql-05-05', type: 'mcq', source: 'OUTER JOIN',
      question: '"한 번도 주문하지 않은 사용자"를 찾는 SQL로 맞는 것은?',
      choices: [
        'SELECT u.* FROM users u JOIN orders o ON o.user_id = u.id WHERE o.id IS NULL',
        'SELECT u.* FROM users u WHERE u.id NOT IN (SELECT user_id FROM orders)  -- user_id에 NULL 가능',
        'SELECT u.* FROM users u WHERE u.id = NULL',
        'SELECT u.* FROM users u LEFT JOIN orders o ON o.user_id = u.id WHERE o.id IS NULL',
      ],
      answer: 3,
      choiceExplanations: [
        'INNER JOIN은 짝 없는 사용자를 이미 버려서 결과가 항상 비어요.',
        'orders.user_id에 NULL이 하나라도 있으면 NOT IN은 아무 행도 돌려주지 않아요. NOT EXISTS가 안전해요.',
        'NULL 비교는 IS NULL이고, 의미도 맞지 않아요.',
        '정답. 짝이 없으면 o.id가 NULL이 되는 성질을 이용해요(안티 조인).',
      ],
      explanation: '"A에는 있고 B에는 없는 것" 찾기(안티 조인)는 세 가지 방법이 있어요: LEFT JOIN ... IS NULL / NOT EXISTS / NOT IN. NULL 함정이 없는 앞의 두 가지를 쓰세요.',
    },
    {
      id: 'sql-05-06', type: 'ox', source: '여러 테이블과 셀프 조인',
      question: 'JOIN에서 ON 조건을 빠뜨리면(또는 FROM a, b만 쓰면) 두 테이블의 모든 행 조합이 만들어질 수 있다.',
      answer: true,
      explanation: '맞아요. 카티션 곱(Cartesian product)이라고 해요. 1만 행 × 1만 행 = 1억 행이 생겨 DB가 멈출 수도 있어요. 결과 행 수가 예상보다 훨씬 많다면 조인 조건부터 확인하세요.',
    },
    {
      id: 'sql-05-07', type: 'mcq', source: '여러 테이블과 셀프 조인',
      question: 'employees(id, name, manager_id) 테이블에서 각 직원 이름과 상사 이름을 함께 보여 주려면?',
      choices: [
        'SELECT name, manager_id FROM employees',
        'SELECT e.name, m.name AS manager FROM employees e LEFT JOIN employees m ON m.id = e.manager_id',
        'SELECT name FROM employees GROUP BY manager_id',
        'SELECT e.name FROM employees e JOIN managers m',
      ],
      answer: 1,
      choiceExplanations: [
        '상사의 id만 나오고 이름은 안 나와요.',
        '정답. 같은 테이블을 직원(e)과 상사(m) 두 역할로 조인해요. 상사가 없는 대표도 남기려고 LEFT JOIN.',
        '그룹화는 이름 매칭이 아니에요.',
        'managers라는 테이블은 없어요.',
      ],
      explanation: '셀프 조인은 "같은 테이블 안의 관계(부모-자식)"를 다룰 때 써요. 한 단계 위는 셀프 조인으로 쉽지만, 여러 단계(조상 전체)는 재귀 쿼리나 폐쇄 테이블이 필요해요(트리 구조 토픽).',
    },
    {
      id: 'sql-05-08', type: 'mcq', source: '서브쿼리',
      question: '스칼라 서브쿼리 WHERE price > (SELECT price FROM products WHERE category = \'TV\') 가 에러 나는 경우는?',
      choices: ['서브쿼리가 2행 이상을 돌려줄 때', '서브쿼리가 1행을 돌려줄 때', '서브쿼리가 숫자를 돌려줄 때', 'price 컬럼에 인덱스가 있을 때'],
      answer: 0,
      choiceExplanations: [
        '정답. > 는 값 하나와 비교해야 하는데 여러 값이 오면 "Subquery returns more than 1 row" 에러가 나요.',
        '1행이면 정상 비교예요.',
        '숫자 비교는 정상이에요.',
        '인덱스와 무관해요.',
      ],
      explanation: '여러 값과 비교하려면 의도에 맞게 바꿔요: > (SELECT MAX(price) ...)(모든 TV보다 비쌈), > ANY(...)(어떤 TV보다라도 비쌈), IN (...)(목록 포함).',
    },
    {
      id: 'sql-05-09', type: 'short', source: '서브쿼리',
      question: '"댓글이 하나라도 있는 글"처럼 서브쿼리 결과가 존재하는지만 확인하는 SQL 연산자는?',
      answer: ['EXISTS', 'exists'],
      explanation: 'EXISTS예요. 하나를 찾는 순간 멈추기 때문에 COUNT(*) > 0보다 효율적이에요. 서브쿼리의 SELECT 목록은 의미가 없어서 SELECT 1을 관례적으로 써요.\nSQLAlchemy: Post.comments.any() 또는 exists().where(...).',
    },
    {
      id: 'sql-05-10', type: 'mcq', source: '서브쿼리',
      question: '노션 실습의 "여성신발 베스트 상품 정보"를 구하는 두 쿼리에 대한 설명으로 맞는 것은?',
      code: `-- A
SELECT i.* FROM items i JOIN ranking r ON r.item_code = i.item_code
WHERE r.sub_category = '여성신발';
-- B
SELECT * FROM items
WHERE item_code IN (SELECT item_code FROM ranking WHERE sub_category = '여성신발');`,
      choices: ['A만 맞다', 'B만 맞다', '둘 다 같은 상품을 찾지만, A는 ranking의 컬럼(순위 등)도 함께 고를 수 있다', '둘 다 에러'],
      answer: 2,
      choiceExplanations: [
        'B도 맞아요.',
        'A도 맞아요.',
        '정답. 결과에 여러 테이블 컬럼이 필요하면 JOIN, 한 테이블 컬럼만 필요하면 서브쿼리가 읽기 쉬워요. (ranking에 같은 상품이 여러 번 있으면 A는 중복 행이 생길 수 있어요.)',
        '둘 다 문법상 맞아요.',
      ],
      explanation: '노션 정리 그대로예요: "여러 테이블 컬럼이 필요하면 JOIN, 한 테이블 컬럼만 필요하고 조건만 다른 테이블이면 서브쿼리". 성능은 DB 옵티마이저가 비슷하게 바꾸는 경우가 많아서, 읽기 쉬운 쪽을 먼저 고르고 실행 계획으로 확인해요.',
    },
    {
      id: 'sql-05-11', type: 'mcq', source: '서브쿼리',
      question: 'FROM 절에 서브쿼리를 쓸 때 MySQL에서 꼭 필요한 것은?',
      choices: ['ORDER BY', 'LIMIT', '서브쿼리 결과에 붙이는 별칭(AS t)', 'DISTINCT'],
      answer: 2,
      choiceExplanations: [
        '선택이에요.',
        '선택이에요.',
        '정답. "Every derived table must have its own alias" 에러가 나요.',
        '선택이에요.',
      ],
      explanation: 'FROM (SELECT ...) AS t 처럼 파생 테이블(derived table)에는 이름이 필요해요. 복잡하면 WITH t AS (SELECT ...) SELECT ... FROM t 처럼 CTE(공통 테이블 식)로 쓰면 더 읽기 좋아요(MySQL 8+, PostgreSQL).',
    },
    {
      id: 'sql-05-12', type: 'ox', source: 'INNER JOIN',
      question: '사용자와 주문을 JOIN한 뒤 SUM(u.point)를 구하면, 주문이 많은 사용자의 포인트가 여러 번 더해질 수 있다.',
      answer: true,
      explanation: '맞아요. 일대다 JOIN은 "일" 쪽 행을 "다" 쪽 개수만큼 복제해요. 그 상태로 "일" 쪽 컬럼을 합치면 중복 합산돼요(팬아웃 문제).\n해결: 집계를 먼저 하고 조인하기(주문을 사용자별로 GROUP BY한 서브쿼리와 조인), 또는 필요한 집계를 서로 다른 쿼리로 나누기.',
    },
  ],
}

export default topic
