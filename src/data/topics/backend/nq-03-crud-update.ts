import type { Topic } from '../../types'

const topic: Topic = {
  id: 'nq-03-crud-update',
  track: 'backend',
  group: 'MongoDB',
  title: 'MongoDB CRUD ②: 검색 심화 · 수정 · 삭제',
  order: 83,
  sections: [
    {
      title: '정규표현식 검색',
      notionIds: ['3efdf951bf8081c5b7f6cd8d3fa61c04'],
      slides: [
        {
          title: '$regex로 패턴 찾기',
          blocks: [
            { type: 'code', code: `db.members.find({ name: /진/ })                     // 포함 (LIKE '%진%')
db.members.find({ name: { $regex: "^서" } })        // 시작
db.members.find({ name: { $regex: "윤$" } })        // 끝
db.books.find({ title: { $regex: "fastapi", $options: "i" } })   // 대소문자 무시` },
            { type: 'say', text: '`^`는 **시작**, `$`는 **끝**, `i`는 대소문자 무시예요. sa-05의 LIKE와 같은 원리로 `^`로 시작하는 **접두어** 정규식은 인덱스를 쓸 수 있지만, **중간 포함** 검색은 인덱스를 제대로 못 써서 전체를 훑어요.' },
            { type: 'note', tone: 'warn', text: '사용자 입력을 **그대로** 정규식에 넣으면 `.`, `*`, `+`, `?` 같은 특수문자가 패턴으로 해석돼요. 게다가 일부러 복잡한 패턴을 넣어 서버를 느리게 만드는 공격(**ReDoS**)도 가능해요. 파이썬에서는 **`re.escape()`** 로 감싸요(sa-05의 autoescape와 같은 생각).' },
          ],
        },
      ],
    },
    {
      title: '정렬 · 개수 · 일부만 · 배열 검색',
      notionIds: ['3efdf951bf8081c5b7f6cd8d3fa61c04'],
      slides: [
        {
          title: '정렬과 개수',
          blocks: [
            { type: 'code', code: `db.members.find().sort({ age: -1 }).limit(3)      // 나이 많은 순 3명
db.members.find().limit(3).sort({ age: -1 })      // 결과 같음! (적은 순서 무관)
db.members.countDocuments({ city: { $exists: true } })
db.members.estimatedDocumentCount()               // 전체 개수 추정 (빠름)
db.members.distinct("city")                       // 중복 없는 값 목록` },
            { type: 'say', text: '`sort({ age: 1 })` 오름차순, `-1` 내림차순. 중요한 점: find 커서는 **적은 순서와 상관없이 항상 sort → skip → limit** 순으로 적용돼요. 그래서 `limit(3).sort(...)`도 "나이 많은 순 3명"이에요.\n\n개수는 **`countDocuments(조건)`**. 예전 `count()`는 사용 중단됐어요.' },
          ],
        },
        {
          title: '배열 검색',
          blocks: [
            {
              type: 'table',
              head: ['조건', '뜻'],
              rows: [
                ['`{ favorites: "소설" }`', '배열에 "소설"이 **들어 있으면**'],
                ['`{ favorites: { $all: ["소설", "역사"] } }`', '**둘 다** 들어 있어야'],
                ['`{ favorites: { $in: [...] } }`', '**하나라도**'],
                ['`{ favorites: { $size: 3 } }`', '배열 **길이**가 3'],
              ],
            },
            { type: 'code', code: `// items 배열 안 "같은 원소"가 name=펜 이면서 qty>=2
db.orders.find({ items: { $elemMatch: { name: "펜", qty: { $gte: 2 } } } })` },
            { type: 'note', tone: 'warn', text: '`{ "items.name": "펜", "items.qty": { $gte: 2 } }`라고 쓰면, 펜 1개짜리 원소와 **다른** 상품 5개짜리 원소가 있는 주문도 걸려요. 조건이 **서로 다른 원소**에서 각각 만족돼도 되거든요. **같은 원소**에 여러 조건을 걸려면 `$elemMatch`예요.' },
          ],
        },
      ],
    },
    {
      title: '수정: updateOne · updateMany',
      notionIds: ['3efdf951bf8081c5b7f6cd8d3fa61c04'],
      slides: [
        {
          title: '변경 연산자',
          blocks: [
            { type: 'code', code: `db.members.updateOne({ name: "김민준" }, { $set: { city: "인천" } })   // 첫 문서만
db.members.updateMany({ city: "부산" }, { $inc: { age: 1 } })        // 맞는 것 모두
db.members.updateOne({ name: "이서연" }, { $push: { favorites: "과학" } })` },
            {
              type: 'table',
              head: ['연산자', '하는 일'],
              rows: [
                ['`$set` / `$unset`', '값 변경(없으면 추가) / 필드 삭제'],
                ['**`$inc`**', '숫자 증가·감소 (**원자적**)'],
                ['`$push` / `$addToSet`', '배열에 추가 / **중복 없이** 추가'],
                ['`$pull`', '배열에서 조건에 맞는 값 **제거**'],
                ['`$rename`', '필드 이름 변경'],
              ],
            },
            { type: 'note', tone: 'warn', text: '변경 연산자 없이 `{ name: "새이름" }`만 넘기면 `updateOne`은 **에러**예요. 문서 **전체 교체**는 `replaceOne`의 역할이에요. 예전 `update()`는 문서를 통째로 갈아 끼워서 **다른 필드가 다 사라지는** 사고가 잦았어요. fa-07의 "PUT은 전체 교체, PATCH는 부분 수정"과 같은 구분이에요.' },
          ],
        },
        {
          title: '원자적 증가와 upsert',
          blocks: [
            { type: 'code', code: `// 오늘 방문 수 +1, 오늘 문서가 없으면 새로 만듦
db.stats.updateOne({ day: "2026-10-20" }, { $inc: { visits: 1 } }, { upsert: true })` },
            { type: 'say', text: '조회수처럼 동시 요청이 몰리는 값은 **`$inc`** 로 올려요. 읽어서 +1 해서 쓰면 sql-06의 **갱신 손실**이 생기지만, `$inc`는 DB가 **원자적으로** 계산해요(sa-07의 `values(views=Post.views + 1)`와 같아요).\n\n**`upsert: true`** 는 조건에 맞는 문서가 **없으면 새로 만들어요.** "있으면 수정, 없으면 생성"을 한 번에 원자적으로(sa-03의 upsert).\n\n결과의 `matchedCount`(찾은 수)와 `modifiedCount`(실제 바뀐 수)로 처리 여부를 확인해요.' },
          ],
        },
      ],
    },
    {
      title: '삭제',
      notionIds: ['3efdf951bf8081c5b7f6cd8d3fa61c04'],
      slides: [
        {
          title: 'deleteOne, deleteMany, drop',
          blocks: [
            {
              type: 'table',
              head: ['명령', '결과'],
              rows: [
                ['`deleteOne(조건)`', '첫 문서 하나'],
                ['`deleteMany(조건)`', '맞는 것 모두'],
                ['`deleteMany({})`', '**전체 문서** 삭제 (컬렉션과 인덱스는 **남음**) — SQL의 TRUNCATE 느낌'],
                ['`drop()`', '컬렉션째 삭제'],
              ],
            },
            { type: 'say', text: '교재의 `removeOne`/`removeMany` 같은 이름은 실제로 **없어요.** 최신 이름은 `deleteOne`/`deleteMany`예요.\n\n조건을 잘못 쓰면 의도보다 많이 지워져요. 같은 조건으로 **`countDocuments`를 먼저** 해서 대상 수를 확인하는 습관을 들여요. sql-02의 "UPDATE/DELETE 전에 같은 WHERE로 SELECT"와 똑같아요.' },
          ],
        },
      ],
    },
  ],
  questions: [
    {
      id: 'nq-03-01', type: 'mcq', source: '정규표현식 검색',
      question: '이름이 "서"로 시작하는 회원을 찾는 조건은?',
      choices: ['{ name: /서/ }', '{ name: /서$/ }', '{ name: /^서/ }', '{ name: "서%" }'],
      answer: 2,
      choiceExplanations: [
        '"서"가 어디든 포함되면 일치해요.',
        '$는 문자열의 끝이에요.',
        '정답. ^는 문자열의 시작이에요.',
        'MongoDB는 SQL의 % 와일드카드를 쓰지 않아요. 문자열 "서%"와 정확히 같은 값만 찾아요.',
      ],
      explanation: '정규식 기호: ^ 시작, $ 끝, . 아무 한 글자, * 0회 이상, i 옵션 대소문자 무시. SQL LIKE와 대응: \'서%\' ↔ /^서/, \'%서\' ↔ /서$/, \'%서%\' ↔ /서/.',
    },
    {
      id: 'nq-03-02', type: 'ox', source: '정규표현식 검색',
      question: '검색창에 사용자가 입력한 문자열을 이스케이프 없이 그대로 $regex에 넣어도 안전하다.',
      answer: false,
      explanation: '입력에 . * + ( ) 같은 특수문자가 있으면 패턴으로 해석돼 결과가 틀리고, 일부러 만든 복잡한 패턴은 서버 CPU를 오래 붙잡아요(ReDoS). 파이썬에서는 {"$regex": re.escape(q), "$options": "i"} 처럼 이스케이프해요.',
    },
    {
      id: 'nq-03-03', type: 'mcq', source: '정렬 · 개수 · 일부만 · 배열 검색',
      question: 'db.members.find().limit(3).sort({ age: -1 }) 의 결과는?',
      choices: ['전체를 나이 내림차순 정렬한 뒤 위에서 3개', '처음 3개를 가져와 나이순으로 정렬', '에러: sort는 limit보다 먼저 써야 한다', '무작위 3개'],
      answer: 0,
      choiceExplanations: [
        '정답. 가장 나이 많은 3명이에요.',
        'MongoDB 커서는 적은 순서와 관계없이 sort → skip → limit 순서로 적용해요.',
        '어떤 순서로 적어도 동작해요.',
        '정렬이 적용돼요.',
      ],
      explanation: '커서 메서드는 실행 직전에 모아서 적용돼서 순서가 고정이에요(sort → skip → limit). 반면 Aggregation 파이프라인은 적은 순서대로 실행돼서 $limit을 $sort보다 먼저 쓰면 결과가 달라져요.',
    },
    {
      id: 'nq-03-04', type: 'short', source: '정렬 · 개수 · 일부만 · 배열 검색',
      question: '조건에 맞는 문서 수를 세는 최신 MongoDB 메서드 이름은? db.members.______________({ city: "서울" })',
      answer: ['countDocuments', 'count_documents'],
      explanation: 'countDocuments예요(pymongo: count_documents). 예전 count()는 사용 중단됐어요. 전체 개수를 빠르게 대략 알고 싶으면 estimatedDocumentCount()(메타데이터 기반).',
    },
    {
      id: 'nq-03-05', type: 'mcq', source: '정렬 · 개수 · 일부만 · 배열 검색',
      question: 'favorites 배열에 "소설"과 "역사"가 "둘 다" 들어 있는 회원을 찾으려면?',
      choices: [
        '{ favorites: ["소설", "역사"] }',
        '{ favorites: { $in: ["소설", "역사"] } }',
        '{ favorites: { $all: ["소설", "역사"] } }',
        '{ favorites: "소설역사" }',
      ],
      answer: 2,
      choiceExplanations: [
        '배열 전체가 정확히 ["소설", "역사"](순서·개수까지 동일)인 문서만 찾아요.',
        '둘 중 하나만 있어도 일치해요.',
        '정답. 순서와 상관없이 지정한 값이 모두 들어 있으면 일치해요.',
        '그런 문자열 값을 찾아요.',
      ],
      explanation: '배열 검색 정리: 값 하나({ favorites: "소설" }) → 포함 여부, $all → 모두 포함, $in → 하나라도 포함, $nin → 하나도 없음, $size → 길이, 배열 리터럴 → 정확히 같은 배열.',
    },
    {
      id: 'nq-03-06', type: 'mcq', source: '수정: updateOne · updateMany',
      question: "db.members.updateOne({ name: '김민준' }, { $set: { city: '인천' } }) 에 대한 설명으로 맞는 것은?",
      choices: ['김민준 문서 전체가 { city: "인천" }으로 바뀐다', 'city 필드가 없으면 에러가 난다', '이름이 김민준인 모든 문서가 바뀐다', '김민준 문서의 city만 인천으로 바뀌고 다른 필드는 유지된다'],
      answer: 3,
      choiceExplanations: [
        '그건 replaceOne이에요.',
        '$set은 필드가 없으면 추가해요.',
        'updateOne은 첫 번째 문서 하나만 바꿔요. 모두 바꾸려면 updateMany.',
        '정답. $set은 지정한 필드만 바꿔요.',
      ],
      explanation: '노션의 "교재의 replace 예시는 사실 $set이라 일부 필드만 바뀜"이 바로 이 차이예요. 수정은 항상 변경 연산자($set 등)를 쓰는 게 안전해요.',
    },
    {
      id: 'nq-03-07', type: 'mcq', source: '수정: updateOne · updateMany',
      question: '게시글 조회수를 동시 요청에도 정확하게 1씩 올리는 방법은?',
      choices: [
        "updateOne({ _id: id }, { $inc: { views: 1 } })",
        'findOne으로 views를 읽고 파이썬에서 +1 한 값을 $set',
        "replaceOne으로 문서 전체를 다시 쓴다",
        "deleteOne 후 insertOne",
      ],
      answer: 0,
      choiceExplanations: [
        '정답. $inc는 서버에서 원자적으로 더해요. SQL의 SET views = views + 1과 같아요.',
        '읽고-계산-쓰기 사이에 다른 요청이 끼면 증가분이 사라져요(갱신 손실).',
        '다른 요청의 변경을 덮어쓸 위험이 커요.',
        '그 사이에 문서가 사라져 보이고, 다른 필드 변경을 잃을 수 있어요.',
      ],
      explanation: '원자적 연산자($inc, $push, $addToSet, $pull)를 쓰면 문서 하나 안에서는 동시성 문제가 해결돼요. MongoDB는 "단일 문서 쓰기는 원자적"이라는 보장을 가지고 있어요.',
    },
    {
      id: 'nq-03-08', type: 'short', source: '수정: updateOne · updateMany',
      question: '조건에 맞는 문서가 없으면 새로 만들도록 updateOne에 주는 옵션은? { ______: true }',
      answer: ['upsert'],
      explanation: 'upsert(update + insert)예요. 날짜별 방문자 집계처럼 "그날 문서가 있으면 +1, 없으면 만들기"를 한 번에 원자적으로 처리해요. 조건 필드에 UNIQUE 인덱스를 두면 동시에 두 문서가 생기는 것도 막을 수 있어요.',
    },
    {
      id: 'nq-03-09', type: 'mcq', source: '수정: updateOne · updateMany',
      question: '배열 tags에서 "old" 값을 제거하는 변경 연산자는?',
      choices: ['$unset', '$pop', '$pull', '$set: { tags: null }'],
      answer: 2,
      choiceExplanations: [
        '$unset은 필드 전체를 지워요.',
        '$pop은 배열의 첫 번째(-1) 또는 마지막(1) 원소를 제거해요. 값을 지정하지 않아요.',
        '정답. $pull: { tags: "old" } → 일치하는 원소를 모두 제거해요.',
        '배열 전체를 null로 바꿔요.',
      ],
      explanation: '배열 연산자 정리: $push(추가), $addToSet(없을 때만 추가), $pull(조건에 맞는 원소 제거), $pop(맨 앞/뒤 제거), $push + $each/$slice(여러 개 추가 + 길이 제한, 최근 N개 유지).',
    },
    {
      id: 'nq-03-10', type: 'mcq', source: '삭제',
      question: '컬렉션의 모든 문서를 지우되 컬렉션(과 인덱스)은 남기려면?',
      choices: ['db.members.deleteMany({})', 'db.members.drop()', 'db.members.removeMany()', 'db.dropDatabase()'],
      answer: 0,
      choiceExplanations: [
        '정답. 빈 조건 {}는 "모든 문서"를 뜻해요.',
        '컬렉션과 인덱스까지 모두 삭제해요.',
        '그런 메서드는 없어요(교재 오타).',
        'DB 전체를 지워요.',
      ],
      explanation: 'SQL 대응: deleteMany({}) ≈ DELETE FROM t, drop() ≈ DROP TABLE t. 문서가 아주 많을 때는 drop 후 다시 만드는 게 훨씬 빠르지만 인덱스도 다시 만들어야 해요.',
    },
    {
      id: 'nq-03-11', type: 'ox', source: '삭제',
      question: 'deleteMany 전에 같은 조건으로 countDocuments를 실행해 대상 수를 확인하는 것은 좋은 습관이다.',
      answer: true,
      explanation: '맞아요. SQL에서 "DELETE 전에 같은 WHERE로 SELECT"와 같은 습관이에요. 결과의 deletedCount도 확인해 예상과 같은지 검증해요.',
    },
    {
      id: 'nq-03-12', type: 'mcq', source: '정렬 · 개수 · 일부만 · 배열 검색',
      question: '주문 문서의 items 배열 안에서 "name이 펜이면서 qty가 2 이상인 같은 원소"가 있는 주문을 찾으려면?',
      choices: [
        "{ 'items.name': '펜', 'items.qty': { $gte: 2 } }",
        "{ items: { name: '펜', qty: 2 } }",
        "{ items: { $elemMatch: { name: '펜', qty: { $gte: 2 } } } }",
        "{ items: { $all: ['펜', 2] } }",
      ],
      answer: 2,
      choiceExplanations: [
        '두 조건이 서로 다른 원소에서 각각 만족돼도 일치해요(펜 1개 + 다른 상품 5개인 주문도 걸려요).',
        '원소 전체가 정확히 그 객체와 같아야 해서 다른 필드가 있으면 안 걸려요.',
        '정답. $elemMatch는 모든 조건을 "같은 원소 하나"가 만족해야 해요.',
        '값 목록 검색이라 객체 배열에는 맞지 않아요.',
      ],
      explanation: '객체 배열 + 여러 조건 = $elemMatch. 이걸 놓치면 "조건이 서로 다른 원소에 흩어진" 문서까지 걸리는 버그가 생겨요.',
    },
  ],
}

export default topic
