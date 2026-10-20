import type { Topic } from '../../types'

const topic: Topic = {
  id: 'sql-06-transaction',
  track: 'backend',
  group: 'SQL',
  title: '트랜잭션 · ACID · 격리 수준 · 락',
  order: 76,
  sections: [
    {
      title: '트랜잭션과 ACID',
      points: [
        '트랜잭션은 "한 덩어리로 성공하거나 한 덩어리로 실패해야 하는" 작업 묶음이다. START TRANSACTION(BEGIN) → 여러 SQL → COMMIT(확정) 또는 ROLLBACK(취소).',
        'A 원자성(Atomicity): 전부 반영되거나 전혀 반영되지 않는다. 이체 중간에 실패하면 출금도 취소된다.',
        'C 일관성(Consistency): 트랜잭션 전후로 제약 조건(FK, UNIQUE, CHECK)과 규칙이 지켜진다.',
        'I 격리성(Isolation): 동시에 실행되는 트랜잭션이 서로의 중간 상태를 보지 않는(것처럼 보이는) 정도. 격리 수준으로 조절한다.',
        'D 지속성(Durability): COMMIT된 결과는 서버가 바로 꺼져도 사라지지 않는다. DB는 변경을 먼저 로그(WAL, redo log)에 기록해 이를 보장한다.',
      ],
      code: `START TRANSACTION;
UPDATE accounts SET balance = balance - 10000 WHERE id = 1;
UPDATE accounts SET balance = balance + 10000 WHERE id = 2;
COMMIT;      -- 문제가 있으면 ROLLBACK;`,
    },
    {
      title: '동시성 문제',
      points: [
        'Dirty Read: 다른 트랜잭션이 아직 COMMIT하지 않은 값을 읽음. 그 트랜잭션이 롤백하면 존재하지 않았던 값을 본 셈이다.',
        'Non-repeatable Read: 같은 트랜잭션 안에서 같은 행을 두 번 읽었는데 그사이 다른 트랜잭션의 COMMIT으로 값이 바뀜.',
        'Phantom Read: 같은 조건으로 두 번 조회했는데 그사이 다른 트랜잭션이 행을 추가·삭제해 결과 행 수가 달라짐.',
        'Lost Update(갱신 손실): 두 트랜잭션이 같은 값을 읽고 각자 계산해 쓰면 하나의 변경이 덮여 사라짐. 재고·조회수·잔액에서 흔하다.',
      ],
    },
    {
      title: '격리 수준',
      points: [
        'READ UNCOMMITTED: Dirty Read까지 허용. 거의 쓰지 않는다.',
        'READ COMMITTED: COMMIT된 값만 읽는다. 매 SELECT마다 최신 커밋 기준. PostgreSQL·Oracle의 기본값.',
        'REPEATABLE READ: 트랜잭션 시작 시점(첫 읽기)의 스냅숏을 계속 본다. 같은 행을 다시 읽어도 같은 값. MySQL InnoDB의 기본값(InnoDB는 일반 SELECT의 팬텀도 스냅숏으로 막는다).',
        'SERIALIZABLE: 트랜잭션들이 하나씩 차례로 실행된 것과 같은 결과를 보장. 가장 안전하지만 대기·충돌로 처리량이 줄고 재시도가 필요할 수 있다.',
        '중요: 격리 수준이 높아도 "읽고-계산-쓰기" 갱신 손실이 자동으로 막히는 것은 아니다(DB·수준마다 다름). 원자적 UPDATE(SET x = x - 1)나 명시적 잠금을 쓴다.',
        'MVCC(다중 버전 동시성 제어): 행의 여러 버전을 유지해 "읽기는 쓰기를 막지 않고, 쓰기는 읽기를 막지 않게" 한다. MySQL InnoDB와 PostgreSQL이 사용한다.',
      ],
    },
    {
      title: '락(잠금)과 데드락',
      points: [
        'SELECT ... FOR UPDATE: 읽은 행에 쓰기 잠금을 건다. 다른 트랜잭션은 그 행을 수정하거나 FOR UPDATE로 읽으려 하면 COMMIT/ROLLBACK까지 기다린다. "확인 후 수정"을 안전하게 만든다.',
        '비관적 잠금(pessimistic): 충돌이 날 것이라 보고 먼저 잠근다(FOR UPDATE). 낙관적 잠금(optimistic): 잠그지 않고 version 컬럼으로 "내가 읽은 뒤 바뀌었는지" 확인해 바뀌었으면 실패시키고 재시도한다(UPDATE ... SET version = version + 1 WHERE id = ? AND version = ?).',
        '데드락: 트랜잭션 A는 1번 행을 잠그고 2번을 기다리고, B는 2번을 잠그고 1번을 기다리면 영원히 기다린다. DB가 감지해 한쪽을 강제로 롤백시킨다(에러). 대책: 잠그는 순서를 항상 같게(id 오름차순), 트랜잭션을 짧게, 재시도 로직.',
        '트랜잭션은 짧게 유지한다. 트랜잭션 안에서 외부 API 호출이나 사용자 입력 대기를 하면 잠금이 오래 잡혀 다른 요청이 줄줄이 막힌다.',
      ],
      code: `START TRANSACTION;
SELECT stock FROM products WHERE id = 3 FOR UPDATE;   -- 잠금
-- (앱) stock >= 1 인지 확인
UPDATE products SET stock = stock - 1 WHERE id = 3;
INSERT INTO orders (...) VALUES (...);
COMMIT;                                               -- 잠금 해제`,
    },
  ],
  questions: [
    {
      id: 'sql-06-01', type: 'mcq', source: '트랜잭션과 ACID',
      question: '이체 중 출금 UPDATE 직후 서버가 죽었다. 재시작 후 출금이 반영되지 않은 상태로 돌아가 있었다. 어떤 성질 덕분인가?',
      choices: ['원자성(Atomicity)', '일관성(Consistency)', '격리성(Isolation)', '지속성(Durability)'],
      answer: 0,
      choiceExplanations: [
        '정답. COMMIT되지 않은 트랜잭션의 일부 변경은 모두 취소돼요.',
        '제약 조건 유지와 관련 있지만, "전부 아니면 전무"는 원자성이에요.',
        '동시 실행 간 간섭 문제예요.',
        '지속성은 COMMIT된 변경이 사라지지 않는 성질이에요. 여기서는 COMMIT 전이었어요.',
      ],
      explanation: 'A: 전부 or 전무 / C: 규칙 유지 / I: 동시 실행 간섭 차단 / D: 커밋하면 영구.\n원자성과 지속성은 짝이에요. 커밋 전 변경은 사라지고(A), 커밋 후 변경은 남아요(D).',
    },
    {
      id: 'sql-06-02', type: 'short', source: '트랜잭션과 ACID',
      question: '트랜잭션 안의 변경을 모두 취소하는 SQL 명령은?',
      answer: ['ROLLBACK', 'rollback'],
      explanation: 'ROLLBACK이에요. 일부만 되돌리려면 SAVEPOINT 이름 → ROLLBACK TO SAVEPOINT 이름(SQLAlchemy의 begin_nested).\n세션 도구에서 실수로 UPDATE를 했다면, autocommit이 꺼진 상태에서 START TRANSACTION으로 시작했어야 ROLLBACK이 가능해요. 그래서 운영 DB 작업은 항상 트랜잭션을 먼저 열어요.',
    },
    {
      id: 'sql-06-03', type: 'mcq', source: '동시성 문제',
      question: '트랜잭션 A가 잔액을 100으로 읽은 뒤, B가 잔액을 50으로 바꾸고 COMMIT했다. A가 다시 읽으니 50이었다. 이 현상은?',
      choices: ['Dirty Read', 'Phantom Read', 'Non-repeatable Read', 'Deadlock'],
      answer: 2,
      choiceExplanations: [
        'B가 커밋한 뒤 읽었으니 Dirty Read가 아니에요.',
        '팬텀은 행의 "개수"가 달라지는 현상이에요.',
        '정답. 같은 행을 다시 읽었는데 값이 달라졌어요. REPEATABLE READ 이상에서 막혀요.',
        '서로 기다리는 상황이 아니에요.',
      ],
      explanation: '세 가지 읽기 이상 현상:\n• Dirty: 커밋 안 된 값을 봄\n• Non-repeatable: 같은 행의 값이 바뀜\n• Phantom: 같은 조건의 행 집합이 바뀜(추가/삭제)\n격리 수준이 올라갈수록 하나씩 막혀요.',
    },
    {
      id: 'sql-06-04', type: 'mcq', source: '동시성 문제',
      question: '두 관리자가 동시에 같은 상품의 재고(10)를 읽고, 각자 3개와 2개를 출고해 7과 8로 저장했다. 최종 재고가 5가 아니라 8이 됐다. 이 문제는?',
      choices: ['Phantom Read', 'Dirty Read', '원자성 위반', 'Lost Update(갱신 손실)'],
      answer: 3,
      choiceExplanations: [
        '행 개수 변화가 아니에요.',
        '둘 다 커밋된 값을 읽었어요.',
        '각 트랜잭션은 원자적으로 끝났어요. 문제는 동시 실행이에요.',
        '정답. 나중에 쓴 값이 먼저 쓴 변경을 덮어 하나가 사라졌어요.',
      ],
      explanation: '해결: ① UPDATE SET stock = stock - 3 (DB가 현재 값 기준으로 계산) ② SELECT ... FOR UPDATE로 먼저 잠그고 읽기 ③ version 컬럼으로 낙관적 잠금. 앱에서 "읽은 값으로 계산해 덮어쓰기"는 동시성에서 항상 의심하세요.',
    },
    {
      id: 'sql-06-05', type: 'mcq', source: '격리 수준',
      question: 'MySQL InnoDB와 PostgreSQL의 기본 격리 수준을 바르게 짝지은 것은?',
      choices: ['둘 다 SERIALIZABLE', 'MySQL: REPEATABLE READ / PostgreSQL: READ COMMITTED', 'MySQL: READ COMMITTED / PostgreSQL: REPEATABLE READ', '둘 다 READ UNCOMMITTED'],
      answer: 1,
      choiceExplanations: [
        '가장 엄격한 수준은 기본값이 아니에요(성능 비용이 커요).',
        '정답. 같은 코드라도 DB에 따라 동시성 동작이 달라질 수 있어요.',
        '반대예요.',
        'Dirty Read를 허용하는 수준은 기본값으로 쓰지 않아요.',
      ],
      explanation: 'MySQL에서 개발하다 PostgreSQL로 옮기면(또는 반대) "같은 트랜잭션에서 다시 읽은 값"이 달라질 수 있어요. 동시성이 중요한 로직은 격리 수준에 기대기보다 원자적 UPDATE나 명시적 잠금으로 의도를 드러내는 게 이식성이 좋아요.',
    },
    {
      id: 'sql-06-06', type: 'short', source: '격리 수준',
      question: '트랜잭션들이 하나씩 순서대로 실행된 것과 같은 결과를 보장하는 가장 엄격한 격리 수준의 이름은?',
      answer: ['SERIALIZABLE', 'serializable'],
      explanation: 'SERIALIZABLE이에요. 이상 현상을 모두 막지만, 잠금 대기나 직렬화 실패 에러가 늘어서 재시도 로직이 필요해요. 꼭 필요한 트랜잭션에만 SET TRANSACTION ISOLATION LEVEL SERIALIZABLE로 높여 쓰는 방식이 흔해요.',
    },
    {
      id: 'sql-06-07', type: 'ox', source: '격리 수준',
      question: 'MVCC를 쓰는 DB(InnoDB, PostgreSQL)에서는 일반 SELECT가 다른 트랜잭션의 UPDATE 때문에 기다리지 않고, 스냅숏의 이전 버전을 읽을 수 있다.',
      answer: true,
      explanation: '맞아요. MVCC는 행의 여러 버전을 보관해서 "읽기와 쓰기가 서로를 막지 않게" 해요. 그래서 일반 조회는 빠르고 동시성이 높아요.\n대신 "최신 값을 읽고 그걸 기준으로 수정"해야 할 때는 SELECT ... FOR UPDATE로 잠금 읽기를 해야 해요(일반 SELECT는 스냅숏을 볼 수 있으니까요).',
    },
    {
      id: 'sql-06-08', type: 'mcq', source: '락(잠금)과 데드락',
      question: 'SELECT ... FOR UPDATE의 효과는?',
      choices: ['조회 결과를 캐시한다', '행을 자동으로 수정한다', '인덱스를 만든다', '읽은 행에 잠금을 걸어, 트랜잭션이 끝날 때까지 다른 트랜잭션이 그 행을 수정하거나 잠금 읽기를 하지 못하게 한다'],
      answer: 3,
      choiceExplanations: [
        '캐시와 무관해요.',
        '수정은 이후 UPDATE로 해요.',
        '인덱스와 무관해요(다만 인덱스가 없으면 더 많은 행이 잠길 수 있어요).',
        '정답. "확인 후 수정" 사이에 다른 트랜잭션이 끼어들지 못하게 해요.',
      ],
      explanation: 'FOR UPDATE는 반드시 트랜잭션 안에서 써야 의미가 있어요(autocommit이면 문장이 끝나자마자 잠금이 풀려요). SQLAlchemy: select(...).with_for_update().\n잠근 상태로 오래 머물지 말고, 필요한 작업만 하고 바로 COMMIT하세요.',
    },
    {
      id: 'sql-06-09', type: 'mcq', source: '락(잠금)과 데드락',
      question: '트랜잭션 A는 계좌1 → 계좌2 순서로, B는 계좌2 → 계좌1 순서로 FOR UPDATE를 걸다 서로를 기다리며 멈췄다. 가장 근본적인 예방법은?',
      choices: ['항상 같은 순서(예: id 오름차순)로 잠근다', '격리 수준을 READ UNCOMMITTED로 낮춘다', '트랜잭션을 쓰지 않는다', '인덱스를 모두 지운다'],
      answer: 0,
      choiceExplanations: [
        '정답. 모두 같은 순서로 잠그면 순환 대기가 생기지 않아요.',
        '쓰기 잠금 충돌은 그대로예요. 오히려 더 위험해져요.',
        '이체의 원자성을 잃어요.',
        '오히려 더 많은 행이 잠겨 충돌이 늘어요.',
      ],
      explanation: '데드락 대책 3종: ① 잠금 순서 통일 ② 트랜잭션 짧게 ③ 데드락 에러(MySQL 1213) 발생 시 재시도. DB는 데드락을 감지하면 한쪽을 희생시켜 롤백하니, 앱은 그 에러를 잡아 다시 시도하면 돼요.',
    },
    {
      id: 'sql-06-10', type: 'mcq', source: '락(잠금)과 데드락',
      question: '게시글 수정에서 "내가 편집하는 동안 다른 사람이 먼저 저장했다면 덮어쓰지 말고 알려 주기"를 구현하려 한다. 가장 알맞은 방법은?',
      choices: ['편집 화면을 여는 동안 FOR UPDATE로 몇 분간 잠근다', '마지막에 저장한 사람이 이기도록 둔다', 'version 컬럼으로 낙관적 잠금: UPDATE ... WHERE id = ? AND version = 읽은값, 영향 행 0이면 충돌 안내', '격리 수준을 SERIALIZABLE로 올린다'],
      answer: 2,
      choiceExplanations: [
        '사용자가 화면을 열어 둔 채 자리를 비우면 잠금이 계속 잡혀 다른 요청이 막혀요.',
        '요구사항(덮어쓰지 않기)을 만족하지 못해요.',
        '정답. 잠금 없이, 저장 시점에 "내가 읽은 버전이 여전히 최신인지"를 확인해요.',
        '요청들이 각각 다른 트랜잭션이라 사람의 편집 시간 동안의 충돌을 막지 못해요.',
      ],
      explanation: '사람이 개입하는 긴 작업은 낙관적 잠금, 짧은 시스템 작업(재고 차감)은 비관적 잠금(FOR UPDATE)이나 원자적 UPDATE가 어울려요. HTTP에서는 ETag/If-Match 헤더와 412 응답으로 같은 개념을 표현하기도 해요.',
    },
    {
      id: 'sql-06-11', type: 'ox', source: '락(잠금)과 데드락',
      question: '트랜잭션 안에서 외부 결제 API를 호출하며 몇 초씩 기다리는 것은 잠금을 오래 잡아 다른 요청을 막을 수 있으므로 피해야 한다.',
      answer: true,
      explanation: '맞아요. 외부 호출은 트랜잭션 밖에서 하고, DB 트랜잭션은 짧게 유지해요. 예: ① 주문을 "결제 대기"로 저장·커밋 ② 결제 API 호출 ③ 결과에 따라 짧은 트랜잭션으로 상태 갱신. 실패 시를 위한 보상 처리(취소)도 설계해요.',
    },
    {
      id: 'sql-06-12', type: 'short', source: '트랜잭션과 ACID',
      question: 'ACID에서 "COMMIT된 결과는 장애가 나도 사라지지 않는다"는 성질의 이름은? (영어 또는 한글)',
      answer: ['Durability', 'durability', '지속성', 'D'],
      explanation: '지속성(Durability)이에요. DB는 변경을 데이터 파일보다 먼저 로그(WAL/redo log)에 기록하고 디스크에 동기화한 뒤 COMMIT을 성공으로 알려요. 장애 후에는 로그로 복구해요. 커밋이 비싼 이유이자, 대량 입력 시 커밋 횟수를 줄여야 하는 이유예요.',
    },
  ],
}

export default topic
