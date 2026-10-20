import type { Topic } from '../../types'

const topic: Topic = {
  id: 'nq-04-aggregation-1',
  track: 'backend',
  group: 'MongoDB',
  title: 'Aggregation ①: 파이프라인 · $match · $group · $unwind',
  order: 84,
  sections: [
    {
      title: '파이프라인의 개념',
      notionIds: ['3efdf951bf80812abe25e63b8fb84cf2'],
      points: [
        'find()로 어려운 그룹핑·집계·가공은 aggregate([스테이지1, 스테이지2, ...])로 한다. 앞 스테이지의 결과 문서들이 다음 스테이지의 입력이 된다(유닉스 파이프 | 와 같은 개념).',
        '스테이지는 적은 순서대로 실행된다. find 커서(sort → skip → limit 고정)와 다르다.',
        '주요 스테이지: $match(거르기), $group(묶어 집계), $sort, $limit, $skip, $count, $unwind(배열 풀기), $project(모양 바꾸기), $lookup(다른 컬렉션 조인).',
        '성능 원칙: $match와 $sort를 가능한 한 앞에 둔다. 앞에서 문서 수를 줄이면 뒤 스테이지가 가벼워지고, 맨 앞의 $match·$sort는 인덱스를 쓸 수 있다.',
        '샤딩 환경에서는 각 서버가 자기 데이터를 먼저 집계하고 합치므로 대용량 데이터에 유리하다.',
      ],
      code: `db.books.aggregate([
  { $match: { year: { $gte: 2022 } } },   // 1) 거르기
  { $count: "recent_books" }              // 2) 세기
])
// → [ { recent_books: 12 } ]`,
    },
    {
      title: '$group과 누산기',
      notionIds: ['3efdf951bf80812abe25e63b8fb84cf2'],
      points: [
        '{ $group: { _id: "$그룹기준필드", 결과필드: { 누산기: "$필드" } } }. 필드 값을 가리킬 때는 이름 앞에 $를 붙인다("$author").',
        '_id: null 이면 전체를 하나의 그룹으로 묶는다(전체 합계·평균). 여러 필드 기준이면 _id: { year: "$year", author: "$author" }.',
        '누산기: $sum: 1(개수), $sum: "$pages"(합계), $avg, $min, $max, $push(값들을 배열로, 중복 포함), $addToSet(중복 없이), $first/$last(그룹 안 첫·마지막 값, 앞에 $sort가 있어야 의미가 있다).',
        'SQL 대응: $group = GROUP BY, 누산기 = 집계 함수, $match(뒤에 오는) = HAVING.',
      ],
      code: `// 작가별 책 수와 총 페이지, 많은 순 상위 3명
db.books.aggregate([
  { $group: { _id: "$author", books: { $sum: 1 }, pages: { $sum: "$pages" } } },
  { $sort: { pages: -1 } },
  { $limit: 3 }
])`,
    },
    {
      title: '$sort + $group + $first 패턴',
      notionIds: ['3efdf951bf80812abe25e63b8fb84cf2'],
      points: [
        '"그룹별 최고 1개"(연도별 평점 1위 책)는 먼저 $sort로 그룹 기준과 순위 기준을 정렬하고, $group에서 $first로 첫 값을 고른다.',
        '$first/$last는 앞선 정렬에 의존한다. 정렬 없이 쓰면 결과가 매번 달라질 수 있다.',
        '최신 버전에는 $top, $topN, $bottomN 같은 누산기가 있어 정렬 기준을 누산기 안에 넣을 수 있다.',
      ],
      code: `db.books.aggregate([
  { $sort: { year: 1, rating: -1 } },
  { $group: { _id: "$year", best: { $first: "$title" }, rating: { $first: "$rating" } } },
  { $sort: { _id: 1 } }
])`,
    },
    {
      title: '$unwind와 타입 주의',
      notionIds: ['3efdf951bf80812abe25e63b8fb84cf2'],
      points: [
        '$unwind: "$genres" 는 배열 필드를 원소별 문서로 펼친다. genres: ["소설", "역사"]인 책 1권 → genres가 "소설"인 문서 + "역사"인 문서 2개.',
        '배열 필드를 그대로 _id로 묶으면 배열 전체가 그룹 기준이 된다. 장르별 책 수를 세려면 먼저 $unwind 해야 한다.',
        '빈 배열이나 필드가 없는 문서는 $unwind에서 사라진다. 남기려면 { $unwind: { path: "$genres", preserveNullAndEmptyArrays: true } }.',
        '스키마가 없어서 같은 필드에 숫자와 문자열이 섞여 있을 수 있다(평점이 ""인 문서). $avg는 숫자가 아닌 값을 무시하고, 비교·정렬은 타입 순서가 섞여 이상해진다. { $match: { rating: { $type: "number" } } }로 거르거나 $toDouble로 변환한다.',
      ],
      code: `// 장르별 책 수
db.books.aggregate([
  { $unwind: "$genres" },
  { $group: { _id: "$genres", count: { $sum: 1 } } },
  { $sort: { count: -1 } }
])`,
    },
  ],
  questions: [
    {
      id: 'nq-04-01', type: 'mcq', source: '파이프라인의 개념',
      question: 'Aggregation 파이프라인의 동작으로 맞는 것은?',
      choices: ['모든 스테이지가 원본 컬렉션을 각각 읽는다', '앞 스테이지의 결과 문서들이 다음 스테이지의 입력이 된다', '스테이지 순서는 결과에 영향이 없다', '$match는 마지막에만 쓸 수 있다'],
      answer: 1,
      choiceExplanations: [
        '첫 스테이지만 컬렉션을 읽고, 나머지는 앞 결과를 받아요.',
        '정답. 파이프(|)처럼 이어져요.',
        '적은 순서대로 실행돼서 순서가 결과와 성능을 바꿔요.',
        '어디든 쓸 수 있고, 앞에 둘수록 효율적이에요.',
      ],
      explanation: '파이프라인을 설계할 때는 "각 스테이지 뒤에 문서가 어떤 모양인지"를 머릿속으로 따라가 보세요. 막히면 스테이지를 하나씩 추가하며 중간 결과를 확인하는 게 가장 빠른 디버깅이에요.',
    },
    {
      id: 'nq-04-02', type: 'mcq', source: '파이프라인의 개념',
      question: '두 파이프라인 중 성능상 더 좋은 것은?',
      code: `// A
[{ $group: { _id: "$author", n: { $sum: 1 } } }, { $match: { _id: "한강" } }]
// B
[{ $match: { author: "한강" } }, { $group: { _id: "$author", n: { $sum: 1 } } }]`,
      choices: ['A', 'B', '같다', '둘 다 에러'],
      answer: 1,
      choiceExplanations: [
        'A는 모든 작가를 다 묶은 뒤에 한 명만 남겨요.',
        '정답. 먼저 한 작가의 책만 거른 뒤 묶어서 처리량이 훨씬 적고, author 인덱스도 쓸 수 있어요.',
        '결과는 같지만 처리량이 달라요(옵티마이저가 일부 재배치해 주기도 하지만 원칙은 앞에서 거르기).',
        '둘 다 문법은 맞아요.',
      ],
      explanation: '"$match를 최대한 앞으로"는 SQL의 "HAVING보다 WHERE"와 같은 원칙이에요. 그룹 결과로 거르는 조건(예: n > 10)만 $group 뒤의 $match에 둬요.',
    },
    {
      id: 'nq-04-03', type: 'short', source: '$group과 누산기',
      question: '$group에서 그룹마다 문서 개수를 세는 누산기 표현은? count: { $sum: __ }',
      answer: ['1'],
      explanation: '{ $sum: 1 }이에요. 문서마다 1을 더하니 개수가 돼요. { $sum: "$pages" }는 pages 값의 합계예요. 최신 버전에는 { $count: {} } 누산기도 있어요.',
    },
    {
      id: 'nq-04-04', type: 'mcq', source: '$group과 누산기',
      question: '전체 책의 평균 페이지 수를 하나의 결과로 구하는 $group은?',
      choices: [
        '{ $group: { _id: "$pages", avg: { $avg: 1 } } }',
        '{ $group: { avg: { $avg: "pages" } } }',
        '{ $group: { _id: null, avg: { $avg: "$pages" } } }',
        '{ $group: { _id: "$title", avg: { $avg: "$pages" } } }',
      ],
      answer: 2,
      choiceExplanations: [
        '페이지 수별로 묶여 버려요.',
        '_id가 없으면 에러이고, "pages"(달러 없음)는 문자열 상수예요.',
        '정답. _id: null은 "전체를 한 그룹으로". 필드 값은 "$pages"처럼 $를 붙여요.',
        '책마다 따로 묶여 평균이 자기 자신이 돼요.',
      ],
      explanation: '$ 표기 규칙: "$pages"는 필드 값, "pages"는 그냥 문자열. 이 차이로 결과가 0이나 null이 나오는 실수가 정말 흔해요.',
    },
    {
      id: 'nq-04-05', type: 'mcq', source: '$group과 누산기',
      question: '작가별로 "쓴 책 제목 목록(중복 없이)"을 만들려면 어떤 누산기를 쓸까?',
      choices: ['$sum', '$addToSet', '$push', '$first'],
      answer: 1,
      choiceExplanations: [
        '개수나 합계예요.',
        '정답. 중복 없이 배열로 모아요(순서는 보장되지 않아요).',
        '배열로 모으지만 중복도 그대로 넣어요.',
        '첫 값 하나만 가져와요.',
      ],
      explanation: '$push vs $addToSet = 리스트 vs 집합. 제목처럼 원래 중복이 없으면 $push도 되지만, 장르처럼 겹치는 값을 모을 때는 $addToSet이 맞아요.',
    },
    {
      id: 'nq-04-06', type: 'mcq', source: '$sort + $group + $first 패턴',
      question: '"연도별 평점이 가장 높은 책 제목"을 구하려 한다. 빈칸에 들어갈 첫 스테이지는?',
      code: `db.books.aggregate([
  ________,
  { $group: { _id: "$year", best: { $first: "$title" } } }
])`,
      choices: ['{ $sort: { year: 1, rating: -1 } }', '{ $sort: { rating: 1 } }', '{ $limit: 1 }', '{ $unwind: "$year" }'],
      answer: 0,
      choiceExplanations: [
        '정답. 연도별로, 같은 연도 안에서는 평점 높은 순으로 정렬하면 $first가 그 연도의 1위가 돼요.',
        '오름차순이면 $first가 최하위가 돼요.',
        '전체에서 책 한 권만 남아요.',
        'year는 배열이 아니에요.',
      ],
      explanation: '"그룹별 1등" 패턴 = $sort(그룹, 순위 기준) → $group + $first. SQL에서는 윈도우 함수(ROW_NUMBER)로 푸는 문제와 같아요.',
    },
    {
      id: 'nq-04-07', type: 'ox', source: '$sort + $group + $first 패턴',
      question: '$group의 $first는 앞에 $sort가 없어도 항상 같은 결과를 보장한다.',
      answer: false,
      explanation: '정렬이 없으면 "첫 번째"의 기준이 없어서 저장 순서·실행 계획에 따라 결과가 바뀔 수 있어요. $first/$last를 쓸 때는 반드시 앞에 의도한 $sort를 두세요.',
    },
    {
      id: 'nq-04-08', type: 'mcq', source: '$unwind와 타입 주의',
      question: 'genres: ["소설", "역사"]인 책 1권에 { $unwind: "$genres" }를 적용하면?',
      choices: ['그대로 1개 문서', 'genres 필드가 삭제된 1개 문서', 'genres가 "소설"인 문서와 "역사"인 문서 2개', '에러'],
      answer: 2,
      choiceExplanations: [
        '배열이 펼쳐져요.',
        '필드는 남고 값이 원소 하나가 돼요.',
        '정답. 원소 수만큼 문서가 복제되고, 각 문서의 genres는 원소 하나가 돼요.',
        '정상 동작이에요.',
      ],
      explanation: '$unwind 뒤 $group: { _id: "$genres" }로 장르별 개수를 세는 게 대표 패턴이에요. 펼치면 문서 수가 늘어나니, $unwind 전에 $match로 대상을 줄이는 게 좋아요.',
    },
    {
      id: 'nq-04-09', type: 'mcq', source: '$unwind와 타입 주의',
      question: '장르별 책 수를 세는데 $unwind 없이 { $group: { _id: "$genres", n: { $sum: 1 } } } 를 했다. 결과는?',
      choices: ['장르별 개수가 정확히 나온다', '["소설", "역사"] 같은 배열 조합 전체가 그룹 기준이 되어 의도와 다른 결과가 나온다', '에러', '빈 결과'],
      answer: 1,
      choiceExplanations: [
        '배열을 펼치지 않았어요.',
        '정답. ["소설"]과 ["소설", "역사"]가 서로 다른 그룹이 돼요.',
        '배열도 _id가 될 수 있어서 에러는 아니에요.',
        '결과는 나와요. 의도와 다를 뿐이에요.',
      ],
      explanation: '노션 정리: "배열 필드를 그대로 _id에 넣으면 배열 자체가 그룹 기준 → 요소별로 세려면 먼저 $unwind". 집계가 이상하면 해당 필드가 배열인지부터 확인하세요.',
    },
    {
      id: 'nq-04-10', type: 'short', source: '$unwind와 타입 주의',
      question: '빈 배열이거나 필드가 없는 문서도 $unwind 결과에 남기려면 path와 함께 주는 옵션 이름은? (preserve로 시작)',
      answer: ['preserveNullAndEmptyArrays', 'preserveNullAndEmptyArrays: true'],
      explanation: '{ $unwind: { path: "$genres", preserveNullAndEmptyArrays: true } }예요. 없으면 장르가 비어 있는 책이 통계에서 조용히 사라져요. SQL의 INNER JOIN vs LEFT JOIN 차이와 비슷해요.',
    },
    {
      id: 'nq-04-11', type: 'mcq', source: '$unwind와 타입 주의',
      question: '평균 평점이 이상하게 나온다. 확인해 보니 일부 문서의 rating이 ""(빈 문자열)이다. 알맞은 처리는?',
      choices: ['{ $match: { rating: { $type: "number" } } }로 숫자만 남기거나, 저장 단계에서 형식을 검증해 정리한다', '그대로 둔다', 'rating 필드를 삭제한다', '$sort를 추가한다'],
      answer: 0,
      choiceExplanations: [
        '정답. 분석 시점에는 타입으로 거르고, 근본적으로는 넣을 때 검증(Pydantic, $jsonSchema)해요.',
        '정렬·비교에서도 문제가 생겨요.',
        '데이터를 잃어요.',
        '정렬로는 해결되지 않아요.',
      ],
      explanation: '스키마가 없다는 건 "잘못된 형식도 들어온다"는 뜻이에요. 크롤링 데이터는 특히 그래요(DB 설계의 "데이터 클렌징" 토픽). 수집할 때 정리하는 게 분석할 때마다 고치는 것보다 훨씬 싸요.',
    },
    {
      id: 'nq-04-12', type: 'mcq', source: '$group과 누산기',
      question: 'SQL의 SELECT author, COUNT(*) FROM books GROUP BY author HAVING COUNT(*) >= 3 에 해당하는 파이프라인은?',
      choices: [
        '[{ $match: { count: { $gte: 3 } } }, { $group: { _id: "$author", count: { $sum: 1 } } }]',
        '[{ $group: { _id: "$author", count: { $sum: 1 } } }, { $match: { count: { $gte: 3 } } }]',
        '[{ $group: { _id: "$author", count: { $gte: 3 } } }]',
        '[{ $count: "author" }]',
      ],
      answer: 1,
      choiceExplanations: [
        '묶기 전에는 count 필드가 없어서 아무것도 안 남아요.',
        '정답. $group 뒤의 $match가 HAVING 역할을 해요.',
        '$gte는 누산기가 아니에요.',
        '전체 개수만 세요.',
      ],
      explanation: 'SQL ↔ Aggregation 대응: WHERE ↔ 앞쪽 $match, GROUP BY + 집계 ↔ $group, HAVING ↔ $group 뒤 $match, ORDER BY ↔ $sort, LIMIT ↔ $limit, SELECT 컬럼 ↔ $project.',
    },
  ],
}

export default topic
