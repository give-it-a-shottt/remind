import type { Topic } from '../../types'

const topic: Topic = {
  id: 'mg-07-pymongo-advanced',
  track: 'backend',
  group: 'MongoDB',
  title: 'MongoDB 7강 - pymongo 심화 (find 옵션 & aggregate)',
  order: 207,
  notionId: '3efdf951bf8081a99f3fe339dcd343a3',
  sections: [
    {
      title: 'projection과 연산자',
      points: [
        'find(조건, projection): {"_id": 0, "title": 1}처럼 보여줄 필드 선택 → 결과는 dict',
        '비교 $lt/$gte, 논리 $or: [ {...}, {...} ]',
        '$all: 배열에 값이 모두 있는 것, $in: 값 중 하나라도 있는 것',
      ],
      code: `books.find({"year": 2021}, {"_id": 0, "title": 1})
books.find({"$or": [{"year": {"$lt": 2021}}, {"rating": {"$gte": 4.6}}]})
books.find({"genres": {"$all": ["소설", "역사"]}})
books.find({"genres": {"$in": ["IT", "과학"]}})`,
    },
    {
      title: 'sort / skip / limit',
      points: [
        '메서드를 이어서 붙인다: find().sort("rating", -1).skip(2).limit(3)',
        '여러 기준 정렬은 튜플 리스트: sort([("year", 1), ("rating", -1)])',
      ],
    },
    {
      title: '정규표현식',
      points: [
        're.compile("python", re.I)로 대소문자 무시 검색',
        're 없이 {"$regex": "산책", "$options": "i"}로도 가능',
      ],
    },
    {
      title: 'distinct / $exists / count_documents',
      points: [
        'distinct("genres"): 배열 안 값까지 펼쳐서 중복 제거',
        '{"translator": {"$exists": False}}: 필드가 없는 문서',
        'count_documents(조건) / count_documents({}) 전체 개수',
        'find().count()는 없어진 방식 → count_documents() 사용',
      ],
    },
    {
      title: 'aggregate()',
      points: ['파이프라인을 리스트로 만들어 넘긴다', '결과는 반복 가능한 커서'],
      code: `pipeline = [
    {"$unwind": "$genres"},
    {"$group": {"_id": "$genres", "count": {"$sum": 1}}},
    {"$sort": {"count": -1}},
]
for g in books.aggregate(pipeline):
    print(g["_id"], g["count"])`,
    },
    {
      title: '자주 쓰는 패턴',
      points: [
        '전체 평균: {"$group": {"_id": None, ...}} → 결과가 하나라 list(...)[0]',
        '$group 뒤의 $match = SQL의 HAVING (예: 2권 이상 쓴 작가)',
        '$match(먼저 거르기) → $group → $sort 순서',
      ],
    },
    {
      title: '팁',
      points: [
        '$match를 파이프라인 앞쪽에 두면 처리할 문서가 줄어 빨라진다',
        '테스트할 때는 {"$limit": 5}를 붙여서 확인',
        '배열 필드로 그룹핑할 때는 먼저 $unwind',
      ],
    },
  ],
  questions: [
    { id: 'mg-07-01', type: 'mcq', source: 'projection과 연산자', question: 'find({"year": 2021}, {"_id": 0, "title": 1})의 각 결과는?', choices: ["{'_id': ..., 'title': ...}", "{'title': '...'} 형태의 dict", "'...' 문자열", '튜플'], answer: 1, explanation: '_id는 0으로 빼고 title만 포함한 dict가 나와요.' },
    { id: 'mg-07-02', type: 'mcq', source: 'projection과 연산자', question: '장르에 "소설"과 "역사"가 모두 들어 있는 책을 찾는 연산자는?', choices: ['$in', '$all', '$or', '$and'], answer: 1, choiceExplanations: ['$in은 하나라도 있으면 매칭돼요.', '정답. 배열에 나열한 값이 모두 있어야 매칭.', '$or는 조건 여러 개 중 하나.', '$and는 조건을 묶는 것이지 배열 값 포함 검사용이 아니에요.'], explanation: '$all = 모두, $in = 하나라도.' },
    { id: 'mg-07-03', type: 'short', source: 'projection과 연산자', question: '"300쪽 미만" 조건을 pymongo dict로 쓰면? {"pages": ?}', answer: ['{"$lt": 300}', "{'$lt': 300}", '{"$lt":300}'], explanation: '{"pages": {"$lt": 300}} — 연산자도 따옴표.' },
    { id: 'mg-07-04', type: 'mcq', source: 'sort / skip / limit', question: '평점 높은 순으로 2개 건너뛰고 3개를 가져오는 코드는?', choices: ['find().limit(3).skip(2).sort("rating", 1)', 'find().sort("rating", -1).skip(2).limit(3)', 'find().sort({"rating": -1}).limit(2)', 'find(skip=2, limit=3)'], answer: 1, explanation: '메서드 체이닝: sort("rating", -1) → skip(2) → limit(3). -1이 내림차순.' },
    { id: 'mg-07-05', type: 'ox', source: 'sort / skip / limit', question: 'pymongo에서 여러 기준 정렬은 sort([("year", 1), ("rating", -1)])처럼 튜플 리스트로 넘긴다.', answer: true, explanation: '셸은 {year: 1, rating: -1} 객체지만 pymongo는 (필드, 방향) 튜플 리스트.' },
    { id: 'mg-07-06', type: 'mcq', source: '정규표현식', question: '제목에 "python"이 대소문자 상관없이 들어간 책을 찾는 방법이 아닌 것은?', choices: ['{"title": re.compile("python", re.I)}', '{"title": {"$regex": "python", "$options": "i"}}', '{"title": "python"}', '둘 다(1, 2번) 가능'], answer: 2, explanation: '{"title": "python"}은 정확히 "python"인 것만 찾아요.' },
    { id: 'mg-07-07', type: 'short', source: 'distinct / $exists / count_documents', question: '조건에 맞는 문서 수를 세는 pymongo 메서드는? (find().count()는 없어진 방식)', answer: ['count_documents', 'count_documents()'], explanation: 'books.count_documents({"genres": "소설"}), 전체는 count_documents({}).' },
    { id: 'mg-07-08', type: 'mcq', source: 'distinct / $exists / count_documents', question: '번역자(translator) 필드가 아예 없는 책을 찾는 조건은?', choices: ['{"translator": None}', '{"translator": {"$exists": False}}', '{"translator": ""}', '{"$not": "translator"}'], answer: 1, explanation: '$exists: False = 필드 자체가 없는 문서.' },
    { id: 'mg-07-09', type: 'ox', source: 'distinct / $exists / count_documents', question: 'distinct("genres")는 배열 안의 값까지 펼쳐서 중복을 제거한다.', answer: true, explanation: '각 문서의 genres 배열 원소들을 모아 중복 없이 반환해요.' },
    { id: 'mg-07-10', type: 'mcq', source: 'aggregate()', question: 'pymongo aggregate()에 파이프라인을 넘기는 형태는?', choices: ['dict 하나', 'dict들의 리스트', '문자열', '튜플'], answer: 1, explanation: '스테이지 dict들을 리스트로. 결과는 반복 가능한 커서.' },
    { id: 'mg-07-11', type: 'mcq', source: '자주 쓰는 패턴', question: '전체 평균을 구할 때 list(books.aggregate(...))[0]을 쓰는 이유는?', choices: ['정렬하려고', '결과가 문서 하나뿐이라 커서를 리스트로 바꿔 첫 번째를 꺼내려고', '중복 제거', '속도 향상'], answer: 1, explanation: '_id: None으로 전체를 한 그룹으로 묶으면 결과가 1개. 커서는 인덱스가 안 되니 list로 바꿔요.' },
    { id: 'mg-07-12', type: 'short', source: '자주 쓰는 패턴', question: '$group 뒤에 오는 $match는 SQL의 어떤 절과 같을까요?', answer: ['HAVING'], explanation: '그룹핑한 결과를 거르는 것 = HAVING. ($group 앞의 $match는 WHERE)' },
    { id: 'mg-07-13', type: 'mcq', source: '팁', question: '파이프라인 성능을 높이는 습관은?', choices: ['$match를 맨 뒤에', '$match를 앞쪽에 두어 처리할 문서를 줄이기', '$unwind를 항상 먼저', '$limit을 쓰지 않기'], answer: 1, explanation: '먼저 거르면 뒤 스테이지가 처리할 문서가 줄어요. 배열 필드 그룹핑 전에는 $unwind.' },
  ],
}

export default topic
