import type { Topic } from '../../types'

const topic: Topic = {
  id: 'my-05-select',
  track: 'backend',
  group: 'MySQL',
  title: 'MySQL 5강 - SELECT 심화 (Sakila 실습)',
  order: 105,
  notionId: '3efdf951bf8081c3ab6dc3b5d4c0528d',
  sections: [
    { title: 'Sakila 데이터베이스', points: ['MySQL 공식 샘플 DB (DVD 대여점)', 'sakila-schema.sql → sakila-data.sql 순서로 실행', 'film, rental, inventory, customer, address, payment', '현업 DB는 설명이 부족해서 데이터를 직접 보며 컬럼 의미를 파악하는 게 중요'] },
    { title: 'LIMIT', points: ['SELECT * FROM rental LIMIT 10; → 일부만', 'LIMIT 1로 컬럼 구조와 값 확인'] },
    { title: 'COUNT', points: ['SELECT COUNT(*) FROM film; → 행 개수'] },
    { title: 'DISTINCT', points: ['SELECT DISTINCT rating FROM film; → 중복 제거', '컬럼 값을 이해하려면 도메인 지식이 필요할 때가 있음 (G, PG, R...)'] },
    { title: '집계 함수', points: ['SUM, AVG, MAX, MIN'] },
    { title: 'WHERE 복합 조건', points: ['AND와 OR을 섞을 땐 괄호로 의도를 명확히', '복잡하면 단계별로 쌓아가기'] },
    { title: 'GROUP BY', points: ['SELECT rating, COUNT(*) FROM film GROUP BY rating; → 그룹별 집계'] },
    { title: 'ORDER BY', points: ['ASC 오름차순(기본), DESC 내림차순'] },
    { title: 'AS', points: ['컬럼 이름 바꿔서 출력: COUNT(*) AS total_films', 'FLOOR: 소수점 버림'] },
    { title: 'SQL 구문 순서', points: ['SELECT → FROM → WHERE → GROUP BY → HAVING → ORDER BY → LIMIT'] },
  ],
  questions: [
    { id: 'my-05-01', type: 'ox', source: 'Sakila 데이터베이스', question: 'Sakila 실습은 data 파일을 먼저, schema 파일을 나중에 실행한다.', answer: false, explanation: 'schema(구조) → data(데이터) 순서. 테이블이 있어야 데이터를 넣죠.' },
    { id: 'my-05-02', type: 'mcq', source: 'LIMIT', question: '테이블 컬럼 구조와 값을 빠르게 확인할 때 자주 쓰는 것은?', choices: ['SELECT * FROM film LIMIT 1;', 'DROP TABLE film;', 'SELECT COUNT(*) FROM film;', 'DESC LIMIT film;'], answer: 0, explanation: 'LIMIT 1로 한 행만 보고 컬럼 의미를 파악해요.' },
    { id: 'my-05-03', type: 'short', source: 'COUNT', question: 'customer 테이블의 전체 행 개수를 구하는 SQL은?', answer: ['SELECT COUNT(*) FROM customer;', 'SELECT COUNT(*) FROM customer'], explanation: 'COUNT(*)' },
    { id: 'my-05-04', type: 'mcq', source: 'DISTINCT', question: '영화 등급(rating)의 종류만 중복 없이 보려면?', choices: ['SELECT rating FROM film;', 'SELECT DISTINCT rating FROM film;', 'SELECT UNIQUE(rating) FROM film;', 'SELECT rating FROM film GROUP;'], answer: 1, explanation: 'DISTINCT로 중복 제거.' },
    { id: 'my-05-05', type: 'mcq', source: '집계 함수', question: '집계 함수가 아닌 것은?', choices: ['SUM', 'AVG', 'MAX', 'LIKE'], answer: 3, explanation: 'LIKE는 문자열 패턴 비교 연산자.' },
    { id: 'my-05-06', type: 'essay', source: 'WHERE 복합 조건', question: "rating이 PG 또는 G이고, 개봉연도가 2006 또는 2007인 영화를 찾을 때 괄호가 필요한 이유는?", answer: "AND가 OR보다 먼저 계산되기 때문에 괄호 없이 쓰면 rating = 'PG' OR (rating = 'G' AND release_year = 2006) OR release_year = 2007처럼 의도와 다르게 묶인다. (rating = 'PG' OR rating = 'G') AND (release_year = 2006 OR release_year = 2007)로 괄호를 쳐야 한다.", keywords: ['AND 우선', '괄호'], explanation: 'AND와 OR을 섞을 땐 항상 괄호.' },
    { id: 'my-05-07', type: 'mcq', source: 'GROUP BY', question: '등급별 영화 수를 구하는 SQL은?', choices: ['SELECT rating, COUNT(*) FROM film GROUP BY rating;', 'SELECT COUNT(rating) FROM film;', 'SELECT rating FROM film ORDER BY COUNT(*);', 'SELECT DISTINCT COUNT(*) FROM film;'], answer: 0, explanation: 'GROUP BY로 묶고 COUNT(*)로 그룹별 개수.' },
    { id: 'my-05-08', type: 'short', source: 'ORDER BY', question: 'ORDER BY의 기본 정렬 방향 키워드는?', answer: ['ASC'], explanation: 'ASC 오름차순(기본), DESC 내림차순.' },
    { id: 'my-05-09', type: 'mcq', source: 'AS', question: 'COUNT(*) AS total_films 에서 AS의 역할은?', choices: ['조건 지정', '결과 컬럼 이름 바꾸기', '정렬', '테이블 연결'], answer: 1, explanation: 'AS로 출력 컬럼 이름(별칭)을 지정해요.' },
    { id: 'my-05-10', type: 'mcq', source: 'SQL 구문 순서', question: 'SQL 작성 순서로 올바른 것은?', choices: ['SELECT → WHERE → FROM → ORDER BY', 'SELECT → FROM → WHERE → GROUP BY → HAVING → ORDER BY → LIMIT', 'FROM → SELECT → LIMIT → WHERE', 'SELECT → GROUP BY → WHERE → HAVING'], answer: 1, explanation: 'SELECT FROM WHERE GROUP BY HAVING ORDER BY LIMIT.' },
  ],
}

export default topic
