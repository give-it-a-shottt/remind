import type { Topic } from '../../types'

const topic: Topic = {
  id: 'dbd-11-statistics-tuning',
  track: 'backend',
  group: 'DB 설계',
  title: '6장 ②. 통계 정보 · 실행 계획 · 인덱스 이외의 튜닝',
  order: 111,
  sections: [
    {
      title: '옵티마이저와 실행 계획',
      points: [
        'SQL은 "무엇을 원하는가"만 말하는 선언형 언어다. "어떻게 가져올지"(어느 인덱스, 어떤 JOIN 순서와 방식)는 DB의 옵티마이저가 정한다. 그 결정이 실행 계획이다.',
        '비용 기반 옵티마이저(CBO)는 가능한 계획들의 비용(예상 I/O, 행 수)을 추정해 가장 싼 것을 고른다. 추정의 재료가 통계 정보다.',
        'EXPLAIN SELECT ... 로 실행 계획을 본다. MySQL: type(ALL=전체 스캔, ref/range/const=인덱스 사용), key(사용 인덱스), rows(예상 행 수), Extra(Using filesort, Using temporary는 비용 신호). PostgreSQL: Seq Scan / Index Scan, cost, rows.',
        'EXPLAIN ANALYZE(PostgreSQL, MySQL 8.0.18+)는 실제로 실행해서 예상 행 수와 실제 행 수를 함께 보여 준다. 둘이 크게 다르면 통계가 틀렸다는 신호다.',
      ],
      code: `EXPLAIN SELECT * FROM orders WHERE user_id = 3 ORDER BY created_at DESC LIMIT 20;
-- type: ref, key: idx_orders_user_created, rows: 37, Extra: Backward index scan

EXPLAIN ANALYZE SELECT ...;   -- 실제 시간과 행 수까지`,
    },
    {
      title: '통계 정보',
      points: [
        '통계 정보: 테이블 행 수, 컬럼의 서로 다른 값 개수(카디널리티), 값 분포(히스토그램), NULL 비율, 인덱스 크기 등.',
        '통계가 실제와 다르면 옵티마이저가 잘못된 계획을 고른다. 예: 10행이라고 알고 있던 테이블이 실제로는 1000만 행이면 전체 스캔이나 비효율적인 JOIN 방식을 선택할 수 있다.',
        '통계 갱신 시점: 대량 INSERT·DELETE·데이터 이전 직후, 데이터 분포가 크게 바뀐 뒤. MySQL: ANALYZE TABLE t; PostgreSQL: ANALYZE t;(autovacuum이 자동으로도 수행).',
        '통계 갱신으로 실행 계획이 갑자기 바뀌어 오히려 느려지는 경우도 있다. 그래서 중요한 시스템은 통계 갱신 시점을 관리하거나, 검증된 통계·계획을 고정하기도 한다(교재의 "통계 정보 고정").',
      ],
    },
    {
      title: '인덱스 이외의 튜닝 방법',
      points: [
        'SQL 개선: 필요한 컬럼만 SELECT, N+1 쿼리를 JOIN·IN 한 번으로, 인덱스를 못 쓰는 조건 고치기, 불필요한 정렬(ORDER BY)·DISTINCT 제거, 페이지네이션을 커서 방식으로.',
        '파티션: 큰 테이블을 날짜 등 기준으로 나눠 저장한다. 조건에 맞는 파티션만 읽고(파티션 프루닝), 오래된 파티션은 통째로 삭제(DROP PARTITION)해 대량 DELETE를 피한다.',
        '캐시: 애플리케이션 캐시(Redis), DB 버퍼 크기 조정(innodb_buffer_pool_size). 자주 읽고 잘 안 바뀌는 데이터에 효과적.',
        '커넥션 풀: 요청마다 연결을 새로 맺는 비용을 없앤다. 풀 크기는 무작정 키우지 말고 DB가 감당할 동시 연결 수에 맞춘다.',
        '배치 처리: 한 건씩 반복 대신 묶어서(bulk insert, 한 번의 UPDATE). 읽기 부하 분리: 읽기 복제본.',
        '하드웨어 증설(스케일 업)·서버 추가(스케일 아웃)는 효과가 확실하지만 비싸다. 설계·SQL 문제는 하드웨어로 가려질 뿐 사라지지 않는다.',
      ],
      code: `-- 월별 파티션 (MySQL)
CREATE TABLE logs (
  id BIGINT NOT NULL, created_at DATETIME NOT NULL, msg TEXT,
  PRIMARY KEY (id, created_at)
)
PARTITION BY RANGE (TO_DAYS(created_at)) (
  PARTITION p202609 VALUES LESS THAN (TO_DAYS('2026-10-01')),
  PARTITION p202610 VALUES LESS THAN (TO_DAYS('2026-11-01'))
);
ALTER TABLE logs DROP PARTITION p202609;   -- 지난달 로그를 순식간에 삭제`,
    },
    {
      title: '튜닝 절차',
      points: [
        '① 측정: 느린 쿼리 로그(slow query log), APM, pg_stat_statements로 "빈도 × 소요 시간"이 큰 쿼리를 찾는다. 한 번에 10초인 쿼리보다 초당 1000번 실행되는 50ms 쿼리가 더 중요할 수 있다.',
        '② 분석: EXPLAIN(ANALYZE)로 전체 스캔, 예상과 실제 행 수 차이, filesort·임시 테이블을 확인한다.',
        '③ 개선: 인덱스·SQL·통계·구조 순으로 영향이 작은 것부터 바꾼다.',
        '④ 검증: 같은 조건으로 다시 측정한다. 한 쿼리가 빨라져도 다른 쿼리(특히 쓰기)가 느려질 수 있으니 전체를 본다.',
        '운영 환경과 비슷한 데이터 양으로 테스트해야 한다. 개발 DB에 100건뿐이면 모든 쿼리가 빨라 보인다.',
      ],
    },
  ],
  questions: [
    {
      id: 'dbd-11-01', type: 'mcq', source: '옵티마이저와 실행 계획',
      question: '같은 SQL인데 데이터가 늘어나자 갑자기 인덱스를 안 쓰고 전체 스캔을 하기 시작했다. 이 결정을 내린 주체는?',
      choices: ['SQL을 작성한 개발자', '운영체제', 'DB의 옵티마이저(통계 정보를 바탕으로 비용을 추정)', '네트워크 장비'],
      answer: 2,
      choiceExplanations: [
        'SQL은 "무엇"만 말하고 "어떻게"는 정하지 않아요.',
        '관계없어요.',
        '정답. 옵티마이저가 통계로 비용을 계산해 계획을 골라요.',
        '관계없어요.',
      ],
      explanation: '실행 계획은 데이터 양·분포·통계에 따라 바뀔 수 있어요. 그래서 "어제는 빨랐는데 오늘은 느린" 쿼리가 생겨요. EXPLAIN으로 실제 계획을 확인하는 습관이 중요해요.',
    },
    {
      id: 'dbd-11-02', type: 'short', source: '옵티마이저와 실행 계획',
      question: '쿼리의 실행 계획을 확인하려고 SQL 앞에 붙이는 키워드는?',
      answer: ['EXPLAIN', 'explain'],
      explanation: 'EXPLAIN이에요. 실제 실행 시간과 행 수까지 보려면 EXPLAIN ANALYZE. SQLAlchemy에서 만든 쿼리는 echo 로그로 SQL을 복사해 DB 도구에서 EXPLAIN을 붙여 보면 돼요.',
    },
    {
      id: 'dbd-11-03', type: 'mcq', source: '옵티마이저와 실행 계획',
      question: 'MySQL EXPLAIN 결과에서 성능 문제를 의심해야 하는 신호는?',
      choices: ['type: ALL 과 rows: 2,000,000', 'type: const', 'key: PRIMARY', 'rows: 1'],
      answer: 0,
      choiceExplanations: [
        '정답. 전체 테이블 스캔(ALL)으로 200만 행을 읽을 거라는 뜻이에요.',
        '기본키·유니크로 한 행을 찾는 가장 좋은 경우예요.',
        '기본키 인덱스를 쓰고 있어요.',
        '한 행만 읽어요.',
      ],
      explanation: 'type 좋은 순서(대략): const > eq_ref > ref > range > index > ALL. Extra의 Using filesort(별도 정렬), Using temporary(임시 테이블)도 큰 데이터에서는 비용 신호예요.',
    },
    {
      id: 'dbd-11-04', type: 'mcq', source: '통계 정보',
      question: '데이터 이전으로 테이블에 1000만 행을 넣은 직후 쿼리가 매우 느려졌다. 가장 먼저 확인할 것은?',
      choices: ['서버를 바꾼다', '통계 정보가 갱신됐는지 확인하고 ANALYZE를 실행한다', '인덱스를 모두 지운다', '테이블 이름을 바꾼다'],
      answer: 1,
      choiceExplanations: [
        '원인 확인 없이 비싼 조치예요.',
        '정답. 옵티마이저가 "작은 테이블"이라고 잘못 알고 나쁜 계획을 골랐을 가능성이 커요.',
        '더 느려져요.',
        '관계없어요.',
      ],
      explanation: 'EXPLAIN ANALYZE의 "예상 rows"와 "실제 rows"가 크게 다르면 통계 문제예요. 대량 변경 후에는 통계 갱신을 작업 절차에 포함하세요.',
    },
    {
      id: 'dbd-11-05', type: 'ox', source: '통계 정보',
      question: '통계 정보를 갱신하면 실행 계획은 항상 더 좋아진다.',
      answer: false,
      explanation: '대부분 좋아지지만, 새 통계로 계획이 바뀌어 특정 쿼리가 오히려 느려지는 경우도 있어요. 그래서 중요한 시스템은 통계 갱신 시점을 통제하거나, 검증된 통계·실행 계획을 고정(plan baseline, 힌트)하기도 해요.',
    },
    {
      id: 'dbd-11-06', type: 'short', source: '통계 정보',
      question: 'MySQL에서 테이블의 통계 정보를 다시 수집하는 명령은? ________ TABLE orders;',
      answer: ['ANALYZE', 'analyze'],
      explanation: 'ANALYZE TABLE orders;예요. PostgreSQL은 ANALYZE orders;(VACUUM ANALYZE로 정리와 함께 하기도 해요). 일반적으로는 자동 수집되지만, 대량 변경 직후에는 수동으로 실행하는 게 안전해요.',
    },
    {
      id: 'dbd-11-07', type: 'mcq', source: '인덱스 이외의 튜닝 방법',
      question: '로그 테이블이 수십억 행이고 "최근 7일" 조회가 대부분이며, 매달 오래된 로그를 지워야 한다. 가장 알맞은 물리 설계는?',
      choices: ['날짜 기준 파티션: 조회는 해당 파티션만 읽고, 오래된 달은 DROP PARTITION으로 즉시 삭제', '인덱스를 모두 지운다', '매일 DELETE ... WHERE created_at < ...로 수억 행 삭제', '모든 로그를 하나의 TEXT 컬럼에 모은다'],
      answer: 0,
      choiceExplanations: [
        '정답. 파티션 프루닝으로 읽는 양이 줄고, 삭제는 메타데이터 작업이라 순식간이에요.',
        '조회가 더 느려져요.',
        '대량 DELETE는 잠금·로그·복제 지연을 크게 일으켜요.',
        '1NF 위반이고 검색이 불가능해져요.',
      ],
      explanation: '파티션은 "데이터를 큰 단위로 나눠 필요한 부분만 다룬다"는 물리 설계 도구예요. 교재 7장의 "테이블 분할" 안티패턴(logs_2026_10 같은 테이블을 직접 여러 개 만들기)과 달리, 파티션은 논리적으로 한 테이블을 유지해요.',
    },
    {
      id: 'dbd-11-08', type: 'mcq', source: '인덱스 이외의 튜닝 방법',
      question: 'API 서버의 DB 연결 수가 폭증해 DB가 버티지 못한다. 커넥션 풀 설정에 대한 올바른 판단은?',
      choices: ['풀 크기를 최대한 크게 늘린다', '서버 수 × 풀 크기가 DB가 감당할 수 있는 동시 연결 수를 넘지 않게 조정하고, 오래 걸리는 쿼리를 줄인다', '풀을 끄고 요청마다 연결한다', 'DB를 재시작하면 해결된다'],
      answer: 1,
      choiceExplanations: [
        'DB가 처리할 수 있는 동시 작업에는 한계가 있어, 연결만 늘리면 경합이 커져 더 느려져요.',
        '정답. 앱 서버를 늘릴 때마다 전체 연결 수를 다시 계산해야 해요.',
        '연결 비용이 매 요청에 붙어 더 나빠져요.',
        '일시적일 뿐이에요.',
      ],
      explanation: '앱 서버 10대 × 풀 20 = 200 연결. 서버리스·오토스케일 환경에서는 이 숫자가 갑자기 커질 수 있어 PgBouncer 같은 외부 커넥션 풀러를 앞에 두기도 해요(Supabase의 pooler).',
    },
    {
      id: 'dbd-11-09', type: 'ox', source: '인덱스 이외의 튜닝 방법',
      question: '설계나 SQL의 비효율은 서버 사양을 올리면 근본적으로 사라진다.',
      answer: false,
      explanation: '하드웨어 증설은 문제를 "가릴" 뿐이에요. N+1 쿼리나 전체 스캔은 데이터가 늘면 다시 드러나고, 그때는 더 비싼 서버가 필요해요. 하드웨어는 설계·SQL 개선 후에 쓰는 마지막 레버예요.',
    },
    {
      id: 'dbd-11-10', type: 'mcq', source: '튜닝 절차',
      question: '튜닝 대상 쿼리를 고를 때 가장 알맞은 기준은?',
      choices: ['실행 빈도 × 소요 시간(총 부하)이 큰 쿼리', '가장 긴 SQL', '한 번 실행 시간이 가장 긴 쿼리만', '가장 최근에 작성한 쿼리'],
      answer: 0,
      choiceExplanations: [
        '정답. 총 부하가 큰 쿼리를 고치면 효과가 가장 커요.',
        '길이와 부하는 무관해요.',
        '하루 한 번 도는 10초짜리 배치보다 초당 수백 번 도는 50ms 쿼리가 전체 부하에 더 클 수 있어요.',
        '관계없어요.',
      ],
      explanation: '도구: MySQL slow query log + pt-query-digest, PostgreSQL pg_stat_statements(쿼리별 호출 수·총 시간), APM(New Relic, Datadog, Sentry Performance). 측정 없이 감으로 튜닝하지 마세요.',
    },
    {
      id: 'dbd-11-11', type: 'mcq', source: '튜닝 절차',
      question: '개발 DB(데이터 100건)에서는 모든 쿼리가 빨랐는데 운영에서 느리다. 테스트 방식의 문제는?',
      choices: ['개발 DB가 너무 빨라서', 'EXPLAIN을 너무 많이 써서', '인덱스가 너무 많아서', '운영과 비슷한 데이터 양·분포로 테스트하지 않아 전체 스캔·N+1 같은 문제가 드러나지 않았다'],
      answer: 3,
      choiceExplanations: [
        '속도 차이의 원인은 데이터 양이에요.',
        'EXPLAIN은 도움이 돼요.',
        '근거가 없어요.',
        '정답. 100건에서는 전체 스캔도 순식간이라 문제가 숨어 있어요.',
      ],
      explanation: '성능 테스트에는 운영 규모의 데이터(익명화한 복제본이나 생성 데이터)가 필요해요. 최소한 EXPLAIN으로 "인덱스를 타는지"는 데이터 양과 상관없이 확인할 수 있어요.',
    },
    {
      id: 'dbd-11-12', type: 'short', source: '인덱스 이외의 튜닝 방법',
      question: '파티션 테이블에서 조건에 맞지 않는 파티션은 아예 읽지 않고 건너뛰는 최적화를 무엇이라 하나요? (파티션 ___)',
      answer: ['프루닝', 'pruning', '파티션프루닝', '파티션 프루닝'],
      explanation: '파티션 프루닝(partition pruning)이에요. WHERE created_at >= \'2026-10-14\'처럼 파티션 키로 조건을 걸어야 작동해요. 파티션 키를 함수로 가공하면 프루닝이 안 될 수 있어요(인덱스와 같은 원리).',
    },
  ],
}

export default topic
