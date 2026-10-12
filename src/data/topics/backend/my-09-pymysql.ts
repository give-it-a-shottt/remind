import type { Topic } from '../../types'

const topic: Topic = {
  id: 'my-09-pymysql',
  track: 'backend',
  group: 'MySQL',
  title: 'MySQL 9강 - pymysql로 파이썬에서 MySQL 다루기',
  order: 109,
  notionId: '3efdf951bf8081d28650fb1b07a48c28',
  sections: [
    { title: 'pymysql', points: ['파이썬에서 MySQL을 다루는 가장 쉽고 많이 쓰는 라이브러리', 'pip install pymysql'] },
    { title: '기본 흐름 7단계', points: ['import → connect() → cursor() → SQL 문자열 → execute(sql)', '변경이면 commit(), 조회면 fetch...()', 'close()'] },
    { title: '접속', points: ["pymysql.connect(host='localhost', port=3306, user, passwd, db, charset='utf8')", '커서 = DB에 SQL을 보내고 결과를 받는 통로'] },
    { title: '테이블 만들기', points: ["CREATE TABLE도 cursor.execute(sql) 후 commit()"] },
    { title: 'INSERT', points: ['sql = "INSERT INTO product VALUES (%s, %s, ...)"', 'cursor.execute(sql, (값들)) 반복 후 commit()'] },
    { title: 'SELECT', points: ['cursor.execute("SELECT * FROM product") → rows = cursor.fetchall()', '한 행 = 튜플, row[0], row[1]'] },
    { title: 'fetch 메서드', points: ['fetchall(): 전부 (튜플의 튜플)', 'fetchone(): 다음 한 행, 없으면 None', 'fetchmany(n): 다음 n행'] },
    { title: 'UPDATE / DELETE', points: ['cursor.execute("UPDATE ... WHERE PRODUCT_CODE=%s", (값,)) → commit()'] },
    { title: '주의: SQL 인젝션', points: ['문자열 더하기로 SQL에 값을 붙이면 조작될 수 있어 위험', 'SQL에는 %s만, 값은 execute의 두 번째 인자(튜플)', "값이 하나여도 ('값',) 쉼표 필요"] },
    { title: '팁', points: ['스키마처럼 한 번만 만드는 건 Workbench에서, 반복 작업은 파이썬으로'] },
  ],
  questions: [
    { id: 'my-09-01', type: 'short', source: 'pymysql', question: 'pymysql 설치 명령은?', answer: ['pip install pymysql'], explanation: 'pip install pymysql' },
    { id: 'my-09-02', type: 'mcq', source: '기본 흐름 7단계', question: 'pymysql 흐름에서 execute 다음 단계로 맞는 것은?', choices: ['조회든 변경이든 항상 commit()', '변경이면 commit(), 조회면 fetch...()', '항상 close() 먼저', 'cursor() 다시 호출'], answer: 1, explanation: 'INSERT/UPDATE/DELETE/CREATE는 commit, SELECT는 fetch.' },
    { id: 'my-09-03', type: 'mcq', source: '접속', question: '커서(cursor)의 역할은?', choices: ['DB 백업', 'DB에 SQL을 보내고 결과를 받는 통로', '테이블 정렬', '권한 관리'], answer: 1, explanation: 'db.cursor()로 가져와 execute()에 써요.' },
    { id: 'my-09-04', type: 'ox', source: '테이블 만들기', question: 'pymysql에서 CREATE TABLE도 cursor.execute()로 실행할 수 있다.', answer: true, explanation: 'SQL 문자열을 execute → commit.' },
    { id: 'my-09-05', type: 'mcq', source: 'INSERT', question: 'pymysql INSERT에서 값 자리 표시자는?', choices: ['?', '%s', '{}', ':value'], answer: 1, explanation: 'pymysql은 %s (숫자도 %s).' },
    { id: 'my-09-06', type: 'ox', source: 'SELECT', question: 'fetchall()로 가져온 한 행은 딕셔너리다.', answer: false, explanation: '기본 커서는 튜플. row[0]처럼 인덱스로 꺼내요.' },
    { id: 'my-09-07', type: 'mcq', source: 'fetch 메서드', question: '더 이상 행이 없을 때 fetchone()의 반환값은?', choices: ['빈 튜플', 'None', '에러', '0'], answer: 1, explanation: 'fetchone(): 다음 한 행, 없으면 None.' },
    { id: 'my-09-08', type: 'ox', source: 'UPDATE / DELETE', question: 'UPDATE·DELETE 후 commit()을 해야 DB에 반영된다.', answer: true, explanation: '변경 작업은 commit으로 확정.' },
    { id: 'my-09-09', type: 'short', source: '주의: SQL 인젝션', question: "값이 하나일 때 execute의 두 번째 인자 형태는? (예: '215673142' 를 넘길 때)", answer: ["('215673142',)"], explanation: '값이 하나여도 튜플이라 쉼표 필요.' },
    { id: 'my-09-10', type: 'mcq', source: '팁', question: '스키마(테이블 생성)처럼 한 번만 하는 작업에 강의가 권장하는 도구는?', choices: ['파이썬 반복문', 'MySQL Workbench', 'Excel', 'Jupyter만'], answer: 1, explanation: '한 번은 Workbench, 반복은 파이썬.' },
  ],
}

export default topic
