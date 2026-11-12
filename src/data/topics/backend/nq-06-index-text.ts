import type { Topic } from '../../types'

const topic: Topic = {
  id: 'nq-06-index-text',
  track: 'backend',
  group: 'MongoDB',
  title: 'MongoDB 인덱스와 텍스트 검색',
  order: 86,
  sections: [
    {
      title: '인덱스의 필요성과 종류',
      notionIds: ['3efdf951bf80814fac73d2b96a1671eb'],
      slides: [
        {
          title: 'COLLSCAN과 IXSCAN',
          blocks: [
            { type: 'say', text: 'MongoDB도 인덱스 원리는 dbd-10과 같아요. 인덱스가 없으면 조건에 맞는 문서를 찾으려고 컬렉션 **전체를 훑어요**(**COLLSCAN**). 인덱스가 있으면 정렬된 B-tree에서 **바로** 찾아요(**IXSCAN**). `_id`에는 자동으로 고유 인덱스가 있어요.' },
            { type: 'code', code: `db.members.createIndex({ email: 1 }, { unique: true })   // 단일 + 고유
db.members.createIndex({ city: 1, age: -1 })             // 복합
db.members.getIndexes()                                  // 목록
db.members.dropIndex("city_1_age_-1")` },
          ],
        },
        {
          title: '인덱스 종류',
          blocks: [
            {
              type: 'table',
              head: ['종류', '특징'],
              rows: [
                ['**단일 필드**', '`{ email: 1 }`. 1 오름차순, -1 내림차순 (단일 필드에선 방향이 크게 중요하지 않음)'],
                ['**복합**', '`{ city: 1, age: -1 }`. **필드 순서가 중요** — city 조건엔 쓰이지만 **age만** 조건이면 안 쓰여요 (왼쪽 접두어 규칙, dbd-10)'],
                ['**멀티키**', '**배열** 필드에 걸면 원소마다 항목 생성 → `{ tags: "python" }` 검색이 빨라짐'],
                ['고유 / TTL / 텍스트', '`{ unique: true }`, 시간 지나면 삭제(nq-01), 다음 개념'],
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'explain으로 확인하기',
      notionIds: ['3efdf951bf80814fac73d2b96a1671eb'],
      slides: [
        {
          title: '읽은 수 vs 돌려준 수',
          blocks: [
            { type: 'code', code: `db.members.find({ city: "서울" }).explain("executionStats")
// winningPlan.stage: "COLLSCAN"
// totalDocsExamined: 1000000     ← 읽은 문서 수
// nReturned: 12                  ← 돌려준 수` },
            { type: 'say', text: 'dbd-11의 EXPLAIN처럼 실행 계획을 봐요. stage가 **COLLSCAN**이면 전체 스캔, **IXSCAN**이면 인덱스 사용. 그리고 **`totalDocsExamined`와 `nReturned`가 비슷할수록** 효율적이에요.\n\n위 예시는 12개를 찾으려고 **100만 개를 읽었어요.** city 필드에 인덱스를 만들어야 한다는 신호예요.' },
            { type: 'note', tone: 'warn', text: '인덱스엔 **비용**이 있어요. 디스크·메모리를 쓰고, 문서를 넣고 바꾸고 지울 때마다 인덱스도 갱신돼서 **쓰기가 느려져요.** "모든 필드에 인덱스"는 틀려요. 실제로 **자주 쓰는 조회**에만 만들어요.' },
          ],
        },
      ],
    },
    {
      title: '텍스트 인덱스와 $text',
      notionIds: ['3efdf951bf80814fac73d2b96a1671eb'],
      slides: [
        {
          title: '단어 단위 검색과 관련도',
          blocks: [
            { type: 'code', code: `db.posts.createIndex({ title: "text", content: "text" }, { weights: { title: 10, content: 1 } })

db.posts.find(
  { $text: { $search: "fastapi 비동기" } },
  { title: 1, score: { $meta: "textScore" } }
).sort({ score: { $meta: "textScore" } })` },
            { type: 'list', items: ['텍스트 인덱스는 **컬렉션당 하나**, 대신 여러 필드를 포함할 수 있어요', '`$search`는 **단어 단위**: 공백으로 나눈 단어 중 **하나라도** 포함. 정확한 구문은 큰따옴표, `-단어`는 제외', '**`textScore`** 를 projection과 sort에 써서 **관련도 높은 순**으로', '**`weights`** 로 제목 일치를 본문보다 10배 중요하게'] },
          ],
        },
        {
          title: '한국어의 한계',
          blocks: [
            { type: 'note', tone: 'warn', text: '기본 텍스트 인덱스는 영어 같은 언어의 형태소(어간) 처리를 하지만 **한국어 형태소 분석은 지원하지 않아요.** 띄어쓰기 단위로만 잘려서, "**검색엔진을**"로 저장된 글이 "**검색엔진**" 검색에 안 걸릴 수 있어요. 조사가 붙어 다른 단어로 보거든요.' },
            { type: 'say', text: '본격적인 한국어 검색은 **Atlas Search**(루씬 기반)나 **Elasticsearch**(노리 분석기) 같은 검색 엔진을 써요. sa-05에서 "글 100만 개의 본격 검색은 검색 엔진"이라고 한 것과 같은 결론이에요.' },
          ],
        },
      ],
    },
    {
      title: '$regex vs $text, 그리고 크롤링 데이터',
      notionIds: ['3efdf951bf80811ba911d0f8fdfee971'],
      slides: [
        {
          title: '두 검색 비교',
          blocks: [
            {
              type: 'table',
              head: ['', '$regex', '$text'],
              rows: [
                ['찾는 것', '**부분 문자열 어디든** (글자 일부)', '**단어 단위**'],
                ['속도', '앞부분 고정(`^`)이 아니면 인덱스를 못 써 **느림**', '텍스트 인덱스로 **빠름**'],
                ['관련도 점수', '없음', '**있음**'],
              ],
            },
          ],
        },
        {
          title: '크롤링 데이터는 URL로 upsert',
          blocks: [
            { type: 'code', code: `# pymongo: URL 기준 중복 없이 저장
col.create_index("url", unique=True)
col.update_one({"url": item["url"]}, {"$set": item}, upsert=True)` },
            { type: 'say', text: '크롤링 데이터를 MongoDB에 저장하면 MySQL과 달리 테이블을 **미리 만들 필요가 없고**(컬렉션 자동 생성), 페이지마다 필드가 달라도 그대로 넣을 수 있어요.\n\n대신 매일 같은 상품을 크롤링하면 **중복**이 쌓여요. 원본 **URL에 unique 인덱스**를 걸고 **upsert**로 저장하면, 없으면 새로 만들고 있으면 최신 정보로 갱신해요(nq-03).' },
            { type: 'note', tone: 'tip', text: '**수집 → 저장(insert/upsert) → 인덱스 → 분석(aggregate)**. 이게 문서 DB의 기본 데이터 파이프라인이에요. 저장 전 **클렌징**(dbd-13)도 잊지 말고요.' },
          ],
        },
      ],
    },
  ],
  questions: [
    {
      id: 'nq-06-01', type: 'mcq', source: '인덱스의 필요성과 종류',
      question: '인덱스가 없는 필드로 find를 하면 MongoDB는 어떻게 문서를 찾을까?',
      choices: ['_id 인덱스로 바로 찾는다', '에러가 난다', '자동으로 인덱스를 만든다', '컬렉션의 모든 문서를 훑는다(COLLSCAN)'],
      answer: 3,
      choiceExplanations: [
        '_id 인덱스는 _id 조건에만 쓰여요.',
        '느릴 뿐 동작해요.',
        '자동 생성하지 않아요(일부 클라우드는 추천만 해 줘요).',
        '정답. 문서가 많을수록 느려져요.',
      ],
      explanation: '인덱스는 "책 뒤의 찾아보기"예요. 없으면 첫 장부터 끝까지 넘겨야 해요. 자주 쓰는 조회 조건·정렬 기준에 인덱스를 두는 게 성능의 출발점이에요(RDB도 같아요).',
    },
    {
      id: 'nq-06-02', type: 'mcq', source: '인덱스의 필요성과 종류',
      question: '복합 인덱스 { city: 1, age: -1 } 가 활용되기 어려운 조회는?',
      choices: ['find({ city: "서울" })', 'find({ city: "서울", age: { $gt: 20 } })', 'find({ age: { $gt: 20 } })', 'find({ city: "서울" }).sort({ age: -1 })'],
      answer: 2,
      choiceExplanations: [
        '첫 번째 필드(city)만 써도 인덱스를 쓸 수 있어요.',
        '두 필드를 모두 써서 가장 효율적이에요.',
        '정답. 첫 번째 필드(city) 없이 두 번째 필드만으로는 인덱스 순서를 탈 수 없어요.',
        'city로 범위를 좁힌 뒤 age 순서가 이미 정렬돼 있어 정렬까지 인덱스로 처리돼요.',
      ],
      explanation: '왼쪽 접두어 규칙: 복합 인덱스 (A, B, C)는 A / A,B / A,B,C 조건에 쓰여요. 전화번호부가 (성, 이름) 순서라 "이름만"으로는 찾기 어려운 것과 같아요. RDB의 복합 인덱스도 똑같아요(DB 성능 토픽).',
    },
    {
      id: 'nq-06-03', type: 'short', source: '인덱스의 필요성과 종류',
      question: 'email 필드에 중복을 막는 인덱스를 만드는 옵션은? createIndex({ email: 1 }, { ______: true })',
      answer: ['unique'],
      explanation: '{ unique: true }예요. 스키마가 없는 MongoDB에서도 "같은 이메일 두 번 가입 금지"를 DB가 보장해요. 중복 삽입 시 E11000 duplicate key 에러가 나니, 앱에서 잡아 409로 바꿔요.',
    },
    {
      id: 'nq-06-04', type: 'mcq', source: 'explain으로 확인하기',
      question: 'explain("executionStats") 결과가 stage: "COLLSCAN", totalDocsExamined: 1000000, nReturned: 12 였다. 해석과 대응은?',
      choices: ['12개를 찾으려고 100만 개를 읽었다. 조회 조건 필드에 인덱스를 만든다', '아주 효율적이다', '문서가 12개뿐이다', '인덱스가 너무 많다'],
      answer: 0,
      choiceExplanations: [
        '정답. 인덱스를 만든 뒤 다시 explain해서 IXSCAN과 읽은 문서 수 감소를 확인해요.',
        '읽은 수와 돌려준 수의 차이가 매우 커요.',
        '돌려준 게 12개예요.',
        '오히려 인덱스가 없어요.',
      ],
      explanation: '실행 계획 읽기의 핵심 지표: 어떤 스캔을 했나(COLLSCAN/IXSCAN), 얼마나 읽었나(docsExamined), 얼마나 돌려줬나(nReturned). 이상적으로는 읽은 수 ≈ 돌려준 수예요. SQL의 EXPLAIN도 같은 관점으로 봐요.',
    },
    {
      id: 'nq-06-05', type: 'ox', source: 'explain으로 확인하기',
      question: '인덱스는 많을수록 좋으므로 모든 필드에 인덱스를 만드는 것이 바람직하다.',
      answer: false,
      explanation: '인덱스는 저장 공간과 메모리를 쓰고, 쓰기(삽입·수정·삭제)마다 함께 갱신돼서 쓰기가 느려져요. 실제 조회 패턴을 보고 필요한 것만 만들고, 쓰이지 않는 인덱스는 지워요($indexStats로 사용량 확인).',
    },
    {
      id: 'nq-06-06', type: 'mcq', source: '텍스트 인덱스와 $text',
      question: '텍스트 인덱스를 만든 뒤 "fastapi"가 들어간 글을 관련도 높은 순으로 찾는 코드는?',
      choices: [
        'find({ title: /fastapi/ }).sort({ title: 1 })',
        "find({ $search: 'fastapi' })",
        "find({ $text: { $search: 'fastapi' } }, { score: { $meta: 'textScore' } }).sort({ score: { $meta: 'textScore' } })",
        "aggregate([{ $text: 'fastapi' }])",
      ],
      answer: 2,
      choiceExplanations: [
        '정규식 검색이고, 관련도 점수가 없어요.',
        '$search는 $text 안에 들어가야 해요.',
        '정답. $text로 검색하고 textScore 메타 점수로 정렬해요.',
        '파이프라인에서는 { $match: { $text: { $search: ... } } }처럼 $match 안에, 그것도 첫 스테이지에 써야 해요.',
      ],
      explanation: '$text는 컬렉션의 텍스트 인덱스를 써요(인덱스가 없으면 에러). 검색어 문법: 공백 = OR, 큰따옴표로 감싼 구문 = 정확한 구문, -단어 = 제외.',
    },
    {
      id: 'nq-06-07', type: 'mcq', source: '텍스트 인덱스와 $text',
      question: '제목에서 일치하는 글이 본문에서 일치하는 글보다 위에 오게 하려면?',
      choices: ['제목 필드에만 텍스트 인덱스를 만든다', '텍스트 인덱스를 만들 때 weights: { title: 10, content: 1 }을 준다', '$regex를 쓴다', 'sort({ title: -1 })'],
      answer: 1,
      choiceExplanations: [
        '본문 검색이 아예 안 돼요.',
        '정답. 필드별 가중치가 textScore 계산에 반영돼요.',
        '관련도 점수가 없어요.',
        '제목 가나다순일 뿐 관련도와 무관해요.',
      ],
      explanation: '검색 품질은 "무엇을 더 중요하게 볼지"에서 갈려요. 가중치는 텍스트 인덱스에 하나만 둘 수 있어서, 바꾸려면 인덱스를 다시 만들어야 해요.',
    },
    {
      id: 'nq-06-08', type: 'ox', source: '텍스트 인덱스와 $text',
      question: 'MongoDB 기본 텍스트 인덱스는 한국어 형태소 분석을 지원해서 "검색엔진을"로 저장된 글이 "검색엔진" 검색에 항상 잘 걸린다.',
      answer: false,
      explanation: '기본 텍스트 인덱스는 한국어 형태소 분석을 지원하지 않아 띄어쓰기 단위로 잘라요. 조사가 붙은 단어는 다른 단어로 취급될 수 있어요. 한국어 검색이 중요하면 Atlas Search(Lucene 분석기), Elasticsearch(nori), 또는 n-gram 방식 같은 별도 검색 솔루션을 써요.',
    },
    {
      id: 'nq-06-09', type: 'mcq', source: '$regex vs $text, 그리고 크롤링 데이터',
      question: '$regex 검색과 $text 검색을 비교한 설명으로 맞는 것은?',
      choices: ['$regex는 항상 인덱스를 써서 빠르다', '$text는 인덱스가 필요 없다', '둘은 완전히 같다', '$text는 텍스트 인덱스로 빠르고 관련도 점수가 있지만 단어 단위라 글자 일부 검색은 안 된다'],
      answer: 3,
      choiceExplanations: [
        '^로 시작하는 접두어 패턴 정도만 인덱스를 잘 써요. 중간 포함 검색은 전체를 훑어요.',
        '텍스트 인덱스가 반드시 있어야 해요.',
        '동작 방식과 결과가 달라요.',
        '정답. 유연성(regex) vs 속도·관련도(text)의 트레이드오프예요.',
      ],
      explanation: '노션 크롤링 노트의 "$regex vs $text" 정리 그대로예요. 데이터가 작으면 $regex로 충분하고, 커지면 텍스트 인덱스나 검색 엔진으로 옮겨 가요.',
    },
    {
      id: 'nq-06-10', type: 'mcq', source: '$regex vs $text, 그리고 크롤링 데이터',
      question: '매일 같은 상품 페이지를 크롤링한다. 같은 상품이 중복 저장되지 않으면서 정보는 최신으로 갱신되게 하려면?',
      choices: ['매일 insert_many로 새로 넣는다', 'url에 unique 인덱스를 두고 update_one({"url": url}, {"$set": item}, upsert=True)', '컬렉션을 매일 drop하고 다시 넣는다', 'find 후 없으면 insert, 있으면 무시'],
      answer: 1,
      choiceExplanations: [
        '같은 상품이 날마다 쌓여요.',
        '정답. 있으면 갱신, 없으면 생성을 원자적으로 하고, unique 인덱스가 중복을 막아 줘요.',
        '그사이 조회가 비고, 과거 데이터·인덱스도 날아가요.',
        '정보가 갱신되지 않고, 동시에 실행되면 중복이 생길 수 있어요.',
      ],
      explanation: '수집 데이터에는 "자연 키"(원본 URL, 상품 코드)가 있는 경우가 많아요. 그걸 unique 인덱스로 잡고 upsert하면 재실행해도 안전한(멱등) 파이프라인이 돼요.',
    },
    {
      id: 'nq-06-11', type: 'short', source: '인덱스의 필요성과 종류',
      question: '컬렉션에 어떤 인덱스가 있는지 목록을 보는 셸 메서드는? db.members.__________()',
      answer: ['getIndexes', 'getIndexes()', 'list_indexes', 'index_information'],
      explanation: 'getIndexes()예요(pymongo: list_indexes() 또는 index_information()). 인덱스 이름은 기본적으로 "필드_방향" 형식(city_1_age_-1)이라 dropIndex에 이 이름을 써요.',
    },
    {
      id: 'nq-06-12', type: 'ox', source: '인덱스의 필요성과 종류',
      question: 'tags 같은 배열 필드에 인덱스를 만들면, 배열의 각 원소마다 인덱스 항목이 생겨 { tags: "python" } 검색이 빨라진다.',
      answer: true,
      explanation: '맞아요. 멀티키 인덱스라고 해요. 대신 배열이 길면 인덱스 항목이 많아지고, 복합 인덱스에 배열 필드를 두 개 이상 넣을 수는 없어요.',
    },
  ],
}

export default topic
