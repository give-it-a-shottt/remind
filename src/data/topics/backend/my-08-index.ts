import type { Topic } from '../../types'

const topic: Topic = {
  id: 'my-08-index',
  track: 'backend',
  group: 'MySQL',
  title: 'MySQL 8강 - 인덱스 (INDEX)',
  order: 108,
  notionId: '3efdf951bf808153863cc0f4367acf3e',
  sections: [
    { title: '인덱스란?', points: ['검색 속도를 높여주는 자료구조, 키 컬럼 정보만 있어서 테이블보다 작음', '어떤 컬럼에 거느냐가 성능에 큰 영향', '단점: INSERT/UPDATE/DELETE 때 인덱스도 고쳐야 해서 쓰기가 느려짐 → 많다고 좋은 게 아님'] },
    { title: '인덱스 종류', points: ['클러스터형 = 영어사전처럼 데이터 자체를 정렬, PRIMARY KEY 만들면 자동, 테이블당 하나', '보조 인덱스 = 책 뒤의 찾아보기, 여러 개 가능, UNIQUE나 인덱스 없는 외래키 컬럼에 자동 생성'] },
    { title: '인덱스 확인', points: ['SHOW INDEX FROM 테이블;', 'Key_name이 PRIMARY → 클러스터형, 그 외 → 보조', 'Non_unique 0이면 중복 불가, Cardinality(고유값 개수 추정), Index_type(보통 BTREE)'] },
    { title: '인덱스 만들기', points: ['CREATE INDEX idx_name ON userTbl (name);', 'ALTER TABLE userTbl ADD INDEX idx_addr (addr);', '테이블 만들 때 UNIQUE INDEX / INDEX', 'ALTER TABLE ... ADD CONSTRAINT ... UNIQUE (컬럼) → 보조 인덱스 자동'] },
    { title: '인덱스 삭제', points: ['ALTER TABLE userTbl DROP INDEX idx_userTbl_addr;'] },
    { title: '연습', points: ['CREATE INDEX idx_groupName ON buyTbl (groupName); 후 SHOW INDEX로 확인'] },
    { title: '참고', points: ['교재 오타: ALERT TABLE → ALTER TABLE', 'PRIMARY만 남기려면 SHOW INDEX로 이름을 확인해 보조 인덱스를 하나씩 DROP'] },
  ],
  questions: [
    { id: 'my-08-01', type: 'essay', source: '인덱스란?', question: '인덱스를 많이 만들수록 좋지 않은 이유는?', answer: '인덱스는 조회를 빠르게 하지만 INSERT/UPDATE/DELETE 때마다 인덱스도 함께 수정해야 해서 쓰기 작업이 느려지고 저장 공간도 더 쓴다. 자주 검색되는 컬럼에만 거는 게 좋다.', keywords: ['쓰기 느려짐', '공간'], explanation: '읽기 ↑ / 쓰기 ↓ 트레이드오프.' },
    { id: 'my-08-02', type: 'mcq', source: '인덱스 종류', question: '클러스터형 인덱스에 대한 설명으로 옳은 것은?', choices: ['테이블당 여러 개', 'PRIMARY KEY를 만들면 자동 생성되고 테이블당 하나', '책 뒤의 찾아보기처럼 위치만 정리', 'UNIQUE를 걸면 생김'], answer: 1, explanation: '영어사전처럼 데이터 자체를 정렬. 찾아보기 방식은 보조 인덱스.' },
    { id: 'my-08-03', type: 'ox', source: '인덱스 종류', question: '보조 인덱스는 한 테이블에 여러 개 만들 수 있다.', answer: true, explanation: 'UNIQUE 제약이나 인덱스 없는 외래키 컬럼에도 자동 생성돼요.' },
    { id: 'my-08-04', type: 'short', source: '인덱스 확인', question: '테이블의 인덱스 목록을 보는 SQL은? (SHOW ...)', answer: ['SHOW INDEX FROM 테이블', 'SHOW INDEX FROM', 'SHOW INDEX'], explanation: 'SHOW INDEX FROM userTbl;' },
    { id: 'my-08-05', type: 'mcq', source: '인덱스 확인', question: 'SHOW INDEX 결과에서 Key_name이 PRIMARY인 인덱스는?', choices: ['보조 인덱스', '클러스터형 인덱스', '전문 검색 인덱스', '임시 인덱스'], answer: 1, explanation: 'PRIMARY = 클러스터형, 나머지 = 보조.' },
    { id: 'my-08-06', type: 'mcq', source: '인덱스 만들기', question: '이미 만든 userTbl의 name 컬럼에 인덱스를 추가하는 SQL은?', choices: ['CREATE INDEX idx_name ON userTbl (name);', 'ADD INDEX name;', 'INDEX userTbl(name) CREATE;', 'ALTER INDEX idx_name;'], answer: 0, explanation: 'ALTER TABLE userTbl ADD INDEX idx_name (name); 도 같아요.' },
    { id: 'my-08-07', type: 'short', source: '인덱스 삭제', question: 'userTbl의 idx_addr 인덱스를 삭제하는 SQL은?', answer: ['ALTER TABLE userTbl DROP INDEX idx_addr;', 'ALTER TABLE userTbl DROP INDEX idx_addr', 'DROP INDEX idx_addr ON userTbl;'], explanation: 'ALTER TABLE ... DROP INDEX 이름;' },
    { id: 'my-08-08', type: 'ox', source: '연습', question: 'groupName 컬럼 인덱스 연습에서 교재 답안의 prodName 코드는 그대로 쓰면 된다.', answer: false, explanation: '교재 답안이 잘못됐어요. groupName에 대한 인덱스는 (groupName)으로 만들어야 해요.' },
    { id: 'my-08-09', type: 'mcq', source: '참고', question: 'PRIMARY KEY만 남기고 보조 인덱스를 모두 지우는 방법은?', choices: ['DROP TABLE', 'SHOW INDEX로 이름 확인 후 보조 인덱스를 하나씩 DROP INDEX', 'TRUNCATE', 'ALTER TABLE ... DROP PRIMARY KEY'], answer: 1, explanation: '한 번에 지우는 명령은 없어요.' },
  ],
}

export default topic
