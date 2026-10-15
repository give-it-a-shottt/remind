import type { Topic } from '../../types'

const topic: Topic = {
  id: 'pj-06-updates',
  track: 'project',
  group: '개요',
  title: '06. 업데이트 기록 (10/7 ~ 10/15 커밋)',
  order: 6,
  notionId: '3f2df951bf8081469103e55e4f50ea96',
  addedAt: '2026-10-15',
  sections: [
    {
      title: 'PC 마우스 대응 (27941ec)',
      points: [
        'BottomSheet 손잡이를 버튼으로 → 누르면 닫힘, 끌어내리면(100px 또는 초속 500px) 닫힘',
        '끌기는 손잡이에서만 시작: useDragControls + dragListener={false}',
        '끌기 후 따라오는 click 은 dragged ref 로 무시',
        '대안 카드 ‹ › 화살표는 마우스 화면에만 — 화면 크기가 아니라 입력 장치로 분기(pointer-fine:)',
      ],
    },
    {
      title: 'accio-v1 · 디자인 사례 (8f3d4e2 ~ 9dc7dde)',
      points: [
        '8f3d4e2: 서버가 닫힌 팀 프로젝트 원본을 목 모드 정적 빌드로 public/accio-v1/ 에',
        'public/ 에 둔 별도 빌드 결과물은 Vite 가 손대지 않고 그대로 배포',
        '사례에 links 필드(실제 화면 보기, v1 원본 보기)',
        '96668a9: GAMEPROBE(발로란트 전적·공략 웹) Design 사례 — screens·system, 데스크톱 시안',
        '42952c1: remind(노션 학습노트 복습 퀴즈) Design 사례 — 화면 이미지는 webp',
      ],
    },
    {
      title: '인트로 교체 (98c1bcd)',
      points: [
        'PortfolioHero(3.2초 피그마 모션) 삭제 → IntroMotion: 20×7 잔디 → J·S·H 비트맵 → 에디터에서 print("Hello, jsh. world") 타이핑',
        'motion.ts 의 INTRO_SECONDS 삭제, EASE_OUT 만 남음',
        'JetBrains Mono 웹폰트를 인트로 글자에만 추가',
      ],
    },
    {
      title: '사례 정리와 상세 (f1810ec ~ 113f81f)',
      points: [
        'f1810ec: 직접 하지 않은 시안 예시 Back 사례 6개를 검색 데이터에서 삭제',
        '4692bc8: Front·Back 사례 상세 — 문제 → 해결 → 결과 → 실제 코드',
        '실제 코드는 저장소 파일을 ?raw 로 불러와 줄 범위만 보여줌 (prism-react-renderer 색칠) → 문서와 코드가 어긋나지 않음',
        'vite.config.ts server.fs.allow 에 backend·.github·render.yaml 추가 (개발 서버가 프론트 밖 파일을 읽도록)',
        'rank.ts: 사례마다 level(1~3) → 레벨 높은 순, 같으면 최신순',
        '113f81f: j. 모노그램 로고·파비콘, 인트로 약 4.5초, 스크린샷 없는 사례에 자리표시 이미지',
      ],
    },
  ],
  questions: [
    { id: 'pj-06-01', type: 'mcq', source: 'PC 마우스 대응 (27941ec)', question: '대안 카드 화살표를 "마우스 화면에만" 보이게 한 분기 기준은?', choices: ['입력 장치 (pointer: fine)', 'User-Agent', '터치 이벤트 횟수', '화면 폭(md:)'], answer: 0, explanation: '큰 태블릿은 터치, 작은 노트북은 마우스일 수 있어 화면 크기보다 정확해요.' },
    { id: 'pj-06-02', type: 'mcq', source: 'PC 마우스 대응 (27941ec)', question: '바텀시트 드래그를 손잡이에서만 시작하게 한 방법은?', choices: ['CSS pointer-events', 'useDragControls + dragListener={false}', 'onMouseDown 무시', 'z-index'], answer: 1, explanation: '시트 전체 드래그를 끄고 손잡이에서 controls.start() 로만 시작해요.' },
    { id: 'pj-06-03', type: 'mcq', source: 'PC 마우스 대응 (27941ec)', question: '손잡이를 끌고 놓았을 때 "누르면 닫힘" 클릭이 같이 실행되는 문제를 막은 방법은?', choices: ['버튼 제거', 'setTimeout', 'dragged ref 로 끌기 직후 click 무시', 'e.stopPropagation 만'], answer: 2, explanation: '드래그가 끝나면 브라우저가 click 을 보내기 때문에 플래그로 걸러요.' },
    { id: 'pj-06-04', type: 'mcq', source: 'accio-v1 · 디자인 사례 (8f3d4e2 ~ 9dc7dde)', question: 'public/accio-v1/ 에 넣은 정적 빌드 결과물을 Vite 는 어떻게 다루나?', choices: ['무시하고 배포하지 않는다', '압축만 한다', '다시 번들링한다', '손대지 않고 그대로 dist 로 복사해 배포'], answer: 3, explanation: 'public/ 폴더는 가공 없이 그대로 복사돼요.' },
    { id: 'pj-06-05', type: 'mcq', source: 'accio-v1 · 디자인 사례 (8f3d4e2 ~ 9dc7dde)', question: '42952c1 에서 Design 탭에 추가된 사례는?', choices: ['remind (노션 학습노트 복습 퀴즈)', 'Accio v2', 'stay-login', 'GAMEPROBE'], answer: 0, explanation: 'GAMEPROBE 는 96668a9 에서 추가됐어요.' },
    { id: 'pj-06-06', type: 'mcq', source: '인트로 교체 (98c1bcd)', question: '새 인트로 IntroMotion 의 순서는?', choices: ['캐릭터 인사 → 제목', '잔디 → J·S·H 비트맵 → 에디터 타이핑', '로고 회전 → 페이드', '스플래시 이미지'], answer: 1, explanation: '마지막에 print("Hello, jsh. world") 를 타이핑해요.' },
    { id: 'pj-06-07', type: 'mcq', source: '인트로 교체 (98c1bcd)', question: '인트로 교체 후 motion.ts 에 남은 것은?', choices: ['DURATION', 'INTRO_SECONDS', 'EASE_OUT', 'SPRING'], answer: 2, explanation: 'INTRO_SECONDS 는 삭제되고 공통 이징 EASE_OUT 만 남았어요.' },
    { id: 'pj-06-08', type: 'mcq', source: '사례 정리와 상세 (f1810ec ~ 113f81f)', question: '사례 상세의 "실제 코드"를 복사하지 않고 ?raw 로 불러오는 장점은?', choices: ['SEO', '보안', '번들이 작아진다', '저장소 원문을 그대로 읽어 문서와 코드가 어긋나지 않는다'], answer: 3, explanation: '코드를 고치면 상세 화면도 자동으로 최신이 돼요.' },
    { id: 'pj-06-09', type: 'mcq', source: '사례 정리와 상세 (f1810ec ~ 113f81f)', question: 'vite.config.ts 의 server.fs.allow 에 backend·.github 를 추가한 이유는?', choices: ['개발 서버가 프론트 폴더 밖 파일(?raw import)을 읽을 수 있게', '보안 강화', '테스트', '배포 속도'], answer: 0, explanation: 'Vite 개발 서버는 기본적으로 프로젝트 루트 밖 파일 접근을 막아요.' },
    { id: 'pj-06-10', type: 'mcq', source: '사례 정리와 상세 (f1810ec ~ 113f81f)', question: 'rank.ts 의 사례 정렬 기준은?', choices: ['랜덤', '제목 가나다순', 'level 높은 순, 같으면 최신순', '조회수 순'], answer: 2, explanation: '화면에 안 보이는 내부 값(level)으로 정렬 기준을 만들었어요.' },
    { id: 'pj-06-11', type: 'mcq', source: '사례 정리와 상세 (f1810ec ~ 113f81f)', question: 'f1810ec 에서 검색 데이터의 Back 사례 6개를 지운 이유는?', choices: ['디자인 변경', '중복', '성능', '직접 하지 않은 시안 예시 값이라서'], answer: 3, explanation: '면접 전에 실제로 한 일만 남기도록 정리했어요.' },
  ],
}

export default topic
