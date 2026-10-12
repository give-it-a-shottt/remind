import type { Topic } from '../../types'

const topic: Topic = {
  id: 'mg-09-crawling',
  track: 'backend',
  group: 'MongoDB',
  title: 'MongoDB 9강 - 크롤링 데이터 MongoDB 저장 실습',
  order: 209,
  notionId: '3efdf951bf80811ba911d0f8fdfee971',
  sections: [
    {
      title: 'MySQL과 다른 점',
      points: [
        'MySQL은 저장 전에 테이블(스키마)을 먼저 만들어야 했다',
        'MongoDB는 스키마 설계 없이 dict를 바로 insert하면 DB와 컬렉션까지 자동 생성',
      ],
    },
    {
      title: '크롤링 + 저장',
      points: [
        'requests로 받고 BeautifulSoup으로 파싱 → select로 카드 반복 → insert_one',
        '하나씩 넣어도 되지만, 페이지별로 리스트에 모아 insert_many()로 넣으면 더 빠르다',
      ],
      code: `products = client["shop"]["products"]
for page in range(1, 4):
    soup = BeautifulSoup(requests.get(url).content, "html.parser")
    for card in soup.select("div.item"):
        products.insert_one({
            "category": card.select_one(".category").get_text(strip=True),
            "name": card.select_one(".name").get_text(strip=True),
        })`,
    },
    {
      title: '분석 연습',
      points: [
        'distinct("category")로 카테고리 종류',
        '같은 조회를 find 버전과 aggregate($match + $project) 버전으로 쓸 수 있다',
        '카테고리별 개수: $group $sum: 1 → $project로 _id를 category로 이름 바꾸기',
        '부분 일치는 {"$regex": "블랙"}, 단어 검색은 텍스트 인덱스 + $text',
      ],
      code: `products.aggregate([
    {"$group": {"_id": "$category", "count": {"$sum": 1}}},
    {"$project": {"_id": 0, "category": "$_id", "count": 1}},
])
products.find({"category": "노트", "name": {"$regex": "스프링"}})`,
    },
    {
      title: '$regex vs $text',
      points: [
        '$regex: 문자열 안에 포함되기만 하면 찾는다 (".*블랙.*"의 앞뒤 .*는 생략해도 같다)',
        '$text: 텍스트 인덱스 필요, 단어 단위로 빠르게 검색',
      ],
    },
    {
      title: '정리',
      points: [
        '크롤링(수집) → MongoDB 저장 → find/aggregate 분석 흐름',
        '형식이 자주 바뀌는 데이터(크롤링, 로그)는 MongoDB, 규격화된 데이터는 MySQL이 적합',
      ],
    },
  ],
  questions: [
    { id: 'mg-09-01', type: 'mcq', source: 'MySQL과 다른 점', question: '크롤링 데이터를 저장할 때 MongoDB가 MySQL과 다른 점은?', choices: ['CREATE TABLE이 먼저 필요하다', '스키마 설계 없이 dict를 바로 넣으면 DB·컬렉션이 자동 생성된다', 'commit()을 꼭 호출해야 한다', '문자열만 저장된다'], answer: 1, explanation: 'MySQL은 테이블을 먼저 만들어야 했지만, MongoDB는 insert하는 순간 자동 생성.' },
    { id: 'mg-09-02', type: 'ox', source: '크롤링 + 저장', question: '크롤링한 상품을 페이지별 리스트에 모아 insert_many()로 넣으면 하나씩 insert_one()보다 빠르다.', answer: true, explanation: 'DB 왕복 횟수가 줄어서 더 빨라요.' },
    { id: 'mg-09-03', type: 'short', source: '크롤링 + 저장', question: 'BeautifulSoup에서 요소의 텍스트를 앞뒤 공백 없이 꺼내는 메서드 호출은? (get_text(?))', answer: ['strip=True', 'get_text(strip=True)'], explanation: 'card.select_one(".name").get_text(strip=True)' },
    { id: 'mg-09-04', type: 'mcq', source: '분석 연습', question: '저장된 상품의 카테고리 종류만 중복 없이 보는 코드는?', choices: ['products.find("category")', 'products.distinct("category")', 'products.count_documents("category")', 'products.group("category")'], answer: 1, explanation: "distinct → ['노트', '펜', '파일']" },
    { id: 'mg-09-05', type: 'mcq', source: '분석 연습', question: 'products.find({"category": "펜"}, {"_id": 0, "name": 1})과 같은 결과를 내는 aggregate 파이프라인은?', choices: ['[$group → $sort]', '[{"$match": {"category": "펜"}}, {"$project": {"_id": 0, "name": 1}}]', '[{"$unwind": "$name"}]', '[{"$project": ...}, {"$limit": 1}]'], answer: 1, explanation: 'find의 조건 = $match, projection = $project.' },
    { id: 'mg-09-06', type: 'essay', source: '분석 연습', question: '카테고리별 상품 수를 구하고, 결과 필드 이름을 category / count로 보여주는 파이프라인을 설명해 보세요.', answer: '$group으로 _id: "$category", count: {$sum: 1}로 묶어 센 뒤, $project로 _id: 0, category: "$_id", count: 1로 이름을 바꿔 보여준다.', keywords: ['$group', '$sum', '$project', '"$_id"'], explanation: '$group 결과의 키는 _id라서, 보기 좋게 $project로 이름을 바꿔요.' },
    { id: 'mg-09-07', type: 'mcq', source: '$regex vs $text', question: '상품명에 "블랙"이 들어가기만 하면 다 찾고 싶다. 인덱스 없이 쓸 수 있는 방법은?', choices: ['$text', '$regex', '$in', '$exists'], answer: 1, explanation: '$regex는 포함 여부로 찾고 인덱스가 필요 없어요. $text는 텍스트 인덱스가 필요하고 단어 단위.' },
    { id: 'mg-09-08', type: 'ox', source: '$regex vs $text', question: '{"$regex": ".*블랙.*"}과 {"$regex": "블랙"}은 같은 결과를 낸다.', answer: true, explanation: '$regex는 포함되기만 하면 매칭돼서 앞뒤 .*는 생략해도 같아요.' },
    { id: 'mg-09-09', type: 'mcq', source: '정리', question: 'MongoDB가 더 적합한 데이터는?', choices: ['회원·주문처럼 규격화된 데이터', '크롤링·로그처럼 형식이 자주 바뀌는 데이터', '계좌 이체 데이터', '외래키로 묶인 데이터'], answer: 1, explanation: '형식이 자주 바뀌면 MongoDB, 규격화된 데이터는 MySQL.' },
  ],
}

export default topic
