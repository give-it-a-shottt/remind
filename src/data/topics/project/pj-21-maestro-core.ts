import type { Topic } from '../../types'

const topic: Topic = {
  id: 'pj-21-maestro-core',
  track: 'project',
  group: '백엔드',
  title: '02-2. backend/maestro ① 앱 조립 · 설정 · 오류 · 스키마',
  order: 21,
  notionId: '3f2df951bf808182ae6ac8fcceba1bfd',
  addedAt: '2026-10-15',
  sections: [
    {
      title: '폴더 개요와 계층',
      points: [
        'YUMITHON 2026 해커톤 백엔드: ① 중계 — 헤이유미 키를 프론트에 노출하지 않게 대신 호출 ② 악보 만들기 — 끼니마다 상황 6개별 대안 3곳 미리 계산',
        '의존 방향은 위 → 아래만: router(HTTP 입출구·검증) → service/situations(비즈니스 규칙) → YumiClient 인터페이스 → Mock / Real',
        '인터페이스(Protocol) 뒤에 mock 과 real 을 두고 설정값 하나로 바꿈 → 키 없이 개발·테스트, 발표 중 API 가 죽어도 mock 으로 버팀',
        '실시간 문의·예약은 real 모드에서도 HTTP 를 보내지 않고 흉내 (simulated: true) — test_owner_calls_never_reach_yumi 가 지킴',
      ],
    },
    {
      title: 'app/main.py',
      notionIds: ['3f2df951bf8081d7ad3de82039b5d0fe'],
      points: [
        'create_app(): CORS → 라우터 4개(health, regions, score, places) → register_error_handlers 순서',
        'DB 가 없으니 lifespan 도 없음',
        '유미 HTTP 클라이언트(httpx)는 real 모드에서 첫 요청 때 deps.py 가 만들어 재사용',
      ],
    },
    {
      title: 'app/core/config.py',
      notionIds: ['3f2df951bf8081659794db0d06676288'],
      code: `class Settings(BaseSettings):
    app_name: str = "Maestro API"
    environment: Literal["local", "production"] = "local"
    cors_origins: list[str] = ["http://localhost:5173"]
    yumi_mode: Literal["mock", "real"] = "mock"
    yumi_api_key: str = ""
    yumi_base_url: str = "https://api.heyyumi.ai"`,
      points: [
        '핵심은 yumi_mode 하나로 mock ↔ real 전환',
        '모든 값에 기본값 → .env 없이도 바로 켜짐 (키 없이 mock)',
        '라우터는 Depends(get_settings) 로 받아 테스트에서 바꿔 끼울 수 있음',
      ],
    },
    {
      title: 'app/core/errors.py',
      notionIds: ['3f2df951bf8081478a52f02e7193f3ef'],
      points: [
        '파이썬 예외 → HTTP 상태 코드 + {"detail": {"code", "message"}} 일정한 모양',
        'NotFound → 404 not_found (매장·문의·예약 없음)',
        'NotAvailable → 422 live_status_not_available / reservation_not_available (파트너 아님 → 전화 안내)',
        'YumiError(429) → 429 yumi_quota_exceeded, 그 외 YumiError → 502 yumi_error (키 문제·유미 서버 오류·시간 초과)',
        'RegionNotFound → 422 region_not_found (모르는 동네)',
        '라우터에 try/except 없이 깔끔, 변환은 이 파일 한 곳. FastAPI 기본 검증 422 는 모양이 달라 프론트는 code 가 없으면 "잠시 후 다시 시도"',
      ],
    },
    {
      title: 'app/core/schemas.py',
      notionIds: ['3f2df951bf808116b64bc45c4e49c3f1'],
      code: `class CamelModel(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,   # open_now ↔ openNow
        populate_by_name=True,
        extra="ignore",
    )`,
      points: [
        '모든 요청·응답 모델의 부모. 파이썬은 snake_case, JSON 은 camelCase',
        'populate_by_name: 두 이름 모두 입력으로 허용',
        'extra="ignore": 유미 응답의 수많은 필드 중 쓰는 것만 남김 → 프론트로 보내는 양도 줄어듦',
        'HealthResponse 는 CamelModel 이 아닌 BaseModel 이라 yumi_mode 가 snake_case 그대로',
      ],
    },
    {
      title: 'health · regions 라우터',
      notionIds: ['3f2df951bf8081a58dd2e66c17c88953', '3f2df951bf8081afaebde4aef3768ae2'],
      points: [
        'GET /health → {"status":"ok","environment":...,"yumi_mode":"mock"}',
        'Render 헬스체크, 프론트 wakeServer(), 발표 직전 mock/real 확인에 모두 쓰임',
        'GET /api/regions?dong=을지로 → 후보 지역(중심 좌표·매장 수). Query(min_length=1) 이라 빈 문자열은 422',
        '현재 프론트는 regions API 를 부르지 않음 — 동네 해석은 POST /api/score 안에서',
        'mock places.json 매장은 을지로 16곳·성수 13곳뿐 → 익선동·연남을 고르면 메인·대안이 빈 끼니. 모르는 동네(망원)는 region_not_found',
      ],
    },
  ],
  questions: [
    { id: 'pj-21-01', type: 'mcq', source: '폴더 개요와 계층', question: 'maestro 백엔드의 계층 의존 방향으로 옳은 것은?', choices: ['Mock → router', '양방향 자유', 'YumiClient → service → router', 'router → service/situations → YumiClient 인터페이스 → Mock/Real'], answer: 3, explanation: '위에서 아래로만 의존해 router 는 mock/real 을 몰라요.' },
    { id: 'pj-21-02', type: 'mcq', source: '폴더 개요와 계층', question: 'mock 과 real 을 인터페이스 뒤에 둔 가장 큰 이득은?', choices: ['키 없이 개발·테스트하고, 발표 중 외부 API 가 죽어도 설정 하나로 버틸 수 있음', '속도 향상', 'DB 불필요', '코드 양 감소'], answer: 0, explanation: '환경변수 YUMI_MODE 만 바꾸면 돼요.' },
    { id: 'pj-21-03', type: 'mcq', source: '폴더 개요와 계층', question: '"사장님께 실제 알림이 가지 않는다"를 지키는 테스트는?', choices: ['test_health', 'test_owner_calls_never_reach_yumi', 'test_score_asks_yumi_once_per_meal', 'test_regions'], answer: 1, explanation: '실시간 문의·예약은 real 에서도 HTTP 0개.' },
    { id: 'pj-21-04', type: 'mcq', source: 'app/main.py', question: 'maestro main.py 에 lifespan 이 없는 이유는?', choices: ['Render 가 대신 함', 'FastAPI 버전 때문', 'DB 가 없어서 종료 시 정리할 연결이 없음', '실수'], answer: 2, explanation: 'accio 는 DB 엔진을 dispose 하려고 lifespan 이 있어요.' },
    { id: 'pj-21-05', type: 'mcq', source: 'app/main.py', question: 'register_error_handlers(app) 의 역할은?', choices: ['CORS 설정', '라우터 등록', '로그 저장', '예외를 {detail:{code,message}} JSON 응답으로 바꾸는 핸들러 등록'], answer: 3, explanation: '오류 변환을 한 곳에 모아요.' },
    { id: 'pj-21-06', type: 'mcq', source: 'app/core/config.py', question: 'maestro 를 .env 없이 켜면?', choices: ['모든 값에 기본값이 있어 mock 모드로 바로 켜짐', 'real 모드로 켜짐', '포트 에러', 'ValidationError'], answer: 0, explanation: 'yumi_mode 기본값이 "mock", 키는 빈 문자열.' },
    { id: 'pj-21-07', type: 'mcq', source: 'app/core/config.py', question: 'YUMI_MODE=fake 로 설정하면?', choices: ['mock 으로 대체', 'Literal["mock","real"] 검증 실패로 서버가 안 켜짐', 'real 로', '무시'], answer: 1, explanation: 'Literal 타입이라 허용값 외에는 시작 단계에서 막혀요.' },
    { id: 'pj-21-08', type: 'mcq', source: 'app/core/errors.py', question: '헤이유미 하루 한도 초과 시 응답 코드와 code 는?', choices: ['404 not_found', '500 server_error', '429 yumi_quota_exceeded', '502 yumi_error'], answer: 2, explanation: '메시지에 "YUMI_MODE=mock 으로 바꿔 주세요" 안내까지 들어 있어요.' },
    { id: 'pj-21-09', type: 'mcq', source: 'app/core/errors.py', question: '유미 키가 잘못됐거나 유미 서버가 시간 초과되면?', choices: ['422', '200 빈 결과', '429', '502 yumi_error'], answer: 3, explanation: '429 가 아닌 YumiError 는 모두 502 (Bad Gateway — 뒤쪽 서버 문제).' },
    { id: 'pj-21-10', type: 'mcq', source: 'app/core/errors.py', question: '파트너가 아닌 매장에 실시간 문의를 보내면?', choices: ['404 not_found', '422 live_status_not_available → 프론트는 전화 안내', '200 흉내 답변', '500'], answer: 1, explanation: 'NotAvailable 예외가 422 로 바뀌어요.' },
    { id: 'pj-21-11', type: 'mcq', source: 'app/core/errors.py', question: 'FastAPI 기본 검증 오류(422)를 받았을 때 프론트의 처리는?', choices: ['재시도 루프', 'code 로 분기', 'detail 모양이 달라 code 가 없으면 "잠시 후 다시 시도"', '무시'], answer: 2, explanation: '기본 422 의 detail 은 배열이라 {code,message} 가 없어요.' },
    { id: 'pj-21-12', type: 'mcq', source: 'app/core/schemas.py', question: 'CamelModel 에서 extra="ignore" 의 효과는?', choices: ['에러 발생', '필드명 변환', '모든 필드 허용', '모델에 없는 필드는 버림 → 유미 응답 중 쓰는 것만 남아 프론트 전송량도 줄어듦'], answer: 3, explanation: '"forbid" 면 에러, "allow" 면 그대로 보존이에요.' },
    { id: 'pj-21-13', type: 'mcq', source: 'app/core/schemas.py', question: 'populate_by_name=True 의 의미는?', choices: ['snake_case 필드명과 camelCase 별칭 둘 다 입력으로 허용', '이름 자동 생성', '대소문자 무시', 'camelCase 만 허용'], answer: 0, explanation: '프론트는 mainPlaceId, 파이썬 내부는 main_place_id 로 만들 수 있어요.' },
    { id: 'pj-21-14', type: 'mcq', source: 'app/core/schemas.py', question: 'GET /health 응답에 yumi_mode 가 snake_case 로 나가는 이유는?', choices: ['버그', 'HealthResponse 가 CamelModel 이 아니라 BaseModel 이라서', 'FastAPI 기본', 'JSON 규칙'], answer: 1, explanation: 'alias_generator 가 없으면 필드명 그대로 직렬화돼요.' },
    { id: 'pj-21-15', type: 'mcq', source: 'health · regions 라우터', question: 'mock 모드에서 동네 "연남"으로 끼니를 만들면?', choices: ['500', 'region_not_found', 'regions.json 엔 있지만 places.json 에 매장이 없어 메인·대안이 빈 끼니', '을지로로 대체'], answer: 2, explanation: 'mock 매장은 을지로 16곳·성수 13곳뿐이에요.' },
    { id: 'pj-21-16', type: 'mcq', source: 'health · regions 라우터', question: 'GET /api/regions?dong= (빈 값) 의 결과는?', choices: ['빈 배열', '404', '전체 지역', 'Query(min_length=1) 때문에 함수 실행 전 422'], answer: 3, explanation: '쿼리 파라미터도 Pydantic 처럼 검증돼요.' },
    { id: 'pj-21-17', type: 'mcq', source: 'health · regions 라우터', question: '현재 프론트에서 동네 이름을 지역으로 바꾸는 곳은?', choices: ['POST /api/score 내부 (resolve_region)', '프론트 자체 사전', '카카오 API', 'GET /api/regions 호출'], answer: 0, explanation: 'regions API 는 지금 프론트가 부르지 않아요.' },
  ],
}

export default topic
