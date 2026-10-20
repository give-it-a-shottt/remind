import type { Topic } from '../../types'

const topic: Topic = {
  id: 'nq-01-nosql',
  track: 'backend',
  group: 'MongoDB',
  title: 'NoSQL과 MongoDB 문서 모델',
  order: 81,
  sections: [
    {
      title: '다양한 데이터베이스와 NoSQL',
      notionIds: ['3efdf951bf808194831ef91ab5254c23', '3efdf951bf808154afacd2a64ca5c595'],
      points: [
        'NoSQL(Not only SQL)은 관계형 DB의 한계(고정 스키마, 수평 확장의 어려움)를 보완하려고 나온 저장소들의 총칭이다.',
        '종류: 문서형(MongoDB, JSON 같은 문서 저장), 키-값(Redis, DynamoDB, 아주 빠른 조회·캐시), 컬럼 패밀리(Cassandra, 대량 쓰기), 그래프(Neo4j, 관계 탐색).',
        'RDB가 잘 맞는 곳: 구조가 정해져 있고 정합성이 중요한 데이터(회원, 주문, 결제). 트랜잭션·JOIN·제약 조건이 강점이다.',
        'NoSQL(문서형)이 잘 맞는 곳: 형식이 자주 바뀌는 데이터(로그, 크롤링 결과, 이벤트), 문서 단위로 통째로 읽고 쓰는 데이터, 매우 많은 쓰기. 노션의 "블로그 접속 로그를 MongoDB에" 사례가 이 경우다.',
        '"둘 중 하나"가 아니라 함께 쓰는 경우가 많다(Polyglot Persistence): 주문은 PostgreSQL, 세션·캐시는 Redis, 로그는 MongoDB.',
      ],
    },
    {
      title: 'MongoDB의 구조',
      notionIds: ['3efdf951bf808194831ef91ab5254c23'],
      points: [
        'RDB: Database → Table → Row. MongoDB: Database → Collection → Document.',
        '문서(Document)는 JSON 같은 키-값 구조이고, 내부적으로 BSON(Binary JSON)으로 저장된다. BSON은 Date, ObjectId, 정수/실수 구분 등 JSON보다 많은 타입을 지원한다.',
        '모든 문서는 고유한 _id를 가진다. 넣지 않으면 ObjectId가 자동 생성된다. ObjectId 안에는 생성 시각(초 단위)이 들어 있어 대략적인 생성 순서로 정렬할 수 있다.',
        '컬렉션은 스키마가 고정돼 있지 않다. 같은 컬렉션의 문서끼리 필드가 달라도 된다. 하지만 앱 코드는 대부분 일정한 모양을 기대하므로, 스키마 검증($jsonSchema)이나 앱의 Pydantic 모델로 형식을 지키는 것이 좋다.',
      ],
      code: `// 한 문서 (users 컬렉션)
{
  "_id": ObjectId("6712f0c2a1b2c3d4e5f60718"),
  "name": "kim",
  "age": 28,
  "tags": ["python", "fastapi"],          // 배열
  "address": { "city": "Seoul" },        // 임베디드 문서
  "joined_at": ISODate("2026-10-20T00:00:00Z")
}`,
    },
    {
      title: '기본 명령과 데이터 타입',
      notionIds: ['3efdf951bf808194831ef91ab5254c23'],
      points: [
        'show dbs, use library(없으면 처음 데이터를 넣을 때 자동 생성), show collections, db.stats().',
        'db.createCollection("books"), db.books.renameCollection("novels"), db.books.drop(), db.dropDatabase().',
        '타입: String, Int32/Int64, Double, Decimal128(정확한 소수), Boolean, Null, Array, Object(임베디드 문서), ObjectId, Date.',
        'Capped Collection: 크기가 고정되고 가득 차면 가장 오래된 문서부터 자동 삭제된다. 최근 로그만 유지할 때 유용하다. createCollection("access_log", { capped: true, size: 바이트, max: 개수 }).',
        '오래된 문서를 시간 기준으로 자동 삭제하려면 TTL 인덱스(createIndex({ createdAt: 1 }, { expireAfterSeconds: 86400 }))를 쓴다.',
      ],
    },
    {
      title: '보안 설정',
      notionIds: ['3efdf951bf808194831ef91ab5254c23'],
      points: [
        '외부 접속을 열려면 bindIp를 바꾸고 27017 포트를 연다. 이때 반드시 계정을 만들고 security.authorization: enabled 를 켜야 한다. 인증 없이 열린 MongoDB가 랜섬웨어 공격을 대량으로 당한 사례가 많다.',
        '접속 문자열: mongodb://아이디:비밀번호@호스트:27017/?authSource=admin. 클라우드(MongoDB Atlas)는 mongodb+srv:// 형식을 쓰고 IP 허용 목록을 설정한다.',
        'GUI 도구: MongoDB Compass(공식), Studio 3T.',
      ],
    },
  ],
  questions: [
    {
      id: 'nq-01-01', type: 'mcq', source: '다양한 데이터베이스와 NoSQL',
      question: '다음 중 관계형 DB(RDB)를 고르는 것이 가장 자연스러운 데이터는?',
      choices: ['결제·주문·환불 내역', '사이트 접속 로그(형식이 자주 바뀜)', '크롤링한 상품 원본 데이터', '실시간 게임 순위 캐시'],
      answer: 0,
      choiceExplanations: [
        '정답. 돈이 오가는 데이터는 트랜잭션·제약 조건·정합성이 최우선이라 RDB가 맞아요.',
        '형식이 자주 바뀌고 일부 유실이 치명적이지 않아 문서형 DB나 로그 저장소가 잘 맞아요.',
        '사이트마다 구조가 달라 문서형이 편해요.',
        '빠른 읽기·쓰기가 핵심이라 Redis 같은 키-값 저장소가 맞아요(Sorted Set).',
      ],
      explanation: '노션 정리: "MySQL은 규격화되고 안정성이 중요한 데이터, NoSQL은 형식이 자주 바뀌고 일부 유실돼도 큰 문제 없는 데이터, Redis는 성능 향상용". 데이터의 성격을 먼저 보고 저장소를 골라요.',
    },
    {
      id: 'nq-01-02', type: 'ox', source: '다양한 데이터베이스와 NoSQL',
      question: 'NoSQL이 RDB보다 항상 빠르므로 새 프로젝트는 무조건 NoSQL로 시작하는 것이 좋다.',
      answer: false,
      explanation: '속도는 데이터 모델과 접근 패턴에 따라 달라요. 여러 엔티티를 자유롭게 조합해 조회하고 정합성이 중요한 서비스는 RDB가 더 단순하고 안전해요. NoSQL은 "문서 단위로 통째로 다루는 데이터, 형식이 자주 바뀌는 데이터, 매우 큰 쓰기량"에서 강점이 있어요.',
    },
    {
      id: 'nq-01-03', type: 'mcq', source: 'MongoDB의 구조',
      question: 'RDB의 Table과 Row에 대응하는 MongoDB 용어는?',
      choices: ['Schema / Field', 'Database / Collection', 'Collection / Document', 'Index / Cursor'],
      answer: 2,
      choiceExplanations: [
        'Field는 컬럼에 대응해요.',
        'Database는 같은 이름 그대로예요.',
        '정답. Database → Collection(테이블) → Document(행).',
        '인덱스와 조회 결과 반복자예요.',
      ],
      explanation: '대응표: Database = Database, Table = Collection, Row = Document, Column = Field, JOIN ≈ $lookup 또는 임베딩, PRIMARY KEY ≈ _id.',
    },
    {
      id: 'nq-01-04', type: 'short', source: 'MongoDB의 구조',
      question: 'MongoDB가 문서를 내부적으로 저장하는 이진 형식의 이름은?',
      answer: ['BSON', 'bson'],
      explanation: 'BSON(Binary JSON)이에요. JSON보다 빠르게 읽고 쓰고, Date·ObjectId·Int64·Decimal128 같은 타입을 구분해요.\n그래서 파이썬에서 꺼낸 문서를 FastAPI JSON으로 보낼 때 ObjectId·datetime 같은 값은 문자열로 바꿔야 해요(파이썬 연동 토픽).',
    },
    {
      id: 'nq-01-05', type: 'mcq', source: 'MongoDB의 구조',
      question: '문서를 넣을 때 _id를 지정하지 않으면?',
      choices: ['ObjectId가 자동 생성된다', '에러가 난다', '_id 없이 저장된다', '1부터 자동 증가하는 정수가 들어간다'],
      answer: 0,
      choiceExplanations: [
        '정답. ObjectId는 생성 시각 + 기계·프로세스 정보 + 카운터로 만들어져 여러 서버에서도 겹치지 않아요.',
        '에러 없이 저장돼요.',
        '모든 문서는 반드시 _id를 가져요.',
        'MongoDB에는 AUTO_INCREMENT가 기본으로 없어요.',
      ],
      explanation: 'ObjectId 앞 4바이트는 생성 시각(초)이라, _id로 정렬하면 대략 생성 순서가 돼요. ObjectId("...").getTimestamp()로 생성 시각을 꺼낼 수도 있어요.',
    },
    {
      id: 'nq-01-06', type: 'ox', source: 'MongoDB의 구조',
      question: 'MongoDB 컬렉션은 스키마가 없으므로, 앱에서도 문서 형식을 검증할 필요가 전혀 없다.',
      answer: false,
      explanation: '"DB가 강제하지 않는다"는 거지 "형식이 필요 없다"는 게 아니에요. 형식이 제각각 쌓이면 읽는 코드가 복잡해지고 버그가 생겨요. 앱에서 Pydantic 모델로 검증하거나, 컬렉션에 $jsonSchema 검증 규칙을 걸어 최소한의 형식을 지켜요.',
    },
    {
      id: 'nq-01-07', type: 'mcq', source: '기본 명령과 데이터 타입',
      question: 'use shop 을 실행했는데 show dbs 목록에 shop이 보이지 않는다. 이유는?',
      choices: ['use 명령이 실패해서', '권한이 없어서', '데이터가 하나도 없으면 DB가 실제로 만들어지지 않아서(첫 문서를 넣을 때 생성)', 'DB 이름이 예약어라서'],
      answer: 2,
      choiceExplanations: [
        'use는 "이 DB를 쓰겠다"는 선택일 뿐이에요.',
        '권한 문제라면 에러가 나요.',
        '정답. MongoDB는 DB와 컬렉션을 처음 데이터를 넣을 때 자동으로 만들어요.',
        '예약어가 아니에요.',
      ],
      explanation: '편리하지만, 이름을 오타 내면(use shpo) 새 DB에 데이터를 넣고 "데이터가 사라졌다"고 착각하기 쉬워요. 컬렉션도 마찬가지예요.',
    },
    {
      id: 'nq-01-08', type: 'mcq', source: '기본 명령과 데이터 타입',
      question: '최근 로그만 일정 용량 안에서 유지하고, 가득 차면 오래된 것부터 자동으로 지우고 싶다. 알맞은 기능은?',
      choices: ['dropDatabase', '일반 컬렉션에 매일 deleteMany', 'renameCollection', 'Capped Collection'],
      answer: 3,
      choiceExplanations: [
        'DB 전체를 지워요.',
        '가능하지만 직접 관리해야 해요.',
        '이름 변경일 뿐이에요.',
        '정답. 크기(size)와 개수(max)를 고정하고, 넘치면 오래된 문서부터 밀어내요.',
      ],
      explanation: '자동 정리 도구 두 가지:\n• Capped Collection: 용량 기준, 삽입 순서 유지, 개별 문서 삭제 불가\n• TTL 인덱스: 시간 기준(예: 30일 지나면 삭제), 일반 컬렉션에서 사용\n로그 보관 정책에 맞춰 골라요.',
    },
    {
      id: 'nq-01-09', type: 'short', source: '기본 명령과 데이터 타입',
      question: '날짜 필드를 기준으로 일정 시간이 지난 문서를 자동 삭제하는 MongoDB 인덱스의 약어는? (3글자)',
      answer: ['TTL', 'ttl'],
      explanation: 'TTL(Time To Live) 인덱스예요. db.sessions.createIndex({ createdAt: 1 }, { expireAfterSeconds: 3600 }) → 1시간 지난 세션 문서 자동 삭제. 세션·인증 코드·임시 데이터에 편해요.',
    },
    {
      id: 'nq-01-10', type: 'mcq', source: '보안 설정',
      question: '서버의 MongoDB를 외부에서 접속할 수 있게 bindIp를 0.0.0.0으로 바꿨다. 반드시 함께 해야 하는 일은?',
      choices: ['아무것도 안 해도 된다', '포트를 80으로 바꾼다', '관리자 계정을 만들고 security.authorization: enabled로 인증을 켠다(+ 방화벽으로 접속 IP 제한)', '컬렉션 이름을 숨긴다'],
      answer: 2,
      choiceExplanations: [
        '인증 없이 열린 MongoDB는 인터넷 스캐너에 바로 발견돼 데이터가 삭제·탈취돼요.',
        '포트 번호를 바꿔도 스캔으로 찾아요.',
        '정답. 인증 + 네트워크 제한이 최소한의 방어예요.',
        '보안 효과가 없어요.',
      ],
      explanation: '노션 노트의 경고 그대로예요: "반드시 계정을 만들고 authorization을 켜라, 안 하면 아무나 접속". 실제로 "데이터를 돌려받으려면 비트코인을 보내라"는 메시지만 남긴 공격이 수만 건 있었어요.',
    },
    {
      id: 'nq-01-11', type: 'mcq', source: '다양한 데이터베이스와 NoSQL',
      question: '로그인 세션과 자주 조회하는 상품 정보를 아주 빠르게 꺼내 쓰는 캐시 용도로 가장 알맞은 저장소는?',
      choices: ['MongoDB', 'Redis(키-값, 인메모리)', 'MySQL', 'Neo4j'],
      answer: 1,
      choiceExplanations: [
        '가능은 하지만 캐시 전용으로는 Redis가 더 빠르고 단순해요.',
        '정답. 메모리 기반 키-값 저장소라 응답이 매우 빠르고, 만료 시간(TTL)도 키마다 줄 수 있어요.',
        '원본 저장소로 쓰고, 캐시는 앞단에 둬요.',
        '그래프 관계 탐색용이에요.',
      ],
      explanation: '노션의 "Redis: 성능 향상용 in-memory DB"예요. 캐시 패턴: 요청 → Redis 확인 → 없으면 DB 조회 후 Redis에 저장(만료 시간 설정). 원본과 캐시가 어긋나는 문제(캐시 무효화)는 별도로 설계해야 해요.',
    },
    {
      id: 'nq-01-12', type: 'short', source: 'MongoDB의 구조',
      question: 'MongoDB에서 문서 안에 또 다른 문서를 넣는 것(예: address: { city: "Seoul" })을 무엇이라 하나요? (영어 또는 한글, ____ 문서)',
      answer: ['임베디드', 'embedded', '내장', '임베디드문서', 'embedded document', '중첩'],
      explanation: '임베디드(embedded, 내장) 문서예요. RDB라면 별도 테이블 + FK로 나눴을 정보를 한 문서에 함께 넣어, 한 번의 읽기로 가져올 수 있어요. 언제 임베딩하고 언제 따로 둘지는 모델링 토픽에서 다뤄요.',
    },
  ],
}

export default topic
