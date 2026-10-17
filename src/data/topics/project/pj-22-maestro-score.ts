import type { Topic } from '../../types'

const topic: Topic = {
  id: 'pj-22-maestro-score',
  track: 'project',
  group: '백엔드',
  title: '02-3. backend/maestro ② 악보 만들기 (score · situations)',
  order: 22,
  notionId: '3f2df951bf8081ffb216e571c237ff3f',
  addedAt: '2026-10-15',
  sections: [
    {
      title: 'app/score/router.py',
      notionIds: ['3f2df951bf808104ac7fdb4c7d09a55b'],
      code: `@router.post("/score")
async def create_score(request: ScoreRequest,
                       yumi: Annotated[YumiClient, Depends(get_yumi_client)]) -> Score:
    return await build_score(yumi, request)`,
      points: [
        'GET /situations: 상황 타일 6개, POST /score: "지휘 시작" — 끼니별 메인 + 상황별 대안 3곳',
        '라우터는 얕게, 로직은 service.py 로',
        '라우터는 YumiClient(인터페이스)만 알고 mock/real 을 모름',
        '프론트는 /api/situations 대신 score 응답 안의 situations 를 씀',
      ],
    },
    {
      title: 'app/score/schemas.py',
      notionIds: ['3f2df951bf8081489e3efde4f8a57e74'],
      code: `class MealIn(CamelModel):
    at: datetime
    dong: str = Field(min_length=1)
    people: int = Field(default=2, ge=1, le=20)
    main_place_id: str | None = None

class ScoreRequest(CamelModel):
    meals: list[MealIn] = Field(min_length=1, max_length=5)`,
      points: [
        'Field(ge=1, le=20): greater-or-equal / less-or-equal, 범위 밖이면 422',
        'main_place_id 를 비우면 추천 1순위가 메인',
        'max_length=5: 끼니 최대 5개 (유미 한도 보호), 프론트 MAX_MEALS = 5 와 같은 값',
        'MealKind = breakfast | lunch | cafe | dinner | late_night',
        'MealScore.variations: dict[SituationKey, list[Place]] — 상황마다 최대 3곳',
        '프론트 types.ts 의 Score·MealScore 는 이 파일의 손 복사본 — 자동 동기화 없음',
      ],
    },
    {
      title: 'app/score/service.py',
      notionIds: ['3f2df951bf8081ffb216e571c237ff3f'],
      code: `def _rank(places):
    def doubt(place):
        stale = (place.freshness_score or 0) < MIN_FRESHNESS
        return (place.confidence < MIN_CONFIDENCE) + stale
    return sorted(places, key=doubt)`,
      points: [
        '프로젝트의 핵심: 끼니마다 메인 1곳 + 상황 6개 × 대안 3곳을 미리 → 당일 버튼 누르는 순간 네트워크 대기 0',
        'region = 후보 중 매장 수(place_count)가 가장 많은 곳',
        'search_nearby(반경 1000m, sort=discovery, 100곳, open_at=끼니 시각, 카페면 카페류 subtype)',
        'meal_kind: 10:30 전 breakfast / 14:30 전 lunch / 17:00 전 cafe / 21:30 전 dinner / 그 후 late_night',
        '_trustworthy: possibly_closed 거나 closure_signal 이 있으면 제외 (갔는데 문 닫으면 안 되니까)',
        '_rank: 빼지 않고 뒤로 미룸. 의심 점수 = (confidence < 0.6) + (freshness < 0.5). sorted 는 안정 정렬이라 같은 점수끼리는 유미 추천 순서 유지',
        '대안에서 메인 식당은 제외 — 플랜 B 가 플랜 A 와 같으면 안 됨',
        '유미 요청 = 끼니마다 검색 1 (+ 처음 보는 동네 1, + 메인을 직접 고른 경우 1). gather 로 동시 처리 → 10초 × 3 이 아니라 약 10초',
      ],
    },
    {
      title: 'app/situations.py',
      notionIds: ['3f2df951bf8081c98238eb1f01515e01'],
      code: `@dataclass(frozen=True)
class Situation:
    key: SituationKey; emoji: str; label: str; reason: str
    filters: dict[str, str | bool] = field(default_factory=dict)
    radius: int = 1000
    accept: Callable[[Place], bool] = _accept_all`,
      points: [
        'stuffy 😮‍💨 속이 더부룩해: 국밥·면·샐러드 (카페 끼니면 차·전통차·주스)',
        'rain 🌧️ 비 와: 반경 300m 안',
        'mood 🤗 기분 별로야: 분위기 quiet 또는 cozy',
        'waiting ⏳ 웨이팅 너무 길어: 예약 가능 + waiting_expected 아님',
        'budget 💸 예산 초과했어: 평균 가격 12,000원 이하 (없으면 price level ≤ 1)',
        'tired 🥱 일행이 지쳤어: 룸(private_room) 있음',
        'fits(): 반경 안 + 유미 필터 일치 + accept 함수. distance_m 이 None 이면 가까운 걸로 취급',
        '실제 데이터 보고 만든 규칙: 1만원대 국밥집이 price.level 2 → 평균 가격 기준, atmosphere 는 유미 soft 필터라 accept=_is_calm 으로 한 번 더 거름',
        'VARIATION_FIELDS = "core,contact_hours,quality,edge" — 사진 media 등급은 비싸서 안 받음',
      ],
    },
  ],
  questions: [
    { id: 'pj-22-01', type: 'mcq', source: 'app/score/router.py', question: 'score 라우터가 mock/real 중 무엇을 쓰는지 아는가?', choices: ['설정 파일을 직접 읽는다', '안다 — if 문으로 분기', '모른다 — YumiClient 인터페이스만 Depends 로 받는다', 'real 만 쓴다'], answer: 2, explanation: '선택은 deps.py 가 YUMI_MODE 를 보고 해요.' },
    { id: 'pj-22-02', type: 'mcq', source: 'app/score/router.py', question: '프론트가 상황 타일 6개를 얻는 곳은?', choices: ['프론트 상수', 'localStorage 초기값', 'GET /api/situations', 'POST /api/score 응답의 situations'], answer: 3, explanation: '/api/situations 는 있지만 프론트는 score 응답을 써서 요청을 아껴요.' },
    { id: 'pj-22-03', type: 'mcq', source: 'app/score/schemas.py', question: 'ScoreRequest 의 meals 가 최대 5개인 이유는?', choices: ['헤이유미 하루 요청 한도 보호', 'Pydantic 제한', '임의', '화면 크기'], answer: 0, explanation: '프론트 MAX_MEALS = 5 와 같은 값이에요.' },
    { id: 'pj-22-04', type: 'mcq', source: 'app/score/schemas.py', question: 'Field(ge=1, le=20) 에서 ge, le 의 뜻은?', choices: ['greater / less', 'greater-or-equal / less-or-equal (이상 / 이하)', 'get / let', 'length / equal'], answer: 1, explanation: 'gt, lt 는 초과·미만이에요.' },
    { id: 'pj-22-05', type: 'mcq', source: 'app/score/schemas.py', question: 'main_place_id 를 보내지 않으면 메인 식당은?', choices: ['에러', '비어 있음', '검색 결과 중 믿을 만한 추천 1순위', '랜덤'], answer: 2, explanation: '보내면 get_place(그 id) 로 1번 더 호출해요.' },
    { id: 'pj-22-06', type: 'mcq', source: 'app/score/schemas.py', question: '백엔드 schemas.py 와 프론트 types.ts 의 관계로 옳은 것은?', choices: ['무관', 'OpenAPI 로 동기화', '자동 생성', '손으로 복사한 것이라 한쪽만 바꾸면 화면이 깨질 수 있음'], answer: 3, explanation: '면접 "아쉬운 점"에서 OpenAPI 타입 생성을 개선안으로 들어요.' },
    { id: 'pj-22-07', type: 'mcq', source: 'app/score/service.py', question: '끼니 시각이 20:00 이면 meal_kind 는?', choices: ['dinner', 'late_night', 'lunch', 'cafe'], answer: 0, explanation: '17:00 ~ 21:30 전은 dinner.' },
    { id: 'pj-22-08', type: 'mcq', source: 'app/score/service.py', question: '같은 이름 동네 후보가 여럿일 때 고르는 기준은?', choices: ['첫 번째', '매장 수(place_count)가 가장 많은 후보', '랜덤', '사용자에게 묻기'], answer: 1, explanation: '매장이 많은 쪽이 대안을 찾기 쉬워요.' },
    { id: 'pj-22-09', type: 'mcq', source: 'app/score/service.py', question: '_trustworthy 가 제외하는 매장은?', choices: ['비싼 곳', '리뷰 적은 곳', 'possibly_closed 이거나 closure_signal 이 있는 곳', '먼 곳'], answer: 2, explanation: '갔는데 문 닫혀 있으면 안 되니까요.' },
    { id: 'pj-22-10', type: 'mcq', source: 'app/score/service.py', question: '_rank 에서 신뢰도·최신성이 낮은 매장의 처리는?', choices: ['빼지 않고 뒤로 미룬다', '맨 앞으로', '별도 목록', '목록에서 제거'], answer: 0, explanation: '의심 점수(0~2)로 정렬해 후보가 부족할 때도 채울 수 있어요.' },
    { id: 'pj-22-11', type: 'mcq', source: 'app/score/service.py', question: '_rank 가 같은 의심 점수끼리 유미 추천 순서를 유지할 수 있는 이유는?', choices: ['key 를 두 개 써서', 'Python sorted 가 안정 정렬(stable)이라서', '역순 정렬', '우연'], answer: 1, explanation: '안정 정렬은 같은 키의 원래 순서를 보존해요.' },
    { id: 'pj-22-12', type: 'mcq', source: 'app/score/service.py', question: '상황별 대안 목록에서 메인 식당을 빼는 이유는?', choices: ['정렬 때문', '중복 데이터 절약', '플랜 B 가 플랜 A 와 같으면 의미가 없어서', '유미 규칙'], answer: 2, explanation: 'exclude 로 메인을 제외해요.' },
    { id: 'pj-22-13', type: 'mcq', source: 'app/score/service.py', question: 'real 모드에서 검색 하나가 10초씩 걸리면 끼니 3개 악보는 대략?', choices: ['3초', '60초', '30초', '약 10초 (asyncio.gather 로 동시 처리)'], answer: 3, explanation: '단, real 클라이언트는 동시 4개로 제한(Semaphore)해요.' },
    { id: 'pj-22-14', type: 'mcq', source: 'app/score/service.py', question: '메인 식당을 직접 고르고, 처음 보는 동네인 끼니 1개의 유미 요청 수는 최대?', choices: ['3 (검색 1 + 동네 해석 1 + 메인 조회 1)', '6', '18', '1'], answer: 0, explanation: '같은 검색은 real 에서 10분 캐시도 돼요.' },
    { id: 'pj-22-15', type: 'mcq', source: 'app/situations.py', question: '"비 와(rain)" 상황의 고르는 조건은?', choices: ['실내 매장', '반경 300m 안', '예약 가능', '룸 있음'], answer: 1, explanation: '비 올 땐 가까운 곳으로.' },
    { id: 'pj-22-16', type: 'mcq', source: 'app/situations.py', question: '"예산 초과(budget)"를 price.level 이 아니라 평균 가격 12,000원 이하로 판단한 이유는?', choices: ['임의', '유미가 level 을 안 줘서', '실제 데이터에서 1만원대 국밥집이 level 2 로 나와서', '계산이 쉬워서'], answer: 2, explanation: '평균 가격이 없을 때만 level ≤ 1 로 대체해요.' },
    { id: 'pj-22-17', type: 'mcq', source: 'app/situations.py', question: '"일행이 지쳤어(tired)"의 조건은?', choices: ['조용한 분위기', '24시간', '반경 300m', '룸(private_room) 있음'], answer: 3, explanation: '쉬어 갈 수 있는 개별 공간.' },
    { id: 'pj-22-18', type: 'mcq', source: 'app/situations.py', question: '"웨이팅 너무 길어(waiting)" 상황의 조건은?', choices: ['예약 가능 + waiting_expected 아님', '반경 300m', '저렴', '룸'], answer: 0, explanation: '인기 국밥집은 waiting_expected=True 라 여기서 빠져요.' },
    { id: 'pj-22-19', type: 'mcq', source: 'app/situations.py', question: '카페 끼니에서 "속이 더부룩해(stuffy)"를 고르면?', choices: ['국밥집 추천', '커피 대신 차·전통차·주스 카페', '대안 없음', '샐러드집'], answer: 1, explanation: 'fits() 가 카페면 subtype 을 CAFE_LIGHT_SUBTYPES 로 바꿔요.' },
    { id: 'pj-22-20', type: 'mcq', source: 'app/situations.py', question: 'mood 상황에서 accept=_is_calm 으로 한 번 더 거르는 이유는?', choices: ['중복 제거', '테스트용', '속도', 'atmosphere 는 유미에서 soft 필터(순위만 올림)라 결과에 다른 분위기도 섞여서'], answer: 3, explanation: '필터로 표현 못 하는 조건은 accept 함수로.' },
    { id: 'pj-22-21', type: 'mcq', source: 'app/situations.py', question: 'Situation 을 @dataclass(frozen=True) 로 만든 효과는?', choices: ['만든 뒤 필드를 바꿀 수 없는 불변 객체', 'JSON 직렬화', 'DB 저장', '빠른 생성'], answer: 0, explanation: '모듈 전역 상수 SITUATIONS 가 실수로 바뀌지 않아요.' },
  ],
}

export default topic
