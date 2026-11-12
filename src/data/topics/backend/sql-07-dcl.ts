import type { Topic } from '../../types'

const topic: Topic = {
  id: 'sql-07-dcl',
  track: 'backend',
  group: 'SQL',
  title: 'DCL: 사용자와 권한 관리',
  order: 77,
  sections: [
    {
      title: '접속과 사용자 만들기',
      notionIds: ['3efdf951bf80813d8ad4de8af1bdd7f7'],
      slides: [
        {
          title: 'DB의 출입증 만들기',
          blocks: [
            { type: 'say', text: 'SQL 마지막 수업은 **누가 DB에서 무엇을 할 수 있는지** 정하는 DCL이에요. 지금까지 root 같은 관리자 계정으로 다 했다면, 이제는 **용도별 계정**을 만들 차례예요.' },
            { type: 'code', code: `mysql -u app -p          # 비밀번호는 프롬프트로 입력
# mysql -u root -pMyPassword  ← 셸 기록·프로세스 목록에 비밀번호가 남음

CREATE USER 'app'@'%' IDENTIFIED BY 'S3cure-Long-Password!';
CREATE USER 'report'@'10.0.0.%' IDENTIFIED BY '...';   -- 사내망 대역만
ALTER USER 'app'@'%' IDENTIFIED BY '새비밀번호';         -- 비밀번호 변경 (MySQL 8)
DROP USER 'report'@'10.0.0.%';` },
          ],
        },
        {
          title: '이름@호스트가 한 계정',
          blocks: [
            { type: 'say', text: 'MySQL 사용자는 **"이름@호스트"** 조합으로 구분돼요.\n• `\'app\'@\'localhost\'` → **같은 서버에서만** 접속 가능\n• `\'app\'@\'%\'` → **어디서든** 접속 가능\n• 같은 이름이라도 호스트가 다르면 **다른 계정**이에요\n\n그래서 `app@localhost`로 만든 계정으로 **다른 서버(앱 서버)에서** 접속하면 거부돼요.' },
            { type: 'note', tone: 'tip', text: 'PostgreSQL은 사용자와 그룹을 모두 **ROLE**로 다뤄요. `CREATE ROLE app LOGIN PASSWORD \'...\';`' },
          ],
        },
      ],
    },
    {
      title: 'GRANT와 REVOKE',
      notionIds: ['3efdf951bf80813d8ad4de8af1bdd7f7'],
      slides: [
        {
          title: '권한 주고 뺏기',
          blocks: [
            { type: 'code', code: `GRANT SELECT, INSERT, UPDATE, DELETE ON shop.* TO 'app'@'%';
GRANT SELECT ON shop.* TO 'report'@'10.0.0.%';
SHOW GRANTS FOR 'app'@'%';                 -- 확인
REVOKE DELETE ON shop.* FROM 'app'@'%';    -- 회수` },
            { type: 'list', items: ['권한: `ALL PRIVILEGES`, 또는 `SELECT`, `INSERT`, `UPDATE`, `DELETE`, `CREATE`, `ALTER`, `DROP`, `INDEX`…', '대상: `db.table`, `db.*`(DB 전체), `*.*`(모든 DB)', '`WITH GRANT OPTION`을 주면 그 사용자가 **남에게 권한을 나눠 줄** 수 있어요. 꼭 필요할 때만'] },
            { type: 'note', tone: 'tip', text: 'GRANT/REVOKE로 바꾼 권한은 **즉시 반영**돼요. 옛 강의에서 습관처럼 붙이는 `FLUSH PRIVILEGES`는 권한 테이블을 **UPDATE로 직접** 고쳤을 때만 필요해요.' },
          ],
        },
      ],
    },
    {
      title: '최소 권한 원칙',
      notionIds: ['3efdf951bf80813d8ad4de8af1bdd7f7'],
      slides: [
        {
          title: '필요한 만큼만',
          blocks: [
            { type: 'say', text: '보안의 기본 원칙, **최소 권한 원칙**이에요. 각 계정에는 그 일을 하는 데 **필요한 최소한의 권한만** 줘요.\n\n앱 계정이 root나 ALL 권한이면, SQL 인젝션 한 번에 **테이블 삭제, 다른 DB 열람**까지 가능해져요. 앱 계정이 DML만 할 수 있다면 피해는 그 범위에서 멈춰요.' },
            {
              type: 'table',
              head: ['계정', '권한', '언제'],
              rows: [
                ['앱 실행용', '**DML만** (SELECT·INSERT·UPDATE·DELETE)', '항상'],
                ['마이그레이션용', 'DDL 포함 (ALTER 등)', '**배포 때만**'],
                ['분석·리포트용', '**SELECT만**, 가능하면 **읽기 전용 복제본**에', '분석할 때'],
                ['관리자용', '전부', '**사람만**, 평소엔 안 씀'],
              ],
            },
          ],
        },
        {
          title: '사람별 계정과 뷰로 가리기',
          blocks: [
            { type: 'say', text: '분석 담당자가 운영 DB에서 무거운 집계를 돌려 서비스가 느려졌다면? 권한을 SELECT로 줄이고, **읽기 전용 복제본**으로 보내요. 운영 DB는 서비스만 받게요.\n\n계정을 **사람마다 따로** 만들면 "누가 무엇을 했는지" 감사 기록을 남기기 쉬워요. 퇴사자 계정은 바로 삭제해요.' },
            { type: 'code', code: `CREATE VIEW customer_safe AS
  SELECT id, name, email FROM customers;          -- 주민번호·카드번호 컬럼은 빼고

GRANT SELECT ON shop.customer_safe TO 'cs_tool'@'%';   -- 원본 테이블 권한은 안 줌` },
            { type: 'say', text: '상담 도구가 고객 이름은 보되 **주민번호는 못 보게** 하려면, 민감한 컬럼을 뺀 **뷰(VIEW)** 를 만들고 그 뷰에만 SELECT 권한을 줘요.' },
          ],
        },
      ],
    },
    {
      title: '네트워크와 비밀 관리',
      slides: [
        {
          title: 'DB 문은 아무에게나 열지 않아요',
          blocks: [
            { type: 'list', items: ['**DB 포트(3306, 5432)를 인터넷 전체에 열지 않아요.** 보안 그룹에서 `0.0.0.0/0`으로 열면 전 세계 봇이 비밀번호를 무작위로 대입해요. 앱 서버나 사내망 IP만 허용', '**전송 구간 암호화(TLS/SSL)** 를 켜서 네트워크 도청을 막아요', '클라우드 관리형 DB(RDS, Cloud SQL, Supabase)는 root 대신 **마스터 계정**을 주고, 콘솔에서 네트워크 접근을 설정해요'] },
          ],
        },
        {
          title: '비밀번호는 코드 밖에',
          blocks: [
            { type: 'say', text: '접속 정보(DB URL, 비밀번호)는 코드가 아니라 **환경 변수**나 **비밀 관리 서비스**에 둬요.' },
            { type: 'note', tone: 'warn', text: '`.env`를 실수로 GitHub에 올렸다면, 지우는 커밋만으로는 **부족해요.** git 기록에 그대로 남아 있고, 공개 저장소는 봇이 몇 분 안에 긁어 가요. **비밀번호를 즉시 교체**하는 게 먼저예요. 그리고 `.gitignore`에 `.env`를 넣어요.' },
          ],
        },
      ],
    },
  ],
  questions: [
    {
      id: 'sql-07-01', type: 'mcq', source: '접속과 사용자 만들기',
      question: "CREATE USER 'app'@'localhost' 로 만든 계정으로 다른 서버(앱 서버)에서 접속하면?",
      choices: ['정상 접속된다', "접속이 거부된다. 'localhost'는 DB 서버 자신에서의 접속만 허용한다", '읽기만 가능하다', '자동으로 %로 바뀐다'],
      answer: 1,
      choiceExplanations: [
        '호스트 부분이 접속 위치를 제한해요.',
        "정답. 원격 접속을 허용하려면 'app'@'%' 또는 'app'@'앱서버IP'로 만들어야 해요.",
        '권한이 아니라 접속 자체가 막혀요.',
        '자동 변환은 없어요.',
      ],
      explanation: "MySQL 계정 = 사용자명 + 접속 호스트. 'app'@'localhost'와 'app'@'%'는 서로 다른 계정이고 권한도 따로예요. 보안상 '%'보다는 앱 서버 IP나 사내 대역('10.0.0.%')처럼 좁히는 게 좋아요.",
    },
    {
      id: 'sql-07-02', type: 'ox', source: '접속과 사용자 만들기',
      question: 'mysql -u root -pMyPassword 처럼 비밀번호를 명령줄에 직접 쓰는 것은 셸 기록과 프로세스 목록에 남을 수 있어 권장되지 않는다.',
      answer: true,
      explanation: '맞아요. -p만 쓰고 프롬프트에서 입력하거나, 권한이 제한된 설정 파일(~/.my.cnf)이나 환경 변수를 써요. MySQL도 이 경우 "Using a password on the command line interface can be insecure" 경고를 출력해요.',
    },
    {
      id: 'sql-07-03', type: 'mcq', source: 'GRANT와 REVOKE',
      question: '웹 앱이 쓰는 DB 계정에 가장 알맞은 권한은?',
      choices: ['GRANT ALL PRIVILEGES ON *.* TO app', 'GRANT SELECT ON *.* TO app', 'root 계정을 그대로 쓴다', 'GRANT SELECT, INSERT, UPDATE, DELETE ON shop.* TO app'],
      answer: 3,
      choiceExplanations: [
        '모든 DB의 모든 권한이라 사고나 공격 시 피해가 최대가 돼요.',
        '쓰기를 못 해서 앱이 동작하지 않고, 다른 DB까지 읽을 수 있어요.',
        '최악의 선택이에요.',
        '정답. 서비스 DB 하나에 데이터 조작 권한만. 테이블 구조 변경(DDL)은 마이그레이션 계정으로 분리해요.',
      ],
      explanation: '노션의 "서비스용 계정에는 ALL보다 필요한 권한만"이 최소 권한 원칙이에요. SQL 인젝션이 생겨도 DROP TABLE이나 다른 DB 열람은 막혀서 피해 범위가 줄어요.',
    },
    {
      id: 'sql-07-04', type: 'short', source: 'GRANT와 REVOKE',
      question: '사용자에게 준 권한을 회수하는 DCL 명령은?',
      answer: ['REVOKE', 'revoke'],
      explanation: 'REVOKE 권한 ON 대상 FROM 사용자; 예요. GRANT는 TO, REVOKE는 FROM을 쓴다는 점도 함께 기억하세요.',
    },
    {
      id: 'sql-07-05', type: 'mcq', source: 'GRANT와 REVOKE',
      question: '어떤 사용자에게 어떤 권한이 있는지 확인하는 MySQL 명령은?',
      choices: ['DESC app;', "SHOW GRANTS FOR 'app'@'%';", 'SELECT * FROM app;', 'SHOW TABLES;'],
      answer: 1,
      choiceExplanations: [
        'DESC는 테이블 구조를 보여 줘요.',
        '정답. 그 계정에 적용된 GRANT 문 목록이 나와요.',
        'app이라는 테이블을 조회해요.',
        '테이블 목록이에요.',
      ],
      explanation: '권한 점검을 주기적으로 해 두면 "언제 준 ALL 권한이 아직 남아 있다" 같은 위험을 찾을 수 있어요.',
    },
    {
      id: 'sql-07-06', type: 'ox', source: 'GRANT와 REVOKE',
      question: 'GRANT나 REVOKE를 실행한 뒤에는 반드시 FLUSH PRIVILEGES를 해야 권한이 반영된다.',
      answer: false,
      explanation: 'GRANT/REVOKE/CREATE USER 같은 명령은 즉시 반영돼요. FLUSH PRIVILEGES는 mysql.user 같은 권한 테이블을 UPDATE로 직접 고쳤을 때 메모리에 다시 읽어 들이는 용도예요. 노션 강의처럼 붙여도 해는 없지만, 왜 필요한지는 구분해 두세요.',
    },
    {
      id: 'sql-07-07', type: 'mcq', source: '최소 권한 원칙',
      question: '분석 담당자가 운영 DB에서 무거운 집계 쿼리를 돌려 서비스가 느려졌다. 권한·구성 측면의 개선으로 가장 알맞은 것은?',
      choices: ['분석 담당자에게 ALL 권한을 준다', '분석을 금지한다', '운영 DB의 인덱스를 모두 지운다', '분석용 계정에 SELECT만 주고, 읽기 전용 복제본(replica)에 접속하게 한다'],
      answer: 3,
      choiceExplanations: [
        '문제를 키워요.',
        '업무가 막혀요.',
        '모든 쿼리가 더 느려져요.',
        '정답. 쓰기 위험을 없애고(SELECT만), 부하는 복제본으로 분리해 운영 DB를 보호해요.',
      ],
      explanation: '역할별 계정 분리 + 읽기 복제본 활용은 실무의 기본 구성이에요(DB 복제 토픽). 복제본은 약간의 지연이 있을 수 있어 "방금 쓴 데이터"를 바로 읽어야 하는 앱 요청에는 맞지 않아요.',
    },
    {
      id: 'sql-07-08', type: 'mcq', source: '최소 권한 원칙',
      question: '고객 상담 도구가 고객 이름과 주문 내역은 보되 주민번호·카드번호 컬럼은 보지 못하게 하려면?',
      choices: ['상담 도구 화면에서만 숨긴다', '테이블 전체에 SELECT 권한을 준다', '민감 컬럼을 뺀 뷰(VIEW)를 만들고 그 뷰에만 SELECT 권한을 준다', '민감 컬럼을 삭제한다'],
      answer: 2,
      choiceExplanations: [
        '도구 계정으로 직접 SQL을 실행하면 다 보여요.',
        '모든 컬럼이 노출돼요.',
        '정답. DB 차원에서 접근 가능한 컬럼을 제한해요. MySQL은 컬럼 단위 GRANT도 지원해요.',
        '필요한 데이터까지 잃어요.',
      ],
      explanation: '보안은 화면이 아니라 데이터에 가장 가까운 층에서 지키는 게 확실해요. 뷰, 컬럼 권한, PostgreSQL의 행 수준 보안(RLS) 같은 기능이 있어요. Supabase는 RLS를 기본 보안 장치로 써요.',
    },
    {
      id: 'sql-07-09', type: 'short', source: '최소 권한 원칙',
      question: '"각 계정에는 필요한 최소한의 권한만 준다"는 보안 원칙의 이름은? (최소 ____ 원칙)',
      answer: ['권한', '최소권한', '최소 권한', 'least privilege', 'leastprivilege'],
      explanation: '최소 권한 원칙(Principle of Least Privilege)이에요. DB 계정뿐 아니라 서버 접근, 클라우드 권한(IAM), API 키 범위에도 똑같이 적용돼요.',
    },
    {
      id: 'sql-07-10', type: 'mcq', source: '네트워크와 비밀 관리',
      question: '클라우드에 MySQL을 띄우면서 보안 그룹에서 3306 포트를 0.0.0.0/0(전체)으로 열었다. 무엇이 문제인가?',
      choices: ['문제없다. 비밀번호가 있으니까', '속도가 느려진다', '백업이 안 된다', '인터넷의 누구나 DB에 접속을 시도할 수 있어 무차별 대입·취약점 공격 대상이 된다'],
      answer: 3,
      choiceExplanations: [
        '비밀번호는 한 겹의 방어일 뿐이에요. 포트가 열려 있으면 자동화된 스캐너가 계속 시도해요.',
        '성능 문제가 아니에요.',
        '백업과 무관해요.',
        '정답. 앱 서버 IP나 사내망만 허용하고, 사람이 접속할 땐 VPN·배스천 호스트를 거쳐요.',
      ],
      explanation: '방어는 여러 겹으로: 네트워크(방화벽) → 계정(강한 비밀번호, 최소 권한) → 전송(TLS) → 데이터(암호화, 마스킹). 한 겹이 뚫려도 다음 겹이 막도록 설계해요.',
    },
    {
      id: 'sql-07-11', type: 'ox', source: '네트워크와 비밀 관리',
      question: 'DB 비밀번호가 담긴 .env 파일을 실수로 GitHub에 올렸다면, 파일을 지우는 커밋을 하는 것만으로 충분하다.',
      answer: false,
      explanation: 'git 기록에 남아 있어서 누구나 이전 커밋에서 볼 수 있어요. 공개 저장소는 몇 분 안에 자동 수집되기도 해요. 즉시 비밀번호를 교체(회전)하는 게 최우선이고, 기록 정리는 그다음이에요.',
    },
    {
      id: 'sql-07-12', type: 'mcq', source: 'GRANT와 REVOKE',
      question: '배포 때 Alembic 마이그레이션(ALTER TABLE 등)을 실행해야 한다. 계정 구성으로 가장 알맞은 것은?',
      choices: ['앱 계정에 DDL 권한까지 모두 준다', '마이그레이션 전용 계정(DDL 권한)을 따로 두고 배포 과정에서만 쓰고, 앱 실행 계정은 DML만', '마이그레이션은 root로 실행하고 비밀번호를 코드에 쓴다', '마이그레이션을 하지 않는다'],
      answer: 1,
      choiceExplanations: [
        '앱이 탈취되면 테이블 구조까지 바꾸거나 지울 수 있어요.',
        '정답. 권한이 필요한 시점과 주체를 분리해요.',
        'root 사용과 비밀번호 하드코딩 모두 위험해요.',
        '스키마 변경을 관리할 수 없어요.',
      ],
      explanation: '현실에서는 작은 프로젝트라면 계정 하나로 시작하기도 하지만, "앱이 런타임에 DROP TABLE을 할 수 있는가?"라는 질문을 스스로 던져 보는 습관이 중요해요.',
    },
  ],
}

export default topic
