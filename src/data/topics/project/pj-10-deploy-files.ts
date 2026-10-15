import type { Topic } from '../../types'

const topic: Topic = {
  id: 'pj-10-deploy-files',
  track: 'project',
  group: '배포',
  title: '01-1. 배포 파일 (render.yaml · Actions · .gitignore)',
  order: 10,
  notionId: '3f2df951bf8081ca8025db2e1ab2f8b4',
  addedAt: '2026-10-15',
  sections: [
    {
      title: 'render.yaml',
      notionIds: ['3f2df951bf8081ca8025db2e1ab2f8b4'],
      code: `services:
  - type: web
    name: maestro-api
    runtime: python
    plan: free
    region: singapore
    rootDir: Portfolio/backend/maestro
    buildCommand: uv sync --frozen --no-dev
    startCommand: uv run --frozen --no-dev fastapi run app/main.py --port $PORT
    healthCheckPath: /health`,
      points: [
        'Render 대시보드 New → Blueprint 로 저장소를 고르면 적힌 서버를 자동으로 만드는 "인프라 설계도" (Infrastructure as Code)',
        '--frozen: uv.lock 을 바꾸지 않고 적힌 버전 그대로 → 로컬과 서버가 같은 버전',
        '$PORT: Render 가 정해 주는 포트. 서버는 이 포트로만 열어야 함',
        'fastapi run 은 운영용(자동 재시작 없음, 0.0.0.0), 개발할 땐 fastapi dev',
        'YUMI_MODE=mock: 하루 70요청 한도를 방문자가 다 써버리지 않게. 발표·확인 때만 대시보드에서 real',
        '백엔드가 늘면 services 에 하나 더 — Accio 는 rootDir: Portfolio/backend/accio + DATABASE_URL',
      ],
    },
    {
      title: 'keep-supabase-awake.yml',
      notionIds: ['3f2df951bf808109b245d91164134fb6'],
      code: `on:
  schedule:
    - cron: "0 0 */3 * *"
  workflow_dispatch:
...
  if [ -z "$ACCIO_API_URL" ]; then exit 0; fi
  curl --fail --silent --show-error --max-time 120 --retry 2 --retry-delay 10 "$ACCIO_API_URL/health/db"`,
      points: [
        'Supabase 무료 DB 는 1주일 안 쓰면 일시정지 → 사흘마다 /health/db 로 쿼리 한 번',
        'cron 다섯 칸: 분 시 일 월 요일 (UTC)',
        'vars. 는 공개돼도 괜찮은 설정값, secrets. 는 비밀값 — 주소는 비밀이 아니라 vars',
        '[ -z ... ] 로 빈 문자열 검사 → Accio 미배포면 실패 대신 조용히 성공',
        '한 번의 curl 이 Render 무료 서버(Accio API)와 그 뒤 Supabase DB 를 동시에 깨움',
        'Maestro 가 아니라 Accio 를 부르는 이유: Supabase 에 연결된 건 Accio 백엔드뿐 (Maestro 는 DB 없음)',
      ],
    },
    {
      title: '.gitignore · README.md',
      notionIds: ['3f2df951bf80812ea983cdc15db2b9bb'],
      points: [
        '.gitignore 에 빠진 파일은 Vercel·Render 도 못 본다 — 배포와 직결',
        'node_modules/, dist/ — 서버가 직접 설치·빌드하므로 올리지 않음',
        '.env, .env.* 는 제외하되 !.env.example 은 올림 → 배포 환경변수는 대시보드에 직접',
        '__pycache__/, .venv/, .pytest_cache/ 등 파이썬 캐시, .DS_Store 등 OS 파일',
        'MyDesign.md 같은 개인 디자인 문서도 제외 (코드 주석의 "기준 문서"지만 레포에 없음)',
        'README 는 팀 프로젝트 시절 Accio 소개라 지금 구조(포트폴리오 + Maestro)는 반영 안 됨. 공백 있는 파일명은 %20 으로 인코딩',
      ],
    },
  ],
  questions: [
    { id: 'pj-10-01', type: 'mcq', source: 'render.yaml', question: 'render.yaml 같은 블루프린트 파일의 개념은?', choices: ['CI 파이프라인', 'Infrastructure as Code — 서버 구성을 코드로 적어 자동 생성', '도커 이미지', 'DNS 설정'], answer: 1, explanation: '대시보드에서 손으로 만들던 서버 설정을 파일로 버전 관리해요.' },
    { id: 'pj-10-02', type: 'mcq', source: 'render.yaml', question: '서버를 --port $PORT 로 띄우는 이유는?', choices: ['보안', 'Render 가 정해 주는 포트로만 열어야 트래픽이 들어와서', '8000 이 막혀서', '속도'], answer: 1, explanation: '플랫폼이 포트를 정해 환경변수로 넘겨줘요.' },
    { id: 'pj-10-03', type: 'mcq', source: 'render.yaml', question: 'fastapi run 과 fastapi dev 의 차이로 옳은 것은?', choices: ['run 은 자동 재시작, dev 는 운영용', 'run 은 운영용(자동 재시작 없음, 0.0.0.0), dev 는 개발용(코드 바뀌면 재시작)', '같다', 'dev 만 /docs 가 있다'], answer: 1, explanation: '운영에선 파일 감시가 필요 없고 외부 접속을 받아야 해요.' },
    { id: 'pj-10-04', type: 'mcq', source: 'render.yaml', question: '공개 사이트에서 YUMI_MODE 를 mock 으로 둔 이유는?', choices: ['real 이 느려서', '방문자가 헤이유미 하루 70요청 한도를 다 써버리지 않게', 'real 은 유료라서', '테스트 때문에'], answer: 1, explanation: '발표·확인 때만 대시보드에서 real 로 바꿔요.' },
    { id: 'pj-10-05', type: 'mcq', source: 'render.yaml', question: 'Accio 백엔드도 Render 에 올리려면?', choices: ['새 레포를 만든다', 'services 에 하나 더 추가하고 rootDir 를 Portfolio/backend/accio 로 + DATABASE_URL', 'maestro-api 의 rootDir 를 바꾼다', '불가능'], answer: 1, explanation: '주석에 "rootDir 만 바꾸면 된다"고 적혀 있어요.' },
    { id: 'pj-10-06', type: 'mcq', source: 'keep-supabase-awake.yml', question: 'cron 다섯 칸의 순서는?', choices: ['초 분 시 일 월', '분 시 일 월 요일', '시 분 일 월 요일', '요일 월 일 시 분'], answer: 1, explanation: '"0 0 */3 * *" = 0분 0시, 일 칸 */3.' },
    { id: 'pj-10-07', type: 'mcq', source: 'keep-supabase-awake.yml', question: 'ACCIO_API_URL 을 secrets 가 아니라 vars 로 둔 이유는?', choices: ['vars 가 더 안전해서', '주소는 비밀이 아니라 공개돼도 괜찮은 설정값이라', 'secrets 는 유료라서', 'cron 에서 secrets 를 못 써서'], answer: 1, explanation: '비밀번호·키는 secrets, 주소 같은 설정은 vars.' },
    { id: 'pj-10-08', type: 'mcq', source: 'keep-supabase-awake.yml', question: 'curl 에 --max-time 120 을 준 이유는?', choices: ['DB 쿼리가 느려서', 'Render 무료 서버가 깨어나는 데 1분 정도 걸려서', 'GitHub 제한', '재시도 간격'], answer: 1, explanation: '잠든 서버의 첫 응답을 넉넉히 기다려요.' },
    { id: 'pj-10-09', type: 'mcq', source: 'keep-supabase-awake.yml', question: '이 워크플로가 Maestro 가 아니라 Accio 백엔드를 부르는 이유는?', choices: ['Maestro 가 느려서', 'Supabase DB 에 연결된 건 Accio 백엔드뿐이라', 'Accio 가 더 중요해서', '랜덤'], answer: 1, explanation: 'Maestro 는 DB 없이 유미 API + JSON 만 써요.' },
    { id: 'pj-10-10', type: 'mcq', source: '.gitignore · README.md', question: '.env 를 gitignore 하면서 !.env.example 은 올리는 이유는?', choices: ['실수', '비밀값은 숨기고, 어떤 변수가 필요한지 예시는 공유하려고', '배포에 필요해서', '용량'], answer: 1, explanation: '! 는 "제외에서 다시 포함" 이라는 뜻이에요.' },
    { id: 'pj-10-11', type: 'mcq', source: '.gitignore · README.md', question: '.env 가 gitignore 돼 있을 때 Render·Vercel 에 환경변수를 넣는 방법은?', choices: ['자동으로 읽는다', '각 대시보드에 직접 입력', 'README 에 적는다', 'render.yaml 에 값을 적는다'], answer: 1, explanation: '레포에 없는 파일은 배포 서버도 볼 수 없어요.' },
    { id: 'pj-10-12', type: 'mcq', source: '.gitignore · README.md', question: '파일명에 공백이 있는 이미지를 README 에서 링크할 때 공백 대신 쓰는 것은?', choices: ['_', '%20', '+', '\\\\ '], answer: 1, explanation: 'URL 인코딩으로 공백은 %20.' },
  ],
}

export default topic
