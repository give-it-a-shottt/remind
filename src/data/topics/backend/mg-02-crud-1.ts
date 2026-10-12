import type { Topic } from '../../types'

const topic: Topic = {
  id: 'mg-02-crud-1',
  track: 'backend',
  group: 'MongoDB',
  title: 'MongoDB 2강 - CRUD ① 삽입과 조회',
  order: 202,
  notionId: '3efdf951bf80818c81ecdeb74d4faaca',
  sections: [
    { title: '예제 데이터', points: ['db.members.insertMany([{ name, age, city }, ...])', 'city가 없는 문서도 OK (스키마 없음)'] },
    { title: '삽입', points: ['insertOne({...}) 하나, insertMany([...]) 여러 개', '_id를 안 넣으면 자동 생성'] },
    { title: '조회 기본 구조', points: ['db.컬렉션.find({ 조건 }, { projection })', 'findOne(): 첫 문서 하나', 'projection: 1 포함, 0 제외 (_id는 기본 포함 → 빼려면 _id: 0)'] },
    { title: 'SQL과 비교', points: ['find() = SELECT *', 'find({}, { name: 1, city: 1, _id: 0 }) = SELECT name, city', "find({ city: '서울' }) = WHERE city = '서울'"] },
    { title: '비교 연산자', points: ['$eq, $ne, $gt, $gte, $lt, $lte', '$in: 배열 값 중 하나와 같으면 / $nin: 어느 것과도 같지 않으면'] },
    { title: '논리 연산자', points: ['$and, $or, $not', '조건을 여러 개 쓰면 기본이 AND라 $and 생략 가능', '{ $not: { $eq: X } } = { $ne: X } (필드 없는 문서도 포함)'] },
    { title: '연습', points: ['30세 미만의 이름과 나이만: find({ age: { $lt: 30 } }, { _id: 0, name: 1, age: 1 })'] },
  ],
  questions: [
    { id: 'mg-02-01', type: 'ox', source: '예제 데이터', question: 'MongoDB 컬렉션의 문서들은 모두 같은 필드를 가져야 한다.', answer: false, explanation: '스키마가 없어서 city가 없는 문서도 함께 저장돼요.' },
    { id: 'mg-02-02', type: 'mcq', source: '삽입', question: '여러 문서를 한 번에 넣는 셸 메서드는?', choices: ['insertOne', 'insertMany', 'insertAll', 'bulkInsert'], answer: 1, explanation: 'insertMany([{...}, {...}]) — 배열로.' },
    { id: 'mg-02-03', type: 'mcq', source: '조회 기본 구조', question: 'find의 projection에서 _id를 빼려면?', choices: ['_id: 1', '_id: 0', '_id: false만 가능', '자동으로 빠짐'], answer: 1, explanation: '_id는 기본 포함이라 _id: 0을 명시해야 해요.' },
    { id: 'mg-02-04', type: 'short', source: 'SQL과 비교', question: "SELECT name, city FROM members 와 같은 MongoDB 조회는? (find(...))", answer: ['db.members.find({}, { name: 1, city: 1, _id: 0 })', 'find({}, { name: 1, city: 1, _id: 0 })', 'find({},{name:1,city:1,_id:0})'], explanation: '빈 조건 {} + projection.' },
    { id: 'mg-02-05', type: 'mcq', source: '비교 연산자', question: '나이 20 이상 40 미만 조건은?', choices: ['{ age: { $gt: 20, $lt: 40 } }', '{ age: { $gte: 20, $lt: 40 } }', '{ age: { $gte: 20, $lte: 40 } }', '{ age: 20~40 }'], answer: 1, explanation: '$gte(이상), $lt(미만).' },
    { id: 'mg-02-06', type: 'short', source: '비교 연산자', question: "city가 '부산' 또는 '대구'인 회원을 찾는 연산자는?", answer: ['$in'], explanation: "{ city: { $in: ['부산', '대구'] } }" },
    { id: 'mg-02-07', type: 'mcq', source: '논리 연산자', question: "{ city: '서울', age: { $lt: 30 } } 의 의미는?", choices: ['서울 OR 30세 미만', '서울 AND 30세 미만', '서울이 아니고 30세 미만', '에러'], answer: 1, explanation: '조건을 여러 개 쓰면 기본이 AND.' },
    { id: 'mg-02-08', type: 'ox', source: '논리 연산자', question: "{ city: { $not: { $eq: '서울' } } } 은 city 필드가 없는 문서도 결과에 포함한다.", answer: true, explanation: '"서울과 같지 않음"에는 필드가 없는 경우도 해당돼요. $ne와 같은 결과.' },
    { id: 'mg-02-09', type: 'short', source: '연습', question: "이름이 '우진'이거나 나이가 34인 회원을 찾는 논리 연산자는?", answer: ['$or'], explanation: "{ $or: [ { name: '우진' }, { age: 34 } ] }" },
  ],
}

export default topic
