import type { Topic } from '../../types'

const topic: Topic = {
  id: 'fa-06-typehint-advanced',
  track: 'backend',
  group: 'FastAPI',
  title: '타입 힌트 고급: Union · Literal · Annotated',
  order: 26,
  sections: [
    {
      title: 'Union: 여러 타입 중 하나',
      slides: [
        {
          title: 'int이거나 str이거나',
          blocks: [
            { type: 'say', text: '`int | str`(또는 `Union[int, str]`)은 "int **이거나** str"이에요. 여러 형태의 값을 받아야 할 때 써요.\n\nPydantic은 Union 값이 들어오면 **가장 잘 맞는 타입**을 골라요(smart 모드). `int | str` 필드에 문자열 `"10"`이 오면? 문자열이 **정확히 맞는** 타입이니 `"10"` 그대로 둬요. 억지로 int로 바꾸지 않아요.' },
            { type: 'note', tone: 'tip', text: 'Union이 많아지면 코드 곳곳에서 "이 값이 지금 int야 str이야?"를 매번 확인해야 해요. 가능하면 **타입 하나로 좁히는** 설계가 좋아요. 그리고 `Any`는 "아무거나"라서 **검증을 포기**하는 거예요. 꼭 필요할 때만 써요.' },
          ],
        },
        {
          title: '구분된 유니언: 꼬리표로 고르기',
          blocks: [
            { type: 'code', code: `from typing import Literal
from pydantic import BaseModel, Field

class Card(BaseModel):
    type: Literal["card"]      # 꼬리표
    card_no: str

class Bank(BaseModel):
    type: Literal["bank"]      # 꼬리표
    account: str

class Payment(BaseModel):
    method: Card | Bank = Field(discriminator="type")` },
            { type: 'say', text: '결제 수단이 카드 **또는** 계좌라면, 들어온 JSON이 어느 쪽인지 Pydantic이 헷갈릴 수 있어요. 그래서 모델마다 **공통 필드 `type`에 고정된 값**(꼬리표)을 두고, `discriminator="type"`으로 "이 필드를 보고 골라"라고 알려 줘요. 이걸 **구분된 유니언**(discriminated union)이라고 해요.\n\n`{"type": "bank", ...}`가 오면 바로 Bank로 검증하니 빠르고, 에러 메시지도 정확해요.' },
          ],
        },
      ],
    },
    {
      title: 'Literal: 정해진 값만 허용',
      slides: [
        {
          title: '값 자체를 타입으로',
          blocks: [
            { type: 'code', code: `from typing import Literal

@app.get("/posts")
def list_posts(order: Literal["asc", "desc"] = "desc"):
    ...
# ?order=random → 422
# ?order=DESC   → 422 (대소문자도 정확히 같아야 해요)` },
            { type: 'say', text: '`Literal["asc", "desc"]`는 **"asc" 또는 "desc"라는 값 자체만** 허용해요. 그 밖의 값은 422로 거절되고, `/docs`에 허용 값 목록이 표시돼요.\n\nfa-03에서 배운 **Enum**과 비슷한데 더 가벼워요. 클래스를 따로 만들 필요 없이 시그니처에 바로 써요.' },
            {
              type: 'table',
              head: ['', 'Literal', 'Enum'],
              rows: [
                ['만들기', '한 줄, 바로 사용', '클래스 정의 필요'],
                ['어울리는 곳', '한두 곳에서 쓰는 간단한 선택지', '여러 곳에서 **재사용**, 값마다 동작을 붙일 때'],
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'Annotated: 타입에 메타데이터 붙이기',
      slides: [
        {
          title: '타입 + 덧붙인 정보',
          blocks: [
            { type: 'say', text: '`Annotated[타입, 추가정보...]`는 "타입은 이거고, 덧붙여 이런 정보도 있어"라는 표현이에요. **파이썬은 첫 칸(타입)만** 보고, FastAPI·Pydantic은 **나머지 칸의 정보**를 읽어요.' },
            { type: 'code', code: `# A: 예전 문법
def f(q: str | None = Query(default=None, max_length=50)): ...

# B: Annotated 문법 (권장)
def f(q: Annotated[str | None, Query(max_length=50)] = None): ...` },
            { type: 'say', text: '둘 다 FastAPI에서는 똑같이 동작해요. B가 나은 이유는 `= None`이 **진짜 파이썬 기본값**이라서예요. 이 함수를 테스트 코드 등 FastAPI **밖에서 직접 호출**해도 자연스럽게 동작해요. A는 기본값 자리에 `Query(...)` 객체가 들어가 있어서 직접 호출하면 이상해져요.' },
          ],
        },
        {
          title: '반복되는 선언은 별칭으로',
          blocks: [
            { type: 'code', code: `from typing import Annotated
from fastapi import Query, Depends

PageSize = Annotated[int, Query(ge=1, le=100)]
SessionDep = Annotated[Session, Depends(get_session)]

@app.get("/posts")
def list_posts(db: SessionDep, size: PageSize = 10):
    ...` },
            { type: 'say', text: 'Annotated의 진짜 힘은 **이름을 붙여 재사용**할 수 있다는 거예요. 모든 라우트에서 반복하던 `db: Session = Depends(get_session)`가 `db: SessionDep` 한마디로 줄어요. 규칙을 바꿀 때도 별칭 한 곳만 고치면 돼요. 의존성 수업에서 계속 쓸 모양이에요.' },
          ],
        },
      ],
    },
    {
      title: '문자열 검증과 그 밖의 유용한 타입',
      slides: [
        {
          title: '문자열 규칙과 날짜',
          blocks: [
            { type: 'code', code: `from datetime import date
from uuid import UUID

@app.get("/reports/{report_id}")
def report(
    report_id: UUID,
    start: date,
    end: date,
    code: Annotated[str, Query(min_length=2, max_length=10, pattern="^[a-z0-9_]+$")] = "all",
):
    ...
# /reports/123e4567-e89b-12d3-a456-426614174000?start=2026-10-01&end=2026-10-20` },
            { type: 'list', items: ['문자열: `min_length`, `max_length`, `pattern`(정규식)', '`date`, `datetime`: `"2026-10-20"` 같은 ISO 문자열을 **자동 변환**. `2026-02-30`처럼 **없는 날짜는 422**', '`UUID`: 추측하기 어려운 ID. 형식이 틀리면 422'] },
          ],
        },
        {
          title: 'Pydantic 특수 타입',
          blocks: [
            {
              type: 'table',
              head: ['타입', '검사하는 것'],
              rows: [
                ['`EmailStr`', '이메일 형식 (`email-validator` 패키지 필요)'],
                ['`HttpUrl`', 'URL 형식'],
                ['`PositiveInt`', '양의 정수'],
                ['`SecretStr`', 'print·로그에 `**********`로 **가려져** 나오는 문자열'],
              ],
            },
            { type: 'say', text: '회원가입 이메일 검사를 정규식으로 직접 짜는 대신 `email: EmailStr` 한 줄이면 돼요. 비밀번호는 `SecretStr`로 받으면 실수로 로그에 찍혀도 값이 드러나지 않아요. 진짜 값이 필요할 땐 `.get_secret_value()`로 꺼내요.' },
          ],
        },
      ],
    },
  ],
  questions: [
    {
      id: 'fa-06-01', type: 'mcq', source: 'Union: 여러 타입 중 하나',
      question: 'value: int | str 로 선언한 필드에 JSON 값 "10"(문자열)이 들어왔다. Pydantic v2 기본 동작에서 value는?',
      choices: ['10 (int로 변환)', '422 에러', 'None', '"10" (str 그대로)'],
      answer: 3,
      choiceExplanations: [
        '변환해서 맞출 수도 있지만, 이미 정확히 맞는 str이 후보에 있어서 그쪽이 우선이에요.',
        '두 타입 중 하나와 맞으니 통과예요.',
        '값이 들어왔으니 None이 아니에요.',
        '정답. smart 모드는 "변환 없이 정확히 맞는 타입"을 먼저 골라요.',
      ],
      explanation: 'Pydantic v2의 Union smart 모드: 정확히 일치하는 타입 → 그다음 변환 가능한 타입 순으로 골라요.\n그래서 Union은 "결과 타입이 들어오는 값에 따라 달라질 수 있다"는 점을 늘 염두에 둬야 해요. 의도가 분명하면 타입을 하나로 좁히는 게 가장 안전해요.',
    },
    {
      id: 'fa-06-02', type: 'mcq', source: 'Union: 여러 타입 중 하나',
      question: '결제 수단이 카드(card_no)나 계좌(account) 중 하나다. 들어온 JSON이 어느 모델인지 Pydantic이 확실히 고르게 하는 가장 좋은 설계는?',
      choices: ['두 모델의 모든 필드를 하나의 모델에 Optional로 합친다', 'method: dict 로 받는다', '각 모델에 type: Literal["card"] / Literal["bank"] 필드를 두고 discriminator="type"으로 구분된 유니언을 만든다', 'method: Any 로 받는다'],
      answer: 2,
      choiceExplanations: [
        '모든 필드가 선택이 되면 "카드인데 card_no가 없는" 잘못된 데이터도 통과해요.',
        '검증을 포기하는 것과 같아요.',
        '정답. type 값만 보고 바로 맞는 모델로 검증해서 빠르고, 에러 메시지도 정확해요.',
        '검증을 완전히 포기해요.',
      ],
      explanation: '구분된 유니언(discriminated union)은 "꼬리표 필드로 종류를 구분"하는 패턴이에요. 프론트의 TypeScript에서도 같은 패턴(태그 유니언)을 써서 양쪽 타입이 잘 맞아요.\n여러 모델을 Optional로 뭉치는 건 흔한 안티패턴이에요. 규칙이 사라져 이상한 조합을 막을 수 없거든요.',
    },
    {
      id: 'fa-06-03', type: 'mcq', source: 'Literal: 정해진 값만 허용',
      question: 'order: Literal["asc", "desc"] = "desc" 에 ?order=DESC 가 오면?',
      choices: ['"desc"로 자동 변환', '422 에러', '"DESC" 그대로 통과', '기본값 "desc" 적용'],
      answer: 1,
      choiceExplanations: [
        'Literal은 대소문자를 바꿔 주지 않아요.',
        '정답. 값이 정확히 일치해야 해요. "DESC"는 허용 목록에 없어요.',
        '허용 목록에 없는 값은 통과하지 못해요.',
        '값을 보냈으니 기본값은 쓰이지 않아요.',
      ],
      explanation: 'Literal은 "값 자체"를 비교해요. 대소문자를 모두 받고 싶다면 허용 값을 늘리거나, 문자열로 받아 .lower()로 정규화한 뒤 검사하거나, Pydantic의 BeforeValidator로 전처리하는 방법이 있어요.',
    },
    {
      id: 'fa-06-04', type: 'short', source: 'Literal: 정해진 값만 허용',
      question: '별도 클래스 없이 "small", "medium", "large" 세 문자열만 허용하는 타입 힌트를 쓰려면 typing에서 무엇을 import하나요?',
      answer: ['Literal', 'typing.Literal'],
      explanation: 'Literal이에요. size: Literal["small", "medium", "large"].\nEnum과 비교하면: Literal은 가볍게 한 곳에서 쓸 때, Enum은 여러 곳에서 재사용하거나 값에 이름·동작을 붙일 때 좋아요.',
    },
    {
      id: 'fa-06-05', type: 'mcq', source: 'Annotated: 타입에 메타데이터 붙이기',
      question: 'q: Annotated[str, Query(max_length=10)] 에서 일반 파이썬이 "q의 타입"으로 인식하는 것은?',
      choices: ['Annotated', 'Query', 'str과 Query를 합친 새 타입', 'str'],
      answer: 3,
      choiceExplanations: [
        'Annotated는 감싸는 표시일 뿐이에요.',
        'Query는 메타데이터예요. 파이썬과 에디터는 무시해요.',
        '새 타입이 만들어지지 않아요.',
        '정답. 첫 번째 칸이 실제 타입이고, 나머지는 FastAPI 같은 도구를 위한 메타데이터예요.',
      ],
      explanation: 'Annotated[T, x, y]: 타입은 T, x와 y는 "덧붙인 정보". 에디터·mypy는 T만 보고, FastAPI는 x(Query, Path, Depends 등)를 읽어 동작을 정해요.\n덕분에 "타입"과 "FastAPI용 규칙"이 섞이지 않고 깔끔하게 분리돼요.',
    },
    {
      id: 'fa-06-06', type: 'mcq', source: 'Annotated: 타입에 메타데이터 붙이기',
      question: '두 선언은 FastAPI에서 같은 결과를 낸다. Annotated 쪽(B)의 장점으로 맞는 것은?',
      code: `# A
def f(q: str | None = Query(default=None, max_length=50)): ...

# B
def f(q: Annotated[str | None, Query(max_length=50)] = None): ...`,
      choices: ['B가 실행 속도가 더 빠르다', 'A는 FastAPI에서 동작하지 않는다', 'B는 기본값이 진짜 파이썬 기본값(None)이라, 테스트 등에서 f()를 직접 호출해도 q가 None이 된다', 'B는 max_length 검증을 하지 않는다'],
      answer: 2,
      choiceExplanations: [
        '속도 차이는 없어요.',
        'A도 동작해요. 다만 권장되지 않는 옛 방식이에요.',
        '정답. A를 직접 f()로 호출하면 q에 Query 객체가 들어가요. B는 그냥 None이에요.',
        'B도 똑같이 검증해요.',
      ],
      explanation: 'FastAPI 공식 문서는 Annotated 문법을 권장해요.\n장점: ① 기본값이 자연스러움 ② 타입과 규칙이 분리돼 읽기 쉬움 ③ PageSize = Annotated[...] 처럼 별칭으로 재사용 가능 ④ 같은 함수를 FastAPI 밖(일반 호출, 다른 프레임워크)에서도 쓰기 좋음.',
    },
    {
      id: 'fa-06-07', type: 'mcq', source: 'Annotated: 타입에 메타데이터 붙이기',
      question: '모든 라우트에서 db: Session = Depends(get_session)을 반복해서 쓰고 있다. Annotated로 줄이는 방법은?',
      choices: ['Session = Depends(get_session) 으로 덮어쓴다', 'SessionDep = Annotated[Session, Depends(get_session)] 를 만들고 db: SessionDep 로 쓴다', 'global db 로 전역 세션을 하나 만든다', '데코레이터로 db를 주입한다'],
      answer: 1,
      choiceExplanations: [
        'Session 클래스 이름을 덮어쓰면 다른 곳이 깨져요.',
        '정답. 한 번 정의한 별칭을 어디서나 타입처럼 쓸 수 있어요.',
        '전역 세션 하나를 모든 요청이 공유하면 트랜잭션이 섞이고 동시성 문제가 생겨요. 세션은 요청마다 따로 만들어야 해요.',
        'FastAPI에서 주입은 Depends가 정석이에요.',
      ],
      explanation: '공식 튜토리얼도 SessionDep = Annotated[Session, Depends(get_session)] 패턴을 써요. 현재 사용자도 CurrentUser = Annotated[User, Depends(get_current_user)]처럼 만들면 라우트 시그니처가 짧고 읽기 좋아져요.',
    },
    {
      id: 'fa-06-08', type: 'short', source: '문자열 검증과 그 밖의 유용한 타입',
      question: '쿼리 문자열이 정규식 ^[a-z]+$ 에 맞아야 할 때 Query에 주는 키워드 인자 이름은? (Pydantic v2 / 최신 FastAPI 기준)',
      answer: ['pattern', 'pattern='],
      explanation: 'pattern이에요. Query(pattern="^[a-z]+$").\n예전 버전(Pydantic v1 시절 FastAPI)에서는 regex라는 이름을 썼어요. 오래된 코드에서 regex=를 보면 pattern으로 읽으면 돼요.',
    },
    {
      id: 'fa-06-09', type: 'mcq', source: '문자열 검증과 그 밖의 유용한 타입',
      question: 'start: date 로 선언한 쿼리 파라미터에 ?start=2026-02-30 이 오면?',
      choices: ['2026-03-02로 자동 보정', '문자열 "2026-02-30" 그대로', 'None', '422 에러'],
      answer: 3,
      choiceExplanations: [
        '자동 보정하지 않아요. 존재하지 않는 날짜예요.',
        'date 타입으로 선언했으니 문자열로 남지 않아요.',
        '값이 들어왔으니 None이 아니에요.',
        '정답. 2월 30일은 없어서 date로 변환할 수 없어요.',
      ],
      explanation: 'date, datetime, UUID 같은 타입을 쓰면 "형식 + 실제로 가능한 값"까지 검사해 줘요. 직접 문자열을 split해서 검사하는 코드는 대부분 필요 없어져요.\n시작일이 종료일보다 늦은지 같은 "여러 값 사이의 규칙"은 Pydantic 모델의 model_validator나 함수 안에서 따로 검사해요.',
    },
    {
      id: 'fa-06-10', type: 'mcq', source: '문자열 검증과 그 밖의 유용한 타입',
      question: '회원가입 요청에서 이메일 형식을 자동으로 검사하고 싶다. 가장 알맞은 필드 타입은?',
      choices: ['email: str', 'email: EmailStr (pydantic, email-validator 설치 필요)', 'email: Any', 'email: bytes'],
      answer: 1,
      choiceExplanations: [
        '아무 문자열이나 통과해요.',
        '정답. "abc" 같은 값은 422로 거절돼요.',
        '검증을 포기해요.',
        '이메일은 문자열이에요.',
      ],
      explanation: 'EmailStr, HttpUrl, PositiveInt처럼 의미 있는 타입을 쓰면 검증 코드를 직접 쓰지 않아도 돼요.\n단, 형식이 맞다고 실제로 존재하는 이메일이라는 뜻은 아니에요. 진짜 소유 확인은 인증 메일 같은 별도 절차가 필요해요.',
    },
    {
      id: 'fa-06-11', type: 'ox', source: '문자열 검증과 그 밖의 유용한 타입',
      question: '비밀번호 필드를 SecretStr로 선언하면 print나 로그에 값이 ********** 처럼 가려져 출력된다.',
      answer: true,
      explanation: '맞아요. SecretStr은 실수로 비밀번호가 로그에 찍히는 사고를 줄여 줘요. 실제 값이 필요할 땐 .get_secret_value()로 꺼내요.\n그래도 비밀번호는 DB에 절대 원문으로 저장하지 않고 해시해서 저장해야 해요(인증 토픽).',
    },
    {
      id: 'fa-06-12', type: 'ox', source: 'Union: 여러 타입 중 하나',
      question: 'Any 타입으로 선언하면 FastAPI가 값을 가장 엄격하게 검증한다.',
      answer: false,
      explanation: '반대예요. Any는 "어떤 값이든 허용"이라 검증을 하지 않아요.\n외부 API 응답처럼 구조를 정말 모를 때만 잠깐 쓰고, 구조가 파악되면 Pydantic 모델로 바꾸는 게 좋아요.',
    },
  ],
}

export default topic
