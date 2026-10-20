import type { Topic } from '../../types'

const topic: Topic = {
  id: 'fa-01-basic',
  track: 'backend',
  group: 'FastAPI',
  title: 'FastAPI 개발 환경과 기본 코드',
  order: 21,
  sections: [
    {
      title: '가상 환경과 설치',
      points: [
        '프로젝트마다 가상 환경(venv)을 만들어 패키지를 따로 설치한다. 다른 프로젝트와 라이브러리 버전이 섞이지 않게 하기 위해서다.',
        'python -m venv .venv → 활성화(Windows: .venv\\Scripts\\activate, macOS/Linux: source .venv/bin/activate) → pip install "fastapi[standard]". [standard]를 붙이면 uvicorn 등 실행에 필요한 패키지가 함께 설치된다.',
        '설치한 목록은 pip freeze > requirements.txt 로 저장하고, 다른 컴퓨터에서는 pip install -r requirements.txt 로 똑같이 설치한다. 요즘은 uv나 poetry 같은 도구로 pyproject.toml에 관리하기도 한다.',
        'VS Code에서는 오른쪽 아래(또는 명령 팔레트의 Python: Select Interpreter)에서 .venv의 파이썬을 골라야 import 에러 표시가 사라지고 자동 완성이 된다.',
      ],
      code: `python -m venv .venv
.venv\\Scripts\\activate          # Windows
pip install "fastapi[standard]"
pip freeze > requirements.txt`,
    },
    {
      title: '가장 작은 FastAPI 앱',
      notionIds: ['3efdf951bf8081e09ef6d423f70984d2'],
      points: [
        'from fastapi import FastAPI → app = FastAPI() 로 앱 객체를 만든다. 이 app이 라우트를 등록받고 요청을 처리하는 중심이다.',
        '@app.get("/") 는 "GET 메서드로 / 경로에 요청이 오면 아래 함수를 실행하라"는 등록이다. 함수 이름은 자유지만 문서(/docs)에 표시되므로 의미 있게 짓는다.',
        '함수가 dict, list, str, int, Pydantic 모델 등을 리턴하면 FastAPI가 JSON으로 바꿔 응답한다. 기본 상태 코드는 200이다.',
        '같은 경로와 메서드로 라우트를 두 번 등록하면 먼저 등록된 것이 쓰인다. 라우트는 위에서부터 순서대로 비교된다.',
      ],
      code: `from fastapi import FastAPI

app = FastAPI(title="My API", version="0.1.0")

@app.get("/")
def root():
    return {"message": "Hello FastAPI"}

@app.get("/health")
def health():
    return {"status": "ok"}`,
    },
    {
      title: 'uvicorn으로 실행하기',
      points: [
        'uvicorn main:app --reload : main.py 모듈의 app 객체를 실행한다. --reload는 코드를 저장할 때마다 서버를 자동 재시작한다(개발용).',
        '기본 주소는 http://127.0.0.1:8000 이다. --host 0.0.0.0 을 주면 같은 네트워크의 다른 기기에서도 접속할 수 있고, --port 로 포트를 바꾼다.',
        'fastapi dev main.py 는 개발용 실행 명령(자동 reload), fastapi run main.py 는 운영용 실행 명령이다. 둘 다 내부적으로 uvicorn을 쓴다.',
        '파이썬 파일 안에서 실행하고 싶다면 if __name__ == "__main__": uvicorn.run("main:app", reload=True) 처럼 쓴다. reload를 쓰려면 앱을 "모듈:변수" 문자열로 넘겨야 한다.',
        '"Address already in use" 에러는 이미 그 포트로 서버가 떠 있다는 뜻이다. 이전 터미널의 서버를 끄거나 다른 포트를 쓴다.',
      ],
      code: `uvicorn main:app --reload
uvicorn main:app --host 0.0.0.0 --port 8080
fastapi dev main.py`,
    },
    {
      title: '요청이 처리되는 순서와 로그 읽기',
      points: [
        '터미널에 INFO: 127.0.0.1:54321 - "GET /health HTTP/1.1" 200 OK 같은 접근 로그가 찍힌다. 메서드·경로·상태 코드를 한 줄에서 확인할 수 있다.',
        '등록되지 않은 경로로 요청하면 404 {"detail": "Not Found"}, 경로는 있는데 메서드가 다르면 405 {"detail": "Method Not Allowed"}가 자동으로 나온다.',
        '함수 안에서 처리하지 않은 예외가 나면 500 Internal Server Error가 응답되고, 터미널에 Traceback이 찍힌다. 원인은 브라우저가 아니라 터미널에서 찾는다.',
        'print()는 터미널에 찍히지만, 운영에서는 logging 모듈로 수준(INFO, WARNING, ERROR)을 나눠 남기는 것이 좋다.',
      ],
    },
  ],
  questions: [
    {
      id: 'fa-01-01', type: 'mcq', source: '가상 환경과 설치',
      question: '프로젝트마다 가상 환경(venv)을 따로 만드는 가장 큰 이유는?',
      choices: ['프로젝트마다 라이브러리와 버전을 독립적으로 관리하려고', '파이썬 실행 속도를 높이려고', 'FastAPI는 가상 환경에서만 설치되므로', '보안 인증서를 만들려고'],
      answer: 0,
      choiceExplanations: [
        '정답. A 프로젝트는 pydantic 1, B 프로젝트는 pydantic 2가 필요할 때 전역 설치로는 둘을 동시에 만족시킬 수 없어요.',
        '속도와는 관계없어요.',
        '전역에도 설치는 돼요. 다만 관리가 엉망이 돼요.',
        '인증서와는 관계없어요.',
      ],
      explanation: '가상 환경 = 프로젝트 전용 파이썬 + 전용 패키지 폴더.\n배포 서버에서도 requirements.txt(또는 pyproject.toml)로 똑같은 버전을 설치해야 "내 컴퓨터에선 되는데 서버에선 안 돼"를 줄일 수 있어요.',
    },
    {
      id: 'fa-01-02', type: 'short', source: '가상 환경과 설치',
      question: '현재 가상 환경에 설치된 패키지 목록을 requirements.txt로 저장하는 명령은? (pip ___ > requirements.txt)',
      answer: ['freeze', 'pip freeze', 'pipfreeze'],
      explanation: 'pip freeze > requirements.txt 예요. 다른 환경에서는 pip install -r requirements.txt 로 같은 버전을 설치해요.\n주의: 가상 환경을 활성화하지 않고 freeze 하면 전역 패키지 목록이 저장돼요.',
    },
    {
      id: 'fa-01-03', type: 'mcq', source: '가상 환경과 설치',
      question: 'pip install로 fastapi를 설치했는데 VS Code에서 from fastapi import FastAPI에 노란 밑줄(Import could not be resolved)이 뜬다. 가장 먼저 확인할 것은?',
      choices: ['FastAPI를 다시 설치한다', '파일 이름을 fastapi.py로 바꾼다', 'VS Code가 .venv의 파이썬 인터프리터를 쓰고 있는지 확인한다', '컴퓨터를 재부팅한다'],
      answer: 2,
      choiceExplanations: [
        '이미 설치는 됐을 가능성이 높아요. VS Code가 다른 파이썬을 보고 있는 게 문제예요.',
        '절대 안 돼요. 내 파일 이름이 fastapi.py면 import fastapi가 진짜 라이브러리 대신 내 파일을 불러와요.',
        '정답. Python: Select Interpreter에서 프로젝트의 .venv를 선택하면 해결되는 경우가 대부분이에요.',
        '재부팅은 원인과 관계없어요.',
      ],
      explanation: '패키지는 "그 가상 환경의 파이썬"에만 설치돼요. 에디터가 다른 파이썬(전역)을 보고 있으면 못 찾는다고 표시해요.\n덤으로: 내 파일 이름을 라이브러리 이름(fastapi.py, pydantic.py, sqlalchemy.py)과 똑같이 지으면 순환 import 에러가 나니 피하세요.',
    },
    {
      id: 'fa-01-04', type: 'mcq', source: '가장 작은 FastAPI 앱',
      question: '다음 앱에 GET / 요청을 보냈을 때의 응답으로 맞는 것은?',
      code: `from fastapi import FastAPI
app = FastAPI()

@app.get("/")
def root():
    return {"message": "hi", "count": 3}`,
      choices: ['상태 201, 본문 {"message": "hi", "count": 3}', "상태 200, 본문 \"{'message': 'hi', 'count': 3}\" (파이썬 문자열)", '상태 500, dict는 직접 JSON으로 바꿔야 함', '상태 200, 본문 {"message": "hi", "count": 3} (JSON)'],
      answer: 3,
      choiceExplanations: [
        '201은 status_code=201을 지정했을 때만이에요.',
        'FastAPI는 파이썬 repr 문자열이 아니라 진짜 JSON(Content-Type: application/json)으로 보내요.',
        '변환은 FastAPI가 자동으로 해요.',
        '정답. dict를 리턴하면 JSON으로 변환되고, 기본 상태 코드는 200이에요.',
      ],
      explanation: '리턴값 → jsonable_encoder로 JSON 호환 값으로 변환 → JSONResponse로 감싸 응답.\n상태 코드를 바꾸려면 @app.get("/", status_code=201)처럼 데코레이터에 지정하거나 Response 객체를 직접 리턴해요(응답 클래스 토픽).',
    },
    {
      id: 'fa-01-05', type: 'mcq', source: '가장 작은 FastAPI 앱',
      question: '같은 경로가 두 번 등록됐다. GET /users/me 요청 시 실행되는 함수는?',
      code: `@app.get("/users/{user_id}")
def read_user(user_id: str):
    return {"user_id": user_id}

@app.get("/users/me")
def read_me():
    return {"user_id": "현재 로그인 사용자"}`,
      choices: ['read_me', 'read_user (user_id="me")', '둘 다 실행된다', '서버가 시작되지 않는다'],
      answer: 1,
      choiceExplanations: [
        '/users/me가 더 구체적이지만, 라우트는 등록 순서대로 비교돼서 먼저 등록된 /users/{user_id}가 먼저 매칭돼요.',
        '정답. "me"가 user_id 자리에 들어가요. read_me는 영영 실행되지 않아요.',
        '한 요청에는 하나의 라우트만 실행돼요.',
        '에러 없이 시작돼요. 그래서 더 찾기 어려운 버그예요.',
      ],
      explanation: 'FastAPI(Starlette)는 라우트를 등록된 순서대로 검사하고 처음 맞는 것을 실행해요.\n해결: 고정 경로(/users/me)를 변수 경로(/users/{user_id})보다 먼저 선언하세요. 만약 user_id: int였다면 "me"가 int 변환에 실패해 422가 났을 거예요. 이것도 다음 라우트로 넘어가지 않아요.',
    },
    {
      id: 'fa-01-06', type: 'short', source: 'uvicorn으로 실행하기',
      question: 'app.py 파일 안에 api = FastAPI()로 앱을 만들었다. uvicorn으로 실행하는 명령의 빈칸은? uvicorn ______ --reload',
      answer: ['app:api'],
      explanation: '"모듈이름:변수이름" 형식이라 app:api예요.\n자주 하는 실수: 파일 이름(app.py)과 변수 이름(app)이 같다고 생각해 app:app으로 쓰는 것. 그러면 "Attribute app not found in module app" 에러가 나요.\n폴더 안에 있다면 패키지 경로로 써요. 예: app/main.py의 app → uvicorn app.main:app',
    },
    {
      id: 'fa-01-07', type: 'mcq', source: 'uvicorn으로 실행하기',
      question: '--reload 옵션에 대한 설명으로 틀린 것은?',
      choices: ['코드 파일을 저장하면 서버가 자동으로 재시작된다', '개발할 때 편하다', '운영 서버에서도 켜 두는 것이 권장된다', '파일 변화를 감시하느라 자원을 더 쓴다'],
      answer: 2,
      choiceExplanations: [
        '맞는 설명이에요.',
        '맞는 설명이에요.',
        '정답(틀린 설명). 운영에서는 끄고, 필요하면 --workers로 프로세스를 늘려요.',
        '맞는 설명이에요. 파일 감시 프로세스가 따로 돌아요.',
      ],
      explanation: '--reload는 개발 전용이에요. 운영 환경에서는 예상치 못한 재시작, 추가 자원 사용의 원인이 돼요.\n개발: uvicorn main:app --reload (또는 fastapi dev)\n운영: uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4 (또는 fastapi run)',
    },
    {
      id: 'fa-01-08', type: 'mcq', source: 'uvicorn으로 실행하기',
      question: '노트북에서 uvicorn main:app 으로 서버를 띄웠다. 같은 와이파이의 휴대폰에서 노트북IP:8000 으로 접속이 안 된다. 가장 알맞은 해결책은?',
      choices: ['--reload를 붙인다', '포트를 80으로 바꾼다', 'CORS를 설정한다', '--host 0.0.0.0 옵션으로 다시 실행한다'],
      answer: 3,
      choiceExplanations: [
        'reload는 코드 변경 감지 기능이에요.',
        '포트 문제가 아니라 어떤 주소에서 요청을 받느냐의 문제예요.',
        'CORS는 브라우저 자바스크립트의 교차 출처 요청 문제예요. 접속 자체가 안 되는 것과는 달라요.',
        '정답. 기본값 127.0.0.1은 "이 컴퓨터 자신"만 받아요. 0.0.0.0은 모든 네트워크 인터페이스에서 받아요.',
      ],
      explanation: '127.0.0.1(localhost)은 루프백 주소라 같은 컴퓨터 안에서만 접속돼요.\n0.0.0.0은 "모든 인터페이스에서 듣기"라 다른 기기도 접속할 수 있어요. Docker 컨테이너 안에서 실행할 때도 꼭 --host 0.0.0.0이 필요해요. 방화벽이 막고 있을 수도 있으니 그것도 확인하세요.',
    },
    {
      id: 'fa-01-09', type: 'ox', source: 'uvicorn으로 실행하기',
      question: 'uvicorn.run(app, reload=True)처럼 앱 객체를 직접 넘겨도 reload가 정상 동작한다.',
      answer: false,
      explanation: 'reload나 workers를 쓰려면 uvicorn.run("main:app", reload=True)처럼 "모듈:변수" 문자열로 넘겨야 해요.\nreload는 새 프로세스에서 모듈을 다시 import해야 하는데, 객체를 넘기면 다시 불러올 방법이 없기 때문이에요. 객체로 넘기면 uvicorn이 경고를 출력해요.',
    },
    {
      id: 'fa-01-10', type: 'mcq', source: '요청이 처리되는 순서와 로그 읽기',
      question: '@app.get("/items")만 등록된 상태에서 POST /items 요청을 보냈다. 응답은?',
      choices: ['404 Not Found', '422 Unprocessable Entity', '405 Method Not Allowed', '200 OK'],
      answer: 2,
      choiceExplanations: [
        '경로 /items는 존재하니 404가 아니에요.',
        '422는 라우트를 찾은 뒤 값 검증에 실패했을 때예요.',
        '정답. 경로는 있지만 POST를 처리하는 라우트가 없어요.',
        '처리할 함수가 없으니 성공할 수 없어요.',
      ],
      explanation: '에러 코드로 문제 위치를 추리하는 연습:\n• 404: 경로 자체가 없음 → URL 오타, prefix 확인\n• 405: 경로는 있는데 메서드가 다름 → @app.get인지 @app.post인지 확인\n• 422: 라우트는 찾았는데 값 검증 실패 → 응답의 detail 확인\n• 500: 내 함수 안에서 예외 → 터미널 Traceback 확인',
    },
    {
      id: 'fa-01-11', type: 'mcq', source: '요청이 처리되는 순서와 로그 읽기',
      question: '브라우저에 "Internal Server Error"만 보인다. 원인을 찾으려면 어디를 봐야 할까?',
      choices: ['브라우저 개발자 도구의 Elements 탭', 'uvicorn을 실행한 터미널의 Traceback', '/docs 페이지', 'requirements.txt'],
      answer: 1,
      choiceExplanations: [
        'HTML 구조만 보여요.',
        '정답. 500 에러의 상세 원인(어느 파일, 몇 번째 줄, 어떤 예외)은 서버 터미널에 찍혀요.',
        '/docs에서 다시 요청해도 같은 500만 보여요.',
        '설치 목록일 뿐이에요.',
      ],
      explanation: '보안상 서버는 내부 에러 정보를 클라이언트에 보내지 않아요. 그래서 500의 원인은 항상 서버 로그에서 찾아요.\nTraceback은 아래에서부터 읽어요. 맨 아래 줄이 예외 종류와 메시지, 그 위가 에러가 난 내 코드 위치예요.',
    },
    {
      id: 'fa-01-12', type: 'short', source: '요청이 처리되는 순서와 로그 읽기',
      question: 'FastAPI에서 등록되지 않은 경로로 요청했을 때 응답 본문은 {"detail": "Not Found"}다. 이때 상태 코드 숫자는?',
      answer: ['404'],
      explanation: '404예요. FastAPI의 기본 에러 응답은 항상 {"detail": ...} 형식이에요.\nHTTPException(status_code=404, detail="게시글이 없습니다")를 직접 raise해도 같은 형식으로 나가서 프론트가 일관되게 처리할 수 있어요.',
    },
    {
      id: 'fa-01-13', type: 'ox', source: '가장 작은 FastAPI 앱',
      question: 'FastAPI 라우트 함수의 이름은 /docs 문서에 표시되는 기본 설명(summary)에 쓰인다.',
      answer: true,
      explanation: '맞아요. read_items 함수는 문서에 "Read Items"로 표시돼요. 함수의 docstring은 설명(description)으로 들어가요.\n그래서 함수 이름을 f1, test 같은 이름 대신 동작을 설명하는 이름으로 짓는 게 좋아요. @app.get("/", summary="...", tags=["items"])로 직접 지정할 수도 있어요.',
    },
  ],
}

export default topic
