import type { Topic } from '../../types'

const topic: Topic = {
  id: 'fa-02-docs',
  track: 'backend',
  group: 'FastAPI',
  title: 'Swagger UI · ReDoc · OpenAPI',
  order: 22,
  sections: [
    {
      title: 'OpenAPI 스펙이란',
      points: [
        'OpenAPI는 "이 API에는 어떤 경로가 있고, 각각 어떤 입력을 받고 어떤 출력을 주는지"를 JSON(또는 YAML)으로 적는 표준 형식이다.',
        'FastAPI는 라우트·파라미터·타입 힌트·Pydantic 모델을 읽어 이 스펙을 자동으로 만들고 /openapi.json 에서 제공한다.',
        '이 스펙 하나로 문서 화면(Swagger UI, ReDoc), 프론트용 API 클라이언트 코드 자동 생성(openapi-typescript 등), 테스트 도구 연동이 모두 가능하다.',
        '코드가 바뀌면 스펙도 자동으로 바뀐다. 문서를 따로 손으로 고칠 필요가 없다.',
      ],
    },
    {
      title: 'Swagger UI (/docs)',
      points: [
        '/docs 로 들어가면 모든 엔드포인트가 목록으로 보이고, 각 항목을 펼쳐 "Try it out" → 값 입력 → "Execute"로 실제 요청을 보낼 수 있다.',
        '요청 결과로 실제 응답 본문, 상태 코드, 응답 헤더, 그리고 같은 요청을 보내는 curl 명령까지 보여 준다. curl 명령을 복사해 터미널에서 다시 실행할 수 있다.',
        '아래쪽 Schemas 영역에는 Pydantic 모델의 구조(필드, 타입, 필수 여부, 예시)가 정리돼 있다.',
        '인증이 설정돼 있으면 오른쪽 위 Authorize 버튼으로 로그인 정보를 넣고 테스트할 수 있다.',
      ],
    },
    {
      title: 'ReDoc (/redoc)',
      points: [
        '/redoc 은 같은 OpenAPI 스펙을 "읽기 좋은 문서" 형태로 보여 준다. 왼쪽 목차, 가운데 설명, 오른쪽 예시 구조다.',
        'Swagger UI는 "직접 눌러 보는 테스트 도구", ReDoc은 "외부 공유용 문서"에 어울린다.',
        'ReDoc에는 요청을 보내는 Try it out 기능이 없다.',
      ],
    },
    {
      title: '문서를 풍부하게 만드는 방법',
      points: [
        'FastAPI(title=..., description=..., version=...) 로 문서 맨 위 정보를 바꾼다.',
        '라우트 데코레이터에 tags=["users"] 를 주면 문서에서 그룹으로 묶인다. summary="...", description="...", response_description="..." 로 설명을 붙인다. 함수의 docstring도 description으로 쓰인다.',
        'Pydantic 필드에 Field(description="...", examples=[...]) 를 주면 스키마 문서에 설명과 예시가 들어간다.',
        'deprecated=True 를 주면 문서에 줄이 그어진 채로 "곧 없어질 API"라고 표시된다. include_in_schema=False 를 주면 문서에서 숨긴다(동작은 그대로).',
        '운영에서 문서를 숨기려면 FastAPI(docs_url=None, redoc_url=None) 로 끈다. openapi_url=None 이면 스펙 자체도 사라진다.',
      ],
      code: `app = FastAPI(
    title="Remind API",
    description="복습 기록 동기화 API",
    version="1.0.0",
    docs_url="/docs",        # None 이면 Swagger UI 끔
)

@app.get("/users/{user_id}", tags=["users"], summary="사용자 한 명 조회")
def read_user(user_id: int):
    """id로 사용자를 찾는다. 없으면 404."""
    ...

@app.get("/internal/ping", include_in_schema=False)
def ping():
    return "pong"`,
    },
  ],
  questions: [
    {
      id: 'fa-02-01', type: 'short', source: 'OpenAPI 스펙이란',
      question: 'FastAPI가 자동으로 만든 OpenAPI 스펙(JSON)을 제공하는 기본 경로는? (슬래시 포함)',
      answer: ['/openapi.json', 'openapi.json'],
      explanation: '/openapi.json 이에요. /docs와 /redoc 화면은 모두 이 JSON을 읽어 그려요.\n프론트에서 npx openapi-typescript http://localhost:8000/openapi.json -o api.d.ts 처럼 타입을 자동 생성하면 백엔드 모델과 프론트 타입이 어긋나는 걸 막을 수 있어요.',
    },
    {
      id: 'fa-02-02', type: 'mcq', source: 'OpenAPI 스펙이란',
      question: 'FastAPI가 OpenAPI 문서를 만들 때 사용하는 정보가 아닌 것은?',
      choices: ['경로와 HTTP 메서드', '함수 파라미터의 타입 힌트와 기본값', '함수 안에서 if 문으로 직접 검사하는 조건', 'Pydantic 모델의 필드'],
      answer: 2,
      choiceExplanations: [
        '데코레이터의 경로·메서드가 문서의 뼈대예요.',
        '타입과 기본값으로 필수 여부·타입을 문서에 적어요.',
        '정답. 함수 본문 안의 로직은 FastAPI가 읽을 수 없어요. 그래서 검증 규칙은 if 문보다 타입 힌트·Query·Field로 선언해야 문서에도 나타나요.',
        '요청·응답 본문의 구조가 Schemas에 들어가요.',
      ],
      explanation: 'FastAPI는 "선언된 것"만 알아요. if len(q) > 50: raise ... 는 동작은 하지만 문서에는 안 보여요.\n반대로 q: str = Query(max_length=50)으로 선언하면 검증 + 문서화가 동시에 돼요. 이게 FastAPI에서 "선언적으로 쓰라"는 이유예요.',
    },
    {
      id: 'fa-02-03', type: 'mcq', source: 'Swagger UI (/docs)',
      question: 'Swagger UI에서 할 수 없는 일은?',
      choices: ['엔드포인트 목록과 파라미터 확인', '서버의 파이썬 코드 수정', 'Try it out으로 실제 요청 보내기', '같은 요청을 보내는 curl 명령 확인'],
      answer: 1,
      choiceExplanations: [
        '할 수 있어요.',
        '정답. Swagger UI는 문서·테스트 도구일 뿐 코드를 바꿀 수 없어요.',
        '할 수 있어요. 실제 서버로 요청이 가요. DELETE를 누르면 진짜로 지워지니 주의하세요.',
        '할 수 있어요. Execute 후 Curl 칸에 나와요.',
      ],
      explanation: 'Swagger UI의 Try it out은 "진짜 요청"을 보내요. 운영 DB에 연결된 서버의 /docs에서 DELETE를 실행하면 실제 데이터가 지워져요.\n그래서 운영 서버에서는 docs를 끄거나 인증을 걸어 두는 경우가 많아요.',
    },
    {
      id: 'fa-02-04', type: 'ox', source: 'Swagger UI (/docs)',
      question: 'Swagger UI의 Try it out으로 보낸 요청도 uvicorn 터미널에 접근 로그가 찍힌다.',
      answer: true,
      explanation: '맞아요. 브라우저(Swagger UI 페이지의 자바스크립트)가 서버로 진짜 HTTP 요청을 보내는 것이라, 다른 요청과 똑같이 로그가 찍히고 내 함수가 실행돼요.\n/docs 페이지를 여는 것 자체도 GET /docs, GET /openapi.json 요청으로 로그에 남아요.',
    },
    {
      id: 'fa-02-05', type: 'mcq', source: 'ReDoc (/redoc)',
      question: 'Swagger UI와 ReDoc의 차이로 맞는 것은?',
      choices: ['ReDoc은 다른 OpenAPI 스펙을 쓴다', 'Swagger UI는 유료다', 'ReDoc은 GET 요청만 보여 준다', 'ReDoc에는 Try it out(요청 보내기) 기능이 없고 읽기용 문서에 가깝다'],
      answer: 3,
      choiceExplanations: [
        '둘 다 같은 /openapi.json을 읽어요.',
        '둘 다 무료 오픈소스예요.',
        '모든 메서드를 보여 줘요.',
        '정답. Swagger UI = 테스트 도구, ReDoc = 읽기 좋은 문서.',
      ],
      explanation: '같은 스펙, 다른 화면이에요. 개발 중에는 /docs로 직접 눌러 보며 테스트하고, 다른 팀이나 외부 개발자에게 공유할 때는 /redoc이 읽기 편해요.',
    },
    {
      id: 'fa-02-06', type: 'short', source: '문서를 풍부하게 만드는 방법',
      question: '여러 엔드포인트를 /docs에서 "users", "posts" 같은 그룹으로 묶어 보여 주려면 라우트 데코레이터에 어떤 인자를 주나요?',
      answer: ['tags', 'tags=', 'tags=[]'],
      explanation: 'tags예요. @app.get("/users", tags=["users"]).\nAPIRouter(prefix="/users", tags=["users"])처럼 라우터에 한 번 주면 그 라우터의 모든 엔드포인트에 적용돼요(의존성·라우터 토픽).',
    },
    {
      id: 'fa-02-07', type: 'mcq', source: '문서를 풍부하게 만드는 방법',
      question: '운영 서버에서 /docs와 /redoc 화면을 끄는 방법으로 맞는 것은?',
      choices: ['모든 라우트에 include_in_schema=False', 'FastAPI(docs_url=None, redoc_url=None)', 'uvicorn --no-docs', 'pip uninstall swagger'],
      answer: 1,
      choiceExplanations: [
        '이건 개별 라우트를 문서에서 숨기는 거라, 문서 화면 자체는 남아요.',
        '정답. 두 화면의 경로를 None으로 주면 비활성화돼요. 환경 변수로 개발/운영을 나눠 설정하는 경우가 많아요.',
        '그런 옵션은 없어요.',
        'Swagger UI 파일은 CDN에서 불러와요. 패키지를 지우는 방식이 아니에요.',
      ],
      explanation: '예: docs_url="/docs" if settings.env == "dev" else None.\nopenapi_url=None까지 주면 스펙 JSON도 사라져요. 문서를 끈다고 API가 안전해지는 건 아니에요. 진짜 보호는 인증과 권한으로 해야 해요.',
    },
    {
      id: 'fa-02-08', type: 'mcq', source: '문서를 풍부하게 만드는 방법',
      question: '아래 라우트에 대한 설명으로 맞는 것은?',
      code: `@app.get("/internal/ping", include_in_schema=False)
def ping():
    return "pong"`,
      choices: ['동작은 하지만 /docs와 /openapi.json에 나타나지 않는다', '요청하면 404가 난다', '인증된 사용자만 호출할 수 있다', '서버 시작 시 한 번만 실행된다'],
      answer: 0,
      choiceExplanations: [
        '정답. 문서에서만 숨겨요.',
        '라우트는 정상 등록돼서 GET /internal/ping은 "pong"을 돌려줘요.',
        '접근 제한 기능이 아니에요. 누구나 호출할 수 있어요.',
        '요청마다 실행돼요.',
      ],
      explanation: 'include_in_schema=False는 헬스 체크나 내부용 엔드포인트를 문서에서 감출 때 써요. 보안 기능이 아니라는 점을 꼭 기억하세요. 주소를 아는 사람은 누구나 호출할 수 있어요.',
    },
    {
      id: 'fa-02-09', type: 'ox', source: '문서를 풍부하게 만드는 방법',
      question: '라우트 함수의 docstring("""...""")은 /docs에 설명으로 표시된다.',
      answer: true,
      explanation: '맞아요. 함수 docstring은 OpenAPI의 description으로 들어가고, 마크다운 문법도 지원돼요.\n설명이 길면 docstring에, 한 줄 요약은 summary 인자에 쓰는 게 깔끔해요.',
    },
    {
      id: 'fa-02-10', type: 'mcq', source: '문서를 풍부하게 만드는 방법',
      question: 'v1 API를 곧 없앨 예정이라 문서에 "사용 중단 예정"을 표시하고 싶다. 가장 알맞은 방법은?',
      choices: ['include_in_schema=False', '@app.get("/v1/items", deprecated=True)', '함수 이름을 old_로 바꾼다', 'status_code=410'],
      answer: 1,
      choiceExplanations: [
        '문서에서 아예 사라져 기존 사용자가 정보를 찾을 수 없게 돼요.',
        '정답. 문서에서 취소선과 deprecated 표시가 나오고, 동작은 그대로예요.',
        '문서 표시에 의미가 없어요.',
        '410 Gone은 "이미 없어졌다"는 뜻이라 지금 쓰는 사용자의 요청이 실패해요.',
      ],
      explanation: 'API는 갑자기 지우면 쓰던 클라이언트가 깨져요. 실무 순서: deprecated=True로 예고 → 새 버전 안내 → 일정 기간 뒤 제거(필요하면 410).',
    },
    {
      id: 'fa-02-11', type: 'mcq', source: 'OpenAPI 스펙이란',
      question: '프론트(React + TypeScript)와 백엔드 모델 타입이 자꾸 어긋난다. OpenAPI를 활용한 가장 근본적인 해결책은?',
      choices: ['프론트 개발자에게 /docs 화면 캡처를 보낸다', '백엔드 응답을 모두 문자열로 바꾼다', '/openapi.json에서 TypeScript 타입이나 API 클라이언트를 자동 생성한다', '프론트에서 any 타입을 쓴다'],
      answer: 2,
      choiceExplanations: [
        '캡처는 금방 낡아요.',
        '타입 정보가 사라져 더 위험해져요.',
        '정답. 스펙에서 코드를 생성하면 백엔드 모델이 바뀔 때 다시 생성만 하면 되고, 맞지 않는 곳은 TypeScript 컴파일 에러로 바로 드러나요.',
        '타입 검사를 포기하는 것이라 문제를 숨길 뿐이에요.',
      ],
      explanation: 'OpenAPI의 진짜 가치는 "기계가 읽을 수 있는 계약서"라는 점이에요.\n백엔드: Pydantic 모델 수정 → 스펙 자동 갱신 → 프론트: 타입 재생성 → 깨지는 곳이 컴파일 에러로 표시. 이 흐름이 잡히면 API 변경이 훨씬 안전해져요.',
    },
    {
      id: 'fa-02-12', type: 'short', source: 'Swagger UI (/docs)',
      question: 'FastAPI에서 Swagger UI 문서 화면의 기본 경로는? (슬래시 포함)',
      answer: ['/docs', 'docs'],
      explanation: '/docs예요. ReDoc은 /redoc, 스펙 JSON은 /openapi.json이에요.\n세 경로 모두 FastAPI(docs_url=..., redoc_url=..., openapi_url=...)로 바꿀 수 있어요.',
    },
  ],
}

export default topic
