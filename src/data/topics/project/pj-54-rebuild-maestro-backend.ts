import type { Topic } from '../../types'

const topic: Topic = {
  id: 'pj-54-rebuild-maestro-backend',
  track: 'project',
  group: '다시 만들기',
  title: '07-8. Maestro 백엔드 만들기 (FastAPI + uv)',
  order: 54,
  notionId: '3fadf951bf8081e18466c79756a99e3d',
  addedAt: '2026-10-15',
  sections: [
    {
      title: '프로젝트 만들기 (uv)',
      code: `uv init maestro --app --no-package --vcs none --python 3.13
cd maestro && rm main.py
uv add "fastapi[standard]" pydantic-settings
uv add --dev pytest ruff httpx2`,
      points: [
        '먼저 헬스체크만 있는 뼈대로 서버·테스트가 도는지 확인하고, 기능을 한 층씩 올림',
        '--app --no-package: 라이브러리 배포가 아니라 서버로 실행할 앱. --vcs none: 루트에 git 이 이미 있어서',
        'fastapi[standard]: FastAPI + uvicorn + fastapi 명령(dev/run) + httpx',
        '실행하면 .python-version, pyproject.toml, uv.lock, .venv/ 가 생김',
        '버전까지 똑같이: 저장소 pyproject.toml·uv.lock 을 덮어쓰고 uv sync (Render 도 uv sync --frozen 으로 lock 그대로)',
      ],
    },
    {
      title: '폴더 · 환경변수 · 뼈대',
      points: [
        'app/core, app/health, tests 폴더 + 빈 __init__.py — 폴더를 파이썬 패키지로 만들어 from app.core.config import 가 되게',
        '.env.example 은 저장소에 올리고 값을 채운 .env 는 안 올림. CORS_ORIGINS 는 JSON 배열 문자열',
        '뼈대 4개: core/config.py(Settings + lru_cache), core/schemas.py(CamelModel), health/router.py, main.py(health 하나)',
        '첫 테스트 test_liveness_reports_mode → uv run pytest 1 passed, ruff check 통과, /docs 자동 문서',
        '"uv trampoline failed to canonicalize script path": 폴더를 옮긴 뒤 예전 .venv → uv run python -m pytest 또는 .venv 삭제 후 uv sync',
      ],
    },
    {
      title: '기능을 올리는 순서',
      points: [
        '앞 파일을 뒤 파일이 import 하는 순서라 매 단계 서버가 켜진 채로 갈 수 있음',
        '① yumi/models.py ② yumi/client.py(Protocol + 예외) ③ fixtures + mock.py ④ filters.py ⑤ deps.py',
        '⑥ situations.py ⑦ score/schemas → service → router ⑧ regions/router ⑨ places/router',
        '⑩ core/errors.py ⑪ main.py 최종(라우터 4개 + 오류 핸들러) ⑫ yumi/real.py(키를 받은 뒤) ⑬ tests/',
        '인터페이스 먼저, 구현은 둘: 키가 없을 땐 mock, 발표 땐 real — 환경변수 하나만 바꿈',
        '완료 확인: pytest 47 passed, /docs 에 API 9개, POST /api/score 200 + situations 6개, 없는 동네 422 region_not_found',
      ],
    },
  ],
  questions: [
    { id: 'pj-54-01', type: 'mcq', source: '프로젝트 만들기 (uv)', question: 'uv init 의 --vcs none 옵션을 준 이유는?', choices: ['속도', 'CI', 'git 미사용', '루트에 이미 git 저장소가 있어서 하위 폴더에 따로 만들지 않으려고'], answer: 3, explanation: '모노레포 안이라서요.' },
    { id: 'pj-54-02', type: 'mcq', source: '프로젝트 만들기 (uv)', question: '--app --no-package 의 의미는?', choices: ['서버로 실행할 앱이라 패키지 배포 설정을 만들지 않음', '테스트 전용', '웹앱 템플릿', '라이브러리로 배포'], answer: 0, explanation: 'PyPI 배포용 빌드 설정이 필요 없어요.' },
    { id: 'pj-54-03', type: 'mcq', source: '프로젝트 만들기 (uv)', question: 'uv add --dev pytest 로 추가한 패키지는 어디에 들어가나?', choices: ['dependencies', 'dependency-groups 의 dev — Render 는 --no-dev 로 제외', 'optional', '전역'], answer: 1, explanation: '운영 설치에서 빠져요.' },
    { id: 'pj-54-04', type: 'mcq', source: '프로젝트 만들기 (uv)', question: '저장소와 버전까지 똑같이 맞추는 방법은?', choices: ['최신 버전 사용', 'uv add 를 여러 번', 'pyproject.toml·uv.lock 을 받아 덮어쓰고 uv sync', 'pip freeze'], answer: 2, explanation: 'lock 파일이 정확한 버전을 고정해요.' },
    { id: 'pj-54-05', type: 'mcq', source: '폴더 · 환경변수 · 뼈대', question: '빈 __init__.py 파일의 역할은?', choices: ['테스트', '로그', '설정', '폴더를 파이썬 패키지로 만들어 app.core.config 같은 import 가 되게'], answer: 3, explanation: '내용이 없어도 돼요.' },
    { id: 'pj-54-06', type: 'mcq', source: '폴더 · 환경변수 · 뼈대', question: '뼈대 단계에서 먼저 확인하는 것은?', choices: ['헬스체크 하나로 서버·테스트·린트가 도는지 (pytest 1 passed)', '배포', 'DB 연결', '유미 호출'], answer: 0, explanation: '기능을 올리기 전 기반을 확인해요.' },
    { id: 'pj-54-07', type: 'mcq', source: '폴더 · 환경변수 · 뼈대', question: '"uv trampoline failed to canonicalize script path" 오류의 원인은?', choices: ['Python 버전', '폴더를 옮기거나 이름을 바꾼 뒤 예전 .venv 를 쓰고 있어서', '네트워크', '권한'], answer: 1, explanation: '.venv 를 지우고 uv sync, 또는 python -m pytest.' },
    { id: 'pj-54-08', type: 'mcq', source: '기능을 올리는 순서', question: 'models → client → mock → … 순서로 파일을 더하는 이유는?', choices: ['규칙', '알파벳순', '앞 파일을 뒤 파일이 import 해서, 매 단계 서버가 켜진 채로 갈 수 있게', '중요도'], answer: 2, explanation: '의존하는 쪽을 나중에.' },
    { id: 'pj-54-09', type: 'mcq', source: '기능을 올리는 순서', question: 'real.py 를 거의 마지막에 만드는 이유는?', choices: ['테스트 불가', '선택 사항', '어려워서', '키를 받은 뒤에야 필요하고, 그 전까지는 mock 으로 전부 개발·테스트할 수 있어서'], answer: 3, explanation: '"인터페이스 먼저, 구현은 둘".' },
    { id: 'pj-54-10', type: 'mcq', source: '기능을 올리는 순서', question: '07-8 완료 시 pytest 결과는? (2026-10-15 기준)', choices: ['1 passed', '47 passed', '9 passed', '100 passed'], answer: 1, explanation: '테스트 파일 6개 + conftest.' },
  ],
}

export default topic
