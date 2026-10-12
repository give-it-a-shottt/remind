import type { Topic } from '../../types'

const topic: Topic = {
  id: 'my-02-ddl',
  track: 'backend',
  group: 'MySQL',
  title: 'MySQL 2강 - DDL: 데이터베이스와 테이블 만들기',
  order: 102,
  notionId: '3efdf951bf80817db4e8f62c8f32e1df',
  sections: [
    { title: '데이터베이스 다루기', points: ['CREATE DATABASE (= CREATE SCHEMA)', 'SHOW DATABASES; USE dbname;', 'DROP DATABASE IF EXISTS dbname; (없어도 에러 안 나게)'] },
    { title: '테이블 생성 기본 구조', points: ['CREATE TABLE 테이블명 ( 컬럼명 데이터타입 [옵션], ..., PRIMARY KEY(컬럼명) );', '만들기 전에 USE dbname;으로 DB 선택'] },
    { title: '컬럼 옵션', points: ['UNSIGNED: 음수 없이 양수만 → 범위 넓어짐 (TINYINT -128~127 → 0~255)', 'NOT NULL: 비워둘 수 없음', 'AUTO_INCREMENT: 자동 1씩 증가, 테이블당 하나만'] },
    { title: '주요 데이터 타입', points: ['숫자: TINYINT, SMALLINT, INT, BIGINT, FLOAT, DOUBLE', '문자: CHAR(n) 고정 길이, VARCHAR(n) 가변 길이, TEXT', '날짜: DATE, DATETIME, TIMESTAMP, TIME, YEAR'] },
    { title: '기본키 지정', points: ['NULL 불가 + 유일 → 보통 NOT NULL AUTO_INCREMENT와 함께'] },
    { title: '실습: 고객 테이블 만들기', points: ['no INT NOT NULL AUTO_INCREMENT, name CHAR(20) NOT NULL, email VARCHAR(30) NOT NULL, ..., PRIMARY KEY(no)'] },
    { title: '테이블 조회와 삭제', points: ['SHOW TABLES;', 'DESC 테이블명; → 컬럼, 타입, NULL 여부, 키', 'DROP TABLE IF EXISTS 테이블명;'] },
    { title: 'ALTER로 구조 수정', points: ['ADD COLUMN 추가 / MODIFY COLUMN 타입 변경 / CHANGE COLUMN 이름 변경 / DROP COLUMN 삭제', 'MODIFY는 타입만, CHANGE는 이름까지 (CHANGE는 타입도 다시 적어야 함)'] },
    { title: '연습: mytable 컬럼 수정', points: ['ALTER TABLE mytable CHANGE COLUMN modelnumber model_num VARCHAR(10) NOT NULL;'] },
  ],
  questions: [
    { id: 'my-02-01', type: 'mcq', source: '데이터베이스 다루기', question: 'DB가 없어도 에러 없이 삭제를 시도하는 SQL은?', choices: ['DROP DATABASE dbname;', 'DROP DATABASE IF EXISTS dbname;', 'DELETE DATABASE dbname;', 'REMOVE dbname;'], answer: 1, explanation: 'IF EXISTS를 붙이면 없을 때 에러가 나지 않아요.' },
    { id: 'my-02-02', type: 'short', source: '데이터베이스 다루기', question: '사용할 데이터베이스를 선택하는 SQL 키워드는?', answer: ['USE'], explanation: 'USE dbname;' },
    { id: 'my-02-03', type: 'ox', source: '테이블 생성 기본 구조', question: 'CREATE TABLE 전에 USE dbname;으로 DB를 먼저 선택해야 한다.', answer: true, explanation: '어느 DB에 만들지 정해야 해요 (또는 db.table 형태로 지정).' },
    { id: 'my-02-04', type: 'mcq', source: '컬럼 옵션', question: 'TINYINT UNSIGNED의 범위는?', choices: ['-128 ~ 127', '0 ~ 255', '0 ~ 127', '-255 ~ 255'], answer: 1, explanation: 'UNSIGNED는 음수 없이 양수만 → 0~255.' },
    { id: 'my-02-05', type: 'ox', source: '컬럼 옵션', question: 'AUTO_INCREMENT는 한 테이블에 여러 컬럼에 줄 수 있다.', answer: false, explanation: '테이블당 하나만 가능해요.' },
    { id: 'my-02-06', type: 'mcq', source: '주요 데이터 타입', question: '길이가 고정된 문자 타입은?', choices: ['VARCHAR(n)', 'CHAR(n)', 'TEXT', 'BLOB'], answer: 1, explanation: 'CHAR 고정, VARCHAR 가변.' },
    { id: 'my-02-07', type: 'mcq', source: '기본키 지정', question: '기본키 컬럼에 보통 함께 쓰는 옵션 조합은?', choices: ['NULL DEFAULT 0', 'NOT NULL AUTO_INCREMENT', 'UNSIGNED NULL', 'TEXT UNIQUE'], answer: 1, explanation: 'NULL 불가 + 유일한 값이 자동으로 생기게.' },
    { id: 'my-02-08', type: 'short', source: '실습: 고객 테이블 만들기', question: 'customer 테이블에서 no를 기본키로 지정하는 마지막 줄은?', answer: ['PRIMARY KEY(no)', 'PRIMARY KEY (no)'], explanation: 'CREATE TABLE 괄호 안 마지막에 PRIMARY KEY(no).' },
    { id: 'my-02-09', type: 'short', source: '테이블 조회와 삭제', question: '테이블 구조(컬럼, 타입, NULL 여부, 키)를 보는 SQL 키워드는?', answer: ['DESC', 'DESCRIBE'], explanation: 'DESC 테이블명;' },
    { id: 'my-02-10', type: 'mcq', source: 'ALTER로 구조 수정', question: '컬럼 "이름"까지 바꿀 때 쓰는 ALTER 구문은?', choices: ['MODIFY COLUMN', 'CHANGE COLUMN', 'RENAME TYPE', 'ADD COLUMN'], answer: 1, explanation: 'MODIFY는 타입만, CHANGE는 이름까지 (타입도 다시 적어야 함).' },
    { id: 'my-02-11', type: 'ox', source: '연습: mytable 컬럼 수정', question: 'CHANGE COLUMN modelnumber model_num 처럼 쓸 때 데이터 타입은 생략해도 된다.', answer: false, explanation: 'CHANGE는 새 이름 뒤에 타입을 다시 적어야 해요 (VARCHAR(10) NOT NULL).' },
  ],
}

export default topic
