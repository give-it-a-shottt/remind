import type { Topic } from '../../types'

const topic: Topic = {
  id: 'pj-55-rebuild-connect-db',
  track: 'project',
  group: '다시 만들기',
  title: '07-9~10. Maestro 프론트 연결 · Accio 백엔드 + Supabase',
  order: 55,
  notionId: '3fadf951bf8081f78fefc355887d3412',
  addedAt: '2026-10-15',
  sections: [
    {
      title: '07-9 Maestro 프론트 연결',
      notionIds: ['3fadf951bf808165bc26ff59c4270d4c'],
      points: [
        '순서: 주소(routes) → 타입 → API → 스토어 → format → MobileFrame·frameLayer → components → 화면 5개 → MaestroApp',
        '07-8 백엔드를 켜 둔 채로 만들어야 화면에서 바로 확인 가능',
        '로컬은 환경변수가 없어 http://localhost:8001 을 부름 → 그래서 07-8 을 8001 로 띄움',
        '백엔드 CORS 기본값이 http://localhost:5173 이라 로컬에선 설정할 게 없음',
        '스토어 패턴은 useHashRoute 와 같음: 모듈 변수(값) + 구독자 Set + useSyncExternalStore, state 는 항상 새 객체',
        '두 터미널: uv run fastapi dev app/main.py --port 8001 / npm run dev',
        '확인: 휴대폰 틀 홈, 지휘 시작 → 악보, 상황 타일 → 주소에 &s=rain + 뒤로가기로 닫힘, 새로고침해도 악보 유지, 백엔드를 끄면 "서버에 연결하지 못했어요"',
        '백엔드를 켰는데도 연결 실패: 백엔드가 8001 인지, 프론트가 5174 같은 다른 포트로 떠서 CORS 에 막혔는지 → .env CORS_ORIGINS 에 그 주소 추가',
      ],
    },
    {
      title: '07-10 Accio 백엔드 만들기',
      notionIds: ['3fadf951bf8081f78fefc355887d3412'],
      points: [
        'DB 연결까지만 된 뼈대 — API 는 헬스체크 2개, 테이블·모델 없음, 파이썬 전부 127줄',
        'uv add "fastapi[standard]" pydantic-settings "sqlalchemy[asyncio]" asyncpg',
        'sqlalchemy[asyncio]: async/await 로 쓰는 비동기 엔진, asyncpg: 실제로 DB 와 대화하는 비동기 Postgres 드라이버',
        'pool_pre_ping: 잠들었다 깨는 무료 DB 에서 "끊긴 연결" 오류를 줄임',
        '로컬 DB: docker compose up -d (pgvector/pgvector:pg17), DATABASE_URL=postgresql+asyncpg://accio:accio@localhost:5432/accio',
        'Accio 는 fastapi dev 기본 포트 8000 (Maestro 는 8001)',
        '실패 모양 ①: DATABASE_URL 이 없으면 import 단계에서 Field required — 서버가 아예 안 켜짐 (.env 가 있는 폴더에서 실행했는지)',
        '실패 모양 ②: 주소는 있는데 DB 에 못 닿으면 /health 200, /health/db 503, pytest "1 failed, 1 passed"',
      ],
    },
    {
      title: '07-10 Supabase 연결',
      code: `postgresql+asyncpg://postgres.<프로젝트 ref>:<DB 비밀번호>@<pooler 호스트>:5432/postgres`,
      points: [
        'New project → 지역 Northeast Asia(Seoul) 권장, DB 비밀번호는 다시 볼 수 없으니 적어 두기',
        'Connect → Session pooler 주소 복사 → 맨 앞 postgresql:// 를 postgresql+asyncpg:// 로',
        'Direct connection(db.<ref>.supabase.co)은 기본 IPv6 전용 → Render 처럼 IPv6 로 못 나가는 서버에선 연결 불가',
        'Session pooler(5432)는 모든 플랜에서 IPv4, 사용자 이름이 postgres.<ref> 로 바뀜',
        'Transaction pooler(6543)는 prepared statement 불가 — asyncpg 는 기본으로 쓰므로 statement_cache_size=0 이 필요',
        '비밀번호에 @ : / 같은 기호가 있으면 주소가 깨짐 → 퍼센트 인코딩(@ → %40) 또는 기호 없는 비밀번호',
        '무료 프로젝트는 1주일 미사용 시 일시정지 → 07-11 Actions 로 사흘마다 깨움',
      ],
    },
  ],
  questions: [
    { id: 'pj-55-01', type: 'mcq', source: '07-9 Maestro 프론트 연결', question: '07-9 를 만들 때 07-8 백엔드를 켜 두는 이유는?', choices: ['필수 아님', '빌드에 필요', '화면을 만들면서 지휘 시작 등을 바로 확인하려고', '타입 생성'], answer: 2, explanation: '로컬 기본 주소가 localhost:8001 이에요.' },
    { id: 'pj-55-02', type: 'mcq', source: '07-9 Maestro 프론트 연결', question: '로컬에서 CORS 를 따로 설정하지 않아도 되는 이유는?', choices: ['프록시 사용', 'Vite 가 처리', '로컬은 CORS 없음', '백엔드 CORS_ORIGINS 기본값이 http://localhost:5173 이라서'], answer: 3, explanation: '프론트가 다른 포트로 뜨면 추가해야 해요.' },
    { id: 'pj-55-03', type: 'mcq', source: '07-9 Maestro 프론트 연결', question: '백엔드를 켰는데도 "서버에 연결하지 못했어요"가 뜨고 프론트가 5174 포트라면?', choices: ['5174 Origin 이 CORS 에 없어 막힘 → .env CORS_ORIGINS 에 추가', 'Vercel 문제', '캐시 삭제', '백엔드 재설치'], answer: 0, explanation: '5173 이 사용 중이면 Vite 가 다음 포트로 떠요.' },
    { id: 'pj-55-04', type: 'mcq', source: '07-9 Maestro 프론트 연결', question: 'Maestro 스토어와 useHashRoute 가 공유하는 패턴은?', choices: ['Context + Reducer', '외부 값 + 구독 + useSyncExternalStore', 'Redux', 'useEffect 폴링'], answer: 1, explanation: '값이 React 밖에 있다는 점이 같아요.' },
    { id: 'pj-55-05', type: 'mcq', source: '07-10 Accio 백엔드 만들기', question: 'asyncpg 의 역할은?', choices: ['커넥션 풀러', 'ORM', 'Postgres 와 실제로 대화하는 비동기 드라이버', '마이그레이션'], answer: 2, explanation: 'SQLAlchemy 가 그 위에서 엔진·세션을 제공해요.' },
    { id: 'pj-55-06', type: 'mcq', source: '07-10 Accio 백엔드 만들기', question: 'Accio 서버를 켜자마자 "Field required" 오류가 나면?', choices: ['포트 충돌', 'CORS', 'DB 꺼짐', 'DATABASE_URL 이 없음 — .env 위치 확인'], answer: 3, explanation: 'database_url 은 기본값이 없는 필수 필드예요.' },
    { id: 'pj-55-07', type: 'mcq', source: '07-10 Accio 백엔드 만들기', question: 'DATABASE_URL 은 있는데 Docker 가 꺼져 있으면 pytest 결과는?', choices: ['1 failed, 1 passed (readiness 만 실패)', '서버가 안 켜짐', '0 passed', '2 passed'], answer: 0, explanation: '/health 는 DB 를 안 건드려요.' },
    { id: 'pj-55-08', type: 'mcq', source: '07-10 Supabase 연결', question: 'Render 에서 Supabase Direct connection 주소가 안 되는 이유는?', choices: ['비밀번호', 'Direct connection 은 기본 IPv6 전용이고 Render 는 IPv6 로 나가지 못해서', '포트', '요금'], answer: 1, explanation: 'Session pooler 는 IPv4 로 열려 있어요.' },
    { id: 'pj-55-09', type: 'mcq', source: '07-10 Supabase 연결', question: 'Session pooler 주소를 SQLAlchemy 에 쓰려면 바꿀 부분은?', choices: ['사용자 이름', '포트', '맨 앞 postgresql:// → postgresql+asyncpg://', '호스트'], answer: 2, explanation: '드라이버를 주소에 명시해요.' },
    { id: 'pj-55-10', type: 'mcq', source: '07-10 Supabase 연결', question: 'Transaction pooler(6543)를 지금 db.py 그대로 쓰면 안 되는 이유는?', choices: ['prepared statement 를 못 쓰는데 asyncpg 는 기본으로 써서 (statement_cache_size=0 필요)', 'IPv6', '유료', '느려서'], answer: 0, explanation: '트랜잭션마다 다른 연결이라 서버측 준비 문장이 유지되지 않아요.' },
    { id: 'pj-55-11', type: 'mcq', source: '07-10 Supabase 연결', question: 'DB 비밀번호에 @ 가 있으면?', choices: ['문제없음', '주소의 구분자와 겹쳐 깨짐 → %40 으로 인코딩', '자동 처리', '로그인 거부'], answer: 1, explanation: ': / 도 마찬가지예요.' },
  ],
}

export default topic
