import type { Topic } from '../../types'

const topic: Topic = {
  id: 'py-01-decorator',
  track: 'backend',
  group: '파이썬 토대',
  title: '데코레이터와 클로저: @app.get 이 동작하는 원리',
  order: 11,
  sections: [
    {
      title: '함수는 값이다 (First-class 함수)',
      notionIds: ['3efdf951bf808142b13df5bd00c4a917'],
      points: [
        '파이썬에서 함수는 숫자나 문자열처럼 "값"이다. 변수에 담을 수 있고, 다른 함수의 인자로 넘길 수 있고, 함수의 리턴값이 될 수 있다. 이를 First-class 함수라고 한다.',
        '함수 이름 뒤에 ()를 붙이면 "호출"이고, 안 붙이면 "함수 그 자체"다. sorted(data, key=len)에서 len에 괄호가 없는 이유가 이것이다.',
        '함수 안에 함수를 정의할 수 있다(중첩 함수). 안쪽 함수는 기본적으로 바깥 함수 안에서만 보인다. 하지만 바깥 함수가 안쪽 함수를 return 하면 밖에서도 쓸 수 있다.',
      ],
      code: `def html_creator(tag):
    def text_wrapper(msg):
        return f"<{tag}>{msg}</{tag}>"
    return text_wrapper     # 괄호 없음: 함수 자체를 돌려줌

h1 = html_creator("h1")   # h1 은 함수
print(h1("제목"))          # <h1>제목</h1>`,
    },
    {
      title: '클로저: 함수가 바깥 변수를 기억한다',
      notionIds: ['3efdf951bf8081ebab07d7c8c1112978'],
      points: [
        '위 예에서 html_creator("h1") 호출은 끝났는데도, 돌려받은 h1 함수는 tag="h1"을 여전히 기억한다. 이렇게 "함수 + 그 함수가 만들어질 때의 바깥 변수"를 함께 들고 다니는 것을 클로저(Closure)라고 한다.',
        '클로저는 작은 객체처럼 쓸 수 있다. calc_power(2)는 제곱 함수, calc_power(3)은 세제곱 함수를 만든다. 기능이 하나뿐이면 클로저, 여러 개면 클래스가 어울린다.',
        '안쪽 함수에서 바깥 변수를 "다시 대입"하려면 nonlocal 선언이 필요하다. 읽기만 할 때는 필요 없다.',
      ],
      code: `def make_counter():
    count = 0
    def increase():
        nonlocal count   # 없으면 UnboundLocalError
        count += 1
        return count
    return increase

c = make_counter()
c(); c()
print(c())   # 3`,
    },
    {
      title: '데코레이터 = 함수를 받아 감싼 함수를 돌려주는 함수',
      notionIds: ['3efdf951bf8081faad83c5aa0c575c3f'],
      points: [
        '데코레이터는 함수 앞뒤에 공통 기능(로그, 시간 측정, 권한 검사)을 붙이는 기법이다. 원래 함수를 고치지 않고 기능을 더한다.',
        '@deco 를 함수 위에 쓰는 것은 func = deco(func) 와 완전히 같다. 즉 함수 정의 직후 데코레이터가 한 번 호출되고, 그 리턴값(보통 wrapper)이 원래 이름에 다시 대입된다.',
        '어떤 함수에도 쓰려면 wrapper가 (*args, **kwargs)로 받아서 그대로 넘기고, 원래 함수의 리턴값도 return 해야 한다. return을 빼먹으면 감싼 함수가 항상 None을 돌려준다.',
        'functools.wraps(func)를 붙이면 wrapper가 원래 함수의 이름·설명·시그니처 정보를 물려받는다. FastAPI처럼 함수 시그니처를 읽는 프레임워크와 함께 쓸 때 특히 중요하다.',
      ],
      code: `import time
from functools import wraps

def timer(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)   # 원래 함수 실행
        print(f"{func.__name__}: {time.perf_counter() - start:.3f}s")
        return result                    # 리턴값 전달 잊지 않기
    return wrapper

@timer               # add = timer(add)
def add(a, b):
    return a + b`,
    },
    {
      title: '여러 개의 데코레이터와 파라미터 있는 데코레이터',
      notionIds: ['3efdf951bf8081a1abeae8f03c744e48'],
      points: [
        '데코레이터를 여러 줄 쌓으면 함수에 가까운(아래) 것부터 감싼다. @bold @italic def f → f = bold(italic(f)). 실행할 때는 바깥(위) wrapper부터 들어간다.',
        '@app.get("/items") 처럼 괄호 안에 값을 받는 데코레이터는 한 단계 더 깊다. app.get("/items")를 먼저 호출해서 "진짜 데코레이터"를 받고, 그것이 함수를 감싼다. 즉 f = app.get("/items")(f).',
        '파라미터 있는 데코레이터의 구조: 바깥 함수(설정값) → 데코레이터(func) → wrapper(*args, **kwargs). 함수가 3겹이다.',
        '클래스 메서드에 쓰는 데코레이터의 wrapper는 첫 인자로 self를 받게 된다. (*args, **kwargs)로 받으면 self도 args[0]으로 자연스럽게 넘어간다.',
      ],
      code: `def tag(name):                    # 1) 설정값을 받는 바깥 함수
    def decorator(func):          # 2) 진짜 데코레이터
        def wrapper(*args, **kwargs):   # 3) 감싼 함수
            return f"<{name}>{func(*args, **kwargs)}</{name}>"
        return wrapper
    return decorator

@tag("b")
@tag("i")
def hello():
    return "hi"

print(hello())   # <b><i>hi</i></b>`,
    },
    {
      title: 'FastAPI의 @app.get 은 무엇을 하나',
      points: [
        '@app.get("/items")는 함수를 감싸서 바꾸기보다는, 함수를 "GET /items 담당"으로 라우팅 표에 등록하는 데코레이터다. 등록 후 원래 함수를 그대로 돌려준다.',
        '등록 시점: 데코레이터는 "파일이 import될 때" 실행된다. 요청이 올 때가 아니다. 그래서 라우트 함수가 정의된 모듈을 import하지 않으면 라우트도 등록되지 않는다(APIRouter를 include_router 하는 이유).',
        'FastAPI는 등록된 함수의 시그니처(파라미터 이름·타입·기본값)를 읽어서 경로 파라미터·쿼리·본문을 결정한다. 그래서 직접 만든 데코레이터로 라우트 함수를 감쌀 때 @wraps가 없으면 시그니처가 (*args, **kwargs)로 보여 파라미터 인식이 깨진다.',
      ],
      code: `# FastAPI 내부를 아주 단순화한 모습
class MiniApp:
    def __init__(self):
        self.routes = {}

    def get(self, path):
        def decorator(func):
            self.routes[("GET", path)] = func   # 등록만 하고
            return func                         # 원래 함수 그대로 반환
        return decorator

app = MiniApp()

@app.get("/items")
def list_items():
    return []

print(app.routes)   # {('GET', '/items'): <function list_items>}`,
    },
  ],
  questions: [
    {
      id: 'py-01-01', type: 'mcq', source: '함수는 값이다 (First-class 함수)',
      question: '다음 코드의 출력은?',
      code: `def shout(text):
    return text.upper()

f = shout
print(f("hi"), type(f).__name__)`,
      choices: ['hi str', 'HI str', 'HI function', '에러: 함수는 변수에 담을 수 없다'],
      answer: 2,
      choiceExplanations: [
        'upper()가 적용돼 대문자가 되고, f의 타입은 문자열이 아니라 함수예요.',
        'f에는 shout()의 결과가 아니라 함수 자체가 담겼어요(괄호가 없으니까).',
        '정답. f는 shout와 같은 함수 객체를 가리키고, type은 function이에요.',
        '파이썬의 함수는 First-class 객체라 변수에 담을 수 있어요.',
      ],
      explanation: 'f = shout 는 "호출"이 아니라 "함수 객체를 변수에 연결"이에요. 괄호가 있으면 호출, 없으면 함수 자체예요.\n이 성질 덕분에 함수를 데코레이터에 넘기거나, FastAPI의 Depends(get_db)처럼 "나중에 호출할 함수"로 넘길 수 있어요.',
    },
    {
      id: 'py-01-02', type: 'mcq', source: '함수는 값이다 (First-class 함수)',
      question: 'FastAPI에서 Depends(get_db) 라고 쓰고 Depends(get_db()) 라고 쓰지 않는 이유는?',
      choices: ['get_db()로 쓰면 문법 에러가 나서', 'Depends는 문자열만 받아서', '괄호를 쓰면 함수가 두 번 정의돼서', '함수 자체를 넘겨야 FastAPI가 요청마다 알맞은 때에 호출할 수 있어서'],
      answer: 3,
      choiceExplanations: [
        '문법적으로는 가능해요. 다만 의도와 다르게 동작해요.',
        'Depends는 호출 가능한 객체(함수, 클래스)를 받아요.',
        '함수 정의와는 상관없어요.',
        '정답. get_db()라고 쓰면 파일을 읽는 순간 한 번만 호출되고, 그 결과값이 넘어가요. FastAPI는 "요청마다" 의존성을 호출해야 해요.',
      ],
      explanation: '"호출 결과"를 넘기는 것과 "함수 자체"를 넘기는 것의 차이예요.\nDepends(get_db) → FastAPI가 요청이 올 때마다 get_db()를 호출해 새 DB 세션을 만들어 줘요.\n같은 원리로 sorted(key=len), threading.Thread(target=work)에도 괄호 없이 함수를 넘겨요.',
    },
    {
      id: 'py-01-03', type: 'mcq', source: '클로저: 함수가 바깥 변수를 기억한다',
      question: '다음 코드의 출력은?',
      code: `def calc_power(n):
    def power(x):
        return x ** n
    return power

square = calc_power(2)
cube = calc_power(3)
del calc_power
print(square(4), cube(2))`,
      choices: ['16 8', '에러: calc_power를 지웠으므로 n을 찾을 수 없다', '8 16', '4 2'],
      answer: 0,
      choiceExplanations: [
        '정답. square는 n=2, cube는 n=3을 각자 기억해요. calc_power를 지워도 이미 만들어진 클로저는 살아 있어요.',
        '클로저는 만들어질 때의 n 값을 자기 안에 붙잡고 있어서, 바깥 함수가 사라져도 동작해요.',
        '4**2=16, 2**3=8이에요. 순서를 확인해 보세요.',
        'n이 적용되지 않은 값이에요.',
      ],
      explanation: '클로저 = 함수 + 만들어질 때의 바깥 변수.\nsquare.__closure__[0].cell_contents 를 출력해 보면 2가 들어 있어요.\n같은 함수(calc_power)에서 설정만 다른 함수를 여러 개 찍어낼 수 있다는 점이 데코레이터 공장(파라미터 있는 데코레이터)의 기반이에요.',
    },
    {
      id: 'py-01-04', type: 'short', source: '클로저: 함수가 바깥 변수를 기억한다',
      question: '안쪽 함수에서 바깥 함수의 변수 count에 count += 1 처럼 다시 대입하려면 안쪽 함수 맨 위에 어떤 키워드로 선언해야 하나요?',
      answer: ['nonlocal', 'nonlocal count'],
      explanation: 'nonlocal이에요.\n파이썬은 함수 안에서 어떤 이름에 대입하면 그 이름을 지역 변수로 취급해요. 그래서 count += 1 은 "지역 count를 읽어서 1 더하기"가 되는데, 지역 count는 아직 없으니 UnboundLocalError가 나요.\nnonlocal count로 "바깥 함수의 count를 쓴다"고 알려 주면 해결돼요. (모듈 전역 변수라면 global)',
    },
    {
      id: 'py-01-05', type: 'mcq', source: '데코레이터 = 함수를 받아 감싼 함수를 돌려주는 함수',
      question: '@log 를 붙인 아래 코드와 완전히 같은 의미의 코드는?',
      code: `@log
def save(data):
    ...`,
      choices: ['save = log(save())', 'log = save(log)', 'save = log(save)', 'save(log)'],
      answer: 2,
      choiceExplanations: [
        'save()를 먼저 호출해 버리면 함수가 아니라 실행 결과가 넘어가요.',
        '방향이 반대예요. 데코레이터가 함수를 받아요.',
        '정답. 함수를 정의한 직후 log(save)를 호출하고, 그 리턴값을 save라는 이름에 다시 대입해요.',
        '대입이 없어서 save가 바뀌지 않아요.',
      ],
      explanation: '@ 문법은 "func = deco(func)"의 줄임말일 뿐이에요.\n이걸 이해하면 데코레이터가 "함수 정의 시점에 한 번" 실행된다는 것도 바로 보여요. 요청이 올 때마다 실행되는 건 데코레이터가 돌려준 wrapper 쪽이에요.',
    },
    {
      id: 'py-01-06', type: 'mcq', source: '데코레이터 = 함수를 받아 감싼 함수를 돌려주는 함수',
      question: '데코레이터를 붙였더니 add(1, 2)가 3이 아니라 None을 돌려준다. 원인은?',
      code: `def log(func):
    def wrapper(*args, **kwargs):
        print("call", func.__name__)
        func(*args, **kwargs)
    return wrapper

@log
def add(a, b):
    return a + b`,
      choices: ['*args를 쓰면 리턴값이 사라져서', 'print 때문에', '데코레이터는 원래 리턴값을 None으로 바꿔서', 'wrapper가 func의 결과를 return 하지 않아서'],
      answer: 3,
      choiceExplanations: [
        '*args는 인자를 모아 넘기는 것일 뿐 리턴값과 상관없어요.',
        'print는 화면 출력일 뿐 리턴값에 영향을 주지 않아요.',
        '그런 규칙은 없어요. wrapper가 무엇을 리턴하는지가 곧 결과예요.',
        '정답. func(*args, **kwargs)를 호출만 하고 결과를 버렸어요. return func(*args, **kwargs)로 고쳐야 해요.',
      ],
      explanation: 'add는 이제 wrapper예요. wrapper에 return이 없으니 파이썬 함수 기본값 None이 나와요.\nFastAPI 라우트에 이런 데코레이터를 씌우면 응답이 null이 되는 버그가 생겨요. 데코레이터를 만들 때는 항상 result = func(...) → return result를 확인하세요.',
    },
    {
      id: 'py-01-07', type: 'short', source: '데코레이터 = 함수를 받아 감싼 함수를 돌려주는 함수',
      question: 'wrapper가 원래 함수의 __name__, docstring, 시그니처 정보를 물려받게 해 주는 functools의 데코레이터 이름은?',
      answer: ['wraps', 'functools.wraps', '@wraps', '@functools.wraps'],
      explanation: 'functools.wraps예요. wrapper 위에 @wraps(func)를 붙여요.\n이게 없으면 add.__name__이 "wrapper"가 되고, FastAPI가 inspect.signature로 파라미터를 읽을 때 (*args, **kwargs)만 보여서 경로·쿼리 파라미터 인식이 깨질 수 있어요.\n(wraps는 __wrapped__ 속성을 남겨서 inspect.signature가 원래 함수의 시그니처를 따라가게 해 줘요.)',
    },
    {
      id: 'py-01-08', type: 'mcq', source: '여러 개의 데코레이터와 파라미터 있는 데코레이터',
      question: '다음 코드의 출력은?',
      code: `def bold(f):
    return lambda: "<b>" + f() + "</b>"

def italic(f):
    return lambda: "<i>" + f() + "</i>"

@bold
@italic
def hi():
    return "hi"

print(hi())`,
      choices: ['<i><b>hi</b></i>', '<b><i>hi</i></b>', '<b>hi</b><i>hi</i>', 'hi'],
      answer: 1,
      choiceExplanations: [
        '순서가 반대예요. 함수에 가까운 데코레이터가 안쪽이에요.',
        '정답. hi = bold(italic(hi)). 아래(italic)가 먼저 감싸고, 위(bold)가 그 바깥을 감싸요.',
        '두 번 실행되는 게 아니라 겹겹이 감싸요.',
        '데코레이터가 적용됐으니 태그가 붙어요.',
      ],
      explanation: '쌓인 데코레이터는 "아래에서 위로 감싸고, 위에서 아래로 실행"돼요.\nFastAPI에서 라우트 데코레이터(@app.get)는 맨 위에 두는 게 원칙이에요. 그래야 다른 데코레이터로 감싼 "최종 함수"가 라우트로 등록돼요. 반대로 두면 감싸기 전의 원래 함수가 등록돼서 다른 데코레이터가 무시돼요.',
    },
    {
      id: 'py-01-09', type: 'mcq', source: '여러 개의 데코레이터와 파라미터 있는 데코레이터',
      question: '@app.get("/items") 를 풀어 쓴 것으로 맞는 것은?',
      choices: ['list_items = app.get(list_items, "/items")', 'list_items = app.get(list_items)("/items")', 'list_items = app.get("/items")(list_items)', 'app.get = list_items("/items")'],
      answer: 2,
      choiceExplanations: [
        '인자 두 개를 한 번에 받는 구조가 아니에요.',
        '순서가 반대예요. 설정값을 먼저 받고 함수를 나중에 받아요.',
        '정답. app.get("/items")가 먼저 호출돼 "진짜 데코레이터"를 돌려주고, 그게 list_items를 받아요.',
        '함수 정의와 관계없는 대입이에요.',
      ],
      explanation: '괄호가 붙은 데코레이터 = "데코레이터를 만들어 주는 함수"를 호출한 결과예요.\n구조: 설정값(path) → decorator(func) → (필요하면) wrapper. 노션의 mark_html(tag) 예제와 같은 3겹 구조예요.',
    },
    {
      id: 'py-01-10', type: 'ox', source: '여러 개의 데코레이터와 파라미터 있는 데코레이터',
      question: '클래스의 메서드에 (*args, **kwargs)를 받는 데코레이터를 붙이면, self는 args의 첫 번째 값으로 함께 넘어간다.',
      answer: true,
      explanation: '맞아요. 메서드를 obj.method(1)로 호출하면 실제로는 method(obj, 1)이 되므로 wrapper의 args는 (obj, 1)이에요.\n노션 예제처럼 wrapper(self, *args, **kwargs)로 self를 따로 받아도 되고, (*args, **kwargs)로 한꺼번에 받아도 돼요.',
    },
    {
      id: 'py-01-11', type: 'mcq', source: 'FastAPI의 @app.get 은 무엇을 하나',
      question: '라우트를 routers/items.py에 @router.get으로 만들었는데 /docs에 나타나지 않는다. 가장 가능성 높은 원인은?',
      choices: ['데코레이터는 요청이 올 때만 실행되므로 아직 요청이 안 와서', '함수 이름이 너무 길어서', 'GET 라우트는 문서에 나오지 않아서', 'main.py에서 그 router를 import하고 app.include_router(...)로 붙이지 않아서'],
      answer: 3,
      choiceExplanations: [
        '반대예요. 데코레이터는 모듈이 import될 때 실행돼요.',
        '함수 이름은 상관없어요.',
        'GET 라우트도 문서에 나와요.',
        '정답. 모듈이 import돼야 데코레이터가 실행돼 router에 등록되고, include_router를 해야 app에 합쳐져요.',
      ],
      explanation: '등록 흐름: import routers.items → @router.get 실행 → router.routes에 추가 → app.include_router(router) → app에 합쳐짐 → /docs에 표시.\n"데코레이터는 정의(import) 시점에 실행된다"는 걸 기억하면 이런 문제를 바로 찾을 수 있어요.',
    },
    {
      id: 'py-01-12', type: 'mcq', source: 'FastAPI의 @app.get 은 무엇을 하나',
      question: '직접 만든 @require_admin 데코레이터를 FastAPI 라우트에 붙였더니 쿼리 파라미터 q가 인식되지 않고 문서에 args, kwargs가 나온다. 가장 알맞은 해결책은?',
      code: `def require_admin(func):
    async def wrapper(*args, **kwargs):
        # ... 검사 ...
        return await func(*args, **kwargs)
    return wrapper

@app.get("/admin/search")
@require_admin
async def search(q: str):
    ...`,
      choices: ['@require_admin을 @app.get 위로 올린다', 'q의 타입 힌트를 지운다', 'wrapper 위에 @functools.wraps(func)를 붙인다', 'async를 모두 지운다'],
      answer: 2,
      choiceExplanations: [
        '그러면 감싸기 전 원래 함수가 등록돼 검사가 아예 실행되지 않아요.',
        '타입 힌트를 지우면 검증과 문서화가 사라질 뿐 문제는 그대로예요.',
        '정답. wraps가 원래 함수의 시그니처를 따라가게 해 줘서 FastAPI가 q: str을 다시 읽을 수 있어요.',
        'async 여부와는 관계없는 문제예요.',
      ],
      explanation: 'FastAPI는 라우트 함수의 시그니처로 파라미터를 결정하기 때문에, 감싼 함수의 시그니처가 (*args, **kwargs)면 정보가 사라져요. @wraps(func)가 이를 해결해요.\n더 좋은 방법도 있어요. FastAPI에서는 권한 검사 같은 공통 기능을 데코레이터보다 Depends(의존성 주입)로 만드는 게 정석이에요(의존성 토픽).',
    },
    {
      id: 'py-01-13', type: 'ox', source: 'FastAPI의 @app.get 은 무엇을 하나',
      question: '@app.get 데코레이터는 요청이 들어올 때마다 다시 실행되어 라우트를 등록한다.',
      answer: false,
      explanation: '아니에요. @app.get은 파일이 import될 때 딱 한 번 실행돼 라우트를 등록해요.\n요청이 올 때 실행되는 건 등록된 "내 함수"예요. 그래서 데코레이터 안(바깥 함수 부분)에 무거운 작업을 넣으면 서버 시작이 느려지고, wrapper 안에 넣으면 요청마다 실행돼요. 어디에 코드를 두느냐가 실행 시점을 정해요.',
    },
  ],
}

export default topic
