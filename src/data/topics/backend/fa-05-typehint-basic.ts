import type { Topic } from '../../types'

const topic: Topic = {
  id: 'fa-05-typehint-basic',
  track: 'backend',
  group: 'FastAPI',
  title: '타입 힌트 기본',
  order: 25,
  sections: [
    {
      title: '타입 힌트란',
      points: [
        '타입 힌트는 변수·파라미터·리턴값에 "이건 어떤 타입이어야 한다"고 적는 표시다. name: str, def add(a: int, b: int) -> int.',
        '파이썬 자체는 타입 힌트를 실행 중에 검사하지 않는다. add("1", "2")도 그냥 실행돼 "12"가 나온다. 힌트는 사람과 도구(에디터, mypy, FastAPI, Pydantic)를 위한 정보다.',
        '에디터는 힌트를 보고 자동 완성과 오류 표시를 해 준다. mypy·pyright 같은 정적 검사기는 실행 전에 타입 실수를 찾아 준다.',
        'FastAPI는 이 힌트를 "실행 시 검증 규칙"으로 바꿔 쓰는 특별한 경우다. 그래서 FastAPI에서는 힌트가 곧 동작이다.',
      ],
      code: `def add(a: int, b: int) -> int:
    return a + b

print(add(1, 2))        # 3
print(add("1", "2"))    # "12"  ← 파이썬은 막지 않음 (에디터는 경고)`,
    },
    {
      title: '기본 타입과 컬렉션 타입',
      points: [
        '기본 타입: int, float, str, bool, bytes.',
        '컬렉션은 안에 든 값의 타입까지 적는다. list[str](문자열 리스트), dict[str, int](키 문자열·값 정수), set[int], tuple[int, str](정확히 두 칸), tuple[int, ...](길이 자유).',
        '파이썬 3.9부터 list[str]처럼 소문자 내장 타입을 바로 쓸 수 있다. 예전 코드에서는 from typing import List, Dict 후 List[str]로 썼다. 의미는 같다.',
        '리턴 타입은 -> 로 적는다. 아무것도 리턴하지 않는 함수는 -> None.',
      ],
      code: `def count_words(words: list[str]) -> dict[str, int]:
    result: dict[str, int] = {}
    for w in words:
        result[w] = result.get(w, 0) + 1
    return result

point: tuple[float, float] = (37.5, 127.0)`,
    },
    {
      title: 'None이 될 수 있는 값',
      points: [
        '값이 없을 수도 있으면 str | None 으로 쓴다(파이썬 3.10+). 예전 문법 Optional[str] 과 같은 뜻이다.',
        '주의: Optional은 "생략 가능"이 아니라 "None일 수 있음"이라는 뜻이다. FastAPI에서 생략 가능하게 하려면 기본값(= None)을 줘야 한다.',
        'None일 수 있는 값을 쓸 때는 먼저 확인한다. if user is None: raise HTTPException(404). 확인 없이 user.name 하면 AttributeError가 나서 500이 된다.',
        'DB에서 한 건을 찾는 함수(db.get(User, id))는 대부분 "찾으면 객체, 없으면 None"을 돌려준다. 그래서 리턴 타입이 User | None 이다.',
      ],
      code: `def find_user(user_id: int) -> User | None:
    return db.get(User, user_id)

user = find_user(3)
if user is None:
    raise HTTPException(status_code=404, detail="사용자가 없습니다")
print(user.name)   # 여기서는 user 가 User 라고 확신할 수 있음`,
    },
    {
      title: 'FastAPI는 힌트로 무엇을 정하나',
      points: [
        '파라미터의 타입 힌트와 기본값만으로 FastAPI는 ① 어디서 값을 읽을지(경로·쿼리·본문) ② 어떤 타입으로 바꿀지 ③ 필수인지 ④ 문서에 어떻게 보여줄지를 결정한다.',
        'Pydantic 모델 타입(item: Item)이면 요청 본문(JSON)에서 읽는다. 단순 타입이면 쿼리, 경로에 같은 이름이 있으면 경로다.',
        '리턴 타입 힌트(-> PostRead)를 적으면 FastAPI가 이를 응답 모델로 써서 출력 데이터를 검증·필터링하고 문서에 응답 구조를 표시한다.',
        '타입 힌트가 틀리면 동작이 틀린다. 예를 들어 ID를 str로 적으면 숫자 검증이 사라지고, 본문으로 받으려던 dict를 단순 타입으로 적으면 쿼리로 해석된다.',
      ],
      code: `@app.post("/posts/{board}")
def create_post(
    board: str,            # 경로 (경로에 {board} 있음)
    post: PostCreate,      # 본문 (Pydantic 모델)
    notify: bool = False,  # 쿼리 (단순 타입 + 기본값)
) -> PostRead:             # 응답 모델
    ...`,
    },
  ],
  questions: [
    {
      id: 'fa-05-01', type: 'ox', source: '타입 힌트란',
      question: '일반 파이썬 함수 def add(a: int, b: int)에 add("x", "y")를 넣으면 실행 중에 TypeError가 발생한다.',
      answer: false,
      explanation: '일반 파이썬은 타입 힌트를 실행 중에 검사하지 않아요. "x" + "y" = "xy"가 그대로 리턴돼요.\n에디터나 mypy가 실행 전에 경고는 해 줘요. "실행 중 검사"는 Pydantic·FastAPI 같은 라이브러리가 힌트를 읽어 직접 할 때만 일어나요.',
    },
    {
      id: 'fa-05-02', type: 'mcq', source: '타입 힌트란',
      question: 'FastAPI에서 타입 힌트가 특별히 중요한 이유는?',
      choices: ['파이썬 실행 속도를 높여서', 'FastAPI가 힌트를 읽어 요청 값의 위치·변환·검증·문서를 결정해서', '힌트가 없으면 서버가 시작되지 않아서', '힌트를 쓰면 DB가 자동으로 만들어져서'],
      answer: 1,
      choiceExplanations: [
        '파이썬에서 힌트는 속도와 관계없어요.',
        '정답. 일반 파이썬에선 "참고 정보"인 힌트가 FastAPI에선 "동작 규칙"이 돼요.',
        '힌트가 없어도 시작은 돼요. 대신 모든 값이 str로 들어오고 검증이 없어요.',
        'DB 테이블은 SQLAlchemy 모델로 따로 만들어요.',
      ],
      explanation: 'FastAPI는 inspect 모듈로 함수 시그니처를 읽어요. 각 파라미터의 이름·타입·기본값을 보고 "경로/쿼리/본문 중 어디서, 어떤 타입으로, 필수인지"를 정해요.\n그래서 FastAPI 코드를 읽을 때는 함수 본문보다 시그니처를 먼저 보는 게 요령이에요.',
    },
    {
      id: 'fa-05-03', type: 'mcq', source: '기본 타입과 컬렉션 타입',
      question: '"사용자 이름(문자열)을 키로, 점수(정수) 목록을 값으로 갖는 사전"의 타입 힌트는?',
      choices: ['dict[str, int]', 'list[dict[str, int]]', 'dict[str, list[int]]', 'dict[list[int], str]'],
      answer: 2,
      choiceExplanations: [
        '값이 정수 하나예요. 목록이 아니에요.',
        '사전들의 리스트예요. 구조가 달라요.',
        '정답. 예: {"kim": [90, 85], "lee": [70]}.',
        '키와 값이 뒤바뀌었고, list는 사전의 키가 될 수 없어요(변경 가능한 객체라 해시 불가).',
      ],
      explanation: 'dict[키타입, 값타입], list[원소타입]을 안쪽부터 조립하면 돼요.\nFastAPI 응답 모델에 이런 타입을 쓰면 Pydantic이 안쪽 값까지 검증해요. 예: scores: dict[str, list[int]]에 {"kim": ["a"]}가 오면 422.',
    },
    {
      id: 'fa-05-04', type: 'short', source: '기본 타입과 컬렉션 타입',
      question: '아무 값도 리턴하지 않는 함수의 리턴 타입 힌트는? def log(msg: str) -> ____',
      answer: ['None'],
      explanation: '-> None이에요. 파이썬 함수는 return이 없으면 None을 돌려주기 때문이에요.\nFastAPI에서 DELETE 엔드포인트를 status_code=204로 만들고 아무것도 돌려주지 않을 때 -> None을 써요.',
    },
    {
      id: 'fa-05-05', type: 'mcq', source: '기본 타입과 컬렉션 타입',
      question: '다음 중 길이가 정확히 2이고 (위도 float, 경도 float)인 값을 나타내는 힌트는?',
      choices: ['tuple[float, float]', 'list[float]', 'tuple[float, ...]', 'set[float]'],
      answer: 0,
      choiceExplanations: [
        '정답. tuple은 칸마다 타입을 적어 길이와 순서를 고정해요.',
        '길이 제한이 없어요.',
        '...은 "같은 타입이 몇 개든"이라 길이가 고정되지 않아요.',
        'set은 순서가 없고 중복도 사라져요.',
      ],
      explanation: 'list[T]는 "T가 몇 개든", tuple[A, B]는 "정확히 A, B 두 칸".\n좌표, (값, 개수) 쌍처럼 칸의 의미가 정해진 데이터는 tuple이 잘 맞아요. 칸이 많아지면 Pydantic 모델이나 dataclass로 이름을 붙이는 게 읽기 좋아요.',
    },
    {
      id: 'fa-05-06', type: 'mcq', source: 'None이 될 수 있는 값',
      question: 'from typing import Optional 의 Optional[str] 과 같은 뜻의 최신 문법은?',
      choices: ['str?', 'str | None', 'str or None', 'Union[str]'],
      answer: 1,
      choiceExplanations: [
        '파이썬에는 이런 문법이 없어요(TypeScript, Kotlin 스타일).',
        '정답. 파이썬 3.10부터 | 로 타입을 합칠 수 있어요.',
        'or는 논리 연산자예요. 타입 힌트로 쓰면 "str"만 남아요.',
        'Union[str]은 그냥 str이에요. Union[str, None]이어야 Optional[str]과 같아요.',
      ],
      explanation: 'Optional[X] == Union[X, None] == X | None. 셋은 완전히 같은 뜻이에요.\n최신 코드에서는 X | None을 주로 써요. 이름 때문에 헷갈리지만 Optional은 "생략 가능"이 아니라 "None 가능"이라는 점이 핵심이에요.',
    },
    {
      id: 'fa-05-07', type: 'mcq', source: 'None이 될 수 있는 값',
      question: 'FastAPI에서 아래 q는 필수일까, 선택일까?',
      code: `@app.get("/search")
def search(q: str | None):
    ...`,
      choices: ['선택. None이 허용되니까 생략 가능', '경로 파라미터', '필수. 기본값이 없으니 ?q= 가 반드시 있어야 함', '본문 파라미터'],
      answer: 2,
      choiceExplanations: [
        'None 허용과 생략 가능은 달라요. 생략하려면 기본값이 필요해요.',
        '경로에 {q}가 없어요.',
        '정답. 기본값이 없으면 필수예요. q: str | None = None 이어야 선택이 돼요.',
        '단순 타입이라 쿼리예요.',
      ],
      explanation: '필수 여부 = 기본값 유무. 타입에 None이 있는지는 상관없어요.\n• q: str → 필수, None 불가\n• q: str | None → 필수(이름은 보내야 함), 값으로 None 허용(쿼리에선 사실상 의미가 적음)\n• q: str | None = None → 선택\n• q: str = "" → 선택, 기본 빈 문자열',
    },
    {
      id: 'fa-05-08', type: 'mcq', source: 'None이 될 수 있는 값',
      question: '다음 코드에서 없는 id로 요청하면 어떻게 될까?',
      code: `@app.get("/users/{user_id}")
def read_user(user_id: int, db: Session = Depends(get_db)):
    user = db.get(User, user_id)     # 없으면 None
    return {"name": user.name}`,
      choices: ['404 Not Found', '{"name": null}', '422', '500 Internal Server Error (AttributeError)'],
      answer: 3,
      choiceExplanations: [
        '404는 우리가 직접 raise해야 나와요.',
        'user가 None이라 user.name 단계에서 이미 예외가 나요.',
        '경로 값은 int로 정상 변환됐어요.',
        '정답. None.name → AttributeError: \'NoneType\' object has no attribute \'name\' → 처리되지 않은 예외라 500.',
      ],
      explanation: '"없을 수 있는 값"은 사용 전에 반드시 None 검사를 해야 해요.\nif user is None: raise HTTPException(status_code=404, detail="User not found")\n리턴 타입 힌트(User | None)를 잘 적어 두면 에디터가 "None일 수 있다"고 미리 경고해 줘요. 운영 서버의 500 에러 중 상당수가 이 패턴이에요.',
    },
    {
      id: 'fa-05-09', type: 'mcq', source: 'FastAPI는 힌트로 무엇을 정하나',
      question: '아래 함수의 파라미터 위치를 바르게 짝지은 것은?',
      code: `@app.put("/boards/{board_id}/posts/{post_id}")
def update_post(board_id: int, post_id: int, post: PostUpdate, force: bool = False):
    ...`,
      choices: ['board_id·post_id: 경로 / post: 본문 / force: 쿼리', '모두 쿼리', 'board_id: 경로 / post_id·post·force: 본문', 'post: 쿼리 / force: 본문'],
      answer: 0,
      choiceExplanations: [
        '정답. 경로에 이름이 있으면 경로, Pydantic 모델이면 본문, 단순 타입이면 쿼리예요.',
        '경로에 이름이 있는 두 값은 경로 파라미터예요.',
        'post_id도 경로에 있어요. force는 단순 타입이라 쿼리예요.',
        '반대예요.',
      ],
      explanation: 'FastAPI 파라미터 해석 3규칙을 다시 정리하면:\n1) 경로에 같은 이름이 있으면 → 경로\n2) 단순 타입(int, str, bool, float, Enum...) → 쿼리\n3) Pydantic 모델(또는 Body로 명시한 값) → 본문\n이 규칙에서 벗어나고 싶으면 Path(), Query(), Body(), Header(), Cookie()로 명시해요.',
    },
    {
      id: 'fa-05-10', type: 'short', source: 'FastAPI는 힌트로 무엇을 정하나',
      question: 'def read() -> PostRead: 처럼 리턴 타입 힌트를 적으면 FastAPI는 이를 무엇으로 사용하나요? (두 단어, 한글 또는 영어)',
      answer: ['응답모델', 'responsemodel', 'response_model', '응답 모델', 'response model'],
      explanation: '응답 모델(response model)로 써요. 리턴값을 PostRead 구조로 검증·변환하고, 모델에 없는 필드(예: password)는 응답에서 빠져요. /docs에도 응답 구조가 표시돼요.\n데코레이터의 response_model=PostRead와 같은 효과이고, 둘 다 있으면 response_model이 우선이에요(응답 모델 토픽).',
    },
    {
      id: 'fa-05-11', type: 'ox', source: '기본 타입과 컬렉션 타입',
      question: 'from typing import List 의 List[str]과 내장 list[str]은 타입 힌트로서 같은 의미다.',
      answer: true,
      explanation: '맞아요. 파이썬 3.9부터 내장 list, dict, set, tuple에 바로 [ ]를 쓸 수 있게 되면서 typing.List 등은 사실상 옛 문법이 됐어요.\n오래된 강의나 코드에서 List, Dict, Optional, Union을 보면 각각 list, dict, X | None, A | B로 읽으면 돼요.',
    },
    {
      id: 'fa-05-12', type: 'mcq', source: 'FastAPI는 힌트로 무엇을 정하나',
      question: '게시글 ID를 실수로 post_id: str 로 선언했다. 어떤 일이 생길까?',
      choices: ['/posts/abc 같은 요청도 검증을 통과해 DB 조회 단계까지 가고, 숫자 검증과 문서의 integer 표시가 사라진다', '서버가 시작되지 않는다', 'FastAPI가 자동으로 int로 바꿔 준다', '모든 요청이 422가 된다'],
      answer: 0,
      choiceExplanations: [
        '정답. FastAPI는 선언된 타입대로만 검증해요. 잘못된 값이 DB까지 내려가 DB 에러나 이상한 결과를 만들 수 있어요.',
        '문법적으로는 문제없어서 정상 시작돼요.',
        'FastAPI는 선언을 따를 뿐 의도를 추측하지 않아요.',
        '모든 문자열이 str 검증을 통과해요.',
      ],
      explanation: '"힌트가 곧 동작"이라는 말의 반대편이에요. 힌트가 틀리면 동작도 틀려요.\n타입 힌트는 첫 번째 방어선이에요. ID는 int(또는 UUID), 이메일은 EmailStr, 날짜는 date처럼 가능한 한 구체적인 타입을 쓰면 검증을 공짜로 얻어요.',
    },
  ],
}

export default topic
