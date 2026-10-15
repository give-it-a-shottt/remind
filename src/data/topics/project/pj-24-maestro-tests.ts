import type { Topic } from '../../types'

const topic: Topic = {
  id: 'pj-24-maestro-tests',
  track: 'project',
  group: '백엔드',
  title: '02-5. backend/maestro ④ 테스트 · 프로젝트 설정',
  order: 24,
  notionId: '3f2df951bf80819c9119dad4c450a5b0',
  addedAt: '2026-10-15',
  sections: [
    {
      title: 'tests/conftest.py',
      notionIds: ['3f2df951bf80819c9119dad4c450a5b0'],
      code: `@pytest.fixture
def client():
    yumi = MockYumiClient(answer_delay=0.2)
    app.dependency_overrides[get_yumi_client] = lambda: yumi
    yield TestClient(app)
    app.dependency_overrides.clear()`,
      points: [
        '사장님 답이 0.2초 만에 오는 mock 을 끼운 테스트 클라이언트',
        'yield 뒤에서 dependency_overrides.clear() — 다른 테스트에 가짜가 남지 않게 정리',
      ],
    },
    {
      title: '테스트 파일 6개',
      points: [
        'test_health: /health 가 yumi_mode 를 알려주나',
        'test_places: 상세, 없는 매장 404, 문의가 답을 기다리나, 최근 답 재사용, 비파트너 422, 예약 확정',
        'test_score: 상황마다 3곳, 고른 메인 사용, 매장 많은 지역 선택, 모르는 동네, 없는 메인 404, 하루 한도 429, 끼니당 검색 1번',
        'test_situations ("채점표"): 상황 6개 정의, 을지로·성수에서 상황별 3곳 이상 + 모두 EXPECTED 조건 만족, 카페 끼니는 카페만',
        'test_yumi_mock: 지역 후보, 반경·거리순, 필터, 영업 중만, 모르는 필터 에러, camelCase 응답',
        'test_yumi_real: 가짜 HTTP transport 로 — 키는 헤더로, 캐시, 429 재시도, 빈 키 거부, 사장님 기능은 HTTP 0개, 타임아웃 재시도, null 목록 허용',
      ],
    },
    {
      title: '스파이와 TDD',
      code: `class Counting(MockYumiClient):
    searches = 0
    async def search_nearby(self, query):
        Counting.searches += 1
        return await super().search_nearby(query)

app.dependency_overrides[get_yumi_client] = Counting
client.post("/api/score", json=PLAN)
assert Counting.searches == len(PLAN["meals"])`,
      points: [
        '상속으로 "스파이"를 만들어 호출 횟수를 셈 — 진짜 동작은 super() 로 그대로',
        'test_situations 주석: "기준이 기획과 다르면 테스트를 고쳐도 된다. 테스트도 기획의 일부다." — 테스트를 먼저 쓰고 구현을 채운 TDD 흔적',
      ],
    },
    {
      title: '프로젝트 설정 파일',
      notionIds: ['3f2df951bf8081ff96d8f93c083a8773'],
      points: [
        'dependencies 는 fastapi[standard] + pydantic-settings 뿐 — DB 드라이버 없음. httpx 는 fastapi[standard] 에 포함',
        'dev 그룹: pytest, ruff 등',
        '.env.example: YUMI_MODE=mock (키를 받기 전과 발표 백업은 mock), YUMI_API_KEY 빈 값',
        'README: 유미 사용 원칙(하루 70요청, mock 으로 개발, 사장님께 보내지 않기) + 실제 응답에서 확인한 7가지(봉투, kind=district, atmosphere null, 국밥 level 2, waiting_expected, 검증 배지, 10초 넘는 검색)',
        '로컬 포트 8001 — 프론트 api.ts 기본 주소와 같아 둘을 함께 켜면 바로 연결',
      ],
    },
  ],
  questions: [
    { id: 'pj-24-01', type: 'mcq', source: 'tests/conftest.py', question: 'conftest 의 client 픽스처가 yield 뒤에 dependency_overrides.clear() 를 하는 이유는?', choices: ['다른 테스트에 가짜 의존성이 남지 않게 정리', 'DB 정리', '로그', '속도'], answer: 0, explanation: 'yield 이후는 테스트가 끝난 뒤 실행되는 정리 코드예요.' },
    { id: 'pj-24-02', type: 'mcq', source: 'tests/conftest.py', question: '테스트용 mock 을 answer_delay=0.2 로 둔 이유는?', choices: ['실제와 같게', '기본 3초를 기다리면 테스트가 느려지니 짧게', '랜덤', '에러 유발'], answer: 1, explanation: '롱폴링 동작은 그대로 확인하면서 빠르게.' },
    { id: 'pj-24-03', type: 'mcq', source: '테스트 파일 6개', question: 'test_yumi_real 이 진짜 헤이유미 없이 HTTP 동작을 검사하는 방법은?', choices: ['검사 안 함', '실제 키 사용', 'httpx 의 가짜 transport 로 응답을 흉내', 'mock.py 사용'], answer: 2, explanation: '헤더·캐시·429·타임아웃 처리까지 네트워크 없이 검사해요.' },
    { id: 'pj-24-04', type: 'mcq', source: '테스트 파일 6개', question: '"채점표"라고 불리는 테스트 파일은?', choices: ['test_places', 'test_yumi_mock', 'test_health', 'test_situations — 상황별 조건(EXPECTED)을 모든 결과가 만족하는지'], answer: 3, explanation: '새 상황을 추가할 때 여기부터 고쳐요.' },
    { id: 'pj-24-05', type: 'mcq', source: '테스트 파일 6개', question: '"하루 한도는 기다리지 않음"을 검사하는 파일은?', choices: ['test_yumi_real', 'test_health', 'test_places', 'test_score'], answer: 0, explanation: 'real 클라이언트의 429 처리 테스트예요. (test_score 는 429 응답 변환을 확인)' },
    { id: 'pj-24-06', type: 'mcq', source: '스파이와 TDD', question: 'Counting(MockYumiClient) 같은 "스파이"의 역할은?', choices: ['동작을 바꿈', '진짜 동작은 super() 로 유지하면서 호출 횟수를 기록', '에러 주입', '속도 측정'], answer: 1, explanation: '끼니당 검색 1번 규칙을 숫자로 확인해요.' },
    { id: 'pj-24-07', type: 'mcq', source: '스파이와 TDD', question: '"테스트도 기획의 일부다"라는 주석이 보여주는 개발 방식은?', choices: ['수동 테스트', '테스트는 나중에', 'TDD — 기준(테스트)을 먼저 쓰고 구현을 채움', '테스트 없음'], answer: 2, explanation: '기획이 바뀌면 테스트를 먼저 고쳐요.' },
    { id: 'pj-24-08', type: 'mcq', source: '프로젝트 설정 파일', question: 'maestro 의 real.py 가 쓰는 httpx 는 어디서 오나?', choices: ['파이썬 내장', 'requests 로 대체', '따로 설치', 'fastapi[standard] 에 포함'], answer: 3, explanation: 'extras [standard] 가 uvicorn·httpx·CLI 를 함께 설치해요.' },
    { id: 'pj-24-09', type: 'mcq', source: '프로젝트 설정 파일', question: 'maestro 로컬 포트가 8001 이면 좋은 점은?', choices: ['프론트 api.ts 기본 주소(localhost:8001)와 같아 함께 켜면 바로 연결', '빠름', 'Render 와 같음', '보안'], answer: 0, explanation: '프론트는 5173 에서 돌아요.' },
    { id: 'pj-24-10', type: 'mcq', source: '프로젝트 설정 파일', question: 'README 의 "유미 사용 원칙"이 아닌 것은?', choices: ['mock 으로 개발', '사장님께 보내지 않기', '모든 요청을 real 로 테스트', '하루 70요청'], answer: 2, explanation: '한도 때문에 개발·테스트는 mock 으로 해요.' },
  ],
}

export default topic
