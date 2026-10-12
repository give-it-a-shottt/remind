import type { Topic } from '../../types'

const topic: Topic = {
  id: 'mg-05-agg-2',
  track: 'backend',
  group: 'MongoDB',
  title: 'MongoDB 5강 - Aggregation ② $project, $lookup 등',
  order: 205,
  notionId: '3efdf951bf8081ae9eabe559f5572274',
  sections: [
    { title: '예제 데이터 추가: 리뷰 컬렉션', points: ['reviews: book_title, user, score, text — books의 title을 참조'] },
    { title: '$project: 필드 고르고 만들기', points: ['1 포함, 0 제외, "$필드"로 이름 바꾸기, 수식으로 새 필드', '$concat은 문자열만 → 숫자는 $toString', '$strLenCP: 문자열 길이'] },
    { title: '$lookup: 다른 컬렉션과 조인', points: ['{ from, localField, foreignField, as }', '결과는 항상 배열 (매칭 없으면 빈 배열) → SQL LEFT JOIN과 비슷', '$size로 개수, "$reviews.user"로 배열 안 필드만 모으기'] },
    { title: '$skip', points: ['앞에서 몇 개 건너뛰기', '$skip + $limit = 페이지네이션 기본'] },
    { title: '$facet', points: ['같은 입력으로 서로 다른 파이프라인을 동시에 돌려 한 문서에 모음 (대시보드용)'] },
    { title: '$redact', points: ['$cond로 $$KEEP(남기기) / $$PRUNE(제거)', '단순 필터는 $match가 더 간단·빠름, $redact는 중첩 문서를 층별로 거를 때'] },
    { title: '연습', points: ['장르별 평균 페이지 최대 1개: $unwind → $group $avg → $sort → $limit → $project', '작가별 책 수 많은 순 + 이름 바꾸기'] },
  ],
  questions: [
    { id: 'mg-05-01', type: 'ox', source: '예제 데이터 추가: 리뷰 컬렉션', question: 'reviews 컬렉션은 book_title로 books의 title을 참조한다.', answer: true, explanation: '$lookup의 localField: "title", foreignField: "book_title".' },
    { id: 'mg-05-02', type: 'mcq', source: '$project: 필드 고르고 만들기', question: '$concat: ["$title", " (", "$year", ")"] 에서 year가 숫자라 생기는 문제의 해결은?', choices: ['$toInt', '$toString: "$year"', '$sum', '그대로 둬도 됨'], answer: 1, explanation: '$concat은 문자열만 잇기 때문에 숫자는 $toString.' },
    { id: 'mg-05-03', type: 'short', source: '$project: 필드 고르고 만들기', question: '$project에서 year 필드를 published라는 이름으로 내보내는 표현은? (published: ?)', answer: ['"$year"', "'$year'", '$year'], explanation: 'published: "$year"' },
    { id: 'mg-05-04', type: 'mcq', source: '$lookup: 다른 컬렉션과 조인', question: '$lookup 결과 필드(as)의 형태는?', choices: ['문서 하나', '항상 배열 (매칭 없으면 빈 배열)', '숫자', 'null'], answer: 1, explanation: 'SQL의 LEFT JOIN과 비슷 — 매칭 없어도 원본 문서는 남아요.' },
    { id: 'mg-05-05', type: 'short', source: '$lookup: 다른 컬렉션과 조인', question: '조인된 reviews 배열의 개수를 구하는 연산자는?', answer: ['$size'], explanation: 'reviewCount: { $size: "$reviews" }' },
    { id: 'mg-05-06', type: 'mcq', source: '$skip', question: '평점 순 2페이지(3~4번째)를 보려면?', choices: ['$limit 2 → $skip 2', '$sort → $skip 2 → $limit 2', '$skip 4', '$limit 4'], answer: 1, explanation: '$skip + $limit = 페이지네이션 (정렬 먼저).' },
    { id: 'mg-05-07', type: 'mcq', source: '$facet', question: '$facet의 용도는?', choices: ['문서 삭제', '같은 입력으로 여러 집계를 동시에 돌려 한 문서에 모으기', '컬렉션 조인', '배열 풀기'], answer: 1, explanation: '연도별 개수 + 평점 TOP2를 한 번에 — 대시보드용.' },
    { id: 'mg-05-08', type: 'ox', source: '$redact', question: '단순히 평점 4.5 이상만 거를 때는 $redact보다 $match가 더 간단하고 빠르다.', answer: true, explanation: '$redact는 중첩 문서를 층별로 거를 때.' },
    { id: 'mg-05-09', type: 'mcq', source: '연습', question: '$group 결과의 _id를 genre라는 이름으로 바꿔 보여주는 스테이지는?', choices: ['$rename', '$project: { _id: 0, genre: "$_id" }', '$set: { genre: 1 }', '$unwind'], answer: 1, explanation: '$project에서 "$_id"를 새 이름으로.' },
  ],
}

export default topic
