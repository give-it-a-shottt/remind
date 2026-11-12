import type { Topic } from '../../types'

const topic: Topic = {
  id: 'py-02-class',
  track: 'backend',
  group: '파이썬 토대',
  title: '클래스와 상속: Pydantic·ORM 모델을 읽기 위한 기초',
  order: 12,
  sections: [
    {
      title: '클래스, 객체, self',
      notionIds: ['3efdf951bf80817abb60e92382bb6efa'],
      slides: [
        {
          title: '설계도와 실물',
          blocks: [
            { type: 'say', text: 'FastAPI 코드를 열면 `class PostCreate(BaseModel):`, `class Post(Base):` 같은 **클래스**가 가득해요. 이걸 읽을 수 있어야 Pydantic도 ORM도 이해돼요. 이번 수업은 그 기초예요.\n\n**클래스**는 설계도, **객체(인스턴스)** 는 설계도로 찍어 낸 실물이에요. 클래스를 함수처럼 호출하면 객체가 만들어져요.' },
            { type: 'code', code: `class User:
    def __init__(self, name: str, age: int):
        self.name = name     # 인스턴스 속성
        self.age = age

    def greet(self) -> str:
        return f"안녕, {self.name}"

u = User("kim", 20)
print(u.greet())         # 안녕, kim
print(User.greet(u))     # 똑같은 호출` },
            { type: 'note', tone: 'analogy', text: '붕어빵 틀(클래스)과 붕어빵(객체)이에요. 틀은 하나지만 붕어빵은 여러 개 찍어 낼 수 있고, 붕어빵마다 속(팥, 슈크림)이 달라요. 그 "붕어빵마다 다른 속"이 **속성**이에요.' },
          ],
        },
        {
          title: '__init__과 self',
          blocks: [
            { type: 'say', text: '`__init__`은 객체가 만들어질 때 **자동으로 실행되는 초기화 메서드**(생성자)예요. 여기서 `self.name = name`처럼 객체마다 따로 가질 속성을 만들어요.\n\n`self`는 **"이 메서드를 호출한 객체 자신"** 이에요. `u.greet()`는 실제로 `User.greet(u)`로 실행돼요. 파이썬이 점 앞의 객체를 첫 인자로 몰래 넣어 주는 거예요.' },
            { type: 'note', tone: 'warn', text: '메서드를 정의할 때 `self`를 빼먹으면, 파이썬은 여전히 객체를 첫 인자로 넣어 주는데 받을 자리가 없어서 **"인자 개수가 맞지 않는다"는 TypeError**가 나요.' },
            { type: 'say', text: '클래스 이름은 **CapWords**(`UserCreate`, `PostRead`)로 지어요. 그래서 FastAPI 코드에서 대문자로 시작하는 이름은 대부분 클래스(모델)라고 보면 돼요.' },
          ],
        },
      ],
    },
    {
      title: '클래스 변수와 인스턴스 변수',
      notionIds: ['3efdf951bf8081798cc5cbbf7c22b9c9'],
      slides: [
        {
          title: '함께 쓰는 변수, 따로 쓰는 변수',
          blocks: [
            {
              type: 'table',
              head: ['', '클래스 변수', '인스턴스 변수'],
              rows: [
                ['어디에 쓰나', '클래스 본문 (메서드 **밖**)', '메서드 안에서 `self.x = ...`'],
                ['누가 가지나', '**모든 객체가 함께** 하나를', '**객체마다 따로**'],
                ['접근', '`User.count`', '`u.name`'],
              ],
            },
            { type: 'code', code: `class Basket:
    items = []              # 클래스 변수 — 모두가 같은 리스트!

a = Basket(); b = Basket()
a.items.append("빵")
print(b.items)              # ['빵']  ← b 바구니에도 들어 있음` },
            { type: 'note', tone: 'warn', text: '클래스 변수에 **리스트 같은 가변 객체**를 두면 모든 객체가 같은 리스트를 공유해요. 한 객체에서 append하면 모두에게 보여요. 객체마다 따로 가져야 하면 `__init__`에서 `self.items = []`로 만들어요.' },
          ],
        },
        {
          title: 'Pydantic이 이 문법을 빌려 써요',
          blocks: [
            { type: 'code', code: `from pydantic import BaseModel

class Item(BaseModel):
    name: str          # 클래스 본문에 "이름: 타입" 으로 필드 선언
    price: int = 0     # 기본값

a = Item(name="pen")
b = Item(name="cup", price=3000)
print(a.price, b.price)   # 0 3000  (객체마다 따로)` },
            { type: 'say', text: '`name: str`은 클래스 본문에 쓴 클래스 변수처럼 생겼죠. 그런데 Pydantic과 SQLAlchemy는 이 문법을 **"필드 선언"** 으로 빌려 써요. 라이브러리가 클래스 본문을 읽어서 **객체마다 따로 갖는 필드**로 바꿔 줘요. 그래서 `a`와 `b`의 price가 따로예요.' },
          ],
        },
      ],
    },
    {
      title: '상속과 오버라이드, super()',
      notionIds: ['3efdf951bf8081ada6a4fe809ac5761b'],
      slides: [
        {
          title: '물려받고, 다른 것만 바꾸기',
          blocks: [
            { type: 'say', text: '**상속**은 `class Child(Parent):`로 부모의 속성과 메서드를 물려받고, **다른 부분만** 추가하거나 바꾸는 거예요. 공통 코드를 한곳에 모을 수 있어요.\n\n**오버라이드**: 부모와 같은 이름의 메서드를 자식에서 다시 정의하면, 자식 객체에서는 **자식 것**이 호출돼요.' },
            { type: 'code', code: `class Animal:
    def __init__(self, name):
        self.name = name
    def speak(self):
        return "..."

class Dog(Animal):
    def __init__(self, name, breed):
        super().__init__(name)     # 부모 초기화 먼저 (self.name 생김)
        self.breed = breed
    def speak(self):               # 오버라이드
        return "멍멍"` },
            { type: 'note', tone: 'warn', text: '`super().__init__(name)`을 빼먹으면 부모가 만들어 줘야 할 `self.name`이 **생기지 않아서** `d.name`에 접근할 때 AttributeError가 나요.' },
          ],
        },
        {
          title: 'FastAPI에서 상속을 쓰는 곳',
          blocks: [
            { type: 'code', code: `class PostBase(BaseModel):
    title: str
    content: str

class PostCreate(PostBase):     # 입력용: 공통 필드 그대로
    pass

class PostRead(PostBase):       # 출력용: id 추가
    id: int` },
            { type: 'say', text: '게시글 API에는 **입력용**(클라이언트가 보내는 것)과 **출력용**(서버가 돌려주는 것) 스키마가 따로 필요해요. id는 서버가 만드니 입력엔 없고 출력엔 있죠. 공통 필드를 `PostBase`에 모아 두면, 필드가 바뀔 때 **한 곳만** 고치면 돼요.\n\nSQLAlchemy의 `class Post(Base):`도 상속이에요.' },
            { type: 'say', text: '`isinstance(obj, Parent)`는 **자식 객체에도 True**예요. 강아지도 동물이니까요. `issubclass(Child, Parent)`는 클래스끼리의 관계를 확인해요.' },
          ],
        },
      ],
    },
    {
      title: '@staticmethod 와 @classmethod',
      notionIds: ['3efdf951bf8081798cc5cbbf7c22b9c9'],
      slides: [
        {
          title: '메서드 세 종류',
          blocks: [
            {
              type: 'table',
              head: ['종류', '첫 인자', '언제'],
              rows: [
                ['인스턴스 메서드', '`self` (객체)', '객체의 속성을 읽고 쓸 때. 가장 흔함'],
                ['`@classmethod`', '`cls` (클래스)', '객체를 만드는 **다른 방법**(대체 생성자)'],
                ['`@staticmethod`', '없음', '클래스와 관련 있지만 객체 상태가 필요 없는 **도우미 함수**'],
              ],
            },
            { type: 'code', code: `class User:
    def __init__(self, name):
        self.name = name

    @classmethod
    def from_email(cls, email: str):
        return cls(email.split("@")[0])   # cls() 로 객체 생성

    @staticmethod
    def is_valid_name(name: str) -> bool:
        return 2 <= len(name) <= 20

u = User.from_email("kim@a.com")
print(u.name, User.is_valid_name("k"))   # kim False` },
          ],
        },
        {
          title: 'Pydantic의 classmethod',
          blocks: [
            { type: 'say', text: '`@classmethod`는 `cls`를 받기 때문에, 자식 클래스에서 호출하면 `cls`가 **자식 클래스**가 돼요. 그래서 상속해도 올바른 클래스의 객체가 만들어져요.\n\nPydantic의 `Item.model_validate(data)`가 대표적인 classmethod예요. "dict나 ORM 객체로부터 Item을 만들어 줘"라는 **대체 생성자**죠. 나중에 ORM 객체를 응답 스키마로 바꿀 때 만나요.' },
          ],
        },
      ],
    },
    {
      title: '특별 메서드와 dataclass',
      slides: [
        {
          title: '__로 둘러싼 메서드',
          blocks: [
            { type: 'say', text: '`__init__`처럼 앞뒤에 밑줄 두 개가 붙은 메서드는 파이썬이 **특정 상황에 자동으로** 호출해요.' },
            {
              type: 'table',
              head: ['메서드', '자동 호출되는 때'],
              rows: [
                ['`__init__`', '객체 생성'],
                ['`__repr__`', '`print()`, 디버거에서 객체를 보여 줄 때 (개발자용 표현)'],
                ['`__eq__`', '`==` 비교'],
                ['`__len__`', '`len()`'],
              ],
            },
            { type: 'say', text: '`__repr__`을 정의해 두면 `print(user)`가 `<User object at 0x...>` 대신 `User(id=1, name="kim")`처럼 읽기 좋게 나와요. SQLAlchemy 모델을 디버깅할 때 정말 유용해요.' },
          ],
        },
        {
          title: 'dataclass와 Pydantic의 차이',
          blocks: [
            { type: 'code', code: `from dataclasses import dataclass

@dataclass
class Point:
    x: int
    y: int

p = Point(1, 2)
print(p)                   # Point(x=1, y=2)
print(p == Point(1, 2))    # True
print(Point("a", "b"))     # Point(x='a', y='b')  ← 검증 없음` },
            { type: 'say', text: '`@dataclass`는 필드만 적으면 `__init__`, `__repr__`, `__eq__`를 **자동으로** 만들어 줘요. 편하죠.\n\n하지만 **타입 검증은 하지 않아요.** `int` 필드에 `"a"`를 넣어도 그대로 들어가요. 타입 힌트는 그냥 "설명"일 뿐이에요. 바깥에서 들어오는 값을 **검사까지** 해야 하는 API에서는 Pydantic을 써요.' },
          ],
        },
      ],
    },
  ],
  questions: [
    {
      id: 'py-02-01', type: 'mcq', source: '클래스, 객체, self',
      question: '다음 코드를 실행하면 어떻게 될까?',
      code: `class Counter:
    def __init__(self):
        self.n = 0

    def up():
        self.n += 1

c = Counter()
c.up()`,
      choices: ['c.n이 1이 된다', 'TypeError: up() takes 0 positional arguments but 1 was given', 'NameError: self is not defined가 c = Counter()에서 난다', '아무 일도 일어나지 않는다'],
      answer: 1,
      choiceExplanations: [
        'up에 self 파라미터가 없어서 실행 자체가 실패해요.',
        '정답. c.up()은 Counter.up(c)로 바뀌어 인자 1개(c)를 넘기는데, up은 인자를 하나도 받지 않아요.',
        '객체 생성은 문제없어요. 에러는 c.up()을 호출할 때 나요.',
        '에러가 나요.',
      ],
      explanation: 'obj.method() 호출 시 객체 자신이 첫 번째 인자로 자동으로 들어가요. 그래서 메서드는 항상 첫 파라미터로 self를 받아야 해요.\n에러 메시지의 "takes 0 ... but 1 was given"에서 1은 바로 그 자동으로 들어간 객체예요.',
    },
    {
      id: 'py-02-02', type: 'short', source: '클래스, 객체, self',
      question: '객체가 만들어질 때 자동으로 호출되어 속성을 초기화하는 특별 메서드 이름은?',
      answer: ['__init__', 'init', '__init__()'],
      explanation: '__init__이에요. User("kim") → 객체 생성 → __init__(self, "kim") 자동 호출.\nPydantic의 BaseModel과 @dataclass는 필드 선언을 보고 __init__을 대신 만들어 줘서, 직접 __init__을 쓰지 않아도 Item(name="pen")처럼 만들 수 있어요.',
    },
    {
      id: 'py-02-03', type: 'mcq', source: '클래스 변수와 인스턴스 변수',
      question: '다음 코드의 출력은?',
      code: `class Cart:
    items = []          # 클래스 변수

    def add(self, x):
        self.items.append(x)

a = Cart(); b = Cart()
a.add("pen")
print(b.items)`,
      choices: ['[]', '에러', 'None', "['pen']"],
      answer: 3,
      choiceExplanations: [
        'items가 인스턴스 변수였다면 []였을 거예요.',
        '문법상 문제는 없어요.',
        'items는 빈 리스트로 시작했어요.',
        '정답. items는 클래스 변수 하나를 모든 객체가 같이 써서, a가 넣은 값이 b에서도 보여요.',
      ],
      explanation: '가변 객체(list, dict)를 클래스 변수로 두면 모든 인스턴스가 공유해요. 객체마다 따로 갖게 하려면 __init__ 안에서 self.items = []로 만들어야 해요.\n참고로 Pydantic 모델에서 tags: list[str] = [] 라고 쓰는 건 괜찮아요. Pydantic이 객체를 만들 때마다 기본값을 복사해 주기 때문이에요. (일반 클래스와 dataclass에서는 위험해요.)',
    },
    {
      id: 'py-02-04', type: 'ox', source: '클래스 변수와 인스턴스 변수',
      question: 'class Item(BaseModel): name: str 에서 name은 모든 Item 객체가 공유하는 하나의 값이다.',
      answer: false,
      explanation: '아니에요. 문법은 클래스 변수처럼 보이지만, Pydantic이 이 선언을 읽어 "객체마다 따로 갖는 필드"로 만들어요. Item(name="a")와 Item(name="b")는 각자 다른 name을 가져요.\nSQLAlchemy의 name: Mapped[str] = mapped_column(...)도 같은 원리로, 클래스 본문은 "컬럼 정의"이고 실제 값은 객체(행)마다 따로 있어요.',
    },
    {
      id: 'py-02-05', type: 'mcq', source: '상속과 오버라이드, super()',
      question: '다음 코드에서 d.speak()의 결과와 d.name 접근 결과로 맞는 것은?',
      code: `class Animal:
    def __init__(self, name):
        self.name = name
    def speak(self):
        return "..."

class Dog(Animal):
    def __init__(self, name, breed):
        self.breed = breed
    def speak(self):
        return "멍"

d = Dog("바둑", "진돗개")`,
      choices: ['"멍", "바둑"', '"멍", AttributeError', '"...", "바둑"', '"...", AttributeError'],
      answer: 1,
      choiceExplanations: [
        'Dog.__init__이 부모 초기화를 호출하지 않아서 name이 만들어지지 않았어요.',
        '정답. speak은 오버라이드된 Dog 것이 실행되고, name은 super().__init__(name)을 안 불러서 존재하지 않아요.',
        'speak은 Dog에서 오버라이드됐어요.',
        'speak은 오버라이드돼서 "멍"이에요.',
      ],
      explanation: '자식이 __init__을 새로 정의하면 부모의 __init__은 자동으로 실행되지 않아요. super().__init__(name)을 먼저 호출해야 부모가 만드는 속성(name)이 생겨요.\n자식에 __init__이 아예 없으면 부모의 __init__이 그대로 쓰여요.',
    },
    {
      id: 'py-02-06', type: 'mcq', source: '상속과 오버라이드, super()',
      question: '게시글 API에 입력용(PostCreate)과 출력용(PostRead) 스키마가 필요하다. 상속을 쓰는 가장 큰 이유는?',
      code: `class PostBase(BaseModel):
    title: str
    content: str

class PostCreate(PostBase):
    pass

class PostRead(PostBase):
    id: int
    created_at: datetime`,
      choices: ['공통 필드(title, content)를 한 곳에서 관리하고, 입력·출력별로 다른 필드만 더하려고', '상속을 쓰면 API가 더 빨라져서', 'Pydantic은 상속 없이는 동작하지 않아서', 'PostRead에서 title을 지우려고'],
      answer: 0,
      choiceExplanations: [
        '정답. title 규칙이 바뀌면 PostBase 한 곳만 고치면 돼요. id·created_at은 서버가 만드는 값이라 입력용에는 없고 출력용에만 있어요.',
        '성능과는 관계없어요.',
        'BaseModel을 직접 상속한 클래스 하나로도 충분히 동작해요.',
        '상속은 필드를 더하는 방향이에요. PostRead에도 title이 있어요.',
      ],
      explanation: 'FastAPI 실무의 대표 패턴: XxxBase(공통) → XxxCreate(입력) / XxxUpdate(수정, 모두 선택) / XxxRead(출력, id 등 추가).\n입력 모델에 id를 넣지 않는 이유: 클라이언트가 id를 마음대로 정하면 안 되니까요. 이 패턴은 Pydantic·응답 모델 토픽에서 계속 나와요.',
    },
    {
      id: 'py-02-07', type: 'short', source: '상속과 오버라이드, super()',
      question: '자식 클래스의 메서드 안에서 부모 클래스의 메서드를 호출할 때 쓰는 내장 함수는? (예: ___().__init__(name))',
      answer: ['super', 'super()'],
      explanation: 'super()예요. super().__init__(name)은 "부모의 초기화를 실행해 줘"라는 뜻이에요.\n오버라이드한 메서드에서 부모 동작을 완전히 버리지 않고 앞뒤에 무언가를 더하고 싶을 때도 return super().save() + ... 처럼 써요.',
    },
    {
      id: 'py-02-08', type: 'ox', source: '상속과 오버라이드, super()',
      question: 'Dog가 Animal을 상속할 때, isinstance(Dog("a", "b"), Animal)은 True다.',
      answer: true,
      explanation: '맞아요. 자식 객체는 부모 타입이기도 해요("개는 동물이다").\nFastAPI 예외 처리에서 이 성질이 중요해요. @app.exception_handler(MyBaseError)를 등록하면 MyBaseError를 상속한 모든 예외가 그 핸들러로 잡혀요.',
    },
    {
      id: 'py-02-09', type: 'mcq', source: '@staticmethod 와 @classmethod',
      question: '다음 중 @classmethod로 만드는 것이 가장 자연스러운 메서드는?',
      choices: ['user.change_name(new)처럼 객체의 속성을 바꾸는 메서드', 'User.from_dict(data)처럼 다른 형태의 데이터로 객체를 만드는 메서드', '두 숫자를 더하는 add(a, b)처럼 클래스와 무관한 함수', '객체를 출력할 때 쓰는 __repr__'],
      answer: 1,
      choiceExplanations: [
        '객체 상태를 바꾸니 self를 받는 인스턴스 메서드가 맞아요.',
        '정답. "대체 생성자"는 cls를 받아 cls(...)로 객체를 만들어요. 자식 클래스에서 호출하면 자식 객체가 만들어져요.',
        '클래스와 관련이 없으면 그냥 모듈 함수가 낫고, 관련은 있지만 상태가 필요 없으면 staticmethod예요.',
        '__repr__은 self를 받는 특별 메서드예요.',
      ],
      explanation: '판단 기준:\n• 객체 상태(self.x)가 필요 → 인스턴스 메서드\n• 클래스 자체(cls)가 필요, 특히 객체 생성 → @classmethod\n• 둘 다 필요 없음 → @staticmethod 또는 모듈 함수\nPydantic의 Model.model_validate(), SQLAlchemy의 일부 생성 헬퍼가 classmethod예요.',
    },
    {
      id: 'py-02-10', type: 'mcq', source: '@staticmethod 와 @classmethod',
      question: '다음 코드의 출력은?',
      code: `class Base:
    kind = "base"
    @classmethod
    def make(cls):
        return cls.kind

class Child(Base):
    kind = "child"

print(Base.make(), Child.make())`,
      choices: ['base base', 'child child', '에러', 'base child'],
      answer: 3,
      choiceExplanations: [
        'classmethod의 cls는 "호출한 클래스"라서 Child.make()의 cls는 Child예요.',
        'Base.make()의 cls는 Base예요.',
        '문법상 문제없어요.',
        '정답. cls가 호출한 클래스를 가리키니 각자의 kind를 읽어요.',
      ],
      explanation: '노션에서 정리한 static vs class method 차이 그대로예요.\n• classmethod: cls가 실제로 호출한 클래스 → 자식에서 부르면 자식 값\n• staticmethod: cls가 없으니 클래스 이름을 직접 써야 하고, 그러면 항상 그 클래스 값\n상속 구조에서 "자기 자신의 객체를 만든다"는 대체 생성자에 classmethod가 쓰이는 이유예요.',
    },
    {
      id: 'py-02-11', type: 'mcq', source: '특별 메서드와 dataclass',
      question: '@dataclass로 만든 클래스와 Pydantic BaseModel의 가장 큰 차이는?',
      code: `@dataclass
class A:
    age: int

class B(BaseModel):
    age: int

A(age="스물")
B(age="스물")`,
      choices: ['A는 에러, B는 통과', 'A는 통과(검증 없음), B는 ValidationError', '둘 다 통과', '둘 다 에러'],
      answer: 1,
      choiceExplanations: [
        '반대예요. dataclass는 타입 힌트를 검사하지 않아요.',
        '정답. dataclass의 타입 힌트는 "표시"일 뿐이고, Pydantic은 실제로 검증·변환해요.',
        'Pydantic은 "스물"을 int로 바꿀 수 없어 에러를 내요.',
        'dataclass는 검사하지 않으니 통과해요.',
      ],
      explanation: '파이썬의 타입 힌트는 기본적으로 실행 시 아무것도 검사하지 않아요. 검사하는 건 Pydantic 같은 라이브러리예요.\n그래서 외부에서 들어오는 데이터(요청 본문, 환경 변수, 외부 API 응답)에는 Pydantic을, 내부에서만 쓰는 단순한 데이터 묶음에는 dataclass를 쓰는 경우가 많아요.\n참고로 B(age="20")은 "20" → 20으로 변환돼 통과해요.',
    },
    {
      id: 'py-02-12', type: 'short', source: '특별 메서드와 dataclass',
      question: 'print(obj)나 디버거에서 객체가 어떻게 보일지 정하는 특별 메서드 이름은? (개발자용 표현)',
      answer: ['__repr__', 'repr', '__repr__()'],
      explanation: '__repr__이에요. 정의하지 않으면 <User object at 0x10a...>처럼 나와서 디버깅이 어려워요.\nSQLAlchemy 모델에 def __repr__(self): return f"User(id={self.id!r}, name={self.name!r})"를 넣어 두면 쿼리 결과를 print로 확인하기 쉬워요.\n(__str__은 사용자용 표현이고, 없으면 __repr__이 대신 쓰여요.)',
    },
    {
      id: 'py-02-13', type: 'mcq', source: '클래스, 객체, self',
      question: 'FastAPI 코드에서 아래 세 줄을 읽을 때, 각각을 바르게 설명한 것은?',
      code: `app = FastAPI()                 # (1)
item = Item(name="pen")         # (2)
data = item.model_dump()        # (3)`,
      choices: ['(1) 함수 호출 (2) 함수 호출 (3) 속성 읽기', '(1) 모듈 import (2) dict 생성 (3) 함수 정의', '(1) FastAPI 클래스의 객체 생성 (2) Item 클래스의 객체 생성 (3) item 객체의 메서드 호출', '(1) 데코레이터 (2) 상속 (3) 오버라이드'],
      answer: 2,
      choiceExplanations: [
        '대문자로 시작하는 FastAPI, Item은 클래스이고, 괄호로 호출하면 객체가 만들어져요.',
        'import는 from fastapi import FastAPI 줄에서 일어나요.',
        '정답. app은 FastAPI 객체, item은 Item(Pydantic 모델) 객체, model_dump()는 item의 메서드예요.',
        '세 줄 모두 객체 생성과 메서드 호출이에요.',
      ],
      explanation: 'FastAPI 코드는 거의 전부 "클래스로 객체를 만들고 메서드를 부르는" 문장이에요.\n• app.get(...): app 객체의 메서드(데코레이터를 돌려줌)\n• Item(...): 모델 객체 생성 + 검증\n• item.model_dump(): 객체를 dict로 변환\n이 읽기 감각이 있으면 처음 보는 라이브러리 코드도 구조가 보여요.',
    },
  ],
}

export default topic
