import type { Topic } from '../../types'

const topic: Topic = {
  id: 'mg-08-index',
  track: 'backend',
  group: 'MongoDB',
  title: 'MongoDB 8강 - 인덱스와 텍스트 검색',
  order: 208,
  notionId: '3efdf951bf80814fac73d2b96a1671eb',
  sections: [
    {
      title: '인덱스란?',
      points: [
        '특정 필드 값을 정렬된 상태로 유지해서 검색을 빠르게 해주는 자료구조',
        '데이터가 많을 때 전체를 다 훑지 않아도 된다',
        '단점: 저장 공간 차지, 쓰기가 많으면 인덱스도 계속 고쳐야 해서 오히려 느려질 수 있다',
      ],
    },
    {
      title: '인덱스 종류',
      points: [
        '단일 필드: 필드 하나 / 복합: 필드 여러 개',
        '다중키: 배열 필드에 만들면 자동으로 다중키 인덱스',
        '지리 공간: 위치 데이터 / 텍스트: 문자열 내용 검색용',
      ],
    },
    {
      title: '셸 문법',
      points: ['createIndex({ 필드: 1 | -1 | "text" }), getIndexes(), dropIndex("이름")', '1 오름차순, -1 내림차순'],
      code: `db.books.createIndex({ title: 1 })
db.books.createIndex({ author: 1, year: -1 })   // 복합
db.books.createIndex({ summary: "text" })       // 텍스트
db.books.getIndexes()
db.books.dropIndex("title_1")`,
    },
    {
      title: 'pymongo로 인덱스 다루기',
      points: [
        'create_index("title") → 인덱스 이름 "title_1" 반환',
        '복합은 튜플 리스트: create_index([("author", 1), ("year", -1)]) → "author_1_year_-1"',
        'index_information(): 인덱스 목록 dict. _id_는 자동 생성 기본 인덱스(삭제 불가)',
        'drop_index("title_1")은 하나 삭제(없는 이름이면 에러), drop_indexes()는 _id 빼고 전부 삭제',
      ],
      code: `books.create_index("title")                         # 'title_1'
books.create_index([("author", 1), ("year", -1)])
books.create_index([("summary", "text")])           # 'summary_text'
print(books.index_information())
books.drop_index("title_1")
books.drop_indexes()`,
    },
    {
      title: '텍스트 검색',
      points: [
        '$text 검색은 텍스트 인덱스가 있어야 동작 (없으면 text index required 에러)',
        '컬렉션당 텍스트 인덱스는 하나만 → 여러 필드를 하나의 텍스트 인덱스에 묶는다',
      ],
      code: `books.create_index([("title", "text")])
for b in books.find({"$text": {"$search": "파이썬"}}):
    print(b["title"])`,
    },
    {
      title: '가중치와 적합도 점수',
      points: [
        'weights={"title": 5, "summary": 1} → title에서 매칭되면 점수가 더 높다',
        'textScore: 검색어 빈도·위치·가중치를 반영한 적합도 점수',
        '{"score": {"$meta": "textScore"}}로 점수를 꺼내고, 정렬도 $meta를 같이 넣는다 (항상 높은 순)',
        'score는 내가 정한 이름이라 바꿔도 된다',
      ],
      code: `cursor = books.find(
    {"$text": {"$search": "우주"}},
    {"title": 1, "score": {"$meta": "textScore"}}
).sort([("score", {"$meta": "textScore"})]).limit(5)`,
    },
    {
      title: '참고: 한글 텍스트 검색',
      points: [
        '텍스트 인덱스는 띄어쓰기 단위로 단어를 나눈다',
        '"파이썬"으로 검색하면 "파이썬을"처럼 조사가 붙은 단어는 안 잡힐 수 있다 → 부분 일치는 $regex',
      ],
    },
  ],
  questions: [
    { id: 'mg-08-01', type: 'mcq', source: '인덱스란?', question: '인덱스의 단점으로 맞는 것은?', choices: ['조회가 느려진다', '저장 공간을 차지하고 쓰기가 많으면 느려질 수 있다', '_id를 못 쓴다', '정렬이 안 된다'], answer: 1, explanation: '데이터를 쓸 때마다 인덱스도 고쳐야 해서, 쓰기가 많은 컬렉션은 오히려 느려질 수 있어요.' },
    { id: 'mg-08-02', type: 'ox', source: '인덱스란?', question: '인덱스는 필드 값을 정렬된 상태로 유지해서 전체를 다 훑지 않고 검색할 수 있게 한다.', answer: true, explanation: '책 뒤의 찾아보기처럼 정렬돼 있어서 빠르게 찾을 수 있어요.' },
    { id: 'mg-08-03', type: 'mcq', source: '인덱스 종류', question: '배열 필드(genres)에 인덱스를 만들면 자동으로 되는 인덱스 종류는?', choices: ['복합 인덱스', '다중키 인덱스', '텍스트 인덱스', '지리 공간 인덱스'], answer: 1, explanation: '배열 필드 → 다중키(multikey) 인덱스. 배열 원소 각각이 인덱싱돼요.' },
    { id: 'mg-08-04', type: 'short', source: '셸 문법', question: '셸에서 books 컬렉션의 인덱스 목록을 보는 메서드는? (db.books.?())', answer: ['getIndexes', 'getIndexes()', 'db.books.getIndexes()'], explanation: 'getIndexes(). pymongo에서는 index_information().' },
    { id: 'mg-08-05', type: 'ox', source: '셸 문법', question: 'createIndex({ year: -1 })은 year 내림차순 인덱스를 만든다.', answer: true, explanation: '1 오름차순, -1 내림차순, "text"는 텍스트 인덱스.' },
    { id: 'mg-08-06', type: 'short', source: 'pymongo로 인덱스 다루기', question: 'books.create_index("title")이 반환하는 인덱스 이름은?', answer: ['title_1'], explanation: '필드명_방향 형태로 이름이 붙어요. 복합은 author_1_year_-1.' },
    { id: 'mg-08-07', type: 'mcq', source: 'pymongo로 인덱스 다루기', question: 'drop_indexes()를 실행해도 남는 인덱스는?', choices: ['없다', '_id_ 인덱스', '텍스트 인덱스', '가장 최근 인덱스'], answer: 1, explanation: '_id_는 MongoDB가 자동으로 만드는 기본 인덱스라 삭제할 수 없어요.' },
    { id: 'mg-08-08', type: 'mcq', source: 'pymongo로 인덱스 다루기', question: 'pymongo에서 author 오름차순 + year 내림차순 복합 인덱스를 만드는 코드는?', choices: ['create_index({"author": 1, "year": -1})', 'create_index([("author", 1), ("year", -1)])', 'create_index("author", "year")', 'create_index("author_1_year_-1")'], answer: 1, explanation: 'pymongo는 (필드, 방향) 튜플 리스트. sort와 같은 방식이에요.' },
    { id: 'mg-08-09', type: 'mcq', source: '텍스트 검색', question: '텍스트 인덱스 없이 {"$text": {"$search": "파이썬"}}을 실행하면?', choices: ['전체 문서 반환', '빈 결과', 'text index required 에러', '자동으로 인덱스 생성'], answer: 2, explanation: '$text는 텍스트 인덱스가 있어야만 동작해요.' },
    { id: 'mg-08-10', type: 'ox', source: '텍스트 검색', question: '한 컬렉션에 title용, summary용 텍스트 인덱스를 따로 두 개 만들 수 있다.', answer: false, explanation: '컬렉션당 텍스트 인덱스는 하나. 여러 필드를 하나의 텍스트 인덱스에 묶어요.' },
    { id: 'mg-08-11', type: 'short', source: '가중치와 적합도 점수', question: '텍스트 검색 적합도 점수를 꺼낼 때 쓰는 표현은? {"score": {"$meta": ?}}', answer: ['"textScore"', 'textScore', "'textScore'"], explanation: '{"$meta": "textScore"}. score는 내가 정한 이름이라 바꿔도 돼요.' },
    { id: 'mg-08-12', type: 'mcq', source: '가중치와 적합도 점수', question: 'textScore 정렬에 대한 설명으로 맞는 것은?', choices: ['sort("score", -1)로 충분하다', 'sort에도 $meta: "textScore"를 넣어야 하고 항상 높은 순으로 정렬된다', '오름차순만 가능하다', '점수는 저장된 필드다'], answer: 1, explanation: '점수는 동적으로 계산되는 값이라 정렬에도 $meta가 필요하고, 높은 순으로만 정렬돼요.' },
    { id: 'mg-08-13', type: 'ox', source: '가중치와 적합도 점수', question: 'weights={"title": 5, "summary": 1}이면 summary에서 매칭될 때 점수가 더 높다.', answer: false, explanation: '가중치가 큰 title에서 매칭될 때 점수가 더 높아요.' },
    { id: 'mg-08-14', type: 'mcq', source: '참고: 한글 텍스트 검색', question: '$text로 "파이썬"을 검색했는데 "파이썬을 배우자" 문서가 안 나온 이유는?', choices: ['인덱스가 오름차순이라', '텍스트 인덱스가 띄어쓰기 단위로 단어를 나눠 "파이썬을"은 다른 단어라서', '한글은 저장이 안 돼서', '가중치가 0이라'], answer: 1, explanation: '띄어쓰기 단위 단어 매칭이라 조사가 붙으면 다른 단어. 부분 일치가 필요하면 $regex.' },
  ],
}

export default topic
