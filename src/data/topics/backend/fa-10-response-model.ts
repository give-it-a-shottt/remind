import type { Topic } from '../../types'

const topic: Topic = {
  id: 'fa-10-response-model',
  track: 'backend',
  group: 'FastAPI',
  title: '응답 모델: 무엇을 내보낼지 정하기',
  order: 30,
  sections: [
    {
      title: 'response_model이 하는 일',
      slides: [
        {
          title: '나가는 문의 검색대',
          blocks: [
            { type: 'say', text: '지금까지는 **들어오는** 데이터를 검사했어요. 이번엔 **나가는** 데이터예요. 응답 모델은 "이 API는 **이런 모양만** 내보낸다"를 정해요.' },
            { type: 'code', code: `class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserRead(BaseModel):
    id: int
    email: EmailStr          # password 없음

@app.post("/users", response_model=UserRead, status_code=201)
def create_user(user: UserCreate):
    saved = {"id": 1, "email": user.email, "password": user.password}
    return saved             # password 는 응답에서 자동으로 빠짐` },
            { type: 'say', text: '`response_model=UserRead` 또는 `def f(...) -> UserRead:`로 지정해요. FastAPI는 함수의 리턴값을\n① 응답 모델로 **검증**하고\n② 모델에 **없는 필드는 걸러 내고**\n③ JSON으로 바꿔요. `/docs`에도 응답 구조가 표시돼요.' },
          ],
        },
        {
          title: '가장 중요한 건 필터링',
          blocks: [
            { type: 'say', text: 'DB의 사용자 객체에는 `hashed_password`가 있어요. `UserRead`에 그 필드가 없으면 **응답에서 자동으로 빠져요.** 실수로 비밀번호를 내보내는 사고를 구조적으로 막아 줘요.' },
            { type: 'note', tone: 'warn', text: '리턴값이 응답 모델 규칙에 안 맞으면(필수 필드 누락 등) **500**이 나요(ResponseValidationError). 클라이언트가 잘못한 게 아니라 **서버 코드가 약속을 어긴** 거니까요. 422가 아니에요.' },
            { type: 'ask', q: '응답 모델 없이 SQLAlchemy 객체를 그대로 return 하면 어떻게 될까요?', a: 'FastAPI가 객체를 JSON으로 바꾸는 방법을 몰라 에러가 나거나, 운 좋게 바뀌더라도 **모든 컬럼**(비밀번호 해시 포함)이 그대로 나갈 위험이 있어요. 응답 모델은 필수라고 생각하세요.' },
          ],
        },
      ],
    },
    {
      title: '입력 모델과 출력 모델을 나누는 이유',
      slides: [
        {
          title: '같은 사용자, 다른 모양',
          blocks: [
            {
              type: 'table',
              head: ['모델', 'id', 'email', 'password', '용도'],
              rows: [
                ['`UserCreate`', 'X', 'O', '**O**', '가입 요청 (입력)'],
                ['`UserRead`', '**O**', 'O', '**X**', '응답 (출력)'],
                ['`UserUpdate`', 'X', '선택', '선택', '수정 요청 (모두 선택)'],
              ],
            },
            { type: 'say', text: '하나의 모델 `User(id, email, password, is_admin)`로 입력과 출력을 다 처리하면 두 방향으로 구멍이 나요.\n• **출력**: 비밀번호가 응답에 새어 나가요\n• **입력**: 클라이언트가 `id`나 `is_admin: true`를 보내서 조작할 수 있어요' },
          ],
        },
        {
          title: '공통은 Base로, API는 계약',
          blocks: [
            { type: 'code', code: `class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserRead(UserBase):
    id: int
    created_at: datetime` },
            { type: 'say', text: '파이썬 클래스 수업에서 본 상속 패턴 그대로예요. 공통 필드는 `UserBase`에 모아요.\n\n응답 모델은 **API의 공개 계약**이에요. DB 컬럼 이름을 바꾸거나 테이블을 나눠도, 응답 모델만 유지하면 **프론트는 아무것도 몰라도 돼요.** DB 모델과 응답 모델을 분리하는 진짜 이유예요.' },
          ],
        },
      ],
    },
    {
      title: 'ORM 객체를 응답 모델로: from_attributes',
      slides: [
        {
          title: 'dict가 아니라 객체에서 읽기',
          blocks: [
            { type: 'say', text: 'SQLAlchemy 객체는 dict가 아니라 `post.title`처럼 **속성**을 가진 객체예요. Pydantic은 기본적으로 dict에서 값을 읽기 때문에, 속성으로 읽으라고 알려 줘야 해요.' },
            { type: 'code', code: `from pydantic import BaseModel, ConfigDict

class PostRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)   # v1: orm_mode = True
    id: int
    title: str

@app.get("/posts/{post_id}", response_model=PostRead)
def read_post(post_id: int, db: SessionDep):
    post = db.get(Post, post_id)          # SQLAlchemy 객체
    if post is None:
        raise HTTPException(404)
    return post                            # 그대로 반환 OK` },
            { type: 'say', text: '`from_attributes=True`가 있으면 ORM 객체를 그대로 return 해도 돼요. 직접 바꿀 땐 `PostRead.model_validate(post)` — py-02에서 본 그 **classmethod 대체 생성자**예요.' },
          ],
        },
        {
          title: '중첩 관계는 미리 불러오기',
          blocks: [
            { type: 'say', text: '`PostRead`에 `author: UserSummary`가 중첩돼 있으면, 변환하면서 `post.author`를 읽어요. 그 순간 작성자를 가져오는 **추가 쿼리**가 나갈 수 있어요(지연 로딩). 목록 20개면 쿼리가 20번 더 나가고, **비동기에서는 아예 에러**가 나요.\n\n그래서 관계를 응답에 넣을 땐 조회할 때 **미리 함께 불러와요.** SQLAlchemy 수업에서 `selectinload`로 다룰 거예요.' },
          ],
        },
      ],
    },
    {
      title: '응답 다듬기 옵션',
      slides: [
        {
          title: '목록과 페이지 정보 함께 주기',
          blocks: [
            { type: 'code', code: `class Page(BaseModel):
    items: list[PostRead]
    total: int
    page: int
    size: int

@app.get("/posts", response_model=Page)
def list_posts(page: int = 1, size: int = 10): ...` },
            { type: 'say', text: '목록만 주려면 `response_model=list[PostRead]`면 돼요. 하지만 프론트는 보통 "전체 몇 개인지"도 알아야 페이지 번호를 그릴 수 있어요. 그래서 목록과 개수를 **감싼 모델**을 만들어요.' },
          ],
        },
        {
          title: '그 밖의 옵션',
          blocks: [
            {
              type: 'table',
              head: ['옵션', '효과'],
              rows: [
                ['`response_model_exclude_unset=True`', '**설정되지 않은**(기본값 그대로인) 필드를 응답에서 빼기 → 응답이 짧아짐'],
                ['`response_model_exclude={"f"}`', '특정 필드 빼기'],
                ['`response_model_include={"f"}`', '특정 필드만 넣기'],
              ],
            },
            { type: 'say', text: 'exclude/include를 자주 쓰게 되면, 차라리 **별도 모델**을 만드는 게 읽기 쉬워요.\n\n`-> 리턴 타입`과 `response_model`을 **둘 다** 쓰면 `response_model`이 우선해요. 리턴 타입은 dict처럼 넓게 두고 response_model로 좁히는 방법도 있어요.' },
          ],
        },
      ],
    },
  ],
  questions: [
    {
      id: 'fa-10-01', type: 'mcq', source: 'response_model이 하는 일',
      question: 'DB에서 꺼낸 사용자 dict에 hashed_password가 들어 있다. 응답에서 비밀번호를 빼는 가장 FastAPI다운 방법은?',
      choices: ['return 전에 del user["hashed_password"]를 직접 한다', '비밀번호 컬럼을 DB에서 지운다', 'response_model=UserRead (hashed_password 필드 없음)를 지정한다', '프론트에서 비밀번호 필드를 무시한다'],
      answer: 2,
      choiceExplanations: [
        '동작은 하지만 엔드포인트마다 잊지 않고 해야 해요. 한 곳이라도 빠지면 유출이에요.',
        '로그인을 할 수 없게 돼요.',
        '정답. 응답 모델에 없는 필드는 자동으로 걸러져요. 선언으로 보장하는 방식이에요.',
        '이미 네트워크로 전송된 뒤라 의미가 없어요.',
      ],
      explanation: '응답 모델은 "화이트리스트"예요. 적힌 필드만 나가요. 새 컬럼(예: reset_token)이 DB 모델에 추가돼도 응답 모델에 넣지 않는 한 노출되지 않아요.\n반대로 dict를 그대로 돌려주는 방식은 "블랙리스트"라서 새 민감 필드가 생길 때마다 빼먹을 위험이 있어요.',
    },
    {
      id: 'fa-10-02', type: 'mcq', source: 'response_model이 하는 일',
      question: 'response_model=UserRead(id, email 필수)인데 함수가 {"email": "a@b.com"}만 돌려줬다. 결과는?',
      choices: ['200, {"email": "a@b.com"}', '200, {"id": null, "email": "a@b.com"}', '422 (클라이언트 잘못)', '500 (서버 응답 검증 실패)'],
      answer: 3,
      choiceExplanations: [
        '응답 모델이 id를 요구해서 검증에 실패해요.',
        'id는 필수라 null로 채워지지 않아요.',
        '요청은 정상이었어요. 잘못된 건 서버가 만든 응답이에요.',
        '정답. ResponseValidationError가 나고 500이 응답돼요. 서버 코드 버그라는 뜻이에요.',
      ],
      explanation: '입력 검증 실패 = 422(클라이언트가 고쳐야 함), 출력 검증 실패 = 500(서버가 고쳐야 함).\n출력 검증은 "API가 약속한 형식을 지킨다"는 안전장치예요. 터미널 로그에 어떤 필드가 문제인지 나오니 그걸 보고 고쳐요.',
    },
    {
      id: 'fa-10-03', type: 'short', source: 'response_model이 하는 일',
      question: '데코레이터 인자 대신 함수 정의에서 응답 모델을 지정하는 문법은? def read() __ UserRead: 의 빈칸 기호',
      answer: ['->'],
      explanation: '-> (리턴 타입 힌트)예요. def read(...) -> UserRead:\n최신 FastAPI는 리턴 타입을 응답 모델로 써요. 에디터도 리턴값이 UserRead인지 검사해 주는 장점이 있어요.\n단, ORM 객체를 리턴하면서 -> UserRead라고 쓰면 에디터가 타입 불일치를 경고할 수 있어요. 이럴 땐 response_model=UserRead를 데코레이터에 쓰는 게 깔끔해요.',
    },
    {
      id: 'fa-10-04', type: 'mcq', source: '입력 모델과 출력 모델을 나누는 이유',
      question: '하나의 모델 User(id, email, password, is_admin)를 입력과 출력에 모두 쓰면 생기는 문제를 모두 고르면?',
      choices: ['응답에 password가 노출될 수 있다', '클라이언트가 is_admin: true를 보내 관리자가 될 수 있다', '클라이언트가 id를 마음대로 정할 수 있다', '위의 세 가지 모두'],
      answer: 3,
      choiceExplanations: [
        '맞지만 이것만이 아니에요.',
        '맞지만 이것만이 아니에요.',
        '맞지만 이것만이 아니에요.',
        '정답. 입력 모델은 "받아도 되는 필드만", 출력 모델은 "보여줘도 되는 필드만" 가져야 해요.',
      ],
      explanation: '입출력 모델을 나누는 건 귀찮은 중복이 아니라 보안 설계예요.\n• UserCreate: email, password (받을 것만)\n• UserRead: id, email, created_at (보여줄 것만)\n• UserUpdate: nickname | None ... (수정 가능한 것만)\nis_admin 같은 권한 필드는 관리자 전용 API에서만 바꾸게 해요.',
    },
    {
      id: 'fa-10-05', type: 'ox', source: '입력 모델과 출력 모델을 나누는 이유',
      question: '응답 모델을 DB 모델과 분리해 두면, DB 컬럼 이름을 바꿔도 API 응답 형식은 그대로 유지할 수 있다.',
      answer: true,
      explanation: '맞아요. 응답 모델이 "공개 계약", DB 모델이 "내부 구현"이에요. 둘 사이 변환만 손보면 프론트는 영향을 받지 않아요.\n예: DB 컬럼을 name → full_name으로 바꿔도 응답 모델의 name 필드에 Field(validation_alias="full_name")를 주면 응답은 그대로 name으로 나가요.',
    },
    {
      id: 'fa-10-06', type: 'mcq', source: 'ORM 객체를 응답 모델로: from_attributes',
      question: 'SQLAlchemy 객체를 그대로 return 했더니 응답 검증 에러가 난다. 응답 모델에 무엇이 빠졌을까?',
      choices: ['model_config = ConfigDict(extra="forbid")', 'Field(alias=...)', '@field_validator', 'model_config = ConfigDict(from_attributes=True)'],
      answer: 3,
      choiceExplanations: [
        '모르는 필드 거절 설정이에요.',
        '이름 바꾸기 설정이에요.',
        '사용자 정의 검증이에요.',
        '정답. 이 설정이 있어야 Pydantic이 dict 키가 아니라 객체 속성(post.title)으로 값을 읽어요.',
      ],
      explanation: 'from_attributes=True(v1에서는 class Config: orm_mode = True)는 "객체의 속성에서 값을 읽어도 된다"는 허가예요.\n직접 변환할 때는 PostRead.model_validate(post). 오래된 코드의 PostRead.from_orm(post)와 같은 일이에요.',
    },
    {
      id: 'fa-10-07', type: 'short', source: 'ORM 객체를 응답 모델로: from_attributes',
      question: 'Pydantic v2에서 ORM 객체나 dict로부터 모델 객체를 만드는(검증하는) 클래스 메서드 이름은? PostRead.__________(obj)',
      answer: ['model_validate'],
      explanation: 'model_validate예요. dict도, (from_attributes=True면) ORM 객체도 받아요.\nJSON 문자열에서 바로 만들 때는 model_validate_json(json_str).\n이 메서드가 앞에서 배운 @classmethod(대체 생성자)의 대표 예예요.',
    },
    {
      id: 'fa-10-08', type: 'mcq', source: 'ORM 객체를 응답 모델로: from_attributes',
      question: 'PostRead에 author: UserSummary가 중첩돼 있다. post 객체를 리턴할 때 성능상 주의할 점은?',
      choices: ['아무 문제 없다', 'post.author를 읽는 순간 지연 로딩으로 추가 쿼리가 나가므로, 목록이라면 글마다 쿼리가 생기는 N+1 문제가 생길 수 있다', 'author는 응답에 포함될 수 없다', 'UserSummary는 from_attributes를 쓸 수 없다'],
      answer: 1,
      choiceExplanations: [
        '응답 변환 중에 DB 쿼리가 숨어서 나가요.',
        '정답. 글 20개면 작성자 조회 쿼리가 20번 더 나가요. selectinload(Post.author) 등으로 미리 함께 불러와야 해요.',
        '중첩 응답 모델로 잘 포함돼요.',
        '안쪽 모델에도 from_attributes를 주면 돼요.',
      ],
      explanation: '응답 모델 변환은 "속성을 읽는" 과정이고, ORM에서 관계 속성을 읽으면 그때 쿼리가 나갈 수 있어요. 코드에 쿼리가 안 보이니 놓치기 쉬워요.\n비동기 SQLAlchemy에서는 이 지연 로딩 자체가 에러(MissingGreenlet)가 나요. 그래서 관계는 쿼리에서 명시적으로 로딩하는 습관이 중요해요(SQLAlchemy 관계·비동기 토픽).',
    },
    {
      id: 'fa-10-09', type: 'mcq', source: '응답 다듬기 옵션',
      question: '게시글 목록과 전체 개수를 함께 돌려주려 한다. 가장 알맞은 응답 모델은?',
      choices: ['response_model=list[PostRead] 에 total을 헤더로만 보낸다', 'response_model=dict', 'class Page(BaseModel): items: list[PostRead]; total: int 를 만들어 response_model=Page', 'response_model=int'],
      answer: 2,
      choiceExplanations: [
        '가능한 방식(X-Total-Count 헤더)이지만, 본문만 보는 프론트에서 놓치기 쉬워요.',
        '검증과 문서화가 사라져요.',
        '정답. 목록과 메타 정보를 한 구조로 명확하게 표현해요.',
        '개수만 돌려줘요.',
      ],
      explanation: '목록 API는 처음부터 { items, total, page, size } 같은 감싼 구조로 시작하는 게 좋아요. 배열만 돌려주다가 나중에 total을 추가하려면 응답 최상위 구조가 바뀌어 프론트가 깨져요.\n제네릭 모델(class Page(BaseModel, Generic[T]))로 만들면 모든 목록 API에서 재사용할 수 있어요.',
    },
    {
      id: 'fa-10-10', type: 'mcq', source: '응답 다듬기 옵션',
      question: 'response_model_exclude_unset=True의 효과는?',
      choices: ['리턴값에서 명시적으로 설정되지 않고 기본값으로 남은 필드를 응답에서 뺀다', 'None인 필드를 모두 뺀다', '요청에서 안 보낸 필드를 422로 거절한다', '응답을 압축한다'],
      answer: 0,
      choiceExplanations: [
        '정답. 예를 들어 기본값이 많은 설정 객체를 돌려줄 때 실제로 지정된 값만 보여 줄 수 있어요.',
        '그건 response_model_exclude_none이에요.',
        '요청 검증과는 관계없어요.',
        '압축(gzip)은 GZipMiddleware예요.',
      ],
      explanation: 'model_dump(exclude_unset=True)의 응답 버전이라고 보면 돼요.\n다만 프론트 입장에서는 "필드가 있다 없다"가 바뀌는 응답보다 "항상 같은 모양"이 다루기 쉬워요. 꼭 필요할 때만 쓰세요.',
    },
    {
      id: 'fa-10-11', type: 'ox', source: '응답 다듬기 옵션',
      question: '데코레이터의 response_model과 함수의 -> 리턴 타입을 둘 다 지정하면 response_model이 우선한다.',
      answer: true,
      explanation: '맞아요. response_model이 명시돼 있으면 그것을 응답 모델로 써요.\n활용: 함수는 -> Any나 ORM 타입으로 두어 에디터 경고를 피하고, 실제 응답 형태는 response_model=PostRead로 지정하는 식이에요.',
    },
    {
      id: 'fa-10-12', type: 'mcq', source: 'response_model이 하는 일',
      question: '응답 모델을 지정하지 않고 SQLAlchemy 객체를 그대로 return 하면 어떻게 될까?',
      choices: ['모든 컬럼이 깔끔한 JSON으로 나간다', '자동으로 404가 된다', 'FastAPI가 객체를 JSON으로 바꾸는 과정에서 내부 속성이 섞이거나 직렬화 에러가 날 수 있다', '응답 본문이 비어 있다'],
      answer: 2,
      choiceExplanations: [
        '그렇게 되려면 응답 모델이 있어야 해요.',
        '상태 코드와 무관해요.',
        '정답. jsonable_encoder가 객체의 __dict__를 읽으면서 _sa_instance_state 같은 내부 값 때문에 에러가 나거나 원치 않는 필드가 노출될 수 있어요.',
        '본문은 무엇이든 만들어지려 해요.',
      ],
      explanation: 'ORM 객체를 내보낼 땐 항상 응답 모델(from_attributes=True)을 거치게 하세요. 그래야 ① 어떤 필드가 나갈지 확정되고 ② 직렬화가 안정적이고 ③ 문서에 응답 구조가 표시돼요.',
    },
  ],
}

export default topic
