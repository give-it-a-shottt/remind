import type { Topic } from '../../types'

const topic: Topic = {
  id: 'pj-50-rebuild-setup',
  track: 'project',
  group: '다시 만들기',
  title: '07-0~2. 준비물 · 저장소 뼈대 · 프론트 시작',
  order: 50,
  notionId: '3fadf951bf8081d0bb9ac40544075b17',
  addedAt: '2026-10-15',
  sections: [
    {
      title: '07-0 준비물',
      notionIds: ['3fadf951bf8081d08354e05e77c97ee2'],
      points: [
        '프로그램: Node.js 22 LTS(npm 포함), uv, Python 3.13(uv 가 필요할 때 받음), Git, Docker Desktop(07-10 로컬 Postgres 때만, 선택)',
        '계정: GitHub(07-1), Vercel·Render(07-11, GitHub 계정으로 가입), Supabase(07-10)',
        '확인: node -v, npm -v, uv --version, git --version 이 모두 버전을 출력',
        '가이드 명령은 bash 문법 — 윈도에서는 VS Code 터미널을 Git Bash 로',
        'Git Bash 는 /accio-v1/ 처럼 / 로 시작하는 인자를 윈도 경로로 바꿔 버림 → MSYS_NO_PATHCONV=1 을 앞에 (07-7)',
        'PowerShell 환경변수는 $env:이름 = "값"',
      ],
    },
    {
      title: '07-1 저장소 뼈대',
      notionIds: ['3fadf951bf8081e0a588e395714c7a23'],
      code: `mkdir jsh.-Portfolio && cd jsh.-Portfolio
git init -b main
mkdir -p Portfolio/backend .github/workflows`,
      points: [
        '폴더 하나에 프론트 1 + 백엔드 2 = 모노레포. Vercel·Render 는 각각 "이 저장소의 이 폴더"만 보고 배포',
        'Portfolio/frontend 는 07-2 에서 Vite 가, backend/maestro·accio 는 07-8·07-10 에서 uv 가 만들어 줌 — 지금은 안 만듦',
        '.gitignore 는 루트 하나로 프론트·백엔드를 같이 막음: node_modules, dist, .env(단 !.env.example), __pycache__, .venv, *.tsbuildinfo 등',
        'GitHub 새 저장소는 README·.gitignore 없이 — 빈 저장소여야 첫 push 가 충돌하지 않음',
        'git remote add origin … → git push -u origin main',
      ],
    },
    {
      title: '07-2 프론트 시작',
      notionIds: ['3fadf951bf8081d0bb9ac40544075b17'],
      code: `npm create vite@latest frontend -- --template react-ts --no-interactive
cd frontend
rm .oxlintrc.json .gitignore README.md`,
      points: [
        '템플릿은 시기마다 바뀌므로 package.json·설정 파일은 가이드 전문이 기준',
        '2026-10 템플릿은 oxlint 를 깔아 줌 → 이 저장소는 ESLint 라 package.json 교체 + eslint.config.js 추가, .oxlintrc.json·frontend/.gitignore 삭제',
        '의존성: tailwindcss + @tailwindcss/vite, motion(Framer Motion 의 새 이름), prism-react-renderer(사례 상세 코드 색칠), react 19',
        '^ 범위 때문에 지금 설치하면 조금 새 버전이 들어옴 — 똑같이 하려면 package-lock.json 을 받아 npm ci (lock 에 적힌 버전만 설치)',
        'tsconfig.json 은 app·node 를 묶기만, noEmit 이라 build = tsc -b(검사) + vite build(묶기)',
        'index.html: 웹폰트 4개(Pretendard, Diplomata &text=A, JetBrains Mono &text=인트로 글자, Lora·Noto Serif KR) + 파비콘, <title>jsh.</title>',
        '확인: npm run dev(5173 카운터), build("✓ built"), lint 통과. "oxlint: command not found" 면 package.json 을 아직 안 바꾼 것',
      ],
    },
  ],
  questions: [
    { id: 'pj-50-01', type: 'mcq', source: '07-0 준비물', question: 'Python 3.13 을 따로 설치하지 않아도 되는 이유는?', choices: ['Docker 가 제공', '필요 없음', 'Node 에 포함', 'uv 가 필요할 때 알아서 받아서'], answer: 3, explanation: 'uv python install 3.13 으로 미리 받아도 돼요.' },
    { id: 'pj-50-02', type: 'mcq', source: '07-0 준비물', question: 'Docker Desktop 이 필요한 단계는?', choices: ['07-10 에서 로컬 Postgres 를 띄울 때만 (선택)', '07-11 배포', '항상', '07-2'], answer: 0, explanation: 'Supabase 만 써도 돼요.' },
    { id: 'pj-50-03', type: 'mcq', source: '07-0 준비물', question: 'Git Bash 에서 MSYS_NO_PATHCONV=1 을 붙이는 이유는?', choices: ['속도', '/accio-v1/ 같은 / 로 시작하는 인자를 윈도 경로로 바꾸는 걸 막으려고', '권한', '인코딩'], answer: 1, explanation: 'C:/Program Files/Git/accio-v1/ 로 바뀌는 문제.' },
    { id: 'pj-50-04', type: 'mcq', source: '07-1 저장소 뼈대', question: '프론트 1개 + 백엔드 2개를 한 저장소에 두는 구조는?', choices: ['멀티레포', '마이크로서비스', '모노레포', '서브모듈'], answer: 2, explanation: '배포 서비스는 각자 폴더(Root Directory/rootDir)만 봐요.' },
    { id: 'pj-50-05', type: 'mcq', source: '07-1 저장소 뼈대', question: 'GitHub 새 저장소를 README·.gitignore 없이 만드는 이유는?', choices: ['보안', '무료', '용량', '빈 저장소여야 로컬에서 만든 첫 커밋 push 가 충돌하지 않아서'], answer: 3, explanation: '원격에 다른 커밋이 있으면 pull 이 먼저 필요해요.' },
    { id: 'pj-50-06', type: 'mcq', source: '07-1 저장소 뼈대', question: '.gitignore 를 루트 하나로 두는 장점은?', choices: ['프론트·백엔드 무시 규칙을 한 곳에서 관리', '속도', 'Vercel 요구', '필수 규칙'], answer: 0, explanation: '템플릿이 만든 frontend/.gitignore 는 지워요.' },
    { id: 'pj-50-07', type: 'mcq', source: '07-2 프론트 시작', question: 'Vite 템플릿이 만든 .oxlintrc.json 을 지우는 이유는?', choices: ['오류가 나서', '이 저장소는 oxlint 대신 ESLint 를 쓰기 때문', '용량', '보안'], answer: 1, explanation: 'package.json 의 lint 스크립트도 eslint . 로 바꿔요.' },
    { id: 'pj-50-08', type: 'mcq', source: '07-2 프론트 시작', question: 'npm install 대신 npm ci 를 쓰면?', choices: ['캐시만 사용', '더 새 버전', 'package-lock.json 에 적힌 버전만 그대로 설치', 'devDependencies 제외'], answer: 2, explanation: '저장소와 버전까지 똑같이 맞출 때.' },
    { id: 'pj-50-09', type: 'mcq', source: '07-2 프론트 시작', question: 'motion 패키지는?', choices: ['라우터', '테스트 도구', 'CSS 라이브러리', 'Framer Motion 의 새 이름 — 인트로·바텀시트 애니메이션'], answer: 3, explanation: 'import 는 motion/react.' },
    { id: 'pj-50-10', type: 'mcq', source: '07-2 프론트 시작', question: 'npm run lint 에서 "oxlint: command not found" 가 나오면 원인은?', choices: ['eslint 미설치', 'package.json 을 아직 가이드 것으로 바꾸지 않음', 'Node 버전', 'tsconfig 오류'], answer: 1, explanation: '템플릿 lint 스크립트가 oxlint 를 부르고 있어요.' },
    { id: 'pj-50-11', type: 'mcq', source: '07-2 프론트 시작', question: 'JetBrains Mono 웹폰트를 &text= 로 받는 글자는?', choices: ['한글', '전체 영문', '인트로에 치는 print("Hello, jsh. world") 와 > 글자만', '숫자만'], answer: 2, explanation: '쓰는 글자만 받아 파일을 작게.' },
  ],
}

export default topic
