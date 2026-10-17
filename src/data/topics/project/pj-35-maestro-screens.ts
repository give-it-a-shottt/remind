import type { Topic } from '../../types'

const topic: Topic = {
  id: 'pj-35-maestro-screens',
  track: 'project',
  group: '프론트',
  title: '03-6. projects/maestro ② 화면 (Home · Plan · Score · Live · Place)',
  order: 35,
  notionId: '3f2df951bf8081a981a5fc55e047d8a1',
  addedAt: '2026-10-15',
  sections: [
    {
      title: 'HomeScreen · ScoreScreen',
      notionIds: ['3f2df951bf80814d8a67cccb2b13c0f8', '3f2df951bf8081ecb4a7eee8504f44b1'],
      code: `function scoreTitle(score: Score) {
  const first = score.meals[0].dong
  const last = score.meals.at(-1)!.dong
  return first === last ? \`\${first}에서의 하루\` : \`\${first}에서 \${last}까지\`
}`,
      points: [
        'Home: "계획은 당신이, 지휘는 마에스트로가." + 오선 5줄 장식(aria-hidden) + 계획 만들기',
        '저장된 악보가 있을 때만 "이미 만든 계획 불러오기" 링크',
        'Score: "을지로에서 성수까지 · 예정 3 · 플랜B N" — N 은 끼니별 대안 개수 합(최대 끼니 × 6 × 3)',
        'currentMealIndex 로 지금 끼니에 점, 카드 → #/maestro/live?meal=i, aria-current="step"',
        '악보가 없으면 "아직 만든 악보가 없어요" + 계획 만들기 (LiveScreen 도 재사용)',
        '시간은 meal.at.slice(11, 16) → "12:00"',
      ],
    },
    {
      title: 'PlanScreen · MealSheet',
      notionIds: ['3f2df951bf8081d2ae7af8ae38b9c8ea'],
      code: `const conduct = async () => {
  setConducting(true); setError('')
  try {
    const result = await createScore(meals.map(({ date, time, dong, people }) => ({ at: \`\${date}T\${time}\`, dong, people })))
    saveScore(result)
    goTo(maestroHref('/score'))
  } catch (e) {
    setError(e instanceof ApiError ? e.message : '잠시 후 다시 시도해 주세요.')
  } finally {
    setConducting(false)
  }
}`,
      points: [
        '상태: editing(시트에 열린 끼니), conducting(요청 중), error',
        'closeSheet 를 useCallback 으로 고정 — BottomSheet useEffect 의존성',
        '버튼 disabled={conducting || meals.length === 0}, 글자 "플랜 B 준비 중…"',
        'MealSheet 초안(draft) 패턴: 시트 안 변경은 draft 에만, 저장을 눌러야 스토어로 — 닫기만 하면 취소',
        '날짜·시간: 보이는 글자 위에 투명한 <input type="date"> 를 겹치고 showPicker() (없는 브라우저는 try/catch)',
        '동네 버튼 4개 ↔ 자유 입력, 빈 동네는 "을지로", 인원 −/+ 1~20 은 aria-live="polite"',
        '백엔드는 mainPlaceId 를 받지만 프론트는 보내지 않음 — 항상 추천 1순위',
      ],
    },
    {
      title: 'LiveScreen (당일 모드)',
      notionIds: ['3f2df951bf8081a981a5fc55e047d8a1'],
      code: `const SPOKEN_HINTS: [SituationKey, string[]][] = [
  ['budget', ['비싸', '예산', '돈이', ...]],
  ...
  ['rain', ['비 와', '비와', '비가', ...]],
]
function situationFromSpeech(text: string) {
  const spoken = text.replace(/\\s+/g, ' ')
  return SPOKEN_HINTS.find(([, words]) => words.some((w) => spoken.includes(w)))?.[0] ?? null
}`,
      points: [
        '발표 킬러 장면: NOW PLAYING 끼니, 메인 식당, 상황 타일 6개, 직접 말하기',
        '주소의 meal 이 이상하면(정수 아님·범위 밖) currentMealIndex 로 대체',
        '시트 열림 여부는 useState 가 아니라 주소의 s — 뒤로가기 = 시트 닫기, 공유 = 열린 채로',
        '직접 말하기: 배열 순서 = 우선순위, "비싸"가 "비"에 걸리지 않게 budget 을 rain 보다 먼저',
        '"말하기"지만 실제로는 텍스트 입력 (음성 인식 X, AI X)',
        'VariationSheet: 대안은 이미 악보 안 → 네트워크 0. 0개면 "조건에 맞는 곳을 찾지 못했어요"',
        '27941ec: cardStep() 분리, showCard(index) 로 scrollTo (움직임 줄이기면 behavior auto), 페이지 점을 버튼으로, 화살표는 pointer-fine:flex',
        'onScroll 에 Math.min(places.length - 1, ...) 상한 — 마지막 카드에서 반올림이 범위를 넘지 않게',
      ],
    },
    {
      title: 'PlaceScreen · PlaceActions',
      notionIds: ['3f2df951bf808141bfd7daf4552b37eb'],
      code: `type Inquiry =
  | { state: 'idle' }
  | { state: 'asking' }
  | { state: 'answered'; answer: LiveStatus }
  | { state: 'failed'; message: string }

for (let tries = 0; answer.status === 'pending' && tries < 30 && alive.current; tries += 1) {
  answer = await waitForAnswer(answer.queryId)
}`,
      points: [
        'findInScore 로 악보 안에서 먼저 찾고, 없을 때만 getPlace(id) — 유미 재호출 방지',
        'cancelled 플래그: 화면을 떠난 뒤 온 응답은 무시',
        'fetched.id === id 확인: 다른 매장으로 이동했을 때 이전 매장 정보가 잠깐 보이는 것 방지',
        '판별 유니언 Inquiry: answered 일 때만 answer 가 있다는 걸 TS 가 보장 — isLoading/error/data 따로 두는 것보다 모순 상태가 없음',
        '롱폴링 루프: pending 이면 최대 30번(약 5분) waitForAnswer, alive ref 가 false 면 중단',
        '버튼: 파트너 → 실시간 문의 / 전화번호 → tel: 링크 / 둘 다 없음 → disabled. 길찾기는 카카오맵 링크',
        'simulated 답이면 "체험용 답변이에요" 표시',
      ],
    },
  ],
  questions: [
    { id: 'pj-35-01', type: 'mcq', source: 'HomeScreen · ScoreScreen', question: '홈의 오선 5줄 장식에 aria-hidden 을 준 이유는?', choices: ['의미 없는 장식이라 스크린리더에서 숨기려고', '애니메이션', '클릭 방지', '성능'], answer: 0, explanation: '장식은 보조기기에 노출하지 않아요.' },
    { id: 'pj-35-02', type: 'mcq', source: 'HomeScreen · ScoreScreen', question: '끼니가 모두 을지로면 악보 제목은?', choices: ["'을지로에서 을지로까지'", "'을지로에서의 하루'", "'을지로'", "'하루'"], answer: 1, explanation: '첫·마지막 동네가 같으면 "~에서의 하루".' },
    { id: 'pj-35-03', type: 'mcq', source: 'HomeScreen · ScoreScreen', question: '끼니 3개 악보의 "플랜B N" 에서 N 의 최대값은?', choices: ['6', '18', '54 (3 × 6 × 3)', '9'], answer: 2, explanation: '끼니 × 상황 6 × 대안 3.' },
    { id: 'pj-35-04', type: 'mcq', source: 'PlanScreen · MealSheet', question: 'MealSheet 의 "초안(draft)" 패턴의 효과는?', choices: ['서버 전송', '되돌리기 불가', '자동 저장', '시트 안 변경은 draft 에만 있고 저장을 눌러야 스토어 반영 — 닫으면 취소'], answer: 3, explanation: '편집 중 값을 전역 상태와 분리해요.' },
    { id: 'pj-35-05', type: 'mcq', source: 'PlanScreen · MealSheet', question: '날짜 칸에 투명한 <input type="date"> 를 겹치고 showPicker() 를 부르는 이유는?', choices: ['스타일 통일하면서 휴대폰 기본 날짜 선택기를 쓰려고', '보안', '접근성 제거', '서버 검증'], answer: 0, explanation: '보이는 글자는 디자인대로, 선택은 기본 UI 로.' },
    { id: 'pj-35-06', type: 'mcq', source: 'PlanScreen · MealSheet', question: '"지휘 시작" 중 오류가 ApiError 가 아니면 표시 문구는?', choices: ['e.message', "'잠시 후 다시 시도해 주세요.'", '아무것도', "'offline'"], answer: 1, explanation: 'instanceof 로 구분해요.' },
    { id: 'pj-35-07', type: 'mcq', source: 'PlanScreen · MealSheet', question: 'conduct() 의 finally 에서 setConducting(false) 를 하는 이유는?', choices: ['로그', '성공 시에만', '성공·실패 모두 버튼을 다시 누를 수 있게 되돌리려고', '타이머'], answer: 2, explanation: 'catch 에만 두면 성공 경로에서 놓칠 수 있어요.' },
    { id: 'pj-35-08', type: 'mcq', source: 'LiveScreen (당일 모드)', question: 'LiveScreen 에서 변주 시트가 열려 있는지 결정하는 것은?', choices: ['localStorage', 'Context', 'useState', '주소의 s 파라미터'], answer: 3, explanation: '뒤로가기가 시트 닫기가 되는 이유.' },
    { id: 'pj-35-09', type: 'mcq', source: 'LiveScreen (당일 모드)', question: '"너무 비싸" 를 입력했을 때 rain 이 아니라 budget 으로 잡히는 이유는?', choices: ['SPOKEN_HINTS 에서 budget 이 rain 보다 먼저 있고 find 는 첫 번째 일치를 돌려줘서', '랜덤', '길이 비교', 'AI 가 판단'], answer: 0, explanation: '배열 순서 = 우선순위.' },
    { id: 'pj-35-10', type: 'mcq', source: 'LiveScreen (당일 모드)', question: '"직접 말하기" 기능의 실제 구현은?', choices: ['헤이유미 API', '음성 인식 + LLM', '텍스트 입력 + 낱말 포함 여부 키워드 매칭', '서버 NLP'], answer: 2, explanation: '이름과 달리 음성도 AI 도 아니에요.' },
    { id: 'pj-35-11', type: 'mcq', source: 'LiveScreen (당일 모드)', question: '27941ec 에서 대안 카드 화살표를 pointer-fine:flex 로 보이게 한 의미는?', choices: ['다크 모드', '가로 모드', '큰 화면에서만', '마우스·트랙패드처럼 정밀한 포인터일 때만 (입력 장치 기준)'], answer: 3, explanation: '큰 태블릿이라도 손가락이면 숨겨요.' },
    { id: 'pj-35-12', type: 'mcq', source: 'LiveScreen (당일 모드)', question: 'showCard() 가 움직임 줄이기 설정이면 behavior 를 "auto" 로 하는 이유는?', choices: ['부드러운 스크롤 애니메이션 대신 즉시 이동 — 접근성 존중', '버그 회피', '호환성', '속도'], answer: 0, explanation: 'useReducedMotion() 으로 판단해요.' },
    { id: 'pj-35-13', type: 'mcq', source: 'LiveScreen (당일 모드)', question: 'onScroll 의 active 계산에 Math.min(places.length - 1, ...) 을 추가한 이유는?', choices: ['성능', '마지막 카드에서 반올림이 범위를 넘어 점·화살표가 어긋나지 않게', '음수 방지', '정렬'], answer: 1, explanation: '오른쪽 끝에 스크롤 여유가 없어 계산이 어긋날 수 있어요.' },
    { id: 'pj-35-14', type: 'mcq', source: 'PlaceScreen · PlaceActions', question: 'PlaceScreen 의 useEffect 에서 cancelled 플래그의 역할은?', choices: ['캐시', '요청 취소', '화면을 떠난 뒤 늦게 온 응답으로 setState 하지 않게', '재시도'], answer: 2, explanation: 'cleanup 에서 true 로 바꿔요.' },
    { id: 'pj-35-15', type: 'mcq', source: 'PlaceScreen · PlaceActions', question: 'place = inScore ?? (fetched?.id === id ? fetched.place : null) 에서 id 비교의 목적은?', choices: ['캐시', '정렬', '타입 검사', '다른 매장으로 이동했을 때 이전 매장 정보가 잠깐 보이는 것 방지'], answer: 3, explanation: '새 응답이 오기 전엔 null 로 로딩 상태.' },
    { id: 'pj-35-16', type: 'mcq', source: 'PlaceScreen · PlaceActions', question: '문의 상태를 판별 유니언(state: idle | asking | answered | failed)으로 둔 장점은?', choices: ['answered 일 때만 answer 가 있다는 걸 TS 가 보장해 "로딩 중인데 에러도 있음" 같은 모순 상태가 없음', '속도', '직렬화', '코드가 짧음'], answer: 0, explanation: 'isLoading·error·data 를 따로 두면 조합이 꼬일 수 있어요.' },
    { id: 'pj-35-17', type: 'mcq', source: 'PlaceScreen · PlaceActions', question: '실시간 문의 롱폴링 루프가 멈추는 조건이 아닌 것은?', choices: ['화면을 떠남 (alive.current = false)', '1초 경과', '답이 pending 이 아님', '30번 시도'], answer: 1, explanation: '서버가 10초씩 붙잡으니 최대 약 5분.' },
    { id: 'pj-35-18', type: 'mcq', source: 'PlaceScreen · PlaceActions', question: '파트너가 아니고 전화번호가 있는 매장의 버튼은?', choices: ['예약', '실시간 문의', 'tel: 전화 링크', 'disabled'], answer: 2, explanation: '둘 다 없으면 disabled.' },
  ],
}

export default topic
