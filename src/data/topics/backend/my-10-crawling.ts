import type { Topic } from '../../types'

const topic: Topic = {
  id: 'my-10-crawling',
  track: 'backend',
  group: 'MySQL',
  title: 'MySQL 10강 - 크롤링 데이터 MySQL 저장 실습',
  order: 110,
  notionId: '3efdf951bf8081c88fdcc74323cc24b7',
  sections: [
    { title: '전체 흐름', points: ['1. Workbench에서 DB·테이블 만들기', '2. requests + BeautifulSoup으로 크롤링', '3. pymysql로 INSERT', '4. SELECT로 확인, GROUP BY로 분석'] },
    { title: '1. 스키마', points: ['teddyproducts (ID INT UNSIGNED NOT NULL AUTO_INCREMENT, TITLE VARCHAR(200), CATEGORY VARCHAR(20), PRIMARY KEY(ID))'] },
    { title: '2~3. 크롤링 + 저장', points: ['페이지를 돌며 카드마다 카테고리·상품명을 꺼내 바로 INSERT', 'ID는 AUTO_INCREMENT라 생략', '상품명에 작은따옴표가 있으면 문자열 더하기 SQL은 에러 + 보안 취약 → %s + 튜플'], code: `sql = "INSERT INTO teddyproducts (TITLE, CATEGORY) VALUES (%s, %s)"
cursor.execute(sql, (product, category))` },
    { title: '4. 조회와 분석', points: ['SELECT DISTINCT CATEGORY → 카테고리 종류', 'SELECT CATEGORY, COUNT(*) ... GROUP BY CATEGORY → 카테고리별 상품 수'] },
    { title: '정리', points: ['크롤링(수집) → DB 저장 → SQL 분석이 한 번에 연결되는 기본 데이터 파이프라인'] },
  ],
  questions: [
    { id: 'my-10-01', type: 'mcq', source: '전체 흐름', question: '크롤링 → MySQL 저장 실습에서 HTML을 파싱하는 라이브러리는?', choices: ['pymysql', 'BeautifulSoup', 'jsonify', 'pymongo'], answer: 1, explanation: 'requests로 받고 BeautifulSoup으로 파싱, pymysql로 저장.' },
    { id: 'my-10-02', type: 'ox', source: '1. 스키마', question: 'teddyproducts의 ID는 AUTO_INCREMENT라 INSERT 시 생략한다.', answer: true, explanation: 'INSERT INTO teddyproducts (TITLE, CATEGORY) VALUES ...' },
    { id: 'my-10-03', type: 'essay', source: '2~3. 크롤링 + 저장', question: '크롤링한 상품명을 SQL에 문자열 더하기로 넣으면 생기는 문제 두 가지는?', answer: "상품명에 작은따옴표(')가 들어 있으면 SQL 문법이 깨져 에러가 나고, 외부 데이터가 SQL에 그대로 섞여 SQL 인젝션에 취약하다. %s 자리 표시자와 execute의 튜플 인자로 넘겨야 한다.", keywords: ['작은따옴표', 'SQL 인젝션', '%s'], explanation: '외부 데이터는 항상 파라미터로.' },
    { id: 'my-10-04', type: 'mcq', source: '4. 조회와 분석', question: '카테고리별 상품 수를 구하는 SQL은?', choices: ['SELECT DISTINCT CATEGORY FROM teddyproducts;', 'SELECT CATEGORY, COUNT(*) FROM teddyproducts GROUP BY CATEGORY;', 'SELECT COUNT(DISTINCT TITLE) FROM teddyproducts;', 'SELECT * FROM teddyproducts ORDER BY CATEGORY;'], answer: 1, explanation: 'GROUP BY + COUNT(*).' },
    { id: 'my-10-05', type: 'short', source: '정리', question: '수집 → 저장 → 분석으로 이어지는 흐름을 뭐라고 부를까? (데이터 ...)', answer: ['파이프라인', '데이터 파이프라인'], explanation: '기본 데이터 파이프라인. 백엔드 24강과 이어서 보면 좋아요.' },
  ],
}

export default topic
