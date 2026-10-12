import type { Topic } from '../../types'

const topic: Topic = {
  id: 'be-25-flask-mongo',
  track: 'backend',
  group: 'Flask',
  title: '25강 - Flask & MongoDB (pymongo)',
  order: 25,
  notionId: '3efdf951bf808154afacd2a64ca5c595',
  sections: [
    { title: '로그를 MongoDB에 저장하는 이유', points: ['로그는 형식이 수시로 바뀜', 'NoSQL은 스키마를 미리 정할 필요가 없어 적합', 'MongoDB가 익숙하지 않으면 logging 라이브러리로 파일 저장도 OK'] },
    { title: '연결', points: ["pymongo.MongoClient('mongodb://localhost')", '아이디/비번: mongodb://아이디:비번@주소', 'connection.blog_session_db (DB) → .blog_ab (콜렉션 = 테이블 같은 것)'] },
    { title: '연결 확인이 필요한 이유', points: ['연결이 여러 이유로 끊길 수 있음 → 끊긴 상태에서 작업하면 에러', "connection.admin.command('ismaster'), connection.server_info()"] },
    { title: 'CRUD', points: ['insert_one, find_one, delete_one, find()', '저장된 문서마다 _id(ObjectId)가 자동으로 붙음'] },
  ],
  questions: [
    { id: 'be-25-01', type: 'essay', source: '로그를 MongoDB에 저장하는 이유', question: '접속 로그를 MySQL이 아니라 MongoDB에 저장하는 이유는?', answer: '로그는 담는 항목(형식)이 수시로 바뀌는데, MongoDB 같은 NoSQL은 스키마(테이블 구조)를 미리 정하지 않아도 문서를 그대로 저장할 수 있어 변경에 유연하다. 양이 많고 일부 유실돼도 큰 문제가 없는 데이터에 적합하다.', keywords: ['스키마 없음', '형식 변경'], explanation: '규격화된 데이터는 MySQL, 자주 바뀌는 데이터는 MongoDB.' },
    { id: 'be-25-02', type: 'mcq', source: '연결', question: 'MongoDB에서 RDBMS의 "테이블"과 비슷한 개념은?', choices: ['Document', 'Collection', 'Field', 'Cursor'], answer: 1, explanation: 'DB → Collection(테이블 같은 것) → Document(행 같은 것).' },
    { id: 'be-25-03', type: 'short', source: '연결', question: 'pymongo로 로컬 MongoDB에 연결하는 클래스 이름은?', answer: ['MongoClient', 'pymongo.MongoClient'], explanation: "pymongo.MongoClient('mongodb://localhost')" },
    { id: 'be-25-04', type: 'ox', source: '연결 확인이 필요한 이유', question: '한 번 연결한 MongoDB 연결은 절대 끊기지 않으므로 확인할 필요가 없다.', answer: false, explanation: '여러 이유로 끊길 수 있어 ismaster 같은 간단한 명령으로 확인해요.' },
    { id: 'be-25-05', type: 'mcq', source: 'CRUD', question: 'MongoDB에 문서를 저장하면 자동으로 붙는 고유 필드는?', choices: ['id', '_id', 'pk', 'uuid'], answer: 1, explanation: '_id (기본 ObjectId).' },
    { id: 'be-25-06', type: 'mcq', source: 'CRUD', question: '조건에 맞는 문서 하나를 조회하는 pymongo 메서드는?', choices: ['find()', 'find_one()', 'select_one()', 'get()'], answer: 1, explanation: 'find_one(조건). 전체는 find().' },
  ],
}

export default topic
