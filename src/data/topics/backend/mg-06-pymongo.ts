import type { Topic } from '../../types'

const topic: Topic = {
  id: 'mg-06-pymongo',
  track: 'backend',
  group: 'MongoDB',
  title: 'MongoDB 6강 - pymongo 기본 (파이썬으로 CRUD)',
  order: 206,
  notionId: '3efdf951bf80819a8352e7237f303d32',
  sections: [
    {
      title: 'pymongo',
      points: [
        '파이썬에서 MongoDB를 다루는 가장 많이 쓰는 라이브러리',
        '설치: pip install pymongo',
        '메서드 이름이 셸과 다르다: insertOne → insert_one, findOne → find_one (snake_case)',
      ],
    },
    {
      title: '연결과 선택',
      points: [
        'MongoClient("mongodb://localhost:27017")로 연결 (계정이 있으면 아이디:비번@)',
        'client["library"] 또는 client.library로 DB 선택, db["books"] 또는 db.books로 컬렉션 선택',
        'DB·컬렉션이 없어도 에러 없음 → 처음 데이터를 넣을 때 자동 생성',
      ],
      code: `from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017")
db = client["library"]        # 또는 client.library
books = db["books"]           # 또는 db.books
print(db.list_collection_names())`,
    },
    {
      title: '삽입',
      points: [
        'insert_one(dict) → result.inserted_id (생성된 _id)',
        'insert_many([dict, ...]) → result.inserted_ids (_id 리스트)',
      ],
      code: `result = books.insert_one({"title": "파이썬 첫걸음", "rating": 4.5})
print(result.inserted_id)`,
    },
    {
      title: '조회',
      points: [
        'find_one(조건) → dict 하나 또는 None',
        'find() → 반복 가능한 커서 (for문으로 하나씩)',
      ],
      code: `book = books.find_one({"title": "우주 산책"})
for book in books.find():
    print(book["title"], book["rating"])`,
    },
    {
      title: '수정',
      points: [
        'update_one(조건, {"$set": {...}}) / update_many(조건, {"$set": {...}})',
        '결과의 modified_count = 수정된 문서 수',
      ],
      code: `r = books.update_one({"title": "백엔드 여행"}, {"$set": {"rating": 4.4}})
print(r.modified_count)`,
    },
    {
      title: '삭제',
      points: ['delete_one(조건) / delete_many(조건)', '결과의 deleted_count = 삭제된 문서 수'],
      code: `r = books.delete_many({"rating": {"$lt": 4.0}})
print(r.deleted_count)`,
    },
    {
      title: '연결 종료',
      points: ['끝낼 때 client.close()', 'with문을 쓰면 블록이 끝날 때 자동으로 닫힌다'],
      code: `with MongoClient("mongodb://localhost:27017") as client:
    for book in client.library.books.find():
        print(book)`,
    },
    {
      title: '기본 템플릿',
      points: ['연결 → client["DB"]["컬렉션"] → find로 반복 → close'],
      code: `from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017")
col = client["DB이름"]["컬렉션이름"]

for doc in col.find():
    print(doc)

client.close()`,
    },
    {
      title: '주의',
      points: [
        'filter는 파이썬 내장 함수 이름이라 변수명으로 쓰지 않는 게 좋다',
        '연산자($set, $gte 등)는 파이썬에서 문자열이라 따옴표로 감싸야 한다',
      ],
    },
  ],
  questions: [
    { id: 'mg-06-01', type: 'short', source: 'pymongo', question: 'pymongo를 설치하는 명령어는?', answer: ['pip install pymongo'], explanation: 'pip install pymongo' },
    { id: 'mg-06-02', type: 'mcq', source: 'pymongo', question: '셸의 findOne()에 해당하는 pymongo 메서드는?', choices: ['findOne()', 'find_one()', 'findone()', 'get_one()'], answer: 1, explanation: 'pymongo는 파이썬 스타일(snake_case): insertOne → insert_one, findOne → find_one.' },
    { id: 'mg-06-03', type: 'ox', source: '연결과 선택', question: 'pymongo에서 존재하지 않는 DB 이름으로 client["newdb"]를 선택하면 에러가 난다.', answer: false, explanation: '에러 없이 선택되고, 처음 데이터를 넣을 때 자동으로 생성돼요.' },
    { id: 'mg-06-04', type: 'mcq', source: '연결과 선택', question: 'library DB의 books 컬렉션을 고르는 방법으로 틀린 것은?', choices: ['client["library"]["books"]', 'client.library.books', 'client.library["books"]', 'client.get("library.books")'], answer: 3, explanation: '대괄호 또는 점(.) 접근 둘 다 되고 섞어 써도 돼요. get("library.books") 같은 방식은 없어요.' },
    { id: 'mg-06-05', type: 'short', source: '삽입', question: 'insert_one() 결과에서 새로 만들어진 _id를 꺼내는 속성 이름은?', answer: ['inserted_id', 'result.inserted_id'], explanation: 'insert_one → inserted_id, insert_many → inserted_ids (리스트).' },
    { id: 'mg-06-06', type: 'mcq', source: '조회', question: 'find_one()으로 조건에 맞는 문서가 없을 때 반환값은?', choices: ['빈 dict {}', 'None', '빈 리스트 []', '예외 발생'], answer: 1, explanation: 'find_one은 dict 하나 또는 None. 그래서 결과를 쓰기 전에 None 체크가 필요해요.' },
    { id: 'mg-06-07', type: 'ox', source: '조회', question: 'find()는 결과를 리스트로 바로 반환하므로 len()으로 개수를 알 수 있다.', answer: false, explanation: 'find()는 반복 가능한 커서예요. 개수는 count_documents()(7강) 또는 list()로 바꿔야 해요.' },
    { id: 'mg-06-08', type: 'mcq', source: '수정', question: 'update_one 결과에서 실제로 수정된 문서 수를 보는 속성은?', choices: ['updated_count', 'modified_count', 'matched_count만 있음', 'count'], answer: 1, explanation: 'modified_count. (조건에 맞은 수는 matched_count)' },
    { id: 'mg-06-09', type: 'short', source: '수정', question: '평점 4.5 이상인 책 전부에 recommended: True를 넣으려면 어떤 메서드? (메서드 이름만)', answer: ['update_many', 'update_many()'], explanation: 'books.update_many({"rating": {"$gte": 4.5}}, {"$set": {"recommended": True}})' },
    { id: 'mg-06-10', type: 'short', source: '삭제', question: 'delete_many 결과에서 삭제된 문서 수를 보는 속성 이름은?', answer: ['deleted_count'], explanation: 'r.deleted_count' },
    { id: 'mg-06-11', type: 'mcq', source: '연결 종료', question: 'MongoClient 연결을 자동으로 닫히게 쓰는 방법은?', choices: ['try문', 'with문', 'finally 없이 둔다', 'del client'], answer: 1, explanation: 'with MongoClient(...) as client: 블록이 끝나면 자동으로 close()돼요.' },
    { id: 'mg-06-12', type: 'essay', source: '기본 템플릿', question: 'pymongo로 특정 컬렉션의 문서를 모두 출력하는 기본 템플릿 순서를 설명해 보세요.', answer: 'MongoClient로 연결 → client["DB이름"]["컬렉션이름"]으로 컬렉션 선택 → find()로 반복하며 출력 → client.close()로 연결 종료.', keywords: ['MongoClient', 'find()', 'close()'], explanation: '연결 → 선택 → 반복 → 종료. with문을 쓰면 close를 생략할 수 있어요.' },
    { id: 'mg-06-13', type: 'mcq', source: '주의', question: '파이썬에서 다음 중 올바른 쿼리는?', choices: ['{rating: {$gte: 4}}', '{"rating": {$gte: 4}}', '{"rating": {"$gte": 4}}', '{rating: {"$gte": 4}}'], answer: 2, explanation: '파이썬 dict라 키와 연산자 모두 문자열 → 따옴표로 감싸야 해요.' },
    { id: 'mg-06-14', type: 'ox', source: '주의', question: '조건 dict 변수 이름으로 filter를 쓰는 건 피하는 게 좋다.', answer: true, explanation: 'filter는 파이썬 내장 함수 이름이라 덮어쓰게 돼요. query, cond 같은 이름을 쓰세요.' },
  ],
}

export default topic
