import type { Topic } from '../../types'

const topic: Topic = {
  id: 'pj-56-rebuild-deploy',
  track: 'project',
  group: '다시 만들기',
  title: '07-11~12. 배포 순서 · 최종 점검표',
  order: 56,
  notionId: '3fadf951bf8081d88d52f27d46b87a8f',
  addedAt: '2026-10-15',
  sections: [
    {
      title: '07-11 배포 순서',
      notionIds: ['3fadf951bf8081d88d52f27d46b87a8f'],
      points: [
        'Render(백엔드) → Vercel(프론트) → Render 에 Vercel 주소 알려주기(CORS) → GitHub Actions',
        '프론트는 백엔드 주소가, 백엔드는 프론트 주소가 필요해서 한 번 오갈 수밖에 없음',
        'push 전 git status 로 .env, node_modules, .venv 가 목록에 없는지 꼭 확인',
        'Render: New → Blueprint → render.yaml 읽힘 → sync: false 값 2개 입력 (지금은 CORS_ORIGINS=["http://localhost:5173"], 키는 있을 때만)',
        '--frozen 빌드 실패 = pyproject 와 lock 이 어긋남 → 로컬에서 uv lock 후 다시 push',
        'Accio API 는 render.yaml 에 없어 New → Web Service 로 수동 (Root Directory Portfolio/backend/accio, DATABASE_URL 등)',
      ],
    },
    {
      title: '07-11 Vercel · CORS · Actions',
      notionIds: ['3fadf951bf8081d88d52f27d46b87a8f'],
      points: [
        'Vercel: Import → Root Directory Portfolio/frontend (Vite 자동 인식: npm run build, dist)',
        'VITE_MAESTRO_API_URL = https://<maestro Render 주소> (끝에 / 없이)',
        'VITE_ 변수는 빌드 때 문자열로 박힘 → 바꾸면 Redeploy, 브라우저로 그대로 내려가니 비밀 키는 절대 VITE_ 로 넣지 않기',
        'CORS_ORIGINS = ["https://<프로젝트>.vercel.app"] — JSON 배열, 끝에 / 붙이면 Origin 과 달라 막힘. 로컬도 쓰려면 둘 다',
        'Actions: Settings → Secrets and variables → Actions → Variables 에 ACCIO_API_URL (Secrets 가 아님)',
        'Actions 탭 → Run workflow 로 바로 한 번 돌려 초록불 확인',
      ],
    },
    {
      title: '07-12 최종 점검과 자주 막히는 곳',
      notionIds: ['3fadf951bf80812dbe74f18e2394cea4'],
      points: [
        '로컬: build·lint 통과, 조각 파일(AccioApp·MaestroApp·EngineeringCaseDetail) 분리, maestro 47 passed, accio(DB 켜고) 2 passed',
        '배포: 인트로 → 로고, 같은 탭 새로고침엔 인트로 없음, q·tab 이 주소에 남음, Back 사례 코드 색칠(?raw 가 배포에서도), /accio-v1/ 열림, 탭 제목 jsh.',
        '사례 상세 403 (개발 서버) → vite.config server.fs.allow',
        '환경변수를 바꿨는데 사이트 그대로 → VITE_ 는 빌드 때 박힘, Redeploy',
        '/health/db 503 → Docker 꺼짐, Direct connection IPv6, 비밀번호 기호',
        '노션만으로 재현 불가: accio-v1 원본 소스, 대시보드 실제 값, 기능 화면 전체 원문(GitHub 링크로)',
      ],
    },
  ],
  questions: [
    { id: 'pj-56-01', type: 'mcq', source: '07-11 배포 순서', question: '배포 순서가 Render → Vercel → 다시 Render 인 이유는?', choices: ['요금', '프론트는 백엔드 주소가, 백엔드(CORS)는 프론트 주소가 필요해서', '규칙', '속도'], answer: 1, explanation: '서로의 주소를 알아야 해요.' },
    { id: 'pj-56-02', type: 'mcq', source: '07-11 배포 순서', question: 'push 전에 git status 로 꼭 확인할 것은?', choices: ['파일 크기', '브랜치 이름', '.env, node_modules, .venv 가 커밋 목록에 없는지', '커밋 수'], answer: 2, explanation: '비밀값 유출과 불필요한 파일 방지.' },
    { id: 'pj-56-03', type: 'mcq', source: '07-11 배포 순서', question: 'Render 빌드가 uv sync --frozen 에서 실패하면?', choices: ['Python 버전 변경', '재시도', '--frozen 제거', '로컬에서 uv lock 으로 lock 을 갱신해 커밋 후 push'], answer: 3, explanation: 'pyproject 만 고치고 lock 을 안 올린 경우예요.' },
    { id: 'pj-56-04', type: 'mcq', source: '07-11 배포 순서', question: 'Render 블루프린트로 처음 만들 때 CORS_ORIGINS 를 localhost 로 두는 이유는?', choices: ['아직 Vercel 주소가 없어서 — 나중에 고침', '보안', '테스트', '영구 설정'], answer: 0, explanation: '4단계에서 Vercel 주소로 바꿔요.' },
    { id: 'pj-56-05', type: 'mcq', source: '07-11 Vercel · CORS · Actions', question: '유미 API 키를 VITE_YUMI_KEY 로 Vercel 에 넣으면 안 되는 이유는?', choices: ['이름 규칙', 'VITE_ 변수는 번들에 박혀 브라우저로 그대로 내려가 누구나 볼 수 있어서', '길이 제한', 'Vercel 금지'], answer: 1, explanation: '그래서 키는 백엔드에만 두고 중계해요.' },
    { id: 'pj-56-06', type: 'mcq', source: '07-11 Vercel · CORS · Actions', question: '로컬 개발과 배포 둘 다 쓰려면 CORS_ORIGINS 는?', choices: ['빈 값', '"*"', '["https://<프로젝트>.vercel.app", "http://localhost:5173"]', '하나만 가능'], answer: 2, explanation: 'JSON 배열에 둘 다.' },
    { id: 'pj-56-07', type: 'mcq', source: '07-11 Vercel · CORS · Actions', question: 'ACCIO_API_URL 을 넣는 곳은?', choices: ['Vercel', '.env', 'Secrets', 'Actions 의 Variables (워크플로가 vars. 로 읽음)'], answer: 3, explanation: '주소는 비밀이 아니에요.' },
    { id: 'pj-56-08', type: 'mcq', source: '07-11 Vercel · CORS · Actions', question: 'Actions 워크플로를 만든 직후 확인하는 방법은?', choices: ['Actions 탭에서 Run workflow 로 수동 실행해 초록불 확인', 'push', '로그 없음', '3일 기다림'], answer: 0, explanation: 'workflow_dispatch 덕분이에요.' },
    { id: 'pj-56-09', type: 'mcq', source: '07-12 최종 점검과 자주 막히는 곳', question: '배포된 사이트에서 Back 사례 상세의 코드가 색칠돼 보이면 확인된 것은?', choices: ['CORS', '?raw 로 frontend 밖 파일을 읽는 것이 배포 빌드에서도 동작', 'DB 연결', '인트로'], answer: 1, explanation: 'Vercel 의 Root Directory 밖 파일 포함 설정.' },
    { id: 'pj-56-10', type: 'mcq', source: '07-12 최종 점검과 자주 막히는 곳', question: '같은 탭에서 새로고침했을 때 인트로가 다시 안 나오는 이유는?', choices: ['쿠키', '서버 세션', 'localStorage', 'sessionStorage 의 jsh-intro-seen'], answer: 3, explanation: '새 탭에선 다시 나와요.' },
    { id: 'pj-56-11', type: 'mcq', source: '07-12 최종 점검과 자주 막히는 곳', question: '로컬 최종 점검에서 accio pytest 2 passed 를 보려면?', choices: ['DB(Docker)를 켜고 실행', '헤이유미 키', 'Render 배포', '그냥 실행'], answer: 0, explanation: 'readiness 테스트가 진짜 DB 를 필요로 해요.' },
  ],
}

export default topic
