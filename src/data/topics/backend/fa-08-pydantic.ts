import type { Topic } from '../../types'

const topic: Topic = {
  id: 'fa-08-pydantic',
  track: 'backend',
  group: 'FastAPI',
  title: 'Pydantic 모델과 필드 검증',
  order: 28,
  sections: [
    {
      title: 'BaseModel로 요청 본문 받기',
      slides: [
        {
          title: '본문의 모양을 클래스로',
          blocks: [
            { type: 'say', text: '이번 수업은 FastAPI의 단짝, **Pydantic**이에요. 클라이언트가 보내는 JSON 본문을 **검사하고 파이썬 객체로 바꿔 주는** 도구예요.' },
            { type: 'code', code: `from pydantic import BaseModel

class PostCreate(BaseModel):
    title: str
    content: str
    published: bool = True       # 기본값 → 선택
    tags: list[str] = []

@app.post("/posts", status_code=201)
def create_post(post: PostCreate):
    print(post.title, post.model_dump())
    return post` },
            { type: 'say', text: '파라미터 `post: PostCreate`는 "**요청 본문 JSON을 이 구조로 검증해서 받아라**"는 뜻이에요. FastAPI가 하는 일은\n① 본문 JSON 읽기 → ② 필드별 타입 변환·검증 → ③ 실패하면 **422**(어떤 필드가 왜 틀렸는지까지) → ④ 성공하면 `PostCreate` 객체로 함수에 전달.' },
          ],
        },
        {
          title: '객체로 쓰고, dict로 바꾸고',
          blocks: [
            { type: 'say', text: '함수 안에서는 `post.title`처럼 **속성**으로 접근해요. 에디터 자동 완성이 되고 오타가 바로 보여요.\n\n`{"title": "hi"}`만 보내면? `content`는 기본값이 없으니 **필수**라서 422가 나고, 응답에 "content: Field required"라고 알려 줘요.' },
            {
              type: 'table',
              head: ['바꾸기', 'Pydantic v2', 'v1 (옛 코드)'],
              rows: [
                ['모델 → dict', '`post.model_dump()`', '`.dict()`'],
                ['모델 → JSON 문자열', '`post.model_dump_json()`', '`.json()`'],
              ],
            },
            { type: 'say', text: 'dict로 바꾸면 `Post(**post.model_dump())`처럼 다른 클래스(DB 모델)에 **필드를 한꺼번에 풀어 넣을** 수 있어요. 필드를 하나하나 옮겨 적지 않아도 돼요.' },
          ],
        },
      ],
    },
    {
      title: 'Field로 규칙과 문서 붙이기',
      slides: [
        {
          title: '필드마다 규칙 달기',
          blocks: [
            { type: 'code', code: `from datetime import datetime
from pydantic import BaseModel, Field

class ProductCreate(BaseModel):
    name: str = Field(min_length=1, max_length=50, examples=["무선 키보드"])
    price: int = Field(gt=0, le=10_000_000, description="원 단위 가격")
    stock: int = Field(default=0, ge=0)
    created_at: datetime = Field(default_factory=datetime.now)` },
            {
              type: 'table',
              head: ['대상', '규칙'],
              rows: [
                ['문자열', '`min_length`, `max_length`, `pattern`'],
                ['숫자', '`gt`, `ge`, `lt`, `le`, `multiple_of`'],
                ['리스트', '`min_length`, `max_length` (원소 개수)'],
                ['문서', '`description`, `examples` → `/docs` Schemas에 그대로'],
              ],
            },
          ],
        },
        {
          title: 'default_factory와 alias',
          blocks: [
            { type: 'note', tone: 'warn', text: '`created_at: datetime = datetime.now()`라고 쓰면 **클래스를 정의하는 순간 딱 한 번** 시각이 계산돼서, 모든 객체가 **서버가 켜진 시각**을 갖게 돼요. "만들 때마다 새로 계산할 값"은 `default_factory=datetime.now`(괄호 없이 **함수**를 넘김)로 줘요. 데코레이터 수업의 "괄호 없으면 함수 자체"가 여기서 또 나왔죠.' },
            { type: 'code', code: `class Profile(BaseModel):
    user_name: str = Field(alias="userName")

Profile.model_validate({"userName": "kim"}).user_name   # "kim"` },
            { type: 'say', text: '프론트는 `userName`(camelCase), 파이썬은 `user_name`(snake_case)을 쓰고 싶을 때 `alias`를 줘요. JSON에서는 alias 이름으로 받고, 파이썬 코드에서는 원래 이름으로 써요.' },
          ],
        },
      ],
    },
    {
      title: '변환 규칙과 엄격 모드',
      slides: [
        {
          title: '합리적인 변환은 해 줘요',
          blocks: [
            { type: 'say', text: 'Pydantic은 기본적으로 **합리적인 변환**을 해요(lax 모드).' },
            {
              type: 'table',
              head: ['필드 타입', '들어온 값', '결과'],
              rows: [
                ['int', '`"3"`', '**3** (변환)'],
                ['float', '`3`', '**3.0**'],
                ['bool', '`"true"`', '**True**'],
                ['date', '`"2026-10-20"`', '**date 객체**'],
                ['int', '`3.5`', '**422** — 소수점을 버리면 손실'],
                ['int', '`"abc"`', '**422**'],
                ['str', '`3` (숫자)', '**422** — v2는 숫자를 문자열로 자동 변환하지 않음'],
              ],
            },
            { type: 'say', text: '금액·ID처럼 타입이 엄격해야 하는 곳은 `Field(strict=True)`나 `model_config = ConfigDict(strict=True)`로 **변환 자체를 막을** 수 있어요.' },
          ],
        },
        {
          title: '모르는 필드는 어떻게?',
          blocks: [
            { type: 'code', code: `from pydantic import BaseModel, ConfigDict

class Login(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)
    email: str
    password: str

# {"email": " a@b.com ", "password": "x", "admin": true}
# → extra="forbid" 때문에 422 (admin 은 허용되지 않은 필드)` },
            { type: 'say', text: '모델에 **정의하지 않은 필드**가 들어오면 기본은 **조용히 무시**해요. 그래서 공격자가 `"is_admin": true`를 끼워 보내도 모델에는 안 들어가요. 이것만으로도 꽤 안전해요.\n\n`extra="forbid"`로 바꾸면 아예 **422로 거절**해요. 프론트가 필드 이름을 오타 냈을 때(`titel`) 조용히 무시되지 않고 바로 드러나서 좋아요.' },
          ],
        },
      ],
    },
    {
      title: '사용자 정의 검증: field_validator와 model_validator',
      slides: [
        {
          title: '내 규칙 직접 쓰기',
          blocks: [
            { type: 'code', code: `from pydantic import BaseModel, field_validator, model_validator

class SignUp(BaseModel):
    username: str
    password: str
    password_confirm: str

    @field_validator("username")
    @classmethod
    def no_space(cls, v: str) -> str:
        if " " in v:
            raise ValueError("아이디에 공백을 넣을 수 없습니다")
        return v.lower()          # 다듬은 값 반환

    @model_validator(mode="after")
    def passwords_match(self):
        if self.password != self.password_confirm:
            raise ValueError("비밀번호 확인이 일치하지 않습니다")
        return self` },
            {
              type: 'table',
              head: ['도구', '언제'],
              rows: [
                ['`@field_validator("필드")`', '**필드 하나**의 규칙 (공백 금지, 소문자로 다듬기)'],
                ['`@model_validator(mode="after")`', '**여러 필드를 함께** 보는 규칙 (비밀번호 확인 일치, 시작일 < 종료일)'],
              ],
            },
          ],
        },
        {
          title: '검증기의 두 가지 약속',
          blocks: [
            { type: 'list', ordered: true, items: ['실패는 **`ValueError`를 raise** — FastAPI가 알아서 **422** 응답의 detail로 바꿔 줘요. `HTTPException`을 쓰지 않아요 (Pydantic은 FastAPI 밖에서도 쓰이는 도구라서)', '통과하면 **값을 return** — 빼먹으면 그 필드가 **None**이 돼요. model_validator는 `return self`'] },
            { type: 'ask', q: 'field_validator를 붙였더니 username이 항상 None이 돼요. 가장 먼저 볼 곳은?', a: '검증기 마지막에 **`return v`** 가 있는지예요. 검증기의 리턴값이 그 필드의 최종 값이 되는데, return이 없으면 파이썬 함수는 None을 돌려주거든요. 데코레이터 wrapper에서 return을 빼먹었던 실수와 같은 모양이에요.' },
          ],
        },
      ],
    },
  ],
  questions: [
    {
      id: 'fa-08-01', type: 'mcq', source: 'BaseModel로 요청 본문 받기',
      question: '다음 엔드포인트에 본문 {"title": "hi"}만 보내면?',
      code: `class PostCreate(BaseModel):
    title: str
    content: str
    published: bool = True

@app.post("/posts")
def create(post: PostCreate):
    return post`,
      choices: ['200, {"title": "hi", "content": null, "published": true}', '422, content 필드가 필요하다는 에러', '200, {"title": "hi"}', '500 에러'],
      answer: 1,
      choiceExplanations: [
        'content는 기본값이 없어서 필수예요. null로 채워지지 않아요.',
        '정답. detail에 {"loc": ["body", "content"], "type": "missing", ...}가 담겨요.',
        '검증에 실패해서 함수가 실행되지 않아요.',
        '함수 실행 전 검증 단계에서 422로 끝나요.',
      ],
      explanation: '모델 필드도 쿼리 파라미터와 같은 규칙이에요. 기본값이 없으면 필수, 있으면 선택.\n422 응답의 loc ["body", "content"]는 "본문의 content 필드"라는 뜻이에요. 프론트는 이 정보로 해당 입력창 아래에 에러를 띄울 수 있어요.',
    },
    {
      id: 'fa-08-02', type: 'short', source: 'BaseModel로 요청 본문 받기',
      question: 'Pydantic v2에서 모델 객체를 파이썬 dict로 바꾸는 메서드 이름은? (v1의 .dict())',
      answer: ['model_dump', 'model_dump()', '.model_dump()'],
      explanation: 'model_dump()예요. JSON 문자열이 필요하면 model_dump_json().\nv1 → v2 이름 변화: .dict() → .model_dump(), .json() → .model_dump_json(), parse_obj() → model_validate(), from_orm() → model_validate(obj) + from_attributes=True, Config 클래스 → model_config = ConfigDict(...).\n오래된 강의 코드를 볼 때 이 대응표가 있으면 바로 읽혀요.',
    },
    {
      id: 'fa-08-03', type: 'mcq', source: 'BaseModel로 요청 본문 받기',
      question: 'SQLAlchemy 모델 Post(**post.model_dump()) 처럼 쓰는 이유는?',
      choices: ['model_dump()가 DB에 저장해 주어서', '**는 곱셈이라서', 'Pydantic 객체는 DB 모델과 같은 타입이라서', 'Pydantic 객체를 dict로 풀어 키워드 인자로 넘기면 필드 이름이 같은 ORM 객체를 한 줄로 만들 수 있어서'],
      answer: 3,
      choiceExplanations: [
        'model_dump()는 dict 변환만 해요. 저장은 db.add + commit이에요.',
        '함수 호출에서 **dict는 "키워드 인자로 펼치기"예요.',
        'Pydantic 모델(검증용)과 SQLAlchemy 모델(DB 테이블용)은 다른 클래스예요.',
        '정답. {"title": "hi", "content": "..."} → Post(title="hi", content="...").',
      ],
      explanation: '자주 쓰는 패턴: db_post = Post(**post_in.model_dump()).\n주의: 두 모델의 필드 이름이 정확히 같아야 하고, Pydantic 쪽에 DB에 없는 필드(예: password_confirm)가 있으면 TypeError가 나요. 그럴 땐 model_dump(exclude={"password_confirm"})처럼 빼고 넘겨요.',
    },
    {
      id: 'fa-08-04', type: 'mcq', source: 'Field로 규칙과 문서 붙이기',
      question: '상품 가격은 0보다 커야 하고 1000만 원 이하여야 한다. 알맞은 선언은?',
      choices: ['price: int = Field(ge=0, lt=10_000_000)', 'price: int = Field(min_length=1)', 'price: int = Field(gt=0, le=10_000_000)', 'price: int = Field(gt=0, lt=10_000_000)'],
      answer: 2,
      choiceExplanations: [
        'ge=0이면 0원이 허용되고, lt면 1000만 원이 거절돼요.',
        'min_length는 문자열·리스트의 길이 규칙이에요.',
        '정답. gt=0(0 초과), le=10_000_000(이하).',
        'lt=10_000_000이면 정확히 1000만 원이 거절돼요. "이하"는 le예요.',
      ],
      explanation: '경계값 문제는 "같은 값이 허용되는가"로 판단해요. 초과/미만(gt, lt)은 같은 값 불가, 이상/이하(ge, le)는 같은 값 허용.\n10_000_000처럼 밑줄로 자릿수를 나눠 쓰면 읽기 쉬워요. 파이썬은 밑줄을 무시해요.',
    },
    {
      id: 'fa-08-05', type: 'mcq', source: 'Field로 규칙과 문서 붙이기',
      question: '프론트는 {"userName": "kim"} 처럼 camelCase로 보내고, 파이썬 코드에서는 user_name으로 쓰고 싶다. 방법은?',
      choices: ['파이썬 변수 이름을 userName으로 바꾼다', 'user_name: str = Field(alias="userName")', '프론트에 snake_case로 보내 달라고 한다', 'dict로 받아서 직접 바꾼다'],
      answer: 1,
      choiceExplanations: [
        '동작은 하지만 파이썬 이름 규칙(PEP 8)을 깨요.',
        '정답. JSON 키는 alias로, 파이썬 속성은 원래 이름으로 써요.',
        '해결책이 될 수도 있지만 백엔드에서 처리할 수 있는 문제예요.',
        'Pydantic 검증을 포기하게 돼요.',
      ],
      explanation: 'alias는 "외부에서 보이는 이름"이에요. 모든 필드에 일일이 붙이기 번거로우면 model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)로 자동 변환을 걸 수 있어요.\n응답에서도 camelCase로 내보내려면 FastAPI가 기본으로 alias를 써서 직렬화해요(response_model_by_alias=True 기본값).',
    },
    {
      id: 'fa-08-06', type: 'mcq', source: 'Field로 규칙과 문서 붙이기',
      question: 'created_at: datetime = datetime.now() 로 기본값을 줬다. 무엇이 문제일까?',
      choices: ['클래스를 정의할 때 한 번만 계산돼서 모든 객체의 created_at이 서버 시작 시각으로 같아진다', '문제없다', 'datetime은 Pydantic에서 쓸 수 없다', 'now()는 미래 시간을 준다'],
      answer: 0,
      choiceExplanations: [
        '정답. Field(default_factory=datetime.now)로 바꾸면 객체를 만들 때마다 호출돼요(괄호 없이 함수를 넘기는 점에 주목).',
        '눈에 잘 안 띄는 버그예요.',
        'datetime은 잘 지원돼요.',
        '현재 시각을 줘요. 문제는 "언제" 계산되느냐예요.',
      ],
      explanation: '기본값 표현식은 클래스(또는 함수)를 정의하는 순간 한 번 평가돼요. 그래서 "매번 새로 계산할 값"은 함수를 넘기는 default_factory를 써야 해요.\n실무에서는 생성 시각을 DB가 채우게(server_default=func.now()) 하는 경우가 더 많아요(SQLAlchemy 컬럼 토픽).',
    },
    {
      id: 'fa-08-07', type: 'mcq', source: '변환 규칙과 엄격 모드',
      question: 'Pydantic v2 기본(lax) 모드에서 각 필드에 값을 넣었을 때 결과가 틀린 것은?',
      choices: ['age: int 에 "20" → 20', 'price: float 에 3 → 3.0', 'active: bool 에 "false" → False', 'name: str 에 123 → "123"'],
      answer: 3,
      choiceExplanations: [
        '숫자 문자열은 int로 변환돼요.',
        '정수는 float로 손실 없이 변환돼요.',
        '"false"는 False로 변환돼요.',
        '정답(틀린 결과). v2에서는 숫자를 str 필드에 넣으면 기본적으로 422예요. 문자열로 자동 변환하지 않아요.',
      ],
      explanation: 'v2 lax 모드는 "안전한 변환"만 해요. str → int("20"), int → float, 문자열 → bool/date는 허용하지만, int → str은 허용하지 않아요(v1과 다른 점).\n숫자를 문자열로도 받고 싶다면 ConfigDict(coerce_numbers_to_str=True)를 쓰거나 타입을 int | str로 넓혀야 해요.',
    },
    {
      id: 'fa-08-08', type: 'short', source: '변환 규칙과 엄격 모드',
      question: '모델에 없는 필드가 요청에 들어오면 422로 거절하도록 하려면 model_config = ConfigDict(extra="______") 의 빈칸은?',
      answer: ['forbid'],
      explanation: 'extra="forbid"예요. 선택지는 세 가지예요.\n• "ignore"(기본): 모르는 필드는 조용히 버림\n• "forbid": 모르는 필드가 있으면 422\n• "allow": 모르는 필드도 모델에 보관\n오타(contnet)가 무시돼 "왜 저장이 안 되지?" 하는 상황을 forbid로 바로 잡을 수 있어요.',
    },
    {
      id: 'fa-08-09', type: 'ox', source: '변환 규칙과 엄격 모드',
      question: 'PostCreate 모델에 is_admin 필드가 없다면, 공격자가 본문에 "is_admin": true를 넣어도 기본 설정에서는 그 값이 모델에 들어가지 않는다.',
      answer: true,
      explanation: '맞아요. 기본값 extra="ignore"라서 모르는 필드는 버려져요. 입력 모델을 따로 두는 것 자체가 "허용된 필드만 받는" 보안 장치예요.\n반대로 DB 모델(User)을 요청 본문으로 바로 받거나, 요청 dict를 통째로 **로 DB 모델에 넣으면 is_admin 같은 값을 조작당할 수 있어요(Mass Assignment 취약점).',
    },
    {
      id: 'fa-08-10', type: 'mcq', source: '사용자 정의 검증: field_validator와 model_validator',
      question: '비밀번호와 비밀번호 확인이 같은지 검사하려면 어떤 도구가 알맞나?',
      choices: ['Field(min_length=8)', '@field_validator("password")', 'Literal', '@model_validator(mode="after")'],
      answer: 3,
      choiceExplanations: [
        '길이만 검사해요.',
        'field_validator는 기본적으로 필드 하나를 검사해요. 다른 필드 값을 안정적으로 보기 어려워요.',
        '정해진 값 목록 검사용이에요.',
        '정답. 모든 필드가 검증된 뒤 모델 전체(self)를 보고 두 값을 비교해요.',
      ],
      explanation: '규칙의 범위에 따라 도구를 골라요.\n• 필드 하나, 단순 규칙 → 타입 + Field\n• 필드 하나, 복잡한 규칙 → @field_validator\n• 여러 필드 관계 → @model_validator(mode="after")\nmode="after" validator는 마지막에 return self 를 해야 해요.',
    },
    {
      id: 'fa-08-11', type: 'mcq', source: '사용자 정의 검증: field_validator와 model_validator',
      question: '아래 validator를 쓰면 username이 항상 None이 된다. 원인은?',
      code: `@field_validator("username")
@classmethod
def check(cls, v: str) -> str:
    if " " in v:
        raise ValueError("공백 불가")`,
      choices: ['검사를 통과했을 때 값을 return하지 않아서', 'classmethod를 붙여서', 'ValueError를 써서', '필드 이름을 문자열로 줘서'],
      answer: 0,
      choiceExplanations: [
        '정답. validator의 리턴값이 그 필드의 최종 값이 돼요. return이 없으면 None이에요.',
        'Pydantic v2의 field_validator는 classmethod로 쓰는 게 정석이에요.',
        'ValueError는 Pydantic이 검증 실패로 바꿔 주는 올바른 방법이에요.',
        '필드 이름은 문자열로 주는 게 맞아요.',
      ],
      explanation: 'validator는 "검사기"이자 "변환기"예요. 값을 다듬어서(.strip(), .lower()) 돌려줄 수 있는 대신, 통과한 값도 반드시 return v 해야 해요. 데코레이터에서 wrapper가 return을 빼먹는 실수와 똑같은 구조예요.',
    },
    {
      id: 'fa-08-12', type: 'ox', source: '사용자 정의 검증: field_validator와 model_validator',
      question: 'Pydantic validator 안에서 실패를 알릴 때는 HTTPException(422)을 raise해야 한다.',
      answer: false,
      explanation: 'validator에서는 ValueError(또는 AssertionError)를 raise해요. Pydantic이 이를 ValidationError로 모으고, FastAPI가 422 응답으로 바꿔 줘요.\n모델은 FastAPI와 무관하게 재사용될 수 있으니(스크립트, 테스트 등) 모델 안에 HTTP 개념을 넣지 않는 게 좋은 설계예요.',
    },
    {
      id: 'fa-08-13', type: 'mcq', source: 'BaseModel로 요청 본문 받기',
      question: '함수 파라미터 post: PostCreate 가 있을 때 FastAPI가 기대하는 요청은?',
      choices: ['쿼리 스트링 ?title=..&content=..', '폼 데이터 title=...&content=...', 'Content-Type: application/json 본문 {"title": "...", "content": "..."}', '경로 /posts/title/content'],
      answer: 2,
      choiceExplanations: [
        'Pydantic 모델 파라미터는 본문에서 읽어요.',
        'HTML 폼 데이터를 받으려면 Form()을 써야 하고 python-multipart 패키지가 필요해요.',
        '정답. JSON 본문의 키가 모델 필드에 대응돼요.',
        '경로에 해당 이름이 없어요.',
      ],
      explanation: 'Pydantic 모델 = JSON 본문. 이게 기본이에요.\nHTML <form>으로 직접 제출하는 경우(템플릿 토픽)에는 title: str = Form() 처럼 Form을 써야 해요. JSON과 폼은 Content-Type이 달라서 섞이지 않아요.',
    },
  ],
}

export default topic
