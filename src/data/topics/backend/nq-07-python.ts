import type { Topic } from '../../types'

const topic: Topic = {
  id: 'nq-07-python',
  track: 'backend',
  group: 'MongoDB',
  title: '파이썬에서 MongoDB: pymongo와 FastAPI 연결',
  order: 87,
  sections: [
    {
      title: '연결과 기본 CRUD (pymongo)',
      notionIds: ['3efdf951bf80819a8352e7237f303d32', '3efdf951bf808154afacd2a64ca5c595'],
      points: [
        'client = MongoClient("mongodb://아이디:비번@localhost:27017") → db = client["library"] → col = db["books"]. 속성 방식(client.library.books)도 된다.',
        '셸 메서드를 snake_case로 쓴다: insert_one, insert_many, find_one, find, update_one, update_many, delete_one, delete_many, count_documents.',
        '조건과 연산자는 파이썬 dict로 쓰고, 연산자 키는 문자열이다: {"age": {"$gte": 20}}.',
        '결과 객체: insert_one().inserted_id, update_one().matched_count / modified_count, delete_many().deleted_count.',
        'MongoClient는 내부에 커넥션 풀이 있어 앱 전체에서 하나를 만들어 재사용한다. 요청마다 새로 만들지 않는다. 끝낼 때 client.close()(with 문을 쓰면 자동).',
        '연결은 지연 생성되므로, 시작 시 client.admin.command("ping")으로 실제 연결을 확인하면 설정 오류를 빨리 발견한다(노션의 ismaster/server_info 확인과 같은 목적).',
      ],
      code: `from pymongo import MongoClient

client = MongoClient(settings.mongo_url)
client.admin.command("ping")               # 연결 확인
col = client["library"]["books"]

new_id = col.insert_one({"title": "FastAPI 입문", "year": 2026}).inserted_id
book = col.find_one({"_id": new_id})
col.update_one({"_id": new_id}, {"$inc": {"views": 1}})
print(col.count_documents({"year": {"$gte": 2025}}))`,
    },
    {
      title: '커서와 조회 옵션',
      notionIds: ['3efdf951bf8081a99f3fe339dcd343a3'],
      points: [
        'find()는 Cursor를 돌려준다. for doc in col.find(...): 로 반복하며 조금씩 가져온다. list(cursor)를 하면 전부 메모리에 올라온다.',
        'projection: col.find({}, {"_id": 0, "title": 1}). 정렬: .sort("year", -1) 또는 .sort([("year", -1), ("title", 1)]). .skip(n).limit(n).',
        '정규식: {"title": {"$regex": re.escape(q), "$options": "i"}}. distinct: col.distinct("author"). 존재: {"rating": {"$exists": True}}(파이썬 True).',
        'aggregate(파이프라인 리스트) → 커서. 파이프라인은 셸과 같은 구조를 dict와 list로 쓴다.',
      ],
      code: `pipeline = [
    {"$unwind": "$genres"},
    {"$group": {"_id": "$genres", "avg_pages": {"$avg": "$pages"}}},
    {"$sort": {"avg_pages": -1}},
    {"$limit": 1},
]
for row in col.aggregate(pipeline):
    print(row["_id"], round(row["avg_pages"]))`,
    },
    {
      title: 'ObjectId와 JSON 응답',
      points: [
        '_id는 ObjectId 객체라 그대로 JSON으로 바꿀 수 없다. FastAPI 응답 전에 str(doc["_id"])로 바꾸거나, 응답 모델에서 문자열 필드로 받는다.',
        '경로 파라미터로 받은 id 문자열은 ObjectId(id_str)로 바꿔 조회한다. 형식이 틀리면 bson.errors.InvalidId 예외가 나므로 ObjectId.is_valid(id_str)로 먼저 검사해 400/404로 응답한다.',
        'datetime은 BSON Date로 저장되고(밀리초 정밀도, 기본적으로 UTC로 해석), 읽으면 naive datetime이 될 수 있다. MongoClient(tz_aware=True)로 시간대 정보를 유지할 수 있다.',
        'Pydantic 모델로 문서를 검증해 받으면, 스키마 없는 DB에서도 앱이 기대하는 형식을 지킬 수 있다.',
      ],
      code: `from bson import ObjectId
from pydantic import BaseModel, Field

class BookOut(BaseModel):
    id: str = Field(alias="_id")
    title: str
    year: int

def to_out(doc: dict) -> BookOut:
    return BookOut.model_validate({**doc, "_id": str(doc["_id"])})

@app.get("/books/{book_id}", response_model=BookOut, response_model_by_alias=False)
def read_book(book_id: str):
    if not ObjectId.is_valid(book_id):
        raise HTTPException(404, "책이 없습니다")
    doc = col.find_one({"_id": ObjectId(book_id)})
    if doc is None:
        raise HTTPException(404, "책이 없습니다")
    return to_out(doc)`,
    },
    {
      title: 'FastAPI와 비동기 드라이버',
      points: [
        'pymongo의 기본 MongoClient는 동기다. FastAPI에서는 def 엔드포인트로 쓰면(스레드 풀에서 실행) 이벤트 루프를 막지 않는다.',
        'async def 엔드포인트에서는 비동기 드라이버를 쓴다: PyMongo의 AsyncMongoClient(최신 pymongo) 또는 Motor(AsyncIOMotorClient). 조회·쓰기에 await가 붙는다.',
        '비동기 커서는 async for doc in col.find(...) 로 반복하거나 await cursor.to_list(length=100)으로 가져온다.',
        '클라이언트는 lifespan에서 한 번 만들고, 종료 시 닫는다. 의존성으로 컬렉션을 주입하면 테스트에서 바꿔 끼우기 쉽다.',
        'ODM(객체-문서 매퍼) 라이브러리 Beanie는 Pydantic 모델 기반으로 MongoDB를 다뤄 FastAPI와 궁합이 좋다(SQLAlchemy ORM에 해당하는 역할).',
      ],
      code: `from contextlib import asynccontextmanager
from pymongo import AsyncMongoClient     # 또는 motor.motor_asyncio.AsyncIOMotorClient

@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.mongo = AsyncMongoClient(settings.mongo_url)
    yield
    await app.state.mongo.close()

app = FastAPI(lifespan=lifespan)

def get_books(request: Request):
    return request.app.state.mongo["library"]["books"]

@app.get("/books")
async def list_books(col = Depends(get_books), limit: int = 20):
    cursor = col.find({}, {"title": 1}).sort("_id", -1).limit(limit)
    return [{"id": str(d["_id"]), "title": d["title"]} async for d in cursor]`,
    },
  ],
  questions: [
    {
      id: 'nq-07-01', type: 'mcq', source: '연결과 기본 CRUD (pymongo)',
      question: 'pymongo에서 셸의 db.books.findOne({ title: "A" })에 해당하는 코드는?',
      choices: ['col.findOne({"title": "A"})', 'col.find_one(title="A")', 'col.find_one({"title": "A"})', 'col.get({"title": "A"})'],
      answer: 2,
      choiceExplanations: [
        '파이썬 드라이버는 camelCase가 아니라 snake_case예요.',
        '키워드 인자가 아니라 조건 dict를 받아요.',
        '정답. 조건은 dict로 넘겨요.',
        'get 메서드는 없어요.',
      ],
      explanation: '셸 → pymongo 변환 규칙: 메서드는 snake_case(findOne → find_one, countDocuments → count_documents), 조건·연산자는 dict와 문자열 키("$gte"), true/false/null → True/False/None.',
    },
    {
      id: 'nq-07-02', type: 'ox', source: '연결과 기본 CRUD (pymongo)',
      question: 'FastAPI 요청마다 MongoClient를 새로 만들고 닫는 것이 커넥션을 아끼는 좋은 방법이다.',
      answer: false,
      explanation: 'MongoClient 안에 커넥션 풀이 있어서, 앱 전체에서 하나를 만들어 재사용하는 게 정석이에요. 요청마다 만들면 매번 연결을 새로 맺어 느려지고 연결 수가 폭증할 수 있어요. SQLAlchemy의 "engine은 하나"와 같은 원리예요.',
    },
    {
      id: 'nq-07-03', type: 'short', source: '연결과 기본 CRUD (pymongo)',
      question: 'insert_one 결과에서 새로 생성된 문서의 _id를 꺼내는 속성 이름은? result.____________',
      answer: ['inserted_id'],
      explanation: 'inserted_id예요. insert_many는 inserted_ids(리스트). 생성 API에서 이 값을 str()로 바꿔 응답의 id로 돌려줘요.',
    },
    {
      id: 'nq-07-04', type: 'mcq', source: '커서와 조회 옵션',
      question: 'pymongo에서 year 내림차순, 같은 연도는 title 오름차순으로 정렬하는 코드는?',
      choices: [
        '.sort({"year": -1, "title": 1})',
        '.sort([("year", -1), ("title", 1)])',
        '.sort("year", "title")',
        '.order_by("-year", "title")',
      ],
      answer: 1,
      choiceExplanations: [
        '셸 문법이에요. pymongo에서는 (필드, 방향) 튜플 리스트로 순서를 명확히 해요(최신 버전은 dict도 허용하지만 리스트가 안전해요).',
        '정답. 여러 기준은 순서가 중요해서 튜플 리스트로 줘요.',
        '두 번째 인자는 방향(1/-1)이에요.',
        'Django ORM 문법이에요.',
      ],
      explanation: '정렬 기준 하나면 .sort("year", -1), 여러 개면 .sort([("year", -1), ("title", 1)]). pymongo.DESCENDING / ASCENDING 상수도 있어요.',
    },
    {
      id: 'nq-07-05', type: 'mcq', source: '커서와 조회 옵션',
      question: 'col.find()로 100만 개 문서를 처리하는 배치 코드다. 메모리를 아끼는 방법은?',
      choices: ['docs = list(col.find()) 후 반복', 'col.find().to_dict()', 'for doc in col.find(): 로 커서를 직접 반복하며 처리', '모든 문서를 JSON 파일로 저장 후 읽기'],
      answer: 2,
      choiceExplanations: [
        '100만 개를 한꺼번에 메모리에 올려요.',
        '그런 메서드는 없어요.',
        '정답. 커서가 일정 개수(batch)씩 서버에서 가져와 메모리가 일정해요.',
        '불필요한 단계예요.',
      ],
      explanation: '커서 = "필요할 때 조금씩 가져오는 반복자". SQLAlchemy의 yield_per, StreamingResponse와 같은 "한꺼번에 다 올리지 않기" 원칙이에요. 처리 시간이 매우 길면 커서 타임아웃(기본 10분 비활성)에도 주의해요.',
    },
    {
      id: 'nq-07-06', type: 'mcq', source: 'ObjectId와 JSON 응답',
      question: 'FastAPI에서 find_one 결과 dict를 그대로 return 했더니 에러가 난다. 가장 흔한 원인은?',
      choices: ['dict는 반환할 수 없어서', 'MongoDB 연결이 끊겨서', '문서가 너무 커서', '_id가 ObjectId 객체라 JSON으로 직렬화할 수 없어서'],
      answer: 3,
      choiceExplanations: [
        'dict는 반환할 수 있어요.',
        '조회는 성공했어요.',
        '크기와 무관해요.',
        '정답. str(doc["_id"])로 바꾸거나 응답 모델에서 문자열 필드로 변환해야 해요.',
      ],
      explanation: 'BSON 전용 타입(ObjectId, Decimal128 등)은 JSON이 모르는 타입이에요. 응답 직전에 변환하는 함수(to_out)나 Pydantic 모델을 한 곳에 두면 모든 API에서 일관되게 처리돼요.',
    },
    {
      id: 'nq-07-07', type: 'mcq', source: 'ObjectId와 JSON 응답',
      question: 'GET /books/abc 처럼 ObjectId 형식이 아닌 id가 들어왔다. 처리하지 않으면?',
      choices: ['ObjectId("abc")에서 InvalidId 예외가 나 500이 된다', '404가 자동으로 나간다', '전체 목록이 나간다', '빈 dict가 나간다'],
      answer: 0,
      choiceExplanations: [
        '정답. ObjectId.is_valid()로 먼저 검사해 404(또는 400)로 응답해요.',
        '자동 처리는 없어요.',
        '조회 자체가 실행되지 않아요.',
        '예외가 먼저 나요.',
      ],
      explanation: '"사용자 입력 → 내부 타입 변환"은 항상 실패할 수 있어요. 변환 실패를 4xx로 바꿔 주지 않으면 500이 쌓여 모니터링을 어지럽혀요. 의존성 함수(get_object_id)로 만들어 재사용하면 깔끔해요.',
    },
    {
      id: 'nq-07-08', type: 'short', source: 'ObjectId와 JSON 응답',
      question: '문자열이 올바른 ObjectId 형식인지 확인하는 클래스 메서드는? ObjectId.________(s)',
      answer: ['is_valid'],
      explanation: 'ObjectId.is_valid(s)예요. 24자리 16진수 문자열(또는 12바이트)이면 True. 형식이 맞아도 실제 문서가 있는지는 조회해 봐야 알아요.',
    },
    {
      id: 'nq-07-09', type: 'mcq', source: 'FastAPI와 비동기 드라이버',
      question: 'async def 엔드포인트에서 pymongo의 동기 MongoClient로 find_one을 호출하면?',
      choices: ['자동으로 비동기가 된다', '에러가 난다', '조회하는 동안 이벤트 루프가 막혀 다른 요청이 기다린다', '아무 영향 없다'],
      answer: 2,
      choiceExplanations: [
        '동기 라이브러리는 await할 수 없고 양보하지 않아요.',
        '에러 없이 조용히 느려져요.',
        '정답. 비동기 드라이버(AsyncMongoClient, Motor)를 쓰거나, 엔드포인트를 def로 바꿔요.',
        '동시 요청이 많을수록 영향이 커져요.',
      ],
      explanation: '비동기 토픽의 규칙이 MongoDB에도 그대로 적용돼요: async def 안에서는 비동기 라이브러리만. 동기 드라이버를 쓸 거면 def로.',
    },
    {
      id: 'nq-07-10', type: 'mcq', source: 'FastAPI와 비동기 드라이버',
      question: '비동기 드라이버에서 find() 결과를 리스트로 받는 올바른 코드는?',
      choices: [
        'docs = await col.find({}).to_list(length=100)',
        'docs = col.find({}).to_list(100)',
        'docs = list(await col.find({}))',
        'docs = await list(col.find({}))',
      ],
      answer: 0,
      choiceExplanations: [
        '정답. find()는 커서를 바로 돌려주고(await 없음), 실제로 가져오는 to_list에 await를 붙여요.',
        'to_list는 코루틴이라 await가 필요해요.',
        'find()는 await 대상이 아니에요.',
        'list()는 비동기 반복을 할 수 없어요.',
      ],
      explanation: '비동기 커서 사용법: ① async for doc in cursor: ② docs = await cursor.to_list(length=N). find() 자체는 쿼리를 "준비"만 하고 네트워크 통신은 반복할 때 일어나서 await가 없어요.',
    },
    {
      id: 'nq-07-11', type: 'ox', source: 'FastAPI와 비동기 드라이버',
      question: 'Beanie 같은 ODM은 Pydantic 모델로 MongoDB 문서를 정의하고 다루게 해 주어, SQLAlchemy ORM과 비슷한 역할을 한다.',
      answer: true,
      explanation: '맞아요. ODM(Object-Document Mapper)은 문서 ↔ 객체 변환, 검증, 쿼리 도우미를 제공해요. 스키마 없는 DB에 앱 수준의 스키마를 입히는 효과가 있어요. 단, 내부에서 어떤 쿼리가 나가는지는 ORM처럼 이해하고 써야 해요.',
    },
    {
      id: 'nq-07-12', type: 'mcq', source: '연결과 기본 CRUD (pymongo)',
      question: '앱 시작 시 MongoDB 설정이 잘못됐는지(주소·계정 오류) 빨리 알아내는 방법은?',
      choices: ['첫 사용자 요청이 실패할 때까지 기다린다', 'MongoClient 생성이 성공했으면 연결된 것이다', 'lifespan 시작 단계에서 client.admin.command("ping")을 실행한다', 'print(client)로 확인한다'],
      answer: 2,
      choiceExplanations: [
        '사용자가 에러를 먼저 보게 돼요.',
        'MongoClient는 연결을 지연 생성해서, 객체 생성 성공이 연결 성공을 뜻하지 않아요.',
        '정답. 실제로 서버와 통신해 보는 확인이라 설정 오류가 시작 시 바로 드러나요.',
        '객체 정보만 보여요.',
      ],
      explanation: '노션의 "연결 확인이 필요한 이유"(ismaster, server_info)와 같은 목적이에요. 헬스 체크 엔드포인트(/health)에서도 ping을 해 두면 배포 플랫폼이 DB 연결 문제를 감지할 수 있어요.',
    },
  ],
}

export default topic
