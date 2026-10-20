import type { Topic } from '../../types'

const topic: Topic = {
  id: 'sql-04-groupby',
  track: 'backend',
  group: 'SQL',
  title: '집계 함수 · GROUP BY · HAVING',
  order: 74,
  sections: [
    {
      title: '집계 함수',
      notionIds: ['3efdf951bf8081c3ab6dc3b5d4c0528d'],
      points: [
        'COUNT, SUM, AVG, MAX, MIN은 여러 행을 하나의 값으로 요약한다.',
        'COUNT(*)는 행 수(NULL 포함), COUNT(컬럼)은 그 컬럼이 NULL이 아닌 행 수, COUNT(DISTINCT 컬럼)은 서로 다른 값의 개수.',
        'SUM·AVG·MAX·MIN은 NULL을 건너뛴다. AVG(score)는 점수가 NULL인 사람을 분모에서 뺀다. NULL을 0으로 보고 싶으면 AVG(COALESCE(score, 0)).',
        '행이 하나도 없으면 COUNT는 0, SUM·AVG·MAX는 NULL을 돌려준다.',
      ],
      code: `SELECT COUNT(*)            AS total_films,
       COUNT(DISTINCT rating) AS rating_kinds,
       AVG(length)          AS avg_len,
       MAX(rental_rate)     AS max_rate
FROM film;`,
    },
    {
      title: 'GROUP BY',
      notionIds: ['3efdf951bf8081c3ab6dc3b5d4c0528d', '3efdf951bf8081c88fdcc74323cc24b7'],
      points: [
        'GROUP BY 컬럼 은 같은 값을 가진 행끼리 묶고, 묶음마다 집계 함수를 계산한다. 예: 등급별 영화 수, 카테고리별 상품 수.',
        'SELECT에는 GROUP BY에 쓴 컬럼과 집계 함수만 올 수 있다. 묶음 안에서 값이 여러 개인 컬럼(title)을 그냥 쓰면 표준 SQL과 PostgreSQL은 에러, MySQL(ONLY_FULL_GROUP_BY 꺼짐)은 아무 값이나 골라 보여 준다. 후자는 버그의 원인이다.',
        '여러 컬럼으로 묶기: GROUP BY main_category, sub_category → 조합별 집계.',
        '노션 크롤링 실습처럼 "수집 → 저장 → GROUP BY로 분석"은 데이터 파이프라인의 기본 흐름이다.',
      ],
      code: `SELECT rating, COUNT(*) AS cnt, ROUND(AVG(length), 1) AS avg_len
FROM film
GROUP BY rating
ORDER BY cnt DESC;`,
    },
    {
      title: 'WHERE와 HAVING',
      notionIds: ['3efdf951bf80815593d8ef50293c054f'],
      points: [
        'WHERE: 묶기 전에 개별 행을 거른다. 집계 함수를 쓸 수 없다.',
        'HAVING: 묶은 뒤 그룹을 거른다. 집계 결과로 조건을 건다(HAVING COUNT(*) > 100).',
        '같은 결과라면 WHERE로 미리 거르는 것이 효율적이다. 묶을 행 수 자체가 줄기 때문이다. 집계 값 조건만 HAVING에 둔다.',
        '전체 조합 예: WHERE provider != \'\' → GROUP BY provider → HAVING COUNT(*) > 100 → ORDER BY COUNT(*) DESC.',
      ],
      code: `SELECT provider, COUNT(*) AS cnt
FROM items
WHERE provider <> ''          -- 행 필터 (먼저)
GROUP BY provider
HAVING COUNT(*) > 100         -- 그룹 필터 (나중)
ORDER BY cnt DESC;`,
    },
    {
      title: '윈도우 함수 맛보기',
      points: [
        'GROUP BY는 행을 묶어 줄이지만, 윈도우 함수는 행을 유지한 채로 "그 행이 속한 그룹"의 집계를 옆에 붙인다. 함수(...) OVER (PARTITION BY ... ORDER BY ...).',
        'ROW_NUMBER() OVER (PARTITION BY category ORDER BY price DESC): 카테고리별 가격 순위. "카테고리별 상위 3개" 같은 문제를 풀 수 있다.',
        'SUM(amount) OVER (ORDER BY day): 누적 합계. AVG(...) OVER (PARTITION BY user_id): 사용자별 평균을 각 행 옆에.',
        'MySQL 8.0+, PostgreSQL, SQLite 3.25+에서 지원한다.',
      ],
      code: `SELECT *
FROM (
  SELECT name, category, price,
         ROW_NUMBER() OVER (PARTITION BY category ORDER BY price DESC) AS rn
  FROM products
) ranked
WHERE rn <= 3;      -- 카테고리별 비싼 상품 3개`,
    },
  ],
  questions: [
    {
      id: 'sql-04-01', type: 'mcq', source: '집계 함수',
      question: 'users 테이블 10행 중 nickname이 NULL인 행이 3개다. COUNT(*)와 COUNT(nickname)의 결과는?',
      choices: ['10 / 10', '7 / 7', '10 / 7', '7 / 10'],
      answer: 2,
      choiceExplanations: [
        'COUNT(컬럼)은 NULL을 세지 않아요.',
        'COUNT(*)는 NULL 여부와 상관없이 모든 행을 세요.',
        '정답. COUNT(*)는 행 수, COUNT(nickname)은 NULL이 아닌 값의 수.',
        '반대예요.',
      ],
      explanation: 'LEFT JOIN 결과에서 "짝이 없는 행"을 0으로 세려면 COUNT(오른쪽 테이블의 컬럼)을 써야 해요. COUNT(*)를 쓰면 짝이 없는 행도 1로 세져요. SQLAlchemy 관계 토픽에서 본 바로 그 함정이에요.',
    },
    {
      id: 'sql-04-02', type: 'mcq', source: '집계 함수',
      question: '학생 4명의 점수가 80, 90, NULL, 70이다. AVG(score)의 결과는?',
      choices: ['60', 'NULL', '에러', '80'],
      answer: 3,
      choiceExplanations: [
        'NULL을 0으로 보고 4로 나누면 60이지만, AVG는 NULL을 건너뛰어요.',
        '값이 있는 행이 있으니 NULL이 아니에요.',
        '정상 계산돼요.',
        '정답. (80 + 90 + 70) / 3 = 80.',
      ],
      explanation: '집계 함수는 NULL을 무시해요. "미응시는 0점"이 업무 규칙이라면 AVG(COALESCE(score, 0))로 명시해야 해요. 이 차이가 리포트 숫자를 크게 바꿀 수 있어요.',
    },
    {
      id: 'sql-04-03', type: 'short', source: '집계 함수',
      question: '주문 테이블에서 "주문한 적 있는 서로 다른 사용자 수"를 구하는 식은? COUNT(________ user_id)',
      answer: ['DISTINCT', 'distinct'],
      explanation: 'COUNT(DISTINCT user_id)예요. COUNT(user_id)는 주문 건수(같은 사용자 중복 포함)가 돼요.\n"방문 수 vs 방문자 수", "주문 수 vs 구매자 수"처럼 지표 정의에서 자주 헷갈리는 부분이에요.',
    },
    {
      id: 'sql-04-04', type: 'mcq', source: 'GROUP BY',
      question: '다음 SQL이 표준 SQL(PostgreSQL)에서 에러가 나는 이유는?',
      code: `SELECT rating, title, COUNT(*)
FROM film
GROUP BY rating;`,
      choices: ['COUNT(*)를 GROUP BY와 같이 쓸 수 없어서', 'title은 그룹 안에서 값이 여러 개라 무엇을 보여 줄지 정할 수 없어서', 'rating은 GROUP BY에 쓸 수 없어서', 'ORDER BY가 없어서'],
      answer: 1,
      choiceExplanations: [
        'GROUP BY와 집계 함수는 함께 쓰는 게 정상이에요.',
        '정답. SELECT에는 GROUP BY 컬럼이나 집계 함수만 올 수 있어요.',
        '정상적인 그룹 기준이에요.',
        'ORDER BY는 선택이에요.',
      ],
      explanation: 'MySQL은 ONLY_FULL_GROUP_BY 모드가 꺼져 있으면 에러 없이 title 중 아무거나 하나를 보여 줘요. 결과가 그럴듯해 보여서 버그를 놓치기 쉬워요. MySQL 5.7+는 기본으로 켜져 있어요.\n각 등급의 대표 제목이 필요하면 MIN(title)처럼 집계하거나 윈도우 함수를 써요.',
    },
    {
      id: 'sql-04-05', type: 'mcq', source: 'GROUP BY',
      question: '크롤링한 상품 테이블에서 "카테고리별 상품 수"를 많은 순으로 보려면?',
      choices: [
        'SELECT category, COUNT(*) FROM products ORDER BY COUNT(*) DESC;',
        'SELECT DISTINCT category, COUNT(*) FROM products;',
        'SELECT category, COUNT(*) AS cnt FROM products GROUP BY category ORDER BY cnt DESC;',
        'SELECT category FROM products WHERE COUNT(*) > 0;',
      ],
      answer: 2,
      choiceExplanations: [
        'GROUP BY가 없어 카테고리별로 나뉘지 않아요(또는 에러).',
        'DISTINCT는 중복 제거일 뿐 그룹별 집계가 아니에요.',
        '정답. 카테고리로 묶고, 개수로 내림차순 정렬.',
        'WHERE에 집계 함수를 쓸 수 없어요.',
      ],
      explanation: '노션 크롤링 실습의 마지막 단계 "SELECT CATEGORY, COUNT(*) ... GROUP BY CATEGORY"예요. 수집 → 저장 → 분석의 분석 단계가 바로 GROUP BY예요.',
    },
    {
      id: 'sql-04-06', type: 'mcq', source: 'WHERE와 HAVING',
      question: '"상품을 100개 넘게 등록한 판매자"를 찾을 때 조건을 넣을 위치는?',
      choices: ['WHERE COUNT(*) > 100', 'ORDER BY COUNT(*) > 100', 'GROUP BY COUNT(*) > 100', 'HAVING COUNT(*) > 100'],
      answer: 3,
      choiceExplanations: [
        'WHERE는 묶기 전 개별 행에 적용돼서 집계 함수를 쓸 수 없어요.',
        '정렬일 뿐이에요.',
        '묶는 기준이 아니에요.',
        '정답. 묶은 뒤 그룹의 개수로 거르는 건 HAVING이에요.',
      ],
      explanation: '판단법: 조건에 집계 함수(COUNT, SUM, AVG...)가 들어가면 HAVING, 개별 행 값만 보면 WHERE.',
    },
    {
      id: 'sql-04-07', type: 'mcq', source: 'WHERE와 HAVING',
      question: '두 SQL은 결과가 같다. 일반적으로 더 효율적인 것은?',
      code: `-- A
SELECT category, COUNT(*) FROM products
GROUP BY category HAVING category <> '기타';

-- B
SELECT category, COUNT(*) FROM products
WHERE category <> '기타' GROUP BY category;`,
      choices: ['A', 'B', '항상 완전히 같다', '둘 다 에러'],
      answer: 1,
      choiceExplanations: [
        "A는 '기타'까지 모두 묶은 뒤에 버려요.",
        "정답. '기타' 행을 먼저 걸러 묶을 데이터 자체를 줄여요.",
        '옵티마이저가 같게 바꿔 주는 경우도 있지만, 원칙적으로는 WHERE에서 거르는 게 좋아요.',
        '둘 다 문법상 맞아요.',
      ],
      explanation: '행 값 조건은 WHERE, 집계 조건만 HAVING. 이 습관이 쿼리 성능과 가독성 모두에 좋아요.',
    },
    {
      id: 'sql-04-08', type: 'short', source: 'WHERE와 HAVING',
      question: '그룹으로 묶은 뒤 집계 결과로 그룹을 거르는 SQL 절의 이름은?',
      answer: ['HAVING', 'having'],
      explanation: 'HAVING이에요. GROUP BY 뒤에 와요. SQLAlchemy에서는 .group_by(...).having(func.count(...) > 100).',
    },
    {
      id: 'sql-04-09', type: 'mcq', source: 'GROUP BY',
      question: 'GROUP BY main_category, sub_category 의 결과는?',
      choices: ['main_category별 한 행', 'sub_category별 한 행', '(main_category, sub_category) 조합별 한 행', '에러'],
      answer: 2,
      choiceExplanations: [
        '두 컬럼의 조합으로 묶여요.',
        '두 컬럼의 조합으로 묶여요.',
        '정답. 예: (패션, 여성신발), (패션, 남성신발), (가전, TV)...',
        '여러 컬럼으로 묶을 수 있어요.',
      ],
      explanation: '여러 컬럼 GROUP BY는 "조합"으로 묶여요. 상위 합계(카테고리 전체)까지 함께 보고 싶으면 MySQL의 WITH ROLLUP, PostgreSQL의 GROUPING SETS를 써요.',
    },
    {
      id: 'sql-04-10', type: 'mcq', source: '윈도우 함수 맛보기',
      question: '"카테고리별로 가장 비싼 상품 3개씩"을 구하기에 가장 알맞은 도구는?',
      choices: ['ROW_NUMBER() OVER (PARTITION BY category ORDER BY price DESC) 후 순위 3 이하만', 'GROUP BY category LIMIT 3', 'MAX(price) GROUP BY category', 'ORDER BY category, price DESC LIMIT 3'],
      answer: 0,
      choiceExplanations: [
        '정답. 카테고리마다 순위를 매긴 뒤 바깥에서 rn <= 3으로 걸러요.',
        'LIMIT은 전체 결과에 적용돼 카테고리 3개만 나와요.',
        '카테고리별 최댓값 하나만 나와요.',
        '전체에서 3개만 나와요.',
      ],
      explanation: 'GROUP BY는 그룹을 한 행으로 줄이고, 윈도우 함수는 행을 남긴 채 그룹 정보를 붙여요. "그룹별 상위 N", "누적 합계", "이전 행과 비교(LAG)" 같은 문제는 윈도우 함수가 정답이에요.',
    },
    {
      id: 'sql-04-11', type: 'ox', source: '윈도우 함수 맛보기',
      question: 'SUM(amount) OVER (PARTITION BY user_id)는 GROUP BY user_id처럼 사용자별로 결과 행을 하나로 줄인다.',
      answer: false,
      explanation: '윈도우 함수는 행 수를 줄이지 않아요. 각 주문 행 옆에 "그 사용자의 총합"이 붙어요. 그래서 "이 주문이 사용자 총액의 몇 %인가" 같은 계산을 한 번에 할 수 있어요.',
    },
    {
      id: 'sql-04-12', type: 'mcq', source: '집계 함수',
      question: '주문이 하나도 없는 테이블에서 SELECT SUM(amount) FROM orders; 의 결과는?',
      choices: ['0', '에러', 'NULL', '빈 결과(행 0개)'],
      answer: 2,
      choiceExplanations: [
        '직관과 달리 0이 아니에요.',
        '정상 실행돼요.',
        '정답. 합칠 값이 없으면 SUM은 NULL이에요. COUNT만 0을 돌려줘요.',
        'GROUP BY 없는 집계는 항상 한 행을 돌려줘요.',
      ],
      explanation: 'API에서 "총 매출"을 줄 때 NULL이 그대로 나가면 프론트에서 null + 1000 같은 버그가 생겨요. COALESCE(SUM(amount), 0)으로 기본값을 주세요.',
    },
  ],
}

export default topic
