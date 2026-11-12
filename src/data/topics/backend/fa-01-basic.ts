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
      slides: [
        {
          title: '프로젝트마다 따로 쓰는 방',
          blocks: [
            { type: 'say', text: '이제 FastAPI를 직접 설치하고 첫 서버를 띄워 볼 거예요. 그 전에 꼭 만드는 게 있어요. **가상 환경(venv)** 이에요.\n\nA 프로젝트는 라이브러리 1.0이 필요하고, B 프로젝트는 2.0이 필요하다면? 컴퓨터 전체에 하나만 깔 수 있으면 둘 중 하나가 고장 나요. 가상 환경은 **프로젝트마다 따로 쓰는 라이브러리 방**이에요. 버전이 서로 섞이지 않아요.' },
            { type: 'code', code: `python -m venv .venv            # 1) .venv 라는 방 만들기
.venv\\Scripts\\activate          # 2) 방에 들어가기 (Windows)
source .venv/bin/activate       #    macOS / Linux
pip install "fastapi[standard]" # 3) 그 방에 설치` },
            { type: 'say', text: '`[standard]`를 붙이면 FastAPI와 함께 **uvicorn** 등 실행에 필요한 패키지가 같이 설치돼요.' },
          ],
        },
        {
          title: '설치 목록 공유와 VS Code 설정',
          blocks: [
            { type: 'code', code: `pip freeze > requirements.txt      # 지금 설치된 목록 저장
pip install -r requirements.txt    # 다른 컴퓨터에서 똑같이 설치` },
            { type: 'say', text: '`requirements.txt`는 **장보기 목록**이에요. 팀원이나 서버는 이 목록만 보고 같은 버전을 그대로 설치해요. 요즘은 **uv**나 poetry 같은 도구로 `pyproject.toml`에 관리하기도 해요.' },
            { type: 'note', tone: 'warn', text: '설치했는데 VS Code에서 `from fastapi import FastAPI`에 노란 밑줄(Import could not be resolved)이 뜬다면? VS Code가 **가상 환경 밖의 파이썬**을 보고 있는 거예요. 명령 팔레트에서 **Python: Select Interpreter** → `.venv` 안의 파이썬을 고르세요.' },
          ],
        },
      ],
    },
    {
      title: '가장 작은 FastAPI 앱',
      notionIds: ['3efdf951bf8081e09ef6d423f70984d2'],
      slides: [
        {
          title: '열 줄짜리 API 서버',
          blocks: [
            { type: 'code', code: `from fastapi import FastAPI

app = FastAPI(title="My API", version="0.1.0")

@app.get("/")
def root():
    return {"message": "Hello FastAPI"}

@app.get("/health")
def health():
    return {"status": "ok"}` },
            { type: 'list', items: ['`app = FastAPI()` — 라우트를 등록받고 요청을 처리하는 **중심 객체**', '`@app.get("/")` — "GET 메서드로 `/`에 요청이 오면 아래 함수를 실행해" (지난 수업의 데코레이터!)', '`return {...}` — dict, list, str, Pydantic 모델을 돌려주면 FastAPI가 **JSON으로** 바꿔 줘요. 기본 상태 코드는 **200**'] },
          ],
        },
        {
          title: '함수 이름과 라우트 순서',
          blocks: [
            { type: 'say', text: '함수 이름은 자유지만, `/docs` 문서에 **설명(summary)으로 표시**돼요. `root`, `health`처럼 의미 있게 지어요.\n\n그리고 라우트는 **위에서부터 순서대로** 비교해요. 같은 경로·메서드를 두 번 등록하면 **먼저 등록된 것**이 쓰이고, 뒤의 것은 영영 실행되지 않아요.' },
            { type: 'ask', q: '`@app.get("/users/me")`를 두 번 등록했어요. 첫 번째는 "A", 두 번째는 "B"를 돌려줘요. 요청하면?', a: '**"A"** 예요. 요청이 오면 위에서부터 맞는 라우트를 찾다가 첫 번째에서 멈춰요. 두 번째 함수는 등록만 되고 실행될 일이 없어요.' },
          ],
        },
      ],
    },
    {
      title: 'uvicorn으로 실행하기',
      slides: [
        {
          title: '서버 켜기',
          blocks: [
            { type: 'code', code: `uvicorn main:app --reload
uvicorn main:app --host 0.0.0.0 --port 8080
fastapi dev main.py     # 개발용 (자동 reload)
fastapi run main.py     # 운영용` },
            {
              type: 'table',
              head: ['부분', '뜻'],
              rows: [
                ['`main:app`', '`main.py` 모듈 안의 `app` 변수. 파일이 `app.py`, 변수가 `api`면 `app:api`'],
                ['`--reload`', '코드를 **저장할 때마다 자동 재시작** (개발용, 운영에선 끔)'],
                ['기본 주소', '`http://127.0.0.1:8000`'],
                ['`--host 0.0.0.0`', '**같은 네트워크의 다른 기기**(휴대폰)에서도 접속 가능'],
                ['`--port`', '포트 바꾸기'],
              ],
            },
          ],
        },
        {
          title: '자주 만나는 두 가지',
          blocks: [
            { type: 'say', text: '**① 휴대폰에서 노트북 서버에 접속이 안 돼요**\n기본 주소 `127.0.0.1`은 "**나 자신**(이 컴퓨터)"만 뜻해요. 다른 기기에서 들어오려면 `--host 0.0.0.0`으로 "모든 네트워크 입구에서 받기"로 열어야 해요.\n\n**② Address already in use**\n그 포트로 서버가 **이미 떠 있어요.** 예전 터미널의 서버를 끄거나 다른 포트를 써요.' },
            { type: 'code', code: `if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", reload=True)   # 문자열로 넘겨야 reload 동작` },
            { type: 'note', tone: 'warn', text: '파이썬 파일 안에서 실행할 때 `uvicorn.run(app, reload=True)`처럼 **객체를 직접** 넘기면 reload가 동작하지 않아요. 재시작할 때 모듈을 새로 불러와야 해서 `"모듈:변수"` **문자열**이 필요해요.' },
          ],
        },
      ],
    },
    {
      title: '요청이 처리되는 순서와 로그 읽기',
      slides: [
        {
          title: '터미널 로그 한 줄 읽기',
          blocks: [
            { type: 'code', code: `INFO:  127.0.0.1:54321 - "GET /health HTTP/1.1" 200 OK

127.0.0.1:54321   → 누가 보냈나
GET /health       → 메서드와 경로
200 OK            → 상태 코드` },
            { type: 'say', text: '요청이 올 때마다 uvicorn 터미널에 이런 **접근 로그**가 찍혀요. 메서드·경로·상태 코드를 한 줄에서 확인할 수 있어요. `/docs`에서 보낸 요청도 똑같이 찍혀요.' },
            {
              type: 'table',
              head: ['상황', '자동 응답'],
              rows: [
                ['등록 안 된 경로', '**404** `{"detail": "Not Found"}`'],
                ['경로는 있는데 메서드가 다름', '**405** `{"detail": "Method Not Allowed"}`'],
                ['함수 안에서 처리 안 된 예외', '**500** Internal Server Error'],
              ],
            },
          ],
        },
        {
          title: '500이 나면 터미널을 보세요',
          blocks: [
            { type: 'say', text: '브라우저에는 "Internal Server Error" 한 줄만 보여요. 보안상 서버 내부 사정을 손님에게 보여 주지 않거든요. **진짜 원인(Traceback)은 서버 터미널에** 찍혀 있어요. 맨 아래 줄부터 읽으면 어느 파일 몇 번째 줄에서 무슨 에러가 났는지 나와요.' },
            { type: 'note', tone: 'tip', text: '`print()`도 터미널에 찍히지만, 운영에서는 `logging` 모듈로 수준(INFO, WARNING, ERROR)을 나눠서 남겨요. 나중에 "에러만 모아 보기"가 가능해져요.' },
          ],
        },
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
