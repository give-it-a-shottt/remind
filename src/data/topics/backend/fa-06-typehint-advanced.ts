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
      points: [
        'int | str 또는 Union[int, str] 은 "int이거나 str"이다. 여러 형태의 값을 받을 수 있을 때 쓴다.',
        'Pydantic은 Union 값을 검증할 때 들어온 값과 가장 잘 맞는 타입을 고른다(smart 모드). 예를 들어 int | str 에 "5"가 오면 문자열 그대로 "5"로 둔다. 정확히 맞는 타입이 우선이기 때문이다.',
        'Union이 많아지면 "이 값이 무엇인지" 매번 확인해야 하므로 코드가 복잡해진다. 가능하면 타입 하나로 좁히는 설계가 좋다.',
        '응답 모델에서 성공/실패 등 구조가 다른 모델을 Union으로 묶을 수도 있다. 이때 공통 필드(예: type: Literal["card"])로 구분하면 Pydantic이 정확히 고른다(구분된 유니언, discriminated union).',
      ],
      code: `from typing import Literal
from pydantic import BaseModel, Field

class Card(BaseModel):
    type: Literal["card"]
    card_no: str

class Bank(BaseModel):
    type: Literal["bank"]
    account: str

class Payment(BaseModel):
    method: Card | Bank = Field(discriminator="type")`,
    },
    {
      title: 'Literal: 정해진 값만 허용',
      points: [
        'Literal["asc", "desc"] 는 "asc" 또는 "desc"라는 값 자체만 허용한다. 그 밖의 값은 422로 거절된다.',
        'Enum보다 가볍다. 별도 클래스를 만들 필요 없이 함수 시그니처에 바로 쓴다. 값 목록을 여러 곳에서 재사용하거나 값마다 동작을 붙이려면 Enum이 낫다.',
        '/docs에 허용 값 목록이 표시된다.',
      ],
      code: `from typing import Literal

@app.get("/posts")
def list_posts(order: Literal["asc", "desc"] = "desc"):
    ...
# ?order=random → 422`,
    },
    {
      title: 'Annotated: 타입에 메타데이터 붙이기',
      points: [
        'Annotated[타입, 추가정보...] 는 "타입은 이것이고, 덧붙여 이런 정보도 있다"는 표현이다. 파이썬은 첫 번째 칸(타입)만 보고, FastAPI·Pydantic은 나머지 칸의 정보를 읽는다.',
        'FastAPI 권장 문법: q: Annotated[str | None, Query(max_length=50)] = None. 기본값은 = 오른쪽에, 검증 규칙은 Annotated 안에 둔다.',
        '예전 문법 q: str | None = Query(default=None, max_length=50) 도 동작하지만, Annotated 문법은 기본값이 진짜 파이썬 기본값이라 함수를 FastAPI 밖에서 직접 호출해도 자연스럽다.',
        '반복되는 선언은 별칭으로 만들어 재사용한다. PageSize = Annotated[int, Query(ge=1, le=100)]. 의존성도 SessionDep = Annotated[Session, Depends(get_session)] 처럼 만든다.',
      ],
      code: `from typing import Annotated
from fastapi import Query, Depends

PageSize = Annotated[int, Query(ge=1, le=100)]
SessionDep = Annotated[Session, Depends(get_session)]

@app.get("/posts")
def list_posts(db: SessionDep, size: PageSize = 10, q: Annotated[str | None, Query(max_length=50)] = None):
    ...`,
    },
    {
      title: '문자열 검증과 그 밖의 유용한 타입',
      points: [
        '문자열 규칙: min_length, max_length, pattern(정규식). 예: Query(pattern="^[a-z0-9_]+$").',
        '날짜·시간: datetime, date, time. "2026-10-20" 같은 ISO 문자열이 자동으로 date로 변환된다. 응답에서는 다시 ISO 문자열이 된다.',
        'UUID: 추측하기 어려운 ID. 잘못된 형식이면 422.',
        'Pydantic 특수 타입: EmailStr(이메일 형식, email-validator 패키지 필요), HttpUrl(URL 형식), PositiveInt(양의 정수), SecretStr(출력할 때 ****로 가려지는 문자열).',
        'Any는 "아무 타입이나"로 검증을 포기하는 것이다. 꼭 필요한 곳 외에는 쓰지 않는다.',
      ],
      code: `from datetime import date
from uuid import UUID
from pydantic import EmailStr

@app.get("/reports/{report_id}")
def report(report_id: UUID, start: date, end: date):
    ...
# /reports/123e4567-e89b-12d3-a456-426614174000?start=2026-10-01&end=2026-10-20`,
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
