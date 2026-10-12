import type { Topic } from '../../types'

const topic: Topic = {
  id: 'my-03-dml',
  track: 'backend',
  group: 'MySQL',
  title: 'MySQL 3강 - DML: 데이터 CRUD',
  order: 103,
  notionId: '3efdf951bf80815f9a40d4819038b9ca',
  sections: [
    { title: 'CRUD', points: ['Create / Read / Update / Delete', 'SQL로는 INSERT / SELECT / UPDATE / DELETE'] },
    { title: '실습용 테이블', points: ['students (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, name, age, grade)'] },
    { title: 'INSERT', points: ['모든 컬럼: INSERT INTO 테이블 VALUES(...)', '일부 컬럼: INSERT INTO 테이블 (컬럼1, 컬럼2) VALUES(...) → 나머지는 기본값이나 NULL', 'AUTO_INCREMENT 컬럼은 생략하면 자동'] },
    { title: 'SELECT', points: ['SELECT * FROM 테이블; / SELECT name, age FROM students;'] },
    { title: 'WHERE 조건', points: ['비교: =, != (또는 <>), <, >, <=, >=', '논리: AND, OR'] },
    { title: 'LIKE (부분 일치)', points: ['%: 0글자 이상 아무거나 / _: 정확히 한 글자', "LIKE '박%' 시작, '%영%' 포함, '__' 두 글자, NOT LIKE"] },
    { title: 'UPDATE', points: ["UPDATE students SET age = 18 WHERE name = '박민수';", '여러 컬럼: SET 컬럼1 = 값1, 컬럼2 = 값2'] },
    { title: 'DELETE', points: ["DELETE FROM students WHERE name = '김철수';", 'DELETE FROM students; → 전체 삭제'] },
    { title: '주의', points: ['UPDATE / DELETE에서 WHERE를 빼면 모든 행이 바뀌거나 지워짐', '실행 전에 같은 조건으로 SELECT 먼저 해보기'] },
  ],
  questions: [
    { id: 'my-03-01', type: 'mcq', source: 'CRUD', question: 'CRUD의 R(Read)에 해당하는 SQL은?', choices: ['INSERT', 'SELECT', 'UPDATE', 'DELETE'], answer: 1, explanation: 'C-INSERT, R-SELECT, U-UPDATE, D-DELETE.' },
    { id: 'my-03-02', type: 'ox', source: '실습용 테이블', question: 'students 테이블의 id는 AUTO_INCREMENT라서 INSERT 시 생략할 수 있다.', answer: true, explanation: '생략하면 자동으로 번호가 채워져요.' },
    { id: 'my-03-03', type: 'mcq', source: 'INSERT', question: "INSERT INTO students (name, age) VALUES('김철수', 16); 실행 시 grade 컬럼은?", choices: ['에러', '기본값이나 NULL', "'김철수'", '0'], answer: 1, explanation: '지정하지 않은 컬럼은 기본값이나 NULL (NOT NULL이면 에러).' },
    { id: 'my-03-04', type: 'short', source: 'SELECT', question: 'students 테이블의 모든 컬럼을 조회하는 SQL은?', answer: ['SELECT * FROM students;', 'SELECT * FROM students'], explanation: '* = 전체 컬럼.' },
    { id: 'my-03-05', type: 'mcq', source: 'WHERE 조건', question: '"같지 않다"를 뜻하는 SQL 연산자 두 가지는?', choices: ['!= 와 <>', '== 와 !=', '=/= 와 <>', 'NOT 와 !'], answer: 0, explanation: '!= 또는 <>.' },
    { id: 'my-03-06', type: 'mcq', source: 'LIKE (부분 일치)', question: "name LIKE '__' 의 의미는?", choices: ['밑줄이 들어간 이름', '정확히 두 글자인 이름', '두 글자 이상', '비어 있는 이름'], answer: 1, explanation: '_ 는 정확히 한 글자. % 는 0글자 이상.' },
    { id: 'my-03-07', type: 'short', source: 'LIKE (부분 일치)', question: "이름에 '영'이 포함된 학생을 찾는 조건은? (name LIKE ...)", answer: ["name LIKE '%영%'", "LIKE '%영%'", "'%영%'"], explanation: '%영% — 앞뒤 아무거나.' },
    { id: 'my-03-08', type: 'mcq', source: 'UPDATE', question: '여러 컬럼을 한 번에 수정하는 문법은?', choices: ['SET a = 1 AND b = 2', 'SET a = 1, b = 2', 'SET (a, b) = (1, 2) 만 가능', 'UPDATE 두 번'], answer: 1, explanation: 'SET 컬럼1 = 값1, 컬럼2 = 값2.' },
    { id: 'my-03-09', type: 'ox', source: 'DELETE', question: 'DELETE FROM students; 는 테이블 자체를 삭제한다.', answer: false, explanation: '모든 행(데이터)만 지우고 테이블은 남아요. 테이블 삭제는 DROP TABLE.' },
    { id: 'my-03-10', type: 'essay', source: '주의', question: 'UPDATE·DELETE를 실행하기 전 습관으로 권장되는 것은 무엇이고 왜 그런가?', answer: 'WHERE 없이 실행하면 모든 행이 수정·삭제되므로, 실행 전에 같은 WHERE 조건으로 SELECT를 먼저 해서 영향을 받을 행이 맞는지 확인한다.', keywords: ['WHERE', 'SELECT 먼저'], explanation: '실수 한 번에 전체 데이터가 날아갈 수 있어요.' },
  ],
}

export default topic
