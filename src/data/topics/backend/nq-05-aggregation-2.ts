import type { Topic } from '../../types'

const topic: Topic = {
  id: 'nq-05-aggregation-2',
  track: 'backend',
  group: 'MongoDB',
  title: 'Aggregation ②: $project · $lookup · $facet · 문서 모델링',
  order: 85,
  sections: [
    {
      title: '$project: 모양 바꾸기',
      notionIds: ['3efdf951bf8081ae9eabe559f5572274'],
      slides: [
        {
          title: '고르고, 빼고, 이름 바꾸고, 만들고',
          blocks: [
            { type: 'code', code: `db.books.aggregate([
  { $project: {
      _id: 0,                                              // 빼기
      title: 1,                                            // 고르기
      writer: "$author",                                   // 이름 바꾸기
      label: { $concat: ["$title", " (", { $toString: "$year" }, ")"] },   // 만들기
      badge: { $cond: [{ $gte: ["$rating", 4] }, "추천", ""] }
  } }
])` },
            { type: 'say', text: '`$project`는 SQL의 SELECT처럼 결과 **모양**을 정해요. `writer: "$author"`는 author 값을 writer라는 **새 이름**으로 내보내요(결과엔 `{ writer: "..." }`만 남아요).\n• `$concat`은 **문자열만** 받아요. 숫자 year를 넣으면 결과가 **null**이 돼요 → `$toString`으로 바꿔요\n• `$cond: [조건, 참, 거짓]` — SQL의 CASE (sql-03)\n• 기존 필드를 **다 유지하면서** 몇 개만 추가하려면 `$addFields`(= `$set` 스테이지)가 편해요' },
          ],
        },
      ],
    },
    {
      title: '$lookup: 다른 컬렉션 붙이기',
      notionIds: ['3efdf951bf8081ae9eabe559f5572274'],
      slides: [
        {
          title: 'MongoDB의 JOIN',
          blocks: [
            { type: 'code', code: `db.books.aggregate([
  { $lookup: { from: "reviews", localField: "title", foreignField: "book_title", as: "reviews" } },
  { $project: { title: 1, review_count: { $size: "$reviews" }, reviewers: "$reviews.user" } },
  { $sort: { review_count: -1 } }
])` },
            { type: 'say', text: '`$lookup`은 다른 컬렉션(`from`)을 붙여요. 결과는 **항상 배열**(`as`)로 붙고, 짝이 없으면 **빈 배열**이에요. 그래서 SQL의 **LEFT JOIN**과 비슷해요(sql-05).\n• `$size`로 개수\n• `"$reviews.user"`로 배열 안 특정 필드만 모으기\n• 하나만 필요하면 `$unwind`로 펼치기' },
            { type: 'note', tone: 'tip', text: '`$lookup`은 편리하지만 매번 조인하면 비싸요. `foreignField`에 **인덱스**를 두고, 자주 함께 읽는 데이터라면 마지막 개념의 **임베딩**을 검토해요.' },
          ],
        },
      ],
    },
    {
      title: '$skip · $facet',
      notionIds: ['3efdf951bf8081ae9eabe559f5572274'],
      slides: [
        {
          title: '한 번에 여러 결과',
          blocks: [
            { type: 'code', code: `db.books.aggregate([
  { $match: { year: { $gte: 2020 } } },
  { $facet: {
      items: [{ $sort: { rating: -1 } }, { $skip: 0 }, { $limit: 10 }],   // 목록
      total: [{ $count: "n" }],                                          // 전체 개수
      byGenre: [{ $unwind: "$genres" }, { $group: { _id: "$genres", n: { $sum: 1 } } }]
  } }
])` },
            { type: 'say', text: '`$facet`은 **같은 입력**으로 여러 하위 파이프라인을 동시에 돌려서 결과를 **한 문서**에 모아요. sa-05에서 목록과 total을 쿼리 두 번으로 구했죠? `$facet`이면 **한 번의 aggregate**로 "10개짜리 페이지 + 전체 개수 + 장르별 통계"까지 받아요.' },
            { type: 'note', tone: 'warn', text: '파이프라인은 **적은 순서대로** 실행돼요(nq-04). `$skip`·`$limit`을 `$sort` **앞에** 두면 아무 10개를 자른 다음 정렬해 버려요. 페이지네이션은 **$sort 다음에** $skip·$limit. find 커서와 다른 점이에요.' },
            { type: 'say', text: '`$redact`는 `$cond`로 `$$KEEP`/`$$PRUNE`을 정해 중첩 문서를 **층별로** 거르는 고급 스테이지예요. 단순 필터라면 `$match`가 더 간단하고 빨라요.' },
          ],
        },
      ],
    },
    {
      title: '문서 모델링: 임베딩 vs 참조',
      slides: [
        {
          title: '넣을까, 가리킬까',
          blocks: [
            { type: 'code', code: `// 임베딩: 주문 안에 항목 (함께 생성·조회, 주문 당시 가격 보존)
{ _id: 1, user_id: 7, items: [ { product_id: 3, name: "펜", price: 1200, qty: 2 } ] }

// 참조: 리뷰는 별도 컬렉션 (계속 늘어남)
{ _id: 9, book_id: ObjectId("..."), user: "kim", score: 5 }` },
            {
              type: 'table',
              head: ['', '임베딩', '참조'],
              rows: [
                ['방법', '관련 데이터를 **한 문서 안에**', '다른 컬렉션의 **_id만** 저장'],
                ['장점', '**한 번 읽기**로 끝, 단일 문서 쓰기는 **원자적**', '공유·독립적 변경에 강함'],
                ['어울리는 곳', '**함께 읽고 함께 바뀜** — 주문 + 항목, 글 + 최근 댓글 몇 개', '여러 곳에서 **공유**(작가, 상품), **끝없이 늘어남**(모든 댓글, 로그), 따로 자주 바뀜'],
              ],
            },
          ],
        },
        {
          title: '읽기 패턴에서 출발해요',
          blocks: [
            { type: 'note', tone: 'warn', text: '문서 하나의 최대 크기는 **16MB**예요. 인기 글에 댓글이 수십만 개 달린다면? 댓글을 글 문서에 **임베딩**하면 결국 한계에 닿고 갱신도 느려져요. 끝없이 늘어나는 건 **별도 컬렉션 + 참조**로.' },
            { type: 'say', text: 'RDB가 "**중복 없는 정규화**"에서 출발한다면(dbd-06), 문서 DB는 "**이 데이터를 어떻게 읽는가**(접근 패턴)"에서 출발해요.\n\n그리고 임베딩은 일종의 **비정규화**예요(dbd-09). 주문에 복사한 상품명·가격이 원본과 **달라져도 되는지**(스냅숏인지) 꼭 판단해요. 주문 당시 가격이라면 달라지는 게 맞고요.' },
          ],
        },
      ],
    },
  ],
  questions: [
    {
      id: 'nq-05-01', type: 'mcq', source: '$project: 모양 바꾸기',
      question: '{ $project: { writer: "$author", _id: 0 } } 의 결과 문서 모양은?',
      choices: ['{ writer: "한강" }', '{ author: "한강" }', '{ writer: "$author" }', '{ _id: ..., writer: "한강" }'],
      answer: 0,
      choiceExplanations: [
        '정답. "$author"는 author 필드의 값을 뜻해요.',
        '필드 이름이 writer로 바뀌어요.',
        '$가 붙은 문자열은 값 참조로 해석돼요.',
        '_id: 0으로 뺐어요.',
      ],
      explanation: '$project는 SQL의 SELECT author AS writer와 같아요. 응답 형식을 API 모델에 맞추는 마지막 단계로 자주 써요.',
    },
    {
      id: 'nq-05-02', type: 'mcq', source: '$project: 모양 바꾸기',
      question: '{ $concat: ["$title", " - ", "$year"] } 에서 year가 숫자라 결과가 null이 됐다. 해결은?',
      choices: ['$sum으로 바꾼다', '{ $toString: "$year" }로 문자열로 바꿔 넣는다', '$year 대신 year로 쓴다', '$unwind를 쓴다'],
      answer: 1,
      choiceExplanations: [
        '더하기는 문자열을 이어 붙이지 않아요.',
        '정답. $concat은 문자열만 받아요.',
        '"year"는 그냥 글자 year가 돼요.',
        '배열 펼치기와 무관해요.',
      ],
      explanation: '노션 노트의 "$concat은 문자열만 → 숫자는 $toString"이에요. 타입 변환 연산자: $toString, $toInt, $toDouble, $toDate, $convert(실패 시 기본값 지정 가능).',
    },
    {
      id: 'nq-05-03', type: 'short', source: '$project: 모양 바꾸기',
      question: '기존 필드를 모두 유지하면서 새 필드만 추가하는 스테이지 이름은? (add로 시작)',
      answer: ['$addFields', 'addFields', '$set'],
      explanation: '$addFields(별칭 $set 스테이지)예요. $project는 명시한 필드만 남기기 때문에 "몇 개만 추가"할 때는 $addFields가 편해요.',
    },
    {
      id: 'nq-05-04', type: 'mcq', source: '$lookup: 다른 컬렉션 붙이기',
      question: '리뷰가 하나도 없는 책에 $lookup(reviews)을 적용하면?',
      choices: ['책 문서가 결과에서 사라진다', 'reviews 필드가 null이 된다', '에러', 'reviews 필드가 빈 배열 []로 붙어 책은 남는다'],
      answer: 3,
      choiceExplanations: [
        '그건 INNER JOIN 동작이에요. $lookup은 왼쪽 문서를 남겨요.',
        'null이 아니라 빈 배열이에요.',
        '정상 동작이에요.',
        '정답. SQL LEFT JOIN과 비슷해요. 매칭이 없으면 빈 배열이에요.',
      ],
      explanation: '리뷰 없는 책을 빼고 싶으면 $lookup 뒤에 { $match: { reviews: { $ne: [] } } }를 추가하거나, $unwind(기본 옵션)로 펼쳐 빈 배열을 없애요.',
    },
    {
      id: 'nq-05-05', type: 'mcq', source: '$lookup: 다른 컬렉션 붙이기',
      question: '$lookup 결과 배열 reviews에서 리뷰 개수와 리뷰 작성자 목록을 만드는 $project는?',
      choices: [
        '{ count: { $size: "$reviews" }, users: "$reviews.user" }',
        '{ count: { $sum: "$reviews" }, users: "$user" }',
        '{ count: "$reviews.length", users: "$reviews[user]" }',
        '{ count: { $count: "$reviews" }, users: 1 }',
      ],
      answer: 0,
      choiceExplanations: [
        '정답. $size는 배열 길이, "$reviews.user"는 배열 원소들의 user 값을 배열로 모아요.',
        '$sum은 숫자 합계이고, $user는 최상위 필드라 없어요.',
        '자바스크립트 문법은 동작하지 않아요.',
        '$count는 스테이지 이름이에요.',
      ],
      explanation: '"$배열.필드"는 배열 안 모든 원소의 그 필드를 배열로 모으는 지름길이에요. 노션 노트의 "$reviews.user로 배열 안 필드만 모으기"예요.',
    },
    {
      id: 'nq-05-06', type: 'short', source: '$lookup: 다른 컬렉션 붙이기',
      question: '$lookup에서 붙일 상대 컬렉션 이름을 지정하는 키는? { $lookup: { ____: "reviews", ... } }',
      answer: ['from'],
      explanation: '{ from, localField, foreignField, as } 네 가지예요. from = 상대 컬렉션, localField = 내 필드, foreignField = 상대 필드, as = 결과를 넣을 배열 필드 이름.',
    },
    {
      id: 'nq-05-07', type: 'mcq', source: '$skip · $facet',
      question: '목록 API에서 "10개짜리 페이지 결과"와 "조건에 맞는 전체 개수"를 한 번의 aggregate로 받고 싶다. 알맞은 스테이지는?',
      choices: ['$lookup', '$unwind', '$facet', '$redact'],
      answer: 2,
      choiceExplanations: [
        '다른 컬렉션 조인이에요.',
        '배열 펼치기예요.',
        '정답. items: [$sort, $skip, $limit], total: [$count] 두 하위 파이프라인을 같은 입력으로 돌려요.',
        '문서 내부를 층별로 거르는 스테이지예요.',
      ],
      explanation: '$facet 결과는 문서 하나에 { items: [...], total: [{ n: 120 }] } 모양으로 와요. 앞에 $match를 두면 두 결과가 같은 조건을 공유해서 "목록과 개수 조건 불일치" 버그가 원천적으로 없어요.',
    },
    {
      id: 'nq-05-08', type: 'ox', source: '$skip · $facet',
      question: '파이프라인에서 $skip과 $limit은 $sort 앞에 두어도 결과가 같다.',
      answer: false,
      explanation: 'Aggregation은 적은 순서대로 실행돼서, $limit을 먼저 하면 "임의의 10개를 정렬"하게 돼요. 페이지네이션은 $sort → $skip → $limit 순서로 써야 해요(find 커서와 다른 점).',
    },
    {
      id: 'nq-05-09', type: 'mcq', source: '문서 모델링: 임베딩 vs 참조',
      question: '주문 문서에 주문 항목(상품명, 가격, 수량)을 임베딩하는 것이 알맞은 이유는?',
      choices: ['주문과 항목은 함께 만들고 함께 읽으며, 주문 당시의 가격·이름을 그대로 보존해야 해서', '상품 정보가 바뀌면 주문 내역도 자동으로 바뀌어야 해서', '임베딩하면 문서 크기 제한이 없어져서', '$lookup을 쓸 수 없어서'],
      answer: 0,
      choiceExplanations: [
        '정답. 한 번에 읽고, 단일 문서라 원자적으로 저장되고, 스냅숏으로 남아요.',
        '반대예요. 주문 기록은 당시 값이 유지돼야 해요.',
        '16MB 제한은 그대로예요.',
        '$lookup은 쓸 수 있어요.',
      ],
      explanation: '임베딩 판단 기준: 함께 읽는가? 함께 바뀌는가? 개수가 제한적인가? 다른 곳과 공유되지 않는가? 모두 "예"면 임베딩이 좋아요. RDB에서도 order_items.unit_price로 당시 가격을 따로 저장하는 것과 같은 의도된 중복이에요.',
    },
    {
      id: 'nq-05-10', type: 'mcq', source: '문서 모델링: 임베딩 vs 참조',
      question: '인기 게시글에 댓글이 수십만 개까지 달릴 수 있다. 댓글 저장 방식으로 알맞은 것은?',
      choices: ['게시글 문서의 comments 배열에 모두 임베딩', '댓글을 문자열 하나로 이어 붙여 저장', '별도 comments 컬렉션에 post_id로 참조해 저장하고, 필요하면 게시글에는 최근 몇 개만 복사', '댓글마다 새 DB를 만든다'],
      answer: 2,
      choiceExplanations: [
        '문서가 16MB 한계에 닿고, 댓글 하나 추가할 때마다 거대한 문서를 갱신해야 해요.',
        '검색·수정·삭제가 불가능해져요.',
        '정답. 끝없이 늘어나는 데이터는 참조로. "최근 3개 댓글"처럼 화면에 바로 필요한 일부만 임베딩하는 하이브리드(서브셋 패턴)도 흔해요.',
        '말이 안 되는 방법이에요.',
      ],
      explanation: '무한히 커지는 배열(unbounded array)은 문서 모델링의 대표 안티패턴이에요. 참조 + post_id 인덱스로 페이지 단위 조회를 해요.',
    },
    {
      id: 'nq-05-11', type: 'short', source: '문서 모델링: 임베딩 vs 참조',
      question: 'MongoDB 문서 하나의 최대 크기는? (숫자와 단위, 예: 16MB)',
      answer: ['16MB', '16mb', '16 MB', '16'],
      explanation: '16MB예요. 이보다 큰 파일(이미지, 동영상)은 GridFS나 S3 같은 객체 저장소에 두고, 문서에는 경로·메타데이터만 넣어요.',
    },
    {
      id: 'nq-05-12', type: 'ox', source: '문서 모델링: 임베딩 vs 참조',
      question: '문서 DB 모델링은 RDB처럼 "중복 없는 정규화"보다 "데이터를 어떻게 읽는가(접근 패턴)"를 먼저 기준으로 삼는 경우가 많다.',
      answer: true,
      explanation: '맞아요. 문서 DB는 JOIN이 약한 대신 "한 번에 필요한 걸 한 문서로" 설계해 읽기를 빠르게 해요. 대신 중복된 값의 일관성(원본이 바뀌면 복사본을 어떻게 할지)을 설계자가 책임져야 해요. 이 트레이드오프는 DB 설계의 비정규화 토픽에서 다시 다뤄요.',
    },
  ],
}

export default topic
