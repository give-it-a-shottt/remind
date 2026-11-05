import type { Topic } from '../../types'

const topic: Topic = {
  id: 'fs-02-3-docker-postgres',
  track: 'fullstack',
  group: '02. 개발 환경과 데이터베이스',
  title: '2-3. Docker로 PostgreSQL 띄우기',
  order: 203,
  notionId: '3ffdf951bf808016b031c20deb94ec60',
  addedAt: '2026-11-06',
  sections: [
    {
      title: '왜 Docker로 띄울까',
      slides: [
        {
          title: '설치 대신 상자째로',
          blocks: [
            { type: 'say', text: 'PostgreSQL을 컴퓨터에 직접 설치할 수도 있어요. 그런데 버전이 꼬이거나, 지우기 어렵거나, 팀원마다 설정이 달라지는 일이 많아요.\n\n**Docker**는 프로그램을 **필요한 것까지 통째로 담은 상자**로 실행해요. 내 컴퓨터를 더럽히지 않고, 누구 컴퓨터에서든 똑같이 돌아가요.' },
            {
              type: 'table',
              head: ['용어', '뜻', '비유'],
              rows: [
                ['**이미지**', '프로그램 + 실행 환경을 담은 **설계도** (읽기 전용)', '붕어빵 틀, 설치 CD'],
                ['**컨테이너**', '이미지로 실행한 **실제 프로그램 하나**', '틀로 찍은 붕어빵'],
                ['**볼륨**', '컨테이너가 지워져도 남는 **저장 공간**', '외장 하드'],
              ],
            },
          ],
        },
        {
          title: '컨테이너를 지우면 데이터는?',
          blocks: [
            { type: 'ask', q: '볼륨 없이 Postgres 컨테이너를 띄워 강의를 저장하고, 컨테이너를 지웠다 다시 만들면 데이터는 어떻게 될까요?', a: '**사라져요.** 컨테이너 안의 파일은 그 컨테이너와 운명을 같이 해요. 2-2에서 배운 "서버를 끄면 사라지는" 문제를 DB 수준에서 또 만나는 거예요.\n그래서 DB 데이터 폴더를 **볼륨**에 연결해요. 볼륨은 컨테이너 밖에 따로 있어서, 컨테이너를 새로 만들어도 데이터가 남아요.' },
          ],
        },
      ],
    },
    {
      title: 'docker-compose.yml',
      slides: [
        {
          title: '설정을 파일로 적어 두기',
          blocks: [
            { type: 'say', text: '긴 docker 명령을 매번 칠 수는 없으니 **docker-compose.yml** 파일에 적어 두고 한 줄로 띄워요.' },
            {
              type: 'code',
              code: `# mini-inflearn/docker-compose.yml
services:
  db:                                   # 서비스 이름 (이름표)
    image: postgres:17                  # 어떤 이미지로
    environment:
      POSTGRES_PASSWORD: inflearn1234   # postgres 사용자 비밀번호
    ports:
      - "5433:5432"                     # 바깥:안
    volumes:
      - pgdata:/var/lib/postgresql/data # 데이터 폴더를 볼륨에 연결

volumes:
  pgdata:`,
            },
            { type: 'code', code: `docker compose up -d      # 켜기 (-d: 터미널을 붙잡지 않고 뒤에서)
docker compose ps         # 떠 있는지 확인
docker compose down       # 끄기 (볼륨은 남음)` },
          ],
        },
        {
          title: '포트는 바깥:안',
          blocks: [
            { type: 'say', text: '`"5433:5432"`가 헷갈리는 부분이에요. **왼쪽이 바깥(내 노트북), 오른쪽이 안(컨테이너)** 이에요.' },
            {
              type: 'code',
              code: `내 노트북의 프로그램 (FastAPI)
  ↓ localhost:5433 으로 접속
Docker가 문을 연결
  ↓
컨테이너 안 Postgres (5432에서 기다림)`,
            },
            { type: 'ask', q: '바깥 포트를 왜 기본값 5432가 아니라 5433으로 했을까요?', a: '내 노트북에 이미 Postgres가 직접 설치돼 있으면 **5432는 이미 쓰는 중**일 수 있어요. 같은 포트를 둘이 쓸 수는 없으니, 바깥쪽만 5433으로 바꿔서 충돌을 피한 거예요. 컨테이너 **안**은 그대로 5432예요.' },
          ],
        },
      ],
    },
    {
      title: 'psql로 들어가 보기',
      slides: [
        {
          title: '컨테이너 안에서 DB에 접속',
          blocks: [
            { type: 'code', code: `docker compose exec db psql -U postgres
# postgres=#  ← 이 프롬프트가 보이면 DB 안에 들어온 것

\\l          -- DB 목록
\\dt         -- 테이블 목록
\\q          -- 나가기` },
            { type: 'say', text: '`docker compose exec db`는 "**db 컨테이너 안에서** 이 명령을 실행해 줘"라는 뜻이에요. 그래서 `psql`이 컨테이너 안에서 돌아요.' },
            { type: 'ask', q: '이렇게 접속할 때는 비밀번호를 안 물어봐요. 왜일까요?', a: '컨테이너 **안에서** 접속했기 때문이에요. 공식 Postgres 이미지는 컨테이너 내부 접속을 비밀번호 없이 허용해요. 집 안 내선 전화 같은 거죠. 3-1에서 FastAPI가 **밖에서** 접속할 때는 사용자·비밀번호·주소·포트가 전부 필요해요.' },
          ],
        },
        {
          title: '자주 만나는 문제',
          blocks: [
            {
              type: 'table',
              head: ['증상', '원인', '해결'],
              rows: [
                ['`Cannot connect to the Docker daemon`', 'Docker Desktop이 꺼져 있음', 'Docker Desktop 먼저 켜기'],
                ['`port is already allocated`', '바깥 포트를 다른 프로그램이 쓰는 중', '왼쪽 포트를 바꾸기 (5433 → 5434)'],
                ['컨테이너를 다시 만들었더니 데이터가 없음', '볼륨 연결 안 함 / `down -v`로 볼륨까지 지움', 'volumes 설정, `-v` 옵션 주의'],
                ['비밀번호를 바꿨는데 반영 안 됨', '비밀번호는 **처음 볼륨을 만들 때만** 적용됨', '볼륨을 지우고 다시 만들기 (데이터 주의)'],
              ],
            },
            { type: 'note', tone: 'warn', text: '`docker compose down -v`의 `-v`는 **볼륨까지 지워요.** 데이터가 전부 날아가요. 실수로 붙이지 않게 조심하세요.\n\n수업 끝! 확인 문제 가요.' },
          ],
        },
      ],
    },
  ],
  questions: [
    {
      id: 'fs02-3-q1',
      source: '왜 Docker로 띄울까',
      type: 'mcq',
      question: 'Docker에서 이미지와 컨테이너의 관계로 옳은 것은?',
      choices: ['같은 말이다', '이미지는 설계도(틀), 컨테이너는 그걸로 실행한 실제 프로그램', '컨테이너가 이미지를 만든다', '이미지는 저장 공간이다'],
      answer: 1,
      explanation: '붕어빵 틀(이미지)로 붕어빵(컨테이너)을 찍어요. 저장 공간은 볼륨이에요.',
    },
    {
      id: 'fs02-3-q2',
      source: '왜 Docker로 띄울까',
      type: 'ox',
      question: '볼륨 없이 띄운 Postgres 컨테이너를 지우고 다시 만들어도 저장한 데이터는 남는다.',
      answer: false,
      explanation: '컨테이너 안의 파일은 컨테이너와 함께 사라져요. 데이터 폴더를 볼륨에 연결해야 남아요.',
    },
    {
      id: 'fs02-3-q3',
      source: 'docker-compose.yml',
      type: 'mcq',
      question: 'ports: "5433:5432" 에서 내 노트북의 FastAPI가 접속할 포트는?',
      choices: ['5432', '5433', '8000', '3000'],
      answer: 1,
      explanation: '왼쪽이 바깥(노트북), 오른쪽이 안(컨테이너)이에요. 밖에서는 5433으로 두드려요.',
    },
    {
      id: 'fs02-3-q4',
      source: 'docker-compose.yml',
      type: 'short',
      question: 'docker-compose.yml에 적힌 서비스를 뒤에서(터미널을 붙잡지 않고) 켜는 명령은? (docker compose __ -d)',
      answer: ['up', 'docker compose up -d', 'up -d'],
      explanation: 'docker compose up -d로 켜고, ps로 확인하고, down으로 꺼요.',
    },
    {
      id: 'fs02-3-q5',
      source: 'psql로 들어가 보기',
      type: 'mcq',
      question: 'docker compose exec db psql -U postgres 로 접속할 때 비밀번호를 묻지 않는 이유는?',
      choices: ['비밀번호가 없어서', '컨테이너 안에서 접속해서, 공식 이미지가 내부 접속을 비밀번호 없이 허용하기 때문', 'Docker가 해킹돼서', 'psql이 비밀번호를 기억해서'],
      answer: 1,
      explanation: '안에서는 내선 전화처럼 통과해요. 밖(FastAPI)에서 접속할 때는 접속 정보가 전부 필요해요.',
    },
    {
      id: 'fs02-3-q6',
      source: 'psql로 들어가 보기',
      type: 'ox',
      question: 'docker compose down -v 를 실행하면 볼륨까지 지워져 DB 데이터가 사라진다.',
      answer: true,
      explanation: '-v는 볼륨까지 삭제해요. 그냥 down은 컨테이너만 끄고 볼륨은 남겨요.',
    },
  ],
}

export default topic
