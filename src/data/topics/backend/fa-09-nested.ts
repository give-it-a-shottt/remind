import type { Topic } from '../../types'

const topic: Topic = {
  id: 'fa-09-nested',
  track: 'backend',
  group: 'FastAPI',
  title: 'Pydantic 중첩 모델',
  order: 29,
  sections: [
    {
      title: '모델 안에 모델',
      points: [
        '필드의 타입으로 다른 Pydantic 모델을 쓰면 JSON의 중첩 구조를 그대로 표현할 수 있다. address: Address → {"address": {"city": "...", "zip": "..."}}.',
        '검증도 안쪽까지 내려간다. address.zip이 규칙에 맞지 않으면 loc가 ["body", "address", "zip"]인 422가 난다.',
        '안쪽 모델을 독립 클래스로 만들어 두면 여러 모델에서 재사용할 수 있고, /docs의 Schemas에도 따로 표시된다.',
      ],
      code: `class Address(BaseModel):
    city: str
    zip: str = Field(pattern=r"^\\d{5}$")

class UserCreate(BaseModel):
    name: str
    address: Address

# {"name": "kim", "address": {"city": "Seoul", "zip": "04524"}}`,
    },
    {
      title: '모델의 리스트와 딕셔너리',
      points: [
        'items: list[OrderItem] 은 "OrderItem 객체들의 배열"이다. 배열의 각 원소가 각각 검증되고, 두 번째 원소가 틀리면 loc에 인덱스(1)가 들어간다.',
        'dict[str, Item] 처럼 키는 문자열, 값은 모델인 구조도 표현할 수 있다.',
        'Field(min_length=1)을 리스트 필드에 주면 "최소 1개 이상"이라는 규칙이 된다. 빈 주문을 막을 때 쓴다.',
        '요청 본문 자체가 배열이어야 하면 파라미터를 items: list[Item] 으로 선언한다. 본문이 [ {...}, {...} ] 형태가 된다.',
      ],
      code: `class OrderItem(BaseModel):
    product_id: int
    quantity: int = Field(ge=1)

class OrderCreate(BaseModel):
    items: list[OrderItem] = Field(min_length=1)
    memo: str | None = None

# 실패 예: {"items": [{"product_id": 1, "quantity": 2}, {"product_id": 2, "quantity": 0}]}
# → loc: ["body", "items", 1, "quantity"]`,
    },
    {
      title: '여러 본문 파라미터와 Body(embed)',
      points: [
        '함수에 Pydantic 모델 파라미터가 두 개 이상이면 FastAPI는 각 파라미터 이름을 키로 하는 JSON을 기대한다. def f(item: Item, user: User) → {"item": {...}, "user": {...}}.',
        '모델이 하나뿐이면 기본적으로 모델 내용이 본문 최상위에 온다. 하나뿐인데도 {"item": {...}}처럼 감싸고 싶으면 item: Item = Body(embed=True).',
        '모델이 아닌 단순 값을 본문에서 받고 싶으면 Body()를 명시한다. importance: int = Body(). 명시하지 않으면 쿼리 파라미터가 된다.',
      ],
      code: `from fastapi import Body

@app.put("/items/{item_id}")
def update(item_id: int, item: Item, user: User, importance: Annotated[int, Body()]):
    ...
# 기대하는 본문
# {"item": {...}, "user": {...}, "importance": 5}`,
    },
    {
      title: '중첩 모델 설계 요령',
      points: [
        '중첩은 "함께 만들고 함께 버리는 데이터"에 쓴다. 주문과 주문 항목처럼 한 요청으로 함께 생성되는 경우가 대표적이다.',
        '이미 존재하는 다른 자원을 가리킬 때는 객체 전체가 아니라 ID만 받는다. 주문 생성에서 상품 정보 전체(이름·가격)를 받으면 클라이언트가 가격을 조작할 수 있다. product_id만 받고 가격은 서버가 DB에서 읽는다.',
        '응답에서는 중첩을 적극적으로 쓴다. 게시글 응답에 작성자 요약(author: UserSummary)을 넣으면 프론트가 요청을 한 번 덜 보낸다.',
        '너무 깊은 중첩(4~5단계)은 프론트와 백엔드 모두 다루기 어렵다. 2~3단계 안에서 끊는 것이 보통이다.',
      ],
    },
  ],
  questions: [
    {
      id: 'fa-09-01', type: 'mcq', source: '모델 안에 모델',
      question: '아래 모델에 맞는 요청 본문은?',
      code: `class Address(BaseModel):
    city: str
    zip: str

class UserCreate(BaseModel):
    name: str
    address: Address`,
      choices: [
        '{"name": "kim", "address": {"city": "Seoul", "zip": "04524"}}',
        '{"name": "kim", "city": "Seoul", "zip": "04524"}',
        '{"name": "kim", "address": "Seoul 04524"}',
        '{"UserCreate": {"name": "kim"}, "Address": {"city": "Seoul"}}',
      ],
      answer: 0,
      choiceExplanations: [
        '정답. address 키 아래에 Address 구조의 객체가 와요.',
        '평평한 구조라 address 필드가 없어서 422예요.',
        'address는 문자열이 아니라 객체여야 해요.',
        '클래스 이름은 JSON 키가 아니에요. 필드 이름이 키예요.',
      ],
      explanation: '중첩 모델은 JSON 객체 안의 객체로 대응돼요. 모델 필드 이름이 키, 필드 타입(모델)이 값의 구조예요.\nTypeScript 프론트에서는 type UserCreate = { name: string; address: { city: string; zip: string } } 와 같은 모양이에요.',
    },
    {
      id: 'fa-09-02', type: 'mcq', source: '모델 안에 모델',
      question: '위 UserCreate에 address.zip을 빠뜨리고 보냈다. 422 응답의 loc는?',
      choices: ['["body", "zip"]', '["body", "address", "zip"]', '["address"]', '["query", "zip"]'],
      answer: 1,
      choiceExplanations: [
        'zip은 address 안에 있어서 경로에 address가 들어가요.',
        '정답. 본문 → address → zip 순으로 위치를 알려 줘요.',
        '위치가 더 구체적으로 나와요.',
        '본문의 값이에요.',
      ],
      explanation: 'loc는 "에러 위치까지 가는 경로"예요. 리스트 안이면 인덱스 숫자도 들어가요. 예: ["body", "items", 2, "quantity"].\n프론트는 loc를 보고 해당 입력 칸에 에러 문구를 표시할 수 있어요.',
    },
    {
      id: 'fa-09-03', type: 'short', source: '모델의 리스트와 딕셔너리',
      question: '주문에 항목이 최소 1개는 있어야 한다. items: list[OrderItem] = Field(______=1) 의 빈칸은?',
      answer: ['min_length'],
      explanation: 'min_length예요. 문자열에선 글자 수, 리스트에선 원소 개수를 뜻해요. 최대 개수는 max_length.\n예: tags: list[str] = Field(default=[], max_length=10) → 태그는 10개까지.',
    },
    {
      id: 'fa-09-04', type: 'mcq', source: '모델의 리스트와 딕셔너리',
      question: '본문 {"items": [{"product_id": 1, "quantity": 2}, {"product_id": 2, "quantity": 0}]} 을 보냈다. quantity는 Field(ge=1)이다. 결과는?',
      choices: ['첫 번째 항목만 저장된다', '422, loc는 ["body", "items", 2, "quantity"]', '200, quantity 0은 1로 보정된다', '422, loc는 ["body", "items", 1, "quantity"]'],
      answer: 3,
      choiceExplanations: [
        '검증은 전부 아니면 전무예요. 하나라도 틀리면 함수가 실행되지 않아요.',
        '인덱스는 0부터 시작해요.',
        'Pydantic은 값을 몰래 보정하지 않고 거절해요.',
        '정답. 인덱스는 0부터라 두 번째 항목은 1이에요.',
      ],
      explanation: '리스트 원소는 하나하나 검증되고, 실패한 원소의 인덱스가 loc에 들어가요.\n여러 원소가 틀리면 detail 배열에 에러가 여러 개 담겨요. Pydantic은 첫 에러에서 멈추지 않고 가능한 한 모든 에러를 모아서 알려 줘요.',
    },
    {
      id: 'fa-09-05', type: 'mcq', source: '모델의 리스트와 딕셔너리',
      question: '여러 개의 상품을 한 번에 등록하는 API의 요청 본문을 [ {...}, {...} ] 처럼 배열로 받고 싶다. 선언은?',
      choices: ['def bulk(items: list[ProductCreate])', 'def bulk(items: ProductCreate)', 'def bulk(items: list[ProductCreate] = Query())', 'def bulk(*items: ProductCreate)'],
      answer: 0,
      choiceExplanations: [
        '정답. 모델의 리스트를 파라미터로 받으면 본문 최상위가 배열이 돼요.',
        '객체 하나만 받아요.',
        'Query로 하면 쿼리 스트링에서 찾으려 해서 동작하지 않아요.',
        'FastAPI는 가변 인자(*args)를 파라미터로 해석하지 않아요.',
      ],
      explanation: 'list[Model] 파라미터 → 본문은 JSON 배열.\n대량 등록 API에는 Field나 직접 검사로 최대 개수 제한을 두는 게 좋아요. 한 번에 수십만 개가 들어오면 메모리와 DB가 버티지 못해요.',
    },
    {
      id: 'fa-09-06', type: 'mcq', source: '여러 본문 파라미터와 Body(embed)',
      question: '다음 함수가 기대하는 요청 본문은?',
      code: `@app.post("/transfer")
def transfer(sender: Account, receiver: Account):
    ...`,
      choices: [
        '{"id": 1, "id": 2}',
        '{"sender": {"id": 1}, "receiver": {"id": 2}}',
        '[{"id": 1}, {"id": 2}]',
        '쿼리 ?sender=1&receiver=2',
      ],
      answer: 1,
      choiceExplanations: [
        'JSON에서 같은 키를 두 번 쓸 수 없어요.',
        '정답. 모델 파라미터가 둘 이상이면 파라미터 이름이 키가 돼요.',
        '배열이 아니라 객체예요.',
        '모델 파라미터는 본문에서 읽어요.',
      ],
      explanation: '모델 파라미터 1개 → 모델 내용이 본문 최상위.\n모델 파라미터 2개 이상 → {"파라미터이름": {...}, ...}.\n하나일 때도 감싸고 싶으면 Body(embed=True)를 써요.',
    },
    {
      id: 'fa-09-07', type: 'short', source: '여러 본문 파라미터와 Body(embed)',
      question: '모델 파라미터가 하나뿐일 때도 본문을 {"item": {...}} 처럼 파라미터 이름으로 감싸 받으려면 Body(____=True)를 쓴다. 빈칸은?',
      answer: ['embed'],
      explanation: 'Body(embed=True)예요. item: Annotated[Item, Body(embed=True)].\n나중에 같은 본문에 다른 값을 추가할 가능성이 있다면 처음부터 감싸 두는 것도 방법이에요. 최상위 구조를 바꾸면 기존 클라이언트가 깨지니까요.',
    },
    {
      id: 'fa-09-08', type: 'mcq', source: '여러 본문 파라미터와 Body(embed)',
      question: 'def f(item: Item, priority: int) 에서 priority는 어디서 읽을까?',
      choices: ['본문 {"item": ..., "priority": 1}', '경로', '헤더', '쿼리 ?priority=1'],
      answer: 3,
      choiceExplanations: [
        '본문에서 받으려면 Body()를 명시해야 해요.',
        '경로에 {priority}가 없어요.',
        '헤더는 Header()로 명시해야 해요.',
        '정답. 단순 타입은 기본적으로 쿼리예요. 다른 파라미터가 본문이라도 바뀌지 않아요.',
      ],
      explanation: '해석 규칙은 파라미터마다 독립적이에요. item(모델) → 본문, priority(int) → 쿼리.\npriority도 본문에 넣으려면 priority: Annotated[int, Body()]로 선언해요. 그러면 본문은 {"item": {...}, "priority": 1}이 돼요.',
    },
    {
      id: 'fa-09-09', type: 'mcq', source: '중첩 모델 설계 요령',
      question: '주문 생성 API의 주문 항목 모델로 더 안전한 설계는?',
      code: `# A
class OrderItem(BaseModel):
    product_id: int
    quantity: int

# B
class OrderItem(BaseModel):
    product_id: int
    product_name: str
    price: int
    quantity: int`,
      choices: ['A: 가격은 서버가 DB에서 product_id로 조회해 계산한다', 'B: 클라이언트가 가격까지 보내야 서버 부담이 줄어든다', '둘 다 같다', 'B: 상품 이름이 있어야 주문이 정확하다'],
      answer: 0,
      choiceExplanations: [
        '정답. 클라이언트가 보낸 값은 조작될 수 있어요. 가격처럼 중요한 값은 서버가 신뢰할 수 있는 출처(DB)에서 가져와야 해요.',
        'price: 1을 보내면 1원에 살 수 있게 돼요.',
        'B는 가격 조작이 가능해요.',
        '이름도 DB에 있는 값이에요. 클라이언트에게 받을 이유가 없어요.',
      ],
      explanation: '원칙: 다른 자원은 ID로 참조하고, 그 자원의 속성(가격, 이름, 권한)은 서버가 DB에서 읽는다.\n주문 당시 가격을 기록해 둬야 한다면(나중에 가격이 바뀌어도 주문 내역은 유지), 서버가 DB에서 읽은 가격을 order_items.unit_price에 저장해요. 이건 의도된 중복이에요(비정규화 토픽).',
    },
    {
      id: 'fa-09-10', type: 'ox', source: '중첩 모델 설계 요령',
      question: '게시글 응답에 author: UserSummary(id, nickname)처럼 작성자 요약을 중첩해 넣으면 프론트가 작성자 정보를 위해 요청을 따로 보낼 필요가 줄어든다.',
      answer: true,
      explanation: '맞아요. 목록 화면에서 글 20개의 작성자를 각각 요청하면 요청이 21번이 돼요. 응답에 요약을 넣으면 1번으로 끝나요.\n대신 백엔드에서는 작성자를 한 번에 함께 불러와야(joinedload/selectinload) DB 쪽에서 N+1 쿼리가 생기지 않아요(SQLAlchemy 관계 토픽).',
    },
    {
      id: 'fa-09-11', type: 'mcq', source: '모델 안에 모델',
      question: '여러 모델에서 같은 주소 구조를 쓴다. 가장 좋은 방법은?',
      choices: ['모델마다 city, zip 필드를 복사해 넣는다', 'Address 모델을 하나 만들고 각 모델에서 address: Address 로 쓴다', 'address: dict 로 받는다', 'address: str 에 "도시|우편번호"로 받는다'],
      answer: 1,
      choiceExplanations: [
        '규칙이 바뀌면 모든 곳을 고쳐야 하고, 한 곳을 놓치기 쉬워요.',
        '정답. 규칙이 한 곳에 모이고, /docs에도 Address 스키마가 하나로 표시돼요.',
        '안쪽 검증이 사라져요.',
        '구조를 문자열에 숨기면 검증과 사용이 모두 어려워져요(DB 설계의 "비스칼라 값" 안티패턴과 같은 문제).',
      ],
      explanation: '중첩 모델은 "검증 규칙의 재사용 단위"예요. 같은 구조가 두 번 이상 나오면 모델로 뽑아내세요.',
    },
    {
      id: 'fa-09-12', type: 'ox', source: '모델의 리스트와 딕셔너리',
      question: 'scores: dict[str, int] 필드에 {"kim": "90"}이 들어오면 Pydantic 기본 모드에서 {"kim": 90}으로 변환된다.',
      answer: true,
      explanation: '맞아요. dict의 값도 int로 검증·변환돼요. 숫자 문자열 "90"은 int 90으로 바뀌어요. {"kim": "구십"}이었다면 422예요.\n이처럼 컬렉션 타입의 안쪽 타입까지 적어 두면 Pydantic이 끝까지 검사해 줘요.',
    },
  ],
}

export default topic
