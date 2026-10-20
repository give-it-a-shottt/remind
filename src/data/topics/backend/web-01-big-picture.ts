import type { Topic } from '../../types'

const topic: Topic = {
  id: 'web-01-big-picture',
  track: 'backend',
  group: '큰 그림',
  title: '웹 서비스의 큰 그림과 FastAPI',
  order: 1,
  sections: [
    {
      title: '웹 서비스는 요청과 응답이다',
      notionIds: ['3efdf951bf808190ab34eb3d97e84dc0'],
      points: [
        '브라우저나 앱(클라이언트)이 서버에 "이거 주세요"라고 요청(Request)을 보내고, 서버가 결과를 응답(Response)으로 돌려준다. 서버가 먼저 말을 거는 일은 없다.',
        '백엔드는 요청을 받아 ① 입력을 검사하고 ② 데이터베이스를 읽고 쓰고 ③ 결과를 JSON이나 HTML로 만들어 돌려주는 프로그램이다. 이 세 단계가 이 트랙 전체의 뼈대다.',
        '웹은 1세대(정적 HTML 파일을 그대로 보여줌) → 2세대(CGI + DB로 요청마다 HTML 생성) → 3세대(MVC 패턴 프레임워크) → 4세대(REST API·OpenAPI를 조합한 서비스)로 발전했다. FastAPI는 4세대, 즉 "JSON API 서버"를 만드는 데 최적화돼 있다.',
        '요즘 구조에서는 화면은 React 같은 프론트가 그리고, 백엔드는 데이터(JSON)만 준다. 그래서 백엔드 실력 = API 설계 + 데이터베이스 설계다.',
      ],
    },
    {
      title: '프레임워크와 FastAPI의 위치',
      notionIds: ['3efdf951bf80811a9d1de277bbb8f7ed'],
      points: [
        '프레임워크 = 미리 만들어진 틀. 라우팅, 요청 파싱, 응답 변환처럼 매번 반복되는 일을 대신 해 주고, 개발자는 "이 주소로 오면 무엇을 할지"만 채운다.',
        '풀스택 프레임워크(Django, Spring, Rails)는 인증·관리자 화면·ORM·템플릿까지 다 들어 있어 강력하지만 배울 것이 많다.',
        '마이크로 프레임워크(Flask, FastAPI)는 핵심만 제공하고 나머지는 라이브러리를 골라 붙인다. FastAPI는 Flask처럼 가볍게 시작하면서 타입 검증·자동 문서·비동기를 기본으로 갖췄다.',
        'Flask를 배웠다면 FastAPI는 문법이 매우 비슷하다. @app.route("/", methods=["GET"]) 대신 @app.get("/")처럼 메서드별 데코레이터를 쓰는 정도의 차이부터 시작한다.',
      ],
      code: `# Flask
@app.route("/items/<int:item_id>", methods=["GET"])
def read_item(item_id):
    return jsonify({"id": item_id})

# FastAPI
@app.get("/items/{item_id}")
def read_item(item_id: int):
    return {"id": item_id}   # dict 를 리턴하면 자동으로 JSON`,
    },
    {
      title: '모놀리식과 마이크로서비스',
      points: [
        '모놀리식(Monolithic): 회원·상품·주문·결제가 한 프로그램, 한 배포 단위에 들어 있다. 처음 만들기 쉽고 디버깅도 쉽지만, 커지면 작은 수정에도 전체를 다시 배포해야 하고 한 부분의 장애가 전체로 번진다.',
        '마이크로서비스 아키텍처(MSA): 기능별로 작은 서비스를 나누고 서비스끼리는 HTTP(REST) 같은 API로 통신한다. 서비스마다 따로 배포·확장하고, 서비스마다 다른 언어나 DB를 쓸 수도 있다.',
        'MSA의 대가: 서비스 간 네트워크 호출이 늘고, 여러 서비스에 걸친 데이터 일관성(트랜잭션)을 맞추기 어렵고, 모니터링·배포 인프라가 복잡해진다.',
        '가볍고 빠르게 뜨는 API 서버가 MSA의 부품으로 잘 맞기 때문에 FastAPI가 MSA와 함께 자주 언급된다. 혼자 만드는 서비스라면 대부분 모놀리식으로 시작하는 것이 현실적이다.',
      ],
    },
    {
      title: 'FastAPI의 장점',
      points: [
        '빠르다: Starlette(비동기 웹 툴킷) 위에서 ASGI로 동작해, 파이썬 웹 프레임워크 중 성능이 좋은 편이다.',
        '타입 힌트가 곧 검증이다: def read(item_id: int) 라고 쓰면 FastAPI가 "abc" 같은 값을 자동으로 거절하고 422 에러를 돌려준다. 검증은 Pydantic이 담당한다.',
        '자동 문서: 코드만 쓰면 /docs(Swagger UI)와 /redoc 문서가 자동으로 생긴다. 문서와 코드가 어긋날 일이 없다.',
        '비동기 지원: async def로 엔드포인트를 만들면 DB나 외부 API를 기다리는 동안 다른 요청을 처리할 수 있다.',
        '에디터 자동 완성: 타입 정보 덕분에 VS Code가 필드 이름을 추천해 주고 오타를 미리 잡아 준다.',
      ],
    },
    {
      title: 'WSGI와 ASGI, 그리고 uvicorn',
      points: [
        'WSGI(Web Server Gateway Interface): 파이썬 웹 서버와 앱이 대화하는 옛 표준. 요청 하나를 동기 방식으로 끝까지 처리한다. Flask·Django가 전통적으로 WSGI다.',
        'ASGI(Asynchronous Server Gateway Interface): WSGI의 비동기 버전. async/await, 웹소켓, 긴 연결을 지원한다. FastAPI는 ASGI 앱이다.',
        'FastAPI는 "앱"일 뿐이고, 실제로 네트워크 포트를 열고 요청을 받아 앱에 넘겨주는 건 ASGI 서버인 uvicorn이다. 그래서 python main.py가 아니라 uvicorn main:app 으로 실행한다.',
        '정리: 브라우저 → uvicorn(ASGI 서버) → FastAPI(라우팅·검증) → 내 함수 → (DB) → FastAPI가 JSON 변환 → uvicorn → 브라우저.',
      ],
    },
  ],
  questions: [
    {
      id: 'web-01-01', type: 'mcq', source: '웹 서비스는 요청과 응답이다',
      question: '백엔드 API 서버가 요청 하나를 처리하는 일반적인 순서로 가장 알맞은 것은?',
      choices: ['DB 저장 → 입력 검사 → 응답', '입력 검사 → DB 읽기/쓰기 → 응답 생성', '응답 생성 → 입력 검사 → DB 저장', '서버가 먼저 클라이언트에 데이터를 보낸 뒤 요청을 기다림'],
      answer: 1,
      choiceExplanations: [
        '검사 전에 DB에 저장하면 잘못된 데이터가 그대로 들어가요.',
        '정답. 받은 값을 먼저 검사하고, 통과하면 DB를 다루고, 결과를 응답으로 만들어요.',
        '응답은 마지막이에요. 처리 결과가 있어야 응답을 만들 수 있어요.',
        'HTTP는 항상 클라이언트가 먼저 요청해요. 서버가 먼저 보내는 건 웹소켓 같은 별도 기술이에요.',
      ],
      explanation: '백엔드의 기본 3단계는 "검사 → 데이터 처리 → 응답"이에요.\nFastAPI에서는 1단계(검사)를 타입 힌트와 Pydantic이 자동으로 해 주고, 3단계(JSON 변환)도 자동이에요. 그래서 개발자는 2단계, 즉 DB 로직에 집중할 수 있어요.',
    },
    {
      id: 'web-01-02', type: 'ox', source: '웹 서비스는 요청과 응답이다',
      question: '요즘 React 프론트 + FastAPI 백엔드 구조에서는 백엔드가 화면(HTML)을 그리지 않고 데이터(JSON)만 주는 경우가 많다.',
      answer: true,
      explanation: '맞아요. 화면은 프론트가, 데이터는 백엔드가 맡는 구조가 일반적이에요.\nFastAPI도 Jinja2로 HTML을 만들 수 있지만(템플릿 토픽에서 배워요), 주 용도는 JSON API예요.',
    },
    {
      id: 'web-01-03', type: 'mcq', source: '프레임워크와 FastAPI의 위치',
      question: 'Flask와 FastAPI 코드를 비교했다. FastAPI 쪽에 대한 설명으로 틀린 것은?',
      code: `# Flask
@app.route("/items/<int:item_id>", methods=["GET"])
def read_item(item_id):
    return jsonify({"id": item_id})

# FastAPI
@app.get("/items/{item_id}")
def read_item(item_id: int):
    return {"id": item_id}`,
      choices: ['HTTP 메서드를 데코레이터 이름(@app.get)으로 정한다', '경로 변수는 중괄호 {item_id}로 쓴다', 'item_id: int 타입 힌트로 숫자가 아닌 값을 자동으로 거절한다', 'dict를 리턴하려면 jsonify()로 반드시 감싸야 한다'],
      answer: 3,
      choiceExplanations: [
        'FastAPI는 @app.get, @app.post, @app.put, @app.delete처럼 메서드마다 데코레이터가 있어요.',
        'Flask는 <int:item_id>, FastAPI는 {item_id}예요.',
        'item_id에 "abc"가 오면 FastAPI가 422 에러를 자동으로 돌려줘요.',
        '정답(틀린 설명). FastAPI는 dict·list·Pydantic 모델을 리턴하면 알아서 JSON으로 바꿔요. jsonify는 Flask 전용이에요.',
      ],
      explanation: 'FastAPI는 "리턴한 값 → JSON 변환"을 자동으로 해요. 내부적으로 jsonable_encoder가 dict, list, Pydantic 모델, datetime 등을 JSON에 맞게 바꾼 뒤 JSONResponse로 감싸요.\nFlask에서 넘어오면 습관적으로 jsonify를 찾게 되는데, FastAPI에는 필요 없어요.',
    },
    {
      id: 'web-01-04', type: 'mcq', source: '프레임워크와 FastAPI의 위치',
      question: '"인증, 관리자 화면, ORM, 템플릿이 모두 기본으로 들어 있지만 배울 것이 많다"는 설명에 가장 잘 맞는 프레임워크는?',
      choices: ['FastAPI', 'Flask', 'Django', 'Starlette'],
      answer: 2,
      choiceExplanations: [
        'FastAPI는 마이크로 프레임워크예요. ORM이나 관리자 화면은 직접 골라 붙여요.',
        'Flask도 최소 기능만 있는 마이크로 프레임워크예요.',
        '정답. Django는 대표적인 풀스택(배터리 포함) 프레임워크예요.',
        'Starlette은 FastAPI의 기반이 되는 가벼운 비동기 툴킷이에요.',
      ],
      explanation: '풀스택 프레임워크 = 다 들어 있음(Django, Spring, Rails), 마이크로 프레임워크 = 핵심만 + 필요한 걸 조립(Flask, FastAPI).\nFastAPI로 DB를 쓰려면 SQLAlchemy를, 인증을 하려면 세션 미들웨어나 JWT 라이브러리를 직접 골라 붙여요. 이 트랙에서 그 조립 과정을 하나씩 배워요.',
    },
    {
      id: 'web-01-05', type: 'mcq', source: '모놀리식과 마이크로서비스',
      question: '쇼핑몰을 MSA로 나눴다. 회원·주문·결제 서비스가 각각 따로 배포된다. 이때 새로 생기는 어려움이 아닌 것은?',
      choices: ['서비스끼리 네트워크로 호출하므로 지연과 실패 가능성이 늘어난다', '결제 서비스만 따로 확장(서버 증설)할 수 없다', '주문과 결제처럼 여러 서비스에 걸친 작업의 데이터 일관성을 맞추기 어렵다', '서비스별 로그와 배포를 관리하는 인프라가 복잡해진다'],
      answer: 1,
      choiceExplanations: [
        '함수 호출이던 것이 HTTP 호출이 되니 느려지고 실패할 수 있어요. MSA의 대표적인 비용이에요.',
        '정답(어려움이 아님). 오히려 서비스별로 따로 확장할 수 있는 게 MSA의 장점이에요.',
        '한 DB 트랜잭션으로 묶을 수 없어 분산 트랜잭션 문제가 생겨요.',
        '서비스가 여러 개라 모니터링·배포 파이프라인도 여러 개가 돼요.',
      ],
      explanation: 'MSA의 장점: 서비스별 독립 배포·독립 확장, 장애 격리, 팀별 기술 선택.\nMSA의 비용: 네트워크 호출, 분산 데이터 일관성, 운영 복잡도.\n작은 팀이나 개인 프로젝트는 모놀리식으로 시작하고, 정말 필요한 부분만 나누는 게 보통이에요.',
    },
    {
      id: 'web-01-06', type: 'short', source: '모놀리식과 마이크로서비스',
      question: '모든 기능이 하나의 프로그램·하나의 배포 단위에 들어 있는 구조를 무엇이라 하나요? (영어 또는 한글)',
      answer: ['모놀리식', 'monolithic', '모놀리식아키텍처', 'monolith', '모놀리스'],
      explanation: '모놀리식(Monolithic) 아키텍처예요.\n만들고 디버깅하기 쉽지만, 커지면 작은 수정에도 전체를 다시 배포해야 하고 한 기능의 장애가 전체에 영향을 줘요. 반대 개념이 마이크로서비스 아키텍처(MSA)예요.',
    },
    {
      id: 'web-01-07', type: 'mcq', source: 'FastAPI의 장점',
      question: '아래 코드에 GET /items/abc 요청이 오면 어떻게 될까?',
      code: `@app.get("/items/{item_id}")
def read_item(item_id: int):
    return {"id": item_id}`,
      choices: ['item_id에 문자열 "abc"가 들어가 {"id": "abc"}가 응답된다', '함수 안에서 ValueError가 나서 500 에러가 된다', '404 Not Found가 된다', '함수가 실행되기 전에 FastAPI가 검증에 실패해 422 에러를 돌려준다'],
      answer: 3,
      choiceExplanations: [
        '타입 힌트가 int라서 FastAPI가 변환을 시도하고, 실패하면 함수까지 가지 않아요.',
        '함수는 아예 호출되지 않아요. 500은 서버 코드 안에서 예외가 났을 때예요.',
        '경로 모양(/items/무언가)은 맞으니 라우트는 찾았어요. 값 검증에서 실패한 거예요.',
        '정답. 422 Unprocessable Entity와 함께 어떤 값이 왜 틀렸는지 JSON으로 알려줘요.',
      ],
      explanation: 'FastAPI는 타입 힌트를 보고 Pydantic으로 값을 "변환 + 검증"해요.\n"5"는 int 5로 변환되지만 "abc"는 변환이 안 되니 422를 돌려줘요. 응답 본문에는 {"detail": [{"loc": ["path", "item_id"], "msg": "...", "type": "int_parsing"}]} 처럼 위치와 이유가 담겨요.\n이 덕분에 함수 안에서 if not item_id.isdigit() 같은 검사를 직접 쓸 필요가 없어요.',
    },
    {
      id: 'web-01-08', type: 'mcq', source: 'FastAPI의 장점',
      question: 'FastAPI에서 /docs 주소로 들어가면 볼 수 있는 것은?',
      choices: ['서버 로그 파일', 'FastAPI 공식 홈페이지', '코드에서 자동 생성된 Swagger UI API 문서', '데이터베이스 관리 화면'],
      answer: 2,
      choiceExplanations: [
        '로그는 터미널(uvicorn 출력)에서 봐요.',
        '공식 문서는 fastapi.tiangolo.com이에요.',
        '정답. 라우트·파라미터·모델 정보로 OpenAPI 스펙을 만들고, 그걸 Swagger UI로 보여줘요. 브라우저에서 바로 요청도 보낼 수 있어요.',
        'FastAPI에는 Django 같은 DB 관리자 화면이 기본으로 없어요.',
      ],
      explanation: 'FastAPI는 코드를 읽어 OpenAPI 스펙(/openapi.json)을 자동으로 만들고, 그걸 두 가지 화면으로 보여줘요.\n• /docs: Swagger UI, 직접 요청을 보내 볼 수 있음\n• /redoc: ReDoc, 읽기 좋은 문서\n문서가 코드에서 생성되니 "문서와 실제 API가 다르다"는 문제가 생기지 않아요.',
    },
    {
      id: 'web-01-09', type: 'short', source: 'FastAPI의 장점',
      question: 'FastAPI에서 요청 데이터의 타입 변환과 검증을 실제로 담당하는 라이브러리 이름은?',
      answer: ['pydantic'],
      explanation: 'Pydantic이에요. 타입 힌트를 읽어 값을 변환·검증하고, 실패하면 자세한 에러를 만들어요.\nFastAPI = Starlette(웹 처리) + Pydantic(데이터 검증) 조합이라고 기억하면 돼요. Pydantic 모델은 FastAPI 토픽에서 깊게 다뤄요.',
    },
    {
      id: 'web-01-10', type: 'ox', source: 'FastAPI의 장점',
      question: 'FastAPI의 엔드포인트는 반드시 async def로만 작성해야 한다.',
      answer: false,
      explanation: '아니에요. def와 async def 둘 다 쓸 수 있어요.\n• async def: 이벤트 루프에서 바로 실행. 안에서 await로 비동기 라이브러리를 써야 의미가 있어요.\n• def: FastAPI가 별도 스레드 풀에서 실행해 이벤트 루프를 막지 않아요.\n언제 무엇을 쓰는지는 비동기 토픽에서 자세히 배워요.',
    },
    {
      id: 'web-01-11', type: 'mcq', source: 'WSGI와 ASGI, 그리고 uvicorn',
      question: 'FastAPI 앱(main.py 안의 app)을 실행하는 올바른 명령은?',
      choices: ['uvicorn main:app --reload', 'python -m fastapi main', 'flask run', 'node main.py'],
      answer: 0,
      choiceExplanations: [
        '정답. "main 모듈의 app 객체를 uvicorn으로 띄워라"라는 뜻이고, --reload는 코드가 바뀌면 자동 재시작해요.',
        '이런 명령은 없어요. (최근에는 fastapi dev main.py라는 CLI도 있지만, 내부적으로 uvicorn을 띄워요.)',
        'Flask 앱 실행 명령이에요.',
        'Node.js 명령이에요.',
      ],
      explanation: 'FastAPI는 ASGI "앱"이고, 포트를 열고 요청을 받는 건 ASGI "서버"인 uvicorn이에요.\nuvicorn main:app → main.py 파일(모듈)에서 app 변수를 찾아 실행해요. 파일 이름이 server.py이고 변수 이름이 api라면 uvicorn server:api가 돼요.\n--reload는 개발할 때만 써요. 운영 환경에서는 끄고, 필요하면 --workers로 프로세스를 늘려요.',
    },
    {
      id: 'web-01-12', type: 'mcq', source: 'WSGI와 ASGI, 그리고 uvicorn',
      question: 'WSGI와 ASGI의 차이로 옳은 것은?',
      choices: ['WSGI는 비동기, ASGI는 동기 표준이다', 'ASGI는 async/await와 웹소켓 같은 긴 연결을 지원하는 비동기 표준이다', 'ASGI는 자바스크립트 서버 표준이다', '둘은 이름만 다르고 기능은 같다'],
      answer: 1,
      choiceExplanations: [
        '반대예요. A가 Asynchronous(비동기)의 A예요.',
        '정답. FastAPI·Starlette은 ASGI, 전통적인 Flask·Django는 WSGI예요.',
        '둘 다 파이썬 표준이에요.',
        'ASGI는 비동기 처리와 웹소켓을 지원한다는 점이 핵심 차이예요.',
      ],
      explanation: 'WSGI = Web Server Gateway Interface(동기), ASGI = Asynchronous Server Gateway Interface(비동기).\nWSGI에서는 요청 하나가 끝날 때까지 그 작업자가 묶여 있어요. ASGI에서는 DB나 외부 API를 await로 기다리는 동안 같은 작업자가 다른 요청을 처리할 수 있어요.\n대표 서버: WSGI → gunicorn, ASGI → uvicorn.',
    },
    {
      id: 'web-01-13', type: 'mcq', source: 'WSGI와 ASGI, 그리고 uvicorn',
      question: '브라우저가 FastAPI 서버에 요청을 보낼 때 거치는 순서로 맞는 것은?',
      choices: ['브라우저 → FastAPI → uvicorn → 내 함수', '브라우저 → 내 함수 → FastAPI → uvicorn', '브라우저 → uvicorn → FastAPI(라우팅·검증) → 내 함수', '브라우저 → Pydantic → 데이터베이스 → uvicorn'],
      answer: 2,
      choiceExplanations: [
        '포트를 열고 요청을 먼저 받는 건 uvicorn이에요.',
        '내 함수는 라우팅과 검증이 끝난 뒤에 호출돼요.',
        '정답. uvicorn이 HTTP를 받아 ASGI 형식으로 FastAPI에 넘기고, FastAPI가 라우트를 찾고 값을 검증한 뒤 내 함수를 호출해요.',
        'Pydantic은 FastAPI 안에서 검증할 때 쓰이는 부품이에요.',
      ],
      explanation: '전체 흐름: 브라우저 → uvicorn(ASGI 서버) → FastAPI(미들웨어 → 라우팅 → 검증·의존성) → 내 함수 → (DB) → 리턴값 JSON 변환 → uvicorn → 브라우저.\n이 그림을 기억해 두면 "422는 검증 단계, 404는 라우팅 단계, 500은 내 함수 안" 하는 식으로 에러 위치를 바로 짐작할 수 있어요.',
    },
    {
      id: 'web-01-14', type: 'ox', source: '모놀리식과 마이크로서비스',
      question: '혼자 만드는 작은 서비스라도 처음부터 마이크로서비스로 쪼개는 것이 항상 더 좋은 설계다.',
      answer: false,
      explanation: '아니에요. MSA는 독립 배포·확장의 장점이 있지만 네트워크 호출, 분산 트랜잭션, 운영 복잡도라는 비용이 커요.\n작은 서비스는 모놀리식으로 시작하고, 특정 기능의 부하나 팀 규모가 커져 분리할 이유가 생겼을 때 나누는 게 일반적인 실무 판단이에요.',
    },
  ],
}

export default topic
