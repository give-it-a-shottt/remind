import type { Topic } from '../../types'

const topic: Topic = {
  id: 'my-06-fk-having',
  track: 'backend',
  group: 'MySQL',
  title: 'MySQL 6강 - 외래키 & GROUP BY + HAVING',
  order: 106,
  notionId: '3efdf951bf80815593d8ef50293c054f',
  sections: [
    { title: '외래키 (FOREIGN KEY)', points: ['한 테이블의 컬럼이 다른 테이블의 기본키를 참조하도록 연결하는 제약 조건'], code: 'FOREIGN KEY (userID) REFERENCES userTbl(userID)' },
    { title: '외래키가 막아주는 것', points: ['userTbl에 없는 userID로 buyTbl INSERT → 에러', '참조 중인 userTbl 행 DELETE → 에러', '= 데이터 무결성', '순서: 부모에 먼저 넣고 → 자식, 삭제는 반대로'] },
    { title: '현업에서는?', points: ['꼭 필요한 곳에만 쓰는 경우가 많음 (제약이 강하면 예외적인 비즈니스 로직 처리가 어려움)'] },
    { title: 'HAVING', points: ['집계 함수로 조건을 걸 때, GROUP BY와 함께', 'WHERE: 그룹으로 묶기 전에 행을 거름', 'HAVING: 묶은 후 그룹을 거름'] },
    { title: 'WHERE + GROUP BY + HAVING + ORDER BY', points: ["WHERE provider != '' → GROUP BY provider → HAVING COUNT(*) > 100 → ORDER BY COUNT(*) DESC"] },
    { title: '실습 환경', points: ['bestproducts DB: items(상품 정보), ranking(베스트 순위)'] },
  ],
  questions: [
    { id: 'my-06-01', type: 'mcq', source: '외래키 (FOREIGN KEY)', question: '외래키가 참조하는 대상은?', choices: ['같은 테이블의 아무 컬럼', '다른 테이블의 기본키', '인덱스', '뷰'], answer: 1, explanation: 'FOREIGN KEY (userID) REFERENCES userTbl(userID).' },
    { id: 'my-06-02', type: 'mcq', source: '외래키가 막아주는 것', question: 'buyTbl.userID가 userTbl.userID를 참조할 때 에러가 나는 경우는?', choices: ['userTbl에 있는 ID로 buyTbl INSERT', 'userTbl에 없는 ID로 buyTbl INSERT', 'buyTbl 행 삭제', 'userTbl 조회'], answer: 1, explanation: '존재하지 않는 부모를 가리키면 무결성 위반.' },
    { id: 'my-06-03', type: 'ox', source: '외래키가 막아주는 것', question: '외래키로 연결된 테이블은 자식(buyTbl)을 먼저 지우고 부모(userTbl)를 지워야 한다.', answer: true, explanation: '넣을 땐 부모 → 자식, 지울 땐 자식 → 부모.' },
    { id: 'my-06-04', type: 'ox', source: '현업에서는?', question: '현업에서는 외래키를 모든 테이블 관계에 반드시 건다.', answer: false, explanation: '제약이 강해 예외 로직 처리가 어려워서 꼭 필요한 곳에만 쓰는 경우가 많아요.' },
    { id: 'my-06-05', type: 'essay', source: 'HAVING', question: 'WHERE와 HAVING의 차이를 설명하세요.', answer: 'WHERE는 GROUP BY로 묶기 전에 개별 행을 거르고, HAVING은 묶은 뒤 그룹을 거른다. 그래서 COUNT(*) >= 100처럼 집계 함수 결과로 조건을 걸 때는 HAVING을 쓴다.', keywords: ['묶기 전', '묶은 후', '집계 함수'], explanation: '행 필터 = WHERE, 그룹 필터 = HAVING.' },
    { id: 'my-06-06', type: 'mcq', source: 'HAVING', question: '"상품이 100개 이상인 판매자"를 구할 때 조건을 넣을 절은?', choices: ['WHERE COUNT(*) >= 100', 'HAVING COUNT(*) >= 100', 'ORDER BY COUNT(*) >= 100', 'LIMIT 100'], answer: 1, explanation: '집계 결과 조건 → HAVING.' },
    { id: 'my-06-07', type: 'mcq', source: 'WHERE + GROUP BY + HAVING + ORDER BY', question: '아래 SQL의 실행 의도 순서로 맞는 것은?', code: `SELECT provider, COUNT(*) FROM items
WHERE provider != ''
GROUP BY provider
HAVING COUNT(*) > 100
ORDER BY COUNT(*) DESC;`, choices: ['판매자 정보 있는 상품만 → 판매자별로 묶고 → 100개 초과 그룹만 → 많은 순', '정렬 → 묶기 → 거르기', '100개 초과 상품 → 판매자별 정렬', '판매자 없는 상품만 → 적은 순'], answer: 0, explanation: 'WHERE → GROUP BY → HAVING → ORDER BY.' },
    { id: 'my-06-08', type: 'short', source: '실습 환경', question: 'bestproducts 실습에서 베스트 순위(main_category, sub_category)를 담은 테이블 이름은?', answer: ['ranking'], explanation: 'items = 상품 정보, ranking = 베스트 순위.' },
  ],
}

export default topic
