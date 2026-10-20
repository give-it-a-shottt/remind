import type { Topic } from '../../types'

const topic: Topic = {
  id: 'as-01-async',
  track: 'backend',
  group: '비동기',
  title: '비동기 실행의 이해와 FastAPI의 async',
  order: 51,
  sections: [
    {
      title: '동기와 비동기',
      points: [
        '동기(sync): 작업 하나가 끝날 때까지 기다린 뒤 다음 작업을 한다. DB 응답을 기다리는 0.1초 동안 그 작업자는 아무것도 못 한다.',
        '비동기(async): 기다리는 동안 다른 작업을 진행한다. 커피숍 직원이 커피가 내려지는 동안 다음 손님 주문을 받는 것과 같다.',
        '웹 서버 작업은 대부분 I/O 대기(DB, 외부 API, 파일)다. CPU는 놀고 기다리기만 하는 시간이 길어서, 비동기로 그 대기 시간에 다른 요청을 처리하면 같은 자원으로 훨씬 많은 요청을 감당한다.',
        '비동기는 "계산을 빠르게" 만들지 않는다. 이미지 변환·대량 계산 같은 CPU 작업(CPU-bound)은 비동기로 빨라지지 않는다. 이런 작업은 멀티프로세스나 별도 작업 큐(Celery 등)로 보낸다.',
      ],
    },
    {
      title: 'async / await와 이벤트 루프',
      points: [
        'async def 로 만든 함수는 코루틴 함수다. 호출하면 바로 실행되지 않고 코루틴 객체가 만들어진다. await 해야 실제로 실행된다.',
        'await 는 "이 작업이 끝날 때까지 기다리되, 기다리는 동안 다른 작업에 양보한다"는 표시다. await는 async def 안에서만 쓸 수 있다.',
        '이벤트 루프는 양보받은 작업들을 돌려 가며 실행하는 관리자다. 한 스레드에서 여러 코루틴을 번갈아 실행한다. asyncio.run(main())이 이벤트 루프를 시작한다.',
        'asyncio.gather(a(), b(), c())로 여러 I/O 작업을 동시에 기다리면, 걸리는 시간이 합이 아니라 가장 긴 것 정도가 된다.',
      ],
      code: `import asyncio, time

async def fetch(name: str, sec: float):
    await asyncio.sleep(sec)       # I/O 대기 흉내 (양보)
    return name

async def main():
    start = time.perf_counter()
    results = await asyncio.gather(fetch("A", 1), fetch("B", 1), fetch("C", 1))
    print(results, f"{time.perf_counter() - start:.1f}s")   # ['A','B','C'] 1.0s

asyncio.run(main())`,
    },
    {
      title: '이벤트 루프를 막는 코드',
      points: [
        'async def 안에서 time.sleep(), requests.get(), 동기 DB 드라이버(pymysql, psycopg2) 같은 블로킹 함수를 부르면 그동안 이벤트 루프 전체가 멈춘다. 같은 프로세스의 다른 요청도 모두 기다린다.',
        '비동기 함수 안에서는 비동기 라이브러리를 써야 한다: asyncio.sleep, httpx.AsyncClient, asyncpg / aiomysql / aiosqlite, 비동기 SQLAlchemy.',
        '어쩔 수 없이 동기 함수를 써야 하면 await asyncio.to_thread(func, args) 나 run_in_threadpool 로 스레드에 넘겨 루프를 막지 않게 한다.',
        '증상: 동시 요청 몇 개만 와도 응답이 차례로 하나씩 처리되듯 느려진다.',
      ],
      code: `import httpx

# 나쁨: 루프를 막음
@app.get("/bad")
async def bad():
    import requests
    return requests.get("https://example.com").status_code

# 좋음: 비동기 클라이언트
@app.get("/good")
async def good():
    async with httpx.AsyncClient() as client:
        r = await client.get("https://example.com")
    return r.status_code`,
    },
    {
      title: 'FastAPI에서 def와 async def',
      points: [
        'async def 엔드포인트: 이벤트 루프에서 직접 실행된다. 안에서 await 가능한 비동기 라이브러리를 쓸 때 고른다.',
        'def 엔드포인트: FastAPI가 자동으로 스레드 풀(기본 40개 정도)에서 실행한다. 동기 라이브러리(동기 SQLAlchemy, requests)를 써도 이벤트 루프를 막지 않는다.',
        '규칙: 안에서 await를 쓴다 → async def. 동기 블로킹 라이브러리를 쓴다 → def. 잘 모르겠으면 def가 안전하다.',
        '가장 나쁜 조합은 async def 안에서 동기 블로킹 호출을 하는 것이다. 스레드 풀로도 안 가고 루프에서 직접 막혀 버린다.',
        '의존성 함수에도 같은 규칙이 적용된다. def 의존성은 스레드 풀에서, async def 의존성은 루프에서 실행된다.',
      ],
      code: `# 동기 SQLAlchemy 세션 → def
@app.get("/posts")
def list_posts(db: SessionDep):
    return db.scalars(select(Post)).all()

# 비동기 세션 → async def + await
@app.get("/a/posts")
async def list_posts_async(db: AsyncSessionDep):
    result = await db.scalars(select(Post))
    return result.all()`,
    },
  ],
  questions: [
    {
      id: 'as-01-01', type: 'mcq', source: '동기와 비동기',
      question: '비동기 처리로 가장 큰 이득을 보는 작업은?',
      choices: ['큰 이미지 리사이즈', '외부 API 3개를 호출해 응답을 기다리는 작업', '100만 개 숫자 정렬', '암호 해시 계산'],
      answer: 1,
      choiceExplanations: [
        'CPU를 계속 쓰는 계산이라 비동기로 빨라지지 않아요.',
        '정답. 대부분이 "응답 대기" 시간이라, 기다리는 동안 다른 일을 하거나 셋을 동시에 기다릴 수 있어요.',
        'CPU 작업이에요.',
        'CPU 작업이에요(bcrypt는 일부러 느리게 설계돼 있어 스레드로 넘기기도 해요).',
      ],
      explanation: 'I/O-bound(기다림이 대부분) → 비동기·스레드로 동시성 확보.\nCPU-bound(계산이 대부분) → 멀티프로세스, 작업 큐, 더 빠른 알고리즘.\n비동기는 "동시에 많이 기다리기"를 잘하는 도구예요.',
    },
    {
      id: 'as-01-02', type: 'ox', source: '동기와 비동기',
      question: 'async def로 바꾸기만 하면 CPU를 많이 쓰는 계산 함수도 더 빨라진다.',
      answer: false,
      explanation: '비동기는 기다리는 시간을 활용하는 기술이라, 계속 계산만 하는 코드는 빨라지지 않아요. 오히려 계산이 끝날 때까지 이벤트 루프를 붙잡아 다른 요청까지 멈추게 해요.\n파이썬은 GIL 때문에 한 프로세스에서 CPU 계산을 진짜 병렬로 돌리기 어려워서, CPU 작업은 ProcessPoolExecutor나 별도 워커로 보내요.',
    },
    {
      id: 'as-01-03', type: 'mcq', source: 'async / await와 이벤트 루프',
      question: '다음 코드의 출력은?',
      code: `async def hello():
    return "hi"

result = hello()
print(type(result).__name__)`,
      choices: ['str', 'function', 'None', 'coroutine'],
      answer: 3,
      choiceExplanations: [
        '아직 실행되지 않았어요. await해야 "hi"가 나와요.',
        '함수를 호출한 결과예요.',
        '코루틴 객체가 돌아와요.',
        '정답. async 함수를 호출하면 코루틴 객체가 만들어질 뿐이에요.',
      ],
      explanation: '흔한 버그: await를 빼먹고 result = db.scalars(...) (비동기 세션)처럼 쓰면 결과 대신 코루틴 객체가 들어와요. 파이썬은 "coroutine ... was never awaited" 경고를 출력해요.\n비동기 코드에서 이상한 객체가 보이면 await 누락부터 의심하세요.',
    },
    {
      id: 'as-01-04', type: 'mcq', source: 'async / await와 이벤트 루프',
      question: '각각 1초 걸리는 비동기 작업 3개를 아래처럼 실행하면 총 시간은 대략?',
      code: `await fetch("A", 1)
await fetch("B", 1)
await fetch("C", 1)`,
      choices: ['약 1초', '약 0초', '약 3초', '약 6초'],
      answer: 2,
      choiceExplanations: [
        '동시에 기다리려면 gather가 필요해요.',
        '각 작업이 1초씩 기다려요.',
        '정답. await를 차례로 쓰면 하나가 끝나야 다음이 시작돼요. 비동기여도 순차 실행이에요.',
        '1초짜리 세 개를 순서대로 하니 3초예요.',
      ],
      explanation: '비동기 = 자동 병렬이 아니에요. 서로 독립적인 작업을 동시에 기다리려면 asyncio.gather(fetch("A", 1), fetch("B", 1), fetch("C", 1))처럼 묶어야 약 1초가 돼요.\n주의: 같은 AsyncSession 하나로 gather를 써서 쿼리를 동시에 보내면 안 돼요. 세션은 동시 사용을 지원하지 않아요.',
    },
    {
      id: 'as-01-05', type: 'short', source: 'async / await와 이벤트 루프',
      question: '여러 코루틴을 동시에 실행하고 모두 끝날 때까지 기다리는 asyncio 함수 이름은? asyncio.______(a(), b())',
      answer: ['gather'],
      explanation: 'asyncio.gather예요. 결과는 넘긴 순서대로 리스트로 돌아와요. 하나라도 예외가 나면 기본적으로 그 예외가 전달돼요(return_exceptions=True면 예외도 결과로 받음).\n파이썬 3.11+에서는 asyncio.TaskGroup도 많이 써요.',
    },
    {
      id: 'as-01-06', type: 'mcq', source: '이벤트 루프를 막는 코드',
      question: 'async def 엔드포인트 안에서 time.sleep(5)를 호출하면?',
      choices: ['이벤트 루프가 5초간 멈춰서 같은 워커의 다른 요청들도 모두 기다린다', '그 요청만 5초 늦어진다', 'FastAPI가 자동으로 스레드로 넘긴다', '에러가 난다'],
      answer: 0,
      choiceExplanations: [
        '정답. time.sleep은 양보하지 않는 블로킹 호출이에요. await asyncio.sleep(5)를 써야 해요.',
        'async def는 루프에서 직접 실행돼서 루프 전체가 막혀요.',
        '자동으로 스레드로 넘기는 건 def 엔드포인트일 때예요.',
        '에러 없이 조용히 느려져요. 그래서 찾기 어려워요.',
      ],
      explanation: '체크리스트: async def 안에서 requests, time.sleep, 동기 DB 드라이버, open()으로 큰 파일 읽기 같은 블로킹 호출이 있는지.\n있다면 비동기 대체 라이브러리로 바꾸거나, 함수를 def로 바꾸거나, asyncio.to_thread로 감싸요.',
    },
    {
      id: 'as-01-07', type: 'mcq', source: '이벤트 루프를 막는 코드',
      question: 'async def 엔드포인트에서 외부 API를 호출하기에 알맞은 라이브러리는?',
      choices: ['requests', 'urllib.request', 'pymysql', 'httpx.AsyncClient'],
      answer: 3,
      choiceExplanations: [
        'requests는 동기(블로킹) 라이브러리예요.',
        '동기 표준 라이브러리예요.',
        'DB 드라이버이고 동기예요.',
        '정답. await client.get(...)으로 기다리는 동안 루프를 양보해요.',
      ],
      explanation: '동기 ↔ 비동기 대응: requests ↔ httpx.AsyncClient(또는 aiohttp), pymysql ↔ aiomysql/asyncmy, psycopg2 ↔ asyncpg/psycopg(async), sqlite3 ↔ aiosqlite, time.sleep ↔ asyncio.sleep.\nAsyncClient는 요청마다 만들기보다 lifespan에서 하나 만들어 재사용하면 연결을 재활용해 더 빨라요.',
    },
    {
      id: 'as-01-08', type: 'short', source: '이벤트 루프를 막는 코드',
      question: '비동기 함수 안에서 어쩔 수 없이 동기 블로킹 함수를 호출할 때, 별도 스레드에서 실행해 루프를 막지 않게 하는 asyncio 함수는? await asyncio.________(func, arg)',
      answer: ['to_thread'],
      explanation: 'asyncio.to_thread(파이썬 3.9+)예요. FastAPI(Starlette)의 run_in_threadpool도 같은 역할이에요.\n예: 비동기 엔드포인트에서 bcrypt 해시 계산이나 동기 SDK 호출을 해야 할 때 써요.',
    },
    {
      id: 'as-01-09', type: 'mcq', source: 'FastAPI에서 def와 async def',
      question: '동기 SQLAlchemy 세션(Session)을 쓰는 엔드포인트는 어떻게 선언하는 것이 맞을까?',
      choices: ['async def (더 빠르니까)', 'def (FastAPI가 스레드 풀에서 실행해 루프를 막지 않음)', '둘 다 상관없다', 'async def 안에서 await db.execute()'],
      answer: 1,
      choiceExplanations: [
        'async def 안에서 동기 DB 호출을 하면 루프가 막혀요. 오히려 느려져요.',
        '정답. 동기 라이브러리를 쓸 때는 def가 안전해요.',
        '차이가 커요. 잘못 고르면 동시 처리량이 크게 떨어져요.',
        '동기 Session의 execute는 await할 수 없어요.',
      ],
      explanation: 'FastAPI 규칙 요약:\n• 안에서 await를 쓴다 → async def\n• 동기 라이브러리를 쓴다 → def\n• 아무 I/O 없이 간단한 계산만 → 둘 다 OK (async def가 스레드 전환 비용이 없어 약간 유리)',
    },
    {
      id: 'as-01-10', type: 'ox', source: 'FastAPI에서 def와 async def',
      question: 'FastAPI는 def로 선언한 엔드포인트를 이벤트 루프가 아닌 스레드 풀에서 실행한다.',
      answer: true,
      explanation: '맞아요. 그래서 def 엔드포인트 안의 블로킹 호출은 루프를 막지 않아요. 대신 스레드 풀 크기(기본 약 40)만큼만 동시에 처리돼요.\n동시 요청이 아주 많은 서비스라면 비동기 스택(async def + 비동기 드라이버)으로 가는 이유가 이거예요.',
    },
    {
      id: 'as-01-11', type: 'mcq', source: 'async / await와 이벤트 루프',
      question: '일반 def 함수 안에서 await를 쓰면?',
      choices: ['SyntaxError: await는 async 함수 안에서만 쓸 수 있다', '정상 동작', '자동으로 async가 된다', '경고만 나온다'],
      answer: 0,
      choiceExplanations: [
        '정답. 문법 에러라 파일을 불러오는 순간 실패해요.',
        'await는 async def 안에서만 허용돼요.',
        '자동 변환은 없어요.',
        '경고가 아니라 에러예요.',
      ],
      explanation: '비동기는 "전염성"이 있어요. await를 쓰려면 그 함수가 async여야 하고, 그 함수를 부르는 쪽도 await해야 하니 async여야 해요. 그래서 비동기 DB를 쓰면 라우트, 의존성, 서비스 함수까지 모두 async가 돼요.',
    },
    {
      id: 'as-01-12', type: 'mcq', source: '동기와 비동기',
      question: '"비동기 서버가 동기 서버보다 빠르다"는 말을 가장 정확하게 고친 것은?',
      choices: ['항상 맞는 말이다', '요청 하나의 처리 속도가 빨라지는 게 아니라, I/O 대기가 많을 때 같은 자원으로 동시에 처리하는 요청 수(처리량)가 늘어난다', '비동기는 항상 느리다', '비동기는 DB를 빠르게 만든다'],
      answer: 1,
      choiceExplanations: [
        '조건에 따라 달라요.',
        '정답. 지연 시간(latency)보다는 동시 처리량(throughput)의 이점이에요.',
        'I/O가 많은 웹 서버에서는 큰 이점이 있어요.',
        'DB 쿼리 자체의 속도는 그대로예요. 느린 쿼리는 인덱스·쿼리 개선으로 고쳐요.',
      ],
      explanation: '비동기의 이득 = 기다리는 동안 다른 요청 처리. DB 쿼리가 1초 걸리면 비동기여도 그 요청은 1초 걸려요. 다만 그 1초 동안 같은 워커가 다른 요청 수백 개를 처리할 수 있어요.',
    },
  ],
}

export default topic
