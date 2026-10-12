import type { Topic } from '../../types'

const topic: Topic = {
  id: 'my-01-rdbms',
  track: 'backend',
  group: 'MySQL',
  title: 'MySQL 1강 - 데이터베이스와 RDBMS 개념',
  order: 101,
  notionId: '3efdf951bf808157a036c1577d79644d',
  sections: [
    { title: '데이터베이스란?', points: ['체계적으로 정리해서 여러 시스템이 함께 쓰는 데이터 묶음', 'DBMS: 데이터베이스를 관리하는 시스템', '장점: 중복 최소화, 공유, 일관성·무결성·보안, 표준화 / 단점: 전문가 필요, 비용, 복잡'] },
    { title: 'RDBMS (관계형 데이터베이스)', points: ['관계형 DB = 테이블(2차원 표)', '테이블 / 행(Row, 레코드) / 열(Column, 속성)', 'Primary Key: 각 행을 유일하게 구분, NULL 불가 + 중복 불가', 'Foreign Key: 다른 테이블의 행을 가리키는 컬럼'] },
    { title: '스키마 (Schema)', points: ['테이블 구조, 형식, 관계를 정의한 것 = DB 설계도', '스키마만 있으면 같은 구조의 DB를 다시 만들 수 있음 (데이터는 제외, 백업과 다름)'] },
    { title: 'SQL', points: ['DDL(정의): CREATE, ALTER, DROP', 'DML(조작): INSERT, SELECT, UPDATE, DELETE', 'DCL(제어): GRANT, BEGIN, COMMIT, ROLLBACK', 'BEGIN/COMMIT/ROLLBACK은 TCL(트랜잭션 제어)로 따로 구분하기도'] },
    { title: 'MySQL', points: ['세계에서 가장 많이 쓰이는 오픈소스 RDBMS', '오라클 소유 → 라이선스 문제로 MariaDB가 파생 (사용법 거의 동일)', '실습 도구: MySQL Workbench'] },
  ],
  questions: [
    { id: 'my-01-01', type: 'ox', source: '데이터베이스란?', question: 'DBMS의 장점에는 데이터 중복 최소화와 무결성 유지가 있다.', answer: true, explanation: '단점은 전문가 필요, 비용, 시스템 복잡.' },
    { id: 'my-01-02', type: 'mcq', source: 'RDBMS (관계형 데이터베이스)', question: 'Primary Key의 조건은?', choices: ['NULL 가능, 중복 가능', 'NULL 불가, 중복 불가', 'NULL 불가, 중복 가능', '다른 테이블을 가리킴'], answer: 1, explanation: '각 행을 유일하게 구분해야 하니까요. 다른 테이블을 가리키는 건 Foreign Key.' },
    { id: 'my-01-03', type: 'short', source: 'RDBMS (관계형 데이터베이스)', question: '테이블에서 가로 한 줄(레코드)을 영어로?', answer: ['Row', 'row', '행'], explanation: 'Row(행) = 레코드, Column(열) = 속성.' },
    { id: 'my-01-04', type: 'mcq', source: '스키마 (Schema)', question: '스키마에 대한 설명으로 옳은 것은?', choices: ['데이터까지 포함한 백업 파일', '테이블 구조·형식·관계를 정의한 설계도', 'SQL 실행 기록', '사용자 권한 목록'], answer: 1, explanation: '스키마로 같은 구조를 다시 만들 수 있지만 데이터는 포함하지 않아요.' },
    { id: 'my-01-05', type: 'mcq', source: 'SQL', question: 'DDL에 속하는 명령은?', choices: ['SELECT', 'INSERT', 'CREATE', 'GRANT'], answer: 2, explanation: 'DDL: CREATE·ALTER·DROP / DML: SELECT·INSERT·UPDATE·DELETE / DCL: GRANT 등.' },
    { id: 'my-01-06', type: 'mcq', source: 'SQL', question: 'GRANT, COMMIT, ROLLBACK이 속한 분류는? (강의 기준)', choices: ['DDL', 'DML', 'DCL', 'DQL'], answer: 2, explanation: 'DCL(데이터 제어). 트랜잭션 명령은 TCL로 따로 구분하기도 해요.' },
    { id: 'my-01-07', type: 'ox', source: 'MySQL', question: 'MariaDB는 MySQL과 같은 소스에서 파생되어 사용법이 거의 같다.', answer: true, explanation: 'MySQL이 오라클 소유가 되면서 라이선스 문제로 파생됐어요.' },
  ],
}

export default topic
