import type { Topic } from '../../types'

const topic: Topic = {
  id: 'be-24-flask-mysql',
  track: 'backend',
  group: 'Flask',
  title: '24강 - Flask & MySQL (pymysql)',
  order: 24,
  notionId: '3efdf951bf80819ab08cdba80c22bde2',
  sections: [
    { title: '웹서비스와 데이터베이스', points: ['MySQL(관계형): 규격화되고 안정성이 중요한 데이터', 'NoSQL(MongoDB): 형식이 자주 바뀌는 로그·크롤링 데이터, 일부 유실돼도 큰 문제 없는 데이터', 'Redis: 성능 향상용 in-memory DB', '블로그: MySQL → 구독 이메일, MongoDB → 접속 IP·시간 로그'] },
    { title: 'SQLAlchemy vs pymysql', points: ['SQLAlchemy: DB를 객체로 다루는 ORM, 별도 문법', '지금은 SQL 자체에 익숙해지는 게 중요 → pymysql'] },
    { title: 'pymysql 사용 순서', points: ['import → connect() → cursor() → execute(sql) → fetchall/fetchone/fetchmany', 'INSERT/UPDATE/DELETE는 commit()으로 확정', 'close()로 닫기'] },
    { title: '연결', points: ["pymysql.connect(host, port=3306, user, passwd, db, charset='utf8')", 'charset: 한글 깨짐 방지'] },
    { title: '사용자 테이블', points: ['USER_ID INT UNSIGNED NOT NULL AUTO_INCREMENT, PRIMARY KEY(USER_ID)', 'USER_EMAIL VARCHAR(100) NOT NULL, BLOG_ID CHAR(4)'] },
    { title: 'CRUD 예시', points: ['cursor.execute(sql, (값1, 값2)) 후 db_conn.commit()', '조회 결과 한 행은 튜플'] },
    { title: '팁 (SQL 인젝션)', points: ['Flask에서 바로 테스트하면 오래 걸림 → 주피터에서 충분히 테스트', '% 로 SQL 문자열을 직접 만들지 말고 execute(sql, (값,)) 방식 → SQL 인젝션 방지'] },
  ],
  questions: [
    { id: 'be-24-01', type: 'mcq', source: '웹서비스와 데이터베이스', question: '블로그 프로젝트에서 MongoDB에 저장하는 데이터는?', choices: ['구독 이메일', '접속 IP와 시간 로그', '비밀번호', '블로그 글 본문'], answer: 1, explanation: '형식이 자주 바뀌는 로그는 NoSQL, 규격화된 구독 이메일은 MySQL.' },
    { id: 'be-24-02', type: 'mcq', source: '웹서비스와 데이터베이스', question: '성능 향상용 in-memory DB는?', choices: ['MySQL', 'MongoDB', 'Redis', 'SQLite'], answer: 2, explanation: 'Redis는 메모리에 저장해 매우 빠른 캐시 등에 써요.' },
    { id: 'be-24-03', type: 'ox', source: 'SQLAlchemy vs pymysql', question: 'SQLAlchemy는 DB를 객체로 다루는 ORM 방식이다.', answer: true, explanation: '별도 문법을 배워야 해서, 지금은 SQL에 익숙해지려고 pymysql을 써요.' },
    { id: 'be-24-04', type: 'mcq', source: 'pymysql 사용 순서', question: 'INSERT 후 commit()을 하지 않으면?', choices: ['자동 저장된다', '변경이 DB에 확정되지 않는다', '에러가 난다', '테이블이 삭제된다'], answer: 1, explanation: '변경(INSERT/UPDATE/DELETE)은 commit()으로 확정해야 해요.' },
    { id: 'be-24-05', type: 'short', source: '연결', question: 'pymysql.connect()에서 한글 깨짐을 막는 인자는? (이름=값)', answer: ["charset='utf8'", 'charset="utf8"', 'charset=utf8', "charset='utf8mb4'"], explanation: "charset='utf8'" },
    { id: 'be-24-06', type: 'mcq', source: '사용자 테이블', question: 'USER_ID INT UNSIGNED NOT NULL AUTO_INCREMENT 에서 AUTO_INCREMENT의 역할은?', choices: ['음수 허용', '데이터를 넣을 때마다 자동으로 1씩 증가', '중복 허용', 'NULL 허용'], answer: 1, explanation: 'INSERT 시 생략하면 자동으로 번호가 매겨져요.' },
    { id: 'be-24-07', type: 'ox', source: 'CRUD 예시', question: 'pymysql의 fetchall() 결과에서 한 행은 튜플이다.', answer: true, explanation: 'row[0], row[1]처럼 꺼내요.' },
    { id: 'be-24-08', type: 'essay', source: '팁 (SQL 인젝션)', question: 'SQL을 문자열 더하기로 만들면 안 되는 이유와 올바른 방법은?', answer: '사용자 입력이 SQL 문자열에 그대로 들어가 조작된 SQL이 실행될 수 있는 SQL 인젝션에 취약하다(작은따옴표만 있어도 에러). SQL에는 %s 자리만 두고 값은 cursor.execute(sql, (값,))의 두 번째 인자로 넘겨 라이브러리가 안전하게 처리하게 한다.', keywords: ['SQL 인젝션', '%s', 'execute 두 번째 인자'], explanation: '값이 하나여도 튜플이라 (값,) 쉼표 필요.' },
  ],
}

export default topic
