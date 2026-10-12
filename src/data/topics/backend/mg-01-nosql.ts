import type { Topic } from '../../types'

const topic: Topic = {
  id: 'mg-01-nosql',
  track: 'backend',
  group: 'MongoDB',
  title: 'MongoDB 1강 - NoSQL과 MongoDB 개념',
  order: 201,
  notionId: '3efdf951bf808194831ef91ab5254c23',
  sections: [
    { title: 'NoSQL (Not only SQL)', points: ['RDBMS의 한계를 보완하려고 나온 저장소', '고정된 스키마가 없음 → 문서마다 필드가 달라도 됨', '초당 데이터가 많이 쌓이는 서비스(SNS, 로그)', '읽기가 대부분이면 RDBMS로 충분, 쓰기가 절반 이상이면 NoSQL(분산) + Redis(캐시) 고려', '종류: Key-Value, Wide Column, Document, Graph'] },
    { title: 'MongoDB', points: ['Document 기반 NoSQL', '내부적으로 BSON(Binary JSON) 저장 → JSON보다 빠르게 처리', '모든 문서는 고유한 _id (기본 ObjectId)'] },
    { title: '데이터 구조 비교', points: ['RDBMS: Database → Table → Row', 'MongoDB: Database → Collection → Document', 'Collection은 테이블과 비슷하지만 스키마가 정해져 있지 않음'] },
    { title: '설치와 보안', points: ['설치는 공식 문서를 따르기', '외부 접속 허용 시: 27017 포트, bindIp 0.0.0.0', '반드시 계정을 만들고 security.authorization: enabled → 안 하면 아무나 접속'] },
    { title: 'GUI 도구', points: ['Studio 3T Free (예전 Robomongo)', '인증: SCRAM-SHA-256, 인증 DB admin'] },
    { title: '기본 명령', points: ['show dbs / use library (없으면 데이터 넣을 때 자동 생성)', 'show collections, db.stats()', 'db.createCollection("books"), renameCollection, drop(), db.dropDatabase()'] },
    { title: 'Capped Collection', points: ['크기가 고정된 컬렉션, 꽉 차면 가장 오래된 문서부터 자동 삭제 → 로그 저장에 유용', 'createCollection("access_log", { capped: true, size: 바이트, max: 개수 })'] },
    { title: '주요 데이터 타입', points: ['String, Integer(32/64), Double, Boolean, Null', 'Array, Object(임베디드 문서), ObjectId, Date'] },
  ],
  questions: [
    { id: 'mg-01-01', type: 'mcq', source: 'NoSQL (Not only SQL)', question: 'NoSQL을 고려할 만한 상황은?', choices: ['읽기가 대부분인 서비스', '쓰기가 절반 이상이고 데이터가 빠르게 쌓이는 서비스', '데이터가 매우 적은 서비스', '스키마가 절대 바뀌지 않는 회계 데이터'], answer: 1, explanation: '쓰기가 많으면 NoSQL(분산) + Redis(캐시). 읽기 위주면 RDBMS로 충분.' },
    { id: 'mg-01-02', type: 'mcq', source: 'NoSQL (Not only SQL)', question: 'MongoDB가 속한 NoSQL 데이터 모델은?', choices: ['Key-Value', 'Wide Column', 'Document', 'Graph'], answer: 2, explanation: 'Document 기반.' },
    { id: 'mg-01-03', type: 'short', source: 'MongoDB', question: 'MongoDB가 내부적으로 문서를 저장하는 형식은?', answer: ['BSON', 'Binary JSON'], explanation: 'BSON(Binary JSON) — JSON보다 빠르게 읽고 처리.' },
    { id: 'mg-01-04', type: 'mcq', source: '데이터 구조 비교', question: 'RDBMS의 Row에 해당하는 MongoDB 개념은?', choices: ['Collection', 'Document', 'Field', 'Database'], answer: 1, explanation: 'Table ↔ Collection, Row ↔ Document.' },
    { id: 'mg-01-05', type: 'ox', source: '설치와 보안', question: '서버에 MongoDB를 설치하고 외부 접속을 허용할 때 계정과 authorization 설정을 하지 않으면 아무나 접속할 수 있다.', answer: true, explanation: 'security.authorization: enabled 필수.' },
    { id: 'mg-01-06', type: 'mcq', source: '설치와 보안', question: 'MongoDB 기본 포트는?', choices: ['3306', '5432', '27017', '8080'], answer: 2, explanation: '27017. (3306은 MySQL)' },
    { id: 'mg-01-07', type: 'ox', source: 'GUI 도구', question: 'Studio 3T Free는 예전 이름이 Robomongo인 MongoDB GUI 도구다.', answer: true, explanation: 'SQL의 Workbench 같은 역할.' },
    { id: 'mg-01-08', type: 'ox', source: '기본 명령', question: 'use library 를 실행하면 데이터가 없어도 library DB가 즉시 디스크에 생성된다.', answer: false, explanation: 'use로 선택만 하고, 데이터를 넣을 때 실제로 생성돼요.' },
    { id: 'mg-01-09', type: 'mcq', source: 'Capped Collection', question: 'Capped Collection이 꽉 찼을 때 동작은?', choices: ['에러 발생', '가장 오래된 문서부터 자동 삭제', '새 문서 무시', '크기 자동 증가'], answer: 1, explanation: '그래서 로그 저장에 유용해요.' },
    { id: 'mg-01-10', type: 'mcq', source: '주요 데이터 타입', question: 'publisher: { name: "한빛", city: "서울" } 같은 값의 타입은?', choices: ['Array', 'Object(임베디드 문서)', 'String', 'ObjectId'], answer: 1, explanation: '문서 안의 문서 = 임베디드 문서.' },
  ],
}

export default topic
