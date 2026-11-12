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
      slides: [
        {
          title: '두 테이블을 이어 붙이기',
          blocks: [
            { type: 'say', text: '회원은 users에, 주문은 orders에 따로 있어요. "누가 무엇을 주문했나"를 보려면 두 테이블을 **이어 붙여야** 해요. 그게 **JOIN**이에요. 보통 **FK = PK**로 이어요.' },
            { type: 'code', code: `SELECT u.nickname, o.id AS order_id, o.total
FROM users AS u
JOIN orders AS o ON o.user_id = u.id
WHERE o.status = 'paid';` },
            { type: 'say', text: '`INNER JOIN`(INNER는 생략 가능)은 **양쪽에 짝이 있는 행만** 남겨요. 주문이 없는 회원은 결과에 안 나와요.\n\n테이블 별칭(`u`, `o`)을 붙이면 짧아지고, **같은 이름의 컬럼**(id)이 어느 테이블 것인지 분명해져요. 두 테이블에 다 있는 `id`를 테이블 없이 쓰면 **"ambiguous"**(모호하다) 에러가 나요.' },
          ],
        },
        {
          title: 'JOIN하면 행이 늘어나요',
          blocks: [
            { type: 'code', code: `users: A, B, C
orders: A의 주문 2개, B의 주문 1개, C는 0개

users JOIN orders → 3행  (A, A, B)` },
            { type: 'say', text: '**일대다** JOIN은 "다" 쪽 수만큼 행이 늘어나요. A는 주문이 2개라 결과에 **두 번** 나와요. C는 짝이 없어 빠지고요.' },
            { type: 'note', tone: 'warn', text: '그래서 JOIN한 뒤 `SUM(u.point)`를 하면, 주문이 많은 회원의 포인트가 **주문 수만큼 여러 번** 더해져요. "한" 쪽 값을 집계할 땐 JOIN 전에 집계하거나 다른 방법을 써야 해요.' },
          ],
        },
      ],
    },
    {
      title: 'OUTER JOIN',
      notionIds: ['3efdf951bf808121b05edb966958d9e4'],
      slides: [
        {
          title: 'LEFT JOIN: 왼쪽은 전부 남겨요',
          blocks: [
            { type: 'say', text: '"**모든** 회원과 각자의 주문 수(0건 포함)"를 보고 싶다면? INNER JOIN은 주문 없는 회원을 빼 버리죠. **LEFT JOIN**은 **왼쪽 테이블의 모든 행**을 남기고, 오른쪽은 짝이 있으면 채우고 **없으면 NULL**로 둬요.' },
            { type: 'code', code: `-- 주문한 적 없는 사용자
SELECT u.id, u.nickname
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
WHERE o.id IS NULL;` },
            { type: 'say', text: '"**한쪽에만** 있는 데이터"를 찾는 공식이에요. LEFT JOIN 후 오른쪽이 NULL인 행 = 짝이 없는 행 = 주문한 적 없는 회원.\n\n`RIGHT JOIN`은 방향만 반대예요. 보통 테이블 순서를 바꿔 **LEFT JOIN으로 통일**해서 읽기 쉽게 써요. `FULL OUTER JOIN`(양쪽 다)은 MySQL에 없어서 UNION으로 흉내 내요.' },
          ],
        },
        {
          title: '오른쪽 조건은 ON에',
          blocks: [
            { type: 'code', code: `-- ❌ 주문 없는 회원이 사라짐
SELECT u.id, COUNT(o.id) FROM users u
LEFT JOIN orders o ON o.user_id = u.id
WHERE o.status = 'paid'          -- NULL 행은 여기서 탈락 → 사실상 INNER JOIN
GROUP BY u.id;

-- ✅ 조건을 ON 으로
SELECT u.id, COUNT(o.id) AS paid_orders FROM users u
LEFT JOIN orders o ON o.user_id = u.id AND o.status = 'paid'
GROUP BY u.id;` },
            { type: 'note', tone: 'warn', text: '아주 흔한 함정이에요. LEFT JOIN으로 살려 둔 "짝 없는 행"은 오른쪽이 **NULL**이에요. 그런데 WHERE에 `o.status = \'paid\'`를 쓰면 NULL은 조건을 통과 못 해서 **다시 사라져요.** 오른쪽 테이블 조건은 **ON 절**에 넣어야 "짝을 찾을 때의 조건"이 돼요.' },
          ],
        },
      ],
    },
    {
      title: '여러 테이블과 셀프 조인',
      notionIds: ['3efdf951bf808121b05edb966958d9e4'],
      slides: [
        {
          title: '세 개 이상 잇기',
          blocks: [
            { type: 'code', code: `SELECT p.name, SUM(oi.quantity) AS sold
FROM orders o
JOIN order_items oi ON oi.order_id = o.id
JOIN products p     ON p.id = oi.product_id
WHERE o.status = 'paid'
GROUP BY p.id, p.name
HAVING SUM(oi.quantity) >= 10
ORDER BY sold DESC;` },
            { type: 'say', text: 'JOIN은 이어서 계속 붙일 수 있어요. 주문 → 주문 항목 → 상품. 그리고 **JOIN + WHERE + GROUP BY + HAVING + ORDER BY**, 이 조합이 분석 쿼리의 기본 뼈대예요. 지금까지 배운 게 전부 한 문장에 들어 있죠.' },
            { type: 'note', tone: 'warn', text: 'ON 조건을 빠뜨리면(`FROM a, b`만 쓰면) **모든 조합**(카티션 곱)이 만들어져요. 1만 × 1만 = **1억 행**. 결과 행 수가 이상하게 많으면 ON 절부터 확인해요.' },
          ],
        },
        {
          title: '셀프 조인',
          blocks: [
            { type: 'code', code: `-- employees(id, name, manager_id)
SELECT e.name AS employee, m.name AS manager
FROM employees e
LEFT JOIN employees m ON m.id = e.manager_id;` },
            { type: 'say', text: '같은 테이블을 **다른 별칭으로 두 번** 쓰는 것도 JOIN이에요. 직원의 `manager_id`가 같은 테이블의 `id`를 가리킬 때, `e`(직원)와 `m`(상사)로 나눠 이으면 직원 옆에 상사 이름을 붙일 수 있어요. 사장님은 상사가 없으니 LEFT JOIN으로 남겨요. 트리 구조 수업과 이어지는 내용이에요.' },
          ],
        },
      ],
    },
    {
      title: '서브쿼리',
      notionIds: ['3efdf951bf808121b05edb966958d9e4'],
      slides: [
        {
          title: '괄호 안의 또 다른 SELECT',
          blocks: [
            {
              type: 'table',
              head: ['위치', '역할', '예'],
              rows: [
                ['`WHERE x IN (서브쿼리)`', '**목록**에 포함되나', '여성신발 랭킹에 있는 상품'],
                ['`WHERE x > (서브쿼리)`', '**값 하나**와 비교 (스칼라)', '평균보다 비싼 상품'],
                ['`FROM (서브쿼리) AS t`', '결과를 **임시 테이블**처럼 (MySQL은 **별칭 필수**)', '윈도우 함수 결과 거르기'],
                ['`WHERE EXISTS (서브쿼리)`', '**하나라도 있으면** 참', '댓글이 있는 글'],
              ],
            },
            { type: 'note', tone: 'warn', text: '스칼라 서브쿼리 `WHERE price > (SELECT price FROM products WHERE category = \'TV\')`는 TV가 **2개 이상**이면 에러예요. "값 하나"와 비교해야 하는데 여러 개가 왔으니까요. `MAX(price)` 등으로 하나로 만들어요.' },
          ],
        },
        {
          title: 'EXISTS와 NOT IN 함정',
          blocks: [
            { type: 'code', code: `-- 상관 서브쿼리 + EXISTS: 댓글이 있는 글
SELECT p.* FROM posts p
WHERE EXISTS (SELECT 1 FROM comments c WHERE c.post_id = p.id);` },
            { type: 'say', text: '안쪽 쿼리가 바깥의 `p.id`를 참조하죠. 이런 걸 **상관 서브쿼리**라고 해요. EXISTS는 "있나 없나"만 보니 `SELECT 1`이면 충분해요.' },
            { type: 'note', tone: 'warn', text: '`NOT IN (서브쿼리)`의 결과에 **NULL이 하나라도** 섞이면 아무 행도 안 나와요. "x는 NULL이 아니다"를 알 수 없으니 조건 전체가 "모름"이 되거든요. 부정 조건은 **`NOT EXISTS`** 가 안전해요.' },
          ],
        },
        {
          title: 'JOIN이냐 서브쿼리냐',
          blocks: [
            { type: 'code', code: `-- JOIN 버전
SELECT i.* FROM items i JOIN ranking r ON r.item_code = i.item_code
WHERE r.sub_category = '여성신발';

-- 서브쿼리 버전
SELECT * FROM items
WHERE item_code IN (SELECT item_code FROM ranking WHERE sub_category = '여성신발');` },
            { type: 'say', text: '두 쿼리는 같은 상품을 찾아요. 대부분 서로 바꿔 쓸 수 있어요. 고르는 기준은 **결과에 어느 테이블 컬럼이 필요하냐**예요.\n• 여러 테이블의 컬럼이 결과에 필요 → **JOIN**\n• 한 테이블 컬럼만 필요하고 다른 테이블은 **조건으로만** 쓴다 → **서브쿼리**가 읽기 쉬움' },
          ],
        },
      ],
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
