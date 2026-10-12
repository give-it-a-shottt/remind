import type { Topic } from '../../types'

const topic: Topic = {
  id: 'my-07-join',
  track: 'backend',
  group: 'MySQL',
  title: 'MySQL 7강 - JOIN & 서브쿼리',
  order: 107,
  notionId: '3efdf951bf808121b05edb966958d9e4',
  sections: [
    { title: 'JOIN이란?', points: ['두 개 이상의 테이블을 공통 컬럼으로 연결해 하나의 결과로', 'INNER JOIN: 양쪽에 매칭되는 행만 (가장 많이 씀)', 'LEFT OUTER JOIN: 왼쪽 전부 + 오른쪽은 매칭되는 것만 (없으면 NULL)', 'RIGHT OUTER JOIN: 오른쪽 전부 + 왼쪽은 매칭되는 것만'] },
    { title: 'INNER JOIN', points: ['FROM 테이블1 INNER JOIN 테이블2 ON 연결 조건', 'INNER는 생략 가능, 테이블 별칭(a, b)을 붙이면 편함'] },
    { title: 'JOIN 연습', points: ['JOIN + WHERE + GROUP BY + HAVING + ORDER BY 조합', '예: 신발/잡화 베스트상품 10개 이상인 판매자, 많은 순'] },
    { title: 'OUTER JOIN 활용', points: ['한쪽에만 있는 데이터 찾기: 매칭 안 된 쪽이 NULL → WHERE ... IS NULL'] },
    { title: '서브쿼리', points: ['SQL 안에 괄호로 넣은 또 다른 SQL', '검색 범위를 먼저 좁힐 때', '대부분 JOIN으로도 바꿀 수 있음: 여러 테이블 컬럼이 필요하면 JOIN, 한 테이블 컬럼만 필요하고 조건만 다른 테이블이면 서브쿼리도 자연스러움'] },
    { title: '같은 문제를 두 가지로', points: ["JOIN: ... JOIN ranking ON ... WHERE sub_category = '여성신발'", "서브쿼리: WHERE item_code IN (SELECT item_code FROM ranking WHERE sub_category = '여성신발')"] },
    { title: '서브쿼리가 들어갈 수 있는 위치', points: ['WHERE ... IN (서브쿼리): 결과 목록에 포함되는지', 'WHERE 컬럼 > (서브쿼리): 값 하나와 비교', 'FROM (서브쿼리): 결과를 테이블처럼 (MySQL은 별칭 필수)'] },
    { title: '연습: 할인가 10만원 이상 상품 수', points: ['메인 카테고리별 dis_price >= 100000 상품 수를 JOIN과 서브쿼리 두 방식으로'] },
    { title: '추가 연습', points: ['GROUP BY main_category, sub_category 처럼 여러 컬럼으로 묶기', 'GROUP BY 메인 카테고리, 판매자 + HAVING COUNT(*) >= 20'] },
  ],
  questions: [
    { id: 'my-07-01', type: 'mcq', source: 'JOIN이란?', question: '양쪽 테이블에 매칭되는 행만 가져오는 JOIN은?', choices: ['INNER JOIN', 'LEFT OUTER JOIN', 'RIGHT OUTER JOIN', 'CROSS JOIN'], answer: 0, explanation: 'INNER = 교집합.' },
    { id: 'my-07-02', type: 'ox', source: 'JOIN이란?', question: 'LEFT OUTER JOIN에서 오른쪽에 매칭되는 행이 없으면 오른쪽 컬럼은 NULL로 채워진다.', answer: true, explanation: '왼쪽은 전부, 오른쪽은 매칭되는 것만.' },
    { id: 'my-07-03', type: 'mcq', source: 'INNER JOIN', question: 'INNER JOIN에서 연결 조건을 쓰는 키워드는?', choices: ['WHERE', 'ON', 'USING만', 'WITH'], answer: 1, explanation: 'FROM a JOIN b ON a.item_code = b.item_code.' },
    { id: 'my-07-04', type: 'short', source: 'JOIN 연습', question: '신발/잡화에서 판매자별 베스트상품 수를 많은 순으로 볼 때 마지막 절은? (ORDER BY ...)', answer: ['ORDER BY best_count DESC', 'ORDER BY COUNT(*) DESC'], explanation: 'COUNT(*) AS best_count 별칭을 정렬에 사용.' },
    { id: 'my-07-05', type: 'mcq', source: 'OUTER JOIN 활용', question: 'customer가 쓰지 않는 address를 찾는 패턴은?', choices: ['INNER JOIN 후 WHERE A.address_id IS NULL', 'customer RIGHT OUTER JOIN address 후 WHERE C.customer_id IS NULL', 'LEFT JOIN 후 ORDER BY', 'DISTINCT address'], answer: 1, explanation: '매칭 안 된 쪽(customer)이 NULL이 되므로 IS NULL로 걸러요.' },
    { id: 'my-07-06', type: 'essay', source: '서브쿼리', question: 'JOIN과 서브쿼리 중 어느 쪽을 쓸지 고르는 기준은?', answer: '결과에 여러 테이블의 컬럼이 함께 필요하면 JOIN을 쓰고, 결과는 한 테이블 컬럼만 필요하고 조건만 다른 테이블에 있으면 WHERE ... IN (서브쿼리)도 자연스럽다. 대부분은 서로 바꿔 쓸 수 있다.', keywords: ['여러 테이블 컬럼', '조건만 다른 테이블'], explanation: '같은 문제를 두 방식으로 연습해 보기.' },
    { id: 'my-07-07', type: 'mcq', source: '같은 문제를 두 가지로', question: "여성신발 상품 제목을 서브쿼리로 구할 때 WHERE 절은?", choices: ["WHERE item_code = (SELECT * FROM ranking)", "WHERE item_code IN (SELECT item_code FROM ranking WHERE sub_category = '여성신발')", "WHERE sub_category = '여성신발'", "WHERE EXISTS ranking"], answer: 1, explanation: '서브쿼리 결과 목록에 포함되는지 IN으로.' },
    { id: 'my-07-08', type: 'ox', source: '서브쿼리가 들어갈 수 있는 위치', question: 'MySQL에서 FROM 절에 서브쿼리를 쓸 때는 별칭이 필수다.', answer: true, explanation: 'FROM (SELECT ...) AS t 처럼 이름을 붙여야 해요.' },
    { id: 'my-07-09', type: 'mcq', source: '서브쿼리가 들어갈 수 있는 위치', question: 'WHERE category_id > (SELECT category_id FROM category WHERE name = "Comedy") 에서 서브쿼리 결과는 몇 개여야 할까?', choices: ['여러 개', '정확히 하나', '0개', '상관없음'], answer: 1, explanation: '> 같은 비교는 값 하나와 비교해요. 여러 개면 IN.' },
    { id: 'my-07-10', type: 'short', source: '연습: 할인가 10만원 이상 상품 수', question: '서브쿼리 버전에서 items 조건 부분: WHERE item_code IN (SELECT item_code FROM items WHERE ?)', answer: ['dis_price >= 100000'], explanation: '할인가 10만원 이상.' },
    { id: 'my-07-11', type: 'ox', source: '추가 연습', question: 'GROUP BY에는 컬럼을 여러 개 써서 묶을 수 있다.', answer: true, explanation: 'GROUP BY main_category, sub_category.' },
  ],
}

export default topic
