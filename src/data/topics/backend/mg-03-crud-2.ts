import type { Topic } from '../../types'

const topic: Topic = {
  id: 'mg-03-crud-2',
  track: 'backend',
  group: 'MongoDB',
  title: 'MongoDB 3강 - CRUD ② 검색 심화, 수정, 삭제',
  order: 203,
  notionId: '3efdf951bf8081c5b7f6cd8d3fa61c04',
  sections: [
    { title: '정규표현식 ($regex)', points: ["/진/ 포함 (LIKE '%진%'), /^서/ 시작, { $regex: '윤$' } 끝"] },
    { title: '정렬, 개수, 일부만', points: ['sort({ age: 1 }) 오름차순, -1 내림차순', 'countDocuments({}) 전체 개수, { city: { $exists: true } } 필드가 있는 문서', 'distinct("city") 중복 제거, find().limit(1)', 'count(), find().count()는 권장되지 않음 → countDocuments()'] },
    { title: '배열 검색', points: ['{ favorites: "소설" } 배열에 있으면', '$all: 모두 있어야 / $in: 하나라도 / $nin: 하나도 없어야'] },
    { title: '수정', points: ['updateOne(조건, 변경, 옵션): 첫 문서만 / updateMany: 모두', '$set 값 변경(없으면 추가), $inc 숫자 증가, $unset 필드 삭제', '$push / $pull 배열 추가 / 제거', 'upsert: true → 없으면 새로 만들기', '문서 통째로 바꾸려면 replaceOne (기존 필드 사라짐)'] },
    { title: '삭제', points: ['deleteOne, deleteMany', 'deleteMany({}) → 전체 삭제 (컬렉션은 남음)'] },
    { title: '교재에서 헷갈리기 쉬운 부분', points: ['removeOne/removeMany가 아니라 deleteOne/deleteMany', '"문서 replace" 예시는 사실 $set이라 일부 필드만 바뀜', 'createCollection의 autoIndexId 옵션은 최신 버전에서 없어짐'] },
  ],
  questions: [
    { id: 'mg-03-01', type: 'mcq', source: '정규표현식 ($regex)', question: "name이 '서'로 시작하는 문서를 찾는 조건은?", choices: ['{ name: /서/ }', '{ name: /^서/ }', '{ name: /서$/ }', '{ name: "서%" }'], answer: 1, explanation: '^ 시작, $ 끝, 아무것도 없으면 포함.' },
    { id: 'mg-03-02', type: 'mcq', source: '정렬, 개수, 일부만', question: '조건에 맞는 문서 개수를 셀 때 권장되는 메서드는?', choices: ['count()', 'find().count()', 'countDocuments()', 'length()'], answer: 2, explanation: 'count(), find().count()는 권장되지 않아요.' },
    { id: 'mg-03-03', type: 'short', source: '정렬, 개수, 일부만', question: 'city 필드가 "있는" 문서만 찾는 연산자는?', answer: ['$exists'], explanation: '{ city: { $exists: true } }' },
    { id: 'mg-03-04', type: 'mcq', source: '배열 검색', question: "favorites에 '소설'과 '여행'이 모두 들어 있는 문서를 찾는 연산자는?", choices: ['$in', '$all', '$nin', '$and만'], answer: 1, explanation: '$all = 모두 포함. $in = 하나라도.' },
    { id: 'mg-03-05', type: 'mcq', source: '수정', question: '도윤의 나이를 1 증가시키는 연산자는?', choices: ['$set', '$inc', '$push', '$add'], answer: 1, explanation: "updateOne({ name: '도윤' }, { $inc: { age: 1 } })" },
    { id: 'mg-03-06', type: 'mcq', source: '수정', question: 'updateOne에 { upsert: true } 옵션을 주면?', choices: ['여러 문서를 수정', '조건에 맞는 문서가 없으면 새로 만든다', '수정 전 백업', '필드를 삭제'], answer: 1, explanation: 'update + insert = upsert.' },
    { id: 'mg-03-07', type: 'short', source: '수정', question: '배열 필드에서 특정 값을 제거하는 수정 연산자는?', answer: ['$pull'], explanation: '$push 추가, $pull 제거.' },
    { id: 'mg-03-08', type: 'ox', source: '삭제', question: 'deleteMany({})를 실행하면 컬렉션 자체가 삭제된다.', answer: false, explanation: '문서만 모두 지워지고 컬렉션은 남아요. 컬렉션 삭제는 drop().' },
    { id: 'mg-03-09', type: 'mcq', source: '교재에서 헷갈리기 쉬운 부분', question: '문서를 통째로 교체(기존 필드 제거)하는 메서드는?', choices: ['updateOne + $set', 'replaceOne', 'removeOne', 'upsert'], answer: 1, explanation: '$set은 일부 필드만 바꿔요. 진짜 교체는 replaceOne.' },
  ],
}

export default topic
