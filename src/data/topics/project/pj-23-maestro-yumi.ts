import type { Topic } from '../../types'

const topic: Topic = {
  id: 'pj-23-maestro-yumi',
  track: 'project',
  group: '백엔드',
  title: '02-4. backend/maestro ③ 유미 계층 (places · client · mock · real)',
  order: 23,
  notionId: '3f2df951bf80815cbf77ef571659f0a1',
  addedAt: '2026-10-15',
  sections: [
    {
      title: 'app/places/router.py',
      notionIds: ['3f2df951bf808137b55cd886e30ee9ad'],
      code: `POST /api/places/{id}/live-status   → {queryId, status: "pending"}
GET  /api/live-status/{queryId}?wait=10
     → available / limited / unavailable / soon / not_offered / no_response`,
      points: [
        '식당 상세, 실시간 문의(웨이팅·자리·메뉴), 예약 — 문의·예약은 "요청 → 답 기다리기(롱폴링)" 2단계',
        'WaitSeconds = Query(ge=0, le=25): 유미 최대 25초, 서버리스 시간 제한에 안 걸리게 기본은 10초',
        'LiveStatusAsk: kind(item / wait / seats) + topic(짧은 주제) + question',
        '예약도 같은 모양: POST /places/{id}/reservations → GET /reservations/{id}?wait=10 (pending → confirmed)',
        '롱폴링: 짧은 폴링보다 요청 수가 적고 웹소켓보다 단순 — 서버가 답이 올 때까지 응답을 붙잡고 있다가 돌려줌',
        '프론트는 "실시간 문의(웨이팅)"만 씀. 예약 API 는 백엔드에만 있고 화면 없음',
      ],
    },
    {
      title: 'app/yumi/client.py',
      notionIds: ['3f2df951bf808159a617c6dee7b6f24d'],
      points: [
        'YumiClient(Protocol): mock 과 real 이 똑같이 갖춰야 하는 메서드 7개 (resolve_region, search_nearby, get_place, ask/get_live_status, request/get_reservation)',
        'Protocol = 구조적 타이핑. 상속하지 않아도 같은 메서드가 있으면 타입 검사 통과',
        'NearbyQuery: lat, lng, radius(최대 5000), sort(distance | discovery), filters, fields(데이터 등급 core 1 / quality 2 / edge 4 토큰), page_size',
        '예외: NotFound(404) ⊃ PlaceNotFound, YumiError(status_code 보관), NotAvailable(422 파트너 아님)',
      ],
    },
    {
      title: 'app/yumi/deps.py',
      notionIds: ['3f2df951bf8081b6b4a0f97cd3f1eb20'],
      code: `@lru_cache
def _mock_client() -> MockYumiClient:
    return MockYumiClient()

def get_yumi_client(settings = Depends(get_settings)) -> YumiClient:
    if settings.yumi_mode == "mock":
        return _mock_client()
    return _real_client(settings.yumi_api_key, settings.yumi_base_url)`,
      points: [
        '@lru_cache 를 싱글톤 도구로 사용',
        '요청마다 새 mock 을 만들면 문의 기록이 사라져 POST 로 만든 queryId 를 GET 에서 못 찾음(404)',
        'real 도 하나만 — 캐시·동시 요청 제한을 요청 사이에 나눠 쓰려고',
        '테스트: app.dependency_overrides[get_yumi_client] = lambda: MockYumiClient(answer_delay=0.2)',
      ],
    },
    {
      title: 'app/yumi/filters.py',
      notionIds: ['3f2df951bf8081569aadd8a73a99c3b3'],
      points: [
        'matches(place, filters): 유미 필터를 "이 매장이 통과하나?"로 판정 + distance_m(하버사인 공식)',
        '쓰는 곳 두 군데: mock 의 필터 흉내, 악보 만들기에서 넓은 검색 결과를 상황 6개로 나눌 때',
        '쉼표 의미: subtype·atmosphere 는 OR, serves·dietary 는 AND',
        'keyword: 이름·AI요약·메뉴에 글자 포함 / parking·reservable·private_room: True 를 넣으면 확인된 곳만',
        '모르는 필터 이름이면 ValueError — 오타 조기 발견',
        'mock 의 open_at 은 끼니 시각이 아니라 "데이터상 지금 영업 중인가(open_now)"로만 판단',
      ],
    },
    {
      title: 'app/yumi/mock.py',
      notionIds: ['3f2df951bf8081c4b153dd7ce3e4ffac'],
      code: `MOCK_ANSWERS = {
    "wait":  ("limited",   "지금 대기 약 10분이에요"),
    "seats": ("available", "바로 앉으실 수 있어요"),
    "item":  ("available", "오늘 준비돼 있어요"),
}`,
      points: [
        'search_nearby: places.json 중 반경 안 + matches() 통과, discovery 는 (confidence + freshness) 높은 순, distance 는 가까운 순',
        'ask_live_status: 파트너(yumiReservable) 아니면 NotAvailable, 같은 매장·주제의 답이 있으면 재사용(reused=True)',
        'get_live_status: 만든 지 answer_delay(기본 3초)가 지났으면 답, 아니면 최대 wait 초 asyncio.sleep 후 판단',
        'time.monotonic(): 시스템 시계를 바꿔도 되돌아가지 않아 경과 시간 측정에 안전',
        'accept_any_place=True: real 모드의 사장님 기능 흉내용 — fixtures 에 없는 실제 매장 id 도 받아줌',
        '상태는 객체 안 딕셔너리 → 서버 재시작하면 사라짐 (데모용이라 충분)',
      ],
    },
    {
      title: 'app/yumi/models.py',
      notionIds: ['3f2df951bf8081d993ddeef7a22e5799'],
      code: `def _none_to(empty):
    return BeforeValidator(lambda value: empty() if value is None else value)

Strings = Annotated[list[str], _none_to(list), Field(default_factory=list)]`,
      points: [
        '헤이유미 응답 중 쓰는 필드만 옮긴 Pydantic 모델 (2026-10-07 실제 응답과 대조)',
        'Region: 을지로처럼 상권이면 코드·동이 빈 값이고 kind="district"',
        'Place 필드는 데이터 등급별: core(id, name, confidence, possibly_closed…) / contact_hours(phone, yumi_reservable…) / quality(open_now, freshness_score, price…) / edge(atmosphere, ai_summary, reputation…)',
        'LiveStatus 에 simulated 필드 — 흉낸 답인지 표시',
        'BeforeValidator 로 null → [] 를 미리 바꿈: 실제 API 가 문서와 살짝 다르게(atmosphere: null) 와도 안 깨지게',
      ],
    },
    {
      title: 'app/yumi/real.py',
      notionIds: ['3f2df951bf80815cbf77ef571659f0a1'],
      points: [
        '① 같은 검색은 10분(600초) 메모리 캐시 ② Semaphore(4) 동시 4개까지 ③ 타임아웃이면 1번 재시도, 그래도면 504',
        '④ 429: Retry-After 가 MAX_RETRY_AFTER 보다 길면(하루 한도) 기다리지 않고 바로 YumiError(429), 짧으면 기다렸다 1번 더',
        '⑤ {success, data, meta} 봉투에서 data 만 꺼냄',
        '키는 Authorization: Bearer 헤더로 — 주소(?api_key=)에 넣으면 로그에 남아 새기 쉬움',
        'TIMEOUT_SECONDS = 20 (추천순 검색이 10초를 넘기기도 해서), 불리언 필터는 "true" 문자열로',
        '사장님께 가는 4개 메서드는 self._owner = MockYumiClient(accept_any_place=True) 로 위임 → HTTP 안 보냄',
        '키가 비어 있으면 생성자에서 YumiError(401) → 첫 요청에서 502',
        '메모리 캐시라 Render 가 잠들면 날아감 → 프론트 localStorage 악보 저장과 두 겹으로 호출 절약',
      ],
    },
    {
      title: 'app/yumi/fixtures/',
      notionIds: ['3f2df951bf808117ba60dd06f609a144'],
      points: [
        'mock 데이터는 실제 유미 응답과 같은 모양(camelCase)',
        'places.json: 가상 매장 29곳 (을지로 mock-ej-* 16곳, 성수 mock-ss-* 13곳), 그중 파트너(yumiReservable: true) 6곳',
        'regions.json: 을지로동, 성수1가1동, 성수2가1동, 익선동, 연남동 (5개)',
        'test_situation_finds_three_fitting_places 가 을지로·성수 각각 상황마다 3곳 이상 나오는지 확인 — 매장을 지우면 깨짐',
      ],
    },
  ],
  questions: [
    { id: 'pj-23-01', type: 'mcq', source: 'app/places/router.py', question: '실시간 문의를 "요청 → 답 기다리기" 2단계로 나눈 이유는?', choices: ['보안', '사장님 답은 바로 오지 않아 queryId 로 나중에 롱폴링으로 받기 위해', '캐시', 'REST 규칙'], answer: 1, explanation: 'POST 는 즉시 pending 을 주고, GET ?wait= 으로 기다려요.' },
    { id: 'pj-23-02', type: 'mcq', source: 'app/places/router.py', question: 'wait 쿼리를 최대 25초로 제한한 이유는?', choices: ['임의', '유미 롱폴링 최대가 25초이고, 서버리스 시간 제한에 걸리지 않게', '브라우저 제한', 'DB 제한'], answer: 1, explanation: 'Query(ge=0, le=25), 기본 10초.' },
    { id: 'pj-23-03', type: 'mcq', source: 'app/places/router.py', question: '롱폴링이 짧은 폴링(1초마다 묻기)보다 나은 점은?', choices: ['구현이 더 복잡함', '요청 수가 훨씬 적다 — 서버가 답이 올 때까지 붙잡고 있다가 돌려줌', '실시간 양방향', '헤더 불필요'], answer: 1, explanation: '그리고 웹소켓보다 단순해요.' },
    { id: 'pj-23-04', type: 'mcq', source: 'app/places/router.py', question: '예약 API 의 현재 상태는?', choices: ['프론트에서 사용 중', '백엔드에만 있고 화면은 없음', '삭제됨', 'real 에서만 동작'], answer: 1, explanation: '프론트는 실시간 문의(웨이팅)만 써요.' },
    { id: 'pj-23-05', type: 'mcq', source: 'app/yumi/client.py', question: 'Python Protocol 의 특징은?', choices: ['반드시 상속해야 함', '구조적 타이핑 — 상속하지 않아도 같은 메서드가 있으면 그 타입으로 인정', '런타임에 메서드를 생성', '추상 클래스와 동일'], answer: 1, explanation: 'Mock 이 YumiClient 를 상속하지 않아도 돼요.' },
    { id: 'pj-23-06', type: 'mcq', source: 'app/yumi/client.py', question: 'NearbyQuery.fields 가 의미하는 것은?', choices: ['정렬 기준', '받을 데이터 등급 (core·quality·edge — 등급마다 토큰 비용이 다름)', '필터', '페이지 번호'], answer: 1, explanation: 'core 1 / quality 2 / edge 4 토큰. 사진 media 는 비싸서 안 받아요.' },
    { id: 'pj-23-07', type: 'mcq', source: 'app/yumi/deps.py', question: 'mock 클라이언트를 @lru_cache 로 하나만 만드는 이유는?', choices: ['메모리 절약', '요청마다 새로 만들면 문의 기록이 사라져 POST 로 만든 queryId 를 GET 에서 못 찾아서', '속도', '테스트 때문'], answer: 1, explanation: 'lru_cache 를 싱글톤 도구로 쓴 예예요.' },
    { id: 'pj-23-08', type: 'mcq', source: 'app/yumi/deps.py', question: '테스트에서 answer_delay=0.2 짜리 mock 을 끼우는 방법은?', choices: ['환경변수', 'app.dependency_overrides[get_yumi_client] = lambda: MockYumiClient(answer_delay=0.2)', 'monkeypatch 로 파일 교체', '불가능'], answer: 1, explanation: 'Depends 로 주입받는 덕분이에요.' },
    { id: 'pj-23-09', type: 'mcq', source: 'app/yumi/filters.py', question: 'subtype 필터 "gukbap_soup,noodle" 의 쉼표 의미는?', choices: ['AND', 'OR — 둘 중 하나면 통과', '무시', '정렬'], answer: 1, explanation: 'serves·dietary 는 AND 예요.' },
    { id: 'pj-23-10', type: 'mcq', source: 'app/yumi/filters.py', question: 'matches() 가 모르는 필터 이름을 받으면?', choices: ['무시하고 통과', 'ValueError — 오타를 일찍 발견', 'False', '경고 로그'], answer: 1, explanation: '조용히 무시하면 필터가 안 먹는 버그를 놓쳐요.' },
    { id: 'pj-23-11', type: 'mcq', source: 'app/yumi/filters.py', question: '두 좌표 사이 거리를 계산하는 데 쓴 공식은?', choices: ['피타고라스', '하버사인(haversine)', '맨해튼 거리', '코사인 유사도'], answer: 1, explanation: '구면 위 두 점의 거리 공식이에요.' },
    { id: 'pj-23-12', type: 'mcq', source: 'app/yumi/mock.py', question: 'mock 의 경과 시간 측정에 time.time() 대신 time.monotonic() 을 쓰는 이유는?', choices: ['더 정밀해서', '시스템 시계를 바꿔도 되돌아가지 않아 안전해서', '날짜를 포함해서', '비동기 전용'], answer: 1, explanation: 'NTP 동기화 등으로 시계가 뒤로 가도 영향이 없어요.' },
    { id: 'pj-23-13', type: 'mcq', source: 'app/yumi/mock.py', question: 'mock 에서 "웨이팅(wait)" 문의의 답은?', choices: ['available "바로 앉으실 수 있어요"', 'limited "지금 대기 약 10분이에요"', 'unavailable', 'no_response'], answer: 1, explanation: 'MOCK_ANSWERS["wait"].' },
    { id: 'pj-23-14', type: 'mcq', source: 'app/yumi/mock.py', question: '같은 매장·같은 주제로 문의를 다시 하면?', choices: ['새 문의 생성', '이미 있는 답을 재사용 (reused=True)', '에러', '무시'], answer: 1, explanation: '사장님을 반복해서 귀찮게 하지 않으려는 유미 동작을 흉내.' },
    { id: 'pj-23-15', type: 'mcq', source: 'app/yumi/models.py', question: '_none_to(list) BeforeValidator 의 목적은?', choices: ['리스트 정렬', '실제 API 가 빈 목록을 null 로 보내도 [] 로 바꿔 검증 실패를 막음', '중복 제거', '캐시'], answer: 1, explanation: '문서와 살짝 다른 실제 응답에 대한 방어 코드.' },
    { id: 'pj-23-16', type: 'mcq', source: 'app/yumi/models.py', question: "Region 의 kind 가 'district' 인 경우는?", choices: ['행정동', "'을지로'처럼 상권 — 코드·동이 빈 값", '시도', '외국'], answer: 1, explanation: '실제 응답에서 확인한 사실 중 하나예요.' },
    { id: 'pj-23-17', type: 'mcq', source: 'app/yumi/real.py', question: 'real 클라이언트가 같은 검색을 다시 받으면?', choices: ['매번 유미 호출', '10분 안이면 메모리 캐시에서 반환', 'DB 에서', '에러'], answer: 1, explanation: 'key = (path, 정렬된 params).' },
    { id: 'pj-23-18', type: 'mcq', source: 'app/yumi/real.py', question: '429 응답의 Retry-After 가 아주 길면(하루 한도) real 클라이언트는?', choices: ['그만큼 기다린다', '기다리지 않고 바로 YumiError(429)', '무한 재시도', 'mock 으로 전환'], answer: 1, explanation: '짧은 속도 제한일 때만 기다렸다 1번 더 시도해요.' },
    { id: 'pj-23-19', type: 'mcq', source: 'app/yumi/real.py', question: 'asyncio.Semaphore(4) 의 역할은?', choices: ['4초 대기', '유미로 가는 동시 요청을 4개로 제한', '4번 재시도', '캐시 4개'], answer: 1, explanation: 'gather 로 여러 끼니를 동시에 돌려도 외부 API 를 과하게 두드리지 않아요.' },
    { id: 'pj-23-20', type: 'mcq', source: 'app/yumi/real.py', question: 'real 모드에서 실시간 문의·예약 메서드는?', choices: ['유미로 HTTP 전송', 'MockYumiClient(accept_any_place=True) 에 위임 → HTTP 0개', '비활성화', '에러'], answer: 1, explanation: '실제 사장님 앱에 푸시가 가지 않게 하려고요.' },
    { id: 'pj-23-21', type: 'mcq', source: 'app/yumi/real.py', question: 'real 모드로 바꾸고 YUMI_API_KEY 를 비워 두면 첫 유미 요청의 응답은?', choices: ['200', '502 "유미 API 응답이 올바르지 않아요 (401)"', '429', '서버가 안 켜짐'], answer: 1, explanation: '생성자에서 YumiError(401) → 오류 핸들러가 502 로 바꿔요.' },
    { id: 'pj-23-22', type: 'mcq', source: 'app/yumi/fixtures/', question: 'places.json 의 가상 매장 구성은?', choices: ['5개 동네 각 6곳', '을지로 16곳 + 성수 13곳 = 29곳, 파트너 6곳', '100곳', '을지로만'], answer: 1, explanation: '익선동·연남은 regions 에만 있어요.' },
    { id: 'pj-23-23', type: 'mcq', source: 'app/yumi/fixtures/', question: 'fixtures 의 매장 데이터를 많이 지우면 깨지는 테스트는?', choices: ['test_health', 'test_situation_finds_three_fitting_places', 'test_cors', '없음'], answer: 1, explanation: '을지로·성수에서 상황마다 3곳 이상 나오는지 확인해요.' },
  ],
}

export default topic
