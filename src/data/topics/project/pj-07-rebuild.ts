import type { Topic } from '../../types'

const topic: Topic = {
  id: 'pj-07-rebuild',
  track: 'project',
  group: '개요',
  title: '07. 처음부터 다시 만들기 (전체 순서)',
  order: 7,
  notionId: '3fadf951bf8081eb8af9dc08aa3d8f00',
  addedAt: '2026-10-15',
  sections: [
    {
      title: '전체 순서',
      points: [
        '07-0 준비물(node·uv·git) → 07-1 저장소 뼈대 → 07-2 프론트 시작(Vite + React + TS)',
        '07-3 Tailwind 4 + 디자인 토큰: text-32 는 되고 text-xs 는 안 되면 성공',
        '07-4 해시 라우터와 앱 입구: #/accio, #/maestro 로 화면 전환',
        '07-5 검색형 포트폴리오(6~10시간) → 07-6 Accio 쇼핑몰 목업(8~12시간) → 07-7 accio-v1 정적 빌드',
        '07-8 Maestro 백엔드: localhost:8001/docs + pytest 통과 → 07-9 Maestro 프론트: 로컬 "지휘 시작"까지',
        '07-10 Accio 백엔드 + DB: /health/db 200 → 07-11 배포 → 07-12 최종 점검표',
        '실제 커밋 순서와 다름 — "다시 만들 때 막히지 않는 순서"로 재배열',
      ],
    },
    {
      title: '읽는 법',
      points: [
        '각 단계 끝 "✅ 여기까지 하면 보여야 할 것"이 안 보이면 다음 단계로 넘어가지 말고 ⚠️ 부터',
        '파일 링크는 기준 커밋 113f81f 에 고정 → 저장소가 바뀌어도 줄 번호 그대로',
        '세팅·설정·뼈대·배포는 명령과 파일 전문이 있어 복붙으로 재현, 기능 화면은 순서 + 핵심 코드 + 원문 링크',
      ],
    },
    {
      title: '노션만으로 재현할 수 없는 것',
      points: [
        'accio-v1 원본 소스(add_/) — 백엔드·.env 가 섞여 git 에 없고 빌드 결과만 저장소에',
        '대시보드에 넣은 실제 값 — Vercel·Render 주소, 헤이유미 키, Supabase 비밀번호 (가이드엔 자리표시만)',
      ],
    },
  ],
  questions: [
    { id: 'pj-07-01', type: 'mcq', source: '전체 순서', question: '07-3 (Tailwind 4 + 디자인 토큰) 단계가 끝났는지 확인하는 방법은?', choices: ['text-xs 가 12px 로 보인다', 'text-32 는 적용되고 text-xs 는 적용되지 않는다', 'build 가 실패한다', '폰트가 바뀐다'], answer: 1, explanation: '기본 스케일을 지우고 토큰만 남겼는지 확인하는 체크예요.' },
    { id: 'pj-07-02', type: 'mcq', source: '전체 순서', question: 'Maestro 프론트(07-9)보다 Maestro 백엔드(07-8)를 먼저 만드는 이유로 가장 알맞은 것은?', choices: ['백엔드가 더 쉬워서', '프론트의 "지휘 시작"이 로컬 백엔드(8001)를 불러야 동작해서', 'Render 가 먼저 필요해서', '순서는 상관없어서'], answer: 1, explanation: '백엔드를 /docs 와 pytest 로 먼저 확인해 두면 프론트 연결 때 막히지 않아요.' },
    { id: 'pj-07-03', type: 'mcq', source: '전체 순서', question: '07-10 Accio 백엔드 + DB 단계의 완료 기준은?', choices: ['/docs 접속', 'GET /health/db 가 200', '프론트 빌드 통과', '크론 실행'], answer: 1, explanation: 'DB 에 SELECT 1 이 성공해야 200 이에요.' },
    { id: 'pj-07-04', type: 'mcq', source: '전체 순서', question: '07 가이드의 단계 순서에 대한 설명으로 옳은 것은?', choices: ['실제 커밋 순서와 똑같다', '다시 만들 때 막히지 않는 순서로 바꿔 놓았다', '아무 순서나 해도 된다', '배포를 가장 먼저 한다'], answer: 1, explanation: '실제로는 Accio 를 먼저 만들고 나중에 포트폴리오를 입구로 재구성했어요.' },
    { id: 'pj-07-05', type: 'mcq', source: '읽는 법', question: '단계 끝의 "✅ 보여야 할 것"이 안 보이면?', choices: ['다음 단계로 넘어간다', '넘어가지 말고 그 페이지의 ⚠️ 를 먼저 본다', '처음부터 다시', '무시한다'], answer: 1, explanation: '문제를 다음 단계로 끌고 가면 원인을 찾기 어려워져요.' },
    { id: 'pj-07-06', type: 'mcq', source: '읽는 법', question: 'GitHub 원문 링크를 기준 커밋(113f81f)에 고정한 이유는?', choices: ['링크가 짧아서', '저장소가 바뀌어도 링크 속 줄 번호가 그대로 맞도록', '비공개라서', '권한 때문에'], answer: 1, explanation: '브랜치 링크는 코드가 바뀌면 줄 번호가 어긋나요.' },
    { id: 'pj-07-07', type: 'mcq', source: '노션만으로 재현할 수 없는 것', question: '노션 가이드만으로 재현할 수 없는 것은?', choices: ['Tailwind 토큰 설정', 'render.yaml', 'Vercel·Render 대시보드에 넣은 실제 값(주소·키·비밀번호)', '해시 라우터'], answer: 2, explanation: '비밀값은 자리표시만 있어요. accio-v1 원본 소스도 git 에 없어요.' },
    { id: 'pj-07-08', type: 'mcq', source: '노션만으로 재현할 수 없는 것', question: 'accio-v1 원본 소스가 git 에 없는 이유는?', choices: ['용량이 커서', '백엔드·.env 가 섞여 있어서 — 빌드 결과만 저장소에 둠', '라이선스', '삭제돼서'], answer: 1, explanation: '.env 같은 비밀값이 섞인 폴더는 커밋하지 않아요.' },
  ],
}

export default topic
