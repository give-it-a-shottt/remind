import type { Topic } from '../../types'

const topic: Topic = {
  id: 'mg-04-agg-1',
  track: 'backend',
  group: 'MongoDB',
  title: 'MongoDB 4강 - Aggregation ① 파이프라인과 기본 스테이지',
  order: 204,
  notionId: '3efdf951bf80812abe25e63b8fb84cf2',
  sections: [
    { title: 'Aggregation Framework', points: ['find()로 어려운 그룹핑·집계·가공', '파이프라인: 앞 단계 결과가 다음 단계 입력 (유닉스 | 파이프)', 'Sharding 환경에서 서버마다 동시 처리 → 빅데이터에 유리'] },
    { title: '예제 데이터', points: ['books: title, year, genres(배열), pages, rating, author'] },
    { title: '주요 스테이지', points: ['$match 조건 / $group 그룹·집계 / $sort / $limit / $count / $unwind 배열 풀기'] },
    { title: '$group 구조', points: ['{ $group: { _id: "$그룹기준필드", 결과필드: { 누산기: "$필드" } } }', '필드 이름 앞에 $', '_id: null이면 전체를 하나의 그룹으로'] },
    { title: '누산기(accumulator)', points: ['$sum: 1 → 개수, $sum: "$pages" → 합계', '$avg, $min, $max', '$push: 배열로(중복 포함) / $addToSet: 중복 없이', '$first / $last: 순서에 따라 달라서 $sort와 함께'] },
    { title: '예시', points: ['2022년 이후 책 수: $match + $count', '작가별 총 페이지 많은 순 1명: $group + $sort + $limit', '연도별 평점 최고 책: $sort(year, rating -1) + $group $first'] },
    { title: '$unwind: 배열 풀기', points: ['["소설","역사"] → 문서 2개로', '배열 필드를 그대로 _id에 넣으면 배열 자체가 그룹 기준 → 요소별로 세려면 먼저 $unwind'] },
    { title: '데이터 타입 주의', points: ['같은 필드에 숫자와 문자열이 섞여 있기도 함 (평점이 "")', '{ $match: { rating: { $type: "number" } } }로 거르거나 $toInt로 변환'] },
  ],
  questions: [
    { id: 'mg-04-01', type: 'mcq', source: 'Aggregation Framework', question: 'Aggregation 파이프라인의 특징은?', choices: ['모든 단계가 원본 컬렉션을 따로 읽는다', '앞 단계 결과가 다음 단계의 입력이 된다', '한 단계만 쓸 수 있다', 'SQL로 변환해 실행된다'], answer: 1, explanation: '유닉스 파이프(|)와 같은 개념.' },
    { id: 'mg-04-02', type: 'ox', source: '예제 데이터', question: 'books 예제의 genres 필드는 배열이다.', answer: true, explanation: '["IT", "입문"] 처럼 — 그래서 $unwind 연습에 써요.' },
    { id: 'mg-04-03', type: 'mcq', source: '주요 스테이지', question: '조건으로 문서를 걸러내는 스테이지는?', choices: ['$group', '$match', '$project', '$count'], answer: 1, explanation: '$match는 find의 조건과 같은 문법.' },
    { id: 'mg-04-04', type: 'mcq', source: '$group 구조', question: '전체 문서를 하나의 그룹으로 집계하려면 _id를?', choices: ['"$all"', 'null', '0만 가능', '생략'], answer: 1, explanation: '_id: null.' },
    { id: 'mg-04-05', type: 'mcq', source: '누산기(accumulator)', question: '그룹별 "개수"를 세는 누산기는?', choices: ['$count: 1', '$sum: 1', '$avg: 1', '$push: 1'], answer: 1, explanation: '$sum: 1은 문서마다 1을 더해 개수. $sum: "$pages"는 합계.' },
    { id: 'mg-04-06', type: 'mcq', source: '누산기(accumulator)', question: '그룹의 값들을 중복 없이 배열로 모으는 누산기는?', choices: ['$push', '$addToSet', '$first', '$merge'], answer: 1, explanation: '$push는 중복 포함, $addToSet은 중복 제거.' },
    { id: 'mg-04-07', type: 'essay', source: '예시', question: '"연도별 평점이 가장 높은 책"을 구하는 파이프라인과, $sort가 필요한 이유는?', answer: '[{ $sort: { year: 1, rating: -1 } }, { $group: { _id: "$year", best: { $first: "$title" } } }]. $first는 그룹 안에서 "들어온 순서상" 첫 값을 고르므로, 먼저 평점 내림차순으로 정렬해야 첫 값이 최고 평점 책이 된다.', keywords: ['$sort 먼저', '$first', '순서'], explanation: '$first/$last는 항상 $sort와 함께.' },
    { id: 'mg-04-08', type: 'mcq', source: '$unwind: 배열 풀기', question: '장르별 책 수를 셀 때 $group 전에 필요한 스테이지는?', choices: ['$match', '$unwind: "$genres"', '$project', '$limit'], answer: 1, explanation: '배열을 그대로 _id에 넣으면 배열 자체가 그룹 기준이 돼요.' },
    { id: 'mg-04-09', type: 'short', source: '데이터 타입 주의', question: 'rating이 숫자인 문서만 남기는 조건 연산자는? (rating: { ?: "number" })', answer: ['$type'], explanation: '{ $match: { rating: { $type: "number" } } }' },
  ],
}

export default topic
