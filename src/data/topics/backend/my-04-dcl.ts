import type { Topic } from '../../types'

const topic: Topic = {
  id: 'my-04-dcl',
  track: 'backend',
  group: 'MySQL',
  title: 'MySQL 4강 - DCL: 사용자와 권한 관리',
  order: 104,
  notionId: '3efdf951bf80813d8ad4de8af1bdd7f7',
  sections: [
    { title: 'MySQL 접속', points: ['mysql -u 사용자이름 -p (-u 사용자, -p 비밀번호 입력)', 'DCL은 주로 DB 관리자가 쓰는 명령이라 개념 위주로'] },
    { title: '사용자 관리', points: ["CREATE USER 'userid'@'localhost' IDENTIFIED BY '비번'; (내 PC에서만)", "'userid'@'%' → 어디서든 접속", 'SET PASSWORD FOR ... / MySQL 8은 ALTER USER ... IDENTIFIED BY', 'DROP USER'] },
    { title: '권한 관리', points: ['SHOW GRANTS FOR 사용자;', 'GRANT ALL ON db.table TO 사용자;', 'GRANT SELECT, UPDATE ON ... TO ...;', 'FLUSH PRIVILEGES; → 권한 변경 반영'] },
    { title: '옵션 정리', points: ['권한: ALL 또는 SELECT, INSERT, UPDATE 등', '대상: DB명.테이블명 / *.* (모든 DB의 모든 테이블)', "호스트: 'localhost'(내 PC) / '%'(모든 곳)"] },
    { title: '실무 감각', points: ['서비스용 계정에는 ALL보다 필요한 권한만 주는 게 안전'] },
  ],
  questions: [
    { id: 'my-04-01', type: 'short', source: 'MySQL 접속', question: 'root 계정으로 비밀번호를 입력해 MySQL에 접속하는 터미널 명령은?', answer: ['mysql -u root -p'], explanation: '-u 사용자 지정, -p 비밀번호 입력.' },
    { id: 'my-04-02', type: 'mcq', source: '사용자 관리', question: "'userid'@'%' 로 만든 사용자의 특징은?", choices: ['내 PC에서만 접속 가능', '어디서든 접속 가능', '읽기 전용', '비밀번호 없음'], answer: 1, explanation: "'%'는 모든 호스트, 'localhost'는 내 PC." },
    { id: 'my-04-03', type: 'ox', source: '사용자 관리', question: 'MySQL 8에서는 비밀번호 변경에 ALTER USER ... IDENTIFIED BY 를 더 많이 쓴다.', answer: true, explanation: 'SET PASSWORD도 있지만 ALTER USER가 일반적.' },
    { id: 'my-04-04', type: 'mcq', source: '권한 관리', question: '권한을 바꾼 뒤 반영하기 위해 실행하는 명령은?', choices: ['COMMIT;', 'FLUSH PRIVILEGES;', 'RELOAD;', 'REFRESH GRANTS;'], answer: 1, explanation: 'FLUSH PRIVILEGES;' },
    { id: 'my-04-05', type: 'short', source: '옵션 정리', question: 'GRANT에서 "모든 DB의 모든 테이블"을 뜻하는 대상 표기는?', answer: ['*.*'], explanation: 'DB명.테이블명 / *.*' },
    { id: 'my-04-06', type: 'essay', source: '실무 감각', question: '서비스(애플리케이션)용 DB 계정에 ALL 권한을 주지 않는 이유는?', answer: '애플리케이션이 해킹당하거나 버그가 있을 때 계정 권한만큼 피해가 커진다. 필요한 권한(SELECT, INSERT 등)만 주면 테이블 삭제 같은 큰 사고를 막을 수 있다 (최소 권한 원칙).', keywords: ['최소 권한', '피해 범위'], explanation: '필요한 권한만.' },
  ],
}

export default topic
