import type { Topic } from '../../types'

const topic: Topic = {
  id: 'fs-02-1-uv',
  track: 'fullstack',
  group: '02. 개발 환경과 데이터베이스',
  title: '2-1. 파이썬 개발 환경: 가상환경과 uv',
  order: 201,
  notionId: '3fddf951bf80816bb7e6e8bab74c2210',
  addedAt: '2026-11-06',
  sections: [
    {
      title: '가상환경이 필요한 이유',
      slides: [
        {
          title: '프로젝트마다 따로 쓰는 공구함',
          blocks: [
            { type: 'say', text: '2장은 미니 인프런의 **기반 공사**예요. 개발 환경을 정리하고, 데이터를 저장할 데이터베이스를 띄워요.\n\n첫 수업은 파이썬 **가상환경**이에요. React 트랙 1-3에서 npm이 프로젝트마다 `node_modules`를 따로 둔다고 했죠? 파이썬도 같은 게 필요해요.' },
            { type: 'ask', q: 'A 프로젝트는 FastAPI 0.100, B 프로젝트는 최신 FastAPI가 필요해요. 컴퓨터 전체에 하나만 깔면 어떻게 될까요?', a: '하나를 맞추면 다른 하나가 깨져요. React 1-3의 "-g 전역 설치를 덜 쓰는 이유"와 똑같아요.\n그래서 프로젝트 폴더마다 **자기만의 파이썬과 패키지 상자**를 만들어요. 이게 **가상환경**(보통 `.venv` 폴더)이에요.' },
            { type: 'note', tone: 'analogy', text: '공용 공구함 하나를 온 가족이 쓰면 누가 망치를 바꿔 놓을지 몰라요. 프로젝트마다 **자기 공구함**을 두면 서로 건드리지 않아요.' },
          ],
        },
      ],
    },
    {
      title: 'uv 기본 명령',
      slides: [
        {
          title: '빠르고 한 번에 다 해 주는 도구',
          blocks: [
            { type: 'say', text: '**uv**는 파이썬 버전 관리, 가상환경 만들기, 패키지 설치를 **한 도구로** 해 주는 요즘 인기 도구예요. 아주 빨라요. npm이 하는 일을 파이썬에서 해 준다고 생각하면 돼요.' },
            {
              type: 'table',
              head: ['uv 명령', '하는 일', 'npm으로 치면'],
              rows: [
                ['`uv init --no-package`', '프로젝트 시작 (pyproject.toml 생성)', '`npm init`'],
                ['`uv add "fastapi[standard]"`', '패키지 설치 + 목록에 기록', '`npm install 패키지`'],
                ['`uv sync`', '목록(lock)대로 정확히 설치', '`npm ci`'],
                ['`uv run uvicorn main:app --reload`', '가상환경 안에서 명령 실행', '`npx`, `npm run`'],
              ],
            },
            { type: 'note', tone: 'warn', text: '요즘 uv는 `uv init`만 하면 패키지 배포용 구조(`src/이름/`)를 만들어요. 미니 인프런처럼 폴더 맨 위에 `main.py`를 두고 `main:app`으로 실행하려면 **`uv init --no-package`** 를 써요. 그리고 `uv init 폴더명`처럼 이름을 붙이면 **폴더 안에 폴더**가 생기니, 이미 만든 폴더 안에서는 이름 없이 실행해요.' },
          ],
        },
        {
          title: '파일 세 개',
          blocks: [
            {
              type: 'table',
              head: ['파일·폴더', '역할', 'git에 올리나'],
              rows: [
                ['`pyproject.toml`', '필요한 패키지 목록 (package.json)', '올림'],
                ['`uv.lock`', '정확한 버전 영수증 (package-lock.json)', '**올림**'],
                ['`.venv/`', '실제로 설치된 파이썬과 패키지 (node_modules)', '**안 올림**'],
              ],
            },
            { type: 'say', text: '팀원은 저장소를 받아서 `uv sync` 한 번이면 **똑같은 환경**이 만들어져요. React 5-3에서 배운 "lock 파일 커밋 + 정확히 설치"가 파이썬에서도 그대로예요.' },
          ],
        },
      ],
    },
    {
      title: '지금 어떤 파이썬을 쓰고 있나',
      slides: [
        {
          title: '가장 흔한 함정',
          blocks: [
            { type: 'say', text: '"설치했는데 `ModuleNotFoundError: No module named \'fastapi\'`가 나요." 거의 항상 **다른 파이썬**으로 실행하고 있어서예요. 컴퓨터에 파이썬이 여러 개 있을 수 있거든요(시스템 파이썬, conda, .venv).' },
            {
              type: 'code',
              code: `# Git Bash (Windows)
source .venv/Scripts/activate     # 가상환경 켜기 (Mac/Linux: .venv/bin/activate)
which python                      # 경로에 .venv 가 보여야 정상

# 또는 활성화 없이 uv가 알아서
uv run uvicorn main:app --reload`,
            },
            { type: 'note', tone: 'tip', text: '`uv run`으로 실행하면 활성화를 깜빡해도 항상 그 프로젝트의 `.venv`로 실행돼요. 헷갈리면 `uv run`을 쓰세요.' },
          ],
        },
        {
          title: 'conda와 섞일 때',
          blocks: [
            { type: 'say', text: 'Anaconda(conda)를 깔아 둔 컴퓨터는 터미널을 열 때마다 `(base)` 환경이 **자동으로** 켜져서, 내 `.venv` 대신 conda 파이썬이 잡히는 일이 많아요.' },
            { type: 'code', code: `conda config --set auto_activate_base false   # 터미널 열 때 base 자동 켜기 끄기
conda deactivate                               # 지금 켜진 conda 끄기` },
            { type: 'say', text: '도구를 섞어 쓰면 "어떤 파이썬이 실행되는지"가 계속 헷갈려요. 한 프로젝트에는 **한 도구(uv)** 만 쓰고, 문제가 생기면 `which python`부터 확인하는 습관을 들여요.\n\n수업 끝! 확인 문제 가요.' },
          ],
        },
      ],
    },
  ],
  questions: [
    {
      id: 'fs02-1-q1',
      source: '가상환경이 필요한 이유',
      type: 'mcq',
      question: '파이썬 가상환경(.venv)을 쓰는 가장 큰 이유는?',
      choices: ['코드를 빠르게 하려고', '프로젝트마다 패키지 버전을 따로 관리해 서로 충돌하지 않게 하려고', 'git을 쓰려고', 'DB를 만들려고'],
      answer: 1,
      explanation: '프로젝트마다 자기 공구함을 두는 거예요. npm의 node_modules와 같은 생각이에요.',
    },
    {
      id: 'fs02-1-q2',
      source: 'uv 기본 명령',
      type: 'mcq',
      question: 'uv에서 패키지를 설치하고 pyproject.toml에 기록하는 명령은?',
      choices: ['uv init', 'uv add fastapi', 'uv run fastapi', 'uv lock'],
      answer: 1,
      explanation: 'uv add가 npm install 패키지에 해당해요. uv sync는 lock대로 정확히 설치해요.',
    },
    {
      id: 'fs02-1-q3',
      source: 'uv 기본 명령',
      type: 'ox',
      question: '.venv 폴더는 팀원과 같은 환경을 쓰기 위해 git에 올려야 한다.',
      answer: false,
      explanation: '.venv는 node_modules처럼 올리지 않아요. pyproject.toml과 uv.lock을 올리고 팀원은 uv sync로 만들어요.',
    },
    {
      id: 'fs02-1-q4',
      source: 'uv 기본 명령',
      type: 'short',
      question: 'main.py를 폴더 맨 위에 두는 평평한 구조로 uv 프로젝트를 시작하는 옵션은? (uv init --__-______)',
      answer: ['--no-package', 'no-package', 'uv init --no-package'],
      explanation: '옵션 없이 uv init을 하면 src/이름/ 구조의 패키지 프로젝트가 만들어져요.',
    },
    {
      id: 'fs02-1-q5',
      source: '지금 어떤 파이썬을 쓰고 있나',
      type: 'mcq',
      question: 'fastapi를 설치했는데 ModuleNotFoundError가 난다. 가장 먼저 확인할 것은?',
      choices: ['FastAPI를 다시 만든다', 'which python으로 지금 .venv의 파이썬을 쓰고 있는지 확인한다', '컴퓨터를 바꾼다', 'Node.js를 설치한다'],
      answer: 1,
      explanation: '대부분 다른 파이썬(conda, 시스템)으로 실행해서예요. uv run으로 실행하면 항상 .venv를 써요.',
    },
  ],
}

export default topic
