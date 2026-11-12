import type { Topic } from '../../types'

const topic: Topic = {
  id: 'nq-02-crud-find',
  track: 'backend',
  group: 'MongoDB',
  title: 'MongoDB CRUD ①: 삽입과 조회 연산자',
  order: 82,
  sections: [
    {
      title: '삽입',
      notionIds: ['3efdf951bf80818c81ecdeb74d4faaca'],
      slides: [
        {
          title: 'insertOne, insertMany',
          blocks: [
            { type: 'code', code: `db.members.insertMany([
  { name: "김민준", age: 28, city: "서울" },
  { name: "이서연", age: 34, city: "부산" },
  { name: "박지훈", age: 22 }                  // city 없음 (스키마가 없으니 OK)
])` },
            { type: 'say', text: '`insertOne({...})`은 하나, **`insertMany([...])`** 는 여러 개. 결과로 생성된 `_id`(들)를 돌려줘요. 스키마가 없어서 같은 컬렉션에 **필드가 다른** 문서를 넣을 수 있어요.\n\n`insertMany`는 기본이 **순서대로(ordered)** 넣다가 에러가 나면 **멈춰요.** 1만 개 중 500번째가 중복 `_id`로 실패하면 **앞의 499개는 들어가고** 501번째부터는 안 들어가요. `{ ordered: false }`면 실패한 것만 건너뛰고 계속해요.' },
            { type: 'note', tone: 'tip', text: 'sa-03의 "하나의 commit으로 1,000개 넣다 실패하면 전부 롤백"과 비교해 보세요. MongoDB의 insertMany는 **트랜잭션이 아니라서** 앞부분은 이미 들어가 있어요.' },
          ],
        },
      ],
    },
    {
      title: 'find와 projection',
      notionIds: ['3efdf951bf80818c81ecdeb74d4faaca'],
      slides: [
        {
          title: 'find(조건, 보여줄 필드)',
          blocks: [
            {
              type: 'table',
              head: ['MongoDB', 'SQL'],
              rows: [
                ['`find()`', '`SELECT *`'],
                ['`find({}, { name: 1, city: 1, _id: 0 })`', '`SELECT name, city`'],
                ['`find({ city: "서울" })`', '`WHERE city = \'서울\'`'],
                ['`findOne(...)`', '첫 문서 하나'],
              ],
            },
            { type: 'say', text: '두 번째 인자 **projection**: `1`은 포함, `0`은 제외. **`_id`는 기본으로 포함**되니 빼려면 `_id: 0`. 포함과 제외를 **섞을 수 없어요**(`_id`만 예외).' },
          ],
        },
        {
          title: '점 표기와 커서',
          blocks: [
            { type: 'code', code: `db.users.find({ "address.city": "Seoul" })     // 임베디드 필드 — 따옴표 필수` },
            { type: 'say', text: '임베디드 문서 안의 필드는 **점 표기**로 찾아요. 키에 점이 들어가니 **따옴표가 필요**해요.\n\n`find()`는 결과 전체가 아니라 **커서(cursor)** 를 돌려줘요. 반복하면서 **일정 개수씩** 서버에서 가져와요. 결과가 백만 개여도 한꺼번에 메모리에 올리지 않아요. sa-04의 "scalars().all()은 전부 메모리에"와 대조돼요.' },
          ],
        },
      ],
    },
    {
      title: '비교 연산자',
      notionIds: ['3efdf951bf80818c81ecdeb74d4faaca'],
      slides: [
        {
          title: '$로 시작하는 연산자',
          blocks: [
            {
              type: 'table',
              head: ['연산자', '뜻', 'SQL'],
              rows: [
                ['`$eq` / `$ne`', '같음 / 다름', '`=` / `<>`'],
                ['`$gt` / `$gte`', '초과 / 이상', '`>` / `>=`'],
                ['`$lt` / `$lte`', '미만 / 이하', '`<` / `<=`'],
                ['`$in` / `$nin`', '목록 중 하나 / 어느 것도 아님', '`IN` / `NOT IN`'],
              ],
            },
            { type: 'code', code: `db.members.find({ age: { $gte: 20, $lt: 30 } })          // 20 이상 30 미만
db.members.find({ city: { $in: ["서울", "부산"] } })
db.members.find({ age: 30 })                              // = { age: { $eq: 30 } }` },
            { type: 'say', text: 'FastAPI의 `Path(ge=1)`에서 본 **gt, ge, lt, le**와 같은 이름이에요(fa-03). 앞에 `$`만 붙었어요.' },
          ],
        },
        {
          title: '$ne의 함정',
          blocks: [
            { type: 'note', tone: 'warn', text: '`$ne`와 `$nin`은 그 필드가 **아예 없는 문서도** 결과에 포함해요. `{ city: { $ne: "서울" } }`을 하면 부산의 이서연뿐 아니라 **city가 없는 박지훈**도 나와요. "서울이 아닌 곳에 산다"가 아니라 "city가 서울이 **아니다**(없는 것도 서울은 아니니까)"로 동작해요. SQL에선 NULL이 `<>`에 안 걸리는 것과 반대라 헷갈리기 쉬워요.' },
          ],
        },
      ],
    },
    {
      title: '논리 연산자와 존재 확인',
      notionIds: ['3efdf951bf80818c81ecdeb74d4faaca'],
      slides: [
        {
          title: 'AND는 기본, OR는 $or',
          blocks: [
            { type: 'code', code: `// AND: 같은 객체 안에 여러 조건
db.members.find({ city: "서울", age: { $lt: 30 } })

// OR: 서울 사는 30세 미만 또는 부산 사는 사람
db.members.find({
  $or: [
    { city: "서울", age: { $lt: 30 } },
    { city: "부산" }
  ]
})` },
            { type: 'say', text: '같은 객체 안에 조건을 여러 개 쓰면 기본이 **AND**라서 `$and`는 대부분 생략해요. `$and`가 꼭 필요한 건\n• 같은 필드에 같은 연산자를 **두 번** 써야 할 때 (객체 키가 겹치니까)\n• **`$or` 두 개**를 AND로 묶을 때\n\n그 밖에 `$nor`(모두 아님), `$not`(연산자 결과 뒤집기)이 있어요.' },
          ],
        },
        {
          title: '$exists와 $not의 함정',
          blocks: [
            { type: 'code', code: `db.members.find({ city: { $exists: true } })        // city 필드가 "있는" 문서
db.members.find({ age: { $not: { $gt: 30 } } })     // 30 넘지 않는 + age 없는 문서도!` },
            { type: 'say', text: '`$exists: true`는 필드가 **있는** 문서예요. 값이 `null`인 필드도 "존재"로 봐요. null과 "필드 없음"을 구분하려면 `$exists`와 `$type`을 함께 써요.\n\n`$not`도 `$ne`처럼 **필드가 없는 문서를 포함**해요. "age가 30을 넘는다"가 거짓인 문서 = 30 이하 **+ age가 없는 문서**. 필드 없는 문서를 빼려면 `$exists: true`를 같이 걸어요.' },
          ],
        },
      ],
    },
  ],
  questions: [
    {
      id: 'nq-02-01', type: 'mcq', source: '삽입',
      question: '문서 여러 개를 한 번에 넣는 MongoDB 셸 메서드는?',
      choices: ['insert()', 'insertOne([...])', 'addAll([...])', 'insertMany([...])'],
      answer: 3,
      choiceExplanations: [
        '예전 메서드로 사용 중단됐어요.',
        'insertOne은 문서 하나만 받아요.',
        '그런 메서드는 없어요.',
        '정답. 배열로 여러 문서를 받아요.',
      ],
      explanation: '최신 API 이름 규칙: insertOne/insertMany, find/findOne, updateOne/updateMany, deleteOne/deleteMany, countDocuments. 파이썬(pymongo)은 같은 이름을 snake_case로 써요(insert_many, find_one...).',
    },
    {
      id: 'nq-02-02', type: 'mcq', source: 'find와 projection',
      question: 'SELECT name, age FROM members (단, _id 없이) 와 같은 MongoDB 조회는?',
      choices: [
        'db.members.find({ name: 1, age: 1 })',
        'db.members.find({}, { name: 1, age: 1 })',
        'db.members.find({}, { name: 1, age: 1, _id: 0 })',
        'db.members.find({}, { name: 1, age: 0 })',
      ],
      answer: 2,
      choiceExplanations: [
        '첫 번째 인자는 조건이라 "name이 1이고 age가 1인 문서"를 찾아요.',
        '_id가 기본으로 포함돼요.',
        '정답. 조건은 비워 두고(전체), projection으로 name, age만 포함하고 _id는 제외.',
        '포함(1)과 제외(0)를 섞을 수 없어서 에러가 나요(_id만 예외).',
      ],
      explanation: 'find(조건, projection) 두 인자의 역할을 헷갈리지 마세요. SQL로 치면 첫 번째가 WHERE, 두 번째가 SELECT 컬럼 목록이에요.',
    },
    {
      id: 'nq-02-03', type: 'short', source: 'find와 projection',
      question: 'projection에서 기본으로 포함되는 필드를 빼려면 { ___: 0 } 을 넣는다. 그 필드 이름은?',
      answer: ['_id'],
      explanation: '_id예요. projection의 유일한 예외라 { name: 1, _id: 0 }처럼 포함과 제외를 섞어 쓸 수 있어요.',
    },
    {
      id: 'nq-02-04', type: 'mcq', source: 'find와 projection',
      question: 'users 문서에 address: { city: "Seoul" } 이 있다. 서울에 사는 사용자를 찾는 조건은?',
      choices: ['{ "address.city": "Seoul" }', '{ city: "Seoul" }', '{ address: "Seoul" }', '{ address: { city: "Seoul", zip: null } }'],
      answer: 0,
      choiceExplanations: [
        '정답. 점 표기로 임베디드 문서 안의 필드를 조회해요. 따옴표가 필요해요.',
        '최상위 city 필드를 찾아요. 없으니 결과가 비어요.',
        'address 전체가 문자열 "Seoul"인 문서를 찾아요.',
        '임베디드 문서 전체를 비교하면 필드 구성과 순서까지 정확히 같아야 해서, zip이 있는 문서가 빠지는 등 의도와 달라져요.',
      ],
      explanation: '임베디드 문서 조회는 거의 항상 점 표기("a.b")를 써요. 문서 전체 일치 비교는 순서까지 같아야 해서 잘 쓰지 않아요.',
    },
    {
      id: 'nq-02-05', type: 'mcq', source: '비교 연산자',
      question: '나이가 20 이상 30 미만인 회원을 찾는 조건은?',
      choices: [
        '{ age: { $gt: 20, $lte: 30 } }',
        '{ age: 20, age: 30 }',
        '{ age: { $in: [20, 30] } }',
        '{ age: { $gte: 20, $lt: 30 } }',
      ],
      answer: 3,
      choiceExplanations: [
        '20 초과 30 이하라서 경계가 반대예요.',
        '객체 키가 겹쳐 뒤의 age: 30만 남아요.',
        '20 또는 30인 사람만 찾아요.',
        '정답. 같은 필드의 연산자 객체 안에 여러 조건을 넣으면 AND예요.',
      ],
      explanation: 'gt/gte/lt/lte는 Pydantic Field·FastAPI Query와 이름이 같아요. "e가 붙으면 같음 포함"이라고 기억하면 돼요.',
    },
    {
      id: 'nq-02-06', type: 'short', source: '비교 연산자',
      question: '"city가 서울 또는 부산"인 문서를 찾는 조건의 빈칸 연산자는? { city: { ___: ["서울", "부산"] } }',
      answer: ['$in', 'in'],
      explanation: '$in이에요. SQL의 IN과 같아요. 반대는 $nin(어느 것과도 같지 않음). 필드가 배열이면 "배열 원소 중 하나라도 목록에 있으면" 일치해요.',
    },
    {
      id: 'nq-02-07', type: 'mcq', source: '비교 연산자',
      question: '회원 3명 중 박지훈은 city 필드가 없다. db.members.find({ city: { $ne: "서울" } }) 의 결과는?',
      choices: ['이서연(부산)만', '이서연(부산)과 박지훈(city 없음)', '아무도 없음', '김민준(서울)만'],
      answer: 1,
      choiceExplanations: [
        '$ne는 필드가 없는 문서도 포함해요.',
        '정답. "city가 서울이 아니다"에는 "city가 없다"도 포함돼요.',
        '부산 회원은 분명히 해당돼요.',
        '반대 조건이에요.',
      ],
      explanation: '$ne, $nin, $not은 필드가 없는 문서까지 결과에 넣어요. 필드가 있는 것만 원하면 { city: { $exists: true, $ne: "서울" } }처럼 함께 써요. SQL에서 city <> \'서울\'이 NULL 행을 빼는 것과 반대라 주의하세요.',
    },
    {
      id: 'nq-02-08', type: 'mcq', source: '논리 연산자와 존재 확인',
      question: '{ city: "서울", age: { $lt: 30 } } 의 의미는?',
      choices: ['서울이면서 30세 미만', '서울이거나 30세 미만', '에러: $and가 필요하다', '서울이 아니면서 30세 미만'],
      answer: 0,
      choiceExplanations: [
        '정답. 한 객체에 조건을 나열하면 기본이 AND예요.',
        'OR가 되려면 $or가 필요해요.',
        '$and는 생략할 수 있어요.',
        '부정 조건이 없어요.',
      ],
      explanation: '$and가 꼭 필요한 경우는 같은 키를 두 번 써야 할 때예요. 예: { $and: [ { $or: [A, B] }, { $or: [C, D] } ] } — 객체에 $or 키를 두 번 쓸 수 없으니까요.',
    },
    {
      id: 'nq-02-09', type: 'short', source: '논리 연산자와 존재 확인',
      question: 'city 필드가 "있는" 문서만 찾는 조건의 빈칸은? { city: { _______: true } }',
      answer: ['$exists', 'exists'],
      explanation: '$exists예요. 스키마가 없는 컬렉션에서는 "필드가 없는 문서"가 흔해서 자주 써요. 주의: city: null로 저장된 문서도 $exists: true예요. null까지 빼려면 { city: { $exists: true, $ne: null } }.',
    },
    {
      id: 'nq-02-10', type: 'ox', source: 'find와 projection',
      question: 'find()는 조건에 맞는 모든 문서를 한 번에 메모리에 올려 배열로 돌려준다.',
      answer: false,
      explanation: 'find()는 커서를 돌려줘요. 반복할 때 서버에서 일정 개수(batch)씩 가져와요. 그래서 큰 결과도 조금씩 처리할 수 있어요. 셸에서는 처음 20개만 보여 주고 it으로 더 볼 수 있어요. pymongo에서 list(cursor)를 하면 그때 전부 메모리에 올라가요.',
    },
    {
      id: 'nq-02-11', type: 'mcq', source: '삽입',
      question: '상품 1만 개를 insertMany로 넣다가 500번째 문서가 중복 _id로 실패했다. 기본(ordered) 동작은?',
      choices: ['전부 롤백된다', '500번째만 건너뛰고 나머지를 모두 저장한다', '앞의 499개는 저장되고, 500번째에서 멈춘다(뒤의 문서는 저장되지 않음)', '아무 일도 없다'],
      answer: 2,
      choiceExplanations: [
        '트랜잭션을 쓰지 않으면 이미 넣은 문서는 남아요.',
        '그건 { ordered: false } 옵션일 때예요.',
        '정답. 순서대로 넣다가 첫 에러에서 멈춰요.',
        '앞의 문서들은 저장됐어요.',
      ],
      explanation: '크롤링 데이터처럼 "중복은 건너뛰고 나머지는 넣고 싶다"면 ordered: false(pymongo: ordered=False)를 쓰고, 에러 목록을 확인해요. "전부 아니면 전무"가 필요하면 멀티 문서 트랜잭션(레플리카 셋 필요)을 써요.',
    },
    {
      id: 'nq-02-12', type: 'mcq', source: '논리 연산자와 존재 확인',
      question: '30세를 "넘지 않는" 회원을 { age: { $not: { $gt: 30 } } } 으로 찾았더니 age 필드가 없는 회원도 나왔다. 이유는?',
      choices: ['버그다', '$gt가 잘못돼서', 'projection 때문', '$not은 조건을 만족하지 않는 모든 문서를 고르는데, 필드가 없는 문서도 "30 초과가 아님"에 해당하기 때문'],
      answer: 3,
      choiceExplanations: [
        '문서에 정의된 동작이에요.',
        '연산자는 정상이에요.',
        '조건과 무관해요.',
        '정답. 나이를 아는 사람만 원하면 { age: { $lte: 30 } }를 쓰세요(필드가 없는 문서는 제외돼요).',
      ],
      explanation: '노션 정리 "{ $not: { $eq: X } } = { $ne: X } (필드 없는 문서도 포함)"와 같은 원리예요. 부정 조건은 "없는 것"까지 포함한다는 점을 항상 기억하세요.',
    },
  ],
}

export default topic
