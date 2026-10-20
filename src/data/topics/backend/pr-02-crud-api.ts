import type { Topic } from '../../types'

const topic: Topic = {
  id: 'pr-02-crud-api',
  track: 'backend',
  group: '종합 실전',
  title: '실전 ②: CRUD API 완성과 배포',
  order: 202,
  sections: [
    {
      title: '프로젝트 구조',
      points: [
        '기능(도메인)별 폴더: app/decks/(router.py, schemas.py, service.py), app/users/, app/core/(config.py: 설정, db.py: engine·세션·의존성, security.py: 인증). app/main.py는 앱 조립만 한다.',
        '계층별 책임: router = HTTP(파라미터·상태 코드·응답 모델), schemas = 입출력 계약(Pydantic), service = 업무 규칙과 트랜잭션, models = DB 구조(SQLAlchemy).',
        '의존 방향은 한쪽으로: router → service → models. 라우터끼리 서로 import하지 않는다.',
        '작게 시작해서 필요할 때 나눈다. 처음부터 계층을 과하게 나누지 않는다(Simple is Best).',
      ],
      code: `app/
  main.py            # FastAPI(), lifespan, include_router, 미들웨어
  core/config.py     # Settings(BaseSettings)
  core/db.py         # engine, SessionLocal, get_db, SessionDep
  core/security.py   # 비밀번호 해시, get_current_user, CurrentUser
  decks/models.py  decks/schemas.py  decks/service.py  decks/router.py
tests/`,
    },
    {
      title: '스키마와 라우터',
      points: [
        '스키마 세트: DeckCreate(title), DeckUpdate(title | None = None), DeckRead(id, title, created_at, from_attributes=True), Page[DeckRead](items, total, page, size).',
        '목록: GET /decks?page&size&q → 내 덱만(owner_id = 현재 사용자), 같은 조건으로 total과 items, 정렬 고정, size 상한.',
        '생성: POST /decks → 201, owner_id는 서버가 넣는다. 조회: GET /decks/{id} → 없거나 남의 것이면 404. 수정: PATCH → exclude_unset. 삭제: DELETE → 204.',
        '모든 쓰기 API는 "로그인 확인 + 소유자 확인"을 거친다. 공통 헬퍼(get_owned_deck)로 만들면 빠뜨리지 않는다.',
      ],
      code: `def get_owned_deck(db: Session, deck_id: int, user: User) -> Deck:
    deck = db.get(Deck, deck_id)
    if deck is None or deck.owner_id != user.id:
        raise HTTPException(404, "덱이 없습니다")     # 남의 덱 존재 여부도 숨김
    return deck

@router.get("/", response_model=Page[DeckRead])
def list_decks(db: SessionDep, user: CurrentUser,
               page: int = Query(1, ge=1), size: int = Query(20, ge=1, le=100),
               q: str | None = Query(None, max_length=50)):
    conds = [Deck.owner_id == user.id]
    if q:
        conds.append(Deck.title.contains(q, autoescape=True))
    total = db.scalar(select(func.count()).select_from(Deck).where(*conds))
    items = db.scalars(select(Deck).where(*conds).order_by(Deck.id.desc())
                       .limit(size).offset((page - 1) * size)).all()
    return {"items": items, "total": total, "page": page, "size": size}

@router.patch("/{deck_id}", response_model=DeckRead)
def update_deck(deck_id: int, data: DeckUpdate, db: SessionDep, user: CurrentUser):
    deck = get_owned_deck(db, deck_id, user)
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(deck, k, v)
    db.commit()
    db.refresh(deck)
    return deck`,
    },
    {
      title: '트랜잭션이 필요한 업무 로직',
      points: [
        '"문제 풀이 제출": ① attempts에 기록 INSERT ② user_question_states의 box·next_due 갱신(없으면 생성) ③ 둘 다 성공해야 의미가 있다 → 한 트랜잭션.',
        '서비스 함수가 이 규칙을 책임지고, 라우터는 결과만 응답한다. 중간에 commit을 여러 번 하지 않는다.',
        '동시에 같은 문제 상태를 갱신할 수 있으면 원자적 갱신(upsert, SET box = box + 1)이나 행 잠금(with_for_update)을 쓴다.',
        '실패 시 rollback하고 의미 있는 4xx로 바꾼다. 예상하지 못한 예외는 500으로 두되 로그(logger.exception)를 남긴다.',
      ],
      code: `def submit_attempt(db: Session, user: User, question_id: int, is_correct: bool) -> UserQuestionState:
    with db.begin():                                   # 함께 성공 / 함께 실패
        db.add(Attempt(user_id=user.id, question_id=question_id, is_correct=is_correct))
        state = db.scalar(
            select(UserQuestionState)
            .where(UserQuestionState.user_id == user.id, UserQuestionState.question_id == question_id)
            .with_for_update()
        )
        if state is None:
            state = UserQuestionState(user_id=user.id, question_id=question_id, box=0, next_due=date.today())
            db.add(state)
        state.box = min(state.box + 1, 5) if is_correct else 0
        state.next_due = date.today() + timedelta(days=INTERVALS[state.box])
    return state`,
    },
    {
      title: '테스트와 배포',
      notionIds: ['3efdf951bf80818bb289e4782b910ad0'],
      points: [
        '테스트: TestClient(app)로 실제 HTTP 흐름을 호출하고, dependency_overrides로 테스트 DB 세션·가짜 로그인 사용자를 주입한다. 성공뿐 아니라 401·403/404·409·422 같은 실패 경로도 테스트한다.',
        '배포 준비: 설정은 환경 변수(DATABASE_URL, SECRET_KEY), 스키마는 Alembic 마이그레이션(alembic upgrade head를 배포 단계에 포함), 운영에서는 --reload 끄기, docs 공개 여부 결정, CORS 허용 출처를 실제 프론트 주소로.',
        '실행: uvicorn app.main:app --host 0.0.0.0 --port $PORT (필요하면 --workers 또는 gunicorn + uvicorn worker). 헬스 체크 엔드포인트(/health)로 플랫폼이 상태를 확인하게 한다.',
        '배포 방식의 흐름: 노션에서 다룬 ngrok(내 PC 서버를 임시 공개 주소로, 테스트·데모용) → AWS EC2에 직접 설치(Apache + mod_wsgi 같은 WSGI 연결, 서버 관리 직접) → 요즘은 Render·Railway·Fly.io 같은 PaaS나 컨테이너(Docker)로 git push 배포. FastAPI는 ASGI라 WSGI(mod_wsgi) 대신 uvicorn을 쓴다.',
        '운영 체크: 로그 수집, 에러 알림, DB 백업·PITR 보존 기간, 커넥션 풀 크기(서버 수 × 풀 ≤ DB 한도), 무료 플랜의 잠자기(sleep)·일시정지 정책 확인.',
      ],
      code: `from fastapi.testclient import TestClient

def test_cannot_read_others_deck(client: TestClient, other_users_deck_id: int):
    res = client.get(f"/decks/{other_users_deck_id}")
    assert res.status_code == 404

# 배포 시작 명령 예
# alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port $PORT`,
    },
  ],
  questions: [
    {
      id: 'pr-02-01', type: 'mcq', source: '프로젝트 구조',
      question: '"덱 제목은 사용자당 중복될 수 없다"는 업무 규칙 검사와 DB 저장 로직을 두기에 가장 알맞은 계층은?',
      choices: ['service.py(업무 규칙) + DB UNIQUE(owner_id, title) 제약', 'main.py', 'router.py에 모든 로직', 'schemas.py의 Field'],
      answer: 0,
      choiceExplanations: [
        '정답. 업무 규칙은 서비스에, 최종 보장은 DB 제약에.',
        'main.py는 앱 조립만 해요.',
        '작을 땐 가능하지만, 규칙이 늘면 HTTP 처리와 섞여 재사용·테스트가 어려워져요.',
        '스키마는 입력 하나의 형식 검증만 해요. DB를 조회해야 하는 규칙은 담을 수 없어요.',
      ],
      explanation: '책임 나누기: 형식(스키마) / 업무 규칙(서비스) / 정합성 최종 보장(DB 제약) / HTTP 변환(라우터). 각자 자기 일만 하면 테스트하기 쉬워요.',
    },
    {
      id: 'pr-02-02', type: 'mcq', source: '스키마와 라우터',
      question: '다른 사람의 덱 id로 GET /decks/{id}를 요청했다. 위 get_owned_deck은 404를 준다. 403 대신 404를 주는 이유는?',
      choices: ['403은 쓸 수 없어서', '"그 id의 덱이 존재한다"는 사실 자체를 숨겨 다른 사용자 데이터를 탐색하는 데 단서를 주지 않으려고', '404가 더 빨라서', '프론트가 403을 처리 못 해서'],
      answer: 1,
      choiceExplanations: [
        '403도 쓸 수 있어요. 의미상으로는 403이 정확해요.',
        '정답. 자원의 존재 여부도 정보예요. 그래서 많은 서비스가 남의 자원에는 404를 줘요.',
        '속도 차이는 없어요.',
        '프론트 사정이 이유가 아니에요.',
      ],
      explanation: '팀 규칙으로 정하면 돼요. 관리자 화면처럼 "있는데 권한이 없음"을 알려 줘야 하면 403, 일반 사용자 API에서 남의 데이터라면 404가 흔해요. 중요한 건 소유자 검사를 빠뜨리지 않는 것(IDOR 방지)이에요.',
    },
    {
      id: 'pr-02-03', type: 'mcq', source: '스키마와 라우터',
      question: '목록 API 구현에서 빠지면 안 되는 것을 모두 담은 것은?',
      choices: ['정렬만', 'total만', '내 데이터만 조건(owner_id) + 정렬 고정 + size 상한 + total과 items의 같은 조건', '페이지 번호만'],
      answer: 2,
      choiceExplanations: [
        '정렬만으로는 남의 데이터가 섞이거나 과도한 요청을 막지 못해요.',
        '목록과 조건이 같아야 의미가 있어요.',
        '정답. 보안(내 것만), 일관성(정렬), 보호(상한), 정확성(같은 조건)이 모두 필요해요.',
        '정렬 없이 페이지를 나누면 중복·누락이 생겨요.',
      ],
      explanation: '목록 API 체크리스트 = 권한 조건 + 검색 조건 공유(conds) + order_by(고유 키 포함) + limit 상한 + 관계 로딩(N+1 방지) + 응답 모델(Page).',
    },
    {
      id: 'pr-02-04', type: 'short', source: '스키마와 라우터',
      question: 'PATCH /decks/{id}에서 요청에 실제로 들어온 필드만 반영하려면 data.model_dump(______=True)를 쓴다. 빈칸은?',
      answer: ['exclude_unset'],
      explanation: 'exclude_unset=True예요. 이게 없으면 보내지 않은 필드가 None으로 덮어써져요. HTTP 메서드 토픽과 SQLAlchemy 수정 토픽에서 본 패턴이 실전에서 이렇게 합쳐져요.',
    },
    {
      id: 'pr-02-05', type: 'mcq', source: '트랜잭션이 필요한 업무 로직',
      question: '풀이 제출에서 attempts INSERT 후 commit, 그다음 상태 갱신 후 다시 commit 하도록 짰다. 무엇이 문제인가?',
      choices: ['두 번째 단계가 실패하면 기록만 남고 상태는 안 바뀌어, 원본과 파생 데이터가 어긋난다', '문제없다', 'commit은 한 요청에 한 번만 문법적으로 허용된다', '속도가 너무 빨라진다'],
      answer: 0,
      choiceExplanations: [
        '정답. 함께 의미가 있는 변경은 하나의 트랜잭션으로 묶어요.',
        '부분 성공 상태가 생길 수 있어요.',
        '문법상 여러 번 가능해요. 그래서 실수하기 쉬워요.',
        '관계없어요.',
      ],
      explanation: '트랜잭션 경계 = 업무적으로 "함께 성공해야 하는 단위". with db.begin(): 블록이 그 경계를 코드로 보여 줘요(원자성, ACID의 A).',
    },
    {
      id: 'pr-02-06', type: 'mcq', source: '트랜잭션이 필요한 업무 로직',
      question: '같은 사용자가 두 기기에서 같은 문제를 거의 동시에 제출했다. 상태(box) 갱신을 안전하게 하는 방법이 아닌 것은?',
      choices: ['상태 행을 SELECT ... FOR UPDATE(with_for_update)로 잠그고 읽어서 계산', '앱 메모리의 전역 변수에 상태를 저장해 두고 그 값으로 덮어쓰기', 'DB가 계산하는 원자적 UPDATE 또는 upsert', '(user_id, question_id) UNIQUE로 상태 행 중복 생성 방지'],
      answer: 1,
      choiceExplanations: [
        '안전한 방법이에요. 두 번째 요청은 첫 번째가 끝날 때까지 기다려요.',
        '정답(안전하지 않음). 서버가 여러 대·여러 워커면 메모리가 공유되지 않고, 재시작하면 사라져요.',
        '안전한 방법이에요.',
        '안전 장치예요. 동시에 "없음"을 보고 두 행을 만드는 걸 막아요.',
      ],
      explanation: '동시성 도구 상자: 원자적 UPDATE, 행 잠금, UNIQUE 제약 + 재시도, 낙관적 잠금(version). 상태는 항상 DB(공유 저장소)에 두고 DB의 도구로 보호해요.',
    },
    {
      id: 'pr-02-07', type: 'ox', source: '트랜잭션이 필요한 업무 로직',
      question: '예상하지 못한 예외는 4xx로 억지로 바꾸기보다 500으로 두고 logger.exception으로 원인을 남기는 것이 좋다.',
      answer: true,
      explanation: '맞아요. 모든 예외를 400으로 바꾸면 진짜 버그가 "사용자 잘못"으로 숨어 버려요. 예상 가능한 실패(없음, 중복, 권한)는 알맞은 4xx로, 예상 못 한 실패는 500 + 로그 + 알림으로 처리해요.',
    },
    {
      id: 'pr-02-08', type: 'mcq', source: '테스트와 배포',
      question: 'TestClient 테스트에서 실제 로그인 없이 특정 사용자로 API를 호출하는 방법은?',
      choices: ['운영 DB에 테스트 계정을 만든다', '인증 코드를 주석 처리한다', '테스트를 하지 않는다', 'app.dependency_overrides[get_current_user] = lambda: test_user'],
      answer: 3,
      choiceExplanations: [
        '운영 데이터를 건드리면 안 돼요.',
        '실수로 그대로 배포될 위험이 있어요.',
        '실패 경로(권한, 검증)는 테스트가 없으면 회귀하기 쉬워요.',
        '정답. 의존성 주입 덕분에 인증을 깔끔하게 교체할 수 있어요.',
      ],
      explanation: '같은 방식으로 get_db를 테스트용 DB(SQLite 메모리 또는 테스트 컨테이너) 세션으로 바꿔요. 테스트가 끝나면 app.dependency_overrides.clear().',
    },
    {
      id: 'pr-02-09', type: 'mcq', source: '테스트와 배포',
      question: '노션에서 배운 ngrok의 올바른 용도는?',
      choices: ['내 PC에서 실행 중인 서버를 임시 공개 주소로 열어 웹훅 테스트나 데모를 하는 것', '운영 서비스를 장기간 호스팅', 'DB 백업', '코드 버전 관리'],
      answer: 0,
      choiceExplanations: [
        '정답. 외부 서비스(결제사·메신저)의 웹훅을 로컬에서 받아 보거나 잠깐 시연할 때 좋아요.',
        'PC가 꺼지면 서비스도 끝나고, 보안·안정성 면에서 운영용이 아니에요.',
        '관계없어요.',
        '그건 git이에요.',
      ],
      explanation: '배포 수단의 스펙트럼: ngrok(임시 터널) → VM 직접 구성(EC2: 서버·웹서버·프로세스 관리 모두 직접) → PaaS(Render 등: git push로 빌드·실행·HTTPS 자동) → 컨테이너 오케스트레이션(대규모). 서비스 규모와 팀 역량에 맞춰 골라요.',
    },
    {
      id: 'pr-02-10', type: 'mcq', source: '테스트와 배포',
      question: 'Flask를 Apache + mod_wsgi로 배포하던 방식을 FastAPI에 그대로 적용하기 어려운 이유는?',
      choices: ['FastAPI는 파이썬이 아니라서', 'Apache는 HTTPS를 지원하지 않아서', 'FastAPI는 ASGI 앱이라 WSGI 서버(mod_wsgi)가 아니라 uvicorn 같은 ASGI 서버로 실행해야 해서', 'FastAPI는 리눅스에서 동작하지 않아서'],
      answer: 2,
      choiceExplanations: [
        '파이썬이에요.',
        '지원해요.',
        '정답. 큰 그림 토픽의 WSGI/ASGI 차이가 배포에서 드러나요. Nginx·Apache는 앞단 리버스 프록시로 두고, 뒤에서 uvicorn이 앱을 실행하는 구성이 흔해요.',
        '잘 동작해요.',
      ],
      explanation: '일반적인 구성: 클라이언트 → (HTTPS 종료) Nginx/로드밸런서 → uvicorn(또는 gunicorn + UvicornWorker) → FastAPI. PaaS에서는 앞단을 플랫폼이 대신해 줘요.',
    },
    {
      id: 'pr-02-11', type: 'short', source: '테스트와 배포',
      question: '배포할 때 운영 DB 스키마를 최신 마이그레이션까지 올리는 Alembic 명령은? alembic _______ head',
      answer: ['upgrade'],
      explanation: 'alembic upgrade head예요. 배포 파이프라인(빌드 후, 앱 시작 전)에 넣어 코드와 스키마가 항상 같은 버전이 되게 해요. 되돌릴 때는 alembic downgrade -1(단, 데이터 손실 가능성을 검토).',
    },
    {
      id: 'pr-02-12', type: 'ox', source: '테스트와 배포',
      question: '운영 배포에서도 개발 때처럼 uvicorn --reload 옵션을 켜 두는 것이 좋다.',
      answer: false,
      explanation: '--reload는 파일 감시로 자원을 쓰고 예기치 않은 재시작을 일으켜요. 운영에서는 끄고, 동시 처리량이 필요하면 --workers(또는 여러 인스턴스)로 늘려요. 이때 "인스턴스 수 × 커넥션 풀 크기"가 DB 연결 한도를 넘지 않는지 확인하세요.',
    },
  ],
}

export default topic
