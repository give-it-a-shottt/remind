import type { Topic } from '../../types'

const topic: Topic = {
  id: 'pj-01-deploy',
  track: 'project',
  group: '배포',
  title: '01. 배포 (GitHub Actions · Vercel · Render)',
  order: 1,
  notionId: '3f2df951bf80814f8a8aec3197ba02e0',
  addedAt: '2026-10-15',
  sections: [
    {
      title: 'GitHub Actions',
      points: [
        '워크플로는 keep-supabase-awake.yml 하나뿐',
        'schedule cron "0 0 */3 * *" → UTC 00:00 = 한국 09:00, 매달 1·4·7…일 (사흘마다) + workflow_dispatch(수동 실행)',
        'push·PR 때는 실행되지 않음 — 테스트·린트·빌드 CI 는 없음',
        'vars.ACCIO_API_URL 이 비어 있으면 "건너뛴다" 출력 후 exit 0',
        'curl --max-time 120 --retry 2 --retry-delay 10 --fail 로 $ACCIO_API_URL/health/db 호출 → DB 에 SELECT 1',
        '*/3 은 "일(day) 기준"이라 31일 → 1일처럼 간격이 짧아질 수 있음. 저장소 60일 무활동이면 예약 워크플로가 자동으로 꺼짐',
      ],
    },
    {
      title: 'Vercel (프론트)',
      points: [
        'Root Directory 를 Portfolio/frontend 로 지정해야 빌드됨',
        '빌드: npm run build = tsc -b && vite build. tsc -b 는 타입 검사만(noEmit), 타입 에러면 배포 실패',
        'vite build: index.html 부터 import 를 따라 묶어 dist/ 에 저장, lazy() 앱은 별도 청크',
        'VITE_ 로 시작하는 환경변수만 프론트 코드에 들어가고 빌드할 때 문자열로 박힘 → 바꾸면 재배포',
        '해시 라우팅이라 SPA 리라이트 설정(vercel.json) 불필요',
        '프로덕션 브랜치 push → 프로덕션 배포, 다른 브랜치·PR → Preview 배포',
      ],
    },
    {
      title: 'Render (백엔드)',
      code: `rootDir: Portfolio/backend/maestro
buildCommand: uv sync --frozen --no-dev
startCommand: uv run --frozen --no-dev fastapi run app/main.py --port $PORT
healthCheckPath: /health`,
      points: [
        'render.yaml 블루프린트 → 서비스 1개 maestro-api (plan free, region singapore)',
        '--no-dev 로 pytest·ruff 같은 개발용 패키지 제외',
        'Render 가 /health 200 을 확인해야 "배포 성공"',
        'YUMI_API_KEY·CORS_ORIGINS 는 sync: false → 레포에 값 없이 대시보드에서 입력',
        'YUMI_MODE=mock 이라 공개 사이트는 유미 호출 0',
      ],
    },
    {
      title: '프론트 ↔ 백엔드 연결',
      points: [
        'API 주소: import.meta.env.VITE_MAESTRO_API_URL ?? "http://localhost:8001"',
        'CORS: CORSMiddleware(allow_origins=settings.cors_origins), 기본 ["http://localhost:5173"], 배포는 JSON 배열 문자열',
        '오류 형식 {"detail": {"code", "message"}} → 프론트 ApiError(code, message)',
        '#/maestro 진입 즉시 wakeServer() → /health, 2.5초 응답 없으면 "서버를 깨우는 중이에요" 띠',
        '헤이유미 키는 Render 환경변수에만 — 프론트는 마에스트로 백엔드만 부름(중계)',
        '자주 하는 실수: VITE_MAESTRO_API_URL 누락 → 방문자 localhost 호출, CORS_ORIGINS 가 한 글자라도 다름(끝의 / 포함) → 차단',
      ],
    },
    {
      title: 'git push 부터 반영까지',
      points: [
        'push → GitHub 가 연결된 앱(Vercel, Render)에 웹훅. GitHub Actions 는 아무 일도 안 함(cron 전용)',
        'Vercel: npm install → tsc -b → vite build → CDN 에 원자적 교체. 실패하면 이전 버전 계속 서빙',
        'Render: rootDir 폴더가 바뀐 커밋일 때만 재배포 (프론트만 고친 push 는 무시)',
        'uv sync --frozen 은 lock 과 pyproject 가 안 맞으면 실패',
        '새 서버 /health 200 확인 후 트래픽 이동, 실패하면 이전 서버 유지',
        '이미 만든 악보는 localStorage(maestro-plan-v1)에 있어 다시 지휘하기 전까지 예전 문구가 보일 수 있음',
      ],
    },
  ],
  questions: [
    { id: 'pj-01-01', type: 'mcq', source: 'GitHub Actions', question: 'keep-supabase-awake 워크플로가 실행되는 경우는?', choices: ['main 에 push 할 때', 'PR 을 열 때', '크론(사흘마다) 또는 수동 실행(workflow_dispatch)', '배포가 실패할 때'], answer: 2, explanation: 'schedule 과 workflow_dispatch 만 있어서 push·PR 에서는 돌지 않아요.' },
    { id: 'pj-01-02', type: 'mcq', source: 'GitHub Actions', question: 'cron "0 0 */3 * *" 는 한국 시간으로 몇 시에 도나?', choices: ['00:00', '09:00', '15:00', '21:00'], answer: 1, explanation: 'cron 은 UTC 기준. UTC 00:00 = KST 09:00.' },
    { id: 'pj-01-03', type: 'mcq', source: 'GitHub Actions', question: '저장소 변수 ACCIO_API_URL 이 비어 있으면 워크플로는?', choices: ['실패(빨간불)한다', '"건너뛴다"를 출력하고 성공으로 끝낸다', 'localhost 를 호출한다', '무한 대기한다'], answer: 1, explanation: 'exit 0 으로 끝나 성공 표시돼요.' },
    { id: 'pj-01-04', type: 'mcq', source: 'GitHub Actions', question: 'curl 에 --fail 을 붙인 효과는?', choices: ['재시도를 끈다', '서버가 503 같은 오류를 주면 워크플로도 실패로 표시', '응답을 파일로 저장', '타임아웃을 없앤다'], answer: 1, explanation: '--fail 이 없으면 HTTP 오류여도 curl 이 성공으로 끝나요.' },
    { id: 'pj-01-05', type: 'mcq', source: 'GitHub Actions', question: '오래 방치하면 생기는 문제는?', choices: ['cron 표현식이 바뀐다', '저장소 60일 무활동이면 GitHub 가 예약 워크플로를 자동으로 끈다', 'Secrets 가 삭제된다', 'Actions 요금이 청구된다'], answer: 1, explanation: '그러면 다시 켜야 해요.' },
    { id: 'pj-01-06', type: 'mcq', source: 'Vercel (프론트)', question: 'npm run build 에서 tsc -b 의 역할은?', choices: ['JS 파일을 만든다', '타입 검사만 한다 — 에러면 배포 실패', 'CSS 를 압축한다', '테스트를 돌린다'], answer: 1, explanation: 'noEmit 이라 파일은 vite build 가 만들고, tsc 는 검사만 해요.' },
    { id: 'pj-01-07', type: 'mcq', source: 'Vercel (프론트)', question: 'VITE_MAESTRO_API_URL 값을 Vercel 에서 바꾸면?', choices: ['즉시 반영된다', '재배포해야 반영된다 — 빌드할 때 문자열로 박히므로', '새로고침하면 반영된다', '백엔드를 재시작해야 한다'], answer: 1, explanation: 'VITE_ 변수는 런타임이 아니라 빌드 시점에 코드에 들어가요.' },
    { id: 'pj-01-08', type: 'mcq', source: 'Vercel (프론트)', question: 'vercel.json 의 SPA 리라이트 설정이 필요 없는 이유는?', choices: ['Vercel 이 React 를 자동 인식해서', '해시 라우팅이라 서버는 항상 index.html 하나만 주면 돼서', 'dist 가 없어서', 'Render 가 대신 처리해서'], answer: 1, explanation: '# 뒤는 서버로 보내지지 않아요.' },
    { id: 'pj-01-09', type: 'mcq', source: 'Vercel (프론트)', question: 'Vercel 에서 Root Directory 를 Portfolio/frontend 로 지정해야 하는 이유는?', choices: ['보안 때문에', '프론트 package.json 이 레포 루트가 아닌 그 폴더에 있어서', '백엔드를 같이 빌드하려고', '용량 제한 때문에'], answer: 1, explanation: '모노레포처럼 프론트가 하위 폴더에 있어요.' },
    { id: 'pj-01-10', type: 'mcq', source: 'Render (백엔드)', question: 'Render 빌드 명령 `uv sync --frozen --no-dev` 에서 --no-dev 의 의미는?', choices: ['디버그 모드 끔', 'pytest·ruff 같은 개발용 패키지를 빼고 설치', 'lock 파일 무시', '캐시 사용 안 함'], answer: 1, explanation: '운영 서버에는 실행에 필요한 패키지만 설치해요.' },
    { id: 'pj-01-11', type: 'mcq', source: 'Render (백엔드)', question: 'Render 가 "배포 성공"을 판단하는 기준은?', choices: ['빌드 로그에 에러가 없음', 'healthCheckPath(/health)가 200 을 줌', '프론트가 접속함', 'pytest 통과'], answer: 1, explanation: '헬스체크가 실패하면 이전 서버가 계속 일해요.' },
    { id: 'pj-01-12', type: 'mcq', source: 'Render (백엔드)', question: 'render.yaml 에서 YUMI_API_KEY 를 sync: false 로 둔 이유는?', choices: ['값이 자주 바뀌어서', '비밀값을 레포에 두지 않고 대시보드에서 입력하려고', '기본값을 쓰려고', 'mock 모드라 필요 없어서'], answer: 1, explanation: 'CORS_ORIGINS 도 같은 방식이에요.' },
    { id: 'pj-01-13', type: 'mcq', source: '프론트 ↔ 백엔드 연결', question: 'Vercel 에 VITE_MAESTRO_API_URL 을 안 넣고 배포하면?', choices: ['빌드가 실패한다', '방문자 컴퓨터의 localhost:8001 을 불러 "서버에 연결하지 못했어요"', 'Render 주소를 자동으로 찾는다', 'mock 데이터로 동작한다'], answer: 1, explanation: '`?? "http://localhost:8001"` 기본값 때문이에요.' },
    { id: 'pj-01-14', type: 'mcq', source: '프론트 ↔ 백엔드 연결', question: 'CORS_ORIGINS 에 "https://my.vercel.app/" 처럼 끝에 / 를 붙이면?', choices: ['정상 동작', 'Origin 과 글자가 달라 브라우저가 응답을 막는다', '서버가 500 을 준다', '자동으로 / 를 제거한다'], answer: 1, explanation: 'Origin 은 끝 슬래시가 없어서 한 글자라도 다르면 차단돼요.' },
    { id: 'pj-01-15', type: 'mcq', source: '프론트 ↔ 백엔드 연결', question: '헤이유미 API 키를 보호하는 방법은?', choices: ['프론트 .env 에 VITE_YUMI_KEY 로', 'Render 환경변수에만 두고, 프론트는 마에스트로 백엔드만 부른다(중계)', 'localStorage 에 저장', '코드에 난독화해서'], answer: 1, explanation: 'VITE_ 변수는 번들에 그대로 들어가 누구나 볼 수 있어요.' },
    { id: 'pj-01-16', type: 'mcq', source: 'git push 부터 반영까지', question: '프론트 파일만 고친 커밋을 push 하면 Render(maestro-api)는?', choices: ['항상 재배포', 'rootDir(Portfolio/backend/maestro) 밖 변경이라 무시', '서버를 끈다', '프론트도 같이 빌드한다'], answer: 1, explanation: 'Render 는 rootDir 폴더가 바뀐 커밋일 때만 재배포해요.' },
    { id: 'pj-01-17', type: 'mcq', source: 'git push 부터 반영까지', question: 'push 후 Vercel 빌드 중 타입 에러가 나면 사이트는?', choices: ['깨진 화면이 뜬다', '이전 버전이 계속 서빙된다', '404 가 뜬다', '빈 화면이 뜬다'], answer: 1, explanation: '배포는 원자적 교체라 실패하면 예전 버전 그대로예요.' },
    { id: 'pj-01-18', type: 'mcq', source: 'git push 부터 반영까지', question: '백엔드 상황 문구를 고쳐 배포했는데 화면에 예전 문구가 보이는 이유는?', choices: ['CDN 캐시', '이미 만든 악보가 localStorage(maestro-plan-v1)에 저장돼 있어서', 'Render 배포 실패', 'CORS 문제'], answer: 1, explanation: '일정을 바꾸거나 다시 "지휘 시작"을 눌러야 새 응답을 받아요.' },
  ],
}

export default topic
