import type { Topic } from '../../types'

const topic: Topic = {
  id: 'pj-02-backend',
  track: 'project',
  group: '백엔드',
  title: '02. 백엔드 (FastAPI · 헤이유미 중계)',
  order: 2,
  notionId: '3f2df951bf808125a735efee11a5cfa9',
  addedAt: '2026-10-15',
  sections: [
    {
      title: '서버가 켜지는 순간',
      points: [
        'fastapi run app/main.py → main.py import → 맨 아래 app = create_app() 실행',
        'get_settings(): .env + 환경변수로 Settings 생성, @lru_cache 로 한 번만',
        'CORSMiddleware 추가 → include_router × 4 (health, regions, score, places) → register_error_handlers',
        'import 연쇄: score/router → service → situations.py(SITUATIONS 6개 생성)',
        '유미 클라이언트는 아직 없음 — 첫 요청 때 만들어짐',
        'accio 는 core/db.py 로 DB 엔진(연결 풀) 생성, lifespan 으로 종료 시 engine.dispose(). 실제 접속은 첫 쿼리 때',
        'accio 는 database_url 기본값이 없어 DATABASE_URL 없으면 import 단계 ValidationError, maestro 는 기본값이 있어 mock 으로 켜짐',
      ],
    },
    {
      title: '요청 하나의 흐름',
      points: [
        'JSON 요청이라 OPTIONS 프리플라이트 → CORSMiddleware 가 Origin 확인',
        'Pydantic 검증: body → ScoreRequest (meals 1~5, people 1~20, dong 빈칸 X). 틀리면 함수 실행 전 422',
        'Depends(get_yumi_client) → YUMI_MODE 가 mock 이면 MockYumiClient(싱글톤)',
        'build_score: asyncio.gather 로 끼니들을 동시에 처리',
        '끼니마다: resolve_region → meal_kind(14:30~17:00 이면 cafe) → search_nearby(반경 1km, 추천순, 100곳) 1번 → 메인 = 추천 1순위 → 상황 6개 fits() + _rank() 후 3곳씩',
        'CamelModel 이라 응답 필드가 camelCase (main_place_id → mainPlaceId)',
        '예외: RegionNotFound → 422, YumiError(429) → 429 yumi_quota_exceeded, PlaceNotFound → 404',
      ],
    },
    {
      title: '하루 70요청 설계',
      points: [
        '상황마다 검색하면 끼니 3 × 상황 6 = 18번',
        '끼니마다 넓게 1번(100곳) 받고 파이썬으로 상황별로 나눠 3번(+처음 보는 동네 수)으로 줄임',
        '테스트 test_score_asks_yumi_once_per_meal 가 이 규칙을 지킴',
      ],
    },
    {
      title: '모든 API',
      points: [
        'accio: GET /health, GET /health/db (SELECT 1, 실패하면 503)',
        'maestro: GET /health (status, environment, yumi_mode)',
        'GET /api/regions?dong= (동네 → 후보 지역), GET /api/situations (상황 타일 6개), POST /api/score (끼니별 메인 + 상황별 대안 3곳)',
        'GET /api/places/{id} (식당 상세)',
        'POST /api/places/{id}/live-status + GET /api/live-status/{queryId}?wait=10 (웨이팅 문의, 롱폴링)',
        'POST /api/places/{id}/reservations + GET /api/reservations/{id}?wait=10 (예약, 롱폴링). 문의·예약은 파트너만, 실제로는 흉내',
      ],
    },
    {
      title: 'AI 기능의 실체',
      code: `Situation("budget", "💸", "예산 초과했어", "1만원 초반으로 먹을 수 있는 곳으로 골랐어요",
          accept=_is_cheap)  # 평균 가격 12,000원 이하`,
      points: [
        '레포 백엔드에는 LLM(GPT·Claude 등) 호출 코드가 없음',
        'Maestro 대안 고르기는 규칙 기반: 음식 종류·반경·분위기·예약 가능·평균 가격·룸 유무 + confidence·freshness 로 정렬',
        '식당 한 줄 요약(aiSummary)은 헤이유미가 주는 값을 그대로 표시',
        '"직접 말하기"는 프론트 키워드 매칭 ("더부룩" → stuffy), 서버 호출 없음',
        'Accio AI 검색은 검색어와 상관없이 #/accio/ai 의 고정 답변(AI_CHAT)',
        '면접 답: "검증된 데이터를 규칙으로 골라 빠르고 예측 가능하게, 요청 한도를 고려해 미리 계산"',
      ],
    },
    {
      title: '로컬에서 돌려보기',
      code: `cd Portfolio/backend/maestro
uv sync && cp .env.example .env
uv run fastapi dev app/main.py --port 8001   # /docs
uv run pytest`,
      points: [
        'maestro 는 키 없이 mock 으로 바로 실행, http://localhost:8001/docs 에서 자동 문서',
        'accio 는 docker compose up -d 로 로컬 Postgres(pgvector/pgvector:pg17) 띄우고 DATABASE_URL=postgresql+asyncpg://... 설정',
      ],
    },
  ],
  questions: [
    { id: 'pj-02-01', type: 'mcq', source: '서버가 켜지는 순간', question: 'get_settings() 에 @lru_cache 를 붙인 이유는?', choices: ['환경변수를 한 번만 읽어 같은 Settings 객체를 재사용하려고', '설정을 DB 에 저장하려고', '비동기로 읽으려고', '설정을 매 요청마다 새로 읽으려고'], answer: 0, explanation: '캐시 덕분에 처음 한 번만 .env 를 읽고 이후엔 같은 객체를 돌려줘요.' },
    { id: 'pj-02-02', type: 'mcq', source: '서버가 켜지는 순간', question: 'DATABASE_URL 환경변수 없이 서버를 켜면?', choices: ['accio·maestro 둘 다 정상', 'accio 는 import 단계 ValidationError 로 안 켜지고, maestro 는 mock 으로 켜진다', '둘 다 안 켜진다', 'accio 는 켜지고 첫 쿼리에서만 에러'], answer: 1, explanation: 'accio 의 database_url 은 기본값이 없고, maestro 설정은 모두 기본값이 있어요.' },
    { id: 'pj-02-03', type: 'mcq', source: '서버가 켜지는 순간', question: 'accio 에서 lifespan 으로 하는 일은?', choices: ['로그 파일 정리', '서버 시작 시 DB 테이블 생성', '서버 종료 시 engine.dispose() 로 DB 연결 정리', '매 요청마다 DB 연결'], answer: 2, explanation: '엔진은 import 때 만들어지고 실제 접속은 첫 쿼리 때 일어나요.' },
    { id: 'pj-02-04', type: 'mcq', source: '서버가 켜지는 순간', question: '헤이유미 클라이언트 객체가 만들어지는 시점은?', choices: ['빌드 때', 'cron 실행 때', '서버 import 때', '첫 요청 때(Depends 해결 시)'], answer: 3, explanation: '서버가 켜진 직후엔 아직 없고 get_yumi_client 가 처음 불릴 때 생겨요.' },
    { id: 'pj-02-05', type: 'mcq', source: '요청 하나의 흐름', question: 'POST /api/score 에 people: 30 을 보내면?', choices: ['함수가 실행되기 전에 Pydantic 검증에서 422', '500 서버 에러', '429', '200 + 빈 결과'], answer: 0, explanation: 'people 은 1~20 으로 제한돼 있어 검증 단계에서 자동으로 422 를 줘요.' },
    { id: 'pj-02-06', type: 'mcq', source: '요청 하나의 흐름', question: '브라우저가 POST /api/score 전에 OPTIONS 요청을 먼저 보내는 이유는?', choices: ['캐시 확인', 'Content-Type: application/json 이라 CORS 프리플라이트가 필요해서', '인증 토큰 발급', '서버 깨우기'], answer: 1, explanation: 'JSON 본문은 "단순 요청"이 아니라 프리플라이트가 먼저 가요.' },
    { id: 'pj-02-07', type: 'mcq', source: '요청 하나의 흐름', question: 'build_score 가 여러 끼니를 처리하는 방식은?', choices: ['백그라운드 작업 큐', 'for 문으로 하나씩 순서대로', 'asyncio.gather 로 동시에', '스레드 풀'], answer: 2, explanation: '끼니별 유미 호출을 동시에 보내 전체 대기 시간을 줄여요.' },
    { id: 'pj-02-08', type: 'mcq', source: '요청 하나의 흐름', question: '끼니 시간이 15:30 이면 meal_kind 결과는?', choices: ['dinner', 'breakfast', 'lunch', 'cafe'], answer: 3, explanation: '14:30~17:00 사이는 cafe 로 분류해요.' },
    { id: 'pj-02-09', type: 'mcq', source: '요청 하나의 흐름', question: '응답 JSON 필드가 main_place_id 가 아니라 mainPlaceId 로 나가는 이유는?', choices: ['CamelModel(snake_case ↔ camelCase 별칭) 덕분', 'JSON 표준이라서', 'uvicorn 설정', '프론트가 변환해서'], answer: 0, explanation: '파이썬은 snake_case, JS 는 camelCase 를 쓰도록 스키마에서 맞춰요.' },
    { id: 'pj-02-10', type: 'mcq', source: '요청 하나의 흐름', question: '헤이유미 하루 한도를 넘었을 때 maestro 의 응답은?', choices: ['200 + 빈 배열', '500', '429 {"detail":{"code":"yumi_quota_exceeded", ...}}', '404'], answer: 2, explanation: 'YumiError(429) 를 명확한 오류 코드로 바꿔 돌려줘요.' },
    { id: 'pj-02-11', type: 'mcq', source: '하루 70요청 설계', question: '끼니 3개 일정에서 maestro 가 유미 검색을 부르는 횟수는? (모두 아는 동네)', choices: ['1번', '18번', '6번', '3번'], answer: 3, explanation: '끼니마다 100곳을 한 번 받아 상황 6개로 파이썬에서 나눠요.' },
    { id: 'pj-02-12', type: 'mcq', source: '하루 70요청 설계', question: '"끼니당 검색 1번" 규칙이 깨지지 않게 지키는 장치는?', choices: ['테스트 test_score_asks_yumi_once_per_meal', 'Render 설정', '프론트 캐시', '코드 주석'], answer: 0, explanation: '규칙을 테스트로 고정하면 리팩터링해도 회귀를 잡을 수 있어요.' },
    { id: 'pj-02-13', type: 'mcq', source: '모든 API', question: '실시간 웨이팅 문의 답을 받는 API는?', choices: ['GET /api/situations', 'GET /api/live-status/{queryId}?wait=10 (롱폴링)', 'POST /api/score', 'GET /health'], answer: 1, explanation: 'POST 로 문의를 만들고, GET 으로 답이 올 때까지 최대 10초씩 붙잡고 기다려요.' },
    { id: 'pj-02-14', type: 'mcq', source: '모든 API', question: 'accio 의 GET /health/db 가 DB 연결에 실패하면?', choices: ['422', '200', '503', '404'], answer: 2, explanation: 'SELECT 1 실패 시 503 → 크론 워크플로도 실패로 표시돼요.' },
    { id: 'pj-02-15', type: 'mcq', source: 'AI 기능의 실체', question: 'Maestro 의 상황별 대안 식당은 어떻게 고르나?', choices: ['랜덤', '사용자 리뷰 감정 분석', 'GPT 에게 물어본다', 'situations.py 의 규칙(종류·반경·분위기·가격 등) + 신뢰도·최신성 정렬'], answer: 3, explanation: '레포에는 LLM 호출 코드가 없고 규칙 기반이에요.' },
    { id: 'pj-02-16', type: 'mcq', source: 'AI 기능의 실체', question: '"점심 먹고 속이 더부룩해" 를 stuffy 상황으로 바꾸는 곳은?', choices: ['프론트 LiveScreen 의 키워드 매칭', '헤이유미 API', 'Supabase', '백엔드 LLM'], answer: 0, explanation: "'더부룩'이 낱말 목록에 있으면 stuffy. 서버 호출이 없어요." },
    { id: 'pj-02-17', type: 'mcq', source: 'AI 기능의 실체', question: '식당 한 줄 요약(aiSummary)의 출처는?', choices: ['maestro 가 직접 생성', '헤이유미 API 가 주는 값을 그대로 표시', '프론트 mock.ts', '사장님 입력'], answer: 1, explanation: '면접에서 "직접 LLM 을 불렀다"고 말하면 틀린 설명이 돼요.' },
    { id: 'pj-02-18', type: 'mcq', source: '로컬에서 돌려보기', question: 'maestro 를 로컬에서 켠 뒤 API 문서를 볼 수 있는 주소는?', choices: ['localhost:5432', 'localhost:5173', 'localhost:8001/docs', 'localhost:8001/swagger.json 만'], answer: 2, explanation: 'FastAPI 가 /docs 에 자동 문서를 만들어 줘요.' },
    { id: 'pj-02-19', type: 'mcq', source: '로컬에서 돌려보기', question: 'accio 백엔드를 로컬에서 돌리기 위해 먼저 필요한 것은?', choices: ['Vercel 로그인', 'Render 배포', '헤이유미 키', 'docker compose 로 띄운 Postgres(pgvector) + DATABASE_URL'], answer: 3, explanation: 'accio 는 DB 연결이 필수예요.' },
  ],
}

export default topic
