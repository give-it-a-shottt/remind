import type { Topic } from '../../types'

const topic: Topic = {
  id: 'dbd-10-index-btree',
  track: 'backend',
  group: 'DB 설계',
  title: '6장 ①. 성능을 결정하는 요소와 B-tree 인덱스 설계',
  order: 110,
  sections: [
    {
      title: '데이터베이스 성능을 결정하는 요소',
      points: [
        '성능 지표: 처리량(throughput, 단위 시간당 처리 건수)과 응답 시간(response time, 요청 하나의 처리 시간). 둘은 다른 목표다.',
        'DB 성능의 가장 큰 병목은 대개 I/O(디스크 읽기)다. 그래서 "읽어야 하는 데이터 양을 줄이는 것"이 튜닝의 핵심이고, 그 대표 수단이 인덱스다.',
        '메모리(버퍼 캐시)에 자주 쓰는 데이터와 인덱스가 올라가 있으면 디스크 I/O가 줄어 빨라진다.',
        '성능은 설계 단계(정규화 수준, 키, 인덱스, 파티션)에서 이미 상당 부분 결정된다. 운영 중에 고칠 수 있는 범위는 생각보다 좁다.',
      ],
    },
    {
      title: '인덱스와 B-tree의 구조',
      notionIds: ['3efdf951bf808153863cc0f4367acf3e'],
      points: [
        '인덱스는 "찾아보기"다. 키 값과 그 행의 위치만 정렬해 담아 테이블보다 작고, 정렬돼 있어 빠르게 찾을 수 있다.',
        'B-tree(Balanced tree): 루트 → 브랜치 → 리프로 내려가며 값을 찾는다. 모든 리프의 깊이가 같아(균형) 데이터가 많아도 탐색 단계가 거의 늘지 않는다(로그 시간). 수억 건이어도 3~4단계면 도달한다.',
        'B-tree는 등호(=), 범위(>, <, BETWEEN), 정렬(ORDER BY), 앞부분 일치(LIKE \'abc%\')에 모두 쓸 수 있는 범용 인덱스라 대부분 DB의 기본값이다.',
        '클러스터형 인덱스(MySQL InnoDB의 기본키): 테이블 데이터 자체가 기본키 순서로 정렬돼 저장된다. 테이블당 하나. 보조(세컨더리) 인덱스: 별도 구조에 키 값 + 기본키(또는 행 위치)를 저장하고 여러 개 만들 수 있다.',
        '보조 인덱스로 찾은 뒤 실제 행을 읽으러 다시 가는 단계가 있다. 필요한 컬럼이 모두 인덱스 안에 있으면 테이블을 읽지 않아도 되는데, 이를 커버링 인덱스라 한다.',
      ],
      code: `SHOW INDEX FROM users;                         -- Key_name, Non_unique, Cardinality
CREATE INDEX idx_users_name ON users (name);
ALTER TABLE users ADD INDEX idx_users_city_age (city, age);
ALTER TABLE users DROP INDEX idx_users_name;`,
    },
    {
      title: '인덱스 설계 방침',
      points: [
        '어디에 만드나: WHERE 조건, JOIN 조건(외래키 컬럼), ORDER BY·GROUP BY에 자주 쓰이는 컬럼.',
        '카디널리티(서로 다른 값의 개수)가 높은 컬럼일수록 효과적이다. 성별(2가지)처럼 낮은 컬럼은 인덱스로 거의 좁혀지지 않는다.',
        '선택도: 조건으로 걸러지는 비율이 작을수록(예: 전체의 몇 % 이하) 인덱스가 유리하다. 대부분의 행을 읽어야 하면 차라리 전체 스캔이 빠를 수 있다.',
        '작은 테이블(수백~수천 행)은 인덱스 효과가 미미하다. 큰 테이블, 자주 실행되는 쿼리부터 설계한다.',
        '비용: 인덱스는 저장 공간을 쓰고, INSERT·UPDATE·DELETE 때마다 갱신돼 쓰기를 느리게 한다. 쓰이지 않는 인덱스는 지운다.',
      ],
    },
    {
      title: '복합 인덱스와 인덱스를 못 쓰는 경우',
      points: [
        '복합 인덱스 (A, B)는 A로 먼저 정렬하고, 같은 A 안에서 B로 정렬한 것이다. 조건에 A가 있어야 쓸 수 있다(왼쪽 접두어 규칙). (A, B)는 A 단독, A+B 조건에 쓰이고 B 단독에는 쓰기 어렵다.',
        '컬럼 순서 원칙: 등호(=) 조건 컬럼을 앞에, 범위 조건 컬럼을 뒤에. (status, created_at)은 WHERE status = \'paid\' AND created_at >= ... 에 잘 맞는다.',
        '인덱스를 못 쓰는 대표 패턴: 컬럼에 연산·함수 적용(WHERE price * 1.1 > 100, YEAR(created_at) = 2026), 앞에 %가 붙은 LIKE(\'%abc\'), 암묵적 형변환(문자열 컬럼에 숫자 비교 WHERE phone = 01012345678), 부정 조건(<>, NOT IN)은 효과가 작음, OR로 다른 컬럼을 섞기.',
        '해결의 원칙: 인덱스 컬럼은 가공하지 말고, 비교하는 값 쪽을 가공한다. WHERE created_at >= \'2026-01-01\' AND created_at < \'2027-01-01\'.',
      ],
      code: `-- 인덱스 (status, created_at)
SELECT * FROM orders
WHERE status = 'paid'                         -- 등호 (앞)
  AND created_at >= '2026-10-01'              -- 범위 (뒤)
ORDER BY created_at;

-- 못 씀: 함수 적용 / 앞 % / 형변환
WHERE DATE(created_at) = '2026-10-20'
WHERE name LIKE '%kim'
WHERE phone = 01012345678                     -- phone 은 VARCHAR`,
    },
  ],
  questions: [
    {
      id: 'dbd-10-01', type: 'mcq', source: '데이터베이스 성능을 결정하는 요소',
      question: 'DB 성능 튜닝에서 가장 먼저 줄이려는 비용은 일반적으로 무엇인가?',
      choices: ['CPU 클럭', '네트워크 케이블 길이', 'SQL 문장 길이', '디스크 I/O(읽어야 하는 데이터 양)'],
      answer: 3,
      choiceExplanations: [
        'CPU도 중요하지만 대부분의 DB 병목은 I/O예요.',
        '관계없어요.',
        '문장 길이는 성능과 거의 무관해요.',
        '정답. 읽는 블록 수를 줄이는 게 핵심이고, 인덱스가 대표 수단이에요.',
      ],
      explanation: '"얼마나 적게 읽느냐"가 DB 튜닝의 본질이에요. 인덱스(필요한 곳만 찾아 읽기), 파티션(필요한 구간만), 캐시(디스크 대신 메모리), 필요한 컬럼만 SELECT 모두 같은 목표예요.',
    },
    {
      id: 'dbd-10-02', type: 'mcq', source: '인덱스와 B-tree의 구조',
      question: 'B-tree 인덱스가 데이터가 수억 건이어도 빠르게 찾을 수 있는 이유는?',
      choices: ['모든 데이터를 메모리에 올려서', '해시 함수로 바로 위치를 계산해서', '균형 잡힌 트리라 루트에서 리프까지 단계 수가 데이터 양에 비해 아주 천천히(로그) 늘어나서', '데이터를 압축해서'],
      answer: 2,
      choiceExplanations: [
        '메모리에 없는 부분도 있어요.',
        '그건 해시 인덱스예요(등호에만 강하고 범위 검색 불가).',
        '정답. 한 노드에 수백 개 키가 들어가 3~4단계면 수억 건에 도달해요.',
        '압축이 핵심이 아니에요.',
      ],
      explanation: 'B-tree의 강점은 "균형 + 정렬"이에요. 균형이라 최악의 경우에도 빠르고, 정렬돼 있어 범위·정렬·앞부분 일치까지 처리해요. 그래서 MySQL·PostgreSQL의 기본 인덱스예요.',
    },
    {
      id: 'dbd-10-03', type: 'short', source: '인덱스와 B-tree의 구조',
      question: 'MySQL InnoDB에서 테이블 데이터 자체가 기본키 순서로 정렬되어 저장되는 인덱스를 무엇이라 하나요? (___형 인덱스)',
      answer: ['클러스터', '클러스터형', '클러스터드', 'clustered', '클러스터 인덱스', '클러스터형 인덱스'],
      explanation: '클러스터형(clustered) 인덱스예요. 노션 노트 표현으로 "영어사전처럼 데이터 자체가 정렬". 테이블당 하나이고, 보조 인덱스는 "책 뒤의 찾아보기"처럼 별도로 여러 개 만들 수 있어요. InnoDB 보조 인덱스는 리프에 기본키 값을 가지고 있어, 기본키가 길면 모든 보조 인덱스가 커져요.',
    },
    {
      id: 'dbd-10-04', type: 'mcq', source: '인덱스 설계 방침',
      question: '100만 명 회원 테이블에서 인덱스 효과가 가장 작은 컬럼은?',
      choices: ['gender (값 2~3가지)', 'email (모두 다름)', 'phone (거의 다름)', 'nickname (대부분 다름)'],
      answer: 0,
      choiceExplanations: [
        '정답. 조건으로 걸러도 절반이 남아 인덱스로 좁히는 효과가 거의 없어요.',
        '카디널리티가 매우 높아 인덱스가 효과적이에요.',
        '카디널리티가 높아요.',
        '카디널리티가 높아요.',
      ],
      explanation: '카디널리티가 낮은 컬럼 단독 인덱스는 대부분 쓸모가 없어요. 대신 (gender, birth_year)처럼 다른 컬럼과 조합하거나, 특정 값의 비율이 매우 작을 때(예: status = \'banned\'가 0.1%)만 효과가 있어요.',
    },
    {
      id: 'dbd-10-05', type: 'ox', source: '인덱스 설계 방침',
      question: '인덱스를 많이 만들수록 INSERT·UPDATE·DELETE도 함께 빨라진다.',
      answer: false,
      explanation: '반대예요. 쓰기마다 모든 관련 인덱스를 갱신해야 해서 인덱스가 많을수록 쓰기가 느려지고 저장 공간도 늘어나요. 조회 패턴을 보고 필요한 인덱스만, 쓰이지 않는 인덱스는 정리해요.',
    },
    {
      id: 'dbd-10-06', type: 'mcq', source: '복합 인덱스와 인덱스를 못 쓰는 경우',
      question: '인덱스 (last_name, first_name)이 있다. 인덱스를 효과적으로 쓰기 어려운 조건은?',
      choices: ["WHERE last_name = 'Kim'", "WHERE last_name = 'Kim' AND first_name = 'Minsu'", "WHERE first_name = 'Minsu'", "WHERE last_name = 'Kim' ORDER BY first_name"],
      answer: 2,
      choiceExplanations: [
        '첫 번째 컬럼 조건이라 잘 써요.',
        '두 컬럼 모두 써서 가장 효율적이에요.',
        '정답. 첫 번째 컬럼 없이 두 번째만으로는 정렬 순서를 탈 수 없어요(왼쪽 접두어 규칙).',
        'last_name으로 좁힌 뒤 first_name이 이미 정렬돼 있어 정렬까지 인덱스로 처리돼요.',
      ],
      explanation: '전화번호부(성, 이름 순)에서 "이름이 민수인 사람"을 찾으려면 처음부터 끝까지 봐야 하는 것과 같아요. 자주 쓰는 조건 조합을 보고 컬럼 순서를 정해요.',
    },
    {
      id: 'dbd-10-07', type: 'mcq', source: '복합 인덱스와 인덱스를 못 쓰는 경우',
      question: "WHERE status = 'paid' AND created_at >= '2026-10-01' 쿼리에 가장 알맞은 복합 인덱스는?",
      choices: ['(created_at, status)', '(status, created_at)', '(status) 하나와 (created_at) 하나 각각', '(id)'],
      answer: 1,
      choiceExplanations: [
        '범위 컬럼이 앞에 있으면 그 뒤의 컬럼(status)은 범위 안에서 정렬돼 있지 않아 효율이 떨어져요.',
        '정답. 등호 컬럼을 앞에, 범위 컬럼을 뒤에. status=paid 구간 안에서 created_at이 정렬돼 있어 범위를 바로 잘라 내요.',
        '둘 중 하나만 쓰이거나 합치는 비용이 들어 복합 인덱스보다 비효율적인 경우가 많아요.',
        '조건과 무관해요.',
      ],
      explanation: '복합 인덱스 설계 원칙: "= 조건 → 범위 조건 → 정렬" 순서. 실행 계획(EXPLAIN)으로 실제로 쓰이는지 꼭 확인하세요(다음 토픽).',
    },
    {
      id: 'dbd-10-08', type: 'mcq', source: '복합 인덱스와 인덱스를 못 쓰는 경우',
      question: 'phone 컬럼(VARCHAR)에 인덱스가 있는데 WHERE phone = 01012345678 (따옴표 없음) 쿼리가 느리다. 원인은?',
      choices: ['숫자와 비교하느라 모든 행의 phone을 숫자로 변환하는 암묵적 형변환이 일어나 인덱스를 못 쓴다', '인덱스가 손상돼서', '전화번호가 너무 길어서', 'LIKE를 안 써서'],
      answer: 0,
      choiceExplanations: [
        "정답. WHERE phone = '01012345678'처럼 컬럼과 같은 타입으로 비교해야 해요. (게다가 숫자로 바꾸면 앞자리 0도 사라져요.)",
        '인덱스는 정상이에요.',
        '길이는 문제가 아니에요.',
        '정확히 일치 검색에는 = 이 맞아요.',
      ],
      explanation: '인덱스를 못 쓰는 숨은 원인 1위가 암묵적 형변환이에요. ORM은 보통 타입을 맞춰 주지만, 원본 SQL이나 잘못된 타입 선언(전화번호를 int로 받기)에서 자주 생겨요.',
    },
    {
      id: 'dbd-10-09', type: 'short', source: '인덱스와 B-tree의 구조',
      question: '쿼리에 필요한 모든 컬럼이 인덱스 안에 있어서 테이블(실제 행)을 읽지 않고 인덱스만으로 결과를 내는 경우를 무엇이라 하나요? (___ 인덱스)',
      answer: ['커버링', '커버링인덱스', '커버링 인덱스', 'covering', 'covering index'],
      explanation: '커버링 인덱스예요. 예: 인덱스 (user_id, created_at)가 있을 때 SELECT created_at FROM orders WHERE user_id = 3 은 테이블을 읽지 않아요. SELECT *를 피하고 필요한 컬럼만 고르면 커버링이 될 가능성이 높아져요.',
    },
    {
      id: 'dbd-10-10', type: 'mcq', source: '인덱스 설계 방침',
      question: '인덱스를 우선적으로 고려해야 하는 컬럼이 아닌 것은?',
      choices: ['자주 쓰이는 WHERE 조건 컬럼', '거의 조회하지 않는 긴 메모(TEXT) 컬럼', 'JOIN에 쓰이는 외래키 컬럼', '정렬(ORDER BY)에 자주 쓰이는 컬럼'],
      answer: 1,
      choiceExplanations: [
        '대표적인 인덱스 대상이에요.',
        '정답(대상 아님). 조회 조건에 쓰이지 않고 크기만 커요. 본문 검색이 필요하면 전문 검색 인덱스를 따로 고려해요.',
        'JOIN 성능과 부모 행 삭제 시 FK 검사에 필요해요(MySQL은 FK에 인덱스를 자동 생성).',
        '정렬 비용을 없애 줘요.',
      ],
      explanation: '인덱스 후보 찾기: 느린 쿼리 로그에서 자주 나오는 WHERE·JOIN·ORDER BY 컬럼을 모으고, 카디널리티와 선택도를 따져 우선순위를 정해요.',
    },
    {
      id: 'dbd-10-11', type: 'ox', source: '인덱스 설계 방침',
      question: '조건에 맞는 행이 테이블의 대부분(예: 70%)이라면, 인덱스를 쓰는 것보다 테이블 전체를 읽는 것이 더 빠를 수 있다.',
      answer: true,
      explanation: '맞아요. 인덱스로 찾은 뒤 행마다 테이블을 다시 읽는 비용(랜덤 I/O)이 쌓이면, 처음부터 순서대로 전부 읽는 것(순차 I/O)보다 느려져요. 옵티마이저는 통계 정보로 이걸 판단해 일부러 인덱스를 안 쓰기도 해요(다음 토픽).',
    },
    {
      id: 'dbd-10-12', type: 'mcq', source: '복합 인덱스와 인덱스를 못 쓰는 경우',
      question: 'name에 인덱스가 있다. 인덱스를 활용할 수 있는 조건은?',
      choices: ["WHERE name LIKE '%민수'", "WHERE UPPER(name) = 'KIM'", "WHERE name LIKE '%민%'", "WHERE name LIKE '김%'"],
      answer: 3,
      choiceExplanations: [
        '앞부분이 정해지지 않아 정렬 순서를 탈 수 없어요.',
        '컬럼에 함수를 씌워 인덱스를 못 써요(함수 기반 인덱스를 따로 만들면 가능).',
        '중간 포함 검색이라 인덱스를 못 써요.',
        '정답. 앞부분 일치는 "김"으로 시작하는 범위로 바꿔 인덱스를 써요.',
      ],
      explanation: 'B-tree는 앞에서부터 정렬된 구조라 "앞부분이 정해진" 검색만 빠르게 해요. 중간·뒤 검색이 중요하면 전문 검색 인덱스나 n-gram/trigram 인덱스를 고려해요(SQLAlchemy 검색 토픽 복습).',
    },
  ],
}

export default topic
